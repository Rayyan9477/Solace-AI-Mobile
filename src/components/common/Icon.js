import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";

const Icon = ({
  name,
  size = 24,
  color,
  style,
  onPress,
  accessibilityLabel,
}) => {
  const { theme } = useTheme();

  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color || theme.colors.text.primary}
      style={[styles.icon, style]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={onPress ? "button" : "image"}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    alignSelf: "center",
  },
});

export default Icon;
