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
    600: "#8B6F47", // Darker tan/brown variant
    500: "#C4A574", // Primary accent tan/beige
    400: "#D4B894",
    300: "#E0CAA4",
  },
  olive: {
    700: "#6B7B3A", // Matches onboarding.step1
    600: "#8A9D52",
    550: "#8B9D4C", // Darker olive variant for decorative elements
    500: "#9AAD5C", // Most used decorative color (29 instances in organisms)
    450: "#A0B55C", // Lighter olive variant for decorative elements
    400: "#AAB978",
    300: "#C4D19B",
  },
  gold: {
    500: "#C4A535", // Matches onboarding.step4
    400: "#F5C563",
  },
  stone: {
    100: "#F5F5F4",
    200: "#E7E5E4",
    300: "#D6D3D1",
    400: "#A8A29E",
    500: "#78716C",
    600: "#44403C",
    700: "#3D3533",
    800: "#292524",
    900: "#1C1917",
  },

  // Semantic color scales (full scales for component variants)
  red: {
    900: "#7F1D1D",
    800: "#991B1B",
    700: "#B91C1C",
    600: "#DC2626",
    500: "#EF4444", // Primary error color
    400: "#F87171",
    300: "#FCA5A5",
    200: "#FECACA",
    100: "#FEE2E2",
  },
  green: {
    900: "#14532D",
    800: "#166534",
    700: "#15803D",
    600: "#16A34A",
    500: "#22C55E", // Primary success color
    450: "#4A9E8C", // Teal variant for healthy score screen
    400: "#4ADE80",
    300: "#86EFAC",
    200: "#BBF7D0",
    100: "#DCFCE7",
  },
  amber: {
    900: "#78350F",
    800: "#92400E",
    700: "#B45309",
    600: "#D97706",
    500: "#F59E0B", // Primary warning color
    450: "#FFD93D", // Bright yellow for medium password strength
    400: "#FBBF24",
    300: "#FCD34D",
    200: "#FDE68A",
    100: "#FEF3C7",
  },
  blue: {
    900: "#1E3A5F",
    800: "#1E40AF",
    700: "#1D4ED8",
    600: "#2563EB",
    500: "#3B82F6",
    400: "#60A5FA",
    300: "#93C5FD",
    200: "#BFDBFE",
    100: "#DBEAFE",
  },
  indigo: {
    500: "#6366F1",
    400: "#818CF8", // Primary info color
    300: "#A5B4FC",
    200: "#C7D2FE",
    100: "#E0E7FF",
  },

  // Legacy semantic colors (for backward compatibility)
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
    450: "#8A8A8A", // Placeholder/label gray
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

  // Semantic shorthand for palette-level access (used by feature screens)
  background: {
    primary: "#1C1410",
    secondary: "#2A1F1A",
    tertiary: "#3D2D24",
    quaternary: "#4A3A2F",
    hero: "#2A1F1A",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#94A3B8",
    tertiary: "#64748B",
    disabled: "#475569",
    inverse: "#1C1410",
  },
  primary: {
    gold: "#C4A574",
  },
  accent: {
    orange: "#E8853A",
    green: "#9AAD5C",
    purple: "#7B68B5",
  },
  opacity: {
    white04: "rgba(255, 255, 255, 0.04)",
    white05: "rgba(255, 255, 255, 0.05)",
    white06: "rgba(255, 255, 255, 0.06)",
    white08: "rgba(255, 255, 255, 0.08)",
    white10: "rgba(255, 255, 255, 0.1)",
    white12: "rgba(255, 255, 255, 0.12)",
    white18: "rgba(255, 255, 255, 0.18)",
    white20: "rgba(255, 255, 255, 0.2)",
    white30: "rgba(255, 255, 255, 0.3)",
    white40: "rgba(255, 255, 255, 0.4)",
    black50: "rgba(0, 0, 0, 0.5)",
  },
  semantic: {
    info: "#818CF8",
    success: "#22C55E",
    warning: "#F59E0B",
    error: "#EF4444",
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
    disabled: palette.gray[600],      // Disabled text
    muted: palette.stone[400],        // Muted text
    error: palette.red[500],          // Error messages
    success: palette.green[500],      // Success messages
    warning: palette.amber[500],      // Warning messages
    info: palette.indigo[400],        // Info messages
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
    error: palette.red[500],                              // Error borders
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
      background: `${palette.green[500]}${palette.alpha[15]}`,
      border: `${palette.green[500]}${palette.alpha[30]}`,
      text: palette.green[500],
    },
    warning: {
      background: `${palette.amber[500]}${palette.alpha[15]}`,
      border: `${palette.amber[500]}${palette.alpha[30]}`,
      text: palette.amber[500],
    },
    error: {
      background: `${palette.red[500]}${palette.alpha[15]}`,
      border: `${palette.red[500]}${palette.alpha[30]}`,
      text: palette.red[500],
    },
    info: {
      background: `${palette.indigo[400]}${palette.alpha[15]}`,
      border: `${palette.indigo[400]}${palette.alpha[30]}`,
      text: palette.indigo[400],
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
    borderError: palette.red[500],
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
      background: `${palette.green[500]}${palette.alpha[20]}`,
      text: palette.green[500],
    },
    warning: {
      background: `${palette.amber[500]}${palette.alpha[20]}`,
      text: palette.amber[500],
    },
    error: {
      background: `${palette.red[500]}${palette.alpha[20]}`,
      text: palette.red[500],
    },
    info: {
      background: `${palette.indigo[400]}${palette.alpha[20]}`,
      text: palette.indigo[400],
    },
  },

  /**
   * Progress/loading colors
   */
  progress: {
    track: palette.gray[700],
    fill: palette.tan[500],
    success: palette.green[500],
    warning: palette.amber[500],
    error: palette.red[500],
  },

  /**
   * Crisis/safety colors
   */
  crisis: {
    primary: palette.red[500],
    background: `${palette.red[500]}${palette.alpha[10]}`,
    border: `${palette.red[500]}${palette.alpha[30]}`,
    text: palette.red[300], // Lighter red for text on dark
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
    secondary: palette.indigo[400],
    tertiary: palette.green[500],
    quaternary: palette.amber[500],
    quinary: palette.red[500],
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
