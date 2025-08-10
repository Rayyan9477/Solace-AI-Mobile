/**
 * Solace AI Mobile - shadcn UI Configuration for React Native
 * 
 * A comprehensive shadcn UI integration designed specifically for mental health applications.
 * This configuration extends the existing design system with shadcn patterns while maintaining
 * therapeutic color psychology and React Native compatibility.
 * 
 * Features:
 * - Therapeutic color schemes optimized for mental wellness
 * - Mobile-first responsive design patterns  
 * - WCAG 2.1 accessibility compliance
 * - Animation-ready component variants
 * - Cross-platform React Native compatibility
 */

import { BaseDesignTokens } from '../design-system/DesignTokens';

// shadcn UI Color System Extensions for Mental Health Apps
export const shadcnTherapeuticColors = {
  // Base semantic colors following shadcn patterns
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    muted: '#f1f5f9',
    subtle: '#e2e8f0',
    surface: '#ffffff',
    inverse: '#0f172a',
  },
  
  foreground: {
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#64748b',
    subtle: '#94a3b8',
    inverse: '#ffffff',
  },
  
  border: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
    muted: '#94a3b8',
    focus: '#3b82f6',
    error: '#ef4444',
    success: '#22c55e',
  },
  
  // Therapeutic primary colors (calming blues)
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe', 
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Default primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    foreground: '#ffffff',
  },
  
  // Therapeutic secondary colors (nurturing greens)
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0', 
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Default secondary
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    foreground: '#ffffff',
  },
  
  // Therapeutic accent colors (peaceful purples)
  accent: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc', 
    500: '#a855f7', // Default accent
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    foreground: '#ffffff',
  },
  
  // Status colors with therapeutic approach
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac', 
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    foreground: '#ffffff',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706', 
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    foreground: '#ffffff',
  },
  
  destructive: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    foreground: '#ffffff',
  },
  
  // Mental health specific color schemes
  therapeutic: {
    calming: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc', 
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      foreground: '#ffffff',
    },
    nurturing: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80', 
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      foreground: '#ffffff',
    },
    peaceful: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b', 
      900: '#0f172a',
      foreground: '#ffffff',
    },
    grounding: {
      50: '#faf5ff',
      100: '#f3e8ff', 
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      foreground: '#ffffff',
    },
    energizing: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c', 
      800: '#9a3412',
      900: '#7c2d12',
      foreground: '#ffffff',
    },
  },
  
  // Mood-specific colors
  mood: {
    happy: '#fbbf24',
    calm: '#22c55e', 
    anxious: '#f97316',
    sad: '#3b82f6',
    angry: '#ef4444',
    neutral: '#64748b',
    excited: '#a855f7',
    tired: '#6b7280',
    stressed: '#dc2626',
    content: '#059669',
  },
};

