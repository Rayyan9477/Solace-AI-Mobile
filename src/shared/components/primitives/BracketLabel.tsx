/**
 * BracketLabel — `[ UPPER TRACKED ]` section kicker (prototype v4.2)
 *
 * The Draper-inspired editorial kicker. Used above headlines, on navigation
 * hints, and for numerical-metadata labels (date, unread count, version).
 * Always Fira Code, always uppercase, always bracketed.
 *
 * @example
 *   <BracketLabel>Tuesday, April 9</BracketLabel>
 *   <BracketLabel variant="muted">Solace</BracketLabel>
 *   <BracketLabel variant="peach">You are not alone</BracketLabel>
 */

import React from "react";
import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";

import { useTheme } from "@/shared/theme/useTheme";

export type BracketLabelVariant = "default" | "muted" | "sage" | "peach" | "aurora";

export interface BracketLabelProps {
  /** The text inside the brackets — will be uppercased at render time */
  children: string;
  /** Color accent (maps to theme.colors / palette). Defaults to `muted`. */
  variant?: BracketLabelVariant;
  /** Optional style override (rarely needed — prefer variant) */
  style?: StyleProp<TextStyle>;
  /**
   * When true, the label is read by screen readers as its inner text (brackets
   * are a visual affordance, not content). Defaults to true.
   */
  announceAsLabel?: boolean;
}

export function BracketLabel({
  children,
  variant = "muted",
  style,
  announceAsLabel = true,
}: BracketLabelProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const color = COLOR_FOR_VARIANT[variant](palette);
  const text = `[ ${children.toUpperCase()} ]`;

  return (
    <Text
      accessibilityRole="text"
      accessibilityLabel={announceAsLabel ? children : undefined}
      style={[
        styles.base,
        {
          color,
          fontFamily: typography.fontFamily.monoMedium,
          letterSpacing: typography.letterSpacing.ultraWide,
        },
        style,
      ]}
    >
      {text}
    </Text>
  );
}

const COLOR_FOR_VARIANT: Readonly<
  Record<BracketLabelVariant, (palette: any) => string>
> = {
  default: (p) => p.warm[400],
  muted: (p) => p.warm[500],
  sage: (p) => p.sage[300],
  peach: (p) => p.peach[300],
  aurora: (p) => p.aurora[300],
};

const styles = StyleSheet.create({
  base: {
    fontSize: 10,
    lineHeight: 12,
  },
});
