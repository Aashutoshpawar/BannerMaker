import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import GradientButton from "../../../constatnts/GradientButton";

const Crop = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { canvas } = route.params; // get canvas size (e.g. 1080x1920)
  const [image, setImage] = useState(null);

  const [w, h] = canvas.size.split("x").map((s) => parseInt(s.trim(), 10));

  const pickFromGallery = () => {
    ImagePicker.openPicker({
      width: w,
      height: h,
      cropping: true,
    }).then((img) => {
      setImage(img.path);
      navigation.navigate("Canvas", { image: img.path, canvas });
      console.log(img);
    });
  };

  const pickFromCamera = () => {
    ImagePicker.openCamera({
      width: w,
      height: h,
      cropping: true,
    }).then((img) => {
      setImage(img.path);
      navigation.navigate("Canvas", { image: img.path, canvas });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Image From</Text>

      <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
        <Text style={styles.text}>📂 Open Gallery </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickFromCamera}>
        <Text style={styles.text}>📷 Open Camera</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.preview} />}
    </View>
  );
};

export default Crop;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 20 },
  button: {
    backgroundColor: "#3c91ec",
    padding: 14,
    borderRadius: 12,
    marginVertical: 10,
    width: "70%",
    alignItems: "center",
  },
  text: { color: "#fff", fontSize: 16, fontWeight: "600" },
  preview: { width: 200, height: 200, marginTop: 20, borderRadius: 8 },
});
