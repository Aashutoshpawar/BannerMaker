import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  PanResponder,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet as RNStyleSheet,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ColorPicker from "react-native-wheel-color-picker";

const fontMap = {
  System: { regular: "System", bold: "System" },
  Serif: { regular: "serif", bold: "serif" },
  "Sans-Serif": { regular: "sans-serif", bold: "sans-serif" },
  Monospace: { regular: "monospace", bold: "monospace" },
  Cursive: { regular: "cursive", bold: "cursive" },
  Fantasy: { regular: "fantasy", bold: "fantasy" },
  "Times New Roman": { regular: "Times New Roman", bold: "Times New Roman" },
  Arial: { regular: "Arial", bold: "Arial Bold" },
  Helvetica: { regular: "Helvetica", bold: "Helvetica Bold" },
};

const TextEditor = ({
  modalVisible = false,
  setModalVisible = () => {},
  textInputValue = "",
  setTextInputValue = () => {},
  editingIndex = null,
  setEditingIndex = () => {},
  texts = [],
  setTexts = () => {},
  displayWidth = 100,
  displayHeight = 100,
  pushToHistory = () => {},
  activeFont = "System",
  setActiveFont = () => {},
}) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSheetVisible, setFontSheetVisible] = useState(false);
  const [colorSheetVisible, setColorSheetVisible] = useState(false);
  const [textColor, setTextColor] = useState("#000");
  const [isEdit, setIsEdit] = useState(false);

  const panY = useState(new Animated.Value(0))[0];

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dy) > 10,
    onPanResponderMove: Animated.event([null, { dy: panY }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        setModalVisible(false);
        panY.setValue(0);
      } else {
        resetPositionAnim.start();
      }
    },
  });

  useEffect(() => {
    if (editingIndex !== null && texts?.[editingIndex]) {
      const textObj = texts[editingIndex];
      setIsBold(textObj.bold || false);
      setIsItalic(textObj.italic || false);
      setIsUnderline(textObj.underline || false);
      setActiveFont(textObj.fontLabel || "System");
      setTextColor(textObj.color || "#000");
      setIsEdit(true);
    } else {
      setIsBold(false);
      setIsItalic(false);
      setIsUnderline(false);
      setTextColor("#000");
      setIsEdit(false);
    }
  }, [editingIndex, texts]);

  const fontStyles = Object.keys(fontMap).map((label) => ({
    label,
    fontFamily: fontMap[label].regular,
  }));

  const getCurrentTextStyle = () => ({
    fontFamily: fontMap[activeFont]?.regular || "System",
    fontSize: 20,
    fontStyle: isItalic ? "italic" : "normal",
    textDecorationLine: isUnderline ? "underline" : "none",
    color: textColor,
    fontWeight: isBold ? "bold" : "normal",
  });

  const applyFontStyle = (fontLabel) => {
    setActiveFont(fontLabel);
    if (editingIndex !== null && texts?.[editingIndex]) {
      setTexts((prev) =>
        prev.map((t, idx) =>
          idx === editingIndex
            ? { ...t, fontLabel, fontFamily: fontMap[fontLabel]?.regular || "System" }
            : t
        )
      );
    }
    setFontSheetVisible(false);
  };

  const applyTextFormatting = (format) => {
    if (editingIndex !== null && texts?.[editingIndex]) {
      setTexts((prev) =>
        prev.map((t, idx) => {
          if (idx === editingIndex) {
            const updated = { ...t };
            if (format.bold !== undefined) updated.bold = format.bold;
            if (format.italic !== undefined) updated.italic = format.italic;
            if (format.underline !== undefined) updated.underline = format.underline;
            return updated;
          }
          return t;
        })
      );
    }
    if (format.bold !== undefined) setIsBold(format.bold);
    if (format.italic !== undefined) setIsItalic(format.italic);
    if (format.underline !== undefined) setIsUnderline(format.underline);
  };

  const changeCase = (type) => {
    if (editingIndex !== null && texts?.[editingIndex]) {
      const updated = texts.map((t, idx) => {
        if (idx === editingIndex) {
          let value = t.value || "";
          if (type === "upper") value = value.toUpperCase();
          else if (type === "lower") value = value.toLowerCase();
          else if (type === "capitalize")
            value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          return { ...t, value };
        }
        return t;
      });
      setTexts(updated);
    }
  };

  const applyColor = (color) => {
    setTextColor(color);
    if (editingIndex !== null && texts?.[editingIndex]) {
      setTexts((prev) =>
        prev.map((t, idx) => (idx === editingIndex ? { ...t, color } : t))
      );
    }
  };

  const submitText = () => {
    pushToHistory?.();
    if (editingIndex !== null && texts?.[editingIndex]) {
      const updated = [...texts];
      updated[editingIndex] = {
        ...updated[editingIndex],
        value: textInputValue ?? "",
        fontFamily: fontMap[activeFont]?.regular || "System",
        fontLabel: activeFont,
        color: textColor,
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
      };
      setTexts(updated);
    } else {
      setTexts((prev) => [
        ...(prev ?? []),
        {
          value: textInputValue ?? "",
          x: displayWidth / 2 - 50,
          y: displayHeight / 2 - 20,
          scale: 1,
          rotation: 0,
          fontFamily: fontMap[activeFont]?.regular || "System",
          fontLabel: activeFont,
          color: textColor,
          bold: isBold,
          italic: isItalic,
          underline: isUnderline,
          fontSize: 26,
          textAlign: "left",
        },
      ]);
    }
    setTextInputValue("");
    setEditingIndex(null);
    setModalVisible(false);
  };

  // ========= Font Sheet Pan =========
  const fontSheetY = useState(new Animated.Value(400))[0];
  const fontSheetPan = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
    onPanResponderMove: Animated.event([null, { dy: fontSheetY }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      if (g.dy > 100) setFontSheetVisible(false);
      Animated.timing(fontSheetY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
  });

  useEffect(() => {
    if (fontSheetVisible) {
      Animated.timing(fontSheetY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fontSheetY, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [fontSheetVisible]);

  // ========= Color Sheet Pan =========
  const colorSheetY = useState(new Animated.Value(400))[0];
  const colorSheetPan = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
    onPanResponderMove: Animated.event([null, { dy: colorSheetY }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      if (g.dy > 100) setColorSheetVisible(false);
      Animated.timing(colorSheetY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
  });

  useEffect(() => {
    if (colorSheetVisible) {
      Animated.timing(colorSheetY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(colorSheetY, {
        toValue: 400,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [colorSheetVisible]);

  return (
    <>
      {/* === Main Bottom Sheet === */}
      {modalVisible && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={RNStyleSheet.absoluteFill}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1, justifyContent: "flex-end" }}
            >
              <Animated.View
                style={[styles.contentContainer, { transform: [{ translateY: panY }] }]}
                {...panResponder.panHandlers}
              >
                {/* Header */}
                <View style={styles.headerContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setEditingIndex(null);
                    }}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Ionicons name="arrow-back" size={24} color="#000" />
                    <Text style={styles.backText}>
                      {isEdit ? "Edit Text" : "Add Text"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Formatting Buttons */}
                <View style={styles.optionRow}>
                  <TouchableOpacity onPress={() => applyTextFormatting({ bold: !isBold })} style={[styles.formatButton, isBold && styles.formatActive]}>
                    <Text style={{ fontWeight: "bold", color: isBold ? "#fff" : "#333" }}>B</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => applyTextFormatting({ italic: !isItalic })} style={[styles.formatButton, isItalic && styles.formatActive]}>
                    <Text style={{ fontStyle: "italic", color: isItalic ? "#fff" : "#333" }}>I</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => applyTextFormatting({ underline: !isUnderline })} style={[styles.formatButton, isUnderline && styles.formatActive]}>
                    <Text style={{ textDecorationLine: "underline", color: isUnderline ? "#fff" : "#333" }}>U</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => changeCase("upper")} style={styles.formatButton}><Text>UP</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => changeCase("lower")} style={styles.formatButton}><Text>low</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => changeCase("capitalize")} style={styles.formatButton}><Text>Cap</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => setFontSheetVisible(true)} style={styles.formatButton}><Text>Font</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => setColorSheetVisible(true)} style={styles.formatButton}>
                    <Text style={{ color: textColor }}>Color</Text>
                  </TouchableOpacity>
                </View>

                {/* Input */}
                <TextInput
                  value={textInputValue}
                  onChangeText={setTextInputValue}
                  placeholder="Type your text..."
                  style={[styles.textInput, getCurrentTextStyle()]}
                  multiline
                />

                {/* Submit */}
                <TouchableOpacity style={[styles.submitButton, { marginTop: 10 }]} onPress={submitText}>
                  <Text style={styles.buttonText}>{isEdit ? "Update" : "Add Text"}</Text>
                </TouchableOpacity>
              </Animated.View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* === Font Bottom Sheet === */}
      {fontSheetVisible && (
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => setFontSheetVisible(false)}>
            <View style={RNStyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[styles.subModalContainer, { transform: [{ translateY: fontSheetY }] }]}
            {...fontSheetPan.panHandlers}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Select Font</Text>
            <ScrollView>
              {fontStyles.map((fs, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.fontButton, activeFont === fs.label && styles.fontButtonActive]}
                  onPress={() => applyFontStyle(fs.label)}
                >
                  <Text style={[styles.fontText, { fontFamily: fs.fontFamily }]}>{fs.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      )}

      {/* === Color Bottom Sheet === */}
      {colorSheetVisible && (
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => setColorSheetVisible(false)}>
            <View style={RNStyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[styles.subModalContainer, { transform: [{ translateY: colorSheetY }] }]}
            {...colorSheetPan.panHandlers}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Select Color</Text>
            <View style={{ flex: 1, marginTop: 20 }}>
              <ColorPicker
                color={textColor}
                onColorChange={(c) => setTextColor(c)}
                onColorChangeComplete={(c) => applyColor(c)}
                thumbSize={30}
                sliderHidden={false}
                style={{ flex: 1 }}
              />
            </View>
          </Animated.View>
        </View>
      )}
    </>
  );
};

export default TextEditor;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "60%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  headerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backText: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  optionRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  formatButton: { padding: 10, backgroundColor: "#eaeaea", borderRadius: 8, minWidth: 50, alignItems: "center", margin: 4 },
  formatActive: { backgroundColor: "#4a6cf7" },
  textInput: { backgroundColor: "#fff", padding: 12, borderRadius: 8, fontSize: 16, minHeight: 50 },
  submitButton: { backgroundColor: "#007AFF", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  fontButton: { padding: 10, backgroundColor: "#4a6cf7", borderRadius: 8, marginBottom: 8 },
  fontButtonActive: { backgroundColor: "#2c4fd8" },
  fontText: { color: "#fff" },
  overlay: {
    ...RNStyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    zIndex: 10000,
  },
  subModalContainer: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    maxHeight: "60%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
