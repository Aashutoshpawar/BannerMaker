// components/TextEditor.js
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
  const [activeModal, setActiveModal] = useState(null); // 'FontStyle', 'TextFormatting', etc.

  const fontStyles = [
    { label: "sans-serif", fontFamily: "sans-serif" },
    { label: "sans-serif-light", fontFamily: "sans-serif-light" },
    { label: "sans-serif-thin", fontFamily: "sans-serif-thin" },
    { label: "sans-serif-condensed", fontFamily: "sans-serif-condensed" },
    { label: "sans-serif-medium", fontFamily: "sans-serif-medium" },
    { label: "serif-monospace", fontFamily: "serif-monospace" },
    { label: "sans-serif-smallcaps", fontFamily: "sans-serif-smallcaps" },
    { label: "Courier", fontFamily: "Courier" },
    { label: "Cochin", fontFamily: "Cochin" },
    { label: "Optima", fontFamily: "Optima" },
    { label: "Gill Sans", fontFamily: "Gill Sans" },
    { label: "Baskerville", fontFamily: "Baskerville" },
    { label: "Palatino", fontFamily: "Palatino" },
  ];

  const options = [
    { name: "Text Formatting", key: "TextFormatting", icon: "text" },
    { name: "Font Style", key: "FontStyle", icon: "pencil" },
    { name: "Outline & Disallow", key: "Outline", icon: "ban" },
    { name: "Text Size", key: "TextSize", icon: "resize" },
  ];

  const applyFontStyle = (fontFamily) => {
    setActiveFont(fontFamily);
    if (editingIndex !== null && texts?.[editingIndex]) {
      setTexts((prev) =>
        prev.map((t, idx) =>
          idx === editingIndex ? { ...t, fontFamily } : t
        )
      );
    }
    setActiveModal(null);
  };

  const applyTextFormatting = (format) => {
    if (editingIndex !== null && texts?.[editingIndex]) {
      setTexts((prev) =>
        prev.map((t, idx) =>
          idx === editingIndex ? { ...t, ...format } : t
        )
      );
    }
    setActiveModal(null);
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
            style={[styles.textInput, { fontFamily: activeFont ?? "System", fontSize: 20 }]}
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
              <ScrollView style={styles.subContent}>
                {fontStyles.map((fs, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.fontButton,
                      activeFont === fs.fontFamily && styles.fontButtonActive,
                    ]}
                    onPress={() => applyFontStyle(fs.fontFamily)}
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
              <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 20 }}>
                <TouchableOpacity onPress={() => applyTextFormatting({ bold: true })}>
                  <Text style={{ fontWeight: "bold", fontSize: 18 }}>B</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => applyTextFormatting({ italic: true })}>
                  <Text style={{ fontStyle: "italic", fontSize: 18 }}>I</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => applyTextFormatting({ underline: true })}>
                  <Text style={{ textDecorationLine: "underline", fontSize: 18 }}>U</Text>
                </TouchableOpacity>
              </View>
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
                  updated[editingIndex].fontFamily = activeFont ?? "System";
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
                      fontFamily: activeFont ?? "System",
                      color: "#ffffff",
                      bold: false,
                      italic: false,
                      underline: false,
                      fontSize: 26,
                      locked: false,
                    },
                  ]);
                }
                setModalVisible(false);
                setTextInputValue("");
                setEditingIndex(null);
                setActiveFont("System");
                setActiveModal(null);
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
  subModalContainer: { flex: 1, justifyContent: "flex-end", },
  subContent: { backgroundColor: "#f5f5f5", padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "50%" },
  fontButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, backgroundColor: "#4a6cf7", margin: 5 },
  fontButtonActive: { backgroundColor: "#2c4fd8" },
  fontText: { color: "#fff", fontSize: 16 },
});
