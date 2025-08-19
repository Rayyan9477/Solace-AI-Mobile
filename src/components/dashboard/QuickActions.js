import { WebSafeLinearGradient as LinearGradient } from "../common/WebSafeLinearGradient";
import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../shared/theme/theme";
import { MentalHealthIcon, ActionIcon } from "../icons";

const QuickActions = ({ onStartChat, onTakeAssessment, onMoodTracker }) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const actions = [
    {
      id: "chat",
      title: "Start Chat",
      subtitle: "Talk to AI therapist",
      iconName: "Therapy",
      onPress: onStartChat,
      gradientColors: [
        theme.colors.therapeutic.calming[400],
        theme.colors.therapeutic.calming[600],
      ],
    },
    {
      id: "assessment",
      title: "Take Assessment",
      subtitle: "PHQ-9 or GAD-7",
      iconName: "Journal",
      onPress: onTakeAssessment,
      gradientColors: [
        theme.colors.therapeutic.grounding[400],
        theme.colors.therapeutic.grounding[600],
      ],
    },
    {
      id: "mood",
      title: "Track Mood",
      subtitle: "Log your feelings",
      iconName: "Heart",
      onPress: onMoodTracker,
      gradientColors: [
        theme.colors.therapeutic.nurturing[400],
        theme.colors.therapeutic.nurturing[600],
      ],
    },
  ];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={[
          theme.colors.background.primary,
          theme.colors.background.secondary,
        ]}
        style={[styles.cardBackground, shadows.lg]}
      >
        <View style={styles.titleContainer}>
          <ActionIcon
            name="Add"
            size="sm"
            colorScheme="energizing"
            style={styles.titleIcon}
          />
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Quick Actions
          </Text>
        </View>

        <View style={styles.actionsGrid}>
          {actions.map((action, index) => (
            <Animated.View
              key={action.id}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 30 + index * 10],
                    }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                style={styles.actionCard}
                onPress={action.onPress}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={action.title}
                accessibilityHint={action.subtitle}
                testID={`quick-action-${action.id}`}
              >
                <LinearGradient
                  colors={action.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.actionGradient}
                >
                  <MentalHealthIcon
                    name={action.iconName}
                    size="lg"
                    color={theme.colors.text.inverse}
                    variant="outline"
                    strokeWidth={1.5}
                  />
                  <Text
                    style={[
                      styles.actionTitle,
                      { color: theme.colors.text.inverse },
                    ]}
                  >
                    {action.title}
                  </Text>
                  <Text
                    style={[
                      styles.actionSubtitle,
                      { color: theme.colors.text.inverse },
                    ]}
                  >
                    {action.subtitle}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing[5],
  },
  titleIcon: {
    marginRight: spacing[2],
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.lg,
  },
  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  actionCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  actionGradient: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[3],
    minHeight: 100,
  },
  actionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.sm,
    marginBottom: spacing[1],
    textAlign: "center",
  },
  actionSubtitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.xs,
    textAlign: "center",
    opacity: 0.9,
  },
});

export default QuickActions;
