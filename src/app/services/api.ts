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

// HIGH-NEW-017 FIX: Extended Response type with metadata for type-safe interceptors
interface ExtendedResponse extends Response {
  metadata?: {
    startTime?: number;
    retryCount?: number;
    [key: string]: unknown;
  };
  url: string;
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
      try {
        modifiedConfig = await interceptor(modifiedConfig);
      } catch (interceptorError) {
        // HIGH-NEW-018 FIX: Log error but continue with last good config
        logger.warn('[Interceptor] Request interceptor threw error, continuing', {
          error: interceptorError instanceof Error ? interceptorError.message : String(interceptorError),
        });
      }
    }
    return modifiedConfig;
  }

  async runResponseInterceptors<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
    let modifiedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      try {
        modifiedResponse = await interceptor(modifiedResponse);
      } catch (interceptorError) {
        // HIGH-NEW-018 FIX: Log error but continue with last good response
        logger.warn('[Interceptor] Response interceptor threw error, continuing', {
          error: interceptorError instanceof Error ? interceptorError.message : String(interceptorError),
        });
      }
    }
    return modifiedResponse;
  }

  async runErrorInterceptors(error: ApiError): Promise<ApiError> {
    let modifiedError = error;
    for (const interceptor of this.errorInterceptors) {
      try {
        modifiedError = await interceptor(modifiedError);
      } catch (interceptorError) {
        // HIGH-NEW-018 FIX: Log error but continue with last good error object
        logger.warn('[Interceptor] Error interceptor threw error, continuing', {
          error: interceptorError instanceof Error ? interceptorError.message : String(interceptorError),
        });
      }
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
 * LOW-NEW-006 FIX: Uses named constants for magic numbers
 * @param retryCount - Current retry attempt (0-indexed)
 * @param baseDelay - Base delay in milliseconds (default: DEFAULT_RETRY_BASE_DELAY_MS)
 * @param maxDelay - Maximum delay in milliseconds (default: DEFAULT_RETRY_MAX_DELAY_MS)
 * @returns Delay in milliseconds with jitter
 */
function getExponentialBackoffDelay(
  retryCount: number,
  baseDelay: number = DEFAULT_RETRY_BASE_DELAY_MS,
  maxDelay: number = DEFAULT_RETRY_MAX_DELAY_MS,
): number {
  // Calculate: baseDelay * 2^retryCount
  const exponentialDelay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);

  // Add jitter: positive-only to prevent thundering herd
  // HIGH-NEW-013 FIX: Jitter is now positive-only (0% to +20%) to never reduce delay
  const jitter = exponentialDelay * JITTER_FACTOR * Math.random();

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

    // HIGH-NEW-017 FIX: Use type assertion to ExtendedResponse for type-safe metadata attachment
    const extendedResponse = response as ExtendedResponse;
    extendedResponse.metadata = config.metadata;

    // Run response interceptors
    await interceptors.runResponseInterceptors(extendedResponse);

    return extendedResponse;
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

  // HIGH-020 FIX: Wrap JSON parse with try-catch for malformed responses
  try {
    return await response.json();
  } catch (parseError) {
    throw new AuthAPIError(
      "Invalid JSON response from server",
      response.status,
      "/auth/refresh",
    );
  }
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

  // HIGH-020 FIX: Wrap JSON parse with try-catch for malformed responses
  try {
    return await response.json();
  } catch (parseError) {
    throw new AuthAPIError(
      "Invalid JSON response from server",
      response.status,
      url,
    );
  }
}

// LOW-NEW-006 FIX: Named constants for configuration values
// These values control retry behavior and token refresh logic
const tokenRefreshAttempts = new Map();
const MAX_REFRESH_ATTEMPTS = 2;
const REFRESH_ATTEMPT_WINDOW = 60000; // 1 minute window for refresh attempts
const MAX_RETRY_ATTEMPTS = 3;
// CRIT-NEW-002 FIX: Maximum call depth to prevent infinite recursion
// This is a safety mechanism to catch any edge cases in the retry/refresh flow
const MAX_CALL_DEPTH = 10;

// LOW-NEW-006 FIX: Token expiration and delay constants
const DEFAULT_TOKEN_EXPIRY_SECONDS = 3600; // 1 hour default token lifetime
const DEFAULT_RETRY_BASE_DELAY_MS = 1000; // 1 second base delay for exponential backoff
const DEFAULT_RETRY_MAX_DELAY_MS = 30000; // 30 seconds max delay
const JITTER_FACTOR = 0.2; // 20% jitter for retry delays

// LOW-NEW-006 FIX: HTTP status code constants
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// CRIT-NEW-001 FIX: Atomic mutex implementation for thread-safe token refresh
// This prevents race conditions where multiple concurrent requests all try to refresh
// by using a proper mutex with a wait queue instead of simple boolean flags
class AtomicMutex {
  private locked = false;
  private waitQueue: Array<() => void> = [];

  /**
   * Acquire the mutex. If locked, caller waits in queue.
   * This is atomic - no race condition window between check and set.
   */
  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    // Wait in queue for lock to be released
    return new Promise<void>((resolve) => {
      this.waitQueue.push(resolve);
    });
  }

  /**
   * Release the mutex. Passes lock to next waiter if any.
   */
  release(): void {
    if (this.waitQueue.length > 0) {
      // Pass lock to next waiter (lock stays true)
      const next = this.waitQueue.shift();
      next?.();
    } else {
      this.locked = false;
    }
  }

  isLocked(): boolean {
    return this.locked;
  }
}

