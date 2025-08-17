/**
 * Solace AI Mobile - shadcn UI Button Component
 * 
 * A comprehensive button component following shadcn UI patterns,
 * optimized for mental health applications with therapeutic design principles.
 * 
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, destructive)
 * - Therapeutic color schemes for mental wellness
 * - Accessibility-first design with WCAG 2.1 compliance
 * - Smooth animations and haptic feedback
 * - Mobile-optimized touch targets
 * - Loading states and disabled handling
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  ActivityIndicator,
  Platform,
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
import { useTheme } from '../../shared/theme/ThemeContext';

const ShadcnButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  therapeuticScheme,
  mood,
  onPress,
  onLongPress,
  icon,
  iconPosition = 'left',
  gradient = false,
  hapticFeedback = true,
  animationConfig = {},
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  textStyle,
  ...props
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Animation refs
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  
  // Get button configuration
  const getButtonConfig = () => {
    let buttonVariant = variant;
    let colorScheme = null;
    
    // Apply therapeutic scheme if provided
    if (therapeuticScheme) {
      colorScheme = therapeuticScheme;
      buttonVariant = 'therapeutic';
    }
    
    // Apply mood-based coloring if provided
    if (mood) {
      colorScheme = colorUtils.getTherapeuticColor(mood);
    }
    
    return { buttonVariant, colorScheme };
  };
  
  const { buttonVariant, colorScheme } = getButtonConfig();
  
  // Get size configuration
  const getSizeConfig = () => {
    const sizeConfigs = {
      small: {
        paddingVertical: shadcnConfig.spacing[2],
        paddingHorizontal: shadcnConfig.spacing[4],
        borderRadius: shadcnConfig.borderRadius.md,
        fontSize: shadcnConfig.typography.sizes.sm.fontSize,
        lineHeight: shadcnConfig.typography.sizes.sm.lineHeight,
        iconSize: 16,
      },
      medium: {
        paddingVertical: shadcnConfig.spacing[3],
        paddingHorizontal: shadcnConfig.spacing[6],
        borderRadius: shadcnConfig.borderRadius.lg,
        fontSize: shadcnConfig.typography.sizes.base.fontSize,
        lineHeight: shadcnConfig.typography.sizes.base.lineHeight,
        iconSize: 20,
      },
      large: {
        paddingVertical: shadcnConfig.spacing[4],
        paddingHorizontal: shadcnConfig.spacing[8],
        borderRadius: shadcnConfig.borderRadius.xl,
        fontSize: shadcnConfig.typography.sizes.lg.fontSize,
        lineHeight: shadcnConfig.typography.sizes.lg.lineHeight,
        iconSize: 24,
      },
    };
    
    return sizeConfigs[size] || sizeConfigs.medium;
  };
  
  const sizeConfig = getSizeConfig();
  
  // Get variant styles
  const getVariantStyles = () => {
    const baseStyle = styleUtils.getVariantStyle('button', buttonVariant);
    
    // Apply therapeutic color scheme if provided
    if (colorScheme && typeof colorScheme === 'string') {
      return {
        ...baseStyle,
        backgroundColor: colorScheme,
        borderColor: colorScheme,
      };
    }
    
    return baseStyle;
  };
  
  const variantStyles = getVariantStyles();
  
  // Get gradient colors if gradient mode is enabled
  const getGradientColors = () => {
    if (!gradient) return null;
    
    if (therapeuticScheme) {
      return colorUtils.getTherapeuticGradient(therapeuticScheme, 2);
    }
    
    if (mood) {
      const moodColor = colorUtils.getTherapeuticColor(mood);
      return [moodColor, colorUtils.withOpacity(moodColor, 0.8)];
    }
    
    return colorUtils.getTherapeuticGradient('calming', 2);
  };
  
  const gradientColors = getGradientColors();
  
  // Animation handlers
  const handlePressIn = () => {
    setIsPressed(true);
    
    if (!isReducedMotionEnabled && !disabled && !loading) {
      const animations = [];
      
      // Scale animation
      animations.push(
        Animated.timing(scaleAnimation, {
          toValue: 0.96,
          duration: animationConfig.duration || shadcnConfig.animations.calm.duration,
          useNativeDriver: true,
        })
      );
      
      // Opacity animation for certain variants
      if (variant === 'ghost' || variant === 'outline') {
        animations.push(
          Animated.timing(opacityAnimation, {
            toValue: 0.7,
            duration: animationConfig.duration || shadcnConfig.animations.calm.duration,
            useNativeDriver: true,
          })
        );
      }
      
      Animated.parallel(animations).start();
    }
  };
  
  const handlePressOut = () => {
    setIsPressed(false);
    
    if (!isReducedMotionEnabled) {
      const animations = [];
      
      animations.push(
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: animationConfig.duration || shadcnConfig.animations.calm.duration,
          useNativeDriver: true,
        })
      );
      
      animations.push(
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: animationConfig.duration || shadcnConfig.animations.calm.duration,
          useNativeDriver: true,
        })
      );
      
      Animated.parallel(animations).start();
    }
  };
  
  const handlePress = () => {
    if (!disabled && !loading) {
      // Haptic feedback
      if (hapticFeedback && platformUtils.supportsHaptics()) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      onPress?.();
    }
  };
  
  const handleLongPress = () => {
    if (!disabled && !loading) {
      // Stronger haptic for long press
      if (hapticFeedback && platformUtils.supportsHaptics()) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      
      onLongPress?.();
    }
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    
    if (!isReducedMotionEnabled) {
      animationUtils.createTherapeuticFocus(glowAnimation).start();
    }
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    
    Animated.timing(glowAnimation, {
      toValue: 0,
      duration: shadcnConfig.animations.focus.duration,
      useNativeDriver: false,
    }).start();
  };
  
  // Get accessibility props
  const accessibilityProps = accessibilityUtils.getAccessibilityProps({
    label: accessibilityLabel || (typeof children === 'string' ? children : 'Button'),
    hint: accessibilityHint || 'Double tap to activate',
    role: 'button',
    state: {
      disabled,
      busy: loading,
    },
    testID: testID || 'shadcn-button',
  });
  
  // Ensure minimum touch target
  const { style: touchTargetStyle, hitSlop } = accessibilityUtils.ensureMinimumTouchTarget(sizeConfig);
  
  // Build button content
  const renderContent = () => {
    const contentElements = [];
    
    // Add icon (left position)
    if (icon && iconPosition === 'left' && !loading) {
      contentElements.push(
        <View key="left-icon" style={{ marginRight: shadcnConfig.spacing[2] }}>
          {React.cloneElement(icon, { size: sizeConfig.iconSize })}
        </View>
      );
    }
    
    // Add loading indicator or text
    if (loading) {
      contentElements.push(
        <View key="loading" style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator 
            size="small" 
            color={variantStyles.color || shadcnConfig.colors.foreground.inverse}
            style={{ marginRight: shadcnConfig.spacing[2] }}
          />
          <Text style={[buttonTextStyles, textStyle]}>
            Loading...
          </Text>
        </View>
      );
    } else {
      // Add text content
      if (typeof children === 'string') {
        contentElements.push(
          <Text key="text" style={[buttonTextStyles, textStyle]}>
            {children}
          </Text>
        );
      } else {
        contentElements.push(
          <View key="content" style={{ alignItems: 'center' }}>
            {children}
          </View>
        );
      }
    }
    
    // Add icon (right position)
    if (icon && iconPosition === 'right' && !loading) {
      contentElements.push(
        <View key="right-icon" style={{ marginLeft: shadcnConfig.spacing[2] }}>
          {React.cloneElement(icon, { size: sizeConfig.iconSize })}
        </View>
      );
    }
    
    return contentElements;
  };
  
  // Build styles
  const buttonTextStyles = {
    fontSize: sizeConfig.fontSize,
    lineHeight: sizeConfig.lineHeight,
    fontWeight: shadcnConfig.typography.weights.medium,
    color: variantStyles.color || shadcnConfig.colors.foreground.inverse,
    textAlign: 'center',
  };
  
  const buttonContainerStyle = [
    {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: sizeConfig.paddingVertical,
      paddingHorizontal: sizeConfig.paddingHorizontal,
      borderRadius: sizeConfig.borderRadius,
      borderWidth: variantStyles.borderWidth || 0,
      borderColor: variantStyles.borderColor,
      backgroundColor: gradient ? 'transparent' : variantStyles.backgroundColor,
      ...platformUtils.getPlatformShadow(variantStyles),
    },
    fullWidth && { width: '100%' },
    disabled && {
      opacity: 0.5,
    },
    isFocused && {
      borderWidth: shadcnConfig.accessibility.focusRingWidth,
      borderColor: shadcnConfig.accessibility.focusRingColor,
      shadowColor: shadcnConfig.accessibility.focusRingColor,
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    touchTargetStyle,
    style,
  ];
  
  const animatedStyle = {
    transform: [{ scale: scaleAnimation }],
    opacity: opacityAnimation,
  };
  
  // Render button
  if (gradient && gradientColors) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        onLongPress={handleLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled || loading}
        hitSlop={hitSlop}
        {...accessibilityProps}
        {...props}
      >
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={buttonContainerStyle}
          >
            {renderContent()}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      onLongPress={handleLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled || loading}
      hitSlop={hitSlop}
      {...accessibilityProps}
      {...props}
    >
      <Animated.View style={[buttonContainerStyle, animatedStyle]}>
        {renderContent()}
      </Animated.View>
    </TouchableOpacity>
  );
};

// PropTypes
ShadcnButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'destructive']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  therapeuticScheme: PropTypes.oneOf(['calming', 'nurturing', 'peaceful', 'grounding', 'energizing']),
  mood: PropTypes.string,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  gradient: PropTypes.bool,
  hapticFeedback: PropTypes.bool,
  animationConfig: PropTypes.object,
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  testID: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

// Button variant components for easy usage
export const PrimaryButton = (props) => (
  <ShadcnButton variant="primary" {...props} />
);

export const SecondaryButton = (props) => (
  <ShadcnButton variant="secondary" {...props} />
);

export const OutlineButton = (props) => (
  <ShadcnButton variant="outline" {...props} />
);

export const GhostButton = (props) => (
  <ShadcnButton variant="ghost" {...props} />
);

export const DestructiveButton = (props) => (
  <ShadcnButton variant="destructive" {...props} />
);

// Therapeutic button variants
export const CalmingButton = (props) => (
  <ShadcnButton variant="primary" therapeuticScheme="calming" gradient {...props} />
);

export const NurturingButton = (props) => (
  <ShadcnButton variant="primary" therapeuticScheme="nurturing" gradient {...props} />
);

export const PeacefulButton = (props) => (
  <ShadcnButton variant="primary" therapeuticScheme="peaceful" gradient {...props} />
);

export const GroundingButton = (props) => (
  <ShadcnButton variant="primary" therapeuticScheme="grounding" gradient {...props} />
);

export const EnergizingButton = (props) => (
  <ShadcnButton variant="primary" therapeuticScheme="energizing" gradient {...props} />
);

// Mood-based button
export const MoodButton = ({ mood, ...props }) => (
  <ShadcnButton variant="primary" mood={mood} gradient {...props} />
);

export default ShadcnButton;