/**
 * UI System Index
 * Main entry point for the Solace AI Mobile UI system
 * Exports all components, themes, animations, and utilities
 */

// Theme System
export { default as ThemeProvider } from './theme/ThemeProvider';
export { useTheme } from './theme/ThemeProvider';
export { lightTheme, darkTheme, therapeuticColors } from './theme/MaterialTheme';

// Components - Atomic Design Structure
export * from './components';
export { default as UIComponents } from './components';

// Atoms
export {
  TherapeuticButton,
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  CrisisButton,
  SuccessButton,
  CalmingButton,
  TherapeuticActionButton,
  ButtonGroup,
  Checkbox,
  DarkModeToggle,
  FloatingActionButton,
  Slider,
  Tag,
  Tooltip,
  ErrorBoundary,
  FeatureCard,
  GradientBackground,
  LogoDisplay,
  ProgressIndicator,
  SafeScreen,
} from './components/atoms';

// Molecules
export {
  MentalHealthCard,
  MoodCard,
  CrisisCard,
  TherapeuticCard,
  SuccessCard,
  InsightCard,
  CardGroup,
  ProgressCard,
  LoadingScreen,
  TherapeuticLoadingScreen,
  CrisisLoadingScreen,
  MinimalLoadingScreen,
  SplashScreen,
  Dropdown,
  Modal,
  Table,
} from './components/molecules';

// Organisms
export {
  Container,
  Section,
  Grid,
  Spacer,
} from './components/organisms/Layout';

// Animations
export * from './animations';
export { default as Animations } from './animations';

// Assets
export * from './assets/icons';

// Type definitions
export * from './types';

// Utility functions for UI
export const getTherapeuticColors = (mode = 'light') => {
  return mode === 'dark' ? darkTheme.colors : lightTheme.colors;
};

export const getResponsiveSize = (baseSize, scaleFactor = 1) => {
  return baseSize * scaleFactor;
};

export const createTherapeuticGradient = (colorName = 'serenityGreen', isDark = false) => {
  const colors = therapeuticColors[colorName];
  if (!colors) return ['#E5EAD7', '#F2F5EB'];

  return isDark
    ? [colors[90], colors[80], colors[70]]
    : [colors[10], colors[20], colors[30]];
};

// Main UI System Export
const SolaceUI = {
  // Theme
  ThemeProvider,
  useTheme,
  lightTheme,
  darkTheme,
  therapeuticColors,

  // Components
  TherapeuticButton,
  MentalHealthCard,
  LoadingScreen,
  Container,
  ErrorBoundary,

  // Utils
  getTherapeuticColors,
  getResponsiveSize,
  createTherapeuticGradient,
};

export default SolaceUI;
