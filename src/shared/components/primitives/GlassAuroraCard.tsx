/**
 * GlassAuroraCard — aurora-tinted glass hero surface (prototype v4.2)
 *
 * Ports `.glass-aurora` from `prototypes/lib/base.css`:
 *   background: linear-gradient(135deg, rgba(ch-aurora,0.1) 0%, rgba(22,29,61,0.78) 100%);
 *   backdrop-filter: blur(28px) saturate(160%);
 *   border: 1px solid rgba(ch-aurora,0.2);
 *   box-shadow: var(--shadow-cosmic);
 *
 * Use ONE per screen for the hero surface (Solace Score card on Home, the
 * AI continue CTA, the Assessment Results ring card). Never stack two of
 * these on one screen — DESIGN.md § 1 "one hero per screen".
 *
 * @example
 *   <GlassAuroraCard>
 *     <RingProgress value={72} />
 *     <Text style={typeScale.h2}>Solace Score</Text>
 *   </GlassAuroraCard>
 */

import React from "react";
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "@/shared/theme/useTheme";

export interface GlassAuroraCardProps extends Pick<ViewProps, "pointerEvents" | "accessibilityLabel" | "accessibilityRole" | "accessible"> {
  children?: React.ReactNode;
  /** Border radius in dp. Prototype default is 24 (1.5rem, used on hero cards). */
  radius?: number;
  /** Optional style override. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function GlassAuroraCard({
  children,
  radius = 24,
  style,
  testID,
  pointerEvents,
  accessibilityLabel,
  accessibilityRole,
  accessible,
}: GlassAuroraCardProps): React.ReactElement {
  const { palette } = useTheme();
  const auroraTint = hexToRgba(palette.aurora[500], 0.1);
  const midnightTint = "rgba(22, 29, 61, 0.78)";
  const borderColor = hexToRgba(palette.aurora[500], 0.2);

  return (
    <View
      testID={testID}
      pointerEvents={pointerEvents}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
      style={[
        styles.container,
        { borderRadius: radius, borderColor },
        style,
      ]}
    >
      <BlurView
        intensity={28}
        tint="dark"
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
      <LinearGradient
        colors={[auroraTint, midnightTint]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
      <View style={styles.content}>{children}</View>
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
  container: {
    borderWidth: 1,
    // cosmic shadow — prototype box-shadow-cosmic equivalent
    elevation: 12,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#6B8FFF",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.28,
    shadowRadius: 32,
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
});
