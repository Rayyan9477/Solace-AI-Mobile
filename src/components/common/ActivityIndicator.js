import React from 'react';
import { View, ActivityIndicator as RNActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const ActivityIndicator = ({
  size = 'large',
  color,
  style,
  accessibilityLabel = 'Loading',
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
    >
      <RNActivityIndicator
        size={size}
        color={color || theme.colors.primary.main}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ActivityIndicator;
