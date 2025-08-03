import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

import { useTheme } from "../../contexts/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../styles/theme";
import { MentalHealthIcon } from "../icons";
import {
  TouchTargetHelpers,
  WCAG_CONSTANTS,
  FocusManagement,
  MentalHealthAccessibility,
} from "../../utils/accessibility";

const MoodCheckIn = ({ 
  currentMood, 
  onCheckIn,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  testID = 'mood-check-in',
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Enhanced touch target sizing
  const { style: touchTargetStyle, hitSlop } = TouchTargetHelpers.ensureMinimumTouchTarget({
    minWidth: WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE,
    minHeight: WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE,
  });

  const moodEmojis = {
    happy: "😊",
    calm: "😌",
    anxious: "😰",
    sad: "😢",
    angry: "😠",
    neutral: "😐",
    excited: "🤩",
    tired: "😴",
    stressed: "😤",
    content: "😊",
  };

  const moodColors = {
    happy: theme.colors.mood.happy,
    calm: theme.colors.mood.calm,
    anxious: theme.colors.mood.anxious,
    sad: theme.colors.mood.sad,
    angry: theme.colors.mood.angry,
    neutral: theme.colors.mood.neutral,
    excited: theme.colors.mood.excited,
    tired: theme.colors.mood.tired,
    stressed: theme.colors.mood.stressed,
    content: theme.colors.mood.content,
  };

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );

    if (!currentMood) {
      pulseAnimation.start();
    }

    return () => pulseAnimation.stop();
  }, [currentMood, pulseAnim, fadeAnim]);

  const getCurrentMoodDisplay = () => {
    if (currentMood) {
      return {
        emoji: moodEmojis[currentMood],
        color: moodColors[currentMood],
        text: currentMood.charAt(0).toUpperCase() + currentMood.slice(1),
      };
    }
    return null;
  };

  const moodDisplay = getCurrentMoodDisplay();

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={[
          theme.colors.background.primary,
          theme.colors.background.secondary,
        ]}
        style={[styles.cardBackground, shadows.md]}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MentalHealthIcon
              name="Heart"
              size="sm"
              colorScheme="nurturing"
              style={styles.titleIcon}
            />
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              Daily Mood Check-in
            </Text>
          </View>
          <Text
            style={[styles.subtitle, { color: theme.colors.text.secondary }]}
          >
            {moodDisplay
              ? "Update your mood"
              : "How are you feeling right now?"}
          </Text>
        </View>

        {moodDisplay && (
          <Animated.View
            style={[
              styles.currentMoodContainer,
              { backgroundColor: theme.colors.background.surface },
            ]}
          >
            <LinearGradient
              colors={[moodDisplay.color, moodDisplay.color + "80"]}
              style={styles.currentMoodIndicator}
            >
              <Text style={styles.currentMoodEmoji}>{moodDisplay.emoji}</Text>
            </LinearGradient>
            <View style={styles.currentMoodTextContainer}>
              <Text
                style={[
                  styles.currentMoodLabel,
                  { color: theme.colors.text.tertiary },
                ]}
              >
                Currently feeling
              </Text>
              <Text
                style={[
                  styles.currentMoodText,
                  { color: theme.colors.text.primary },
                ]}
              >
                {moodDisplay.text}
              </Text>
            </View>
          </Animated.View>
        )}

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            style={styles.checkInButton}
            onPress={onCheckIn}
            activeOpacity={0.8}
            accessible
            accessibilityRole="button"
            accessibilityLabel={moodDisplay ? "Update Mood" : "Check In Now"}
            accessibilityHint="Double tap to open mood check-in"
          >
            <LinearGradient
              colors={[
                theme.colors.therapeutic.calming[500],
                theme.colors.therapeutic.peaceful[500],
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text
                style={[
                  styles.checkInButtonText,
                  { color: theme.colors.text.inverse },
                ]}
              >
                {moodDisplay ? "Update Mood" : "Check In Now"}
              </Text>
              <Text style={styles.checkInButtonIcon}>✨</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[3],
  },
  cardBackground: {
    padding: spacing[5],
    borderRadius: borderRadius.xl,
  },
  header: {
    marginBottom: spacing[5],
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[2],
  },
  titleIcon: {
    marginRight: spacing[2],
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.lg,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm,
  },
  currentMoodContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[5],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: borderRadius.lg,
  },
  currentMoodIndicator: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing[4],
    ...shadows.sm,
  },
  currentMoodEmoji: {
    fontSize: typography.sizes.xl,
  },
  currentMoodTextContainer: {
    flex: 1,
  },
  currentMoodLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginBottom: spacing[0.5],
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  currentMoodText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
  },
  checkInButton: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
  },
  checkInButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
    marginRight: spacing[2],
  },
  checkInButtonIcon: {
    fontSize: typography.sizes.base,
  },
});

export default MoodCheckIn;
