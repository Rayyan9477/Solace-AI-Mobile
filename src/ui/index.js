/**
 * UI System Index - Simplified version
 * Basic UI system exports without complex dependencies
 */

// Theme System
export { ThemeProvider, useTheme } from './theme/ThemeProvider';
export { lightTheme, darkTheme } from './theme/MaterialTheme';

// Components - Simplified
export * from './components';

// Default export
export default {
  ThemeProvider,
  useTheme,
  lightTheme,
  darkTheme,
};