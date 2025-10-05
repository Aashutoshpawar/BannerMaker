import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './draft.css';
import { getProjectByUserID } from '../../store/services/creationServices/CreationServices';

const { width } = Dimensions.get('window');

const Draft = () => {
  const [drafts, setDrafts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) setUserId(storedUserId);
        else console.log('⚠️ No userId found in AsyncStorage');
      } catch (error) {
        console.error('❌ Error fetching userId:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      handleDraftsFetch(userId);
    }
  }, [userId]);

  const handleDraftsFetch = async (uid) => {
    try {
      setLoading(true);
      const response = await getProjectByUserID({ userId: uid });
      console.log('📥 Fetched drafts:', response);

      if (Array.isArray(response)) {
        setDrafts(
          response.map((draft) => ({
            ...draft,
            preview: draft?.background?.image || draft?.stickers?.[0]?.image || null,
          }))
        );
      } else if (response?.success && Array.isArray(response.projects)) {
        setDrafts(
          response.projects.map((draft) => ({
            ...draft,
            preview: draft?.background?.image || draft?.stickers?.[0]?.image || null,
          }))
        );
      } else {
        setDrafts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching drafts:', error);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const renderDraft = ({ item }) => {
    const bg = item?.preview;
    return (
      <TouchableOpacity
        style={styles.draftTile}
        onPress={() => alert(`Open Draft: ${item._id}`)}
      >
        {bg ? (
          <Image source={{ uri: bg }} style={styles.draftImage} />
        ) : (
          <View style={styles.emptyTile}>
            <Text style={{ fontSize: 12, color: '#555' }}>No Image</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Drafts</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : drafts.length === 0 ? (
        <View style={styles.noDraftsContainer}>
          <Text style={styles.noDraftsText}>No drafts saved yet!</Text>
        </View>
      ) : (
        <FlatList
          data={drafts}
          keyExtractor={(item) => item._id}
          renderItem={renderDraft}
          numColumns={2}              // ✅ ← makes it a grid
          columnWrapperStyle={{      // ✅ spacing between columns
            justifyContent: 'space-between',
            marginBottom: 15,
          }}
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Draft;
