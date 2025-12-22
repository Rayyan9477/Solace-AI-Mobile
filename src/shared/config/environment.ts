import { logger } from "@shared/utils/logger";

/**
 * Environment Configuration
 * Centralized configuration for environment-specific values
 *
 * Usage:
 * - Set EXPO_PUBLIC_* environment variables in .env files
 * - Access via this module for type safety and defaults
 */

/**
 * API Configuration
 * SECURITY: Enforces HTTPS in production environment
 */
export const API_CONFIG = (() => {
  const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";
  const environment = process.env.EXPO_PUBLIC_ENVIRONMENT || "development";

  // Validate HTTPS in production
  if (
    environment === "production" &&
    !baseURL.startsWith("https://")
  ) {
    throw new Error(
      "SECURITY ERROR: API_URL must use HTTPS in production environment. " +
      `Current URL: ${baseURL}. ` +
      "Please update EXPO_PUBLIC_API_URL to use HTTPS."
    );
  }

  // Warn if using HTTP in staging (except localhost)
  if (
    environment === "staging" &&
    !baseURL.startsWith("https://") &&
    !baseURL.includes("localhost")
  ) {
    logger.warn(
      "WARNING: API_URL should use HTTPS in staging environment. " +
      `Current URL: ${baseURL}`
    );
  }

  return {
    // Base URL for API requests
    // Set via EXPO_PUBLIC_API_URL environment variable
    baseURL,

    // Request timeout in milliseconds
    timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || "10000", 10),

    // Number of retry attempts for failed requests
    retryAttempts: parseInt(
      process.env.EXPO_PUBLIC_API_RETRY_ATTEMPTS || "3",
      10,
    ),

    // Delay between retries in milliseconds
    retryDelay: parseInt(process.env.EXPO_PUBLIC_API_RETRY_DELAY || "1000", 10),
  };
})();

/**
 * Feature Flags
 */
export const FEATURES = {
  // Enable remote crisis keyword configuration
  remoteCrisisConfig:
    process.env.EXPO_PUBLIC_FEATURE_REMOTE_CRISIS_CONFIG === "true",

  // Enable analytics tracking
  analytics: process.env.EXPO_PUBLIC_FEATURE_ANALYTICS === "true",

  // Enable crash reporting
  crashReporting: process.env.EXPO_PUBLIC_FEATURE_CRASH_REPORTING === "true",

  // Enable experimental features
  experimental: process.env.EXPO_PUBLIC_FEATURE_EXPERIMENTAL === "true",
};

/**
 * App Configuration
 */
export const APP_CONFIG = {
  // Environment (development, staging, production)
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT || "development",

  // App version
  version: process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0",

  // Enable debug mode
  debug:
    process.env.EXPO_PUBLIC_DEBUG === "true" ||
    process.env.NODE_ENV === "development",
};

/**
 * Storage Configuration
 */
export const STORAGE_CONFIG = {
  // AsyncStorage key prefix
  keyPrefix: process.env.EXPO_PUBLIC_STORAGE_PREFIX || "solace_ai_",

  // Enable storage encryption (always true for secure storage)
  encryption: true,

  // Encryption key for secure storage (must be from environment in production)
  encryptionKey: (() => {
    const envKey = process.env.EXPO_PUBLIC_ENCRYPTION_KEY;

    // In production, encryption key MUST be provided
    if (APP_CONFIG.environment === "production" && !envKey) {
      throw new Error(
        "EXPO_PUBLIC_ENCRYPTION_KEY must be set in production environment. " +
        "Application cannot start without proper encryption configuration."
      );
    }

    // In development/staging, use environment key or null (will be generated at runtime)
    return envKey || null;
  })(),
};

