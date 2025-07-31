import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const StatsCard = ({ title, value, subtitle, icon, color }) => {
  const { theme } = useTheme();
  

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.value, { color: theme.colors.text.primary }]}>
          {value}
          {subtitle && <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}> {subtitle}</Text>}
        </Text>
        <Text style={[styles.title, { color: theme.colors.text.secondary }]}>
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '45%',
    padding: theme.theme.spacing[4],
    borderRadius: theme.theme.borderRadius.md,
    ...theme.theme.shadows.base,
    alignItems: 'center',
  },
  iconContainer: {
    width: 44, height: 44,
    borderRadius: theme.theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.theme.spacing[3],
  },
  icon: {
    fontSize: theme.theme.typography.sizes.lg,
  },
  content: {
    alignItems: 'center',
  },
  value: {
    fontSize: theme.theme.typography.sizes.xl,
    fontWeight: '700',
    lineHeight: theme.theme.typography.lineHeights.xl,
    marginBottom: theme.theme.spacing[1],
  },
  subtitle: {
    fontSize: theme.theme.typography.sizes.sm,
    fontWeight: '400',
  },
  title: {
    fontSize: theme.theme.typography.sizes.sm,
    fontWeight: '500',
    lineHeight: theme.theme.typography.lineHeights.sm,
    textAlign: 'center',
  },
});

export default StatsCard;
