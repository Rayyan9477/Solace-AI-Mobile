/**
 * UI System Index - Re-exports
 */

// Theme System: defer to shared theme as single source of truth
export { ThemeProvider, useTheme, lightTheme, darkTheme } from '../shared/theme/ThemeContext';

// Components
export * from './components';