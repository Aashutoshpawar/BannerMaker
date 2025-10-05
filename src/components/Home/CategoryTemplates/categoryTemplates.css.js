// categoryTemplates.css.js
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const TILE_MARGIN = 8;
const NUM_COLUMNS = 2;
const TILE_SIZE = (width - TILE_MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: TILE_MARGIN,
    paddingTop: 10,
  },

  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
    textAlign: 'center',
  },

  templateTile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: TILE_MARGIN,
    overflow: 'hidden',
    elevation: 2, // Android shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  templateImage: {
    width: '100%',
    height: '100%',
  },
});
