/**
 * Enterprise-Grade Authentication Service
 * 
 * Features:
 * - Secure token management with rotation
 * - Biometric authentication support
 * - Session management and auto-refresh
 * - Device fingerprinting
 * - Rate limiting and security headers
 * - Comprehensive error handling
 * - Audit logging
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";

import { logger } from "@shared/utils/logger";
import tokenService from "@app/services/tokenService";
import secureStorage from "@app/services/secureStorage";
import apiService from "@app/services/api";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  profile?: {
    avatar?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    preferences?: Record<string, any>;
  };
  roles?: string[];
  permissions?: string[];
  emailVerified: boolean;
  mfaEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  deviceFingerprint?: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
  requiresMfa?: boolean;
  mfaToken?: string;
}

export interface BiometricConfig {
  enabled: boolean;
  type?: "fingerprint" | "face" | "iris";
  lastUsed?: string;
}

export interface SessionInfo {
  isActive: boolean;
  userId?: string;
  expiresAt?: number;
  lastActivity: number;
  deviceId: string;
}

// Constants
const STORAGE_KEYS = {
  USER: "auth_user",
  BIOMETRIC_CONFIG: "auth_biometric_config",
  DEVICE_ID: "auth_device_id",
  SESSION_INFO: "auth_session_info",
  LOGIN_ATTEMPTS: "auth_login_attempts",
  LAST_EMAIL: "auth_last_email",
} as const;

// Security configuration - Reduced for health data protection
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes (reduced from 30)
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const TOKEN_REFRESH_THRESHOLD = 2 * 60 * 1000; // Refresh if expires in 2 minutes (reduced from 5)

/**
 * Authentication Service Class
 */
class AuthService {
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private tokenRefreshInterval: NodeJS.Timeout | null = null;
  private deviceId: string | null = null;
  private isRefreshing = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize authentication service
   */
  private async initialize(): Promise<void> {
    try {
      await this.initializeDeviceId();
      await this.startSessionMonitoring();
    } catch (error) {
      logger.error("AuthService initialization failed:", error);
    }
  }

  /**
   * Generate or retrieve device ID for fingerprinting
   */
  private async initializeDeviceId(): Promise<void> {
    try {
      let deviceId = await secureStorage.getSecureData(STORAGE_KEYS.DEVICE_ID);

      if (!deviceId) {
        const randomBytes = await Crypto.getRandomBytesAsync(16);
        deviceId = Array.from(randomBytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        
        await secureStorage.storeSecureData(STORAGE_KEYS.DEVICE_ID, deviceId);
      }

      this.deviceId = deviceId;
    } catch (error) {
      logger.error("Failed to initialize device ID:", error);
      this.deviceId = `fallback-${Date.now()}`;
    }
  }

  /**
   * Get device fingerprint for security
   */
  private async getDeviceFingerprint(): Promise<string> {
    try {
      const components = [
        this.deviceId || "unknown",
        Platform.OS,
        Platform.Version,
        new Date().getTimezoneOffset().toString(),
      ];

      const fingerprint = components.join("|");
      return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        fingerprint
      );
    } catch (error) {
      logger.error("Failed to generate device fingerprint:", error);
      return "unknown";
    }
  }

