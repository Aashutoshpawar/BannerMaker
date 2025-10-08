import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  Modal,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import RNFS from "react-native-fs";
import Ionicons from "react-native-vector-icons/Ionicons";

const ImageUploader = ({ pushToHistory, setStickers, displayWidth, displayHeight }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImagePicked = (image) => {
    if (image?.path) {
      const uri = image.path.startsWith("file://") ? image.path : `file://${image.path}`;
      setSelectedImage(uri);
      setPreviewVisible(true);
    }
    setModalVisible(false);
  };

  const openGallery = () => {
    ImagePicker.openPicker({ width: 600, height: 600, cropping: true })
      .then(handleImagePicked)
      .catch(() => setModalVisible(false));
  };

  const openCamera = () => {
    ImagePicker.openCamera({ width: 600, height: 600, cropping: true })
      .then(handleImagePicked)
      .catch(() => setModalVisible(false));
  };

  const saveImage = (uri) => {
    pushToHistory();
    setStickers(prev => [
      ...prev,
      { uri, x: displayWidth / 2 - 50, y: displayHeight / 2 - 50, scale: 1, rotation: 0 }
    ]);
    setPreviewVisible(false);
    setSelectedImage(null);
    setLoading(false);
  };

  // const removeBackground = async () => {
  //   if (!selectedImage) return;
  //   try {
  //     setLoading(true);

  //     const formData = new FormData();
  //     formData.append("image", {
  //       uri: selectedImage,
  //       type: "image/jpeg",
  //       name: "photo.jpg",
  //     });

  //     const response = await fetch("https://api.removal.ai/1.0/remove", {
  //       method: "POST",
  //       headers: {
  //         "Rm-Token": "1f3444be-011f-4377-86e4-2e82c5281126", // <-- Add your API key
  //       },
  //       body: formData,
  //     });

  //     if (!response.ok) throw new Error(`Background removal failed: ${response.status}`);

  //     const blob = await response.blob();
  //     const arrayBuffer = await blob.arrayBuffer();
  //     const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  //     const filePath = `${RNFS.CachesDirectoryPath}/no-bg.png`;
  //     await RNFS.writeFile(filePath, base64, "base64");

  //     saveImage("file://" + filePath);
  //   } catch (error) {
  //     console.error("RemovalAI Error:", error);
  //     alert("Error removing background.");
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <TouchableOpacity style={{ alignItems: "center" }} onPress={() => setModalVisible(true)}>
        <Ionicons name="image-outline" size={28} color="black" />
        <Text style={{ fontSize: 12, color: "#000" }}>Upload</Text>
      </TouchableOpacity>

      {/* Bottom Sheet Modal */}
      <Modal transparent visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Choose Image</Text>
              <View style={{ width: 24 }} />
            </View>

            <TouchableOpacity style={styles.button} onPress={openCamera}>
              <Ionicons name="camera-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Use Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={openGallery}>
              <Ionicons name="images-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal transparent visible={previewVisible} animationType="fade" onRequestClose={() => setPreviewVisible(false)}>
        <View style={styles.previewOverlay}>
          <View style={styles.previewBox}>
            {loading ? <ActivityIndicator size="large" color="#4B0082" /> : (
              <>
                {selectedImage && <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="contain" />}
                <View style={styles.actionRow}>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#4B0082" }]} onPress={() => saveImage(selectedImage)}>
                    <Text style={styles.actionText}>Continue with Background</Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#FF1493" }]} onPress={removeBackground}>
                    <Text style={styles.actionText}>Remove Background</Text>
                  </TouchableOpacity> */}
                </View>
                <TouchableOpacity onPress={() => setPreviewVisible(false)} style={{ marginTop: 10 }}>
                  <Text style={{ color: "red" }}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end" },
  bottomSheet: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16, alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  button: { flexDirection: "row", alignItems: "center", backgroundColor: "#4B0082", padding: 12, borderRadius: 8, marginVertical: 8, width: "100%", justifyContent: "center" },
  buttonText: { color: "#fff", fontSize: 16, marginLeft: 8 },
  previewOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center", padding: 20 },
  previewBox: { width: "100%", backgroundColor: "#fff", padding: 20, borderRadius: 12, alignItems: "center" },
  previewImage: { width: "100%", height: 300, borderRadius: 8, marginBottom: 20 },
  actionRow: { flexDirection: "column", width: "100%" },
  actionButton: { padding: 12, borderRadius: 8, marginVertical: 6, alignItems: "center" },
  actionText: { color: "#fff", fontWeight: "bold" },
});

export default ImageUploader;
