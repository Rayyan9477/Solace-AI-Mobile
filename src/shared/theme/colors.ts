/**
 * Color Tokens
 * @description Centralized color system for Solace AI Design System
 *
 * Dark Mode First Design
 * All colors are optimized for dark mode with proper contrast ratios
 *
 * Usage:
 * ```tsx
 * import { colors } from '@/shared/theme';
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: colors.background.primary,
 *     borderColor: colors.border.default,
 *   },
 * });
 * ```
 */

/**
 * Color Palette
 * Base colors used throughout the app
 */
export const palette = {
  // Primary brand colors
  brown: {
    900: "#1C1410", // Primary dark brown background
    800: "#2A1F1A",
    700: "#3D2D24",
    600: "#57493D",
    500: "#78716C",
    400: "#A8A29E",
  },
  tan: {
    500: "#C4A574", // Primary accent tan/beige
    400: "#D4B894",
    300: "#E0CAA4",
  },

  // Semantic colors
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#818CF8",

  // Onboarding theme colors
  onboarding: {
    step1: "#6B7B3A", // Olive green - AI Personalization
    step2: "#E8853A", // Orange - Mood Tracking
    step3: "#6B6B6B", // Gray - Journaling
    step4: "#C4A535", // Golden - Mindful Resources
    step5: "#7B68B5", // Purple - Community
  },

  // Grayscale
  white: "#FFFFFF",
  gray: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
  black: "#000000",

  // Transparency levels
  alpha: {
    5: "0D",   // 5%
    10: "1A",  // 10%
    15: "26",  // 15%
    20: "33",  // 20%
    30: "4D",  // 30%
    40: "66",  // 40%
    50: "80",  // 50%
    60: "99",  // 60%
    70: "B3",  // 70%
    80: "CC",  // 80%
    90: "E6",  // 90%
  },
} as const;

/**
 * Semantic Color Tokens
 * Organized by usage context for easy maintenance
 */
export const colors = {
  /**
   * Background colors
   */
  background: {
    primary: palette.brown[900],      // Main app background
    secondary: palette.brown[800],    // Card backgrounds
    tertiary: palette.brown[700],     // Elevated surfaces
    overlay: `rgba(0, 0, 0, 0.85)`,   // Modal overlays
    elevated: palette.brown[600],     // Floating elements
  },

  /**
   * Text colors
   */
  text: {
    primary: palette.white,           // Primary text
    secondary: palette.gray[400],     // Secondary text
    tertiary: palette.gray[500],      // Tertiary/disabled text
    inverse: palette.brown[900],      // Text on light backgrounds
    accent: palette.tan[500],         // Highlighted/accent text
    error: palette.error,             // Error messages
    success: palette.success,         // Success messages
    warning: palette.warning,         // Warning messages
  },

  /**
   * Border colors
   */
  border: {
    default: `${palette.white}${palette.alpha[10]}`,     // Standard borders
    light: `${palette.white}${palette.alpha[5]}`,        // Subtle borders
    medium: `${palette.white}${palette.alpha[20]}`,      // Emphasized borders
    heavy: `${palette.white}${palette.alpha[30]}`,       // Strong borders
    accent: palette.tan[500],                             // Accent borders
    error: palette.error,                                 // Error borders
  },

  /**
   * Interactive element colors
   */
  interactive: {
    default: palette.tan[500],                            // Primary buttons, links
    hover: palette.tan[400],                              // Hover state
    active: palette.tan[300],                             // Active/pressed state
    disabled: `${palette.tan[500]}${palette.alpha[30]}`, // Disabled state
    ghost: `${palette.white}${palette.alpha[5]}`,        // Ghost button background
  },

  /**
   * Status/feedback colors
   */
  status: {
    success: {
      background: `${palette.success}${palette.alpha[15]}`,
      border: `${palette.success}${palette.alpha[30]}`,
      text: palette.success,
    },
    warning: {
      background: `${palette.warning}${palette.alpha[15]}`,
      border: `${palette.warning}${palette.alpha[30]}`,
      text: palette.warning,
    },
    error: {
      background: `${palette.error}${palette.alpha[15]}`,
      border: `${palette.error}${palette.alpha[30]}`,
      text: palette.error,
    },
    info: {
      background: `${palette.info}${palette.alpha[15]}`,
      border: `${palette.info}${palette.alpha[30]}`,
      text: palette.info,
    },
  },

  /**
   * Form element colors
   */
  form: {
    background: `${palette.white}${palette.alpha[5]}`,
    backgroundFocus: `${palette.white}${palette.alpha[10]}`,
    border: `${palette.white}${palette.alpha[20]}`,
    borderFocus: palette.tan[500],
    borderError: palette.error,
    placeholder: palette.gray[500],
    label: palette.gray[400],
  },

  /**
   * Badge/Tag colors
   */
  badge: {
    default: {
      background: palette.gray[600],
      text: palette.gray[200],
    },
    success: {
      background: `${palette.success}${palette.alpha[20]}`,
      text: palette.success,
    },
    warning: {
      background: `${palette.warning}${palette.alpha[20]}`,
      text: palette.warning,
    },
    error: {
      background: `${palette.error}${palette.alpha[20]}`,
      text: palette.error,
    },
    info: {
      background: `${palette.info}${palette.alpha[20]}`,
      text: palette.info,
    },
  },

  /**
   * Progress/loading colors
   */
  progress: {
    track: palette.gray[700],
    fill: palette.tan[500],
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
  },

  /**
   * Crisis/safety colors
   */
  crisis: {
    primary: palette.error,
    background: `${palette.error}${palette.alpha[10]}`,
    border: `${palette.error}${palette.alpha[30]}`,
    text: "#FCA5A5", // Lighter red for text on dark
  },

  /**
   * Onboarding step colors
   */
  onboarding: palette.onboarding,

  /**
   * Chart/data visualization colors
   */
  chart: {
    primary: palette.tan[500],
    secondary: palette.info,
    tertiary: palette.success,
    quaternary: palette.warning,
    quinary: palette.error,
    grid: `${palette.white}${palette.alpha[10]}`,
  },

  /**
   * Shadow colors
   */
  shadow: {
    default: palette.black,
    subtle: `${palette.black}${palette.alpha[20]}`,
    medium: `${palette.black}${palette.alpha[40]}`,
    strong: `${palette.black}${palette.alpha[60]}`,
  },
} as const;

/**
 * Color utility functions
 */
export const colorUtils = {
  /**
   * Add alpha channel to hex color
   * @param hexColor - Hex color string (e.g., "#FFFFFF")
   * @param alpha - Alpha value 0-100
   * @returns Hex color with alpha
   */
  addAlpha(hexColor: string, alpha: number): string {
    const alphaHex = Math.round((alpha / 100) * 255).toString(16).padStart(2, "0");
    return `${hexColor}${alphaHex}`;
  },

  /**
   * Convert hex to rgba
   * @param hexColor - Hex color string
   * @param alpha - Alpha value 0-1
   * @returns rgba string
   */
  hexToRgba(hexColor: string, alpha: number): string {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
};

/**
 * Type exports for TypeScript autocomplete
 */
export type ColorPalette = typeof palette;
export type SemanticColors = typeof colors;
export type ColorToken = keyof typeof colors;

export default colors;
