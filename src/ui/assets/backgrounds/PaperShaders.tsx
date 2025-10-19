import { LinearGradient } from "expo-linear-gradient";
import { motion } from "framer-motion";
import React from "react";
import { View, Dimensions } from "react-native";
import { useTheme } from "react-native-paper";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const AnimatedView = motion(View);

export const TherapeuticGradient = ({
  therapeuticColor = "serenityGreen",
  intensity = "subtle",
  style,
  children,
}) => {
  const theme = useTheme();

  const getGradientColors = () => {
    const colorPalette =
      theme.colors[therapeuticColor] || theme.colors.serenityGreen;

    switch (intensity) {
      case "subtle":
        return [colorPalette[10], colorPalette[20], colorPalette[10]];
      case "medium":
        return [colorPalette[20], colorPalette[30], colorPalette[20]];
      case "strong":
        return [colorPalette[30], colorPalette[40], colorPalette[30]];
      default:
        return [colorPalette[10], colorPalette[20], colorPalette[10]];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
};

export const RadialGradientBackground = ({
  therapeuticColor = "serenityGreen",
  center = { x: 0.5, y: 0.3 },
  style,
  children,
}) => {
  const theme = useTheme();
  const colorPalette =
    theme.colors[therapeuticColor] || theme.colors.serenityGreen;

  return (
    <LinearGradient
      colors={[colorPalette[20], colorPalette[10], theme.colors.background]}
      start={{ x: center.x - 0.3, y: center.y - 0.3 }}
      end={{ x: center.x + 0.7, y: center.y + 0.7 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
};

export const OrganicShape = ({
  therapeuticColor = "serenityGreen",
  size = 200,
  opacity = 0.1,
  position = { top: 100, right: -50 },
  animationType = "float",
  style,
}) => {
  const theme = useTheme();
  const colorPalette =
    theme.colors[therapeuticColor] || theme.colors.serenityGreen;

  const getAnimationProps = () => {
    switch (animationType) {
      case "float":
        return {
          animate: {
            y: [0, -10, 0],
            rotate: [0, 2, 0],
            scale: [1, 1.05, 1],
          },
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "pulse":
        return {
          animate: {
            scale: [1, 1.1, 1],
            opacity: [opacity, opacity * 0.7, opacity],
          },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "rotate":
        return {
          animate: {
            rotate: [0, 360],
          },
          transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
        };
      default:
        return {};
    }
  };

  return (
    <AnimatedView
      {...getAnimationProps()}
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colorPalette[40],
          opacity,
          ...position,
        },
        style,
      ]}
    />
  );
};

export const WaveBackground = ({
  therapeuticColor = "serenityGreen",
  waveHeight = 100,
  animationType = "gentle",
  style,
  children,
}) => {
  const theme = useTheme();
  const colorPalette =
    theme.colors[therapeuticColor] || theme.colors.serenityGreen;

  const getWaveAnimation = () => {
    switch (animationType) {
      case "gentle":
        return {
          animate: {
            y: [0, -5, 0],
          },
          transition: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      case "active":
        return {
          animate: {
            y: [0, -15, 0],
            scaleX: [1, 1.02, 1],
          },
          transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };
      default:
        return {};
    }
  };

  return (
    <View style={[{ flex: 1 }, style]}>
      <AnimatedView
        {...getWaveAnimation()}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: waveHeight,
          backgroundColor: colorPalette[20],
          borderTopLeftRadius: screenWidth,
          borderTopRightRadius: screenWidth,
          transform: [{ scaleX: 2 }],
        }}
      />
      <AnimatedView
        {...getWaveAnimation()}
        style={{
          position: "absolute",
          bottom: waveHeight * 0.3,
          left: 0,
          right: 0,
          height: waveHeight * 0.8,
          backgroundColor: colorPalette[10],
          borderTopLeftRadius: screenWidth,
          borderTopRightRadius: screenWidth,
          transform: [{ scaleX: 2.2 }],
          opacity: 0.8,
        }}
      />
      {children}
    </View>
  );
};

export const MentalHealthPatterns = ({
  pattern = "breathing",
  therapeuticColor = "serenityGreen",
  style,
  children,
}) => {
  const theme = useTheme();
  const colorPalette =
    theme.colors[therapeuticColor] || theme.colors.serenityGreen;

  const renderBreathingPattern = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <AnimatedView
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: screenHeight * 0.3 + i * 20,
            left: screenWidth * 0.5 - 30 + i * 10,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: colorPalette[30 + i * 10],
          }}
        />
      ))}
    </>
  );

  const renderMeditationPattern = () => (
    <>
      {[...Array(8)].map((_, i) => (
        <AnimatedView
          key={i}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: screenHeight * 0.2 + Math.sin(i) * 100,
            left: screenWidth * 0.5 + Math.cos(i) * 120,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: colorPalette[20 + i * 5],
            opacity: 0.6,
          }}
        />
      ))}
    </>
  );

  return (
    <View style={[{ flex: 1 }, style]}>
      {pattern === "breathing" && renderBreathingPattern()}
      {pattern === "meditation" && renderMeditationPattern()}
      {children}
    </View>
  );
};

export const GlowingElements = ({
  elements = [],
  therapeuticColor = "serenityGreen",
  style,
}) => {
  const theme = useTheme();
  const colorPalette =
    theme.colors[therapeuticColor] || theme.colors.serenityGreen;

  return (
    <View style={[{ flex: 1 }, style]}>
      {elements.map((element, index) => (
        <AnimatedView
          key={index}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: index * 0.5,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            ...element.position,
            width: element.size || 40,
            height: element.size || 40,
            borderRadius: (element.size || 40) / 2,
            backgroundColor: colorPalette[element.intensity || 40],
            shadowColor: colorPalette[60],
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 20,
            elevation: 8,
          }}
        />
      ))}
    </View>
  );
};

export default {
  TherapeuticGradient,
  RadialGradientBackground,
  OrganicShape,
  WaveBackground,
  MentalHealthPatterns,
  GlowingElements,
};
