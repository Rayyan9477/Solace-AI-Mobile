/**
 * ReactionChip — "This helped" / "Not quite" feedback chip (prototype v4.2).
 *
 * A pill-shaped toggleable chip placed below AI chat bubbles. Multiple chips
 * are stacked horizontally in the parent container. Supports an optional
 * leading AppIcon icon.
 *
 * @task Sprint 5: Chat organisms — ReactionChip
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReactionChipProps {
  /** Chip label, e.g. "This helped". */
  label: string;
  /** Optional Lucide/Ionicons icon name for the leading icon. */
  iconName?: string;
  /** Whether this chip is currently selected (toggled on). */
  selected?: boolean;
  onPress: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReactionChip({
  label,
  iconName,
  selected = false,
  onPress,
  testID,
  style,
}: ReactionChipProps): React.ReactElement {
  const { palette } = useTheme();
  useReducedMotion();

  const backgroundColor = selected
    ? palette.sage[300]
    : palette.midnight[800];

  const textColor = selected
    ? palette.midnight[950]
    : palette.warm[100];

  const borderStyle = selected
    ? styles.pillSelected
    : styles.pillDefault;

  const borderColorStyle = selected
    ? {}
    : { borderColor: palette.midnight[600] };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={[
        styles.pill,
        borderStyle,
        borderColorStyle,
        { backgroundColor },
        style,
      ]}
    >
      {iconName ? (
        <AppIcon name={iconName} size={14} color={textColor} />
      ) : null}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    lineHeight: 16,
  },
  pill: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    height: 32,
    paddingHorizontal: 12,
  },
  pillDefault: {
    borderWidth: 1,
  },
  pillSelected: {
    borderWidth: 0,
  },
});

export default ReactionChip;
