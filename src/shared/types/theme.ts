/**
 * Theme Type Definitions
 * Comprehensive type definitions for the Solace AI theme system
 */

// Color scale type (50-950)
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

// Therapeutic color categories
export interface TherapeuticColors {
  calming: ColorScale;
  nurturing: ColorScale;
  peaceful: ColorScale;
  grounding: ColorScale;
  energizing: ColorScale;
}

// Glass morphism colors
export interface GlassColors {
  light: string;
  medium: string;
  heavy: string;
  dark: string;
  darkMedium: string;
  darkHeavy: string;
}

// Gradient presets
export interface GradientColors {
  morning: string[];
  afternoon: string[];
  evening: string[];
  therapeutic: string[];
  energizing: string[];
  calming: string[];
}

// Border colors
export interface BorderColors {
  light: string;
  medium: string;
  heavy: string;
  dark: string;
  darkMedium: string;
  therapeutic: string;
  calming: string;
}

// Enhanced colors structure
export interface EnhancedColors {
  neutral: ColorScale;
  therapeutic: TherapeuticColors;
  glass: GlassColors;
  gradients: GradientColors;
  border: BorderColors;
}

// Shadow definition
export interface Shadow {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

// Shadow variants
export interface Shadows {
  xs: Shadow;
  sm: Shadow;
  md: Shadow;
  lg: Shadow;
  xl: Shadow;
  "2xl": Shadow;
  therapeutic: Shadow;
  glass: Shadow;
}

// Typography scale
export interface Typography {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
    light: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    "2xl": number;
    "3xl": number;
    "4xl": number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tight: number;
    normal: number;
    wide: number;
  };
}

// Spacing scale
export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
  "3xl": number;
}

// Border radius scale
export interface BorderRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  "2xl": number;
  full: number;
}

// Animation timing
export interface Animation {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

// Main theme interface
export interface Theme {
  name: "light" | "dark";
  isDark: boolean;
  colors: {
    // Base colors
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    border: string;

    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;

    // Therapeutic colors
    therapeutic: TherapeuticColors;

    // Additional color utilities
    glass?: GlassColors;
    gradients?: GradientColors;
    neutral?: ColorScale;
  };

  shadows: Shadows;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  animation?: Animation;
}

// Theme context type
export interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

// Theme mode
export type ThemeMode = "light" | "dark" | "auto";

// Component theme props
export interface ThemedComponentProps {
  theme?: Theme;
  isDark?: boolean;
}

// Color utilities
export type ColorKey = keyof Theme["colors"];
export type TherapeuticColorKey = keyof TherapeuticColors;
export type ColorShade = keyof ColorScale;

// Export enhanced colors for use in components
// export type { EnhancedColors }; // Removed to avoid conflict
