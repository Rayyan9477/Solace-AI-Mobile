/**
 * App Configuration Constants
 */

export const APP_CONFIG = {
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',

  // API Configuration
  apiUrl: process.env.API_BASE_URL || 'https://api.solace-ai.com',
  apiTimeout: parseInt(process.env.API_TIMEOUT || '10000'),

  // Feature Flags
  features: {
    analytics: process.env.ENABLE_ANALYTICS === 'true',
    crashReporting: process.env.ENABLE_CRASH_REPORTING === 'true',
    voiceChat: process.env.ENABLE_VOICE_CHAT === 'true',
    crisisDetection: process.env.ENABLE_CRISIS_DETECTION === 'true',
    offlineMode: process.env.ENABLE_OFFLINE_MODE === 'true',
  },

  // Security
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || 'fallback-secret-key',
  },

  encryption: {
    key: process.env.ENCRYPTION_KEY || 'fallback-encryption-key',
  },

  // Mental Health Features
  crisis: {
    hotlineNumber: process.env.CRISIS_HOTLINE_NUMBER || '988',
    emergencyEmail: process.env.EMERGENCY_CONTACT_EMAIL || 'help@solace-ai.com',
  },

  // App Version
  appVersion: process.env.APP_VERSION || '1.0.0',
  minSupportedVersion: process.env.MIN_SUPPORTED_VERSION || '1.0.0',
};