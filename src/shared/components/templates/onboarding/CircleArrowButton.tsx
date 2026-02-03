/**
 * CircleArrowButton Component
 * @description Circular button with arrow icon for onboarding navigation
 */

import React from "react";
import { Pressable, StyleSheet, type ViewStyle } from "react-native";
import type { CircleArrowButtonProps } from "./OnboardingCarouselCard.types";

/**
 * Simple arrow icon using Unicode characters
 */
function ArrowIcon({ direction, color }: { direction: "left" | "right"; color: string }): React.ReactElement {
  const { Text } = require("react-native");
  return (
    <Text style={{ color, fontSize: 24, fontWeight: "bold" }}>
      {direction === "left" ? "←" : "→"}
    </Text>
  );
}

/**
 * CircleArrowButton Component
 * Circular button for navigation in onboarding carousel
 *
 * @example
 * ```tsx
 * // Next button
 * <CircleArrowButton
 *   onPress={handleNext}
 *   direction="right"
 *   accessibilityLabel="Next step"
 * />
 *
 * // Back button
 * <CircleArrowButton
 *   onPress={handleBack}
 *   direction="left"
 *   accessibilityLabel="Previous step"
 * />
 *
 * // Complete button (final step)
 * <CircleArrowButton
 *   onPress={handleComplete}
 *   variant="complete"
 *   accessibilityLabel="Complete onboarding"
 * />
 * ```
 */
export function CircleArrowButton({
  onPress,
  direction = "right",
  variant = "next",
  disabled = false,
  size = 56,
  backgroundColor = "#C4A574",
  iconColor = "#FFFFFF",
  accessibilityLabel,
  testID,
  style,
}: CircleArrowButtonProps): React.ReactElement {
  // Calculate hitSlop if button is smaller than 44pt (minimum touch target)
  const hitSlop =
    size < 44
      ? {
          top: Math.ceil((44 - size) / 2),
          bottom: Math.ceil((44 - size) / 2),
          left: Math.ceil((44 - size) / 2),
          right: Math.ceil((44 - size) / 2),
        }
      : undefined;

  // Button style
  const buttonStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: disabled ? "rgba(196, 165, 116, 0.3)" : backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    opacity: disabled ? 0.5 : 1,
  };

  // Pressed state style
  const getPressedStyle = (pressed: boolean): ViewStyle => {
    if (pressed && !disabled) {
      return {
        transform: [{ scale: 0.95 }],
        opacity: 0.8,
      };
    }
    return {};
  };

  return (
    <Pressable
      testID={testID}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{
        disabled,
      }}
      style={({ pressed }) => [buttonStyle, getPressedStyle(pressed), style]}
    >
      <ArrowIcon direction={direction} color={iconColor} />
    </Pressable>
  );
}

export default CircleArrowButton;
