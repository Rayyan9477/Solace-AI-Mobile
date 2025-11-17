/**
 * API Service for authentication and user management
 * Real implementation for production use
 */

import { logger } from "@shared/utils/logger";

import apiCache from "./apiCache";
import tokenService from "./tokenService";
import { API_CONFIG } from "../../shared/config/environment";

/**
 * Custom API Error class for authentication
 */
export class AuthAPIError extends Error {
  statusCode: number | null;
  endpoint: string;
  timestamp: string;

  constructor(message: string, statusCode: number | null, endpoint: string) {
    super(message);
    this.name = "AuthAPIError";
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Helper function for fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: any = {},
  timeout = API_CONFIG.timeout,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new AuthAPIError("Request timeout", 408, url);
    }
    throw error;
  }
}

/**
 * Helper function to handle token refresh
 */
async function refreshAccessToken(refreshToken: string): Promise<any> {
  const response = await fetchWithTimeout(
    `${API_CONFIG.baseURL}/auth/refresh`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AuthAPIError(
      errorData.message || "Token refresh failed",
      response.status,
      "/auth/refresh",
    );
  }

  return await response.json();
}

/**
 * Helper function to retry request with new token
 */
async function retryWithNewToken(
  url: string,
  options: any,
  newTokens: any,
): Promise<any> {
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${newTokens.accessToken}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AuthAPIError(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      url,
    );
  }

  return await response.json();
}

const tokenRefreshAttempts = new Map();
const MAX_REFRESH_ATTEMPTS = 2;
const REFRESH_ATTEMPT_WINDOW = 60000;

