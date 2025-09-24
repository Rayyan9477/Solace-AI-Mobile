/**
 * Expo Module Exports with Web Compatibility
 */

// Platform-specific imports with fallbacks
let StatusBar, SplashScreen;

try {
  // Try to import from expo-status-bar (web-compatible)
  StatusBar = require('expo-status-bar').StatusBar;
} catch (e) {
  console.warn('expo-status-bar not available, using fallback');
  // Fallback StatusBar component for web
  StatusBar = ({ style }) => null;
}

try {
  // Try to import SplashScreen
  SplashScreen = require('expo-splash-screen');
} catch (e) {
  console.warn('expo-splash-screen not available, using fallback');
  // Fallback SplashScreen for web
  SplashScreen = {
    preventAutoHideAsync: () => Promise.resolve(),
    hideAsync: () => Promise.resolve(),
  };
}

export { StatusBar, SplashScreen };