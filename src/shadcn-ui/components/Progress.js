/**
 * Solace AI Mobile - shadcn UI Progress Components
 * 
 * Comprehensive progress visualization components following shadcn UI patterns,
 * designed specifically for mental health progress tracking and wellness metrics.
 * 
 * Features:
 * - Linear and circular progress indicators
 * - Therapeutic color schemes and animations
 * - Mood-based progress coloring
 * - Accessibility-first design with screen reader support
 * - Multiple visualization types for different data
 * - Gentle animations for positive reinforcement
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import PropTypes from 'prop-types';

import ShadcnCard, { CardHeader, CardTitle, CardContent } from './Card';
import { shadcnConfig } from '../config';
import { 
  colorUtils, 
  styleUtils, 
  animationUtils, 
  accessibilityUtils 
} from '../utils';
import { useTheme } from '../../shared/theme/ThemeContext';
import { MentalHealthIcon } from '../../components/icons';

// Linear Progress Bar Component
export const ShadcnProgressBar = ({
  value = 0,
  max = 100,
  therapeuticScheme = 'calming',
  mood,
  size = 'medium',
  showLabel = true,
  label,
  animated = true,
  gradient = true,
  style,
  testID = 'progress-bar',
  ...props
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  useEffect(() => {
    if (animated && !isReducedMotionEnabled) {
      Animated.timing(progressAnimation, {
        toValue: percentage,
        duration: shadcnConfig.animations.soothing.duration,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnimation.setValue(percentage);
    }
  }, [percentage, animated, isReducedMotionEnabled]);
  
  // Get size configuration
  const getSizeConfig = () => {
    const configs = {
      small: {
        height: 4,
        borderRadius: shadcnConfig.borderRadius.full,
        fontSize: shadcnConfig.typography.sizes.xs.fontSize,
      },
      medium: {
        height: 8,
        borderRadius: shadcnConfig.borderRadius.full,
        fontSize: shadcnConfig.typography.sizes.sm.fontSize,
      },
      large: {
        height: 12,
        borderRadius: shadcnConfig.borderRadius.full,
        fontSize: shadcnConfig.typography.sizes.base.fontSize,
      },
    };
    return configs[size] || configs.medium;
  };
  
  const sizeConfig = getSizeConfig();
  
  // Get progress colors
  const getProgressColors = () => {
    if (mood) {
      const moodColor = colorUtils.getTherapeuticColor(mood);
      return gradient 
        ? [moodColor, colorUtils.withOpacity(moodColor, 0.7)]
        : [moodColor, moodColor];
    }
    
    return gradient
      ? colorUtils.getTherapeuticGradient(therapeuticScheme, 2)
      : [colorUtils.resolveColor(`therapeutic.${therapeuticScheme}.500`), 
         colorUtils.resolveColor(`therapeutic.${therapeuticScheme}.500`)];
  };
  
  const progressColors = getProgressColors();
  
  return (
    <View 
      style={[{ marginVertical: shadcnConfig.spacing[2] }, style]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label || `Progress: ${Math.round(percentage)}%`}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(percentage) }}
      testID={testID}
      {...props}
    >
      {showLabel && (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: shadcnConfig.spacing[2],
        }}>
          <Text style={{
            fontSize: sizeConfig.fontSize,
            fontWeight: shadcnConfig.typography.weights.medium,
            color: shadcnConfig.colors.foreground.primary,
          }}>
            {label || 'Progress'}
          </Text>
          <Text style={{
            fontSize: sizeConfig.fontSize,
            fontWeight: shadcnConfig.typography.weights.semibold,
            color: progressColors[0],
          }}>
            {Math.round(percentage)}%
          </Text>
        </View>
      )}
      
      <View style={{
        height: sizeConfig.height,
        backgroundColor: shadcnConfig.colors.background.muted,
        borderRadius: sizeConfig.borderRadius,
        overflow: 'hidden',
      }}>
        <Animated.View style={{
          height: '100%',
          width: progressAnimation.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp',
          }),
        }}>
          <LinearGradient
            colors={progressColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              flex: 1,
              borderRadius: sizeConfig.borderRadius,
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

// Circular Progress Component
export const ShadcnCircularProgress = ({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  therapeuticScheme = 'calming',
  mood,
  showValue = true,
  showLabel = true,
  label,
  animated = true,
  style,
  testID = 'circular-progress',
  ...props
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    if (animated && !isReducedMotionEnabled) {
      Animated.timing(progressAnimation, {
        toValue: percentage,
        duration: shadcnConfig.animations.soothing.duration,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnimation.setValue(percentage);
    }
  }, [percentage, animated, isReducedMotionEnabled]);
  
  // Get progress color
  const getProgressColor = () => {
    if (mood) {
      return colorUtils.getTherapeuticColor(mood);
    }
    return colorUtils.resolveColor(`therapeutic.${therapeuticScheme}.500`);
  };
  
  const progressColor = getProgressColor();
  
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  
  return (
    <View 
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label || `Circular progress: ${Math.round(percentage)}%`}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(percentage) }}
      testID={testID}
      {...props}
    >
      <View style={{ position: 'relative' }}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={shadcnConfig.colors.background.muted}
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={progressColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressAnimation.interpolate({
              inputRange: [0, 100],
              outputRange: [circumference, 0],
              extrapolate: 'clamp',
            })}
          />
        </Svg>
        
        {/* Center content */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {showValue && (
            <Text style={{
              fontSize: size / 6,
              fontWeight: shadcnConfig.typography.weights.bold,
              color: progressColor,
              textAlign: 'center',
            }}>
              {Math.round(percentage)}%
            </Text>
          )}
          {showLabel && label && (
            <Text style={{
              fontSize: shadcnConfig.typography.sizes.xs.fontSize,
              color: shadcnConfig.colors.foreground.muted,
              textAlign: 'center',
              marginTop: shadcnConfig.spacing[1],
            }}>
              {label}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

// Multi-Progress Component (for multiple metrics)
export const ShadcnMultiProgress = ({
  metrics = [],
  showLabels = true,
  animated = true,
  style,
  testID = 'multi-progress',
  ...props
}) => {
  const { theme } = useTheme();
  
  return (
    <View 
      style={style}
      testID={testID}
      {...props}
    >
      {metrics.map((metric, index) => (
        <View key={metric.id || index} style={{
          marginBottom: index < metrics.length - 1 ? shadcnConfig.spacing[4] : 0,
        }}>
          <ShadcnProgressBar
            value={metric.value}
            max={metric.max || 100}
            therapeuticScheme={metric.therapeuticScheme}
            mood={metric.mood}
            label={showLabels ? metric.label : undefined}
            animated={animated}
            gradient={metric.gradient !== false}
            size={metric.size || 'medium'}
          />
        </View>
      ))}
    </View>
  );
};

// Wellness Score Card Component
export const WellnessScoreCard = ({
  score = 0,
  maxScore = 100,
  title = 'Wellness Score',
  subtitle,
  trend, // 'up', 'down', 'stable'
  therapeuticScheme = 'calming',
  showCircular = true,
  style,
  ...props
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return null;
    }
  };
  
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return shadcnConfig.colors.success[500];
      case 'down':
        return shadcnConfig.colors.warning[500];
      case 'stable':
        return shadcnConfig.colors.foreground.muted;
      default:
        return shadcnConfig.colors.foreground.muted;
    }
  };
  
  return (
    <ShadcnCard
      variant="elevated"
      therapeuticScheme={therapeuticScheme}
      gradient
      style={style}
      {...props}
    >
      <CardHeader>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View style={{ flex: 1 }}>
            <CardTitle therapeuticScheme={therapeuticScheme}>
              {title}
            </CardTitle>
            {subtitle && (
              <Text style={{
                fontSize: shadcnConfig.typography.sizes.sm.fontSize,
                color: shadcnConfig.colors.foreground.muted,
                marginTop: shadcnConfig.spacing[1],
              }}>
                {subtitle}
              </Text>
            )}
          </View>
          
          {trend && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colorUtils.withOpacity(getTrendColor(), 0.1),
              paddingHorizontal: shadcnConfig.spacing[2],
              paddingVertical: shadcnConfig.spacing[1],
              borderRadius: shadcnConfig.borderRadius.full,
            }}>
              <Text style={{ marginRight: shadcnConfig.spacing[1] }}>
                {getTrendIcon()}
              </Text>
              <Text style={{
                fontSize: shadcnConfig.typography.sizes.xs.fontSize,
                color: getTrendColor(),
                fontWeight: shadcnConfig.typography.weights.medium,
              }}>
                {trend === 'up' ? 'Improving' : 
                 trend === 'down' ? 'Declining' : 'Stable'}
              </Text>
            </View>
          )}
        </View>
      </CardHeader>
      
      <CardContent>
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: shadcnConfig.spacing[4],
        }}>
          {showCircular ? (
            <ShadcnCircularProgress
              value={score}
              max={maxScore}
              size={120}
              therapeuticScheme={therapeuticScheme}
              showLabel={false}
              animated
            />
          ) : (
            <View style={{ width: '100%' }}>
              <ShadcnProgressBar
                value={score}
                max={maxScore}
                therapeuticScheme={therapeuticScheme}
                size="large"
                showLabel={false}
                animated
              />
              <Text style={{
                fontSize: shadcnConfig.typography.sizes['2xl'].fontSize,
                fontWeight: shadcnConfig.typography.weights.bold,
                color: colorUtils.resolveColor(`therapeutic.${therapeuticScheme}.600`),
                textAlign: 'center',
                marginTop: shadcnConfig.spacing[3],
              }}>
                {Math.round(score)}/{maxScore}
              </Text>
            </View>
          )}
        </View>
      </CardContent>
    </ShadcnCard>
  );
};

