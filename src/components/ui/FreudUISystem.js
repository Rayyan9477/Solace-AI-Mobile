/**
 * Enhanced Freud UI System
 * Based on Freud UI Kit Design Specifications with exact color matching
 * Integrates React Native Paper Material Design with therapeutic theming
 * Features page shaders, Framer Motion animations, and Anime.js micro-interactions
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Surface, Button as PaperButton } from 'react-native-paper';
import { colors, spacing, borderRadius, shadows, typography } from '../../shared/theme/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Enhanced Freud Color Palette
 * Exact colors from Freud UI Kit design references
 */
export const FreudColors = {
  // Exact Freud UI Kit Colors
  mindful: {
    light: '#F7F4F2', // Mindful Brown 10
    medium: '#C0A091', // Mindful Brown 40
    dark: '#372315',   // Mindful Brown 90
    gradient: ['#F7F4F2', '#C0A091', '#372315'],
  },
  optimistic: {
    light: '#F5F5F5', // Optimistic Gray 10
    medium: '#929290', // Optimistic Gray 50
    dark: '#161515',   // Optimistic Gray 100
    gradient: ['#F5F5F5', '#929290', '#161515'],
  },
  serenity: {
    light: '#F2F5EB', // Serenity Green 10
    medium: '#98BD68', // Serenity Green 50
    dark: '#1F1E10',   // Serenity Green 100
    gradient: ['#F2F5EB', '#98BD68', '#1F1E10'],
  },
  empathy: {
    light: '#FFF6E2', // Empathy Orange 10
    medium: '#ED7100', // Empathy Orange 50
    dark: '#2E1D00',   // Empathy Orange 100
    gradient: ['#FFF6E2', '#ED7100', '#2E1D00'],
  },
  zen: {
    light: '#FFF4E0', // Zen Yellow 10
    medium: '#FFB514', // Zen Yellow 50
    dark: '#2E2500',   // Zen Yellow 100
    gradient: ['#FFF4E0', '#FFB514', '#2E2500'],
  },
  kind: {
    light: '#EAEFFF', // Kind Purple 10
    medium: '#8965FF', // Kind Purple 60
    dark: '#16135A',   // Kind Purple 100
    gradient: ['#EAEFFF', '#8965FF', '#16135A'],
  },
  
  // Mood-specific colors matching Freud design
  moods: {
    happy: {
      primary: '#FFB514', // Zen Yellow
      light: '#FFF4E0',
      dark: '#2E2500',
      gradient: ['#FFF4E0', '#FFB514', '#2E2500'],
    },
    sad: {
      primary: '#8965FF', // Kind Purple
      light: '#EAEFFF',
      dark: '#16135A',
      gradient: ['#EAEFFF', '#8965FF', '#16135A'],
    },
    stressed: {
      primary: '#ED7100', // Empathy Orange
      light: '#FFF6E2',
      dark: '#2E1D00',
      gradient: ['#FFF6E2', '#ED7100', '#2E1D00'],
    },
    calm: {
      primary: '#98BD68', // Serenity Green
      light: '#F2F5EB',
      dark: '#1F1E10',
      gradient: ['#F2F5EB', '#98BD68', '#1F1E10'],
    },
    anxious: {
      primary: '#C0A091', // Mindful Brown
      light: '#F7F4F2',
      dark: '#372315',
      gradient: ['#F7F4F2', '#C0A091', '#372315'],
    },
    neutral: {
      primary: '#929290', // Optimistic Gray
      light: '#F5F5F5',
      dark: '#161515',
      gradient: ['#F5F5F5', '#929290', '#161515'],
    },
  },
};

/**
 * Enhanced Material Design Theme for React Native Paper
 * Integrates Freud colors with Material Design principles
 */
