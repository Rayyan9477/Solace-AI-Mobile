/**
 * TimePicker Types
 * @description Type definitions for the TimePicker component
 * @task Task 2.6.2: TimePicker Component
 */

import type { StyleProp, ViewStyle } from "react-native";

/**
 * Time value representation
 */
export interface TimeValue {
  hours: number; // 0-23 for 24h format, 1-12 for 12h format
  minutes: number; // 0-59
  period?: "AM" | "PM"; // Only used for 12h format
}

/**
 * TimePicker format mode
 */
export type TimeFormat = "12h" | "24h";

/**
 * TimePicker display style
 */
export type TimePickerStyle = "wheel" | "input";

/**
 * Minute interval for selection
 */
export type MinuteInterval = 1 | 5 | 10 | 15 | 30;

/**
 * TimePicker Props
 */
export interface TimePickerProps {
  /**
   * Currently selected time
   */
  value?: TimeValue;

  /**
   * Callback when time is changed
   */
  onTimeChange?: (time: TimeValue) => void;

  /**
   * Time format (12h or 24h)
   * @default "12h"
   */
  format?: TimeFormat;

  /**
   * Minute selection interval
   * @default 1
   */
  minuteInterval?: MinuteInterval;

  /**
   * Minimum selectable time
   */
  minTime?: TimeValue;

  /**
   * Maximum selectable time
   */
  maxTime?: TimeValue;

  /**
   * Whether the picker is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Label displayed above the picker
   */
  label?: string;

  /**
   * Helper text displayed below the picker
   */
  helperText?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Show confirm button
   * @default true
   */
  showConfirm?: boolean;

  /**
   * Callback when confirm is pressed
   */
  onConfirm?: (time: TimeValue) => void;

  /**
   * Callback when cancel is pressed
   */
  onCancel?: () => void;

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
 * Helper function to convert 12h time to 24h
 */
export function to24Hour(time: TimeValue): TimeValue {
  if (!time.period) return time;

  let hours = time.hours;
  if (time.period === "PM" && hours !== 12) {
    hours += 12;
  } else if (time.period === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes: time.minutes };
}

/**
 * Helper function to convert 24h time to 12h
 */
export function to12Hour(time: TimeValue): TimeValue {
  let hours = time.hours;
  let period: "AM" | "PM" = "AM";

  if (hours >= 12) {
    period = "PM";
    if (hours > 12) {
      hours -= 12;
    }
  } else if (hours === 0) {
    hours = 12;
  }

  return { hours, minutes: time.minutes, period };
}

/**
 * Format time value to string
 */
export function formatTime(
  time: TimeValue,
  format: TimeFormat = "12h",
): string {
  const displayTime = format === "12h" ? to12Hour(time) : time;
  const hours = String(displayTime.hours).padStart(2, "0");
  const minutes = String(displayTime.minutes).padStart(2, "0");

  if (format === "12h" && displayTime.period) {
    return `${hours}:${minutes} ${displayTime.period}`;
  }

  return `${hours}:${minutes}`;
}

/**
 * Parse time string to TimeValue
 */
export function parseTimeString(timeStr: string): TimeValue | null {
  // Try 12h format first (e.g., "02:30 PM")
  const match12h = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12h) {
    const hours = parseInt(match12h[1], 10);
    const minutes = parseInt(match12h[2], 10);
    const period = match12h[3].toUpperCase() as "AM" | "PM";
    return { hours, minutes, period };
  }

  // Try 24h format (e.g., "14:30")
  const match24h = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (match24h) {
    const hours = parseInt(match24h[1], 10);
    const minutes = parseInt(match24h[2], 10);
    return { hours, minutes };
  }

  return null;
}
