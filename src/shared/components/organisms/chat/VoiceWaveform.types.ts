/**
 * VoiceWaveform Types
 * @description Type definitions for the VoiceWaveform component
 * @task Task 2.7.4: VoiceWaveform Component
 */

import type { StyleProp, ViewStyle } from "react-native";

/**
 * Waveform visualization style
 */
export type WaveformStyle = "bars" | "line" | "mirror";

/**
 * Animation mode
 */
export type AnimationMode = "live" | "playback" | "static";

/**
 * VoiceWaveform Props
 */
export interface VoiceWaveformProps {
  /**
   * Waveform data (array of amplitude values 0-1)
   */
  waveform?: number[];

  /**
   * Number of bars to display
   * @default 30
   */
  barCount?: number;

  /**
   * Whether the waveform is currently animating
   * @default false
   */
  isAnimating?: boolean;

  /**
   * Animation mode
   * @default "live"
   */
  animationMode?: AnimationMode;

  /**
   * Visualization style
   * @default "bars"
   */
  waveformStyle?: WaveformStyle;

  /**
   * Primary color for bars
   * @default "#9AAD5C"
   */
  primaryColor?: string;

  /**
   * Secondary color for mirrored bars
   * @default "#475569"
   */
  secondaryColor?: string;

  /**
   * Minimum bar height (0-1)
   * @default 0.1
   */
  minBarHeight?: number;

  /**
   * Maximum bar height in pixels
   * @default 40
   */
  maxHeight?: number;

  /**
   * Bar width in pixels
   * @default 3
   */
  barWidth?: number;

  /**
   * Gap between bars in pixels
   * @default 2
   */
  barGap?: number;

  /**
   * Border radius for bars
   * @default 2
   */
  barRadius?: number;

  /**
   * Current playback position (0-1)
   * Used for playback mode to highlight played portion
   */
  playbackProgress?: number;

  /**
   * Whether to show duration text
   * @default false
   */
  showDuration?: boolean;

  /**
   * Current duration in milliseconds
   */
  duration?: number;

  /**
   * Total duration in milliseconds (for playback)
   */
  totalDuration?: number;

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
 * Generate random waveform data for live recording
 */
export function generateRandomWaveform(count: number): number[] {
  return Array.from({ length: count }, () => Math.random() * 0.8 + 0.2);
}

/**
 * Normalize waveform data to 0-1 range
 */
export function normalizeWaveform(waveform: number[]): number[] {
  const max = Math.max(...waveform);
  if (max === 0) return waveform.map(() => 0);
  return waveform.map((v) => v / max);
}

/**
 * Resample waveform to desired number of bars
 */
export function resampleWaveform(waveform: number[], targetCount: number): number[] {
  if (waveform.length === 0) return Array(targetCount).fill(0);
  if (waveform.length === targetCount) return waveform;

  const result: number[] = [];
  const step = waveform.length / targetCount;

  for (let i = 0; i < targetCount; i++) {
    const start = Math.floor(i * step);
    const end = Math.floor((i + 1) * step);
    let sum = 0;
    let count = 0;

    for (let j = start; j < end && j < waveform.length; j++) {
      sum += waveform[j];
      count++;
    }

    result.push(count > 0 ? sum / count : 0);
  }

  return result;
}

/**
 * Format duration for display
 */
export function formatWaveformDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
