// Enhanced theme system with Paper Design and shadcn/ui principles
// Provides comprehensive design tokens for modern, elegant interfaces

export const enhancedColors = {
  // Modern neutral palette inspired by shadcn/ui
  neutral: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b",
  },

  // Enhanced therapeutic colors with more variations
  therapeutic: {
    // Calming Blues - Peace & Tranquility
    calming: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
      950: "#082f49",
    },

    // Nurturing Greens - Growth & Healing
    nurturing: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      950: "#052e16",
    },

    // Peaceful Grays - Serenity & Balance
    peaceful: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#020617",
    },

    // Grounding Purples - Stability & Wisdom
    grounding: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7c3aed",
      800: "#6b21a8",
      900: "#581c87",
      950: "#3b0764",
    },

    // Energizing Oranges - Motivation & Warmth
    energizing: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316",
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
      950: "#431407",
    },
  },

  // Glass morphism colors
  glass: {
    light: "rgba(255, 255, 255, 0.1)",
    medium: "rgba(255, 255, 255, 0.2)",
    heavy: "rgba(255, 255, 255, 0.3)",
    dark: "rgba(0, 0, 0, 0.1)",
    darkMedium: "rgba(0, 0, 0, 0.2)",
    darkHeavy: "rgba(0, 0, 0, 0.3)",
  },

  // Gradient presets for different moods/times
  gradients: {
    morning: ["#fff7ed", "#fef3c7", "#ddd6fe"],
    afternoon: ["#f0f9ff", "#e0f2fe", "#f0fdf4"],
    evening: ["#1e293b", "#475569", "#64748b"],
    therapeutic: ["#dcfce7", "#bae6fd", "#e9d5ff"],
    energizing: ["#fed7aa", "#fbbf24", "#f472b6"],
    calming: ["#bae6fd", "#a7f3d0", "#ddd6fe"],
  },

  // Border colors for different variants
  border: {
    light: "rgba(255, 255, 255, 0.1)",
    medium: "rgba(255, 255, 255, 0.2)",
    heavy: "rgba(255, 255, 255, 0.3)",
    dark: "rgba(0, 0, 0, 0.05)",
    darkMedium: "rgba(0, 0, 0, 0.1)",
    therapeutic: "rgba(34, 197, 94, 0.2)",
    calming: "rgba(14, 165, 233, 0.2)",
  },
};

// Enhanced shadows with multiple depths
export const enhancedShadows = {
  // Subtle shadows
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Small shadows
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Medium shadows (default)
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  // Large shadows
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },

  // Extra large shadows
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },

  // 2XL shadows for floating elements
  "2xl": {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 16,
  },

  // Colored shadows for therapeutic elements
  therapeutic: {
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  calming: {
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },

  grounding: {
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Enhanced border radius system
export const enhancedBorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  "4xl": 32,
  full: 999,
};

// Enhanced spacing system with more granular control
export const enhancedSpacing = {
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
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
};

// Enhanced typography with better scale
export const enhancedTypography = {
  fontFamily: {
    sans: "System",
    mono: "Courier",
  },

  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
    "6xl": 60,
    "7xl": 72,
    "8xl": 96,
    "9xl": 128,
  },

  lineHeights: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    "2xl": 36,
    "3xl": 42,
    "4xl": 48,
    "5xl": 60,
    "6xl": 72,
    "7xl": 84,
    "8xl": 108,
    "9xl": 144,
  },

  weights: {
    thin: "100",
    extraLight: "200",
    light: "300",
    normal: "400",
    medium: "500",
    semiBold: "600",
    bold: "700",
    extraBold: "800",
    black: "900",
  },

  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

// Animation presets for consistent motion design
export const enhancedAnimations = {
  // Timing functions
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 700,
  },

  // Easing curves
  easing: {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    therapeutic: "cubic-bezier(0.4, 0.0, 0.2, 1)", // Material design easing
    bouncy: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  // Spring configurations
  spring: {
    gentle: {
      tension: 50,
      friction: 8,
    },
    wobbly: {
      tension: 100,
      friction: 5,
    },
    stiff: {
      tension: 200,
      friction: 10,
    },
  },
};

// Breakpoints for responsive design
export const enhancedBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

// Component variants following shadcn/ui patterns
export const componentVariants = {
  card: {
    default: "default",
    therapeutic: "therapeutic",
    glass: "glass",
    gradient: "gradient",
    minimal: "minimal",
  },

  button: {
    primary: "primary",
    secondary: "secondary",
    therapeutic: "therapeutic",
    glass: "glass",
    outline: "outline",
    ghost: "ghost",
  },

  size: {
    small: "small",
    medium: "medium",
    large: "large",
  },
};

// Export the complete enhanced theme
export const enhancedTheme = {
  colors: enhancedColors,
  shadows: enhancedShadows,
  borderRadius: enhancedBorderRadius,
  spacing: enhancedSpacing,
  typography: enhancedTypography,
  animations: enhancedAnimations,
  breakpoints: enhancedBreakpoints,
  variants: componentVariants,
};
