// Canvas.js
import React, { useState, useRef, useMemo } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialDesignIcons from "react-native-vector-icons/MaterialCommunityIcons";

import TextEditor from "./Functions/TextEditor";
import StickerManager from "./Functions/StickerManager";
import ImageUploader from "./Functions/ImageUploader";
import BackgroundSelector from "./Functions/BackgroundSelector";

const Canvas = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { image, canvas } = route.params || {};

  const [activeFont, setActiveFont] = useState("System");
  const [stickers, setStickers] = useState([]);
  const [texts, setTexts] = useState([]);
  const [background, setBackground] = useState(image || null);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [savedState, setSavedState] = useState(null);

  // Text editing
  const [textInputValue, setTextInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [textEditorVisible, setTextEditorVisible] = useState(false);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "40%"], []);

  // ---------- Undo / Redo / Save ----------
  const pushToHistory = () => {
    setHistory((prev) => [
      ...prev,
      { stickers: [...stickers], texts: [...texts], background },
    ]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setRedoStack((prev) => [
      ...prev,
      { stickers: [...stickers], texts: [...texts], background },
    ]);
    setStickers(last.stickers);
    setTexts(last.texts);
    setBackground(last.background);
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((prev) => [
      ...prev,
      { stickers: [...stickers], texts: [...texts], background },
    ]);
    setStickers(next.stickers);
    setTexts(next.texts);
    setBackground(next.background);
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
  };

  const save = () => {
    setSavedState({ stickers: [...stickers], texts: [...texts], background });
    Alert.alert("Saved", "Your canvas has been saved!");
  };

  const discard = () => {
    if (savedState) {
      setStickers(savedState.stickers);
      setTexts(savedState.texts);
      setBackground(savedState.background);
      Alert.alert("Discarded", "Reverted to last saved state.");
    } else {
      Alert.alert("Nothing to discard", "No saved state found.");
    }
  };

  // ---------- Canvas Size ----------
  if (!canvas || !canvas.size) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No canvas size found!</Text>
      </View>
    );
  }

  const [canvasWidth, canvasHeight] = canvas.size
    .split("x")
    .map((s) => parseInt(s.trim(), 10));

  const screenWidth = Dimensions.get("window").width - 40;
  const screenHeight = Dimensions.get("window").height - 40;
  const scale = Math.min(screenWidth / canvasWidth, screenHeight / canvasHeight);

  const displayWidth = Math.round(canvasWidth * scale);
  const displayHeight = Math.round(canvasHeight * scale);

  const canvasTopMargin = 20;

  // ---------- Position Updaters ----------
  const updateTextPosition = (index, x, y, scale, rotation) => {
    if (index === null || index >= texts.length) return;
    setTexts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], x, y, scale, rotation };
      return updated;
    });
  };

  const updateStickerPosition = (index, x, y, scale, rotation) => {
    if (index === null || index >= stickers.length) return;
    setStickers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], x, y, scale, rotation };
      return updated;
    });
  };

  // ---------- Draggable Text ----------
  const DraggableText = ({ item, index }) => {
    const [selected, setSelected] = useState(false);

    // Auto-select if being edited
    React.useEffect(() => {
      if (editingIndex === index) setSelected(true);
    }, [editingIndex]);

    const translateX = useSharedValue(item.x ?? 50);
    const translateY = useSharedValue(item.y ?? 50);
    const scaleValue = useSharedValue(item.scale ?? 1);
    const rotationValue = useSharedValue(item.rotation ?? 0);

    // Main drag gesture
    const drag = Gesture.Pan()
      .onChange((e) => {
        translateX.value += e.changeX;
        translateY.value += e.changeY;
      })
      .onEnd(() => {
        runOnJS(updateTextPosition)(
          index,
          translateX.value,
          translateY.value,
          scaleValue.value,
          rotationValue.value
        );
      });

    // Rotate handle gesture
    const rotateGesture = Gesture.Pan()
      .onChange((e) => {
        rotationValue.value += e.changeX * 0.01;
      })
      .onEnd(() => {
        runOnJS(updateTextPosition)(
          index,
          translateX.value,
          translateY.value,
          scaleValue.value,
          rotationValue.value
        );
      });

    // Scale handle gesture
    const scaleGesture = Gesture.Pan()
      .onChange((e) => {
        scaleValue.value += e.changeX * 0.005;
        if (scaleValue.value < 0.2) scaleValue.value = 0.2;
      })
      .onEnd(() => {
        runOnJS(updateTextPosition)(
          index,
          translateX.value,
          translateY.value,
          scaleValue.value,
          rotationValue.value
        );
      });

    const animatedStyle = useAnimatedStyle(() => ({
      position: "absolute",
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scaleValue.value },
        { rotateZ: `${rotationValue.value}rad` },
      ],
    }));

    return (
      <GestureDetector gesture={drag}>
        <Animated.View style={[animatedStyle]}>
          <TouchableOpacity
            activeOpacity={1}

            onPress={() => {
              setSelected(true)
              setEditingIndex(index);
              setTextInputValue(item.value);
              setTextEditorVisible(true);
            }}
          >
            <View
              style={[
                selected && {
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: "black",
                  padding: 8,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: item.fontSize || 26,
                  fontFamily: item.fontFamily || "System",
                  color: item.color || "#fff",
                  fontWeight: item.bold ? "bold" : "normal",
                  fontStyle: item.italic ? "italic" : "normal",
                  textDecorationLine: item.underline ? "underline" : "none",
                  textAlign: item.align || "left",
                }}
              >
                {item.value}
              </Text>
            </View>
          </TouchableOpacity>

          {selected && (
            <>
              {/* Delete */}

              <TouchableOpacity
                onPress={() => {
                  requestAnimationFrame(() => {
                    setTexts((prev) => prev.filter((_, i) => i !== index));
                  });
                }}
                style={[styles.handle, { top: -16, left: -16 }]}
              >
                <AntDesign name="delete" size={16} color="white" />
              </TouchableOpacity>



              {/* Rotate */}
              <GestureDetector gesture={rotateGesture}>
                <Animated.View style={[styles.handle, { bottom: -16, left: -16 }]}>
                  <MaterialDesignIcons name="rotate-3d" size={16} color="white" />
                </Animated.View>
              </GestureDetector>

              {/* Scale */}
              <GestureDetector gesture={scaleGesture}>
                <Animated.View style={[styles.handle, { bottom: -16, right: -16 }]}>
                  <MaterialDesignIcons name="arrow-expand" size={16} color="white" />
                </Animated.View>
              </GestureDetector>
            </>
          )}
        </Animated.View>
      </GestureDetector>
    );
  };

  // ---------- Draggable Sticker ----------
  const DraggableSticker = ({ item, index }) => {
    const [selected, setSelected] = useState(false);

    const translateX = useSharedValue(item.x ?? 50);
    const translateY = useSharedValue(item.y ?? 50);
    const scaleValue = useSharedValue(item.scale ?? 1);
    const rotationValue = useSharedValue(item.rotation ?? 0);

    // Main drag
    const drag = Gesture.Pan()
      .onChange((e) => {
        translateX.value += e.changeX;
        translateY.value += e.changeY;
      })
      .onEnd(() => {
        runOnJS(updateStickerPosition)(
          index,
          translateX.value,
          translateY.value,
          scaleValue.value,
          rotationValue.value
        );
      });

    // Rotate handle
    const rotateGesture = Gesture.Pan()
      .onChange((e) => {
        rotationValue.value += e.changeX * 0.01;
      })
      .onEnd(() => {
        runOnJS(updateStickerPosition)(
          index,
          translateX.value,
          translateY.value,
          scaleValue.value,
          rotationValue.value
        );
      });

    // Scale handle
    const scaleGesture = Gesture.Pan()
      .onChange((e) => {
        scaleValue.value += e.changeX * 0.005;
        if (scaleValue.value < 0.2) scaleValue.value = 0.2;
      })
      .onEnd(() => {
        runOnJS(updateStickerPosition)(
          index,
          translateX.value,
          translateY.value,
          scaleValue.value,
          rotationValue.value
        );
      });

    const animatedStyle = useAnimatedStyle(() => ({
      position: "absolute",
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scaleValue.value },
        { rotateZ: `${rotationValue.value}rad` },
      ],
    }));

    return (
      <GestureDetector gesture={drag}>
        <Animated.View style={[animatedStyle]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setSelected(true)}
          >
            <View
              style={[
                selected && {
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: "black",
                  padding: 4,
                },
              ]}
            >
              <Image
                source={{ uri: item.uri }}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>

          {selected && (
            <>
              {/* Delete */}
              <TouchableOpacity
                onPress={() =>
                  setStickers((prev) => prev.filter((_, i) => i !== index))
                }
                style={[styles.handle, { top: -16, left: -16 }]}
              >
                <AntDesign name="delete" size={16} color="white" />
              </TouchableOpacity>

              {/* Rotate */}
              <GestureDetector gesture={rotateGesture}>
                <Animated.View style={[styles.handle, { bottom: -16, left: -16 }]}>
                  <MaterialDesignIcons name="rotate-3d" size={16} color="white" />
                </Animated.View>
              </GestureDetector>

              {/* Scale */}
              <GestureDetector gesture={scaleGesture}>
                <Animated.View style={[styles.handle, { bottom: -16, right: -16 }]}>
                  <MaterialDesignIcons name="arrow-expand" size={16} color="white" />
                </Animated.View>
              </GestureDetector>
            </>
          )}
        </Animated.View>
      </GestureDetector>
    );
  };

  const DraggableTextMemo = React.memo(DraggableText);
  const DraggableStickerMemo = React.memo(DraggableSticker);

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}></Text>
        <View style={styles.topcontrols}>
          <TouchableOpacity style={styles.button} onPress={undo}>
            <EvilIcons name="undo" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={redo}>
            <EvilIcons name="redo" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={save}>
            <AntDesign name="download" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Canvas Area */}
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingTop: canvasTopMargin }]}>
        <View style={[styles.canvasArea, { width: displayWidth, height: displayHeight }]}>
          {/* Background */}
          {background ? (
            background.type === "gradient" ? (
              <LinearGradient
                colors={background.colors}
                style={styles.backgroundImage}
              />
            ) : typeof background === "string" ? (
              <Image
                source={typeof background === "string" ? { uri: background } : background}
                style={styles.backgroundImage}
                resizeMode="cover"
              />
            ) : (
              <Image source={background} style={styles.backgroundImage} resizeMode="cover" />
            )
          ) : (
            <View style={[styles.backgroundImage, { backgroundColor: "#fff" }]} />
          )}

          {stickers.map((item, index) => (
            <DraggableStickerMemo key={`sticker-${index}`} item={item} index={index} />
          ))}

          {texts.map((item, index) => (
            <DraggableTextMemo key={`text-${index}`} item={item} index={index} />
          ))}
        </View>
      </ScrollView>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setEditingIndex(null);
            setTextInputValue("");
            setTextEditorVisible(true);
          }}
        >
          <MaterialDesignIcons name="format-textbox" size={28} color="black" />
          <Text style={styles.buttonText}>Text</Text>
        </TouchableOpacity>

        <StickerManager
          pushToHistory={pushToHistory}
          setStickers={setStickers}
          bottomSheetRef={bottomSheetRef}
          displayWidth={displayWidth}
          displayHeight={displayHeight}
        />

        <ImageUploader
          pushToHistory={pushToHistory}
          setStickers={setStickers}
          displayWidth={displayWidth}
          displayHeight={displayHeight}
        />

        <BackgroundSelector
          pushToHistory={pushToHistory}
          setBackground={setBackground}
        />
      </View>

      {/* Text Editor Modal */}
      <TextEditor
        modalVisible={textEditorVisible}
        setModalVisible={setTextEditorVisible}
        textInputValue={textInputValue}
        setTextInputValue={setTextInputValue}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
        texts={texts}
        setTexts={setTexts}
        displayWidth={displayWidth}
        displayHeight={displayHeight}
        pushToHistory={pushToHistory}
        activeFont={activeFont}
        setActiveFont={setActiveFont}
        pointerEvents="box-none"
      />
    </View>
  );
};

export default Canvas;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    elevation: 4,
  },
  backButton: { padding: 5 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "Hind-Medium",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  canvasArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 8,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#ffffff",
    padding: 10,
    paddingHorizontal: 0,
    borderRadius: 15,
    elevation: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  topcontrols: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  buttonText: {
    marginTop: 4,
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  handle: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
