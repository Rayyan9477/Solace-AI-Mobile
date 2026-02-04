/**
 * ProgressBar Component
 * @description Linear progress indicator with determinate and indeterminate modes
 * @task Task 2.2.5: ProgressBar Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Determinate progress (0-100)
 * - Indeterminate mode for loading
 * - Multiple variants (default, success, warning, error)
 * - Three sizes (sm, md, lg)
 * - Optional percentage label
 * - Full accessibility support
 */

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import type { ProgressBarProps, ProgressBarVariant, ProgressBarSize } from "./ProgressBar.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  track: palette.gray[700],
  default: palette.indigo[400],
  success: palette.green[500],
  warning: palette.amber[500],
  error: palette.red[500],
  label: palette.gray[400],
};

/**
 * Size configurations
 */
const sizeConfig: Record<ProgressBarSize, { height: number; borderRadius: number }> = {
  sm: { height: 4, borderRadius: 2 },
  md: { height: 8, borderRadius: 4 },
  lg: { height: 12, borderRadius: 6 },
};

/**
 * Get fill color based on variant
 */
function getVariantColor(variant: ProgressBarVariant): string {
  const variantColors: Record<ProgressBarVariant, string> = {
    default: colors.default,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };
  return variantColors[variant];
}

/**
 * Clamp value between 0 and 100
 */
function clampValue(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/**
 * ProgressBar Component
 *
 * @example
 * ```tsx
 * // Basic progress bar
 * <ProgressBar value={75} />
 *
 * // With label
 * <ProgressBar value={50} showLabel />
 *
 * // Success variant
 * <ProgressBar value={100} variant="success" />
 *
 * // Indeterminate loading
 * <ProgressBar value={0} indeterminate />
 * ```
 */
export function ProgressBar({
  value,
  variant = "default",
  size = "md",
  showLabel = false,
  indeterminate = false,
  testID,
  accessibilityLabel,
  style,
}: ProgressBarProps): React.ReactElement {
  const config = sizeConfig[size];
  const fillColor = getVariantColor(variant);
  const clampedValue = clampValue(value);

  // Animation for indeterminate mode
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (indeterminate) {
      const animation = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      );
      animation.start();
      return () => animation.stop();
    } else {
      animatedValue.setValue(0);
    }
  }, [indeterminate, animatedValue]);

  // Indeterminate fill animation
  const indeterminateLeft = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["-30%", "100%"],
  });

  return (
    <View style={[styles.wrapper, style]}>
      {/* Track */}
      <View
        testID={testID}
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.round(clampedValue),
        }}
        style={[
          styles.track,
          {
            height: config.height,
            borderRadius: config.borderRadius,
          },
        ]}
      >
        {/* Fill */}
        {indeterminate ? (
          <Animated.View
            testID={testID ? `${testID}-fill` : "progress-fill"}
            style={[
              styles.fill,
              styles.indeterminateFill,
              {
                width: "30%",
                backgroundColor: fillColor,
                borderRadius: config.borderRadius,
                left: indeterminateLeft,
              },
            ]}
          />
        ) : (
          <View
            testID={testID ? `${testID}-fill` : "progress-fill"}
            style={[
              styles.fill,
              {
                width: `${clampedValue}%`,
                backgroundColor: fillColor,
                borderRadius: config.borderRadius,
              },
            ]}
          />
        )}
      </View>

      {/* Label */}
      {showLabel && !indeterminate && (
        <Text style={styles.label}>{Math.round(clampedValue)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  track: {
    width: "100%",
    backgroundColor: colors.track,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
  },
  indeterminateFill: {
    position: "absolute",
    height: "100%",
  },
  label: {
    fontSize: 12,
    color: colors.label,
    marginTop: 4,
    textAlign: "right",
  },
});

export default ProgressBar;
