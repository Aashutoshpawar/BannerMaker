import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  screenContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 25,
  },
  floatingBtn: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 5,
    right: 20,
    backgroundColor: '#3c91ecff',
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 20,
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    padding: 15,
    // backgroundColor: '#dededeff',
    backgroundColor: '#f9f9f9',
  },
  categoryContainer: {
    marginBottom: 25,

  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeMore: {
    fontSize: 14,
    color: '#007BFF',
  },
  templateTile: {
    elevation: 5,
    marginBottom: 10,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    width: 150,
    height: 150,
    backgroundColor: '#55bdd4ff',
  },
  templateImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  moreTile: {
    width: 100,
    height: 150,
    backgroundColor: '#55bdd4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  moreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
