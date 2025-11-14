/**
 * Animated Components - Pre-built animated wrappers
 * Easy-to-use animated components for common use cases
 */

import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { fadeIn, scaleIn, slideInFromBottom } from '../utils/animations';

interface AnimatedFadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

/**
 * Fade in component on mount
 */
export const AnimatedFadeIn: React.FC<AnimatedFadeInProps> = ({
  children,
  duration = 300,
  delay = 0,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeIn(opacity, duration, delay).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity }]}>
      {children}
    </Animated.View>
  );
};

interface AnimatedScaleInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

/**
 * Scale in component on mount (gentle pop)
 */
export const AnimatedScaleIn: React.FC<AnimatedScaleInProps> = ({
  children,
  duration = 300,
  delay = 0,
  style,
}) => {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scaleIn(scale, duration, delay).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>
      {children}
    </Animated.View>
  );
};

interface AnimatedSlideInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  distance?: number;
  style?: ViewStyle;
}

/**
 * Slide in from bottom component on mount
 */
export const AnimatedSlideIn: React.FC<AnimatedSlideInProps> = ({
  children,
  duration = 300,
  delay = 0,
  distance = 50,
  style,
}) => {
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    slideInFromBottom(translateY, distance, duration, delay).start();
  }, []);

  return (
    <Animated.View style={[style, { transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
};

interface AnimatedListItemProps {
  children: React.ReactNode;
  index: number;
  style?: ViewStyle;
}

/**
 * Animated list item with staggered fade-in
 */
export const AnimatedListItem: React.FC<AnimatedListItemProps> = ({
  children,
  index,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeIn(opacity, 300, index * 100).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity }]}>
      {children}
    </Animated.View>
  );
};

export default {
  AnimatedFadeIn,
  AnimatedScaleIn,
  AnimatedSlideIn,
  AnimatedListItem,
};
