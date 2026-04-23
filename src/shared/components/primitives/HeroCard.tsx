/**
 * HeroCard — gradient-hairline wrapper for a single hero surface per screen
 * (prototype v4.2).
 *
 * Ports `.hero-card::before` from `prototypes/lib/base.css`. The web version
 * uses `mask-composite: xor` to cut an inner rectangle out of a gradient so
 * only a 1px gradient ring remains. React Native has no mask-composite; we
 * emulate the same look by layering a LinearGradient at absolute-fill and
 * covering it with an inset opaque child — a gradient frame.
 *
 * Usage: wrap a GlassCard / GlassAuroraCard with this component to add the
 * editorial accent border. One HeroCard per screen (DESIGN.md § 1).
 *
 * @example
 *   <HeroCard radius={24}>
 *     <GlassAuroraCard>
 *       <Text>Solace Score</Text>
 *     </GlassAuroraCard>
 *   </HeroCard>
 */

import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/shared/theme/useTheme";

export interface HeroCardProps {
  children: React.ReactNode;
  /** Border radius in dp. Must match the inner surface's radius. Defaults to 24. */
  radius?: number;
  /** Thickness of the gradient hairline. Defaults to 1 (prototype spec). */
  hairline?: number;
  /** Override style (margins, positioning). */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function HeroCard({
  children,
  radius = 24,
  hairline = 1,
  style,
  testID,
}: HeroCardProps): React.ReactElement {
  const { palette } = useTheme();
  const auroraStop = hexToRgba(palette.aurora[500], 0.45);
  const sageStop = hexToRgba(palette.sage[300], 0.25);
  const innerRadius = Math.max(0, radius - hairline);

  return (
    <View
      testID={testID}
      style={[{ borderRadius: radius, overflow: "hidden" }, style]}
    >
      <LinearGradient
        colors={[auroraStop, sageStop, "transparent"]}
        locations={[0, 0.4, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
      <View
        style={[
          styles.inner,
          {
            margin: hairline,
            borderRadius: innerRadius,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  inner: {
    overflow: "hidden",
  },
});
