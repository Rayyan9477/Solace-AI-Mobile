/**
 * Freud UI Kit Design System
 * Based on the Freud Mental Health App UI Kit
 * Implements therapeutic design patterns and mental health best practices
 */

export const FreudColors = {
  // Mindful Brown Palette
  mindfulBrown: {
    100: "#372315",
    90: "#372315",
    80: "#433422",
    70: "#714A53",
    60: "#926247",
    50: "#AC836C",
    40: "#C0A091",
    30: "#DDC2B8",
    20: "#E8DDD9",
    10: "#F7F4F2",
  },

  // Optimistic Gray Palette
  optimisticGray: {
    100: "#161515",
    90: "#292729",
    80: "#303030",
    70: "#5A5A5E",
    60: "#738066",
    50: "#926CB8",
    40: "#ACABA5",
    30: "#C9CBC5",
    20: "#E1E1E0",
    10: "#F5F5F5",
  },

  // Serenity Green Palette
  serenityGreen: {
    100: "#1F1E10",
    90: "#292919",
    80: "#304A26",
    70: "#5A6B38",
    60: "#7D9A4D",
    50: "#9BD658",
    40: "#B4C480",
    30: "#CFD955",
    20: "#E5EAD7",
    10: "#F2F5EB",
  },

  // Empathy Orange Palette
  empathyOrange: {
    100: "#2E1D00",
    90: "#432500",
    80: "#663600",
    70: "#894700",
    60: "#AA5500",
    50: "#C96900",
    40: "#ED7E1C",
    30: "#F6A360",
    20: "#FFC89E",
    10: "#FFF6E6",
  },

  // Zen Yellow Palette
  zenYellow: {
    100: "#2E2500",
    90: "#4D3C00",
    80: "#705600",
    70: "#A37A00",
    60: "#EDA600",
    50: "#FFB614",
    40: "#FFC55C",
    30: "#FFD88F",
    20: "#FFEBAC",
    10: "#FFF4E0",
  },

  // Kind Purple Palette
  kindPurple: {
    100: "#16135A",
    90: "#282550",
    80: "#3C357C",
    70: "#543A95",
    60: "#6C5FC8",
    50: "#8977E8",
    40: "#A695F5",
    30: "#C281FF",
    20: "#D5D0FF",
    10: "#EAEFFF",
  },
};

export const FreudTypography = {
  // Font Families
  fontFamily: {
    primary: "SF Pro Display", // iOS
    secondary: "Roboto", // Android
    mono: "SF Mono",
  },

  // Font Sizes
  sizes: {
    "4xl": 36,
    "3xl": 32,
    "2xl": 28,
    xl: 24,
    lg: 20,
    base: 16,
    sm: 14,
    xs: 12,
    "2xs": 10,
  },

  // Font Weights
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

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

export const FreudSpacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
};

export const FreudBorderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  full: 9999,
};

export const FreudShadows = {
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
};

