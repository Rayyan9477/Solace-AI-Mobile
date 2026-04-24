/**
 * AuroraHairline — 1px gradient divider (prototype v4.2)
 *
 * Ports `.aurora-hairline` from `prototypes/lib/base.css`:
 *   height: 1px;
 *   background: linear-gradient(90deg, transparent, rgba(107,143,255,0.4), transparent);
 *
 * Use in place of a plain <Divider /> wherever the designer wants a kicker
 * separating editorial content (e.g. Solace Score hero → AI suggestion).
 *
 * @example
 *   <View>
 *     <Text>Score</Text>
 *     <AuroraHairline />
 *     <Text>AI suggests: breathing</Text>
 *   </View>
 */

import React from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/shared/theme/useTheme";

export interface AuroraHairlineProps {
  /** Override the default 1px hairline thickness (px / dp). */
  thickness?: number;
  /** Horizontal margin (dp) — the hairline always stretches to fill width. */
  inset?: number;
  /** Optional style override. Keep structural only (don't re-color here). */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function AuroraHairline({
  thickness = 1,
  inset = 0,
  style,
  testID,
}: AuroraHairlineProps): React.ReactElement {
  const { palette } = useTheme();
  // Prototype uses rgba(107,143,255,0.4) — derived from aurora-500 with 40% alpha.
  // Reading from palette keeps the gradient theme-aware (presets can override).
  const tint = hexToRgba(palette.aurora[500], 0.4);

  return (
    <View
      testID={testID}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.container, { height: thickness, marginHorizontal: inset }, style]}
    >
      <LinearGradient
        colors={["transparent", tint, "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

/**
 * Convert `#RRGGBB` + alpha 0-1 to `rgba(...)`. Local helper to avoid
 * importing the full colorUtils module (keeps primitives self-contained).
 */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
