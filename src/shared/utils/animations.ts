/**
 * Animation Utilities - Smooth animations for mental health app
 * Calming, therapeutic animations that reduce anxiety
 */

import { Animated, Easing } from 'react-native';

/**
 * Fade in animation
 */
export const fadeIn = (
  animatedValue: Animated.Value,
  duration: number = 300,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    delay,
    easing: Easing.out(Easing.ease),
    useNativeDriver: true,
  });
};

/**
 * Fade out animation
 */
export const fadeOut = (
  animatedValue: Animated.Value,
  duration: number = 300,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    delay,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  });
};

/**
 * Scale in animation (gentle pop)
 */
export const scaleIn = (
  animatedValue: Animated.Value,
  duration: number = 300,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue: 1,
    friction: 8,
    tension: 40,
    delay,
    useNativeDriver: true,
  });
};

/**
 * Scale out animation
 */
export const scaleOut = (
  animatedValue: Animated.Value,
  duration: number = 300,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    delay,
    easing: Easing.in(Easing.ease),
    useNativeDriver: true,
  });
};

/**
 * Slide in from bottom animation
 */
export const slideInFromBottom = (
  animatedValue: Animated.Value,
  distance: number = 50,
  duration: number = 300,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    delay,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
};

/**
 * Slide in from top animation
 */
export const slideInFromTop = (
  animatedValue: Animated.Value,
  duration: number = 300,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    delay,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  });
};

/**
 * Breathing animation (calm pulsing)
 */
export const breathingAnimation = (
  animatedValue: Animated.Value,
  minScale: number = 0.95,
  maxScale: number = 1.05,
  duration: number = 4000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: maxScale,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: minScale,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Gentle pulse animation
 */
export const pulseAnimation = (
  animatedValue: Animated.Value,
  duration: number = 1000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.1,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Shake animation (for errors, gentle)
 */
export const shakeAnimation = (
  animatedValue: Animated.Value,
  intensity: number = 10
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: intensity,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: -intensity,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: intensity / 2,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Staggered fade in for lists
 */
export const staggeredFadeIn = (
  animatedValues: Animated.Value[],
  duration: number = 300,
  stagger: number = 100
): Animated.CompositeAnimation => {
  return Animated.stagger(
    stagger,
    animatedValues.map((value) =>
      Animated.timing(value, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    )
  );
};

/**
 * Rotation animation (for loading spinners)
 */
export const rotateAnimation = (
  animatedValue: Animated.Value,
  duration: number = 1000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  );
};

/**
 * Wave animation (for progress indicators)
 */
export const waveAnimation = (
  animatedValue: Animated.Value,
  duration: number = 2000
): Animated.CompositeAnimation => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: duration / 2,
        easing: Easing.inOut(Easing.sine),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: duration / 2,
        easing: Easing.inOut(Easing.sine),
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Bounce animation (for celebrations)
 */
export const bounceAnimation = (
  animatedValue: Animated.Value
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue: 1,
    friction: 3,
    tension: 40,
    useNativeDriver: true,
  });
};

/**
 * Therapeutic timing preset
 * Slower, calmer animations for mental health context
 */
export const therapeuticTiming = {
  fast: 200,
  normal: 400,
  slow: 600,
  verySlow: 1000,
  breathing: 4000,
};

/**
 * Therapeutic easing functions
 * Gentle, calming easing curves
 */
export const therapeuticEasing = {
  gentle: Easing.bezier(0.25, 0.1, 0.25, 1),
  calm: Easing.bezier(0.4, 0.0, 0.2, 1),
  soothing: Easing.bezier(0.0, 0.0, 0.2, 1),
  meditative: Easing.bezier(0.4, 0.0, 0.6, 1),
};

export default {
  fadeIn,
  fadeOut,
  scaleIn,
  scaleOut,
  slideInFromBottom,
  slideInFromTop,
  breathingAnimation,
  pulseAnimation,
  shakeAnimation,
  staggeredFadeIn,
  rotateAnimation,
  waveAnimation,
  bounceAnimation,
  therapeuticTiming,
  therapeuticEasing,
};
