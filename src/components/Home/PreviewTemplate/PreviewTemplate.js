import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const { width } = Dimensions.get('window');

const PreviewTemplate = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { template } = route.params;

  const handleUseTemplate = () => {
    if (!template?.image) return;

    const fixedCanvas = {
      label: 'Square',
      size: '2000 x 2000',
    };

    navigation.navigate("Canvas", { image: template.image, canvas: fixedCanvas });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preview Template</Text>
      </View>

      <View style={styles.imagecontainer}>
        {template?.image ? (
          <FastImage
            source={
              typeof template.image === 'string'
                ? { uri: template.image } // remote URL
                : template.image         // local require()
            }
            style={styles.previewImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        ) : (
          <Text style={{ color: '#000' }}>Image not found</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleUseTemplate}>
          <Text style={styles.buttonText}>Use Template</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backButton: { marginRight: 10, padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  imagecontainer: { alignItems: 'center', paddingTop: 20, overflow: 'hidden' },
  previewImage: { borderRadius: 10, width: width * 0.9, height: width * 0.9, marginBottom: 20 },
  button: { borderRadius: 10, backgroundColor: '#3c91ec', paddingVertical: 12, paddingHorizontal: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default PreviewTemplate;
