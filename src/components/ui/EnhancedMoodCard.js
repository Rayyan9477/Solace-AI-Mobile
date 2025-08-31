/**
 * Enhanced Mood Card Component
 * Matches Freud UI Kit design exactly with large emojis, gradient backgrounds, and animations
 */

import anime from "animejs";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { Card, Surface } from "react-native-paper";

import { useFreudTheme } from "./FreudThemeProvider";
import {
  FreudColors,
  FreudSpacing,
  FreudBorderRadius,
  FreudShadows,
  FreudTypography,
} from "../../shared/theme/FreudDesignSystem";

const { width: screenWidth } = Dimensions.get("window");

// Mood configurations matching Freud UI Kit design references
const MOOD_CONFIGS = {
  happy: {
    emoji: "😊",
    label: "Happy",
    description: "I'm feeling joyful",
    colors: FreudColors.zenYellow,
    gradient: [FreudColors.zenYellow[20], FreudColors.zenYellow[10]],
    darkGradient: [FreudColors.zenYellow[60], FreudColors.zenYellow[40]],
    animation: "bounce",
  },
  sad: {
    emoji: "😢",
    label: "Sad",
    description: "I'm feeling down",
    colors: FreudColors.optimisticGray,
    gradient: [FreudColors.optimisticGray[40], FreudColors.optimisticGray[20]],
    darkGradient: [
      FreudColors.optimisticGray[70],
      FreudColors.optimisticGray[50],
    ],
    animation: "pulse",
  },
  stressed: {
    emoji: "😰",
    label: "Stressed",
    description: "I'm feeling overwhelmed",
    colors: FreudColors.empathyOrange,
    gradient: [FreudColors.empathyOrange[30], FreudColors.empathyOrange[10]],
    darkGradient: [
      FreudColors.empathyOrange[60],
      FreudColors.empathyOrange[40],
    ],
    animation: "breathe",
  },
  calm: {
    emoji: "😌",
    label: "Calm",
    description: "I'm feeling peaceful",
    colors: FreudColors.serenityGreen,
    gradient: [FreudColors.serenityGreen[30], FreudColors.serenityGreen[10]],
    darkGradient: [
      FreudColors.serenityGreen[60],
      FreudColors.serenityGreen[40],
    ],
    animation: "wave",
  },
  anxious: {
    emoji: "😟",
    label: "Anxious",
    description: "I'm feeling worried",
    colors: FreudColors.kindPurple,
    gradient: [FreudColors.kindPurple[30], FreudColors.kindPurple[10]],
    darkGradient: [FreudColors.kindPurple[60], FreudColors.kindPurple[40]],
    animation: "energetic",
  },
  neutral: {
    emoji: "😐",
    label: "Neutral",
    description: "I'm feeling okay",
    colors: FreudColors.mindfulBrown,
    gradient: [FreudColors.mindfulBrown[30], FreudColors.mindfulBrown[10]],
    darkGradient: [FreudColors.mindfulBrown[60], FreudColors.mindfulBrown[40]],
    animation: "pulse",
  },
  excited: {
    emoji: "🤗",
    label: "Excited",
    description: "I'm feeling energetic",
    colors: FreudColors.zenYellow,
    gradient: [FreudColors.zenYellow[30], FreudColors.empathyOrange[10]],
    darkGradient: [FreudColors.zenYellow[60], FreudColors.empathyOrange[40]],
    animation: "bounce",
  },
  tired: {
    emoji: "😴",
    label: "Tired",
    description: "I'm feeling drained",
    colors: FreudColors.optimisticGray,
    gradient: [FreudColors.optimisticGray[30], FreudColors.mindfulBrown[10]],
    darkGradient: [
      FreudColors.optimisticGray[60],
      FreudColors.mindfulBrown[40],
    ],
    animation: "breathe",
  },
  content: {
    emoji: "☺️",
    label: "Content",
    description: "I'm feeling satisfied",
    colors: FreudColors.serenityGreen,
    gradient: [FreudColors.serenityGreen[20], FreudColors.zenYellow[10]],
    darkGradient: [FreudColors.serenityGreen[50], FreudColors.zenYellow[40]],
    animation: "wave",
  },
};

