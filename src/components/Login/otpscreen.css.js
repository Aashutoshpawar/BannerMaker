import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginVertical: 10,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
    width: '100%',
  },
  otpInput: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 22,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  buttonWrapper: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -10,
  },
  backButton: {
    position: 'absolute',
    top: 25, // adjust for status bar
    left: 20,
    zIndex: 10,
    padding: 5,
  },

  backText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 5,
  },

});
