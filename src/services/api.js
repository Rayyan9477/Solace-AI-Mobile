import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

// Simple encryption for web compatibility
const simpleEncrypt = (data, key) => {
  const dataStr = JSON.stringify(data);
  const keyBytes = key.split("").map((c) => c.charCodeAt(0));
  const dataBytes = dataStr.split("").map((c) => c.charCodeAt(0));

  const encrypted = dataBytes.map(
    (byte, i) => byte ^ keyBytes[i % keyBytes.length],
  );

  return btoa(String.fromCharCode(...encrypted));
};

const simpleDecrypt = (encryptedData, key) => {
  const keyBytes = key.split("").map((c) => c.charCodeAt(0));
  const encryptedBytes = Array.from(atob(encryptedData)).map((c) =>
    c.charCodeAt(0),
  );

  const decrypted = encryptedBytes.map(
    (byte, i) => byte ^ keyBytes[i % keyBytes.length],
  );

  const decryptedStr = String.fromCharCode(...decrypted);
  return JSON.parse(decryptedStr);
};

// Environment configurations
const API_CONFIG = {
  development: {
    baseURL: __DEV__
      ? Platform.select({
          ios: "http://localhost:8000",
          android: "http://10.0.2.2:8000",
          web: "http://localhost:8000",
        })
      : "https://api-dev.solace-ai.com",
    timeout: 10000,
  },
  staging: {
    baseURL: "https://api-staging.solace-ai.com",
    timeout: 15000,
  },
  production: {
    baseURL: "https://api.solace-ai.com",
    timeout: 20000,
  },
};

// Get current environment
const getEnvironment = () => {
  if (__DEV__) return "development";
  // You can implement environment detection logic here
  return process.env.NODE_ENV === "production" ? "production" : "staging";
};

const currentConfig = API_CONFIG[getEnvironment()];

// Create axios instance
const apiClient = axios.create({
  baseURL: currentConfig.baseURL,
  timeout: currentConfig.timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Secure token management
const TOKEN_KEY = "secure_auth_token";
const REFRESH_TOKEN_KEY = "secure_refresh_token";
const ENCRYPTION_KEY = "secure_encryption_key";

const secureTokenManager = {
  async getEncryptionKey() {
    try {
      let key = await AsyncStorage.getItem(ENCRYPTION_KEY);
      if (!key) {
        // Generate a simple encryption key
        key =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        await AsyncStorage.setItem(ENCRYPTION_KEY, key);
      }
      return key;
    } catch (error) {
      if (__DEV__) console.error("Error getting encryption key:", error);
      throw new Error("Failed to initialize secure storage");
    }
  },

  async encryptData(data) {
    try {
      const key = await this.getEncryptionKey();
      return simpleEncrypt(data, key);
    } catch (error) {
      if (__DEV__) console.error("Encryption error:", error);
      throw new Error("Failed to encrypt data");
    }
  },

  async decryptData(encryptedData) {
    try {
      const key = await this.getEncryptionKey();
      return simpleDecrypt(encryptedData, key);
    } catch (error) {
      if (__DEV__) console.error("Decryption error:", error);
      return null;
    }
  },

  async getToken() {
    try {
      const encryptedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (!encryptedToken) return null;
      return await this.decryptData(encryptedToken);
    } catch (error) {
      if (__DEV__) console.error("Error getting secure token:", error);
      return null;
    }
  },

  async setToken(token) {
    try {
      const encryptedToken = await this.encryptData(token);
      await AsyncStorage.setItem(TOKEN_KEY, encryptedToken);
    } catch (error) {
      if (__DEV__) console.error("Error setting secure token:", error);
      throw new Error("Failed to store authentication token");
    }
  },

  async getRefreshToken() {
    try {
      const encryptedToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (!encryptedToken) return null;
      return await this.decryptData(encryptedToken);
    } catch (error) {
      if (__DEV__) console.error("Error getting secure refresh token:", error);
      return null;
    }
  },

  async setRefreshToken(refreshToken) {
    try {
      const encryptedToken = await this.encryptData(refreshToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, encryptedToken);
    } catch (error) {
      if (__DEV__) console.error("Error setting secure refresh token:", error);
      throw new Error("Failed to store refresh token");
    }
  },

  async clearTokens() {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
    } catch (error) {
      if (__DEV__) console.error("Error clearing secure tokens:", error);
    }
  },
};

// Keep old tokenManager for compatibility but redirect to secure version
const tokenManager = secureTokenManager;

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response time for debugging (only in development)
    if (__DEV__) {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`API Request to ${response.config.url} took ${duration}ms`);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(
            `${currentConfig.baseURL}/auth/refresh`,
            {
              refresh_token: refreshToken,
            },
          );

          const { access_token, refresh_token: newRefreshToken } =
            response.data;

          await tokenManager.setToken(access_token);
          await tokenManager.setRefreshToken(newRefreshToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        await tokenManager.clearTokens();
        // You can dispatch a logout action here
        throw refreshError;
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = "Network error. Please check your internet connection.";
    }

    return Promise.reject(error);
  },
);

