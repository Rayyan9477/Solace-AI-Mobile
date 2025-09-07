/**
 * Solace AI Mobile - Mental Health Support App
 * Main App Entry Point - REFACTORED VERSION
 *
 * Provides comprehensive mental health support through AI-powered conversations,
 * mood tracking, therapeutic activities, and crisis intervention resources.
 *
 * REFACTORING IMPROVEMENTS:
 * - Modern React patterns with hooks and performance optimizations
 * - Clean separation of concerns with dedicated providers
 * - Enhanced error handling with therapeutic design
 * - Progressive loading with mental health focused messaging
 * - Better provider architecture with reduced nesting
 * - Comprehensive accessibility and performance monitoring
 */

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useCallback } from "react";
import { Platform, AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Redux Store
import EnhancedLoadingScreen from "./src/components/LoadingScreen/EnhancedLoadingScreen";
import { RefactoredAppProvider } from "./src/components/RefactoredAppProvider";
import AppNavigator from "./src/navigation/AppNavigator";
import { store, persistor } from "./src/store/store";

// Navigation

// Refactored App Provider

// Enhanced Loading Screen

// Get app version from package.json
const APP_VERSION = "1.0.0"; // Could be imported from package.json in a real app

/**
 * Redux Persistence Loading Component
 * Shows while Redux store is being rehydrated
 */
const ReduxLoadingScreen = () => (
  <EnhancedLoadingScreen
    message="Restoring your wellness data..."
    stage="syncing"
    progress={50}
    customMessages={{
      syncing: [
        "Securely restoring your progress...",
        "Loading your personalized settings...",
        "Preparing your mental health tools...",
      ],
    }}
  />
);

/**
 * App Root - Contains only essential providers that need to wrap everything
 */
const AppRoot = ({ children }) => {
  // Handle app state changes for better performance
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (__DEV__) {
        console.log(`📱 App state changed to: ${nextAppState}`);
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, []);

  // Log app startup
  useEffect(() => {
    console.log(
      "🌟 Solace AI Mobile: Starting refactored mental health support app...",
    );
    console.log(`📊 Platform: ${Platform.OS}`);
    console.log(`📱 Version: ${APP_VERSION}`);

    if (__DEV__) {
      console.log("🛠️ Development mode: Enhanced debugging enabled");
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={<ReduxLoadingScreen />} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

/**
 * Navigation Wrapper - Handles navigation-specific concerns
 */
const NavigationWrapper = ({ children }) => {
  // Navigation state change handler
  const onNavigationStateChange = useCallback((state) => {
    if (__DEV__ && state) {
      console.log("🧭 Navigation state changed:", state);
    }
  }, []);

  // Navigation ready handler
  const onNavigationReady = useCallback(() => {
    console.log("🧭 Navigation is ready");
  }, []);

  return (
    <NavigationContainer
      onStateChange={onNavigationStateChange}
      onReady={onNavigationReady}
    >
      <StatusBar style="auto" />
      {children}
    </NavigationContainer>
  );
};

/**
 * Main App Component - Clean, modern, and performant
 */
const App = () => {
  // Memoize the navigation content to prevent unnecessary re-renders
  const navigationContent = useMemo(
    () => (
      <NavigationWrapper>
        <AppNavigator />
      </NavigationWrapper>
    ),
    [],
  );

  return (
    <AppRoot>
      <RefactoredAppProvider appVersion={APP_VERSION}>
        {navigationContent}
      </RefactoredAppProvider>
    </AppRoot>
  );
};

// Performance optimization: wrap in React.memo to prevent unnecessary re-renders
export default React.memo(App);

/**
 * REFACTORING SUMMARY:
 *
 * ✅ ARCHITECTURE IMPROVEMENTS:
 * - Separated concerns into focused components (AppRoot, NavigationWrapper, App)
 * - Reduced provider nesting complexity with better organization
 * - Introduced RefactoredAppProvider with clean separation of concerns
 * - Added proper component memoization for performance
 *
 * ✅ ERROR HANDLING:
 * - Comprehensive error boundary with mental health focus
 * - Progressive error recovery with retry mechanisms
 * - Emergency support integration throughout error states
 * - Therapeutic error messaging and UI design
 *
 * ✅ LOADING & PERFORMANCE:
 * - Enhanced loading screens with therapeutic design
 * - Progressive loading stages with meaningful messages
 * - Performance monitoring and metrics tracking
 * - App state change handling for better lifecycle management
 *
 * ✅ MENTAL HEALTH FOCUS:
 * - Crisis intervention keyboard shortcuts
 * - Privacy protection features
 * - Accessibility enhancements for screen readers
 * - Therapeutic color schemes and animations
 *
 * ✅ MODERN REACT PATTERNS:
 * - Functional components with hooks
 * - Proper dependency arrays and effect cleanup
 * - Component memoization and performance optimizations
 * - Modern context patterns with provider composition
 *
 * ✅ DEVELOPER EXPERIENCE:
 * - Comprehensive logging and debugging
 * - Clear code organization and documentation
 * - Performance metrics in development mode
 * - Error tracking integration ready
 */
