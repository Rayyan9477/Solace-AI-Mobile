/**
 * Enhanced Button Component
 * Material Design 3 with Framer Motion and Expo compatibility
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { motion } from 'framer-motion';

import { platform } from '../../utils/platform';
import { useTheme } from '../../theme/UnifiedThemeProvider';
import { FreudColors } from '../../theme/FreudDesignSystem';

const AnimatedButton = motion(PaperButton);

export interface ButtonProps {
  variant?: 'filled' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: any;
  testID?: string;
  therapeuticColor?: keyof typeof FreudColors;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'medium',
  children,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  testID,
  therapeuticColor,
  fullWidth = false,
  ...props
}) => {
  const { theme, isDarkMode } = useTheme();

  // Get therapeutic colors
  const getTherapeuticColors = () => {
    if (!therapeuticColor) return {};

    const colorPalette = FreudColors[therapeuticColor];
    if (!colorPalette) return {};

    switch (variant) {
      case 'filled':
        return {
          buttonColor: colorPalette[60],
          textColor: '#FFFFFF',
        };
      case 'outlined':
        return {
          buttonColor: 'transparent',
          textColor: colorPalette[60],
          borderColor: colorPalette[60],
        };
      case 'text':
        return {
          buttonColor: 'transparent',
          textColor: colorPalette[60],
        };
      default:
        return {};
    }
  };

  // Get size-specific styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          contentStyle: { height: 32 },
          labelStyle: { fontSize: 12 },
        };
      case 'large':
        return {
          contentStyle: { height: 56 },
          labelStyle: { fontSize: 16 },
        };
      default:
        return {
          contentStyle: { height: 40 },
          labelStyle: { fontSize: 14 },
        };
    }
  };

  // Get animation configuration based on platform
  const getAnimationProps = () => {
    const config = platform.select({
      ios: {
        whileTap: { scale: 0.98 },
        transition: { type: 'spring', stiffness: 400, damping: 17 },
      },
      android: {
        whileTap: { scale: 0.96 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      },
      web: {
        whileHover: { scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: { duration: 0.15 },
      },
      default: {
        whileTap: { scale: 0.98 },
        transition: { type: 'spring', stiffness: 350, damping: 18 },
      },
    });

    return disabled ? {} : config;
  };

  const therapeuticColors = getTherapeuticColors();
  const sizeStyles = getSizeStyles();
  const animationProps = getAnimationProps();

  return (
    <AnimatedButton
      mode={variant}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      testID={testID}
      {...therapeuticColors}
      {...sizeStyles}
      {...animationProps}
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        variant === 'outlined' && therapeuticColors.borderColor && {
          borderColor: therapeuticColors.borderColor,
          borderWidth: 1,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </AnimatedButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
  },
  fullWidth: {
    width: '100%',
  },
});

export default Button;