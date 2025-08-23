import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
  Ellipse,
  Polygon,
  Filter,
  FeGaussianBlur,
  FeTurbulence,
  FeColorMatrix,
  FeOffset,
  FeFlood,
  FeComposite,
  FeMorphology,
  FeDropShadow,
} from 'react-native-svg';
import { useTheme } from '../../shared/theme/ThemeContext';
import { modernDarkColors, modernSpacing, modernBorderRadius } from '../../shared/theme/darkTheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Advanced Shader Container - Premium visual effects for modern dark theme
// Features sophisticated Paper Design-inspired shaders and unique visual elements
const AdvancedShadersContainer = ({
  children,
  variant = 'neon', // 'neon', 'aurora', 'holographic', 'neural', 'quantum', 'plasma', 'void'
  intensity = 0.7,
  animated = true,
  interactive = true,
  glowEffect = true,
  morphEffect = false,
  particleCount = 20,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const [dimensions, setDimensions] = useState({ width: screenWidth, height: 300 });
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isPressed, setIsPressed] = useState(false);

  // Advanced animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const morphAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;

  // Interactive gesture handling
  const panResponder = useMemo(
    () => PanResponder.create({
      onMoveShouldSetPanResponder: () => interactive,
      onPanResponderGrant: () => {
        setIsPressed(true);
        Animated.spring(pulseAnim, {
          toValue: 1.1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (event) => {
        if (interactive) {
          const { locationX, locationY } = event.nativeEvent;
          setMousePos({
            x: Math.max(0, Math.min(1, locationX / dimensions.width)),
            y: Math.max(0, Math.min(1, locationY / dimensions.height)),
          });
        }
      },
      onPanResponderRelease: () => {
        setIsPressed(false);
        Animated.spring(pulseAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }).start();
      },
    }),
    [interactive, dimensions, pulseAnim]
  );

  // Advanced animation system
  useEffect(() => {
    if (animated) {
      // Entrance animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();

      // Continuous rotation for certain effects
      const rotationLoop = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 25000,
          useNativeDriver: true,
        })
      );

      // Wave animation for dynamic effects
      const waveLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      );

      // Morphing animation
      const morphLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(morphAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(morphAnim, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      );

      // Glow breathing effect
      const glowLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.8,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0.3,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );

      // Particle animation
      const particleLoop = Animated.loop(
        Animated.timing(particleAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      );

      rotationLoop.start();
      waveLoop.start();
      morphLoop.start();
      glowLoop.start();
      particleLoop.start();

      return () => {
        rotationLoop.stop();
        waveLoop.stop();
        morphLoop.stop();
        glowLoop.stop();
        particleLoop.stop();
      };
    }
  }, [animated, fadeAnim, rotateAnim, waveAnim, morphAnim, glowAnim, particleAnim]);

  // Dynamic color system based on variant and theme
  const getVariantColors = () => {
    const base = modernDarkColors;
    
    switch (variant) {
      case 'neon':
        return {
          primary: base.accent.primary,
          secondary: base.therapeutic.energizing.primary,
          tertiary: base.accent.secondary,
          gradient: base.gradients.neon,
          glow: base.shadows.glow.primary,
        };
      
      case 'aurora':
        return {
          primary: base.therapeutic.peaceful.primary,
          secondary: base.therapeutic.calming.primary,
          tertiary: base.therapeutic.nurturing.primary,
          gradient: base.gradients.aurora,
          glow: base.shadows.glow.secondary,
        };
      
      case 'holographic':
        return {
          primary: base.accent.tertiary,
          secondary: base.accent.secondary,
          tertiary: base.accent.primary,
          gradient: ['#06D6A0', '#3B82F6', '#7C3AED', '#F43F5E'],
          glow: base.shadows.glow.success,
        };
      
      case 'neural':
        return {
          primary: base.therapeutic.calming.primary,
          secondary: base.therapeutic.peaceful.primary,
          tertiary: base.text.accent,
          gradient: base.gradients.calm,
          glow: base.shadows.glow.primary,
        };
      
      case 'quantum':
        return {
          primary: base.accent.primary,
          secondary: base.accent.quaternary,
          tertiary: base.therapeutic.energizing.primary,
          gradient: ['#7C3AED', '#F59E0B', '#F43F5E', '#3B82F6'],
          glow: base.shadows.glow.primary,
        };
      
      case 'plasma':
        return {
          primary: base.therapeutic.energizing.primary,
          secondary: base.accent.quaternary,
          tertiary: base.accent.danger,
          gradient: base.gradients.energy,
          glow: base.shadows.glow.danger,
        };
      
      case 'void':
        return {
          primary: base.text.secondary,
          secondary: base.text.tertiary,
          tertiary: base.accent.primary,
          gradient: base.gradients.background,
          glow: base.shadows.depth.lg,
        };
      
      default:
        return {
          primary: base.accent.primary,
          secondary: base.accent.secondary,
          tertiary: base.accent.tertiary,
          gradient: base.gradients.primary,
          glow: base.shadows.glow.primary,
        };
    }
  };

  const colors = getVariantColors();
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Advanced shader pattern rendering
  const renderAdvancedShader = () => {
    const svgWidth = dimensions.width * 1.4;
    const svgHeight = dimensions.height * 1.2;

    switch (variant) {
      case 'neon':
        return renderNeonShader(svgWidth, svgHeight);
      case 'aurora':
        return renderAuroraShader(svgWidth, svgHeight);
      case 'holographic':
        return renderHolographicShader(svgWidth, svgHeight);
      case 'neural':
        return renderNeuralShader(svgWidth, svgHeight);
      case 'quantum':
        return renderQuantumShader(svgWidth, svgHeight);
      case 'plasma':
        return renderPlasmaShader(svgWidth, svgHeight);
      case 'void':
        return renderVoidShader(svgWidth, svgHeight);
      default:
        return renderNeonShader(svgWidth, svgHeight);
    }
  };

  // Neon shader with electric effects
  const renderNeonShader = (width, height) => (
    <Svg width={width} height={height} style={styles.svgBackground}>
      <Defs>
        <Filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <FeMorphology operator="dilate" radius="2" />
          <FeGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <FeFlood floodColor={colors.primary} floodOpacity="0.8"/>
          <FeComposite in="SourceGraphic" operator="over"/>
        </Filter>
        <SvgLinearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity={intensity * 0.9} />
          <Stop offset="50%" stopColor={colors.secondary} stopOpacity={intensity * 0.7} />
          <Stop offset="100%" stopColor={colors.tertiary} stopOpacity={intensity * 0.5} />
        </SvgLinearGradient>
        <SvgRadialGradient id="neonRadial" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity={intensity} />
          <Stop offset="70%" stopColor={colors.secondary} stopOpacity={intensity * 0.6} />
          <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </SvgRadialGradient>
      </Defs>

      {/* Animated background grid */}
      <Rect width={width} height={height} fill="url(#neonGradient)" opacity="0.1" />
      
      {/* Dynamic neon lines */}
      {Array.from({ length: 8 }).map((_, index) => {
        const y = (height / 8) * index;
        const phase = (particleAnim._value + index * 0.2) % 1;
        return (
          <Path
            key={index}
            d={`M0,${y} Q${width * 0.25},${y + Math.sin(phase * Math.PI * 2) * 30} ${width * 0.5},${y} T${width},${y}`}
            stroke={colors.primary}
            strokeWidth="2"
            fill="none"
            opacity={intensity * 0.6}
            filter="url(#neonGlow)"
          />
        );
      })}

      {/* Interactive glow orb */}
      <Circle
        cx={mousePos.x * width}
        cy={mousePos.y * height}
        r={40 + (isPressed ? 20 : 0)}
        fill="url(#neonRadial)"
        opacity={intensity * 0.8}
        filter="url(#neonGlow)"
      />

      {/* Floating particles */}
      {Array.from({ length: particleCount }).map((_, index) => {
        const phase = (particleAnim._value + index * 0.1) % 1;
        const x = (Math.sin(phase * Math.PI * 2) * width * 0.3) + (width * 0.5);
        const y = (Math.cos(phase * Math.PI * 2 + index) * height * 0.2) + (height * 0.5);
        return (
          <Circle
            key={index}
            cx={x}
            cy={y}
            r={3 + Math.sin(phase * Math.PI * 4) * 2}
            fill={colors.primary}
            opacity={intensity * 0.7}
            filter="url(#neonGlow)"
          />
        );
      })}
    </Svg>
  );

  // Aurora shader with flowing lights
  const renderAuroraShader = (width, height) => (
    <Svg width={width} height={height} style={styles.svgBackground}>
      <Defs>
        <Filter id="auroraBlur">
          <FeGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </Filter>
        <SvgLinearGradient id="auroraGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          {colors.gradient.map((color, index) => (
            <Stop 
              key={index}
              offset={`${(index / (colors.gradient.length - 1)) * 100}%`}
              stopColor={color}
              stopOpacity={intensity * (0.8 - index * 0.1)}
            />
          ))}
        </SvgLinearGradient>
      </Defs>

      {/* Flowing aurora waves */}
      {Array.from({ length: 5 }).map((_, index) => {
        const phase = waveAnim._value + index * 0.3;
        const amplitude = 60 + index * 20;
        const frequency = 0.008 + index * 0.002;
        
        const pathData = Array.from({ length: 50 }, (_, i) => {
          const x = (i / 49) * width;
          const y = height * 0.5 + Math.sin(x * frequency + phase * Math.PI * 2) * amplitude;
          return i === 0 ? `M${x},${y}` : `L${x},${y}`;
        }).join(' ');

        return (
          <Path
            key={index}
            d={pathData}
            stroke="url(#auroraGradient1)"
            strokeWidth={8 - index}
            fill="none"
            opacity={intensity * (0.7 - index * 0.1)}
            filter="url(#auroraBlur)"
          />
        );
      })}
    </Svg>
  );

  // Holographic shader with prismatic effects
  const renderHolographicShader = (width, height) => (
    <Svg width={width} height={height} style={styles.svgBackground}>
      <Defs>
        <Filter id="holographicFilter">
          <FeTurbulence baseFrequency="0.9" numOctaves="4" result="noise" />
          <FeColorMatrix in="noise" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
        </Filter>
        <SvgLinearGradient id="holographicSpectrum" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FF0080" stopOpacity={intensity} />
          <Stop offset="16%" stopColor="#FF8000" stopOpacity={intensity * 0.9} />
          <Stop offset="33%" stopColor="#FFFF00" stopOpacity={intensity * 0.8} />
          <Stop offset="50%" stopColor="#80FF00" stopOpacity={intensity * 0.7} />
          <Stop offset="66%" stopColor="#00FF80" stopOpacity={intensity * 0.6} />
          <Stop offset="83%" stopColor="#0080FF" stopOpacity={intensity * 0.5} />
          <Stop offset="100%" stopColor="#8000FF" stopOpacity={intensity * 0.4} />
        </SvgLinearGradient>
      </Defs>

      {/* Prismatic layers */}
      <Rect 
        width={width} 
        height={height} 
        fill="url(#holographicSpectrum)" 
        opacity="0.3"
        filter="url(#holographicFilter)"
      />
      
      {/* Geometric holographic patterns */}
      <Polygon
        points={`${width * 0.2},${height * 0.2} ${width * 0.8},${height * 0.3} ${width * 0.7},${height * 0.8} ${width * 0.3},${height * 0.7}`}
        fill="none"
        stroke="url(#holographicSpectrum)"
        strokeWidth="2"
        opacity={intensity * 0.6}
      />
    </Svg>
  );

  // Neural network shader
  const renderNeuralShader = (width, height) => (
    <Svg width={width} height={height} style={styles.svgBackground}>
      <Defs>
        <Filter id="neuralGlow">
          <FeGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <FeFlood floodColor={colors.primary} floodOpacity="0.6"/>
          <FeComposite in="SourceGraphic" operator="over"/>
        </Filter>
      </Defs>

      {/* Neural network nodes and connections */}
      {Array.from({ length: 15 }).map((_, index) => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const pulse = Math.sin(particleAnim._value * Math.PI * 2 + index) * 0.5 + 0.5;
        
        return (
          <g key={index}>
            <Circle
              cx={x}
              cy={y}
              r={3 + pulse * 2}
              fill={colors.primary}
              opacity={intensity * pulse}
              filter="url(#neuralGlow)"
            />
            {/* Connection lines to nearby nodes */}
            {index > 0 && (
              <Path
                d={`M${x},${y} Q${(x + Math.random() * width * 0.3)},${(y + Math.random() * height * 0.2)} ${Math.random() * width},${Math.random() * height}`}
                stroke={colors.primary}
                strokeWidth="1"
                fill="none"
                opacity={intensity * 0.3}
              />
            )}
          </g>
        );
      })}
    </Svg>
  );

  // Quantum field shader
  const renderQuantumShader = (width, height) => (
    <Svg width={width} height={height} style={styles.svgBackground}>
      <Defs>
        <Filter id="quantumDistort">
          <FeTurbulence baseFrequency="0.02" numOctaves="3" result="turbulence" />
          <FeOffset in="turbulence" dx="2" dy="2" />
        </Filter>
        <SvgRadialGradient id="quantumField" cx="50%" cy="50%" r="70%">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity={intensity} />
          <Stop offset="30%" stopColor={colors.secondary} stopOpacity={intensity * 0.7} />
          <Stop offset="70%" stopColor={colors.tertiary} stopOpacity={intensity * 0.4} />
          <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </SvgRadialGradient>
      </Defs>

      <Rect width={width} height={height} fill="url(#quantumField)" filter="url(#quantumDistort)" />
      
      {/* Quantum particles */}
      {Array.from({ length: 25 }).map((_, index) => {
        const phase = (particleAnim._value + index * 0.08) % 1;
        const angle = phase * Math.PI * 2;
        const radius = 50 + Math.sin(phase * Math.PI * 4) * 30;
        const x = width * 0.5 + Math.cos(angle) * radius;
        const y = height * 0.5 + Math.sin(angle) * radius;
        
        return (
          <Circle
            key={index}
            cx={x}
            cy={y}
            r={1 + Math.sin(phase * Math.PI * 6) * 1}
            fill={colors.gradient[index % colors.gradient.length]}
            opacity={intensity * 0.8}
          />
        );
      })}
    </Svg>
  );

  // Plasma shader
  const renderPlasmaShader = (width, height) => (
    <Svg width={width} height={height} style={styles.svgBackground}>
      <Defs>
        <Filter id="plasmaGlow">
          <FeGaussianBlur stdDeviation="4" />
        </Filter>
        <SvgRadialGradient id="plasmaCore" cx="50%" cy="50%" r="40%">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity={intensity} />
          <Stop offset="60%" stopColor={colors.secondary} stopOpacity={intensity * 0.6} />
          <Stop offset="100%" stopColor={colors.tertiary} stopOpacity={intensity * 0.2} />
        </SvgRadialGradient>
      </Defs>

      <Ellipse
        cx={width * 0.5}
        cy={height * 0.5}
        rx={100 + morphAnim._value * 50}
        ry={80 + morphAnim._value * 30}
        fill="url(#plasmaCore)"
        filter="url(#plasmaGlow)"
        transform={`rotate(${rotation} ${width * 0.5} ${height * 0.5})`}
      />
    </Svg>
  );

  // Void shader
  const renderVoidShader = (width, height) => (
    <Svg width={width} height={height} style={styles.svgBackground}>
      <Defs>
        <SvgRadialGradient id="voidGradient" cx="50%" cy="50%" r="80%">
          <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <Stop offset="70%" stopColor={colors.primary} stopOpacity={intensity * 0.2} />
          <Stop offset="100%" stopColor={colors.primary} stopOpacity={intensity * 0.5} />
        </SvgRadialGradient>
      </Defs>

      <Rect width={width} height={height} fill="url(#voidGradient)" />
      
      {/* Void ripples */}
      {Array.from({ length: 3 }).map((_, index) => {
        const radius = 50 + waveAnim._value * 100 + index * 40;
        return (
          <Circle
            key={index}
            cx={width * 0.5}
            cy={height * 0.5}
            r={radius}
            fill="none"
            stroke={colors.primary}
            strokeWidth="1"
            opacity={intensity * (0.6 - index * 0.2)}
          />
        );
      })}
    </Svg>
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: pulseAnim }],
        },
        style,
      ]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width, height });
      }}
      {...panResponder.panHandlers}
      {...props}
    >
      {/* Advanced shader background */}
      <View style={styles.shaderBackground}>
        {renderAdvancedShader()}
      </View>

      {/* Glow overlay effect */}
      {glowEffect && (
        <Animated.View
          style={[
            styles.glowOverlay,
            {
              opacity: glowAnim,
              backgroundColor: colors.primary + '10',
            },
          ]}
        />
      )}

      {/* Content container */}
      <View style={styles.contentContainer}>
        {children}
      </View>

      {/* Interactive light effect */}
      {interactive && (
        <Animated.View
          style={[
            styles.interactiveLight,
            {
              left: mousePos.x * dimensions.width - 25,
              top: mousePos.y * dimensions.height - 25,
              opacity: isPressed ? 0.8 : 0.3,
              backgroundColor: colors.primary,
            },
          ]}
        />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: modernBorderRadius.xl,
    overflow: 'hidden',
    minHeight: 100,
  },
  shaderBackground: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    zIndex: 0,
  },
  svgBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    borderRadius: modernBorderRadius.xl,
  },
  contentContainer: {
    position: 'relative',
    zIndex: 2,
    padding: modernSpacing[4],
  },
  interactiveLight: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    zIndex: 1,
    shadowRadius: 20,
    shadowColor: '#fff',
    shadowOpacity: 0.5,
    elevation: 8,
  },
});

export default AdvancedShadersContainer;