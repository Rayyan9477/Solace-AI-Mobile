/**
 * Solace AI Mobile - Mental Health Support App
 * Main App Entry Point - FIXED VERSION
 *
 * Fixes for blank screen issues:
 * - Simplified initialization flow
 * - Removed complex async theme loading
 * - Added immediate rendering with fallbacks
 * - Streamlined provider architecture
 * - Emergency fallback for failed initializations
 */

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useCallback } from "react";
import { Platform, AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

// Redux Store
import EnhancedLoadingScreen from "./src/components/LoadingScreen/EnhancedLoadingScreen";
import { RefactoredAppProvider } from "./src/components/RefactoredAppProvider";
import AppNavigator from "./src/navigation/AppNavigator";
import { store } from "./src/store/store";

// Get app version from package.json
const APP_VERSION = "1.0.0";

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
      "🌟 Solace AI Mobile: Starting mental health support app...",
    );
    console.log(`📊 Platform: ${Platform.OS}`);
    console.log(`📱 Version: ${APP_VERSION}`);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          {children}
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
      onError={(error) => {
        console.error("🧭 Navigation error:", error);
      }}
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
  return (
    <AppRoot>
      <RefactoredAppProvider appVersion={APP_VERSION}>
        <NavigationWrapper>
          <AppNavigator />
        </NavigationWrapper>
      </RefactoredAppProvider>
    </AppRoot>
  );
};

// Performance optimization: wrap in React.memo to prevent unnecessary re-renders
export default React.memo(App);
