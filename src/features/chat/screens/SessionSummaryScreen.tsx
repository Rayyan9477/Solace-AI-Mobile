/**
 * SessionSummaryScreen — prototype v4.2 #26 post-session recap (Sprint 8).
 *
 * Center hero: ConcentricRings cradling a sage-tinted check ring with two
 * small sparkle accents. Bracket date + minutes, big italic "Well done"
 * headline, then a HeroCard topic summary with chip row, a techniques list
 * card, and a peach-bordered HeroCard "small action" CTA. Bottom CTA: full-
 * width primary "Back to home".
 *
 * Maps to `prototypes/screens/26-session-summary.js`.
 */

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { ScreenContainer } from "@/shared/components/atoms/layout";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { Button } from "@/shared/components/atoms/buttons/Button";
import {
  BracketLabel,
  ConcentricRings,
  GlassCard,
  HeroCard,
  IconTile,
  type IconTileHue,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface SessionTopic {
  /** Short paragraph summarising what was discussed. */
  summary: string;
  /** Tag chips (e.g. "Work stress", "Anxiety"). */
  tags: string[];
}

export interface Technique {
  id: string;
  /** Lucide icon name (auto-resolved to Ionicons by AppIcon). */
  iconName: string;
  /** Hue family for the leading IconTile. */
  hue: IconTileHue;
  /** Technique name (Inter 500). */
  name: string;
  /** Caption (Inter 400, warm-500). */
  caption: string;
}

export interface SmallAction {
  /** Headline (e.g. "Small action for today"). */
  title: string;
  /** Body description. */
  body: string;
  /** Reminder CTA label. */
  ctaLabel: string;
}

export interface SessionSummaryScreenProps {
  /** First name to greet at the top. */
  firstName?: string;
  /** Date label (e.g. "April 9"). */
  sessionDate?: string;
  /** Minutes elapsed (rendered in mono "{n} min"). */
  sessionMinutes?: number;
  topic?: SessionTopic;
  techniques?: Technique[];
  smallAction?: SmallAction;
  onShare: () => void;
  onScheduleReminder: () => void;
  onBackToHome: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_TOPIC: SessionTopic = {
  summary:
    "You shared about work stress and how anxiety shows up before meetings. We explored thought patterns and practiced a grounding exercise together.",
  tags: ["Work stress", "Anxiety", "Meetings"],
};

export const DEFAULT_TECHNIQUES: Technique[] = [
  {
    id: "thought-reframing",
    iconName: "brain",
    hue: "sage",
    name: "Thought reframing",
    caption: "CBT technique",
  },
  {
    id: "breathing",
    iconName: "wind",
    hue: "lavender",
    name: "4-7-8 breathing",
    caption: "Grounding technique",
  },
];

export const DEFAULT_SMALL_ACTION: SmallAction = {
  title: "Small action for today",
  body: "Try the 5-minute breathing exercise before your 3pm meeting.",
  ctaLabel: "Schedule reminder",
};

// ---------------------------------------------------------------------------
// Hero check ring
// ---------------------------------------------------------------------------

function CheckHero(): React.ReactElement {
  const { palette } = useTheme();

  const tint = palette.sage[300];
  const innerBg = `${tint}26`;
  const innerBorder = `${tint}59`;

  return (
    <View
      testID="check-hero"
      style={heroStyles.wrap}
      accessibilityRole="image"
      accessibilityLabel="Session completed"
    >
      <ConcentricRings size={120} tint="sage" rings={3}>
        <View
          style={[
            heroStyles.inner,
            { backgroundColor: innerBg, borderColor: innerBorder },
          ]}
        >
          <AppIcon name="check" size={32} color={tint} />
        </View>
      </ConcentricRings>

      <View
        style={[heroStyles.sparklePeach, { backgroundColor: "transparent" }]}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <AppIcon name="sparkles" size={12} color={palette.peach[300]} />
      </View>

      <View
        style={[heroStyles.sparkleAurora, { backgroundColor: "transparent" }]}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <AppIcon name="sparkles" size={10} color={palette.aurora[300]} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export function SessionSummaryScreen({
  firstName = "Rayyan",
  sessionDate = "April 9",
  sessionMinutes = 14,
  topic = DEFAULT_TOPIC,
  techniques = DEFAULT_TECHNIQUES,
  smallAction = DEFAULT_SMALL_ACTION,
  onShare,
  onScheduleReminder,
  onBackToHome,
  testID = "session-summary-screen",
  style,
}: SessionSummaryScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();
  useReducedMotion();

  const peachBorder = `${palette.peach[300]}38`;
  const peachBg = `${palette.peach[300]}29`;
  const peachBgSoft = `${palette.peach[300]}0F`;

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={style as ViewStyle | undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Mini-header */}
        <View style={styles.miniHeader}>
          <Text
            testID="mini-header-title"
            accessibilityRole="header"
            style={[styles.miniHeaderText, { color: palette.warm[400] }]}
          >
            Session complete
          </Text>

          <TouchableOpacity
            testID="share-button"
            onPress={onShare}
            accessibilityRole="button"
            accessibilityLabel="Share summary"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[
              styles.iconButton,
              {
                backgroundColor: palette.midnight[800],
                borderColor: palette.midnight[600],
              },
            ]}
          >
            <AppIcon name="share-2" size={18} color={palette.warm[400]} />
          </TouchableOpacity>
        </View>

        {/* Hero check */}
        <View style={styles.heroWrap}>
          <CheckHero />
        </View>

        {/* Date bracket */}
        <View style={styles.dateRow}>
          <BracketLabel variant="sage">
            {`${sessionDate} · ${sessionMinutes} MIN`}
          </BracketLabel>
        </View>

        {/* Headline */}
        <Text
          testID="well-done-headline"
          accessibilityRole="header"
          style={[
            styles.headline,
            {
              color: palette.warm[50],
              fontFamily: typography.fontFamily.display,
            },
          ]}
        >
          {"Well done,\n"}
          <Text
            style={[
              styles.headlineItalic,
              {
                color: palette.warm[50],
                fontFamily: typography.fontFamily.displayItalic,
              },
            ]}
          >
            {`${firstName}.`}
          </Text>
        </Text>

        {/* Topic card */}
        <HeroCard testID="topic-hero" radius={24} style={styles.topicHero}>
          <GlassCard variant="strong" radius={23} style={styles.topicCard}>
            <BracketLabel variant="muted">What we talked about</BracketLabel>
            <Text
              testID="topic-summary"
              style={[styles.topicBody, { color: palette.warm[50] }]}
            >
              {topic.summary}
            </Text>
            <View style={styles.tagRow}>
              {topic.tags.map((tag) => (
                <View
                  key={tag}
                  testID={`topic-tag-${tag}`}
                  style={[
                    styles.tagChip,
                    { backgroundColor: palette.midnight[700] },
                  ]}
                  accessibilityRole="text"
                  accessibilityLabel={`Topic ${tag}`}
                >
                  <Text style={[styles.tagText, { color: palette.warm[200] }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </HeroCard>

        {/* Techniques used */}
        <GlassCard
          testID="techniques-card"
          radius={20}
          style={styles.techniquesCard}
        >
          <Text
            style={[styles.sectionLabel, { color: palette.warm[50] }]}
          >
            Techniques we used
          </Text>

          <View style={styles.techniquesList}>
            {techniques.map((t) => (
              <View
                key={t.id}
                testID={`technique-${t.id}`}
                style={styles.techniqueRow}
              >
                <IconTile
                  iconName={t.iconName}
                  hue={t.hue}
                  size={36}
                  iconSize={18}
                  variant="soft"
                />
                <View style={styles.techniqueText}>
                  <Text
                    style={[
                      styles.techniqueName,
                      { color: palette.warm[50] },
                    ]}
                  >
                    {t.name}
                  </Text>
                  <Text
                    style={[
                      styles.techniqueCaption,
                      { color: palette.warm[500] },
                    ]}
                  >
                    {t.caption}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Small action card */}
        <View
          testID="small-action-card"
          style={[
            styles.smallActionCard,
            {
              backgroundColor: palette.midnight[800],
              borderColor: peachBorder,
            },
          ]}
        >
          <View style={styles.smallActionHeader}>
            <IconTile
              iconName="target"
              hue="peach"
              size={36}
              iconSize={18}
              variant="soft"
            />
            <View style={styles.smallActionText}>
              <Text
                style={[
                  styles.smallActionTitle,
                  { color: palette.warm[50] },
                ]}
              >
                {smallAction.title}
              </Text>
              <Text
                style={[
                  styles.smallActionBody,
                  { color: palette.warm[400] },
                ]}
              >
                {smallAction.body}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            testID="schedule-reminder-button"
            onPress={onScheduleReminder}
            accessibilityRole="button"
            accessibilityLabel={smallAction.ctaLabel}
            activeOpacity={0.8}
            style={[
              styles.smallActionCta,
              {
                backgroundColor: peachBg,
                borderColor: peachBorder,
              },
            ]}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Text
              style={[
                styles.smallActionCtaText,
                { color: palette.peach[300] },
              ]}
            >
              {smallAction.ctaLabel}
            </Text>
          </TouchableOpacity>

          <View
            style={[styles.smallActionGlow, { backgroundColor: peachBgSoft }]}
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
        </View>

        {/* Bottom CTA */}
        <Button
          testID="back-to-home-button"
          label="Back to home"
          variant="primary"
          fullWidth
          onPress={onBackToHome}
          accessibilityLabel="Back to home"
          style={{
            ...styles.primaryButton,
            backgroundColor: palette.sage[300],
          }}
          labelStyle={{ color: palette.midnight[950] }}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  dateRow: {
    alignItems: "center",
    marginBottom: 12,
  },
  headline: {
    fontSize: 30,
    fontWeight: "300",
    lineHeight: 36,
    marginBottom: 24,
    textAlign: "center",
  },
  headlineItalic: {
    fontSize: 30,
    fontStyle: "italic",
    lineHeight: 36,
  },
  heroWrap: {
    alignItems: "center",
    marginBottom: 16,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  miniHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  miniHeaderText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    letterSpacing: 0.4,
  },
  primaryButton: {
    borderRadius: 28,
    marginBottom: 8,
    marginTop: 8,
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  sectionLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    marginBottom: 12,
  },
  smallActionBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },
  smallActionCard: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
    padding: 16,
    position: "relative",
  },
  smallActionCta: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    marginTop: 12,
    minHeight: 44,
  },
  smallActionCtaText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  smallActionGlow: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  smallActionHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
  },
  smallActionText: {
    flex: 1,
  },
  smallActionTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    marginBottom: 2,
  },
  tagChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  tagText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  techniqueCaption: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    marginTop: 1,
  },
  techniqueName: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  techniqueRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  techniqueText: {
    flex: 1,
  },
  techniquesCard: {
    marginBottom: 16,
    padding: 18,
  },
  techniquesList: {
    gap: 10,
  },
  topicBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  topicCard: {
    padding: 18,
  },
  topicHero: {
    marginBottom: 14,
  },
});

const heroStyles = StyleSheet.create({
  inner: {
    alignItems: "center",
    borderRadius: 32,
    borderWidth: 1,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  sparkleAurora: {
    bottom: 18,
    left: 14,
    position: "absolute",
  },
  sparklePeach: {
    position: "absolute",
    right: 18,
    top: 14,
  },
  wrap: {
    alignItems: "center",
    height: 120,
    justifyContent: "center",
    position: "relative",
    width: 120,
  },
});

export default SessionSummaryScreen;
