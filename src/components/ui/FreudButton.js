/**
 * FreudButton Component
 * Enhanced button component following Freud Design System
 * Supports all variants from design reference: primary, secondary, outline, accent
 * Multiple sizes: large, medium, small, extra-small
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { freudTheme } from '../../shared/theme/freudTheme';

const FreudButton = ({
  title,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  onPress,
  style,
  textStyle,
  fullWidth = false,
  animationEnabled = true,
  ...props
}) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  // Handle press animation
  const handlePressIn = () => {
    if (!animationEnabled || disabled || loading) return;
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    if (!animationEnabled || disabled || loading) return;
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  // Size configurations
  const sizeConfig = {
    'extra-small': {
      paddingHorizontal: freudTheme.spacing.sm,
      paddingVertical: freudTheme.spacing.xs,
      fontSize: freudTheme.typography.fontSize.textXs,
      minHeight: 32,
      borderRadius: freudTheme.radii.lg,
    },
    small: {
      paddingHorizontal: freudTheme.spacing.md,
      paddingVertical: freudTheme.spacing.sm,
      fontSize: freudTheme.typography.fontSize.textSm,
      minHeight: 36,
      borderRadius: freudTheme.radii.xl,
    },
    medium: {
      paddingHorizontal: freudTheme.spacing.lg,
      paddingVertical: freudTheme.spacing.md,
      fontSize: freudTheme.typography.fontSize.textMd,
      minHeight: 44,
      borderRadius: freudTheme.radii['2xl'],
    },
    large: {
      paddingHorizontal: freudTheme.spacing.xl,
      paddingVertical: freudTheme.spacing.lg,
      fontSize: freudTheme.typography.fontSize.textLg,
      minHeight: 52,
      borderRadius: freudTheme.radii['2xl'],
    },
  };

  // Variant configurations
  const variantConfig = {
    primary: {
      backgroundColor: disabled 
        ? freudTheme.colors.gray[30] 
        : freudTheme.colors.brown[80],
      color: disabled 
        ? freudTheme.colors.text.disabled 
        : freudTheme.colors.text.inverse,
      borderWidth: 0,
      borderColor: 'transparent',
    },
    secondary: {
      backgroundColor: disabled 
        ? freudTheme.colors.gray[20] 
        : freudTheme.colors.brown[20],
      color: disabled 
        ? freudTheme.colors.text.disabled 
        : freudTheme.colors.text.primary,
      borderWidth: 0,
      borderColor: 'transparent',
    },
    outline: {
      backgroundColor: 'transparent',
      color: disabled 
        ? freudTheme.colors.text.disabled 
        : freudTheme.colors.text.primary,
      borderWidth: 1,
      borderColor: disabled 
        ? freudTheme.colors.border.primary 
        : freudTheme.colors.border.secondary,
    },
    accent: {
      backgroundColor: disabled 
        ? freudTheme.colors.gray[30] 
        : freudTheme.colors.orange[40],
      color: disabled 
        ? freudTheme.colors.text.disabled 
        : freudTheme.colors.text.inverse,
      borderWidth: 0,
      borderColor: 'transparent',
    },
    success: {
      backgroundColor: disabled 
        ? freudTheme.colors.gray[30] 
        : freudTheme.colors.green[60],
      color: disabled 
        ? freudTheme.colors.text.disabled 
        : freudTheme.colors.text.inverse,
      borderWidth: 0,
      borderColor: 'transparent',
    },
    warning: {
      backgroundColor: disabled 
        ? freudTheme.colors.gray[30] 
        : freudTheme.colors.yellow[50],
      color: disabled 
        ? freudTheme.colors.text.disabled 
        : freudTheme.colors.text.primary,
      borderWidth: 0,
      borderColor: 'transparent',
    },
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];

  const buttonStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: currentSize.minHeight,
    paddingHorizontal: currentSize.paddingHorizontal,
    paddingVertical: currentSize.paddingVertical,
    borderRadius: currentSize.borderRadius,
    backgroundColor: currentVariant.backgroundColor,
    borderWidth: currentVariant.borderWidth,
    borderColor: currentVariant.borderColor,
    width: fullWidth ? '100%' : 'auto',
    opacity: (disabled || loading) ? 0.6 : 1,
    ...freudTheme.shadows.sm,
  };

  const textStyles = {
    fontSize: currentSize.fontSize,
    fontWeight: freudTheme.typography.fontWeight.semibold,
    color: currentVariant.color,
    textAlign: 'center',
    fontFamily: freudTheme.typography.fontFamily.primary,
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator 
            size="small" 
            color={currentVariant.color} 
            style={{ marginRight: title ? freudTheme.spacing.sm : 0 }}
          />
          {title && <Text style={[textStyles, textStyle]}>{title}</Text>}
        </View>
      );
    }

    if (icon && title) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {iconPosition === 'left' && (
            <View style={{ marginRight: freudTheme.spacing.sm }}>
              {icon}
            </View>
          )}
          <Text style={[textStyles, textStyle]}>{title}</Text>
          {iconPosition === 'right' && (
            <View style={{ marginLeft: freudTheme.spacing.sm }}>
              {icon}
            </View>
          )}
        </View>
      );
    }

    if (icon && !title) {
      return icon;
    }

    return <Text style={[textStyles, textStyle]}>{title}</Text>;
  };

  const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <AnimatedTouchableOpacity
      style={[
        buttonStyle,
        style,
        {
          transform: animationEnabled ? [{ scale: animatedValue }] : undefined,
        },
      ]}
      onPress={!disabled && !loading ? onPress : undefined}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      {...props}
    >
      {renderContent()}
    </AnimatedTouchableOpacity>
  );
};

// Button group component for multiple buttons
export const FreudButtonGroup = ({ 
  children, 
  orientation = 'horizontal',
  spacing = 'md',
  style 
}) => {
  const isHorizontal = orientation === 'horizontal';
  const spacingValue = freudTheme.spacing[spacing];
  
  return (
    <View 
      style={[
        {
          flexDirection: isHorizontal ? 'row' : 'column',
          alignItems: isHorizontal ? 'center' : 'stretch',
          gap: spacingValue,
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

// Icon button component for icon-only buttons
export const FreudIconButton = ({
  icon,
  variant = 'outline',
  size = 'medium',
  ...props
}) => {
  const sizeMap = {
    'extra-small': 32,
    small: 36,
    medium: 44,
    large: 52,
  };

  const iconSize = sizeMap[size];

  return (
    <FreudButton
      variant={variant}
      size={size}
      icon={icon}
      style={{
        width: iconSize,
        height: iconSize,
        paddingHorizontal: 0,
        paddingVertical: 0,
      }}
      {...props}
    />
  );
};

// FAB (Floating Action Button) component
export const FreudFAB = ({
  icon,
  variant = 'accent',
  size = 56,
  onPress,
  style,
  ...props
}) => {
  return (
    <FreudButton
      variant={variant}
      icon={icon}
      onPress={onPress}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          paddingHorizontal: 0,
          paddingVertical: 0,
          position: 'absolute',
          bottom: freudTheme.spacing['4xl'],
          right: freudTheme.spacing.lg,
          ...freudTheme.shadows.lg,
          elevation: 8,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default FreudButton;