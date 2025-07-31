import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Environment detection
export const ENV = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
};

export const getCurrentEnvironment = () => {
  if (__DEV__) return ENV.DEVELOPMENT;
  
  // Check if we're in Expo Go
  if (Constants.appOwnership === 'expo') return ENV.DEVELOPMENT;
  
  // Check for staging build
  if (Constants.manifest?.releaseChannel === 'staging') return ENV.STAGING;
  
  return ENV.PRODUCTION;
};

// API Configuration
const API_ENDPOINTS = {
  [ENV.DEVELOPMENT]: {
    baseURL: Platform.select({
      ios: 'http://localhost:8000',
      android: 'http://10.0.2.2:8000',
      web: 'http://localhost:8000',
    }),
    timeout: 10000,
  },
  [ENV.STAGING]: {
    baseURL: 'https://api-staging.solace-ai.com',
    timeout: 15000,
  },
  [ENV.PRODUCTION]: {
    baseURL: 'https://api.solace-ai.com',
    timeout: 20000,
  },
};

// Get current API configuration
export const getApiConfig = () => {
  const currentEnv = getCurrentEnvironment();
  return API_ENDPOINTS[currentEnv];
};

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: getCurrentEnvironment() === ENV.PRODUCTION,
  ENABLE_CRASH_REPORTING: getCurrentEnvironment() === ENV.PRODUCTION,
  ENABLE_VOICE_CHAT: true,
  ENABLE_CRISIS_DETECTION: true,
  ENABLE_OFFLINE_MODE: getCurrentEnvironment() !== ENV.DEVELOPMENT,
  ENABLE_DEBUG_LOGS: getCurrentEnvironment() === ENV.DEVELOPMENT,
  ENABLE_HAPTIC_FEEDBACK: Platform.OS !== 'web',
  ENABLE_BIOMETRIC_AUTH: Platform.OS !== 'web',
};

// App Configuration
export const APP_CONFIG = {
  VERSION: Constants.manifest?.version || '1.0.0',
  BUILD_NUMBER: Platform.select({
    ios: Constants.manifest?.ios?.buildNumber,
    android: Constants.manifest?.android?.versionCode,
    web: null,
  }),
  BUNDLE_ID: Platform.select({
    ios: Constants.manifest?.ios?.bundleIdentifier,
    android: Constants.manifest?.android?.package,
    web: Constants.manifest?.name,
  }),
  MIN_SUPPORTED_VERSION: '1.0.0',
};

// Mental Health Configuration
export const MENTAL_HEALTH_CONFIG = {
  CRISIS_HOTLINE: '988',
  EMERGENCY_EMAIL: 'crisis@solace-ai.com',
  CRISIS_KEYWORDS: [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 
    'self harm', 'want to die', 'no point living'
  ],
  SEVERITY_THRESHOLDS: {
    LOW: 3,
    MEDIUM: 6,
    HIGH: 8,
    CRITICAL: 9,
  },
};

// Platform-specific configurations
export const PLATFORM_CONFIG = {
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isWeb: Platform.OS === 'web',
  
  // Platform-specific features
  features: {
    hapticFeedback: Platform.OS !== 'web',
    voiceRecognition: Platform.OS !== 'web',
    biometricAuth: Platform.OS !== 'web',
    backgroundSync: Platform.OS !== 'web',
    pushNotifications: Platform.OS !== 'web',
    deepLinking: true,
    fileUpload: true,
  },
  
  // Platform-specific styling
  styles: {
    statusBarHeight: Platform.select({
      ios: Constants.statusBarHeight,
      android: Constants.statusBarHeight,
      web: 0,
    }),
    headerHeight: Platform.select({
      ios: 44,
      android: 56,
      web: 64,
    }),
    tabBarHeight: Platform.select({
      ios: 49,
      android: 56,
      web: 60,
    }),
  },
};

// Logging utility
export const logger = {
  log: (message, ...args) => {
    if (FEATURE_FLAGS.ENABLE_DEBUG_LOGS) {
      console.log(`[${new Date().toISOString()}] ${message}`, ...args);
    }
  },
  
  error: (message, error) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, error);
    
    // In production, you might want to send this to a logging service
    if (getCurrentEnvironment() === ENV.PRODUCTION && FEATURE_FLAGS.ENABLE_CRASH_REPORTING) {
      // Send to crash reporting service
    }
  },
  
  warn: (message, ...args) => {
    if (FEATURE_FLAGS.ENABLE_DEBUG_LOGS) {
      console.warn(`[${new Date().toISOString()}] WARNING: ${message}`, ...args);
    }
  },
};

// Environment-specific exports
export default {
  ENV,
  getCurrentEnvironment,
  getApiConfig,
  FEATURE_FLAGS,
  APP_CONFIG,
  MENTAL_HEALTH_CONFIG,
  PLATFORM_CONFIG,
  logger,
};