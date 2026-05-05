/**
 * HashtagChip — purpose-built #tag chip (prototype v4.2)
 *
 * Used on screens 28 Journal composer and 29 Journal detail. Smaller and more
 * focused than the generic Chip atom — optimised for hashtag UX. The "#"
 * prefix is always rendered by the component.
 *
 * When `onPress` is provided the entire chip is pressable.
 * When `onRemove` is provided an X button appears to the right.
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { useHaptic } from "@/shared/hooks/useHaptic";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HashtagChipProps {
  /** Tag label without the "#" prefix — component prepends it. */
  label: string;
  selected?: boolean;
  onPress?: () => void;
  /** When provided, shows a 16px × icon with a separate touch target. */
  onRemove?: () => void;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HashtagChip({
  label,
  selected = false,
  onPress,
  onRemove,
  testID,
}: HashtagChipProps): React.ReactElement {
  const { palette } = useTheme();
  const haptic = useHaptic();

  const handlePress = () => {
    haptic.selection();
    onPress?.();
  };

  const handleRemove = () => {
    haptic.light();
    onRemove?.();
  };

  const backgroundColor = selected
    ? `${palette.aurora[300]}2E` // aurora[300] at ~18% opacity
    : palette.midnight[700];

  const textColor = selected ? palette.aurora[300] : palette.warm[200];

  const inner = (
    <View
      style={[styles.inner, { backgroundColor }]}
      accessible={!onPress}
      accessibilityRole={!onPress ? "button" : undefined}
      accessibilityLabel={!onPress ? `hashtag ${label}` : undefined}
      accessibilityState={!onPress ? { selected } : undefined}
    >
      <Text style={[styles.label, { color: textColor }]}>
        #{label}
      </Text>
      {onRemove && (
        <TouchableOpacity
          testID={testID ? `${testID}-remove` : undefined}
          onPress={handleRemove}
          accessibilityRole="button"
          accessibilityLabel={`Remove hashtag ${label}`}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
          style={styles.removeButton}
        >
          <AppIcon name="x" size={16} color={textColor} />
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        testID={testID}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`hashtag ${label}`}
        accessibilityState={{ selected }}
        hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        activeOpacity={0.75}
      >
        {inner}
      </TouchableOpacity>
    );
  }

  return (
    <View testID={testID}>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 999,
    flexDirection: "row",
    gap: 8,
    height: 28,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  label: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 13,
    lineHeight: 16,
  },
  removeButton: {
    alignItems: "center",
    justifyContent: "center",
    // hitSlop provides the 44pt target
  },
});
