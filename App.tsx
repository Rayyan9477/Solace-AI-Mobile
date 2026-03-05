/**
 * App Entry Point
 * @description Main application entry point for Solace AI Mobile
 * @module App
 */

import React from "react";
import { AppRegistry, Platform, SafeAreaView, StatusBar, StyleSheet, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { ErrorBoundary } from "react-error-boundary";
import RootNavigatorContainer from "./src/app/navigation/RootNavigator";
import { AuthProvider } from "./src/app/AuthContext";
import { ThemeProvider } from "./src/shared/theme/useTheme";
import { linking } from "./src/app/navigation/linking";
import { palette } from "./src/shared/theme";

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
function App(): React.ReactElement {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <ThemeProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={palette.brown[900]} />
            <NavigationContainer linking={linking}>
              <RootNavigatorContainer />
            </NavigationContainer>
          </SafeAreaView>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.brown[900],
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.brown[900],
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: palette.tan[100],
    marginBottom: 12,
  },
  errorAction: {
    fontSize: 16,
    color: palette.tan[300],
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
