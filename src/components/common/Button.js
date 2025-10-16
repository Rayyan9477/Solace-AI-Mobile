/**
 * Button Component
 * A flexible button component with multiple variants, sizes, and accessibility features
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../shared/theme/ThemeContext';

const Button = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  variant = 'primary',
  size = 'medium',
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const getVariantStyles = () => {
    const baseStyles = {};

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.primary.main,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.background.secondary,
          borderWidth: 1,
          borderColor: theme.colors.border.main,
        };
      case 'outline':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary.main,
        };
      case 'text':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          minHeight: 36,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          minHeight: 56,
        };
      case 'medium':
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          minHeight: 44,
        };
    }
  };

  const getTextColor = () => {
    if (disabled || loading) {
      return theme.colors.text.secondary;
    }

    switch (variant) {
      case 'primary':
        return theme.colors.text.inverse;
      case 'secondary':
        return theme.colors.text.primary;
      case 'outline':
        return theme.colors.primary.main;
      case 'text':
        return theme.colors.primary.main;
      default:
        return theme.colors.text.primary;
    }
  };

  const buttonStyles = [
    styles.button,
    getVariantStyles(),
    getSizeStyles(),
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    { color: getTextColor() },
    size === 'small' && styles.smallText,
    size === 'large' && styles.largeText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID || `button-${title}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          testID="button-loading"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
});

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  testID: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default Button;