import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
  G,
  Filter,
  FeGaussianBlur,
  FeTurbulence,
  FeColorMatrix,
  ClipPath,
} from "react-native-svg";

import { modernDarkColors, modernSpacing } from "../../shared/theme/darkTheme";
import { WebSafeLinearGradient as LinearGradient } from "../common/WebSafeLinearGradient";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Advanced Parallax Background System - Multi-layer depth and immersion
// Features floating elements, depth layers, and contextual environments
const ParallaxBackground = ({
  variant = "cosmic", // 'cosmic', 'underwater', 'mountain', 'abstract', 'neural'
  intensity = 0.8,
  animated = true,
  scrollEnabled = true,
  layerCount = 5,
  particleCount = 40,
  floatingElements = 15,
  onScroll,
  style,
  children,
  ...props
}) => {
  const [dimensions, setDimensions] = useState({
    width: screenWidth,
    height: screenHeight,
  });

  const scrollY = useRef(new Animated.Value(0)).current;
  const [layers] = useState(() =>
    Array.from({ length: layerCount }, (_, index) => ({
      id: index,
      speed: 0.1 + index * 0.15, // Different parallax speeds
      opacity: 1 - index * 0.15,
      scale: 1 + index * 0.1,
      elementCount: Math.floor(particleCount / (index + 1)),
    })),
  );

  // Advanced animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const driftAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Entrance animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      // Continuous rotation for cosmic elements
      const rotateLoop = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 80000, // Very slow rotation
          useNativeDriver: true,
        }),
      );

      // Floating motion for elements
      const floatLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: true,
          }),
        ]),
      );

      // Pulsing for energy effects
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.4,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      );

      // Horizontal drifting motion
      const driftLoop = Animated.loop(
        Animated.timing(driftAnim, {
          toValue: 1,
          duration: 25000,
          useNativeDriver: true,
        }),
      );

      rotateLoop.start();
      floatLoop.start();
      pulseLoop.start();
      driftLoop.start();

      return () => {
        rotateLoop.stop();
        floatLoop.stop();
        pulseLoop.stop();
        driftLoop.stop();
      };
    }
  }, [animated, fadeAnim, rotateAnim, floatAnim, pulseAnim, driftAnim]);

  // Get variant-specific configuration
  const getVariantConfig = () => {
    const base = modernDarkColors;

    switch (variant) {
      case "cosmic":
        return {
          colors: ["#000000", "#0F0F23", "#1A1A3A", "#2D2D5F", "#4A4A8A"],
          elements: [
            { type: "star", color: "#FFFFFF", size: [1, 3] },
            { type: "planet", color: base.accent.primary, size: [20, 60] },
            {
              type: "nebula",
              color: base.therapeutic.peaceful.primary,
              size: [100, 200],
            },
            { type: "comet", color: base.accent.tertiary, size: [5, 15] },
          ],
          atmosphere: "space",
        };

      case "underwater":
        return {
          colors: ["#001122", "#002244", "#003366", "#004488", "#0066AA"],
          elements: [
            { type: "bubble", color: "#4DD0E1", size: [5, 25] },
            {
              type: "kelp",
              color: base.therapeutic.nurturing.primary,
              size: [10, 40],
            },
            { type: "fish", color: base.accent.tertiary, size: [8, 20] },
            {
              type: "coral",
              color: base.therapeutic.energizing.primary,
              size: [15, 35],
            },
          ],
          atmosphere: "fluid",
        };

      case "mountain":
        return {
          colors: ["#0A0A0F", "#1A1A2E", "#2A2A4E", "#3A3A6E", "#4A4A8E"],
          elements: [
            { type: "cloud", color: base.glass.medium, size: [50, 120] },
            { type: "bird", color: base.text.secondary, size: [3, 8] },
            { type: "mist", color: base.glass.light, size: [80, 150] },
            { type: "peak", color: base.border.primary, size: [100, 300] },
          ],
          atmosphere: "aerial",
        };

      case "abstract":
        return {
          colors: ["#0A0A0F", "#1F0A1F", "#2F1A2F", "#3F2A3F", "#4F3A4F"],
          elements: [
            { type: "geometry", color: base.accent.primary, size: [10, 50] },
            { type: "line", color: base.accent.secondary, size: [2, 100] },
            {
              type: "curve",
              color: base.therapeutic.peaceful.primary,
              size: [20, 80],
            },
            { type: "polygon", color: base.accent.tertiary, size: [15, 60] },
          ],
          atmosphere: "geometric",
        };

      case "neural":
        return {
          colors: ["#0A0A0F", "#0F0A1F", "#1F1A2F", "#2F2A3F", "#3F3A4F"],
          elements: [
            {
              type: "node",
              color: base.therapeutic.calming.primary,
              size: [3, 12],
            },
            { type: "connection", color: base.accent.primary, size: [1, 3] },
            {
              type: "pulse",
              color: base.therapeutic.energizing.primary,
              size: [5, 20],
            },
            { type: "synapse", color: base.accent.secondary, size: [2, 8] },
          ],
          atmosphere: "neural",
        };

      default:
        return {
          colors: ["#0A0A0F", "#1A1A2E", "#2A2A4E", "#3A3A6E", "#4A4A8E"],
          elements: [
            { type: "particle", color: base.accent.primary, size: [2, 8] },
          ],
          atmosphere: "ambient",
        };
    }
  };

  const config = getVariantConfig();

  // Handle scroll events with parallax calculations
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: onScroll,
    },
  );

  // Render a single parallax layer
  const renderParallaxLayer = (layer, layerIndex) => {
    const svgWidth = dimensions.width * (1 + layer.scale * 0.5);
    const svgHeight = dimensions.height * (1 + layer.scale * 0.3);

    // Calculate parallax offset
    const parallaxOffset = scrollY.interpolate({
      inputRange: [0, 1000],
      outputRange: [0, -layer.speed * 1000],
      extrapolate: "extend",
    });

    return (
      <Animated.View
        key={layer.id}
        style={[
          styles.parallaxLayer,
          {
            opacity: layer.opacity * intensity,
            transform: [{ translateY: parallaxOffset }, { scale: layer.scale }],
          },
        ]}
      >
        <Svg width={svgWidth} height={svgHeight} style={styles.layerSvg}>
          <Defs>
            <Filter id={`layerGlow-${layerIndex}`}>
              <FeGaussianBlur stdDeviation="4" result="coloredBlur" />
              <FeColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
            </Filter>

            <Filter id={`layerTurbulence-${layerIndex}`}>
              <FeTurbulence
                baseFrequency={0.01 + layerIndex * 0.005}
                numOctaves="3"
                result="turbulence"
              />
            </Filter>

            <SvgLinearGradient
              id={`layerGradient-${layerIndex}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop
                offset="0%"
                stopColor={
                  config.colors[layerIndex] ||
                  config.colors[config.colors.length - 1]
                }
                stopOpacity="0.8"
              />
              <Stop
                offset="100%"
                stopColor={
                  config.colors[layerIndex + 1] ||
                  config.colors[config.colors.length - 1]
                }
                stopOpacity="0.4"
              />
            </SvgLinearGradient>
          </Defs>

          {/* Render layer-specific elements */}
          {renderLayerElements(layer, svgWidth, svgHeight, layerIndex)}
        </Svg>
      </Animated.View>
    );
  };

  // Render elements for a specific layer
  const renderLayerElements = (layer, width, height, layerIndex) => {
    const elements = [];

    // Generate elements based on variant
    for (let i = 0; i < layer.elementCount; i++) {
      const element = config.elements[i % config.elements.length];
      const x =
        (i * width) / layer.elementCount +
        Math.sin(driftAnim._value * Math.PI * 2 + i) * 50;
      const y =
        Math.cos(floatAnim._value * Math.PI * 2 + i * 0.5) * height * 0.3 +
        height * 0.5;
      const size =
        element.size[0] + Math.random() * (element.size[1] - element.size[0]);
      const opacity =
        0.6 + Math.sin(pulseAnim._value * Math.PI * 2 + i * 0.3) * 0.4;

      switch (element.type) {
        case "star":
          elements.push(
            <Circle
              key={`${element.type}-${i}`}
              cx={x}
              cy={y}
              r={size}
              fill={element.color}
              opacity={opacity * intensity}
              filter={`url(#layerGlow-${layerIndex})`}
            />,
          );
          break;

        case "planet":
          elements.push(
            <Circle
              key={`${element.type}-${i}`}
              cx={x}
              cy={y}
              r={size}
              fill={element.color}
              opacity={opacity * intensity * 0.7}
              filter={`url(#layerGlow-${layerIndex})`}
            />,
          );
          break;

        case "nebula":
          elements.push(
            <G key={`${element.type}-${i}`}>
              <Circle
                cx={x}
                cy={y}
                r={size}
                fill={element.color}
                opacity={opacity * intensity * 0.3}
                filter={`url(#layerTurbulence-${layerIndex})`}
              />
            </G>,
          );
          break;

        case "bubble":
          elements.push(
            <Circle
              key={`${element.type}-${i}`}
              cx={x}
              cy={y}
              r={size}
              fill="none"
              stroke={element.color}
              strokeWidth="1"
              opacity={opacity * intensity}
            />,
          );
          break;

        case "kelp":
          elements.push(
            <Path
              key={`${element.type}-${i}`}
              d={`M${x},${height} Q${x + size / 2},${y} ${x},${y - size * 2}`}
              stroke={element.color}
              strokeWidth="3"
              fill="none"
              opacity={opacity * intensity * 0.6}
            />,
          );
          break;

        case "cloud":
          elements.push(
            <G key={`${element.type}-${i}`}>
              <Circle
                cx={x}
                cy={y}
                r={size * 0.6}
                fill={element.color}
                opacity={opacity * 0.4}
              />
              <Circle
                cx={x + size * 0.4}
                cy={y}
                r={size * 0.8}
                fill={element.color}
                opacity={opacity * 0.4}
              />
              <Circle
                cx={x - size * 0.4}
                cy={y}
                r={size * 0.7}
                fill={element.color}
                opacity={opacity * 0.4}
              />
            </G>,
          );
          break;

        case "geometry":
          const rotation = rotateAnim._value * 360 + i * 45;
          elements.push(
            <Rect
              key={`${element.type}-${i}`}
              x={x - size / 2}
              y={y - size / 2}
              width={size}
              height={size}
              fill="none"
              stroke={element.color}
              strokeWidth="2"
              opacity={opacity * intensity * 0.7}
              transform={`rotate(${rotation} ${x} ${y})`}
            />,
          );
          break;

        case "node":
          elements.push(
            <Circle
              key={`${element.type}-${i}`}
              cx={x}
              cy={y}
              r={size * (0.5 + pulseAnim._value * 0.5)}
              fill={element.color}
              opacity={opacity * intensity}
              filter={`url(#layerGlow-${layerIndex})`}
            />,
          );
          break;

        case "connection":
          if (i > 0) {
            const prevX =
              ((i - 1) * width) / layer.elementCount +
              Math.sin(driftAnim._value * Math.PI * 2 + (i - 1)) * 50;
            const prevY =
              Math.cos(floatAnim._value * Math.PI * 2 + (i - 1) * 0.5) *
                height *
                0.3 +
              height * 0.5;
            elements.push(
              <Path
                key={`${element.type}-${i}`}
                d={`M${prevX},${prevY} L${x},${y}`}
                stroke={element.color}
                strokeWidth={size}
                opacity={opacity * intensity * 0.4}
              />,
            );
          }
          break;

        default:
          elements.push(
            <Circle
              key={`${element.type}-${i}`}
              cx={x}
              cy={y}
              r={size}
              fill={element.color}
              opacity={opacity * intensity}
            />,
          );
      }
    }

    return elements;
  };

  // Render floating ambient elements
  const renderFloatingElements = () => (
    <Animated.View style={[styles.floatingLayer, { opacity: fadeAnim }]}>
      <Svg
        width={dimensions.width}
        height={dimensions.height}
        style={styles.floatingSvg}
      >
        <Defs>
          <Filter id="floatingGlow">
            <FeGaussianBlur stdDeviation="6" result="coloredBlur" />
          </Filter>
        </Defs>

        {Array.from({ length: floatingElements }).map((_, index) => {
          const floatX =
            Math.sin(floatAnim._value * Math.PI * 2 + index * 0.4) *
              dimensions.width *
              0.3 +
            dimensions.width * 0.5;
          const floatY =
            Math.cos(floatAnim._value * Math.PI * 1.5 + index * 0.6) *
              dimensions.height *
              0.2 +
            dimensions.height * 0.4;
          const size = 2 + Math.sin(pulseAnim._value * Math.PI * 3 + index) * 3;
          const opacity =
            0.3 + Math.sin(pulseAnim._value * Math.PI * 2 + index * 0.5) * 0.3;

          return (
            <Circle
              key={`floating-${index}`}
              cx={floatX}
              cy={floatY}
              r={size}
              fill={
                config.elements[0]?.color || modernDarkColors.accent.primary
              }
              opacity={opacity * intensity}
              filter="url(#floatingGlow)"
            />
          );
        })}
      </Svg>
    </Animated.View>
  );

  const Component = scrollEnabled ? Animated.ScrollView : Animated.View;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
        style,
      ]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width, height });
      }}
      {...props}
    >
      {/* Base gradient */}
      <LinearGradient
        colors={config.colors}
        style={styles.baseGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Parallax layers */}
      <View style={styles.parallaxContainer}>
        {layers.map((layer, index) => renderParallaxLayer(layer, index))}
      </View>

      {/* Floating elements */}
      {renderFloatingElements()}

      {/* Content */}
      {children && (
        <Component
          style={styles.contentContainer}
          onScroll={scrollEnabled ? handleScroll : undefined}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </Component>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  baseGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  parallaxContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  parallaxLayer: {
    position: "absolute",
    top: -100,
    left: -100,
    right: -100,
    bottom: -100,
  },
  layerSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  floatingLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 8,
  },
  floatingSvg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  contentContainer: {
    flex: 1,
    zIndex: 10,
  },
});

export default ParallaxBackground;