// CRIT-NEW-001 FIX: Single mutex instance for all token refresh operations
const tokenRefreshMutex = new AtomicMutex();
let activeRefreshPromise: Promise<any> | null = null;
let activeRefreshToken: string | null = null;

// HIGH-007 FIX: Track in-flight requests to prevent duplicate API calls
const inFlightRequests = new Map<string, Promise<any>>();

// HIGH-004 FIX: Track reserved request slots to prevent race conditions
// A reserved slot is set immediately when we decide to make a request,
// preventing concurrent requests from both proceeding
interface DeferredPromise<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: any) => void;
}

function createDeferredPromise<T>(): DeferredPromise<T> {
  let resolve!: (value: T) => void;
  let reject!: (error: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/**
 * Generate a unique request key for deduplication
 */
function getRequestKey(url: string, options: any): string {
  const method = options?.method || "GET";
  const body = options?.body ? JSON.stringify(options.body) : "";
  return `${method}:${url}:${body}`;
}

/**
 * Thread-safe token refresh that ensures only one refresh happens at a time
 * Other concurrent requests wait for the same refresh to complete
 * CRIT-NEW-001 FIX: Uses AtomicMutex for proper thread-safety with wait queue
 */
async function safeRefreshToken(refreshToken: string): Promise<any> {
  // CRIT-NEW-001 FIX: If there's already a refresh in progress for the same token,
  // return the existing promise to avoid duplicate refresh requests
  if (activeRefreshPromise && activeRefreshToken === refreshToken) {
    logger.debug('[Token Refresh] Reusing existing refresh promise');
    return activeRefreshPromise;
  }

  // Acquire the mutex - this blocks if another refresh is already in progress
  await tokenRefreshMutex.acquire();

  try {
    // Double-check after acquiring mutex (another request might have completed refresh)
    // This handles the case where multiple requests queued up before mutex was acquired
    if (activeRefreshPromise && activeRefreshToken === refreshToken) {
      logger.debug('[Token Refresh] Another request completed refresh, reusing result');
      tokenRefreshMutex.release();
      return activeRefreshPromise;
    }

    // Set the active refresh state
    activeRefreshToken = refreshToken;
    logger.debug('[Token Refresh] Starting new token refresh');

    // Create the refresh promise
    activeRefreshPromise = (async () => {
      try {
        const result = await refreshAccessToken(refreshToken);
        return result;
      } catch (error) {
        // Clear the promise on error so next attempt can try again
        activeRefreshPromise = null;
        activeRefreshToken = null;
        throw error;
      }
    })();

    const result = await activeRefreshPromise;
    return result;
  } finally {
    // Clear active refresh state after completion
    activeRefreshToken = null;
    activeRefreshPromise = null;
    // Release mutex to allow next waiter to proceed
    tokenRefreshMutex.release();
  }
}

/**
 * Enhanced authenticated fetch with retry logic, exponential backoff, and token refresh
 * HIGH-007 FIX: Added request deduplication to prevent duplicate concurrent calls
 * CRIT-NEW-002 FIX: Added call depth tracking to prevent infinite recursion
 */
async function authenticatedFetch(
  url: string,
  options: any = {},
  retryCount: number = 0,
  callDepth: number = 0,
): Promise<any> {
  // CRIT-NEW-002 FIX: Check call depth to prevent infinite recursion
  if (callDepth >= MAX_CALL_DEPTH) {
    logger.error('[API] Maximum call depth exceeded - possible infinite recursion', {
      url,
      callDepth,
      retryCount,
    });
    throw new AuthAPIError(
      'Request failed: maximum retry depth exceeded',
      500,
      url
    );
  }

  const method = options.method || "GET";

  // Check cache for GET requests
  if (method === "GET" && retryCount === 0) {
    const cached = apiCache.get(url, options);
    if (cached) {
      logger.debug(`[API Cache HIT] ${url}`);
      return cached;
    }

    // HIGH-004 FIX: Atomic check-and-reserve to prevent race conditions
    // We check for in-flight AND reserve the slot in the same operation
    const requestKey = getRequestKey(url, options);
    const inFlight = inFlightRequests.get(requestKey);

    if (inFlight) {
      logger.debug(`[API Dedup] Reusing in-flight request: ${url}`);
      return inFlight;
    }

    // HIGH-004 FIX: Immediately reserve the slot with a deferred promise
    // This prevents concurrent requests from both proceeding past this check
    const deferred = createDeferredPromise<any>();
    inFlightRequests.set(requestKey, deferred.promise);

    // Execute request and resolve/reject the deferred promise
    try {
      const result = await executeAuthenticatedRequest(url, options, retryCount, callDepth);
      deferred.resolve(result);
      return result;
    } catch (error) {
      deferred.reject(error);
      throw error;
    } finally {
      inFlightRequests.delete(requestKey);
    }
  }

  // For non-GET or retry requests, execute directly without deduplication
  return executeAuthenticatedRequest(url, options, retryCount, callDepth);
}

/**
 * HIGH-004 FIX: Extracted request execution logic for deduplication support
 * This function handles the actual HTTP request with token management and retry logic
 * CRIT-NEW-002 FIX: Added callDepth parameter to prevent infinite recursion
 */
async function executeAuthenticatedRequest(
  url: string,
  options: any,
  retryCount: number,
  callDepth: number = 0
): Promise<any> {
  const method = options.method || "GET";
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
      return handle401Response(url, options, tokens, retryCount);
    }

    // Handle other error responses with retry logic
    if (!response.ok) {
      return handleErrorResponse(response, url, options, retryCount, callDepth);
    }

    // Parse successful response
    const data = await response.json();

    // Cache successful GET responses
    if (method === "GET") {
      apiCache.set(url, data, options);
    }

    return data;
  } catch (error: any) {
    // Handle network errors with retry
    if (retryCount < MAX_RETRY_ATTEMPTS) {
      // MED-013 FIX: Use consistent exponential backoff with jitter
      const delay = getExponentialBackoffDelay(retryCount);
      logger.warn(`[API Retry] Network error, attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS} after ${delay}ms`, {
        url,
        error: error.message,
      });
      await new Promise(resolve => setTimeout(resolve, delay));
      return authenticatedFetch(url, options, retryCount + 1, callDepth + 1);
    }
    throw error;
  }
}

