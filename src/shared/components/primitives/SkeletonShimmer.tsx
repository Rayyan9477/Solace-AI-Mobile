/**
 * SkeletonShimmer — shimmer loading placeholder (prototype v4.2).
 *
 * Renders a muted box with an 800 dp shimmer gradient sliding across it at
 * 1.6 s linear repeat. Used on screen 39 and anywhere content is loading.
 *
 * Respects `useReducedMotion()` — renders a static muted box when motion is
 * reduced (no translateX animation).
 *
 * @example
 *   <SkeletonShimmer width={240} height={18} borderRadius={4} />
 *   <SkeletonShimmer width="100%" height={96} />
 */

import React from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

export interface SkeletonShimmerProps {
  width: number | "100%";
  height: number;
  /** Default 8. */
  borderRadius?: number;
  /** Default "Loading". */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const SHIMMER_WIDTH = 800;
const DURATION_MS = 1600;

export function SkeletonShimmer({
  width,
  height,
  borderRadius = 8,
  accessibilityLabel = "Loading",
  style,
  testID,
}: SkeletonShimmerProps): React.ReactElement {
  const { palette } = useTheme();
  const reduced = useReducedMotion();

  // translateX: from -(SHIMMER_WIDTH) to (numeric_width + SHIMMER_WIDTH)
  // When width is "100%", we use SHIMMER_WIDTH as the right bound offset which
  // produces a generous enough slide for any container.
  const rightBound =
    typeof width === "number" ? width + SHIMMER_WIDTH : SHIMMER_WIDTH * 2;

  const translateX = useSharedValue(-SHIMMER_WIDTH);

  React.useEffect(() => {
    if (reduced) {
      translateX.value = 0;
      return;
    }
    translateX.value = withRepeat(
      withTiming(rightBound, {
        duration: DURATION_MS,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [reduced, rightBound, translateX]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Semi-transparent highlight colour derived purely from palette tokens.
  // warm[100] at ~8% opacity as the shimmer highlight.
  const shimmerHighlight = `${palette.warm[100]}14`; // 14 hex ≈ 0.078 opacity

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: true }}
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: palette.midnight[700],
          overflow: "hidden",
        },
        style,
      ]}
    >
      {!reduced && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { width: SHIMMER_WIDTH, height: "100%" },
            shimmerStyle,
          ]}
        >
          <LinearGradient
            colors={["transparent", shimmerHighlight, "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  );
}
