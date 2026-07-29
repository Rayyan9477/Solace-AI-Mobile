/**
 * AssessmentResultsScreen — prototype v4.2 #19 reskin (Sprint 6).
 *
 * Big tri-stop ScoreRing hero, breakdown card with StatBars, recommendations
 * card with IconTile rows, AAA-contrast medical disclaimer, and a sticky
 * sage CTA. Maps to `prototypes/screens/19-assessment-results.js`.
 *
 * Backwards-compatible with the legacy prop API: `recommendations` accepts
 * either `string[]` (legacy) or `Recommendation[]` (rich).
 */

import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../../../shared/theme/useTheme";
import { ScreenContainer } from "../../../shared/components/atoms/layout";
import { Button } from "../../../shared/components/atoms/buttons/Button";
import { AppIcon } from "../../../shared/components/atoms/display/AppIcon";
import {
  BracketLabel,
  GlassCard,
  HeroCard,
  IconTile,
  ScoreRing,
  StatBar,
  type IconTileHue,
  type StatBarVariant,
} from "../../../shared/components/primitives";

import type { ScoreBand } from "../utils/scoreCalculator";

type Category = "healthy" | "unstable" | "critical";

export interface BreakdownItem {
  label: string;
  score: number;
  /** How this sub-score reads. The screen owns the band → gradient mapping. */
  band: ScoreBand;
  /** Brief contextual note shown under the bar */
  note?: string;
}

export interface Recommendation {
  iconName: string;
  label: string;
  /** Display string e.g., "4 min", "Now" */
  duration: string;
  /** IconTile hue. Defaults to "sage". */
  hue?: IconTileHue;
  onPress?: () => void;
}

