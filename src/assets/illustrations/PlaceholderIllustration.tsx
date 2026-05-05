/**
 * PlaceholderIllustration Component
 * @description Temporary placeholder for onboarding illustrations
 * Replace with actual PNG images when available
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { palette } from "../../shared/theme";

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
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 100,
    borderStyle: "dashed",
    borderWidth: 2,
    height: 200,
    justifyContent: "center",
    width: 200,
  },
  helpText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    textAlign: "center",
  },
  stepText: {
    color: palette.warm[50],
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  text: {
    color: palette.warm[50],
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
});

export default PlaceholderIllustration;
