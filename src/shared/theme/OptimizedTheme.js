/**
 * Optimized Theme Definitions
 * High-performance theme objects with minimal recalculation overhead
 */

// Import base design system
import { FreudColors, FreudTypography, FreudSpacing, FreudBorderRadius, FreudShadows } from './FreudDesignSystem';

// Figma-aligned color palette
export const figmaAlignedColors = {
  // Primary therapeutic colors
  primary: FreudColors.mindfulBrown[80],
  primaryContainer: FreudColors.mindfulBrown[20],
  onPrimary: '#FFFFFF',
  onPrimaryContainer: FreudColors.mindfulBrown[90],
  
  // Secondary colors
  secondary: FreudColors.serenityGreen[60],
  secondaryContainer: FreudColors.serenityGreen[20],
  onSecondary: '#FFFFFF',
  onSecondaryContainer: FreudColors.serenityGreen[90],
  
  // Tertiary colors
  tertiary: FreudColors.empathyOrange[50],
  tertiaryContainer: FreudColors.empathyOrange[20],
  onTertiary: '#FFFFFF',
  onTertiaryContainer: FreudColors.empathyOrange[90],
  
  // Surface colors
  surface: '#FFFFFF',
  surfaceVariant: FreudColors.optimisticGray[10],
  onSurface: FreudColors.mindfulBrown[90],
  onSurfaceVariant: FreudColors.optimisticGray[70],
  
  // Background
  background: '#FFFFFF',
  onBackground: FreudColors.mindfulBrown[90],
  
  // Error colors
  error: FreudColors.empathyOrange[70],
  errorContainer: FreudColors.empathyOrange[20],
  onError: '#FFFFFF',
  onErrorContainer: FreudColors.empathyOrange[90],
  
  // Outline
  outline: FreudColors.optimisticGray[40],
  outlineVariant: FreudColors.optimisticGray[30],
  
  // Status colors
  success: FreudColors.serenityGreen[60],
  warning: FreudColors.zenYellow[60],
  info: FreudColors.kindPurple[60],
  
  // Therapeutic gradients
  therapeuticGradients: {
    calming: [FreudColors.serenityGreen[20], FreudColors.serenityGreen[10]],
    nurturing: [FreudColors.empathyOrange[20], FreudColors.empathyOrange[10]],
    peaceful: [FreudColors.optimisticGray[20], FreudColors.optimisticGray[10]],
    grounding: [FreudColors.mindfulBrown[20], FreudColors.mindfulBrown[10]],
    energizing: [FreudColors.zenYellow[20], FreudColors.zenYellow[10]],
    zen: [FreudColors.kindPurple[20], FreudColors.kindPurple[10]],
  },
};

