// Freud Design System Color Palette
// Based on therapeutic color psychology for mental health applications
// Complete implementation of the design system color palette

export const FreudColorPalette = {
  // Mindful Brown - Grounding and Stability
  mindfulBrown: {
    100: "#372218",
    90: "#372218",
    80: "#4F3422",
    70: "#704A53",
    60: "#926247",
    50: "#AC836C",
    40: "#C0A091",
    30: "#D6C28B",
    20: "#E8DCD9",
    10: "#F7F4F2",
  },

  // Optimistic Gray - Balance and Calm
  optimisticGray: {
    100: "#161513",
    90: "#242123",
    80: "#3F3C38",
    70: "#5A564E",
    60: "#738666",
    50: "#926C65",
    40: "#ACA7A5",
    30: "#C1C7C5",
    20: "#E1E2E0",
    10: "#F3F3F3",
  },

  // Serenity Green - Growth and Healing
  serenityGreen: {
    100: "#1F1E10",
    90: "#29321A",
    80: "#304A26",
    70: "#5A6638",
    60: "#7DD44D",
    50: "#95BD66",
    40: "#B4C480",
    30: "#CF0985",
    20: "#E5EAD7",
    10: "#F2F5E8",
  },

  // Empathy Orange - Warmth and Connection
  empathyOrange: {
    100: "#2E1D00",
    90: "#435200",
    80: "#663600",
    70: "#894700",
    60: "#AA5500",
    50: "#C96900",
    40: "#ED7E1C",
    30: "#F6A360",
    20: "#FFC89E",
    10: "#FFEF2",
  },

  // Zen Yellow - Energy and Optimism
  zenYellow: {
    100: "#2E2500",
    90: "#4D3C00",
    80: "#705600",
    70: "#A37A00",
    60: "#EADA00",
    50: "#FFEB1A",
    40: "#FFEC5C",
    30: "#FFD88F",
    20: "#FFEBBC",
    10: "#FFF4E0",
  },

  // Kind Purple - Creativity and Wisdom
  kindPurple: {
    100: "#1A1354",
    90: "#292350",
    80: "#3C357C",
    70: "#5349A5",
    60: "#6C5FC3",
    50: "#8978F3",
    40: "#A695F5",
    30: "#C2B1FF",
    20: "#D500FF",
    10: "#F4F1FF",
  },

  // Therapeutic Color Aliases - Easy-to-use semantic colors
  therapeutic: {
    // Calming - For anxiety relief and peace
    calming: {
      50: "#F2F5E8", // serenityGreen[10]
      100: "#E5EAD7", // serenityGreen[20]
      200: "#CF0985", // serenityGreen[30]
      300: "#B4C480", // serenityGreen[40]
      400: "#95BD66", // serenityGreen[50]
      500: "#7DD44D", // serenityGreen[60] - Primary
      600: "#5A6638", // serenityGreen[70]
      700: "#304A26", // serenityGreen[80]
      800: "#29321A", // serenityGreen[90]
      900: "#1F1E10", // serenityGreen[100]
    },

    // Nurturing - For support and comfort
    nurturing: {
      50: "#F7F4F2", // mindfulBrown[10]
      100: "#E8DCD9", // mindfulBrown[20]
      200: "#D6C28B", // mindfulBrown[30]
      300: "#C0A091", // mindfulBrown[40]
      400: "#AC836C", // mindfulBrown[50]
      500: "#926247", // mindfulBrown[60] - Primary
      600: "#704A53", // mindfulBrown[70]
      700: "#4F3422", // mindfulBrown[80]
      800: "#372218", // mindfulBrown[90]
      900: "#372218", // mindfulBrown[100]
    },

    // Peaceful - For meditation and tranquility
    peaceful: {
      50: "#F3F3F3", // optimisticGray[10]
      100: "#E1E2E0", // optimisticGray[20]
      200: "#C1C7C5", // optimisticGray[30]
      300: "#ACA7A5", // optimisticGray[40]
      400: "#926C65", // optimisticGray[50]
      500: "#738666", // optimisticGray[60] - Primary
      600: "#5A564E", // optimisticGray[70]
      700: "#3F3C38", // optimisticGray[80]
      800: "#242123", // optimisticGray[90]
      900: "#161513", // optimisticGray[100]
    },

    // Grounding - For stability and focus
    grounding: {
      50: "#F4F1FF", // kindPurple[10]
      100: "#D500FF", // kindPurple[20]
      200: "#C2B1FF", // kindPurple[30]
      300: "#A695F5", // kindPurple[40]
      400: "#8978F3", // kindPurple[50]
      500: "#6C5FC3", // kindPurple[60] - Primary
      600: "#5349A5", // kindPurple[70]
      700: "#3C357C", // kindPurple[80]
      800: "#292350", // kindPurple[90]
      900: "#1A1354", // kindPurple[100]
    },

    // Energizing - For motivation and action
    energizing: {
      50: "#FFEF2", // empathyOrange[10]
      100: "#FFC89E", // empathyOrange[20]
      200: "#F6A360", // empathyOrange[30]
      300: "#ED7E1C", // empathyOrange[40]
      400: "#C96900", // empathyOrange[50]
      500: "#AA5500", // empathyOrange[60] - Primary
      600: "#894700", // empathyOrange[70]
      700: "#663600", // empathyOrange[80]
      800: "#435200", // empathyOrange[90]
      900: "#2E1D00", // empathyOrange[100]
    },

    // Optimistic - For hope and positivity
    optimistic: {
      50: "#FFF4E0", // zenYellow[10]
      100: "#FFEBBC", // zenYellow[20]
      200: "#FFD88F", // zenYellow[30]
      300: "#FFEC5C", // zenYellow[40]
      400: "#FFEB1A", // zenYellow[50]
      500: "#EADA00", // zenYellow[60] - Primary
      600: "#A37A00", // zenYellow[70]
      700: "#705600", // zenYellow[80]
      800: "#4D3C00", // zenYellow[90]
      900: "#2E2500", // zenYellow[100]
    },
  },

  // Semantic Color System
  semantic: {
    primary: {
      50: "#F2F5E8",
      100: "#E5EAD7",
      200: "#CF0985",
      300: "#B4C480",
      400: "#95BD66",
      500: "#7DD44D", // Primary brand color
      600: "#5A6638",
      700: "#304A26",
      800: "#29321A",
      900: "#1F1E10",
    },

    secondary: {
      50: "#F7F4F2",
      100: "#E8DCD9",
      200: "#D6C28B",
      300: "#C0A091",
      400: "#AC836C",
      500: "#926247", // Secondary brand color
      600: "#704A53",
      700: "#4F3422",
      800: "#372218",
      900: "#372218",
    },

    success: {
      50: "#F2F5E8",
      500: "#7DD44D",
      600: "#5A6638",
      700: "#304A26",
    },

    warning: {
      50: "#FFF4E0",
      500: "#EADA00",
      600: "#A37A00",
      700: "#705600",
    },

    error: {
      50: "#FFEF2",
      500: "#ED7E1C",
      600: "#C96900",
      700: "#894700",
    },

    info: {
      50: "#F4F1FF",
      500: "#6C5FC3",
      600: "#5349A5",
      700: "#3C357C",
    },
  },
};

