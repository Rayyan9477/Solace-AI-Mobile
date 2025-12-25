import { LinearGradient, LinearGradientPoint } from "expo-linear-gradient";
import React, { ReactNode } from "react";
import { StyleSheet, ViewStyle, StyleProp } from "react-native";

import { useFixedTheme } from "./FixedThemeProvider";

// Type for LinearGradient colors - must have at least 2 colors
type GradientColors = readonly [string, string, ...string[]];

interface GradientBackgroundProps {
  children?: ReactNode;
  colors?: GradientColors | null;
  start?: LinearGradientPoint;
  end?: LinearGradientPoint;
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  colors = null,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style = {},
  ...props
}) => {
  const { theme } = useFixedTheme();

  const defaultColors: GradientColors = colors || [
    theme.colors.therapeutic?.empathy?.[600] || "#C96100",
    theme.colors.therapeutic?.zen?.[500] || "#EDA600",
    theme.colors.therapeutic?.kind?.[400] || "#9654F5",
  ] as GradientColors;

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
