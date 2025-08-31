/**
 * Page Shaders and Background Effects
 * Advanced visual effects for mental health app using React Native
 * Includes therapeutic gradients, glassmorphism, and particle effects
 */

import { BlurView } from "@react-native-community/blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Easing,
} from "react-native";

import { FreudColors } from "../../shared/theme/FreudDesignSystem";
import { useTheme } from "../../shared/theme/ThemeContext";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Therapeutic Gradient Backgrounds
export const TherapeuticGradient = ({
  type = "calming",
  children,
  style = {},
  animated = true,
  animationDuration = 10000,
}) => {
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.loop(
        Animated.timing(animationValue, {
          toValue: 1,
          duration: animationDuration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ).start();
    }
  }, [animated]);

  const getGradientColors = (gradientType) => {
    const time = new Date().getHours();
    const isEvening = time >= 18 || time <= 6;
    const isMorning = time >= 6 && time <= 12;
    // const isAfternoon = time > 12 && time < 18; // reserved for future nuanced palettes

    switch (gradientType) {
      case "calming":
        if (isEvening) {
          return [
            FreudColors.kindPurple[30],
            FreudColors.serenityGreen[20],
            FreudColors.optimisticGray[10],
          ];
        } else if (isMorning) {
          return [
            FreudColors.zenYellow[20],
            FreudColors.serenityGreen[30],
            FreudColors.optimisticGray[10],
          ];
        }
        return [
          FreudColors.serenityGreen[30],
          FreudColors.optimisticGray[20],
          FreudColors.mindfulBrown[10],
        ];
      case "nurturing":
        return [
          FreudColors.serenityGreen[40],
          FreudColors.serenityGreen[20],
          "#FFFFFF",
        ];
      case "peaceful":
        return [
          FreudColors.optimisticGray[30],
          FreudColors.optimisticGray[10],
          "#FFFFFF",
        ];
      case "grounding":
        return [
          FreudColors.mindfulBrown[40],
          FreudColors.mindfulBrown[20],
          FreudColors.mindfulBrown[10],
        ];
      case "energizing":
        return [
          FreudColors.empathyOrange[40],
          FreudColors.zenYellow[30],
          FreudColors.zenYellow[10],
        ];
      case "therapeutic":
        return [
          FreudColors.kindPurple[40],
          FreudColors.serenityGreen[40],
          FreudColors.optimisticGray[10],
        ];
      case "sunset":
        return [
          FreudColors.empathyOrange[50],
          FreudColors.zenYellow[40],
          FreudColors.kindPurple[30],
          FreudColors.serenityGreen[20],
        ];
      case "ocean":
        return [
          FreudColors.serenityGreen[60],
          FreudColors.optimisticGray[40],
          FreudColors.serenityGreen[30],
          "#FFFFFF",
        ];
      default:
        return [
          FreudColors.serenityGreen[30],
          FreudColors.optimisticGray[20],
          "#FFFFFF",
        ];
    }
  };

  const colors = getGradientColors(type);

  if (animated) {
    const interpolatedColors = colors.map((color, index) => {
      return animationValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [color, colors[(index + 1) % colors.length], color],
        extrapolate: "clamp",
      });
    });

    return (
      <Animated.View style={[styles.gradientContainer, style]}>
        <LinearGradient
          colors={colors}
          locations={[0, 0.5, 1]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.gradient}
        />
        {children}
      </Animated.View>
    );
  }

  return (
    <View style={[styles.gradientContainer, style]}>
      <LinearGradient
        colors={colors}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradient}
      />
      {children}
    </View>
  );
};

// Glassmorphism Container
export const GlassmorphismContainer = ({
  children,
  blurIntensity = 20,
  backgroundColor = "rgba(255, 255, 255, 0.25)",
  borderColor = "rgba(255, 255, 255, 0.3)",
  borderWidth = 1,
  borderRadius = 16,
  style = {},
}) => {
  const { isDarkMode } = useTheme();

  const glassStyle = {
    backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.25)" : backgroundColor,
    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : borderColor,
    borderWidth,
    borderRadius,
    overflow: "hidden",
  };

  if (Platform.OS === "ios") {
    return (
      <BlurView
        style={[glassStyle, style]}
        blurType={isDarkMode ? "dark" : "light"}
        blurAmount={blurIntensity}
        reducedTransparencyFallbackColor={backgroundColor}
      >
        {children}
      </BlurView>
    );
  }

  // Fallback for Android
  return <View style={[glassStyle, style]}>{children}</View>;
};

