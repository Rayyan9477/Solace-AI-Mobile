// Design System for Solace AI Mobile - Based on Freud UI Kit Design Specifications
export const colors = {
  // Mindful Brown - Primary brand color (exact Figma match)
  primary: {
    50: "#F7F4F2", // Brown 10 - Very light (exact Figma)
    100: "#E8D0D9", // Brown 20 - Light (exact Figma)
    200: "#D3C2BB", // Brown 30 - Soft (exact Figma)
    300: "#C0A091", // Brown 40 - Medium light (exact Figma)
    400: "#AC836C", // Brown 50 - Medium (exact Figma)
    500: "#926247", // Brown 60 - Main primary color (exact Figma)
    600: "#663600", // Brown 70 - Darker (exact Figma)
    700: "#432500", // Brown 80 - Deep (exact Figma)
    800: "#372218", // Brown 90 - Very dark (exact Figma)
    900: "#2E1A00", // Brown 100 - Darkest (exact Figma)
  },

  // Serenity Green - Secondary color (exact Figma match)
  secondary: {
    50: "#F2F5EB", // Green 10 - Very light (exact Figma)
    100: "#E5EAD7", // Green 20 - Light (exact Figma)
    200: "#CFD985", // Green 30 - Soft (exact Figma)
    300: "#B4C480", // Green 40 - Medium light (exact Figma)
    400: "#98BD68", // Green 50 - Medium (exact Figma)
    500: "#7DD44D", // Green 60 - Main secondary color (exact Figma)
    600: "#5A6638", // Green 70 - Darker (exact Figma)
    700: "#29321A", // Green 80 - Deep (exact Figma)
    800: "#191E10", // Green 90 - Very dark (exact Figma)
    900: "#0F120A", // Green 100 - Darkest
  },

  // Accent Colors - Refined for mental health app
  success: {
    50: "#F0FDF4", // Pure light green
    100: "#DCFCE7", // Very light green
    200: "#BBF7D0", // Light green
    300: "#86EFAC", // Soft green
    400: "#4ADE80", // Bright green
    500: "#22C55E", // Main success - Fresh green
    600: "#16A34A", // Darker green
    700: "#15803D", // Deep green
    800: "#166534", // Very dark green
    900: "#14532D", // Forest green
  },

  warning: {
    50: "#FFFBEB", // Pure light amber
    100: "#FEF3C7", // Very light amber
    200: "#FDE68A", // Light amber
    300: "#FCD34D", // Soft amber
    400: "#FBBF24", // Bright amber
    500: "#F59E0B", // Main warning - Warm amber
    600: "#D97706", // Darker amber
    700: "#B45309", // Deep amber
    800: "#92400E", // Very dark amber
    900: "#78350F", // Burnt amber
  },

  error: {
    50: "#FEF2F2", // Pure light red
    100: "#FEE2E2", // Very light red
    200: "#FECACA", // Light red
    300: "#FCA5A5", // Soft red
    400: "#F87171", // Bright red
    500: "#EF4444", // Main error - Clear red
    600: "#DC2626", // Darker red
    700: "#B91C1C", // Deep red
    800: "#991B1B", // Very dark red
    900: "#7F1D1D", // Burgundy red
  },

  // Neutral Colors - Clean and sophisticated grays
  gray: {
    50: "#F9FAFB", // Pure white alternative
    100: "#F3F4F6", // Very light gray
    200: "#E5E7EB", // Light gray
    300: "#D1D5DB", // Medium light gray
    400: "#9CA3AF", // Medium gray
    500: "#6B7280", // Base gray
    600: "#4B5563", // Dark gray
    700: "#374151", // Darker gray
    800: "#1F2937", // Very dark gray
    900: "#111827", // Almost black
  },

  // Specialized mental health colors (refined therapeutic palette)
  mood: {
    happy: "#FEF08A", // Soft yellow - gentle joy
    calm: "#BAE6FD", // Light blue - serenity
    anxious: "#E0E7FF", // Light purple - gentle anxiety
    sad: "#DBEAFE", // Light blue - melancholy
    angry: "#FED7D7", // Light coral - controlled anger
    neutral: "#F3F4F6", // Light gray - balanced state
    excited: "#FDF2F8", // Light pink - high energy
    tired: "#F9FAFB", // Very light gray - fatigue
    stressed: "#FEF3C7", // Light amber - stress indication
    content: "#DCFCE7", // Pale green - satisfaction
  },

  // Light Mode Background colors (refined for mental health)
  background: {
    primary: "#FFFFFF", // Pure white - main background
    secondary: "#F9FAFB", // Very light gray - secondary surfaces
    tertiary: "#F3F4F6", // Light gray - tertiary surfaces
    quaternary: "#F8FAFC", // Very light blue-gray - special surfaces
    overlay: "rgba(0, 0, 0, 0.3)", // Semi-transparent overlay
    card: "#FFFFFF", // Card background
    modal: "#FFFFFF", // Modal background
    input: "#F9FAFB", // Input field background
    disabled: "#F3F4F6", // Disabled element background
    accent: "#F8FAFC", // Accent background
  },

  // Light Mode Text colors (optimized for accessibility)
  text: {
    primary: "#111827", // Deep gray - primary text
    secondary: "#4B5563", // Dark gray - secondary text
    tertiary: "#6B7280", // Medium gray - tertiary text
    quaternary: "#9CA3AF", // Light gray - quaternary text
    inverse: "#FFFFFF", // White text for dark backgrounds
    link: "#3B82F6", // Blue - links
    placeholder: "#9CA3AF", // Light gray - placeholder text
    disabled: "#D1D5DB", // Disabled text
    success: "#16A34A", // Green text for success
    warning: "#D97706", // Orange text for warnings
    error: "#DC2626", // Red text for errors
    muted: "#6B7280", // Muted text
  },

  // Border colors for light mode
  border: {
    primary: "#E5E7EB", // Light gray - primary borders
    secondary: "#F3F4F6", // Very light gray - secondary borders
    focus: "#3B82F6", // Blue - focused borders
    error: "#EF4444", // Red - error borders
    success: "#22C55E", // Green - success borders
    warning: "#F59E0B", // Orange - warning borders
    muted: "#F3F4F6", // Muted borders
  },

  // Therapeutic color palette based on Figma design specifications
  therapeutic: {
    // Empathy Orange - For warmth and connection (exact Figma match)
    empathy: {
      50: "#FFEEE2", // Orange 10 - Very light (exact Figma)
      100: "#FFC89E", // Orange 20 - Light (exact Figma)
      200: "#FFB374", // Orange 30 - Soft (exact Figma)
      300: "#F6A360", // Orange 40 - Medium light (exact Figma)
      400: "#ED7100", // Orange 50 - Medium (exact Figma)
      500: "#C96100", // Orange 60 - Main empathy color (exact Figma)
      600: "#AA5500", // Orange 70 - Darker (exact Figma)
      700: "#894700", // Orange 80 - Deep (exact Figma)
      800: "#663600", // Orange 90 - Very dark (exact Figma)
      900: "#2E1200", // Orange 100 - Darkest (exact Figma)
    },

    // Zen Yellow - For clarity and optimism (exact Figma match)
    zen: {
      50: "#FFF4E0", // Yellow 10 - Very light (exact Figma)
      100: "#FFE5BC", // Yellow 20 - Light
      200: "#FFD688", // Yellow 30 - Soft
      300: "#FFC65C", // Yellow 40 - Medium light
      400: "#FFB514", // Yellow 50 - Medium (exact Figma)
      500: "#EDA600", // Yellow 60 - Main zen color (exact Figma)
      600: "#A37A00", // Yellow 70 - Darker (exact Figma)
      700: "#705600", // Yellow 80 - Deep (exact Figma)
      800: "#4D3C00", // Yellow 90 - Very dark (exact Figma)
      900: "#2E2500", // Yellow 100 - Darkest (exact Figma)
    },

    // Kind Purple - For wisdom and spirituality (exact Figma match)  
    kind: {
      50: "#F4F0FF", // Purple 10 - Very light (exact Figma)
      100: "#E9DEFF", // Purple 20 - Light
      200: "#D5C4FF", // Purple 30 - Soft
      300: "#C0A5FF", // Purple 40 - Medium light
      400: "#A685FF", // Purple 50 - Medium
      500: "#8965FF", // Purple 60 - Main kind color
      600: "#6C53F3", // Purple 70 - Darker (exact Figma)
      700: "#5539CF", // Purple 80 - Deep
      800: "#292350", // Purple 90 - Very dark (exact Figma)
      900: "#1A1324", // Purple 100 - Darkest (exact Figma)
    },

    // Optimistic Gray - For balance and neutrality (exact Figma match)
    optimistic: {
      50: "#F5F5F5", // Gray 10 - Very light (exact Figma)
      100: "#E1E1E0", // Gray 20 - Light (exact Figma)
      200: "#C7C7C5", // Gray 30 - Soft
      300: "#ADADAA", // Gray 40 - Medium light
      400: "#929290", // Gray 50 - Medium
      500: "#738068", // Gray 60 - Main optimistic color
      600: "#5A554E", // Gray 70 - Darker (exact Figma)
      700: "#3F3C38", // Gray 80 - Deep
      800: "#242423", // Gray 90 - Very dark (exact Figma)
      900: "#161615", // Gray 100 - Darkest (exact Figma)
    },

    // Additional therapeutic colors referenced by components
    // Calming Blues - For peace and tranquility  
    calming: {
      50: "#F0F9FF", // Very light blue
      100: "#E0F2FE", // Light blue
      200: "#BAE6FD", // Soft blue
      300: "#7DD3FC", // Medium light blue
      400: "#38BDF8", // Medium blue
      500: "#0EA5E9", // Main calming color
      600: "#0284C7", // Darker blue
      700: "#0369A1", // Deep blue
      800: "#075985", // Very dark blue
      900: "#0C4A6E", // Darkest blue
    },

    // Nurturing Greens - For growth and healing
    nurturing: {
      50: "#ECFDF5", // Very light green
      100: "#D1FAE5", // Light green
      200: "#A7F3D0", // Soft green
      300: "#6EE7B7", // Medium light green
      400: "#34D399", // Medium green
      500: "#10B981", // Main nurturing color
      600: "#059669", // Darker green
      700: "#047857", // Deep green
      800: "#065F46", // Very dark green
      900: "#064E3B", // Darkest green
    },

    // Peaceful Grays - For serenity and balance
    peaceful: {
      50: "#F8FAFC", // Very light gray
      100: "#F1F5F9", // Light gray
      200: "#E2E8F0", // Soft gray
      300: "#CBD5E1", // Medium light gray
      400: "#94A3B8", // Medium gray
      500: "#64748B", // Main peaceful color
      600: "#475569", // Darker gray
      700: "#334155", // Deep gray
      800: "#1E293B", // Very dark gray
      900: "#0F172A", // Darkest gray
    },

    // Grounding Purples - For stability and wisdom
    grounding: {
      50: "#FAF5FF", // Very light purple
      100: "#F3E8FF", // Light purple
      200: "#E9D5FF", // Soft purple
      300: "#D8B4FE", // Medium light purple
      400: "#C084FC", // Medium purple
      500: "#A855F7", // Main grounding color
      600: "#9333EA", // Darker purple
      700: "#7C3AED", // Deep purple
      800: "#6B21A8", // Very dark purple
      900: "#581C87", // Darkest purple
    },

    // Energizing Oranges - For motivation and warmth
    energizing: {
      50: "#FFF7ED", // Very light orange
      100: "#FFEDD5", // Light orange
      200: "#FED7AA", // Soft orange
      300: "#FDBA74", // Medium light orange
      400: "#FB923C", // Medium orange
      500: "#F97316", // Main energizing color
      600: "#EA580C", // Darker orange
      700: "#C2410C", // Deep orange
      800: "#9A3412", // Very dark orange
      900: "#7C2D12", // Darkest orange
    },
  },

  // Enhanced Dark mode colors
  dark: {
    background: {
      primary: "#0F172A", // Deep midnight - main background
      secondary: "#1E293B", // Dark slate - secondary surfaces
      tertiary: "#334155", // Medium slate - tertiary surfaces
      quaternary: "#475569", // Lighter slate - special surfaces
      card: "#1E293B", // Card background
      modal: "#334155", // Modal background
      input: "#334155", // Input field background
      disabled: "#334155", // Disabled element background
      overlay: "rgba(0, 0, 0, 0.6)", // Semi-transparent overlay
      accent: "#1E293B", // Accent background
    },
    text: {
      primary: "#F8FAFC", // Light blue-white - primary text
      secondary: "#E2E8F0", // Light gray - secondary text
      tertiary: "#CBD5E1", // Medium gray - tertiary text
      quaternary: "#94A3B8", // Darker gray - quaternary text
      inverse: "#0F172A", // Dark for light backgrounds
      link: "#60A5FA", // Light blue - links
      placeholder: "#64748B", // Medium gray - placeholder text
      disabled: "#64748B", // Disabled text
      success: "#4ADE80", // Light green text for success
      warning: "#FBBF24", // Light orange text for warnings
      error: "#F87171", // Light red text for errors
      muted: "#64748B", // Muted text
    },
    border: {
      primary: "#475569", // Medium slate - primary borders
      secondary: "#334155", // Dark slate - secondary borders
      focus: "#60A5FA", // Light blue - focused borders
      error: "#F87171", // Light red - error borders
      success: "#4ADE80", // Light green - success borders
      warning: "#FBBF24", // Light orange - warning borders
      muted: "#334155", // Muted borders
    },
  },
};

