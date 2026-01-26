/**
 * MessageInput Types
 * @description Type definitions for the MessageInput component
 * @task Task 2.7.3: MessageInput Component
 */

import type { StyleProp, ViewStyle, TextStyle } from "react-native";
import type { ReactNode } from "react";

/**
 * Input mode
 */
export type InputMode = "text" | "voice";

/**
 * Voice recording state
 */
export type VoiceRecordingState =
  | "idle"
  | "recording"
  | "paused"
  | "processing";

/**
 * Attachment type for the input
 */
export interface InputAttachment {
  id: string;
  type: "image" | "video" | "audio" | "file";
  uri: string;
  name?: string;
  size?: number;
  mimeType?: string;
}

/**
 * Voice recording data
 */
export interface VoiceRecording {
  uri: string;
  duration: number;
  waveform?: number[];
}

/**
 * MessageInput Props
 */
export interface MessageInputProps {
  /**
   * Current input text value
   */
  value?: string;

  /**
   * Callback when text changes
   */
  onChangeText?: (text: string) => void;

  /**
   * Callback when send button is pressed
   */
  onSend?: (message: string, attachments?: InputAttachment[]) => void;

  /**
   * Callback when attachment button is pressed
   */
  onAttachmentPress?: () => void;

  /**
   * Callback when voice button is pressed
   */
  onVoicePress?: () => void;

  /**
   * Callback when voice recording starts
   */
  onVoiceRecordStart?: () => void;

  /**
   * Callback when voice recording stops
   */
  onVoiceRecordStop?: (recording: VoiceRecording) => void;

  /**
   * Callback when voice recording is cancelled
   */
  onVoiceRecordCancel?: () => void;

  /**
   * Placeholder text
   * @default "Type to start chatting..."
   */
  placeholder?: string;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to show attachment button
   * @default true
   */
  showAttachment?: boolean;

  /**
   * Whether to show voice button
   * @default true
   */
  showVoice?: boolean;

  /**
   * Current attachments
   */
  attachments?: InputAttachment[];

  /**
   * Callback when attachment is removed
   */
  onRemoveAttachment?: (id: string) => void;

  /**
   * Maximum message length
   */
  maxLength?: number;

  /**
   * Whether the input is in multiline mode
   * @default true
   */
  multiline?: boolean;

  /**
   * Maximum number of lines in multiline mode
   * @default 5
   */
  maxLines?: number;

  /**
   * Current voice recording state
   * @default "idle"
   */
  voiceRecordingState?: VoiceRecordingState;

  /**
   * Voice recording duration in milliseconds
   */
  voiceRecordingDuration?: number;

  /**
   * Voice waveform data for visualization
   */
  voiceWaveform?: number[];

  /**
   * Left addon component (replaces attachment button)
   */
  leftAddon?: ReactNode;

  /**
   * Right addon component (replaces voice button)
   */
  rightAddon?: ReactNode;

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

  /**
   * Input style
   */
  inputStyle?: StyleProp<TextStyle>;
}

/**
 * Format voice recording duration
 */
export function formatDuration(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Check if message can be sent
 */
export function canSendMessage(
  text: string,
  attachments?: InputAttachment[],
): boolean {
  const hasText = text.trim().length > 0;
  const hasAttachments = Boolean(attachments && attachments.length > 0);
  return hasText || hasAttachments;
}
