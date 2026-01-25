/**
 * SearchBar Component
 * @description Search input with icon, clear button, and custom actions
 * @task Task 2.3.4: SearchBar Component (Sprint 2.3 - Molecules Navigation)
 *
 * Features:
 * - Multiple visual variants (default, filled, outlined)
 * - Three sizes (sm, md, lg)
 * - Search icon
 * - Clear button
 * - Custom left icon
 * - Right element slot (filter button, etc.)
 * - Disabled state
 * - Full accessibility support
 */

import React, { useMemo } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import type {
  SearchBarProps,
  SearchBarVariant,
  SearchBarSize,
} from "./SearchBar.types";

/**
 * Color tokens (dark mode first)
 */
const colors = {
  // Container
  backgroundDefault: "#334155",
  backgroundFilled: "#1E293B",
  backgroundOutlined: "transparent",
  backgroundDisabled: "#1E293B",

  // Border
  borderOutlined: "#475569",
  borderFocused: "#818CF8",

  // Text
  text: "#F1F5F9",
  placeholder: "#64748B",
  textDisabled: "#475569",

  // Icon
  icon: "#94A3B8",
  iconFocused: "#818CF8",
  iconDisabled: "#475569",

  // Clear button
  clearButton: "#64748B",
  clearButtonPressed: "#94A3B8",
};

/**
 * Size configurations
 */
const sizeConfig: Record<
  SearchBarSize,
  { height: number; paddingHorizontal: number; fontSize: number; iconSize: number; borderRadius: number }
> = {
  sm: { height: 36, paddingHorizontal: 12, fontSize: 14, iconSize: 16, borderRadius: 8 },
  md: { height: 44, paddingHorizontal: 14, fontSize: 16, iconSize: 18, borderRadius: 10 },
  lg: { height: 52, paddingHorizontal: 16, fontSize: 18, iconSize: 20, borderRadius: 12 },
};

/**
 * SearchBar Component
 *
 * @example
 * ```tsx
 * // Basic search bar
 * <SearchBar
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 *   placeholder="Search anything"
 * />
 *
 * // With clear button and filter
 * <SearchBar
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 *   placeholder="Search"
 *   showClearButton
 *   rightElement={<FilterButton onPress={openFilter} />}
 * />
 *
 * // Outlined variant
 * <SearchBar
 *   value={searchQuery}
 *   onChangeText={setSearchQuery}
 *   variant="outlined"
 *   onSubmit={handleSearch}
 * />
 * ```
 */
export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
  variant = "default",
  size = "md",
  onSubmit,
  onFocus,
  onBlur,
  onClear,
  showClearButton = false,
  leftIcon,
  rightElement,
  disabled = false,
  autoFocus = false,
  testID,
  accessibilityLabel,
  style,
}: SearchBarProps): React.ReactElement {
  const config = sizeConfig[size];
  const hasValue = value.length > 0;
  const showClear = showClearButton && hasValue && !disabled;

  // Compute container styles
  const containerStyle = useMemo((): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: config.height,
      borderRadius: config.borderRadius,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: config.paddingHorizontal,
    };

    switch (variant) {
      case "filled":
        baseStyle.backgroundColor = colors.backgroundFilled;
        break;
      case "outlined":
        baseStyle.backgroundColor = colors.backgroundOutlined;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = colors.borderOutlined;
        break;
      default:
        baseStyle.backgroundColor = colors.backgroundDefault;
    }

    if (disabled) {
      baseStyle.backgroundColor = colors.backgroundDisabled;
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  }, [variant, config, disabled]);

  // Compute input style
  const inputStyle = useMemo((): TextStyle => ({
    flex: 1,
    fontSize: config.fontSize,
    color: disabled ? colors.textDisabled : colors.text,
    paddingVertical: 0,
    marginLeft: 8,
    marginRight: 8,
  }), [config.fontSize, disabled]);

  // Handle submit
  const handleSubmit = () => {
    onSubmit?.(value);
  };

  // Handle clear
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChangeText("");
    }
  };

  // Render search icon
  const renderSearchIcon = () => {
    if (leftIcon) return leftIcon;

    return (
      <View testID={testID ? `${testID}-icon` : "search-icon"}>
        <Text style={[styles.searchIcon, { fontSize: config.iconSize }]}>
          🔍
        </Text>
      </View>
    );
  };

  // Render clear button
  const renderClearButton = () => {
    if (!showClear) return null;

    return (
      <Pressable
        testID={testID ? `${testID}-clear-button` : "search-clear-button"}
        onPress={handleClear}
        accessibilityRole="button"
        accessibilityLabel="Clear search"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={({ pressed }) => [
          styles.clearButton,
          pressed && styles.clearButtonPressed,
        ]}
      >
        <Text style={[styles.clearIcon, { fontSize: config.iconSize - 2 }]}>
          ✕
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      testID={testID}
      style={[containerStyle, style]}
    >
      {/* Search Icon */}
      {renderSearchIcon()}

      {/* Text Input */}
      <TextInput
        testID={testID ? `${testID}-input` : "search-input"}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        editable={!disabled}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={handleSubmit}
        onFocus={onFocus}
        onBlur={onBlur}
        accessibilityLabel={accessibilityLabel || placeholder}
        style={inputStyle}
      />

      {/* Clear Button */}
      {renderClearButton()}

      {/* Right Element */}
      {rightElement}
    </View>
  );
}

const styles = StyleSheet.create({
  searchIcon: {
    opacity: 0.7,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.clearButton,
  },
  clearButtonPressed: {
    backgroundColor: colors.clearButtonPressed,
  },
  clearIcon: {
    color: colors.text,
    fontWeight: "600",
  },
});

export default SearchBar;
