import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  draftTile: {
    width: 150,
    height: 210,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftImage: {
    width: '100%',
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
