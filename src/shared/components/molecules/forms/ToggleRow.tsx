/**
 * ToggleRow — settings row with label, optional description, and a Toggle switch (prototype v4.2)
 *
 * Used on screen 37 Account Settings. Renders a full-width row with label text
 * on the left and a Toggle atom on the right. Tapping anywhere on the row fires
 * onValueChange.
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { Toggle } from "@/shared/components/atoms/forms/Toggle";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ToggleRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ToggleRow({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
  testID,
  style,
}: ToggleRowProps): React.ReactElement {
  const { palette } = useTheme();

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.85}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      style={[
        styles.row,
        {
          borderBottomColor: palette.midnight[700],
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {/* Left: label + description */}
      <View style={styles.textColumn}>
        <Text
          style={[
            styles.label,
            { color: palette.warm[50] },
          ]}
        >
          {label}
        </Text>
        {description ? (
          <Text
            style={[
              styles.description,
              { color: palette.warm[400] },
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {/* Right: Toggle atom — pointer events none so the row handles the tap */}
      <View pointerEvents="none">
        <Toggle
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          accessibilityLabel={label}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  description: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  label: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    lineHeight: 22,
  },
  row: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textColumn: {
    flex: 1,
    marginRight: 12,
  },
});

export default ToggleRow;
