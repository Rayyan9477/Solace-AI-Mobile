/**
 * ScoreCardV2 — Hero score card for Home v2 (screen 20) and Assessment Results (screen 19).
 * Uses ScoreRing (tri-stop gradient) with GlassCard surface.
 *
 * @phase Sprint 5: prototype-v4.2 organisms
 */

import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  GlassCard,
  BracketLabel,
  ScoreRing,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

export interface ScoreCardV2Props {
  score: number;
  size?: "compact" | "hero";
  label?: string;
  bracketKicker?: string;
  delta?: number;
  variant?: "sage-aurora" | "lavender-aurora" | "peach-aurora";
  subtitle?: string;
  onPress?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

const RING_SIZE: Record<"compact" | "hero", number> = {
  compact: 120,
  hero: 200,
};

const SCORE_FONT_SIZE: Record<"compact" | "hero", number> = {
  compact: 40,
  hero: 64,
};

export function ScoreCardV2({
  score,
  size = "hero",
  label = "Solace Score",
  bracketKicker,
  delta,
  subtitle,
  onPress,
  testID,
  style,
}: ScoreCardV2Props): React.ReactElement {
  const { palette, typography } = useTheme();

  const ringSize = RING_SIZE[size];
  const scoreFontSize = SCORE_FONT_SIZE[size];

  const deltaLabel =
    delta !== undefined
      ? delta >= 0
        ? `↑ +${delta} this week`
        : `↓ ${delta} this week`
      : null;

  const deltaColor = delta !== undefined && delta >= 0
    ? palette.sage[300]
    : palette.peach[300];

  const a11yLabel = `${label}, ${score} out of 100${delta !== undefined ? `, ${deltaLabel}` : ""}`;

  const inner = (
    <GlassCard
      testID={testID}
      style={[styles.card, style]}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={onPress ? a11yLabel : undefined}
    >
      {bracketKicker ? (
        <BracketLabel variant="sage" style={styles.kicker}>
          {bracketKicker}
        </BracketLabel>
      ) : null}

      <ScoreRing
        value={score}
        size={ringSize}
        accessibilityLabel={a11yLabel}
        style={styles.ring}
      >
        <View style={styles.ringInner}>
          <Text
            style={[
              styles.scoreNumber,
              {
                fontSize: scoreFontSize,
                color: palette.warm[50],
                fontFamily: typography.fontFamily.display,
              },
            ]}
          >
            {score}
          </Text>
          <Text
            style={[
              styles.scoreUnit,
              {
                color: palette.warm[400],
                fontFamily: typography.fontFamily.sansMedium,
              },
            ]}
          >
            /100
          </Text>
        </View>
      </ScoreRing>

      {subtitle ? (
        <Text
          style={[
            styles.subtitle,
            {
              color: palette.warm[400],
              fontFamily: typography.fontFamily.sansMedium,
            },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}

      {deltaLabel ? (
        <View
          testID={testID ? `${testID}-delta` : undefined}
          style={styles.deltaChip}
        >
          <Text
            style={[
              styles.deltaText,
              { color: deltaColor, fontFamily: typography.fontFamily.sansMedium },
            ]}
          >
            {deltaLabel}
          </Text>
        </View>
      ) : null}
    </GlassCard>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        testID={testID ? `${testID}-pressable` : undefined}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        style={style}
      >
        {inner}
      </TouchableOpacity>
    );
  }

  return (
    <View
      testID={testID ? `${testID}-static` : undefined}
      accessibilityLabel={a11yLabel}
      style={style}
    >
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    padding: 24,
  },
  deltaChip: {
    marginTop: 10,
  },
  deltaText: {
    fontSize: 13,
  },
  kicker: {
    marginBottom: 16,
  },
  ring: {
    marginBottom: 8,
  },
  ringInner: {
    alignItems: "center",
  },
  scoreNumber: {
    lineHeight: undefined,
  },
  scoreUnit: {
    fontSize: 14,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
});

export default ScoreCardV2;
