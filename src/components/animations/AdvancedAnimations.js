/**
 * Advanced Animation Components
 * Using React Native Reanimated, React Native Animatable, and Lottie
 * Implementing state-of-the-art animations for mental health app
 */

import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from "react-native";
import * as Animatable from "react-native-animatable";

import {
  FreudColors,
  FreudSpacing,
  FreudBorderRadius,
} from "../../shared/theme/FreudDesignSystem";
import { useTheme } from "../../shared/theme/ThemeContext";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Therapeutic Breathing Animation Component
export const TherapeuticBreathingAnimation = ({
  isActive = false,
  duration = 4000,
  onCycleComplete,
  size = 200,
  style = {},
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      const breathingCycle = () => {
        // Inhale animation
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: duration / 2,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: duration / 2,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: duration / 2,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Exhale animation
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: duration / 2,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: duration / 2,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: duration / 2,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true,
            }),
          ]).start(() => {
            onCycleComplete && onCycleComplete();
            if (isActive) breathingCycle();
          });
        });
      };
      breathingCycle();
    }
  }, [isActive, duration]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={[styles.breathingContainer, { width: size, height: size }, style]}
    >
      <Animated.View
        style={[
          styles.breathingCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: FreudColors.serenityGreen[40],
            transform: [{ scale: scaleAnim }, { rotate }],
            opacity: opacityAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.breathingInnerCircle,
          {
            width: size * 0.6,
            height: size * 0.6,
            borderRadius: (size * 0.6) / 2,
            backgroundColor: FreudColors.serenityGreen[60],
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          },
        ]}
      />
    </View>
  );
};

