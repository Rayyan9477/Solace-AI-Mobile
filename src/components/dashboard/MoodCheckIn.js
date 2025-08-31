import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";

import FreudDesignSystem, {
  FreudColors,
  FreudShadows,
  FreudBorderRadius,
  FreudSpacing,
  FreudTypography,
} from "../../shared/theme/FreudDesignSystem";
import { useTheme } from "../../shared/theme/UnifiedThemeProvider";
import { MentalHealthIcon } from "../icons";

const { width: screenWidth } = Dimensions.get("window");

// Simplified mood options focused on core emotions
const MOOD_OPTIONS = [
  {
    id: "happy",
    emoji: "😊",
    label: "Happy",
    description: "Feeling joyful and positive",
    color: FreudColors.zenYellow[50],
    gradientColors: [FreudColors.zenYellow[40], FreudColors.zenYellow[60]],
    icon: "Heart",
  },
  {
    id: "calm",
    emoji: "😌",
    label: "Calm",
    description: "Peaceful and relaxed",
    color: FreudColors.serenityGreen[50],
    gradientColors: [
      FreudColors.serenityGreen[40],
      FreudColors.serenityGreen[60],
    ],
    icon: "Mindfulness",
  },
  {
    id: "neutral",
    emoji: "😐",
    label: "Neutral",
    description: "Feeling balanced",
    color: FreudColors.optimisticGray[50],
    gradientColors: [
      FreudColors.optimisticGray[40],
      FreudColors.optimisticGray[60],
    ],
    icon: "Brain",
  },
  {
    id: "anxious",
    emoji: "😰",
    label: "Anxious",
    description: "Feeling worried or restless",
    color: FreudColors.empathyOrange[50],
    gradientColors: [
      FreudColors.empathyOrange[40],
      FreudColors.empathyOrange[60],
    ],
    icon: "Therapy",
  },
  {
    id: "sad",
    emoji: "😔",
    label: "Sad",
    description: "Feeling down or low",
    color: FreudColors.kindPurple[50],
    gradientColors: [FreudColors.kindPurple[40], FreudColors.kindPurple[60]],
    icon: "Journal",
  },
];

