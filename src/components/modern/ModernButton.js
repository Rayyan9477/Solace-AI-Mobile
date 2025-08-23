import React, { useRef, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
  Platform,
} from 'react-native';
import { WebSafeLinearGradient as LinearGradient } from '../common/WebSafeLinearGradient';
import AdvancedShadersContainer from '../advanced/AdvancedShadersContainer';
import { useTheme } from '../../shared/theme/ThemeContext';
import { MentalHealthIcon, ActionIcon } from '../icons';
import {
  modernDarkColors,
  modernTypography,
  modernSpacing,
  modernBorderRadius,
  modernShadows,
  modernAnimations,
} from '../../shared/theme/darkTheme';

// Modern Button with advanced visual effects and premium interactions
// Features sophisticated dark theme, micro-animations, and shader effects
const ModernButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary', 'ghost', 'glass', 'neon', 'void', 'neural', 'outline'
  size = 'medium', // 'small', 'medium', 'large', 'xl'
  loading = false,
  disabled = false,
  animated = true,
  icon,
  iconPosition = 'left', // 'left', 'right', 'only'
  shaderEffect = false,
  glowEffect = false,
  morphEffect = false,
  fullWidth = false,
  hapticFeedback = true,
  style,
  textStyle,
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  
  // Animation refs
  const pressAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const loadingRotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const morphAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      // Sophisticated entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: modernAnimations.timing.slow,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          ...modernAnimations.spring.gentle,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous glow effect for premium variants
      if (glowEffect && (variant === 'primary' || variant === 'neon')) {
        const glowLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: modernAnimations.timing.slower,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.4,
              duration: modernAnimations.timing.slower,
              useNativeDriver: true,
            }),
          ])
        );
        glowLoop.start();
        return () => glowLoop.stop();
      }

      // Subtle pulse for interactive feedback
      if (variant === 'primary' && !disabled && !loading) {
        const pulseLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.02,
              duration: modernAnimations.timing.slowest,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: modernAnimations.timing.slowest,
              useNativeDriver: true,
            }),
          ])
        );
        pulseLoop.start();
        return () => pulseLoop.stop();
      }
    } else {
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
    }
  }, [animated, variant, disabled, loading, glowEffect, fadeAnim, scaleAnim, glowAnim, pulseAnim]);

  useEffect(() => {
    if (loading) {
      const rotateAnimation = Animated.loop(
        Animated.timing(loadingRotateAnim, {
          toValue: 1,
          duration: modernAnimations.timing.slowest,
          useNativeDriver: true,
        })
      );
      rotateAnimation.start();
      return () => rotateAnimation.stop();
    }
  }, [loading, loadingRotateAnim]);

  useEffect(() => {
    if (morphEffect && animated) {
      const morphLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(morphAnim, {
            toValue: 1,
            duration: modernAnimations.timing.slowest * 2,
            useNativeDriver: true,
          }),
          Animated.timing(morphAnim, {
            toValue: 0,
            duration: modernAnimations.timing.slowest * 2,
            useNativeDriver: true,
          }),
        ])
      );
      morphLoop.start();
      return () => morphLoop.stop();
    }
  }, [morphEffect, animated, morphAnim]);

  // Interaction handlers with premium feedback
  const handlePressIn = () => {
    if (!disabled && !loading) {
      setIsPressed(true);
      
      // Haptic feedback (iOS/Android)
      if (hapticFeedback && Platform.OS !== 'web') {
        // Implement haptic feedback here
        // HapticFeedback.impactAsync(HapticFeedback.ImpactFeedbackStyle.Medium);
      }

      Animated.spring(pressAnim, {
        toValue: 0.96,
        ...modernAnimations.spring.stiff,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      setIsPressed(false);
      Animated.spring(pressAnim, {
        toValue: 1,
        ...modernAnimations.spring.gentle,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  // Get variant-specific styling
  const getVariantStyles = () => {
    const base = modernDarkColors;
    const isDisabled = disabled || loading;
    const opacity = isDisabled ? 0.5 : 1;

    switch (variant) {
      case 'primary':
        return {
          gradientColors: [base.accent.primary, base.accent.secondary],
          textColor: base.text.inverse,
          borderColor: base.accent.primary,
          shadowColor: base.shadows.glow.primary,
          glowColor: base.accent.primary,
          opacity,
        };

      case 'ghost':
        return {
          gradientColors: ['transparent', 'transparent'],
          textColor: base.text.primary,
          borderColor: 'transparent',
          shadowColor: 'transparent',
          glowColor: base.text.primary,
          opacity,
        };

      case 'glass':
        return {
          gradientColors: [base.glass.heavy, base.glass.medium],
          textColor: base.text.primary,
          borderColor: base.border.glass,
          shadowColor: base.shadows.depth.md,
          glowColor: base.text.accent,
          opacity,
        };

      case 'neon':
        return {
          gradientColors: [base.background.surface + '80', base.background.tertiary + '60'],
          textColor: base.accent.primary,
          borderColor: base.accent.primary,
          shadowColor: base.shadows.glow.primary,
          glowColor: base.accent.primary,
          opacity,
        };

      case 'void':
        return {
          gradientColors: [base.background.primary, base.background.secondary],
          textColor: base.text.secondary,
          borderColor: base.border.primary,
          shadowColor: base.shadows.depth.lg,
          glowColor: base.text.tertiary,
          opacity,
        };

      case 'neural':
        return {
          gradientColors: [
            base.therapeutic.calming.primary + '20',
            base.therapeutic.peaceful.primary + '20',
          ],
          textColor: base.therapeutic.calming.primary,
          borderColor: base.therapeutic.calming.primary + '60',
          shadowColor: base.therapeutic.calming.glow,
          glowColor: base.therapeutic.calming.primary,
          opacity,
        };

      case 'outline':
        return {
          gradientColors: ['transparent', 'transparent'],
          textColor: base.accent.primary,
          borderColor: base.accent.primary,
          shadowColor: base.shadows.depth.sm,
          glowColor: base.accent.primary,
          opacity,
        };

      default:
        return {
          gradientColors: [base.background.surface, base.background.elevated],
          textColor: base.text.primary,
          borderColor: base.border.primary,
          shadowColor: base.shadows.depth.md,
          glowColor: base.text.accent,
          opacity,
        };
    }
  };

  // Get size-specific styling
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: modernSpacing[4],
          paddingVertical: modernSpacing[2],
          borderRadius: modernBorderRadius.md,
          fontSize: modernTypography.sizes.sm,
          iconSize: 16,
          minHeight: 36,
        };

      case 'large':
        return {
          paddingHorizontal: modernSpacing[8],
          paddingVertical: modernSpacing[4],
          borderRadius: modernBorderRadius.xl,
          fontSize: modernTypography.sizes.lg,
          iconSize: 24,
          minHeight: 56,
        };

      case 'xl':
        return {
          paddingHorizontal: modernSpacing[10],
          paddingVertical: modernSpacing[6],
          borderRadius: modernBorderRadius['2xl'],
          fontSize: modernTypography.sizes.xl,
          iconSize: 28,
          minHeight: 64,
        };

      default: // medium
        return {
          paddingHorizontal: modernSpacing[6],
          paddingVertical: modernSpacing[3],
          borderRadius: modernBorderRadius.lg,
          fontSize: modernTypography.sizes.base,
          iconSize: 20,
          minHeight: 48,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const loadingRotation = loadingRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Get shader variant based on button variant
  const getShaderVariant = () => {
    switch (variant) {
      case 'neon': return 'neon';
      case 'void': return 'void';
      case 'neural': return 'neural';
      case 'glass': return 'holographic';
      default: return 'quantum';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Animated.Text
            style={[
              styles.loadingText,
              {
                color: variantStyles.textColor,
                fontSize: sizeStyles.fontSize,
                transform: [{ rotate: loadingRotation }],
              },
            ]}
          >
            ⟳
          </Animated.Text>
        </View>
      );
    }

    if (iconPosition === 'only' && icon) {
      return (
        <View style={styles.iconOnlyContainer}>
          {typeof icon === 'string' ? (
            <MentalHealthIcon
              name={icon}
              size={sizeStyles.iconSize}
              color={variantStyles.textColor}
              variant="outline"
            />
          ) : (
            icon
          )}
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconLeft}>
            {typeof icon === 'string' ? (
              <MentalHealthIcon
                name={icon}
                size={sizeStyles.iconSize}
                color={variantStyles.textColor}
                variant="outline"
              />
            ) : (
              icon
            )}
          </View>
        )}
        
        <Text
          style={[
            styles.buttonText,
            {
              fontSize: sizeStyles.fontSize,
              color: variantStyles.textColor,
              fontFamily: modernTypography.fontFamily.sans,
              fontWeight: modernTypography.weights.semiBold,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
        
        {icon && iconPosition === 'right' && (
          <View style={styles.iconRight}>
            {typeof icon === 'string' ? (
              <MentalHealthIcon
                name={icon}
                size={sizeStyles.iconSize}
                color={variantStyles.textColor}
                variant="outline"
              />
            ) : (
              icon
            )}
          </View>
        )}
      </View>
    );
  };

  const ButtonComponent = () => (
    <Animated.View
      style={[
        styles.buttonContainer,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { scale: pressAnim },
            { scale: pulseAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: fullWidth ? '100%' : undefined,
          },
          style,
        ]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        accessible
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading }}
        testID={testID}
        {...props}
      >
        <LinearGradient
          colors={variantStyles.gradientColors}
          style={[
            styles.buttonGradient,
            {
              paddingHorizontal: sizeStyles.paddingHorizontal,
              paddingVertical: sizeStyles.paddingVertical,
              borderRadius: sizeStyles.borderRadius,
              borderColor: variantStyles.borderColor,
              minHeight: sizeStyles.minHeight,
              opacity: variantStyles.opacity,
            },
            variant === 'glass' && styles.glassEffect,
            variant === 'outline' && styles.outlineEffect,
            modernShadows.md,
          ]}
        >
          {/* Glow effect overlay */}
          {glowEffect && (
            <Animated.View
              style={[
                styles.glowOverlay,
                {
                  opacity: glowAnim,
                  backgroundColor: variantStyles.glowColor + '20',
                  borderRadius: sizeStyles.borderRadius,
                },
              ]}
            />
          )}

          {/* Button content */}
          <View style={styles.buttonContent}>
            {renderContent()}
          </View>

          {/* Interactive border glow */}
          {(variant === 'neon' || variant === 'neural') && (
            <Animated.View
              style={[
                styles.interactiveBorder,
                {
                  opacity: isPressed ? 0.8 : 0.3,
                  borderColor: variantStyles.glowColor,
                  borderRadius: sizeStyles.borderRadius,
                },
              ]}
            />
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  if (shaderEffect) {
    return (
      <AdvancedShadersContainer
        variant={getShaderVariant()}
        intensity={0.3}
        animated={animated}
        interactive={false}
        glowEffect={glowEffect}
        morphEffect={morphEffect}
        style={styles.shaderWrapper}
      >
        <ButtonComponent />
      </AdvancedShadersContainer>
    );
  }

  return <ButtonComponent />;
};

const styles = StyleSheet.create({
  shaderWrapper: {
    borderRadius: modernBorderRadius.lg,
    marginVertical: modernSpacing[2],
  },
  buttonContainer: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  button: {
    borderRadius: modernBorderRadius.lg,
  },
  buttonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  glassEffect: {
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      },
      default: {
        backgroundColor: modernDarkColors.glass.heavy,
      },
    }),
  },
  outlineEffect: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonContent: {
    zIndex: 2,
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  interactiveBorder: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderWidth: 2,
    zIndex: 3,
    pointerEvents: 'none',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconOnlyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: modernSpacing[2],
  },
  iconRight: {
    marginLeft: modernSpacing[2],
  },
  buttonText: {
    textAlign: 'center',
    letterSpacing: modernTypography.letterSpacing.wide,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontWeight: modernTypography.weights.bold,
  },
});

export default ModernButton;