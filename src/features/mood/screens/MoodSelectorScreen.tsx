/**
 * MoodSelectorScreen Component
 * @description Interactive mood selector with curved slider and full-screen color backgrounds
 * @task Task 3.8.3: Mood Selector Screen (Screens 69-73)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface MoodOption {
  index: number;
  label: string;
  emoji: string;
  color: string;
}

interface MoodSelectorScreenProps {
  selectedMoodIndex: number;
  moodOptions: MoodOption[];
  onBack: () => void;
  onMoodChange: (index: number) => void;
  onSetMood: () => void;
}

export function MoodSelectorScreen({
  selectedMoodIndex,
  moodOptions,
  onBack,
  onMoodChange,
  onSetMood,
}: MoodSelectorScreenProps): React.ReactElement {
  const selectedMood = moodOptions[selectedMoodIndex];

  return (
    <View
      testID="mood-selector-screen"
      style={[styles.container, { backgroundColor: selectedMood.color }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Question Prompt */}
        <Text style={styles.promptText}>How are you feeling this day?</Text>

        {/* Large Emoji Display */}
        <View testID="mood-emoji-display" style={styles.emojiContainer}>
          <Text style={styles.largeEmoji}>{selectedMood.emoji}</Text>
        </View>

        {/* Mood Label */}
        <Text style={styles.moodLabel}>
          I'm Feeling {selectedMood.label}
        </Text>
      </View>

      {/* Curved Mood Slider */}
      <View testID="mood-slider" style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          {moodOptions.map((option) => (
            <TouchableOpacity
              key={option.index}
              testID={`slider-point-${option.index}`}
              style={[
                styles.sliderPoint,
                option.index === selectedMoodIndex && styles.sliderPointActive,
              ]}
              onPress={() => onMoodChange(option.index)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${option.label}`}
            >
              <View
                style={[
                  styles.sliderDot,
                  option.index === selectedMoodIndex && styles.sliderDotActive,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Set Mood Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          testID="set-mood-button"
          style={styles.setMoodButton}
          onPress={onSetMood}
          accessibilityRole="button"
          accessibilityLabel="Set mood"
        >
          <Text style={styles.checkmarkIcon}>✓</Text>
          <Text style={styles.setMoodText}>Set Mood</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: `${palette.white}${palette.alpha[30]}`,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "600",
  },
  buttonContainer: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  checkmarkIcon: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  container: {
    flex: 1,
    paddingTop: 60,
  },
  content: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emojiContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 24,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 24,
  },
  largeEmoji: {
    fontSize: 80,
  },
  moodLabel: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  promptText: {
    color: `${palette.white}${palette.alpha[80]}`,
    fontSize: 18,
    textAlign: "center",
  },
  setMoodButton: {
    alignItems: "center",
    backgroundColor: `${palette.black}${palette.alpha[20]}`,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  setMoodText: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  sliderContainer: {
    paddingBottom: 32,
    paddingHorizontal: 40,
  },
  sliderDot: {
    backgroundColor: `${palette.white}${palette.alpha[50]}`,
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  sliderDotActive: {
    backgroundColor: palette.white,
    borderRadius: 10,
    height: 20,
    width: 20,
  },
  sliderPoint: {
    alignItems: "center",
    height: 24,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 24,
  },
  sliderPointActive: {
    height: 32,
    width: 32,
  },
  sliderTrack: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default MoodSelectorScreen;