// Mood Progress Tracker Component
export const MoodProgressTracker = ({
  weeklyData = [],
  currentMood,
  style,
  ...props
}) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const getMoodScore = (mood) => {
    const moodScores = {
      happy: 90,
      calm: 80,
      content: 85,
      excited: 75,
      neutral: 50,
      tired: 30,
      anxious: 25,
      sad: 20,
      angry: 15,
      stressed: 10,
    };
    return moodScores[mood] || 50;
  };
  
  return (
    <ShadcnCard variant="elevated" style={style} {...props}>
      <CardHeader>
        <CardTitle therapeuticScheme="peaceful">
          Weekly Mood Progress
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'end',
          height: 100,
          marginBottom: shadcnConfig.spacing[3],
        }}>
          {days.map((day, index) => {
            const dayData = weeklyData[index] || { mood: 'neutral' };
            const score = getMoodScore(dayData.mood);
            const isToday = index === new Date().getDay() - 1;
            
            return (
              <View key={day} style={{
                flex: 1,
                alignItems: 'center',
                marginHorizontal: shadcnConfig.spacing[0.5],
              }}>
                <View style={{
                  height: `${score}%`,
                  backgroundColor: isToday 
                    ? colorUtils.getTherapeuticColor(currentMood || 'neutral')
                    : colorUtils.getTherapeuticColor(dayData.mood),
                  borderRadius: shadcnConfig.borderRadius.sm,
                  width: '100%',
                  minHeight: 8,
                  opacity: isToday ? 1 : 0.7,
                }} />
                
                <Text style={{
                  fontSize: shadcnConfig.typography.sizes.xs.fontSize,
                  color: shadcnConfig.colors.foreground.muted,
                  marginTop: shadcnConfig.spacing[1],
                  fontWeight: isToday 
                    ? shadcnConfig.typography.weights.semibold
                    : shadcnConfig.typography.weights.normal,
                }}>
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
        
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: shadcnConfig.spacing[3],
          borderTopWidth: 1,
          borderTopColor: shadcnConfig.colors.border.primary,
        }}>
          <Text style={{
            fontSize: shadcnConfig.typography.sizes.sm.fontSize,
            color: shadcnConfig.colors.foreground.muted,
          }}>
            Weekly Average
          </Text>
          <Text style={{
            fontSize: shadcnConfig.typography.sizes.base.fontSize,
            fontWeight: shadcnConfig.typography.weights.semibold,
            color: colorUtils.resolveColor('therapeutic.calming.600'),
          }}>
            {Math.round(weeklyData.reduce((acc, day, index) => 
              acc + getMoodScore(day?.mood || 'neutral'), 0) / 7)}%
          </Text>
        </View>
      </CardContent>
    </ShadcnCard>
  );
};

// PropTypes
ShadcnProgressBar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  therapeuticScheme: PropTypes.oneOf(['calming', 'nurturing', 'peaceful', 'grounding', 'energizing']),
  mood: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  animated: PropTypes.bool,
  gradient: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

ShadcnCircularProgress.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  therapeuticScheme: PropTypes.oneOf(['calming', 'nurturing', 'peaceful', 'grounding', 'energizing']),
  mood: PropTypes.string,
  showValue: PropTypes.bool,
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  animated: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default {
  ShadcnProgressBar,
  ShadcnCircularProgress,
  ShadcnMultiProgress,
  WellnessScoreCard,
  MoodProgressTracker,
};