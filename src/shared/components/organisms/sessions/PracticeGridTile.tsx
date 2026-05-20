/**
 * PracticeGridTile — mindfulness library grid item (prototype v4.2).
 *
 * Used on screen 30 Mindfulness library for meditations / breathing /
 * body-scan tiles. Gradient thumbnail (variant-driven) with a floating icon,
 * category kicker, title, and duration.
 *
 * Callers size via flex / percentage — set width:"48%" in `style` for a
 * 2-column grid with an 8dp gap.
 *
 * @example
 *   <PracticeGridTile
 *     title="4-7-8 Breathing"
 *     category="BREATHING"
 *     durationMinutes={5}
 *     variant="lavender"
 *     iconName="wind"
 *     onPress={() => navigate("breathing-478")}
 *     style={{ width: "48%" }}
 *   />
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
import { LinearGradient } from "expo-linear-gradient";

import { BracketLabel } from "@/shared/components/primitives";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { useTheme } from "@/shared/theme/useTheme";

export interface PracticeGridTileProps {
  title: string;
  category: string;
  durationMinutes: number;
  variant?: "sage" | "aurora" | "peach" | "lavender";
  iconName?: string;
  onPress: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function PracticeGridTile({
  title,
  category,
  durationMinutes,
  variant = "sage",
  iconName = "wind",
  onPress,
  testID,
  style,
}: PracticeGridTileProps): React.ReactElement {
  const { palette } = useTheme();

  const GRADIENTS: Record<
    NonNullable<PracticeGridTileProps["variant"]>,
    [string, string]
  > = {
    sage: [palette.sage[300], palette.aurora[300]],
    aurora: [palette.aurora[300], palette.aurora[500]],
    peach: [palette.peach[300], palette.peach[500]],
    lavender: [palette.lavender[300], palette.lavender[500]],
  };

  const gradientColors = GRADIENTS[variant];

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${category}, ${durationMinutes} minutes`}
      style={[styles.card, style]}
    >
      {/* Gradient thumbnail area */}
      <View style={styles.thumbnail}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Floating icon centered over gradient */}
        <AppIcon
          name={iconName}
          size={36}
          color={palette.warm[50]}
          style={styles.icon}
        />
      </View>

      {/* Info strip below gradient */}
      <View
        style={[styles.infoStrip, { backgroundColor: palette.midnight[800] }]}
      >
        <BracketLabel variant="muted" style={styles.category}>
          {category}
        </BracketLabel>
        <Text
          style={[styles.title, { color: palette.warm[50] }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={styles.durationRow}>
          <AppIcon
            name="clock"
            size={11}
            color={palette.warm[400]}
          />
          <Text style={[styles.duration, { color: palette.warm[400] }]}>
            {` ${durationMinutes} min`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    height: 160,
    overflow: "hidden",
    position: "relative",
  },
  category: {
    fontSize: 10,
    marginBottom: 2,
  },
  duration: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  durationRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 4,
  },
  icon: {
    alignSelf: "center",
  },
  infoStrip: {
    bottom: 0,
    height: 60,
    left: 0,
    padding: 12,
    position: "absolute",
    right: 0,
  },
  thumbnail: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    position: "relative",
  },
  title: {
    fontFamily: "Fraunces_500Medium",
    fontSize: 14,
  },
});