async function authenticatedFetch(
  url: string,
  options: any = {},
): Promise<any> {
  const method = options.method || "GET";

  // Check cache for GET requests
  if (method === "GET") {
    const cached = apiCache.get(url, options);
    if (cached) {
      return cached;
    }
  }

  const tokens = await tokenService.getTokens();

  const headers: any = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (tokens?.accessToken) {
    headers["Authorization"] = `Bearer ${tokens.accessToken}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    if (response.status === 401 && tokens?.refreshToken) {
      const now = Date.now();
      const attemptKey = tokens.refreshToken.substring(0, 10);
      const attemptRecord = tokenRefreshAttempts.get(attemptKey);

      if (
        attemptRecord &&
        now - attemptRecord.firstAttempt < REFRESH_ATTEMPT_WINDOW
      ) {
        if (attemptRecord.count >= MAX_REFRESH_ATTEMPTS) {
          tokenRefreshAttempts.delete(attemptKey);
          await tokenService.clearTokens();
          throw new AuthAPIError(
            "Maximum token refresh attempts exceeded",
            401,
            url,
          );
        }
        attemptRecord.count++;
      } else {
        tokenRefreshAttempts.set(attemptKey, { count: 1, firstAttempt: now });
      }

      try {
        const newTokens = await refreshAccessToken(tokens.refreshToken);

        if (!newTokens?.access_token) {
          throw new Error("Invalid token response");
        }

        const transformedTokens = {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token || tokens.refreshToken,
          expiresAt: Date.now() + (newTokens.expires_in || 3600) * 1000,
        };

        await tokenService.storeTokens(transformedTokens);
        tokenRefreshAttempts.delete(attemptKey);

        return await retryWithNewToken(url, options, transformedTokens);
      } catch (refreshError) {
        logger.warn("Token refresh failed", refreshError);
        await tokenService.clearTokens();
        throw new AuthAPIError("Authentication expired", 401, url);
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        url,
      );
    }

    const data = await response.json();

    // Cache GET requests
    if (method === "GET") {
      apiCache.set(url, data, options);
    }

    // Invalidate related cache on mutations
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      const urlPattern = new RegExp(url.split("/").slice(0, -1).join("/"));
      apiCache.invalidatePattern(urlPattern);
    }

    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new AuthAPIError("Request timeout", 408, url);
    }

    if (!(error instanceof AuthAPIError)) {
      throw new AuthAPIError(error.message, null, url);
    }

    throw error;
  }
}

/**
 * Authentication API methods
 */
const authAPI = {
  /**
   * User login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response with user and tokens
   */
  async login(email: string, password: string): Promise<any> {
    if (!email || !password) {
      throw new AuthAPIError(
        "Email and password are required",
        400,
        "/auth/login",
      );
    }

    const response = await fetchWithTimeout(
      `${API_CONFIG.baseURL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || "Login failed",
        response.status,
        "/auth/login",
      );
    }

    const data = await response.json();

    await tokenService.storeTokens({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
    });

    return {
      user: data.user,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  },

  /**
   * User registration
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response
   */
  async register(userData: any): Promise<any> {
    const { email, password, name, ...additionalData } = userData;

    if (!email || !password || !name) {
      throw new AuthAPIError(
        "Email, password, and name are required",
        400,
        "/auth/register",
      );
    }

    const response = await fetchWithTimeout(
      `${API_CONFIG.baseURL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, ...additionalData }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || "Registration failed",
        response.status,
        "/auth/register",
      );
    }

    return await response.json();
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New tokens
   */
  async refreshToken(refreshToken: string): Promise<any> {
    const response = await fetchWithTimeout(
      `${API_CONFIG.baseURL}/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || "Token refresh failed",
        response.status,
        "/auth/refresh",
      );
    }

    return await response.json();
  },

  /**
   * Logout user
   * @returns {Promise<Object>} Logout confirmation
   */
  async logout() {
    try {
      const tokens = await tokenService.getTokens();

      if (tokens?.accessToken) {
        await authenticatedFetch(`${API_CONFIG.baseURL}/auth/logout`, {
          method: "POST",
        });
      }
    } catch (error: any) {
      logger.warn("API logout failed:", error.message);
    }

    await tokenService.clearTokens();

    return { success: true };
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile
   */
  async getProfile() {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/auth/profile`);
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(profileData: any): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/auth/profile`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password change confirmation
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<any> {
    return await authenticatedFetch(
      `${API_CONFIG.baseURL}/auth/change-password`,
      {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      },
    );
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset request confirmation
   */
  async requestPasswordReset(email: string): Promise<any> {
    const response = await fetchWithTimeout(
      `${API_CONFIG.baseURL}/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || "Password reset request failed",
        response.status,
        "/auth/forgot-password",
      );
    }

    return await response.json();
  },

  /**
   * Reset password with token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password reset confirmation
   */
  async resetPassword(token: string, newPassword: string): Promise<any> {
    const response = await fetchWithTimeout(
      `${API_CONFIG.baseURL}/auth/reset-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || "Password reset failed",
        response.status,
        "/auth/reset-password",
      );
    }

    return await response.json();
  },

  /**
   * Verify MFA code
   * @param {Object} mfaData - MFA verification data
   * @returns {Promise<Object>} MFA verification response
   */
  async verifyMfa(mfaData: { mfaToken: string; code: string }): Promise<any> {
    const response = await fetchWithTimeout(
      `${API_CONFIG.baseURL}/auth/verify-mfa`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mfaData),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || "MFA verification failed",
        response.status,
        "/auth/verify-mfa",
      );
    }

    const data = await response.json();

    // Store tokens after successful MFA
    if (data.access_token) {
      await tokenService.storeTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
      });
    }

    return {
      user: data.user,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  },
};

/**
 * User management API methods
 */
const userAPI = {
  /**
   * Get user preferences
   * @returns {Promise<Object>} User preferences
   */
  async getPreferences() {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/user/preferences`);
  },

  /**
   * Update user preferences
   * @param {Object} preferences - User preferences
   * @returns {Promise<Object>} Updated preferences
   */
  async updatePreferences(preferences: any): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/user/preferences`, {
      method: "PUT",
      body: JSON.stringify(preferences),
    });
  },

  /**
   * Delete user account
   * @returns {Promise<Object>} Account deletion confirmation
   */
  async deleteAccount() {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/user/account`, {
      method: "DELETE",
    });
  },
};

const apiService = {
  auth: authAPI,
  user: userAPI,
};

export default apiService;