// Enhanced typography system
export const typography = {
  fonts: {
    regular: "System",
    medium: "System",
    bold: "System",
    light: "System",
    // Add custom fonts here when available
    heading: "System", // For headings
    body: "System", // For body text
    mono: "System", // For monospace text
  },

  sizes: {
    xs: 10, // Extra small
    sm: 12, // Small
    base: 14, // Base/default
    lg: 16, // Large
    xl: 18, // Extra large
    "2xl": 20, // 2X large
    "3xl": 24, // 3X large
    "4xl": 28, // 4X large
    "5xl": 32, // 5X large
    "6xl": 36, // 6X large
    "7xl": 42, // 7X large
    "8xl": 48, // 8X large
  },

  lineHeights: {
    xs: 14, // Extra small
    sm: 16, // Small
    base: 20, // Base/default
    lg: 24, // Large
    xl: 28, // Extra large
    "2xl": 32, // 2X large
    "3xl": 36, // 3X large
    "4xl": 40, // 4X large
    "5xl": 44, // 5X large
    "6xl": 48, // 6X large
    "7xl": 52, // 7X large
    "8xl": 56, // 8X large
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
};

// Enhanced spacing system
export const spacing = {
  0: 0, // No spacing
  px: 1, // 1px
  0.5: 2, // 2px
  1: 4, // 4px
  1.5: 6, // 6px
  2: 8, // 8px
  2.5: 10, // 10px
  3: 12, // 12px
  3.5: 14, // 14px
  4: 16, // 16px
  5: 20, // 20px
  6: 24, // 24px
  7: 28, // 28px
  8: 32, // 32px
  9: 36, // 36px
  10: 40, // 40px
  11: 44, // 44px
  12: 48, // 48px
  14: 56, // 56px
  16: 64, // 64px
  20: 80, // 80px
  24: 96, // 96px
  28: 112, // 112px
  32: 128, // 128px
  36: 144, // 144px
  40: 160, // 160px
  44: 176, // 176px
  48: 192, // 192px
  52: 208, // 208px
  56: 224, // 224px
  60: 240, // 240px
  64: 256, // 256px
  72: 288, // 288px
  80: 320, // 320px
  96: 384, // 384px
};

// Enhanced border radius system
export const borderRadius = {
  none: 0, // No radius
  sm: 4, // Small radius
  base: 8, // Base radius
  md: 12, // Medium radius
  lg: 16, // Large radius
  xl: 24, // Extra large radius
  "2xl": 32, // 2X large radius
  "3xl": 48, // 3X large radius
  full: 9999, // Full radius (circle)
};

// Enhanced shadow system
export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 9,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  "2xl": {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 16,
  },
};

