/**
 * Typography System for Solace AI Mental Health App
 * Based on Material Design 3 type scale
 * All sizes optimized for accessibility (minimum 16px body text)
 */

import { TextStyle } from 'react-native';

export interface TypographyStyle extends TextStyle {
  fontSize: number;
  fontWeight: '300' | '400' | '500' | '600' | '700' | '800' | '900';
  lineHeight: number;
  letterSpacing?: number;
}

export const typography = {
  // Display - Extra large, attention-grabbing
  display: {
    fontSize: 48,
    fontWeight: '900' as const,
    lineHeight: 56,
    letterSpacing: -0.5,
  },

  // H1 - Primary headings
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.25,
  },

  // H2 - Secondary headings
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: 0,
  },

  // H3 - Tertiary headings
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: 0.15,
  },

  // H4 - Section headings
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.15,
  },

  // Body Large - Emphasized body text
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 28,
    letterSpacing: 0.5,
  },

  // Body - Default body text (WCAG minimum)
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0.5,
  },

  // Body Small - De-emphasized body text
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0.25,
  },

  // Button - Button text
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 1.25,
    textTransform: 'uppercase' as const,
  },

  // Caption - Small labels and helper text
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.4,
  },

  // Overline - Small labels above content
  overline: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },

  // Label Large - Large form labels
  labelLarge: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0.1,
  },

  // Label Medium - Medium form labels
  labelMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.5,
  },

  // Label Small - Small form labels
  labelSmall: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
};

// Font families - React Native safe defaults
export const fontFamilies = {
  regular: {
    ios: 'System',
    android: 'Roboto',
    default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  medium: {
    ios: 'System',
    android: 'Roboto-Medium',
    default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  bold: {
    ios: 'System',
    android: 'Roboto-Bold',
    default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
};

// Helper function to get font family based on platform
export const getFontFamily = (weight: 'regular' | 'medium' | 'bold' = 'regular'): string => {
  return fontFamilies[weight].default;
};

// Export type for TypeScript
export type TypographyScale = typeof typography;
export type TypographyVariant = keyof typeof typography;

export default typography;
