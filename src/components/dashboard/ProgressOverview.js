import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const ProgressOverview = ({ weeklyStats, userStats }) => {
  const { theme } = useTheme();
  

  const getProgressColor = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return theme.colors.success[500];
    if (percentage >= 60) return theme.colors.warning[500];
    return theme.colors.error[500];
  };

  const StatItem = ({ label, value, unit, color, progress }) => (
    <View style={styles.statItem}>
      <View style={styles.statHeader}>
        <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
          {label}
        </Text>
        <View style={[styles.statValue, { backgroundColor: color }]}>
          <Text style={styles.statValueText}>{value}</Text>
          {unit && <Text style={styles.statUnit}>{unit}</Text>}
        </View>
      </View>
      {progress !== undefined && (
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: color, width: `${progress}%` },
            ]}
          />
        </View>
      )}
    </View>
  );

  const streakProgress = Math.min((userStats.streakDays / 30) * 100, 100);
  const moodProgress = Math.min((weeklyStats.totalEntries / 7) * 100, 100);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Weekly Progress
      </Text>
      
      <View style={styles.statsGrid}>
        <StatItem
          label="Current Streak"
          value={userStats.streakDays}
          unit="days"
          color={getProgressColor(userStats.streakDays, 30)}
          progress={streakProgress}
        />
        
        <StatItem
          label="Mood Entries"
          value={weeklyStats.totalEntries}
          unit="this week"
          color={getProgressColor(weeklyStats.totalEntries, 7)}
          progress={moodProgress}
        />
        
        <StatItem
          label="Avg. Mood"
          value={weeklyStats.averageIntensity.toFixed(1)}
          unit="/5"
          color={getProgressColor(weeklyStats.averageIntensity, 5)}
        />
        
        <StatItem
          label="Sessions"
          value={userStats.totalSessions}
          unit="total"
          color={theme.colors.primary[500]}
        />
      </View>

      {weeklyStats.mostCommonMood && (
        <View style={styles.moodSummary}>
          <Text style={[styles.moodSummaryTitle, { color: theme.colors.text.primary }]}>
            Most Common Mood This Week
          </Text>
          <View style={styles.moodSummaryBadge}>
            <Text style={styles.moodSummaryText}>
              {weeklyStats.mostCommonMood.charAt(0).toUpperCase() + weeklyStats.mostCommonMood.slice(1)}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[4],
    marginVertical: spacing[3],
    padding: spacing[4],
    borderRadius: borderRadius.md,
    ...shadows.base,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing[4],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: spacing[3],
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  statLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.sm,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  statValueText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
  },
  statUnit: {
    color: colors.text.inverse,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    marginLeft: spacing[1],
    opacity: 0.9,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  moodSummary: {
    marginTop: spacing[4],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    alignItems: 'center',
  },
  moodSummaryTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.sm,
    marginBottom: spacing[2],
  },
  moodSummaryBadge: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.full,
  },
  moodSummaryText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
  },
});

export default ProgressOverview;
