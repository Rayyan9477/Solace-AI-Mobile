/**
 * Optimized MoodCheckIn Component
 * Example of styled-components replacement with performance optimization
 */
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";

import { useThemedStyles, useThemeValues } from "../../hooks/useThemedStyles";
import { MentalHealthIcon } from "../icons";

const OptimizedMoodCheckIn = ({ currentMood, onCheckIn }) => {
  const { colors } = useThemeValues();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Optimized styles using hook instead of styled-components
  const styles = useThemedStyles((theme) => ({
    container: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.sm,
      ...theme.shadows.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text.primary,
      marginLeft: theme.spacing.sm,
    },
    moodGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    moodButton: {
      width: "22%",
      aspectRatio: 1,
      borderRadius: theme.borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: theme.spacing.sm,
      ...theme.shadows.sm,
    },
    moodEmoji: {
      fontSize: theme.typography.sizes.xl,
      marginBottom: theme.spacing.xs,
    },
    moodLabel: {
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.medium,
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
    checkInButton: {
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.md,
      overflow: "hidden",
    },
    checkInButtonInner: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      alignItems: "center",
    },
    checkInButtonText: {
      fontSize: theme.typography.sizes.base,
      fontWeight: theme.typography.weights.semibold,
      color: "#FFFFFF",
    },
  }));

  const moodOptions = [
    { key: "happy", emoji: "😊", label: "Happy", color: colors.therapeutic.zen[40] },
    { key: "calm", emoji: "😌", label: "Calm", color: colors.therapeutic.optimistic[40] },
    { key: "anxious", emoji: "😰", label: "Anxious", color: colors.therapeutic.kind[30] },
    { key: "sad", emoji: "😢", label: "Sad", color: colors.primary },
    { key: "excited", emoji: "🤩", label: "Excited", color: colors.therapeutic.empathy[40] },
    { key: "tired", emoji: "😴", label: "Tired", color: colors.secondary },
    { key: "stressed", emoji: "😤", label: "Stressed", color: colors.warning },
    { key: "content", emoji: "😊", label: "Content", color: colors.success },
  ];

  useEffect(() => {
    // Entrance animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for check-in button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [fadeAnim, pulseAnim]);

  const handleMoodSelect = (mood) => {
    if (onCheckIn) {
      onCheckIn(mood);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <MentalHealthIcon
          name="heart"
          size={24}
          color={colors.therapeutic.empathy[60]}
        />
        <Text style={styles.title}>How are you feeling?</Text>
      </View>

      <View style={styles.moodGrid}>
        {moodOptions.map((mood) => (
          <TouchableOpacity
            key={mood.key}
            style={[
              styles.moodButton,
              { backgroundColor: mood.color + "20" }, // 20% opacity
            ]}
            onPress={() => handleMoodSelect(mood.key)}
            accessible={true}
            accessibilityLabel={`Select ${mood.label} mood`}
            accessibilityRole="button"
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View
        style={[
          styles.checkInButton,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <TouchableOpacity
          onPress={() => handleMoodSelect(currentMood || "neutral")}
          accessible={true}
          accessibilityLabel="Complete mood check-in"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={[colors.therapeutic.empathy[60], colors.therapeutic.zen[60]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkInButtonInner}
          >
            <Text style={styles.checkInButtonText}>
              {currentMood ? "Update Mood" : "Check In"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default OptimizedMoodCheckIn;