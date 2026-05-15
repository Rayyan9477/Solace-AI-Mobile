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
  SIZE_SPECS,
  getScoreStatus,
  getDefaultStatusLabel,
  getTrendIcon,
  getTrendColor,
  calculateGaugeProgress,
} from "./ScoreCard.types";

// StatCard
export { StatCard } from "./StatCard";
export type { StatCardProps } from "./StatCard.types";
export { formatStatDate, calculateProgressPercentage } from "./StatCard.types";

// ScoreCardV2
export { ScoreCardV2 } from "./ScoreCardV2";
export type { ScoreCardV2Props } from "./ScoreCardV2";

// MetricGrid
export { MetricGrid } from "./MetricGrid";
export type { MetricGridProps, MetricTile } from "./MetricGrid";

// ContinueCard
export { ContinueCard } from "./ContinueCard";
export type { ContinueCardProps } from "./ContinueCard";

// ArticleCardV2
export { ArticleCardV2 } from "./ArticleCardV2";
export type { ArticleCardV2Props, ArticleThumbnailGradient } from "./ArticleCardV2";
