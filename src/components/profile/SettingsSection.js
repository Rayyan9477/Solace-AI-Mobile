import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from "../../shared/theme/theme";

const SettingsSection = ({ title, children }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.secondary },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text.primary }]}>
        {title}
      </Text>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[4],
    marginBottom: spacing[4],
    borderRadius: borderRadius.md,
    ...shadows.base,
    overflow: "hidden",
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: "600",
    lineHeight: typography.lineHeights.lg,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    backgroundColor: colors.gray[50],
  },
  content: {
    backgroundColor: "transparent",
  },
});

export default SettingsSection;
