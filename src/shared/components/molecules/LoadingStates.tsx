/**
 * Comprehensive Loading States Components
 *
 * Features:
 * - Multiple loading patterns
 * - Skeleton screens for content placeholders
 * - Shimmer effects for enhanced UX
 * - Accessibility support
 * - Theme-aware styling
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Text,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@theme/ThemeProvider';
import { colorWithOpacity } from '@shared/theme/colors';
import { haptic } from '@shared/services/hapticService';

// ============ TYPES ============

export interface LoadingStateProps {
  isLoading: boolean;
  children?: React.ReactNode;
  type?: 'spinner' | 'skeleton' | 'shimmer' | 'dots' | 'progress';
  text?: string;
  fullscreen?: boolean;
  overlay?: boolean;
  hapticFeedback?: boolean;
}

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
  animated?: boolean;
}

export interface ShimmerProps {
  width?: number | string;
  height?: number | string;
  style?: any;
  duration?: number;
}

// ============ CONSTANTS ============

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============ LOADING SPINNER ============

export const LoadingSpinner: React.FC<{
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullscreen?: boolean;
}> = ({ size = 'large', color, text, fullscreen }) => {
  const { theme } = useTheme();
  const spinnerColor = color || theme.colors.primary;

  useEffect(() => {
    if (text) {
      AccessibilityInfo.announceForAccessibility(`Loading: ${text}`);
    }
  }, [text]);

  const content = (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && (
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          {text}
        </Text>
      )}
    </View>
  );

  if (fullscreen) {
    return (
      <View style={[styles.fullscreenContainer, { backgroundColor: theme.colors.background.primary }]}>
        {content}
      </View>
    );
  }

  return content;
};

// ============ SKELETON LOADER ============

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  animated = true,
}) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [animated, pulseAnim]);

  const backgroundColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.gray[200], theme.colors.gray[300]],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: animated ? backgroundColor : theme.colors.gray[200],
        },
        style,
      ]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading content"
    />
  );
};

// ============ SHIMMER EFFECT ============

export const Shimmer: React.FC<ShimmerProps> = ({
  width = '100%',
  height = 100,
  style,
  duration = 2000,
}) => {
  const { theme } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim, duration]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: theme.colors.gray[200],
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.3)',
            'rgba(255, 255, 255, 0.5)',
            'rgba(255, 255, 255, 0.3)',
            'transparent',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

// ============ DOTS LOADER ============

export const DotsLoader: React.FC<{ color?: string }> = ({ color }) => {
  const { theme } = useTheme();
  const dotColor = color || theme.colors.primary;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation = Animated.parallel([
      animateDot(dot1, 0),
      animateDot(dot2, 200),
      animateDot(dot3, 400),
    ]);

    animation.start();
    return () => animation.stop();
  }, [dot1, dot2, dot3]);

  const renderDot = (anim: Animated.Value) => {
    const scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.3],
    });

    return (
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: dotColor,
            transform: [{ scale }],
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.dotsContainer}>
      {renderDot(dot1)}
      {renderDot(dot2)}
      {renderDot(dot3)}
    </View>
  );
};

// ============ PROGRESS LOADER ============

export const ProgressLoader: React.FC<{
  progress: number;
  text?: string;
  showPercentage?: boolean;
}> = ({ progress, text, showPercentage = true }) => {
  const { theme } = useTheme();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const width = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.progressContainer}>
      {text && (
        <Text style={[styles.progressText, { color: theme.colors.text.secondary }]}>
          {text}
        </Text>
      )}
      <View style={[styles.progressBar, { backgroundColor: theme.colors.gray[200] }]}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width,
              backgroundColor: theme.colors.primary,
            },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={[styles.percentageText, { color: theme.colors.text.secondary }]}>
          {Math.round(progress)}%
        </Text>
      )}
    </View>
  );
};

// ============ SKELETON SCREENS ============

export const MoodCardSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.cardSkeleton, { backgroundColor: theme.colors.background.secondary }]}>
      <Skeleton width={60} height={60} borderRadius={30} />
      <View style={styles.cardTextContainer}>
        <Skeleton width="70%" height={20} style={{ marginBottom: 8 }} />
        <Skeleton width="90%" height={16} />
      </View>
    </View>
  );
};

export const JournalEntrySkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.entrySkeleton, { backgroundColor: theme.colors.background.secondary }]}>
      <Skeleton width="60%" height={24} style={{ marginBottom: 12 }} />
      <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={16} />
    </View>
  );
};

export const AssessmentCardSkeleton: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.assessmentSkeleton, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={styles.assessmentHeader}>
        <Skeleton width={40} height={40} borderRadius={8} />
        <View style={styles.assessmentText}>
          <Skeleton width="70%" height={20} style={{ marginBottom: 8 }} />
          <Skeleton width="50%" height={16} />
        </View>
      </View>
      <Skeleton width="100%" height={48} borderRadius={8} style={{ marginTop: 16 }} />
    </View>
  );
};

export const ChatMessageSkeleton: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.messageSkeleton, isUser && styles.userMessageSkeleton]}>
      {!isUser && <Skeleton width={32} height={32} borderRadius={16} />}
      <View
        style={[
          styles.messageContent,
          { backgroundColor: theme.colors.background.secondary },
          // HIGH-009 FIX: Use colorWithOpacity instead of invalid string concatenation
          isUser && { backgroundColor: colorWithOpacity(theme.colors.primary, 0.125) },
        ]}
      >
        <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="60%" height={16} />
      </View>
      {isUser && <Skeleton width={32} height={32} borderRadius={16} />}
    </View>
  );
};

// ============ MAIN LOADING STATE COMPONENT ============

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  children,
  type = 'spinner',
  text,
  fullscreen = false,
  overlay = false,
  hapticFeedback = true,
}) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (isLoading && hapticFeedback) {
      haptic.selection();
    }
  }, [isLoading, hapticFeedback]);

  if (!isLoading) {
    return <>{children}</>;
  }

  const renderLoader = () => {
    switch (type) {
      case 'skeleton':
        return <MoodCardSkeleton />;
      case 'shimmer':
        return <Shimmer />;
      case 'dots':
        return <DotsLoader />;
      case 'progress':
        return <ProgressLoader progress={50} text={text} />;
      default:
        return <LoadingSpinner text={text} fullscreen={fullscreen} />;
    }
  };

  if (overlay) {
    return (
      <View style={styles.overlayContainer}>
        {children}
        <View
          style={[
            styles.overlay,
            { backgroundColor: theme.colors.background.primary + 'E6' }, // 90% opacity
          ]}
        >
          {renderLoader()}
        </View>
      </View>
    );
  }

  return renderLoader();
};

// ============ STYLES ============

const styles = StyleSheet.create({
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  fullscreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  progressContainer: {
    padding: 20,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  percentageText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  overlayContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Skeleton styles
  cardSkeleton: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  entrySkeleton: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  assessmentSkeleton: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  assessmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assessmentText: {
    flex: 1,
    marginLeft: 12,
  },
  messageSkeleton: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'flex-end',
  },
  userMessageSkeleton: {
    flexDirection: 'row-reverse',
  },
  messageContent: {
    flex: 1,
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 16,
    maxWidth: '80%',
  },
});

export default LoadingState;