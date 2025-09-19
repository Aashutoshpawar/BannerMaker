import React, { useMemo, useRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import EvilIcons from "react-native-vector-icons/EvilIcons";

const canvasSizes = [
  { id: "1", label: "Square", size: "2000 x 2000", icon: "square-full", color: "#4b5563" },
  { id: "2", label: "Poster", size: "612 x 792", icon: "file-alt", color: "#f59e0b" },
  { id: "3", label: "Instagram", size: "1080 x 1080", icon: "instagram", color: "#E1306C" },
  { id: "4", label: "Facebook Cover", size: "1352 x 500", icon: "facebook", color: "#1877F2" },
  { id: "5", label: "A4", size: "2480 x 3508", icon: "file-pdf", color: "#FF0000" },
  { id: "6", label: "Insta Poster", size: "1080 x 1920", icon: "image", color: "#10b981" },
  { id: "7", label: "YouTube Thumb", size: "1280 x 720", icon: "youtube", color: "#FF0000" },
];

const Create = ({ navigation }) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderItem = ({ item }) => {
    const [w, h] = item.size.split("x").map((s) => parseInt(s.trim(), 10));
    const maxDim = 100;
    const scale = w > h ? maxDim / w : maxDim / h;
    const previewWidth = Math.round(w * scale);
    const previewHeight = Math.round(h * scale);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Crop", { canvas: item })}
      >
        <View
          style={[
            styles.previewBox,
            { width: previewWidth, height: previewHeight },
          ]}
        >
          <FontAwesome5 name={item.icon} size={22} color={item.color} />
        </View>
        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.size}>{item.size}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎨 Create New Poster</Text>

      <TouchableOpacity style={styles.openButton} onPress={handleOpen}>
        <Text style={styles.openText}>Choose Canvas Size</Text>
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
      >
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <EvilIcons name="close-o" size={32} color="#666" />
          </TouchableOpacity>

          <Text style={styles.sheetTitle}>Select a Canvas</Text>
          <BottomSheetFlatList
            data={canvasSizes}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111",
  },
  openButton: {
    backgroundColor: "#3c91ec",
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  openText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 14,
    color: "#333",
    marginLeft: 4,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 6,
    marginBottom: 6,
  },
  listContainer: {
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 200,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  previewBox: {
    backgroundColor: "#eef6ff",
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#111",
  },
  size: {
    fontSize: 12,
    color: "#6b7280",
  },
});
