// Icon System - Main exports for Solace AI Mobile
export { default as Icon } from './IconSystem';
export { 
  IconVariants, 
  IconSizes, 
  MentalHealthIcons 
} from './IconSystem';

export { 
  default as ThemedIcon,
  AppIcons,
  NavigationIcon,
  MentalHealthIcon,
  ActionIcon,
  StatusIcon,
  BadgedIcon,
  AnimatedIcon
} from './AppIcons';

// Export all icon collections
export * from './AllIcons';
export * from './HealthTechIcons';
export * from './GeneralUIIcons';
export * from './ArrowsDirectionsIcons';
export * from './MentalHealthIcons';
export * from './NavigationInterfaceIcons';
export * from './DataVisualizationIcons';
export * from './AccessibilityCommunicationIcons';
export * from './NotificationStatusIcons';

// Icon presets for common use cases
export const IconPresets = {
  // Tab bar icons (24px, themed)
  tabBar: {
    size: 'md',
    variant: 'outline',
    strokeWidth: 2,
  },
  
  // Header icons (20px, muted)
  header: {
    size: 'sm',
    variant: 'outline',
    colorScheme: 'muted',
    strokeWidth: 2,
  },
  
  // Button icons (20px, inherit color)
  button: {
    size: 'sm',
    variant: 'outline',
    strokeWidth: 2,
  },
  
  // Card icons (32px, themed)
  card: {
    size: 'lg',
    variant: 'filled',
    strokeWidth: 1.5,
  },
  
  // Feature icons (48px, therapeutic colors)
  feature: {
    size: '2xl',
    variant: 'outline',
    colorScheme: 'calming',
    strokeWidth: 1.5,
  },
  
  // Status icons (16px, semantic colors)
  status: {
    size: 'xs',
    variant: 'filled',
    strokeWidth: 2,
  },
};

// Utility functions for icon management
export const getIconColor = (theme, colorScheme = 'default') => {
  const colorMap = {
    default: theme.colors.text.primary,
    primary: theme.colors.primary[500],
    secondary: theme.colors.secondary[500],
    success: theme.colors.success[500],
    warning: theme.colors.warning[500],
    error: theme.colors.error[500],
    muted: theme.colors.text.secondary,
    inverse: theme.colors.text.inverse,
    calming: theme.colors.therapeutic.calming[500],
    nurturing: theme.colors.therapeutic.nurturing[500],
    peaceful: theme.colors.therapeutic.peaceful[500],
    grounding: theme.colors.therapeutic.grounding[500],
    energizing: theme.colors.therapeutic.energizing[500],
  };
  
  return colorMap[colorScheme] || colorMap.default;
};

export const getIconSize = (size) => {
  const sizeMap = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    '2xl': 48,
    '3xl': 56,
    '4xl': 64,
  };
  
  return typeof size === 'number' ? size : sizeMap[size] || sizeMap.md;
};