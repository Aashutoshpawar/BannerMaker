// components/ImageUploader.js
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";

const ImageUploader = ({ pushToHistory, setStickers, displayWidth, displayHeight }) => {
  const uploadImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (!res.didCancel && res.assets?.length > 0) {
        const uri = res.assets[0].uri;
        if (uri) {
          pushToHistory();
          setStickers((prev) => [
            ...prev,
            {
              uri,
              x: displayWidth / 2 - 50,
              y: displayHeight / 2 - 50,
              scale: 1,
              rotation: 0,
            },
          ]);
        }
      }
    });
  };

  return (
    <TouchableOpacity style={{ alignItems: "center" }} onPress={uploadImage}>
      <Ionicons name="image-outline" size={28} color="black" />
      <Text style={{ fontSize: 12, color: "#000" }}>Upload</Text>
    </TouchableOpacity>
  );
};

export default ImageUploader;
