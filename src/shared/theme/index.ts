/**
 * Theme Module Exports
 * Central theme system exports for Solace AI Design System
 *
 * @description
 * This module re-exports all theme-related tokens and utilities.
 * Import from this file for consistent theming across the app.
 *
 * @example
 * ```tsx
 * import { shadows, applyShadow } from '@/shared/theme';
 *
 * const cardStyle = {
 *   ...applyShadow('md'),
 * };
 * ```
 */

// Shadow Tokens (Task 1.1.1)
export { shadows, applyShadow } from "./shadows";
export type { ShadowLevel, ShadowStyle } from "./shadows";
