/**
 * SettingsRow — settings list row molecule (prototype v4.2)
 *
 * Used on screens 09 Profile and 37 Account Settings. Renders an icon tile +
 * label column + optional right slot (value / badge / chevron / custom node).
 *
 * Min height 64px, 44×44 touch target enforced via minHeight on outer press.
 */

import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { useHaptic } from "@/shared/hooks/useHaptic";
import { IconTile, type IconTileHue } from "@/shared/components/primitives/IconTile";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";

export interface SettingsRowProps {
  /** Lucide name for the leading IconTile */
  iconName: string;
  /** Palette hue family for the tile. Default "sage". */
  iconHue?: IconTileHue;
  label: string;
  description?: string;
  /** Right-aligned mono value (e.g., "English", "v1.0.0") */
  value?: string;
  /** Peach pill badge count */
  badgeCount?: number;
  /** Overrides value/badge if provided (e.g., a Toggle) */
  rightSlot?: React.ReactNode;
  /** Default true; auto-false when rightSlot or value present */
  showChevron?: boolean;
  /** When true, label/icon render in peach[300] */
  destructive?: boolean;
  onPress?: () => void;
  accessibilityHint?: string;
  testID?: string;
}

export function SettingsRow({
  iconName,
  iconHue = "sage",
  label,
  description,
  value,
  badgeCount,
  rightSlot,
  showChevron,
  destructive = false,
  onPress,
  accessibilityHint,
  testID,
}: SettingsRowProps): React.ReactElement {
  const { palette } = useTheme();
  const haptic = useHaptic();

  // Chevron defaults to true, but is suppressed when there's a rightSlot or value
  const resolvedShowChevron =
    showChevron !== undefined
      ? showChevron
      : !rightSlot && !value && badgeCount === undefined;

  const handlePress = onPress
    ? () => {
        haptic.light();
        onPress();
      }
    : undefined;

  const effectiveHue: IconTileHue = destructive ? "peach" : iconHue;
  const labelColor = destructive ? palette.peach[300] : palette.warm[50];

  return (
    <TouchableOpacity
      testID={testID}
      onPress={handlePress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={styles.row}
    >
      {/* Leading icon tile */}
      <IconTile
        iconName={iconName}
        hue={effectiveHue}
        size={36}
        variant="soft"
        style={styles.iconTile}
      />

      {/* Label column */}
      <View style={styles.labelColumn}>
        <Text style={[styles.label, { color: labelColor }]} numberOfLines={1}>
          {label}
        </Text>
        {description ? (
          <Text
            style={[styles.description, { color: palette.warm[400] }]}
            numberOfLines={2}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {/* Right section */}
      {rightSlot ? (
        <View style={styles.rightSlot}>{rightSlot}</View>
      ) : value !== undefined ? (
        <Text style={[styles.valueText, { color: palette.warm[400] }]}>
          {value}
        </Text>
      ) : badgeCount !== undefined ? (
        <View
          style={[styles.badge, { backgroundColor: palette.peach[300] }]}
          accessibilityLabel={`${badgeCount} notifications`}
        >
          <Text style={[styles.badgeText, { color: palette.warm[50] }]}>
            {badgeCount}
          </Text>
        </View>
      ) : null}

      {resolvedShowChevron ? (
        <View style={styles.chevron} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <AppIcon name="chevron-forward" size={20} color={palette.warm[400]} />
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    borderRadius: 11,
    height: 22,
    justifyContent: "center",
    marginLeft: 8,
    minWidth: 22,
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  chevron: {
    marginLeft: 4,
  },
  description: {
    fontSize: 13,
    marginTop: 2,
  },
  iconTile: {
    flexShrink: 0,
    marginRight: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  labelColumn: {
    flex: 1,
    justifyContent: "center",
  },
  rightSlot: {
    marginLeft: 8,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 64,
    paddingHorizontal: 16,
  },
  valueText: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 14,
    marginLeft: 8,
  },
});

export default SettingsRow;
