// Enhanced Design System Components Export
// Comprehensive mental health focused UI component library

// Button Components
export { default as EnhancedButton } from './Button/EnhancedButton';

// Card Components  
export { default as EnhancedCard } from './Card/EnhancedCard';

// Input Components
export { default as EnhancedInput } from './Input/EnhancedInput';

// Layout Components
export {
  Spacing,
  Container,
  Grid,
  Stack,
  Flex,
  Divider,
  Center,
  Responsive,
} from './Layout/LayoutUtilities';

// Logo and Branding Components
export {
  SolaceLogo,
  BrandText,
  BrandHeader,
  AppIcon,
} from './Logo/BrandingComponents';

// Tab Components
export { default as TabComponent } from './Tabs/TabComponent';

// Table Components
export { default as SimpleTable } from './Table/SimpleTable';

// Typography Components
export {
  Typography,
  Heading,
  Subtitle,
  Body,
  Caption,
  Overline,
  ButtonText,
  TherapeuticText,
  MindfulText,
  Quote,
} from './Typography/TypographySystem';

// Design System Re-exports
export { 
  BaseDesignTokens,
  PredefinedThemes,
  ComponentVariants,
  TherapeuticComponents,
  AccessibilityTokens,
  DesignSystemManager,
} from '../../design-system/DesignTokens';

// Component Collections for Easy Access
export const Buttons = {
  Enhanced: EnhancedButton,
};

export const Cards = {
  Enhanced: EnhancedCard,
};

export const Inputs = {
  Enhanced: EnhancedInput,
};

export const Layout = {
  Spacing,
  Container,
  Grid,
  Stack,
  Flex,
  Divider,
  Center,
  Responsive,
};

export const Branding = {
  Logo: SolaceLogo,
  Text: BrandText,
  Header: BrandHeader,
  AppIcon,
};

export const Navigation = {
  Tabs: TabComponent,
};

export const Data = {
  Table: SimpleTable,
};

export const Text = {
  Typography,
  Heading,
  Subtitle,
  Body,
  Caption,
  Overline,
  ButtonText,
  TherapeuticText,
  MindfulText,
  Quote,
};

// Therapeutic Theme Constants
export const THERAPEUTIC_THEMES = [
  'calming',
  'nurturing', 
  'peaceful',
  'grounding',
  'energizing',
  'focus',
  'mindful',
  'balance',
];

// Component Size Constants
export const COMPONENT_SIZES = [
  'xs',
  'sm', 
  'md',
  'medium',
  'lg',
  'xl',
  '2xl',
  '3xl',
];

// Animation Types
export const ANIMATION_TYPES = [
  'scale',
  'opacity',
  'slide',
  'fade',
  'bounce',
  'pulse',
  'none',
];

// Accessibility Helpers
export const ACCESSIBILITY_ROLES = [
  'button',
  'text',
  'heading',
  'link',
  'image',
  'tab',
  'tablist',
  'columnheader',
  'cell',
];

// Default Export - Most Commonly Used Components
export default {
  // Core Components
  Button: EnhancedButton,
  Card: EnhancedCard,
  Input: EnhancedInput,
  
  // Layout
  Container,
  Stack,
  Grid,
  Spacing,
  
  // Typography  
  Typography,
  Heading,
  TherapeuticText,
  
  // Navigation
  Tabs: TabComponent,
  
  // Branding
  Logo: SolaceLogo,
  BrandHeader,
  
  // Design Tokens
  Tokens: BaseDesignTokens,
  Themes: PredefinedThemes,
};