/**
 * Shadow Tokens
 * @description Cross-platform shadow system for React Native
 * @task Task 1.1.1: Add Shadow Tokens
 *
 * Provides consistent shadow/elevation effects across iOS and Android.
 * iOS uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * Android uses elevation property
 */

/**
 * Shadow level type
 * Defines the available shadow intensity levels
 */
export type ShadowLevel = "none" | "sm" | "md" | "lg" | "xl";

/**
 * Shadow style interface
 * Cross-platform shadow properties for React Native
 */
export interface ShadowStyle {
  /** Shadow color (iOS) */
  shadowColor: string;
  /** Shadow offset with width and height (iOS) */
  shadowOffset: {
    width: number;
    height: number;
  };
  /** Shadow opacity from 0 to 1 (iOS) */
  shadowOpacity: number;
  /** Shadow blur radius (iOS) */
  shadowRadius: number;
  /** Elevation for Android shadow effect */
  elevation: number;
}

/**
 * Shadow color constant
 * Using rgba for consistent cross-platform behavior
 * Dark enough to be visible on light backgrounds, subtle on dark backgrounds
 */
const SHADOW_COLOR = "#000000";

/**
 * Shadow tokens object
 * Contains all shadow level definitions
 */
export const shadows: Record<ShadowLevel, ShadowStyle> = {
  /**
   * No shadow - flat appearance
   */
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  /**
   * Small shadow - subtle elevation
   * Use for: cards, list items, subtle depth
   */
  sm: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },

  /**
   * Medium shadow - moderate elevation
   * Use for: buttons, active cards, dropdowns
   */
  md: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },

  /**
   * Large shadow - prominent elevation
   * Use for: modals, popovers, floating elements
   */
  lg: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 8,
  },

  /**
   * Extra large shadow - maximum elevation
   * Use for: dialogs, sheets, crisis modals
   */
  xl: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
};

/**
 * Apply shadow utility function
 * Returns shadow style object for the specified level
 *
 * @param level - Shadow intensity level (default: 'md')
 * @returns ShadowStyle object spreadable in React Native styles
 *
 * @example
 * ```tsx
 * import { applyShadow } from '@/shared/theme/shadows';
 *
 * const cardStyle = {
 *   backgroundColor: '#FFFFFF',
 *   borderRadius: 8,
 *   ...applyShadow('md'),
 * };
 * ```
 */
export function applyShadow(level: ShadowLevel = "md"): ShadowStyle {
  return shadows[level];
}

export default shadows;
