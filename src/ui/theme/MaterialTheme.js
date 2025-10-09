/**
 * MaterialTheme - Re-exports from shared theme
 * Provides Material Design 3 compatible theme for React Native Paper
 */

import { lightTheme as sharedLightTheme, darkTheme as sharedDarkTheme, therapeuticColors as sharedTherapeuticColors } from '@theme/ThemeProvider';

// Re-export themes with MaterialTheme naming
export const lightTheme = sharedLightTheme;
export const darkTheme = sharedDarkTheme;
export const therapeuticColors = sharedTherapeuticColors;

export default {
  light: lightTheme,
  dark: darkTheme,
  therapeuticColors,
};
