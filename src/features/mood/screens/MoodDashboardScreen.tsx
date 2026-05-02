/**
 * MoodDashboardScreen — prototype v4.2 #06 Mood tracker reskin (Sprint 8).
 *
 * Cosmic editorial layout: bracket "Mood" + "This week" headline, calendar
 * icon button, current-mood hero with BreathingOrb + MoodFace, 7-day BarChart,
 * AI-analyzed insights list with IconTiles, and a sage/peach FAB to log a new
 * mood entry. Maps to `prototypes/screens/06-mood.js`.
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

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  BarChart,
  type BarChartBar,
  BracketLabel,
  BreathingOrb,
  GlassCard,
  IconTile,
  MoodFace,
  type IconTileHue,
  type MoodLevel,
} from "@/shared/components/primitives";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type MoodDayHue = "sage" | "lavender" | "peach";

export interface WeeklyMoodEntry {
  day: string;
  value: number;
  hue: MoodDayHue;
  today?: boolean;
}

export interface MoodInsight {
  id: string;
  iconName: string;
  hue: IconTileHue;
  title: string;
  description: string;
}

export interface MoodDashboardScreenProps {
  currentMoodLevel?: MoodLevel;
  currentMoodLabel?: string;
  timestampLabel?: string;
  deltaLabel?: string;
  deltaPositive?: boolean;
  weeklyData?: WeeklyMoodEntry[];
  averageScore?: string;
  insights?: MoodInsight[];
  onCalendarPress: () => void;
  onLogMood: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Default fixtures
// ---------------------------------------------------------------------------

export const DEFAULT_WEEKLY_DATA: WeeklyMoodEntry[] = [
  { day: "M", value: 0.5, hue: "sage" },
  { day: "T", value: 0.7, hue: "sage" },
  { day: "W", value: 0.3, hue: "peach" },
  { day: "T", value: 0.6, hue: "sage" },
  { day: "F", value: 0.9, hue: "sage" },
  { day: "S", value: 0.8, hue: "lavender" },
  { day: "S", value: 0.75, hue: "sage", today: true },
];

export const DEFAULT_INSIGHTS: MoodInsight[] = [
  {
    id: "trending-up",
    iconName: "trending-up",
    hue: "sage",
    title: "Mood improved 18% this week",
    description: "Your mindfulness sessions seem to help.",
  },
  {
    id: "sleep",
    iconName: "moon",
    hue: "lavender",
    title: "You feel best after 7+ hours sleep",
    description: "Consistent on weekends — try weeknights too.",
  },
  {
    id: "outdoor",
    iconName: "sun",
    hue: "peach",
    title: "Outdoor days lift your mood",
    description: "21% boost on days with sunlight.",
  },
];

// ---------------------------------------------------------------------------
// Private subcomponent — InsightCard
// ---------------------------------------------------------------------------

interface InsightCardProps {
  insight: MoodInsight;
}

function InsightCard({ insight }: InsightCardProps): React.ReactElement {
  const { palette, typography } = useTheme();
  return (
    <GlassCard
      testID={`insight-${insight.id}`}
      radius={16}
      style={styles.insightRow}
    >
      <View style={styles.insightInner}>
        <IconTile iconName={insight.iconName} hue={insight.hue} size={36} iconSize={18} />
        <View style={styles.insightTextCol}>
          <Text
            style={[
              styles.insightTitle,
              { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
            ]}
          >
            {insight.title}
          </Text>
          <Text
            style={[
              styles.insightDesc,
              { color: palette.warm[500], fontFamily: typography.fontFamily.sans },
            ]}
          >
            {insight.description}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MoodDashboardScreen({
  currentMoodLevel = 4,
  currentMoodLabel = "Content",
  timestampLabel = "Today · 2:45 PM",
  deltaLabel = "Up from neutral",
  deltaPositive = true,
  weeklyData = DEFAULT_WEEKLY_DATA,
  averageScore = "3.8/5",
  insights = DEFAULT_INSIGHTS,
  onCalendarPress,
  onLogMood,
  testID = "mood-dashboard-screen",
  style,
}: MoodDashboardScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();
  const reducedMotion = useReducedMotion();

  const bars: BarChartBar[] = weeklyData.map((entry) => ({
    label: entry.day,
    value: entry.value,
    highlighted: entry.today === true,
  }));

  const deltaColor = deltaPositive ? palette.sage[300] : palette.peach[300];

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={style}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <BracketLabel variant="muted">Mood</BracketLabel>
            <Text
              accessibilityRole="header"
              style={[
                styles.headline,
                { color: palette.warm[50], fontFamily: typography.fontFamily.displayRegular },
              ]}
            >
              This week
            </Text>
          </View>

          <TouchableOpacity
            testID="calendar-button"
            onPress={onCalendarPress}
            accessibilityRole="button"
            accessibilityLabel="View calendar"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={[
              styles.iconButton,
              { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
            ]}
          >
            <AppIcon name="calendar-days" size={18} color={palette.warm[100]} />
          </TouchableOpacity>
        </View>

        {/* Current-mood hero */}
        <GlassCard
          testID="mood-hero-card"
          variant="strong"
          radius={24}
          style={styles.heroCard}
        >
          <View style={styles.heroOrbWrapper} pointerEvents="none">
            <BreathingOrb
              testID="mood-hero-orb"
              size={180}
              tint="cool"
              pulsing={!reducedMotion}
            />
          </View>

          <View style={styles.heroRow}>
            <View style={styles.heroTextCol}>
              <BracketLabel variant="sage">{timestampLabel}</BracketLabel>
              <Text
                testID="mood-hero-label"
                accessibilityRole="header"
                style={[
                  styles.heroLabel,
                  { color: palette.warm[50], fontFamily: typography.fontFamily.displayItalic },
                ]}
              >
                {currentMoodLabel}
              </Text>
              <View style={styles.deltaRow}>
                <AppIcon
                  name={deltaPositive ? "arrow-up" : "arrow-down"}
                  size={12}
                  color={deltaColor}
                />
                <Text
                  testID="mood-delta-text"
                  style={[
                    styles.deltaText,
                    { color: deltaColor, fontFamily: typography.fontFamily.sansMedium },
                  ]}
                >
                  {deltaLabel}
                </Text>
              </View>
            </View>

            <View
              testID="mood-hero-face"
              style={[styles.heroFaceCircle, { backgroundColor: palette.sage[700] }]}
            >
              <MoodFace
                level={currentMoodLevel}
                size={62}
                accessibilityLabel={`${currentMoodLabel} mood illustration`}
              />
            </View>
          </View>
        </GlassCard>

        {/* 7-day trend */}
        <GlassCard testID="weekly-chart-card" radius={24} style={styles.trendCard}>
          <View style={styles.trendHeaderRow}>
            <Text
              style={[
                styles.trendTitle,
                { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
              ]}
            >
              7-day trend
            </Text>
            <View
              style={[
                styles.avgPill,
                { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
              ]}
            >
              <View
                style={[styles.avgDot, { backgroundColor: palette.sage[300] }]}
                pointerEvents="none"
              />
              <Text
                testID="avg-score-text"
                style={[
                  styles.avgText,
                  { color: palette.warm[50], fontFamily: typography.fontFamily.mono },
                ]}
              >
                {`Avg ${averageScore}`}
              </Text>
            </View>
          </View>

          <BarChart
            testID="weekly-bar-chart"
            bars={bars}
            width={300}
            height={140}
            variant="sage"
            accessibilityLabel="7-day mood trend"
          />
        </GlassCard>

        {/* Insights */}
        <View style={styles.insightsHeader}>
          <Text
            accessibilityRole="header"
            style={[
              styles.insightsTitle,
              { color: palette.warm[50], fontFamily: typography.fontFamily.display },
            ]}
          >
            Insights
          </Text>
          <BracketLabel variant="muted">AI-analyzed</BracketLabel>
        </View>

        <View testID="insights-list" style={styles.insightsList}>
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </View>
      </ScrollView>

      {/* FAB — log mood */}
      <TouchableOpacity
        testID="log-mood-fab"
        onPress={onLogMood}
        accessibilityRole="button"
        accessibilityLabel="Log a new mood entry"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={[styles.fab, { backgroundColor: palette.peach[300] }]}
      >
        <AppIcon name="plus" size={24} color={palette.midnight[950]} />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles (alphabetical within each rule)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  avgDot: { borderRadius: 3, height: 6, width: 6 },
  avgPill: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  avgText: { fontSize: 10 },
  deltaRow: { alignItems: "center", flexDirection: "row", gap: 6, marginTop: 8 },
  deltaText: { fontSize: 11 },
  fab: {
    alignItems: "center",
    borderRadius: 28,
    bottom: 32,
    elevation: 6,
    height: 56,
    justifyContent: "center",
    minHeight: 56,
    minWidth: 56,
    position: "absolute",
    right: 24,
    width: 56,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  headline: { fontSize: 32, lineHeight: 36, marginTop: 4 },
  heroCard: { marginTop: 24, overflow: "hidden", padding: 20 },
  heroFaceCircle: {
    alignItems: "center",
    borderRadius: 40,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  heroLabel: { fontSize: 44, fontStyle: "italic", lineHeight: 48, marginTop: 6 },
  heroOrbWrapper: { left: -48, opacity: 0.55, position: "absolute", top: -48 },
  heroRow: { alignItems: "flex-end", flexDirection: "row", justifyContent: "space-between" },
  heroTextCol: { flex: 1 },
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  insightDesc: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  insightInner: { alignItems: "flex-start", flexDirection: "row", gap: 12 },
  insightRow: { padding: 14 },
  insightTextCol: { flex: 1 },
  insightTitle: { fontSize: 13, lineHeight: 18 },
  insightsHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    marginTop: 24,
  },
  insightsList: { gap: 10 },
  insightsTitle: { fontSize: 18, lineHeight: 22 },
  scroll: { paddingBottom: 140, paddingHorizontal: 24, paddingTop: 12 },
  trendCard: { marginTop: 16, padding: 20 },
  trendHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  trendTitle: { fontSize: 14 },
});

export default MoodDashboardScreen;
