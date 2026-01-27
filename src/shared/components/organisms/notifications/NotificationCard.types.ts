/**
 * NotificationCard Component Types
 * @description Notification card with icon, title, description, and metadata
 * @task Task 2.10.1: NotificationCard Component
 */

import type { ReactNode } from "react";
import type { ViewStyle } from "react-native";

export type NotificationType = "message" | "journal" | "exercise" | "health" | "mood" | "stress" | "recommendation";

export interface NotificationCardProps {
  id: string;
  type: NotificationType;
  icon: ReactNode;
  iconColor: string;
  title: string;
  description: string;
  timestamp: Date;
  badge?: string;
  isRead?: boolean;
  onPress?: (id: string) => void;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "1w ago";
  return `${diffWeeks}w ago`;
}

export function getNotificationSection(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 24) return "Earlier This Day";
  if (diffHours < 168) return "Last Week";
  return "Earlier";
}
