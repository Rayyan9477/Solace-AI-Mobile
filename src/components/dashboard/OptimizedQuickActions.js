import React, { useRef, useEffect, memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../../contexts/ThemeContext';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../styles/theme';
import { MentalHealthIcon, ActionIcon } from '../icons';

// Memoized action item component
const ActionItem = memo(({ 
  action, 
  index, 
  onPress, 
  fadeAnim, 
  slideAnim 
}) => {
  const handlePress = useCallback(() => {
    onPress(action.id);
  }, [onPress, action.id]);

  const animatedStyle = useMemo(() => ({
    opacity: fadeAnim,
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 30],
          outputRange: [0, 30 + index * 10],
        }),
      },
    ],
  }), [fadeAnim, slideAnim, index]);

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={styles.actionCard}
        onPress={handlePress}
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
            color={colors.text.inverse}
            variant="outline"
            strokeWidth={1.5}
          />
          <Text style={styles.actionTitle}>{action.title}</Text>
          <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

ActionItem.displayName = 'ActionItem';

const OptimizedQuickActions = ({ 
  onStartChat, 
  onTakeAssessment, 
  onMoodTracker 
}) => {
  const { theme } = useTheme();
  const { performanceMetrics } = usePerformanceMonitor('OptimizedQuickActions');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Memoized actions configuration
  const actions = useMemo(() => [
    {
      id: 'chat',
      title: 'Start Chat',
      subtitle: 'Talk to AI therapist',
      iconName: 'Therapy',
      gradientColors: [
        theme.colors.therapeutic.calming[400],
        theme.colors.therapeutic.calming[600],
      ],
    },
    {
      id: 'assessment',
      title: 'Take Assessment',
      subtitle: 'PHQ-9 or GAD-7',
      iconName: 'Journal',
      gradientColors: [
        theme.colors.therapeutic.grounding[400],
        theme.colors.therapeutic.grounding[600],
      ],
    },
    {
      id: 'mood',
      title: 'Track Mood',
      subtitle: 'Log your feelings',
      iconName: 'Heart',
      gradientColors: [
        theme.colors.therapeutic.nurturing[400],
        theme.colors.therapeutic.nurturing[600],
      ],
    },
  ], [theme]);

  // Memoized action handler
  const handleAction = useCallback((actionId) => {
    switch (actionId) {
      case 'chat':
        onStartChat?.();
        break;
      case 'assessment':
        onTakeAssessment?.();
        break;
      case 'mood':
        onMoodTracker?.();
        break;
      default:
        console.warn(`Unknown action: ${actionId}`);
    }
  }, [onStartChat, onTakeAssessment, onMoodTracker]);

  // Optimized entrance animation
  useEffect(() => {
    const animation = Animated.parallel([
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
    ]);

    animation.start();

    return () => {
      animation.stop();
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
    };
  }, [fadeAnim, slideAnim]);

  // Memoized container style
  const containerAnimatedStyle = useMemo(() => ({
    opacity: fadeAnim,
    transform: [{ translateY: slideAnim }],
  }), [fadeAnim, slideAnim]);

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LinearGradient
        colors={[
          theme.colors.background.primary,
          theme.colors.background.secondary,
        ]}
        style={[styles.cardBackground, shadows.lg]}
      >
        {/* Header */}
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

        {/* Actions Grid */}
        <View style={styles.actionsGrid}>
          {actions.map((action, index) => (
            <ActionItem
              key={action.id}
              action={action}
              index={index}
              onPress={handleAction}
              fadeAnim={fadeAnim}
              slideAnim={slideAnim}
            />
          ))}
        </View>

        {/* Performance indicator in development */}
        {__DEV__ && performanceMetrics.renderCount > 5 && (
          <View style={styles.perfIndicator}>
            <Text style={styles.perfText}>
              Renders: {performanceMetrics.renderCount}
            </Text>
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing[3],
  },
  actionCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  actionGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[3],
    minHeight: 100,
  },
  actionTitle: {
    color: colors.text.inverse,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.sm,
    marginBottom: spacing[1],
    marginTop: spacing[2],
    textAlign: 'center',
  },
  actionSubtitle: {
    color: colors.text.inverse,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.xs,
    textAlign: 'center',
    opacity: 0.9,
  },
  perfIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,0,0,0.3)',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  perfText: {
    fontSize: 8,
    color: 'white',
    fontWeight: 'bold',
  },
});

// Add display name for better debugging
OptimizedQuickActions.displayName = 'OptimizedQuickActions';

export default memo(OptimizedQuickActions);