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

const StatsCard = ({ title, value, subtitle, icon, color }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.background.secondary,
          padding: theme.spacing[4],
          borderRadius: theme.borderRadius.md,
          ...theme.shadows.base,
        },
      ]}
    >
      <View style={[
        styles.iconContainer, 
        { 
          backgroundColor: color,
          borderRadius: theme.borderRadius.full,
          marginBottom: theme.spacing[3],
        }
      ]}>
        <Text style={[styles.icon, { fontSize: theme.typography.sizes.lg }]}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[
          styles.value, 
          { 
            color: theme.colors.text.primary,
            fontSize: theme.typography.sizes.xl,
            lineHeight: theme.typography.lineHeights.xl,
            marginBottom: theme.spacing[1],
          }
        ]}>
          {value}
          {subtitle && (
            <Text
              style={[
                styles.subtitle, 
                { 
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.sizes.sm,
                }
              ]}
            >
              {" "}
              {subtitle}
            </Text>
          )}
        </Text>
        <Text style={[
          styles.title, 
          { 
            color: theme.colors.text.secondary,
            fontSize: theme.typography.sizes.sm,
            lineHeight: theme.typography.lineHeights.sm,
          }
        ]}>
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    // fontSize will be set inline with theme
  },
  content: {
    alignItems: "center",
  },
  value: {
    fontWeight: "700",
    // fontSize, lineHeight, marginBottom will be set inline with theme
  },
  subtitle: {
    fontWeight: "400",
    // fontSize will be set inline with theme
  },
  title: {
    fontWeight: "500",
    textAlign: "center",
    // fontSize, lineHeight will be set inline with theme
  },
});

export default StatsCard;
