/**
 * Border Radius Tokens
 * @description Standardized border radius scale for Solace AI Design System
 *
 * Usage:
 * ```tsx
 * import { borderRadius } from '@/shared/theme';
 *
 * const styles = StyleSheet.create({
 *   card: { borderRadius: borderRadius.md },
 *   pill: { borderRadius: borderRadius.pill },
 *   avatar: { borderRadius: borderRadius.circle },
 * });
 * ```
 */

export const borderRadius = {
  /** No rounding */
  none: 0,
  /** Extra small - subtle rounding for small elements (4px) */
  xs: 4,
  /** Small - input fields, tags (8px) */
  sm: 8,
  /** Medium - cards, modals (12px) */
  md: 12,
  /** Large - bottom sheets, panels (16px) */
  lg: 16,
  /** Extra large - prominent cards, hero sections (20px) */
  xl: 20,
  /** 2X large - feature cards (24px) */
  "2xl": 24,
  /** Pill - buttons, chips with near-circular ends (28px) */
  pill: 28,
  /** Circle - avatars, icon containers, fully circular elements (9999px) */
  circle: 9999,
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;
