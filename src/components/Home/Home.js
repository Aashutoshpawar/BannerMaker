// Home.js
import React, { useCallback, memo, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  BackHandler, 
  ToastAndroid 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import styles from './home.css';
import getTemplates from "../../store/services/templateServices/templateServices";

// ✅ Template Tile
const TemplateTile = memo(({ item, navigation }) => {
  return (
    <TouchableOpacity
      style={[styles.templateTile, { backgroundColor: '#f2f2f2' }]}
      onPress={() =>
        navigation.navigate('PreviewTemplate', { template: item })
      }
    >
      {item.imageUrl ? (
        <FastImage
          source={{ uri: item.imageUrl }}
          style={styles.templateImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <Text style={{ color: '#000', fontSize: 10 }}>Missing image</Text>
      )}
    </TouchableOpacity>
  );
});

// ✅ Horizontal row of templates
const TemplateRow = memo(({ templates, navigation }) => {
  const renderItem = useCallback(
    ({ item }) => <TemplateTile item={item} navigation={navigation} />,
    [navigation]
  );

  return (
    <FlatList
      horizontal
      data={templates}
      renderItem={renderItem}
      keyExtractor={(item) => item._id || item.id}
      showsHorizontalScrollIndicator={false}
      initialNumToRender={3}
      maxToRenderPerBatch={5}
      windowSize={5}
    />
  );
});

// ✅ Category section
const CategorySection = memo(({ item, navigation }) => (
  <View style={styles.categoryContainer}>
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryTitle}>{item.category}</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CategoryTemplates', {
            categoryName: item.category,
            templates: item.fullTemplates,
          })
        }
      >
        <Text style={styles.seeMore}>See More</Text>
      </TouchableOpacity>
    </View>
    <TemplateRow templates={item.templates} navigation={navigation} />
  </View>
));

// ✅ Home Component
const Home = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [backPressCount, setBackPressCount] = useState(0);

  // 🧠 Back handler limited to Home using useFocusEffect
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (backPressCount === 0) {
          setBackPressCount(1);
          ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
          setTimeout(() => setBackPressCount(0), 2000);
          return true; // block default behavior
        } else {
          BackHandler.exitApp();
          return true;
        }
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      // Cleanup only when screen loses focus
      return () => backHandler.remove();
    }, [backPressCount])
  );

  // 🧠 Fetch Templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await getTemplates();
        console.log('API Response:', res);

        if (res?.success && res.categories) {
          const formatted = Object.keys(res.categories).map((key, index) => {
            const categoryData = res.categories[key];
            const fullTemplates = categoryData.templates.map((t) => ({
              ...t,
              id: t._id,
            }));

            return {
              id: String(index + 1),
              category: categoryData.name,
              templates: fullTemplates.slice(0, 5),
              fullTemplates,
            };
          });

          setCategories(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch templates:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const renderCategory = useCallback(
    ({ item }) => <CategorySection item={item} navigation={navigation} />,
    [navigation]
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Poster Maker Pro</Text>
      <FlatList
        data={categories}
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
