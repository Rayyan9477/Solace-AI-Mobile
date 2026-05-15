/**
 * ContinueCard — "Continue your practice" hero card with embedded BreathingOrb.
 * Used on Home v2 (screen 20).
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
  HeroCard,
  BreathingOrb,
  BracketLabel,
  IconTile,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

export interface ContinueCardProps {
  practiceTitle: string;
  practiceSubtitle?: string;
  ctaLabel?: string;
  onPress: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function ContinueCard({
  practiceTitle,
  practiceSubtitle,
  ctaLabel = "Continue",
  onPress,
  testID,
  style,
}: ContinueCardProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const a11yLabel = [ctaLabel, practiceTitle, practiceSubtitle]
    .filter(Boolean)
    .join(", ");

  return (
    <HeroCard testID={testID} style={style} radius={24}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        style={styles.touchable}
      >
        {/* Leading: small BreathingOrb — decorative, hidden from a11y */}
        <BreathingOrb size={64} tint="cool" />

        {/* Middle: text column */}
        <View style={styles.textColumn}>
          <BracketLabel variant="sage">{ctaLabel}</BracketLabel>
          <Text
            style={[
              styles.title,
              {
                color: palette.warm[50],
                fontFamily: typography.fontFamily.display,
              },
            ]}
            numberOfLines={2}
          >
            {practiceTitle}
          </Text>
          {practiceSubtitle ? (
            <Text
              style={[
                styles.subtitle,
                {
                  color: palette.warm[400],
                  fontFamily: typography.fontFamily.sans,
                },
              ]}
              numberOfLines={1}
            >
              {practiceSubtitle}
            </Text>
          ) : null}
        </View>

        {/* Trailing: arrow icon in sage tile */}
        <IconTile
          iconName="arrow-right"
          hue="sage"
          variant="soft"
          size={44}
          shape="rounded"
        />
      </TouchableOpacity>
    </HeroCard>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
  textColumn: {
    flex: 1,
    gap: 4,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 4,
  },
  touchable: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    minHeight: 44,
    padding: 20,
  },
});

export default ContinueCard;
