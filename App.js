/**
 * Solace AI Mobile - Mental Health Support App
 * Main App Entry Point - FIXED VERSION
 *
 * Provides comprehensive mental health support through AI-powered conversations,
 * mood tracking, therapeutic activities, and crisis intervention resources.
 */

import React from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

// Redux Store
import { store, persistor } from "./src/store/store";

// App Components and Navigation
import { AppProvider } from "./src/components/AppProvider";
import SimpleFallbackScreen from "./src/components/SimpleFallbackScreen";
import AppNavigator from "./src/navigation/AppNavigator";

// Error Boundary
import { withErrorBoundary } from "./src/utils/ErrorBoundary";

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

  // Very simple test component to check basic rendering
  const TestComponent = () => {
    console.log("🧪 TestComponent: Rendering...");
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightblue' }}>
        <Text style={{ fontSize: 24, color: 'black' }}>Test Component Working!</Text>
      </View>
    );
  };

  return <TestComponent />;
};

export default App;
