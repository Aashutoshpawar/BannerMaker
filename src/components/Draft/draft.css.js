import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const tileMargin = 10;
const tileWidth = (width - 3 * tileMargin) / 2; 
// (2 tiles per row) → left + right padding + spacing between

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
  noDraftsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDraftsText: {
    fontSize: 18,
    color: '#999',
  },
});