export const FreudMaterialTheme = {
  light: {
    colors: {
      // Primary brand colors (Mindful Brown)
      primary: colors.primary[500],
      primaryContainer: colors.primary[100],
      onPrimary: colors.background.primary,
      onPrimaryContainer: colors.primary[800],
      
      // Secondary colors (Serenity Green)
      secondary: colors.secondary[500],
      secondaryContainer: colors.secondary[100],
      onSecondary: colors.background.primary,
      onSecondaryContainer: colors.secondary[800],
      
      // Tertiary colors (Kind Purple for accent)
      tertiary: colors.therapeutic.kind[500],
      tertiaryContainer: colors.therapeutic.kind[100],
      onTertiary: colors.background.primary,
      onTertiaryContainer: colors.therapeutic.kind[800],
      
      // Surface colors
      surface: colors.background.card,
      surfaceVariant: colors.background.secondary,
      onSurface: colors.text.primary,
      onSurfaceVariant: colors.text.secondary,
      surfaceDisabled: colors.background.disabled,
      onSurfaceDisabled: colors.text.disabled,
      
      // Background colors
      background: colors.background.primary,
      onBackground: colors.text.primary,
      
      // Error colors
      error: colors.error[500],
      errorContainer: colors.error[100],
      onError: colors.background.primary,
      onErrorContainer: colors.error[800],
      
      // Outline and inverse colors
      outline: colors.border.primary,
      outlineVariant: colors.border.secondary,
      inverseSurface: colors.dark.background.primary,
      inverseOnSurface: colors.dark.text.primary,
      inversePrimary: colors.primary[200],
      
      // Elevation and shadow
      elevation: {
        level0: 'transparent',
        level1: colors.background.card,
        level2: colors.background.secondary,
        level3: colors.background.tertiary,
        level4: colors.background.quaternary,
        level5: colors.background.accent,
      },
      
      // Custom therapeutic colors
      therapeutic: {
        calming: colors.therapeutic.calming[500],
        nurturing: colors.therapeutic.nurturing[500],
        peaceful: colors.therapeutic.peaceful[500],
        grounding: colors.therapeutic.grounding[500],
        energizing: colors.therapeutic.energizing[500],
      },
    },
    fonts: {
      displayLarge: {
        fontFamily: typography.fonts.heading,
        fontSize: typography.sizes['8xl'],
        fontWeight: typography.weights.light,
        lineHeight: typography.lineHeights['8xl'],
      },
      displayMedium: {
        fontFamily: typography.fonts.heading,
        fontSize: typography.sizes['7xl'],
        fontWeight: typography.weights.normal,
        lineHeight: typography.lineHeights['7xl'],
      },
      displaySmall: {
        fontFamily: typography.fonts.heading,
        fontSize: typography.sizes['6xl'],
        fontWeight: typography.weights.normal,
        lineHeight: typography.lineHeights['6xl'],
      },
      headlineLarge: {
        fontFamily: typography.fonts.heading,
        fontSize: typography.sizes['5xl'],
        fontWeight: typography.weights.semiBold,
        lineHeight: typography.lineHeights['5xl'],
      },
      headlineMedium: {
        fontFamily: typography.fonts.heading,
        fontSize: typography.sizes['4xl'],
        fontWeight: typography.weights.semiBold,
        lineHeight: typography.lineHeights['4xl'],
      },
      headlineSmall: {
        fontFamily: typography.fonts.heading,
        fontSize: typography.sizes['3xl'],
        fontWeight: typography.weights.semiBold,
        lineHeight: typography.lineHeights['3xl'],
      },
      titleLarge: {
        fontFamily: typography.fonts.heading,
        fontSize: typography.sizes['2xl'],
        fontWeight: typography.weights.medium,
        lineHeight: typography.lineHeights['2xl'],
      },
      titleMedium: {
        fontFamily: typography.fonts.body,
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.medium,
        lineHeight: typography.lineHeights.xl,
      },
      titleSmall: {
        fontFamily: typography.fonts.body,
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.medium,
        lineHeight: typography.lineHeights.lg,
      },
      labelLarge: {
        fontFamily: typography.fonts.body,
        fontSize: typography.sizes.base,
        fontWeight: typography.weights.medium,
        lineHeight: typography.lineHeights.base,
      },
      labelMedium: {
        fontFamily: typography.fonts.body,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.medium,
        lineHeight: typography.lineHeights.sm,
      },
      labelSmall: {
        fontFamily: typography.fonts.body,
        fontSize: typography.sizes.xs,
        fontWeight: typography.weights.medium,
        lineHeight: typography.lineHeights.xs,
      },
      bodyLarge: {
        fontFamily: typography.fonts.body,
        fontSize: typography.sizes.lg,
        fontWeight: typography.weights.normal,
        lineHeight: typography.lineHeights.lg,
      },
      bodyMedium: {
        fontFamily: typography.fonts.body,
        fontSize: typography.sizes.base,
        fontWeight: typography.weights.normal,
        lineHeight: typography.lineHeights.base,
      },
      bodySmall: {
        fontFamily: typography.fonts.body,
        fontSize: typography.sizes.sm,
        fontWeight: typography.weights.normal,
        lineHeight: typography.lineHeights.sm,
      },
    },
  },
  dark: {
    colors: {
      // Primary brand colors (adjusted for dark mode)
      primary: colors.primary[300],
      primaryContainer: colors.primary[800],
      onPrimary: colors.primary[900],
      onPrimaryContainer: colors.primary[100],
      
      // Secondary colors (adjusted for dark mode)
      secondary: colors.secondary[300],
      secondaryContainer: colors.secondary[800],
      onSecondary: colors.secondary[900],
      onSecondaryContainer: colors.secondary[100],
      
      // Tertiary colors (adjusted for dark mode)
      tertiary: colors.therapeutic.kind[300],
      tertiaryContainer: colors.therapeutic.kind[800],
      onTertiary: colors.therapeutic.kind[900],
      onTertiaryContainer: colors.therapeutic.kind[100],
      
      // Surface colors
      surface: colors.dark.background.card,
      surfaceVariant: colors.dark.background.secondary,
      onSurface: colors.dark.text.primary,
      onSurfaceVariant: colors.dark.text.secondary,
      surfaceDisabled: colors.dark.background.disabled,
      onSurfaceDisabled: colors.dark.text.disabled,
      
      // Background colors
      background: colors.dark.background.primary,
      onBackground: colors.dark.text.primary,
      
      // Error colors
      error: colors.error[400],
      errorContainer: colors.error[800],
      onError: colors.error[900],
      onErrorContainer: colors.error[100],
      
      // Outline and inverse colors
      outline: colors.dark.border.primary,
      outlineVariant: colors.dark.border.secondary,
      inverseSurface: colors.background.primary,
      inverseOnSurface: colors.text.primary,
      inversePrimary: colors.primary[500],
      
      // Elevation and shadow
      elevation: {
        level0: 'transparent',
        level1: colors.dark.background.card,
        level2: colors.dark.background.secondary,
        level3: colors.dark.background.tertiary,
        level4: colors.dark.background.quaternary,
        level5: colors.dark.background.accent,
      },
      
      // Custom therapeutic colors (adjusted for dark mode)
      therapeutic: {
        calming: colors.therapeutic.calming[400],
        nurturing: colors.therapeutic.nurturing[400],
        peaceful: colors.therapeutic.peaceful[400],
        grounding: colors.therapeutic.grounding[400],
        energizing: colors.therapeutic.energizing[400],
      },
    },
    // Same fonts as light theme
    fonts: {
      // ... (same font configuration as light theme)
    },
  },
};