// Light theme optimized for performance
export const optimizedLightTheme = {
  colors: {
    ...figmaAlignedColors,
    // Additional semantic colors
    text: {
      primary: FreudColors.mindfulBrown[90],
      secondary: FreudColors.optimisticGray[70],
      tertiary: FreudColors.optimisticGray[50],
      inverse: '#FFFFFF',
      disabled: FreudColors.optimisticGray[40],
    },
    border: {
      primary: FreudColors.optimisticGray[20],
      secondary: FreudColors.optimisticGray[30],
      focus: FreudColors.serenityGreen[60],
      error: FreudColors.empathyOrange[60],
    },
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#FAFAFA',
      level3: '#F5F5F5',
      level4: '#F0F0F0',
      level5: '#EEEEEE',
    },
  },
  typography: {
    ...FreudTypography,
    // Pre-calculated font styles for performance
    h1: {
      fontFamily: FreudTypography.fontFamily.primary,
      fontSize: FreudTypography.sizes['4xl'],
      fontWeight: FreudTypography.weights.bold,
      lineHeight: FreudTypography.sizes['4xl'] * FreudTypography.lineHeights.tight,
      color: FreudColors.mindfulBrown[90],
    },
    h2: {
      fontFamily: FreudTypography.fontFamily.primary,
      fontSize: FreudTypography.sizes['3xl'],
      fontWeight: FreudTypography.weights.bold,
      lineHeight: FreudTypography.sizes['3xl'] * FreudTypography.lineHeights.tight,
      color: FreudColors.mindfulBrown[90],
    },
    h3: {
      fontFamily: FreudTypography.fontFamily.primary,
      fontSize: FreudTypography.sizes['2xl'],
      fontWeight: FreudTypography.weights.semiBold,
      lineHeight: FreudTypography.sizes['2xl'] * FreudTypography.lineHeights.normal,
      color: FreudColors.mindfulBrown[90],
    },
    body1: {
      fontFamily: FreudTypography.fontFamily.secondary,
      fontSize: FreudTypography.sizes.base,
      fontWeight: FreudTypography.weights.normal,
      lineHeight: FreudTypography.sizes.base * FreudTypography.lineHeights.relaxed,
      color: FreudColors.mindfulBrown[90],
    },
    body2: {
      fontFamily: FreudTypography.fontFamily.secondary,
      fontSize: FreudTypography.sizes.sm,
      fontWeight: FreudTypography.weights.normal,
      lineHeight: FreudTypography.sizes.sm * FreudTypography.lineHeights.normal,
      color: FreudColors.optimisticGray[70],
    },
    caption: {
      fontFamily: FreudTypography.fontFamily.secondary,
      fontSize: FreudTypography.sizes.xs,
      fontWeight: FreudTypography.weights.medium,
      lineHeight: FreudTypography.sizes.xs * FreudTypography.lineHeights.normal,
      color: FreudColors.optimisticGray[60],
    },
  },
  spacing: FreudSpacing,
  borderRadius: FreudBorderRadius,
  shadows: FreudShadows,
  // Pre-calculated component styles
  components: {
    button: {
      primary: {
        backgroundColor: FreudColors.mindfulBrown[90],
        color: '#FFFFFF',
        paddingVertical: FreudSpacing[3],
        paddingHorizontal: FreudSpacing[6],
        borderRadius: FreudBorderRadius['2xl'],
        ...FreudShadows.md,
      },
      secondary: {
        backgroundColor: FreudColors.serenityGreen[40],
        color: FreudColors.serenityGreen[90],
        paddingVertical: FreudSpacing[3],
        paddingHorizontal: FreudSpacing[6],
        borderRadius: FreudBorderRadius['2xl'],
        ...FreudShadows.sm,
      },
    },
    card: {
      default: {
        backgroundColor: '#FFFFFF',
        borderRadius: FreudBorderRadius.xl,
        padding: FreudSpacing[4],
        ...FreudShadows.sm,
      },
    },
  },
};

// Dark theme optimized for performance
export const optimizedDarkTheme = {
  colors: {
    ...figmaAlignedColors,
    // Override colors for dark mode
    primary: FreudColors.mindfulBrown[40],
    onPrimary: FreudColors.mindfulBrown[90],
    primaryContainer: FreudColors.mindfulBrown[80],
    onPrimaryContainer: FreudColors.mindfulBrown[10],
    
    secondary: FreudColors.serenityGreen[50],
    onSecondary: FreudColors.serenityGreen[90],
    secondaryContainer: FreudColors.serenityGreen[80],
    onSecondaryContainer: FreudColors.serenityGreen[10],
    
    surface: FreudColors.optimisticGray[90],
    surfaceVariant: FreudColors.optimisticGray[80],
    onSurface: FreudColors.optimisticGray[10],
    onSurfaceVariant: FreudColors.optimisticGray[30],
    
    background: FreudColors.optimisticGray[100],
    onBackground: FreudColors.optimisticGray[10],
    
    outline: FreudColors.optimisticGray[70],
    outlineVariant: FreudColors.optimisticGray[80],
    
    text: {
      primary: FreudColors.optimisticGray[10],
      secondary: FreudColors.optimisticGray[30],
      tertiary: FreudColors.optimisticGray[50],
      inverse: FreudColors.mindfulBrown[90],
      disabled: FreudColors.optimisticGray[60],
    },
    border: {
      primary: FreudColors.optimisticGray[80],
      secondary: FreudColors.optimisticGray[70],
      focus: FreudColors.serenityGreen[50],
      error: FreudColors.empathyOrange[50],
    },
    elevation: {
      level0: 'transparent',
      level1: FreudColors.optimisticGray[90],
      level2: FreudColors.optimisticGray[85],
      level3: FreudColors.optimisticGray[80],
      level4: FreudColors.optimisticGray[75],
      level5: FreudColors.optimisticGray[70],
    },
  },
  typography: {
    ...optimizedLightTheme.typography,
    // Override text colors for dark mode
    h1: {
      ...optimizedLightTheme.typography.h1,
      color: FreudColors.optimisticGray[10],
    },
    h2: {
      ...optimizedLightTheme.typography.h2,
      color: FreudColors.optimisticGray[10],
    },
    h3: {
      ...optimizedLightTheme.typography.h3,
      color: FreudColors.optimisticGray[10],
    },
    body1: {
      ...optimizedLightTheme.typography.body1,
      color: FreudColors.optimisticGray[10],
    },
    body2: {
      ...optimizedLightTheme.typography.body2,
      color: FreudColors.optimisticGray[30],
    },
    caption: {
      ...optimizedLightTheme.typography.caption,
      color: FreudColors.optimisticGray[40],
    },
  },
  spacing: FreudSpacing,
  borderRadius: FreudBorderRadius,
  shadows: FreudShadows,
  components: {
    button: {
      primary: {
        backgroundColor: FreudColors.mindfulBrown[40],
        color: FreudColors.mindfulBrown[90],
        paddingVertical: FreudSpacing[3],
        paddingHorizontal: FreudSpacing[6],
        borderRadius: FreudBorderRadius['2xl'],
        ...FreudShadows.md,
      },
      secondary: {
        backgroundColor: FreudColors.serenityGreen[70],
        color: FreudColors.serenityGreen[10],
        paddingVertical: FreudSpacing[3],
        paddingHorizontal: FreudSpacing[6],
        borderRadius: FreudBorderRadius['2xl'],
        ...FreudShadows.sm,
      },
    },
    card: {
      default: {
        backgroundColor: FreudColors.optimisticGray[90],
        borderRadius: FreudBorderRadius.xl,
        padding: FreudSpacing[4],
        ...FreudShadows.sm,
      },
    },
  },
};

