/**
 * useTheme Hook + ThemeProvider
 * @description React Context-based theme system for accessing design tokens.
 * Supports future dark mode by swapping the context value.
 *
 * @example
 * ```tsx
 * import { useTheme } from '@/shared/theme';
 *
 * function MyComponent() {
 *   const { colors, shadows, gradients } = useTheme();
 *
 *   return (
 *     <View style={{ backgroundColor: colors.background.primary }}>
 *       <Text style={{ color: colors.text.primary }}>Hello</Text>
 *     </View>
 *   );
 * }
 * ```
 */

import React, { createContext, useContext } from "react";
import { colors, palette } from "./colors";
import { shadows } from "./shadows";
import { gradients } from "./gradients";
import { zIndex } from "./zIndex";
import { animations } from "./animationTimings";

/**
 * Theme object containing all design tokens
 */
export const theme = {
  colors,
  palette,
  shadows,
  gradients,
  zIndex,
  animations,
} as const;

/**
 * Theme type for TypeScript
 */
export type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

/**
 * ThemeProvider wraps the app to provide theme tokens via React Context.
 * Currently serves the static light theme; swap `value` for dark mode later.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  return React.createElement(ThemeContext.Provider, { value: theme }, children);
}

/**
 * useTheme Hook
 * Returns the complete theme object with all design tokens.
 * Reads from ThemeContext when inside a ThemeProvider, falls back to static theme.
 *
 * @returns Theme object with colors, shadows, gradients, zIndex, animations
 */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}

export default useTheme;
