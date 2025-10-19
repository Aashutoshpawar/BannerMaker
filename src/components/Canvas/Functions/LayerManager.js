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
  moveLayerUp,
  moveLayerDown,
}) => {
  const [layers, setLayers] = useState([]);

  // Simplified layer combination
  useEffect(() => {
    if (!visible) return;

    const combinedLayers = [
      ...stickers.map((sticker, index) => ({
        id: `sticker-${index}`,
        type: "sticker",
        label: "Sticker",
        data: sticker,
        originalIndex: index,
      })),
      ...texts.map((text, index) => ({
        id: `text-${index}`,
        type: "text",
        label: text?.value || `Text ${index + 1}`,
        data: text,
        originalIndex: index,
      })),
    ];

    // Sort by current zIndex (highest = top)
    combinedLayers.sort((a, b) => (b.data.zIndex || 0) - (a.data.zIndex || 0));
    setLayers(combinedLayers);
  }, [visible, stickers, texts]);

  const handleReorder = (newData) => {
    setLayers(newData);

    // Reassign z-indexes based on new order (reversed for rendering)
    const updatedTexts = [];
    const updatedStickers = [];

    [...newData].reverse().forEach((layer, newIndex) => {
      const updatedData = { ...layer.data, zIndex: newIndex };

      if (layer.type === "text") {
        updatedTexts.push(updatedData);
      } else if (layer.type === "sticker") {
        updatedStickers.push(updatedData);
      }
    });

    setTexts(updatedTexts);
    setStickers(updatedStickers);
  };

  // Fixed move layer functions
  const handleMoveUp = (layerType, originalIndex) => {
    moveLayerUp(layerType, originalIndex);
    
    // Update local state to reflect changes immediately
    setTimeout(() => {
      const currentIndex = layers.findIndex(
        layer => layer.type === layerType && layer.originalIndex === originalIndex
      );
      
      if (currentIndex > 0) {
        const newLayers = [...layers];
        [newLayers[currentIndex], newLayers[currentIndex - 1]] = 
        [newLayers[currentIndex - 1], newLayers[currentIndex]];
        setLayers(newLayers);
      }
    }, 100);
  };

  const handleMoveDown = (layerType, originalIndex) => {
    moveLayerDown(layerType, originalIndex);
    
    // Update local state to reflect changes immediately
    setTimeout(() => {
      const currentIndex = layers.findIndex(
        layer => layer.type === layerType && layer.originalIndex === originalIndex
      );
      
      if (currentIndex < layers.length - 1) {
        const newLayers = [...layers];
        [newLayers[currentIndex], newLayers[currentIndex + 1]] = 
        [newLayers[currentIndex + 1], newLayers[currentIndex]];
        setLayers(newLayers);
      }
    }, 100);
  };

  const renderItem = ({ item, drag, isActive }) => {
    const currentPosition = layers.findIndex(l => l.id === item.id) + 1;
    const totalLayers = layers.length;

    return (
      <TouchableOpacity
        onLongPress={drag}
        activeOpacity={0.8}
        style={[styles.layerItem, { backgroundColor: isActive ? "#f0f0f0" : "#fff" }]}
      >
        <View style={styles.layerInfo}>
          {item.type === "sticker" && item.data?.uri ? (
            <Image source={{ uri: item.data.uri }} style={styles.thumbnail} resizeMode="cover" />
          ) : (
            <View style={[styles.textThumbnail, { backgroundColor: '#e3f2fd' }]}>
              <AntDesign name="text1" size={20} color="#333" />
            </View>
          )}
          <View style={styles.layerDetails}>
            <Text numberOfLines={1} style={styles.layerLabel}>
              {item.label}
            </Text>
            <Text style={styles.layerType}>
              {item.type} • {currentPosition} of {totalLayers}
            </Text>
          </View>
        </View>

        <View style={styles.layerControls}>
          <TouchableOpacity
            onPress={() => handleMoveDown(item.type, item.originalIndex)}
            style={styles.controlButton}
            disabled={currentPosition === totalLayers}
          >
            <AntDesign
              name="down"
              size={16}
              color={currentPosition === totalLayers ? "#ccc" : "#333"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleMoveUp(item.type, item.originalIndex)}
            style={styles.controlButton}
            disabled={currentPosition === 1}
          >
            <AntDesign
              name="up"
              size={16}
              color={currentPosition === 1 ? "#ccc" : "#333"}
            />
          </TouchableOpacity>

          <TouchableOpacity onLongPress={drag} style={styles.dragHandle}>
            <AntDesign name="bars" size={18} color="#888" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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

            <View style={styles.layerCount}>
              <Text style={styles.layerCountText}>
                {layers.length} layer{layers.length !== 1 ? 's' : ''} • Top to bottom order
              </Text>
            </View>

            {layers.length > 0 ? (
              <DraggableFlatList
                data={layers}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                onDragEnd={({ data }) => handleReorder(data)}
                activationDistance={5}
              />
            ) : (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>No layers found</Text>
                <Text style={styles.emptySubtext}>Add text or stickers to see layers</Text>
              </View>
            )}
          </SafeAreaView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

// ... keep your existing styles ...

export default LayerManager;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  panel: {
    backgroundColor: "#fff",
    height: "75%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    zIndex: 9999,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  layerCount: {
    marginBottom: 15,
  },
  layerCountText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  layerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  layerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  layerDetails: {
    flex: 1,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
  },
  textThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  layerLabel: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  layerType: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  layerControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    padding: 6,
    marginHorizontal: 2,
  },
  dragHandle: {
    padding: 6,
    marginLeft: 8,
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#777",
    fontSize: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#999",
    fontSize: 14,
  },
});