// Simple mood button component with gentle animations
const MoodButton = ({ mood, isSelected, onPress, isDarkMode }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(0.8)).current;

  const handlePress = () => {
    // Gentle bounce animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: isSelected ? 1.05 : 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    onPress(mood);
  };

  useEffect(() => {
    Animated.timing(opacityValue, {
      toValue: isSelected ? 1 : 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  return (
    <Animated.View
      style={[
        styles.moodButtonContainer,
        {
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.moodButton, isSelected && styles.selectedMoodButton]}
        activeOpacity={0.9}
        accessibilityLabel={`${mood.label} mood`}
        accessibilityHint={`${mood.description}. Double tap to select this mood.`}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        <LinearGradient
          colors={mood.gradientColors}
          style={styles.moodGradient}
          start={[0, 0]}
          end={[1, 1]}
        >
          <MentalHealthIcon
            name={mood.icon}
            size={16}
            color="rgba(255, 255, 255, 0.8)"
            style={styles.moodIcon}
          />
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
          <Text style={styles.moodLabel}>{mood.label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const MoodCheckIn = ({
  currentMood,
  onCheckIn,
  compact = false,
  disabled = false,
}) => {
  const { theme, isDarkMode } = useTheme();
  const [selectedMood, setSelectedMood] = useState(currentMood);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle entrance animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.id);
    onCheckIn?.(mood.id, mood);
  };

  // Compact version for dashboard
  if (compact) {
    return (
      <Animated.View style={[styles.compactContainer, { opacity: fadeAnim }]}>
        <View style={styles.compactMoodGrid}>
          {MOOD_OPTIONS.map((mood) => (
            <MoodButton
              key={mood.id}
              mood={mood}
              isSelected={selectedMood === mood.id}
              onPress={handleMoodSelect}
              isDarkMode={isDarkMode}
            />
          ))}
        </View>

        {selectedMood && (
          <View style={styles.selectedMoodDisplay}>
            <LinearGradient
              colors={[
                FreudColors.serenityGreen[20],
                FreudColors.serenityGreen[10],
              ]}
              style={styles.selectedMoodGradient}
            >
              <MentalHealthIcon
                name="Heart"
                size={16}
                color={FreudColors.serenityGreen[70]}
              />
              <Text
                style={[
                  styles.selectedMoodText,
                  {
                    color: isDarkMode
                      ? FreudDesignSystem.themes.dark.colors.text.primary
                      : FreudDesignSystem.themes.light.colors.text.primary,
                  },
                ]}
              >
                Feeling{" "}
                {MOOD_OPTIONS.find(
                  (m) => m.id === selectedMood,
                )?.label?.toLowerCase() || "neutral"}
              </Text>
            </LinearGradient>
          </View>
        )}
      </Animated.View>
    );
  }

  // Full version for dedicated mood tracking
  return (
    <Animated.View style={[styles.fullContainer, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <MentalHealthIcon
          name="Heart"
          size={24}
          color={FreudColors.mindfulBrown[70]}
        />
        <Text
          style={[
            styles.title,
            {
              color: isDarkMode
                ? FreudDesignSystem.themes.dark.colors.text.primary
                : FreudDesignSystem.themes.light.colors.text.primary,
            },
          ]}
        >
          How are you feeling?
        </Text>
      </View>

      <Text
        style={[
          styles.subtitle,
          {
            color: isDarkMode
              ? FreudDesignSystem.themes.dark.colors.text.secondary
              : FreudDesignSystem.themes.light.colors.text.secondary,
          },
        ]}
      >
        Tap the mood that best describes how you feel right now
      </Text>

      <View style={styles.fullMoodGrid}>
        {MOOD_OPTIONS.map((mood) => (
          <MoodButton
            key={mood.id}
            mood={mood}
            isSelected={selectedMood === mood.id}
            onPress={handleMoodSelect}
            isDarkMode={isDarkMode}
          />
        ))}
      </View>

      {selectedMood && (
        <View style={styles.selectedMoodDisplay}>
          <LinearGradient
            colors={[
              FreudColors.serenityGreen[20],
              FreudColors.serenityGreen[10],
            ]}
            style={styles.selectedMoodGradient}
          >
            <MentalHealthIcon
              name="Insights"
              size={20}
              color={FreudColors.serenityGreen[70]}
            />
            <View style={styles.selectedMoodInfo}>
              <Text
                style={[
                  styles.selectedMoodLabel,
                  {
                    color: isDarkMode
                      ? FreudDesignSystem.themes.dark.colors.text.primary
                      : FreudDesignSystem.themes.light.colors.text.primary,
                  },
                ]}
              >
                You're feeling{" "}
                {MOOD_OPTIONS.find(
                  (m) => m.id === selectedMood,
                )?.label?.toLowerCase()}
              </Text>
              <Text
                style={[
                  styles.selectedMoodDescription,
                  {
                    color: isDarkMode
                      ? FreudDesignSystem.themes.dark.colors.text.secondary
                      : FreudDesignSystem.themes.light.colors.text.secondary,
                  },
                ]}
              >
                {MOOD_OPTIONS.find((m) => m.id === selectedMood)?.description}
              </Text>
            </View>
          </LinearGradient>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Compact version styles
  compactContainer: {
    paddingVertical: FreudSpacing[2],
  },
  compactMoodGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: FreudSpacing[3],
  },

  // Full version styles
  fullContainer: {
    padding: FreudSpacing[4],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: FreudSpacing[2],
  },
  title: {
    fontSize: FreudTypography.sizes.xl,
    fontWeight: FreudTypography.weights.semiBold,
    marginLeft: FreudSpacing[3],
  },
  subtitle: {
    fontSize: FreudTypography.sizes.sm,
    fontWeight: FreudTypography.weights.normal,
    lineHeight: FreudTypography.sizes.sm * FreudTypography.lineHeights.relaxed,
    opacity: 0.8,
    marginBottom: FreudSpacing[4],
  },
  fullMoodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: FreudSpacing[3],
    marginBottom: FreudSpacing[4],
  },

  // Mood button styles
  moodButtonContainer: {
    width: compact
      ? (screenWidth - FreudSpacing[8] - FreudSpacing[3] * 4) / 5
      : (screenWidth - FreudSpacing[8] - FreudSpacing[3] * 4) / 5,
  },
  moodButton: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: FreudBorderRadius.lg,
    overflow: "hidden",
    ...FreudShadows.sm,
  },
  selectedMoodButton: {
    ...FreudShadows.md,
  },
  moodGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: FreudSpacing[2],
  },
  moodIcon: {
    marginBottom: FreudSpacing[1],
  },
  moodEmoji: {
    fontSize: FreudTypography.sizes.lg,
    marginBottom: FreudSpacing[1],
  },
  moodLabel: {
    fontSize: FreudTypography.sizes.xs,
    fontWeight: FreudTypography.weights.semiBold,
    color: "#FFFFFF",
    textAlign: "center",
  },

  // Selected mood display
  selectedMoodDisplay: {
    marginTop: FreudSpacing[3],
    borderRadius: FreudBorderRadius.lg,
    overflow: "hidden",
    ...FreudShadows.sm,
  },
  selectedMoodGradient: {
    padding: FreudSpacing[3],
    flexDirection: "row",
    alignItems: "center",
  },
  selectedMoodText: {
    fontSize: FreudTypography.sizes.sm,
    fontWeight: FreudTypography.weights.medium,
    marginLeft: FreudSpacing[2],
  },
  selectedMoodInfo: {
    flex: 1,
    marginLeft: FreudSpacing[3],
  },
  selectedMoodLabel: {
    fontSize: FreudTypography.sizes.base,
    fontWeight: FreudTypography.weights.medium,
    marginBottom: FreudSpacing[1],
  },
  selectedMoodDescription: {
    fontSize: FreudTypography.sizes.sm,
    fontWeight: FreudTypography.weights.normal,
    opacity: 0.8,
  },
});

export default MoodCheckIn;

// Export mood options for use in other components
export { MOOD_OPTIONS };
