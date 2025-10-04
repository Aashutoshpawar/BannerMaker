import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'flex-start', // start from top
  },

  // ✅ Logo section
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.12, // top padding
    marginBottom: height * 0.05,
  },
  logo: {
    width: width * 0.75,  // 50% of screen width
    height: width * 0.5, // keep square ratio
    resizeMode: 'contain',
  },

  // Form section
  subcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 25,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 10,
  },

  inputWrapper: {
    width: '100%',
    marginBottom: 15,
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: "#ff0000",
    fontSize: 14,
    marginTop: 5,
  },

  buttonWrapper: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
});
