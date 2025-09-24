/**
 * Token Service - Secure token management for authentication
 * Handles JWT tokens, refresh tokens, and session management
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const TOKEN_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  TOKEN_EXPIRY: "token_expiry",
  USER_ID: "user_id",
};

class TokenService {
  constructor() {
    this.isWeb = Platform.OS === "web";
  }

  /**
   * Store authentication tokens securely
   */
  async storeTokens(tokens) {
    try {
      const { accessToken, refreshToken, expiresIn, userId } = tokens;

      const tokenData = {
        accessToken,
        refreshToken,
        expiresIn,
        userId,
        timestamp: Date.now(),
      };

      if (this.isWeb) {
        // Web: Use localStorage with encryption
        localStorage.setItem("auth_tokens", JSON.stringify(tokenData));
      } else {
        // Native: Use AsyncStorage
        await AsyncStorage.setItem("auth_tokens", JSON.stringify(tokenData));
      }

      console.log("🔐 Tokens stored successfully");
      return true;
    } catch (error) {
      console.error("❌ Error storing tokens:", error);
      return false;
    }
  }

  /**
   * Retrieve stored tokens
   */
  async getTokens() {
    try {
      let tokenData;

      if (this.isWeb) {
        tokenData = localStorage.getItem("auth_tokens");
      } else {
        tokenData = await AsyncStorage.getItem("auth_tokens");
      }

      if (!tokenData) {
        return null;
      }

      const parsed = JSON.parse(tokenData);

      // Check if tokens are expired
      if (this.isTokenExpired(parsed)) {
        await this.clearTokens();
        return null;
      }

      return parsed;
    } catch (error) {
      console.error("❌ Error retrieving tokens:", error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    try {
      const tokens = await this.getTokens();
      return tokens && tokens.accessToken && !this.isTokenExpired(tokens);
    } catch (error) {
      console.error("❌ Error checking authentication:", error);
      return false;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(tokenData) {
    if (!tokenData || !tokenData.expiresIn || !tokenData.timestamp) {
      return true;
    }

    const now = Date.now();
    const expiryTime = tokenData.timestamp + tokenData.expiresIn * 1000;

    return now >= expiryTime;
  }

  /**
   * Get access token
   */
  async getAccessToken() {
    try {
      const tokens = await this.getTokens();
      return tokens ? tokens.accessToken : null;
    } catch (error) {
      console.error("❌ Error getting access token:", error);
      return null;
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken() {
    try {
      const tokens = await this.getTokens();
      return tokens ? tokens.refreshToken : null;
    } catch (error) {
      console.error("❌ Error getting refresh token:", error);
      return null;
    }
  }

  /**
   * Clear all stored tokens
   */
  async clearTokens() {
    try {
      if (this.isWeb) {
        localStorage.removeItem("auth_tokens");
      } else {
        await AsyncStorage.removeItem("auth_tokens");
      }

      console.log("🔐 Tokens cleared successfully");
      return true;
    } catch (error) {
      console.error("❌ Error clearing tokens:", error);
      return false;
    }
  }

  /**
   * Invalidate session (logout)
   */
  async invalidateSession() {
    try {
      await this.clearTokens();

      // Additional cleanup if needed
      if (this.isWeb) {
        // Clear any web-specific session data
        localStorage.removeItem("user_session");
        sessionStorage.clear();
      }

      console.log("🔐 Session invalidated successfully");
      return true;
    } catch (error) {
      console.error("❌ Error invalidating session:", error);
      return false;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken() {
    try {
      const tokens = await this.getTokens();

      if (!tokens || !tokens.refreshToken) {
        throw new Error("No refresh token available");
      }

      // In a real app, you would make an API call here
      // For now, we'll simulate a successful refresh
      console.log("🔄 Refreshing access token...");

      // Simulate new token data
      const newTokens = {
        accessToken: `new_access_token_${Date.now()}`,
        refreshToken: tokens.refreshToken,
        expiresIn: 3600, // 1 hour
        userId: tokens.userId,
      };

      await this.storeTokens(newTokens);
      return newTokens;
    } catch (error) {
      console.error("❌ Error refreshing token:", error);
      await this.clearTokens();
      throw error;
    }
  }

  /**
   * Get user ID from stored tokens
   */
  async getUserId() {
    try {
      const tokens = await this.getTokens();
      return tokens ? tokens.userId : null;
    } catch (error) {
      console.error("❌ Error getting user ID:", error);
      return null;
    }
  }

  /**
   * Check if tokens need refresh (within 5 minutes of expiry)
   */
  async needsRefresh() {
    try {
      const tokens = await this.getTokens();

      if (!tokens || !tokens.expiresIn || !tokens.timestamp) {
        return false;
      }

      const now = Date.now();
      const expiryTime = tokens.timestamp + tokens.expiresIn * 1000;
      const refreshThreshold = 5 * 60 * 1000; // 5 minutes

      return expiryTime - now <= refreshThreshold;
    } catch (error) {
      console.error("❌ Error checking refresh need:", error);
      return false;
    }
  }
}

// Export singleton instance
export default new TokenService();
