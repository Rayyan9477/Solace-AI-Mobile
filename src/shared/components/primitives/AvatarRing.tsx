/**
 * AvatarRing — gradient ring around a circular avatar with optional aurora glow (prototype v4.2).
 *
 * The inner slot accepts any child (Image, MoodFace, initials Text).
 * The ring itself is a LinearGradient stroke on an SVG circle; children are
 * clipped to a circle via `borderRadius: size/2`.
 *
 * Used on Profile screen (09) and Account Settings (37).
 *
 * Glow is implemented via box shadow (iOS) / elevation (Android).
 * No animation is applied to this component.
 *
 * @example
 *   <AvatarRing size={120} variant="sage-aurora-peach">
 *     <Image source={profileUri} style={{ width: 112, height: 112 }} />
 *   </AvatarRing>
 */

import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

import { useTheme } from "@/shared/theme/useTheme";

export type AvatarRingVariant = "sage-aurora-peach" | "lavender-aurora";

export interface AvatarRingProps {
  /** Outer diameter (ring + content). Defaults to 120. */
  size?: number;
  /** Ring stroke width in dp. Defaults to 4. */
  ringWidth?: number;
  /** Add aurora glow shadow. Defaults to true. */
  glow?: boolean;
  /** Gradient color scheme. Defaults to "sage-aurora-peach". */
  variant?: AvatarRingVariant;
  /** Avatar content — Image, MoodFace, initials View, etc. */
  children: React.ReactNode;
  /** Optional outer style override. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function AvatarRing({
  size = 120,
  ringWidth = 4,
  glow = true,
  variant = "sage-aurora-peach",
  children,
  style,
  testID,
}: AvatarRingProps): React.ReactElement {
  const { palette } = useTheme();

  // Gradient stops for each variant (60-degree linear, approximated as x1/y1→x2/y2)
  const stops = VARIANT_STOPS[variant](palette);
  const gradientId = `avatarRing-${variant}-${size}`;

  // Inner content diameter (shrink by one ring-width on each side).
  const innerSize = size - ringWidth * 2;

  // Glow shadow applied to the wrapper on iOS; elevation on Android.
  const glowStyle: ViewStyle = glow
    ? Platform.select({
        ios: {
          shadowColor: palette.aurora[500],
          shadowOpacity: 0.4,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 0 },
        },
        android: {
          elevation: 12,
        },
        default: {},
      }) ?? {}
    : {};

  const radius = size / 2 - ringWidth / 2;

  return (
    <View
      testID={testID}
      style={[{ width: size, height: size }, styles.container, glowStyle, style]}
    >
      {/*
        Gradient ring — purely decorative. We intentionally do NOT pass
        `accessibilityElementsHidden` to <Svg> because react-native-svg's web
        renderer spreads unknown props through to the underlying <svg> DOM
        element, triggering a React DOM-attribute warning. The parent View
        already inherits a non-interactive accessibility context.
      */}
      <Svg
        width={size}
        height={size}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <SvgLinearGradient
            id={gradientId}
            // ~60 deg: x1=0.13, y1=0, x2=0.87, y2=1
            x1="0.13"
            y1="0"
            x2="0.87"
            y2="1"
          >
            {stops.map((s) => (
              <Stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </SvgLinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={ringWidth}
          fill="none"
        />
      </Svg>

      {/* Avatar content clipped to circle */}
      <View
        style={[
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
          },
          styles.avatarClip,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

type GradientStop = { offset: string; color: string };

const VARIANT_STOPS: Record<
  AvatarRingVariant,
  (p: ReturnType<typeof useTheme>["palette"]) => GradientStop[]
> = {
  "sage-aurora-peach": (p) => [
    { offset: "0%", color: p.sage[300] },
    { offset: "50%", color: p.aurora[300] },
    { offset: "100%", color: p.peach[300] },
  ],
  "lavender-aurora": (p) => [
    { offset: "0%", color: p.lavender[300] },
    { offset: "100%", color: p.aurora[300] },
  ],
};

const styles = StyleSheet.create({
  avatarClip: {
    overflow: "hidden",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
