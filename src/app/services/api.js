/**
 * API Service for authentication and user management
 * Real implementation for production use
 */

import { API_CONFIG } from '../../shared/config/environment';

/**
 * Custom API Error class for authentication
 */
export class AuthAPIError extends Error {
  constructor(message, statusCode, endpoint) {
    super(message);
    this.name = 'AuthAPIError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Helper function to handle token refresh
 */
async function refreshAccessToken(refreshToken) {
  const response = await fetch(`${API_CONFIG.baseURL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new AuthAPIError(
      errorData.message || 'Token refresh failed',
      response.status,
      '/auth/refresh'
    );
  }

  return await response.json();
}

/**
 * Helper function to retry request with new token
 */
async function retryWithNewToken(url, options, newTokens) {
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${newTokens.accessToken}`,
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
      url
    );
  }

  return await response.json();
}

/**
 * Helper function to handle API requests with authentication
 */
async function authenticatedFetch(url, options = {}) {
  const tokenService = require('./tokenService').default;
  const tokens = await tokenService.getTokens();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (tokens?.accessToken) {
    headers['Authorization'] = `Bearer ${tokens.accessToken}`;
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

    // Handle token refresh on 401
    if (response.status === 401 && tokens?.refreshToken) {
      try {
        const newTokens = await refreshAccessToken(tokens.refreshToken);
        await tokenService.storeTokens(newTokens);

        // Retry original request with new token
        return await retryWithNewToken(url, options, newTokens);
      } catch (refreshError) {
        console.warn('Token refresh failed:', refreshError);
        // Fall through to original error handling
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        url
      );
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new AuthAPIError('Request timeout', 408, url);
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
  async login(email, password) {
    if (!email || !password) {
      throw new AuthAPIError('Email and password are required', 400, '/auth/login');
    }

    const response = await fetch(`${API_CONFIG.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || 'Login failed',
        response.status,
        '/auth/login'
      );
    }

    const data = await response.json();

    // Store tokens securely
    const tokenService = require('./tokenService').default;
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
  async register(userData) {
    const { email, password, name, ...additionalData } = userData;

    if (!email || !password || !name) {
      throw new AuthAPIError('Email, password, and name are required', 400, '/auth/register');
    }

    const response = await fetch(`${API_CONFIG.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, ...additionalData }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || 'Registration failed',
        response.status,
        '/auth/register'
      );
    }

    return await response.json();
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} New tokens
   */
  async refreshToken(refreshToken) {
    const response = await fetch(`${API_CONFIG.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || 'Token refresh failed',
        response.status,
        '/auth/refresh'
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
      const tokenService = require('./tokenService').default;
      const tokens = await tokenService.getTokens();

      if (tokens?.accessToken) {
        await authenticatedFetch(`${API_CONFIG.baseURL}/auth/logout`, {
          method: 'POST',
        });
      }
    } catch (error) {
      // Log but don't throw - logout should succeed even if API call fails
      console.warn('API logout failed:', error.message);
    }

    // Always clear local tokens
    const tokenService = require('./tokenService').default;
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
  async updateProfile(profileData) {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password change confirmation
   */
  async changePassword(currentPassword, newPassword) {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Reset request confirmation
   */
  async requestPasswordReset(email) {
    const response = await fetch(`${API_CONFIG.baseURL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || 'Password reset request failed',
        response.status,
        '/auth/forgot-password'
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
  async resetPassword(token, newPassword) {
    const response = await fetch(`${API_CONFIG.baseURL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || 'Password reset failed',
        response.status,
        '/auth/reset-password'
      );
    }

    return await response.json();
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
  async updatePreferences(preferences) {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/user/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  },

  /**
   * Delete user account
   * @returns {Promise<Object>} Account deletion confirmation
   */
  async deleteAccount() {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/user/account`, {
      method: 'DELETE',
    });
  },
};

const apiService = {
  auth: authAPI,
  user: userAPI,
};

export default apiService;