// shadcn Component Variants for Mental Health Apps
export const shadcnVariants = {
  // Button variants with therapeutic focus
  button: {
    // Primary variants
    primary: {
      default: {
        backgroundColor: 'primary.500',
        foregroundColor: 'primary.foreground',
        borderColor: 'primary.500',
        hover: {
          backgroundColor: 'primary.600',
        },
        focus: {
          backgroundColor: 'primary.600',
          borderColor: 'primary.700',
          shadowColor: 'primary.500',
        },
        active: {
          backgroundColor: 'primary.700',
        },
        disabled: {
          backgroundColor: 'primary.200',
          foregroundColor: 'primary.400',
        },
      },
      therapeutic: {
        backgroundColor: 'therapeutic.calming.500',
        foregroundColor: 'white',
        borderColor: 'therapeutic.calming.500',
        hover: {
          backgroundColor: 'therapeutic.calming.600',
        },
      },
    },
    
    // Secondary variants  
    secondary: {
      default: {
        backgroundColor: 'secondary.500',
        foregroundColor: 'secondary.foreground',
        borderColor: 'secondary.500',
        hover: {
          backgroundColor: 'secondary.600',
        },
      },
      nurturing: {
        backgroundColor: 'therapeutic.nurturing.500', 
        foregroundColor: 'white',
        borderColor: 'therapeutic.nurturing.500',
      },
    },
    
    // Outline variants
    outline: {
      default: {
        backgroundColor: 'transparent',
        foregroundColor: 'primary.500',
        borderColor: 'primary.500',
        hover: {
          backgroundColor: 'primary.50',
        },
      },
      therapeutic: {
        backgroundColor: 'transparent',
        foregroundColor: 'therapeutic.calming.500',
        borderColor: 'therapeutic.calming.500',
        hover: {
          backgroundColor: 'therapeutic.calming.50',
        },
      },
    },
    
    // Ghost variants
    ghost: {
      default: {
        backgroundColor: 'transparent', 
        foregroundColor: 'foreground.primary',
        borderColor: 'transparent',
        hover: {
          backgroundColor: 'background.muted',
        },
      },
      therapeutic: {
        backgroundColor: 'transparent',
        foregroundColor: 'therapeutic.calming.500',
        hover: {
          backgroundColor: 'therapeutic.calming.50',
        },
      },
    },
    
    // Destructive variants
    destructive: {
      default: {
        backgroundColor: 'destructive.500',
        foregroundColor: 'destructive.foreground',
        borderColor: 'destructive.500',
        hover: {
          backgroundColor: 'destructive.600',
        },
      },
    },
  },
  
  // Card variants with therapeutic styling
  card: {
    default: {
      backgroundColor: 'background.surface',
      borderColor: 'border.primary',
      borderRadius: 'lg',
      shadowColor: 'foreground.primary',
      shadowOpacity: 0.1,
    },
    elevated: {
      backgroundColor: 'background.surface',
      borderRadius: 'lg', 
      shadowColor: 'foreground.primary',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
      elevation: 6,
    },
    therapeutic: {
      backgroundColor: 'background.surface',
      borderColor: 'therapeutic.calming.200',
      borderRadius: 'xl',
      shadowColor: 'therapeutic.calming.500',
      shadowOpacity: 0.1,
    },
    mood: {
      backgroundColor: 'background.surface',
      borderRadius: 'xl',
      shadowOpacity: 0.1,
      // Dynamic border based on mood
    },
  },
  
  // Input variants with mental health focus
  input: {
    default: {
      backgroundColor: 'background.surface',
      borderColor: 'border.primary',
      foregroundColor: 'foreground.primary',
      placeholderColor: 'foreground.muted',
      borderRadius: 'md',
      focus: {
        borderColor: 'primary.500',
        shadowColor: 'primary.500',
        shadowOpacity: 0.2,
      },
    },
    therapeutic: {
      backgroundColor: 'therapeutic.calming.50',
      borderColor: 'therapeutic.calming.200',
      foregroundColor: 'foreground.primary',
      focus: {
        borderColor: 'therapeutic.calming.500',
        backgroundColor: 'background.surface',
      },
    },
  },
  
  // Badge variants
  badge: {
    default: {
      backgroundColor: 'primary.500',
      foregroundColor: 'primary.foreground',
      borderRadius: 'full',
    },
    secondary: {
      backgroundColor: 'secondary.500',
      foregroundColor: 'secondary.foreground',
    },
    outline: {
      backgroundColor: 'transparent',
      foregroundColor: 'primary.500', 
      borderColor: 'primary.500',
      borderWidth: 1,
    },
    therapeutic: {
      backgroundColor: 'therapeutic.calming.500',
      foregroundColor: 'white',
    },
    mood: {
      // Dynamic styling based on mood
      borderRadius: 'full',
    },
  },
  
  // Progress variants
  progress: {
    default: {
      backgroundColor: 'background.muted',
      foregroundColor: 'primary.500',
      borderRadius: 'full',
    },
    therapeutic: {
      backgroundColor: 'therapeutic.calming.100',
      foregroundColor: 'therapeutic.calming.500',
      borderRadius: 'full',
    },
  },
};

