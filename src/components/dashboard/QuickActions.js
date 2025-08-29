import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../shared/theme/theme";

const QuickActions = ({ onStartChat, onTakeAssessment, onMoodTracker }) => {
  const { theme } = useTheme();

  const actions = [
    {
      id: "chat",
      title: "AI Therapy",
      subtitle: "Talk with your AI companion",
      icon: "💬",
      color: colors.therapeutic.calming[500],
      onPress: onStartChat,
    },
    {
      id: "assessment",
      title: "Assessment",
      subtitle: "Check your mental health",
      icon: "📝",
      color: colors.therapeutic.nurturing[500],
      onPress: onTakeAssessment,
    },
    {
      id: "mood",
      title: "Mood Tracker",
      subtitle: "Log how you're feeling",
      icon: "😊",
      color: colors.therapeutic.empathy[500],
      onPress: onMoodTracker,
    },
  ];

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Quick Actions
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        What would you like to do today?
      </Text>

      <View style={styles.actionsGrid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, { backgroundColor: action.color + '20' }]}
            onPress={action.onPress}
            accessibilityLabel={action.title}
            accessibilityHint={action.subtitle}
            accessibilityRole="button"
            testID={`quick-action-${action.id}`}
          >
            <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
            </View>
            <Text style={[styles.actionTitle, { color: theme.colors.text.primary }]}>
              {action.title}
            </Text>
            <Text style={[styles.actionSubtitle, { color: theme.colors.text.secondary }]}>
              {action.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    padding: spacing[4],
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm,
    opacity: 0.8,
    marginBottom: spacing[4],
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  actionButton: {
    width: '30%',
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  actionIcon: {
    fontSize: typography.sizes.lg,
  },
  actionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    textAlign: 'center',
    marginBottom: spacing[1],
  },
  actionSubtitle: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default QuickActions;