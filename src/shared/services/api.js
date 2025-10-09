/**
 * API Service - Centralized API client for Solace AI Mobile
 * Handles all backend communication with proper error handling and retry logic
 */

// API Configuration
const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Helper function to handle API requests with retry logic
async function fetchWithRetry(url, options = {}, attempts = API_CONFIG.retryAttempts) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (attempts > 1 && error.name !== 'AbortError') {
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
      return fetchWithRetry(url, options, attempts - 1);
    }
    throw error;
  }
}

// Mood Tracking API
export const moodAPI = {
  /**
   * Fetch mood history for the current user
   * @param {Object} params - Query parameters (limit, offset, startDate, endDate)
   * @returns {Promise<Array>} Array of mood entries
   */
  getMoodHistory: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_CONFIG.baseURL}/mood${queryString ? `?${queryString}` : ''}`;

    try {
      return await fetchWithRetry(url);
    } catch (error) {
      console.warn('[API] getMoodHistory failed, returning empty array:', error.message);
      return [];
    }
  },

  /**
   * Save a new mood entry
   * @param {Object} moodData - Mood entry data
   * @returns {Promise<Object>} Created mood entry
   */
  saveMood: async (moodData) => {
    try {
      return await fetchWithRetry(`${API_CONFIG.baseURL}/mood`, {
        method: 'POST',
        body: JSON.stringify(moodData),
      });
    } catch (error) {
      console.warn('[API] saveMood failed, returning local entry:', error.message);
      return { id: Date.now(), ...moodData, _offline: true };
    }
  },

  /**
   * Update an existing mood entry
   * @param {string|number} id - Mood entry ID
   * @param {Object} moodData - Updated mood data
   * @returns {Promise<Object>} Updated mood entry
   */
  updateMood: async (id, moodData) => {
    try {
      return await fetchWithRetry(`${API_CONFIG.baseURL}/mood/${id}`, {
        method: 'PUT',
        body: JSON.stringify(moodData),
      });
    } catch (error) {
      console.warn('[API] updateMood failed, returning local update:', error.message);
      return { id, ...moodData, _offline: true };
    }
  },

  /**
   * Delete a mood entry
   * @param {string|number} id - Mood entry ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteMood: async (id) => {
    try {
      return await fetchWithRetry(`${API_CONFIG.baseURL}/mood/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.warn('[API] deleteMood failed:', error.message);
      return { success: false, error: error.message };
    }
  },
};

// Assessment API
export const assessmentAPI = {
  /**
   * Fetch available assessments
   * @returns {Promise<Array>} List of available assessments
   */
  getAvailableAssessments: async () => {
    try {
      return await fetchWithRetry(`${API_CONFIG.baseURL}/assessments`);
    } catch (error) {
      console.warn('[API] getAvailableAssessments failed, returning defaults:', error.message);
      return [
        {
          id: 'phq9',
          title: 'PHQ-9 Depression Assessment',
          description: 'Screen for depression symptoms',
          duration: '5-10 minutes',
          icon: '🧠',
        },
        {
          id: 'gad7',
          title: 'GAD-7 Anxiety Assessment',
          description: 'Screen for anxiety symptoms',
          duration: '3-5 minutes',
          icon: '😰',
        },
      ];
    }
  },

  /**
   * Fetch assessment questions
   * @param {string} assessmentType - Type of assessment (phq9, gad7, etc.)
   * @returns {Promise<Object>} Assessment with questions
   */
  getAssessmentQuestions: async (assessmentType) => {
    try {
      return await fetchWithRetry(`${API_CONFIG.baseURL}/assessments/${assessmentType}`);
    } catch (error) {
      console.warn('[API] getAssessmentQuestions failed, returning mock data:', error.message);
      // Return mock data as fallback - will be replaced when backend is ready
      throw new Error('Assessment not available offline');
    }
  },

  /**
   * Submit completed assessment
   * @param {string} assessmentId - Assessment ID
   * @param {Object} responses - User responses
   * @returns {Promise<Object>} Assessment results
   */
  submitAssessment: async (assessmentId, responses) => {
    try {
      return await fetchWithRetry(`${API_CONFIG.baseURL}/assessments/${assessmentId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ responses }),
      });
    } catch (error) {
      console.warn('[API] submitAssessment failed, calculating locally:', error.message);
      throw new Error('Cannot submit assessment offline');
    }
  },

  /**
   * Get assessment history
   * @param {Object} params - Query parameters
   * @returns {Promise<Array>} Assessment history
   */
  getAssessmentHistory: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_CONFIG.baseURL}/assessments/history${queryString ? `?${queryString}` : ''}`;

    try {
      return await fetchWithRetry(url);
    } catch (error) {
      console.warn('[API] getAssessmentHistory failed:', error.message);
      return [];
    }
  },
};

// Chat/Therapy API
export const chatAPI = {
  /**
   * Send a message to the AI therapist
   * @param {string} message - User message
   * @param {string} sessionId - Chat session ID
   * @returns {Promise<Object>} AI response
   */
  sendMessage: async (message, sessionId) => {
    try {
      return await fetchWithRetry(`${API_CONFIG.baseURL}/chat/message`, {
        method: 'POST',
        body: JSON.stringify({ message, sessionId }),
      });
    } catch (error) {
      console.error('[API] sendMessage failed:', error.message);
      throw error;
    }
  },

  /**
   * Get chat history
   * @param {string} sessionId - Chat session ID
   * @returns {Promise<Array>} Chat history
   */
  getChatHistory: async (sessionId) => {
    try {
      return await fetchWithRetry(`${API_CONFIG.baseURL}/chat/history/${sessionId}`);
    } catch (error) {
      console.warn('[API] getChatHistory failed:', error.message);
      return [];
    }
  },
};

// User API
export const userAPI = {
  /**
   * Get user profile
   * @returns {Promise<Object>} User profile
   */
  getProfile: async () => {
    try {
      return await fetchWithRetry(`${API_CONFIG.baseURL}/user/profile`);
    } catch (error) {
      console.error('[API] getProfile failed:', error.message);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile
   */
  updateProfile: async (profileData) => {
    try {
      return await fetchWithRetry(`${API_CONFIG.baseURL}/user/profile`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    } catch (error) {
      console.error('[API] updateProfile failed:', error.message);
      throw error;
    }
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
