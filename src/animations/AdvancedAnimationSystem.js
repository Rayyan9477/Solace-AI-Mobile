import React, { useRef, useEffect, useMemo } from 'react';
import { Animated, Easing, Platform, Dimensions } from 'react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useTheme } from '../contexts/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Advanced Animation System for Solace AI Mobile
 * Therapeutic animations designed to promote calm and reduce anxiety
 * Supports accessibility and reduced motion preferences
 */

// Animation presets optimized for mental health apps
export const TherapeuticAnimations = {
  // Gentle breathing-like animations
  BREATHE: {
    duration: 4000,
    easing: Easing.inOut(Easing.sin),
    toValue: 1.05,
    iterations: -1,
    alternates: true
  },

  // Calm entrance animations
  GENTLE_ENTER: {
    duration: 800,
    easing: Easing.out(Easing.cubic),
    delay: 0,
    stagger: 100
  },

  // Soothing exit animations
  PEACEFUL_EXIT: {
    duration: 600,
    easing: Easing.in(Easing.cubic)
  },

  // Progress animations that feel rewarding
  PROGRESS_GROWTH: {
    duration: 1200,
    easing: Easing.out(Easing.back(0.8))
  },

  // Micro-interactions for touch feedback
  GENTLE_PRESS: {
    duration: 150,
    easing: Easing.out(Easing.quad),
    scale: 0.98
  },

  // Page transitions that reduce anxiety
  SMOOTH_TRANSITION: {
    duration: 400,
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94)
  }
};

// Therapeutic color-based animation variants
export const ColorAnimations = {
  calming: {
    color: '#60A5FA', // Blue
    shadowColor: '#3B82F6',
    glowIntensity: 0.3
  },
  nurturing: {
    color: '#34D399', // Green
    shadowColor: '#10B981',
    glowIntensity: 0.25
  },
  peaceful: {
    color: '#94A3B8', // Gray
    shadowColor: '#64748B',
    glowIntensity: 0.2
  },
  grounding: {
    color: '#A78BFA', // Purple
    shadowColor: '#8B5CF6',
    glowIntensity: 0.35
  },
  energizing: {
    color: '#FB923C', // Orange
    shadowColor: '#F97316',
    glowIntensity: 0.4
  }
};

/**
 * Therapeutic Entrance Animations Hook
 * Creates gentle, staggered entrance effects
 */
export const useTherapeuticEntrance = (elements = 1, delay = 0) => {
  const reducedMotion = useReducedMotion();
  const animatedValues = useRef(
    Array.from({ length: elements }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
      scale: new Animated.Value(0.95)
    }))
  ).current;

  const startAnimation = useMemo(() => {
    if (reducedMotion) {
      // Simple opacity fade for reduced motion
      return () => {
        animatedValues.forEach((values) => {
          Animated.timing(values.opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }).start();
          values.translateY.setValue(0);
          values.scale.setValue(1);
        });
      };
    }

    return () => {
      const animations = animatedValues.map((values, index) =>
        Animated.parallel([
          Animated.timing(values.opacity, {
            toValue: 1,
            duration: TherapeuticAnimations.GENTLE_ENTER.duration,
            delay: delay + (index * TherapeuticAnimations.GENTLE_ENTER.stagger),
            easing: TherapeuticAnimations.GENTLE_ENTER.easing,
            useNativeDriver: true
          }),
          Animated.timing(values.translateY, {
            toValue: 0,
            duration: TherapeuticAnimations.GENTLE_ENTER.duration,
            delay: delay + (index * TherapeuticAnimations.GENTLE_ENTER.stagger),
            easing: TherapeuticAnimations.GENTLE_ENTER.easing,
            useNativeDriver: true
          }),
          Animated.timing(values.scale, {
            toValue: 1,
            duration: TherapeuticAnimations.GENTLE_ENTER.duration,
            delay: delay + (index * TherapeuticAnimations.GENTLE_ENTER.stagger),
            easing: TherapeuticAnimations.GENTLE_ENTER.easing,
            useNativeDriver: true
          })
        ])
      );

      Animated.stagger(TherapeuticAnimations.GENTLE_ENTER.stagger, animations).start();
    };
  }, [animatedValues, delay, reducedMotion]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  return animatedValues.map(values => ({
    opacity: values.opacity,
    transform: [
      { translateY: values.translateY },
      { scale: values.scale }
    ]
  }));
};

