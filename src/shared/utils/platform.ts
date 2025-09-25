/**
 * Platform Utilities
 * Cross-platform compatibility helpers for Expo apps
 */

import { Platform, Dimensions } from "react-native";

/**
 * Check if running in Expo Go
 */
export const isExpoGo = (() => {
  try {
    return !!require("expo-constants").default?.executionEnvironment;
  } catch {
    return false;
  }
})();

/**
 * Get device type based on screen dimensions
 */
export function getDeviceType() {
  const { width, height } = Dimensions.get("window");
  const aspectRatio = width / height;

  if (Platform.OS === "web") {
    if (width >= 1200) return "desktop";
    if (width >= 768) return "tablet";
    return "mobile";
  }

  if (
    (Platform.OS === "ios" && Platform.isPad) ||
    (width >= 768 && aspectRatio > 1.2)
  ) {
    return "tablet";
  }

  return "mobile";
}

export const platform = {
  isIOS: Platform.OS === "ios",
  isAndroid: Platform.OS === "android",
  isWeb: Platform.OS === "web",
  isNative: Platform.OS !== "web",

  // Platform versions
  version: Platform.Version,

  // Device info
  isPad: Platform.OS === "ios" && Platform.isPad,
  isTv: Platform.isTV,

  // Screen dimensions
  screen: Dimensions.get("screen"),
  window: Dimensions.get("window"),

  // Platform-specific selections
  select: Platform.select,

  // Device type method
  getDeviceType,

  // Expo detection
  isExpoGo,
} as const;

/**
 * Get platform-specific component or value
 */
export function selectPlatform<T>(options: {
  ios?: T;
  android?: T;
  web?: T;
  native?: T;
  default?: T;
}): T | undefined {
  if (options.ios && platform.isIOS) return options.ios;
  if (options.android && platform.isAndroid) return options.android;
  if (options.web && platform.isWeb) return options.web;
  if (options.native && platform.isNative) return options.native;
  return options.default;
}

/**
 * Check if running in Expo development mode
 */
export const isDev = __DEV__;

/**
 * Get safe area insets for cross-platform layouts
 */
export function getSafeAreaInsets() {
  if (platform.isWeb) {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  // For native platforms, this should be used with SafeAreaProvider
  return { top: 20, bottom: 0, left: 0, right: 0 };
}

/**
 * Check if device supports haptic feedback
 */
export function supportsHaptics(): boolean {
  return platform.isIOS || platform.isAndroid;
}

/**
 * Check if device supports voice recognition
 */
export function supportsVoice(): boolean {
  return platform.isNative; // Web support varies
}

/**
 * Get platform-specific animation config
 */
export function getAnimationConfig() {
  return selectPlatform({
    ios: { useNativeDriver: true, tension: 300, friction: 8 },
    android: { useNativeDriver: true, tension: 250, friction: 6 },
    web: { useNativeDriver: false, tension: 200, friction: 5 },
    default: { useNativeDriver: platform.isNative, tension: 250, friction: 7 },
  });
}
