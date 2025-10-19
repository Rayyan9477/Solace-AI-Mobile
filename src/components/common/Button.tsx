/**
 * Button Component
 * Common button component for backwards compatibility with tests
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../shared/theme/ThemeContext';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const handlePress = () => {
    if (!disabled && onPress) {
      // Trigger haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: theme.colors.primary?.main || '#007AFF',
          },
          text: {
            color: theme.colors.text?.inverse || '#FFFFFF',
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.colors.background?.secondary || '#F5F5F5',
          },
          text: {
            color: theme.colors.text?.primary || '#333333',
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.border?.main || '#E0E0E0',
          },
          text: {
            color: theme.colors.primary?.main || '#007AFF',
          },
        };
      case 'text':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: theme.colors.primary?.main || '#007AFF',
          },
        };
      default:
        return {
          container: {
            backgroundColor: theme.colors.primary?.main || '#007AFF',
          },
          text: {
            color: theme.colors.text?.inverse || '#FFFFFF',
          },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingVertical: 8, paddingHorizontal: 16 },
          text: { fontSize: 14 },
        };
      case 'large':
        return {
          container: { paddingVertical: 16, paddingHorizontal: 32 },
          text: { fontSize: 18 },
        };
      default:
        return {
          container: { paddingVertical: 12, paddingHorizontal: 24 },
          text: { fontSize: 16 },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      testID={`button-${title}`}
      style={[
        styles.container,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variantStyles.text,
          sizeStyles.text,
          disabled && styles.disabledText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export default Button;
