/**
 * MoodChart Types
 * @description Type definitions for the MoodChart component
 * @task Task 2.8.3: MoodChart Component
 */

import type { StyleProp, ViewStyle } from "react-native";
import type { MoodLevel } from "./MoodSelector.types";

/**
 * Chart type variants
 */
export type ChartType = "bar" | "line";

/**
 * Time period options
 */
export type TimePeriod = "1day" | "1week" | "1month" | "1year" | "alltime";

/**
 * Data point for chart
 */
export interface MoodDataPoint {
  date: string;
  mood: MoodLevel;
  value: number; // 0-100 scale
  label: string; // Display label (e.g., "Mon", "Jan 15")
}

/**
 * Chart annotation
 */
export interface ChartAnnotation {
  date: string;
  mood: MoodLevel;
  label: string;
  x: number;
  y: number;
}

/**
 * Chart legend item
 */
export interface ChartLegendItem {
  color: string;
  label: string;
}

/**
 * MoodChart Props
 */
export interface MoodChartProps {
  /**
   * Data points to display
   */
  data: MoodDataPoint[];

  /**
   * Chart type
   * @default "bar"
   */
  type?: ChartType;

  /**
   * Selected time period
   * @default "1week"
   */
  period?: TimePeriod;

  /**
   * Callback when period changes
   */
  onPeriodChange?: (period: TimePeriod) => void;

  /**
   * Callback when a data point is pressed
   */
  onDataPointPress?: (point: MoodDataPoint) => void;

  /**
   * Whether to show period selector
   * @default true
   */
  showPeriodSelector?: boolean;

  /**
   * Whether to show emoji on bars
   * @default true
   */
  showEmoji?: boolean;

  /**
   * Whether to show annotations
   * @default false
   */
  showAnnotations?: boolean;

  /**
   * Annotations to display
   */
  annotations?: ChartAnnotation[];

  /**
   * Height of the chart
   * @default 200
   */
  height?: number;

  /**
   * Whether the chart is loading
   * @default false
   */
  loading?: boolean;

  /**
   * Whether interactions are disabled
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
 * Mood to value mapping (0-100 scale)
 */
export const MOOD_VALUES: Record<MoodLevel, number> = {
  depressed: 10,
  sad: 30,
  neutral: 50,
  happy: 70,
  overjoyed: 90,
};

/**
 * Mood to color mapping for chart
 */
export const MOOD_CHART_COLORS: Record<MoodLevel, string> = {
  depressed: "#7B68B5",
  sad: "#E8853A",
  neutral: "#8B7355",
  happy: "#F5C563",
  overjoyed: "#9AAD5C",
};

/**
 * Period labels
 */
export const PERIOD_LABELS: Record<TimePeriod, string> = {
  "1day": "1 Day",
  "1week": "1 Week",
  "1month": "1 Month",
  "1year": "1 Year",
  alltime: "All Time",
};

/**
 * Get mood value on 0-100 scale
 */
export function getMoodValue(mood: MoodLevel): number {
  return MOOD_VALUES[mood];
}

/**
 * Get chart color for mood
 */
export function getMoodChartColor(mood: MoodLevel): string {
  return MOOD_CHART_COLORS[mood];
}

/**
 * Get mood emoji for chart
 */
export function getMoodChartEmoji(mood: MoodLevel): string {
  const emojis: Record<MoodLevel, string> = {
    depressed: "😵",
    sad: "😢",
    neutral: "😐",
    happy: "🙂",
    overjoyed: "😄",
  };
  return emojis[mood];
}

/**
 * Calculate bar height percentage
 */
export function calculateBarHeight(value: number, maxValue: number = 100): number {
  return (value / maxValue) * 100;
}

/**
 * Generate mock weekly data
 */
export function generateWeeklyData(): MoodDataPoint[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const moods: MoodLevel[] = ["neutral", "happy", "sad", "overjoyed", "happy", "neutral", "neutral"];

  return days.map((label, index) => ({
    date: `2025-01-${20 + index}`,
    mood: moods[index],
    value: getMoodValue(moods[index]),
    label,
  }));
}

/**
 * Generate day labels for different periods
 */
export function generateLabels(period: TimePeriod, count: number = 7): string[] {
  switch (period) {
    case "1day":
      return ["6am", "9am", "12pm", "3pm", "6pm", "9pm", "12am"];
    case "1week":
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    case "1month":
      return ["W1", "W2", "W3", "W4"];
    case "1year":
      return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    case "alltime":
      return ["2020", "2021", "2022", "2023", "2024", "2025"];
    default:
      return [];
  }
}
