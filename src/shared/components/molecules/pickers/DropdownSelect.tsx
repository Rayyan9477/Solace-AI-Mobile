/**
 * DropdownSelect Component
 * @description Customizable dropdown with single/multi select and search support
 * @task Task 2.6.3: DropdownSelect Component
 *
 * Features:
 * - Single and multiple selection modes
 * - Searchable option list
 * - Left icon support
 * - Disabled options
 * - Error state
 * - Full accessibility support
 * - Dark mode first design
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";

import type {
  DropdownSelectProps,
  DropdownOption,
  DropdownSize,
} from "./DropdownSelect.types";
import {
  sizeSpecs,
  filterOptions,
  getSelectionLabel,
} from "./DropdownSelect.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  // Background colors
  background: "#1E293B",
  surface: "#334155",
  surfaceHover: "#475569",

  // Text colors
  text: "#F1F5F9",
  textSecondary: "#94A3B8",
  textDisabled: "#64748B",
  placeholder: "#64748B",
  error: "#EF4444",

  // Selection colors
  selected: "#9AAD5C", // Olive green from designs
  selectedLight: "rgba(154, 173, 92, 0.2)",
  selectedText: "#1C1917",

  // Border colors
  border: "#475569",
  borderFocused: "#9AAD5C",
  borderError: "#EF4444",

  // Icon colors
  icon: "#94A3B8",
  chevron: "#94A3B8",
};

/**
 * Checkmark icon component
 */
function CheckIcon({ size = 16, color = colors.selected }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color, fontSize: size - 2, fontWeight: "bold" }}>✓</Text>
    </View>
  );
}

/**
 * Chevron icon component
 */
function ChevronIcon({ isOpen, size = 20 }) {
  return (
    <Text
      style={{
        color: colors.chevron,
        fontSize: size,
        transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
      }}
    >
      ▼
    </Text>
  );
}

/**
 * Checkbox component for multi-select
 */
function Checkbox({
  checked,
  disabled,
  testID,
}: {
  checked: boolean;
  disabled?: boolean;
  testID?: string;
}) {
  return (
    <View
      testID={testID}
      style={[
        styles.checkbox,
        checked && styles.checkboxChecked,
        disabled && styles.checkboxDisabled,
      ]}
    >
      {checked && <CheckIcon size={12} color={colors.selectedText} />}
    </View>
  );
}

/**
 * Option Item Component
 */
interface OptionItemProps {
  option: DropdownOption;
  isSelected: boolean;
  onSelect: (option: DropdownOption) => void;
  mode: "single" | "multiple";
  testID?: string;
}

function OptionItem({
  option,
  isSelected,
  onSelect,
  mode,
  testID,
}: OptionItemProps) {
  const handlePress = useCallback(() => {
    if (!option.disabled) {
      onSelect(option);
    }
  }, [option, onSelect]);

  return (
    <TouchableOpacity
      testID={testID}
      style={[
        styles.optionItem,
        isSelected && styles.optionItemSelected,
        option.disabled && styles.optionItemDisabled,
      ]}
      onPress={handlePress}
      disabled={option.disabled}
      accessibilityRole="option"
      accessibilityState={{ selected: isSelected, disabled: option.disabled }}
      accessibilityLabel={option.label}
    >
      {/* Checkbox for multiple mode */}
      {mode === "multiple" && (
        <Checkbox
          checked={isSelected}
          disabled={option.disabled}
          testID={`${testID}-checkbox`}
        />
      )}

      {/* Option icon */}
      {option.icon && <View style={styles.optionIcon}>{option.icon}</View>}

      {/* Option content */}
      <View style={styles.optionContent}>
        <Text
          style={[
            styles.optionLabel,
            isSelected && styles.optionLabelSelected,
            option.disabled && styles.optionLabelDisabled,
          ]}
        >
          {option.label}
        </Text>
        {option.description && (
          <Text
            style={[
              styles.optionDescription,
              option.disabled && styles.optionDescriptionDisabled,
            ]}
          >
            {option.description}
          </Text>
        )}
      </View>

      {/* Checkmark for single mode */}
      {mode === "single" && isSelected && (
        <View testID={`${testID}-check`}>
          <CheckIcon size={20} />
        </View>
      )}
    </TouchableOpacity>
  );
}

/**
 * DropdownSelect Component
 *
 * @example
 * ```tsx
 * // Single select
 * <DropdownSelect
 *   options={options}
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 *   placeholder="Select..."
 * />
 *
 * // Multi select with search
 * <DropdownSelect
 *   options={options}
 *   value={selectedValues}
 *   onChange={setSelectedValues}
 *   mode="multiple"
 *   searchable
 * />
 * ```
 */
