/**
 * PostCard Component Types
 * @description Community post card with author, content, and engagement
 * @task Task 2.9.4: PostCard Component
 */

import type { ViewStyle } from "react-native";

export interface PostAuthor {
  username: string;
  avatar: string;
  badge: string;
  isVerified: boolean;
}

export interface PostCardProps {
  id: string;
  author: PostAuthor;
  content: string;
  timestamp: Date;
  imageUrl?: string;
  viewCount: number;
  likeCount: number;
  isLiked?: boolean;
  onPress?: (id: string) => void;
  onLikePress?: (id: string) => void;
  onSharePress?: (id: string) => void;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}
