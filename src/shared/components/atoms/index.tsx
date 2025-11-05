/**
 * Atoms Index
 * Exports for atomic UI components - the basic building blocks
 */

// Basic UI Elements
// Buttons
export { default as TherapeuticButton } from "./TherapeuticButton";
// Avoid duplicate named exports; only export unique non-defaults if needed
export {
  PrimaryButton,
  SecondaryButton,
  GhostButton,
  CrisisButton,
  SuccessButton,
  CalmingButton,
  TherapeuticActionButton,
  ButtonGroup,
} from "./TherapeuticButton";

export { default as Checkbox } from "./Checkbox";
export { default as DarkModeToggle } from "./DarkModeToggle";
export { default as FloatingActionButton } from "./FloatingActionButton";
export { default as Slider } from "./Slider";
export { default as Tag } from "./Tag";
export { default as Tooltip } from "./Tooltip";

// Layout & Structure
export { default as ErrorBoundary } from "./ErrorBoundary";
export { default as FeatureCard } from "./FeatureCard";
export { default as GradientBackground } from "./GradientBackground";
export { default as LogoDisplay } from "./LogoDisplay";
export { default as ProgressIndicator } from "./ProgressIndicator";
export { default as SafeScreen } from "./SafeScreen";

// Form Elements
export * from "./forms";

// Accessibility
export * from "./accessibility";

// Re-export design system atoms that exist
export {
  Button,
  Card,
  TextInput,
  Typography,
} from "../../../design-system/components/atoms";

// Default export
export default {
  TherapeuticButton,
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
};
