/**
 * ScatterPlot — mood × sleep scatter with dashed trend line (prototype v4.2).
 *
 * Used on screen 23 Mood insights. Each point is color-coded by mood level
 * (0 = Struggling … 4 = Overjoyed) using the cosmic palette. Includes optional
 * dashed trend line and decorative axis lines.
 *
 * No animation — purely declarative SVG.
 *
 * @example
 *   <ScatterPlot
 *     points={[
 *       { x: 0.3, y: 0.6, moodLevel: 3 },
 *       { x: 0.7, y: 0.8, moodLevel: 4 },
 *     ]}
 *     width={300}
 *     height={200}
 *     xAxisLabel="Sleep hours"
 *     yAxisLabel="Mood"
 *     accessibilityLabel="Mood versus sleep scatter, 2 data points"
 *   />
 */

import React from "react";
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Svg, {
  Circle,
  Line,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

import { useTheme } from "@/shared/theme/useTheme";

export interface ScatterPoint {
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
  moodLevel: 0 | 1 | 2 | 3 | 4; // 0=Struggling, 4=Overjoyed
}

export interface ScatterPlotProps {
  points: ScatterPoint[];
  width: number;
  height: number;
  trendLine?: { from: ScatterPoint; to: ScatterPoint } | null;
  xAxisLabel?: string;
  yAxisLabel?: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Padding reserved for axes inside the SVG canvas */
const AXIS_PADDING = { top: 8, right: 8, bottom: 24, left: 24 };

export function ScatterPlot({
  points,
  width,
  height,
  trendLine,
  xAxisLabel,
  yAxisLabel,
  accessibilityLabel,
  style,
  testID,
}: ScatterPlotProps): React.ReactElement {
  const { palette } = useTheme();

  const moodColors = MOOD_COLOR(palette);

  // Usable plot area (inside axes)
  const plotW = width - AXIS_PADDING.left - AXIS_PADDING.right;
  const plotH = height - AXIS_PADDING.top - AXIS_PADDING.bottom;

  // Convert normalized point to pixel coords within the plot area
  const toX = (nx: number) => AXIS_PADDING.left + nx * plotW;
  const toY = (ny: number) => AXIS_PADDING.top + (1 - ny) * plotH;

  return (
    <View
      testID={testID}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[{ width, height: height + (xAxisLabel ? 16 : 0) }, style]}
    >
      <Svg width={width} height={height}>
        {/* Decorative axis lines */}
        <Line
          x1={AXIS_PADDING.left}
          y1={AXIS_PADDING.top}
          x2={AXIS_PADDING.left}
          y2={AXIS_PADDING.top + plotH}
          stroke={palette.warm[400]}
          strokeWidth={1}
          opacity={0.3}
        />
        <Line
          x1={AXIS_PADDING.left}
          y1={AXIS_PADDING.top + plotH}
          x2={AXIS_PADDING.left + plotW}
          y2={AXIS_PADDING.top + plotH}
          stroke={palette.warm[400]}
          strokeWidth={1}
          opacity={0.3}
        />

        {/* Dashed trend line */}
        {trendLine ? (
          <Line
            x1={toX(trendLine.from.x)}
            y1={toY(trendLine.from.y)}
            x2={toX(trendLine.to.x)}
            y2={toY(trendLine.to.y)}
            stroke={palette.warm[400]}
            strokeWidth={1.5}
            strokeDasharray="4,4"
            opacity={0.6}
          />
        ) : null}

        {/* Data points */}
        {points.map((pt, i) => (
          <Circle
            key={i}
            cx={toX(pt.x)}
            cy={toY(pt.y)}
            r={5}
            fill={moodColors[pt.moodLevel]}
            opacity={0.9}
          />
        ))}
      </Svg>

      {/* Axis labels rendered outside SVG for font flexibility */}
      {(xAxisLabel || yAxisLabel) ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {yAxisLabel ? (
            <Text
              style={[styles.yLabel, { color: palette.warm[400] }]}
              numberOfLines={1}
            >
              {yAxisLabel}
            </Text>
          ) : null}
          {xAxisLabel ? (
            <Text
              style={[styles.xLabel, { color: palette.warm[400] }]}
              numberOfLines={1}
            >
              {xAxisLabel}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Mood color map — exact palette tokens per spec
// ---------------------------------------------------------------------------
function MOOD_COLOR(p: any): [string, string, string, string, string] {
  return [
    p.lavender[500], // 0 Struggling
    p.lavender[300], // 1 Down
    p.warm[200],     // 2 Neutral
    p.sage[300],     // 3 Content
    p.peach[300],    // 4 Overjoyed
  ];
}

const styles = StyleSheet.create({
  xLabel: {
    bottom: 0,
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    position: "absolute",
    right: 8,
    textAlign: "right",
  },
  yLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    left: 0,
    position: "absolute",
    textAlign: "left",
    top: 0,
  },
});
