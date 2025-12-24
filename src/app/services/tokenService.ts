/**
 * Token Service for managing authentication tokens
 * Handles secure storage and retrieval of access/refresh tokens
 */

import { logger } from "@shared/utils/logger";

import secureStorage from "./secureStorage";
import { STORAGE_CONFIG } from "../../shared/config/environment";

// MED-010 FIX: Type for refresh token callback to avoid circular imports
type RefreshTokenCallback = (refreshToken: string) => Promise<any>;

// MED-NEW-010 FIX: Lazy-loaded API module reference for automatic circular dependency resolution
let lazyApiModule: { refreshAccessToken?: RefreshTokenCallback } | null = null;

class TokenService {
  private storage: typeof secureStorage;
  private refreshPromise: Promise<any> | null = null;
  // MED-010 FIX: Callback registration pattern (preferred for explicit control)
  private refreshTokenCallback: RefreshTokenCallback | null = null;

  constructor() {
    this.storage = secureStorage;
  }

  /**
   * MED-010 FIX: Register the refresh token callback from the API service
   * This is the preferred method for explicit dependency injection
   * MED-NEW-010 FIX: Now optional - system will use lazy import as fallback
   */
  registerRefreshCallback(callback: RefreshTokenCallback): void {
    this.refreshTokenCallback = callback;
  }

  /**
   * MED-NEW-010 FIX: Get refresh function with automatic fallback to lazy import
   * This eliminates the need for manual callback registration
   */
  private async getRefreshFunction(): Promise<RefreshTokenCallback | null> {
    // Prefer explicitly registered callback
    if (this.refreshTokenCallback) {
      return this.refreshTokenCallback;
    }

    // MED-NEW-010 FIX: Lazy import as automatic fallback
    // Dynamic import() is evaluated at runtime, avoiding circular dependency at load time
    try {
      if (!lazyApiModule) {
        // Use dynamic import to load api module lazily
        const apiModule = await import('./api');
        // Extract the refresh function from the default export or named export
        if (apiModule.default?.refreshAccessToken) {
          lazyApiModule = { refreshAccessToken: apiModule.default.refreshAccessToken };
        } else if (typeof apiModule.refreshAccessToken === 'function') {
          lazyApiModule = { refreshAccessToken: apiModule.refreshAccessToken };
        }
      }

      if (lazyApiModule?.refreshAccessToken) {
        logger.debug('[TokenService] Using lazy-loaded API refresh function');
        return lazyApiModule.refreshAccessToken;
      }
    } catch (importError) {
      logger.warn('[TokenService] Failed to lazy-load API module:', importError);
    }

    return null;
  }

