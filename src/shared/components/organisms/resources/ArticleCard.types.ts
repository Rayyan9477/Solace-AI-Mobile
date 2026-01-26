/**
 * ArticleCard Component Types
 * @description Article preview card with image, category, and metrics
 * @task Task 2.9.3: ArticleCard Component
 */

import type { ViewStyle } from "react-native";

export interface ArticleCardProps {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  imageUrl: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  onPress?: (id: string) => void;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}
