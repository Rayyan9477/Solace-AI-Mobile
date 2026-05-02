/**
 * MoodInsightsScreen — prototype v4.2 #23 Mood insights reskin (Sprint 8).
 *
 * Replaces MoodAnalyticsScreen. Cosmic editorial layout: miniHeader, Fraunces
 * "What we've learned" subtitle, gradient pattern hero with BreathingOrb +
 * sparkles chip + italic key insight, ScatterPlot correlation card, and
 * supporting insight rows. Maps to `prototypes/screens/23-mood-insights.js`.
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
import { LinearGradient } from "expo-linear-gradient";

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  BracketLabel,
  BreathingOrb,
  GlassCard,
  IconTile,
  ScatterPlot,
  type IconTileHue,
  type ScatterPoint,
} from "@/shared/components/primitives";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InsightRow {
  id: string;
  iconName: string;
  hue: IconTileHue;
  title: string;
  description: string;
}

export interface MoodInsightsScreenProps {
  pageTitle?: string;
  pageSubtitle?: string;
  patternTitle?: string;
  patternBody?: string;
  patternHigh?: string;
  patternLow?: string;
  scatterPoints?: ScatterPoint[];
  scatterDayCount?: number;
  insights?: InsightRow[];
  onBack: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_SCATTER_POINTS: ScatterPoint[] = [
  { x: 0.15, y: 0.55, moodLevel: 2 },
  { x: 0.40, y: 0.70, moodLevel: 3 },
  { x: 0.55, y: 0.78, moodLevel: 3 },
  { x: 0.70, y: 0.92, moodLevel: 4 },
  { x: 0.78, y: 0.80, moodLevel: 3 },
  { x: 0.20, y: 0.30, moodLevel: 1 },
  { x: 0.85, y: 0.95, moodLevel: 4 },
  { x: 0.45, y: 0.62, moodLevel: 2 },
  { x: 0.92, y: 0.88, moodLevel: 4 },
  { x: 0.95, y: 0.96, moodLevel: 4 },
  { x: 0.60, y: 0.74, moodLevel: 3 },
  { x: 0.82, y: 0.82, moodLevel: 3 },
];

export const DEFAULT_INSIGHTS: InsightRow[] = [
  {
    id: "sun",
    iconName: "sun",
    hue: "peach",
    title: "You feel brighter after sunlight",
    description: "21% boost on outdoor-activity days",
  },
  {
    id: "social",
    iconName: "users",
    hue: "sage",
    title: "Social time matters",
    description: "Mood jumps when you log family or friends",
  },
  {
    id: "monday",
    iconName: "briefcase",
    hue: "lavender",
    title: "Mondays are harder",
    description: "Consider a Sunday wind-down ritual",
  },
];

// ---------------------------------------------------------------------------
// Private subcomponents
// ---------------------------------------------------------------------------

interface PatternHeroProps {
  title: string;
  body: string;
  high: string;
  low: string;
  reducedMotion: boolean;
}

function PatternHero({
  title,
  body,
  high,
  low,
  reducedMotion,
}: PatternHeroProps): React.ReactElement {
  const { palette, typography } = useTheme();
  return (
    <View testID="pattern-hero" style={styles.patternHero}>
      <LinearGradient
        colors={[palette.sage[300], palette.aurora[300]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.patternGradient, { opacity: 0.18 }]}
      />
      <View
        style={[styles.patternBorder, { borderColor: palette.sage[300] }]}
        pointerEvents="none"
      />
      <View style={styles.patternOrbWrapper} pointerEvents="none">
        <BreathingOrb
          testID="pattern-orb"
          size={160}
          tint="cool"
          pulsing={!reducedMotion}
        />
      </View>

      <View style={styles.patternBody}>
        <View
          style={[
            styles.patternChip,
            { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
          ]}
        >
          <AppIcon name="sparkles" size={12} color={palette.aurora[300]} />
          <Text
            style={[
              styles.patternChipText,
              { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
            ]}
          >
            Pattern detected
          </Text>
        </View>

        <Text
          testID="pattern-title"
          accessibilityRole="header"
          style={[
            styles.patternTitle,
            { color: palette.warm[50], fontFamily: typography.fontFamily.displayItalic },
          ]}
        >
          {title}
        </Text>

        <Text
          testID="pattern-body"
          style={[
            styles.patternText,
            { color: palette.warm[400], fontFamily: typography.fontFamily.sans },
          ]}
        >
          {body}
          {"\n"}
          <Text
            style={[
              styles.patternMono,
              { color: palette.sage[300], fontFamily: typography.fontFamily.mono },
            ]}
          >
            {high}
          </Text>
          <Text>{" / "}</Text>
          <Text
            style={[
              styles.patternMono,
              { color: palette.peach[300], fontFamily: typography.fontFamily.mono },
            ]}
          >
            {low}
          </Text>
        </Text>
      </View>
    </View>
  );
}

interface InsightCardProps {
  row: InsightRow;
}

function InsightCard({ row }: InsightCardProps): React.ReactElement {
  const { palette, typography } = useTheme();
  return (
    <GlassCard testID={`insight-${row.id}`} radius={16} style={styles.insightRow}>
      <View style={styles.insightInner}>
        <IconTile iconName={row.iconName} hue={row.hue} size={36} iconSize={18} />
        <View style={styles.insightTextCol}>
          <Text
            style={[
              styles.insightTitle,
              { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
            ]}
          >
            {row.title}
          </Text>
          <Text
            style={[
              styles.insightDesc,
              { color: palette.warm[500], fontFamily: typography.fontFamily.sans },
            ]}
          >
            {row.description}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MoodInsightsScreen({
  pageTitle = "What we've learned",
  pageSubtitle = "From 23 days of data · AI-analyzed",
  patternTitle = "You feel calmer after 7+ hours of sleep.",
  patternBody = "Your mood score averages high on well-rested days vs. lower on short nights. Protecting sleep is high-leverage for you.",
  patternHigh = "78",
  patternLow = "62",
  scatterPoints = DEFAULT_SCATTER_POINTS,
  scatterDayCount = 23,
  insights = DEFAULT_INSIGHTS,
  onBack,
  testID = "mood-insights-screen",
  style,
}: MoodInsightsScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();
  const reducedMotion = useReducedMotion();

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={style}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* miniHeader */}
        <View style={styles.miniHeader}>
          <TouchableOpacity
            testID="back-button"
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[
              styles.iconButton,
              { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
            ]}
          >
            <AppIcon name="chevron-left" size={18} color={palette.warm[100]} />
          </TouchableOpacity>

          <Text
            accessibilityRole="header"
            style={[
              styles.miniTitle,
              { color: palette.warm[50], fontFamily: typography.fontFamily.sansSemibold },
            ]}
          >
            Insights
          </Text>

          <View style={styles.iconButtonSpacer} />
        </View>

        <Text
          testID="page-title"
          accessibilityRole="header"
          style={[
            styles.pageTitle,
            { color: palette.warm[50], fontFamily: typography.fontFamily.displayRegular },
          ]}
        >
          {pageTitle}
        </Text>
        <Text
          testID="page-subtitle"
          style={[
            styles.pageSubtitle,
            { color: palette.warm[400], fontFamily: typography.fontFamily.sans },
          ]}
        >
          {pageSubtitle}
        </Text>

        <PatternHero
          title={patternTitle}
          body={patternBody}
          high={patternHigh}
          low={patternLow}
          reducedMotion={reducedMotion}
        />

        {/* Correlation scatter */}
        <GlassCard testID="scatter-card" radius={16} style={styles.scatterCard}>
          <View style={styles.scatterHeader}>
            <Text
              style={[
                styles.scatterTitle,
                { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
              ]}
            >
              Mood × Sleep correlation
            </Text>
            <BracketLabel variant="muted">{`${scatterDayCount} days`}</BracketLabel>
          </View>
          <Text
            style={[
              styles.scatterCaption,
              { color: palette.warm[500], fontFamily: typography.fontFamily.sans },
            ]}
          >
            Each dot is one day
          </Text>
          <ScatterPlot
            testID="mood-sleep-scatter"
            points={scatterPoints}
            width={280}
            height={140}
            xAxisLabel="Sleep hours"
            yAxisLabel="Mood"
            trendLine={{
              from: { x: 0.05, y: 0.25, moodLevel: 1 },
              to: { x: 0.95, y: 0.95, moodLevel: 4 },
            }}
            accessibilityLabel="Scatter plot showing positive correlation between sleep duration and mood"
          />
        </GlassCard>

        <View testID="insights-list" style={styles.insightsList}>
          {insights.map((row) => (
            <InsightCard key={row.id} row={row} />
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles (alphabetical within each rule)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  iconButtonSpacer: { height: 44, width: 44 },
  insightDesc: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  insightInner: { alignItems: "flex-start", flexDirection: "row", gap: 12 },
  insightRow: { padding: 14 },
  insightTextCol: { flex: 1 },
  insightTitle: { fontSize: 13, lineHeight: 18 },
  insightsList: { gap: 10 },
  miniHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  miniTitle: { fontSize: 14 },
  pageSubtitle: { fontSize: 13, lineHeight: 18, marginBottom: 20, marginTop: 4 },
  pageTitle: { fontSize: 30, lineHeight: 34 },
  patternBody: { padding: 20 },
  patternBorder: {
    borderRadius: 24,
    borderWidth: 1,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  patternChip: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  patternChipText: { fontSize: 10 },
  patternGradient: { borderRadius: 24 },
  patternHero: {
    borderRadius: 24,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  patternMono: { fontSize: 12 },
  patternOrbWrapper: { opacity: 0.6, position: "absolute", right: -40, top: -40 },
  patternText: { fontSize: 11, lineHeight: 18, marginTop: 10 },
  patternTitle: { fontSize: 20, fontStyle: "italic", lineHeight: 26 },
  scatterCaption: { fontSize: 10, marginBottom: 12 },
  scatterCard: { marginBottom: 16, padding: 20 },
  scatterHeader: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  scatterTitle: { fontSize: 14 },
  scroll: { paddingBottom: 32, paddingHorizontal: 24, paddingTop: 12 },
});

export default MoodInsightsScreen;
