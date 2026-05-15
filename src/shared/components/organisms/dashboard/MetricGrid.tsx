/**
 * MetricGrid — 2×2 stat tile grid for Home v2 (screen 20).
 * Each tile: icon + label + value + unit + optional StatBar.
 *
 * @phase Sprint 5: prototype-v4.2 organisms
 */

import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { IconTile, StatBar } from "@/shared/components/primitives";
import type { IconTileHue } from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

export interface MetricTile {
  iconName?: string;
  iconHue?: "sage" | "aurora" | "peach" | "lavender";
  label: string;
  value: string;
  unit?: string;
  progress?: number;
  onPress?: () => void;
}

export interface MetricGridProps {
  tiles: MetricTile[];
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

const GAP = 12;

function MetricTileItem({
  tile,
  tileWidth,
  index,
  testID,
}: {
  tile: MetricTile;
  tileWidth: number;
  index: number;
  testID?: string;
}) {
  const { palette, typography } = useTheme();
  const tileTestID = testID ? `${testID}-tile-${index}` : undefined;

  const a11yLabel = tile.unit
    ? `${tile.label}, ${tile.value} ${tile.unit}`
    : `${tile.label}, ${tile.value}`;

  const tileStyle = [
    styles.tile,
    {
      width: tileWidth,
      backgroundColor: palette.midnight[800],
    },
  ];

  const content = (
    <>
      {/* Top row: icon + label */}
      <View style={styles.tileHeader}>
        {tile.iconName ? (
          <IconTile
            iconName={tile.iconName}
            hue={(tile.iconHue as IconTileHue) ?? "sage"}
            size={32}
            iconSize={16}
          />
        ) : null}
        <Text
          style={[
            styles.tileLabel,
            {
              color: palette.warm[400],
              fontFamily: typography.fontFamily.sans,
              marginLeft: tile.iconName ? 8 : 0,
            },
          ]}
          numberOfLines={1}
        >
          {tile.label}
        </Text>
      </View>

      {/* Middle: value + unit */}
      <View style={styles.tileValue}>
        <Text
          style={[
            styles.valueNumber,
            {
              color: palette.warm[50],
              fontFamily: typography.fontFamily.display,
            },
          ]}
        >
          {tile.value}
        </Text>
        {tile.unit ? (
          <Text
            style={[
              styles.valueUnit,
              {
                color: palette.warm[400],
                fontFamily: typography.fontFamily.sans,
              },
            ]}
          >
            {tile.unit}
          </Text>
        ) : null}
      </View>

      {/* Bottom: optional progress bar */}
      {tile.progress !== undefined ? (
        <StatBar
          percent={tile.progress * 100}
          style={styles.tileBar}
          accessibilityLabel={`${tile.label} progress`}
        />
      ) : null}
    </>
  );

  if (tile.onPress) {
    return (
      <TouchableOpacity
        testID={tileTestID}
        style={tileStyle}
        onPress={tile.onPress}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View
      testID={tileTestID}
      style={tileStyle}
      accessibilityRole="text"
      accessibilityLabel={a11yLabel}
    >
      {content}
    </View>
  );
}

export function MetricGrid({
  tiles,
  testID,
  style,
}: MetricGridProps): React.ReactElement {
  const { width } = useWindowDimensions();
  // Each tile occupies half of parent minus gap; for full-width grids,
  // derive from screen width (padded 32px each side as typical).
  const parentWidth = width - 64;
  const tileWidth = (parentWidth - GAP) / 2;

  return (
    <View testID={testID} style={[styles.grid, style]}>
      {tiles.map((tile, i) => (
        <MetricTileItem
          key={`metric-${i}`}
          tile={tile}
          tileWidth={tileWidth}
          index={i}
          testID={testID}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  tile: {
    borderRadius: 16,
    padding: 16,
  },
  tileBar: {
    marginTop: 10,
  },
  tileHeader: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
  },
  tileLabel: {
    flex: 1,
    fontSize: 13,
  },
  tileValue: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 4,
    marginTop: 4,
  },
  valueNumber: {
    fontSize: 28,
    lineHeight: 32,
  },
  valueUnit: {
    fontSize: 14,
    paddingBottom: 4,
  },
});

export default MetricGrid;
