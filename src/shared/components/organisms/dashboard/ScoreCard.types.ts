/**
 * ScoreCard Types
 * @description Type definitions for the ScoreCard component
 * @task Task 2.8.4: ScoreCard Component
 */

import type { StyleProp, ViewStyle } from "react-native";

/**
 * Score status based on value
 */
export type ScoreStatus =
  | "critical"
  | "low"
  | "moderate"
  | "stable"
  | "excellent";

/**
 * Trend direction
 */
export type TrendDirection = "up" | "down" | "stable";

/**
 * Score card size variants
 */
export type ScoreCardSize = "sm" | "md" | "lg";

/**
 * ScoreCard Props
 */
export interface ScoreCardProps {
  /**
   * Score value (0-100)
   */
  score: number;

  /**
   * Maximum score value
   * @default 100
   */
  maxScore?: number;

  /**
   * Card title
   * @default "Freud Score"
   */
  title?: string;

  /**
   * Status label (e.g., "Mentally Stable")
   */
  statusLabel?: string;

  /**
   * Trend direction
   */
  trend?: TrendDirection;

  /**
   * Trend value (percentage change)
   */
  trendValue?: number;

  /**
   * Callback when card is pressed
   */
  onPress?: () => void;

  /**
   * Size variant
   * @default "md"
   */
  size?: ScoreCardSize;

  /**
   * Whether to show the circular gauge
   * @default true
   */
  showGauge?: boolean;

  /**
   * Whether to show trend indicator
   * @default true
   */
  showTrend?: boolean;

  /**
   * Whether to animate the gauge
   * @default true
   */
  animated?: boolean;

  /**
   * Whether the card is in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Whether the card is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Container style
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Status colors
 */
export const STATUS_COLORS: Record<ScoreStatus, string> = {
  critical: "#EF4444", // Red
  low: "#E8853A", // Orange
  moderate: "#F5C563", // Yellow
  stable: "#9AAD5C", // Green
  excellent: "#4ADE80", // Bright green
};

/**
 * Size specifications
 */
export const SIZE_SPECS: Record<
  ScoreCardSize,
  {
    gaugeSize: number;
    strokeWidth: number;
    scoreFontSize: number;
    titleFontSize: number;
    statusFontSize: number;
    padding: number;
  }
> = {
  sm: {
    gaugeSize: 80,
    strokeWidth: 6,
    scoreFontSize: 24,
    titleFontSize: 12,
    statusFontSize: 10,
    padding: 12,
  },
  md: {
    gaugeSize: 120,
    strokeWidth: 8,
    scoreFontSize: 36,
    titleFontSize: 14,
    statusFontSize: 12,
    padding: 16,
  },
  lg: {
    gaugeSize: 160,
    strokeWidth: 10,
    scoreFontSize: 48,
    titleFontSize: 18,
    statusFontSize: 14,
    padding: 20,
  },
};

/**
 * Get status from score
 */
export function getScoreStatus(score: number, maxScore: number = 100): ScoreStatus {
  const percentage = (score / maxScore) * 100;

  if (percentage < 30) return "critical";
  if (percentage < 50) return "low";
  if (percentage < 70) return "moderate";
  if (percentage < 85) return "stable";
  return "excellent";
}

/**
 * Get status label from score
 */
export function getDefaultStatusLabel(score: number, maxScore: number = 100): string {
  const status = getScoreStatus(score, maxScore);

  switch (status) {
    case "critical":
      return "Needs Attention";
    case "low":
      return "Below Average";
    case "moderate":
      return "Making Progress";
    case "stable":
      return "Mentally Stable";
    case "excellent":
      return "Excellent";
    default:
      return "Unknown";
  }
}

/**
 * Get status color from score
 */
export function getStatusColor(score: number, maxScore: number = 100): string {
  const status = getScoreStatus(score, maxScore);
  return STATUS_COLORS[status];
}

/**
 * Get trend icon
 */
export function getTrendIcon(trend: TrendDirection): string {
  switch (trend) {
    case "up":
      return "↑";
    case "down":
      return "↓";
    case "stable":
      return "→";
    default:
      return "";
  }
}

/**
 * Get trend color
 */
export function getTrendColor(trend: TrendDirection): string {
  switch (trend) {
    case "up":
      return "#9AAD5C";
    case "down":
      return "#EF4444";
    case "stable":
      return "#94A3B8";
    default:
      return "#94A3B8";
  }
}

/**
 * Calculate gauge arc path
 */
export function calculateGaugeProgress(
  score: number,
  maxScore: number = 100,
): number {
  return Math.min(Math.max(score / maxScore, 0), 1);
}
