import React, { useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import styles from './login.css';
import GradientButton from '../../constatnts/GradientButton';

const Login = ({ navigation }) => {
  const [phone, setPhone] = useState('');

  const handleOTP = () => {
    console.log('otp sent');
    navigation.navigate('OTPScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Enter Your Mobile Number</Text>
        <Text style={styles.subtitle}>
          We'll send you a verification code to get you started
        </Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.header}>Phone No</Text>
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#888"
            style={styles.input}
            onChangeText={setPhone}
            value={phone}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <GradientButton title="Get OTP" onPress={handleOTP} />
        </View>
      </View>
    </View>
  );
};

export default Login;
