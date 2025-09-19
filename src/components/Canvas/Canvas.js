import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { launchImageLibrary } from "react-native-image-picker";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Evilcons from "react-native-vector-icons/EvilIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const Canvas = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { image, canvas } = route.params || {};

  const [stickers, setStickers] = useState([]);
  const [texts, setTexts] = useState([]);
  const [background, setBackground] = useState(image || null);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [savedState, setSavedState] = useState(null);

  // Text editing
  const [textInputValue, setTextInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // Back confirmation modal
  const [backModalVisible, setBackModalVisible] = useState(false);

  // BottomSheet ref
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "40%"], []);

  const pushToHistory = () => {
    setHistory((prev) => [...prev, { stickers, texts, background }]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setRedoStack((prev) => [...prev, { stickers, texts, background }]);
    setStickers(last.stickers);
    setTexts(last.texts);
    setBackground(last.background);
    setHistory(history.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((prev) => [...prev, { stickers, texts, background }]);
    setStickers(next.stickers);
    setTexts(next.texts);
    setBackground(next.background);
    setRedoStack(redoStack.slice(0, -1));
  };

  const save = () => {
    setSavedState({ stickers, texts, background });
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

  const pickBackground = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (!res.didCancel && res.assets?.length > 0) {
        const uri = res.assets[0].uri;
        if (uri) {
          pushToHistory();
          setBackground(uri.toString());
        }
      }
    });
  };

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

  // --- Position Updaters ---
  const updateTextPosition = (index, x, y, scale, rotation) => {
    setTexts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], x, y, scale, rotation };
      return updated;
    });
  };

  const updateStickerPosition = (index, x, y, scale, rotation) => {
    setStickers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], x, y, scale, rotation };
      return updated;
    });
  };

  // --- Draggable Text ---
  const DraggableText = ({ item, index }) => {
    const translateX = useSharedValue(item.x);
    const translateY = useSharedValue(item.y);
    const scale = useSharedValue(item.scale);
    const rotation = useSharedValue(item.rotation);

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
          scale.value,
          rotation.value
        );
      });

    const pinch = Gesture.Pinch()
      .onChange((e) => {
        scale.value *= e.scaleChange;
      })
      .onEnd(() => {
        runOnJS(updateTextPosition)(
          index,
          translateX.value,
          translateY.value,
          scale.value,
          rotation.value
        );
      });

    const rotate = Gesture.Rotation()
      .onChange((e) => {
        rotation.value += e.rotationChange;
      })
      .onEnd(() => {
        runOnJS(updateTextPosition)(
          index,
          translateX.value,
          translateY.value,
          scale.value,
          rotation.value
        );
      });

    const gesture = Gesture.Simultaneous(drag, pinch, rotate);

    const animatedStyle = useAnimatedStyle(() => ({
      position: "absolute",
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotation.value}rad` },
      ],
    }));

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[animatedStyle]}>
          <TouchableOpacity
            onPress={() => {
              setEditingIndex(index);
              setTextInputValue(item.value);
              bottomSheetRef.current?.expand(); // Open bottom sheet
            }}
          >
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "#fff",
                textShadowColor: "#000",
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 2,
              }}
            >
              {item.value}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    );
  };

  // --- Draggable Sticker ---
  const DraggableSticker = ({ item, index }) => {
    const translateX = useSharedValue(item.x);
    const translateY = useSharedValue(item.y);
    const scale = useSharedValue(item.scale);
    const rotation = useSharedValue(item.rotation);

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
          scale.value,
          rotation.value
        );
      });

    const pinch = Gesture.Pinch()
      .onChange((e) => {
        scale.value *= e.scaleChange;
      })
      .onEnd(() => {
        runOnJS(updateStickerPosition)(
          index,
          translateX.value,
          translateY.value,
          scale.value,
          rotation.value
        );
      });

    const rotate = Gesture.Rotation()
      .onChange((e) => {
        rotation.value += e.rotationChange;
      })
      .onEnd(() => {
        runOnJS(updateStickerPosition)(
          index,
          translateX.value,
          translateY.value,
          scale.value,
          rotation.value
        );
      });

    const gesture = Gesture.Simultaneous(drag, pinch, rotate);

    const animatedStyle = useAnimatedStyle(() => ({
      position: "absolute",
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotateZ: `${rotation.value}rad` },
      ],
    }));

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={animatedStyle}>
          <Image
            source={{ uri: item.uri }}
            style={{ width: 80, height: 80 }}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* --- Header --- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setBackModalVisible(true)
            navigation.goBack()
          }

          }
          style={styles.backButton}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Canvas Editor</Text>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={undo}>
            <Evilcons name="undo" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={redo}>
            <Evilcons name="redo" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={save}>
            <AntDesign name="download" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View
          style={[
            styles.canvasArea,
            { width: displayWidth, height: displayHeight },
          ]}
        >
          {background ? (
            <Image
              source={
                typeof background === "string" ? { uri: background } : background
              }
              style={styles.backgroundImage}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[styles.backgroundImage, { backgroundColor: "#fff" }]}
            />
          )}

          {/* Stickers */}
          {stickers.map((item, index) => (
            <DraggableSticker key={`sticker-${index}`} item={item} index={index} />
          ))}

          {/* Texts */}
          {texts.map((item, index) => (
            <DraggableText key={`text-${index}`} item={item} index={index} />
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
            bottomSheetRef.current?.expand(); // open bottom sheet
          }}
        >
          <Text>Add Text</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            pushToHistory();
            bottomSheetRef.current?.expand();
            setStickers((prev) => [
              ...prev,
              {
                uri: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
                x: displayWidth / 2 - 40,
                y: displayHeight / 2 - 40,
                scale: 1,
                rotation: 0,
              },
            ]);
          }}
        >
          <Text>Add Sticker</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={pickBackground}>
          <Text>Change BG</Text>
        </TouchableOpacity>
      </View>

      {/* --- Text Input Bottom Sheet --- */}
      <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints}>
        <BottomSheetView style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Enter Text</Text>
          <TextInput
            value={textInputValue}
            onChangeText={setTextInputValue}
            style={styles.textInput}
            placeholder="Type something..."
          />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                bottomSheetRef.current?.close();
                setTextInputValue("");
                setEditingIndex(null);
              }}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                pushToHistory();
                if (editingIndex !== null) {
                  const updated = [...texts];
                  updated[editingIndex].value = textInputValue;
                  setTexts(updated);
                } else {
                  setTexts((prev) => [
                    ...prev,
                    {
                      value: textInputValue,
                      x: displayWidth / 2 - 50,
                      y: displayHeight / 2 - 20,
                      scale: 1,
                      rotation: 0,
                    },
                  ]);
                }
                bottomSheetRef.current?.close();
                setTextInputValue("");
                setEditingIndex(null);
              }}
            >
              <Text>Submit</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Canvas;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: { padding: 5 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  canvasArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  button: {
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  modalButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
    marginHorizontal: 5,
  },
});
