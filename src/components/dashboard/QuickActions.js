import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import LinearGradient from 'expo-linear-gradient';

// Icons and Theme
import { MentalHealthIcon } from "../icons";
import { useTheme } from "../../shared/theme/ThemeContext";
import FreudDesignSystem, { 
  FreudColors, 
  FreudSpacing, 
  FreudTypography, 
  FreudShadows, 
  FreudBorderRadius 
} from '../../shared/theme/FreudDesignSystem';

const { width: screenWidth } = Dimensions.get('window');

// Mental health focused actions with therapeutic colors and icons
const QUICK_ACTIONS = [
  {
    id: "chat",
    title: "AI Therapy",
    subtitle: "Talk with Dr. Freud",
    icon: "Therapy",
    gradientColors: [FreudColors.mindfulBrown[60], FreudColors.mindfulBrown[80]],
    shadowColor: FreudColors.mindfulBrown[70],
    accessibilityLabel: "Start AI Therapy Session",
    accessibilityHint: "Begin a conversation with your AI therapist for guidance and support",
  },
  {
    id: "assessment",
    title: "Assessment",
    subtitle: "Check your wellness",
    icon: "Brain",
    gradientColors: [FreudColors.kindPurple[50], FreudColors.kindPurple[70]],
    shadowColor: FreudColors.kindPurple[60],
    accessibilityLabel: "Take Mental Health Assessment",
    accessibilityHint: "Complete a brief assessment to understand your current mental health state",
  },
  {
    id: "mood",
    title: "Mood Tracker",
    subtitle: "Log how you feel",
    icon: "Heart",
    gradientColors: [FreudColors.serenityGreen[50], FreudColors.serenityGreen[70]],
    shadowColor: FreudColors.serenityGreen[60],
    accessibilityLabel: "Open Mood Tracker",
    accessibilityHint: "Record and track your current mood and emotional state",
  },
];

// Individual action button component
const QuickActionButton = ({ action, onPress, isDarkMode }) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={[
      styles.actionButtonContainer, 
      { transform: [{ scale: scaleValue }] }
    ]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.actionButton}
        activeOpacity={0.9}
        accessibilityLabel={action.accessibilityLabel}
        accessibilityHint={action.accessibilityHint}
        accessibilityRole="button"
        testID={`quick-action-${action.id}`}
      >
        <LinearGradient
          colors={action.gradientColors}
          style={styles.actionGradient}
          start={[0, 0]}
          end={[1, 1]}
        >
          <View style={styles.actionContent}>
            <View style={styles.iconContainer}>
              <MentalHealthIcon 
                name={action.icon} 
                size={24} 
                color="#FFFFFF" 
              />
            </View>
            <Text style={styles.actionTitle}>
              {action.title}
            </Text>
            <Text style={styles.actionSubtitle}>
              {action.subtitle}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const QuickActions = ({ onStartChat, onTakeAssessment, onMoodTracker }) => {
  const { theme, isDarkMode } = useTheme();

  // Map actions to handlers
  const actionHandlers = {
    chat: onStartChat,
    assessment: onTakeAssessment,
    mood: onMoodTracker,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MentalHealthIcon 
          name="Therapy" 
          size={24} 
          color={FreudColors.mindfulBrown[70]} 
        />
        <Text style={[styles.title, { 
          color: isDarkMode ? FreudDesignSystem.themes.dark.colors.text.primary : FreudDesignSystem.themes.light.colors.text.primary 
        }]}>
          Quick Wellness Actions
        </Text>
      </View>
      
      <Text style={[styles.subtitle, { 
        color: isDarkMode ? FreudDesignSystem.themes.dark.colors.text.secondary : FreudDesignSystem.themes.light.colors.text.secondary 
      }]}>
        Choose what feels right for you today
      </Text>

      <View style={styles.actionsGrid}>
        {QUICK_ACTIONS.map((action, index) => (
          <QuickActionButton
            key={action.id}
            action={action}
            onPress={actionHandlers[action.id]}
            isDarkMode={isDarkMode}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: FreudSpacing[2],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: FreudSpacing[2],
  },
  title: {
    fontSize: FreudTypography.sizes.lg,
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
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: FreudSpacing[3],
  },
  actionButtonContainer: {
    flex: 1,
    maxWidth: (screenWidth - FreudSpacing[8] - FreudSpacing[3] * 2) / 3,
  },
  actionButton: {
    width: '100%',
    aspectRatio: 0.9,
    borderRadius: FreudBorderRadius.xl,
    overflow: 'hidden',
    ...FreudShadows.md,
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: FreudSpacing[3],
  },
  actionContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: FreudSpacing[2],
  },
  actionTitle: {
    fontSize: FreudTypography.sizes.sm,
    fontWeight: FreudTypography.weights.semiBold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: FreudSpacing[1],
  },
  actionSubtitle: {
    fontSize: FreudTypography.sizes.xs,
    fontWeight: FreudTypography.weights.normal,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: FreudTypography.sizes.xs * FreudTypography.lineHeights.tight,
  },
});

export default QuickActions;