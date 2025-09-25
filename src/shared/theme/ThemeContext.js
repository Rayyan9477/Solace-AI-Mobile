/**
 * Theme Context for Solace AI Mental Health App
 * Backward compatibility wrapper - redirects to main ThemeProvider
 */

// Re-export everything from the main ThemeProvider for backward compatibility
export {
  ThemeProvider,
  ThemeContext,
  useTheme,
} from "../../design-system/theme/ThemeProvider";

// Also export the theme definitions for any components that might need them
export { lightTheme, darkTheme } from "../../design-system/theme";
