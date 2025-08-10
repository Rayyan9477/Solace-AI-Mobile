/**
 * Solace AI Mobile - shadcn UI Components Index
 * 
 * Export all shadcn UI components for easy importing throughout the app.
 * This provides a clean API for accessing the therapeutic-focused component library.
 */

// Core UI Components
export { default as ShadcnButton } from './Button';
export {
  PrimaryButton,
  SecondaryButton,
  OutlineButton,
  GhostButton,
  DestructiveButton,
  CalmingButton,
  NurturingButton,
  PeacefulButton,
  GroundingButton,
  EnergizingButton,
  MoodButton,
} from './Button';

export { default as ShadcnCard } from './Card';
export {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  MoodCard,
  TherapeuticCard,
  InteractiveCard,
  WellnessCard,
  ProgressCard,
  InsightCard,
} from './Card';

// Specialized Mental Health Components
export { default as ShadcnMoodCheckIn } from './MoodCheckIn';
export {
  QuickMoodCheckIn,
  DetailedMoodCheckIn,
  SimpleMoodCheckIn,
} from './MoodCheckIn';

export { default as ShadcnChatBubble } from './ChatBubble';
export {
  UserChatBubble,
  AIChatBubble,
  SystemChatBubble,
  TherapeuticChatBubble,
  TypingChatBubble,
} from './ChatBubble';

export { default as ShadcnQuickActions } from './QuickActions';
export {
  MoodBasedQuickActions,
  CompactQuickActions,
  ScrollableQuickActions,
  TherapeuticQuickActions,
} from './QuickActions';

// Configuration and utilities
export { shadcnConfig } from '../config';
export {
  colorUtils,
  styleUtils,
  animationUtils,
  accessibilityUtils,
  platformUtils,
  themeUtils,
} from '../utils';