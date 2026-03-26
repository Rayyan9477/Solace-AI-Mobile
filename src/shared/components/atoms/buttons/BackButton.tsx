/**
 * BackButton - Unified back navigation button
 * Replaces 4 different glyph variants (←, <, ☽, \u2190) with consistent Ionicons chevron
 */
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { palette } from "../../../theme";

interface BackButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function BackButton({
  onPress,
  color = palette.white,
  size = 22,
  style,
  testID = "back-button",
}: BackButtonProps): React.ReactElement {
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={[styles.container, style]}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Icon name="chevron-back-outline" size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
