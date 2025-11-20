/**
 * Typography System
 * Comprehensive typography constants for consistent text styling
 */

import { TextStyle } from "react-native";

// ==================== FONT FAMILIES ====================
export const fontFamilies = {
  regular: "System",
  medium: "System",
  semiBold: "System",
  bold: "System",
  light: "System",
  // Custom fonts can be added here
  // regular: "Inter-Regular",
  // medium: "Inter-Medium",
  // semiBold: "Inter-SemiBold",
  // bold: "Inter-Bold",
  // light: "Inter-Light",
} as const;

// ==================== FONT SIZES ====================
export const fontSizes = {
  // Headings
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,

  // Body text
  xlarge: 18,
  large: 16,
  medium: 14,
  small: 12,
  xsmall: 10,

  // Display sizes
  display1: 48,
  display2: 40,
  display3: 36,

  // Special purpose
  title: 20,
  subtitle: 16,
  body: 14,
  caption: 12,
  button: 14,
  label: 12,
  helper: 10,
} as const;

// ==================== LINE HEIGHTS ====================
export const lineHeights = {
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
} as const;

// ==================== FONT WEIGHTS ====================
export const fontWeights = {
  light: "300" as TextStyle["fontWeight"],
  regular: "400" as TextStyle["fontWeight"],
  medium: "500" as TextStyle["fontWeight"],
  semiBold: "600" as TextStyle["fontWeight"],
  bold: "700" as TextStyle["fontWeight"],
  extraBold: "800" as TextStyle["fontWeight"],
  black: "900" as TextStyle["fontWeight"],
} as const;

// ==================== LETTER SPACING ====================
export const letterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
} as const;

// ==================== TEXT STYLES ====================
export const textStyles = {
  // Display styles
  displayLarge: {
    fontSize: fontSizes.display1,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.display1 * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  displayMedium: {
    fontSize: fontSizes.display2,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.display2 * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  displaySmall: {
    fontSize: fontSizes.display3,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.display3 * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Heading styles
  h1: {
    fontSize: fontSizes.h1,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.h1 * lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  h2: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.h2 * lineHeights.snug,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  h3: {
    fontSize: fontSizes.h3,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.h3 * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  h4: {
    fontSize: fontSizes.h4,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.h4 * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  h5: {
    fontSize: fontSizes.h5,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.h5 * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  h6: {
    fontSize: fontSizes.h6,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.h6 * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  // Body text styles
  bodyLarge: {
    fontSize: fontSizes.large,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.large * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  bodyMedium: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.medium * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  bodySmall: {
    fontSize: fontSizes.small,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.small * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  // Label styles
  labelLarge: {
    fontSize: fontSizes.label,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.label * lineHeights.snug,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  labelMedium: {
    fontSize: fontSizes.small,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.small * lineHeights.snug,
    letterSpacing: letterSpacing.wider,
  } as TextStyle,

  labelSmall: {
    fontSize: fontSizes.xsmall,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.xsmall * lineHeights.snug,
    letterSpacing: letterSpacing.widest,
  } as TextStyle,

  // Button styles
  buttonLarge: {
    fontSize: fontSizes.button,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.button * lineHeights.snug,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  buttonMedium: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.medium * lineHeights.snug,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  buttonSmall: {
    fontSize: fontSizes.small,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.small * lineHeights.snug,
    letterSpacing: letterSpacing.wider,
  } as TextStyle,

  // Caption styles
  caption: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.caption * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  captionBold: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.caption * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  // Helper text
  helper: {
    fontSize: fontSizes.helper,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.helper * lineHeights.normal,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  // Link styles
  link: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.medium * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
    textDecorationLine: "underline" as TextStyle["textDecorationLine"],
  } as TextStyle,

  // Special purpose
  title: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.title * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  subtitle: {
    fontSize: fontSizes.subtitle,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.subtitle * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Mood tracking specific
  moodLabel: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.medium * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  moodValue: {
    fontSize: fontSizes.display1,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.display1 * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  // Dashboard specific
  metricLabel: {
    fontSize: fontSizes.small,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.small * lineHeights.snug,
    letterSpacing: letterSpacing.wider,
    textTransform: "uppercase" as TextStyle["textTransform"],
  } as TextStyle,

  metricValue: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.h2 * lineHeights.tight,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  // Navigation
  navItem: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.medium * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  navItemActive: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.medium * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Form elements
  inputLabel: {
    fontSize: fontSizes.label,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.label * lineHeights.snug,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  inputText: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.medium * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  inputPlaceholder: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.medium * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Card styles
  cardTitle: {
    fontSize: fontSizes.h5,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.h5 * lineHeights.snug,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  cardDescription: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.medium * lineHeights.normal,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Badge styles
  badge: {
    fontSize: fontSizes.xsmall,
    fontWeight: fontWeights.semiBold,
    lineHeight: fontSizes.xsmall * lineHeights.snug,
    letterSpacing: letterSpacing.wider,
    textTransform: "uppercase" as TextStyle["textTransform"],
  } as TextStyle,

  // Tag styles
  tag: {
    fontSize: fontSizes.small,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.small * lineHeights.snug,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,
};

// ==================== RESPONSIVE FONT SCALING ====================
export const getResponsiveFontSize = (baseSize: number, scaleFactor: number = 1): number => {
  return Math.round(baseSize * scaleFactor);
};

// ==================== UTILITY FUNCTIONS ====================
export const createTextStyle = (
  fontSize: number,
  fontWeight: TextStyle["fontWeight"] = fontWeights.regular,
  lineHeightMultiplier: number = lineHeights.normal,
  letterSpacingValue: number = letterSpacing.normal
): TextStyle => {
  return {
    fontSize,
    fontWeight,
    lineHeight: fontSize * lineHeightMultiplier,
    letterSpacing: letterSpacingValue,
  };
};

// Export everything as a single typography object for convenience
const typography = {
  fontFamilies,
  fontSizes,
  lineHeights,
  fontWeights,
  letterSpacing,
  textStyles,
  getResponsiveFontSize,
  createTextStyle,
};

export default typography;