/**
 * Card Component
 * Common card component for backwards compatibility with tests
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../shared/theme/ThemeContext';

const Card = ({
  children,
  variant = 'default',
  elevation = 2,
  onPress,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: theme.colors.border?.main || '#E0E0E0',
          backgroundColor: 'transparent',
        };
      case 'elevated':
        return {
          backgroundColor: theme.colors.background?.surface || '#FFFFFF',
          ...getShadowStyles(elevation),
        };
      default:
        return {
          backgroundColor: theme.colors.background?.surface || '#FFFFFF',
          ...getShadowStyles(elevation),
        };
    }
  };

  const getShadowStyles = (elev) => {
    return {
      shadowColor: theme.colors.shadow || '#000000',
      shadowOffset: { width: 0, height: elev },
      shadowOpacity: 0.1 * elev,
      shadowRadius: elev * 2,
      elevation: elev,
    };
  };

  const variantStyles = getVariantStyles();

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      testID={testID || 'card'}
      style={[styles.container, variantStyles, style]}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
  },
});

export default Card;
