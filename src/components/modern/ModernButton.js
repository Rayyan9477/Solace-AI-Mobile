import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeContext';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../shared/theme/theme';

// DEPRECATED: ModernButton has been replaced with professional TouchableOpacity
// This component now provides clean, professional button styling
const ModernButton = ({ 
  title, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  ...props 
}) => {
  const { theme } = useTheme();

  // Show deprecation warning in development
  if (__DEV__) {
    console.warn(
      'ModernButton is deprecated. Use TouchableOpacity with professional styling for production-ready UI.'
    );
  }

  const getButtonStyle = () => {
    const baseStyle = {
      paddingHorizontal: size === 'large' ? spacing[6] : size === 'small' ? spacing[3] : spacing[4],
      paddingVertical: size === 'large' ? spacing[4] : size === 'small' ? spacing[2] : spacing[3],
      borderRadius: borderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.sm,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.primary[500],
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary[500],
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: colors.error[500],
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.primary[500],
        };
    }
  };

  const getTextStyle = () => ({
    fontSize: size === 'large' ? typography.sizes.lg : size === 'small' ? typography.sizes.sm : typography.sizes.base,
    fontWeight: typography.weights.semiBold,
    color: '#FFFFFF',
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[getButtonStyle(), style]}
      {...props}
    >
      <Text style={[getTextStyle(), textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ModernButton;