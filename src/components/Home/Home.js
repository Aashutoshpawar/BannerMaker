import React, { useCallback, memo } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image'; // 🚀 better for caching
import styles from './home.css';
import { imageMap } from '../../assets/templates/imageMap';
import templateData from '../../assets/templates/templates.json';

const categoryColors = {
  Dhanteras: '#FF9AA2',
  Diwali: '#FFB347',
  Holi: '#D5AAFF',
  Good_Friday: '#4DD0E1',
  Gudi_Padwa: '#FFD54F',
};

// ✅ Template Card (memoized to prevent re-rendering)
const TemplateTile = memo(({ item, category, navigation }) => {
  const bg = categoryColors[category] || '#ccc';
  return (
    <TouchableOpacity
      style={[styles.templateTile, { backgroundColor: bg }]}
      onPress={() =>
        navigation.navigate('PreviewTemplate', {
          template: { ...item, image: imageMap[item.image] }, // 👈 pass actual image source
        })
      }

    >
      {imageMap[item.image] ? (
        <FastImage
          source={imageMap[item.image]}
          style={styles.templateImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : (
        <Text style={{ color: '#000' }}>Missing {item.image}</Text>
      )}
    </TouchableOpacity>
  );
});

// ✅ Horizontal list for templates
const TemplateRow = memo(({ templates, category, navigation }) => {
  const renderItem = useCallback(
    ({ item }) => (
      <TemplateTile item={item} category={category} navigation={navigation} />
    ),
    [category, navigation]
  );

  return (
    <FlatList
      horizontal
      data={templates}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      initialNumToRender={3}
      maxToRenderPerBatch={5}
      windowSize={5}
    />
  );
});

// ✅ Category Section
const CategorySection = memo(({ item, navigation }) => (
  <View style={styles.categoryContainer}>
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryTitle}>{item.category}</Text>
      <TouchableOpacity onPress={() => alert(`See more ${item.category}`)}>
        <Text style={styles.seeMore}>See More</Text>
      </TouchableOpacity>
    </View>

    <TemplateRow templates={item.templates} category={item.category} navigation={navigation} />
  </View>
));

const Home = ({ navigation }) => {
  const renderCategory = useCallback(
    ({ item }) => <CategorySection item={item} navigation={navigation} />,
    [navigation]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Poster Maker Pro</Text>
      <FlatList
        data={templateData}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
};

export default Home;