  /**
   * Store authentication tokens securely
   * HIGH-006 FIX: Accepts both camelCase and snake_case parameters for flexibility
   * Uses API-provided expiration when available, with sensible fallback
   */
  async storeTokens(params: {
    // CamelCase format (preferred)
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    // Snake_case format (API response format) - HIGH-006/CRIT-006 FIX
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  }) {
    // HIGH-006 FIX: Support both camelCase and snake_case property names
    const accessToken = params.accessToken || params.access_token;
    const refreshToken = params.refreshToken || params.refresh_token;

    if (!accessToken || !refreshToken) {
      throw new Error("Access token and refresh token are required");
    }

    // HIGH-006 FIX: Calculate expiration from multiple sources
    // Priority: expiresAt > expires_in > default
    let expiresAt: number;
    if (params.expiresAt) {
      // Explicit expiresAt timestamp provided
      expiresAt = params.expiresAt;
    } else if (params.expires_in) {
      // API-provided expires_in (in seconds) - convert to timestamp
      // HIGH-NEW-006 FIX: Use dynamic buffer based on token lifetime
      // - 5% of token lifetime, minimum 10 seconds, maximum 60 seconds
      // - This prevents aggressive buffering for short-lived tokens
      const expiresInSeconds = params.expires_in;
      const dynamicBuffer = Math.min(60, Math.max(10, Math.floor(expiresInSeconds * 0.05)));
      expiresAt = Date.now() + (expiresInSeconds - dynamicBuffer) * 1000;
    } else {
      // Default: 55 minutes (typical OAuth2 tokens are 1 hour)
      // This avoids unnecessary refreshes while still being conservative
      expiresAt = Date.now() + 55 * 60 * 1000;
    }

    const tokenData = {
      accessToken,
      refreshToken,
      expiresAt,
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
      if (typeof tokenData.expiresAt === 'number' && Date.now() > tokenData.expiresAt) {
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
   * HIGH-002 FIX: Enhanced validation for token expiration
   * HIGH-NEW-002 FIX: Properly handle expiresAt === 0 as a valid (but expired) timestamp
   * @returns {Promise<boolean>} True if expired
   */
  async isTokenExpired(): Promise<boolean> {
    const tokens = await this.getTokens();

    // No tokens means expired
    if (!tokens) {
      return true;
    }

    // Missing access token means expired
    if (!tokens.accessToken) {
      return true;
    }

    // HIGH-NEW-002 FIX: Check type first, then check if expiration is set
    // expiresAt === 0 is a valid Unix timestamp (Jan 1, 1970) and should be treated as expired
    if (typeof tokens.expiresAt !== 'number') {
      // No expiration set (undefined/null) - treat as expired for safety
      return true;
    }

    // Check if expiration is in the past (includes expiresAt === 0)
    return Date.now() > tokens.expiresAt;
  }

  /**
   * Validate token structure and expiration
   * HIGH-002 FIX: Comprehensive token validation
   * HIGH-NEW-002 FIX: Properly distinguish between missing expiration and expired tokens
   * @returns {Promise<{valid: boolean, reason?: string}>} Validation result
   */
  async validateToken(): Promise<{valid: boolean; reason?: string}> {
    try {
      const tokens = await this.getTokens();

      if (!tokens) {
        return { valid: false, reason: 'no_tokens' };
      }

      if (!tokens.accessToken || typeof tokens.accessToken !== 'string') {
        return { valid: false, reason: 'invalid_access_token' };
      }

      // HIGH-NEW-002 FIX: Check type separately from value
      // expiresAt === 0 is a valid number, just represents an expired timestamp
      if (typeof tokens.expiresAt !== 'number') {
        return { valid: false, reason: 'missing_expiration' };
      }

      // Now check if token is expired (includes expiresAt === 0)
      if (Date.now() > tokens.expiresAt) {
        return { valid: false, reason: 'expired' };
      }

      // Token is valid
      return { valid: true };
    } catch (error) {
      logger.warn("Token validation failed:", error);
      return { valid: false, reason: 'validation_error' };
    }
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

        // MED-NEW-010 FIX: Use getRefreshFunction for automatic dependency resolution
        // This tries registered callback first, then falls back to lazy import
        const refreshFunction = await this.getRefreshFunction();
        if (!refreshFunction) {
          logger.error("[TokenService] No refresh function available. Either register callback or ensure api.ts exports refreshAccessToken");
          return null;
        }

        const response = await refreshFunction(refreshToken);

        // Extract tokens from response data (handle multiple response formats)
        const tokenData = (response as any)?.data || response;
        const accessToken = (tokenData as any)?.access_token || (tokenData as any)?.accessToken;
        const newRefreshToken = (tokenData as any)?.refresh_token || (tokenData as any)?.refreshToken || refreshToken;
        const expiresIn = (tokenData as any)?.expires_in || (tokenData as any)?.expiresIn || 3600;

        await this.storeTokens({
          accessToken,
          refreshToken: newRefreshToken,
          expiresAt: Date.now() + expiresIn * 1000,
        });

        return {
          accessToken,
          refreshToken: newRefreshToken,
          expiresAt: Date.now() + expiresIn * 1000,
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