/**
 * Breathing Animation Hook
 * Creates calming, breathing-like pulsing effects
 */
export const useBreathingAnimation = (colorScheme = 'calming') => {
  const reducedMotion = useReducedMotion();
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) return;

    const breathingSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: TherapeuticAnimations.BREATHE.toValue,
          duration: TherapeuticAnimations.BREATHE.duration / 2,
          easing: TherapeuticAnimations.BREATHE.easing,
          useNativeDriver: true
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: TherapeuticAnimations.BREATHE.duration / 2,
          easing: TherapeuticAnimations.BREATHE.easing,
          useNativeDriver: true
        })
      ])
    );

    const glowSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: ColorAnimations[colorScheme]?.glowIntensity || 0.3,
          duration: TherapeuticAnimations.BREATHE.duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: TherapeuticAnimations.BREATHE.duration / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false
        })
      ])
    );

    breathingSequence.start();
    glowSequence.start();

    return () => {
      breathingSequence.stop();
      glowSequence.stop();
    };
  }, [reducedMotion, colorScheme, breatheAnim, glowAnim]);

  return {
    transform: [{ scale: breatheAnim }],
    shadowOpacity: glowAnim,
    shadowRadius: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10]
    })
  };
};

/**
 * Mood-Based Animation Hook
 * Adapts animations based on user's current mood
 */
export const useMoodBasedAnimation = (mood = 'neutral') => {
  const reducedMotion = useReducedMotion();
  const moodAnim = useRef(new Animated.Value(0)).current;

  const moodAnimations = {
    happy: {
      color: '#FDE68A',
      bounce: true,
      speed: 1.2
    },
    calm: {
      color: '#BFDBFE',
      bounce: false,
      speed: 0.8
    },
    anxious: {
      color: '#FCA5A5',
      bounce: false,
      speed: 0.6
    },
    sad: {
      color: '#C7D2FE',
      bounce: false,
      speed: 0.7
    },
    energetic: {
      color: '#FED7AA',
      bounce: true,
      speed: 1.4
    }
  };

  const currentMoodConfig = moodAnimations[mood] || moodAnimations.calm;

  useEffect(() => {
    if (reducedMotion) return;

    const animationConfig = {
      toValue: 1,
      duration: 2000 / currentMoodConfig.speed,
      easing: currentMoodConfig.bounce 
        ? Easing.bounce 
        : Easing.inOut(Easing.sin),
      useNativeDriver: true
    };

    const moodAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(moodAnim, animationConfig),
        Animated.timing(moodAnim, {
          ...animationConfig,
          toValue: 0
        })
      ])
    );

    moodAnimation.start();

    return () => moodAnimation.stop();
  }, [mood, reducedMotion, moodAnim, currentMoodConfig]);

  return {
    backgroundColor: moodAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', currentMoodConfig.color + '20']
    }),
    transform: [
      {
        scale: moodAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, currentMoodConfig.bounce ? 1.05 : 1.02]
        })
      }
    ]
  };
};

/**
 * Progress Animation Hook
 * Creates satisfying progress animations with therapeutic timing
 */
export const useProgressAnimation = (progress = 0, colorScheme = 'nurturing') => {
  const reducedMotion = useReducedMotion();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) {
      progressAnim.setValue(progress);
      return;
    }

    Animated.parallel([
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: TherapeuticAnimations.PROGRESS_GROWTH.duration,
        easing: TherapeuticAnimations.PROGRESS_GROWTH.easing,
        useNativeDriver: false
      }),
      Animated.timing(glowAnim, {
        toValue: progress > 0 ? 1 : 0,
        duration: TherapeuticAnimations.PROGRESS_GROWTH.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false
      })
    ]).start();
  }, [progress, reducedMotion, progressAnim, glowAnim]);

  const color = ColorAnimations[colorScheme]?.color || ColorAnimations.nurturing.color;

  return {
    width: progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%']
    }),
    backgroundColor: color,
    shadowColor: color,
    shadowOpacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.4]
    }),
    shadowRadius: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8]
    })
  };
};

