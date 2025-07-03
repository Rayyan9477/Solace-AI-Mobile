import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const DailyInsights = ({ insights }) => {
  const { theme } = useTheme();
  

  if (!insights || insights.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Daily Insights
        </Text>
        <Text style={[styles.noInsights, { color: theme.colors.text.secondary }]}>
          Check back later for personalized insights based on your mood patterns.
        </Text>
      </View>
    );
  }

  const getInsightColors = (type) => {
    switch (type) {
      case 'positive':
        return {
          background: theme.colors.success[50],
          border: theme.colors.success[200],
          text: theme.colors.success[800],
        };
      case 'suggestion':
        return {
          background: theme.colors.warning[50],
          border: theme.colors.warning[200],
          text: theme.colors.warning[800],
        };
      case 'alert':
        return {
          background: theme.colors.error[50],
          border: theme.colors.error[200],
          text: theme.colors.error[800],
        };
      default:
        return {
          background: theme.colors.primary[50],
          border: theme.colors.primary[200],
          text: theme.colors.primary[800],
        };
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        Daily Insights
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.insightsContainer}
      >
        {insights.map((insight, index) => {
          const insightColors = getInsightColors(insight.type);
          
          return (
            <View
              key={insight.id || index}
              style={[
                styles.insightCard,
                {
                  backgroundColor: insightColors.background,
                  borderColor: insightColors.border,
                },
              ]}
            >
              <Text style={styles.insightIcon}>{insight.icon}</Text>
              <Text style={[styles.insightTitle, { color: insightColors.text }]}>
                {insight.title}
              </Text>
              <Text style={[styles.insightMessage, { color: insightColors.text }]}>
                {insight.message}
              </Text>
            </View>
          );
        })}
      </ScrollView>
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
  noInsights: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  insightsContainer: {
    paddingRight: theme.spacing[4],
  },
  insightCard: {
    width: 200,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    marginRight: theme.spacing[3],
    ...theme.shadows.sm,
  },
  insightIcon: {
    fontSize: theme.typography.sizes['2xl'],
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  insightTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.base,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  insightMessage: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.sm,
    textAlign: 'center',
  },
});

export default DailyInsights;
