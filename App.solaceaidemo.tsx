/**
 * Solace AI Mobile App - Infrastructure Demo
 * Fixed version showcasing working UI components
 */
import React from "react";
import { View, StyleSheet } from "react-native";

// Import the main demo component
import AppInfrastructureDemo from "./src/AppInfrastructureDemo";

const App = () => {
  return (
    <View style={styles.container}>
      <AppInfrastructureDemo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;