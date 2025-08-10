/**
 * Solace AI Mobile - shadcn UI Card Component
 * 
 * A comprehensive card component following shadcn UI patterns,
 * optimized for mental health applications with therapeutic design principles.
 * 
 * Features:
 * - Multiple variants (default, elevated, therapeutic, mood-based)
 * - Therapeutic gradients for visual wellness
 * - Accessibility-first design with WCAG 2.1 compliance
 * - Gentle animations and smooth interactions
 * - Mood-based color theming for mental health tracking
 * - Composable structure (Header, Content, Footer)
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import PropTypes from 'prop-types';

import { shadcnConfig } from '../config';
import { 
  colorUtils, 
  styleUtils, 
  animationUtils, 
  accessibilityUtils,
  platformUtils 
} from '../utils';
import { useTheme } from '../../contexts/ThemeContext';

const ShadcnCard = ({
  children,
  variant = 'default',
  size = 'medium',
  interactive = false,
  therapeuticScheme,
  mood,
  gradient = false,
  onPress,
  onLongPress,
  animateOnMount = true,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  contentStyle,
  ...props
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation refs
  const scaleAnimation = useRef(new Animated.Value(animateOnMount ? 0.9 : 1)).current;
  const opacityAnimation = useRef(new Animated.Value(animateOnMount ? 0 : 1)).current;
  const translateYAnimation = useRef(new Animated.Value(animateOnMount ? 20 : 0)).current;
  const pressAnimation = useRef(new Animated.Value(1)).current;
  
  // Screen dimensions for responsive sizing
  const screenData = Dimensions.get('window');
  
  useEffect(() => {
    if (animateOnMount && !isReducedMotionEnabled) {
      // Gentle entrance animation
      animationUtils.createSoothingSlideIn(
        translateYAnimation,
        opacityAnimation,
        { duration: shadcnConfig.animations.soothing.duration }
      ).start();
      
      animationUtils.createGentleEntrance(
        scaleAnimation,
        { duration: shadcnConfig.animations.soothing.duration }
      ).start();
    }
  }, [animateOnMount, isReducedMotionEnabled]);
  
  // Get card configuration
  const getCardConfig = () => {
    let cardVariant = variant;
    let colorScheme = null;
    
    // Apply therapeutic scheme if provided
    if (therapeuticScheme) {
      colorScheme = therapeuticScheme;
      cardVariant = 'therapeutic';
    }
    
    // Apply mood-based coloring if provided
    if (mood) {
      colorScheme = colorUtils.getTherapeuticColor(mood);
      cardVariant = 'mood';
    }
    
    return { cardVariant, colorScheme };
  };
  
  const { cardVariant, colorScheme } = getCardConfig();
  
  // Get size configuration
  const getSizeConfig = () => {
    const sizeConfigs = {
      small: {
        padding: shadcnConfig.spacing[4],
        borderRadius: shadcnConfig.borderRadius.lg,
        minHeight: 80,
      },
      medium: {
        padding: shadcnConfig.spacing[6],
        borderRadius: shadcnConfig.borderRadius.xl,
        minHeight: 120,
      },
      large: {
        padding: shadcnConfig.spacing[8],
        borderRadius: shadcnConfig.borderRadius['2xl'],
        minHeight: 160,
      },
      responsive: {
        padding: styleUtils.getResponsiveSpacing(shadcnConfig.spacing[6], screenData),
        borderRadius: shadcnConfig.borderRadius.xl,
        minHeight: 120,
      },
    };
    
    return sizeConfigs[size] || sizeConfigs.medium;
  };
  
  const sizeConfig = getSizeConfig();
  
  // Get variant styles
  const getVariantStyles = () => {
    if (cardVariant === 'mood' && mood) {
      return styleUtils.getTherapeuticCardStyle(mood, 'elevated');
    }
    
    const baseStyle = styleUtils.getVariantStyle('card', cardVariant);
    
    // Apply therapeutic color scheme if provided
    if (colorScheme && typeof colorScheme === 'string' && cardVariant === 'therapeutic') {
      return {
        ...baseStyle,
        borderColor: colorUtils.withOpacity(colorScheme, 0.3),
        borderWidth: 1,
        borderLeftWidth: 4,
        borderLeftColor: colorScheme,
      };
    }
    
    return baseStyle;
  };
  
  const variantStyles = getVariantStyles();
  
  // Get gradient colors if gradient mode is enabled
  const getGradientColors = () => {
    if (!gradient) return null;
    
    if (therapeuticScheme) {
      return colorUtils.getTherapeuticGradient(therapeuticScheme, 0); // Very light gradient
    }
    
    if (mood) {
      const moodColor = colorUtils.getTherapeuticColor(mood);
      return [
        colorUtils.withOpacity(moodColor, 0.1),
        colorUtils.withOpacity(moodColor, 0.05),
      ];
    }
    
    return colorUtils.getTherapeuticGradient('calming', 0);
  };
  
  const gradientColors = getGradientColors();
  
  // Animation handlers
  const handlePressIn = () => {
    if (!interactive) return;
    
    setIsPressed(true);
    
    if (!isReducedMotionEnabled) {
      Animated.timing(pressAnimation, {
        toValue: 0.98,
        duration: shadcnConfig.animations.calm.duration,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handlePressOut = () => {
    if (!interactive) return;
    
    setIsPressed(false);
    
    if (!isReducedMotionEnabled) {
      Animated.timing(pressAnimation, {
        toValue: 1,
        duration: shadcnConfig.animations.calm.duration,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handlePress = () => {
    if (interactive && onPress) {
      // Gentle haptic feedback
      if (platformUtils.supportsHaptics()) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      onPress();
    }
  };
  
  const handleLongPress = () => {
    if (interactive && onLongPress) {
      if (platformUtils.supportsHaptics()) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      onLongPress();
    }
  };
  
  const handleFocus = () => {
    setIsFocused(true);
  };
  
  const handleBlur = () => {
    setIsFocused(false);
  };
  
  // Get accessibility props
  const getAccessibilityProps = () => {
    if (!interactive) return {};
    
    return accessibilityUtils.getAccessibilityProps({
      label: accessibilityLabel || 'Card',
      hint: accessibilityHint || 'Double tap to interact',
      role: 'button',
      testID: testID || 'shadcn-card',
    });
  };
  
  const accessibilityProps = getAccessibilityProps();
  
  // Build styles
  const cardContainerStyle = [
    {
      backgroundColor: gradient ? 'transparent' : variantStyles.backgroundColor,
      borderRadius: sizeConfig.borderRadius,
      borderWidth: variantStyles.borderWidth || 0,
      borderColor: variantStyles.borderColor,
      borderLeftWidth: variantStyles.borderLeftWidth,
      borderLeftColor: variantStyles.borderLeftColor,
      minHeight: sizeConfig.minHeight,
      ...platformUtils.getPlatformShadow(variantStyles),
    },
    isFocused && interactive && {
      borderWidth: shadcnConfig.accessibility.focusRingWidth,
      borderColor: shadcnConfig.accessibility.focusRingColor,
      shadowColor: shadcnConfig.accessibility.focusRingColor,
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    style,
  ];
  
  const cardContentStyle = [
    {
      padding: sizeConfig.padding,
    },
    contentStyle,
  ];
  
  const animatedStyle = {
    transform: [
      { scale: Animated.multiply(scaleAnimation, pressAnimation) },
      { translateY: translateYAnimation },
    ],
    opacity: opacityAnimation,
  };
  
  // Render card content
  const renderContent = () => (
    <View style={cardContentStyle}>
      {children}
    </View>
  );
  
  // Render card
  if (interactive) {
    const CardWrapper = gradient && gradientColors ? LinearGradient : View;
    const wrapperProps = gradient && gradientColors 
      ? {
          colors: gradientColors,
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        }
      : {};
    
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...accessibilityProps}
        {...props}
      >
        <Animated.View style={animatedStyle}>
          <CardWrapper style={cardContainerStyle} {...wrapperProps}>
            {renderContent()}
          </CardWrapper>
        </Animated.View>
      </TouchableOpacity>
    );
  }
  
  const CardWrapper = gradient && gradientColors ? LinearGradient : View;
  const wrapperProps = gradient && gradientColors 
    ? {
        colors: gradientColors,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
      }
    : {};
  
  return (
    <Animated.View style={animatedStyle}>
      <CardWrapper style={cardContainerStyle} {...wrapperProps}>
        {renderContent()}
      </CardWrapper>
    </Animated.View>
  );
};

// Card sub-components for composition
export const CardHeader = ({ children, style, ...props }) => (
  <View 
    style={[
      {
        marginBottom: shadcnConfig.spacing[4],
        borderBottomWidth: 1,
        borderBottomColor: shadcnConfig.colors.border.primary,
        paddingBottom: shadcnConfig.spacing[3],
      },
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

export const CardTitle = ({ children, style, therapeuticScheme, ...props }) => {
  const titleColor = therapeuticScheme 
    ? colorUtils.resolveColor(`therapeutic.${therapeuticScheme}.600`)
    : shadcnConfig.colors.foreground.primary;
  
  return (
    <Text 
      style={[
        {
          fontSize: shadcnConfig.typography.sizes.lg.fontSize,
          lineHeight: shadcnConfig.typography.sizes.lg.lineHeight,
          fontWeight: shadcnConfig.typography.weights.semibold,
          color: titleColor,
          marginBottom: shadcnConfig.spacing[1],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

export const CardDescription = ({ children, style, ...props }) => (
  <Text 
    style={[
      {
        fontSize: shadcnConfig.typography.sizes.sm.fontSize,
        lineHeight: shadcnConfig.typography.sizes.sm.lineHeight,
        color: shadcnConfig.colors.foreground.muted,
      },
      style,
    ]}
    {...props}
  >
    {children}
  </Text>
);

export const CardContent = ({ children, style, ...props }) => (
  <View 
    style={[
      {
        flex: 1,
      },
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

export const CardFooter = ({ children, style, ...props }) => (
  <View 
    style={[
      {
        marginTop: shadcnConfig.spacing[4],
        paddingTop: shadcnConfig.spacing[3],
        borderTopWidth: 1,
        borderTopColor: shadcnConfig.colors.border.primary,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

// Specialized card variants for mental health apps
export const MoodCard = ({ mood, children, ...props }) => (
  <ShadcnCard 
    variant="elevated" 
    mood={mood} 
    gradient
    therapeuticScheme={mood ? undefined : 'calming'}
    {...props}
  >
    {children}
  </ShadcnCard>
);

export const TherapeuticCard = ({ scheme = 'calming', children, ...props }) => (
  <ShadcnCard 
    variant="elevated" 
    therapeuticScheme={scheme}
    gradient
    {...props}
  >
    {children}
  </ShadcnCard>
);

export const InteractiveCard = ({ children, ...props }) => (
  <ShadcnCard 
    variant="elevated" 
    interactive
    {...props}
  >
    {children}
  </ShadcnCard>
);

export const WellnessCard = ({ children, ...props }) => (
  <ShadcnCard 
    variant="elevated" 
    therapeuticScheme="nurturing"
    gradient
    size="large"
    {...props}
  >
    {children}
  </ShadcnCard>
);

export const ProgressCard = ({ children, ...props }) => (
  <ShadcnCard 
    variant="elevated" 
    therapeuticScheme="peaceful"
    size="medium"
    {...props}
  >
    {children}
  </ShadcnCard>
);

export const InsightCard = ({ children, ...props }) => (
  <ShadcnCard 
    variant="elevated" 
    therapeuticScheme="grounding"
    gradient
    interactive
    {...props}
  >
    {children}
  </ShadcnCard>
);

// PropTypes
ShadcnCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'elevated', 'therapeutic', 'mood']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'responsive']),
  interactive: PropTypes.bool,
  therapeuticScheme: PropTypes.oneOf(['calming', 'nurturing', 'peaceful', 'grounding', 'energizing']),
  mood: PropTypes.string,
  gradient: PropTypes.bool,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  animateOnMount: PropTypes.bool,
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  testID: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  therapeuticScheme: PropTypes.oneOf(['calming', 'nurturing', 'peaceful', 'grounding', 'energizing']),
};

CardDescription.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default ShadcnCard;