/**
 * StackedNotificationCards — stacked card deck for notification primer (prototype v4.2)
 *
 * Screen 17 Notification primer. Renders up to 3 GlassCard instances stacked
 * with parallax depth — each successive card sits lower, is slightly smaller,
 * and is more transparent, simulating a physical deck of cards.
 *
 * The topmost card (index 0) is the only card announced to screen readers;
 * cards below are hidden from the a11y tree.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useTheme } from "@/shared/theme/useTheme";
import { GlassCard } from "@/shared/components/primitives/GlassCard";
import { IconTile } from "@/shared/components/primitives/IconTile";
import type { IconTileHue } from "@/shared/components/primitives/IconTile";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StackedNotification {
  id: string;
  iconName: string;
  iconHue?: "sage" | "aurora" | "peach" | "lavender";
  title: string;
  message: string;
}

export interface StackedNotificationCardsProps {
  cards: StackedNotification[];
  /** Outer width of the stack. Default 320. */
  width?: number;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Per-index depth config — top = index 0
// ---------------------------------------------------------------------------

interface DepthConfig {
  translateY: number;
  scale: number;
  opacity: number;
  zIndex: number;
}

const DEPTH: DepthConfig[] = [
  { translateY: 0,  scale: 1,    opacity: 1,    zIndex: 30 },
  { translateY: 12, scale: 0.96, opacity: 0.7,  zIndex: 20 },
  { translateY: 24, scale: 0.92, opacity: 0.45, zIndex: 10 },
];

const CARD_HEIGHT = 96;
const MAX_STACK_OFFSET = 24; // translateY of deepest card
const CONTAINER_HEIGHT = CARD_HEIGHT + MAX_STACK_OFFSET;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StackedNotificationCards({
  cards,
  width = 320,
  testID,
}: StackedNotificationCardsProps): React.ReactElement {
  const { palette } = useTheme();

  const topCard = cards[0];

  // Build a11y label from all cards for the topmost card
  const topA11yLabel = cards
    .map((c) => `${c.title}: ${c.message}`)
    .join(". ");

  return (
    <View
      testID={testID}
      accessibilityRole="list"
      style={[styles.container, { width, height: CONTAINER_HEIGHT }]}
    >
      {cards.slice(0, 3).map((card, index) => {
        const depth = DEPTH[index] ?? DEPTH[2];
        const isTop = index === 0;

        return (
          <View
            key={card.id}
            accessible={isTop}
            accessibilityRole={isTop ? "text" : undefined}
            accessibilityLabel={isTop ? topA11yLabel : undefined}
            accessibilityElementsHidden={!isTop}
            importantForAccessibility={isTop ? "yes" : "no-hide-descendants"}
            style={[
              styles.cardWrapper,
              {
                width,
                height: CARD_HEIGHT,
                zIndex: depth.zIndex,
                opacity: depth.opacity,
                transform: [
                  { translateY: depth.translateY },
                  { scaleX: depth.scale },
                ],
              },
            ]}
          >
            <GlassCard style={styles.card}>
              <View style={styles.cardInner}>
                <IconTile
                  iconName={card.iconName}
                  hue={(card.iconHue ?? "sage") as IconTileHue}
                  variant="soft"
                  size={40}
                />
                <View style={styles.textBlock}>
                  <Text
                    style={[styles.title, { color: palette.warm[50] }]}
                    numberOfLines={1}
                  >
                    {card.title}
                  </Text>
                  <Text
                    style={[styles.message, { color: palette.warm[400] }]}
                    numberOfLines={2}
                  >
                    {card.message}
                  </Text>
                </View>
              </View>
            </GlassCard>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  cardWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  card: {
    flex: 1,
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 14,
    minHeight: CARD_HEIGHT,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontFamily: "Fraunces_700Bold",
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 4,
  },
  message: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
});
