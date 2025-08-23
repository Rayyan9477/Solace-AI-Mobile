import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { WebSafeLinearGradient as LinearGradient } from '../common/WebSafeLinearGradient';
import AdvancedShadersContainer from '../advanced/AdvancedShadersContainer';
import { useTheme } from '../../shared/theme/ThemeContext';
import {
  modernDarkColors,
  modernTypography,
  modernSpacing,
  modernBorderRadius,
  modernShadows,
  modernAnimations,
} from '../../shared/theme/darkTheme';

// Modern Card with advanced glassmorphism and neumorphism effects
// Features sophisticated dark theme integration and premium interactions
const ModernCard = ({
  children,
  title,
  subtitle,
  description,
  variant = 'glass', // 'glass', 'neon', 'void', 'neural', 'holographic', 'minimal'
  elevation = 'medium', // 'low', 'medium', 'high', 'floating'
  interactive = false,
  animated = true,
  glowEffect = false,
  morphEffect = false,
  shaderVariant,
  onPress,
  style,
  contentStyle,
  headerStyle,
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const morphAnim = useRef(new Animated.Value(0)).current;
  const elevationAnim = useRef(new Animated.Value(0)).current;

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

      // Continuous glow effect
      if (glowEffect) {
        const glowLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: modernAnimations.timing.slower,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0.3,
              duration: modernAnimations.timing.slower,
              useNativeDriver: true,
            }),
          ])
        );
        glowLoop.start();
        return () => glowLoop.stop();
      }

      // Morphing effect
      if (morphEffect) {
        const morphLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(morphAnim, {
              toValue: 1,
              duration: modernAnimations.timing.slowest,
              useNativeDriver: true,
            }),
            Animated.timing(morphAnim, {
              toValue: 0,
              duration: modernAnimations.timing.slowest,
              useNativeDriver: true,
            }),
          ])
        );
        morphLoop.start();
        return () => morphLoop.stop();
      }
    } else {
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
    }
  }, [animated, fadeAnim, scaleAnim, glowAnim, morphAnim, glowEffect, morphEffect]);

  // Interaction handlers
  const handlePressIn = () => {
    if (interactive || onPress) {
      setIsPressed(true);
      Animated.parallel([
        Animated.spring(pressAnim, {
          toValue: 0.97,
          ...modernAnimations.spring.stiff,
          useNativeDriver: true,
        }),
        Animated.timing(elevationAnim, {
          toValue: 1,
          duration: modernAnimations.timing.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (interactive || onPress) {
      setIsPressed(false);
      Animated.parallel([
        Animated.spring(pressAnim, {
          toValue: 1,
          ...modernAnimations.spring.stiff,
          useNativeDriver: true,
        }),
        Animated.timing(elevationAnim, {
          toValue: 0,
          duration: modernAnimations.timing.normal,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  // Get variant-specific styling
  const getVariantStyles = () => {
    const base = modernDarkColors;
    
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: base.glass.heavy,
          borderColor: base.border.glass,
          shadowColor: base.shadows.depth.md,
          glowColor: base.shadows.glow.primary,
          textColor: base.text.primary,
          backdropFilter: true,
        };
      
      case 'neon':
        return {
          backgroundColor: base.background.surface + '40',
          borderColor: base.accent.primary + '80',
          shadowColor: base.shadows.glow.primary,
          glowColor: base.accent.primary,
          textColor: base.text.primary,
          backdropFilter: false,
        };
      
      case 'void':
        return {
          backgroundColor: base.background.primary + 'E6',
          borderColor: base.border.primary,
          shadowColor: base.shadows.depth.xl,
          glowColor: base.text.tertiary,
          textColor: base.text.secondary,
          backdropFilter: false,
        };
      
      case 'neural':
        return {
          backgroundColor: base.therapeutic.calming[900] + '90',
          borderColor: base.therapeutic.calming.primary + '40',
          shadowColor: base.therapeutic.calming.glow,
          glowColor: base.therapeutic.calming.primary,
          textColor: base.text.primary,
          backdropFilter: true,
        };
      
      case 'holographic':
        return {
          backgroundColor: base.glass.medium,
          borderColor: base.accent.tertiary + '60',
          shadowColor: base.shadows.glow.success,
          glowColor: base.accent.tertiary,
          textColor: base.text.primary,
          backdropFilter: true,
        };
      
      case 'minimal':
        return {
          backgroundColor: base.background.secondary,
          borderColor: base.border.secondary,
          shadowColor: base.shadows.depth.sm,
          glowColor: base.text.quaternary,
          textColor: base.text.primary,
          backdropFilter: false,
        };
      
      default:
        return {
          backgroundColor: base.glass.light,
          borderColor: base.border.glass,
          shadowColor: base.shadows.depth.md,
          glowColor: base.shadows.glow.primary,
          textColor: base.text.primary,
          backdropFilter: true,
        };
    }
  };

  // Get elevation styling
  const getElevationStyles = () => {
    switch (elevation) {
      case 'low':
        return modernShadows.sm;
      case 'high':
        return modernShadows.lg;
      case 'floating':
        return modernShadows.xl;
      default: // medium
        return modernShadows.md;
    }
  };

  const variantStyles = getVariantStyles();
  const elevationStyles = getElevationStyles();
  const ComponentWrapper = interactive || onPress ? TouchableOpacity : View;

  // Determine shader variant based on card variant
  const getShaderVariant = () => {
    if (shaderVariant) return shaderVariant;
    
    switch (variant) {
      case 'neon': return 'neon';
      case 'void': return 'void';
      case 'neural': return 'neural';
      case 'holographic': return 'holographic';
      case 'glass': return 'aurora';
      default: return 'quantum';
    }
  };

  return (
    <AdvancedShadersContainer
      variant={getShaderVariant()}
      intensity={variant === 'minimal' ? 0.1 : 0.4}
      animated={animated}
      interactive={interactive}
      glowEffect={glowEffect}
      style={[styles.shaderWrapper, style]}
    >
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { scale: pressAnim },
            ],
          },
        ]}
      >
        <ComponentWrapper
          style={[styles.touchableContainer]}
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.95}
          disabled={!onPress && !interactive}
          accessible={!!onPress}
          accessibilityRole={onPress ? "button" : "group"}
          testID={testID}
          {...props}
        >
          <LinearGradient
            colors={[
              variantStyles.backgroundColor,
              variantStyles.backgroundColor + 'CC',
            ]}
            style={[
              styles.cardGradient,
              elevationStyles,
              {
                borderColor: variantStyles.borderColor,
                shadowColor: variantStyles.shadowColor,
              },
              variantStyles.backdropFilter && styles.backdropFilter,
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
                  },
                ]}
              />
            )}

            {/* Header section */}
            {(title || subtitle) && (
              <View style={[styles.header, headerStyle]}>
                {title && (
                  <Text
                    style={[
                      styles.title,
                      {
                        color: variantStyles.textColor,
                        fontFamily: modernTypography.fontFamily.display,
                      },
                    ]}
                  >
                    {title}
                  </Text>
                )}
                {subtitle && (
                  <Text
                    style={[
                      styles.subtitle,
                      {
                        color: modernDarkColors.text.secondary,
                        fontFamily: modernTypography.fontFamily.sans,
                      },
                    ]}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
            )}

            {/* Description */}
            {description && (
              <Text
                style={[
                  styles.description,
                  {
                    color: modernDarkColors.text.tertiary,
                    fontFamily: modernTypography.fontFamily.sans,
                  },
                ]}
              >
                {description}
              </Text>
            )}

            {/* Content section */}
            <View style={[styles.content, contentStyle]}>
              {children}
            </View>

            {/* Interactive border glow */}
            {(interactive || onPress) && (
              <Animated.View
                style={[
                  styles.interactiveBorder,
                  {
                    opacity: elevationAnim,
                    borderColor: variantStyles.glowColor,
                  },
                ]}
              />
            )}
          </LinearGradient>
        </ComponentWrapper>
      </Animated.View>
    </AdvancedShadersContainer>
  );
};

const styles = StyleSheet.create({
  shaderWrapper: {
    marginVertical: modernSpacing[3],
    marginHorizontal: modernSpacing[1],
  },
  cardContainer: {
    borderRadius: modernBorderRadius.xl,
  },
  touchableContainer: {
    borderRadius: modernBorderRadius.xl,
  },
  cardGradient: {
    borderRadius: modernBorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 60,
  },
  backdropFilter: {
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
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: modernBorderRadius.xl,
    zIndex: 1,
  },
  header: {
    paddingHorizontal: modernSpacing[6],
    paddingTop: modernSpacing[6],
    paddingBottom: modernSpacing[4],
    zIndex: 2,
  },
  title: {
    fontSize: modernTypography.sizes['2xl'],
    fontWeight: modernTypography.weights.bold,
    lineHeight: modernTypography.lineHeights['2xl'],
    letterSpacing: modernTypography.letterSpacing.tight,
    marginBottom: modernSpacing[2],
  },
  subtitle: {
    fontSize: modernTypography.sizes.base,
    fontWeight: modernTypography.weights.medium,
    lineHeight: modernTypography.lineHeights.base,
    opacity: 0.8,
  },
  description: {
    fontSize: modernTypography.sizes.sm,
    fontWeight: modernTypography.weights.normal,
    lineHeight: modernTypography.lineHeights.sm,
    paddingHorizontal: modernSpacing[6],
    paddingBottom: modernSpacing[4],
    opacity: 0.7,
    zIndex: 2,
  },
  content: {
    paddingHorizontal: modernSpacing[6],
    paddingBottom: modernSpacing[6],
    zIndex: 2,
  },
  interactiveBorder: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: modernBorderRadius.xl + 1,
    borderWidth: 2,
    zIndex: 3,
    pointerEvents: 'none',
  },
});

export default ModernCard;