// Floating Particles Effect
export const FloatingParticles = ({
  particleCount = 20,
  particleColor = FreudColors.serenityGreen[40],
  particleSize = 4,
  animationSpeed = 30000,
  style = {},
}) => {
  const particles = useRef(
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      animatedValue: new Animated.Value(0),
      initialX: Math.random() * screenWidth,
      initialY: Math.random() * screenHeight,
      opacity: new Animated.Value(Math.random() * 0.8 + 0.2),
    })),
  ).current;

  useEffect(() => {
    const animations = particles.map((particle) => {
      return Animated.loop(
        Animated.parallel([
          Animated.timing(particle.animatedValue, {
            toValue: 1,
            duration: animationSpeed + Math.random() * 10000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: (animationSpeed + Math.random() * 10000) / 2,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: Math.random() * 0.8 + 0.2,
              duration: (animationSpeed + Math.random() * 10000) / 2,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );
    });

    Animated.stagger(1000, animations).start();

    return () => animations.forEach((anim) => anim.stop());
  }, []);

  return (
    <View style={[styles.particleContainer, style]} pointerEvents="none">
      {particles.map((particle) => {
        const translateY = particle.animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [particle.initialY, -100],
        });

        const translateX = particle.animatedValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [
            particle.initialX,
            particle.initialX + (Math.random() - 0.5) * 100,
            particle.initialX + (Math.random() - 0.5) * 200,
          ],
        });

        return (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              {
                width: particleSize,
                height: particleSize,
                borderRadius: particleSize / 2,
                backgroundColor: particleColor,
                transform: [{ translateX }, { translateY }],
                opacity: particle.opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

// Organic Blob Background
export const OrganicBlobBackground = ({
  blobCount = 3,
  colors = [
    FreudColors.serenityGreen[20],
    FreudColors.kindPurple[20],
    FreudColors.empathyOrange[20],
  ],
  animationDuration = 20000,
  style = {},
  children,
}) => {
  const blobs = useRef(
    Array.from({ length: blobCount }, (_, i) => ({
      id: i,
      scaleAnim: new Animated.Value(0.5 + Math.random() * 0.5),
      translateXAnim: new Animated.Value(Math.random() * screenWidth),
      translateYAnim: new Animated.Value(Math.random() * screenHeight),
      rotateAnim: new Animated.Value(0),
      color: colors[i % colors.length],
      size: 200 + Math.random() * 200,
    })),
  ).current;

  useEffect(() => {
    const animations = blobs.map((blob) => {
      return Animated.loop(
        Animated.parallel([
          Animated.timing(blob.scaleAnim, {
            toValue: 1.5,
            duration: animationDuration + Math.random() * 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(blob.rotateAnim, {
            toValue: 1,
            duration: animationDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(blob.translateXAnim, {
            toValue: Math.random() * screenWidth,
            duration: animationDuration + Math.random() * 10000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(blob.translateYAnim, {
            toValue: Math.random() * screenHeight,
            duration: animationDuration + Math.random() * 8000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      );
    });

    Animated.stagger(2000, animations).start();

    return () => animations.forEach((anim) => anim.stop());
  }, []);

  const rotate = (rotateAnim) =>
    rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

  return (
    <View style={[styles.blobContainer, style]}>
      {blobs.map((blob) => (
        <Animated.View
          key={blob.id}
          style={[
            styles.blob,
            {
              width: blob.size,
              height: blob.size,
              backgroundColor: blob.color,
              transform: [
                { translateX: blob.translateXAnim },
                { translateY: blob.translateYAnim },
                { scale: blob.scaleAnim },
                { rotate: rotate(blob.rotateAnim) },
              ],
            },
          ]}
        />
      ))}
      <View style={styles.blobContent}>{children}</View>
    </View>
  );
};

// Neural Network Background
export const NeuralNetworkBackground = ({
  nodeCount = 15,
  connectionColor = FreudColors.serenityGreen[30],
  nodeColor = FreudColors.mindfulBrown[40],
  animationSpeed = 15000,
  style = {},
  children,
}) => {
  const nodes = useRef(
    Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: Math.random() * screenWidth,
      y: Math.random() * screenHeight,
      pulseAnim: new Animated.Value(0),
      moveXAnim: new Animated.Value(0),
      moveYAnim: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    const animations = nodes.map((node) => {
      return Animated.loop(
        Animated.parallel([
          Animated.timing(node.pulseAnim, {
            toValue: 1,
            duration: 2000 + Math.random() * 3000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(node.moveXAnim, {
            toValue: (Math.random() - 0.5) * 100,
            duration: animationSpeed,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(node.moveYAnim, {
            toValue: (Math.random() - 0.5) * 100,
            duration: animationSpeed + Math.random() * 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      );
    });

    Animated.stagger(500, animations).start();

    return () => animations.forEach((anim) => anim.stop());
  }, []);

  return (
    <View style={[styles.neuralContainer, style]}>
      {/* Connection lines would be drawn here using SVG */}
      {nodes.map((node) => {
        const pulseScale = node.pulseAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1.2],
        });

        const pulseOpacity = node.pulseAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.3, 1, 0.3],
        });

        return (
          <Animated.View
            key={node.id}
            style={[
              styles.neuralNode,
              {
                left: node.x,
                top: node.y,
                backgroundColor: nodeColor,
                transform: [
                  { translateX: node.moveXAnim },
                  { translateY: node.moveYAnim },
                  { scale: pulseScale },
                ],
                opacity: pulseOpacity,
              },
            ]}
          />
        );
      })}
      <View style={styles.neuralContent}>{children}</View>
    </View>
  );
};

// Ripple Effect Background
export const RippleEffectBackground = ({
  rippleColor = FreudColors.serenityGreen[30],
  rippleCount = 5,
  duration = 3000,
  interval = 600,
  style = {},
  children,
}) => {
  const [ripples, setRipples] = useState([]);
  const rippleCounter = useRef(0);

  useEffect(() => {
    const createRipple = () => {
      const id = rippleCounter.current++;
      const x = Math.random() * screenWidth;
      const y = Math.random() * screenHeight;

      setRipples((prev) => [
        ...prev,
        {
          id,
          x,
          y,
          scale: new Animated.Value(0),
          opacity: new Animated.Value(1),
        },
      ]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
      }, duration);
    };

    const intervalId = setInterval(createRipple, interval);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    ripples.forEach((ripple) => {
      Animated.parallel([
        Animated.timing(ripple.scale, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ripple.opacity, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [ripples]);

  return (
    <View style={[styles.rippleContainer, style]}>
      {ripples.map((ripple) => (
        <Animated.View
          key={ripple.id}
          style={[
            styles.ripple,
            {
              left: ripple.x - 50,
              top: ripple.y - 50,
              backgroundColor: rippleColor,
              transform: [{ scale: ripple.scale }],
              opacity: ripple.opacity,
            },
          ]}
        />
      ))}
      <View style={styles.rippleContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    position: "relative",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  particleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: "absolute",
  },

  blobContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  blob: {
    position: "absolute",
    borderRadius: 9999,
    opacity: 0.6,
  },
  blobContent: {
    flex: 1,
    zIndex: 10,
  },

  neuralContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  neuralNode: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  neuralContent: {
    flex: 1,
    zIndex: 10,
  },

  rippleContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  ripple: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.5,
  },
  rippleContent: {
    flex: 1,
    zIndex: 10,
  },
});

export default {
  TherapeuticGradient,
  GlassmorphismContainer,
  FloatingParticles,
  OrganicBlobBackground,
  NeuralNetworkBackground,
  RippleEffectBackground,
};
