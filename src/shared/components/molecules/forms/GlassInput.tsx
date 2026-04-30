/**
 * GlassInput — glass-backed text input molecule (prototype v4.2)
 *
 * Used on screen 02 Sign In and screen 36 Search. Wraps RN TextInput with:
 *   - midnight[700] glass background + 1px rgba border
 *   - optional Lucide prefix icon via AppIcon
 *   - optional password eye-toggle suffix (auto-shown when secureTextEntry=true)
 *   - error text below in peach[300]
 */

import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { useHaptic } from "@/shared/hooks/useHaptic";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";

export interface GlassInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Lucide icon name for prefix; rendered via AppIcon */
  iconName?: string;
  /** Password mode; auto-shows eye/eye-off toggle */
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoComplete?: "email" | "password" | "name" | "off";
  /** Shown below input in peach[300] when set */
  errorText?: string;
  accessibilityLabel: string;
  testID?: string;
}

export function GlassInput({
  value,
  onChangeText,
  placeholder,
  iconName,
  secureTextEntry = false,
  keyboardType = "default",
  autoComplete,
  errorText,
  accessibilityLabel,
  testID,
}: GlassInputProps): React.ReactElement {
  const { palette } = useTheme();
  const haptic = useHaptic();
  const [hidden, setHidden] = useState(secureTextEntry);

  const toggleHidden = () => {
    haptic.light();
    setHidden((prev) => !prev);
  };

  return (
    <View testID={testID}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: palette.midnight[700],
            borderColor: "rgba(255,255,255,0.08)",
          },
        ]}
      >
        {iconName ? (
          <View style={styles.prefixIcon} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <AppIcon name={iconName} size={24} color={palette.warm[400]} />
          </View>
        ) : null}

        <TextInput
          testID={testID ? `${testID}-input` : undefined}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.warm[500]}
          secureTextEntry={secureTextEntry ? hidden : false}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ selected: false }}
          style={[
            styles.input,
            {
              color: palette.warm[50],
            },
          ]}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            testID={testID ? `${testID}-toggle` : undefined}
            onPress={toggleHidden}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.toggleButton}
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            <AppIcon
              name={hidden ? "eye" : "eye-off"}
              size={22}
              color={palette.warm[400]}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {errorText ? (
        <Text
          testID={testID ? `${testID}-error` : undefined}
          style={[styles.errorText, { color: palette.peach[300] }]}
          accessibilityRole="alert"
        >
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  prefixIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    paddingVertical: 14,
  },
  toggleButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  errorText: {
    fontSize: 13,
    marginTop: 6,
  },
});

export default GlassInput;
