/**
 * ChatBubbleAction — embedded action card inside an AI chat bubble (prototype v4.2).
 *
 * Surfaces an actionable suggestion (e.g., "Try a 4-7-8 breathing exercise")
 * inside the AI message stream on screen 07 AI Chat. Wraps a GlassAuroraCard
 * with a leading IconTile, title/subtitle copy block, and a CTA pill.
 *
 * @task Sprint 5: Chat organisms — ChatBubbleAction
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
import { GlassAuroraCard, IconTile } from "@/shared/components/primitives";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatBubbleActionProps {
  /** Lucide icon name forwarded to IconTile. Defaults to "wind". */
  iconName?: string;
  /** Card heading, e.g. "4-7-8 Breathing". */
  title: string;
  /** Subtitle line, e.g. "2 minutes · Calming". */
  subtitle?: string;
  /** CTA button label. Defaults to "Try now". */
  ctaLabel?: string;
  onPress: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ChatBubbleAction({
  iconName = "wind",
  title,
  subtitle,
  ctaLabel = "Try now",
  onPress,
  testID,
  style,
}: ChatBubbleActionProps): React.ReactElement {
  const { palette } = useTheme();
  useReducedMotion();

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${ctaLabel}`}
      style={style}
    >
      <GlassAuroraCard radius={16} style={styles.card}>
        <View style={styles.inner}>
          {/* Leading icon tile */}
          <IconTile
            iconName={iconName}
            size={44}
            hue="aurora"
            variant="soft"
            shape="rounded"
            accessibilityLabel={title}
          />

          {/* Title + subtitle */}
          <View style={styles.textBlock}>
            <Text
              style={[styles.title, { color: palette.warm[50] }]}
              numberOfLines={2}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={[styles.subtitle, { color: palette.warm[400] }]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* CTA pill */}
          <View
            style={[
              styles.ctaPill,
              { backgroundColor: palette.sage[300] },
            ]}
          >
            <Text
              style={[
                styles.ctaText,
                { color: palette.midnight[950] },
              ]}
            >
              {ctaLabel}
            </Text>
          </View>
        </View>
      </GlassAuroraCard>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    // radius handled by GlassAuroraCard
  },
  ctaPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ctaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    lineHeight: 16,
  },
  inner: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  textBlock: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Fraunces_500Medium",
    fontSize: 14,
    lineHeight: 18,
  },
});

export default ChatBubbleAction;
