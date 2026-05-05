/**
 * SocialButton — OAuth provider button molecule (prototype v4.2)
 *
 * Used on screen 02 Sign In in a 3-col grid. Renders a 56×56 glass tile with
 * the provider logo icon and haptic feedback on press.
 *
 * Providers: "apple" | "google" | "github"
 */

import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { useHaptic } from "@/shared/hooks/useHaptic";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";

const PROVIDER_ICON: Record<SocialButtonProps["provider"], string> = {
  apple: "apple",
  google: "logo-google",
  github: "logo-github",
};

export interface SocialButtonProps {
  provider: "apple" | "google" | "github";
  onPress: () => void;
  /** Outer tile dimension. Default 56. */
  size?: number;
  /** Icon size inside the tile. Default 24. */
  iconSize?: number;
  testID?: string;
}

export function SocialButton({
  provider,
  onPress,
  size = 56,
  iconSize = 24,
  testID,
}: SocialButtonProps): React.ReactElement {
  const { palette } = useTheme();
  const haptic = useHaptic();

  const handlePress = () => {
    haptic.light();
    onPress();
  };

  return (
    <TouchableOpacity
      testID={testID}
      onPress={handlePress}
      activeOpacity={0.75}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={`Sign in with ${provider}`}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          backgroundColor: palette.midnight[700],
          borderColor: "rgba(255,255,255,0.08)",
        },
      ]}
    >
      <AppIcon
        name={PROVIDER_ICON[provider]}
        size={iconSize}
        color={palette.warm[50]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
  },
});

export default SocialButton;
