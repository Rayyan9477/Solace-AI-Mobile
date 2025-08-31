/**
 * Therapeutic Animations for Mental Health App
 * Provides calming, accessibility-aware animations using Framer Motion and React Native
 * Designed specifically for mental health and wellness applications
 */

import React, { useEffect, useRef } from "react";
import { Animated, Platform } from "react-native";

import {
  useMotionAccessibility,
  MOTION_TYPES,
} from "../../utils/motionAccessibility";

// Web-only Framer Motion import with fallback
let motion = null;
if (Platform.OS === "web") {
  try {
    const framerMotion = require("framer-motion");
    motion = framerMotion.motion;
  } catch (error) {
    console.warn("Framer Motion not available, using React Native animations");
  }
}

// Therapeutic animation configurations
export const THERAPEUTIC_EASING = {
  CALM: [0.25, 0.1, 0.25, 1], // Gentle, natural easing
  NURTURING: [0.4, 0, 0.2, 1], // Supportive, embracing feel
  HEALING: [0.2, 0, 0.2, 1], // Slow, steady progression
  ENERGIZING: [0.4, 0, 0.6, 1], // Uplifting but not jarring
  GROUNDING: [0.6, 0, 0.4, 1], // Stable, rooted feeling
};

// Therapeutic spring configurations
export const THERAPEUTIC_SPRINGS = {
  GENTLE: { tension: 120, friction: 14 },
  SUPPORTIVE: { tension: 100, friction: 12 },
  CALMING: { tension: 80, friction: 16 },
  RESPONSIVE: { tension: 200, friction: 20 },
  FLOATING: { tension: 60, friction: 8 },
};

