/**
 * Platform-Specific Animation Utilities
 * Ensures optimal animation performance across iOS, Android, and Web
 */

import { platform } from "../utils/platform";

/**
 * Get platform-optimized animation configuration
 */
export function getPlatformAnimationConfig() {
  return platform.select({
    ios: {
      useNativeDriver: true,
      enableVectorDrawables: false,
      shouldRasterizeIOS: true,
      renderToHardwareTextureAndroid: false,
    },
    android: {
      useNativeDriver: true,
      enableVectorDrawables: true,
      shouldRasterizeIOS: false,
      renderToHardwareTextureAndroid: true,
    },
    web: {
      useNativeDriver: false,
      enableVectorDrawables: false,
      shouldRasterizeIOS: false,
      renderToHardwareTextureAndroid: false,
    },
    default: {
      useNativeDriver: platform.isNative,
      enableVectorDrawables: platform.isAndroid,
      shouldRasterizeIOS: platform.isIOS,
      renderToHardwareTextureAndroid: platform.isAndroid,
    },
  });
}

/**
 * Get platform-specific duration multipliers
 */
export function getPlatformDurationMultiplier(): number {
  return platform.select({
    ios: 1.0, // iOS has smooth 60fps animations
    android: 1.2, // Android might need slightly longer durations
    web: 0.8, // Web can be faster with CSS transitions
    default: 1.0,
  });
}

/**
 * Check if platform supports advanced animations
 */
export function supportsAdvancedAnimations(): boolean {
  return platform.select({
    ios: true,
    android: true,
    web: typeof window !== "undefined" && "requestAnimationFrame" in window,
    default: platform.isNative,
  });
}

/**
 * Get platform-specific easing functions
 */
export const platformEasing = {
  ios: {
    standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0.0, 1, 1)",
    sharp: "cubic-bezier(0.4, 0.0, 0.6, 1)",
  },
  android: {
    standard: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0.0, 1, 1)",
    sharp: "cubic-bezier(0.4, 0.0, 0.6, 1)",
  },
  web: {
    standard: "ease",
    decelerate: "ease-out",
    accelerate: "ease-in",
    sharp: "ease-in-out",
  },
};

/**
 * Therapeutic animation timing for mental health apps
 */
export const therapeuticTiming = {
  breathing: platform.select({
    ios: 4000,
    android: 4200,
    web: 3800,
    default: 4000,
  }),
  heartbeat: platform.select({
    ios: 800,
    android: 850,
    web: 750,
    default: 800,
  }),
  gentle: platform.select({
    ios: 600,
    android: 650,
    web: 550,
    default: 600,
  }),
  calming: platform.select({
    ios: 1200,
    android: 1300,
    web: 1100,
    default: 1200,
  }),
};
