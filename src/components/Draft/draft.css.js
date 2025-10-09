import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const tileMargin = 10;
const tileWidth = (width - 3 * tileMargin) / 2;

export default StyleSheet.create({
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
  draftTile: {
    width: tileWidth,
    height: 210,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  draftPreview: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fafafa',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDraftsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDraftsText: {
    fontSize: 18,
    color: '#999',
  },
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
  noPreview: {
    width: '100%',
    height: 250,
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
