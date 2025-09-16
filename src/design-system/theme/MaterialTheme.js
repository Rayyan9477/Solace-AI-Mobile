import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

const therapeuticColors = {
  mindfulBrown: {
    100: "#372318",
    90: "#372318",
    80: "#4F3422",
    70: "#714A33",
    60: "#926247",
    50: "#AC8560",
    40: "#C0AD91",
    30: "#DDC2B8",
    20: "#E8DDD9",
    10: "#F7F4F2",
  },
  optimisticGray: {
    100: "#1B1B1B",
    90: "#242423",
    80: "#3F3C38",
    70: "#5A564E",
    60: "#738686",
    50: "#926B88",
    40: "#AC8FA8",
    30: "#C7C7C5",
    20: "#E1E1E0",
    10: "#F5F5F5",
  },
  serenityGreen: {
    100: "#1F1E10",
    90: "#293A1A",
    80: "#3D4A26",
    70: "#5A6B38",
    60: "#7D944D",
    50: "#98BD68",
    40: "#B4C480",
    30: "#CFF0B5",
    20: "#E5EAD7",
    10: "#F2F5EB",
  },
  empathyOrange: {
    100: "#2E1900",
    90: "#432500",
    80: "#663600",
    70: "#894700",
    60: "#AA5500",
    50: "#C96100",
    40: "#ED7E1C",
    30: "#F6A360",
    20: "#FFC89E",
    10: "#FFEEE2",
  },
  zenYellow: {
    100: "#2E2500",
    90: "#4D3C00",
    80: "#705600",
    70: "#A37A00",
    60: "#EDA500",
    50: "#FFB51A",
    40: "#FFC95C",
    30: "#FFDB8F",
    20: "#FFED3C",
    10: "#FFF4E0",
  },
  kindPurple: {
    100: "#1A1324",
    90: "#292350",
    80: "#3C357C",
    70: "#544996",
    60: "#6C5FC3",
    50: "#8973C3",
    40: "#A693F3",
    30: "#C2B5FF",
    20: "#D5D0FF",
    10: "#EAE7FF",
  },
};

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: therapeuticColors.serenityGreen[60],
    primaryContainer: therapeuticColors.serenityGreen[20],
    onPrimary: therapeuticColors.serenityGreen[10],
    onPrimaryContainer: therapeuticColors.serenityGreen[100],

    secondary: therapeuticColors.empathyOrange[60],
    secondaryContainer: therapeuticColors.empathyOrange[20],
    onSecondary: therapeuticColors.empathyOrange[10],
    onSecondaryContainer: therapeuticColors.empathyOrange[100],

    tertiary: therapeuticColors.kindPurple[60],
    tertiaryContainer: therapeuticColors.kindPurple[20],
    onTertiary: therapeuticColors.kindPurple[10],
    onTertiaryContainer: therapeuticColors.kindPurple[100],

    surface: therapeuticColors.optimisticGray[10],
    surfaceVariant: therapeuticColors.optimisticGray[20],
    surfaceContainer: therapeuticColors.optimisticGray[20],
    surfaceContainerHigh: therapeuticColors.optimisticGray[30],
    surfaceContainerHighest: therapeuticColors.optimisticGray[40],
    onSurface: therapeuticColors.optimisticGray[100],
    onSurfaceVariant: therapeuticColors.optimisticGray[80],

    background: therapeuticColors.optimisticGray[10],
    onBackground: therapeuticColors.optimisticGray[100],

    outline: therapeuticColors.optimisticGray[50],
    outlineVariant: therapeuticColors.optimisticGray[30],

    error: "#BA1A1A",
    errorContainer: "#FFDAD6",
    onError: "#FFFFFF",
    onErrorContainer: "#410002",

    // Custom therapeutic colors
    mindfulBrown: therapeuticColors.mindfulBrown,
    optimisticGray: therapeuticColors.optimisticGray,
    serenityGreen: therapeuticColors.serenityGreen,
    empathyOrange: therapeuticColors.empathyOrange,
    zenYellow: therapeuticColors.zenYellow,
    kindPurple: therapeuticColors.kindPurple,

    // Semantic colors for mental health
    calm: therapeuticColors.serenityGreen[40],
    stress: therapeuticColors.empathyOrange[50],
    anxiety: therapeuticColors.zenYellow[50],
    depression: therapeuticColors.kindPurple[40],
    positive: therapeuticColors.serenityGreen[60],
    negative: therapeuticColors.empathyOrange[70],
  },
  fonts: {
    headingExtraLarge: {
      fontFamily: "Urbanist-ExtraBold",
      fontSize: 57,
      lineHeight: 64,
      letterSpacing: -0.25,
    },
    headingLarge: {
      fontFamily: "Urbanist-Bold",
      fontSize: 45,
      lineHeight: 52,
      letterSpacing: 0,
    },
    headingMedium: {
      fontFamily: "Urbanist-SemiBold",
      fontSize: 36,
      lineHeight: 44,
      letterSpacing: 0,
    },
    headingSmall: {
      fontFamily: "Urbanist-SemiBold",
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: 0,
    },
    bodyLarge: {
      fontFamily: "Urbanist",
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    bodyMedium: {
      fontFamily: "Urbanist",
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.25,
    },
    bodySmall: {
      fontFamily: "Urbanist",
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
    labelLarge: {
      fontFamily: "Urbanist-SemiBold",
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0.1,
    },
    labelMedium: {
      fontFamily: "Urbanist-Medium",
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
    labelSmall: {
      fontFamily: "Urbanist-Medium",
      fontSize: 11,
      lineHeight: 16,
      letterSpacing: 0.5,
    },
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: therapeuticColors.serenityGreen[40],
    primaryContainer: therapeuticColors.serenityGreen[90],
    onPrimary: therapeuticColors.serenityGreen[100],
    onPrimaryContainer: therapeuticColors.serenityGreen[20],

    secondary: therapeuticColors.empathyOrange[40],
    secondaryContainer: therapeuticColors.empathyOrange[90],
    onSecondary: therapeuticColors.empathyOrange[100],
    onSecondaryContainer: therapeuticColors.empathyOrange[20],

    tertiary: therapeuticColors.kindPurple[40],
    tertiaryContainer: therapeuticColors.kindPurple[90],
    onTertiary: therapeuticColors.kindPurple[100],
    onTertiaryContainer: therapeuticColors.kindPurple[20],

    surface: therapeuticColors.optimisticGray[100],
    surfaceVariant: therapeuticColors.optimisticGray[90],
    surfaceContainer: therapeuticColors.optimisticGray[90],
    surfaceContainerHigh: therapeuticColors.optimisticGray[80],
    surfaceContainerHighest: therapeuticColors.optimisticGray[70],
    onSurface: therapeuticColors.optimisticGray[10],
    onSurfaceVariant: therapeuticColors.optimisticGray[30],

    background: therapeuticColors.optimisticGray[100],
    onBackground: therapeuticColors.optimisticGray[10],

    outline: therapeuticColors.optimisticGray[60],
    outlineVariant: therapeuticColors.optimisticGray[80],

    error: "#FFB4AB",
    errorContainer: "#93000A",
    onError: "#690005",
    onErrorContainer: "#FFDAD6",

    // Custom therapeutic colors
    mindfulBrown: therapeuticColors.mindfulBrown,
    optimisticGray: therapeuticColors.optimisticGray,
    serenityGreen: therapeuticColors.serenityGreen,
    empathyOrange: therapeuticColors.empathyOrange,
    zenYellow: therapeuticColors.zenYellow,
    kindPurple: therapeuticColors.kindPurple,

    // Semantic colors for mental health (dark mode)
    calm: therapeuticColors.serenityGreen[30],
    stress: therapeuticColors.empathyOrange[40],
    anxiety: therapeuticColors.zenYellow[40],
    depression: therapeuticColors.kindPurple[30],
    positive: therapeuticColors.serenityGreen[50],
    negative: therapeuticColors.empathyOrange[60],
  },
  fonts: lightTheme.fonts,
};

export { lightTheme, darkTheme, therapeuticColors };
