/**
 * OnboardingProgressBar Component
 * @description Segmented horizontal progress indicator for onboarding carousel
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import type { OnboardingProgressBarProps } from "./OnboardingCarouselCard.types";

/**
 * OnboardingProgressBar Component
 * Displays a segmented progress bar showing current step in onboarding
 *
 * @example
 * ```tsx
 * // Step 1 of 5
 * <OnboardingProgressBar currentStep={1} totalSteps={5} />
 *
 * // Step 3 of 5 with custom colors
 * <OnboardingProgressBar
 *   currentStep={3}
 *   totalSteps={5}
 *   activeColor="#C4A574"
 *   inactiveColor="#4A4A4A"
 * />
 * ```
 */
export function OnboardingProgressBar({
  currentStep,
  totalSteps,
  activeColor = "#C4A574",
  inactiveColor = "#4A4A4A",
  testID,
  style,
}: OnboardingProgressBarProps): React.ReactElement {
  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${currentStep} of ${totalSteps}`}
      accessibilityValue={{
        min: 1,
        max: totalSteps,
        now: currentStep,
      }}
      style={[styles.container, style]}
    >
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;

        return (
          <View
            key={`segment-${stepNumber}`}
            testID={testID ? `${testID}-segment-${stepNumber}` : undefined}
            style={[
              styles.segment,
              {
                backgroundColor: isActive ? activeColor : inactiveColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    paddingHorizontal: 24,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
});

export default OnboardingProgressBar;
