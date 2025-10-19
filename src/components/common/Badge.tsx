/**
 * Badge Component
 * Common badge component for backwards compatibility with tests
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeContext';

const Badge = ({
  children,
  value,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
  testID,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: theme.colors.primary?.main || '#007AFF',
          },
          text: {
            color: '#FFFFFF',
          },
        };
      case 'success':
        return {
          container: {
            backgroundColor: '#4CAF50',
          },
          text: {
            color: '#FFFFFF',
          },
        };
      case 'warning':
        return {
          container: {
            backgroundColor: '#FF9800',
          },
          text: {
            color: '#FFFFFF',
          },
        };
      case 'error':
        return {
          container: {
            backgroundColor: '#F44336',
          },
          text: {
            color: '#FFFFFF',
          },
        };
      default:
        return {
          container: {
            backgroundColor: theme.colors.background?.secondary || '#F5F5F5',
          },
          text: {
            color: theme.colors.text?.secondary || '#666666',
          },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { paddingHorizontal: 6, paddingVertical: 2, minWidth: 16 },
          text: { fontSize: 10 },
        };
      case 'large':
        return {
          container: { paddingHorizontal: 12, paddingVertical: 6, minWidth: 28 },
          text: { fontSize: 14 },
        };
      default:
        return {
          container: { paddingHorizontal: 8, paddingVertical: 4, minWidth: 20 },
          text: { fontSize: 12 },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const displayValue = value !== undefined ? value.toString() : children;

  return (
    <View
      style={[
        styles.container,
        variantStyles.container,
        sizeStyles.container,
        style,
      ]}
      testID={testID || 'badge'}
    >
      <Text
        style={[
          styles.text,
          variantStyles.text,
          sizeStyles.text,
          textStyle,
        ]}
        testID={`${testID || 'badge'}-text`}
      >
        {displayValue}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Badge;
