/**
 * Consolidated Component Index
 * Single source of truth for all reusable components
 * Replaces redundant component exports across the app
 */

// Core UI Components (Enhanced with therapeutic design)
export { 
  TherapeuticButton as Button,
  PrimaryButton,
  TherapeuticActionButton,
  CalmingButton,
  CrisisButton,
  SuccessButton,
  SecondaryButton,
  GhostButton,
  ButtonGroup
} from './ui/TherapeuticButton';

export {
  MentalHealthCard as Card,
  MoodCard,
  CrisisCard,
  TherapeuticCard,
  SuccessCard,
  InsightCard,
  CardGroup,
  ProgressCard
} from './ui/MentalHealthCard';

// Layout Components
export {
  ResponsiveContainer,
  ResponsiveGrid,
  DashboardLayout,
  MoodTrackingLayout,
  TherapySessionLayout,
  useResponsiveLayout
} from './layout/ResponsiveLayout';

// Animation Components
export {
  TherapeuticAnimatedComponents,
  useTherapeuticPageTransition,
  therapeuticGestures
} from './animations/TherapeuticAnimations';

// Accessibility Components
export {
  AccessibleEmoji,
  MoodEmoji,
  WellnessTipEmoji,
  EmergencyEmoji,
  useEmojiAccessibility
} from '../utils/emojiAccessibility';

export {
  useMotionAccessibility,
  MentalHealthAnimations
} from '../utils/motionAccessibility';

// Dashboard Components
export { default as MoodCheckIn } from './dashboard/MoodCheckIn';
export { default as QuickActions } from './dashboard/QuickActions';
export { default as WelcomeHeader } from './dashboard/WelcomeHeader';
export { default as DailyInsights } from './dashboard/DailyInsights';
export { default as ProgressOverview } from './dashboard/ProgressOverview';
export { default as RecentActivity } from './dashboard/RecentActivity';

// Icon System
export {
  MentalHealthIcon,
  NavigationIcon,
  ActionIcon,
  StatusIcon,
  IconPresets
} from './icons';

// Common Components (consolidated)
export { default as LoadingScreen } from './LoadingScreen';

// Deprecated component mappings for backward compatibility
// TODO: Remove these after full migration
export { TherapeuticButton as AccessibleButton } from './ui/TherapeuticButton';
export { MentalHealthCard as FeatureCard } from './ui/MentalHealthCard';
export { LoadingScreen as FixedLoadingScreen } from './LoadingScreen';
export { LoadingScreen as FixedSplashScreen } from './LoadingScreen';