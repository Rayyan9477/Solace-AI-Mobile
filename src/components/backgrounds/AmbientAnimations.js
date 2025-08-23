import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
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
  FeDropShadow,
  Animate,
  AnimateTransform,
} from 'react-native-svg';
import { modernDarkColors, modernAnimations } from '../../shared/theme/darkTheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Ambient Animations System - Immersive background animations
// Features breathing effects, energy flows, and therapeutic motion patterns
const AmbientAnimations = ({
  variant = 'therapy', // 'therapy', 'energy', 'meditation', 'cosmic', 'neural', 'organic'
  intensity = 0.6,
  speed = 1.0,
  interactive = false,
  therapeutic = true,
  breathingRate = 4000, // milliseconds per breath cycle
  energyFlow = true,
  particlePhysics = true,
  style,
  ...props
}) => {
  const [dimensions, setDimensions] = useState({ 
    width: screenWidth, 
    height: screenHeight 
  });

  // Core animation controllers
  const masterAnim = useRef(new Animated.Value(0)).current;
  const breathingAnim = useRef(new Animated.Value(0)).current;
  const energyAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const spiralAnim = useRef(new Animated.Value(0)).current;
  const flowAnim = useRef(new Animated.Value(0)).current;
  const resonanceAnim = useRef(new Animated.Value(0)).current;

  // Therapeutic animation patterns
  useEffect(() => {
    // Master timeline controller
    const masterLoop = Animated.loop(
      Animated.timing(masterAnim, {
        toValue: 1,
        duration: 60000 / speed, // 1-minute cycle
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Breathing rhythm (therapeutic 4-7-8 pattern)
    const breathingLoop = Animated.loop(
      Animated.sequence([
        // Inhale (4 counts)
        Animated.timing(breathingAnim, {
          toValue: 1,
          duration: (breathingRate * 4) / 19 / speed,
          easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
          useNativeDriver: true,
        }),
        // Hold (7 counts)
        Animated.timing(breathingAnim, {
          toValue: 1,
          duration: (breathingRate * 7) / 19 / speed,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // Exhale (8 counts)
        Animated.timing(breathingAnim, {
          toValue: 0,
          duration: (breathingRate * 8) / 19 / speed,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
          useNativeDriver: true,
        }),
      ])
    );

    // Energy flow patterns
    const energyLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(energyAnim, {
          toValue: 1,
          duration: 8000 / speed,
          easing: Easing.bezier(0.645, 0.045, 0.355, 1.0),
          useNativeDriver: true,
        }),
        Animated.timing(energyAnim, {
          toValue: 0,
          duration: 8000 / speed,
          easing: Easing.bezier(0.645, 0.045, 0.355, 1.0),
          useNativeDriver: true,
        }),
      ])
    );

    // Therapeutic pulse (heart rhythm)
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800 / speed,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1200 / speed,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );

    // Wave propagation
    const waveLoop = Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 12000 / speed,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Spiral energy flows
    const spiralLoop = Animated.loop(
      Animated.timing(spiralAnim, {
        toValue: 1,
        duration: 20000 / speed,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Fluid flow patterns
    const flowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(flowAnim, {
          toValue: 1,
          duration: 15000 / speed,
          easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
          useNativeDriver: true,
        }),
        Animated.timing(flowAnim, {
          toValue: 0,
          duration: 15000 / speed,
          easing: Easing.bezier(0.4, 0.0, 0.6, 1.0),
          useNativeDriver: true,
        }),
      ])
    );

    // Resonance harmonics
    const resonanceLoop = Animated.loop(
      Animated.timing(resonanceAnim, {
        toValue: 1,
        duration: 6000 / speed,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    );

    // Start animations
    masterLoop.start();
    breathingLoop.start();
    energyLoop.start();
    pulseLoop.start();
    waveLoop.start();
    spiralLoop.start();
    flowLoop.start();
    resonanceLoop.start();

    return () => {
      masterLoop.stop();
      breathingLoop.stop();
      energyLoop.stop();
      pulseLoop.stop();
      waveLoop.stop();
      spiralLoop.stop();
      flowLoop.stop();
      resonanceLoop.stop();
    };
  }, [speed, breathingRate, masterAnim, breathingAnim, energyAnim, pulseAnim, waveAnim, spiralAnim, flowAnim, resonanceAnim]);

  // Get variant-specific configuration
  const getVariantConfig = () => {
    const base = modernDarkColors;
    
    switch (variant) {
      case 'therapy':
        return {
          primaryColor: base.therapeutic.calming.primary,
          secondaryColor: base.therapeutic.peaceful.primary,
          accentColor: base.therapeutic.nurturing.primary,
          effects: ['breathing', 'pulse', 'wave', 'resonance'],
          description: 'Therapeutic breathing and heart rhythm patterns',
        };
      
      case 'energy':
        return {
          primaryColor: base.therapeutic.energizing.primary,
          secondaryColor: base.accent.primary,
          accentColor: base.accent.secondary,
          effects: ['energy', 'spiral', 'flow', 'pulse'],
          description: 'Dynamic energy flows and spiral patterns',
        };
      
      case 'meditation':
        return {
          primaryColor: base.therapeutic.peaceful.primary,
          secondaryColor: base.therapeutic.grounding.primary,
          accentColor: base.glass.medium,
          effects: ['breathing', 'resonance', 'wave'],
          description: 'Minimal meditative rhythms and harmonics',
        };
      
      case 'cosmic':
        return {
          primaryColor: base.accent.primary,
          secondaryColor: base.accent.tertiary,
          accentColor: '#FFD700',
          effects: ['spiral', 'energy', 'pulse', 'flow'],
          description: 'Cosmic energy and stellar motion patterns',
        };
      
      case 'neural':
        return {
          primaryColor: base.therapeutic.calming.primary,
          secondaryColor: base.accent.secondary,
          accentColor: base.therapeutic.energizing.primary,
          effects: ['pulse', 'energy', 'resonance', 'flow'],
          description: 'Neural network activity and synaptic patterns',
        };
      
      case 'organic':
        return {
          primaryColor: base.therapeutic.nurturing.primary,
          secondaryColor: base.therapeutic.grounding.primary,
          accentColor: base.therapeutic.peaceful.primary,
          effects: ['breathing', 'flow', 'wave', 'resonance'],
          description: 'Natural organic growth and flow patterns',
        };
      
      default:
        return {
          primaryColor: base.accent.primary,
          secondaryColor: base.accent.secondary,
          accentColor: base.therapeutic.calming.primary,
          effects: ['breathing', 'pulse', 'wave'],
          description: 'General ambient animation patterns',
        };
    }
  };

  const config = getVariantConfig();

  // Render therapeutic breathing visualization
  const renderBreathingEffect = () => (
    <G key="breathing-effect">
      <Defs>
        <RadialGradient id="breathingGradient" cx="50%" cy="50%" r="50%">
          <Stop 
            offset="0%" 
            stopColor={config.primaryColor} 
            stopOpacity={intensity * 0.6}
          />
          <Stop 
            offset="70%" 
            stopColor={config.secondaryColor} 
            stopOpacity={intensity * 0.3}
          />
          <Stop 
            offset="100%" 
            stopColor="transparent" 
            stopOpacity="0"
          />
        </RadialGradient>
        
        <Filter id="breathingGlow">
          <FeGaussianBlur stdDeviation="8" />
        </Filter>
      </Defs>
      
      {/* Breathing orb - main visualization */}
      <Circle
        cx={dimensions.width * 0.5}
        cy={dimensions.height * 0.4}
        r={breathingAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [40, 80],
        })}
        fill="url(#breathingGradient)"
        opacity={intensity}
        filter="url(#breathingGlow)"
      />
      
      {/* Breathing rings */}
      {[1, 2, 3].map((ring) => (
        <Circle
          key={`breathing-ring-${ring}`}
          cx={dimensions.width * 0.5}
          cy={dimensions.height * 0.4}
          r={breathingAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [60 + ring * 20, 120 + ring * 30],
          })}
          fill="none"
          stroke={config.primaryColor}
          strokeWidth="1"
          opacity={intensity * (0.4 / ring)}
        />
      ))}
    </G>
  );

  // Render energy flow patterns
  const renderEnergyFlow = () => (
    <G key="energy-flow">
      <Defs>
        <LinearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={config.accentColor} stopOpacity={intensity * 0.8} />
          <Stop offset="50%" stopColor={config.primaryColor} stopOpacity={intensity * 0.6} />
          <Stop offset="100%" stopColor={config.secondaryColor} stopOpacity={intensity * 0.4} />
        </LinearGradient>
        
        <Filter id="energyGlow">
          <FeGaussianBlur stdDeviation="6" />
          <FeDropShadow dx="0" dy="0" stdDeviation="4" />
        </Filter>
      </Defs>
      
      {/* Energy streams */}
      {[0, 1, 2, 3, 4].map((stream) => {
        const phase = energyAnim._value + stream * 0.2;
        const amplitude = 100 + stream * 20;
        const frequency = 0.01 + stream * 0.003;
        
        const pathData = Array.from({ length: 30 }, (_, i) => {
          const x = (i / 29) * dimensions.width;
          const y = dimensions.height * 0.7 + Math.sin(x * frequency + phase * Math.PI * 2) * amplitude;
          return i === 0 ? `M${x},${y}` : `L${x},${y}`;
        }).join(' ');
        
        return (
          <Path
            key={`energy-stream-${stream}`}
            d={pathData}
            stroke="url(#energyGradient)"
            strokeWidth={3 - stream * 0.4}
            fill="none"
            opacity={intensity * (0.8 - stream * 0.15)}
            filter="url(#energyGlow)"
          />
        );
      })}
    </G>
  );

  // Render pulse patterns
  const renderPulseEffect = () => (
    <G key="pulse-effect">
      <Defs>
        <RadialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={config.accentColor} stopOpacity={intensity * 0.8} />
          <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      
      {/* Pulse waves */}
      {[0, 1, 2].map((wave) => (
        <Circle
          key={`pulse-wave-${wave}`}
          cx={dimensions.width * 0.2}
          cy={dimensions.height * 0.8}
          r={pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [10 + wave * 20, 60 + wave * 40],
          })}
          fill="url(#pulseGradient)"
          opacity={intensity * (0.6 - wave * 0.15)}
        />
      ))}
    </G>
  );

  // Render wave propagation
  const renderWaveEffect = () => (
    <G key="wave-effect">
      {/* Ripple waves */}
      {[0, 1, 2, 3].map((ripple) => {
        const wavePhase = waveAnim._value + ripple * 0.25;
        const radius = 50 + wavePhase * 200;
        
        return (
          <Circle
            key={`wave-ripple-${ripple}`}
            cx={dimensions.width * 0.8}
            cy={dimensions.height * 0.3}
            r={radius}
            fill="none"
            stroke={config.secondaryColor}
            strokeWidth="2"
            opacity={intensity * (0.5 - (wavePhase % 1) * 0.5)}
          />
        );
      })}
    </G>
  );

  // Render spiral energy flows
  const renderSpiralEffect = () => (
    <G key="spiral-effect">
      <Defs>
        <LinearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <Stop offset="50%" stopColor={config.primaryColor} stopOpacity={intensity * 0.8} />
          <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </LinearGradient>
      </Defs>
      
      {/* Spiral paths */}
      {[0, 1, 2].map((spiral) => {
        const turns = 3;
        const maxRadius = 80 + spiral * 30;
        const centerX = dimensions.width * 0.7;
        const centerY = dimensions.height * 0.6;
        const rotation = spiralAnim._value * 360 + spiral * 120;
        
        const pathData = Array.from({ length: 100 }, (_, i) => {
          const progress = i / 99;
          const angle = progress * turns * Math.PI * 2 + rotation * (Math.PI / 180);
          const radius = progress * maxRadius;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          return i === 0 ? `M${x},${y}` : `L${x},${y}`;
        }).join(' ');
        
        return (
          <Path
            key={`spiral-${spiral}`}
            d={pathData}
            stroke="url(#spiralGradient)"
            strokeWidth="3"
            fill="none"
            opacity={intensity * (0.7 - spiral * 0.2)}
          />
        );
      })}
    </G>
  );

  // Render fluid flow patterns
  const renderFlowEffect = () => (
    <G key="flow-effect">
      <Defs>
        <Filter id="flowTurbulence">
          <FeTurbulence 
            baseFrequency="0.02" 
            numOctaves="3" 
            result="turbulence"
          />
          <FeColorMatrix 
            in="turbulence" 
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
          />
        </Filter>
      </Defs>
      
      {/* Flowing elements */}
      {Array.from({ length: 8 }).map((_, flow) => {
        const flowX = (flowAnim._value * dimensions.width * 1.2 + flow * 80) % (dimensions.width + 100);
        const flowY = dimensions.height * 0.5 + Math.sin(flowAnim._value * Math.PI * 2 + flow) * 50;
        
        return (
          <Circle
            key={`flow-${flow}`}
            cx={flowX}
            cy={flowY}
            r={5 + Math.sin(flowAnim._value * Math.PI * 4 + flow) * 3}
            fill={config.accentColor}
            opacity={intensity * 0.6}
            filter="url(#flowTurbulence)"
          />
        );
      })}
    </G>
  );

  // Render resonance harmonics
  const renderResonanceEffect = () => (
    <G key="resonance-effect">
      {/* Harmonic frequencies */}
      {[1, 2, 3, 4, 5].map((harmonic) => {
        const frequency = harmonic;
        const amplitude = 30 / harmonic;
        const phase = resonanceAnim._value * frequency;
        
        const pathData = Array.from({ length: 50 }, (_, i) => {
          const x = (i / 49) * dimensions.width;
          const y = dimensions.height * 0.2 + Math.sin(x * 0.02 + phase * Math.PI * 2) * amplitude;
          return i === 0 ? `M${x},${y}` : `L${x},${y}`;
        }).join(' ');
        
        return (
          <Path
            key={`resonance-${harmonic}`}
            d={pathData}
            stroke={config.primaryColor}
            strokeWidth={6 / harmonic}
            fill="none"
            opacity={intensity * (0.8 / harmonic)}
          />
        );
      })}
    </G>
  );

  return (
    <View
      style={[styles.container, style]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions({ width, height });
      }}
      {...props}
    >
      <Svg width={dimensions.width} height={dimensions.height} style={styles.svg}>
        {/* Render active effects */}
        {config.effects.includes('breathing') && renderBreathingEffect()}
        {config.effects.includes('energy') && renderEnergyFlow()}
        {config.effects.includes('pulse') && renderPulseEffect()}
        {config.effects.includes('wave') && renderWaveEffect()}
        {config.effects.includes('spiral') && renderSpiralEffect()}
        {config.effects.includes('flow') && renderFlowEffect()}
        {config.effects.includes('resonance') && renderResonanceEffect()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default AmbientAnimations;