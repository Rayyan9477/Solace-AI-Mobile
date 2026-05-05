/**
 * SuggestionCard — glass card with icon, title, body, optional CTA + dismiss (prototype v4.2)
 *
 * Used on screens 07 Chat (embedded suggestions), 26 Session summary, and
 * 28 Journal composer (peach lightbulb prompt).
 *
 * Three visual variants:
 *   - "glass"        — GlassCard (default dark glass surface)
 *   - "peach-border" — custom border with peach gradient highlight
 *   - "sage-border"  — custom border with sage gradient highlight
 */

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { GlassCard } from "@/shared/components/primitives/GlassCard";
import { IconTile } from "@/shared/components/primitives/IconTile";
import type { IconTileHue } from "@/shared/components/primitives/IconTile";
import { useHaptic } from "@/shared/hooks/useHaptic";
import { useTheme } from "@/shared/theme/useTheme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SuggestionCardProps {
  iconName: string;
  iconHue?: "sage" | "aurora" | "peach" | "lavender";
  title: string;
  body: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
  onDismiss?: () => void;
  variant?: "glass" | "peach-border" | "sage-border";
  accessibilityLabel?: string;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SuggestionCard({
  iconName,
  iconHue = "peach",
  title,
  body,
  ctaLabel,
  onCtaPress,
  onDismiss,
  variant = "peach-border",
  accessibilityLabel,
  testID,
}: SuggestionCardProps): React.ReactElement {
  const { palette } = useTheme();
  const haptic = useHaptic();

  const handleCta = () => {
    haptic.medium();
    onCtaPress?.();
  };

  const handleDismiss = () => {
    haptic.light();
    onDismiss?.();
  };

  const a11yLabel = accessibilityLabel ?? `${title}. ${body}`;
  const a11yRole = onCtaPress ? "button" : ("alert" as const);

  const cardContent = (
    <View style={styles.inner}>
      {/* Dismiss button — top right */}
      {onDismiss && (
        <TouchableOpacity
          testID={testID ? `${testID}-dismiss` : undefined}
          onPress={handleDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          style={styles.dismissButton}
        >
          <AppIcon name="x" size={18} color={palette.warm[400]} />
        </TouchableOpacity>
      )}

      {/* Icon + text block */}
      <View style={styles.topRow}>
        <IconTile
          iconName={iconName}
          hue={(iconHue ?? "peach") as IconTileHue}
          variant="soft"
          size={36}
        />
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: palette.warm[50] }]}>
            {title}
          </Text>
          <Text style={[styles.body, { color: palette.warm[400] }]}>
            {body}
          </Text>
        </View>
      </View>

      {/* CTA pill — bottom right */}
      {ctaLabel && (
        <View style={styles.ctaRow}>
          <TouchableOpacity
            testID={testID ? `${testID}-cta` : undefined}
            onPress={handleCta}
            accessibilityRole="button"
            accessibilityLabel={ctaLabel}
            style={[styles.ctaPill, { backgroundColor: palette.peach[300] }]}
          >
            <Text style={[styles.ctaLabel, { color: palette.midnight[950] }]}>
              {ctaLabel}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (variant === "glass") {
    return (
      <GlassCard
        testID={testID}
        accessibilityRole={a11yRole}
        accessibilityLabel={a11yLabel}
        accessible
      >
        {cardContent}
      </GlassCard>
    );
  }

  // Gradient border variants — "peach-border" and "sage-border"
  const gradientColors: [string, string] =
    variant === "sage-border"
      ? [palette.sage[300], palette.sage[500]]
      : [palette.peach[300], palette.peach[500]];

  return (
    <View
      testID={testID}
      accessibilityRole={a11yRole}
      accessibilityLabel={a11yLabel}
      accessible
      style={styles.borderWrapper}
    >
      {/* 1px gradient border via LinearGradient fill + inset content */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
      />
      <View
        style={[
          styles.borderInner,
          { backgroundColor: hexToRgba(palette.midnight[800], 0.92) },
        ]}
      >
        {cardContent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  borderInner: {
    borderRadius: 19,
    overflow: "hidden",
  },
  borderWrapper: {
    borderRadius: 20,
    overflow: "hidden",
    padding: 1, // 1px border
  },
  ctaLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    lineHeight: 18,
  },
  ctaPill: {
    alignItems: "center",
    borderRadius: 999,
    height: 32,
    justifyContent: "center",
    minWidth: 44,
    paddingHorizontal: 16,
  },
  ctaRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  dismissButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    position: "absolute",
    right: 12,
    top: 12,
    width: 32,
    zIndex: 1,
  },
  inner: {
    padding: 16,
    position: "relative",
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontFamily: "Fraunces_700Italic",
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 4,
  },
  topRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    paddingRight: 32, // space for dismiss button
  },
});
