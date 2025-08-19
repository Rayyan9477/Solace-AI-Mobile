/**
 * Solace AI Mobile App
 * Your Empathetic Digital Confidant
 */

import React, { useEffect } from "react";
import { TouchableOpacity, Text, Platform, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import LoadingScreen from "./src/screens/LoadingScreen";
import ErrorBoundary from "./src/components/ErrorBoundary";
import WebCompatibilityErrorBoundary from "./src/components/WebCompatibilityErrorBoundary";
import { useTheme } from "./src/shared/theme/ThemeContext";
import OptimizedAppNavigator from "./src/navigation/OptimizedAppNavigator";
import { store, persistor } from "./src/store/store";
import { AppProvider } from "./src/components/AppProvider";

// Conditionally import web setup only for web platform
if (Platform.OS === "web") {
  require("./src/setupWebReactGlobal");
  // Initialize web polyfills for better compatibility
  const { initializeWebPolyfills } = require("./src/utils/webPolyfills");
  initializeWebPolyfills();
}

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
      <OptimizedAppNavigator />
    </View>
  );
};

const App = () => {
  const [persistorLoaded, setPersistorLoaded] = React.useState(false);
  const [debugInfo, setDebugInfo] = React.useState("Initializing...");

  const handleAppRestart = () => {
    // In a real app, you might want to use a library like react-native-restart
    // For now, we'll just reload the app state
    console.log("App restart requested");
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.location.reload();
    }
  };

  // Enhanced debugging for web initialization
  React.useEffect(() => {
    if (Platform.OS === "web") {
      console.log("🔍 App.js: Starting initialization checks...");
      console.log("🔍 App.js: React available:", typeof React !== "undefined");
      console.log("🔍 App.js: Store available:", !!store);
      console.log("🔍 App.js: Persistor available:", !!persistor);
      console.log("🔍 App.js: Platform:", Platform.OS);
      setDebugInfo("Platform checks complete");

      // Test store state
      try {
        const state = store.getState();
        console.log("🔍 App.js: Initial Redux state:", state);
        console.log("🔍 App.js: Auth state:", state.auth);
        setDebugInfo("Redux state accessible");
      } catch (error) {
        console.error("🚨 App.js: Redux state error:", error);
        setDebugInfo(`Redux error: ${error.message}`);
      }
    }
  }, []);

  // Custom PersistGate with timeout and debugging
  const CustomPersistGate = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const timeoutRef = React.useRef();

    React.useEffect(() => {
      console.log("🔍 PersistGate: Starting persistence check...");

      // Set a timeout for persistor
      timeoutRef.current = setTimeout(() => {
        console.log(
          "⚠️ PersistGate: Persistence timeout reached, proceeding anyway",
        );
        setIsLoading(false);
        setPersistorLoaded(true);
        setDebugInfo("Persistence timeout - continuing without persistence");
      }, 3000); // 3 second timeout

      const unsubscribe = persistor.subscribe(() => {
        const state = persistor.getState();
        console.log("🔍 PersistGate: Persistor state change:", state);

        if (state.bootstrapped) {
          console.log("✅ PersistGate: Persistence bootstrapped successfully");
          clearTimeout(timeoutRef.current);
          setIsLoading(false);
          setPersistorLoaded(true);
          setDebugInfo("Persistence loaded successfully");
        }
      });

      return () => {
        unsubscribe();
        clearTimeout(timeoutRef.current);
      };
    }, []);

    if (isLoading) {
      return (
        <LoadingScreen
          text={
            Platform.OS === "web" ? `Loading... (${debugInfo})` : "Loading..."
          }
        />
      );
    }

    if (error) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 10, color: "red" }}>
            Persistence Error
          </Text>
          <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 20 }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setError(null);
              setIsLoading(false);
            }}
            style={{ padding: 10, backgroundColor: "#007AFF", borderRadius: 5 }}
          >
            <Text style={{ color: "white" }}>Continue Anyway</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return children;
  };

  return (
    <ErrorBoundary onRestart={handleAppRestart}>
      <WebCompatibilityErrorBoundary>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <Provider store={store}>
              <CustomPersistGate>
                <AppProvider>
                  <NavigationContainer>
                    <ThemedApp />
                  </NavigationContainer>
                </AppProvider>
              </CustomPersistGate>
            </Provider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </WebCompatibilityErrorBoundary>
    </ErrorBoundary>
  );
};

export default App;
