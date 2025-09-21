// components/BackgroundSelector.js
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const BackgroundSelector = ({ pushToHistory, setBackground }) => {
  const pickBackground = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (!res.didCancel && res.assets?.length > 0) { 
        const uri = res.assets[0].uri;
        if (uri) {
          pushToHistory();
          setBackground(uri.toString());
        }
      }
    });
  };

  return (
    <TouchableOpacity style={{ alignItems: "center" }} onPress={pickBackground}>
      <MaterialCommunityIcons name="texture-box" size={26} color="black" />
      <Text style={{ fontSize: 12, color: "#000" }}>Background</Text>
    </TouchableOpacity>
  );
};

export default BackgroundSelector;
