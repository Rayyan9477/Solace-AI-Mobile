/**
 * Page Shader Background Component
 * Advanced background effects using @paper-design/shaders-react
 * Matches Freud UI Kit design aesthetic with therapeutic animations
 */

import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions, Platform } from "react-native";

import { useFreudTheme } from "./FreudThemeProvider";
import { FreudColors } from "../../shared/theme/FreudDesignSystem";

// Shader imports (using Paper Design shaders)
// Note: @paper-design/shaders-react may need native setup, so we'll create fallbacks
let ShaderView, WaveShader, GradientShader, NoiseShader;

try {
  // Attempt to import Paper Design shaders
  const shaders = require("@paper-design/shaders-react");
  ShaderView = shaders.ShaderView;
  WaveShader = shaders.WaveShader;
  GradientShader = shaders.GradientShader;
  NoiseShader = shaders.NoiseShader;
} catch (error) {
  console.log(
    "Paper Design shaders not available, using fallback implementations",
  );
  ShaderView = null;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Therapeutic shader configurations
const THERAPEUTIC_SHADERS = {
  calming: {
    type: "wave",
    colors: [
      FreudColors.serenityGreen[10],
      FreudColors.serenityGreen[20],
      FreudColors.serenityGreen[30],
    ],
    speed: 0.5,
    amplitude: 30,
    frequency: 0.02,
  },
  nurturing: {
    type: "gradient",
    colors: [
      FreudColors.empathyOrange[10],
      FreudColors.empathyOrange[20],
      FreudColors.zenYellow[10],
    ],
    speed: 0.3,
    direction: "diagonal",
  },
  peaceful: {
    type: "noise",
    colors: [
      FreudColors.optimisticGray[10],
      FreudColors.optimisticGray[20],
      "#FFFFFF",
    ],
    speed: 0.2,
    scale: 0.8,
  },
  grounding: {
    type: "wave",
    colors: [
      FreudColors.mindfulBrown[10],
      FreudColors.mindfulBrown[20],
      FreudColors.empathyOrange[10],
    ],
    speed: 0.4,
    amplitude: 20,
    frequency: 0.015,
  },
  energizing: {
    type: "gradient",
    colors: [
      FreudColors.zenYellow[10],
      FreudColors.zenYellow[20],
      FreudColors.kindPurple[10],
    ],
    speed: 0.8,
    direction: "radial",
  },
  zen: {
    type: "wave",
    colors: [
      FreudColors.kindPurple[10],
      FreudColors.kindPurple[20],
      FreudColors.serenityGreen[10],
    ],
    speed: 0.6,
    amplitude: 40,
    frequency: 0.025,
  },
  therapeutic: {
    type: "gradient",
    colors: [
      FreudColors.serenityGreen[10],
      FreudColors.empathyOrange[10],
      FreudColors.kindPurple[10],
    ],
    speed: 0.3,
    direction: "linear",
  },
  welcoming: {
    type: "wave",
    colors: [
      FreudColors.zenYellow[10],
      FreudColors.empathyOrange[10],
      "#FFFFFF",
    ],
    speed: 0.4,
    amplitude: 25,
    frequency: 0.02,
  },
};

// Shader variant configurations
const SHADER_VARIANTS = {
  subtle: { opacity: 0.3, blur: 2 },
  normal: { opacity: 0.6, blur: 0 },
  vibrant: { opacity: 0.9, blur: 0 },
  deep: { opacity: 1.0, blur: 1 },
};

/**
 * Fallback Animated Gradient Background
 */
const FallbackGradientBackground = ({
  shader,
  variant,
  animated,
  style,
  children,
}) => {
  const config = THERAPEUTIC_SHADERS[shader] || THERAPEUTIC_SHADERS.therapeutic;
  const variantConfig = SHADER_VARIANTS[variant] || SHADER_VARIANTS.normal;

  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Breathing animation
      const breatheAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 4000 / (config.speed || 0.5),
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 4000 / (config.speed || 0.5),
            useNativeDriver: false,
          }),
        ]),
      );

      // Slow rotation for dynamic effect
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        }),
      );

      breatheAnimation.start();
      rotateAnimation.start();

      return () => {
        breatheAnimation.stop();
        rotateAnimation.stop();
      };
    }
  }, [animated, config.speed, animatedValue, rotateValue]);

  // Animated gradient colors
  const animatedColors = config.colors.map((color, index) =>
    animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [
        color,
        config.colors[(index + 1) % config.colors.length],
        config.colors[(index + 2) % config.colors.length],
      ],
      extrapolate: "clamp",
    }),
  );

  // Rotation transform
  const rotateTransform = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      {/* Base gradient layer */}
      <LinearGradient
        colors={config.colors}
        style={[StyleSheet.absoluteFill, { opacity: variantConfig.opacity }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Animated overlay layer */}
      {animated && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: 0.4,
              transform: [{ rotate: rotateTransform }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              config.colors[2] + "40",
              config.colors[0] + "20",
              config.colors[1] + "60",
            ]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </Animated.View>
      )}

      {/* Subtle overlay patterns */}
      <View style={[StyleSheet.absoluteFill, { opacity: 0.1 }]}>
        <LinearGradient
          colors={["transparent", config.colors[1] + "30", "transparent"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>

      {children}
    </View>
  );
};

