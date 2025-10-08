import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Image,
} from "react-native";
import styles from "./login.css";
import GradientButton from "../../constants/GradientButton";
import { sendOtp } from "../../store/services/authServices/authServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Check login status once on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("refreshToken");
        if (token) {
          // If token exists, redirect user to Home screen
          navigation.replace("MainPage");
        }
      } catch (err) {
        console.log("Error checking login status:", err);
      }
    };

    checkLoginStatus();
  }, [navigation]);

  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleOTP = () => {
    setError("");

    // Validate email
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    sendOtp(email)
      .then(() => {
        console.log("OTP sent to:", email);
        navigation.navigate("OTPScreen", { email });
      })
      .catch((err) => {
        console.log("Error sending OTP:", err);
        setError("Failed to send OTP. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.imageWrapper}>
              <Image
                source={require("../../assets/LoginStickers/Loginscreen.jpg")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.subcontainer}>
              <Text style={styles.title}>Enter Your Email</Text>
              <Text style={styles.subtitle}>
                We'll send you a verification code to get you started
              </Text>

              <View style={styles.inputWrapper}>
                <Text style={styles.header}>Email</Text>
                <TextInput
                  placeholder="Enter Your Email"
                  placeholderTextColor="#888"
                  style={[
                    styles.input,
                    error ? { borderColor: "red", borderWidth: 1 } : {},
                  ]}
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setError("")}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              <View style={styles.buttonWrapper}>
                <GradientButton
                  title={
                    loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      "Get OTP"
                    )
                  }
                  onPress={handleOTP}
                  disabled={loading}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
