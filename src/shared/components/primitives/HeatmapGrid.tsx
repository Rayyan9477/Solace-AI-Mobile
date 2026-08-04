/**
 * HeatmapGrid — 7×N month heatmap for mood calendar (prototype v4.2).
 *
 * Used on screen 22 Mood calendar. Renders a grid of `weeks` rows × 7 columns.
 * Each cell shows a mood color (same 5-level map as ScatterPlot). Today gets a
 * 2px aurora ring. Empty cells render at reduced opacity.
 *
 * Cells are `TouchableOpacity` when `onCellPress` is provided, with full a11y
 * labels like "April 5, Content mood".
 *
 * @example
 *   <HeatmapGrid
 *     cells={calendarCells}
 *     weeks={5}
 *     accessibilityLabel="April 2026 mood calendar"
 *     onCellPress={(cell) => console.log(cell.date)}
 *   />
 */

import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";

export interface HeatmapCell {
  date: string; // ISO YYYY-MM-DD
  moodLevel: 0 | 1 | 2 | 3 | 4 | null; // null = no entry
  isToday?: boolean;
}

export interface HeatmapGridProps {
  cells: HeatmapCell[]; // length = 7 × weeks
  weeks?: number; // default 5 — rows
  cellSize?: number; // default 36
  accessibilityLabel: string;
  onCellPress?: (cell: HeatmapCell) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const MOOD_LABELS = ["Struggling", "Down", "Neutral", "Content", "Overjoyed"];

export function HeatmapGrid({
  cells,
  weeks = 5,
  cellSize = 36,
  accessibilityLabel,
  onCellPress,
  style,
  testID,
}: HeatmapGridProps): React.ReactElement {
  const { palette } = useTheme();

  const moodColors = MOOD_COLOR(palette);

  // Split flat cells array into rows of 7
  const rows: HeatmapCell[][] = [];
  for (let r = 0; r < weeks; r++) {
    rows.push(cells.slice(r * 7, r * 7 + 7));
  }

  return (
    <View
      testID={testID}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[styles.grid, style]}
    >
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((cell, colIdx) => {
            const fill =
              cell.moodLevel !== null
                ? moodColors[cell.moodLevel]
                : palette.midnight[700];

            const opacity = cell.moodLevel !== null ? 1 : 0.4;

            const cellLabel = buildCellLabel(cell);

            const cellContent = (
              <View
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: fill,
                    opacity,
                    borderRadius: 6,
                  },
                  cell.isToday && {
                    borderWidth: 2,
                    borderColor: palette.aurora[300],
                    // Compensate for border so size stays consistent
                    opacity: 1,
                  },
                ]}
              />
            );

            if (onCellPress) {
              return (
                <TouchableOpacity
                  key={`${rowIdx}-${colIdx}`}
                  accessibilityRole="button"
                  accessibilityLabel={cellLabel}
                  onPress={() => onCellPress(cell)}
                  style={{ margin: 2 }}
                  activeOpacity={0.7}
                >
                  {cellContent}
                </TouchableOpacity>
              );
            }

            return (
              <View key={`${rowIdx}-${colIdx}`} style={{ margin: 2 }}>
                {cellContent}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mood color map — exact palette tokens per spec (same as ScatterPlot). */
function MOOD_COLOR(p: any): [string, string, string, string, string] {
  return [
    p.lavender[500], // 0 Struggling
    p.lavender[300], // 1 Down
    p.warm[200],     // 2 Neutral
    p.sage[300],     // 3 Content
    p.peach[300],    // 4 Overjoyed
  ];
}

/** Build human-readable a11y label for a cell, e.g. "April 5, Content mood". */
function buildCellLabel(cell: HeatmapCell): string {
  const formatted = formatDate(cell.date);
  if (cell.moodLevel === null) {
    return `${formatted}, no mood entry`;
  }
  const mood = MOOD_LABELS[cell.moodLevel];
  const today = cell.isToday ? ", today" : "";
  return `${formatted}, ${mood} mood${today}`;
}

/** Format ISO date string to human-readable "Month D" (e.g., "April 5"). */
function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
  } catch {
    return iso;
  }
}

const styles = StyleSheet.create({
  cell: {
    overflow: "hidden",
  },
  grid: {
    alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
});