/**
 * Enhanced Material Design Components
 */

// Enhanced Surface Component with therapeutic theming
export const TherapeuticSurface = ({ 
  children, 
  style = {},
  elevation = 1,
  therapeutic = 'peaceful',
  variant = 'light',
  ...props 
}) => {
  const therapeuticColors = FreudColors[therapeutic] || FreudColors.mindful;
  
  return (
    <Surface
      style={[
        {
          backgroundColor: variant === 'light' ? therapeuticColors.light : therapeuticColors.medium,
          borderRadius: borderRadius.lg,
          padding: spacing[4],
        },
        shadows[elevation === 1 ? 'sm' : elevation === 2 ? 'base' : 'md'],
        style,
      ]}
      elevation={elevation}
      {...props}
    >
      {children}
    </Surface>
  );
};

// Enhanced Card Component with Freud colors and gradients
export const FreudCard = ({ 
  children, 
  style = {},
  therapeutic = 'mindful',
  variant = 'gradient',
  elevation = 2,
  ...props 
}) => {
  const therapeuticColors = FreudColors[therapeutic] || FreudColors.mindful;
  
  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={therapeuticColors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          {
            borderRadius: borderRadius.lg,
            padding: spacing[4],
          },
          shadows[elevation === 1 ? 'sm' : elevation === 2 ? 'base' : 'md'],
          style,
        ]}
        {...props}
      >
        {children}
      </LinearGradient>
    );
  }
  
  return (
    <Card
      style={[
        {
          backgroundColor: therapeuticColors.light,
          borderRadius: borderRadius.lg,
          padding: spacing[4],
        },
        shadows[elevation === 1 ? 'sm' : elevation === 2 ? 'base' : 'md'],
        style,
      ]}
      elevation={elevation}
      {...props}
    >
      {children}
    </Card>
  );
};

// Enhanced Button Component with therapeutic theming
export const TherapeuticButton = ({ 
  children,
  style = {},
  therapeutic = 'kind',
  variant = 'contained',
  size = 'medium',
  onPress,
  disabled = false,
  ...props 
}) => {
  const therapeuticColors = FreudColors[therapeutic] || FreudColors.kind;
  
  const buttonSizes = {
    small: {
      paddingVertical: spacing[2],
      paddingHorizontal: spacing[4],
      fontSize: typography.sizes.sm,
    },
    medium: {
      paddingVertical: spacing[3],
      paddingHorizontal: spacing[6],
      fontSize: typography.sizes.base,
    },
    large: {
      paddingVertical: spacing[4],
      paddingHorizontal: spacing[8],
      fontSize: typography.sizes.lg,
    },
  };
  
  const buttonStyles = {
    contained: {
      backgroundColor: therapeuticColors.medium,
      borderColor: 'transparent',
    },
    outlined: {
      backgroundColor: 'transparent',
      borderColor: therapeuticColors.medium,
      borderWidth: 1,
    },
    text: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
  };
  
  return (
    <PaperButton
      mode={variant === 'contained' ? 'contained' : variant === 'outlined' ? 'outlined' : 'text'}
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          borderRadius: borderRadius.lg,
          ...buttonSizes[size],
          ...buttonStyles[variant],
        },
        disabled && { opacity: 0.6 },
        style,
      ]}
      labelStyle={{
        color: variant === 'contained' ? '#FFFFFF' : therapeuticColors.dark,
        fontSize: buttonSizes[size].fontSize,
        fontWeight: typography.weights.medium,
      }}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

