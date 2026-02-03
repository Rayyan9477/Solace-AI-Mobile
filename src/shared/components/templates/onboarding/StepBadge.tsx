/**
 * StepBadge Component
 * @description Pill-shaped step indicator for onboarding carousel
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { StepBadgeProps } from "./OnboardingCarouselCard.types";

/**
 * Generate step label from step number
 */
function getStepLabel(stepNumber: number): string {
  const labels = ["", "Step One", "Step Two", "Step Three", "Step Four", "Step Five"];
  return labels[stepNumber] || `Step ${stepNumber}`;
}

/**
 * StepBadge Component
 * Displays a pill-shaped badge with step information
 *
 * @example
 * ```tsx
 * <StepBadge stepNumber={1} />
 * // Displays "Step One"
 *
 * <StepBadge stepNumber={3} label="Custom Label" />
 * // Displays "Custom Label"
 * ```
 */
export function StepBadge({
  stepNumber,
  label,
  testID,
  style,
}: StepBadgeProps): React.ReactElement {
  const displayLabel = label || getStepLabel(stepNumber);

  return (
    <View
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={`${displayLabel} of 5`}
      style={[styles.container, style]}
    >
      <Text style={styles.label}>{displayLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignSelf: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default StepBadge;
