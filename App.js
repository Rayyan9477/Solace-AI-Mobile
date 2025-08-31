/**
 * Solace AI Mobile - Mental Health Support App
 * Main App Entry Point - FIXED VERSION
 * 
 * Provides comprehensive mental health support through AI-powered conversations,
 * mood tracking, therapeutic activities, and crisis intervention resources.
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Redux Store
import { store, persistor } from './src/store/store';

// App Providers and Navigation
import { AppProvider } from './src/components/AppProvider';
import AppNavigator from './src/navigation/AppNavigator';

// Error Boundary and Loading Components
import { withErrorBoundary } from './src/utils/ErrorBoundary';
import SimpleFallbackScreen from './src/components/SimpleFallbackScreen';

const LoadingScreen = () => (
  <SimpleFallbackScreen 
    message="Loading your mental health companion..."
    showSpinner={true}
  />
);

const App = () => {
  console.log('🌟 Solace AI Mobile: Starting fixed mental health support app...');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <SafeAreaProvider>
            <AppProvider>
              <NavigationContainer>
                <StatusBar style="auto" backgroundColor="transparent" translucent />
                <AppNavigator />
              </NavigationContainer>
            </AppProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

// Wrap the app with error boundary for crash protection
const SafeApp = withErrorBoundary(App, {
  fallback: ({ error, retry, goHome }) => (
    <SimpleFallbackScreen 
      message="Something went wrong with the mental health app"
      error={error}
      onRetry={retry}
      onGoHome={goHome}
      showEmergencyHelp={true}
    />
  ),
  onError: (error, errorInfo) => {
    console.error('🚨 Mental Health App Error:', error);
    console.error('Error Info:', errorInfo);
    
    // In production, you might want to send this to a logging service
    // but be careful not to log sensitive mental health data
    if (!__DEV__) {
      // Log non-sensitive error information only
      console.log('Production error logged (no sensitive data)');
    }
  },
});

export default SafeApp;