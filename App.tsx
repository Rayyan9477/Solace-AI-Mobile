/**
 * App Entry Point
 * @description Main application entry point for Solace AI Mobile
 * @module App
 */

import React from "react";
import { AppRegistry, Platform, SafeAreaView, StatusBar, StyleSheet, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { ErrorBoundary } from "react-error-boundary";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts as useFraunces,
  Fraunces_400Regular,
  Fraunces_400Regular_Italic,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from "@expo-google-fonts/fraunces";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  FiraCode_400Regular,
  FiraCode_500Medium,
} from "@expo-google-fonts/fira-code";

import RootNavigatorContainer from "./src/app/navigation/RootNavigator";
import { AuthProvider } from "./src/app/AuthContext";
import { RepositoryProvider } from "./src/app/providers/RepositoryProvider";
import { ThemeProvider } from "./src/shared/theme/useTheme";
import { linking } from "./src/app/navigation/linking";
import { palette } from "./src/shared/theme";

// Keep the splash visible until fonts resolve so headlines never flash in the
// system fallback face.
SplashScreen.preventAutoHideAsync().catch(() => {
  // Fine if it fails — splash will just auto-hide normally.
});

function ErrorFallback({ resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }): React.ReactElement {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorAction} onPress={resetErrorBoundary}>Tap to retry</Text>
    </View>
  );
}

/**
 * App Component
 * @description Root application component
 * @returns {React.ReactElement} App component
 */
function App(): React.ReactElement | null {
  const [fontsLoaded, fontError] = useFraunces({
    Fraunces_400Regular,
    Fraunces_400Regular_Italic,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    FiraCode_400Regular,
    FiraCode_500Medium,
  });

  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {
        // Splash already hidden / not applicable — ignore.
      });
    }
  }, [fontsLoaded, fontError]);

  // Stay on splash until fonts are ready. If loading fails, we continue with
  // system fallbacks rather than blocking the user from entering the app.
  if (!fontsLoaded && !fontError) return null;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <RepositoryProvider>
          <ThemeProvider>
            <SafeAreaView style={styles.container}>
              <StatusBar barStyle="light-content" backgroundColor={palette.midnight[950]} />
              <NavigationContainer linking={linking}>
                <RootNavigatorContainer />
              </NavigationContainer>
            </SafeAreaView>
          </ThemeProvider>
        </RepositoryProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.midnight[950],
    flex: 1,
  },
  errorAction: {
    color: palette.warm[100],
    fontSize: 16,
  },
  errorContainer: {
    alignItems: "center",
    backgroundColor: palette.midnight[950],
    flex: 1,
    justifyContent: "center",
  },
  errorTitle: {
    color: palette.warm[50],
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
});

export default App;

AppRegistry.registerComponent("main", () => App);

if (Platform.OS === "web") {
  const rootTag = document.getElementById("root");
  if (rootTag) {
    AppRegistry.runApplication("main", { rootTag });
  }
}