export const FreudComponents = {
  // Button Styles
  button: {
    primary: {
      backgroundColor: FreudColors.mindfulBrown[90],
      borderRadius: FreudBorderRadius["2xl"],
      paddingVertical: FreudSpacing[3],
      paddingHorizontal: FreudSpacing[6],
      minHeight: 44,
      justifyContent: "center",
      alignItems: "center",
      ...FreudShadows.md,
    },
    secondary: {
      backgroundColor: FreudColors.serenityGreen[40],
      borderRadius: FreudBorderRadius["2xl"],
      paddingVertical: FreudSpacing[3],
      paddingHorizontal: FreudSpacing[6],
      minHeight: 44,
      justifyContent: "center",
      alignItems: "center",
      ...FreudShadows.sm,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: FreudColors.mindfulBrown[50],
      borderRadius: FreudBorderRadius["2xl"],
      paddingVertical: FreudSpacing[3],
      paddingHorizontal: FreudSpacing[6],
      minHeight: 44,
      justifyContent: "center",
      alignItems: "center",
    },
    ghost: {
      backgroundColor: "transparent",
      borderRadius: FreudBorderRadius.lg,
      paddingVertical: FreudSpacing[2],
      paddingHorizontal: FreudSpacing[4],
      minHeight: 36,
      justifyContent: "center",
      alignItems: "center",
    },
  },

  // Card Styles
  card: {
    primary: {
      backgroundColor: "#FFFFFF",
      borderRadius: FreudBorderRadius.xl,
      padding: FreudSpacing[4],
      ...FreudShadows.sm,
    },
    elevated: {
      backgroundColor: "#FFFFFF",
      borderRadius: FreudBorderRadius.xl,
      padding: FreudSpacing[5],
      ...FreudShadows.lg,
    },
    outlined: {
      backgroundColor: "#FFFFFF",
      borderRadius: FreudBorderRadius.xl,
      padding: FreudSpacing[4],
      borderWidth: 1,
      borderColor: FreudColors.optimisticGray[20],
      ...FreudShadows.xs,
    },
  },

  // Input Styles
  input: {
    primary: {
      backgroundColor: FreudColors.optimisticGray[10],
      borderRadius: FreudBorderRadius.lg,
      paddingVertical: FreudSpacing[3],
      paddingHorizontal: FreudSpacing[4],
      fontSize: FreudTypography.sizes.base,
      borderWidth: 1,
      borderColor: FreudColors.optimisticGray[30],
      minHeight: 48,
    },
    focused: {
      borderColor: FreudColors.serenityGreen[60],
      backgroundColor: "#FFFFFF",
      ...FreudShadows.sm,
    },
  },
};

export const FreudAnimations = {
  // Durations
  durations: {
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
  },

  // Easing
  easing: {
    easeInOut: "ease-in-out",
    easeIn: "ease-in",
    easeOut: "ease-out",
    linear: "linear",
  },

  // Presets
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 300,
  },
  slideUp: {
    from: { translateY: 20, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
    duration: 400,
  },
  scaleIn: {
    from: { scale: 0.95, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    duration: 300,
  },
};

// Theme variations
export const FreudThemes = {
  light: {
    colors: {
      primary: FreudColors.mindfulBrown[90],
      secondary: FreudColors.serenityGreen[60],
      tertiary: FreudColors.empathyOrange[50],
      background: {
        primary: "#FFFFFF",
        secondary: FreudColors.optimisticGray[10],
        tertiary: FreudColors.serenityGreen[10],
      },
      text: {
        primary: FreudColors.mindfulBrown[90],
        secondary: FreudColors.optimisticGray[70],
        tertiary: FreudColors.optimisticGray[50],
        inverse: "#FFFFFF",
      },
      border: {
        primary: FreudColors.optimisticGray[20],
        secondary: FreudColors.optimisticGray[30],
      },
      status: {
        success: FreudColors.serenityGreen[60],
        warning: FreudColors.zenYellow[50],
        error: FreudColors.empathyOrange[60],
        info: FreudColors.kindPurple[60],
      },
    },
  },

  dark: {
    colors: {
      primary: FreudColors.mindfulBrown[40],
      secondary: FreudColors.serenityGreen[50],
      tertiary: FreudColors.empathyOrange[40],
      background: {
        primary: FreudColors.optimisticGray[100],
        secondary: FreudColors.optimisticGray[90],
        tertiary: FreudColors.mindfulBrown[100],
      },
      text: {
        primary: FreudColors.optimisticGray[10],
        secondary: FreudColors.optimisticGray[30],
        tertiary: FreudColors.optimisticGray[50],
        inverse: FreudColors.mindfulBrown[90],
      },
      border: {
        primary: FreudColors.optimisticGray[80],
        secondary: FreudColors.optimisticGray[70],
      },
      status: {
        success: FreudColors.serenityGreen[50],
        warning: FreudColors.zenYellow[40],
        error: FreudColors.empathyOrange[50],
        info: FreudColors.kindPurple[50],
      },
    },
  },
};

export default {
  colors: FreudColors,
  typography: FreudTypography,
  spacing: FreudSpacing,
  borderRadius: FreudBorderRadius,
  shadows: FreudShadows,
  components: FreudComponents,
  animations: FreudAnimations,
  themes: FreudThemes,
};
