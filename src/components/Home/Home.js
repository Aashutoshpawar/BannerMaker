import React from 'react';
import { View, Text, FlatList, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from './home.css';

// Solid colors for each category
const categoryColors = {
  Birthday: '#FF9AA2',
  Festival: '#FFB347',
  Wedding: '#D5AAFF',
  Business: '#4DD0E1',
  Travel: '#FFD54F',
  Education: '#90CAF9',
};

// Sample template data
const templateData = [
  {
    id: '1',
    category: 'Birthday',
    templates: [
      { id: 'b1', image: 'https://via.placeholder.com/100x150.png?text=B1' },
      { id: 'b2', image: 'https://via.placeholder.com/100x150.png?text=B2' },
      { id: 'b3', image: 'https://via.placeholder.com/100x150.png?text=B3' },
      { id: 'b4', image: 'https://via.placeholder.com/100x150.png?text=B4' },
      { id: 'b5', image: 'https://via.placeholder.com/100x150.png?text=B5' },
    ],
  },
  {
    id: '2',
    category: 'Festival',
    templates: [
      { id: 'f1', image: 'https://via.placeholder.com/100x150.png?text=F1' },
      { id: 'f2', image: 'https://via.placeholder.com/100x150.png?text=F2' },
      { id: 'f3', image: 'https://via.placeholder.com/100x150.png?text=F3' },
      { id: 'f4', image: 'https://via.placeholder.com/100x150.png?text=F4' },
      { id: 'f5', image: 'https://via.placeholder.com/100x150.png?text=F5' },
    ],
  },
  {
    id: '3',
    category: 'Wedding',
    templates: [
      { id: 'w1', image: 'https://via.placeholder.com/100x150.png?text=W1' },
      { id: 'w2', image: 'https://via.placeholder.com/100x150.png?text=W2' },
      { id: 'w3', image: 'https://via.placeholder.com/100x150.png?text=W3' },
      { id: 'w4', image: 'https://via.placeholder.com/100x150.png?text=W4' },
      { id: 'w5', image: 'https://via.placeholder.com/100x150.png?text=W5' },
    ],
  },
  {
    id: '4',
    category: 'Business',
    templates: [
      { id: 'bu1', image: 'https://via.placeholder.com/100x150.png?text=BU1' },
      { id: 'bu2', image: 'https://via.placeholder.com/100x150.png?text=BU2' },
      { id: 'bu3', image: 'https://via.placeholder.com/100x150.png?text=BU3' },
      { id: 'bu4', image: 'https://via.placeholder.com/100x150.png?text=BU4' },
      { id: 'bu5', image: 'https://via.placeholder.com/100x150.png?text=BU5' },
    ],
  },
  {
    id: '5',
    category: 'Travel',
    templates: [
      { id: 't1', image: 'https://via.placeholder.com/100x150.png?text=T1' },
      { id: 't2', image: 'https://via.placeholder.com/100x150.png?text=T2' },
      { id: 't3', image: 'https://via.placeholder.com/100x150.png?text=T3' },
      { id: 't4', image: 'https://via.placeholder.com/100x150.png?text=T4' },
      { id: 't5', image: 'https://via.placeholder.com/100x150.png?text=T5' },
    ],
  },
  {
    id: '6',
    category: 'Education',
    templates: [
      { id: 'e1', image: 'https://via.placeholder.com/100x150.png?text=E1' },
      { id: 'e2', image: 'https://via.placeholder.com/100x150.png?text=E2' },
      { id: 'e3', image: 'https://via.placeholder.com/100x150.png?text=E3' },
      { id: 'e4', image: 'https://via.placeholder.com/100x150.png?text=E4' },
      { id: 'e5', image: 'https://via.placeholder.com/100x150.png?text=E5' },
    ],
  },
];

const Home = ({ navigation }) => {
  const renderTemplate = (item, category) => (
    <TouchableOpacity
      style={[styles.templateTile, { backgroundColor: categoryColors[category] || '#ccc' }]}
      onPress={() => alert(`Selected ${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.templateImage} />
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <View style={styles.categoryContainer}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryTitle}>{item.category}</Text>
        <TouchableOpacity onPress={() => alert(`See more ${item.category}`)}>
          <Text style={styles.seeMore}>See More</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {item.templates.map((t) => renderTemplate(t, item.category))}
        <TouchableOpacity
          style={[styles.moreTile, { backgroundColor: categoryColors[item.category] || '#ccc' }]}
          onPress={() => alert(`See more ${item.category}`)}
        >
          <Text style={styles.moreText}>+1</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Poster Maker Pro</Text>
      <FlatList
        data={templateData}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;
