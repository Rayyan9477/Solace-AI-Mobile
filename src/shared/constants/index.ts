/**
 * Global App Constants
 * Unified constants for Expo apps with environment variable support
 */

import { Platform } from "react-native";

export const APP_CONFIG = {
  name: "Solace AI Mobile",
  version: "1.0.0",
  description: "Your empathetic digital confidant",
  environment: process.env.NODE_ENV || "development",
  supportedPlatforms: ["ios", "android", "web"] as const,

  // App Version
  appVersion: process.env.APP_VERSION || "1.0.0",
  minSupportedVersion: process.env.MIN_SUPPORTED_VERSION || "1.0.0",

  // Feature Flags
  features: {
    analytics: process.env.ENABLE_ANALYTICS === "true",
    crashReporting: process.env.ENABLE_CRASH_REPORTING === "true",
    voiceChat: process.env.ENABLE_VOICE_CHAT === "true",
    crisisDetection: process.env.ENABLE_CRISIS_DETECTION !== "false", // Enabled by default
    offlineMode: process.env.ENABLE_OFFLINE_MODE === "true",
  },

  // Security - These MUST be set via environment variables
  jwt: {
    secretKey:
      process.env.JWT_SECRET_KEY || (__DEV__ ? "dev-only-secret-key" : ""),
  },

  encryption: {
    key:
      process.env.ENCRYPTION_KEY || (__DEV__ ? "dev-only-encryption-key" : ""),
  },
} as const;

export const API_CONFIG = {
  baseURL:
    process.env.API_BASE_URL ||
    (__DEV__ ? "http://localhost:3000/api" : "https://api.solace-ai.com"),
  timeout: parseInt(process.env.API_TIMEOUT || "30000"),
  retryAttempts: 3,
} as const;

export const STORAGE_KEYS = {
  user: "@solace_user",
  theme: "@solace_theme",
  mood: "@solace_mood",
  auth: "@solace_auth",
  preferences: "@solace_preferences",
  onboarding: "@solace_onboarding",
} as const;

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  therapeutic: 800,
} as const;

export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

export const PLATFORM_CONFIG = {
  isIOS: Platform.OS === "ios",
  isAndroid: Platform.OS === "android",
  isWeb: Platform.OS === "web",
  isNative: Platform.OS !== "web",
  isMobile: Platform.OS === "ios" || Platform.OS === "android",
} as const;

export const THERAPEUTIC_COLORS = {
  serenityGreen: "#4ADE80",
  empathyOrange: "#FB923C",
  mindfulBrown: "#A3A3A3",
  kindPurple: "#A78BFA",
  zenYellow: "#FDE047",
  optimisticGray: "#6B7280",
} as const;

export const CRISIS_RESOURCES = {
  suicide: {
    number: process.env.CRISIS_HOTLINE_NUMBER || "988",
    name: "National Suicide Prevention Lifeline",
  },
  crisis: {
    number: "741741",
    name: "Crisis Text Line (Text HOME)",
  },
  emergency: {
    number: "911",
    name: "Emergency Services",
  },
  emergencyEmail: process.env.EMERGENCY_CONTACT_EMAIL || "help@solace-ai.com",
} as const;

export const MOOD_SCALE = {
  min: 1,
  max: 10,
  default: 5,
} as const;

export const SESSION_CONFIG = {
  maxDuration: 3600000, // 1 hour in ms
  idleTimeout: 900000, // 15 minutes in ms
  autoSave: 30000, // 30 seconds in ms
} as const;
