/**
 * EmptyStateScreen — prototype v4.2 #40 (Sprint 9 Batch B).
 *
 * Reusable cosmic-empty-state template. Decorative BreathingOrb top-center,
 * editorial Fraunces headline with optional italic accent, warm subtitle,
 * optional GlassCard prompt list, and a primary CTA. Designed to be reused
 * by Journal, Mood, Library, etc. — accept any `headline`, `subtitle`,
 * `prompts`, and `illustration` overrides.
 *
 * Maps to `prototypes/screens/40-empty.js`.
 */

import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { Button } from "@/shared/components/atoms/buttons/Button";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  BracketLabel,
  BreathingOrb,
  GlassCard,
  IconTile,
} from "@/shared/components/primitives";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

// ─── Public API ──────────────────────────────────────────────────────────────

export interface EmptyStateHeadline {
  /** First line of the headline (regular weight) */
  first: string;
  /** Second line of the headline (italic accent) */
  second: string;
}

export interface EmptyStateScreenProps {
  /** Optional bracket title in the mini-header (e.g. "Journal"). */
  headerTitle?: string;
  /** Aurora bracket above headline. Default "Start somewhere". */
  bracketLabel?: string;
  /**
   * Headline. Accepts a string with `\n` separator (italic accent will be
   * applied to the second line) OR a typed `{ first, second }` object.
   * Defaults to "Your story\nbegins here.".
   */
  headline?: string | EmptyStateHeadline;
  /** Warm-400 supporting copy. */
  subtitle?: string;
  /**
   * Optional list of suggested prompts. When provided, each renders as a
   * tappable GlassCard row → `onPromptPress(prompt)`.
   */
  prompts?: readonly string[];
  /** Primary CTA label. Default "Write freely". */
  ctaLabel?: string;
  /**
   * Optional decorative illustration ReactNode. Defaults to a 176×176
   * decorative BreathingOrb fallback.
   */
  illustration?: React.ReactNode;
  onPromptPress?: (_prompt: string) => void;
  onCta: () => void;
  onBack?: () => void;
  testID?: string;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_PROMPTS: readonly string[] = [
  "How are you feeling right now?",
  "What's one small win from today?",
  "What's weighing on your mind?",
] as const;

const DEFAULT_HEADLINE: EmptyStateHeadline = {
  first: "Your story",
  second: "begins here.",
};

const DEFAULT_SUBTITLE =
  "No need for perfect words. Write one sentence — we'll take it from there.";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const normaliseHeadline = (
  raw: string | EmptyStateHeadline | undefined,
): EmptyStateHeadline => {
  if (!raw) return DEFAULT_HEADLINE;
  if (typeof raw === "string") {
    const [first, ...rest] = raw.split("\n");
    return {
      first: first ?? DEFAULT_HEADLINE.first,
      second: rest.join("\n") || DEFAULT_HEADLINE.second,
    };
  }
  return raw;
};

// ─── Component ───────────────────────────────────────────────────────────────

export function EmptyStateScreen({
  headerTitle,
  bracketLabel = "Start somewhere",
  headline,
  subtitle = DEFAULT_SUBTITLE,
  prompts = DEFAULT_PROMPTS,
  ctaLabel = "Write freely",
  illustration,
  onPromptPress,
  onCta,
  onBack,
  testID = "empty-state-screen",
}: EmptyStateScreenProps): React.ReactElement {
  const { palette } = useTheme();
  const reducedMotion = useReducedMotion();

  const resolvedHeadline = useMemo(
    () => normaliseHeadline(headline),
    [headline],
  );

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      {/* Mini header */}
      <View style={styles.headerRow}>
        {onBack ? (
          <TouchableOpacity
            testID="empty-back-button"
            style={[
              styles.headerIcon,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <AppIcon name="arrow-left" size={18} color={palette.warm[400]} />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}

        {headerTitle ? (
          <View testID="empty-header-label">
            <BracketLabel variant="muted" style={styles.headerLabel}>
              {headerTitle}
            </BracketLabel>
          </View>
        ) : (
          <View style={styles.headerSpacer} />
        )}

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Decorative illustration */}
        <View
          style={styles.illustrationWrap}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          testID="empty-illustration-wrap"
        >
          {illustration ?? (
            <View style={styles.defaultIllustration}>
              <BreathingOrb
                testID="empty-default-orb"
                size={176}
                tint="cool"
                pulsing={!reducedMotion}
              />
            </View>
          )}
        </View>

        {/* Bracket label */}
        <View testID="empty-bracket-label">
          <BracketLabel variant="aurora" style={styles.bracket}>
            {bracketLabel}
          </BracketLabel>
        </View>

        {/* Headline */}
        <Text
          testID="empty-headline"
          accessibilityRole="header"
          style={[styles.headline, { color: palette.warm[50] }]}
        >
          {resolvedHeadline.first}
          {"\n"}
          <Text style={styles.headlineItalic}>
            {resolvedHeadline.second}
          </Text>
        </Text>

        {/* Subtitle */}
        <Text
          testID="empty-subtitle"
          style={[styles.subtitle, { color: palette.warm[400] }]}
          accessibilityRole="text"
        >
          {subtitle}
        </Text>

        {/* Prompts */}
        {prompts && prompts.length > 0 ? (
          <View
            style={styles.promptList}
            accessibilityRole="list"
            testID="empty-prompts"
          >
            {prompts.map((prompt, index) => (
              <TouchableOpacity
                key={prompt}
                testID={`empty-prompt-${index}`}
                onPress={() => onPromptPress?.(prompt)}
                accessibilityRole="button"
                accessibilityLabel={prompt}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                style={styles.promptTouch}
              >
                <GlassCard radius={18} style={styles.promptCard}>
                  <View style={styles.promptRow}>
                    <IconTile
                      iconName="pen-line"
                      hue="sage"
                      size={28}
                      iconSize={14}
                    />
                    <Text
                      style={[
                        styles.promptText,
                        { color: palette.warm[100] },
                      ]}
                      numberOfLines={2}
                    >
                      {prompt}
                    </Text>
                    <AppIcon
                      name="chevron-right"
                      size={14}
                      color={palette.warm[500]}
                    />
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {/* Primary CTA */}
        <Button
          testID="empty-cta-button"
          label={ctaLabel}
          variant="primary"
          fullWidth
          onPress={onCta}
          accessibilityLabel={ctaLabel}
          leftIcon={
            <AppIcon
              name="pen-line"
              size={16}
              color={palette.midnight[950]}
            />
          }
          style={{
            ...styles.ctaButton,
            backgroundColor: palette.peach[300],
          }}
          labelStyle={{ color: palette.midnight[950] }}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bracket: {
    marginBottom: 8,
    textAlign: "center",
  },
  ctaButton: {
    borderRadius: 28,
    marginTop: 4,
  },
  defaultIllustration: {
    alignItems: "center",
    height: 176,
    justifyContent: "center",
    width: 176,
  },
  headerIcon: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  headerLabel: {
    textAlign: "center",
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerSpacer: {
    height: 44,
    width: 44,
  },
  headline: {
    fontFamily: "Fraunces_300Light",
    fontSize: 30,
    lineHeight: 32,
    marginBottom: 12,
    textAlign: "center",
  },
  headlineItalic: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontStyle: "italic",
  },
  illustrationWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  promptCard: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  promptList: {
    gap: 8,
    marginBottom: 28,
    width: "100%",
  },
  promptRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    minHeight: 44,
  },
  promptText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  promptTouch: {
    minHeight: 52,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 28,
    maxWidth: 260,
    textAlign: "center",
  },
});

export default EmptyStateScreen;
