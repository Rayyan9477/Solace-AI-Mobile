/**
 * MoodSelector Component
 * @description 5-scale mood picker with animated transitions
 * @task Task 2.8.1: MoodSelector Component
 *
 * Features:
 * - 5-mood scale (Depressed to Overjoyed)
 * - Full-screen background color transitions
 * - Large emoji display
 * - Curved/horizontal slider with 5 points
 * - Confirm button
 * - Full accessibility support
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import type { MoodSelectorProps, MoodLevel } from "./MoodSelector.types";
import {
  MOOD_CONFIGS,
  MOOD_ORDER,
  getMoodLabel,
  getMoodEmoji,
  getMoodBackgroundColor,
} from "./MoodSelector.types";

/**
 * Slider Point Component
 */
interface SliderPointProps {
  index: number;
  isSelected: boolean;
  mood: MoodLevel;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

function SliderPoint({
  index,
  isSelected,
  mood,
  onPress,
  disabled,
  testID,
}: SliderPointProps) {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={`Select ${MOOD_CONFIGS[mood].label} mood`}
      accessibilityState={{ selected: isSelected }}
      style={[
        styles.sliderPoint,
        isSelected && styles.sliderPointSelected,
      ]}
    >
      {isSelected && <View style={styles.sliderPointInner} />}
    </TouchableOpacity>
  );
}

/**
 * MoodSelector Component
 *
 * @example
 * ```tsx
 * // Basic usage
 * <MoodSelector
 *   value={mood}
 *   onMoodSelect={(mood) => setMood(mood)}
 *   onConfirm={(mood) => saveMood(mood)}
 * />
 *
 * // With custom text
 * <MoodSelector
 *   title="How do you feel today?"
 *   labelPrefix="I feel"
 *   confirmButtonText="Save"
 *   value="happy"
 *   onConfirm={handleSave}
 * />
 * ```
 */
export function MoodSelector({
  value,
  onMoodSelect,
  onConfirm,
  title = "How are you feeling this day?",
  labelPrefix = "I'm Feeling",
  confirmButtonText = "Set Mood",
  loading = false,
  disabled = false,
  testID,
  accessibilityLabel,
  style,
}: MoodSelectorProps): React.ReactElement {
  // Default to neutral if no value provided
  const [internalMood, setInternalMood] = useState<MoodLevel>(
    value || "neutral",
  );
  const currentMood = value !== undefined ? value : internalMood;

  const isDisabled = disabled || loading;
  const backgroundColor = getMoodBackgroundColor(currentMood);
  const emoji = getMoodEmoji(currentMood);
  const moodLabel = getMoodLabel(currentMood, labelPrefix);

  const handleMoodSelect = (mood: MoodLevel) => {
    if (isDisabled) return;
    setInternalMood(mood);
    onMoodSelect?.(mood);
  };

  const handleConfirm = () => {
    if (isDisabled) return;
    onConfirm?.(currentMood);
  };

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel || "Mood selector"}
      style={[styles.container, { backgroundColor }, style]}
    >
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Emoji Display */}
      <View style={styles.emojiContainer}>
        <Text testID={`${testID}-emoji`} style={styles.emoji}>
          {emoji}
        </Text>
      </View>

      {/* Mood Label */}
      <Text style={styles.moodLabel}>{moodLabel}</Text>

      {/* Slider */}
      <View testID={`${testID}-slider`} style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          {MOOD_ORDER.map((mood, index) => (
            <SliderPoint
              key={mood}
              testID={`${testID}-point-${index}`}
              index={index}
              isSelected={currentMood === mood}
              mood={mood}
              onPress={() => handleMoodSelect(mood)}
              disabled={isDisabled}
            />
          ))}
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        testID={`${testID}-confirm`}
        onPress={handleConfirm}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={`${confirmButtonText} - ${MOOD_CONFIGS[currentMood].label}`}
        accessibilityState={{ disabled: isDisabled }}
        style={[
          styles.confirmButton,
          isDisabled && styles.confirmButtonDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            testID={`${testID}-confirm-loading`}
            color="#1C1410"
            size="small"
          />
        ) : (
          <>
            <Text style={styles.confirmButtonText}>{confirmButtonText}</Text>
            <Text style={styles.confirmButtonIcon}>✓</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  confirmButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 40,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonIcon: {
    color: "#1C1410",
    fontSize: 18,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#1C1410",
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 80,
    textAlign: "center",
  },
  emojiContainer: {
    alignItems: "center",
    height: 120,
    justifyContent: "center",
    marginVertical: 24,
    width: 120,
  },
  moodLabel: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    marginTop: 16,
  },
  sliderContainer: {
    marginTop: 48,
    paddingHorizontal: 24,
    width: "100%",
  },
  sliderPoint: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  sliderPointInner: {
    backgroundColor: "#1C1410",
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  sliderPointSelected: {
    backgroundColor: "#FFFFFF",
    height: 28,
    width: 28,
  },
  sliderTrack: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 14,
    flexDirection: "row",
    height: 4,
    justifyContent: "space-between",
    paddingHorizontal: 12,
    width: "100%",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default MoodSelector;
