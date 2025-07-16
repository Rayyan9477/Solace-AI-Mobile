import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const QuickActions = ({ onStartChat, onTakeAssessment, onMoodTracker }) => {
  const { theme } = useTheme();
  

  const actions = [
    {
      id: 'chat',
      title: 'Start Chat',
      subtitle: 'Talk to AI therapist',
      icon: '💬',
      onPress: onStartChat,
      backgroundColor: theme.colors.primary[500],
    },
    {
      id: 'assessment',
      title: 'Take Assessment',
      subtitle: 'PHQ-9 or GAD-7',
      icon: '📋',
      onPress: onTakeAssessment,
      backgroundColor: theme.colors.secondary[500],
    },
    {
      id: 'mood',
      title: 'Track Mood',
      subtitle: 'Log your feelings',
      icon: '📊',
      onPress: onMoodTracker,
      backgroundColor: theme.colors.success[500],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Quick Actions
      </Text>
      
      <View style={styles.actionsGrid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[[styles.actionCard, { backgroundColor: action.backgroundColor , { minWidth: 44, minHeight: 44 }]}]}
            onPress={action.onPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={action.title}
            accessibilityHint={action.subtitle}
            testID={`quick-action-${action.id}`}
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing[4],
    marginVertical: theme.spacing[3],
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.base,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.lg,
    marginBottom: theme.spacing[4],
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing[3],
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[2],
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  actionIcon: {
    fontSize: theme.typography.sizes['2xl'],
    marginBottom: theme.spacing[2],
  },
  actionTitle: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.sm,
    marginBottom: theme.spacing[1],
    textAlign: 'center',
  },
  actionSubtitle: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.xs,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.xs,
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default QuickActions;
