/**
 * ChatBubble Types
 * @description Type definitions for the ChatBubble component
 * @task Task 2.7.1: ChatBubble Component
 */

import type { StyleProp, ViewStyle } from "react-native";
import type { ReactNode } from "react";

/**
 * Message sender type
 */
export type MessageSender = "user" | "ai";

/**
 * Message status
 */
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "error";

/**
 * Emotion detection result
 */
export interface EmotionDetection {
  emotions: string[];
  sentiment: "positive" | "negative" | "neutral" | "crisis";
  color?: string;
}

/**
 * Message reaction
 */
export interface MessageReaction {
  emoji: string;
  count: number;
  isSelected?: boolean;
}

/**
 * Attachment in a message
 */
export interface MessageAttachment {
  id: string;
  type: "image" | "video" | "audio" | "file" | "book" | "resource";
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

/**
 * ChatBubble Props
 */
export interface ChatBubbleProps {
  /**
   * Message content text
   */
  message: string;

  /**
   * Who sent the message
   */
  sender: MessageSender;

  /**
   * Message timestamp
   */
  timestamp?: Date;

  /**
   * Message delivery status
   */
  status?: MessageStatus;

  /**
   * Avatar image URL
   */
  avatar?: string;

  /**
   * Sender's name (for AI messages)
   */
  senderName?: string;

  /**
   * Whether to show avatar
   * @default true
   */
  showAvatar?: boolean;

  /**
   * Whether to show timestamp
   * @default true
   */
  showTimestamp?: boolean;

  /**
   * Whether this is a sequential message from same sender
   * (hides avatar and adjusts spacing)
   * @default false
   */
  isSequential?: boolean;

  /**
   * Detected emotion for this message
   */
  emotion?: EmotionDetection;

  /**
   * Message reactions
   */
  reactions?: MessageReaction[];

  /**
   * Message attachments
   */
  attachments?: MessageAttachment[];

  /**
   * Custom content to render inside bubble
   */
  children?: ReactNode;

  /**
   * Callback when bubble is long pressed
   */
  onLongPress?: () => void;

  /**
   * Callback when reaction is pressed
   */
  onReactionPress?: (emoji: string) => void;

  /**
   * Callback when attachment is pressed
   */
  onAttachmentPress?: (attachment: MessageAttachment) => void;

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
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

/**
 * Get status icon based on message status
 */
export function getStatusIcon(status: MessageStatus): string {
  switch (status) {
    case "sending":
      return "clock";
    case "sent":
      return "check";
    case "delivered":
      return "check-all";
    case "read":
      return "check-all";
    case "error":
      return "alert-circle";
    default:
      return "";
  }
}

/**
 * Get emotion badge color
 */
export function getEmotionColor(
  sentiment: EmotionDetection["sentiment"],
): string {
  switch (sentiment) {
    case "positive":
      return "#9AAD5C"; // Olive green
    case "negative":
      return "#E8853A"; // Orange
    case "neutral":
      return "#94A3B8"; // Gray
    case "crisis":
      return "#EF4444"; // Red
    default:
      return "#94A3B8";
  }
}
