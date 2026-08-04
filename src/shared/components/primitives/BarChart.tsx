/**
 * BarChart — vertical bar chart with animated mount heights (prototype v4.2).
 *
 * Used on screen 06 Mood tracker (7-day bars) and screen 11 Sleep dashboard
 * (7-day history). Highlighted bar (today) renders solid; others render at
 * 0.4 opacity.
 *
 * Bars animate from 0 → final height on mount with `withTiming` 600ms.
 * Respects `useReducedMotion()` — collapses to instant fill.
 *
 * @example
 *   <BarChart
 *     bars={[
 *       { label: "Mon", value: 0.6 },
 *       { label: "Tue", value: 0.8, highlighted: true },
 *       { label: "Wed", value: 0.4 },
 *     ]}
 *     width={260}
 *     height={100}
 *     accessibilityLabel="7-day mood chart, Tuesday is highest"
 *   />
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";

export interface BarChartBar {
  label: string; // e.g. "Mon", "Tue"
  value: number; // 0-1 normalized height
  highlighted?: boolean; // today
}

export interface BarChartProps {
  bars: BarChartBar[];
  width: number;
  height: number;
  variant?: "sage" | "lavender" | "peach"; // bar fill, default "sage"
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function BarChart({
  bars,
  width,
  height,
  variant = "sage",
  accessibilityLabel,
  style,
  testID,
}: BarChartProps): React.ReactElement {
  const { palette } = useTheme();
  const reduced = useReducedMotion();

  const barCount = bars.length || 1;
  const gap = 8;
  const barWidth = Math.max(4, width / barCount - gap);
  const baseColor = BAR_COLOR[variant](palette);

  return (
    <View
      testID={testID}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[{ width, height }, styles.container, style]}
    >
      {bars.map((bar, i) => (
        <AnimatedBar
          key={`${bar.label}-${i}`}
          bar={bar}
          barWidth={barWidth}
          chartHeight={height}
          baseColor={baseColor}
          reduced={reduced}
        />
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Single animated bar
// ---------------------------------------------------------------------------

interface AnimatedBarProps {
  bar: BarChartBar;
  barWidth: number;
  chartHeight: number;
  baseColor: string;
  reduced: boolean;
}

function AnimatedBar({
  bar,
  barWidth,
  chartHeight,
  baseColor,
  reduced,
}: AnimatedBarProps): React.ReactElement {
  const { palette } = useTheme();
  const clampedValue = Math.max(0, Math.min(1, bar.value));
  // Reserve ~18dp for the label below the bar
  const maxBarHeight = chartHeight - 18;
  const targetHeight = clampedValue * maxBarHeight;

  const animHeight = useSharedValue(0);

  React.useEffect(() => {
    animHeight.value = withTiming(targetHeight, {
      duration: reduced ? 0 : 600,
    });
  }, [targetHeight, reduced, animHeight]);

  const barStyle = useAnimatedStyle(() => ({
    height: animHeight.value,
  }));

  const barColor = bar.highlighted
    ? baseColor
    : `${baseColor}66`; // 0.4 opacity ≈ hex "66"

  return (
    <View style={styles.barWrapper}>
      <View style={{ height: maxBarHeight, justifyContent: "flex-end" }}>
        <Animated.View
          style={[
            barStyle,
            {
              width: barWidth,
              backgroundColor: barColor,
              borderRadius: 4,
            },
          ]}
        />
      </View>
      <Text
        style={[
          styles.label,
          { color: palette.warm[400] },
        ]}
        numberOfLines={1}
      >
        {bar.label}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BAR_COLOR: Readonly<
  Record<NonNullable<BarChartProps["variant"]>, (p: any) => string>
> = {
  sage: (p) => p.sage[300],
  lavender: (p) => p.lavender[300],
  peach: (p) => p.peach[300],
};

const styles = StyleSheet.create({
  barWrapper: {
    alignItems: "center",
    flex: 1,
  },
  container: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
});