export interface AssessmentResultsScreenProps {
  score: number;
  category: Category;
  breakdown: BreakdownItem[];
  /** Either rich Recommendation[] or legacy string[] */
  recommendations: Recommendation[] | string[];
  onContinue: () => void;
  onViewDetails: () => void;
  /** Optional name used in the headline. */
  userName?: string;
  /** Optional date label (e.g., "April 9 · 4 min ago"). Defaults to "Today". */
  dateLabel?: string;
  /** Optional share handler — header share button is hidden when omitted. */
  onShare?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const CATEGORY_LABELS: Record<Category, string> = {
  healthy: "Excellent",
  unstable: "Moderate",
  critical: "Needs attention",
};

const CATEGORY_HEADLINES: Record<Category, string> = {
  healthy: "doing great",
  unstable: "doing okay",
  critical: "in a tough spot",
};

/**
 * Band → StatBar gradient, resolved from cosmic tokens inside StatBar via
 * `useTheme()`.
 *
 * The bar vocabulary is deliberately alarm-free — DESIGN.md § 6 sanctions no
 * red gradient, and painting a mental-health user's own score bar red is the
 * opposite of "would this feel safe at 3 AM?". `warn` therefore takes peach
 * (cosmic's warm, non-alarming warning) and `bad` takes lavender, the calmest
 * remaining variant that still reads as distinct from the other two.
 */
const STAT_BAR_VARIANT_FOR_BAND: Readonly<Record<ScoreBand, StatBarVariant>> = {
  bad: "lavender",
  good: "sage",
  warn: "peach",
};

const FALLBACK_REC_ICONS = ["wind", "book-open", "message-circle"] as const;
const FALLBACK_REC_DURATIONS = ["4 min", "10 min", "Now"] as const;
const FALLBACK_REC_HUES: IconTileHue[] = ["sage", "peach", "aurora"];

export function AssessmentResultsScreen({
  score,
  category,
  breakdown,
  recommendations,
  onContinue,
  onViewDetails,
  userName,
  dateLabel = "Today",
  onShare,
  style,
  testID = "assessment-results-screen",
}: AssessmentResultsScreenProps): React.ReactElement {
  const { palette } = useTheme();

  // Backward-compat: convert legacy string[] recommendations to rich shape.
  const normalizedRecs: Recommendation[] = useMemo(
    () =>
      recommendations.map((r, idx) => {
        if (typeof r === "string") {
          return {
            iconName: FALLBACK_REC_ICONS[idx % FALLBACK_REC_ICONS.length] ?? "sparkles",
            label: r,
            duration:
              FALLBACK_REC_DURATIONS[idx % FALLBACK_REC_DURATIONS.length] ?? "Now",
            hue: FALLBACK_REC_HUES[idx % FALLBACK_REC_HUES.length] ?? "sage",
          };
        }
        return r;
      }),
    [recommendations],
  );

  const categoryLabel = CATEGORY_LABELS[category];
  const headlineSuffix = CATEGORY_HEADLINES[category];

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={[styles.container, style]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text
            accessibilityRole="header"
            style={[styles.headerTitle, { color: palette.warm[50] }]}
          >
            Your results
          </Text>
          {onShare ? (
            <TouchableOpacity
              testID="share-button"
              style={[
                styles.iconButton,
                {
                  backgroundColor: palette.midnight[800],
                  borderColor: palette.midnight[600],
                },
              ]}
              onPress={onShare}
              accessibilityRole="button"
              accessibilityLabel="Share results"
            >
              <AppIcon name="share-2" size={16} color={palette.warm[400]} />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpacer} />
          )}
        </View>

        <BracketLabel variant="aurora" style={styles.dateLabel}>
          {dateLabel}
        </BracketLabel>

        <Text
          accessibilityRole="text"
          style={[styles.headline, { color: palette.warm[50] }]}
        >
          {`You're ${userName ? `${userName}, ` : ""}`}
          <Text style={styles.headlineItalic}>{headlineSuffix}</Text>
          {"."}
        </Text>

        <View style={styles.scoreSection}>
          <ScoreRing
            testID="score-ring"
            value={score}
            size={200}
            accessibilityLabel={`Score ${score} out of 100, ${categoryLabel}`}
          >
            <Text
              testID="score-value"
              style={[styles.scoreNumber, { color: palette.warm[50] }]}
            >
              {String(score)}
            </Text>
            <Text style={[styles.scoreUnit, { color: palette.warm[500] }]}>
              out of 100
            </Text>
            <BracketLabel variant="sage" style={styles.scoreCategory}>
              {categoryLabel}
            </BracketLabel>
          </ScoreRing>
        </View>

        <HeroCard style={styles.breakdownCard} testID="breakdown-section">
          <Text
            accessibilityRole="header"
            style={[styles.cardTitle, { color: palette.warm[50] }]}
          >
            How it breaks down
          </Text>
          {breakdown.map((item, idx) => (
            <View
              key={item.label}
              style={[styles.breakdownItem, idx > 0 && styles.breakdownGap]}
            >
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: palette.warm[50] }]}>
                  {item.label}
                </Text>
                <Text
                  style={[styles.breakdownValue, { color: palette.warm[400] }]}
                >
                  {String(item.score)}
                </Text>
              </View>
              <StatBar
                testID={`breakdown-bar-${slugify(item.label)}`}
                percent={item.score}
                variant={STAT_BAR_VARIANT_FOR_BAND[item.band]}
                accessibilityLabel={`${item.label} ${item.score} out of 100`}
              />
              {item.note ? (
                <Text
                  style={[styles.breakdownNote, { color: palette.warm[500] }]}
                >
                  {item.note}
                </Text>
              ) : null}
            </View>
          ))}
        </HeroCard>

        <GlassCard style={styles.recsCard} testID="recommendations-section">
          <Text
            accessibilityRole="header"
            style={[styles.cardTitle, { color: palette.warm[50] }]}
          >
            What we suggest
          </Text>
          {normalizedRecs.map((rec) => (
            <TouchableOpacity
              key={rec.label}
              testID={`rec-${slugify(rec.label)}`}
              style={styles.recRow}
              onPress={rec.onPress ?? noop}
              accessibilityRole="button"
              accessibilityLabel={`${rec.label}, ${rec.duration}`}
            >
              <IconTile size={36} hue={rec.hue ?? "sage"} iconName={rec.iconName} />
              <Text
                numberOfLines={2}
                style={[styles.recLabel, { color: palette.warm[50] }]}
              >
                {rec.label}
              </Text>
              <Text style={[styles.recDuration, { color: palette.warm[500] }]}>
                {rec.duration}
              </Text>
              <AppIcon name="arrow-right" size={14} color={palette.warm[500]} />
            </TouchableOpacity>
          ))}
        </GlassCard>

        <Text
          testID="medical-disclaimer"
          accessibilityRole="text"
          style={[styles.disclaimer, { color: palette.warm[500] }]}
        >
          Not a medical diagnosis. If things feel overwhelming, please reach out
          to a professional.
        </Text>

        <TouchableOpacity
          testID="view-details-button"
          style={styles.detailsLinkButton}
          onPress={onViewDetails}
          accessibilityRole="button"
          accessibilityLabel="View detailed breakdown"
        >
          <Text style={[styles.detailsLinkText, { color: palette.aurora[300] }]}>
            View detailed breakdown
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View
        style={[
          styles.stickyButton,
          { backgroundColor: palette.midnight[950] },
        ]}
      >
        <Button
          label="Continue to Solace"
          testID="continue-button"
          variant="primary"
          fullWidth
          onPress={onContinue}
          accessibilityLabel="Continue to Solace"
        />
      </View>
    </ScreenContainer>
  );
}