// Accessibility-enhanced theme creation
export const createAccessibleTheme = (baseTheme, options = {}) => {
  const {
    isHighContrastEnabled = false,
    isReducedMotionEnabled = false,
    fontScale = 1,
  } = options;

  let enhancedTheme = { ...baseTheme };

  // High contrast adjustments
  if (isHighContrastEnabled) {
    enhancedTheme.colors = {
      ...enhancedTheme.colors,
      text: {
        ...enhancedTheme.colors.text,
        primary: baseTheme === optimizedLightTheme ? '#000000' : '#FFFFFF',
      },
      outline: baseTheme === optimizedLightTheme ? '#000000' : '#FFFFFF',
    };
  }

  // Font scaling
  if (fontScale !== 1) {
    const scaleTypography = (typography) => {
      const scaled = {};
      Object.keys(typography).forEach(key => {
        if (typeof typography[key] === 'object' && typography[key].fontSize) {
          scaled[key] = {
            ...typography[key],
            fontSize: typography[key].fontSize * fontScale,
            lineHeight: typography[key].lineHeight * fontScale,
          };
        } else {
          scaled[key] = typography[key];
        }
      });
      return scaled;
    };

    enhancedTheme.typography = scaleTypography(enhancedTheme.typography);
  }

  return enhancedTheme;
};

// Pre-calculated theme variations for performance
export const therapeuticThemeVariations = {
  calming: {
    ...optimizedLightTheme,
    colors: {
      ...optimizedLightTheme.colors,
      primary: FreudColors.serenityGreen[60],
      primaryContainer: FreudColors.serenityGreen[20],
      background: FreudColors.serenityGreen[10],
    },
  },
  nurturing: {
    ...optimizedLightTheme,
    colors: {
      ...optimizedLightTheme.colors,
      primary: FreudColors.empathyOrange[50],
      primaryContainer: FreudColors.empathyOrange[20],
      background: FreudColors.empathyOrange[10],
    },
  },
  peaceful: {
    ...optimizedLightTheme,
    colors: {
      ...optimizedLightTheme.colors,
      primary: FreudColors.optimisticGray[60],
      primaryContainer: FreudColors.optimisticGray[20],
      background: FreudColors.optimisticGray[10],
    },
  },
  grounding: {
    ...optimizedLightTheme,
    colors: {
      ...optimizedLightTheme.colors,
      primary: FreudColors.mindfulBrown[70],
      primaryContainer: FreudColors.mindfulBrown[20],
      background: FreudColors.mindfulBrown[10],
    },
  },
  energizing: {
    ...optimizedLightTheme,
    colors: {
      ...optimizedLightTheme.colors,
      primary: FreudColors.zenYellow[60],
      primaryContainer: FreudColors.zenYellow[20],
      background: FreudColors.zenYellow[10],
    },
  },
  zen: {
    ...optimizedLightTheme,
    colors: {
      ...optimizedLightTheme.colors,
      primary: FreudColors.kindPurple[60],
      primaryContainer: FreudColors.kindPurple[20],
      background: FreudColors.kindPurple[10],
    },
  },
};

export default {
  optimizedLightTheme,
  optimizedDarkTheme,
  figmaAlignedColors,
  createAccessibleTheme,
  therapeuticThemeVariations,
};