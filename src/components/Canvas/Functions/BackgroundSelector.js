// components/BackgroundSelector.js
import React, { useState } from "react";
import { View, TouchableOpacity, Text, Modal, StyleSheet, ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";

const gradients = [
  ["#ff9a9e", "#fad0c4"],
  ["#a18cd1", "#fbc2eb"],
  ["#fbc2eb", "#a6c1ee"],
  ["#84fab0", "#8fd3f4"],
  ["#cfd9df", "#e2ebf0"],
  ["#ffecd2", "#fcb69f"],
  ["#f6d365", "#fda085"],
];

const BackgroundSelector = ({ pushToHistory, setBackground }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const applyGradient = (colors) => {
    pushToHistory();
    setBackground({ type: "gradient", colors });
    setModalVisible(false);
  };

  return (
    <View>
      {/* Button to open modal */}
      <TouchableOpacity
        style={{ alignItems: "center" }}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="texture-box" size={26} color="black" />
        <Text style={{ fontSize: 12, color: "#000" }}>Background</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Select Gradient</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            >
              {gradients.map((colors, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.gradientWrapper}
                  onPress={() => applyGradient(colors)}
                >
                  <LinearGradient
                    colors={colors}
                    style={styles.gradientTile}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  gradientWrapper: {
    marginHorizontal: 8,
  },
  gradientTile: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 25,
    backgroundColor: "#000",
    borderRadius: 12,
  },
});

export default BackgroundSelector;
