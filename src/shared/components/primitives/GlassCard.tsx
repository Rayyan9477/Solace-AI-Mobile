/**
 * GlassCard — primary glass surface (prototype v4.2)
 *
 * Ports `.glass` from `prototypes/lib/base.css`:
 *   background: rgba(22, 29, 61, 0.5);
 *   backdrop-filter: blur(20px) saturate(140%);
 *   border: 1px solid rgba(255,255,255,0.06);
 *   box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.05);
 *
 * Used as the default card surface across every prototype screen. For the
 * stronger modal surface, use `<GlassCard variant="strong" />`. For the
 * aurora-tinted hero, use `<GlassAuroraCard />` (separate primitive).
 *
 * @example
 *   <GlassCard>
 *     <Text>Today's mood</Text>
 *     <MoodChart />
 *   </GlassCard>
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

import { useTheme } from "@/shared/theme/useTheme";

export type GlassVariant = "default" | "strong";

export interface GlassCardProps extends Pick<ViewProps, "pointerEvents" | "accessibilityLabel" | "accessibilityRole" | "accessible"> {
  children?: React.ReactNode;
  /** "default" = .glass (50% bg, 20px blur), "strong" = .glass-strong (78% bg, 28px blur for modals/overlays) */
  variant?: GlassVariant;
  /** Border radius in dp. Prototype default is 20 (1.25rem). */
  radius?: number;
  /** Optional style override — don't re-color here; use variant instead. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function GlassCard({
  children,
  variant = "default",
  radius = 20,
  style,
  testID,
  pointerEvents,
  accessibilityLabel,
  accessibilityRole,
  accessible,
}: GlassCardProps): React.ReactElement {
  const cfg = CONFIG[variant];

  return (
    <View
      testID={testID}
      pointerEvents={pointerEvents}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
      style={[
        styles.container,
        { borderRadius: radius, borderColor: cfg.borderColor },
        style,
      ]}
    >
      <BlurView
        intensity={cfg.blurIntensity}
        tint="dark"
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
      {/* Semi-opaque midnight fill on top of the blur, because BlurView alone
          isn't opaque enough to hit the prototype's `rgba(22,29,61,0.5|0.78)`. */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius, backgroundColor: cfg.tint },
        ]}
      />
      {/* Inset top highlight — the 1px inner stroke at the top edge */}
      <View
        pointerEvents="none"
        style={[
          styles.topHighlight,
          { borderRadius: radius },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const CONFIG: Readonly<Record<GlassVariant, {
  blurIntensity: number;
  tint: string;
  borderColor: string;
}>> = {
  default: {
    blurIntensity: 20,
    tint: "rgba(22, 29, 61, 0.5)",
    borderColor: "rgba(255,255,255,0.06)",
  },
  strong: {
    blurIntensity: 28,
    tint: "rgba(22, 29, 61, 0.78)",
    borderColor: "rgba(255,255,255,0.08)",
  },
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
  topHighlight: {
    borderTopColor: "rgba(255,255,255,0.05)",
    borderTopWidth: 1,
    height: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