/**
 * Advanced Shader Background (when Paper Design shaders available)
 */
const AdvancedShaderBackground = ({
  shader,
  variant,
  animated,
  style,
  children,
}) => {
  const config = THERAPEUTIC_SHADERS[shader] || THERAPEUTIC_SHADERS.therapeutic;
  const variantConfig = SHADER_VARIANTS[variant] || SHADER_VARIANTS.normal;
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!animated) return;

    const interval = setInterval(() => {
      setTime((t) => t + 0.016); // 60fps
    }, 16);

    return () => clearInterval(interval);
  }, [animated]);

  // Render appropriate shader based on type
  const renderShader = () => {
    switch (config.type) {
      case "wave":
        return (
          <WaveShader
            colors={config.colors}
            time={animated ? time * config.speed : 0}
            amplitude={config.amplitude}
            frequency={config.frequency}
            style={StyleSheet.absoluteFill}
          />
        );

      case "noise":
        return (
          <NoiseShader
            colors={config.colors}
            time={animated ? time * config.speed : 0}
            scale={config.scale}
            style={StyleSheet.absoluteFill}
          />
        );

      case "gradient":
      default:
        return (
          <GradientShader
            colors={config.colors}
            time={animated ? time * config.speed : 0}
            direction={config.direction}
            style={StyleSheet.absoluteFill}
          />
        );
    }
  };

  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <ShaderView
        style={[StyleSheet.absoluteFill, { opacity: variantConfig.opacity }]}
      >
        {renderShader()}
      </ShaderView>
      {children}
    </View>
  );
};

/**
 * Page Shader Background Component
 */
export const PageShaderBackground = ({
  shader = "therapeutic",
  variant = "normal",
  animated = true,
  overlay = false,
  style,
  children,
  ...props
}) => {
  const { therapeutic, isDarkMode } = useFreudTheme();

  // Use therapeutic theme if shader is 'auto'
  const activeShader = shader === "auto" ? therapeutic : shader;

  // Determine if we should use advanced shaders or fallback
  const useAdvancedShaders = ShaderView && Platform.OS !== "web";

  const BackgroundComponent = useAdvancedShaders
    ? AdvancedShaderBackground
    : FallbackGradientBackground;

  return (
    <View style={[styles.container, style]} {...props}>
      <BackgroundComponent
        shader={activeShader}
        variant={variant}
        animated={animated}
        style={style}
      >
        {overlay && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: isDarkMode
                  ? FreudColors.optimisticGray[100] + "40"
                  : "#FFFFFF" + "20",
              },
            ]}
          />
        )}
        {children}
      </BackgroundComponent>
    </View>
  );
};

/**
 * Preset Background Components
 */
export const CalmingBackground = ({ children, ...props }) => (
  <PageShaderBackground shader="calming" variant="subtle" {...props}>
    {children}
  </PageShaderBackground>
);

export const NurturingBackground = ({ children, ...props }) => (
  <PageShaderBackground shader="nurturing" variant="normal" {...props}>
    {children}
  </PageShaderBackground>
);

export const PeacefulBackground = ({ children, ...props }) => (
  <PageShaderBackground shader="peaceful" variant="subtle" {...props}>
    {children}
  </PageShaderBackground>
);

export const GroundingBackground = ({ children, ...props }) => (
  <PageShaderBackground shader="grounding" variant="normal" {...props}>
    {children}
  </PageShaderBackground>
);

export const EnergizingBackground = ({ children, ...props }) => (
  <PageShaderBackground shader="energizing" variant="vibrant" {...props}>
    {children}
  </PageShaderBackground>
);

export const ZenBackground = ({ children, ...props }) => (
  <PageShaderBackground shader="zen" variant="normal" {...props}>
    {children}
  </PageShaderBackground>
);

export const TherapeuticBackground = ({ children, ...props }) => (
  <PageShaderBackground shader="therapeutic" variant="normal" {...props}>
    {children}
  </PageShaderBackground>
);

export const WelcomingBackground = ({ children, ...props }) => (
  <PageShaderBackground shader="welcoming" variant="vibrant" {...props}>
    {children}
  </PageShaderBackground>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PageShaderBackground;