// Animation configurations using Framer Motion style
const ANIMATION_CONFIGS = {
  bounce: {
    duration: 1000,
    easing: "easeOutElastic(1, .8)",
    loop: true,
    transform: "scale",
    values: [1, 1.1, 1],
  },
  pulse: {
    duration: 2000,
    easing: "easeInOutQuad",
    loop: true,
    transform: "scale",
    values: [1, 1.05, 1],
  },
  breathe: {
    duration: 4000,
    easing: "easeInOutSine",
    loop: true,
    transform: "scale",
    values: [1, 1.03, 1],
  },
  wave: {
    duration: 3000,
    easing: "easeInOutCubic",
    loop: true,
    transform: "translateY",
    values: [0, -5, 0],
  },
  energetic: {
    duration: 600,
    easing: "easeOutBounce",
    loop: true,
    transform: "rotate",
    values: [0, 5, -5, 0],
  },
};

/**
 * Enhanced Mood Card Component
 */
export const EnhancedMoodCard = ({
  mood = "neutral",
  size = "medium",
  variant = "gradient",
  animated = true,
  selected = false,
  onPress,
  style,
  ...props
}) => {
  const { isDarkMode } = useFreudTheme();
  const config = MOOD_CONFIGS[mood] || MOOD_CONFIGS.neutral;
  const animationRef = useRef(null);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  // Size configurations
  const sizeConfig = useMemo(() => {
    switch (size) {
      case "small":
        return { width: 80, height: 80, fontSize: 32, labelSize: 12 };
      case "large":
        return { width: 140, height: 140, fontSize: 64, labelSize: 16 };
      case "xlarge":
        return { width: 160, height: 160, fontSize: 72, labelSize: 18 };
      case "medium":
      default:
        return { width: 100, height: 100, fontSize: 48, labelSize: 14 };
    }
  }, [size]);

  // Start mood-specific animation
  useEffect(() => {
    if (!animated) return;

    const animConfig =
      ANIMATION_CONFIGS[config.animation] || ANIMATION_CONFIGS.pulse;

    if (Platform.OS === "web") {
      // Use anime.js for web
      const element = animationRef.current;
      if (element) {
        anime({
          targets: element,
          [animConfig.transform]: animConfig.values,
          duration: animConfig.duration,
          easing: animConfig.easing,
          loop: animConfig.loop,
          direction: "alternate",
        });
      }
    } else {
      // Use React Native Animated for mobile
      const createAnimation = () => {
        const animations = animConfig.values.map((value) =>
          Animated.timing(scaleValue, {
            toValue: value,
            duration: animConfig.duration / animConfig.values.length,
            useNativeDriver: true,
          }),
        );

        return Animated.loop(Animated.sequence(animations), { iterations: -1 });
      };

      const animation = createAnimation();
      animation.start();

      return () => animation.stop();
    }
  }, [animated, config.animation, scaleValue]);

  // Handle press interactions
  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      if (onPress) onPress(mood);
    });
  };

  // Render based on variant
  const renderContent = () => {
    const gradientColors = isDarkMode ? config.darkGradient : config.gradient;
    const textColor = isDarkMode
      ? FreudColors.optimisticGray[10]
      : FreudColors.mindfulBrown[90];
    const labelColor = isDarkMode
      ? FreudColors.optimisticGray[30]
      : FreudColors.optimisticGray[70];

    const content = (
      <View style={styles.cardContent}>
        <Text
          style={[styles.emoji, { fontSize: sizeConfig.fontSize }]}
          ref={Platform.OS === "web" ? animationRef : null}
        >
          {config.emoji}
        </Text>
        <Text
          style={[
            styles.label,
            {
              fontSize: sizeConfig.labelSize,
              color: textColor,
              fontWeight: selected
                ? FreudTypography.weights.semiBold
                : FreudTypography.weights.medium,
            },
          ]}
        >
          {config.label}
        </Text>
      </View>
    );

    switch (variant) {
      case "gradient":
        return (
          <LinearGradient
            colors={gradientColors}
            style={[
              styles.card,
              sizeConfig,
              selected && styles.selectedCard,
              style,
            ]}
          >
            {content}
          </LinearGradient>
        );

      case "shader":
        return (
          <View
            style={[
              styles.card,
              sizeConfig,
              {
                backgroundColor: gradientColors[1],
                borderWidth: 2,
                borderColor: gradientColors[0],
              },
              selected && styles.selectedCard,
              style,
            ]}
          >
            {content}
          </View>
        );

      case "glass":
        return (
          <Surface
            style={[
              styles.card,
              styles.glassCard,
              sizeConfig,
              {
                backgroundColor: isDarkMode
                  ? FreudColors.optimisticGray[90] + "CC"
                  : "#FFFFFF" + "CC",
              },
              selected && styles.selectedCard,
              style,
            ]}
            elevation={2}
          >
            {content}
          </Surface>
        );

      case "minimal":
      default:
        return (
          <View
            style={[
              styles.card,
              styles.minimalCard,
              sizeConfig,
              {
                backgroundColor: isDarkMode
                  ? FreudColors.optimisticGray[90]
                  : "#FFFFFF",
                borderColor: selected
                  ? config.colors[60]
                  : isDarkMode
                    ? FreudColors.optimisticGray[70]
                    : FreudColors.optimisticGray[30],
              },
              selected && styles.selectedCard,
              style,
            ]}
          >
            {content}
          </View>
        );
    }
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleValue }] },
        isPressed && styles.pressed,
      ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        accessibilityLabel={`${config.label} mood - ${config.description}`}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    </Animated.View>
  );
};

