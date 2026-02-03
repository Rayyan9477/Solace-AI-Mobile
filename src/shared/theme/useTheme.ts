/**
 * useTheme Hook
 * @description React hook for accessing theme tokens in components
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

/**
 * useTheme Hook
 * Returns the complete theme object with all design tokens
 *
 * @returns Theme object with colors, shadows, gradients, zIndex, animations
 */
export function useTheme(): Theme {
  return theme;
}

export default useTheme;
