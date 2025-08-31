import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Animated, Dimensions, Platform } from "react-native";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
  Ellipse,
  G,
  Filter,
  FeGaussianBlur,
  FeTurbulence,
  FeColorMatrix,
  FeOffset,
  FeFlood,
  FeComposite,
  FeMorphology,
  FeDropShadow,
  ClipPath,
} from "react-native-svg";

import { modernDarkColors, modernSpacing } from "../../shared/theme/darkTheme";
import { WebSafeLinearGradient as LinearGradient } from "../common/WebSafeLinearGradient";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Atmospheric Background System - Premium immersive environments
// Features dynamic weather, time-based themes, and contextual atmospheres
const AtmosphericBackground = ({
  variant = "twilight", // 'twilight', 'storm', 'aurora', 'cosmos', 'ocean', 'forest', 'zen'
  intensity = 0.7,
  animated = true,
  interactive = false,
  timeOfDay = "evening", // 'morning', 'afternoon', 'evening', 'night'
  weather = "clear", // 'clear', 'rain', 'snow', 'fog', 'wind'
  particleCount = 50,
  style,
  children,
  ...props
}) => {
  const [dimensions, setDimensions] = useState({
    width: screenWidth,
    height: screenHeight,
  });

  // Advanced animation refs for atmospheric effects
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const windAnim = useRef(new Animated.Value(0)).current;
  const cloudAnim = useRef(new Animated.Value(0)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Entrance fade
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start();

      // Wind animation for atmospheric movement
      const windLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(windAnim, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(windAnim, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: true,
          }),
        ]),
      );

      // Cloud drift animation
      const cloudLoop = Animated.loop(
        Animated.timing(cloudAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        }),
      );

      // Particle system animation
      const particleLoop = Animated.loop(
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        }),
      );

      // Wave motion for water effects
      const waveLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      );

      // Cosmic pulsing for space themes
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      );

      // Slow rotation for cosmic elements
      const rotateLoop = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 60000,
          useNativeDriver: true,
        }),
      );

      // Floating motion for ambient elements
      const floatLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 6000,
            useNativeDriver: true,
          }),
        ]),
      );

      windLoop.start();
      cloudLoop.start();
      particleLoop.start();
      waveLoop.start();
      pulseLoop.start();
      rotateLoop.start();
      floatLoop.start();

      return () => {
        windLoop.stop();
        cloudLoop.stop();
        particleLoop.stop();
        waveLoop.stop();
        pulseLoop.stop();
        rotateLoop.stop();
        floatLoop.stop();
      };
    }
  }, [
    animated,
    fadeAnim,
    windAnim,
    cloudAnim,
    particleAnim,
    waveAnim,
    pulseAnim,
    rotateAnim,
    floatAnim,
  ]);

  // Get variant-specific color schemes and effects
  const getVariantConfig = () => {
    const base = modernDarkColors;

    switch (variant) {
      case "twilight":
        return {
          colors: ["#0A0A0F", "#1A1A2E", "#16213E", "#0F3460"],
          accent: base.therapeutic.peaceful.primary,
          particles: base.accent.primary,
          atmosphere: "gradient",
          effects: ["stars", "clouds", "aurora"],
        };

      case "storm":
        return {
          colors: ["#0D1117", "#161B22", "#21262D", "#30363D"],
          accent: base.therapeutic.calming.primary,
          particles: "#4FC3F7",
          atmosphere: "turbulent",
          effects: ["lightning", "rain", "wind"],
        };

      case "aurora":
        return {
          colors: ["#0A0A0F", "#1A1A2E", "#0F2027", "#203A43"],
          accent: base.therapeutic.nurturing.primary,
          particles: base.accent.tertiary,
          atmosphere: "flowing",
          effects: ["aurora", "particles", "glow"],
        };

      case "cosmos":
        return {
          colors: ["#000000", "#0F0F23", "#1A1A3A", "#2D2D5F"],
          accent: base.accent.primary,
          particles: "#FFD700",
          atmosphere: "space",
          effects: ["stars", "nebula", "planets"],
        };

      case "ocean":
        return {
          colors: ["#0A1128", "#001845", "#002855", "#003d82"],
          accent: base.therapeutic.calming.primary,
          particles: "#4DD0E1",
          atmosphere: "fluid",
          effects: ["waves", "bubbles", "currents"],
        };

      case "forest":
        return {
          colors: ["#0D1B0F", "#1A2B1D", "#2D4A32", "#4A6741"],
          accent: base.therapeutic.nurturing.primary,
          particles: "#81C784",
          atmosphere: "organic",
          effects: ["leaves", "fireflies", "wind"],
        };

      case "zen":
        return {
          colors: ["#0A0A0A", "#1A1A1A", "#2A2A2A", "#3A3A3A"],
          accent: base.therapeutic.peaceful.primary,
          particles: base.text.secondary,
          atmosphere: "minimal",
          effects: ["ripples", "breath", "meditation"],
        };

      default:
        return {
          colors: ["#0A0A0F", "#1A1A2E", "#16213E", "#0F3460"],
          accent: base.accent.primary,
          particles: base.accent.secondary,
          atmosphere: "gradient",
          effects: ["ambient"],
        };
    }
  };

  const config = getVariantConfig();

  // Render atmospheric effects based on variant
  const renderAtmosphericEffects = () => {
    const svgWidth = dimensions.width * 1.5;
    const svgHeight = dimensions.height * 1.2;

    return (
      <Svg width={svgWidth} height={svgHeight} style={styles.effectsLayer}>
        <Defs>
          {/* Advanced filters for atmospheric effects */}
          <Filter
            id="atmosphericGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <FeGaussianBlur stdDeviation="8" result="coloredBlur" />
            <FeFlood floodColor={config.accent} floodOpacity="0.3" />
            <FeComposite in="SourceGraphic" operator="over" />
          </Filter>

          <Filter id="turbulence" x="-50%" y="-50%" width="200%" height="200%">
            <FeTurbulence
              baseFrequency={weather === "storm" ? "0.02" : "0.01"}
              numOctaves="4"
              result="turbulence"
            />
            <FeColorMatrix
              in="turbulence"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
            />
          </Filter>

          <Filter id="softGlow">
            <FeMorphology operator="dilate" radius="2" />
            <FeGaussianBlur stdDeviation="3" result="coloredBlur" />
            <FeFlood floodColor={config.particles} floodOpacity="0.6" />
            <FeComposite in="SourceGraphic" operator="over" />
          </Filter>

          {/* Gradient definitions */}
          <SvgLinearGradient
            id="atmosphericGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            {config.colors.map((color, index) => (
              <Stop
                key={index}
                offset={`${(index / (config.colors.length - 1)) * 100}%`}
                stopColor={color}
                stopOpacity={intensity * (1 - index * 0.1)}
              />
            ))}
          </SvgLinearGradient>

          <SvgRadialGradient id="cosmicCore" cx="50%" cy="50%" r="60%">
            <Stop
              offset="0%"
              stopColor={config.accent}
              stopOpacity={intensity * 0.8}
            />
            <Stop
              offset="50%"
              stopColor={config.particles}
              stopOpacity={intensity * 0.4}
            />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </SvgRadialGradient>

          <ClipPath id="atmosphericClip">
            <Rect width={svgWidth} height={svgHeight} />
          </ClipPath>
        </Defs>

        {/* Base atmospheric layer */}
        <Rect
          width={svgWidth}
          height={svgHeight}
          fill="url(#atmosphericGradient)"
          opacity={intensity * 0.9}
        />

        {/* Render variant-specific effects */}
        {variant === "twilight" && renderTwilightEffects(svgWidth, svgHeight)}
        {variant === "storm" && renderStormEffects(svgWidth, svgHeight)}
        {variant === "aurora" && renderAuroraEffects(svgWidth, svgHeight)}
        {variant === "cosmos" && renderCosmosEffects(svgWidth, svgHeight)}
        {variant === "ocean" && renderOceanEffects(svgWidth, svgHeight)}
        {variant === "forest" && renderForestEffects(svgWidth, svgHeight)}
        {variant === "zen" && renderZenEffects(svgWidth, svgHeight)}

        {/* Universal particle system */}
        {renderParticleSystem(svgWidth, svgHeight)}
      </Svg>
    );
  };

  // Twilight atmosphere with stars and gentle clouds
  const renderTwilightEffects = (width, height) => (
    <G clipPath="url(#atmosphericClip)">
      {/* Twinkling stars */}
      {Array.from({ length: 30 }).map((_, index) => {
        const x = Math.random() * width;
        const y = Math.random() * height * 0.6; // Upper portion
        const size = 1 + Math.random() * 2;
        const twinkle =
          Math.sin(particleAnim._value * Math.PI * 2 + index) * 0.5 + 0.5;

        return (
          <Circle
            key={`star-${index}`}
            cx={x}
            cy={y}
            r={size}
            fill={config.particles}
            opacity={intensity * twinkle * 0.8}
            filter="url(#softGlow)"
          />
        );
      })}

      {/* Soft clouds */}
      {Array.from({ length: 5 }).map((_, index) => {
        const cloudX =
          cloudAnim._value * width * 0.3 + index * width * 0.25 - width * 0.1;
        const cloudY = height * 0.2 + Math.sin(index * 0.5) * 50;

        return (
          <Ellipse
            key={`cloud-${index}`}
            cx={cloudX}
            cy={cloudY}
            rx={60 + index * 20}
            ry={30 + index * 10}
            fill={config.accent}
            opacity={intensity * 0.2}
            filter="url(#atmosphericGlow)"
          />
        );
      })}
    </G>
  );

  // Storm atmosphere with lightning and rain
  const renderStormEffects = (width, height) => (
    <G clipPath="url(#atmosphericClip)">
      {/* Lightning bolts */}
      {Array.from({ length: 3 }).map((_, index) => {
        const flash =
          Math.sin(windAnim._value * Math.PI * 4 + index * 2) > 0.95;
        const x = width * (0.2 + index * 0.3);

        if (flash) {
          return (
            <Path
              key={`lightning-${index}`}
              d={`M${x},0 L${x + 20},${height * 0.3} L${x - 10},${height * 0.3} L${x + 30},${height * 0.8}`}
              stroke="#E3F2FD"
              strokeWidth="3"
              fill="none"
              opacity={intensity}
              filter="url(#atmosphericGlow)"
            />
          );
        }
        return null;
      })}

      {/* Rain drops */}
      {Array.from({ length: 100 }).map((_, index) => {
        const rainX = (index * 15 + windAnim._value * 50) % width;
        const rainY = (particleAnim._value * height * 2) % height;

        return (
          <Path
            key={`rain-${index}`}
            d={`M${rainX},${rainY} L${rainX + 2},${rainY + 10}`}
            stroke={config.particles}
            strokeWidth="1"
            opacity={intensity * 0.6}
          />
        );
      })}

      {/* Storm clouds */}
      <Rect
        width={width}
        height={height * 0.4}
        fill="url(#turbulence)"
        opacity={intensity * 0.3}
      />
    </G>
  );

  // Aurora borealis effects
  const renderAuroraEffects = (width, height) => (
    <G clipPath="url(#atmosphericClip)">
      {/* Aurora waves */}
      {Array.from({ length: 4 }).map((_, index) => {
        const wavePhase = waveAnim._value + index * 0.25;
        const amplitude = 100 + index * 30;
        const frequency = 0.008 + index * 0.002;

        const pathData = Array.from({ length: 50 }, (_, i) => {
          const x = (i / 49) * width;
          const y =
            height * 0.3 +
            Math.sin(x * frequency + wavePhase * Math.PI * 2) * amplitude;
          return i === 0 ? `M${x},${y}` : `L${x},${y}`;
        }).join(" ");

        return (
          <Path
            key={`aurora-${index}`}
            d={pathData + ` L${width},${height} L0,${height} Z`}
            fill={index % 2 === 0 ? config.accent : config.particles}
            opacity={intensity * (0.4 - index * 0.08)}
            filter="url(#atmosphericGlow)"
          />
        );
      })}
    </G>
  );

  // Cosmic space effects
  const renderCosmosEffects = (width, height) => (
    <G clipPath="url(#atmosphericClip)">
      {/* Nebula core */}
      <Ellipse
        cx={width * 0.7}
        cy={height * 0.3}
        rx={200}
        ry={150}
        fill="url(#cosmicCore)"
        opacity={intensity * pulseAnim._value}
        filter="url(#atmosphericGlow)"
        transform={`rotate(${rotateAnim._value * 360} ${width * 0.7} ${height * 0.3})`}
      />

      {/* Distant stars */}
      {Array.from({ length: 200 }).map((_, index) => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 0.5 + Math.random() * 1.5;
        const twinkle =
          Math.sin(particleAnim._value * Math.PI * 3 + index * 0.1) * 0.3 + 0.7;

        return (
          <Circle
            key={`cosmic-star-${index}`}
            cx={x}
            cy={y}
            r={size}
            fill="#FFFFFF"
            opacity={intensity * twinkle * 0.8}
          />
        );
      })}

      {/* Cosmic dust */}
      <Rect
        width={width}
        height={height}
        fill="url(#turbulence)"
        opacity={intensity * 0.1}
      />
    </G>
  );

  // Ocean depth effects
  const renderOceanEffects = (width, height) => (
    <G clipPath="url(#atmosphericClip)">
      {/* Ocean waves */}
      {Array.from({ length: 6 }).map((_, index) => {
        const wavePhase = waveAnim._value + index * 0.2;
        const amplitude = 40 + index * 15;
        const waveY = height * 0.7 + index * 20;

        const pathData = Array.from({ length: 30 }, (_, i) => {
          const x = (i / 29) * width;
          const y =
            waveY + Math.sin(x * 0.01 + wavePhase * Math.PI * 2) * amplitude;
          return i === 0 ? `M${x},${y}` : `L${x},${y}`;
        }).join(" ");

        return (
          <Path
            key={`wave-${index}`}
            d={pathData + ` L${width},${height} L0,${height} Z`}
            fill={config.accent}
            opacity={intensity * (0.3 - index * 0.04)}
          />
        );
      })}

      {/* Floating bubbles */}
      {Array.from({ length: 15 }).map((_, index) => {
        const bubbleX =
          Math.sin(floatAnim._value * Math.PI * 2 + index) * 30 +
          (index * width) / 15;
        const bubbleY = height - floatAnim._value * height * 0.8 - index * 20;
        const size = 3 + Math.random() * 8;

        return (
          <Circle
            key={`bubble-${index}`}
            cx={bubbleX}
            cy={bubbleY}
            r={size}
            fill="none"
            stroke={config.particles}
            strokeWidth="1"
            opacity={intensity * 0.6}
          />
        );
      })}
    </G>
  );

  // Forest ambiance
  const renderForestEffects = (width, height) => (
    <G clipPath="url(#atmosphericClip)">
      {/* Floating leaves */}
      {Array.from({ length: 25 }).map((_, index) => {
        const leafX = (windAnim._value * width * 0.5 + index * 30) % width;
        const leafY =
          height * 0.2 + Math.sin(windAnim._value * Math.PI + index) * 100;
        const rotation = windAnim._value * 360 + index * 45;

        return (
          <Ellipse
            key={`leaf-${index}`}
            cx={leafX}
            cy={leafY}
            rx={4}
            ry={8}
            fill={config.particles}
            opacity={intensity * 0.7}
            transform={`rotate(${rotation} ${leafX} ${leafY})`}
          />
        );
      })}

      {/* Fireflies */}
      {Array.from({ length: 12 }).map((_, index) => {
        const fireflyX =
          Math.sin(particleAnim._value * Math.PI * 2 + index * 0.5) *
            width *
            0.3 +
          width * 0.5;
        const fireflyY =
          Math.cos(particleAnim._value * Math.PI * 1.5 + index * 0.3) *
            height *
            0.2 +
          height * 0.6;
        const glow =
          Math.sin(pulseAnim._value * Math.PI * 4 + index) * 0.4 + 0.6;

        return (
          <Circle
            key={`firefly-${index}`}
            cx={fireflyX}
            cy={fireflyY}
            r={2}
            fill="#FFF59D"
            opacity={intensity * glow}
            filter="url(#softGlow)"
          />
        );
      })}
    </G>
  );

  // Zen minimalist effects
  const renderZenEffects = (width, height) => (
    <G clipPath="url(#atmosphericClip)">
      {/* Meditation ripples */}
      {Array.from({ length: 3 }).map((_, index) => {
        const rippleRadius = 50 + pulseAnim._value * 100 + index * 40;

        return (
          <Circle
            key={`ripple-${index}`}
            cx={width * 0.5}
            cy={height * 0.5}
            r={rippleRadius}
            fill="none"
            stroke={config.accent}
            strokeWidth="1"
            opacity={intensity * (0.4 - index * 0.1)}
          />
        );
      })}

      {/* Breathing orb */}
      <Circle
        cx={width * 0.5}
        cy={height * 0.3}
        r={20 + pulseAnim._value * 15}
        fill={config.particles}
        opacity={intensity * 0.3}
        filter="url(#atmosphericGlow)"
      />
    </G>
  );

  // Universal particle system
  const renderParticleSystem = (width, height) => (
    <G clipPath="url(#atmosphericClip)">
      {Array.from({ length: particleCount }).map((_, index) => {
        const particleX =
          Math.sin(particleAnim._value * Math.PI * 2 + index * 0.1) *
            width *
            0.4 +
          width * 0.5;
        const particleY =
          Math.cos(particleAnim._value * Math.PI * 1.5 + index * 0.15) *
            height *
            0.3 +
          height * 0.5;
        const size =
          0.5 + Math.sin(particleAnim._value * Math.PI * 4 + index) * 0.5;
        const opacity =
          Math.sin(particleAnim._value * Math.PI * 3 + index * 0.2) * 0.3 + 0.3;

        return (
          <Circle
            key={`particle-${index}`}
            cx={particleX}
            cy={particleY}
            r={Math.max(0.5, size)}
            fill={config.particles}
            opacity={intensity * opacity}
          />
        );
      })}
    </G>
  );

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
      {/* Base gradient layer */}
      <LinearGradient
        colors={config.colors}
        style={styles.baseGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Atmospheric effects layer */}
      <View style={styles.effectsContainer}>{renderAtmosphericEffects()}</View>

      {/* Content layer */}
      {children && <View style={styles.contentLayer}>{children}</View>}
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
  effectsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  effectsLayer: {
    position: "absolute",
    top: -50,
    left: -50,
  },
  contentLayer: {
    flex: 1,
    zIndex: 10,
  },
});

export default AtmosphericBackground;