// Animation presets optimized for mental health apps
export const shadcnAnimations = {
  // Gentle, calming animations
  gentle: {
    duration: 300,
    easing: 'ease-out',
    scale: {
      enter: 0.95,
      exit: 1.05,
    },
    opacity: {
      enter: 0,
      exit: 1,
    },
  },
  
  // Soothing entrance animations
  soothing: {
    duration: 500,
    easing: 'ease-in-out',
    translate: {
      enter: { x: 0, y: 20 },
      exit: { x: 0, y: 0 },
    },
    opacity: {
      enter: 0,
      exit: 1,
    },
  },
  
  // Calming micro-interactions
  calm: {
    duration: 200,
    easing: 'ease-out',
    scale: {
      press: 0.98,
      release: 1,
    },
  },
  
  // Therapeutic focus animations
  focus: {
    duration: 250,
    easing: 'ease-in-out',
    glow: {
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
  },
};

// Therapeutic spacing system
export const shadcnSpacing = {
  // Based on 4px base unit for mobile optimization
  px: 1,
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44, // Minimum touch target
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
};

// Typography system optimized for mobile mental health apps
export const shadcnTypography = {
  sizes: {
    xs: { fontSize: 12, lineHeight: 16 },
    sm: { fontSize: 14, lineHeight: 20 },
    base: { fontSize: 16, lineHeight: 24 },
    lg: { fontSize: 18, lineHeight: 28 },
    xl: { fontSize: 20, lineHeight: 32 },
    '2xl': { fontSize: 24, lineHeight: 36 },
    '3xl': { fontSize: 30, lineHeight: 40 },
    '4xl': { fontSize: 36, lineHeight: 44 },
  },
  
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600', 
    bold: '700',
  },
  
  // Mental health optimized text variants
  variants: {
    heading: {
      fontWeight: '600',
      color: 'foreground.primary',
      letterSpacing: -0.5,
    },
    subheading: {
      fontWeight: '500',
      color: 'foreground.secondary',
    },
    body: {
      fontWeight: '400',
      color: 'foreground.primary',
      lineHeight: 1.6, // Enhanced readability
    },
    caption: {
      fontWeight: '400',
      color: 'foreground.muted',
      fontSize: 14,
    },
    therapeutic: {
      fontWeight: '500',
      color: 'therapeutic.calming.600',
      letterSpacing: 0.5,
    },
  },
};

// Border radius system
export const shadcnBorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Shadow system optimized for mobile
export const shadcnShadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Main shadcn configuration object
export const shadcnConfig = {
  colors: shadcnTherapeuticColors,
  variants: shadcnVariants,
  animations: shadcnAnimations,
  spacing: shadcnSpacing,
  typography: shadcnTypography,
  borderRadius: shadcnBorderRadius,
  shadows: shadcnShadows,
  
  // Accessibility configuration
  accessibility: {
    minimumTouchTarget: 44,
    focusRingWidth: 2,
    focusRingColor: '#3b82f6',
    contrastRatio: {
      normal: 4.5,
      large: 3.0,
    },
  },
  
  // Mental health specific configuration
  mentalHealth: {
    // Therapeutic color mappings
    moodColors: shadcnTherapeuticColors.mood,
    therapeuticSchemes: shadcnTherapeuticColors.therapeutic,
    
    // Calming animation presets
    calmingAnimations: {
      breathe: {
        duration: 4000,
        easing: 'ease-in-out',
        loop: true,
      },
      gentle: shadcnAnimations.gentle,
      soothing: shadcnAnimations.soothing,
    },
    
    // Content guidelines
    contentGuidelines: {
      maxCharactersPerLine: 65, // Optimal reading length
      preferredLineHeight: 1.6,
      recommendedFontSize: 16,
    },
  },
};

export default shadcnConfig;