// Animation and transition values
export const animation = {
  timing: {
    fast: 150,
    base: 250,
    slow: 350,
    slower: 500,
  },
  easing: {
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
  },
};

// High contrast color palettes for accessibility
export const highContrastColors = {
  light: {
    background: {
      primary: "#FFFFFF", // Pure white
      secondary: "#F5F5F5", // Light gray
      tertiary: "#E0E0E0", // Medium gray
    },
    text: {
      primary: "#000000", // Pure black
      secondary: "#333333", // Dark gray
      tertiary: "#666666", // Medium gray
      inverse: "#FFFFFF", // Pure white
    },
    border: {
      light: "#000000", // Black borders
      medium: "#333333", // Dark gray borders
      heavy: "#000000", // Black borders
    },
  },
  dark: {
    background: {
      primary: "#000000", // Pure black
      secondary: "#1A1A1A", // Very dark gray
      tertiary: "#333333", // Dark gray
    },
    text: {
      primary: "#FFFFFF", // Pure white
      secondary: "#E0E0E0", // Light gray
      tertiary: "#CCCCCC", // Medium light gray
      inverse: "#000000", // Pure black
    },
    border: {
      light: "#FFFFFF", // White borders
      medium: "#E0E0E0", // Light gray borders
      heavy: "#FFFFFF", // White borders
    },
  },
};