/**
 * Mood Grid Layout Component
 */
export const MoodGrid = ({
  moods = ["happy", "sad", "stressed", "calm", "anxious", "neutral"],
  selectedMood,
  onMoodSelect,
  size = "medium",
  variant = "gradient",
  animated = true,
  columns = 3,
  style,
}) => {
  const gridItemWidth =
    (screenWidth - FreudSpacing[8] - FreudSpacing[4] * (columns - 1)) / columns;

  return (
    <View style={[styles.moodGrid, style]}>
      {moods.map((mood, index) => (
        <View
          key={mood}
          style={[
            styles.gridItem,
            {
              width: gridItemWidth,
              marginRight: (index + 1) % columns === 0 ? 0 : FreudSpacing[2],
              marginBottom: FreudSpacing[4],
            },
          ]}
        >
          <EnhancedMoodCard
            mood={mood}
            size={size}
            variant={variant}
            animated={animated}
            selected={selectedMood === mood}
            onPress={onMoodSelect}
            style={{ alignSelf: "center" }}
          />
        </View>
      ))}
    </View>
  );
};

/**
 * Mood Slider Layout Component
 */
export const MoodSlider = ({
  moods = ["sad", "neutral", "calm", "happy", "excited"],
  selectedMood,
  onMoodSelect,
  size = "large",
  variant = "gradient",
  animated = true,
  style,
}) => {
  return (
    <View style={[styles.moodSlider, style]}>
      {moods.map((mood) => (
        <EnhancedMoodCard
          key={mood}
          mood={mood}
          size={size}
          variant={variant}
          animated={animated}
          selected={selectedMood === mood}
          onPress={onMoodSelect}
        />
      ))}
    </View>
  );
};

/**
 * Quick Mood Check Component
 */
export const QuickMoodCheck = ({
  selectedMood,
  onMoodSelect,
  size = "small",
  variant = "minimal",
  style,
}) => {
  const quickMoods = ["sad", "neutral", "happy"];

  return (
    <View style={[styles.quickMoodCheck, style]}>
      <Text style={styles.quickMoodTitle}>How are you feeling?</Text>
      <View style={styles.quickMoodOptions}>
        {quickMoods.map((mood) => (
          <EnhancedMoodCard
            key={mood}
            mood={mood}
            size={size}
            variant={variant}
            animated={false}
            selected={selectedMood === mood}
            onPress={onMoodSelect}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Card Styles
  card: {
    borderRadius: FreudBorderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    ...FreudShadows.md,
  },

  selectedCard: {
    ...FreudShadows.lg,
    borderWidth: 2,
    borderColor: FreudColors.serenityGreen[60],
  },

  minimalCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    ...FreudShadows.sm,
  },

  glassCard: {
    borderRadius: FreudBorderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  pressed: {
    opacity: 0.9,
  },

  // Content Styles
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  emoji: {
    textAlign: "center",
    marginBottom: FreudSpacing[2],
    fontSize: 48,
    lineHeight: 58,
  },

  label: {
    textAlign: "center",
    fontSize: FreudTypography.sizes.sm,
    fontWeight: FreudTypography.weights.medium,
  },

  // Layout Styles
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: FreudSpacing[4],
  },

  gridItem: {
    alignItems: "center",
  },

  moodSlider: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: FreudSpacing[4],
    paddingVertical: FreudSpacing[6],
  },

  quickMoodCheck: {
    alignItems: "center",
    paddingVertical: FreudSpacing[4],
  },

  quickMoodTitle: {
    fontSize: FreudTypography.sizes.base,
    fontWeight: FreudTypography.weights.medium,
    marginBottom: FreudSpacing[4],
    color: FreudColors.mindfulBrown[90],
  },

  quickMoodOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: 300,
  },
});

export default EnhancedMoodCard;
