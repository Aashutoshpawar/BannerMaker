import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Text, TouchableOpacity } from 'react-native';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />
      {/* <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={{ color: 'blue', marginBottom: 20 }}>Forgot Password?</Text>
      </TouchableOpacity> */}
      <Button
        title="Login"
        onPress={() => {
          // ✅ replace so user can't go back to login
          navigation.replace('MainPage');  
        }}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={{ color: 'blue', marginTop: 20 }}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    width: 250,
    color: 'black',
  },
});

export default Login;
