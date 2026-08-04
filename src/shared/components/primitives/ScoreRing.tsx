/**
 * ScoreRing — tri-stop gradient progress ring for the mental health score hero (prototype v4.2).
 *
 * A 200px (default) animated ring with a sage→aurora→lavender gradient sweep.
 * Same mount animation as RingProgress (1.2s out-cubic sweep from 0 to value);
 * collapses to instant when reduced motion is enabled.
 *
 * Used on Assessment Results screen (19).
 *
 * @example
 *   <ScoreRing value={78} accessibilityLabel="Mental health score 78 out of 100">
 *     <Text style={typeScale.h1}>78</Text>
 *     <Text style={typeScale.bodyS}>/ 100</Text>
 *   </ScoreRing>
 */

import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ScoreRingProps {
  /** 0-100. Clamped automatically. */
  value: number;
  /** Outer diameter in dp. Defaults to 200. */
  size?: number;
  /** Ring stroke thickness in dp. Defaults to 14. */
  strokeWidth?: number;
  /** Optional children rendered centered (score numerals, icon, etc.). */
  children?: React.ReactNode;
  /** A11y label; announced as progressbar with min=0 max=100 now=value. */
  accessibilityLabel?: string;
  /** Optional outer style override. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

function clampPercent(n: number): number {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return n;
}

export function ScoreRing({
  value,
  size = 200,
  strokeWidth = 14,
  children,
  accessibilityLabel,
  style,
  testID,
}: ScoreRingProps): React.ReactElement {
  const { palette } = useTheme();
  const reduced = useReducedMotion();
  const clamped = clampPercent(value);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);
  React.useEffect(() => {
    progress.value = withTiming(clamped / 100, {
      duration: reduced ? 0 : 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [clamped, reduced, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  // Three-stop gradient: sage[300] → aurora[300] → lavender[300]
  const gradientId = `scoreRing-${size}`;

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      style={[{ width: size, height: size }, styles.container, style]}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgLinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={palette.sage[300]} />
            <Stop offset="0.5" stopColor={palette.aurora[300]} />
            <Stop offset="1" stopColor={palette.lavender[300]} />
          </SvgLinearGradient>
        </Defs>
        {/* Track — inactive background ring */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated gradient fill sweeping from 12 o'clock clockwise */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children ? <View style={styles.center}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
