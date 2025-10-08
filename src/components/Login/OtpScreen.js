import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import styles from './otpscreen.css';
import GradientButton from '../../constants/GradientButton';
import { verifyOtp } from '../../store/services/authServices/authServices';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    // If user pasted all 6 digits at once
    if (text.length > 1) {
      const newOtp = text.split('').slice(0, 6); // only take 6 digits
      setOtp(newOtp);
      Keyboard.dismiss();
      return;
    }

    // Normal single-digit entry
    if (/^[0-9]$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < 5) inputRefs.current[index + 1]?.focus();
      else Keyboard.dismiss();
    } else if (text === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };


  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError('');
    const enteredOtp = otp.join('');

    if (enteredOtp.length < 6) {
      setError('Please enter all 6 digits');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp(email, enteredOtp);
      console.log('OTP verified successfully:', res);
      await AsyncStorage.setItem('userId', res?.user?._id);
      navigation.navigate('MainPage');
    } catch (err) {
      console.log('Error verifying OTP:', err);
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={25} color="#333" />
            </TouchableOpacity>

            <View style={styles.imageWrapper}>
              <Image
                source={require('../../assets/LoginStickers/Otpscreen.jpg')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>We’ve sent a code to your mobile</Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[styles.otpInput, error ? { borderColor: 'red' } : {}]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  textContentType="oneTimeCode"
                />

              ))}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={{ marginTop: 30, width: '80%' }}>
              <GradientButton
                title={loading ? <ActivityIndicator size="small" color="#fff" /> : 'Verify'}
                onPress={handleVerify}
                disabled={loading}
                style={{ width: '100%' }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default OtpScreen;
