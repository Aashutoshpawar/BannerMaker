import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from './signup.css';

const Signup = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;
