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
import ViewShot from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { PermissionsAndroid, Platform } from "react-native";
import TextEditor from "./Functions/TextEditor";
import StickerManager from "./Functions/StickerManager";
import ImageUploader from "./Functions/ImageUploader";
import BackgroundSelector from "./Functions/BackgroundSelector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createProject, updateProject } from "../../store/services/creationServices/CreationServices";
import LayerManager from "./Functions/LayerManager";

const Canvas = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const viewShotRef = useRef();


  const {
    image,
    canvas,
    stickers: draftStickers,
    texts: draftTexts,
    background: draftBackground,
  } = route.params || {};

  // ✅ If a full draft object is passed (with stickers & texts), apply it
  React.useEffect(() => {
    if (route.params?.draft) {
      const { stickers = [], texts = [], background = null, canvas: draftCanvas, _id } = route.params.draft;
      setStickers(stickers);
      setTexts(texts);
      setBackground(background);
      if (draftCanvas) route.params.canvas = draftCanvas;
      if (_id) setProjectId(_id); // <-- track the project ID
      setIsDraft(true); // mark as draft
    }
  }, [route.params?.draft]);



  // const { image, canvas } = route.params || {};
  const [userId, setUserId] = useState(null);

  const [activeFont, setActiveFont] = useState("System");
  const [stickers, setStickers] = useState(draftStickers || []);
  const [texts, setTexts] = useState(draftTexts || []);
  const [background, setBackground] = useState(draftBackground || image || null);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [savedState, setSavedState] = useState(null);

  // Text editing
  const [textInputValue, setTextInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [textEditorVisible, setTextEditorVisible] = useState(false);

  const [selectedStickerIndex, setSelectedStickerIndex] = useState(null);

  const [isDraft, setIsDraft] = useState(false);
  const [projectId, setProjectId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [layerVisible, setLayerVisible] = useState(false);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "40%"], []);

  // ✅ Apply draft data if exists
  React.useEffect(() => {
    if (draftStickers?.length) setStickers(draftStickers);
    if (draftTexts?.length) setTexts(draftTexts);
    if (draftBackground) setBackground(draftBackground);
  }, [draftStickers, draftTexts, draftBackground]);

  // ✅ Fetch userId
  React.useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const moveLayerUp = (type, index) => {
    if (type === "sticker") {
      setStickers((prev) => {
        if (index <= 0) return prev; // Can't move up if already at top
        const newStickers = [...prev];
        [newStickers[index], newStickers[index - 1]] = [newStickers[index - 1], newStickers[index]];
        return newStickers;
      });
    } else if (type === "text") {
      setTexts((prev) => {
        if (index <= 0) return prev; // Can't move up if already at top
        const newTexts = [...prev];
        [newTexts[index], newTexts[index - 1]] = [newTexts[index - 1], newTexts[index]];
        return newTexts;
      });
    }
  };

  const moveLayerDown = (type, index) => {
    if (type === "sticker") {
      setStickers((prev) => {
        if (index >= prev.length - 1) return prev; // Can't move down if already at bottom
        const newStickers = [...prev];
        [newStickers[index], newStickers[index + 1]] = [newStickers[index + 1], newStickers[index]];
        return newStickers;
      });
    } else if (type === "text") {
      setTexts((prev) => {
        if (index >= prev.length - 1) return prev; // Can't move down if already at bottom
        const newTexts = [...prev];
        [newTexts[index], newTexts[index + 1]] = [newTexts[index + 1], newTexts[index]];
        return newTexts;
      });
    }
  };



  const getCanvasLayersData = () => {
    const canvasData = {
      userId: userId, // replace with actual user id
      isDraft: true,
      canvas: {
        width: canvasWidth,
        height: canvasHeight,
      },
      texts: texts.map((t, idx) => ({
        id: t.id || `text${idx + 1}`,
        value: t.value,
        fontFamily: t.fontFamily || "System",
        size: t.fontSize || 24,
        color: t.color || "#000000",
        opacity: t.opacity ?? 1,
        bold: t.bold || false,
        italic: t.italic || false,
        underline: t.underline || false,
        format: t.format || "none",
        align: t.align || "left",
        rotation: t.rotation ?? 0,
        scale: t.scale ?? 1,
        x: t.x ?? 0,
        y: t.y ?? 0,
      })),
      stickers: stickers.map((s, idx) => ({
        id: s.id || `sticker${idx + 1}`,
        uri: s.uri,
        opacity: s.opacity ?? 1,
        hue: s.hue ?? 0,
        rotation: s.rotation ?? 0,
        scale: s.scale ?? 1,
        x: s.x ?? 0,
        y: s.y ?? 0,
      })),
      images: [], // Add your uploaded images array if any
      background: background
        ? background.type === "gradient"
          ? {
            isGradient: true,
            gradientColors: background.colors || ["#fff", "#000"],
            image: null,
          }
          : {
            isGradient: false,
            gradientColors: [],
            image: typeof background === "string" ? background : null,
          }
        : null,
    };

    return canvasData;
  };

  const requestStoragePermission = async () => {
    if (Platform.OS !== "android") return true;

    try {
      if (Platform.Version >= 33) {
        // Android 13+
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // Android 12 and below
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn("Permission error:", err);
      return false;
    }
  };


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

  // ---------- Save Canvas ----------
  const saveToGallery = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert("Permission Denied", "Cannot save without storage permission");
        return;
      }

      const uri = await viewShotRef.current.capture({
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      await CameraRoll.save(uri, { type: "photo" });

      const payload = getCanvasLayersData();
      console.log("Payload to send:", payload);

      // Ask for confirmation — simple callback, no async here
      Alert.alert(
        "Confirmation",
        "Are you sure you want to save the Template?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes",
            onPress: () => handleSaveProject(payload), // move async logic outside
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error("Error saving canvas:", error);
      Alert.alert("Error", "Failed to save canvas.");
    }
  };

  // Separate function to handle async work safely
  const handleSaveProject = async (payload) => {
    try {
      setLoading(true);

      if (isDraft && projectId) {
        console.log("Updating project:", projectId);
        await updateProject(projectId, payload);
        console.log("Project updated successfully");
      } else {
        console.log("Creating new project with payload:", payload);
        const data = await createProject(payload);
        console.log("Project created successfully:", data);
        if (data?._id) setProjectId(data._id);
      }

      navigation.navigate("MainPage");
    } catch (error) {
      console.error("Error saving project:", error);
      Alert.alert("Error", "Failed to save project.");
    } finally {
      setLoading(false);
    }
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

  // ---------- Canvas Size (safe + numeric support) ----------
  let canvasWidth = 1080;
  let canvasHeight = 1920;

  // ✅ Handle both numeric and string canvas sizes
  if (canvas) {
    if (canvas.width && canvas.height) {
      // Direct numeric size (from API)
      canvasWidth = canvas.width;
      canvasHeight = canvas.height;
    } else if (canvas.size) {
      // Legacy string format ("2000 x 2000")
      const [w, h] = canvas.size.split("x").map((s) => parseInt(s.trim(), 10));
      if (!isNaN(w) && !isNaN(h)) {
        canvasWidth = w;
        canvasHeight = h;
      } else {
        console.warn("⚠️ Invalid canvas size string, using default 1080x1920");
      }
    } else {
      console.warn("⚠️ Canvas size missing, using default 1080x1920");
    }
  }

  // ✅ Scale canvas to fit the screen
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

    // Shared values must be declared first
    const translateX = useSharedValue(item.x ?? 50);
    const translateY = useSharedValue(item.y ?? 50);
    const scaleValue = useSharedValue(item.scale ?? 1);
    const rotationValue = useSharedValue(item.rotation ?? 0);

    // Sync shared values whenever item changes (important for layer reorder)
    React.useEffect(() => {
      translateX.value = item.x ?? 50;
      translateY.value = item.y ?? 50;
      scaleValue.value = item.scale ?? 1;
      rotationValue.value = item.rotation ?? 0;
    }, [item]);

    // Auto-select if being edited
    React.useEffect(() => {
      if (editingIndex === index) setSelected(true);
    }, [editingIndex]);

    // Drag gesture
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

    // Rotate gesture
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

    // Scale gesture
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
      zIndex: selected ? 999 : (item.zIndex || index), // Use actual zIndex
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
              setSelected(true);
              setEditingIndex(index);
              setTextInputValue(item.value);
              setTextEditorVisible(true);
            }}
          >
            <View style={selected && { borderWidth: 1, borderStyle: "dashed", borderColor: "black", padding: 8 }}>
              <Text
                style={{
                  fontSize: item.fontSize || 26,
                  fontFamily: item.fontFamily || "System",
                  color: item.color || "#fff",
                  fontWeight: item.bold ? "bold" : "normal",
                  fontStyle: item.italic ? "italic" : "normal",
                  textDecorationLine: item.underline ? "underline" : "none",
                  textAlign: item.align || "left",
                  opacity: item.opacity ?? 1,
                }}
              >
                {item.value}
              </Text>
            </View>
          </TouchableOpacity>

          {selected && (
            <>
              <GestureDetector gesture={rotateGesture}>
                <Animated.View style={[styles.handle, { bottom: -16, left: -16, zIndex: 9999 }]}>
                  <MaterialDesignIcons name="rotate-3d" size={16} color="white" />
                </Animated.View>
              </GestureDetector>
              <GestureDetector gesture={scaleGesture}>
                <Animated.View style={[styles.handle, { bottom: -16, right: -16, zIndex: 9999 }]}>
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
  // Update the DraggableSticker component in Canvas.js with this enhanced version

  const DraggableSticker = ({ item, index }) => {
    const [selected, setSelected] = useState(false);

    // Shared values
    const translateX = useSharedValue(item.x ?? 50);
    const translateY = useSharedValue(item.y ?? 50);
    const scaleValue = useSharedValue(item.scale ?? 1);
    const rotationValue = useSharedValue(item.rotation ?? 0);

    // Sync shared values with state
    React.useEffect(() => {
      translateX.value = item.x ?? 50;
      translateY.value = item.y ?? 50;
      scaleValue.value = item.scale ?? 1;
      rotationValue.value = item.rotation ?? 0;
    }, [item]);

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
      zIndex: selected ? 999 : (item.zIndex || index), // Use actual zIndex
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scaleValue.value },
        { rotateZ: `${rotationValue.value}rad` },
      ],
    }));

    const opacity = item.opacity ?? 1;
    const hue = item.hue ?? 0;

    return (
      <GestureDetector gesture={drag}>
        <Animated.View style={[animatedStyle]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setSelected(true);
              runOnJS(setSelectedStickerIndex)(index);
            }}
          >
            <View style={selected && { borderWidth: 1, borderStyle: "dashed", borderColor: "#000", padding: 4 }}>
              <Image
                source={{ uri: item.uri }}
                style={{
                  width: 80,
                  height: 80,
                  opacity: opacity,
                  tintColor: hue !== 0 ? `hsl(${hue}, 100%, 50%)` : undefined,
                }}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>

          {selected && (
            <>
              <TouchableOpacity
                onPress={() => {
                  runOnJS(setSelectedStickerIndex)(null);
                  setStickers((prev) => prev.filter((_, i) => i !== index));
                }}
                style={[styles.handle, { top: -16, left: -16, backgroundColor: "#000" }]}
              >
                <AntDesign name="delete" size={16} color="white" />
              </TouchableOpacity>

              <GestureDetector gesture={rotateGesture}>
                <Animated.View style={[styles.handle, { bottom: -16, left: -16, backgroundColor: "#000" }]}>
                  <MaterialDesignIcons name="rotate-3d-variant" size={16} color="white" />
                </Animated.View>
              </GestureDetector>

              <GestureDetector gesture={scaleGesture}>
                <Animated.View style={[styles.handle, { bottom: -16, right: -16, backgroundColor: "#000" }]}>
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => setLayerVisible(true)}
          >
            <MaterialDesignIcons name="layers-outline" size={28} color="black" />
            {/* <Text style={styles.buttonText}>Layers</Text> */}
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={undo}>
            <EvilIcons name="undo" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={redo}>
            <EvilIcons name="redo" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={saveToGallery}>
            <AntDesign name="download" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Canvas Area */}
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { paddingTop: canvasTopMargin }]}
      >
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 1 }}
          style={{ width: displayWidth, height: displayHeight }}
        >
          <View
            style={{
              width: displayWidth,
              height: displayHeight,
              backgroundColor: "transparent", // transparent background
              overflow: "hidden",
              borderRadius: 8,
            }}
          >
           // In Canvas.js - Update the rendering section
            <View
              style={{
                width: displayWidth,
                height: displayHeight,
                backgroundColor: "transparent",
                overflow: "hidden",
                borderRadius: 8,
              }}
            >
              {/* Background */}
              {background ? (
                background.type === "gradient" ? (
                  <LinearGradient colors={background.colors} style={styles.backgroundImage} />
                ) : typeof background === "string" ? (
                  <Image source={{ uri: background }} style={styles.backgroundImage} resizeMode="cover" />
                ) : (
                  <Image source={background} style={styles.backgroundImage} resizeMode="cover" />
                )
              ) : null}

              {/* Render all layers in correct z-order */}
              {/* Items with lower z-index render first (behind) */}
              {[...stickers, ...texts]
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .map((item, index) => {
                  if (item.type === "sticker" || item.uri) {
                    return (
                      <DraggableStickerMemo
                        key={`sticker-${index}`}
                        item={item}
                        index={stickers.indexOf(item)}
                      />
                    );
                  } else {
                    return (
                      <DraggableTextMemo
                        key={`text-${index}`}
                        item={item}
                        index={texts.indexOf(item)}
                      />
                    );
                  }
                })}
            </View>
          </View>
        </ViewShot>
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
          stickers={stickers}
          selectedStickerIndex={selectedStickerIndex}
          setSelectedStickerIndex={setSelectedStickerIndex}
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
      <LayerManager
        visible={layerVisible}
        setVisible={setLayerVisible}
        stickers={stickers}
        texts={texts}
        setStickers={setStickers}
        setTexts={setTexts}
        moveLayerUp={moveLayerUp}
        moveLayerDown={moveLayerDown}
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