// Theme Mode Configurations
export const LightTheme = {
  colors: {
    // Background System
    background: {
      primary: FreudColorPalette.optimisticGray[10], // #F3F3F3
      secondary: FreudColorPalette.mindfulBrown[10], // #F7F4F2
      tertiary: FreudColorPalette.serenityGreen[10], // #F2F5E8
      card: "#FFFFFF",
      modal: "#FFFFFF",
      overlay: "rgba(0,0,0,0.5)",
    },

    // Text System
    text: {
      primary: FreudColorPalette.mindfulBrown[100], // #372218
      secondary: FreudColorPalette.optimisticGray[70], // #5A564E
      tertiary: FreudColorPalette.optimisticGray[60], // #738666
      inverse: "#FFFFFF",
      link: FreudColorPalette.therapeutic.grounding[500],
      placeholder: FreudColorPalette.optimisticGray[50],
    },

    // Border System
    border: {
      primary: FreudColorPalette.optimisticGray[30], // #C1C7C5
      secondary: FreudColorPalette.optimisticGray[20], // #E1E2E0
      focus: FreudColorPalette.therapeutic.calming[500],
      error: FreudColorPalette.semantic.error[500],
    },

    // Interactive System
    primary: FreudColorPalette.therapeutic.calming,
    secondary: FreudColorPalette.therapeutic.nurturing,

    // Status Colors
    success: FreudColorPalette.semantic.success,
    warning: FreudColorPalette.semantic.warning,
    error: FreudColorPalette.semantic.error,
    info: FreudColorPalette.semantic.info,

    // Therapeutic Colors
    therapeutic: FreudColorPalette.therapeutic,

    // Complete Palette Access
    palette: FreudColorPalette,
  },
};

