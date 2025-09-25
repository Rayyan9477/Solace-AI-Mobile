/**
 * Enhanced UI Components Index
 * Exports all Freud UI Kit components for easy import
 */

// Theme System
export { ThemeProvider } from "../../design-system/theme/ThemeProvider";
export { useTheme } from "../../design-system/theme/ThemeProvider";

// UI Components
export {
  Button,
  Card,
  TextInput,
  Typography,
} from "../../design-system/components";

// Enhanced Components
export {
  MentalHealthCard,
  MoodCard,
  CrisisCard,
  TherapeuticCard,
  SuccessCard,
  InsightCard,
  CardGroup,
  ProgressCard,
} from "./MentalHealthCard";

// Therapeutic Button System
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
} from "./TherapeuticButton";

// Loading Components
export { default as LoadingScreen } from "../../screens/LoadingScreen";
export {
  TherapeuticLoadingScreen,
  CrisisLoadingScreen,
  MinimalLoadingScreen,
} from "../../screens/LoadingScreen";

// Common UI Elements
export {
  Checkbox,
  Dropdown,
  FloatingActionButton,
  Modal,
  Slider,
  Table,
  Tag,
  Tooltip,
} from "./";

export default {
  ThemeProvider,
  MentalHealthCard,
  TherapeuticButton,
  LoadingScreen,
};