/**
 * Gentle Press Animation Hook
 * Provides subtle feedback for touch interactions
 */
export const useGentlePress = () => {
  const reducedMotion = useReducedMotion();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (reducedMotion) return;

    Animated.timing(scaleAnim, {
      toValue: TherapeuticAnimations.GENTLE_PRESS.scale,
      duration: TherapeuticAnimations.GENTLE_PRESS.duration,
      easing: TherapeuticAnimations.GENTLE_PRESS.easing,
      useNativeDriver: true
    }).start();
  };

  const onPressOut = () => {
    if (reducedMotion) return;

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: TherapeuticAnimations.GENTLE_PRESS.duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true
    }).start();
  };

  return {
    style: {
      transform: [{ scale: scaleAnim }]
    },
    onPressIn,
    onPressOut
  };
};

/**
 * Page Transition Hook
 * Creates smooth, anxiety-reducing page transitions
 */
export const usePageTransition = (isVisible = true) => {
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(isVisible ? 1 : 0)).current;
  const translateX = useRef(new Animated.Value(isVisible ? 0 : screenWidth)).current;

  useEffect(() => {
    if (reducedMotion) {
      opacity.setValue(isVisible ? 1 : 0);
      translateX.setValue(isVisible ? 0 : screenWidth);
      return;
    }

    const animations = [
      Animated.timing(opacity, {
        toValue: isVisible ? 1 : 0,
        duration: TherapeuticAnimations.SMOOTH_TRANSITION.duration,
        easing: TherapeuticAnimations.SMOOTH_TRANSITION.easing,
        useNativeDriver: true
      }),
      Animated.timing(translateX, {
        toValue: isVisible ? 0 : screenWidth * 0.3,
        duration: TherapeuticAnimations.SMOOTH_TRANSITION.duration,
        easing: TherapeuticAnimations.SMOOTH_TRANSITION.easing,
        useNativeDriver: true
      })
    ];

    Animated.parallel(animations).start();
  }, [isVisible, reducedMotion, opacity, translateX]);

  return {
    opacity,
    transform: [{ translateX }]
  };
};

/**
 * Wellness Score Animation Hook
 * Animates wellness scores with encouraging visual feedback
 */
export const useWellnessScoreAnimation = (score = 0, maxScore = 100) => {
  const reducedMotion = useReducedMotion();
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const normalizedScore = score / maxScore;
  const isHighScore = normalizedScore >= 0.8;

  useEffect(() => {
    if (reducedMotion) {
      scoreAnim.setValue(normalizedScore);
      return;
    }

    // Animate score change
    Animated.timing(scoreAnim, {
      toValue: normalizedScore,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start();

    // Add celebration pulse for high scores
    if (isHighScore) {
      const celebrationPulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true
          })
        ]),
        { iterations: 3 }
      );
      celebrationPulse.start();
    }
  }, [score, maxScore, normalizedScore, isHighScore, reducedMotion, scoreAnim, pulseAnim]);

  // Color based on score
  const getScoreColor = (animatedScore) => {
    return animatedScore.interpolate({
      inputRange: [0, 0.3, 0.7, 1],
      outputRange: ['#EF4444', '#F59E0B', '#10B981', '#059669'],
      extrapolate: 'clamp'
    });
  };

  return {
    scoreValue: scoreAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, score]
    }),
    backgroundColor: getScoreColor(scoreAnim),
    transform: [{ scale: pulseAnim }],
    shadowOpacity: scoreAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, isHighScore ? 0.5 : 0.3]
    })
  };
};

export default {
  TherapeuticAnimations,
  ColorAnimations,
  useTherapeuticEntrance,
  useBreathingAnimation,
  useMoodBasedAnimation,
  useProgressAnimation,
  useGentlePress,
  usePageTransition,
  useWellnessScoreAnimation
};