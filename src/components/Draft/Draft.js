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
import LinearGradient from 'react-native-linear-gradient';
import styles from './draft.css';
import { getProjectByUserID } from '../../store/services/creationServices/CreationServices';

const { width } = Dimensions.get('window');
const tileMargin = 10;
const tileWidth = (width - 3 * tileMargin) / 2;

const Draft = () => {
  const navigation = useNavigation();
  const [drafts, setDrafts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleNavigateToCanvas = () => {
    if (!selectedDraft) return;
    handleCloseModal();

    const canvasWidth = selectedDraft?.canvas?.width || 1080;
    const canvasHeight = selectedDraft?.canvas?.height || 1920;

    let backgroundData = null;

    if (selectedDraft?.background?.image) {
      backgroundData = selectedDraft.background.image;
    } else if (selectedDraft?.background?.isGradient) {
      backgroundData = {
        type: 'gradient',
        colors: selectedDraft.background.gradientColors || ['#fff', '#000'],
      };
    }

    console.log('📤 Navigating to Canvas with:', {
      background: backgroundData,
      canvas: { width: canvasWidth, height: canvasHeight },
      stickers: selectedDraft?.stickers?.length || 0,
      texts: selectedDraft?.texts?.length || 0,
    });

    navigation.navigate('Canvas', {
      draft: {
        canvas: {
          width: canvasWidth,
          height: canvasHeight,
          size: `${canvasWidth} x ${canvasHeight}`,
        },
        stickers: selectedDraft?.stickers || [],
        texts: selectedDraft?.texts || [],
        background: backgroundData,
      },
    });
  };

  const handleDeleteDraft = () => {
    console.log('🗑️ Deleting draft:', selectedDraft?._id);
    handleCloseModal();
    if (userId) handleDraftsFetch(userId);
  };

  // ✅ Scaled draft preview for grid
  const renderDraft = ({ item }) => {
    const bg = item?.background;
    const stickers = item?.stickers || [];
    const texts = item?.texts || [];
    const canvasWidth = item?.canvas?.width || 1080;
    const canvasHeight = item?.canvas?.height || 1920;

    const previewWidth = tileWidth;
    const previewHeight = 210;
    const scaleX = previewWidth / canvasWidth;
    const scaleY = previewHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY);

    const renderBackground = () => {
      if (bg?.image) {
        return (
          <Image
            source={{ uri: bg.image }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        );
      } else if (bg?.isGradient && bg?.gradientColors?.length >= 2) {
        return (
          <LinearGradient
            colors={bg.gradientColors}
            style={StyleSheet.absoluteFillObject}
          />
        );
      } else {
        return (
          <View
            style={[StyleSheet.absoluteFillObject, { backgroundColor: '#eee' }]}
          />
        );
      }
    };

    return (
      <TouchableOpacity
        style={styles.draftTile}
        onPress={() => handleOpenDraft(item)}
      >
        <View style={styles.draftPreview}>
          {renderBackground()}

          {stickers.map((sticker, i) => (
            <Image
              key={`sticker-${i}`}
              source={{ uri: sticker.image }}
              style={{
                position: 'absolute',
                left: (sticker.x || 0) * scale,
                top: (sticker.y || 0) * scale,
                width: (sticker.width || 60) * scale,
                height: (sticker.height || 60) * scale,
                transform: [{ rotate: `${sticker.rotation || 0}deg` }],
              }}
              resizeMode="contain"
            />
          ))}

          {texts.map((txt, i) => (
            <Text
              key={`text-${i}`}
              style={{
                position: 'absolute',
                left: (txt.x || 0) * scale,
                top: (txt.y || 0) * scale,
                color: txt.color || '#000',
                fontSize: (txt.fontSize || 14) * scale,
                fontWeight: txt.fontWeight || 'normal',
                transform: [{ rotate: `${txt.rotation || 0}deg` }],
              }}
            >
              {txt.value}
            </Text>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  // ✅ Mini preview inside modal
  const renderMiniPreview = (draft) => {
    const bg = draft?.background;
    const stickers = draft?.stickers || [];
    const texts = draft?.texts || [];
    const canvasWidth = draft?.canvas?.width || 1080;
    const canvasHeight = draft?.canvas?.height || 1920;

    const previewWidth = width * 0.7;
    const previewHeight = width * 1.2;
    const scaleX = previewWidth / canvasWidth;
    const scaleY = previewHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY);

    const renderBackground = () => {
      if (bg?.image) {
        return (
          <Image
            source={{ uri: bg.image }}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        );
      } else if (bg?.isGradient && bg?.gradientColors?.length >= 2) {
        return (
          <LinearGradient
            colors={bg.gradientColors}
            style={StyleSheet.absoluteFillObject}
          />
        );
      } else {
        return (
          <View
            style={[StyleSheet.absoluteFillObject, { backgroundColor: '#eee' }]}
          />
        );
      }
    };

    return (
      <View
        style={{
          width: previewWidth,
          height: previewHeight,
          borderRadius: 15,
          overflow: 'hidden',
          alignSelf: 'center',
          marginBottom: 20,
        }}
      >
        {renderBackground()}

        {stickers.map((sticker, i) => (
          <Image
            key={`modal-sticker-${i}`}
            source={{ uri: sticker.image }}
            style={{
              position: 'absolute',
              left: (sticker.x || 0) * scale,
              top: (sticker.y || 0) * scale,
              width: (sticker.width || 60) * scale,
              height: (sticker.height || 60) * scale,
              transform: [{ rotate: `${sticker.rotation || 0}deg` }],
            }}
            resizeMode="contain"
          />
        ))}

        {texts.map((txt, i) => (
          <Text
            key={`modal-text-${i}`}
            style={{
              position: 'absolute',
              left: (txt.x || 0) * scale,
              top: (txt.y || 0) * scale,
              color: txt.color || '#000',
              fontSize: (txt.fontSize || 14) * scale,
              fontWeight: txt.fontWeight || 'normal',
              transform: [{ rotate: `${txt.rotation || 0}deg` }],
            }}
          >
            {txt.value}
          </Text>
        ))}
      </View>
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

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={handleCloseModal}
        onBackButtonPress={handleCloseModal}
        style={styles.bottomSheetModal}
      >
        <View style={styles.bottomSheetContent}>
          {selectedDraft ? (
            renderMiniPreview(selectedDraft)
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
