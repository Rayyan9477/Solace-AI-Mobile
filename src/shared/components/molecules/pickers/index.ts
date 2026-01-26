/**
 * Pickers Module
 * @description Barrel exports for picker components
 * @task Task 2.6: Molecules - Picker
 *
 * Components:
 * - DatePicker: Calendar-based date picker with single, range, and multiple selection
 * - TimePicker: Time picker with hour/minute wheels and AM/PM selector
 * - DropdownSelect: Customizable dropdown with single/multi select and search
 */

// DatePicker
export { DatePicker } from "./DatePicker";
export type {
  DatePickerProps,
  DateRange,
  QuickSelectOption,
  DayState,
  DatePickerMode,
} from "./DatePicker.types";
export { defaultQuickSelectOptions } from "./DatePicker.types";

// TimePicker
export { TimePicker } from "./TimePicker";
export type {
  TimePickerProps,
  TimeValue,
  TimeFormat,
  TimePickerStyle,
  MinuteInterval,
} from "./TimePicker.types";
export {
  to24Hour,
  to12Hour,
  formatTime,
  parseTimeString,
} from "./TimePicker.types";

// DropdownSelect
export { DropdownSelect } from "./DropdownSelect";
export type {
  DropdownSelectProps,
  DropdownOption,
  DropdownGroup,
  SelectionMode,
  DropdownVariant,
  DropdownSize,
  DropdownItemProps,
} from "./DropdownSelect.types";
export {
  sizeSpecs as dropdownSizeSpecs,
  filterOptions,
  getSelectionLabel,
} from "./DropdownSelect.types";
