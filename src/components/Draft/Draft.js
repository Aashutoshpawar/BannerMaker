import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import styles from './draft.css';
import { getProjectByUserID } from '../../store/services/creationServices/CreationServices';

const { width } = Dimensions.get('window');

const Draft = () => {
  const navigation = useNavigation();
  const [drafts, setDrafts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Bottom sheet states
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // ✅ Fetch userId once
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

  // ✅ Fetch drafts when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        handleDraftsFetch(userId);
      }
    }, [userId])
  );

  const handleDraftsFetch = async (uid) => {
    try {
      setLoading(true);
      const response = await getProjectByUserID({ userId: uid });
      console.log('📥 Fetched drafts:', response);

      let fetchedDrafts = [];

      if (Array.isArray(response)) {
        fetchedDrafts = response.map((draft) => ({
          ...draft,
          preview:
            draft?.background?.image || draft?.stickers?.[0]?.image || null,
        }));
      } else if (response?.success && Array.isArray(response.projects)) {
        fetchedDrafts = response.projects.map((draft) => ({
          ...draft,
          preview:
            draft?.background?.image || draft?.stickers?.[0]?.image || null,
        }));
      }

      // ✅ Reverse order (latest first)
      setDrafts(fetchedDrafts.reverse());
    } catch (error) {
      console.error('❌ Error fetching drafts:', error);
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDraft = (item) => {
    setSelectedDraft(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedDraft(null);
    setModalVisible(false);
  };

  // ✅ Open Draft with Canvas Size Support
  // Replace the handleNavigateToCanvas function in Draft.js with this fixed version:

  const handleNavigateToCanvas = () => {
    if (!selectedDraft) return;

    handleCloseModal();

    // ✅ Extract size from API response (numerical width/height)
    const width = selectedDraft?.canvas?.width || 1080;
    const height = selectedDraft?.canvas?.height || 1920;

    // ✅ Prepare background data
    let backgroundData = null;

    if (selectedDraft?.background?.image) {
      // Image background
      backgroundData = selectedDraft.background.image;
    } else if (selectedDraft?.background?.isGradient) {
      // Gradient background
      backgroundData = {
        type: "gradient",
        colors: selectedDraft.background.gradientColors || ["#fff", "#000"],
      };
    }

    console.log("📤 Navigating to Canvas with:", {
      background: backgroundData,
      canvas: { width, height },
      stickers: selectedDraft?.stickers?.length || 0,
      texts: selectedDraft?.texts?.length || 0,
    });

    // ✅ Navigate with structured data
    navigation.navigate("Canvas", {
      canvas: {
        width,
        height,
        size: `${width} x ${height}`, // for compatibility
      },
      stickers: selectedDraft?.stickers || [],
      texts: selectedDraft?.texts || [],
      background: backgroundData, // Pass the actual background data
    });
  };


  const handleDeleteDraft = () => {
    console.log('🗑️ Deleting draft:', selectedDraft?._id);
    handleCloseModal();
    // Optional refresh after deletion
    if (userId) handleDraftsFetch(userId);
  };

  const renderDraft = ({ item }) => {
    const bg = item?.preview;
    return (
      <TouchableOpacity
        style={styles.draftTile}
        onPress={() => handleOpenDraft(item)}
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
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 15,
          }}
          contentContainerStyle={{ paddingBottom: 50 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ✅ Bottom Sheet Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={handleCloseModal}
        onBackButtonPress={handleCloseModal}
        style={styles.bottomSheetModal}
      >
        <View style={styles.bottomSheetContent}>
          {selectedDraft?.preview ? (
            <Image
              source={{ uri: selectedDraft.preview }}
              style={styles.previewImage}
            />
          ) : (
            <View style={styles.noPreview}>
              <Text>No Preview Available</Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, styles.openButton]}
              onPress={handleNavigateToCanvas}
            >
              <Text style={styles.actionText}>Open</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDeleteDraft}
            >
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleCloseModal} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Draft;