// Enhanced animated components for therapeutic interfaces
export const TherapeuticAnimatedComponents = {
  // Gentle fade in for mood tracking elements
  MoodFadeIn: ({ children, delay = 0, style = {} }) => {
    const motionUtils = useMotionAccessibility();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
      const animations = [
        motionUtils.createSafeTiming(
          fadeAnim,
          1,
          { duration: 800, delay },
          MOTION_TYPES.FADE,
        ),
        motionUtils.createSafeTiming(
          translateY,
          0,
          { duration: 800, delay },
          MOTION_TYPES.SLIDE,
        ),
      ];

      Animated.parallel(animations).start();
    }, [fadeAnim, translateY, delay, motionUtils]);

    if (
      Platform.OS === "web" &&
      motion &&
      !motionUtils.isReducedMotionEnabled
    ) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: motionUtils.getAnimationDuration(0.8),
            delay: delay / 1000,
            ease: THERAPEUTIC_EASING.CALM,
          }}
          style={style}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <Animated.View
        style={[
          style,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  },

  // Breathing animation for mindfulness features
  BreathingPulse: ({ children, style = {}, isActive = true }) => {
    const motionUtils = useMotionAccessibility();
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (!isActive || motionUtils.isReducedMotionEnabled) {
        scale.setValue(1);
        return;
      }

      const breathingAnimation = Animated.loop(
        Animated.sequence([
          motionUtils.createSafeTiming(
            scale,
            1.05,
            { duration: 4000 }, // 4 second inhale
            MOTION_TYPES.PULSE,
          ),
          motionUtils.createSafeTiming(
            scale,
            1,
            { duration: 4000 }, // 4 second exhale
            MOTION_TYPES.PULSE,
          ),
        ]),
      );

      breathingAnimation.start();
      return () => breathingAnimation.stop();
    }, [scale, isActive, motionUtils]);

    if (
      Platform.OS === "web" &&
      motion &&
      !motionUtils.isReducedMotionEnabled &&
      isActive
    ) {
      return (
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8, // 8 second breathing cycle
            repeat: Infinity,
            ease: THERAPEUTIC_EASING.CALM,
          }}
          style={style}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale }],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  },

  // Gentle attention animation for important elements
  GentleAttention: ({ children, style = {}, isHighlighted = false }) => {
    const motionUtils = useMotionAccessibility();
    const glow = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (!isHighlighted || motionUtils.isReducedMotionEnabled) {
        glow.setValue(1);
        return;
      }

      const glowAnimation = Animated.loop(
        Animated.sequence([
          motionUtils.createSafeTiming(
            glow,
            1.1,
            { duration: 2000 },
            MOTION_TYPES.PULSE,
          ),
          motionUtils.createSafeTiming(
            glow,
            1,
            { duration: 2000 },
            MOTION_TYPES.PULSE,
          ),
        ]),
      );

      glowAnimation.start();
      return () => glowAnimation.stop();
    }, [glow, isHighlighted, motionUtils]);

    if (
      Platform.OS === "web" &&
      motion &&
      !motionUtils.isReducedMotionEnabled &&
      isHighlighted
    ) {
      return (
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 rgba(59, 130, 246, 0)",
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 0 rgba(59, 130, 246, 0)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: THERAPEUTIC_EASING.CALM,
          }}
          style={style}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: glow }],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  },

  // Staggered entrance for dashboard components
  StaggeredEntrance: ({ children, index = 0, style = {} }) => {
    const motionUtils = useMotionAccessibility();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
      const staggerDelay = motionUtils.isReducedMotionEnabled ? 0 : index * 100;

      const animations = [
        motionUtils.createSafeTiming(
          fadeAnim,
          1,
          { duration: 600, delay: staggerDelay },
          MOTION_TYPES.FADE,
        ),
        motionUtils.createSafeTiming(
          translateY,
          0,
          { duration: 600, delay: staggerDelay },
          MOTION_TYPES.SLIDE,
        ),
      ];

      Animated.parallel(animations).start();
    }, [fadeAnim, translateY, index, motionUtils]);

    if (
      Platform.OS === "web" &&
      motion &&
      !motionUtils.isReducedMotionEnabled
    ) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: motionUtils.getAnimationDuration(0.6),
            delay: (index * 100) / 1000,
            ease: THERAPEUTIC_EASING.NURTURING,
          }}
          style={style}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <Animated.View
        style={[
          style,
          {
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  },

  // Floating animation for wellness tips
  FloatingWisdom: ({ children, style = {} }) => {
    const motionUtils = useMotionAccessibility();
    const floatY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (motionUtils.isReducedMotionEnabled) {
        floatY.setValue(0);
        return;
      }

      const floatingAnimation = Animated.loop(
        Animated.sequence([
          motionUtils.createSafeTiming(
            floatY,
            -5,
            { duration: 3000 },
            MOTION_TYPES.FADE,
          ),
          motionUtils.createSafeTiming(
            floatY,
            5,
            { duration: 3000 },
            MOTION_TYPES.FADE,
          ),
          motionUtils.createSafeTiming(
            floatY,
            0,
            { duration: 3000 },
            MOTION_TYPES.FADE,
          ),
        ]),
      );

      floatingAnimation.start();
      return () => floatingAnimation.stop();
    }, [floatY, motionUtils]);

    if (
      Platform.OS === "web" &&
      motion &&
      !motionUtils.isReducedMotionEnabled
    ) {
      return (
        <motion.div
          animate={{
            y: [-5, 5, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: THERAPEUTIC_EASING.FLOATING,
          }}
          style={style}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <Animated.View
        style={[
          style,
          {
            transform: [{ translateY: floatY }],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  },

  // Progress animation for mood tracking
  ProgressGrowth: ({ children, progress = 0, style = {} }) => {
    const motionUtils = useMotionAccessibility();
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      motionUtils
        .createSafeTiming(
          progressAnim,
          progress,
          { duration: 1500 },
          MOTION_TYPES.SCALE,
        )
        .start();
    }, [progress, progressAnim, motionUtils]);

    if (
      Platform.OS === "web" &&
      motion &&
      !motionUtils.isReducedMotionEnabled
    ) {
      return (
        <motion.div
          animate={{ scaleX: progress }}
          transition={{
            duration: motionUtils.getAnimationDuration(1.5),
            ease: THERAPEUTIC_EASING.HEALING,
          }}
          style={style}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <Animated.View
        style={[
          style,
          {
            transform: [{ scaleX: progressAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  },

  // Emergency button with accessible attention animation
  EmergencyPulse: ({ children, style = {}, isEmergency = false }) => {
    const motionUtils = useMotionAccessibility();
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (!isEmergency) {
        pulse.setValue(1);
        return;
      }

      if (motionUtils.isReducedMotionEnabled) {
        // Static high contrast state for reduced motion
        pulse.setValue(1.05);
        return;
      }

      const emergencyAnimation = Animated.loop(
        Animated.sequence([
          motionUtils.createSafeTiming(
            pulse,
            1.08,
            { duration: 1000 },
            MOTION_TYPES.PULSE,
          ),
          motionUtils.createSafeTiming(
            pulse,
            1,
            { duration: 1000 },
            MOTION_TYPES.PULSE,
          ),
        ]),
      );

      emergencyAnimation.start();
      return () => emergencyAnimation.stop();
    }, [pulse, isEmergency, motionUtils]);

    if (Platform.OS === "web" && motion && isEmergency) {
      const animateProps = motionUtils.isReducedMotionEnabled
        ? { scale: 1.05 }
        : {
            scale: [1, 1.08, 1],
          };

      const transitionProps = motionUtils.isReducedMotionEnabled
        ? { duration: 0 }
        : {
            duration: 2,
            repeat: Infinity,
            ease: THERAPEUTIC_EASING.ENERGIZING,
          };

      return (
        <motion.div
          animate={animateProps}
          transition={transitionProps}
          style={style}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: pulse }],
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  },
};

// Hook for therapeutic page transitions
export const useTherapeuticPageTransition = () => {
  const motionUtils = useMotionAccessibility();

  const pageVariants = {
    initial: {
      opacity: 0,
      x: motionUtils.isReducedMotionEnabled ? 0 : 50,
    },
    enter: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: motionUtils.isReducedMotionEnabled ? 0 : -50,
    },
  };

  const pageTransition = {
    duration: motionUtils.getAnimationDuration(0.3),
    ease: THERAPEUTIC_EASING.CALM,
  };

  return { pageVariants, pageTransition };
};

// Therapeutic gesture animations for mood tracking
export const therapeuticGestures = {
  // Gentle swipe feedback
  swipeFeedback: (animatedValue, direction, motionUtils) => {
    const translateX = direction === "left" ? -30 : 30;

    return Animated.sequence([
      motionUtils.createSafeTiming(
        animatedValue,
        translateX,
        { duration: 200 },
        MOTION_TYPES.SLIDE,
      ),
      motionUtils.createSafeSpring(
        animatedValue,
        0,
        THERAPEUTIC_SPRINGS.RESPONSIVE,
        MOTION_TYPES.BOUNCE,
      ),
    ]);
  },

  // Mood selection feedback
  moodSelectionFeedback: (animatedValue, motionUtils) => {
    return Animated.sequence([
      motionUtils.createSafeSpring(
        animatedValue,
        1.1,
        THERAPEUTIC_SPRINGS.GENTLE,
        MOTION_TYPES.SCALE,
      ),
      motionUtils.createSafeSpring(
        animatedValue,
        1,
        THERAPEUTIC_SPRINGS.SUPPORTIVE,
        MOTION_TYPES.SCALE,
      ),
    ]);
  },

  // Journal entry completion
  journalComplete: (animatedValue, motionUtils) => {
    return Animated.sequence([
      motionUtils.createSafeTiming(
        animatedValue,
        1.05,
        { duration: 300 },
        MOTION_TYPES.SCALE,
      ),
      motionUtils.createSafeTiming(
        animatedValue,
        1,
        { duration: 200 },
        MOTION_TYPES.SCALE,
      ),
    ]);
  },
};

export default {
  TherapeuticAnimatedComponents,
  THERAPEUTIC_EASING,
  THERAPEUTIC_SPRINGS,
  useTherapeuticPageTransition,
  therapeuticGestures,
};
