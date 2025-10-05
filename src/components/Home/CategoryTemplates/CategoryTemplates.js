// CategoryTemplates.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import styles from './categoryTemplates.css'; // create your own styles file

const CategoryTemplates = ({ route, navigation }) => {
  const { categoryName, templates } = route.params;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.templateTile, { backgroundColor: '#f2f2f2' }]}
      onPress={() => navigation.navigate('PreviewTemplate', { template: item })}
    >
      <FastImage
        source={{ uri: item.imageUrl }}
        style={styles.templateImage}
        resizeMode={FastImage.resizeMode.cover}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{categoryName}</Text>
      <FlatList
        data={templates}
        renderItem={renderItem}
        keyExtractor={(item) => item._id || item.id}
        numColumns={2} // grid style
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CategoryTemplates;
