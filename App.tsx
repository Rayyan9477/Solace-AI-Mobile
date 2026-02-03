/**
 * App Entry Point
 * @description Main application entry point for Solace AI Mobile
 * @module App
 */

import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigatorContainer from "./src/app/navigation/RootNavigator";
import { linking } from "./src/app/navigation/linking";

/**
 * App Component
 * @description Root application component
 * @returns {React.ReactElement} App component
 */
export default function App(): React.ReactElement {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1410" />
      <NavigationContainer linking={linking}>
        <RootNavigatorContainer />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1410", // Dark brown background (theme primary)
  },
});
