/**
 * DatePicker Types
 * @description Type definitions for the DatePicker component
 * @task Task 2.6.1: DatePicker Component
 */

import type { StyleProp, ViewStyle } from "react-native";

/**
 * Date range for multi-date selection
 */
export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

/**
 * Quick select option for common date ranges
 */
export interface QuickSelectOption {
  id: string;
  label: string;
  getValue: () => Date | DateRange;
}

/**
 * Calendar day state for custom rendering
 */
export interface DayState {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
}

/**
 * DatePicker selection mode
 */
export type DatePickerMode = "single" | "range" | "multiple";

/**
 * DatePicker Props
 */
export interface DatePickerProps {
  /**
   * Currently selected date (for single mode)
   */
  value?: Date | null;

  /**
   * Selected date range (for range mode)
   */
  range?: DateRange;

  /**
   * Multiple selected dates (for multiple mode)
   */
  selectedDates?: Date[];

  /**
   * Callback when date is selected (single mode)
   */
  onDateChange?: (date: Date | null) => void;

  /**
   * Callback when date range is selected (range mode)
   */
  onRangeChange?: (range: DateRange) => void;

  /**
   * Callback when multiple dates are selected
   */
  onMultipleDatesChange?: (dates: Date[]) => void;

  /**
   * Selection mode
   * @default "single"
   */
  mode?: DatePickerMode;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Dates that should be disabled
   */
  disabledDates?: Date[];

  /**
   * Show quick select options (Today, This Week, etc.)
   * @default true
   */
  showQuickSelect?: boolean;

  /**
   * Custom quick select options
   */
  quickSelectOptions?: QuickSelectOption[];

  /**
   * Show the apply button for confirming selection
   * @default true
   */
  showApplyButton?: boolean;

  /**
   * Callback when apply button is pressed
   */
  onApply?: () => void;

  /**
   * Callback when cancel/close is requested
   */
  onCancel?: () => void;

  /**
   * Initial visible month
   */
  initialMonth?: Date;

  /**
   * Whether the picker is disabled
   * @default false
   */
  disabled?: boolean;

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
}

/**
 * Default quick select options
 */
export const defaultQuickSelectOptions: QuickSelectOption[] = [
  {
    id: "today",
    label: "Today",
    getValue: () => new Date(),
  },
  {
    id: "this-week",
    label: "This Week",
    getValue: () => {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return { startDate: startOfWeek, endDate: endOfWeek };
    },
  },
  {
    id: "yesterday",
    label: "Yesterday",
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday;
    },
  },
];
