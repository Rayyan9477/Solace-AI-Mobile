/**
 * Solace AI Mobile - Mental Health Support App
 * Main App Entry Point - Expo Compatible
 *
 * Features:
 * - Full Expo SDK compatibility
 * - Cross-platform support (iOS, Android, Web)
 * - Material Design 3 UI system
 * - Therapeutic animations with Framer Motion
 * - Paper shaders for backgrounds
 * - Feature-based architecture
 */

// Expo compatibility layer
import 'expo-dev-client';

// Core React Native and Expo imports
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useCallback } from 'react';
import { Platform, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Expo modules
import { StatusBar, SplashScreen } from './src/shared/expo';
import { platform } from './src/shared/utils/platform';

// App modules
import { ThemeProvider } from './src/design-system/theme/ThemeProvider';
import AppNavigator from './src/navigation/AppNavigator';
import { restoreAuthState } from './src/store/slices/authSlice';
import { store, persistor } from './src/store/store';
import { APP_CONFIG } from './src/shared/constants';
import { validateApp } from './src/shared/utils/validation';

// Global polyfills for cross-platform compatibility
if (typeof global !== 'undefined' && typeof global.compact === 'undefined') {
  global.compact = function (arr) {
    return arr ? arr.filter((item) => item != null) : [];
  };
}

if (platform.isWeb && typeof window !== 'undefined' && typeof window.compact === 'undefined') {
  window.compact = function (arr) {
    return arr ? arr.filter((item) => item != null) : [];
  };
}

// Ensure Array.prototype.compact exists (with proper type safety)
if (typeof Array !== 'undefined' && !Array.prototype.compact) {
  Array.prototype.compact = function () {
    return this.filter((item) => item != null);
  };
}

// Prevent splash screen from auto-hiding
if (SplashScreen) {
  SplashScreen.preventAutoHideAsync().catch(() => {
    // Splash screen might not be available in all environments
  });
}

// App configuration
const APP_VERSION = APP_CONFIG.version;

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

  // Log app startup with comprehensive validation
  useEffect(() => {
    console.log('🌟 Solace AI Mobile: Starting mental health support app...');
    console.log(`📊 Platform: ${Platform.OS} ${Platform.Version}`);
    console.log(`📱 Version: ${APP_VERSION}`);
    console.log(`🔧 Expo: ${platform.isExpoGo ? 'Expo Go' : 'Standalone'}`);
    console.log(`🖥️  Device: ${platform.getDeviceType()}`);

    // Run comprehensive app validation
    const validationResults = validateApp();

    if (!validationResults.overall.isValid) {
      console.warn('⚠️ App validation failed - some features may not work correctly');
    }

    // Hide splash screen after initialization
    if (SplashScreen) {
      setTimeout(() => {
        SplashScreen.hideAsync().catch(() => {
          // Splash screen might not be available
        });
      }, 1000);
    }
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
        <ThemeProvider>
          <NavigationWrapper>
            <AppNavigator />
          </NavigationWrapper>
        </ThemeProvider>
      </PersistGate>
    </AppRoot>
  );
};

// Performance optimization: wrap in React.memo to prevent unnecessary re-renders
export default React.memo(App);
