/**
 * Skeleton Component
 * @description Animated placeholder for loading states
 * @task Task 2.2.7: Skeleton Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Multiple shapes (text, circle, rect)
 * - Configurable dimensions
 * - Shimmer animation
 * - Full accessibility support
 */

import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, DimensionValue } from "react-native";
import type { SkeletonProps, SkeletonShape } from "./Skeleton.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  base: palette.gray[700],
  highlight: palette.gray[600],
};

/**
 * Default dimensions for shapes
 */
const defaultDimensions: Record<SkeletonShape, { width: DimensionValue; height: number; borderRadius: number }> = {
  text: { width: "100%", height: 16, borderRadius: 4 },
  circle: { width: 40, height: 40, borderRadius: 20 },
  rect: { width: 100, height: 100, borderRadius: 8 },
};

/**
 * Skeleton Component
 *
 * @example
 * ```tsx
 * // Text skeleton
 * <Skeleton shape="text" width="80%" />
 *
 * // Avatar skeleton
 * <Skeleton shape="circle" width={48} height={48} />
 *
 * // Card skeleton
 * <Skeleton shape="rect" width="100%" height={200} borderRadius={12} />
 *
 * // Without animation
 * <Skeleton animated={false} />
 * ```
 */
export function Skeleton({
  shape = "text",
  width,
  height,
  borderRadius,
  animated = true,
  testID,
  style,
}: SkeletonProps): React.ReactElement {
  const defaults = defaultDimensions[shape];

  // Resolve dimensions
  const resolvedWidth = width ?? defaults.width;
  const resolvedHeight = height ?? defaults.height;

  // For circle, ensure equal dimensions and proper border radius
  const isCircle = shape === "circle";
  const circleSize = typeof resolvedWidth === "number" ? resolvedWidth : defaults.width;
  const finalWidth = isCircle ? circleSize : resolvedWidth;
  const finalHeight = isCircle ? circleSize : resolvedHeight;
  const finalBorderRadius =
    borderRadius ??
    (isCircle
      ? typeof circleSize === "number"
        ? circleSize / 2
        : defaults.borderRadius
      : defaults.borderRadius);

  // Shimmer animation
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [animated, animatedValue]);

  const animatedBackgroundColor = animated
    ? animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.base, colors.highlight],
      })
    : colors.base;

  return (
    <Animated.View
      testID={testID}
      accessibilityRole="none"
      accessibilityState={{ busy: true }}
      style={[
        styles.skeleton,
        {
          width: finalWidth,
          height: finalHeight,
          borderRadius: finalBorderRadius,
          backgroundColor: animatedBackgroundColor,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    overflow: "hidden",
  },
});

export default Skeleton;
