import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Card = ({
  children,
  onPress,
  style,
  elevation = 2,
  variant = 'default',
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'none',
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: theme.colors.background.surface,
          borderWidth: 1,
          borderColor: theme.colors.border.main,
          elevation: 0,
        };
      case 'flat':
        return {
          backgroundColor: theme.colors.background.surface,
          elevation: 0,
          shadowOpacity: 0,
        };
      default:
        return {
          backgroundColor: theme.colors.background.surface,
          elevation,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: elevation },
          shadowOpacity: 0.25,
          shadowRadius: elevation * 2,
        };
    }
  };

  const Container = onPress ? Pressable : View;

  return (
    <Container
      style={[styles.card, getVariantStyles(), style]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={onPress ? 'button' : accessibilityRole}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 0,
  },
});

export default Card;
