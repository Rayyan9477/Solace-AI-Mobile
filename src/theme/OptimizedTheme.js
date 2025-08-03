/**
 * Optimized Theme System - Aligned with Figma Design Specifications
 * Solves bundle size and consistency issues
 */

// Figma-aligned color palette (from UI design specifications)
export const figmaAlignedColors = {
  // Mindful Brown - Primary (Figma exact colors)
  primary: {
    10: "#FDFCFC",   // Brown 10
    20: "#F7F4F2",   // Brown 20
    30: "#E8D0D9",   // Brown 30
    40: "#D3C2BB",   // Brown 40
    50: "#AC836C",   // Brown 50
    60: "#926247",   // Brown 60 - Main primary
    70: "#704533",   // Brown 70
    80: "#4F3422",   // Brown 80
    90: "#372315",   // Brown 90
    100: "#372315",  // Brown 100
  },

  // Serenity Green - Secondary (Figma exact colors)
  secondary: {
    10: "#F2F5EB",   // Green 10
    20: "#E5EAD7",   // Green 20
    30: "#CFD985",   // Green 30
    40: "#7DD44D",   // Green 40
    50: "#98BD68",   // Green 50
    60: "#7DD44D",   // Green 60 - Main secondary
    70: "#5A6638",   // Green 70
    80: "#504626",   // Green 80
    90: "#29321A",   // Green 90
    100: "#191E10",  // Green 100
  },

  // Therapeutic Colors (Figma aligned)
  therapeutic: {
    empathy: {
      10: "#FFFEE2",  // Orange 10
      20: "#FFF89E",  // Orange 20
      30: "#FFF360",  // Orange 30
      40: "#F76360",  // Orange 40
      50: "#ED7EIC",  // Orange 50
      60: "#C96100",  // Orange 60 - Main
      70: "#943200",  // Orange 70
      80: "#663600",  // Orange 80
      90: "#4D2500",  // Orange 90
      100: "#2E1500", // Orange 100
    },
    zen: {
      10: "#FFFEEC",  // Yellow 10
      20: "#FFFEBC",  // Yellow 20
      30: "#FFF088",  // Yellow 30
      40: "#A37A00",  // Yellow 40
      50: "#A37A00",  // Yellow 50
      60: "#EDA600",  // Yellow 60 - Main
      70: "#FD3C00",  // Yellow 70
      80: "#705600",  // Yellow 80
      90: "#4D3C00",  // Yellow 90
      100: "#2E2300", // Yellow 100
    },
    kind: {
      10: "#F9F4FF",  // Purple 10
      20: "#F350FF",  // Purple 20
      30: "#E9D5FF",  // Purple 30
      40: "#B695F3",  // Purple 40
      50: "#9654F5",  // Purple 50
      60: "#6C53F3",  // Purple 60 - Main
      70: "#553ED9",  // Purple 70
      80: "#4530F7",  // Purple 80
      90: "#3E2350",  // Purple 90
      100: "#161054", // Purple 100
    },
    optimistic: {
      10: "#FCFCFD",  // Gray 10
      20: "#E1E1E0",  // Gray 20
      30: "#A9A9A5",  // Gray 30
      40: "#54954E",  // Gray 40
      50: "#4C47C5",  // Gray 50
      60: "#738068",  // Gray 60 - Main
      70: "#926855",  // Gray 70
      80: "#54954E",  // Gray 80
      90: "#242423",  // Gray 90
      100: "#161615", // Gray 100
    },
  },

  // System colors
  success: "#22C55E",
  warning: "#F59E0B", 
  error: "#EF4444",
  info: "#3B82F6",

  // Neutral grays
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
};

// Optimized spacing system
export const spacing = {
  xs: 4,     // 4px
  sm: 8,     // 8px
  md: 16,    // 16px
  lg: 24,    // 24px
  xl: 32,    // 32px
  xxl: 48,   // 48px
  xxxl: 64,  // 64px
};

// Typography system
export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// Border radius system
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadow system (optimized for performance)
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  md: {
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
};

