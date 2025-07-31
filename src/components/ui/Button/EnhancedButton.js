import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Animated, 
  View,
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../contexts/ThemeContext';
import { BaseDesignTokens } from '../../../design-system/DesignTokens';

const EnhancedButton = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  theme: buttonTheme = 'default',
  disabled = false,
  loading = false,
  fullWidth = false,
  withHaptics = true,
  withGradient = false,
  gradientColors,
  icon,
  iconPosition = 'left',
  animationType = 'scale',
  animationDuration = 200,
  shadowLevel = 'sm',
  borderRadius,
  children,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
  onPressIn,
  onPressOut,
  hapticType = 'medium',
  therapeuticTheme,
}) => {
  const { theme, isDarkMode, isReducedMotionEnabled } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for therapeutic buttons
  useEffect(() => {
    if (therapeuticTheme && !disabled && !loading) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [therapeuticTheme, disabled, loading, pulseAnim]);

  const handlePressIn = () => {
    if (!isReducedMotionEnabled && !disabled && !loading) {
      switch (animationType) {
        case 'scale':
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: animationDuration,
            useNativeDriver: true,
          }).start();
          break;
        case 'opacity':
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: animationDuration,
            useNativeDriver: true,
          }).start();
          break;
      }
    }
    onPressIn?.();
  };

  const handlePressOut = () => {
    if (!isReducedMotionEnabled && !disabled && !loading) {
      switch (animationType) {
        case 'scale':
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
          }).start();
          break;
        case 'opacity':
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
          }).start();
          break;
      }
    }
    onPressOut?.();
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      if (withHaptics) {
        const hapticMap = {
          light: Haptics.ImpactFeedbackStyle.Light,
          medium: Haptics.ImpactFeedbackStyle.Medium,
          heavy: Haptics.ImpactFeedbackStyle.Heavy,
        };
        Haptics.impactAsync(hapticMap[hapticType]);
      }
      onPress?.();
    }
  };

  const getVariantStyles = () => {
    const tokens = BaseDesignTokens;
    
    // Therapeutic theme overrides
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return {
        backgroundColor: therapeuticColors?.[500] || tokens.colors.primary[500],
        borderColor: therapeuticColors?.[600] || tokens.colors.primary[600],
        borderWidth: 0,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: tokens.colors.primary[500],
          borderColor: tokens.colors.primary[600],
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: tokens.colors.secondary[100],
          borderColor: tokens.colors.secondary[300],
          borderWidth: 1,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: tokens.colors.primary[500],
          borderWidth: 2,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
        };
      case 'therapeutic':
        return {
          backgroundColor: tokens.colors.therapeutic.calming[500],
          borderColor: tokens.colors.therapeutic.calming[600],
          borderWidth: 0,
        };
      case 'success':
        return {
          backgroundColor: tokens.colors.success[500],
          borderColor: tokens.colors.success[600],
          borderWidth: 0,
        };
      case 'warning':
        return {
          backgroundColor: tokens.colors.warning[500],
          borderColor: tokens.colors.warning[600],
          borderWidth: 0,
        };
      case 'error':
        return {
          backgroundColor: tokens.colors.error[500],
          borderColor: tokens.colors.error[600],
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: tokens.colors.primary[500],
          borderColor: tokens.colors.primary[600],
          borderWidth: 0,
        };
    }
  };

  const getTextColor = () => {
    const tokens = BaseDesignTokens;
    
    if (therapeuticTheme) {
      return '#FFFFFF';
    }

    switch (variant) {
      case 'primary':
      case 'therapeutic':
      case 'success':
      case 'warning':
      case 'error':
        return '#FFFFFF';
      case 'secondary':
        return tokens.colors.secondary[700];
      case 'outline':
        return tokens.colors.primary[600];
      case 'ghost':
        return tokens.colors.primary[600];
      default:
        return '#FFFFFF';
    }
  };

  const getSizeStyles = () => {
    const tokens = BaseDesignTokens;
    
    switch (size) {
      case 'xs':
        return {
          paddingVertical: tokens.spacing[2],
          paddingHorizontal: tokens.spacing[3],
          minHeight: 32,
          borderRadius: borderRadius || tokens.borderRadius.sm,
        };
      case 'sm':
        return {
          paddingVertical: tokens.spacing[2.5],
          paddingHorizontal: tokens.spacing[4],
          minHeight: 36,
          borderRadius: borderRadius || tokens.borderRadius.base,
        };
      case 'md':
      case 'medium':
        return {
          paddingVertical: tokens.spacing[3],
          paddingHorizontal: tokens.spacing[6],
          minHeight: 44,
          borderRadius: borderRadius || tokens.borderRadius.lg,
        };
      case 'lg':
        return {
          paddingVertical: tokens.spacing[4],
          paddingHorizontal: tokens.spacing[8],
          minHeight: 48,
          borderRadius: borderRadius || tokens.borderRadius.lg,
        };
      case 'xl':
        return {
          paddingVertical: tokens.spacing[5],
          paddingHorizontal: tokens.spacing[10],
          minHeight: 56,
          borderRadius: borderRadius || tokens.borderRadius.xl,
        };
      default:
        return {
          paddingVertical: tokens.spacing[3],
          paddingHorizontal: tokens.spacing[6],
          minHeight: 44,
          borderRadius: borderRadius || tokens.borderRadius.lg,
        };
    }
  };

  const getShadowStyles = () => {
    const tokens = BaseDesignTokens;
    return tokens.shadows[shadowLevel] || tokens.shadows.sm;
  };

  const getFontSize = () => {
    const tokens = BaseDesignTokens;
    
    switch (size) {
      case 'xs':
        return tokens.typography.sizes.sm;
      case 'sm':
        return tokens.typography.sizes.base;
      case 'md':
      case 'medium':
        return tokens.typography.sizes.lg;
      case 'lg':
        return tokens.typography.sizes.xl;
      case 'xl':
        return tokens.typography.sizes['2xl'];
      default:
        return tokens.typography.sizes.lg;
    }
  };

  const getGradientColors = () => {
    if (gradientColors) return gradientColors;
    
    const tokens = BaseDesignTokens;
    
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return [therapeuticColors?.[400] || tokens.colors.primary[400], therapeuticColors?.[600] || tokens.colors.primary[600]];
    }

    switch (variant) {
      case 'primary':
        return [tokens.colors.primary[400], tokens.colors.primary[600]];
      case 'therapeutic':
        return [tokens.colors.therapeutic.calming[400], tokens.colors.therapeutic.calming[600]];
      case 'success':
        return [tokens.colors.success[400], tokens.colors.success[600]];
      case 'warning':
        return [tokens.colors.warning[400], tokens.colors.warning[600]];
      case 'error':
        return [tokens.colors.error[400], tokens.colors.error[600]];
      default:
        return [tokens.colors.primary[400], tokens.colors.primary[600]];
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const shadowStyles = getShadowStyles();
  const textColor = getTextColor();
  const fontSize = getFontSize();

  const buttonStyle = [
    styles.button,
    variantStyles,
    sizeStyles,
    shadowStyles,
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const animatedStyle = {
    transform: [
      { scale: therapeuticTheme ? pulseAnim : scaleAnim },
    ],
    opacity: opacityAnim,
  };

  const ButtonContent = () => (
    <View style={styles.content}>
      {icon && iconPosition === 'left' && !loading && (
        <View style={[styles.icon, styles.iconLeft]}>
          {icon}
        </View>
      )}
      
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={textColor}
          style={icon && styles.loadingWithIcon}
        />
      ) : null}
      
      {title || children ? (
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: fontSize,
              fontWeight: therapeuticTheme ? '600' : '500',
            },
            textStyle,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {loading ? 'Loading...' : title || children}
        </Text>
      ) : null}
      
      {icon && iconPosition === 'right' && !loading && (
        <View style={[styles.icon, styles.iconRight]}>
          {icon}
        </View>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={buttonStyle}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint || 'Double tap to activate'}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      testID={testID || `enhanced-button-${title}`}
      activeOpacity={0.8}
    >
      <Animated.View style={animatedStyle}>
        {withGradient && !disabled ? (
          <LinearGradient
            colors={getGradientColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, sizeStyles]}
          >
            <ButtonContent />
          </LinearGradient>
        ) : (
          <ButtonContent />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loadingWithIcon: {
    marginRight: 8,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
});

// Comprehensive PropTypes
EnhancedButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string,
  variant: PropTypes.oneOf([
    'primary', 'secondary', 'outline', 'ghost', 
    'therapeutic', 'success', 'warning', 'error'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'medium', 'lg', 'xl']),
  theme: PropTypes.oneOf(['default', 'light', 'dark']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  withHaptics: PropTypes.bool,
  withGradient: PropTypes.bool,
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  animationType: PropTypes.oneOf(['scale', 'opacity', 'none']),
  animationDuration: PropTypes.number,
  shadowLevel: PropTypes.oneOf(['none', 'xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl']),
  borderRadius: PropTypes.number,
  children: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  testID: PropTypes.string,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  hapticType: PropTypes.oneOf(['light', 'medium', 'heavy']),
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
};

export default EnhancedButton;