// API service methods
export const apiService = {
  // Authentication endpoints
  auth: {
    async login(email, password) {
      const response = await apiClient.post("/auth/login", { email, password });
      const { access_token, refresh_token, user } = response.data;

      await tokenManager.setToken(access_token);
      await tokenManager.setRefreshToken(refresh_token);

      return { user, token: access_token };
    },

    async register(userData) {
      const response = await apiClient.post("/auth/register", userData);
      const { access_token, refresh_token, user } = response.data;

      await tokenManager.setToken(access_token);
      await tokenManager.setRefreshToken(refresh_token);

      return { user, token: access_token };
    },

    async logout() {
      try {
        await apiClient.post("/auth/logout");
      } catch (error) {
        console.warn("Logout request failed:", error);
      } finally {
        await tokenManager.clearTokens();
      }
    },

    async forgotPassword(email) {
      return await apiClient.post("/auth/forgot-password", { email });
    },

    async resetPassword(token, newPassword) {
      return await apiClient.post("/auth/reset-password", {
        token,
        password: newPassword,
      });
    },
  },

  // User profile endpoints
  user: {
    async getProfile() {
      const response = await apiClient.get("/user/profile");
      return response.data;
    },

    async updateProfile(profileData) {
      const response = await apiClient.put("/user/profile", profileData);
      return response.data;
    },

    async uploadAvatar(imageUri) {
      const formData = new FormData();
      formData.append("avatar", {
        uri: imageUri,
        type: "image/jpeg",
        name: "avatar.jpg",
      });

      const response = await apiClient.post("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },

    async getStats() {
      const response = await apiClient.get("/user/stats");
      return response.data;
    },
  },

  // Mental health assessments
  assessments: {
    async getAvailable() {
      const response = await apiClient.get("/assessments");
      return response.data;
    },

    async submitPHQ9(responses) {
      const response = await apiClient.post("/assessments/phq9", { responses });
      return response.data;
    },

    async submitGAD7(responses) {
      const response = await apiClient.post("/assessments/gad7", { responses });
      return response.data;
    },

    async getHistory(limit = 10) {
      const response = await apiClient.get(
        `/assessments/history?limit=${limit}`,
      );
      return response.data;
    },

    async getResult(assessmentId) {
      const response = await apiClient.get(`/assessments/${assessmentId}`);
      return response.data;
    },
  },

  // Mood tracking
  mood: {
    async logMood(moodData) {
      const response = await apiClient.post("/mood/log", moodData);
      return response.data;
    },

    async getMoodHistory(startDate, endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await apiClient.get(`/mood/history?${params}`);
      return response.data;
    },

    async getMoodInsights() {
      const response = await apiClient.get("/mood/insights");
      return response.data;
    },

    async getWeeklyStats() {
      const response = await apiClient.get("/mood/weekly-stats");
      return response.data;
    },
  },

  // AI Chat endpoints
  chat: {
    async sendMessage(message, conversationId = null) {
      const response = await apiClient.post("/chat/message", {
        message,
        conversation_id: conversationId,
      });
      return response.data;
    },

    async getConversations(limit = 20) {
      const response = await apiClient.get(
        `/chat/conversations?limit=${limit}`,
      );
      return response.data;
    },

    async getConversation(conversationId) {
      const response = await apiClient.get(
        `/chat/conversations/${conversationId}`,
      );
      return response.data;
    },

    async deleteConversation(conversationId) {
      await apiClient.delete(`/chat/conversations/${conversationId}`);
    },

    async getChatInsights() {
      const response = await apiClient.get("/chat/insights");
      return response.data;
    },
  },

  // Crisis support
  crisis: {
    async triggerEmergencyProtocol(severity = "high") {
      const response = await apiClient.post("/crisis/emergency", { severity });
      return response.data;
    },

    async getEmergencyContacts() {
      const response = await apiClient.get("/crisis/contacts");
      return response.data;
    },

    async reportCrisis(crisisData) {
      const response = await apiClient.post("/crisis/report", crisisData);
      return response.data;
    },
  },

  // App feedback and analytics
  feedback: {
    async submitFeedback(feedbackData) {
      const response = await apiClient.post("/feedback", feedbackData);
      return response.data;
    },

    async reportBug(bugReport) {
      const response = await apiClient.post("/feedback/bug", bugReport);
      return response.data;
    },

    async trackEvent(eventName, eventData) {
      // Only track in production
      if (getEnvironment() === "production") {
        try {
          await apiClient.post("/analytics/event", {
            event_name: eventName,
            event_data: eventData,
            platform: Platform.OS,
          });
        } catch (error) {
          console.warn("Analytics tracking failed:", error);
        }
      }
    },
  },
};

// Health check utility
export const healthCheck = async () => {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    throw new Error("API health check failed");
  }
};

// Export utilities
export { tokenManager };
export default apiService;
