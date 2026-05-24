/**
 * StatTilesRow — 3-tile horizontal stats row (prototype v4.2).
 *
 * Used on screen 32 "Session complete" to surface key metrics:
 * duration / score change / streak day. Each tile is self-contained with an
 * optional icon, large numeric value, unit, and label.
 *
 * Reduced-motion: no animation in this component (static layout).
 *
 * @example
 *   <StatTilesRow
 *     tiles={[
 *       { value: "10", unit: "min", label: "Duration", iconName: "clock", hue: "sage" },
 *       { value: "+3", label: "Score",  iconName: "trending-up", hue: "aurora" },
 *       { value: "7",  unit: "days", label: "Streak", iconName: "flame", hue: "peach" },
 *     ]}
 *   />
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { IconTile } from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

export interface StatTile {
  value: string;
  unit?: string;
  label: string;
  iconName?: string;
  hue?: "sage" | "aurora" | "peach" | "lavender";
}

export interface StatTilesRowProps {
  tiles: StatTile[];
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function StatTilesRow({
  tiles,
  testID,
  style,
}: StatTilesRowProps): React.ReactElement {
  const { palette } = useTheme();

  return (
    <View testID={testID} style={[styles.row, style]}>
      {tiles.map((tile, i) => {
        const hue = tile.hue ?? "sage";
        const a11yLabel = [tile.value, tile.unit, tile.label]
          .filter(Boolean)
          .join(" ");

        return (
          <View
            key={`tile-${i}`}
            style={[
              styles.tile,
              { backgroundColor: palette.midnight[800] },
            ]}
            accessibilityRole="text"
            accessibilityLabel={a11yLabel}
          >
            {tile.iconName ? (
              <IconTile
                iconName={tile.iconName}
                size={28}
                hue={hue}
                variant="soft"
                style={styles.icon}
              />
            ) : null}

            <View style={styles.valueRow}>
              <Text style={[styles.value, { color: palette.warm[50] }]}>
                {tile.value}
              </Text>
              {tile.unit ? (
                <Text style={[styles.unit, { color: palette.warm[400] }]}>
                  {tile.unit}
                </Text>
              ) : null}
            </View>

            <Text style={[styles.label, { color: palette.warm[500] }]}>
              {tile.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: 8,
  },
  label: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  tile: {
    alignItems: "center",
    borderRadius: 16,
    flex: 1,
    padding: 16,
  },
  unit: {
    alignSelf: "flex-end",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    marginBottom: 2,
    marginLeft: 3,
  },
  value: {
    fontFamily: "Fraunces_500Medium",
    fontSize: 28,
  },
  valueRow: {
    alignItems: "flex-end",
    flexDirection: "row",
  },
});
