import { logger } from "@shared/utils/logger";

/**
 * API Service - Centralized API client for Solace AI Mobile
 * Handles all backend communication with proper error handling and retry logic
 */

import { API_CONFIG } from "../config/environment";

/**
 * Custom API Error class
 */
class APIError extends Error {
  constructor(message, statusCode, endpoint) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Helper function to handle API requests with retry logic
 * Throws APIError on failure - callers must handle errors
 */
async function fetchWithRetry(
  url,
  options = {},
  attempts = API_CONFIG.retryAttempts,
) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        url,
      );
    }

    return await response.json();
  } catch (error) {
    // Don't retry on abort or client errors (4xx)
    const shouldRetry =
      attempts > 1 &&
      error.name !== "AbortError" &&
      (!error.statusCode || error.statusCode >= 500);

    if (shouldRetry) {
      await new Promise((resolve) =>
        setTimeout(resolve, API_CONFIG.retryDelay),
      );
      return fetchWithRetry(url, options, attempts - 1);
    }

    // Wrap non-APIError errors
    if (!(error instanceof APIError)) {
      throw new APIError(error.message, null, url);
    }

    throw error;
  }
}

/**
 * Safely execute an API call with optional fallback value
 * Use this wrapper when you want to provide a default value on error
 *
 * @param {Function} apiCall - The API function to call
 * @param {*} fallbackValue - Value to return on error
 * @param {boolean} logError - Whether to log errors (default: true)
 * @returns {Promise<*>} API result or fallback value
 */
export async function safeAPICall(
  apiCall,
  fallbackValue = null,
  logError = true,
) {
  try {
    return await apiCall();
  } catch (error) {
    if (logError) {
      logger.error("[API] Safe call failed:", error.message, error.endpoint);
    }
    return fallbackValue;
  }
}

// Mood Tracking API
// NOTE: All methods throw APIError on failure
// Use safeAPICall wrapper if you need fallback values
export const moodAPI = {
  /**
   * Fetch mood history for the current user
   * @param {Object} params - Query parameters (limit, offset, startDate, endDate)
   * @returns {Promise<Array>} Array of mood entries
   * @throws {APIError} On request failure
   */
  getMoodHistory: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_CONFIG.baseURL}/mood${queryString ? `?${queryString}` : ""}`;
    return await fetchWithRetry(url);
  },

  /**
   * Save a new mood entry
   * @param {Object} moodData - Mood entry data
   * @returns {Promise<Object>} Created mood entry
   * @throws {APIError} On request failure
   */
  saveMood: async (moodData) => {
    return await fetchWithRetry(`${API_CONFIG.baseURL}/mood`, {
      method: "POST",
      body: JSON.stringify(moodData),
    });
  },

  /**
   * Update an existing mood entry
   * @param {string|number} id - Mood entry ID
   * @param {Object} moodData - Updated mood data
   * @returns {Promise<Object>} Updated mood entry
   * @throws {APIError} On request failure
   */
  updateMood: async (id, moodData) => {
    return await fetchWithRetry(`${API_CONFIG.baseURL}/mood/${id}`, {
      method: "PUT",
      body: JSON.stringify(moodData),
    });
  },

  /**
   * Delete a mood entry
   * @param {string|number} id - Mood entry ID
   * @returns {Promise<Object>} Deletion confirmation
   * @throws {APIError} On request failure
   */
  deleteMood: async (id) => {
    return await fetchWithRetry(`${API_CONFIG.baseURL}/mood/${id}`, {
      method: "DELETE",
    });
  },
};

// Assessment API
// NOTE: All methods throw APIError on failure
// Use safeAPICall wrapper if you need fallback values
export const assessmentAPI = {
  /**
   * Fetch available assessments
   * @returns {Promise<Array>} List of available assessments
   * @throws {APIError} On request failure
   */
  getAvailableAssessments: async () => {
    return await fetchWithRetry(`${API_CONFIG.baseURL}/assessments`);
  },

  /**
   * Fetch assessment questions
   * @param {string} assessmentType - Type of assessment (phq9, gad7, etc.)
   * @returns {Promise<Object>} Assessment with questions
   * @throws {APIError} On request failure
   */
  getAssessmentQuestions: async (assessmentType) => {
    return await fetchWithRetry(
      `${API_CONFIG.baseURL}/assessments/${assessmentType}`,
    );
  },

  /**
   * Submit completed assessment
   * @param {string} assessmentId - Assessment ID
   * @param {Object} responses - User responses
   * @returns {Promise<Object>} Assessment results
   * @throws {APIError} On request failure
   */
  submitAssessment: async (assessmentId, responses) => {
    return await fetchWithRetry(
      `${API_CONFIG.baseURL}/assessments/${assessmentId}/submit`,
      {
        method: "POST",
        body: JSON.stringify({ responses }),
      },
    );
  },

  /**
   * Get assessment history
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Assessment history
   * @throws {APIError} On request failure
   */
  getAssessmentHistory: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_CONFIG.baseURL}/assessments/history${queryString ? `?${queryString}` : ""}`;
    return await fetchWithRetry(url);
  },
};

// Chat/Therapy API
// NOTE: All methods throw APIError on failure
export const chatAPI = {
  /**
   * Send a message to the AI therapist
   * @param {string} message - User message
   * @param {string} sessionId - Chat session ID
   * @returns {Promise<Object>} AI response
   * @throws {APIError} On request failure
   */
  sendMessage: async (message, sessionId) => {
    return await fetchWithRetry(`${API_CONFIG.baseURL}/chat/message`, {
      method: "POST",
      body: JSON.stringify({ message, sessionId }),
    });
  },

  /**
   * Get chat history
   * @param {string} sessionId - Chat session ID
   * @returns {Promise<Array>} Chat history
   * @throws {APIError} On request failure
   */
  getChatHistory: async (sessionId) => {
    return await fetchWithRetry(
      `${API_CONFIG.baseURL}/chat/history/${sessionId}`,
    );
  },
};

// User API
// NOTE: All methods throw APIError on failure
export const userAPI = {
  /**
   * Get user profile
   * @returns {Promise<Object>} User profile
   * @throws {APIError} On request failure
   */
  getProfile: async () => {
    return await fetchWithRetry(`${API_CONFIG.baseURL}/user/profile`);
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile
   * @throws {APIError} On request failure
   */
  updateProfile: async (profileData) => {
    return await fetchWithRetry(`${API_CONFIG.baseURL}/user/profile`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },
};

// Consolidated API export (backward compatibility)
export const api = {
  ...moodAPI,
  ...assessmentAPI,
  ...chatAPI,
  ...userAPI,
};

export default api;
