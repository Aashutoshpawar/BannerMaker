import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import styles from './otpscreen.css';
import GradientButton from '../../constatnts/GradientButton';

const OtpScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    if (/^[0-9]$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (index < 3) {
        inputRefs.current[index + 1].focus();
      } else {
        Keyboard.dismiss();
      }
    } else if (text === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    console.log('Entered OTP:', enteredOtp);
    // if (enteredOtp.length === 4) {
      navigation.navigate('MainPage');
    // } else {
    //   alert('Please enter all 4 digits');
    // }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>We’ve sent a code to your mobile</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)} // 👈 handles backspace
            />
          ))}
        </View>

        <View style={styles.buttonWrapper}>
          <GradientButton title="Verify" onPress={handleVerify} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OtpScreen;
