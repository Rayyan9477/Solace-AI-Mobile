/**
 * ScoreCard Component
 * @description Circular gauge score card with trend indicator
 * @task Task 2.8.4: ScoreCard Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Circular progress gauge
 * - Score value display
 * - Status label based on score
 * - Trend indicator (up/down/stable)
 * - Multiple sizes (sm, md, lg)
 * - Full accessibility support
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import type { ScoreCardProps } from "./ScoreCard.types";
import {
  SIZE_SPECS,
  getDefaultStatusLabel,
  getStatusColor,
  getTrendIcon,
  getTrendColor,
  calculateGaugeProgress,
} from "./ScoreCard.types";
import { palette } from "../../../theme";

/**
 * Circular Gauge Component
 */
interface GaugeProps {
  score: number;
  maxScore: number;
  size: number;
  strokeWidth: number;
  color: string;
  testID?: string;
}

function CircularGauge({
  score,
  maxScore,
  size,
  strokeWidth,
  color,
  testID,
}: GaugeProps) {
  const progress = calculateGaugeProgress(score, maxScore);

  // Calculate the border width to create the arc effect
  // We use a technique with partial borders to simulate a gauge
  const innerSize = size - strokeWidth * 2;

  return (
    <View
      testID={testID}
      style={[
        styles.gaugeContainer,
        { width: size, height: size },
      ]}
    >
      {/* Background circle */}
      <View
        style={[
          styles.gaugeBackground,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            borderWidth: strokeWidth,
          },
        ]}
      />

      {/* Progress indicator (simplified - using border trick) */}
      <View
        testID={`${testID}-progress`}
        style={[
          styles.gaugeProgress,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            // Rotate to start from top and show progress
            transform: [{ rotate: `${-90 + progress * 360}deg` }],
            borderTopColor: color,
            borderRightColor: progress > 0.25 ? color : "transparent",
            borderBottomColor: progress > 0.5 ? color : "transparent",
            borderLeftColor: progress > 0.75 ? color : "transparent",
          },
        ]}
      />
    </View>
  );
}

/**
 * Trend Indicator Component
 */
interface TrendProps {
  trend: "up" | "down" | "stable";
  value?: number;
  testID?: string;
}

function TrendIndicator({ trend, value, testID }: TrendProps) {
  const icon = getTrendIcon(trend);
  const color = getTrendColor(trend);

  return (
    <Text testID={testID} style={[styles.trend, { color }]}>
      {icon}
      {value !== undefined && ` ${value}%`}
    </Text>
  );
}

/**
 * Skeleton Component
 */
interface SkeletonProps {
  testID?: string;
  size: "sm" | "md" | "lg";
}

function ScoreCardSkeleton({ testID, size }: SkeletonProps) {
  const specs = SIZE_SPECS[size];

  return (
    <View testID={testID} style={styles.skeletonContainer}>
      <View
        style={[
          styles.skeletonGauge,
          { width: specs.gaugeSize, height: specs.gaugeSize },
        ]}
      />
      <View style={styles.skeletonText} />
      <View style={[styles.skeletonText, { width: 80 }]} />
    </View>
  );
}

/**
 * ScoreCard Component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ScoreCard
 *   score={80}
 *   onPress={() => navigateToDetail()}
 * />
 *
 * // With custom title and trend
 * <ScoreCard
 *   score={75}
 *   title="Mental Health Score"
 *   trend="up"
 *   trendValue={5}
 *   size="lg"
 * />
 * ```
 */
export function ScoreCard({
  score,
  maxScore = 100,
  title = "Freud Score",
  statusLabel,
  trend,
  trendValue,
  onPress,
  size = "md",
  showGauge = true,
  showTrend = true,
  loading = false,
  disabled = false,
  testID,
  accessibilityLabel,
  style,
}: ScoreCardProps): React.ReactElement {
  const specs = SIZE_SPECS[size];
  const color = getStatusColor(score, maxScore);
  const defaultStatus = getDefaultStatusLabel(score, maxScore);
  const displayStatus = statusLabel || defaultStatus;

  const defaultAccessibilityLabel = `${title}: ${score}, ${displayStatus}`;
  const isPressable = onPress && !disabled;

  const Container = isPressable ? TouchableOpacity : View;
  const containerProps = isPressable
    ? {
        onPress,
        accessibilityRole: "button" as const,
      }
    : {};

  if (loading) {
    return (
      <View
        testID={testID}
        accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
        style={[styles.container, { padding: specs.padding }, style]}
      >
        <ScoreCardSkeleton testID={`${testID}-skeleton`} size={size} />
      </View>
    );
  }

  return (
    <Container
      testID={testID}
      accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
      disabled={disabled}
      style={[styles.container, { padding: specs.padding }, style]}
      {...containerProps}
    >
      {/* Gauge */}
      {showGauge && (
        <View style={styles.gaugeWrapper}>
          <CircularGauge
            testID={`${testID}-gauge`}
            score={score}
            maxScore={maxScore}
            size={specs.gaugeSize}
            strokeWidth={specs.strokeWidth}
            color={color}
          />

          {/* Score in center */}
          <View style={styles.scoreOverlay}>
            <Text style={[styles.scoreValue, { fontSize: specs.scoreFontSize }]}>
              {score}
            </Text>
          </View>
        </View>
      )}

      {/* Title */}
      <Text style={[styles.title, { fontSize: specs.titleFontSize }]}>
        {title}
      </Text>

      {/* Status */}
      <Text
        style={[
          styles.status,
          { fontSize: specs.statusFontSize, color },
        ]}
      >
        {displayStatus}
      </Text>

      {/* Trend */}
      {showTrend && trend && (
        <TrendIndicator
          testID={`${testID}-trend`}
          trend={trend}
          value={trendValue}
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: palette.gray[700],
    borderRadius: 16,
  },
  gaugeBackground: {
    borderColor: `${palette.gray[400]}${palette.alpha[20]}`,
    position: "absolute",
  },
  gaugeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeProgress: {
    position: "absolute",
  },
  gaugeWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
  },
  scoreOverlay: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  scoreValue: {
    color: palette.white,
    fontWeight: "700",
  },
  skeletonContainer: {
    alignItems: "center",
    gap: 12,
  },
  skeletonGauge: {
    backgroundColor: palette.gray[600],
    borderRadius: 100,
  },
  skeletonText: {
    backgroundColor: palette.gray[600],
    borderRadius: 4,
    height: 16,
    width: 100,
  },
  status: {
    fontWeight: "500",
    marginTop: 4,
  },
  title: {
    color: palette.gray[400],
  },
  trend: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
});

export default ScoreCard;
