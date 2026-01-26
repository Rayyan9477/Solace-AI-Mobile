/**
 * DropdownSelect Types
 * @description Type definitions for the DropdownSelect component
 * @task Task 2.6.3: DropdownSelect Component
 */

import type { ReactNode } from "react";
import type { StyleProp, ViewStyle, TextStyle } from "react-native";

/**
 * Option item for the dropdown
 */
export interface DropdownOption {
  /** Unique identifier for the option */
  id: string;
  /** Display label for the option */
  label: string;
  /** Optional value if different from id */
  value?: string;
  /** Optional icon to display */
  icon?: ReactNode;
  /** Optional description text */
  description?: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Optional group/category for grouping options */
  group?: string;
}

/**
 * Grouped options structure
 */
export interface DropdownGroup {
  /** Group title */
  title: string;
  /** Options in this group */
  options: DropdownOption[];
}

/**
 * Selection mode for the dropdown
 */
export type SelectionMode = "single" | "multiple";

/**
 * Dropdown display variant
 */
export type DropdownVariant = "default" | "outlined" | "filled";

/**
 * Dropdown size variant
 */
export type DropdownSize = "sm" | "md" | "lg";

/**
 * DropdownSelect Props
 */
export interface DropdownSelectProps {
  /**
   * Array of selectable options
   */
  options: DropdownOption[];

  /**
   * Currently selected value (single mode) or values (multiple mode)
   */
  value?: string | string[];

  /**
   * Callback when selection changes
   */
  onChange?: (value: string | string[]) => void;

  /**
   * Selection mode
   * @default "single"
   */
  mode?: SelectionMode;

  /**
   * Placeholder text when no selection
   */
  placeholder?: string;

  /**
   * Label displayed above the dropdown
   */
  label?: string;

  /**
   * Helper text displayed below the dropdown
   */
  helperText?: string;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Whether the dropdown is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to show search input in dropdown
   * @default false
   */
  searchable?: boolean;

  /**
   * Placeholder for search input
   * @default "Search..."
   */
  searchPlaceholder?: string;

  /**
   * Left icon for the trigger
   */
  leftIcon?: ReactNode;

  /**
   * Visual variant
   * @default "default"
   */
  variant?: DropdownVariant;

  /**
   * Size variant
   * @default "md"
   */
  size?: DropdownSize;

  /**
   * Whether dropdown is initially open
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Callback when dropdown opens
   */
  onOpen?: () => void;

  /**
   * Callback when dropdown closes
   */
  onClose?: () => void;

  /**
   * Maximum height of the dropdown list
   * @default 300
   */
  maxHeight?: number;

  /**
   * Whether to close on selection (single mode only)
   * @default true
   */
  closeOnSelect?: boolean;

  /**
   * Empty state message when no options match search
   * @default "No options found"
   */
  emptyMessage?: string;

  /**
   * Test ID for testing
   */
  testID?: string;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Container style
   */
  style?: StyleProp<ViewStyle>;

  /**
   * Trigger button style
   */
  triggerStyle?: StyleProp<ViewStyle>;

  /**
   * Label style
   */
  labelStyle?: StyleProp<TextStyle>;
}

/**
 * DropdownItem Props for rendering individual options
 */
export interface DropdownItemProps {
  option: DropdownOption;
  isSelected: boolean;
  onSelect: (option: DropdownOption) => void;
  disabled?: boolean;
  mode?: SelectionMode;
  testID?: string;
}

/**
 * Size specifications for dropdown
 */
export const sizeSpecs: Record<
  DropdownSize,
  { height: number; fontSize: number; iconSize: number }
> = {
  sm: { height: 36, fontSize: 14, iconSize: 16 },
  md: { height: 44, fontSize: 16, iconSize: 20 },
  lg: { height: 52, fontSize: 18, iconSize: 24 },
};

/**
 * Filter options by search query
 */
export function filterOptions(
  options: DropdownOption[],
  query: string,
): DropdownOption[] {
  if (!query.trim()) return options;

  const lowercaseQuery = query.toLowerCase().trim();
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(lowercaseQuery) ||
      option.description?.toLowerCase().includes(lowercaseQuery),
  );
}

/**
 * Get display label for current selection
 */
export function getSelectionLabel(
  options: DropdownOption[],
  value: string | string[] | undefined,
  placeholder: string = "Select...",
): string {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return placeholder;
  }

  if (Array.isArray(value)) {
    // Multiple selection
    const selectedOptions = options.filter((opt) => value.includes(opt.id));
    if (selectedOptions.length === 0) return placeholder;
    if (selectedOptions.length === 1) return selectedOptions[0].label;
    return `${selectedOptions.length} selected`;
  }

  // Single selection
  const selectedOption = options.find((opt) => opt.id === value);
  return selectedOption?.label ?? placeholder;
}
