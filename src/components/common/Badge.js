/**
 * Badge Component
 * A flexible badge component with multiple variants, sizes, and accessibility features
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../../shared/theme/ThemeContext';

const Badge = ({
  label,
  variant = 'primary',
  size = 'medium',
  dot = false,
  icon,
  iconPosition = 'left',
  onPress,
  max = 99,
  outline = false,
  style,
  accessibilityLabel,
  testID,
  ...props
}) => {
  const { theme } = useTheme();

  const formatLabel = (value) => {
    if (typeof value === 'number') {
      if (value > max) {
        return `${max}+`;
      }
      return value.toString();
    }
    return value;
  };

  const getVariantStyles = () => {
    const baseStyles = {};

    if (outline) {
      switch (variant) {
        case 'primary':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.primary?.main || '#007AFF',
          };
        case 'success':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.success?.main || '#4CAF50',
          };
        case 'warning':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.warning?.main || '#FF9800',
          };
        case 'error':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.error?.main || '#F44336',
          };
        case 'info':
          return {
            ...baseStyles,
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.info?.main || '#2196F3',
          };
        default:
          return baseStyles;
      }
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.primary?.light || '#E3F2FD',
        };
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.success?.light || '#E8F5E8',
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.warning?.light || '#FFF8E1',
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.error?.light || '#FFEBEE',
        };
      case 'info':
        return {
          ...baseStyles,
          backgroundColor: theme.colors.info?.light || '#E1F5FE',
        };
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 2,
          paddingHorizontal: 6,
          minHeight: 16,
          borderRadius: 8,
        };
      case 'large':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          minHeight: 24,
          borderRadius: 12,
        };
      case 'medium':
      default:
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          minHeight: 20,
          borderRadius: 10,
        };
    }
  };

  const getTextColor = () => {
    if (outline) {
      switch (variant) {
        case 'primary':
          return theme.colors.primary?.main || '#007AFF';
        case 'success':
          return theme.colors.success?.main || '#4CAF50';
        case 'warning':
          return theme.colors.warning?.main || '#FF9800';
        case 'error':
          return theme.colors.error?.main || '#F44336';
        case 'info':
          return theme.colors.info?.main || '#2196F3';
        default:
          return theme.colors.primary?.main || '#007AFF';
      }
    }

    switch (variant) {
      case 'primary':
        return theme.colors.primary?.dark || '#1976D2';
      case 'success':
        return theme.colors.success?.dark || '#2E7D32';
      case 'warning':
        return theme.colors.warning?.dark || '#F57C00';
      case 'error':
        return theme.colors.error?.dark || '#C62828';
      case 'info':
        return theme.colors.info?.dark || '#0277BD';
      default:
        return theme.colors.primary?.dark || '#1976D2';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 10;
      case 'large':
        return 14;
      case 'medium':
      default:
        return 12;
    }
  };

  if (dot) {
    const dotStyles = [
      styles.dot,
      getVariantStyles(),
      { backgroundColor: getTextColor() },
      style,
    ];

    return (
      <View
        style={dotStyles}
        accessibilityLabel={accessibilityLabel || "Status indicator"}
        testID={testID}
        {...props}
      />
    );
  }

  const badgeContent = (
    <View style={[styles.container, getVariantStyles(), getSizeStyles(), style]}>
      {icon && iconPosition === 'left' && (
        <Text style={[styles.icon, { color: getTextColor() }]}>{icon}</Text>
      )}
      {label && (
        <Text style={[styles.text, { color: getTextColor(), fontSize: getTextSize() }]}>
          {formatLabel(label)}
        </Text>
      )}
      {icon && iconPosition === 'right' && (
        <Text style={[styles.icon, { color: getTextColor() }]}>{icon}</Text>
      )}
    </View>
  );

  const accessibilityProps = {
    accessibilityLabel: accessibilityLabel || `${formatLabel(label)} badge`,
    accessibilityRole: onPress ? 'button' : 'text',
    accessible: true,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.touchable}
        testID={testID}
        {...accessibilityProps}
        {...props}
      >
        {badgeContent}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={styles.touchable}
      testID={testID}
      {...accessibilityProps}
      {...props}
    >
      {badgeContent}
    </View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    alignSelf: 'flex-start',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  icon: {
    fontSize: 12,
    marginHorizontal: 2,
  },
});

Badge.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.oneOf(['primary', 'success', 'warning', 'error', 'info']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  dot: PropTypes.bool,
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onPress: PropTypes.func,
  max: PropTypes.number,
  outline: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  accessibilityLabel: PropTypes.string,
  testID: PropTypes.string,
};

export default Badge;