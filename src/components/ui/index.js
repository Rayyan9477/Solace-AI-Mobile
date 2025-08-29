// Core UI Components for Solace AI Mobile
// Complete Freud Design System Implementation
// Based on therapeutic color psychology and mental health UX patterns

// Form Components
export { default as Button, ButtonGroup, TherapeuticButton, CalmingButton, NurturingButton, PeacefulButton, GroundingButton, EnergizingButton } from './Button';
export { default as Input, FloatingLabelInput, FilledInput, OutlineInput, UnderlineInput, TherapeuticInput, CalmingInput, NurturingInput, PasswordInput, EmailInput, PhoneInput, SearchInput } from './Input';
export { default as Checkbox } from './Checkbox';
export { default as Dropdown } from './Dropdown';
export { default as Slider, RangeSlider, CalmingSlider, NurturingSlider, PeacefulSlider, GroundingSlider } from './Slider';

// Display Components
export { default as Card, CardHeader, CardFooter, JournalCard, ProgressCard, TherapeuticCard, MindfulCard, EmpathyCard, GlassMorphCard, InteractiveCard, CardGroup } from './Card';
export { default as Tag, TagGroup, TherapeuticTag, CalmingTag, NurturingTag, PeacefulTag, GroundingTag, EnergizingTag } from './Tag';
export { default as Table, TableCell, TableHeader, TableRow } from './Table';
export { default as Tooltip } from './Tooltip';
export { default as MentalHealthScoreWidget, CompactMentalHealthScoreWidget, DetailedMentalHealthScoreWidget, MinimalMentalHealthScoreWidget } from './MentalHealthScoreWidget';

// Overlay Components
export { default as Modal, ModalHeader, ModalFooter, ConfirmModal, InfoModal } from './Modal';

// Enhanced Components
export { default as SimpleCard } from './SimpleCard';
export { default as FreudHeader } from './FreudHeader';

// Advanced Animation Components
export {
  TherapeuticBreathingAnimation,
  FloatingActionButton,
  StaggeredListAnimation,
  MorphingCard,
  ParallaxBackground,
  MentalHealthLottie,
  TherapeuticWave,
  MicroInteractionButton,
} from '../animations/AdvancedAnimations';

// Shader and Background Effects
export {
  TherapeuticGradient,
  GlassmorphismContainer,
  FloatingParticles,
  OrganicBlobBackground,
  NeuralNetworkBackground,
  RippleEffectBackground,
} from '../shaders/PageShaders';

// Design System Utilities
export const UIComponents = {
  // Form Controls
  Button,
  ButtonGroup,
  Input,
  Checkbox,
  Dropdown,
  Slider,
  RangeSlider,
  
  // Display Components
  Card,
  CardHeader,
  CardFooter,
  Tag,
  TagGroup,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Tooltip,
  MentalHealthScoreWidget,
  CompactMentalHealthScoreWidget,
  DetailedMentalHealthScoreWidget,
  MinimalMentalHealthScoreWidget,
  
  // Overlay Components
  Modal,
  ModalHeader,
  ModalFooter,
  
  // Therapeutic Variants
  TherapeuticButton,
  CalmingButton,
  NurturingButton,
  PeacefulButton,
  GroundingButton,
  EnergizingButton,
  
  TherapeuticInput,
  CalmingInput,
  NurturingInput,
  
  TherapeuticTag,
  CalmingTag,
  NurturingTag,
  PeacefulTag,
  GroundingTag,
  EnergizingTag,
  
  CalmingSlider,
  NurturingSlider,
  PeacefulSlider,
  GroundingSlider,
  
  // Specialized Components
  JournalCard,
  ProgressCard,
  ConfirmModal,
  InfoModal,
  FloatingLabelInput,
  FilledInput,
  OutlineInput,
  UnderlineInput,
  PasswordInput,
  EmailInput,
  PhoneInput,
  SearchInput,
};

// Design System Re-exports
export { default as FreudDesignSystem, FreudColors, FreudTypography, FreudSpacing, FreudBorderRadius, FreudShadows, FreudComponents, FreudAnimations, FreudThemes } from '../../shared/theme/FreudDesignSystem';
export { FreudColorPalette, LightTheme, DarkTheme, getTherapeuticColor, getSemanticColor } from '../../shared/theme/ColorPalette';

// Icon System
export { MentalHealthIcon, NavigationIcon, ActionIcon, StatusIcon } from '../icons';

export default UIComponents;