/**
 * SolaceNoticedCard — AI insight card (prototype v4.2).
 *
 * Displays a sage-gradient-bordered card on screen 29 Journal detail.
 * Uses HeroCard for the gradient hairline border and BracketLabel for the
 * "AI INSIGHT" kicker. Optional dismiss button with 44pt touch target.
 *
 * @example
 *   <SolaceNoticedCard
 *     insight="You've journaled 5 days in a row — that consistency correlates with lower stress scores."
 *     onDismiss={() => setDismissed(true)}
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

import { HeroCard, BracketLabel } from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

export interface SolaceNoticedCardProps {
  insight: string;
  onDismiss?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

export function SolaceNoticedCard({
  insight,
  onDismiss,
  testID,
  style,
}: SolaceNoticedCardProps): React.ReactElement {
  const { palette } = useTheme();

  return (
    <HeroCard testID={testID} radius={16} style={style}>
      <View
        style={[styles.inner, { backgroundColor: palette.midnight[800] }]}
        accessibilityRole="text"
        accessibilityLabel={`AI insight: ${insight}`}
      >
        {/* Top row: kicker + dismiss button */}
        <View style={styles.topRow}>
          <BracketLabel variant="sage">AI INSIGHT</BracketLabel>

          {onDismiss ? (
            <TouchableOpacity
              onPress={onDismiss}
              style={styles.dismissHit}
              accessibilityRole="button"
              accessibilityLabel="Dismiss AI insight"
              testID={testID ? `${testID}-dismiss` : undefined}
            >
              <Text style={[styles.dismissGlyph, { color: palette.warm[400] }]}>
                ×
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: palette.warm[50] }]}>
          Solace noticed...
        </Text>

        {/* Body */}
        <Text style={[styles.body, { color: palette.warm[100] }]}>
          {insight}
        </Text>
      </View>
    </HeroCard>
  );
}

const styles = StyleSheet.create({
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  dismissGlyph: {
    fontSize: 18,
    lineHeight: 18,
  },
  dismissHit: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    top: -12,
    width: 44,
  },
  inner: {
    flexDirection: "column",
    gap: 8,
    padding: 16,
  },
  title: {
    fontFamily: "Fraunces_500Medium",
    fontSize: 14,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
  },
});
