/**
 * Z-Index Scale
 * @description Layering system for React Native components
 * @task Task 1.1.4: Add Z-Index Scale
 *
 * Provides consistent z-index values for proper element stacking.
 * Crisis alerts have the highest z-index to ensure they're never covered.
 */

/**
 * Z-Index level type
 * Defines the available z-index layers
 */
export type ZIndexLevel =
  | "base"
  | "dropdown"
  | "sticky"
  | "fixed"
  | "modalBackdrop"
  | "modal"
  | "popover"
  | "tooltip"
  | "toast"
  | "crisis";

/**
 * Z-Index scale object
 * Values are spaced by 100 for easy insertion of intermediate layers if needed
 *
 * Layer hierarchy (lowest to highest):
 * - base (0): Default content layer
 * - dropdown (100): Dropdown menus, select options
 * - sticky (200): Sticky headers, persistent UI
 * - fixed (300): Fixed position elements
 * - modalBackdrop (400): Semi-transparent overlay behind modals
 * - modal (500): Modal dialogs, bottom sheets
 * - popover (600): Popovers, context menus
 * - tooltip (700): Tooltips, help text
 * - toast (800): Toast notifications, snackbars
 * - crisis (1000): Crisis alerts - MUST ALWAYS BE VISIBLE
 */
export const zIndex: Record<ZIndexLevel, number> = {
  /**
   * Base layer - default content
   * Use for: Regular content, cards, list items
   */
  base: 0,

  /**
   * Dropdown layer
   * Use for: Dropdown menus, select options, autocomplete
   */
  dropdown: 100,

  /**
   * Sticky layer
   * Use for: Sticky headers, persistent navigation
   */
  sticky: 200,

  /**
   * Fixed layer
   * Use for: Fixed position elements, FABs
   */
  fixed: 300,

  /**
   * Modal backdrop layer
   * Use for: Semi-transparent overlay behind modals
   */
  modalBackdrop: 400,

  /**
   * Modal layer
   * Use for: Modal dialogs, bottom sheets, drawers
   */
  modal: 500,

  /**
   * Popover layer
   * Use for: Popovers, context menus, floating actions
   */
  popover: 600,

  /**
   * Tooltip layer
   * Use for: Tooltips, help text, hover info
   */
  tooltip: 700,

  /**
   * Toast layer
   * Use for: Toast notifications, snackbars, alerts
   */
  toast: 800,

  /**
   * Crisis layer - HIGHEST PRIORITY
   * Use for: Crisis alerts, emergency modals
   * CRITICAL: This must NEVER be covered by any other element
   */
  crisis: 1000,
} as const;

export default zIndex;
