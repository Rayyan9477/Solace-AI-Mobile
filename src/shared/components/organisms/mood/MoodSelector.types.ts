/**
 * MoodSelector Types
 * @description Type definitions for the MoodSelector component
 * @task Task 2.8.1: MoodSelector Component
 */

import type { StyleProp, ViewStyle } from "react-native";

/**
 * Mood level options (5-scale)
 */
export type MoodLevel =
  | "depressed"
  | "sad"
  | "neutral"
  | "happy"
  | "overjoyed";

/**
 * Mood configuration with visual properties
 */
export interface MoodConfig {
  mood: MoodLevel;
  index: number;
  emoji: string;
  label: string;
  backgroundColor: string;
}

/**
 * MoodSelector Props
 */
export interface MoodSelectorProps {
  /**
   * Currently selected mood
   */
  value?: MoodLevel;

  /**
   * Callback when mood is selected
   */
  onMoodSelect?: (mood: MoodLevel) => void;

  /**
   * Callback when mood is confirmed
   */
  onConfirm?: (mood: MoodLevel) => void;

  /**
   * Title text
   * @default "How are you feeling this day?"
   */
  title?: string;

  /**
   * Label prefix before mood name
   * @default "I'm Feeling"
   */
  labelPrefix?: string;

  /**
   * Confirm button text
   * @default "Set Mood"
   */
  confirmButtonText?: string;

  /**
   * Whether the component is in loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to animate transitions
   * @default true
   */
  animated?: boolean;

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
 * Mood configurations with colors and emojis
 */
export const MOOD_CONFIGS: Record<MoodLevel, MoodConfig> = {
  depressed: {
    mood: "depressed",
    index: 0,
    emoji: "😵",
    label: "Depressed",
    backgroundColor: "#7B68B5", // Purple
  },
  sad: {
    mood: "sad",
    index: 1,
    emoji: "😢",
    label: "Sad",
    backgroundColor: "#E8853A", // Orange
  },
  neutral: {
    mood: "neutral",
    index: 2,
    emoji: "😐",
    label: "Neutral",
    backgroundColor: "#8B7355", // Brown/tan
  },
  happy: {
    mood: "happy",
    index: 3,
    emoji: "🙂",
    label: "Happy",
    backgroundColor: "#F5C563", // Yellow/golden
  },
  overjoyed: {
    mood: "overjoyed",
    index: 4,
    emoji: "😄",
    label: "Overjoyed",
    backgroundColor: "#9AAD5C", // Green/olive
  },
};

/**
 * Ordered list of moods for slider
 */
export const MOOD_ORDER: MoodLevel[] = [
  "depressed",
  "sad",
  "neutral",
  "happy",
  "overjoyed",
];

/**
 * Get mood config by index
 */
export function getMoodByIndex(index: number): MoodConfig {
  const mood = MOOD_ORDER[index];
  return MOOD_CONFIGS[mood];
}

/**
 * Get mood index
 */
export function getMoodIndex(mood: MoodLevel): number {
  return MOOD_CONFIGS[mood].index;
}

/**
 * Get mood label with prefix
 */
export function getMoodLabel(mood: MoodLevel, prefix: string = "I'm Feeling"): string {
  return `${prefix} ${MOOD_CONFIGS[mood].label}`;
}

/**
 * Get mood emoji
 */
export function getMoodEmoji(mood: MoodLevel): string {
  return MOOD_CONFIGS[mood].emoji;
}

/**
 * Get mood background color
 */
export function getMoodBackgroundColor(mood: MoodLevel): string {
  return MOOD_CONFIGS[mood].backgroundColor;
}
