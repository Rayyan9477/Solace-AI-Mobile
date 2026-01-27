/**
 * Dashboard Organisms
 * @description Barrel exports for dashboard organism components
 * @task Sprint 2.8-2.10: Track & Stats Organisms
 */

// ScoreCard
export { ScoreCard } from "./ScoreCard";
export type {
  ScoreCardProps,
  ScoreStatus,
  TrendDirection,
  ScoreCardSize,
} from "./ScoreCard.types";
export {
  STATUS_COLORS,
  SIZE_SPECS,
  getScoreStatus,
  getDefaultStatusLabel,
  getStatusColor,
  getTrendIcon,
  getTrendColor,
  calculateGaugeProgress,
} from "./ScoreCard.types";

// StatCard
export { StatCard } from "./StatCard";
export type { StatCardProps } from "./StatCard.types";
export { formatStatDate, calculateProgressPercentage } from "./StatCard.types";
