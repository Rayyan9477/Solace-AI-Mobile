import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../contexts/ThemeContext';
import { BaseDesignTokens } from '../../../design-system/DesignTokens';

const EnhancedCard = ({
  children,
  title,
  subtitle,
  description,
  image,
  imagePosition = 'top',
  onPress,
  onLongPress,
  variant = 'elevated',
  size = 'medium',
  therapeuticTheme,
  withGradient = false,
  gradientColors,
  gradientDirection = 'vertical',
  withAnimation = true,
  animationType = 'scale',
  animationDuration = 200,
  shadowLevel = 'md',
  borderRadius,
  backgroundColor,
  borderColor,
  borderWidth,
  padding,
  margin,
  fullWidth = false,
  disabled = false,
  loading = false,
  badge,
  badgePosition = 'top-right',
  icon,
  iconPosition = 'top-left',
  footer,
  header,
  style,
  contentStyle,
  titleStyle,
  subtitleStyle,
  descriptionStyle,
  imageStyle,
  accessibilityLabel,
  accessibilityHint,
  testID,
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const elevationAnim = useRef(new Animated.Value(1)).current;

  // Floating animation for therapeutic cards
  useEffect(() => {
    if (therapeuticTheme && withAnimation && !isReducedMotionEnabled) {
      const floatingAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(elevationAnim, {
            toValue: 1.02,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(elevationAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      floatingAnimation.start();
      return () => floatingAnimation.stop();
    }
  }, [therapeuticTheme, withAnimation, isReducedMotionEnabled]);

  const handlePressIn = () => {
    if (!isReducedMotionEnabled && withAnimation && !disabled) {
      switch (animationType) {
        case 'scale':
          Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: animationDuration / 2,
            useNativeDriver: true,
          }).start();
          break;
        case 'opacity':
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: animationDuration / 2,
            useNativeDriver: true,
          }).start();
          break;
      }
    }
  };

  const handlePressOut = () => {
    if (!isReducedMotionEnabled && withAnimation && !disabled) {
      switch (animationType) {
        case 'scale':
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: animationDuration / 2,
            useNativeDriver: true,
          }).start();
          break;
        case 'opacity':
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: animationDuration / 2,
            useNativeDriver: true,
          }).start();
          break;
      }
    }
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress?.();
    }
  };

  const handleLongPress = () => {
    if (!disabled && !loading) {
      if (Platform.OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onLongPress?.();
    }
  };

  const getVariantStyles = () => {
    const tokens = BaseDesignTokens;
    
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return {
        backgroundColor: backgroundColor || therapeuticColors?.[50] || tokens.colors.background.card,
        borderColor: borderColor || therapeuticColors?.[200] || tokens.colors.border.primary,
        borderWidth: borderWidth || 1,
        ...tokens.shadows[shadowLevel],
      };
    }

    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: backgroundColor || tokens.colors.background.card,
          borderWidth: 0,
          ...tokens.shadows[shadowLevel],
        };
      case 'outlined':
        return {
          backgroundColor: backgroundColor || tokens.colors.background.card,
          borderColor: borderColor || tokens.colors.border.primary,
          borderWidth: borderWidth || 1,
          shadowOpacity: 0,
          elevation: 0,
        };
      case 'filled':
        return {
          backgroundColor: backgroundColor || tokens.colors.background.secondary,
          borderWidth: 0,
          shadowOpacity: 0,
          elevation: 0,
        };
      case 'glass':
        return {
          backgroundColor: backgroundColor || 'rgba(255, 255, 255, 0.1)',
          borderColor: borderColor || 'rgba(255, 255, 255, 0.2)',
          borderWidth: borderWidth || 1,
          backdropFilter: 'blur(10px)',
          ...tokens.shadows.sm,
        };
      default:
        return {
          backgroundColor: backgroundColor || tokens.colors.background.card,
          ...tokens.shadows[shadowLevel],
        };
    }
  };

  const getSizeStyles = () => {
    const tokens = BaseDesignTokens;
    const basePadding = padding || tokens.spacing[4];
    
    switch (size) {
      case 'small':
        return {
          padding: basePadding * 0.75,
          borderRadius: borderRadius || tokens.borderRadius.base,
          minHeight: 80,
        };
      case 'large':
        return {
          padding: basePadding * 1.5,
          borderRadius: borderRadius || tokens.borderRadius.xl,
          minHeight: 200,
        };
      case 'compact':
        return {
          padding: basePadding * 0.5,
          borderRadius: borderRadius || tokens.borderRadius.sm,
          minHeight: 60,
        };
      default:
        return {
          padding: basePadding,
          borderRadius: borderRadius || tokens.borderRadius.lg,
          minHeight: 120,
        };
    }
  };

  const getGradientColors = () => {
    if (gradientColors) return gradientColors;
    
    const tokens = BaseDesignTokens;
    
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return [
        therapeuticColors?.[100] || tokens.colors.primary[100],
        therapeuticColors?.[200] || tokens.colors.primary[200],
      ];
    }

    return [tokens.colors.background.card, tokens.colors.background.secondary];
  };

  const getGradientDirection = () => {
    switch (gradientDirection) {
      case 'horizontal':
        return { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };
      case 'diagonal':
        return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
      default:
        return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
    }
  };

  const renderBadge = () => {
    if (!badge) return null;

    const tokens = BaseDesignTokens;
    const badgeStyles = [
      styles.badge,
      {
        backgroundColor: therapeuticTheme 
          ? tokens.colors.therapeutic[therapeuticTheme]?.[500] || tokens.colors.primary[500]
          : tokens.colors.primary[500],
      },
    ];

    const positionStyles = {
      'top-left': { top: 8, left: 8 },
      'top-right': { top: 8, right: 8 },
      'bottom-left': { bottom: 8, left: 8 },
      'bottom-right': { bottom: 8, right: 8 },
    };

    return (
      <View style={[badgeStyles, positionStyles[badgePosition]]}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    );
  };

  const renderIcon = () => {
    if (!icon) return null;

    const positionStyles = {
      'top-left': { top: 12, left: 12 },
      'top-right': { top: 12, right: 12 },
      'bottom-left': { bottom: 12, left: 12 },
      'bottom-right': { bottom: 12, right: 12 },
    };

    return (
      <View style={[styles.icon, positionStyles[iconPosition]]}>
        {icon}
      </View>
    );
  };

  const renderImage = () => {
    if (!image) return null;

    const imageStyles = [
      styles.image,
      imagePosition === 'top' && styles.imageTop,
      imagePosition === 'background' && styles.imageBackground,
      imageStyle,
    ];

    if (typeof image === 'string') {
      return (
        <Image
          source={{ uri: image }}
          style={imageStyles}
          resizeMode="cover"
        />
      );
    }

    return (
      <View style={imageStyles}>
        {image}
      </View>
    );
  };

  const renderContent = () => {
    const tokens = BaseDesignTokens;
    
    return (
      <View style={[styles.content, contentStyle]}>
        {header}
        
        {imagePosition === 'top' && renderImage()}
        
        {title && (
          <Text
            style={[
              styles.title,
              {
                color: therapeuticTheme 
                  ? tokens.colors.therapeutic[therapeuticTheme]?.[800] || tokens.colors.text.primary
                  : tokens.colors.text.primary,
                fontSize: size === 'large' ? 20 : size === 'small' ? 14 : 16,
              },
              titleStyle,
            ]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        )}
        
        {subtitle && (
          <Text
            style={[
              styles.subtitle,
              {
                color: therapeuticTheme 
                  ? tokens.colors.therapeutic[therapeuticTheme]?.[600] || tokens.colors.text.secondary
                  : tokens.colors.text.secondary,
                fontSize: size === 'large' ? 16 : size === 'small' ? 12 : 14,
              },
              subtitleStyle,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {subtitle}
          </Text>
        )}
        
        {description && (
          <Text
            style={[
              styles.description,
              {
                color: tokens.colors.text.tertiary,
                fontSize: size === 'large' ? 14 : size === 'small' ? 11 : 12,
              },
              descriptionStyle,
            ]}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        )}
        
        {children}
        
        {footer}
      </View>
    );
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const cardStyle = [
    styles.card,
    variantStyles,
    sizeStyles,
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    margin && { margin },
    style,
  ];

  const animatedStyle = {
    transform: [
      { scale: therapeuticTheme ? elevationAnim : scaleAnim },
    ],
    opacity: opacityAnim,
  };

  const CardWrapper = onPress || onLongPress ? TouchableOpacity : View;
  const wrapperProps = onPress || onLongPress ? {
    onPress: handlePress,
    onLongPress: handleLongPress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
    disabled: disabled || loading,
    activeOpacity: 0.9,
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: accessibilityLabel || title,
    accessibilityHint: accessibilityHint || 'Double tap to interact',
    accessibilityState: { disabled: disabled || loading },
    testID: testID || `card-${title}`,
  } : {
    accessible: true,
    accessibilityRole: 'text',
    testID: testID || `card-${title}`,
  };

  return (
    <CardWrapper {...wrapperProps} style={cardStyle}>
      <Animated.View style={[styles.cardInner, animatedStyle]}>
        {imagePosition === 'background' && renderImage()}
        
        {withGradient ? (
          <LinearGradient
            colors={getGradientColors()}
            {...getGradientDirection()}
            style={styles.gradient}
          >
            {renderContent()}
          </LinearGradient>
        ) : (
          renderContent()
        )}
        
        {renderBadge()}
        {renderIcon()}
      </Animated.View>
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    position: 'relative',
  },
  cardInner: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    lineHeight: 24,
    marginBottom: 4,
  },
  subtitle: {
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 8,
  },
  description: {
    lineHeight: 18,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    borderRadius: 8,
    marginBottom: 12,
  },
  imageTop: {
    height: 120,
  },
  imageBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  badge: {
    position: 'absolute',
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  icon: {
    position: 'absolute',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
});

EnhancedCard.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  imagePosition: PropTypes.oneOf(['top', 'background']),
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  variant: PropTypes.oneOf(['elevated', 'outlined', 'filled', 'glass']),
  size: PropTypes.oneOf(['small', 'medium', 'large', 'compact']),
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  withGradient: PropTypes.bool,
  gradientColors: PropTypes.arrayOf(PropTypes.string),
  gradientDirection: PropTypes.oneOf(['vertical', 'horizontal', 'diagonal']),
  withAnimation: PropTypes.bool,
  animationType: PropTypes.oneOf(['scale', 'opacity', 'none']),
  animationDuration: PropTypes.number,
  shadowLevel: PropTypes.oneOf(['none', 'xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl']),
  borderRadius: PropTypes.number,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  borderWidth: PropTypes.number,
  padding: PropTypes.number,
  margin: PropTypes.number,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  badgePosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  footer: PropTypes.node,
  header: PropTypes.node,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  contentStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  subtitleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  descriptionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  imageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  testID: PropTypes.string,
};

export default EnhancedCard;