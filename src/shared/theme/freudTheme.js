/**
 * Freud Design System Theme
 * Based on the official Freud UI Kit design references
 * Color palette includes: Mindful Brown, Optimistic Gray, Serenity Green,
 * Empathy Orange, Zen Yellow, Kind Purple
 */

export const freudColors = {
  // Mindful Brown - Grounding colors
  brown: {
    100: "#372315", // Brown 100
    90: "#372315", // Brown 90
    80: "#433422", // Brown 80
    70: "#714A53", // Brown 70
    60: "#92E247", // Brown 60
    50: "#ACB6AC", // Brown 50
    40: "#C0AD91", // Brown 40
    30: "#DDC2BB", // Brown 30
    20: "#E8DCE9", // Brown 20
    10: "#F7AF2", // Brown 10
  },

  // Optimistic Gray - Balance and neutrality
  gray: {
    100: "#161513", // Gray 100
    90: "#242129", // Gray 90
    80: "#3C3C36", // Gray 80
    70: "#5A5A4E", // Gray 70
    60: "#788866", // Gray 60
    50: "#928DA8", // Gray 50
    40: "#ACAAA8", // Gray 40
    30: "#C4C7C5", // Gray 30
    20: "#E1E1E0", // Gray 20
    10: "#F5F5F5", // Gray 10
  },

  // Serenity Green - Calming and growth
  green: {
    100: "#1F1E10", // Green 100
    90: "#29321A", // Green 90
    80: "#304A26", // Green 80
    70: "#5A683B", // Green 70
    60: "#7D944D", // Green 60
    50: "#98BD68", // Green 50
    40: "#B4C4BD", // Green 40
    30: "#CF0985", // Green 30
    20: "#E5EAD7", // Green 20
    10: "#F2F5E8", // Green 10
  },

  // Empathy Orange - Warmth and energy
  orange: {
    100: "#2E1D00", // Orange 100
    90: "#452500", // Orange 90
    80: "#663600", // Orange 80
    70: "#894700", // Orange 70
    60: "#AA5500", // Orange 60
    50: "#C96100", // Orange 50
    40: "#ED7C1C", // Orange 40
    30: "#F6A360", // Orange 30
    20: "#FFC89E", // Orange 20
    10: "#FFEEE2", // Orange 10
  },

  // Zen Yellow - Positivity and clarity
  yellow: {
    100: "#2E2500", // Yellow 100
    90: "#4D3C00", // Yellow 90
    80: "#705600", // Yellow 80
    70: "#A37A00", // Yellow 70
    60: "#E0A600", // Yellow 60
    50: "#FFB31A", // Yellow 50
    40: "#FFC55C", // Yellow 40
    30: "#FFD88F", // Yellow 30
    20: "#FFENC2", // Yellow 20
    10: "#FFF4E0", // Yellow 10
  },

  // Kind Purple - Wisdom and spirituality
  purple: {
    100: "#161254", // Purple 100
    90: "#292350", // Purple 90
    80: "#3C357C", // Purple 80
    70: "#544996", // Purple 70
    60: "#6C58C3", // Purple 80
    50: "#8279E3", // Purple 50
    40: "#9A94F5", // Purple 40
    30: "#C2B1FF", // Purple 30
    20: "#D5D0FF", // Purple 20
    10: "#F4F4FF", // Purple 10
  },

  // Semantic colors
  primary: "#433422", // Brown 80 - Primary brand
  secondary: "#98BD68", // Green 50 - Secondary actions
  accent: "#ED7C1C", // Orange 40 - Accent/highlights
  success: "#7D944D", // Green 60 - Success states
  warning: "#FFB31A", // Yellow 50 - Warning states
  error: "#C96100", // Orange 50 - Error states
  info: "#8279E3", // Purple 50 - Info states

  // Text colors
  text: {
    primary: "#161513", // Gray 100 - Primary text
    secondary: "#3C3C36", // Gray 80 - Secondary text
    tertiary: "#5A5A4E", // Gray 70 - Tertiary text
    disabled: "#928DA8", // Gray 50 - Disabled text
    inverse: "#F5F5F5", // Gray 10 - Text on dark backgrounds
  },

  // Background colors
  background: {
    primary: "#FFFFFF", // White - Main background
    secondary: "#F5F5F5", // Gray 10 - Secondary background
    tertiary: "#E1E1E0", // Gray 20 - Tertiary background
    surface: "#FFFFFF", // White - Card/surface background
    overlay: "rgba(22, 21, 19, 0.6)", // Overlay background
  },

  // Border colors
  border: {
    primary: "#E1E1E0", // Gray 20 - Primary borders
    secondary: "#C4C7C5", // Gray 30 - Secondary borders
    focus: "#8279E3", // Purple 50 - Focus states
  },
};

