import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const tileMargin = 10;
const tileWidth = (width - 3 * tileMargin) / 2; 
// (2 tiles per row) → left + right padding + spacing between

export default StyleSheet.create({
  // 🧱 Main Screen
  container: {
    flex: 1,
    padding: tileMargin,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  // 🟦 Draft Grid Tile
  draftTile: {
    width: tileWidth,
    height: 210,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  draftImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyTile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  draftTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 5,
  },

  // 📭 No Drafts State
  noDraftsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDraftsText: {
    fontSize: 18,
    color: '#999',
  },

  // 📝 Bottom Sheet Styles
  bottomSheetModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomSheetContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  noPreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 5,
  },
  closeText: {
    color: '#666',
    fontSize: 15,
  },
});
