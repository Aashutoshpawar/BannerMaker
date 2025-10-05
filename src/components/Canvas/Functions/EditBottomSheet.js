// components/EditBottomSheet.js
import React from "react";
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";

const huePresets = [0, 45, 90, 180, 270]; // degrees

const EditBottomSheet = ({
  visible,
  onClose,
  item,
  onChangeOpacity,
  onChangeHue,
}) => {
  if (!item) return null;

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.overlay} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>Edit Item</Text>

          {/* Opacity */}
          <Text style={styles.label}>Opacity</Text>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            value={item.opacity ?? 1}
            onValueChange={onChangeOpacity}
            minimumTrackTintColor="#6200ee"
          />

          {/* Hue */}
          <Text style={styles.label}>Hue</Text>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={360}
            step={1}
            value={item.hue ?? 0}
            onValueChange={onChangeHue}
            minimumTrackTintColor="#6200ee"
          />

          {/* Hue Presets */}
          <View style={styles.presets}>
            {huePresets.map((deg) => (
              <TouchableOpacity
                key={deg}
                onPress={() => onChangeHue(deg)}
                style={[styles.preset, { backgroundColor: `hsl(${deg}, 100%, 50%)` }]}
              >
                <Text style={styles.presetText}>{deg}°</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  label: { fontSize: 14, fontWeight: "500", marginTop: 10 },
  presets: { flexDirection: "row", marginTop: 10 },
  preset: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  presetText: { color: "#fff", fontSize: 12 },
});

export default EditBottomSheet;
