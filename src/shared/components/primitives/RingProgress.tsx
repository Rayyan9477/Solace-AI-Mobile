/**
 * RingProgress — conic-style progress ring (prototype v4.2).
 *
 * Ports `.ring-progress` from `prototypes/lib/base.css`. The web prototype
 * uses `conic-gradient`, which has no React Native equivalent. We use an
 * `react-native-svg` Circle with `strokeDasharray` + animated `strokeDashoffset`
 * plus a LinearGradient stroke to produce the same sage→aurora visual.
 *
 * Used on: Solace Score hero (0-100, 160px), Assessment Results (200px),
 * Mood ring, Session Summary success ring, AI Suggestions progress.
 *
 * The animation is a smooth sweep from 0 → value on mount, and from
 * previous → new on value change (1.2s out-cubic — prototype default).
 * Reduced-motion users get an instant fill.
 *
 * @example
 *   <RingProgress value={72} size={160} label="Solace Score" />
 *
 *   <RingProgress
 *     value={68}
 *     size={200}
 *     strokeWidth={14}
 *     accessibilityLabel="Mental health score 68 out of 100"
 *   >
 *     <Text style={typeScale.h1}>68</Text>
 *     <Text style={typeScale.bodyS}>/ 100</Text>
 *   </RingProgress>
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

export type RingVariant = "sage" | "peach" | "aurora" | "lavender";

export interface RingProgressProps {
  /** 0-100. Clamped automatically. */
  value: number;
  /** Outer diameter in dp. Defaults to 160. */
  size?: number;
  /** Ring stroke thickness in dp. Defaults to 10 (proportional to 160 size). */
  strokeWidth?: number;
  /** Gradient choice. Default "sage" = sage-300 → aurora-300 (prototype default). */
  variant?: RingVariant;
  /** Optional children rendered centered inside the ring (score numerals, etc.) */
  children?: React.ReactNode;
  /** A11y label; pair with accessibilityValue for progressbar announcement. */
  accessibilityLabel?: string;
  /** Optional outer style override. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function RingProgress({
  value,
  size = 160,
  strokeWidth = 10,
  variant = "sage",
  children,
  accessibilityLabel,
  style,
  testID,
}: RingProgressProps): React.ReactElement {
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

  const [stopA, stopB] = GRADIENT_FOR_VARIANT[variant](palette);
  const gradientId = `ringProgress-${variant}-${size}`;

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
            <Stop offset="0" stopColor={stopA} />
            <Stop offset="1" stopColor={stopB} />
          </SvgLinearGradient>
        </Defs>
        {/* Track — barely visible inactive portion */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated fill — starts at top (12 o'clock) and sweeps clockwise */}
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
          // Rotate -90deg so the stroke begins at top, matching prototype
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children ? <View style={styles.center}>{children}</View> : null}
    </View>
  );
}

const GRADIENT_FOR_VARIANT: Readonly<
  Record<RingVariant, (p: any) => [string, string]>
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
  center: {
    alignItems: "center",
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