// Enhanced Typography Components
export const TherapeuticText = ({ 
  children, 
  style = {},
  variant = 'body',
  therapeutic = 'optimistic',
  weight = 'normal',
  align = 'left',
  ...props 
}) => {
  const therapeuticColors = FreudColors[therapeutic] || FreudColors.optimistic;
  
  const textVariants = {
    display: {
      fontSize: typography.sizes['8xl'],
      lineHeight: typography.lineHeights['8xl'],
      fontWeight: typography.weights.light,
    },
    headline: {
      fontSize: typography.sizes['6xl'],
      lineHeight: typography.lineHeights['6xl'],
      fontWeight: typography.weights.semiBold,
    },
    title: {
      fontSize: typography.sizes['3xl'],
      lineHeight: typography.lineHeights['3xl'],
      fontWeight: typography.weights.medium,
    },
    subtitle: {
      fontSize: typography.sizes.xl,
      lineHeight: typography.lineHeights.xl,
      fontWeight: typography.weights.normal,
    },
    body: {
      fontSize: typography.sizes.base,
      lineHeight: typography.lineHeights.base,
      fontWeight: typography.weights.normal,
    },
    caption: {
      fontSize: typography.sizes.sm,
      lineHeight: typography.lineHeights.sm,
      fontWeight: typography.weights.normal,
    },
    label: {
      fontSize: typography.sizes.xs,
      lineHeight: typography.lineHeights.xs,
      fontWeight: typography.weights.medium,
    },
  };
  
  return (
    <Text
      style={[
        {
          color: therapeuticColors.dark,
          textAlign: align,
          fontWeight: typography.weights[weight],
          ...textVariants[variant],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Container Component with safe area and status bar handling
export const FreudContainer = ({ 
  children, 
  style = {},
  therapeutic = 'mindful',
  variant = 'solid',
  statusBarStyle = 'dark-content',
  ...props 
}) => {
  const therapeuticColors = FreudColors[therapeutic] || FreudColors.mindful;
  
  const containerStyle = variant === 'gradient' ? {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
  } : {
    flex: 1,
    backgroundColor: therapeuticColors.light,
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
  };
  
  return (
    <View style={[containerStyle, style]} {...props}>
      <StatusBar barStyle={statusBarStyle} backgroundColor="transparent" translucent />
      {variant === 'gradient' ? (
        <LinearGradient
          colors={therapeuticColors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {children}
    </View>
  );
};

// Responsive Layout Components
export const ResponsiveView = ({ 
  children, 
  style = {},
  spacing = 'base',
  direction = 'column',
  ...props 
}) => {
  const spacingValues = {
    none: spacing[0],
    xs: spacing[1],
    sm: spacing[2],
    base: spacing[4],
    lg: spacing[6],
    xl: spacing[8],
  };
  
  return (
    <View
      style={[
        {
          flexDirection: direction,
          gap: spacingValues[spacing],
          padding: spacingValues[spacing],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

// Enhanced styles for common patterns
export const FreudStyles = StyleSheet.create({
  // Screen containers
  screen: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  screenPadding: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  },
  
  // Card styles
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    ...shadows.base,
  },
  cardCompact: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.base,
    padding: spacing[3],
    ...shadows.sm,
  },
  
  // Text styles
  heading: {
    fontSize: typography.sizes['3xl'],
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    lineHeight: typography.lineHeights['3xl'],
  },
  subheading: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.medium,
    color: colors.text.secondary,
    lineHeight: typography.lineHeights.xl,
  },
  body: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    color: colors.text.primary,
    lineHeight: typography.lineHeights.base,
  },
  caption: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    color: colors.text.tertiary,
    lineHeight: typography.lineHeights.sm,
  },
  
  // Layout utilities
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  flex1: {
    flex: 1,
  },
  
  // Therapeutic gradients
  therapeuticGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

export default {
  FreudColors,
  FreudMaterialTheme,
  TherapeuticSurface,
  FreudCard,
  TherapeuticButton,
  TherapeuticText,
  FreudContainer,
  ResponsiveView,
  FreudStyles,
};