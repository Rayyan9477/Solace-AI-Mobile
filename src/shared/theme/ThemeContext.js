/**
 * Theme Context for Solace AI Mental Health App
 * Backward compatibility wrapper for UnifiedThemeProvider
 */

// Re-export everything from UnifiedThemeProvider for backward compatibility
export {
  UnifiedThemeProvider as ThemeProvider,
  UnifiedThemeContext as ThemeContext,
  useTheme,
} from "./UnifiedThemeProvider";

// Also export the old theme definitions for any components that might need them
export { lightTheme, darkTheme } from "./theme";