export const freudTypography = {
  // Font family - Urbanist as per design system
  fontFamily: {
    primary: "Urbanist",
    secondary: "System",
  },

  // Font sizes based on design system
  fontSize: {
    // Display sizes
    displayLg: 72, // Display Large
    displayMd: 64, // Display Medium
    displaySm: 56, // Display Small

    // Heading sizes
    heading2xl: 48, // Heading 2xl
    headingXl: 32, // Heading xl
    headingLg: 24, // Heading lg
    headingMd: 20, // Heading md
    headingSm: 18, // Heading sm
    headingXs: 16, // Heading xs

    // Text sizes
    textXl: 20, // Text xl
    textLg: 18, // Text lg
    textMd: 16, // Text md (base)
    textSm: 14, // Text sm
    textXs: 12, // Text xs
  },

  // Font weights
  fontWeight: {
    extrabold: "800",
    bold: "700",
    semibold: "600",
    medium: "500",
    regular: "400",
    light: "300",
  },

  // Line heights
  lineHeight: {
    displayLg: 88,
    displayMd: 76,
    displaySm: 68,
    heading2xl: 56,
    headingXl: 40,
    headingLg: 32,
    headingMd: 28,
    headingSm: 26,
    headingXs: 24,
    textXl: 28,
    textLg: 26,
    textMd: 24,
    textSm: 20,
    textXs: 18,
  },
};

export const freudSpacing = {
  // Spacing scale (4px base unit)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 56,
  "7xl": 64,
  "8xl": 80,
  "9xl": 96,
  "10xl": 128,
};

export const freudRadii = {
  // Border radius scale
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 9999,
};

export const freudShadows = {
  // Shadow system
  none: "none",
  sm: "0 1px 2px rgba(22, 21, 19, 0.05)",
  md: "0 4px 6px rgba(22, 21, 19, 0.07), 0 2px 4px rgba(22, 21, 19, 0.06)",
  lg: "0 10px 15px rgba(22, 21, 19, 0.1), 0 4px 6px rgba(22, 21, 19, 0.05)",
  xl: "0 20px 25px rgba(22, 21, 19, 0.1), 0 8px 10px rgba(22, 21, 19, 0.04)",
  "2xl": "0 25px 50px rgba(22, 21, 19, 0.25)",
  inner: "inset 0 2px 4px rgba(22, 21, 19, 0.06)",
};

// Main theme object
export const freudTheme = {
  colors: freudColors,
  typography: freudTypography,
  spacing: freudSpacing,
  radii: freudRadii,
  shadows: freudShadows,

  // Component-specific styles
  components: {
    button: {
      primary: {
        backgroundColor: freudColors.brown[80],
        color: freudColors.text.inverse,
        borderRadius: freudRadii["2xl"],
        paddingHorizontal: freudSpacing.xl,
        paddingVertical: freudSpacing.md,
        fontSize: freudTypography.fontSize.textMd,
        fontWeight: freudTypography.fontWeight.semibold,
      },
      secondary: {
        backgroundColor: freudColors.brown[20],
        color: freudColors.text.primary,
        borderRadius: freudRadii["2xl"],
        paddingHorizontal: freudSpacing.xl,
        paddingVertical: freudSpacing.md,
        fontSize: freudTypography.fontSize.textMd,
        fontWeight: freudTypography.fontWeight.semibold,
      },
      outline: {
        backgroundColor: "transparent",
        color: freudColors.text.primary,
        borderWidth: 1,
        borderColor: freudColors.border.primary,
        borderRadius: freudRadii["2xl"],
        paddingHorizontal: freudSpacing.xl,
        paddingVertical: freudSpacing.md,
        fontSize: freudTypography.fontSize.textMd,
        fontWeight: freudTypography.fontWeight.semibold,
      },
      accent: {
        backgroundColor: freudColors.orange[40],
        color: freudColors.text.inverse,
        borderRadius: freudRadii["2xl"],
        paddingHorizontal: freudSpacing.xl,
        paddingVertical: freudSpacing.md,
        fontSize: freudTypography.fontSize.textMd,
        fontWeight: freudTypography.fontWeight.semibold,
      },
    },
    card: {
      backgroundColor: freudColors.background.surface,
      borderRadius: freudRadii.xl,
      padding: freudSpacing.lg,
      shadowColor: freudColors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    input: {
      backgroundColor: freudColors.background.secondary,
      borderRadius: freudRadii.lg,
      paddingHorizontal: freudSpacing.lg,
      paddingVertical: freudSpacing.md,
      fontSize: freudTypography.fontSize.textMd,
      borderWidth: 1,
      borderColor: freudColors.border.primary,
    },
  },
};

export default freudTheme;