export function DropdownSelect({
  options,
  value,
  onChange,
  mode = "single",
  placeholder = "Select...",
  label,
  helperText,
  error,
  disabled = false,
  searchable = false,
  searchPlaceholder = "Search...",
  leftIcon,
  variant = "default",
  size = "md",
  defaultOpen = false,
  onOpen,
  onClose,
  maxHeight = 300,
  closeOnSelect = true,
  emptyMessage = "No options found",
  testID,
  accessibilityLabel,
  style,
  triggerStyle,
  labelStyle,
}: DropdownSelectProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [searchQuery, setSearchQuery] = useState("");

  const specs = sizeSpecs[size];

  // Filter options based on search
  const filteredOptions = useMemo(
    () => (searchable ? filterOptions(options, searchQuery) : options),
    [options, searchQuery, searchable],
  );

  // Get display label
  const displayLabel = useMemo(
    () => getSelectionLabel(options, value, placeholder),
    [options, value, placeholder],
  );

  // Check if an option is selected
  const isOptionSelected = useCallback(
    (optionId: string): boolean => {
      if (Array.isArray(value)) {
        return value.includes(optionId);
      }
      return value === optionId;
    },
    [value],
  );

  // Handle trigger press
  const handleTriggerPress = useCallback(() => {
    if (disabled) return;

    if (isOpen) {
      setIsOpen(false);
      setSearchQuery("");
      onClose?.();
    } else {
      setIsOpen(true);
      onOpen?.();
    }
  }, [disabled, isOpen, onOpen, onClose]);

  // Handle option selection
  const handleSelectOption = useCallback(
    (option: DropdownOption) => {
      if (mode === "single") {
        onChange?.(option.id);
        if (closeOnSelect) {
          setIsOpen(false);
          setSearchQuery("");
          onClose?.();
        }
      } else {
        // Multiple mode
        const currentValues = Array.isArray(value) ? value : [];
        const isSelected = currentValues.includes(option.id);

        if (isSelected) {
          // Remove from selection
          onChange?.(currentValues.filter((v) => v !== option.id));
        } else {
          // Add to selection
          onChange?.([...currentValues, option.id]);
        }
      }
    },
    [mode, value, onChange, closeOnSelect, onClose],
  );

  // Determine border color
  const borderColor = useMemo(() => {
    if (error) return colors.borderError;
    if (isOpen) return colors.borderFocused;
    return colors.border;
  }, [error, isOpen]);

  return (
    <View
      testID={testID}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      {/* Label */}
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      {/* Trigger */}
      <TouchableOpacity
        testID={`${testID}-trigger`}
        style={[
          styles.trigger,
          { height: specs.height, borderColor },
          variant === "filled" && styles.triggerFilled,
          variant === "outlined" && styles.triggerOutlined,
          disabled && styles.triggerDisabled,
          triggerStyle,
        ]}
        onPress={handleTriggerPress}
        disabled={disabled}
        accessibilityRole="combobox"
        accessibilityLabel={accessibilityLabel || label || placeholder}
        accessibilityState={{ expanded: isOpen, disabled }}
      >
        {/* Left Icon */}
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        {/* Value Display */}
        <Text
          style={[
            styles.valueText,
            { fontSize: specs.fontSize },
            !value && styles.placeholderText,
            disabled && styles.valueTextDisabled,
          ]}
          numberOfLines={1}
        >
          {displayLabel}
        </Text>

        {/* Chevron */}
        <View testID={`${testID}-chevron`}>
          <ChevronIcon isOpen={isOpen} size={specs.iconSize} />
        </View>
      </TouchableOpacity>

      {/* Dropdown List */}
      {isOpen && (
        <View
          testID={`${testID}-list`}
          style={[styles.dropdown, { maxHeight }]}
          accessibilityRole="listbox"
        >
          {/* Search Input */}
          {searchable && (
            <View style={styles.searchContainer}>
              <TextInput
                accessibilityLabel="Text input field"
                testID={`${testID}-search`}
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor={colors.placeholder}
                autoFocus
              />
            </View>
          )}

          {/* Options List */}
          <ScrollView
            style={styles.optionsList}
            showsVerticalScrollIndicator={false}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <OptionItem
                  key={option.id}
                  testID={`${testID}-option-${option.id}`}
                  option={option}
                  isSelected={isOptionSelected(option.id)}
                  onSelect={handleSelectOption}
                  mode={mode}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{emptyMessage}</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}

      {/* Error Message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 4,
    borderWidth: 2,
    height: 20,
    justifyContent: "center",
    marginRight: 12,
    width: 20,
  },
  checkboxChecked: {
    backgroundColor: colors.selected,
    borderColor: colors.selected,
  },
  checkboxDisabled: {
    borderColor: colors.textDisabled,
  },
  container: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  dropdown: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    left: 0,
    marginTop: 4,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: "100%",
    zIndex: 100,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  leftIcon: {
    marginRight: 8,
  },
  optionContent: {
    flex: 1,
  },
  optionDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  optionDescriptionDisabled: {
    color: colors.textDisabled,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionItem: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  optionItemDisabled: {
    opacity: 0.5,
  },
  optionItemSelected: {
    backgroundColor: colors.selectedLight,
  },
  optionLabel: {
    color: colors.text,
    fontSize: 16,
  },
  optionLabelDisabled: {
    color: colors.textDisabled,
  },
  optionLabelSelected: {
    color: colors.selected,
    fontWeight: "600",
  },
  optionsList: {
    maxHeight: 250,
  },
  placeholderText: {
    color: colors.placeholder,
  },
  searchContainer: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    padding: 8,
  },
  searchInput: {
    backgroundColor: colors.background,
    borderRadius: 8,
    color: colors.text,
    fontSize: 14,
    height: 40,
    paddingHorizontal: 12,
  },
  trigger: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  triggerDisabled: {
    backgroundColor: colors.surface,
  },
  triggerFilled: {
    backgroundColor: colors.surface,
    borderWidth: 0,
  },
  triggerOutlined: {
    backgroundColor: "transparent",
  },
  valueText: {
    color: colors.text,
    flex: 1,
  },
  valueTextDisabled: {
    color: colors.textDisabled,
  },
});

export default DropdownSelect;
