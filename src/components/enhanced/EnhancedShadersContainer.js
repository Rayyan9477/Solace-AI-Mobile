import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
} from "react-native";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
  Circle,
  Path,
  RadialGradient,
} from "react-native-svg";

import { useTheme } from "../../shared/theme/ThemeContext";
import { spacing, borderRadius } from "../../shared/theme/theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Enhanced shader-inspired component using SVG gradients and animations
// Inspired by Paper Design's aesthetic but optimized for React Native
const EnhancedShadersContainer = ({
  children,
  variant = "mesh", // 'mesh', 'grain', 'waves', 'dots', 'glass'
  intensity = 0.6,
  animated = true,
  interactive = false,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Animated values for interactive effects
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => interactive,
        onPanResponderMove: (event) => {
          if (interactive) {
            const { locationX, locationY } = event.nativeEvent;
            setMousePos({
              x: locationX / screenWidth,
              y: locationY / screenHeight,
            });
          }
        },
      }),
    [interactive],
  );

  useEffect(() => {
    if (animated) {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // Continuous rotation animation
      const rotationAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        }),
      );

      // Breathing scale animation
      const breathingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      );

      rotationAnimation.start();
      breathingAnimation.start();

      return () => {
        rotationAnimation.stop();
        breathingAnimation.stop();
      };
    }
  }, [animated, fadeAnim, rotateAnim, scaleAnim]);

  // Generate therapeutic color schemes based on time
  const getTimeBasedColors = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      // Morning: Energizing colors
      return [
        theme.colors.therapeutic.energizing[200],
        theme.colors.therapeutic.calming[300],
        theme.colors.therapeutic.peaceful[200],
      ];
    } else if (hour < 17) {
      // Afternoon: Calming colors
      return [
        theme.colors.therapeutic.calming[300],
        theme.colors.therapeutic.peaceful[400],
        theme.colors.therapeutic.nurturing[300],
      ];
    } else {
      // Evening: Grounding colors
      return [
        theme.colors.therapeutic.peaceful[400],
        theme.colors.therapeutic.grounding[300],
        theme.colors.therapeutic.calming[200],
      ];
    }
  };

  const colors = getTimeBasedColors();
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Render different shader-inspired patterns
  const renderShaderPattern = () => {
    const svgWidth = screenWidth * 1.2;
    const svgHeight = screenHeight * 0.8;

    switch (variant) {
      case "mesh":
        return (
          <Svg width={svgWidth} height={svgHeight} style={styles.svgBackground}>
            <Defs>
              <SvgLinearGradient
                id="meshGradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop
                  offset="0%"
                  stopColor={colors[0]}
                  stopOpacity={intensity}
                />
                <Stop
                  offset="50%"
                  stopColor={colors[1]}
                  stopOpacity={intensity * 0.8}
                />
                <Stop
                  offset="100%"
                  stopColor={colors[2]}
                  stopOpacity={intensity * 0.6}
                />
              </SvgLinearGradient>
              <SvgLinearGradient
                id="meshGradient2"
                x1="100%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <Stop
                  offset="0%"
                  stopColor={colors[2]}
                  stopOpacity={intensity * 0.7}
                />
                <Stop
                  offset="100%"
                  stopColor={colors[0]}
                  stopOpacity={intensity * 0.4}
                />
              </SvgLinearGradient>
            </Defs>
            <Rect
              width={svgWidth}
              height={svgHeight}
              fill="url(#meshGradient1)"
            />
            <Circle
              cx={svgWidth * 0.3}
              cy={svgHeight * 0.3}
              r={svgWidth * 0.4}
              fill="url(#meshGradient2)"
            />
            <Circle
              cx={svgWidth * 0.7}
              cy={svgHeight * 0.7}
              r={svgWidth * 0.3}
              fill={colors[1]}
              opacity={intensity * 0.3}
            />
          </Svg>
        );

      case "waves":
        return (
          <Svg width={svgWidth} height={svgHeight} style={styles.svgBackground}>
            <Defs>
              <SvgLinearGradient
                id="waveGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <Stop
                  offset="0%"
                  stopColor={colors[0]}
                  stopOpacity={intensity}
                />
                <Stop
                  offset="50%"
                  stopColor={colors[1]}
                  stopOpacity={intensity * 0.8}
                />
                <Stop
                  offset="100%"
                  stopColor={colors[2]}
                  stopOpacity={intensity * 0.6}
                />
              </SvgLinearGradient>
            </Defs>
            <Path
              d={`M0,${svgHeight * 0.6} Q${svgWidth * 0.25},${svgHeight * 0.4} ${svgWidth * 0.5},${svgHeight * 0.6} T${svgWidth},${svgHeight * 0.6} L${svgWidth},${svgHeight} L0,${svgHeight} Z`}
              fill="url(#waveGradient)"
            />
            <Path
              d={`M0,${svgHeight * 0.4} Q${svgWidth * 0.25},${svgHeight * 0.2} ${svgWidth * 0.5},${svgHeight * 0.4} T${svgWidth},${svgHeight * 0.4} L${svgWidth},${svgHeight} L0,${svgHeight} Z`}
              fill={colors[2]}
              opacity={intensity * 0.4}
            />
          </Svg>
        );

      case "dots":
        const dotCount = 20;
        return (
          <Svg width={svgWidth} height={svgHeight} style={styles.svgBackground}>
            <Defs>
              <RadialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
                <Stop
                  offset="0%"
                  stopColor={colors[0]}
                  stopOpacity={intensity}
                />
                <Stop offset="100%" stopColor={colors[1]} stopOpacity={0} />
              </RadialGradient>
            </Defs>
            {Array.from({ length: dotCount }).map((_, index) => {
              const x = Math.sin(index * 0.8) * svgWidth * 0.3 + svgWidth * 0.5;
              const y =
                Math.cos(index * 0.8) * svgHeight * 0.3 + svgHeight * 0.5;
              const radius = 20 + (index % 3) * 10;
              return (
                <Circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={radius}
                  fill="url(#dotGradient)"
                  opacity={intensity * (0.3 + (index % 3) * 0.2)}
                />
              );
            })}
          </Svg>
        );

      case "glass":
        return (
          <Svg width={svgWidth} height={svgHeight} style={styles.svgBackground}>
            <Defs>
              <SvgLinearGradient
                id="glassGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop
                  offset="0%"
                  stopColor={colors[0]}
                  stopOpacity={intensity * 0.1}
                />
                <Stop
                  offset="30%"
                  stopColor={colors[1]}
                  stopOpacity={intensity * 0.3}
                />
                <Stop
                  offset="70%"
                  stopColor={colors[2]}
                  stopOpacity={intensity * 0.2}
                />
                <Stop
                  offset="100%"
                  stopColor={colors[0]}
                  stopOpacity={intensity * 0.1}
                />
              </SvgLinearGradient>
            </Defs>
            <Rect
              width={svgWidth}
              height={svgHeight}
              fill="url(#glassGradient)"
            />
            <Rect
              x={svgWidth * 0.1}
              y={svgHeight * 0.1}
              width={svgWidth * 0.8}
              height={svgHeight * 0.8}
              fill="none"
              stroke={colors[1]}
              strokeWidth="2"
              strokeOpacity={intensity * 0.3}
              rx={borderRadius.lg}
            />
          </Svg>
        );

      default: // grain
        return (
          <Svg width={svgWidth} height={svgHeight} style={styles.svgBackground}>
            <Defs>
              <SvgLinearGradient
                id="grainGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <Stop
                  offset="0%"
                  stopColor={colors[0]}
                  stopOpacity={intensity * 0.8}
                />
                <Stop
                  offset="50%"
                  stopColor={colors[1]}
                  stopOpacity={intensity * 0.6}
                />
                <Stop
                  offset="100%"
                  stopColor={colors[2]}
                  stopOpacity={intensity * 0.4}
                />
              </SvgLinearGradient>
            </Defs>
            <Rect
              width={svgWidth}
              height={svgHeight}
              fill="url(#grainGradient)"
            />
            {/* Add grain-like texture with small circles */}
            {Array.from({ length: 50 }).map((_, index) => (
              <Circle
                key={index}
                cx={Math.random() * svgWidth}
                cy={Math.random() * svgHeight}
                r={1 + Math.random() * 2}
                fill={colors[index % 3]}
                opacity={intensity * 0.1}
              />
            ))}
          </Svg>
        );
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { rotate: animated ? rotation : "0deg" },
            { scale: animated ? scaleAnim : 1 },
          ],
        },
        style,
      ]}
      {...panResponder.panHandlers}
      {...props}
    >
      {/* Background shader pattern */}
      <View style={styles.shaderBackground}>{renderShaderPattern()}</View>

      {/* Overlay blur effect for glassmorphism */}
      {variant === "glass" && (
        <View
          style={[
            styles.glassOverlay,
            { backgroundColor: theme.colors.background.surface + "20" },
          ]}
        />
      )}

      {/* Content container */}
      <View style={styles.contentContainer}>{children}</View>

      {/* Interactive glow effect */}
      {interactive && (
        <Animated.View
          style={[
            styles.interactiveGlow,
            {
              transform: [
                { translateX: mousePos.x * screenWidth - 50 },
                { translateY: mousePos.y * screenHeight - 50 },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.glowCircle,
              {
                backgroundColor: colors[0],
                opacity: intensity * 0.3,
              },
            ]}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },
  shaderBackground: {
    position: "absolute",
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    zIndex: 0,
  },
  svgBackground: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backdropFilter: "blur(10px)", // Web only
  },
  contentContainer: {
    position: "relative",
    zIndex: 2,
    padding: spacing[4],
  },
  interactiveGlow: {
    position: "absolute",
    zIndex: 1,
    pointerEvents: "none",
  },
  glowCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
});

export default EnhancedShadersContainer;
