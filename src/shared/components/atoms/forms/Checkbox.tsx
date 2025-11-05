import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import { MentalHealthIcon } from "../icons";

const Checkbox = ({
  label = "",
  checked = false,
  onPress = () => {},
  size = "medium",
  variant = "default",
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { theme, isDarkMode } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (!disabled) {
      onPress(!checked);
    }
  };

  const getCheckboxSize = () => {
    switch (size) {
      case "small":
        return 16;
      case "large":
        return 28;
      default:
        return 20;
    }
  };

  const getTherapeuticColor = () => {
    if (disabled) return theme.colors.gray["400"];

    switch (variant) {
      case "calming":
        return theme.colors.therapeutic.calming[500];
      case "nurturing":
        return theme.colors.therapeutic.nurturing[500];
      case "peaceful":
        return theme.colors.therapeutic.peaceful[500];
      case "grounding":
        return theme.colors.therapeutic.grounding[500];
      default:
        return theme.colors.primary["500"];
    }
  };

  const checkboxSize = getCheckboxSize();
  const therapeuticColor = getTherapeuticColor();

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.container, disabled && styles.disabled]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={accessibilityLabel || label}
        accessibilityHint={
          accessibilityHint || `${checked ? "Uncheck" : "Check"} this option`
        }
      >
        <View
          style={[
            styles.checkbox,
            {
              width: checkboxSize,
              height: checkboxSize,
              borderColor: checked
                ? therapeuticColor
                : theme.colors.border.primary,
              backgroundColor: checked ? therapeuticColor : "transparent",
            },
            checked && styles.checked,
            isPressed && styles.pressed,
          ]}
        >
          {checked && (
            <MentalHealthIcon
              name="Heart"
              size={checkboxSize * 0.6}
              color={theme.colors.background.primary}
              variant="filled"
            />
          )}
        </View>

        {label && (
          <Text
            style={[
              styles.label,
              {
                color: disabled
                  ? theme.colors.text.tertiary
                  : theme.colors.text.primary,
                fontSize: size === "large" ? 16 : size === "small" ? 12 : 14,
              },
            ]}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44, // WCAG touch target
    paddingVertical: 8,
  },
  checkbox: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
  },
  checked: {
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    flex: 1,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Checkbox;
