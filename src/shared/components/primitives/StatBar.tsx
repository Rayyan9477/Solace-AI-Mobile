/**
 * StatBar — 4px horizontal progress bar with sage→aurora gradient fill
 * (prototype v4.2).
 *
 * Ports `.stat-bar` + `.stat-bar > span` from `prototypes/lib/base.css`.
 * Used on home dashboard metric tiles (Sleep 7h 48m, Mindful 18m, Stress Low,
 * Streak 23 days) and anywhere a compact score/progress indicator is needed.
 *
 * Animates smoothly from the previous fill to the new one (300ms) — respects
 * `useReducedMotion()` (instant transition for motion-sensitive users).
 *
 * @example
 *   <StatBar percent={72} accessibilityLabel="Solace score 72 out of 100" />
 *   <StatBar percent={40} height={6} variant="peach" />
 */

import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";

export type StatBarVariant = "sage" | "peach" | "aurora" | "lavender";

export interface StatBarProps {
  /** 0-100 — fill percentage. Clamped automatically. */
  percent: number;
  /** Track height (dp). Defaults to 4. Prototype uses 4; use 6 for "medium". */
  height?: number;
  /** Gradient variant. Default "sage" matches prototype default (sage→aurora). */
  variant?: StatBarVariant;
  /** Accessibility label — pair with `accessibilityValue` below. */
  accessibilityLabel?: string;
  /** Optional style override (margins etc.). Don't override height here — use `height` prop. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function StatBar({
  percent,
  height = 4,
  variant = "sage",
  accessibilityLabel,
  style,
  testID,
}: StatBarProps): React.ReactElement {
  const { palette } = useTheme();
  const reduced = useReducedMotion();
  const clamped = clampPercent(percent);
  const width = useSharedValue(clamped);

  React.useEffect(() => {
    width.value = withTiming(clamped, {
      duration: reduced ? 0 : 300,
    });
  }, [clamped, reduced, width]);

  const animatedFillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  const gradient = GRADIENT_FOR_VARIANT[variant](palette);

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      style={[
        styles.track,
        { height, borderRadius: height / 2 },
        style,
      ]}
    >
      <Animated.View style={[styles.fillWrap, { borderRadius: height / 2 }, animatedFillStyle]}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const GRADIENT_FOR_VARIANT: Readonly<
  Record<StatBarVariant, (p: any) => [string, string]>
> = {
  sage: (p) => [p.sage[300], p.aurora[300]],
  peach: (p) => [p.peach[300], p.peach[500]],
  aurora: (p) => [p.aurora[300], p.aurora[500]],
  lavender: (p) => [p.lavender[300], p.lavender[500]],
};

function clampPercent(n: number): number {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return n;
}

const styles = StyleSheet.create({
  fillWrap: {
    height: "100%",
    overflow: "hidden",
  },
  track: {
    backgroundColor: "rgba(255,255,255,0.04)",
    overflow: "hidden",
    width: "100%",
  },
});
