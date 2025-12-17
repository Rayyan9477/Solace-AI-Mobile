/**
 * Button Component - Accessible, themeable button
 * Supports multiple variants, sizes, and states
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

export interface ButtonProps {
  // Content
  children: React.ReactNode;
  onPress: () => void;

  // Variants
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';

  // States
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;

  // Icons
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;

  // Style overrides
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  accessibilityHint,
  style,
  textStyle,
}) => {
  const buttonStyles = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : 'Button')}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.semantic.onPrimary : colors.semantic.primary}
          size={size === 'small' ? 'small' : 'large'}
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={textStyles}>{children}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

// LOW-007 FIX: Add displayName for debugging and React DevTools
Button.displayName = "Button";

const styles = StyleSheet.create({
  // Base styles
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    ...typography.button,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Variants
  variant_primary: {
    backgroundColor: colors.semantic.primary,
  },

  variant_secondary: {
    backgroundColor: colors.green[60],
  },

  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.semantic.primary,
  },

  variant_text: {
    backgroundColor: 'transparent',
  },

  variant_danger: {
    backgroundColor: colors.red[60],
  },

  // Sizes
  size_small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 32,
  },

  size_medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 44,
  },

  size_large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 56,
  },

  // Text styles
  text: {
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
    letterSpacing: typography.button.letterSpacing,
  },

  text_primary: {
    color: colors.semantic.onPrimary,
  },

  text_secondary: {
    color: colors.semantic.onPrimary,
  },

  text_outline: {
    color: colors.semantic.primary,
  },

  text_text: {
    color: colors.semantic.primary,
  },

  text_danger: {
    color: colors.semantic.onPrimary,
  },

  textSize_small: {
    fontSize: 14,
  },

  textSize_medium: {
    fontSize: 16,
  },

  textSize_large: {
    fontSize: 18,
  },

  // States
  disabled: {
    backgroundColor: colors.semantic.disabled,
    borderColor: colors.semantic.disabled,
    opacity: 0.6,
  },

  textDisabled: {
    color: colors.semantic.onDisabled,
  },

  fullWidth: {
    width: '100%',
  },

  // Icons
  leftIcon: {
    marginRight: spacing.sm,
  },

  rightIcon: {
    marginLeft: spacing.sm,
  },
});

export default Button;
