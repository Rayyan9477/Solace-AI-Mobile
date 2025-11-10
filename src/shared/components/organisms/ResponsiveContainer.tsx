/**
 * ResponsiveContainer Component
 * Provides responsive layout container for web and mobile
 * Centers content on large screens and adds appropriate padding
 */

import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";

import { useResponsive } from "@shared/hooks/useResponsive";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  maxWidth?: number | "auto";
  centerContent?: boolean;
  noPadding?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
  maxWidth,
  centerContent = true,
  noPadding = false,
}) => {
  const { isWeb, width, getMaxContentWidth, getContainerPadding } =
    useResponsive();

  const containerMaxWidth =
    maxWidth === "auto" ? "100%" : maxWidth || getMaxContentWidth();
  const containerPadding = noPadding ? 0 : getContainerPadding();

  const containerStyle: ViewStyle = {
    width: "100%",
    maxWidth: containerMaxWidth,
    paddingHorizontal: containerPadding,
    ...(centerContent &&
      isWeb && {
        marginHorizontal: "auto",
        alignSelf: "center",
      }),
  };

  return <View style={[containerStyle, style]}>{children}</View>;
};

export default ResponsiveContainer;
