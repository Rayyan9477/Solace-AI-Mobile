/**
 * MoodCalendar Types
 * @description Type definitions for the MoodCalendar component
 * @task Task 2.8.2: MoodCalendar Component
 */

import type { StyleProp, ViewStyle } from "react-native";
import type { MoodLevel } from "./MoodSelector.types";

/**
 * Day entry status
 */
export type DayStatus = "positive" | "negative" | "skipped" | "none";

/**
 * Calendar day data
 */
export interface CalendarDay {
  date: string; // ISO date string (YYYY-MM-DD)
  dayOfWeek: number; // 0-6 (Sun-Sat)
  dayOfMonth: number;
  mood?: MoodLevel;
  status: DayStatus;
  isToday?: boolean;
  isCurrentMonth?: boolean;
}

/**
 * Calendar week data
 */
export interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

/**
 * Legend item
 */
export interface LegendItem {
  status: DayStatus;
  label: string;
  color: string;
}

/**
 * MoodCalendar Props
 */
export interface MoodCalendarProps {
  /**
   * Weeks data to display
   */
  weeks: CalendarWeek[];

  /**
   * Callback when a day is pressed
   */
  onDayPress?: (day: CalendarDay) => void;

  /**
   * Selected date (ISO string)
   */
  selectedDate?: string;

  /**
   * Whether to show legend
   * @default true
   */
  showLegend?: boolean;

  /**
   * Custom legend items
   */
  legendItems?: LegendItem[];

  /**
   * Number of weeks to show
   * @default 4
   */
  weeksToShow?: number;

  /**
   * Start day of week (0 = Sun, 1 = Mon)
   * @default 1 (Monday)
   */
  startDayOfWeek?: number;

  /**
   * Whether the calendar is loading
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
 * Default colors for day statuses
 */
export const STATUS_COLORS: Record<DayStatus, string> = {
  positive: "#9AAD5C", // Green/olive
  negative: "#E8853A", // Orange
  skipped: "#6B6B6B", // Gray
  none: "transparent",
};

/**
 * Default legend items
 */
export const DEFAULT_LEGEND_ITEMS: LegendItem[] = [
  { status: "skipped", label: "Skipped", color: STATUS_COLORS.skipped },
  { status: "positive", label: "Positive", color: STATUS_COLORS.positive },
  { status: "negative", label: "Negative", color: STATUS_COLORS.negative },
];

/**
 * Day abbreviations starting from Monday
 */
export const DAY_ABBREVIATIONS_MON = ["M", "T", "W", "T", "F", "S", "S"];

/**
 * Day abbreviations starting from Sunday
 */
export const DAY_ABBREVIATIONS_SUN = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * Get status color
 */
export function getStatusColor(status: DayStatus): string {
  return STATUS_COLORS[status];
}

/**
 * Get status from mood
 */
export function getStatusFromMood(mood?: MoodLevel): DayStatus {
  if (!mood) return "skipped";

  switch (mood) {
    case "happy":
    case "overjoyed":
      return "positive";
    case "depressed":
    case "sad":
      return "negative";
    case "neutral":
      return "positive"; // Neutral is treated as positive
    default:
      return "none";
  }
}

/**
 * Generate calendar weeks for a month
 */
export function generateCalendarWeeks(
  year: number,
  month: number,
  moodData: Record<string, MoodLevel>,
  weeksToShow: number = 4,
): CalendarWeek[] {
  const weeks: CalendarWeek[] = [];
  const today = new Date();
  const todayStr = formatDate(today);

  // Start from the first of the month
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);

  // Adjust to start from Monday
  const dayOfWeek = startDate.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startDate.setDate(startDate.getDate() - daysToSubtract);

  for (let week = 0; week < weeksToShow; week++) {
    const days: CalendarDay[] = [];

    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + week * 7 + day);

      const dateStr = formatDate(currentDate);
      const mood = moodData[dateStr];

      days.push({
        date: dateStr,
        dayOfWeek: currentDate.getDay(),
        dayOfMonth: currentDate.getDate(),
        mood,
        status: getStatusFromMood(mood),
        isToday: dateStr === todayStr,
        isCurrentMonth: currentDate.getMonth() === month,
      });
    }

    weeks.push({
      weekNumber: week + 1,
      days,
    });
  }

  return weeks;
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse ISO date string to Date
 */
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}
