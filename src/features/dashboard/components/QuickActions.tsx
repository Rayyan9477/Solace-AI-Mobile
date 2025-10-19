import React, { useEffect, useRef } from "react";
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
 * QuickActions Component
 * Displays quick mental health action cards with therapeutic styling
 * Supports accessibility, animations, and haptic feedback
 */
const QuickActions = ({
  onActionPress,
  accessibilityLabel = "Quick mental health actions",
  testID = "quick-actions",
  userContext = {},
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const animations = useRef([]);

  // Mental health actions configuration
  const actions = [
    {
      id: "therapy",
      title: "Start Therapy",
      description: "Connect with a mental health professional",
      icon: "🧠",
      color: theme.colors.therapeutic?.calm || theme.colors.primary?.main || "#007AFF",
      testID: "action-card-therapy",
      accessibilityLabel: "Start therapy session",
      accessibilityHint: "Navigate to therapy booking screen",
      type: "therapy",
    },
    {
      id: "journal",
      title: "Journal Entry",
      description: "Express your thoughts and feelings",
      icon: "📝",
      color: theme.colors.therapeutic?.nurturing || theme.colors.secondary?.main || "#34C759",
      testID: "action-card-journal",
      accessibilityLabel: "Create journal entry",
      accessibilityHint: "Navigate to journaling screen",
      type: "journal",
    },
    {
      id: "mindful",
      title: "Mindfulness",
      description: "Practice mindfulness and meditation",
      icon: "🧘",
      color: theme.colors.therapeutic?.peaceful || theme.colors.info?.main || "#5AC8FA",
      testID: "action-card-mindful",
      accessibilityLabel: "Start mindfulness exercise",
      accessibilityHint: "Navigate to mindfulness screen",
      type: "mindful",
    },
    {
      id: "crisis",
      title: "Crisis Support",
      description: "Immediate help and support available",
      icon: "🚨",
      color: theme.colors.error?.main || "#FF3B30",
      testID: "action-card-crisis",
      accessibilityLabel: "Access crisis support",
      accessibilityHint: "Navigate to crisis intervention screen",
      type: "crisis",
      priority: true,
    },
  ];

  // Initialize animations
  useEffect(() => {
    for (let index = 0; index < actions.length; index++) {
      animations.current[index] = new Animated.Value(0);
    }
  }, []);

  // Start staggered animations
  useEffect(() => {
    if (isReducedMotionEnabled) return;

    const animationDelay = 150;
    for (let index = 0; index < actions.length; index++) {
      Animated.timing(animations.current[index], {
        toValue: 1,
        duration: 500,
        delay: index * animationDelay,
        useNativeDriver: true,
      }).start();
    }
  }, [isReducedMotionEnabled]);

  const handleActionPress = async (action) => {
    // Provide haptic feedback
    if (Platform.OS !== "web") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Call the action handler
    if (onActionPress) {
      onActionPress({
        type: action.type,
        id: action.id,
        timestamp: new Date().toISOString(),
        context: userContext,
      });
    }
  };

  const renderActionCard = (action, index) => {
    const animatedStyle = {
      opacity: isReducedMotionEnabled ? 1 : animations.current[index] || 1,
      transform: [
        {
          translateY: isReducedMotionEnabled
            ? 0
            : animations.current[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }) || 0,
        },
      ],
    };

    return (
      <Animated.View
        key={action.id}
        style={[styles.actionCardContainer, animatedStyle]}
      >
        <TouchableOpacity
          style={[
            styles.actionCard,
            {
              backgroundColor: theme.colors.background?.surface || "#F5F5F5",
              borderColor: action.color,
              minHeight: 80, // Ensure minimum touch target
            },
          ]}
          onPress={() => handleActionPress(action)}
          testID={action.testID}
          accessibilityLabel={action.accessibilityLabel}
          accessibilityHint={action.accessibilityHint}
          accessibilityRole="button"
          accessible={true}
        >
          <LinearGradient
            colors={[action.color + "20", action.color + "10"]}
            style={styles.gradientBackground}
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <View style={styles.actionTextContainer}>
                <Text
                  style={[
                    styles.actionTitle,
                    { color: theme.colors.text?.primary || "#000000" },
                  ]}
                >
                  {action.title}
                </Text>
                <Text
                  style={[
                    styles.actionDescription,
                    { color: theme.colors.text?.secondary || "#666666" },
                  ]}
                >
                  {action.description}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View
      style={styles.container}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessible={true}
    >
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.text?.primary || "#000000" },
        ]}
      >
        Quick Actions
      </Text>
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => renderActionCard(action, index))}
      </View>
    </View>
  );
};

QuickActions.propTypes = {
  onActionPress: PropTypes.func,
  accessibilityLabel: PropTypes.string,
  testID: PropTypes.string,
  userContext: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCardContainer: {
    width: "48%",
    marginBottom: 16,
  },
  actionCard: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradientBackground: {
    flex: 1,
    padding: 12,
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default QuickActions;
