/**
 * JournalEntryCard Component Types
 * @description Timeline journal entry card with mood, preview, and metadata
 * @task Task 2.9.1: JournalEntryCard Component
 *
 * Based on UI Audit:
 * - batch-17-journal-continued.md, Screen 84
 * - Title with emoji
 * - Mood badge (colored pill)
 * - Content preview (2 lines max)
 * - Metadata: AI suggestions count, heart rate
 * - Timestamp and mood avatar
 */

import type { ViewStyle } from "react-native";
import type { MoodLevel } from "../mood/MoodSelector.types";

export interface JournalEntryCardProps {
  /** Unique entry identifier */
  id: string;

  /** Entry title */
  title: string;

  /** User's mood for this entry */
  mood: MoodLevel;

  /** Truncated entry content (2 lines max) */
  contentPreview: string;

  /** Entry creation timestamp */
  timestamp: Date;

  /** Number of AI suggestions available */
  aiSuggestionsCount: number;

  /** Optional heart rate measurement */
  heartRate?: number;

  /** Callback when card is pressed */
  onPress?: (id: string) => void;

  /** Optional custom styles */
  style?: ViewStyle;

  /** Test identifier */
  testID?: string;

  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Format timestamp for display
 * @param date - Entry timestamp
 * @returns Formatted time string (e.g., "10:00")
 */
export function formatEntryTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Truncate preview text to max length
 * @param text - Full text content
 * @param maxLength - Maximum character length
 * @returns Truncated text with ellipsis if needed
 */
export function truncatePreview(text: string, maxLength: number = 60): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}
