/**
 * Slider Component
 * @description Accessible slider for value selection
 * @task Task 2.2.1: Slider Component
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Features:
 * - Min/max range
 * - Step increments
 * - Optional labels
 * - Disabled state
 * - Full accessibility support
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RNSlider from "@react-native-community/slider";
import type { SliderProps } from "./Slider.types";
import { palette } from "../../../theme";

/**
 * Color tokens from theme
 */
const colors = {
  track: palette.gray[600],
  trackActive: palette.indigo[400],
  thumb: palette.white,
  label: palette.gray[400],
  value: palette.gray[200],
  disabled: palette.gray[700],
};

/**
 * Slider Component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Slider
 *   value={volume}
 *   onValueChange={setVolume}
 *   min={0}
 *   max={100}
 * />
 *
 * // With labels
 * <Slider
 *   value={rating}
 *   onValueChange={setRating}
 *   min={1}
 *   max={5}
 *   step={1}
 *   showLabels
 *   showValue
 * />
 * ```
 */
export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  showLabels = false,
  showValue = false,
  disabled = false,
  testID,
  accessibilityLabel,
  style,
}: SliderProps): React.ReactElement {
  return (
    <View style={[styles.container, style]}>
      {/* Value Label */}
      {showValue && (
        <Text style={styles.valueLabel}>{Math.round(value)}</Text>
      )}

      {/* Slider Row */}
      <View style={styles.sliderRow}>
        {/* Min Label */}
        {showLabels && (
          <Text style={styles.label}>{min}</Text>
        )}

        {/* Slider */}
        <RNSlider
          testID={testID}
          value={value}
          onValueChange={onValueChange}
          minimumValue={min}
          maximumValue={max}
          step={step}
          disabled={disabled}
          minimumTrackTintColor={disabled ? colors.disabled : colors.trackActive}
          maximumTrackTintColor={colors.track}
          thumbTintColor={disabled ? colors.disabled : colors.thumb}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="adjustable"
          style={styles.slider}
        />

        {/* Max Label */}
        {showLabels && (
          <Text style={styles.label}>{max}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  sliderRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    flex: 1,
    height: 40,
  },
  label: {
    fontSize: 12,
    color: colors.label,
    minWidth: 24,
    textAlign: "center",
  },
  valueLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.value,
    textAlign: "center",
    marginBottom: 4,
  },
});

export default Slider;
