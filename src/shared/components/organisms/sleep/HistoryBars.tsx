/**
 * HistoryBars — 7-day sleep history vertical bar chart (prototype v4.2).
 *
 * Thin organism wrapping the BarChart primitive. Normalises hours to a 0-1
 * value vs. goalHours * 1.2 so goalHours lands at 0.833 of chart height.
 * A dashed goal-line is omitted from this pass (BarChart's SVG layer would
 * be needed; added as a TODO below).
 *
 * @example
 *   <HistoryBars
 *     days={[
 *       { label: "Mon", hours: 6.5 },
 *       { label: "Tue", hours: 7.8, isToday: true },
 *     ]}
 *     goalHours={8}
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

import { BarChart } from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

export interface SleepHistoryDay {
  label: string;   // e.g. "Mon"
  hours: number;   // total sleep hours
  isToday?: boolean;
}

export interface HistoryBarsProps {
  /** Exactly 7 days. */
  days: SleepHistoryDay[];
  /** Dashed goal line reference. Default 8. */
  goalHours?: number;
  /** Chart height in dp. Default 140. */
  height?: number;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function HistoryBars({
  days,
  goalHours = 8,
  height = 140,
  testID,
  style,
}: HistoryBarsProps): React.ReactElement {
  const { palette } = useTheme();

  // Ceiling = goalHours * 1.2 so the goal line sits at ~83% of bar height.
  const ceiling = goalHours * 1.2;

  const bars = days.map((d) => ({
    label: d.label,
    value: Math.min(d.hours / ceiling, 1),
    highlighted: d.isToday ?? false,
  }));

  // TODO: render a dashed goal line via an SVG overlay at
  //   y = chartHeight * (1 - goalHours / ceiling) above the bar area.
  //   Requires importing Svg/Line from react-native-svg.

  return (
    <View testID={testID} style={[styles.container, style]}>
      <BarChart
        bars={bars}
        width={280}
        height={height}
        variant="lavender"
        accessibilityLabel={`Sleep history for the last 7 days, goal ${goalHours} hours`}
      />
      <Text style={[styles.goal, { color: palette.warm[500] }]}>
        {`Goal: ${goalHours}h`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  goal: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    marginTop: 6,
  },
});
