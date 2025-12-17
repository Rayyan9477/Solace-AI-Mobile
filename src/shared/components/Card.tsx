/**
 * Card Component - Elevated container for content
 * Supports multiple variants and elevation levels
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius, elevation } from '../../theme/spacing';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  elevationLevel?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: keyof typeof spacing;
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  elevationLevel = 'md',
  padding = 'md',
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const cardStyles = [
    styles.base,
    styles[`variant_${variant}`],
    variant === 'elevated' && elevation[elevationLevel],
    { padding: spacing[padding] },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [
          ...cardStyles,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      style={cardStyles}
      accessibilityRole="none"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
};

// LOW-006 FIX: Add displayName for debugging and dev tools
Card.displayName = "Card";

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.semantic.surface,
    overflow: 'hidden',
  },

  // Variants
  variant_elevated: {
    backgroundColor: colors.semantic.surface,
  },

  variant_outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.semantic.outline,
  },

  variant_filled: {
    backgroundColor: colors.semantic.surfaceVariant,
  },

  // Pressed state
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});

export default Card;
