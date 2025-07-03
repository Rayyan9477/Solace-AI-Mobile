import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const SettingsSection = ({ title, children }) => {
  const { theme } = useTheme();
  

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {title}
      </Text>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing[4],
    marginBottom: theme.spacing[4],
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.base,
    overflow: 'hidden',
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.lg,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[4],
    backgroundColor: theme.colors.gray[50],
  },
  content: {
    backgroundColor: 'transparent',
  },
});

export default SettingsSection;
