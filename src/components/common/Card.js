/**
 * Card Component
 * A flexible card component with multiple variants and accessibility features
 */

import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../shared/theme/ThemeContext';

const Card = ({
  children,
  variant = 'elevated',
  onPress,
  disabled = false,
  loading = false,
  padding = 16,
  borderRadius = 8,
  style,
  accessibilityLabel,
  accessibilityHint,
  testID,
  ...props
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    const baseStyles = {
      padding,
      borderRadius,
      backgroundColor: theme.colors.background.surface,
    };

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyles,
          borderWidth: 1,
          borderColor: theme.colors.border.main,
          backgroundColor: 'transparent',
        };
      case 'flat':
        return {
          ...baseStyles,
          shadowOpacity: 0,
          elevation: 0,
        };
      case 'elevated':
        return {
          ...baseStyles,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.primary.light,
        };
      default:
        return baseStyles;
    }
  };

  const cardStyles = [
    styles.container,
    getVariantStyles(),
    disabled && styles.disabled,
    loading && styles.loading,
    style,
  ];

  const accessibilityProps = {
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole: onPress ? 'button' : undefined,
    accessibilityState: {
      disabled: disabled || loading,
    },
    accessible: true,
  };

  if (onPress && !disabled && !loading) {
    return (
      <TouchableOpacity
        style={cardStyles}
        onPress={onPress}
        testID={testID}
        {...accessibilityProps}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={cardStyles}
      testID={testID}
      {...accessibilityProps}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  loading: {
    opacity: 0.8,
  },
});

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['outlined', 'flat', 'elevated', 'filled']),
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  padding: PropTypes.number,
  borderRadius: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  testID: PropTypes.string,
};

export default Card;