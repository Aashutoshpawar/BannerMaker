import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import styles from './draft.css';

// Sample draft data
const initialDrafts = [
  { id: 'd1', title: 'Birthday Poster', image: 'https://via.placeholder.com/150x200.png?text=D1' },
  { id: 'd2', title: 'Festival Poster', image: 'https://via.placeholder.com/150x200.png?text=D2' },
];

const Draft = () => {
  const [drafts, setDrafts] = useState(initialDrafts);

  const renderDraft = ({ item }) => (
    <TouchableOpacity style={styles.draftTile} onPress={() => alert(`Edit ${item.title}`)}>
      <Image source={{ uri: item.image }} style={styles.draftImage} />
      <Text style={styles.draftTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Drafts</Text>

      {drafts.length === 0 ? (
        <View style={styles.noDraftsContainer}>
          <Text style={styles.noDraftsText}>No drafts saved yet!</Text>
        </View>
      ) : (
        <FlatList
          data={drafts}
          renderItem={renderDraft}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}
    </View>
  );
};

export default Draft;
