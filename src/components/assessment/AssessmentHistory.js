import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const AssessmentHistory = ({ history, onViewDetails }) => {
  const { theme } = useTheme();
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'minimal':
        return theme.colors.success[500];
      case 'mild':
        return theme.colors.warning[500];
      case 'moderate':
        return theme.colors.error[400];
      case 'severe':
        return theme.colors.error[600];
      default:
        return theme.colors.gray[500];
    }
  };

  const getAssessmentTitle = (assessmentId) => {
    const titles = {
      phq9: 'PHQ-9 Depression',
      gad7: 'GAD-7 Anxiety',
    };
    return titles[assessmentId] || 'Assessment';
  };

  if (history.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
          No assessments completed yet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {history.map((result) => (
        <TouchableOpacity
          key={result.id}
          style={[[styles.historyItem, { backgroundColor: theme.colors.background.secondary , { minWidth: 44, minHeight: 44 }]}]}
          onPress={() =
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="{getAssessmentTitle(result.assessmentId)}"
        accessibilityHint="Double tap to activate"
      > onViewDetails(result)}
          activeOpacity={0.7}
        >
          <View style={styles.historyHeader}>
            <Text style={[styles.historyTitle, { color: theme.colors.text.primary }]}>
              {getAssessmentTitle(result.assessmentId)}
            </Text>
            <Text style={[styles.historyDate, { color: theme.colors.text.secondary }]}>
              {formatDate(result.completedAt)}
            </Text>
          </View>
          
          <View style={styles.historyContent}>
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreLabel, { color: theme.colors.text.secondary }]}>
                Score:
              </Text>
              <Text style={[styles.scoreValue, { color: theme.colors.text.primary }]}>
                {result.totalScore}
              </Text>
            </View>
            
            <View style={[
              styles.severityBadge,
              { backgroundColor: getSeverityColor(result.severity) }
            ]}>
              <Text style={styles.severityText}>
                {result.severity}
              </Text>
            </View>
          </View>
          
          <View style={styles.viewDetailsContainer}>
            <Text style={[styles.viewDetailsText, { color: theme.colors.primary[500] }]}>
              View Details →
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing[3],
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing[8],
  },
  emptyIcon: {
    fontSize: theme.typography.sizes['3xl'],
    marginBottom: theme.spacing[2],
  },
  emptyText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.base,
  },
  historyItem: {
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.base,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  historyTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.base,
  },
  historyDate: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.sm,
  },
  historyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  scoreLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.sm,
  },
  scoreValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    lineHeight: theme.typography.lineHeights.lg,
  },
  severityBadge: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
  },
  severityText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
  },
  viewDetailsContainer: {
    alignItems: 'flex-end',
  },
  viewDetailsText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
  },
});

export default AssessmentHistory;