// Breakpoints for responsive design
export const breakpoints = {
  sm: 640, // Small devices
  md: 768, // Medium devices
  lg: 1024, // Large devices
  xl: 1280, // Extra large devices
  "2xl": 1536, // 2X large devices
};

// Enhanced theme object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation,
  breakpoints,
};

// Light mode theme (default)
export const lightTheme = {
  ...theme,
  colors: {
    ...colors,
    // Override specific colors for light mode
    background: colors.background,
    text: colors.text,
    border: colors.border,
  },
};

// Dark mode theme
export const darkTheme = {
  ...theme,
  colors: {
    ...colors,
    // Override specific colors for dark mode
    background: colors.dark.background,
    text: colors.dark.text,
    border: colors.dark.border,
    // Keep other colors the same but with adjusted opacity for dark mode
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    mood: colors.mood,
    therapeutic: colors.therapeutic,
  },
};

// High contrast light theme
export const highContrastLightTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: {
      ...lightTheme.colors.background,
      ...highContrastColors.light.background,
    },
    text: {
      ...lightTheme.colors.text,
      ...highContrastColors.light.text,
    },
    border: {
      ...lightTheme.colors.border,
      ...highContrastColors.light.border,
    },
    // Enhanced contrast for interactive elements
    primary: {
      ...colors.primary,
      500: "#0066CC", // High contrast blue
    },
    error: {
      ...colors.error,
      500: "#CC0000", // High contrast red
    },
    success: {
      ...colors.success,
      500: "#006600", // High contrast green
    },
  },
};

// High contrast dark theme
export const highContrastDarkTheme = {
  ...darkTheme,
  colors: {
    ...darkTheme.colors,
    background: {
      ...darkTheme.colors.background,
      ...highContrastColors.dark.background,
    },
    text: {
      ...darkTheme.colors.text,
      ...highContrastColors.dark.text,
    },
    border: {
      ...darkTheme.colors.border,
      ...highContrastColors.dark.border,
    },
    // Enhanced contrast for interactive elements
    primary: {
      ...colors.primary,
      500: "#66B3FF", // High contrast light blue
    },
    error: {
      ...colors.error,
      500: "#FF6666", // High contrast light red
    },
    success: {
      ...colors.success,
      500: "#66FF66", // High contrast light green
    },
  },
};

// Export default theme (light mode)
export default lightTheme;
