import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Badge = ({
  label,
  variant = 'primary',
  size = 'medium',
  standalone = false,
  style,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: theme.colors.success.light,
          color: theme.colors.success.dark,
        };
      case 'warning':
        return {
          backgroundColor: theme.colors.warning.light,
          color: theme.colors.warning.dark,
        };
      case 'error':
        return {
          backgroundColor: theme.colors.error.light,
          color: theme.colors.error.dark,
        };
      case 'info':
        return {
          backgroundColor: theme.colors.info.light,
          color: theme.colors.info.dark,
        };
      default:
        return {
          backgroundColor: theme.colors.primary.light,
          color: theme.colors.primary.dark,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 2,
          paddingHorizontal: 6,
          borderRadius: 8,
          minWidth: 16,
          height: 16,
          fontSize: 10,
        };
      case 'large':
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 16,
          minWidth: 32,
          height: 32,
          fontSize: 14,
        };
      default:
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 12,
          minWidth: 24,
          height: 24,
          fontSize: 12,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantStyles.backgroundColor,
        },
        getSizeStyles(),
        standalone && styles.standalone,
        style,
      ]}
      accessibilityLabel={accessibilityLabel || `${label} badge`}
      accessibilityRole="text"
    >
      <Text
        style={[
          styles.text,
          {
            color: variantStyles.color,
            fontSize: sizeStyles.fontSize,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  standalone: {
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Badge;