export const DarkTheme = {
  colors: {
    // Background System - Inverted for dark mode
    background: {
      primary: FreudColorPalette.mindfulBrown[100], // #372218
      secondary: FreudColorPalette.optimisticGray[100], // #161513
      tertiary: FreudColorPalette.serenityGreen[100], // #1F1E10
      card: FreudColorPalette.optimisticGray[90], // #242123
      modal: FreudColorPalette.mindfulBrown[90], // #372218
      overlay: "rgba(0,0,0,0.8)",
    },

    // Text System - Inverted for dark mode
    text: {
      primary: FreudColorPalette.mindfulBrown[10], // #F7F4F2
      secondary: FreudColorPalette.optimisticGray[30], // #C1C7C5
      tertiary: FreudColorPalette.optimisticGray[40], // #ACA7A5
      inverse: FreudColorPalette.mindfulBrown[100], // #372218
      link: FreudColorPalette.therapeutic.grounding[300],
      placeholder: FreudColorPalette.optimisticGray[60],
    },

    // Border System - Adjusted for dark mode
    border: {
      primary: FreudColorPalette.optimisticGray[70], // #5A564E
      secondary: FreudColorPalette.optimisticGray[80], // #3F3C38
      focus: FreudColorPalette.therapeutic.calming[400],
      error: FreudColorPalette.semantic.error[400],
    },

    // Interactive System - Same therapeutic colors
    primary: FreudColorPalette.therapeutic.calming,
    secondary: FreudColorPalette.therapeutic.nurturing,

    // Status Colors - Adjusted for dark mode
    success: {
      ...FreudColorPalette.semantic.success,
      500: FreudColorPalette.therapeutic.calming[400],
    },
    warning: {
      ...FreudColorPalette.semantic.warning,
      500: FreudColorPalette.therapeutic.optimistic[400],
    },
    error: {
      ...FreudColorPalette.semantic.error,
      500: FreudColorPalette.therapeutic.energizing[400],
    },
    info: {
      ...FreudColorPalette.semantic.info,
      500: FreudColorPalette.therapeutic.grounding[400],
    },

    // Therapeutic Colors - Same as light mode
    therapeutic: FreudColorPalette.therapeutic,

    // Complete Palette Access
    palette: FreudColorPalette,
  },
};

// Utility Functions for Dynamic Theming
export const getTherapeuticColor = (colorName, shade = 500, isDark = false) => {
  const color = FreudColorPalette.therapeutic[colorName];
  if (!color) return FreudColorPalette.therapeutic.calming[500];

  // Adjust shade for dark mode
  if (isDark && shade > 500) {
    const adjustedShade = Math.max(100, shade - 200);
    return color[adjustedShade] || color[500];
  }

  return color[shade] || color[500];
};

export const getSemanticColor = (colorName, shade = 500, isDark = false) => {
  const theme = isDark ? DarkTheme : LightTheme;
  const color = theme.colors[colorName];

  if (typeof color === "object" && color[shade]) {
    return color[shade];
  }

  return color || theme.colors.primary[500];
};

// Export default theme configuration
export default {
  light: LightTheme,
  dark: DarkTheme,
  palette: FreudColorPalette,
  utils: {
    getTherapeuticColor,
    getSemanticColor,
  },
};
