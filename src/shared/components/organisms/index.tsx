/**
 * Organism Components
 * Complex UI components
 */

import React from "react";
import { View, StyleSheet } from "react-native";

export const Container = ({ children, style, ...props }) => (
  <View style={[styles.container, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
});
