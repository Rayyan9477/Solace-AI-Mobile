import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { MentalHealthAccessibility, createCardAccessibility } from '../../utils/accessibility';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const AssessmentCard = ({ title, description, duration, icon, onStart, onLearnMore, loading }) => {
  const { theme, isScreenReaderEnabled } = useTheme();

  return (
    <View 
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}
      {...createCardAccessibility(
        title,
        `${description}. Duration: ${duration}`,
        'Double tap to view assessment options'
      )}
    >
      <View style={styles.header}>
        <Text 
          style={styles.icon}
          accessibilityElementsHidden={true}
        >
          {icon}
        </Text>
        <View style={styles.titleContainer}>
          <Text 
            style={[styles.title, { color: theme.colors.text.primary }]}
            accessibilityRole="header"
            accessibilityLevel={3}
          >
            {title}
          </Text>
          <Text 
            style={[styles.duration, { color: theme.colors.text.secondary }]}
            accessibilityRole="text"
            accessibilityLabel={`Assessment duration: ${duration}`}
          >
            {duration}
          </Text>
        </View>
      </View>
      
      <Text 
        style={[styles.description, { color: theme.colors.text.secondary }]}
        accessibilityRole="text"
      >
        {description}
      </Text>
      
      <View 
        style={styles.actions}
        accessibilityRole="group"
        accessibilityLabel="Assessment actions"
      >
        <TouchableOpacity
          style={[styles.learnMoreButton, { backgroundColor: theme.colors.gray[200] }]}
          onPress={onLearnMore}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Learn more about ${title}`}
          accessibilityHint="Double tap to view detailed information about this assessment"
        >
          <Text style={[styles.learnMoreText, { color: theme.colors.gray[700] }]}>
            Learn More
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: theme.colors.primary[500] }]}
          onPress={onStart}
          disabled={loading}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={loading ? 'Assessment loading' : `Start ${title} assessment`}
          accessibilityHint={loading 
            ? 'Please wait while the assessment loads' 
            : `Double tap to begin the ${title} assessment, estimated duration ${duration}`}
          accessibilityState={{
            disabled: loading,
            busy: loading,
          }}
        >
          <Text style={styles.startButtonText}>
            {loading ? 'Loading...' : 'Start Assessment'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing[4],
    ...theme.shadows.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  icon: {
    fontSize: theme.typography.sizes['2xl'],
    marginRight: theme.spacing[3],
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.lg,
    marginBottom: theme.spacing[1],
  },
  duration: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.sm,
  },
  description: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.base,
    marginBottom: theme.spacing[4],
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  learnMoreButton: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  learnMoreText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
  },
  startButton: {
    flex: 2,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  startButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
  },
});

export default AssessmentCard;
