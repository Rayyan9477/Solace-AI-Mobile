/**
 * StatCard Component Types
 * @description Dashboard stat card with date, title, description, and circular progress
 * @task Task 2.10.3: StatCard Component
 */

import type { ViewStyle } from "react-native";

export interface StatCardProps {
  id: string;
  date: Date;
  title: string;
  description: string;
  score: number;
  maxScore?: number;
  progressColor: string;
  onPress?: (id: string) => void;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export function formatStatDate(date: Date): string {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month}\n${day}`;
}

export function calculateProgressPercentage(score: number, maxScore: number = 100): number {
  if (maxScore === 0) return 0;
  return Math.min((score / maxScore) * 100, 100);
}
