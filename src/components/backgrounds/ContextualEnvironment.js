import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../shared/theme/ThemeContext';
import AtmosphericBackground from './AtmosphericBackground';
import ParallaxBackground from './ParallaxBackground';
import { modernDarkColors } from '../../shared/theme/darkTheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Contextual Environment System - Adaptive backgrounds based on context
// Automatically selects optimal background effects based on app context
const ContextualEnvironment = ({
  context = 'dashboard', // 'dashboard', 'mood', 'chat', 'meditation', 'assessment', 'profile'
  timeOfDay = 'auto', // 'auto', 'morning', 'afternoon', 'evening', 'night'
  weatherMood = 'auto', // 'auto', 'calm', 'energetic', 'peaceful', 'focused'
  userState = 'neutral', // 'neutral', 'stressed', 'relaxed', 'motivated', 'contemplative'
  intensity = 0.7,
  animated = true,
  interactive = true,
  adaptiveEffects = true,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const [currentConfig, setCurrentConfig] = useState(null);
  const transitionAnim = useRef(new Animated.Value(1)).current;

  // Determine time of day if auto
  const getTimeOfDay = () => {
    if (timeOfDay !== 'auto') return timeOfDay;
    
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  };

  // Determine weather mood based on user state and context
  const getWeatherMood = () => {
    if (weatherMood !== 'auto') return weatherMood;
    
    // Contextual weather mood mapping
    const moodMap = {
      stressed: 'calm',
      relaxed: 'peaceful',
      motivated: 'energetic',
      contemplative: 'peaceful',
      neutral: 'calm',
    };
    
    return moodMap[userState] || 'calm';
  };

  // Get contextual environment configuration
  const getContextualConfig = useMemo(() => {
    const currentTime = getTimeOfDay();
    const currentWeatherMood = getWeatherMood();
    
    const configs = {
      dashboard: {
        type: 'atmospheric',
        variant: currentTime === 'night' ? 'cosmos' : currentTime === 'morning' ? 'twilight' : 'aurora',
        weather: currentWeatherMood === 'energetic' ? 'clear' : 'calm',
        particles: 35,
        intensity: intensity * 0.8,
        description: 'Welcoming and energizing environment for daily overview',
      },
      
      mood: {
        type: 'atmospheric',
        variant: userState === 'stressed' ? 'ocean' : userState === 'contemplative' ? 'zen' : 'aurora',
        weather: userState === 'stressed' ? 'rain' : 'clear',
        particles: 25,
        intensity: intensity * 0.9,
        description: 'Emotionally supportive atmosphere for mood tracking',
      },
      
      chat: {
        type: 'parallax',
        variant: 'neural',
        layerCount: 4,
        particles: 30,
        floatingElements: 20,
        intensity: intensity * 0.6,
        description: 'Neural network inspired environment for AI conversations',
      },
      
      meditation: {
        type: 'atmospheric',
        variant: 'zen',
        weather: 'clear',
        particles: 15,
        intensity: intensity * 0.5,
        description: 'Minimal and peaceful environment for mindfulness',
      },
      
      assessment: {
        type: 'parallax',
        variant: 'abstract',
        layerCount: 3,
        particles: 20,
        floatingElements: 10,
        intensity: intensity * 0.7,
        description: 'Clean geometric environment for focused assessment',
      },
      
      profile: {
        type: 'atmospheric',
        variant: currentTime === 'evening' ? 'twilight' : 'forest',
        weather: 'clear',
        particles: 40,
        intensity: intensity * 0.8,
        description: 'Personal and warm environment for profile management',
      },
      
      // Special therapeutic contexts
      crisis: {
        type: 'atmospheric',
        variant: 'zen',
        weather: 'clear',
        particles: 5,
        intensity: intensity * 0.3,
        description: 'Calming minimal environment for crisis support',
      },
      
      celebration: {
        type: 'atmospheric',
        variant: 'aurora',
        weather: 'clear',
        particles: 60,
        intensity: intensity * 1.0,
        description: 'Vibrant celebratory environment for achievements',
      },
      
      focus: {
        type: 'parallax',
        variant: 'mountain',
        layerCount: 5,
        particles: 15,
        floatingElements: 8,
        intensity: intensity * 0.6,
        description: 'Serene mountain environment for deep focus',
      },
    };
    
    return configs[context] || configs.dashboard;
  }, [context, timeOfDay, weatherMood, userState, intensity]);

  // Smooth transition between configurations
  useEffect(() => {
    if (adaptiveEffects && currentConfig && currentConfig !== getContextualConfig) {
      // Fade out current background
      Animated.timing(transitionAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Update configuration
        setCurrentConfig(getContextualConfig);
        
        // Fade in new background
        Animated.timing(transitionAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      });
    } else if (!currentConfig) {
      setCurrentConfig(getContextualConfig);
    }
  }, [context, adaptiveEffects, currentConfig, getContextualConfig, transitionAnim]);

  // Get enhanced colors based on context and time
  const getContextualColors = () => {
    const base = modernDarkColors;
    const timeColors = {
      morning: [base.therapeutic.energizing[900], base.therapeutic.calming[800], base.therapeutic.peaceful[700]],
      afternoon: [base.therapeutic.calming[900], base.therapeutic.nurturing[800], base.therapeutic.peaceful[700]],
      evening: [base.therapeutic.peaceful[900], base.therapeutic.grounding[800], base.therapeutic.calming[700]],
      night: [base.background.primary, base.background.secondary, base.background.tertiary],
    };
    
    return timeColors[getTimeOfDay()] || timeColors.evening;
  };

  // Render contextual overlays and effects
  const renderContextualOverlays = () => {
    if (!currentConfig) return null;

    const overlayEffects = [];

    // Add context-specific overlays
    switch (context) {
      case 'mood':
        // Emotional state indicator
        overlayEffects.push(
          <Animated.View
            key="mood-indicator"
            style={[
              styles.moodIndicator,
              {
                backgroundColor: userState === 'stressed' 
                  ? modernDarkColors.therapeutic.calming.primary + '20'
                  : modernDarkColors.therapeutic.nurturing.primary + '20',
                opacity: transitionAnim,
              },
            ]}
          />
        );
        break;
        
      case 'chat':
        // Neural activity indicators
        overlayEffects.push(
          <Animated.View
            key="neural-activity"
            style={[
              styles.neuralOverlay,
              {
                opacity: transitionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.1],
                }),
              },
            ]}
          />
        );
        break;
        
      case 'meditation':
        // Breathing rhythm indicator
        overlayEffects.push(
          <Animated.View
            key="breathing-guide"
            style={[
              styles.breathingOverlay,
              {
                opacity: transitionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.05],
                }),
              },
            ]}
          />
        );
        break;
    }

    return overlayEffects;
  };

  // Render the appropriate background component
  const renderBackground = () => {
    if (!currentConfig) return null;

    const backgroundProps = {
      intensity: currentConfig.intensity,
      animated,
      interactive,
      style: styles.background,
    };

    if (currentConfig.type === 'atmospheric') {
      return (
        <AtmosphericBackground
          variant={currentConfig.variant}
          weather={currentConfig.weather}
          timeOfDay={getTimeOfDay()}
          particleCount={currentConfig.particles}
          {...backgroundProps}
        />
      );
    } else if (currentConfig.type === 'parallax') {
      return (
        <ParallaxBackground
          variant={currentConfig.variant}
          layerCount={currentConfig.layerCount}
          particleCount={currentConfig.particles}
          floatingElements={currentConfig.floatingElements}
          scrollEnabled={interactive}
          {...backgroundProps}
        />
      );
    }

    return null;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: transitionAnim,
        },
        style,
      ]}
      {...props}
    >
      {/* Main background */}
      {renderBackground()}
      
      {/* Contextual overlays */}
      <View style={styles.overlayContainer}>
        {renderContextualOverlays()}
      </View>
      
      {/* Time-based color tint */}
      <Animated.View
        style={[
          styles.timeOfDayTint,
          {
            backgroundColor: getContextualColors()[0] + '10',
            opacity: transitionAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
          },
        ]}
      />
      
      {/* Content layer */}
      {children && (
        <View style={styles.contentLayer}>
          {children}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  moodIndicator: {
    position: 'absolute',
    top: '20%',
    right: '10%',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: modernDarkColors.border.glass,
  },
  neuralOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: modernDarkColors.therapeutic.calming.primary,
  },
  breathingOverlay: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    width: '20%',
    height: '20%',
    borderRadius: 1000,
    backgroundColor: modernDarkColors.therapeutic.peaceful.primary,
  },
  timeOfDayTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 8,
  },
  contentLayer: {
    flex: 1,
    zIndex: 10,
  },
});

export default ContextualEnvironment;