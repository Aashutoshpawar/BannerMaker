import React, { useMemo, useRef, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import EvilIcons from "react-native-vector-icons/EvilIcons";

const canvasSizes = [
  { id: "1", label: "Square", size: "2000 x 2000", icon: "square-full" },
  { id: "2", label: "Poster", size: "612 x 792", icon: "file-alt" },
  { id: "3", label: "Instagram", size: "1080 x 1080", icon: "instagram" },
  { id: "4", label: "Facebook Cover", size: "1352 x 500", icon: "facebook" },
  { id: "5", label: "A4", size: "2000 x 628", icon: "file-pdf" },
  { id: "6", label: "Insta Poster", size: "1080 x 1920", icon: "image" },
  { id: "7", label: "YouTube Thumb", size: "1280 x 720", icon: "youtube" },
];

const Create = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["45%"], []);

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
      <TouchableOpacity style={styles.card}>
        <View
          style={[
            styles.previewBox,
            {
              width: previewWidth,
              height: previewHeight,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <FontAwesome5 name={item.icon} size={24} color="#3b5998" />
        </View>

        <Text style={styles.label}>{item.label}</Text>
        <Text style={styles.size}>{item.size}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <Text style={styles.header}>Create New Poster</Text>
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
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <EvilIcons name="close-o" size={35} color="#898989ff" />
          </TouchableOpacity>

          <Text style={styles.sheetTitle}>Select a Size</Text>
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
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },

  openButton: {
    backgroundColor: "skyblue",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  openText: { color: "white", fontWeight: "600" },

  contentContainer: { flex: 1, paddingTop:0, paddingHorizontal: 20 },
  sheetTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 ,marginTop:-28},

  closeButton: {
    alignSelf: "flex-end",
    padding: 6,
    marginBottom: 8,
  },
  closeText: { fontSize: 18, fontWeight: "bold" },

  listContainer: { paddingHorizontal: 10 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 14,
    padding: 14,
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
    width: 160,
    height: 220,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  previewBox: {
    backgroundColor: "#d0e8ff",
    borderWidth: 1,
    borderColor: "#aaa",
    marginBottom: 8,
  },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  size: { fontSize: 12, color: "#555" },
});