function noop(): void {
  /* placeholder click handler when consumer omits onPress */
}

/** Stable, human-readable testID fragment for a user-supplied label. */
function slugify(label: string): string {
  return label.slice(0, 32).replace(/\s+/g, "-").toLowerCase();
}

const styles = StyleSheet.create({
  breakdownCard: {
    marginBottom: 16,
  },
  breakdownGap: {
    marginTop: 16,
  },
  breakdownItem: {
    width: "100%",
  },
  breakdownLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  breakdownNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    marginTop: 6,
  },
  breakdownRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  breakdownValue: {
    fontFamily: "FiraCode_500Medium",
    fontSize: 12,
  },
  cardTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    marginBottom: 16,
  },
  container: {
    flex: 1,
  },
  dateLabel: {
    marginTop: 24,
    textAlign: "center",
  },
  detailsLinkButton: {
    alignItems: "center",
    minHeight: 44,
    paddingVertical: 12,
  },
  detailsLinkText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  disclaimer: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  headerSpacer: {
    height: 36,
    width: 36,
  },
  headerTitle: {
    fontFamily: "FiraCode_500Medium",
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  headline: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 30,
    lineHeight: 32,
    marginBottom: 16,
    paddingHorizontal: 24,
    textAlign: "center",
  },
  headlineItalic: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontStyle: "italic",
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  recDuration: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 11,
  },
  recLabel: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginHorizontal: 12,
  },
  recRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    minHeight: 48,
    paddingVertical: 6,
  },
  recsCard: {
    marginBottom: 16,
  },
  scoreCategory: {
    marginTop: 8,
  },
  scoreNumber: {
    fontFamily: "Fraunces_300Light",
    fontSize: 64,
    letterSpacing: -1,
    lineHeight: 64,
  },
  scoreSection: {
    alignItems: "center",
    marginVertical: 16,
  },
  scoreUnit: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 10,
    marginTop: 2,
  },
  scroll: {
    paddingBottom: 120,
    paddingHorizontal: 24,
  },
  stickyButton: {
    bottom: 0,
    left: 0,
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    position: "absolute",
    right: 0,
  },
});

export default AssessmentResultsScreen;
