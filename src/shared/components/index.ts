/**
 * Shared Components - Central export for all reusable components
 * Makes importing components easier and maintains consistency
 */

// Core Components
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export {
  Typography,
  Display,
  H1,
  H2,
  H3,
  H4,
  Body,
  BodyLarge,
  BodySmall,
  Caption,
  Overline,
  Label,
  LabelLarge,
  LabelSmall,
} from './Typography';
export type { TypographyProps } from './Typography';

// Animated Components
export {
  AnimatedFadeIn,
  AnimatedScaleIn,
  AnimatedSlideIn,
  AnimatedListItem,
} from './AnimatedComponents';

// Empty States
export {
  EmptyState,
  EmptyJournal,
  EmptyMood,
  EmptyChat,
  EmptyMindfulness,
  EmptyCommunity,
  EmptySearch,
  EmptyNotifications,
  OfflineState,
  ErrorState,
  LoadingState,
} from './EmptyState';
export type { EmptyStateProps } from './EmptyState';