/**
 * Analytics Configuration
 *
 * HIGH-NEW-016 FIX: Security note about EXPO_PUBLIC_ prefixed environment variables
 *
 * IMPORTANT: Environment variables with EXPO_PUBLIC_ prefix are bundled into the
 * client-side JavaScript and are visible to end users. Only use this prefix for:
 * - Write-only analytics keys (like Google Analytics measurement IDs)
 * - Public API keys with restricted permissions
 * - Configuration that is safe to be public
 *
 * NEVER use EXPO_PUBLIC_ prefix for:
 * - Admin or secret API keys
 * - Database credentials
 * - Private API tokens with read/write access
 *
 * If you need a secret key client-side, use a server-side proxy pattern instead.
 */
export const ANALYTICS_CONFIG = {
  // Analytics service API key (write-only, safe for client exposure)
  // HIGH-NEW-016 FIX: Added validation to prevent accidental secret exposure
  apiKey: (() => {
    const key = process.env.EXPO_PUBLIC_ANALYTICS_API_KEY || "";

    // Warn if key looks like a secret (contains common secret patterns)
    if (key && (
      key.toLowerCase().includes('secret') ||
      key.toLowerCase().includes('private') ||
      key.startsWith('sk_') || // Stripe secret key pattern
      key.startsWith('rk_')    // Other secret key patterns
    )) {
      console.warn(
        '[Security Warning] ANALYTICS_CONFIG.apiKey appears to be a secret key. ' +
        'EXPO_PUBLIC_ prefixed variables are exposed to clients. ' +
        'Use a write-only/public key or implement a server-side proxy.'
      );
    }

    return key;
  })(),

  // Enable analytics in development
  enableInDev: process.env.EXPO_PUBLIC_ANALYTICS_DEV === "true",
};

/**
 * Sentry Configuration (Error Tracking)
 */
export const SENTRY_CONFIG = {
  // Sentry DSN
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || "",

  // Enable Sentry
  enabled: process.env.EXPO_PUBLIC_SENTRY_ENABLED === "true",

  // Environment name
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT || "development",
};

/**
 * Check if running in production
 */
export function isProduction() {
  return APP_CONFIG.environment === "production";
}

/**
 * Check if running in development
 */
export function isDevelopment() {
  return APP_CONFIG.environment === "development";
}

/**
 * Check if running in staging
 */
export function isStaging() {
  return APP_CONFIG.environment === "staging";
}

/**
 * Get environment-specific configuration
 */
export function getEnvironmentConfig() {
  return {
    api: API_CONFIG,
    features: FEATURES,
    app: APP_CONFIG,
    storage: STORAGE_CONFIG,
    analytics: ANALYTICS_CONFIG,
    sentry: SENTRY_CONFIG,
  };
}

/**
 * Validate environment configuration
 * Logs warnings for missing or invalid configuration
 */
export function validateEnvironmentConfig() {
  const warnings = [];

  // Check for required API URL
  if (API_CONFIG.baseURL === "http://localhost:3000/api") {
    warnings.push(
      "API_CONFIG.baseURL is using default localhost URL. Set EXPO_PUBLIC_API_URL for production.",
    );
  }

  // Check for analytics configuration
  if (FEATURES.analytics && !ANALYTICS_CONFIG.apiKey) {
    warnings.push(
      "Analytics is enabled but EXPO_PUBLIC_ANALYTICS_API_KEY is not set.",
    );
  }

  // Check for Sentry configuration
  if (SENTRY_CONFIG.enabled && !SENTRY_CONFIG.dsn) {
    warnings.push("Sentry is enabled but EXPO_PUBLIC_SENTRY_DSN is not set.");
  }

  // Log warnings
  if (warnings.length > 0) {
    logger.warn("Environment configuration warnings:");
    warnings.forEach((warning) => logger.warn(`  - ${warning}`));
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
}

export default {
  API_CONFIG,
  FEATURES,
  APP_CONFIG,
  STORAGE_CONFIG,
  ANALYTICS_CONFIG,
  SENTRY_CONFIG,
  isProduction,
  isDevelopment,
  isStaging,
  getEnvironmentConfig,
  validateEnvironmentConfig,
};
