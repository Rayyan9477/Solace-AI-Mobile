/**
 * Token Service for managing authentication tokens
 * Handles secure storage and retrieval of access/refresh tokens
 */

import { logger } from "@shared/utils/logger";

import secureStorage from "./secureStorage";
import { STORAGE_CONFIG } from "../../shared/config/environment";

class TokenService {
  private storage: typeof secureStorage;
  private refreshPromise: Promise<any> | null = null;

  constructor() {
    this.storage = secureStorage;
  }

  /**
   * Store authentication tokens securely
   * Default expiration is 15 minutes for health data security
   */
  async storeTokens({
    accessToken,
    refreshToken,
    expiresAt,
  }: {
    accessToken: string;
    refreshToken: string;
    expiresAt?: number;
  }) {
    if (!accessToken || !refreshToken) {
      throw new Error("Access token and refresh token are required");
    }

    const tokenData = {
      accessToken,
      refreshToken,
      // Reduced to 15 minutes (900 seconds) for health data security
      // Previous default was 1 hour (3600 seconds)
      expiresAt: expiresAt || Date.now() + 900 * 1000, // Default 15 minutes
      storedAt: Date.now(),
    };

    await this.storage.storeSecureData(
      `${STORAGE_CONFIG.keyPrefix}auth_tokens`,
      tokenData,
      { dataType: "auth_tokens" },
    );
  }

  /**
   * Retrieve stored authentication tokens
   * @returns {Promise<Object|null>} Token data or null if not found
   */
  async getTokens() {
    try {
      const tokenData = await this.storage.getSecureData(
        `${STORAGE_CONFIG.keyPrefix}auth_tokens`,
      );

      if (!tokenData) {
        return null;
      }

      // Check if tokens are expired
      if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
        // Tokens are expired, clear them
        await this.clearTokens();
        return null;
      }

      return tokenData;
    } catch (error) {
      logger.warn("Failed to retrieve tokens:", error);
      return null;
    }
  }

  /**
   * Clear stored authentication tokens
   */
  async clearTokens() {
    try {
      await this.storage.removeSecureData(
        `${STORAGE_CONFIG.keyPrefix}auth_tokens`,
      );
    } catch (error) {
      logger.warn("Failed to clear tokens:", error);
      // Don't throw - clearing should be best effort
    }
  }

  /**
   * Check if user is currently authenticated
   * @returns {Promise<boolean>} Authentication status
   */
  async isAuthenticated() {
    try {
      const tokens = await this.getTokens();
      return !!tokens?.accessToken;
    } catch (error) {
      logger.warn("Failed to check authentication status:", error);
      return false;
    }
  }

  /**
   * Get access token for API calls
   * @returns {Promise<string|null>} Access token or null
   */
  async getAccessToken() {
    const tokens = await this.getTokens();
    return tokens?.accessToken || null;
  }

  /**
   * Get refresh token for token refresh
   * @returns {Promise<string|null>} Refresh token or null
   */
  async getRefreshToken() {
    const tokens = await this.getTokens();
    return tokens?.refreshToken || null;
  }

  /**
   * Check if access token is expired
   * @returns {Promise<boolean>} True if expired
   */
  async isTokenExpired() {
    const tokens = await this.getTokens();
    if (!tokens?.expiresAt) {
      return true;
    }
    return Date.now() > tokens.expiresAt;
  }
  /**
   * Refresh access token using refresh token
   * Implements mutex to prevent concurrent refresh attempts
   * @returns {Promise<Object|null>} New token data or null on failure
   */
  async refreshAccessToken() {
    // If refresh is already in progress, return the existing promise
    if (this.refreshPromise) {
      logger.info("Token refresh already in progress, waiting for result");
      return this.refreshPromise;
    }

    // Start new refresh and store the promise
    this.refreshPromise = (async () => {
      try {
        const refreshToken = await this.getRefreshToken();
        if (!refreshToken) {
          return null;
        }

        const apiService = await import("./api");
        const newTokens =
          await apiService.default.auth.refreshToken(refreshToken);

        await this.storeTokens({
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token || refreshToken,
          expiresAt: Date.now() + (newTokens.expires_in || 3600) * 1000,
        });

        return {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token || refreshToken,
          expiresAt: Date.now() + (newTokens.expires_in || 3600) * 1000,
        };
      } catch (error) {
        logger.warn("Failed to refresh access token:", error);
        await this.clearTokens();
        return null;
      } finally {
        // Clear the promise after completion
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Invalidate current session
   * Clears all tokens and session data
   */
  async invalidateSession() {
    await this.clearTokens();

    try {
      await secureStorage.removeSecureData(
        `${STORAGE_CONFIG.keyPrefix}session_data`,
      );
    } catch (error) {
      logger.warn("Failed to clear session data:", error);
    }
  }

  /**
   * Get token expiration time
   * @returns {Promise<number|null>} Expiration timestamp or null
   */
  async getTokenExpiration() {
    const tokens = await this.getTokens();
    return tokens?.expiresAt || null;
  }

  /**
   * Check if token needs refresh (expires within next 2 minutes)
   * Reduced threshold from 5 to 2 minutes to match shorter token expiration
   * @returns {Promise<boolean>} True if refresh needed
   */
  async shouldRefreshToken() {
    const tokens = await this.getTokens();
    if (!tokens?.expiresAt) {
      return true;
    }

    // Refresh if expires within next 2 minutes (reduced from 5 minutes)
    const twoMinutesFromNow = Date.now() + 2 * 60 * 1000;
    return tokens.expiresAt < twoMinutesFromNow;
  }
}

// Export singleton instance
const tokenService = new TokenService();
export default tokenService;
