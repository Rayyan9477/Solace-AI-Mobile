/**
 * Global App Constants
 * Platform-aware constants for Expo apps
 */

import { Platform } from 'react-native';

export const APP_CONFIG = {
  name: 'Solace AI Mobile',
  version: '1.0.0',
  description: 'Your empathetic digital confidant',
  supportedPlatforms: ['ios', 'android', 'web'] as const,
} as const;

export const API_CONFIG = {
  baseURL: __DEV__
    ? 'http://localhost:3000/api'
    : 'https://api.solace-ai.com',
  timeout: 30000,
  retryAttempts: 3,
} as const;

export const STORAGE_KEYS = {
  user: '@solace_user',
  theme: '@solace_theme',
  mood: '@solace_mood',
  auth: '@solace_auth',
  preferences: '@solace_preferences',
  onboarding: '@solace_onboarding',
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
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  isWeb: Platform.OS === 'web',
  isNative: Platform.OS !== 'web',
  isMobile: Platform.OS === 'ios' || Platform.OS === 'android',
} as const;

export const THERAPEUTIC_COLORS = {
  serenityGreen: '#4ADE80',
  empathyOrange: '#FB923C',
  mindfulBrown: '#A3A3A3',
  kindPurple: '#A78BFA',
  zenYellow: '#FDE047',
  optimisticGray: '#6B7280',
} as const;

export const CRISIS_RESOURCES = {
  suicide: {
    number: '988',
    name: 'National Suicide Prevention Lifeline',
  },
  crisis: {
    number: '741741',
    name: 'Crisis Text Line (Text HOME)',
  },
  emergency: {
    number: '911',
    name: 'Emergency Services',
  },
} as const;

export const MOOD_SCALE = {
  min: 1,
  max: 10,
  default: 5,
} as const;

export const SESSION_CONFIG = {
  maxDuration: 3600000, // 1 hour in ms
  idleTimeout: 900000,   // 15 minutes in ms
  autoSave: 30000,       // 30 seconds in ms
} as const;