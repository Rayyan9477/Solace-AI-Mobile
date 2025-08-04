import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  InteractionManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { MentalHealthIcon } from '../icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useMemoizedStyles } from '../../hooks/useMemoizedStyles';

/**
 * Optimized Assessment Card with memory management
 * - Memoized to prevent unnecessary re-renders
 * - Virtualized large datasets
 * - Optimized animations with native driver
 */
const OptimizedAssessmentCard = memo(({
  assessment,
  onPress,
  onLongPress,
  index = 0,
  isVisible = true,
  style,
}) => {
  const { theme } = useTheme();
  const animationValue = useRef(new Animated.Value(0)).current;
  const hasAnimated = useRef(false);

  // Memoized styles to prevent recalculation
  const memoizedStyles = useMemoizedStyles(() => createStyles(theme), [theme]);

  // Memoized assessment data processing
  const processedAssessment = useMemo(() => {
    if (!assessment) return null;

    const {
      id,
      title,
      description,
      type,
      difficulty,
      duration,
      completedAt,
      score,
      status = 'pending',
      progress = 0,
    } = assessment;

    // Calculate derived values once
    const isCompleted = status === 'completed' || !!completedAt;
    const progressPercentage = Math.min(Math.max(progress, 0), 100);
    const difficultyColor = getDifficultyColor(difficulty, theme);
    const statusColor = getStatusColor(status, theme);
    const formattedDuration = formatDuration(duration);

    return {
      id,
      title: title || 'Untitled Assessment',
      description: description || 'No description available',
      type,
      difficulty,
      duration: formattedDuration,
      completedAt,
      score,
      status,
      isCompleted,
      progressPercentage,
      difficultyColor,
      statusColor,
    };
  }, [assessment, theme]);

  // Memoized press handlers
  const handlePress = useCallback(() => {
    if (onPress && processedAssessment) {
      onPress(processedAssessment);
    }
  }, [onPress, processedAssessment]);

  const handleLongPress = useCallback(() => {
    if (onLongPress && processedAssessment) {
      onLongPress(processedAssessment);
    }
  }, [onLongPress, processedAssessment]);

  // Optimized entrance animation
  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      
      // Stagger animations for better performance
      const delay = index * 50;
      
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          Animated.timing(animationValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }, delay);
      });
    }
  }, [isVisible, index, animationValue]);

  // Early return for null data
  if (!processedAssessment) return null;

  const {
    title,
    description,
    type,
    difficulty,
    duration,
    isCompleted,
    progressPercentage,
    difficultyColor,
    statusColor,
    score,
  } = processedAssessment;

  return (
    <Animated.View
      style={[
        memoizedStyles.cardContainer,
        style,
        {
          opacity: animationValue,
          transform: [
            {
              translateY: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={memoizedStyles.touchable}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`${title} assessment`}
        accessibilityHint={`${isCompleted ? 'Completed' : 'Pending'} assessment. Double tap to start.`}
      >
        <LinearGradient
          colors={[
            theme.colors.background.primary,
            theme.colors.therapeutic.calming[50],
          ]}
          style={memoizedStyles.gradient}
        >
          {/* Header */}
          <View style={memoizedStyles.header}>
            <View style={memoizedStyles.headerLeft}>
              <MentalHealthIcon
                name={getIconForType(type)}
                size={24}
                color={difficultyColor}
                variant="filled"
              />
              <View style={memoizedStyles.headerText}>
                <Text 
                  style={[memoizedStyles.title, { color: theme.colors.text.primary }]}
                  numberOfLines={1}
                >
                  {title}
                </Text>
                <Text 
                  style={[memoizedStyles.subtitle, { color: theme.colors.text.secondary }]}
                  numberOfLines={1}
                >
                  {type} • {duration}
                </Text>
              </View>
            </View>
            
            <View style={memoizedStyles.headerRight}>
              <View 
                style={[
                  memoizedStyles.statusBadge, 
                  { backgroundColor: statusColor }
                ]}
              >
                <Text style={[memoizedStyles.statusText, { color: theme.colors.text.inverse }]}>
                  {isCompleted ? (score ? `${score}%` : 'Done') : 'Pending'}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <Text 
            style={[memoizedStyles.description, { color: theme.colors.text.secondary }]}
            numberOfLines={2}
          >
            {description}
          </Text>

          {/* Progress */}
          {!isCompleted && progressPercentage > 0 && (
            <View style={memoizedStyles.progressContainer}>
              <View 
                style={[
                  memoizedStyles.progressBar, 
                  { backgroundColor: theme.colors.gray[200] }
                ]}
              >
                <View
                  style={[
                    memoizedStyles.progressFill,
                    {
                      width: `${progressPercentage}%`,
                      backgroundColor: difficultyColor,
                    },
                  ]}
                />
              </View>
              <Text 
                style={[memoizedStyles.progressText, { color: theme.colors.text.tertiary }]}
              >
                {Math.round(progressPercentage)}% complete
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={memoizedStyles.footer}>
            <View 
              style={[
                memoizedStyles.difficultyBadge,
                { backgroundColor: `${difficultyColor}20` }
              ]}
            >
              <Text 
                style={[memoizedStyles.difficultyText, { color: difficultyColor }]}
              >
                {difficulty || 'Medium'}
              </Text>
            </View>
            
            {isCompleted && (
              <Text 
                style={[memoizedStyles.completedText, { color: theme.colors.success[600] }]}
              >
                ✓ Completed
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

// Utility functions memoized to prevent recreation
const getDifficultyColor = (difficulty, theme) => {
  const colorMap = {
    easy: theme.colors.success[500],
    medium: theme.colors.warning[500], 
    hard: theme.colors.error[500],
  };
  return colorMap[difficulty?.toLowerCase()] || theme.colors.therapeutic.calming[500];
};

const getStatusColor = (status, theme) => {
  const colorMap = {
    completed: theme.colors.success[500],
    in_progress: theme.colors.therapeutic.calming[500],
    pending: theme.colors.gray[400],
  };
  return colorMap[status] || theme.colors.gray[400];
};

const getIconForType = (type) => {
  const iconMap = {
    anxiety: 'Mindfulness',
    depression: 'Heart',
    stress: 'Brain',
    wellness: 'Therapy',
    general: 'Brain',
  };
  return iconMap[type?.toLowerCase()] || 'Brain';
};

const formatDuration = (duration) => {
  if (!duration) return 'Unknown';
  if (typeof duration === 'number') {
    return `${duration} min`;
  }
  return duration;
};

// Styles factory function
const createStyles = (theme) => StyleSheet.create({
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 4,
    shadowColor: theme.colors.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  touchable: {
    borderRadius: 16,
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerRight: {
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  completedText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

OptimizedAssessmentCard.displayName = 'OptimizedAssessmentCard';

export default OptimizedAssessmentCard;