  /**
   * User Login with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Check rate limiting
      await this.checkRateLimit(credentials.email);

      // Add device fingerprint
      const fingerprint = await this.getDeviceFingerprint();
      const loginData = { ...credentials, deviceFingerprint: fingerprint };

      // Call API
      const response = await apiService.auth.login(
        loginData.email,
        loginData.password
      );

      // Handle MFA if required
      if (response.requiresMfa) {
        return {
          user: response.user,
          tokens: response.tokens,
          requiresMfa: true,
          mfaToken: response.mfaToken,
        };
      }

      // Store user and create session
      await this.handleSuccessfulAuth(response);

      // Clear login attempts on success
      await this.clearLoginAttempts(credentials.email);

      // Log auth event
      await this.logAuthEvent("login", response.user.id, "success");

      return response;
    } catch (error: any) {
      // Record failed attempt
      await this.recordLoginAttempt(credentials.email);

      // Log failed auth
      await this.logAuthEvent("login", credentials.email, "failure", error.message);

      throw error;
    }
  }

  /**
   * User Registration
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      // Validate required fields
      if (!data.email || !data.password || !data.name) {
        throw new Error("Email, password, and name are required");
      }

      if (!data.acceptTerms || !data.acceptPrivacy) {
        throw new Error("You must accept the terms and privacy policy");
      }

      // Validate password strength
      this.validatePasswordStrength(data.password);

      // Add device fingerprint
      const fingerprint = await this.getDeviceFingerprint();
      const signupData = { ...data, deviceFingerprint: fingerprint };

      // Call API
      const response = await apiService.auth.register(signupData);

      // Handle successful registration
      if (!response.requiresMfa) {
        await this.handleSuccessfulAuth(response);
      }

      // Log auth event
      await this.logAuthEvent("signup", response.user.id, "success");

      return response;
    } catch (error: any) {
      // Log failed signup
      await this.logAuthEvent("signup", data.email, "failure", error.message);
      throw error;
    }
  }

  /**
   * Verify MFA code
   */
  async verifyMfa(mfaToken: string, code: string): Promise<AuthResponse> {
    try {
      const response = await apiService.auth.verifyMfa({ mfaToken, code });
      await this.handleSuccessfulAuth(response);
      return response;
    } catch (error) {
      logger.error("MFA verification failed:", error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      const userId = user?.id;

      // Call API logout
      await apiService.auth.logout();

      // Clear all auth data
      await this.clearAuthData();

      // Stop monitoring
      this.stopSessionMonitoring();

      // Log auth event
      if (userId) {
        await this.logAuthEvent("logout", userId, "success");
      }

      logger.info("User logged out successfully");
    } catch (error) {
      logger.error("Logout failed:", error);
      // Clear data even if API call fails
      await this.clearAuthData();
      throw error;
    }
  }

  /**
   * Handle successful authentication
   */
  private async handleSuccessfulAuth(response: AuthResponse): Promise<void> {
    // Store tokens
    await tokenService.storeTokens({
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
      expiresAt: response.tokens.expiresAt,
    });

    // Store user data
    await secureStorage.storeSecureData(STORAGE_KEYS.USER, response.user);

    // Create session
    await this.createSession(response.user.id, response.tokens.expiresAt);

    // Start auto token refresh
    this.startTokenRefreshMonitoring();

    logger.info("Authentication successful for user:", response.user.email);
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await secureStorage.getSecureData(STORAGE_KEYS.USER);
      return user;
    } catch (error) {
      logger.error("Failed to get current user:", error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const hasTokens = await tokenService.isAuthenticated();
      const session = await this.getSessionInfo();
      
      return hasTokens && session.isActive;
    } catch (error) {
      logger.error("Failed to check authentication:", error);
      return false;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    if (this.isRefreshing) {
      logger.info("Token refresh already in progress");
      return false;
    }

    this.isRefreshing = true;

    try {
      const newTokens = await tokenService.refreshAccessToken();
      
      if (newTokens) {
        await this.updateSessionExpiry(newTokens.expiresAt);
        logger.info("Token refreshed successfully");
        return true;
      }

      return false;
    } catch (error) {
      logger.error("Token refresh failed:", error);
      await this.logout();
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const updatedUser = await apiService.auth.updateProfile(updates);
      await secureStorage.storeSecureData(STORAGE_KEYS.USER, updatedUser);
      return updatedUser;
    } catch (error) {
      logger.error("Profile update failed:", error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      this.validatePasswordStrength(newPassword);
      await apiService.auth.changePassword(currentPassword, newPassword);
      
      const user = await this.getCurrentUser();
      if (user) {
        await this.logAuthEvent("password_change", user.id, "success");
      }
    } catch (error) {
      logger.error("Password change failed:", error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiService.auth.requestPasswordReset(email);
      await this.logAuthEvent("password_reset_request", email, "success");
    } catch (error) {
      logger.error("Password reset request failed:", error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      this.validatePasswordStrength(newPassword);
      await apiService.auth.resetPassword(token, newPassword);
      await this.logAuthEvent("password_reset", token, "success");
    } catch (error) {
      logger.error("Password reset failed:", error);
      throw error;
    }
  }

  // ============ BIOMETRIC AUTHENTICATION ============

  /**
   * Check if biometric auth is available
   */
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      logger.error("Biometric availability check failed:", error);
      return false;
    }
  }

  /**
   * Get supported biometric types
   */
  async getSupportedBiometricTypes(): Promise<string[]> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      return types.map((type) => {
        switch (type) {
          case LocalAuthentication.AuthenticationType.FINGERPRINT:
            return "fingerprint";
          case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
            return "face";
          case LocalAuthentication.AuthenticationType.IRIS:
            return "iris";
          default:
            return "unknown";
        }
      });
    } catch (error) {
      logger.error("Failed to get biometric types:", error);
      return [];
    }
  }

  /**
   * Enable biometric authentication
   */
  async enableBiometric(): Promise<void> {
    try {
      const isAvailable = await this.isBiometricAvailable();
      if (!isAvailable) {
        throw new Error("Biometric authentication is not available on this device");
      }

      const types = await this.getSupportedBiometricTypes();
      const config: BiometricConfig = {
        enabled: true,
        type: types[0] as any,
        lastUsed: new Date().toISOString(),
      };

      await secureStorage.storeSecureData(STORAGE_KEYS.BIOMETRIC_CONFIG, config);
      logger.info("Biometric authentication enabled");
    } catch (error) {
      logger.error("Failed to enable biometric:", error);
      throw error;
    }
  }

  /**
   * Disable biometric authentication
   */
  async disableBiometric(): Promise<void> {
    try {
      await secureStorage.removeSecureData(STORAGE_KEYS.BIOMETRIC_CONFIG);
      logger.info("Biometric authentication disabled");
    } catch (error) {
      logger.error("Failed to disable biometric:", error);
      throw error;
    }
  }

  /**
   * Authenticate with biometrics
   * HIGH-017 FIX: Properly handle specific biometric error types
   */
  async authenticateWithBiometric(): Promise<{ success: boolean; error?: string; errorType?: string }> {
    try {
      const config = await secureStorage.getSecureData(STORAGE_KEYS.BIOMETRIC_CONFIG);
      if (!config?.enabled) {
        return { success: false, error: "Biometric authentication is not enabled", errorType: "not_enabled" };
      }

      // HIGH-017 FIX: Check availability before attempting authentication
      const isAvailable = await this.isBiometricAvailable();
      if (!isAvailable) {
        return { success: false, error: "Biometric hardware not available", errorType: "unavailable" };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to access Solace AI",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      if (result.success) {
        await secureStorage.storeSecureData(STORAGE_KEYS.BIOMETRIC_CONFIG, {
          ...config,
          lastUsed: new Date().toISOString(),
        });

        const user = await this.getCurrentUser();
        if (user) {
          await this.logAuthEvent("biometric_login", user.id, "success");
        }

        return { success: true };
      }

      // HIGH-017 FIX: Handle specific error types from LocalAuthentication
      const errorType = result.error;
      let errorMessage = "Authentication failed";

      switch (errorType) {
        case "user_cancel":
          errorMessage = "Authentication was cancelled";
          break;
        case "system_cancel":
          errorMessage = "Authentication was cancelled by the system";
          break;
        case "not_enrolled":
          errorMessage = "No biometrics enrolled on this device";
          break;
        case "lockout":
          errorMessage = "Too many failed attempts. Please try again later";
          break;
        case "lockout_permanent":
          errorMessage = "Biometric authentication is locked. Use passcode to unlock";
          break;
        case "passcode_not_set":
          errorMessage = "Device passcode is not set";
          break;
        default:
          errorMessage = result.warning || "Biometric authentication failed";
      }

      logger.warn(`Biometric authentication failed: ${errorType} - ${errorMessage}`);
      return { success: false, error: errorMessage, errorType };
    } catch (error) {
      logger.error("Biometric authentication error:", error);
      return { success: false, error: "An unexpected error occurred", errorType: "exception" };
    }
  }

  /**
   * Check if biometric is enabled
   */
  async isBiometricEnabled(): Promise<boolean> {
    try {
      const config = await secureStorage.getSecureData(STORAGE_KEYS.BIOMETRIC_CONFIG);
      return config?.enabled === true;
    } catch (error) {
      return false;
    }
  }

  // ============ SESSION MANAGEMENT ============

  /**
   * Create user session
   */
  private async createSession(userId: string, expiresAt: number): Promise<void> {
    const sessionInfo: SessionInfo = {
      isActive: true,
      userId,
      expiresAt,
      lastActivity: Date.now(),
      deviceId: this.deviceId || "unknown",
    };

    await secureStorage.storeSecureData(STORAGE_KEYS.SESSION_INFO, sessionInfo);
  }

  /**
   * Get session info
   */
  private async getSessionInfo(): Promise<SessionInfo> {
    try {
      const info = await secureStorage.getSecureData(STORAGE_KEYS.SESSION_INFO);
      return info || {
        isActive: false,
        lastActivity: 0,
        deviceId: this.deviceId || "unknown",
      };
    } catch (error) {
      return {
        isActive: false,
        lastActivity: 0,
        deviceId: this.deviceId || "unknown",
      };
    }
  }

  /**
   * Update session activity
   */
  async updateActivity(): Promise<void> {
    try {
      const session = await this.getSessionInfo();
      if (session.isActive) {
        session.lastActivity = Date.now();
        await secureStorage.storeSecureData(STORAGE_KEYS.SESSION_INFO, session);
      }
    } catch (error) {
      logger.error("Failed to update activity:", error);
    }
  }

  /**
   * Update session expiry
   */
  private async updateSessionExpiry(expiresAt: number): Promise<void> {
    try {
      const session = await this.getSessionInfo();
      session.expiresAt = expiresAt;
      await secureStorage.storeSecureData(STORAGE_KEYS.SESSION_INFO, session);
    } catch (error) {
      logger.error("Failed to update session expiry:", error);
    }
  }

  /**
   * Start session monitoring
   */
  private async startSessionMonitoring(): Promise<void> {
    // Check session every minute
    this.sessionCheckInterval = setInterval(async () => {
      try {
        const session = await this.getSessionInfo();
        if (!session.isActive) return;

        // Check for inactivity timeout
        const inactiveTime = Date.now() - session.lastActivity;
        if (inactiveTime > SESSION_TIMEOUT) {
          logger.info("Session expired due to inactivity");
          await this.logout();
          return;
        }

        // Check for token expiration
        if (session.expiresAt && Date.now() > session.expiresAt) {
          logger.info("Session expired due to token expiration");
          await this.logout();
        }
      } catch (error) {
        logger.error("Session check failed:", error);
      }
    }, 60000); // Check every minute
  }

  /**
   * Stop session monitoring
   */
  private stopSessionMonitoring(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
    if (this.tokenRefreshInterval) {
      clearInterval(this.tokenRefreshInterval);
      this.tokenRefreshInterval = null;
    }
  }

  /**
   * Start automatic token refresh monitoring
   */
  private startTokenRefreshMonitoring(): void {
    // Check token expiry every 30 seconds
    this.tokenRefreshInterval = setInterval(async () => {
      try {
        const shouldRefresh = await tokenService.shouldRefreshToken();
        if (shouldRefresh) {
          await this.refreshToken();
        }
      } catch (error) {
        logger.error("Token refresh check failed:", error);
      }
    }, 30000); // Check every 30 seconds
  }

  // ============ RATE LIMITING & SECURITY ============

  /**
   * Check rate limit for login attempts
   */
  private async checkRateLimit(email: string): Promise<void> {
    try {
      const attempts = await this.getLoginAttempts(email);
      
      if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
        const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
        
        if (timeSinceLastAttempt < LOCKOUT_DURATION) {
          const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 60000);
          throw new Error(
            `Too many login attempts. Please try again in ${remainingTime} minutes.`
          );
        }

        // Reset if lockout period has passed
        await this.clearLoginAttempts(email);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("Too many")) {
        throw error;
      }
      logger.error("Rate limit check failed:", error);
    }
  }

  /**
   * Record login attempt
   */
  private async recordLoginAttempt(email: string): Promise<void> {
    try {
      const attempts = await this.getLoginAttempts(email);
      attempts.count += 1;
      attempts.lastAttempt = Date.now();
      
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.LOGIN_ATTEMPTS}_${email}`,
        JSON.stringify(attempts)
      );
    } catch (error) {
      logger.error("Failed to record login attempt:", error);
    }
  }

  /**
   * Get login attempts
   */
  private async getLoginAttempts(email: string): Promise<{ count: number; lastAttempt: number }> {
    try {
      const data = await AsyncStorage.getItem(`${STORAGE_KEYS.LOGIN_ATTEMPTS}_${email}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      logger.error("Failed to get login attempts:", error);
    }
    return { count: 0, lastAttempt: 0 };
  }

  /**
   * Clear login attempts
   */
  private async clearLoginAttempts(email: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${STORAGE_KEYS.LOGIN_ATTEMPTS}_${email}`);
    } catch (error) {
      logger.error("Failed to clear login attempts:", error);
    }
  }

  /**
   * Validate password strength
   */
  private validatePasswordStrength(password: string): void {
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw new Error("Password must contain at least one special character");
    }
  }

  // ============ UTILITY METHODS ============

  /**
   * Clear all authentication data
   */
  private async clearAuthData(): Promise<void> {
    try {
      await tokenService.clearTokens();
      await secureStorage.removeSecureData(STORAGE_KEYS.USER);
      await secureStorage.removeSecureData(STORAGE_KEYS.SESSION_INFO);
    } catch (error) {
      logger.error("Failed to clear auth data:", error);
    }
  }

  /**
   * Log authentication events
   */
  private async logAuthEvent(
    event: string,
    userId: string,
    status: "success" | "failure",
    error?: string
  ): Promise<void> {
    try {
      const logEntry = {
        event,
        userId,
        status,
        error,
        timestamp: new Date().toISOString(),
        deviceId: this.deviceId,
        platform: Platform.OS,
      };

      logger.info("Auth event:", logEntry);

      // Store in local logs (optional)
      // Could also send to analytics service
    } catch (error) {
      logger.error("Failed to log auth event:", error);
    }
  }

  /**
   * Save last login email for convenience
   */
  async saveLastEmail(email: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_EMAIL, email);
    } catch (error) {
      logger.error("Failed to save last email:", error);
    }
  }

  /**
   * Get last login email
   */
  async getLastEmail(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_EMAIL);
    } catch (error) {
      logger.error("Failed to get last email:", error);
      return null;
    }
  }

  /**
   * Clear last login email
   */
  async clearLastEmail(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LAST_EMAIL);
    } catch (error) {
      logger.error("Failed to clear last email:", error);
    }
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
