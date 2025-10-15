/**
 * Token Service for managing authentication tokens
 * Handles secure storage and retrieval of access/refresh tokens
 */

import { STORAGE_CONFIG } from '../../shared/config/environment';

class TokenService {
  constructor() {
    this.storage = require('./secureStorage').default;
  }

  /**
   * Store authentication tokens securely
   * @param {Object} tokens - Token data
   * @param {string} tokens.accessToken - Access token
   * @param {string} tokens.refreshToken - Refresh token
   * @param {number} tokens.expiresAt - Token expiration timestamp
   */
  async storeTokens({ accessToken, refreshToken, expiresAt }) {
    if (!accessToken || !refreshToken) {
      throw new Error('Access token and refresh token are required');
    }

    const tokenData = {
      accessToken,
      refreshToken,
      expiresAt: expiresAt || (Date.now() + 3600 * 1000), // Default 1 hour
      storedAt: Date.now(),
    };

    await this.storage.storeSecureData(
      `${STORAGE_CONFIG.keyPrefix}auth_tokens`,
      tokenData,
      { dataType: 'auth_tokens' }
    );
  }

  /**
   * Retrieve stored authentication tokens
   * @returns {Promise<Object|null>} Token data or null if not found
   */
  async getTokens() {
    try {
      const tokenData = await this.storage.getSecureData(
        `${STORAGE_CONFIG.keyPrefix}auth_tokens`
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
      console.warn('Failed to retrieve tokens:', error);
      return null;
    }
  }

  /**
   * Clear stored authentication tokens
   */
  async clearTokens() {
    try {
      await this.storage.removeSecureData(`${STORAGE_CONFIG.keyPrefix}auth_tokens`);
    } catch (error) {
      console.warn('Failed to clear tokens:', error);
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
      return !!(tokens?.accessToken);
    } catch (error) {
      console.warn('Failed to check authentication status:', error);
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
   * @returns {Promise<Object|null>} New token data or null on failure
   */
  async refreshAccessToken() {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const apiService = require('./api').default;
      const newTokens = await apiService.auth.refreshToken(refreshToken);

      await this.storeTokens({
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token || refreshToken, // Use new refresh token or keep existing
        expiresAt: Date.now() + (newTokens.expires_in || 3600) * 1000,
      });

      return {
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token || refreshToken,
        expiresAt: Date.now() + (newTokens.expires_in || 3600) * 1000,
      };
    } catch (error) {
      console.warn('Failed to refresh access token:', error);
      // Clear invalid tokens
      await this.clearTokens();
      return null;
    }
  }

  /**
   * Invalidate current session
   * Clears all tokens and session data
   */
  async invalidateSession() {
    await this.clearTokens();

    // Also clear any session-specific data
    try {
      const secureStorage = require('./secureStorage').default;
      await secureStorage.removeSecureData(`${STORAGE_CONFIG.keyPrefix}session_data`);
    } catch (error) {
      console.warn('Failed to clear session data:', error);
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
   * Check if token needs refresh (expires within next 5 minutes)
   * @returns {Promise<boolean>} True if refresh needed
   */
  async shouldRefreshToken() {
    const tokens = await this.getTokens();
    if (!tokens?.expiresAt) {
      return true;
    }

    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
    return tokens.expiresAt < fiveMinutesFromNow;
  }
}

// Export singleton instance
const tokenService = new TokenService();
export default tokenService;