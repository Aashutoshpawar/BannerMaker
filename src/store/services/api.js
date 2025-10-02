// services/api.js
import axios from "axios";
import appConfig from "../../constantnts/appConfig"; // make sure path is correct
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: appConfig.baseUrl, // ✅ fixed
  headers: {
    "Content-Type": "application/json",
  },
});

// Add access token to requests
API.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Handle expired tokens
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry // prevent infinite loop
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (refreshToken) {
          const res = await axios.post(`${appConfig.baseUrl}/refresh_token`, { refreshToken });

          // Save new tokens
          await AsyncStorage.setItem("accessToken", res.data.accessToken);
          await AsyncStorage.setItem("refreshToken", res.data.refreshToken);

          // Retry the failed request with new token
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return API.request(originalRequest);
        }
      } catch (err) {
        console.log("Token refresh failed:", err);
        // TODO: Optionally clear tokens & redirect user to login
      }
    }

    return Promise.reject(error);
  }
);

export default API;
