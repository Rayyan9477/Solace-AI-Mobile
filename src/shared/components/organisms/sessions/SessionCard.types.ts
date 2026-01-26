/**
 * SessionCard Component Types
 * @description Mindful session card with playback controls and progress
 * @task Task 2.9.2: SessionCard Component
 *
 * Based on UI Audit:
 * - batch-21-stress-final-mindful-start.md, Screen 104
 * - Play button with icon
 * - Title text
 * - Soundscape badge (colored pill)
 * - Progress bar
 * - Time labels (current / total)
 */

import type { ViewStyle } from "react-native";

export interface SessionCardProps {
  /** Unique session identifier */
  id: string;

  /** Session title */
  title: string;

  /** Soundscape configuration */
  soundscape: Soundscape;

  /** Total duration in minutes */
  duration: number;

  /** Current progress in minutes */
  progress: number;

  /** Callback when card is pressed */
  onPress?: (id: string) => void;

  /** Callback when play button is pressed */
  onPlayPress?: (id: string) => void;

  /** Optional custom styles */
  style?: ViewStyle;

  /** Test identifier */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;
}

export interface Soundscape {
  /** Soundscape name */
  name: string;

  /** Badge background color */
  color: string;
}

/**
 * Format time in MM:SS format
 * @param minutes - Time in minutes (can be decimal)
 * @returns Formatted time string (e.g., "05:02")
 */
export function formatSessionTime(minutes: number): string {
  const totalSeconds = Math.floor(minutes * 60);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Calculate progress percentage
 * @param progress - Current progress in minutes
 * @param duration - Total duration in minutes
 * @returns Progress as percentage (0-100)
 */
export function calculateProgress(progress: number, duration: number): number {
  if (duration === 0) return 0;
  return Math.min((progress / duration) * 100, 100);
}
