import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Map fonts to their regular and bold variants
const fontMap = {
  "Amita": { regular: "Amita-Regular", bold: "Amita-Bold" },
  "Fredoka": { regular: "Fredoka-Regular", bold: "Fredoka-Bold" },
  "Fredoka SemiExpanded": { regular: "Fredoka_SemiExpanded-Regular", bold: "Fredoka_Condensed-Bold" },
  "Hind": { regular: "Hind-Regular", bold: "Hind-Bold" },
  "Lobster Two": { regular: "LobsterTwo-Regular", bold: "LobsterTwo-Bold" },
  "Mukta": { regular: "Mukta-Regular", bold: "Mukta-Bold" },
  "Mukta Malar": { regular: "MuktaMalar-Regular", bold: "MuktaMalar-Bold" },
  "Poppins": { regular: "Poppins-Regular", bold: "Poppins-Bold" },
  "PT Serif": { regular: "PTSerif-Regular", bold: "PTSerif-Bold" },
  "Rajdhani": { regular: "Rajdhani-Regular", bold: "Rajdhani-Bold" },
  // Add more fonts if needed
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
  const [activeModal, setActiveModal] = useState(null);
  const [isBold, setIsBold] = useState(false);

  const fontStyles = [
    { label: "System", fontFamily: "System" },
    ...Object.keys(fontMap).map((label) => ({
      label,
      fontFamily: fontMap[label].regular,
    })),
  ];

  const options = [
    { name: "Text Formatting", key: "TextFormatting", icon: "create-outline" },
    { name: "Font Style", key: "FontStyle", icon: "pencil" },
    { name: "Outline & Disallow", key: "Outline", icon: "ban" },
    { name: "Text Size", key: "TextSize", icon: "resize" },
  ];

  // Apply selected font style
  const applyFontStyle = (fontLabel) => {
    setActiveFont(fontLabel);

    if (editingIndex !== null && texts?.[editingIndex]) {
      setTexts((prev) =>
        prev.map((t, idx) => {
          if (idx === editingIndex) {
            const updated = { ...t, fontLabel };
            const mapped = fontMap[fontLabel] || { regular: fontLabel, bold: fontLabel };
            updated.fontFamily = updated.bold ? mapped.bold : mapped.regular;
            updated.fontWeight = fontLabel === "System" ? (updated.bold ? "bold" : "normal") : "400";
            return updated;
          }
          return t;
        })
      );
    }
  };

  // Apply text formatting like bold, italic, underline
  const applyTextFormatting = (format) => {
    if (editingIndex !== null && texts?.[editingIndex]) {
      setTexts((prev) =>
        prev.map((t, idx) => {
          if (idx === editingIndex) {
            const updated = { ...t };

            // Bold
            if (format.bold !== undefined) {
              updated.bold = format.bold;
              const fontLabel = updated.fontLabel || "System";
              if (fontMap[fontLabel]) {
                const mapped = fontMap[fontLabel];
                updated.fontFamily = updated.bold ? mapped.bold : mapped.regular;
                updated.fontWeight = "400"; // custom fonts ignore fontWeight
              } else {
                // System font
                updated.fontFamily = "System";
                updated.fontWeight = updated.bold ? "bold" : "normal";
              }
            }

            // Italic
            if (format.italic !== undefined) {
              updated.italic = format.italic;
              updated.fontStyle = format.italic ? "italic" : "normal";
            }

            // Underline
            if (format.underline !== undefined) {
              updated.underline = format.underline;
              updated.textDecorationLine = format.underline ? "underline" : "none";
            }

            return updated;
          }
          return t;
        })
      );
    }
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}
      >
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
              <Text style={styles.backText}>
                {editingIndex !== null ? "Edit Text" : "Add Text"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Text Input */}
          <TextInput
            value={textInputValue ?? ""}
            onChangeText={(text) => setTextInputValue(text ?? "")}
            style={[
              styles.textInput,
              {
                fontFamily:
                  texts?.[editingIndex]?.fontFamily ||
                  fontMap[activeFont]?.regular ||
                  "System",
                fontSize: texts?.[editingIndex]?.fontSize || 20,
                fontStyle: texts?.[editingIndex]?.italic ? "italic" : "normal",
                textDecorationLine: texts?.[editingIndex]?.underline
                  ? "underline"
                  : "none",
                color: texts?.[editingIndex]?.color || "#000",
                fontWeight: texts?.[editingIndex]?.fontWeight,
              },
            ]}
            placeholder="Type something..."
          />

          {/* Option Buttons */}
          {editingIndex !== null && texts?.[editingIndex] && (
            <View style={styles.iconOptionsContainer}>
              {options.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.iconButton}
                  onPress={() => setActiveModal(opt.key)}
                >
                  <Ionicons name={opt.icon} size={28} color="#333" />
                  <Text style={styles.iconLabel}>{opt.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Font Style Modal */}
          <Modal
            visible={activeModal === "FontStyle"}
            transparent
            animationType="slide"
            onRequestClose={() => setActiveModal(null)}
          >
            <View style={styles.subModalContainer}>
              <View style={styles.subHeader}>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                  onPress={() => setActiveModal(null)}
                >
                  <Ionicons name="arrow-back" size={22} color="#000" />
                  <Text style={styles.subHeaderText}>Choose Font Style</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.subContent}>
                {fontStyles.map((fs, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.fontButton,
                      activeFont === fs.label && styles.fontButtonActive,
                    ]}
                    onPress={() => applyFontStyle(fs.label)}
                  >
                    <Text style={[styles.fontText, { fontFamily: fs.fontFamily }]}>
                      {fs.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Modal>

          {/* Text Formatting Modal */}
          <Modal
            visible={activeModal === "TextFormatting"}
            transparent
            animationType="slide"
            onRequestClose={() => setActiveModal(null)}
          >
            <View style={styles.subModalContainer}>
              <ScrollView style={styles.subContent}>
                <Text style={styles.sectionTitle}>Styling</Text>
                <View style={styles.optionRow}>
                  {/* Bold */}
                  <TouchableOpacity
                    onPress={() => {
                      if (editingIndex !== null && texts?.[editingIndex]) {
                        const currentBold = texts[editingIndex].bold || false;
                        applyTextFormatting({ bold: !currentBold });
                        setIsBold(!currentBold); // Update local state
                      }
                    }}
                    style={[
                      styles.formatButton,
                      texts?.[editingIndex]?.bold && { backgroundColor: "#4a6cf7" },
                    ]}
                  >
                    <Ionicons
                      name="text"
                      size={22}
                      color={texts?.[editingIndex]?.bold ? "#fff" : "#333"}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: texts?.[editingIndex]?.bold ? "#fff" : "#333" },
                      ]}
                    >
                      Bold
                    </Text>
                  </TouchableOpacity>

                  {/* Italic */}
                  <TouchableOpacity
                    onPress={() => {
                      const isItalic = texts?.[editingIndex]?.italic || false;
                      applyTextFormatting({ italic: !isItalic });
                    }}
                    style={[
                      styles.formatButton,
                      texts?.[editingIndex]?.italic && { backgroundColor: "#4a6cf7" },
                    ]}
                  >
                    <Ionicons
                      name="italic"
                      size={22}
                      color={texts?.[editingIndex]?.italic ? "#fff" : "#333"}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: texts?.[editingIndex]?.italic ? "#fff" : "#333" },
                      ]}
                    >
                      Italic
                    </Text>
                  </TouchableOpacity>

                  {/* Underline */}
                  <TouchableOpacity
                    onPress={() => {
                      const isUnderline = texts?.[editingIndex]?.underline || false;
                      applyTextFormatting({ underline: !isUnderline });
                    }}
                    style={[
                      styles.formatButton,
                      texts?.[editingIndex]?.underline && { backgroundColor: "#4a6cf7" },
                    ]}
                  >
                    <Ionicons
                      name="remove-outline"
                      size={22}
                      color={texts?.[editingIndex]?.underline ? "#fff" : "#333"}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: texts?.[editingIndex]?.underline ? "#fff" : "#333" },
                      ]}
                    >
                      Underline
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Modal>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={() => {
                pushToHistory?.();
                if (editingIndex !== null && texts?.[editingIndex]) {
                  const updated = [...texts];
                  updated[editingIndex].value = textInputValue ?? "";
                  updated[editingIndex].fontFamily = texts[editingIndex].bold
                    ? fontMap[activeFont]?.bold || "System"
                    : fontMap[activeFont]?.regular || "System";
                  setTexts?.(updated);
                } else {
                  setTexts?.((prev) => [
                    ...(prev ?? []),
                    {
                      value: textInputValue ?? "",
                      x: displayWidth / 2 - 50,
                      y: displayHeight / 2 - 20,
                      scale: 1,
                      rotation: 0,
                      fontFamily: isBold
                        ? fontMap[activeFont]?.bold || "System"
                        : fontMap[activeFont]?.regular || "System",
                      fontLabel: activeFont,
                      color: "#ffffff",
                      bold: isBold,
                      italic: false,
                      underline: false,
                      fontSize: 26,
                      textAlign: "left",
                      locked: false,
                      fontStyle: "normal",
                      textDecorationLine: "none",
                    },
                  ]);
                }
                setModalVisible(false);
                setTextInputValue("");
                setEditingIndex(null);
                setActiveFont("System");
                setActiveModal(null);
                setIsBold(false);
              }}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default TextEditor;

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "flex-end" },
  contentContainer: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
    elevation: 10,
  },
  headerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  backText: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  textInput: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  iconOptionsContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15 },
  iconButton: { justifyContent: "center", alignItems: "center" },
  iconLabel: { fontSize: 12, color: "#333", marginTop: 4 },
  footer: { flexDirection: "row", justifyContent: "flex-end", paddingTop: 10 },
  modalButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, minWidth: 100, alignItems: "center" },
  submitButton: { backgroundColor: "#007AFF" },
  buttonText: { fontWeight: "600", color: "#fff" },
  subModalContainer: { flex: 1, justifyContent: "flex-end" },
  subHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#f5f5f5", borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  subHeaderText: { fontSize: 16, fontWeight: "bold", marginLeft: 10 },
  subContent: { backgroundColor: "#f5f5f5", padding: 20, maxHeight: "40%" },
  fontButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, backgroundColor: "#4a6cf7", margin: 5 },
  fontButtonActive: { backgroundColor: "#2c4fd8" },
  fontText: { color: "#fff", fontSize: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#555" },
  optionRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  formatButton: { alignItems: "center", justifyContent: "center", padding: 10, borderRadius: 8, backgroundColor: "#eaeaea", minWidth: 70 },
  optionLabel: { fontSize: 12, marginTop: 4, color: "#333" },
});