// Floating Action Button with Ripple Effect
export const FloatingActionButton = ({
  onPress,
  icon,
  size = 56,
  backgroundColor = FreudColors.mindfulBrown[90],
  rippleColor = FreudColors.mindfulBrown[70],
  style = {},
  children,
}) => {
  const [ripples, setRipples] = useState([]);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;

    // Create ripple effect
    const rippleId = Date.now();
    setRipples((prev) => [
      ...prev,
      { id: rippleId, x: locationX, y: locationY },
    ]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);

    // Scale animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress && onPress(event);
  };

  return (
    <Animated.View
      style={[
        styles.fab,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        duration={2000}
        style={styles.fabPulse}
      >
        <Animatable.View
          onTouchStart={handlePress}
          style={[
            styles.fabButton,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          {ripples.map((ripple) => (
            <Animated.View
              key={ripple.id}
              style={[
                styles.ripple,
                {
                  left: ripple.x - 25,
                  top: ripple.y - 25,
                  backgroundColor: rippleColor,
                },
              ]}
            />
          ))}
          {children || icon}
        </Animatable.View>
      </Animatable.View>
    </Animated.View>
  );
};

// Staggered List Animation
export const StaggeredListAnimation = ({
  children,
  stagger = 100,
  animation = "slideInUp",
  duration = 800,
  style = {},
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <View style={style}>
      {childrenArray.map((child, index) => (
        <Animatable.View
          key={index}
          animation={animation}
          delay={index * stagger}
          duration={duration}
          useNativeDriver
        >
          {child}
        </Animatable.View>
      ))}
    </View>
  );
};

// Morphing Card Animation
export const MorphingCard = ({
  children,
  isExpanded = false,
  onToggle,
  expandedHeight = 300,
  collapsedHeight = 100,
  duration = 400,
  style = {},
}) => {
  const heightAnim = useRef(new Animated.Value(collapsedHeight)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: isExpanded ? expandedHeight : collapsedHeight,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: isExpanded ? 1 : 0,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isExpanded]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Animated.View
      style={[
        styles.morphingCard,
        {
          height: heightAnim,
        },
        style,
      ]}
      onTouchStart={onToggle}
    >
      <View style={styles.morphingCardHeader}>
        <Animated.View
          style={[
            styles.morphingCardChevron,
            {
              transform: [{ rotate }],
            },
          ]}
        />
      </View>
      <View style={styles.morphingCardContent}>{children}</View>
    </Animated.View>
  );
};

// Parallax Scroll Background
export const ParallaxBackground = ({
  children,
  backgroundImage,
  parallaxSpeed = 0.5,
  height = screenHeight,
  style = {},
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const backgroundTranslateY = scrollY.interpolate({
    inputRange: [-height, 0, height],
    outputRange: [height * parallaxSpeed, 0, -height * parallaxSpeed],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.parallaxContainer, style]}>
      <Animated.View
        style={[
          styles.parallaxBackground,
          {
            height: height * 1.5,
            transform: [{ translateY: backgroundTranslateY }],
          },
        ]}
      >
        {backgroundImage}
      </Animated.View>
      <Animated.ScrollView
        style={styles.parallaxContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
};

// Lottie Mental Health Animations
export const MentalHealthLottie = ({
  animation = "meditation",
  autoPlay = true,
  loop = true,
  speed = 1,
  size = 200,
  style = {},
}) => {
  const animationRef = useRef(null);

  // Animation sources (you would need to add these Lottie files to your assets)
  const animationSources = {
    meditation: require("../../assets/lottie/meditation.json"),
    breathing: require("../../assets/lottie/breathing.json"),
    healing: require("../../assets/lottie/healing.json"),
    progress: require("../../assets/lottie/progress.json"),
    mindfulness: require("../../assets/lottie/mindfulness.json"),
  };

  return (
    <LottieView
      ref={animationRef}
      source={animationSources[animation] || animationSources.meditation}
      autoPlay={autoPlay}
      loop={loop}
      speed={speed}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
};

// Therapeutic Wave Animation
export const TherapeuticWave = ({
  width = screenWidth,
  height = 100,
  color = FreudColors.serenityGreen[40],
  speed = 2000,
  amplitude = 20,
  style = {},
}) => {
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.timing(animationValue, {
          toValue: 1,
          duration: speed,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ).start();
    };
    startAnimation();
  }, []);

  const translateX = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });

  return (
    <View style={[styles.waveContainer, { width, height }, style]}>
      <Animated.View
        style={[
          styles.wave,
          {
            width: width * 2,
            height,
            backgroundColor: color,
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
};

// Micro-interaction Button
export const MicroInteractionButton = ({
  onPress,
  children,
  hapticFeedback = true,
  soundEffect = false,
  magneticEffect = true,
  style = {},
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  return (
    <View style={styles.microInteractionContainer}>
      <Animated.View
        style={[
          styles.microInteractionGlow,
          {
            opacity: glowOpacity,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.microInteractionButton,
          {
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        onPress={onPress}
      >
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Therapeutic Breathing Animation
  breathingContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  breathingCircle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  breathingInnerCircle: {
    position: "absolute",
  },

  // Floating Action Button
  fab: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabPulse: {
    justifyContent: "center",
    alignItems: "center",
  },
  fabButton: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  ripple: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    opacity: 0.6,
  },

  // Morphing Card
  morphingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: FreudBorderRadius.xl,
    padding: FreudSpacing[4],
    margin: FreudSpacing[2],
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  morphingCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: FreudSpacing[2],
  },
  morphingCardChevron: {
    width: 24,
    height: 24,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: FreudColors.optimisticGray[60],
  },
  morphingCardContent: {
    flex: 1,
  },

  // Parallax Background
  parallaxContainer: {
    flex: 1,
    position: "relative",
  },
  parallaxBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  parallaxContent: {
    flex: 1,
    backgroundColor: "transparent",
  },

  // Wave Animation
  waveContainer: {
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  wave: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },

  // Micro-interaction Button
  microInteractionContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  microInteractionGlow: {
    position: "absolute",
    width: "120%",
    height: "120%",
    backgroundColor: FreudColors.serenityGreen[40],
    borderRadius: FreudBorderRadius.full,
    opacity: 0,
  },
  microInteractionButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: FreudColors.mindfulBrown[90],
    borderRadius: FreudBorderRadius.xl,
    padding: FreudSpacing[4],
  },
});

export default {
  TherapeuticBreathingAnimation,
  FloatingActionButton,
  StaggeredListAnimation,
  MorphingCard,
  ParallaxBackground,
  MentalHealthLottie,
  TherapeuticWave,
  MicroInteractionButton,
};
