// components/StickerManager.js
import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  Modal,
  View,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const { height } = Dimensions.get("window");

// 20 sample stickers
const STICKERS = [
  { id: "1", uri: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
  { id: "2", uri: "https://cdn-icons-png.flaticon.com/512/744/744502.png" },
  { id: "3", uri: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png" },
  { id: "4", uri: "https://cdn-icons-png.flaticon.com/512/5787/5787016.png" },
  { id: "5", uri: "https://cdn-icons-png.flaticon.com/512/616/616490.png" },
  { id: "6", uri: "https://cdn-icons-png.flaticon.com/512/616/616480.png" },
  { id: "7", uri: "https://cdn-icons-png.flaticon.com/512/616/616493.png" },
  { id: "8", uri: "https://cdn-icons-png.flaticon.com/512/616/616494.png" },
  { id: "9", uri: "https://cdn-icons-png.flaticon.com/512/616/616499.png" },
  { id: "10", uri: "https://cdn-icons-png.flaticon.com/512/616/616500.png" },
  { id: "11", uri: "https://cdn-icons-png.flaticon.com/512/616/616501.png" },
  { id: "12", uri: "https://cdn-icons-png.flaticon.com/512/616/616502.png" },
  { id: "13", uri: "https://cdn-icons-png.flaticon.com/512/616/616503.png" },
  { id: "14", uri: "https://cdn-icons-png.flaticon.com/512/616/616504.png" },
  { id: "15", uri: "https://cdn-icons-png.flaticon.com/512/616/616505.png" },
  { id: "16", uri: "https://cdn-icons-png.flaticon.com/512/616/616506.png" },
  { id: "17", uri: "https://cdn-icons-png.flaticon.com/512/616/616507.png" },
  { id: "18", uri: "https://cdn-icons-png.flaticon.com/512/616/616508.png" },
  { id: "19", uri: "https://cdn-icons-png.flaticon.com/512/616/616509.png" },
  { id: "20", uri: "https://cdn-icons-png.flaticon.com/512/616/616510.png" },
    { id: "21", uri: "https://cdn-icons-png.flaticon.com/512/616/616511.png" },
  { id: "22", uri: "https://cdn-icons-png.flaticon.com/512/616/616512.png" },
  { id: "23", uri: "https://cdn-icons-png.flaticon.com/512/616/616513.png" },
  { id: "24", uri: "https://cdn-icons-png.flaticon.com/512/616/616514.png" },
  { id: "25", uri: "https://cdn-icons-png.flaticon.com/512/616/616515.png" },
  { id: "26", uri: "https://cdn-icons-png.flaticon.com/512/616/616516.png" },
  { id: "27", uri: "https://cdn-icons-png.flaticon.com/512/616/616517.png" },
  { id: "28", uri: "https://cdn-icons-png.flaticon.com/512/616/616518.png" },
  { id: "29", uri: "https://cdn-icons-png.flaticon.com/512/616/616519.png" },
  { id: "30", uri: "https://cdn-icons-png.flaticon.com/512/616/616520.png" },
  { id: "31", uri: "https://cdn-icons-png.flaticon.com/512/616/616521.png" },
  { id: "32", uri: "https://cdn-icons-png.flaticon.com/512/616/616522.png" },
  { id: "33", uri: "https://cdn-icons-png.flaticon.com/512/616/616523.png" },
  { id: "34", uri: "https://cdn-icons-png.flaticon.com/512/616/616524.png" },
  { id: "35", uri: "https://cdn-icons-png.flaticon.com/512/616/616525.png" },
  { id: "36", uri: "https://cdn-icons-png.flaticon.com/512/616/616526.png" },
  { id: "37", uri: "https://cdn-icons-png.flaticon.com/512/616/616527.png" },
  { id: "38", uri: "https://cdn-icons-png.flaticon.com/512/616/616528.png" },
  { id: "39", uri: "https://cdn-icons-png.flaticon.com/512/616/616529.png" },
  { id: "40", uri: "https://cdn-icons-png.flaticon.com/512/616/616530.png" },
  { id: "41", uri: "https://cdn-icons-png.flaticon.com/512/616/616531.png" },
  { id: "42", uri: "https://cdn-icons-png.flaticon.com/512/616/616532.png" },
  { id: "43", uri: "https://cdn-icons-png.flaticon.com/512/616/616533.png" },
  { id: "44", uri: "https://cdn-icons-png.flaticon.com/512/616/616534.png" },
  { id: "45", uri: "https://cdn-icons-png.flaticon.com/512/616/616535.png" },
  { id: "46", uri: "https://cdn-icons-png.flaticon.com/512/616/616536.png" },
  { id: "47", uri: "https://cdn-icons-png.flaticon.com/512/616/616537.png" },
  { id: "48", uri: "https://cdn-icons-png.flaticon.com/512/616/616538.png" },
  { id: "49", uri: "https://cdn-icons-png.flaticon.com/512/616/616539.png" },
  { id: "50", uri: "https://cdn-icons-png.flaticon.com/512/616/616540.png" },
  { id: "51", uri: "https://cdn-icons-png.flaticon.com/512/616/616541.png" },
  { id: "52", uri: "https://cdn-icons-png.flaticon.com/512/616/616542.png" },
  { id: "53", uri: "https://cdn-icons-png.flaticon.com/512/616/616543.png" },
  { id: "54", uri: "https://cdn-icons-png.flaticon.com/512/616/616544.png" },
  { id: "55", uri: "https://cdn-icons-png.flaticon.com/512/616/616545.png" },
  { id: "56", uri: "https://cdn-icons-png.flaticon.com/512/616/616546.png" },
  { id: "57", uri: "https://cdn-icons-png.flaticon.com/512/616/616547.png" },
  { id: "58", uri: "https://cdn-icons-png.flaticon.com/512/616/616548.png" },
  { id: "59", uri: "https://cdn-icons-png.flaticon.com/512/616/616549.png" },
  { id: "60", uri: "https://cdn-icons-png.flaticon.com/512/616/616550.png" },
];


const StickerManager = ({
  pushToHistory,
  setStickers,
  displayWidth,
  displayHeight,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectSticker = (uri) => {
    pushToHistory();
    setStickers((prev) => [
      ...prev,
      {
        uri,
        x: displayWidth / 2 - 40,
        y: displayHeight / 2 - 40,
        scale: 1,
        rotation: 0,
      },
    ]);
    setModalVisible(false);
  };

  return (
    <>
      {/* Button to open modal */}
      <TouchableOpacity
        style={{ alignItems: "center" }}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="sticker-emoji" size={28} color="black" />
        <Text style={{ fontSize: 12, color: "#000" }}>Sticker</Text>
      </TouchableOpacity>

      {/* Sticker Picker Modal (50% height bottom sheet) */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        {/* Dark background overlay */}
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        />

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Select Stickers</Text>
            <View style={{ width: 24 }} /> {/* placeholder for spacing */}
          </View>

          {/* Sticker Grid */}
          <FlatList
            data={STICKERS}
            numColumns={4} // 4 stickers per row
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.stickerTile}
                onPress={() => handleSelectSticker(item.uri)}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={styles.stickerImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
bottomSheet: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: height,
  backgroundColor: "#ffffff",
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  padding: 10,
},

  header: {
    flexDirection: "row",
    alignItems: "start",
    marginBottom: 10,
    paddingHorizontal: 10,
    marginTop: 100,
  },
  headerTitle: {
    flex: 1,
    // textAlign: "center",
    paddingHorizontal: 15,
    fontSize: 18,
    // fontWeight: "bold",
  },
  list: {
    justifyContent: "center",
  },
  stickerTile: {
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  stickerImage: {
    width: 70,
    height: 70,
  },
});

export default StickerManager;
