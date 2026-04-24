/**
 * BreathingOrb — signature brand mark (prototype v4.2).
 *
 * Ports `.breath-orb` from `prototypes/lib/base.css`. A soft radial-gradient
 * orb that pulses on a 6-second breath cycle (scale 1 → 1.08, opacity 1 → 0.85).
 * THIS IS THE BRAND MARK — it appears on Splash, Welcome, Home AI card,
 * Breathing session, Loading, Empty, 404. Never use a spinner; use the orb.
 *
 * Built as a react-native-svg radial gradient (RN has no native radial
 * gradient on Views). Animation driven by Reanimated shared values; respects
 * `useReducedMotion()` — motion-sensitive users see a static orb.
 *
 * Two presets:
 *   - `cool`  — sage + aurora + lavender center (default, cosmic brand)
 *   - `warm`  — peach + lavender center (used on Crisis support halo)
 *
 * @example
 *   <BreathingOrb size={160} />                      // signature default
 *   <BreathingOrb size={260} tint="warm" />          // Crisis halo
 *   <BreathingOrb size={100} pulsing={false} />      // static brand mark
 */

import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Defs,
  Ellipse,
  RadialGradient as SvgRadialGradient,
  Stop,
} from "react-native-svg";

import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

export type OrbTint = "cool" | "warm";

export interface BreathingOrbProps {
  /** Diameter in dp. Defaults to 160. */
  size?: number;
  /** `cool` = sage + aurora + lavender (brand default); `warm` = peach + lavender (Crisis). */
  tint?: OrbTint;
  /**
   * When false, render a static orb (no scale/opacity loop). Defaults to true.
   * Also forced static when `useReducedMotion()` returns true.
   */
  pulsing?: boolean;
  /** Positioning style. */
  style?: StyleProp<ViewStyle>;
  /**
   * Accessibility: the orb is usually decorative, but on Splash/Loading it
   * conveys state. Pass `accessibilityLabel` to announce it as an image,
   * otherwise it's hidden from screen readers.
   */
  accessibilityLabel?: string;
  testID?: string;
}

export function BreathingOrb({
  size = 160,
  tint = "cool",
  pulsing = true,
  style,
  accessibilityLabel,
  testID,
}: BreathingOrbProps): React.ReactElement {
  const { palette } = useTheme();
  const reduced = useReducedMotion();
  const shouldAnimate = pulsing && !reduced;

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    if (!shouldAnimate) {
      scale.value = 1;
      opacity.value = 1;
      return;
    }
    // 6-second breath cycle (3s inhale → 3s exhale) matching prototype
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [shouldAnimate, scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const stops = tint === "warm"
    ? [
        { color: palette.peach[300], opacity: 0.5, offset: "0%" },
        { color: palette.lavender[300], opacity: 0.25, offset: "50%" },
        { color: palette.lavender[300], opacity: 0, offset: "75%" },
      ]
    : [
        { color: palette.sage[300], opacity: 0.58, offset: "0%" },
        { color: palette.aurora[500], opacity: 0.34, offset: "35%" },
        { color: palette.lavender[300], opacity: 0.2, offset: "60%" },
        { color: palette.lavender[300], opacity: 0, offset: "75%" },
      ];

  const gradientId = `breath-${tint}-${size}`;
  const isAnnounced = !!accessibilityLabel;

  return (
    <View
      testID={testID}
      pointerEvents="none"
      accessibilityRole={isAnnounced ? "image" : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={!isAnnounced}
      importantForAccessibility={isAnnounced ? "yes" : "no-hide-descendants"}
      style={[{ width: size, height: size }, style]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, animStyle]}>
        <Svg width={size} height={size}>
          <Defs>
            <SvgRadialGradient id={gradientId} cx="30%" cy="30%" rx="60%" ry="60%">
              {stops.map((s) => (
                <Stop
                  key={s.offset}
                  offset={s.offset}
                  stopColor={s.color}
                  stopOpacity={s.opacity}
                />
              ))}
            </SvgRadialGradient>
          </Defs>
          <Ellipse
            cx={size / 2}
            cy={size / 2}
            rx={size / 2}
            ry={size / 2}
            fill={`url(#${gradientId})`}
          />
        </Svg>
      </Animated.View>
    </View>
  );
}
