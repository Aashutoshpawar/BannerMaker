// LayerManager.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  SafeAreaView,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import AntDesign from "react-native-vector-icons/AntDesign";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const LayerManager = ({
  visible,
  setVisible,
  stickers = [],
  texts = [],
  setStickers,
  setTexts,
}) => {
  const [layers, setLayers] = useState([]);

  // Combine layers when modal opens or when canvas changes
  useEffect(() => {
    if (!visible) return;

    const combined = [
      ...texts.map((item, index) => ({
        id: `text-${index}`,
        type: "text",
        label: item?.value || "Text Layer",
        originalIndex: index, // Keep track of original index
        thumbnail: null,
      })),
      ...stickers.map((item, index) => ({
        id: `sticker-${index}`,
        type: "sticker",
        label: "Sticker",
        originalIndex: index, // Keep track of original index
        thumbnail: item?.uri || null,
      })),
    ];

    setLayers(combined.reverse()); // top-most layer first
  }, [visible, stickers, texts]);

  // Reorder function
  const handleReorder = (newData) => {
    setLayers(newData);

    // Build new text and sticker arrays based on reordered data
    const reorderedTexts = [...texts];
    const reorderedStickers = [...stickers];

    newData.forEach((layer, newIndex) => {
      const { type, originalIndex } = layer;
      if (type === "text") {
        reorderedTexts[newIndex] = texts[originalIndex];
      } else if (type === "sticker") {
        reorderedStickers[newIndex - texts.length] = stickers[originalIndex];
      }
    });

    setTexts(reorderedTexts);
    setStickers(reorderedStickers);
  };

  const renderItem = ({ item, drag, isActive }) => (
    <TouchableOpacity
      onLongPress={drag}
      activeOpacity={0.8}
      style={[styles.layerItem, { backgroundColor: isActive ? "#f0f0f0" : "#fff" }]}
    >
      <View style={styles.layerInfo}>
        {item.thumbnail ? (
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <AntDesign
            name={item.type === "text" ? "text1" : "picture"}
            size={22}
            color="#333"
            style={{ marginRight: 10 }}
          />
        )}
        <Text numberOfLines={1} style={styles.layerLabel}>
          {item.label}
        </Text>
      </View>
      <AntDesign name="bars" size={18} color="#888" />
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <SafeAreaView style={styles.panel}>
            <View style={styles.header}>
              <Text style={styles.title}>Layer Management</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <AntDesign name="closecircle" size={22} color="#000" />
              </TouchableOpacity>
            </View>

            {layers.length > 0 ? (
              <DraggableFlatList
                data={layers}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                onDragEnd={({ data }) => handleReorder(data)}
                activationDistance={5} // better gesture detection
              />
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No layers found</Text>
              </View>
            )}
          </SafeAreaView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default LayerManager;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  panel: {
    backgroundColor: "#fff",
    height: "65%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    zIndex: 9999,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  layerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  layerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
  },
  layerLabel: {
    fontSize: 14,
    color: "#000",
    flexShrink: 1,
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#777",
    fontSize: 16,
  },
});