/**
 * Handle 401 response with token refresh
 * CRIT-002 FIX: Properly retry with new tokens to prevent infinite recursion
 */
async function handle401Response(
  url: string,
  options: any,
  tokens: any,
  retryCount: number
): Promise<any> {
  const now = Date.now();
  const attemptKey = tokens.refreshToken.substring(0, 10);
  const attemptRecord = tokenRefreshAttempts.get(attemptKey);

  if (
    attemptRecord &&
    now - attemptRecord.firstAttempt < REFRESH_ATTEMPT_WINDOW &&
    attemptRecord.count >= MAX_REFRESH_ATTEMPTS
  ) {
    // Clear tokens and throw - don't continue trying
    await tokenService.clearTokens();
    tokenRefreshAttempts.delete(attemptKey);
    throw new AuthAPIError(
      "Maximum token refresh attempts exceeded. Please log in again.",
      401,
      url
    );
  }

  if (attemptRecord) {
    attemptRecord.count++;
  } else {
    tokenRefreshAttempts.set(attemptKey, { count: 1, firstAttempt: now });
  }

  try {
    const newTokens = await safeRefreshToken(tokens.refreshToken);

    if (!newTokens?.access_token) {
      throw new Error("Invalid token response - missing access_token");
    }

    const transformedTokens = {
      accessToken: newTokens.access_token,
      refreshToken: newTokens.refresh_token || tokens.refreshToken,
      expiresAt: Date.now() + (newTokens.expires_in || DEFAULT_TOKEN_EXPIRY_SECONDS) * 1000,
    };

    await tokenService.storeTokens(transformedTokens);

    // Clear successful refresh attempt tracking
    tokenRefreshAttempts.delete(attemptKey);

    // CRIT-002 FIX: Directly retry the request with the new access token
    // instead of calling authenticatedFetch which would re-fetch tokens
    // This prevents potential race conditions and infinite loops
    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${transformedTokens.accessToken}`,
    };

    const response = await fetchWithTimeout(url, {
      ...options,
      headers,
    }, API_CONFIG.timeout, retryCount + 1);

    if (!response.ok) {
      // If still getting 401 after refresh, the new token is also invalid
      if (response.status === 401) {
        await tokenService.clearTokens();
        throw new AuthAPIError(
          "Session expired. Please log in again.",
          401,
          url
        );
      }

      const errorData = await response.json().catch(() => ({}));
      throw new AuthAPIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        url
      );
    }

    const data = await response.json();

    // Cache successful GET responses
    if ((options.method || "GET") === "GET") {
      apiCache.set(url, data, options);
    }

    return data;
  } catch (refreshError: any) {
    // If refresh failed, clear tokens and re-throw with clear message
    await tokenService.clearTokens();
    tokenRefreshAttempts.delete(attemptKey);

    if (refreshError instanceof AuthAPIError) {
      throw refreshError;
    }

    throw new AuthAPIError(
      "Session expired. Please log in again.",
      401,
      url
    );
  }
}

/**
 * Handle error responses with retry logic
 */
async function handleErrorResponse(
  response: Response,
  url: string,
  options: any,
  retryCount: number,
  callDepth: number = 0
): Promise<any> {
  const isRetryable = response.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR || response.status === HTTP_STATUS.TOO_MANY_REQUESTS;

  if (isRetryable && retryCount < MAX_RETRY_ATTEMPTS) {
    // MED-013 FIX: Use consistent exponential backoff with jitter
    const delay = getExponentialBackoffDelay(retryCount);
    logger.warn(`[API Retry] HTTP ${response.status}, attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS} after ${delay}ms`, {
      url,
      status: response.status,
    });
    await new Promise(resolve => setTimeout(resolve, delay));
    return authenticatedFetch(url, options, retryCount + 1, callDepth + 1);
  }

  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
}

// Legacy authenticatedFetch helper - kept for compatibility with existing code
// CRIT-NEW-002 FIX: Added callDepth parameter to prevent infinite recursion
async function legacyAuthenticatedFetchHelper(
  url: string,
  options: any = {},
  retryCount: number = 0,
  callDepth: number = 0,
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
        // CRIT-001 FIX: Use thread-safe token refresh
        const newTokens = await safeRefreshToken(tokens.refreshToken);

        if (!newTokens?.access_token) {
          throw new Error("Invalid token response");
        }

        const transformedTokens = {
          accessToken: newTokens.access_token,
          refreshToken: newTokens.refresh_token || tokens.refreshToken,
          expiresAt: Date.now() + (newTokens.expires_in || DEFAULT_TOKEN_EXPIRY_SECONDS) * 1000,
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
      error.statusCode === 408 || // Timeout (request timeout, not in HTTP_STATUS)
      error.statusCode === HTTP_STATUS.TOO_MANY_REQUESTS || // Rate limit
      error.statusCode === HTTP_STATUS.SERVICE_UNAVAILABLE || // Service unavailable
      error.statusCode === HTTP_STATUS.GATEWAY_TIMEOUT || // Gateway timeout
      (error.statusCode && error.statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR && error.statusCode < 600); // Server errors

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
      return authenticatedFetch(url, options, retryCount + 1, callDepth + 1);
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
      expiresAt: Date.now() + (data.expires_in || DEFAULT_TOKEN_EXPIRY_SECONDS) * 1000,
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
        expiresAt: Date.now() + (data.expires_in || DEFAULT_TOKEN_EXPIRY_SECONDS) * 1000,
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

  // HIGH-022 FIX: Add missing updateProfile method
  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(profileData: ProfileUpdateData): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/user/profile`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },

  // HIGH-022 FIX: Add missing getStats method
  /**
   * Get user statistics
   * @returns {Promise<Object>} User stats
   */
  async getStats(): Promise<any> {
    return await authenticatedFetch(`${API_CONFIG.baseURL}/user/stats`);
  },
};

const apiService = {
  auth: authAPI,
  user: userAPI,
};

// MED-010 FIX: Register the refresh token callback with tokenService
// This avoids circular imports by late-binding the dependency
tokenService.registerRefreshCallback(async (refreshToken: string) => {
  return authAPI.refreshToken(refreshToken);
});

// Export interceptors for custom middleware
export { interceptors };

// Export types
export type { RequestInterceptor, ResponseInterceptor, ErrorInterceptor, RequestConfig };

export default apiService;
