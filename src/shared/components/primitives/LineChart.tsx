/**
 * LineChart — SVG line chart with gradient fill + pulsing endpoint (prototype v4.2).
 *
 * Used on screen 08 Journal — "mood from writing" trend chart.
 * Renders a cubic Bezier path with sage→aurora (or peach→aurora) gradient stroke,
 * a semi-transparent gradient fill below the line, and an animated pulsing dot
 * at the final data point.
 *
 * Respects `useReducedMotion()` — pulse collapses to static dot.
 *
 * @example
 *   <LineChart
 *     data={[{ x: 0, y: 0.3 }, { x: 0.5, y: 0.7 }, { x: 1, y: 0.9 }]}
 *     width={300}
 *     height={120}
 *     accessibilityLabel="Mood trend over 3 days, rising from 30% to 90%"
 *   />
 */

import React from "react";
import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
} from "react-native-svg";

import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface LineChartPoint {
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
}

export interface LineChartProps {
  data: LineChartPoint[]; // >= 2 points required
  width: number;
  height: number;
  variant?: "sage-aurora" | "peach-aurora"; // default "sage-aurora"
  showEndpoint?: boolean; // default true — pulsing dot at last point
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function LineChart({
  data,
  width,
  height,
  variant = "sage-aurora",
  showEndpoint = true,
  accessibilityLabel,
  style,
  testID,
}: LineChartProps): React.ReactElement {
  const { palette } = useTheme();
  const reduced = useReducedMotion();

  const pulseRadius = useSharedValue(5);

  React.useEffect(() => {
    if (reduced) {
      pulseRadius.value = 5;
      return;
    }
    pulseRadius.value = withRepeat(
      withSequence(
        withTiming(7, { duration: 750 }),
        withTiming(5, { duration: 750 }),
      ),
      -1,
      false,
    );
  }, [reduced, pulseRadius]);

  const animatedCircleProps = useAnimatedProps(() => ({
    r: pulseRadius.value,
  }));

  const [colorA, colorB] = GRADIENT_FOR_VARIANT[variant](palette);
  const strokeGradId = `lineChart-stroke-${variant}`;
  const fillGradId = `lineChart-fill-${variant}`;

  // Guard: need at least 2 points
  const points = data.length >= 2 ? data : [{ x: 0, y: 0 }, { x: 1, y: 0 }];

  // Convert normalized coords → pixel coords (y is flipped: 0 = bottom, 1 = top)
  const toPixel = (pt: LineChartPoint): [number, number] => [
    pt.x * width,
    height - pt.y * height,
  ];

  const pixelPoints = points.map(toPixel);

  // Build smooth cubic Bezier path
  const linePath = buildCubicBezierPath(pixelPoints);

  // Close the fill polygon down to the baseline
  const lastPx = pixelPoints[pixelPoints.length - 1];
  const firstPx = pixelPoints[0];
  const fillPath = `${linePath} L${lastPx[0]},${height} L${firstPx[0]},${height} Z`;

  const lastPoint = pixelPoints[pixelPoints.length - 1];

  return (
    <View
      testID={testID}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[{ width, height }, style]}
    >
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          {/* Stroke gradient — horizontal, start color → end color */}
          <SvgLinearGradient id={strokeGradId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colorA} stopOpacity="1" />
            <Stop offset="1" stopColor={colorB} stopOpacity="1" />
          </SvgLinearGradient>
          {/* Fill gradient — same hue, low opacity */}
          <SvgLinearGradient id={fillGradId} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colorA} stopOpacity="0.15" />
            <Stop offset="1" stopColor={colorB} stopOpacity="0.15" />
          </SvgLinearGradient>
        </Defs>

        {/* Gradient fill below the line */}
        <Path d={fillPath} fill={`url(#${fillGradId})`} />

        {/* Gradient stroke line */}
        <Path
          d={linePath}
          fill="none"
          stroke={`url(#${strokeGradId})`}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pulsing endpoint dot */}
        {showEndpoint ? (
          <AnimatedCircle
            cx={lastPoint[0]}
            cy={lastPoint[1]}
            fill={colorB}
            opacity={0.9}
            animatedProps={animatedCircleProps}
          />
        ) : null}
      </Svg>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a smooth cubic Bezier SVG path through pixel points. */
function buildCubicBezierPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";

  let d = `M${pts[0][0]},${pts[0][1]}`;

  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx = (prev[0] + curr[0]) / 2;
    // Tension = 0.4 for a gentle curve without overshooting
    const cp1x = prev[0] + (cpx - prev[0]) * 0.4;
    const cp1y = prev[1];
    const cp2x = curr[0] - (curr[0] - cpx) * 0.4;
    const cp2y = curr[1];
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${curr[0]},${curr[1]}`;
  }

  return d;
}

const GRADIENT_FOR_VARIANT: Readonly<
  Record<LineChartProps["variant"] & string, (p: any) => [string, string]>
> = {
  "sage-aurora": (p) => [p.sage[300], p.aurora[300]],
  "peach-aurora": (p) => [p.peach[300], p.aurora[300]],
};
