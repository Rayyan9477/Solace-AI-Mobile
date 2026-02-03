/**
 * PlaceholderIllustration Component
 * @description Temporary placeholder for onboarding illustrations
 * Replace with actual PNG images when available
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PlaceholderIllustrationProps {
  stepNumber: number;
  color: string;
}

/**
 * Placeholder illustration component
 * Displays a simple colored box with step number until actual illustrations are added
 */
export function PlaceholderIllustration({
  stepNumber,
  color,
}: PlaceholderIllustrationProps): React.ReactElement {
  return (
    <View style={[styles.container, { borderColor: color }]}>
      <Text style={styles.text}>Illustration</Text>
      <Text style={styles.stepText}>Step {stepNumber}</Text>
      <Text style={styles.helpText}>Replace with actual image</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderRadius: 100,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  stepText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
});

export default PlaceholderIllustration;
