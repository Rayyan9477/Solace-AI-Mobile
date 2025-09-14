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
 * - FIXED: Added global polyfills for "compact" function
 */

// Global polyfills - must be defined before any other imports
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useCallback } from "react";
import { Platform, AppState } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Redux Store
import EnhancedLoadingScreen from "./src/components/LoadingScreen/EnhancedLoadingScreen";
import { RefactoredAppProvider } from "./src/components/RefactoredAppProvider";
import AppNavigator from "./src/navigation/AppNavigator";
import { restoreAuthState } from "./src/store/slices/authSlice";
import { store, persistor } from "./src/store/store";

if (typeof global !== "undefined" && typeof global.compact === "undefined") {
  global.compact = function (arr) {
    return arr ? arr.filter((item) => item != null) : [];
  };
}

if (typeof window !== "undefined" && typeof window.compact === "undefined") {
  window.compact = function (arr) {
    return arr ? arr.filter((item) => item != null) : [];
  };
}

// Ensure Array.prototype.compact exists
if (typeof Array !== "undefined" && !Array.prototype.compact) {
  Array.prototype.compact = function () {
    return this.filter((item) => item != null);
  };
}

// Get app version from package.json
const APP_VERSION = "1.0.0";

/**
 * Backup Auth Initializer - Ensures auth state is initialized even if main provider fails
 */
const BackupAuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Backup initialization: dispatch restoreAuthState as fallback
    // This ensures auth state is initialized even if RefactoredAppProvider fails
    console.log(
      "≡ƒÜÇ BackupAuthInitializer: Starting backup auth initialization...",
    );
    const backupInitializeAuth = async () => {
      try {
        await dispatch(restoreAuthState());
        console.log(
          "≡ƒÜÇ BackupAuthInitializer: Backup auth initialization completed",
        );
      } catch (error) {
        console.error(
          "≡ƒÜÇ BackupAuthInitializer: Backup auth initialization failed:",
          error,
        );
      }
    };

    // Small delay to allow RefactoredAppProvider to initialize first
    setTimeout(backupInitializeAuth, 100);
  }, [dispatch]);

  return children;
};

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
    console.log("🌟 Solace AI Mobile: Starting mental health support app...");
    console.log(`📊 Platform: ${Platform.OS}`);
    console.log(`📱 Version: ${APP_VERSION}`);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <BackupAuthInitializer>{children}</BackupAuthInitializer>
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
  console.log(
    "🌟 App: Main App component rendering with RefactoredAppProvider",
  );
  return (
    <AppRoot>
      <PersistGate loading={null} persistor={persistor}>
        <RefactoredAppProvider appVersion={APP_VERSION}>
          <NavigationWrapper>
            <AppNavigator />
          </NavigationWrapper>
        </RefactoredAppProvider>
      </PersistGate>
    </AppRoot>
  );
};

// Performance optimization: wrap in React.memo to prevent unnecessary re-renders
export default React.memo(App);
