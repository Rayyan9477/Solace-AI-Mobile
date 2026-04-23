/**
 * AppIcon Component
 * @description Reusable icon component wrapping react-native-vector-icons/Ionicons.
 *
 * Accepts both native Ionicons names ("heart-outline", "chevron-forward") and
 * Lucide names from the design prototypes ("heart", "chevron-right", "edit-3").
 * Lucide names are translated via `resolveIconName()` — see `./lucideToIonicons.ts`.
 *
 * @example
 *   <AppIcon name="heart-outline" size={20} color={colors.text.accent} />
 *   <AppIcon name="sparkles"     size={24} />   // Lucide name, auto-mapped
 */

import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { colors } from "@/shared/theme";
import { resolveIconName } from "./lucideToIonicons";

export interface AppIconProps {
  /** Icon name — Ionicons or Lucide (auto-resolved) */
  name: string;
  /** Icon size in density-independent pixels */
  size?: number;
  /** Icon color — defaults to theme primary text color */
  color?: string;
  /** Optional style applied to the icon container */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — when provided, the icon becomes readable to screen readers */
  accessibilityLabel?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  size = 24,
  color = colors.text.primary,
  style,
  accessibilityLabel,
}) => {
  const resolved = resolveIconName(name);
  return (
    <Icon
      name={resolved}
      size={size}
      color={color}
      style={style}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? "image" : "none"}
      accessibilityElementsHidden={!accessibilityLabel}
      importantForAccessibility={accessibilityLabel ? "yes" : "no-hide-descendants"}
    />
  );
};
