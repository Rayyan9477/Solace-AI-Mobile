/**
 * WaveformBars — animated voice waveform (prototype v4.2).
 *
 * 34 vertical bars that animate independently to simulate a live voice
 * waveform. Each bar oscillates between 20% and 100% of the canvas height
 * with a per-bar phase stagger (25 ms apart) so the row shimmers rather
 * than bouncing in unison.
 *
 * Bar fill is a vertical LinearGradient: sage[300] → aurora[300] → lavender[300].
 *
 * Respects `useReducedMotion()` — bars are clamped to 50% height with no
 * animation when motion is reduced. When `active=false` bars sit at 30%
 * height with no animation (idle / silence state).
 *
 * @example
 *   <WaveformBars width={320} height={64} />
 *   <WaveformBars width={320} height={64} active={false} />
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
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

export interface WaveformBarsProps {
  /** Number of bars. Default 34. */
  count?: number;
  /** Total canvas width in dp. */
  width: number;
  /** Total canvas height in dp (= max bar height). */
  height: number;
  /** When false bars sit at 30% height with no animation. Default true. */
  active?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const GAP = 2;
const OSCILLATION_MIN = 0.2;
const OSCILLATION_MAX = 1.0;
const IDLE_RATIO = 0.3;
const REDUCED_RATIO = 0.5;
const PERIOD_MS = 700;

/** Single animated bar — rendered as a separate component to own its own shared value. */
function Bar({
  barWidth,
  maxHeight,
  colors,
  phaseIndex,
  shouldAnimate,
  testID,
}: {
  barWidth: number;
  maxHeight: number;
  colors: [string, string, string];
  phaseIndex: number;
  shouldAnimate: boolean;
  testID?: string;
}) {
  const heightRatio = useSharedValue(shouldAnimate ? OSCILLATION_MIN : REDUCED_RATIO);

  React.useEffect(() => {
    if (!shouldAnimate) {
      heightRatio.value = withTiming(REDUCED_RATIO, { duration: 200 });
      return;
    }

    const timeout = setTimeout(() => {
      heightRatio.value = withRepeat(
        withSequence(
          withTiming(OSCILLATION_MAX, {
            duration: PERIOD_MS / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(OSCILLATION_MIN, {
            duration: PERIOD_MS / 2,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        false,
      );
    }, phaseIndex * 25);

    return () => {
      clearTimeout(timeout);
    };
  }, [shouldAnimate, phaseIndex, heightRatio]);

  const animStyle = useAnimatedStyle(() => ({
    height: heightRatio.value * maxHeight,
  }));

  return (
    <Animated.View
      testID={testID}
      style={[
        {
          width: barWidth,
          borderRadius: 1,
          overflow: "hidden",
          alignSelf: "flex-end",
        },
        animStyle,
      ]}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

export function WaveformBars({
  count = 34,
  width,
  height,
  active = true,
  accessibilityLabel,
  style,
  testID,
}: WaveformBarsProps): React.ReactElement {
  const { palette } = useTheme();
  const reduced = useReducedMotion();

  // Animate only when active and reduced motion is not requested
  const shouldAnimate = active && !reduced;

  // When inactive, use idle ratio; when reduced motion, use reduced ratio
  const staticRatio = !active ? IDLE_RATIO : REDUCED_RATIO;

  const barWidth = Math.max(1, (width - (count - 1) * GAP) / count);

  const gradientColors: [string, string, string] = [
    palette.sage[300],
    palette.aurora[300],
    palette.lavender[300],
  ];

  const isAnnounced = !!accessibilityLabel;

  return (
    <View
      testID={testID}
      accessibilityRole={isAnnounced ? "image" : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={!isAnnounced}
      importantForAccessibility={isAnnounced ? "yes" : "no"}
      style={[
        {
          width,
          height,
          flexDirection: "row",
          alignItems: "flex-end",
          gap: GAP,
        },
        style,
      ]}
    >
      {Array.from({ length: count }, (_, i) =>
        shouldAnimate ? (
          <Bar
            key={i}
            testID={`bar-${i}`}
            barWidth={barWidth}
            maxHeight={height}
            colors={gradientColors}
            phaseIndex={i}
            shouldAnimate
          />
        ) : (
          <View
            key={i}
            testID={`bar-${i}`}
            style={{
              width: barWidth,
              height: staticRatio * height,
              borderRadius: 1,
              overflow: "hidden",
              alignSelf: "flex-end",
            }}
          >
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
        ),
      )}
    </View>
  );
}
