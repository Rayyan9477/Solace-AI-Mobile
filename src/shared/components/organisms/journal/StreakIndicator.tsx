/**
 * StreakIndicator — Flame + streak count for Journal header (screen 08).
 *
 * @phase Sprint 5: prototype-v4.2 organisms
 */

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { useTheme } from "@/shared/theme/useTheme";

export type StreakIndicatorSize = "sm" | "md";

export interface StreakIndicatorProps {
  count: number;
  size?: StreakIndicatorSize;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

const ICON_SIZE: Record<StreakIndicatorSize, number> = {
  sm: 14,
  md: 16,
};

const TEXT_SIZE: Record<StreakIndicatorSize, number> = {
  sm: 12,
  md: 13,
};

export function StreakIndicator({
  count,
  size = "md",
  testID,
  style,
}: StreakIndicatorProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const iconSize = ICON_SIZE[size];
  const textSize = TEXT_SIZE[size];

  // peach[300] at 0.15 opacity as background
  const bgColor = hexToRgba(palette.peach[300], 0.15);

  return (
    <View
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={`${count} day streak`}
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor: palette.peach[300],
        },
        style,
      ]}
    >
      <AppIcon
        name="flame"
        size={iconSize}
        color={palette.peach[300]}
      />
      <Text
        style={[
          styles.count,
          {
            fontSize: textSize,
            color: palette.peach[300],
            fontFamily: typography.fontFamily.sansSemibold,
          },
        ]}
      >
        {count}
      </Text>
    </View>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  count: {
    lineHeight: 18,
  },
});

export default StreakIndicator;
