/**
 * Molecules Index
 * Exports for molecular UI components - simple combinations of atoms
 */

// Card Components
export { default as MentalHealthCard } from "./MentalHealthCard";
// Export unique named variants only (avoid duplicating default name)
export {
  MoodCard,
  CrisisCard,
  TherapeuticCard,
  SuccessCard,
  InsightCard,
  CardGroup,
  ProgressCard,
} from "./MentalHealthCard";

// Screen Components
export { default as LoadingScreen } from "./LoadingScreen";
export {
  TherapeuticLoadingScreen,
  CrisisLoadingScreen,
  MinimalLoadingScreen,
} from "./LoadingScreen";

export { default as SplashScreen } from "./SplashScreen";

// Form & Input Components
export { default as Dropdown } from "./Dropdown";
export { default as Modal } from "./Modal";

// Data Display
export { default as Table } from "./Table";

// Default export
export default {
  // Cards
  MentalHealthCard,
  MoodCard,
  CrisisCard,
  TherapeuticCard,
  SuccessCard,
  InsightCard,
  CardGroup,
  ProgressCard,

  // Screens
  LoadingScreen,
  TherapeuticLoadingScreen,
  CrisisLoadingScreen,
  MinimalLoadingScreen,
  SplashScreen,

  // Interactive
  Dropdown,
  Modal,
  Table,
};