// Animation timing (with reduced motion support)
export const animation = {
  timing: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  easing: {
    easeOut: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// Light theme configuration
export const optimizedLightTheme = {
  colors: {
    // Background colors
    background: {
      primary: "#FFFFFF",
      secondary: "#F9FAFB", 
      tertiary: "#F3F4F6",
    },
    
    // Text colors
    text: {
      primary: "#111827",
      secondary: "#4B5563", 
      tertiary: "#6B7280",
      inverse: "#FFFFFF",
    },
    
    // Border colors
    border: {
      primary: "#E5E7EB",
      secondary: "#F3F4F6",
      focus: "#3B82F6",
    },
    
    // Brand colors
    primary: figmaAlignedColors.primary[60],
    secondary: figmaAlignedColors.secondary[60],
    
    // System colors
    success: figmaAlignedColors.success,
    warning: figmaAlignedColors.warning,
    error: figmaAlignedColors.error,
    
    // Therapeutic palette
    therapeutic: figmaAlignedColors.therapeutic,
  },
  
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
};

// Dark theme configuration
export const optimizedDarkTheme = {
  colors: {
    // Background colors
    background: {
      primary: "#0F172A",
      secondary: "#1E293B",
      tertiary: "#334155",
    },
    
    // Text colors
    text: {
      primary: "#F8FAFC",
      secondary: "#E2E8F0",
      tertiary: "#CBD5E1", 
      inverse: "#0F172A",
    },
    
    // Border colors
    border: {
      primary: "#475569",
      secondary: "#334155",
      focus: "#60A5FA",
    },
    
    // Brand colors (lighter variants for dark mode)
    primary: figmaAlignedColors.primary[40],
    secondary: figmaAlignedColors.secondary[40],
    
    // System colors (lighter variants)
    success: "#4ADE80",
    warning: "#FBBF24", 
    error: "#F87171",
    
    // Therapeutic palette
    therapeutic: figmaAlignedColors.therapeutic,
  },
  
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
};

// Create accessible theme with modifications
export const createAccessibleTheme = (baseTheme, options = {}) => {
  const {
    isHighContrastEnabled = false,
    isReducedMotionEnabled = false,
    fontScale = 1,
  } = options;

  let theme = { ...baseTheme };

  // Apply high contrast modifications
  if (isHighContrastEnabled) {
    theme = {
      ...theme,
      colors: {
        ...theme.colors,
        text: {
          ...theme.colors.text,
          primary: baseTheme === optimizedDarkTheme ? "#FFFFFF" : "#000000",
        },
        border: {
          ...theme.colors.border,
          primary: baseTheme === optimizedDarkTheme ? "#FFFFFF" : "#000000",
        },
      },
    };
  }

  // Apply reduced motion
  if (isReducedMotionEnabled) {
    theme = {
      ...theme,
      animation: {
        ...theme.animation,
        timing: {
          fast: 0,
          normal: 0,
          slow: 0,
        },
      },
    };
  }

  // Apply font scaling
  if (fontScale !== 1) {
    theme = {
      ...theme,
      typography: {
        ...theme.typography,
        sizes: Object.fromEntries(
          Object.entries(theme.typography.sizes).map(([key, value]) => [
            key,
            Math.round(value * fontScale),
          ])
        ),
      },
    };
  }

  return theme;
};

// Pre-built style utilities to replace styled-components
export const createStyleUtilities = (theme) => ({
  // Common flex layouts
  flexCenter: {
    display: "flex",
    alignItems: "center", 
    justifyContent: "center",
  },
  
  flexBetween: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", 
  },
  
  flexColumn: {
    display: "flex",
    flexDirection: "column",
  },
  
  // Common cards
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  
  // Common buttons
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Common text styles
  heading: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.sizes.xl * theme.typography.lineHeights.tight,
  },
  
  body: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.normal,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.sizes.base * theme.typography.lineHeights.normal,
  },
});

export default {
  optimizedLightTheme,
  optimizedDarkTheme,
  figmaAlignedColors,
  createAccessibleTheme,
  createStyleUtilities,
};