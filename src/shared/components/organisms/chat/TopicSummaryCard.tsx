/**
 * TopicSummaryCard — session summary card for screen 26 Session Summary (prototype v4.2).
 *
 * Wraps a GlassCard and lists key insights as bullet rows with leading IconTiles.
 * Optionally surfaces a primary and secondary CTA at the bottom.
 *
 * @task Sprint 5: Chat organisms — TopicSummaryCard
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

import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { GlassCard, BracketLabel, IconTile } from "@/shared/components/primitives";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TopicSummaryItem {
  /** Optional Lucide/Ionicons icon name. Defaults to "check". */
  iconName?: string;
  /** Insight text. */
  text: string;
}

export interface TopicSummaryCardProps {
  /** Section heading, e.g. "What we explored". */
  topic: string;
  /** Optional kicker label rendered in BracketLabel above the topic, e.g. "INSIGHT". */
  bracket?: string;
  /** 2–5 bullet items. */
  items: TopicSummaryItem[];
  /** Primary CTA — filled sage[300] pill. */
  primaryAction?: { label: string; onPress: () => void };
  /** Secondary CTA — outlined transparent pill. */
  secondaryAction?: { label: string; onPress: () => void };
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TopicSummaryCard({
  topic,
  bracket,
  items,
  primaryAction,
  secondaryAction,
  testID,
  style,
}: TopicSummaryCardProps): React.ReactElement {
  const { palette } = useTheme();
  useReducedMotion();

  const hasActions = !!(primaryAction || secondaryAction);

  return (
    <GlassCard
      testID={testID}
      radius={20}
      style={[styles.card, style]}
    >
      {bracket ? (
        <BracketLabel variant="sage" style={styles.bracket}>
          {bracket}
        </BracketLabel>
      ) : null}

      <Text style={[styles.topic, { color: palette.warm[50] }]}>
        {topic}
      </Text>

      {/* Insight items */}
      <View style={styles.itemList}>
        {items.map((item, index) => (
          <View
            key={index}
            style={styles.itemRow}
            accessible
            accessibilityLabel={item.text}
          >
            <IconTile
              iconName={item.iconName ?? "check"}
              size={28}
              hue="sage"
              variant="soft"
              shape="rounded"
            />
            <Text
              style={[styles.itemText, { color: palette.warm[100] }]}
              numberOfLines={4}
            >
              {item.text}
            </Text>
          </View>
        ))}
      </View>

      {/* Action buttons */}
      {hasActions && (
        <View style={styles.actionRow}>
          {primaryAction && (
            <TouchableOpacity
              testID={testID ? `${testID}-primary` : undefined}
              style={[
                styles.actionButton,
                { backgroundColor: palette.sage[300] },
              ]}
              onPress={primaryAction.onPress}
              accessibilityRole="button"
              accessibilityLabel={primaryAction.label}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  { color: palette.midnight[950] },
                ]}
              >
                {primaryAction.label}
              </Text>
            </TouchableOpacity>
          )}

          {secondaryAction && (
            <TouchableOpacity
              testID={testID ? `${testID}-secondary` : undefined}
              style={[
                styles.actionButton,
                styles.actionButtonSecondary,
                { borderColor: palette.midnight[600] },
              ]}
              onPress={secondaryAction.onPress}
              accessibilityRole="button"
              accessibilityLabel={secondaryAction.label}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  { color: palette.warm[100] },
                ]}
              >
                {secondaryAction.label}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </GlassCard>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  actionButton: {
    alignItems: "center",
    borderRadius: 12,
    flex: 1,
    height: 44,
    justifyContent: "center",
  },
  actionButtonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  actionButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  bracket: {
    marginBottom: 8,
  },
  card: {
    padding: 20,
  },
  itemList: {
    gap: 0,
  },
  itemRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
  },
  itemText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  topic: {
    fontFamily: "Fraunces_500Medium",
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 12,
  },
});

export default TopicSummaryCard;
