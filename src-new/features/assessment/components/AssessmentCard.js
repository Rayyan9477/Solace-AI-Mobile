import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AccessibleTouchable from '../accessibility/AccessibleTouchable';
import { useTheme } from '../../contexts/ThemeContext';
import { MentalHealthAccessibility, createCardAccessibility } from '../../utils/accessibility';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const AssessmentCard = ({ title, description, duration, icon, onStart, onLearnMore, loading }) => {
  const { theme, isScreenReaderEnabled } = useTheme();
  const componentStyles = styles(theme.theme);

  return (
    <View 
      style={[componentStyles.container, { backgroundColor: theme.colors.background.secondary }]}
      {...createCardAccessibility(
        title,
        `${description}. Duration: ${duration}`,
        'Double tap to view assessment options'
      )}
    >
      <View style={componentStyles.header}>
        <Text 
          style={componentStyles.icon}
          accessibilityElementsHidden={true}
        >
          {icon}
        </Text>
        <View style={componentStyles.titleContainer}>
          <Text 
            style={[componentStyles.title, { color: theme.colors.text.primary }]}
            accessibilityRole="header"
            accessibilityLevel={3}
          >
            {title}
          </Text>
          <Text 
            style={[componentStyles.duration, { color: theme.colors.text.secondary }]}
            accessibilityRole="text"
            accessibilityLabel={`Assessment duration: ${duration}`}
          >
            {duration}
          </Text>
        </View>
      </View>
      
      <Text 
        style={[componentStyles.description, { color: theme.colors.text.secondary }]}
        accessibilityRole="text"
      >
        {description}
      </Text>
      
      <View 
        style={componentStyles.actions}
        accessibilityRole="group"
        accessibilityLabel="Assessment actions"
      >
        <AccessibleTouchable
          style={[componentStyles.learnMoreButton, { backgroundColor: theme.colors.gray[200], minWidth: 44, minHeight: 44 }]}
          onPress={onLearnMore}
          accessibilityLabel={`Learn more about ${title}`}
          accessibilityHint="Double tap to view detailed information about this assessment"
        >
          <Text style={[componentStyles.learnMoreText, { color: theme.colors.gray[700] }]}>
            Learn More
          </Text>
        </AccessibleTouchable>
        
        <AccessibleTouchable
          style={[componentStyles.startButton, { backgroundColor: theme.colors.primary[500], minWidth: 44, minHeight: 44 }]}
          onPress={onStart}
          disabled={loading}
          accessibilityLabel={loading ? 'Assessment loading' : `Start ${title} assessment`}
          accessibilityHint={loading 
            ? 'Please wait while the assessment loads' 
            : `Double tap to begin the ${title} assessment, estimated duration ${duration}`}
          accessibilityState={{
            disabled: loading,
            busy: loading,
          }}
        >
          <Text style={componentStyles.startButtonText}>
            {loading ? 'Loading...' : 'Start Assessment'}
          </Text>
        </AccessibleTouchable>
      </View>
    </View>
  );
};

const styles = (theme) => StyleSheet.create({
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
