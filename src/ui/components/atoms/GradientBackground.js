import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

import { useFixedTheme } from "./FixedThemeProvider";

const GradientBackground = ({
  children,
  colors = null,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style = {},
  ...props
}) => {
  const { theme } = useFixedTheme();

  const defaultColors = colors || [
    theme.colors.therapeutic?.empathy?.[600] || "#C96100",
    theme.colors.therapeutic?.zen?.[500] || "#EDA600",
    theme.colors.therapeutic?.kind?.[400] || "#9654F5",
  ];

  return (
    <LinearGradient
      colors={defaultColors}
      start={start}
      end={end}
      style={[styles.gradient, style]}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default GradientBackground;
