/**
 * UI Components Index
 * Centralized exports for all UI components following atomic design principles
 */

// Atoms - Basic building blocks
export { default as TherapeuticButton } from './atoms/TherapeuticButton';
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
} from './atoms/TherapeuticButton';

export { default as Checkbox } from './atoms/Checkbox';
export { default as DarkModeToggle } from './atoms/DarkModeToggle';
export { default as FloatingActionButton } from './atoms/FloatingActionButton';
export { default as Slider } from './atoms/Slider';
export { default as Tag } from './atoms/Tag';
export { default as Tooltip } from './atoms/Tooltip';
export { default as ErrorBoundary } from './atoms/ErrorBoundary';
export { default as FeatureCard } from './atoms/FeatureCard';
export { default as GradientBackground } from './atoms/GradientBackground';
export { default as LogoDisplay } from './atoms/LogoDisplay';
export { default as ProgressIndicator } from './atoms/ProgressIndicator';
export { default as SafeScreen } from './atoms/SafeScreen';

// Molecules - Simple combinations
export { default as MentalHealthCard } from './molecules/MentalHealthCard';
export {
  MentalHealthCard,
  MoodCard,
  CrisisCard,
  TherapeuticCard,
  SuccessCard,
  InsightCard,
  CardGroup,
  ProgressCard,
} from './molecules/MentalHealthCard';

export { default as LoadingScreen } from './molecules/LoadingScreen';
export {
  LoadingScreen,
  TherapeuticLoadingScreen,
  CrisisLoadingScreen,
  MinimalLoadingScreen,
} from './molecules/LoadingScreen';

export { default as SplashScreen } from './molecules/SplashScreen';
export { default as Dropdown } from './molecules/Dropdown';
export { default as Modal } from './molecules/Modal';
export { default as Table } from './molecules/Table';

// Organisms - Complex components
export { default as Layout } from './organisms/Layout';
export {
  Container,
  Section,
  Grid,
  Spacer,
} from '../components/organisms/Layout';

// Re-export design system components
export {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextInput,
  SearchInput,
  TextArea,
  Typography,
  Heading,
  Body,
  Label,
  TherapeuticText,
} from './atoms/index';

export {
  Avatar,
  Badge,
  Chip,
  Dialog,
  Divider,
  FAB,
  IconButton,
  List,
  Menu,
  Portal,
  ProgressBar,
  RadioButton,
  Searchbar,
  SegmentedButtons,
  Snackbar,
  Surface,
  Switch,
} from 'react-native-paper';

// Default export - commonly used components
export default {
  // Atoms
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

  // Molecules
  MentalHealthCard,
  LoadingScreen,
  SplashScreen,
  Dropdown,
  Modal,
  Table,

  // Organisms
  Layout,
  Container,
  Section,
  Grid,
  Spacer,
};
