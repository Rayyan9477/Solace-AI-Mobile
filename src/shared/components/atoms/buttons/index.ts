/**
 * Button Components Exports
 * @description Barrel export for button components
 * @task Task 2.1.1, 2.1.2: Button Components
 */

// Button (Task 2.1.1)
export { Button } from "./Button";
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  SizeSpec,
  VariantColors,
} from "./Button.types";

// IconButton (Task 2.1.2)
export { IconButton } from "./IconButton";
export type {
  IconButtonProps,
  IconButtonVariant,
  IconButtonSize,
} from "./IconButton.types";

// FAB - Floating Action Button (shared atom)
export { FAB } from "./FAB";
export type { FABProps } from "./FAB";

// BackButton - Unified back navigation button
export { BackButton } from "./BackButton";
