/**
 * Components Index (Backward Compatibility)
 *
 * @deprecated This file provides backward compatibility for legacy imports.
 * New code should import directly from the new organized structure:
 * - UI components: '../ui'
 * - Feature components: '../features/[feature]/components'
 * - App-level components: '../app'
 */

console.warn('Importing from src/components is deprecated. Please update imports to use the new structure.');

// Re-export from new UI structure
export * from "../ui";
export { default as UI } from "../ui";

// Re-export commonly used components with legacy names for compatibility
export {
  TherapeuticButton as Button,
  PrimaryButton,
  TherapeuticActionButton,
  CalmingButton,
  CrisisButton,
  SuccessButton,
  SecondaryButton,
  GhostButton,
  ButtonGroup,
} from "../ui/components/atoms/TherapeuticButton";

export {
  MentalHealthCard as Card,
  MoodCard,
  CrisisCard,
  TherapeuticCard,
  SuccessCard,
  InsightCard,
  CardGroup,
  ProgressCard,
} from "../ui/components/molecules/MentalHealthCard";

// Layout Components
export {
  Container as ResponsiveContainer,
  Grid as ResponsiveGrid,
  Container as DashboardLayout,
  Container as MoodTrackingLayout,
  Container as TherapySessionLayout,
} from "../ui/components/organisms/Layout";

// Animation Components
export * from "../ui/animations/components/TherapeuticAnimations";

// Accessibility Components
export * from "../shared/utils/emojiAccessibility";
export * from "../shared/utils/motionAccessibility";

// Dashboard Components (now in features)
export { default as MoodCheckIn } from "../features/dashboard/components/MoodCheckIn";
export { default as QuickActions } from "../features/dashboard/components/QuickActions";
export { default as WelcomeHeader } from "../features/dashboard/components/WelcomeHeader";
export { default as DailyInsights } from "../features/dashboard/components/DailyInsights";
export { default as ProgressOverview } from "../features/dashboard/components/ProgressOverview";
export { default as RecentActivity } from "../features/dashboard/components/RecentActivity";

// Icon System
export * from "../ui/assets/icons";

// Loading Screens
export { default as LoadingScreen } from "../ui/components/molecules/LoadingScreen";
export {
  TherapeuticLoadingScreen,
  CrisisLoadingScreen,
  MinimalLoadingScreen,
} from "../ui/components/molecules/LoadingScreen";

// Backward compatibility aliases
export { LoadingScreen as FixedLoadingScreen } from "../ui/components/molecules/LoadingScreen";
export { LoadingScreen as FixedSplashScreen } from "../ui/components/molecules/LoadingScreen";

// Default export for legacy usage
export default {
  // UI Components
  Button: TherapeuticButton,
  Card: MentalHealthCard,
  LoadingScreen,

  // Utility message
  _deprecationWarning: 'This default export is deprecated. Please import components directly from their new locations.',
};
