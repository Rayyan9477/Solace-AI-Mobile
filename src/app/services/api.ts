/**
 * API Service for authentication and user management
 * Enterprise-grade implementation with interceptors, logging, and retry logic
 */

import { logger } from "@shared/utils/logger";

import apiCache from "./apiCache";
import tokenService from "./tokenService";
import { API_CONFIG } from "../../shared/config/environment";

// ==================== TYPES ====================

// API Response types
interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success?: boolean;
  error?: string;
  status?: number;
  url?: string;
  metadata?: {
    startTime?: number;
    retryCount?: number;
    [key: string]: unknown;
  };
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
  endpoint?: string;
  statusCode?: number | null;
  timestamp?: string;
}

// Auth types
interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  preferences?: Record<string, unknown>;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface ProfileUpdateData {
  name?: string;
  avatar?: string;
  bio?: string;
  preferences?: Record<string, unknown>;
}

interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  language?: string;
  [key: string]: unknown;
}

// Request types
type RequestInterceptor = (config: RequestConfig) => Promise<RequestConfig> | RequestConfig;
type ResponseInterceptor = <T>(response: ApiResponse<T>) => Promise<ApiResponse<T>> | ApiResponse<T>;
type ErrorInterceptor = (error: ApiError) => Promise<ApiError> | ApiError;

interface RequestConfig {
  url: string;
  options: RequestInit;
  metadata?: {
    startTime?: number;
    retryCount?: number;
    [key: string]: unknown;
  };
}

interface FetchOptions extends Omit<RequestInit, 'cache'> {
  timeout?: number;
  retries?: number;
  useCache?: boolean;
}

// ==================== INTERCEPTORS ====================
class InterceptorManager {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor);
  }

  async runRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let modifiedConfig = config;
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }
    return modifiedConfig;
  }

  async runResponseInterceptors<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
    let modifiedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }
    return modifiedResponse;
  }

  async runErrorInterceptors(error: ApiError): Promise<ApiError> {
    let modifiedError = error;
    for (const interceptor of this.errorInterceptors) {
      modifiedError = await interceptor(modifiedError);
    }
    return modifiedError;
  }
}

const interceptors = new InterceptorManager();

// ==================== DEFAULT INTERCEPTORS ====================

// Request logging interceptor
interceptors.addRequestInterceptor((config) => {
  config.metadata = config.metadata || {};
  config.metadata.startTime = Date.now();

  logger.debug(`[API Request] ${config.options.method || 'GET'} ${config.url}`, {
    headers: config.options.headers,
    body: config.options.body,
  });

  return config;
});

// Response logging interceptor
interceptors.addResponseInterceptor((response) => {
  const duration = response.metadata?.startTime
    ? Date.now() - response.metadata.startTime
    : 0;

  logger.debug(`[API Response] ${response.status} ${response.url}`, {
    duration: `${duration}ms`,
    retryCount: response.metadata?.retryCount || 0,
  });

  return response;
});

// Error logging interceptor
interceptors.addErrorInterceptor((error) => {
  logger.error(`[API Error] ${error.endpoint}`, {
    message: error.message,
    statusCode: error.statusCode,
    timestamp: error.timestamp,
  });

  return error;
});

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

// ==================== RETRY WITH EXPONENTIAL BACKOFF ====================

/**
 * Calculate exponential backoff delay
 * @param retryCount - Current retry attempt (0-indexed)
 * @param baseDelay - Base delay in milliseconds (default: 1000ms)
 * @param maxDelay - Maximum delay in milliseconds (default: 30000ms)
 * @returns Delay in milliseconds with jitter
 */
function getExponentialBackoffDelay(
  retryCount: number,
  baseDelay: number = 1000,
  maxDelay: number = 30000,
): number {
  // Calculate: baseDelay * 2^retryCount
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);

  // Add jitter: ±20% randomness to prevent thundering herd
  const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5);

  return Math.floor(exponentialDelay + jitter);
}

/**
 * Enhanced fetch with timeout, interceptors, and exponential backoff
 */
async function fetchWithTimeout(
  url: string,
  options: any = {},
  timeout = API_CONFIG.timeout,
  retryCount = 0,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Run request interceptors
  let config: RequestConfig = {
    url,
    options: {
      ...options,
      signal: controller.signal,
    },
    metadata: { retryCount },
  };

  try {
    config = await interceptors.runRequestInterceptors(config);
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw new AuthAPIError(`Request interceptor failed: ${error.message}`, null, url);
  }

  try {
    const response = await fetch(config.url, config.options);
    clearTimeout(timeoutId);

    // Attach metadata for response interceptors
    (response as any).metadata = config.metadata;
    (response as any).url = config.url;

    // Run response interceptors
    await interceptors.runResponseInterceptors(response);

    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      const timeoutError = new AuthAPIError("Request timeout", 408, url);
      await interceptors.runErrorInterceptors(timeoutError);
      throw timeoutError;
    }

    // Run error interceptors
    const wrappedError = new AuthAPIError(error.message, null, url);
    await interceptors.runErrorInterceptors(wrappedError);
    throw wrappedError;
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
const MAX_RETRY_ATTEMPTS = 3;

/**
 * Enhanced authenticated fetch with retry logic, exponential backoff, and token refresh
 */
async function authenticatedFetch(
  url: string,
  options: any = {},
  retryCount: number = 0,
): Promise<any> {
  const method = options.method || "GET";

  // Check cache for GET requests
  if (method === "GET" && retryCount === 0) {
    const cached = apiCache.get(url, options);
    if (cached) {
      logger.debug(`[API Cache HIT] ${url}`);
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
    const response = await fetchWithTimeout(url, {
      ...options,
      headers,
    }, API_CONFIG.timeout, retryCount);

    // Handle 401 Unauthorized - attempt token refresh
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
    // Determine if request should be retried
    const isRetryableError =
      error.statusCode === 408 || // Timeout
      error.statusCode === 429 || // Rate limit
      error.statusCode === 503 || // Service unavailable
      error.statusCode === 504 || // Gateway timeout
      (error.statusCode >= 500 && error.statusCode < 600); // Server errors

    const shouldRetry =
      retryCount < MAX_RETRY_ATTEMPTS &&
      isRetryableError &&
      method === "GET"; // Only retry GET requests for safety

    if (shouldRetry) {
      const delay = getExponentialBackoffDelay(retryCount);
      logger.warn(`[API Retry] Attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS} after ${delay}ms`, {
        url,
        error: error.message,
        statusCode: error.statusCode,
      });

      await new Promise(resolve => setTimeout(resolve, delay));
      return authenticatedFetch(url, options, retryCount + 1);
    }

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
  async login(email: string, password: string): Promise<{ user: UserProfile; access_token: string; refresh_token: string }> {
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
  async register(userData: RegisterData & Record<string, unknown>): Promise<ApiResponse<UserProfile>> {
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
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
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
  async updateProfile(profileData: ProfileUpdateData): Promise<ApiResponse<UserProfile>> {
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
  ): Promise<ApiResponse<{ success: boolean }>> {
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
  async requestPasswordReset(email: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
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

// Export interceptors for custom middleware
export { interceptors };

// Export types
export type { RequestInterceptor, ResponseInterceptor, ErrorInterceptor, RequestConfig };

export default apiService;
