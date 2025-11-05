/**
 * Freud Design System Theme
 * Complete theme with colors, typography, spacing, shadows
 * Based on ui-designs specifications
 */

import { colors } from "./colors";

/**
 * Typography System (Urbanist font family)
 * From: ui-designs/Design System and Components/Typography.png
 */
export const typography = {
  fontFamily: {
    primary: "Urbanist", // Primary font
    fallback: "System", // System fallback
  },

  // Font sizes with line heights
  sizes: {
    // Display
    displayLg: { fontSize: 48, lineHeight: 60 }, // Display lg ExtraBold
    displayMd: { fontSize: 40, lineHeight: 50 }, // Display md ExtraBold
    displaySm: { fontSize: 32, lineHeight: 40 }, // Display sm ExtraBold

    // Headings
    heading2xl: { fontSize: 30, lineHeight: 38 }, // Heading 2xl ExtraBold
    headingXl: { fontSize: 24, lineHeight: 32 }, // Heading xl ExtraBold
    headingLg: { fontSize: 20, lineHeight: 28 }, // Heading lg ExtraBold
    headingMd: { fontSize: 18, lineHeight: 24 }, // Heading md ExtraBold
    headingSm: { fontSize: 16, lineHeight: 22 }, // Heading sm ExtraBold
    headingXs: { fontSize: 14, lineHeight: 20 }, // Heading xs ExtraBold

    // Text/Body
    text2xl: { fontSize: 24, lineHeight: 32 }, // Text 2xl Extrabold
    textXl: { fontSize: 20, lineHeight: 28 }, // Text xl Extrabold
    textLg: { fontSize: 18, lineHeight: 26 }, // Text lg Bold
    textMd: { fontSize: 16, lineHeight: 24 }, // Text md Bold
    textSm: { fontSize: 14, lineHeight: 20 }, // Text sm Bold
    textXs: { fontSize: 12, lineHeight: 18 }, // Text xs Bold
  },

  // Font weights
  weights: {
    extrabold: "800",
    bold: "700",
    semibold: "600",
    medium: "500",
    regular: "400",
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
};

/**
 * Spacing System (8px grid)
 * From: ui-designs/Design System and Components/Grids & Spacing.png
 */
export const spacing = {
  0: 0,
  1: 4, // 0.5 * 8
  2: 8, // 1 * 8
  3: 12, // 1.5 * 8
  4: 16, // 2 * 8
  5: 20, // 2.5 * 8
  6: 24, // 3 * 8
  7: 28, // 3.5 * 8
  8: 32, // 4 * 8
  10: 40, // 5 * 8
  12: 48, // 6 * 8
  16: 64, // 8 * 8
  20: 80, // 10 * 8
  24: 96, // 12 * 8
  32: 128, // 16 * 8
  40: 160, // 20 * 8
  48: 192, // 24 * 8
  56: 224, // 28 * 8
  64: 256, // 32 * 8
};

/**
 * Border Radius System
 * From: ui-designs button and card samples
 */
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
  full: 999,
};

/**
 * Shadow System (Elevation)
 * From: ui-designs/Design System and Components/Effects.png
 */
export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: colors.semantic.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: colors.semantic.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.semantic.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.semantic.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: colors.semantic.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
};

/**
 * Animation Timing
 */
export const animations = {
  timing: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },
  easing: {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    therapeutic: "cubic-bezier(0.4, 0.0, 0.2, 1)",
  },
};

/**
 * Breakpoints for responsive design
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/**
 * Complete Light Theme
 */
export const lightTheme = {
  name: "light",
  isDark: false,
  colors: {
    ...colors,
    // Semantic shortcuts
    primary: colors.semantic.primary,
    primaryDark: colors.semantic.primaryDark,
    primaryLight: colors.semantic.primaryLight,

    success: colors.semantic.success,
    warning: colors.semantic.warning,
    error: colors.semantic.error,
    info: colors.semantic.info,

    background: {
      primary: colors.semantic.background,
      secondary: colors.semantic.surface,
      tertiary: colors.semantic.surfaceVariant,
    },

    text: {
      primary: colors.semantic.onSurface,
      secondary: colors.semantic.onSurfaceVariant,
      tertiary: colors.gray[50],
      inverse: colors.semantic.onPrimary,
      disabled: colors.semantic.onDisabled,
    },

    border: {
      light: colors.semantic.outlineVariant,
      main: colors.semantic.outline,
      dark: colors.gray[40],
    },

    // Therapeutic colors for mental health context
    therapeutic: {
      calming: colors.green,
      nurturing: colors.green,
      peaceful: colors.gray,
      grounding: colors.purple,
      energizing: colors.orange,
      mindful: colors.brown,
      zen: colors.yellow,
    },
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,

  // Helper function to get shadow
  getShadow: (size = "md") => shadows[size],
};

/**
 * Complete Dark Theme
 * Inverted colors for dark mode
 */
export const darkTheme = {
  ...lightTheme,
  name: "dark",
  isDark: true,
  colors: {
    ...colors,
    // Inverted semantic colors for dark mode
    primary: colors.brown[50],
    primaryDark: colors.brown[40],
    primaryLight: colors.brown[60],

    success: colors.green[50],
    warning: colors.yellow[50],
    error: colors.orange[50],
    info: colors.purple[50],

    background: {
      primary: colors.gray[100],
      secondary: colors.gray[90],
      tertiary: colors.gray[80],
    },

    text: {
      primary: colors.gray[10],
      secondary: colors.gray[30],
      tertiary: colors.gray[40],
      inverse: colors.gray[100],
      disabled: colors.gray[60],
    },

    border: {
      light: colors.gray[80],
      main: colors.gray[70],
      dark: colors.gray[60],
    },

    // Therapeutic colors adjusted for dark mode
    therapeutic: {
      calming: colors.green,
      nurturing: colors.green,
      peaceful: colors.gray,
      grounding: colors.purple,
      energizing: colors.orange,
      mindful: colors.brown,
      zen: colors.yellow,
    },

    // Semantic overrides
    semantic: {
      ...colors.semantic,
      background: colors.gray[100],
      surface: colors.gray[90],
      surfaceVariant: colors.gray[80],
      onSurface: colors.gray[10],
      onSurfaceVariant: colors.gray[30],
      scrim: "rgba(255, 255, 255, 0.08)",
      shadow: "rgba(0, 0, 0, 0.32)",
    },
  },
};

// Default export
export default lightTheme;

// Named exports
export { colors, therapeuticColors } from "./colors";
