/**
 * Solace AI Mobile App
 * Your Empathetic Digital Confidant
 */

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useCallback } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// Conditionally import web setup only for web platform
if (Platform.OS === 'web') {
  require("./src/setupWebReactGlobal");
}

import LoadingScreen from "./src/components/LoadingScreen";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { ThemeProvider, useTheme } from "./src/shared/theme/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { store, persistor } from "./src/store/store";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const ThemedApp = () => {
  // Ensure React is globally available in web runtime for third-party modules relying on global React
  // setupWebReactGlobal ensures global React for web
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          ...MaterialCommunityIcons.font,
        });
      } catch (e) {
        console.warn("Error loading fonts:", e);
      }
      // Hide splash screen when fonts are loaded
      SplashScreen.hideAsync().catch(console.warn);
    }

    prepare();
  }, []);

  // Always render the app content
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        backgroundColor={theme.colors.background.primary}
        translucent
      />
      <AppNavigator />
    </View>
  );
};

const App = () => {
  const handleAppRestart = () => {
    // In a real app, you might want to use a library like react-native-restart
    // For now, we'll just reload the app state
    console.log("App restart requested");
  };

  return (
    <ErrorBoundary onRestart={handleAppRestart}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Provider store={store}>
            <PersistGate loading={<LoadingScreen />} persistor={persistor}>
              <ThemeProvider>
                <ErrorBoundary>
                  <NavigationContainer>
                    <ErrorBoundary>
                      <ThemedApp />
                    </ErrorBoundary>
                  </NavigationContainer>
                </ErrorBoundary>
              </ThemeProvider>
            </PersistGate>
          </Provider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default App;
