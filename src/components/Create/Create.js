import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const canvasSizes = [
  { id: "1", label: "YouTube Thumb", size: "1280 x 720", icon: "youtube", color: "#FF0000" },
  { id: "2", label: "A4", size: "2480 x 3508", icon: "file-pdf", color: "#FF0000" },
  { id: "3", label: "Instagram", size: "1080 x 1080", icon: "instagram", color: "#E1306C" },
  { id: "4", label: "Facebook Cover", size: "1352 x 500", icon: "facebook", color: "#1877F2" },
  { id: "5", label: "Poster", size: "612 x 792", icon: "file-alt", color: "#f59e0b" },
  { id: "6", label: "Insta Poster", size: "1080 x 1920", icon: "image", color: "#10b981" },
  { id: "7", label: "Square", size: "2000 x 2000", icon: "square-full", color: "#4b5563" },
];

const Create = ({ navigation }) => {
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
      <Text style={styles.header}>Create New Poster</Text>

      <FlatList
        data={canvasSizes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2} // grid layout
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 16,
    padding: 15,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 25,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    maxWidth: "48%",
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
    textAlign: "center",
  },
  size: {
    fontSize: 12,
    color: "#6b7280",
  },
});
