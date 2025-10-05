// services/authService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";
import { add } from "react-native/types_generated/Libraries/Animated/AnimatedExports";

// ---------------- SEND OTP ----------------
export const sendOtp = async (email) => {
  const response = await api.post("/auth/send_otp", { email });
  return response.data;
};

// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (email, otp) => {
  const response = await api.post("/auth/verify_otp", { email, otp });

  await AsyncStorage.setItem("accessToken", response.data.accessToken);
  await AsyncStorage.setItem("refreshToken", response.data.refreshToken);

  return response.data;
};

// ---------------- LOGOUT ----------------
export const logout = async () => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");

  if (refreshToken) {
    await api.post("/auth/logout", { refreshToken });
  }

  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");

  return { message: "Logged out successfully" };
};
