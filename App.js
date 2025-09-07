/**
 * Solace AI Mobile - Mental Health Support App
 * Main App Entry Point - FIXED VERSION
 *
 * Provides comprehensive mental health support through AI-powered conversations,
 * mood tracking, therapeutic activities, and crisis intervention resources.
 */

import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Redux Store
import { AppProvider } from "./src/components/AppProvider";
import SimpleFallbackScreen from "./src/components/SimpleFallbackScreen";
import AppNavigator from "./src/navigation/AppNavigator";
import { store, persistor } from "./src/store/store";

// App Components and Navigation

// Error Boundary
// import { withErrorBoundary } from "./src/utils/ErrorBoundary";

const LoadingScreen = () => (
  <SimpleFallbackScreen
    message="Loading your mental health companion..."
    showSpinner
  />
);

const App = () => {
  console.log(
    "🌟 Solace AI Mobile: Starting fixed mental health support app...",
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <AppProvider>
              <NavigationContainer>
                <StatusBar style="auto" />
                <AppNavigator />
              </NavigationContainer>
            </AppProvider>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
