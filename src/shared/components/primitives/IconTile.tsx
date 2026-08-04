/**
 * IconTile — hue-tinted icon tile (prototype v4.2).
 *
 * A square (or circle) tile with a palette-tinted background and a centered
 * icon rendered via `<AppIcon>`. Used across the entire prototype in metric
 * grids, settings rows, mindful library, soundscapes tiles, etc.
 *
 * Two variants:
 *   - `soft`  — palette[hue][100] background (light translucent wash)
 *   - `solid` — palette[hue][300] background (full color)
 *
 * Two shapes:
 *   - `rounded` — 12 dp border radius (default)
 *   - `circle`  — size / 2 border radius
 *
 * @example
 *   <IconTile iconName="heart" hue="peach" />
 *   <IconTile iconName="music" hue="aurora" variant="solid" shape="circle" />
 *   <IconTile iconName="moon" size={52} iconSize={24} hue="lavender" />
 */

import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";

export type IconTileHue =
  | "sage"
  | "aurora"
  | "peach"
  | "lavender"
  | "warm"
  | "midnight";

export interface IconTileProps {
  /** Lucide icon name — resolved to Ionicons by AppIcon. */
  iconName: string;
  /** Outer tile dimension in dp. Default 44. */
  size?: number;
  /** Icon size inside the tile. Default size * 0.5. */
  iconSize?: number;
  /** Palette hue family. Default "sage". */
  hue?: IconTileHue;
  /**
   * `soft`  — palette[hue][100] background (light wash, icon uses [300] color).
   * `solid` — palette[hue][300] background (full color, icon uses warm[50]).
   * Default "soft".
   */
  variant?: "soft" | "solid";
  /**
   * `rounded` — 12 dp radius (default).
   * `circle`  — fully round (size / 2).
   */
  shape?: "rounded" | "circle";
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function IconTile({
  iconName,
  size = 44,
  iconSize,
  hue = "sage",
  variant = "soft",
  shape = "rounded",
  accessibilityLabel,
  style,
  testID,
}: IconTileProps): React.ReactElement {
  const { palette } = useTheme();

  const resolvedIconSize = iconSize ?? Math.round(size * 0.5);
  const borderRadius = shape === "circle" ? size / 2 : 12;
  const isAnnounced = !!accessibilityLabel;

  // Per-hue background and icon color maps.
  // `warm` has no [300]; `midnight` has no [100]/[300] — map explicitly.
  const BG_SOFT: Record<IconTileHue, string> = {
    sage: palette.sage[100],
    aurora: palette.aurora[100],
    peach: palette.peach[100],
    lavender: palette.lavender[100],
    warm: palette.warm[100],
    midnight: palette.midnight[700], // closest "light" surface for midnight
  };

  const BG_SOLID: Record<IconTileHue, string> = {
    sage: palette.sage[300],
    aurora: palette.aurora[300],
    peach: palette.peach[300],
    lavender: palette.lavender[300],
    warm: palette.warm[200],
    midnight: palette.midnight[600],
  };

  const ICON_SOFT: Record<IconTileHue, string> = {
    sage: palette.sage[300],
    aurora: palette.aurora[300],
    peach: palette.peach[300],
    lavender: palette.lavender[300],
    warm: palette.warm[500],
    midnight: palette.warm[50],
  };

  const backgroundColor = variant === "solid" ? BG_SOLID[hue] : BG_SOFT[hue];
  const iconColor = variant === "solid" ? palette.warm[50] : ICON_SOFT[hue];

  return (
    <View
      testID={testID}
      accessibilityRole={isAnnounced ? "image" : undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityElementsHidden={!isAnnounced}
      importantForAccessibility={isAnnounced ? "yes" : "no-hide-descendants"}
      style={[
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <AppIcon name={iconName} size={resolvedIconSize} color={iconColor} />
    </View>
  );
}
