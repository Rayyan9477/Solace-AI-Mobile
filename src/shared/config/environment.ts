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
 */
export const API_CONFIG = {
  // Base URL for API requests
  // Set via EXPO_PUBLIC_API_URL environment variable
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',

  // Request timeout in milliseconds
  timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000', 10),

  // Number of retry attempts for failed requests
  retryAttempts: parseInt(process.env.EXPO_PUBLIC_API_RETRY_ATTEMPTS || '3', 10),

  // Delay between retries in milliseconds
  retryDelay: parseInt(process.env.EXPO_PUBLIC_API_RETRY_DELAY || '1000', 10),
};

/**
 * Feature Flags
 */
export const FEATURES = {
  // Enable remote crisis keyword configuration
  remoteCrisisConfig: process.env.EXPO_PUBLIC_FEATURE_REMOTE_CRISIS_CONFIG === 'true',

  // Enable analytics tracking
  analytics: process.env.EXPO_PUBLIC_FEATURE_ANALYTICS === 'true',

  // Enable crash reporting
  crashReporting: process.env.EXPO_PUBLIC_FEATURE_CRASH_REPORTING === 'true',

  // Enable experimental features
  experimental: process.env.EXPO_PUBLIC_FEATURE_EXPERIMENTAL === 'true',
};

/**
 * App Configuration
 */
export const APP_CONFIG = {
  // Environment (development, staging, production)
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',

  // App version
  version: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',

  // Enable debug mode
  debug: process.env.EXPO_PUBLIC_DEBUG === 'true' || process.env.NODE_ENV === 'development',
};

/**
 * Storage Configuration
 */
export const STORAGE_CONFIG = {
  // AsyncStorage key prefix
  keyPrefix: process.env.EXPO_PUBLIC_STORAGE_PREFIX || 'solace_ai_',

  // Enable storage encryption
  encryption: process.env.EXPO_PUBLIC_STORAGE_ENCRYPTION === 'true',

  // Encryption key for sensitive data (should be set via environment variable)
  encryptionKey: process.env.EXPO_PUBLIC_ENCRYPTION_KEY || 'solace_default_key_2024',
};

/**
 * Analytics Configuration
 */
export const ANALYTICS_CONFIG = {
  // Analytics service API key
  apiKey: process.env.EXPO_PUBLIC_ANALYTICS_API_KEY || '',

  // Enable analytics in development
  enableInDev: process.env.EXPO_PUBLIC_ANALYTICS_DEV === 'true',
};

/**
 * Sentry Configuration (Error Tracking)
 */
export const SENTRY_CONFIG = {
  // Sentry DSN
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',

  // Enable Sentry
  enabled: process.env.EXPO_PUBLIC_SENTRY_ENABLED === 'true',

  // Environment name
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT || 'development',
};

/**
 * Check if running in production
 */
export function isProduction() {
  return APP_CONFIG.environment === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment() {
  return APP_CONFIG.environment === 'development';
}

/**
 * Check if running in staging
 */
export function isStaging() {
  return APP_CONFIG.environment === 'staging';
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
  if (API_CONFIG.baseURL === 'http://localhost:3000/api') {
    warnings.push('API_CONFIG.baseURL is using default localhost URL. Set EXPO_PUBLIC_API_URL for production.');
  }

  // Check for analytics configuration
  if (FEATURES.analytics && !ANALYTICS_CONFIG.apiKey) {
    warnings.push('Analytics is enabled but EXPO_PUBLIC_ANALYTICS_API_KEY is not set.');
  }

  // Check for Sentry configuration
  if (SENTRY_CONFIG.enabled && !SENTRY_CONFIG.dsn) {
    warnings.push('Sentry is enabled but EXPO_PUBLIC_SENTRY_DSN is not set.');
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn('Environment configuration warnings:');
    warnings.forEach(warning => console.warn(`  - ${warning}`));
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
