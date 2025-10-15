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

// Expo compatibility layer - only for native platforms
if (typeof window === 'undefined') {
  // Only import expo-dev-client on native platforms, not web
  try {
    require('expo-dev-client');
  } catch (error) {
    // expo-dev-client not available, continue without it (silent fail is OK here)
  }
}

// Core React Native and Expo imports
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useCallback } from 'react';
import { Platform, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerRootComponent } from 'expo';

// Expo modules
import { StatusBar, SplashScreen } from './src/shared/expo';
import { platform } from './src/shared/utils/platform';
import { logger } from './src/shared/utils/logger';

// App modules
import RefactoredAppProvider from './src/app/providers/RefactoredAppProvider';
import AppNavigator from './src/app/navigation/AppNavigator';
// Store providers are applied inside RefactoredAppProvider/AppProvider
import { APP_CONFIG } from './src/shared/constants';
import { validateApp } from './src/shared/utils/validation';

// Prevent splash screen from auto-hiding
if (SplashScreen) {
  SplashScreen.preventAutoHideAsync().catch(() => {
    // Splash screen might not be available in all environments
  });
}

// App configuration
const APP_VERSION = APP_CONFIG.version;

/**
 * App Root - Contains only essential providers that need to wrap everything
 */
const AppRoot = ({ children }) => {
  // Handle app state changes for better performance
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      logger.debug(`App state changed to: ${nextAppState}`);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  // Log app startup with comprehensive validation
  useEffect(() => {
    const initializeApp = async () => {
      logger.info('Starting mental health support app...');
      logger.info(`Platform: ${Platform.OS} ${Platform.Version}`);
      logger.info(`Version: ${APP_VERSION}`);
      logger.info(`Expo: ${platform.isExpoGo ? 'Expo Go' : 'Standalone'}`);
      logger.info(`Device: ${platform.getDeviceType()}`);

      // Run comprehensive app validation
      const validationResults = validateApp();

      if (!validationResults.overall.isValid) {
        logger.warn('App validation failed - some features may not work correctly');
      }

      // Hide splash screen after initialization is complete
      if (SplashScreen) {
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          // Splash screen might not be available
          logger.debug('Splash screen hide failed:', error);
        }
      }
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
  {children}
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
    if (state) {
      logger.debug('Navigation state changed:', state);
    }
  }, []);

  // Navigation ready handler
  const onNavigationReady = useCallback(() => {
    logger.info('Navigation is ready');
  }, []);

  return (
    <NavigationContainer
      onStateChange={onNavigationStateChange}
      onReady={onNavigationReady}
      onError={(error) => {
        logger.error('Navigation error:', error);
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
  logger.debug('App component rendering');

  return (
    <AppRoot>
      <RefactoredAppProvider>
        <NavigationWrapper>
          <AppNavigator />
        </NavigationWrapper>
      </RefactoredAppProvider>
    </AppRoot>
  );
};

// Register the main component with Expo
registerRootComponent(App);

export default App;
