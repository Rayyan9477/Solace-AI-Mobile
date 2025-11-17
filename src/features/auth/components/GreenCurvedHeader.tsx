/**
 * GreenCurvedHeader - Curved header with green gradient
 * Used in auth screens (Login, Signup, Forgot Password)
 * Based on ui-designs/Dark-mode/Sign In & Sign Up.png
 */

import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";
import { useTheme } from "@theme/ThemeProvider";

const { width } = Dimensions.get("window");

interface GreenCurvedHeaderProps {
  height?: number;
}

export const GreenCurvedHeader = ({ height = 200 }: GreenCurvedHeaderProps) => {
  const { theme } = useTheme();

  // Create a curved path using bezier curves
  const curvedPath = `
    M 0 0
    L 0 ${height * 0.7}
    Q ${width * 0.25} ${height * 0.85} ${width * 0.5} ${height * 0.8}
    Q ${width * 0.75} ${height * 0.75} ${width} ${height * 0.9}
    L ${width} 0
    Z
  `;

  return (
    <View style={[styles.container, { height }]}>
      <Svg height={height} width={width} style={styles.svg}>
        <Defs>
          <SvgLinearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={theme.colors.green["60"]} stopOpacity="1" />
            <Stop offset="100%" stopColor={theme.colors.green["80"]} stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        <Path d={curvedPath} fill="url(#greenGradient)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  svg: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default GreenCurvedHeader;
