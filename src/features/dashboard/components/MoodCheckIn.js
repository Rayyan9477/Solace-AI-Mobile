import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import PropTypes from "prop-types";

import { useTheme } from "@theme/ThemeProvider";

/**
 * MoodCheckIn Component
 * Allows users to check in their current mood with therapeutic design
 * Supports accessibility, animations, and mental health features
 */
const MoodCheckIn = ({
  currentMood,
  onCheckIn,
  accessibilityLabel = "Mood check-in component",
  accessibilityHint = "Select your current mood to track your emotional state",
  testID = "mood-check-in",
  disabled = false,
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const [selectedMood, setSelectedMood] = useState(currentMood);
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Mood options with therapeutic colors and accessibility
  const moodOptions = [
    {
      id: "happy",
      label: "Happy",
      emoji: "😊",
      color: theme.colors.mood?.happy || "#FFD700",
      accessibilityLabel: "Feeling happy",
    },
    {
      id: "calm",
      label: "Calm",
      emoji: "😌",
      color: theme.colors.therapeutic?.calm || "#87CEEB",
      accessibilityLabel: "Feeling calm",
    },
    {
      id: "anxious",
      label: "Anxious",
      emoji: "😰",
      color: theme.colors.warning?.main || "#FFA500",
      accessibilityLabel: "Feeling anxious",
      crisisRelated: true,
    },
    {
      id: "sad",
      label: "Sad",
      emoji: "😢",
      color: theme.colors.info?.main || "#5AC8FA",
      accessibilityLabel: "Feeling sad",
    },
    {
      id: "angry",
      label: "Angry",
      emoji: "😠",
      color: theme.colors.error?.main || "#FF3B30",
      accessibilityLabel: "Feeling angry",
    },
    {
      id: "excited",
      label: "Excited",
      emoji: "🤩",
      color: theme.colors.secondary?.main || "#34C759",
      accessibilityLabel: "Feeling excited",
    },
  ];

  // Start pulse animation for encouragement
  useEffect(() => {
    if (isReducedMotionEnabled || disabled) return;

    // Check if Animated.loop is available (for test compatibility)
    if (Animated.loop) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      return () => pulse.stop();
    }
  }, [isReducedMotionEnabled, disabled, pulseAnimation]);

  const handleMoodSelect = async (mood) => {
    if (disabled) return;

    setSelectedMood(mood.id);

    // Provide haptic feedback
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Note: onCheckIn is called when the check-in button is pressed, not when selecting mood
  };

  const getCurrentMoodDisplay = () => {
    if (!selectedMood) return null;
    const mood = moodOptions.find((m) => m.id === selectedMood);
    return mood ? `${mood.emoji} ${mood.label}` : null;
  };

  const getAccessibilityValue = () => {
    const current = getCurrentMoodDisplay();
    return current ? { text: current } : undefined;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: pulseAnimation }],
        },
      ]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityValue={getAccessibilityValue()}
      accessible={true}
    >
      <LinearGradient
        colors={[
          (theme.colors.therapeutic?.calming?.[100] || "#E3F2FD") + "80",
          (theme.colors.therapeutic?.peaceful?.[50] || "#F0F8FF") + "40",
        ]}
        style={styles.gradientBackground}
      >
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: theme.colors.text?.primary || "#000000" },
            ]}
          >
            How are you feeling?
          </Text>

          {selectedMood && (
            <Text
              style={[
                styles.currentMood,
                { color: theme.colors.text?.secondary || "#666666" },
              ]}
            >
              Current mood: {getCurrentMoodDisplay()}
            </Text>
          )}

          <View style={styles.moodGrid}>
            {moodOptions.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodOption,
                  {
                    backgroundColor:
                      selectedMood === mood.id
                        ? mood.color + "30"
                        : theme.colors.background?.surface || "#F5F5F5",
                    borderColor: mood.color,
                    borderWidth: selectedMood === mood.id ? 2 : 1,
                    minHeight: 60, // Ensure minimum touch target
                    minWidth: 60,
                  },
                ]}
                onPress={() => handleMoodSelect(mood)}
                disabled={disabled}
                testID={`mood-option-${mood.id}`}
                accessibilityLabel={mood.accessibilityLabel}
                accessibilityHint={`Select ${mood.label} mood`}
                accessibilityRole="button"
                accessibilityState={{
                  selected: selectedMood === mood.id,
                  disabled,
                }}
                accessible={true}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    {
                      color:
                        selectedMood === mood.id
                          ? mood.color
                          : theme.colors.text?.primary || "#000000",
                    },
                  ]}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.checkInButton,
              {
                backgroundColor: theme.colors.primary?.main || "#007AFF",
                minHeight: 44, // Ensure minimum touch target
              },
            ]}
            onPress={() => {
              if (selectedMood && onCheckIn) {
                const mood = moodOptions.find((m) => m.id === selectedMood);
                if (mood) {
                  onCheckIn(mood.id, {
                    timestamp: new Date().toISOString(),
                    emoji: mood.emoji,
                    label: mood.label,
                    crisisRelated: mood.crisisRelated || false,
                  });
                }
              }
            }}
            disabled={disabled || !selectedMood}
            testID="mood-check-in-button"
            accessibilityLabel="Check in with selected mood"
            accessibilityHint="Submit your current mood selection"
            accessibilityRole="button"
            accessibilityState={{ disabled: disabled || !selectedMood }}
            accessible={true}
          >
            <Text
              style={[
                styles.checkInButtonText,
                {
                  color: theme.colors.primary?.onPrimary || "#FFFFFF",
                  opacity: disabled || !selectedMood ? 0.5 : 1,
                },
              ]}
            >
              Check In
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

MoodCheckIn.propTypes = {
  currentMood: PropTypes.string,
  onCheckIn: PropTypes.func,
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  testID: PropTypes.string,
  disabled: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  gradientBackground: {
    padding: 20,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  currentMood: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  moodOption: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  checkInButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  checkInButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MoodCheckIn;
