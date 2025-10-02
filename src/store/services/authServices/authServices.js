// services/authService.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appConfig from "../../../constants/appConfig";

const BASE_URL = appConfig.baseUrl;

// ---------------- SEND OTP ----------------
export const sendOtp = async (email) => {
  const res = await axios.post(`${BASE_URL}/send_otp`, { email });
  console.log("OTP sent response:", res.data);
  return res.data; // { message: "OTP sent successfully" }
};

// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (email, otp) => {
  const res = await axios.post(`${BASE_URL}/verify_otp`, { email, otp });

  await AsyncStorage.setItem("accessToken", res.data.accessToken);
  await AsyncStorage.setItem("refreshToken", res.data.refreshToken);

  return res.data; // { accessToken, refreshToken, user }
};

// ---------------- REFRESH TOKEN ----------------
export const refreshAccessToken = async () => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await axios.post(`${BASE_URL}/refresh_token`, { refreshToken });

  await AsyncStorage.setItem("accessToken", res.data.accessToken);
  await AsyncStorage.setItem("refreshToken", res.data.refreshToken);

  return res.data; // { accessToken, refreshToken }
};

// ---------------- LOGOUT ----------------
export const logout = async () => {
  const refreshToken = await AsyncStorage.getItem("refreshToken");

  if (refreshToken) {
    await axios.post(`${BASE_URL}/logout`, { refreshToken });
  }

  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("refreshToken");

  return { message: "Logged out successfully" };
};
