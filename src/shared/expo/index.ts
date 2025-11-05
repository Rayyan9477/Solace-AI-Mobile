/**
 * Expo Module Exports
 * Centralized exports for Expo modules with fallbacks
 */

import { logger } from "../utils/logger";

// Status Bar
export { StatusBar } from "expo-status-bar";

// Splash Screen with fallback
let SplashScreen: any = null;
try {
  SplashScreen = require("expo-splash-screen");
} catch (error) {
  logger.warn("SplashScreen not available");
  // Provide fallback methods
  SplashScreen = {
    preventAutoHideAsync: () => Promise.resolve(),
    hideAsync: () => Promise.resolve(),
  };
}
export { SplashScreen };
