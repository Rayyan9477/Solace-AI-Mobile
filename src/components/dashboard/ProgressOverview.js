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
    marginHorizontal: theme.theme.spacing[4],
    marginVertical: theme.theme.spacing[3],
    padding: theme.theme.spacing[4],
    borderRadius: theme.theme.borderRadius.md,
    ...theme.theme.shadows.base,
  },
  title: {
    fontSize: theme.theme.typography.sizes.lg,
    fontWeight: '600',
    lineHeight: theme.theme.typography.lineHeights.lg,
    marginBottom: theme.theme.spacing[4],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.theme.spacing[3],
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: theme.theme.spacing[3],
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.theme.spacing[2],
  },
  statLabel: {
    fontSize: theme.theme.typography.sizes.sm,
    fontWeight: '500',
    lineHeight: theme.theme.typography.lineHeights.sm,
  },
  statValue: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.theme.spacing[2],
    paddingVertical: theme.theme.spacing[1],
    borderRadius: theme.theme.borderRadius.sm,
  },
  statValueText: {
    color: theme.colors.text.inverse,
    fontSize: theme.theme.typography.sizes.base,
    fontWeight: '600',
  },
  statUnit: {
    color: theme.colors.text.inverse,
    fontSize: theme.theme.typography.sizes.xs,
    fontWeight: '400',
    marginLeft: theme.theme.spacing[1],
    opacity: 0.9,
  },
  progressBar: {
    height: 44,
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.theme.borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.theme.borderRadius.sm,
  },
  moodSummary: {
    marginTop: theme.theme.spacing[4],
    paddingTop: theme.theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    alignItems: 'center',
  },
  moodSummaryTitle: {
    fontSize: theme.theme.typography.sizes.sm,
    fontWeight: '500',
    lineHeight: theme.theme.typography.lineHeights.sm,
    marginBottom: theme.theme.spacing[2],
  },
  moodSummaryBadge: {
    paddingHorizontal: theme.theme.spacing[4],
    paddingVertical: theme.theme.spacing[2],
    backgroundColor: theme.colors.primary[100],
    borderRadius: theme.theme.borderRadius.full,
  },
  moodSummaryText: {
    color: theme.colors.primary[700],
    fontSize: theme.theme.typography.sizes.sm,
    fontWeight: '600',
  },
});

export default ProgressOverview;
