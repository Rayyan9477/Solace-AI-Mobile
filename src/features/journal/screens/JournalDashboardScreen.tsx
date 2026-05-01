/**
 * JournalDashboardScreen — prototype v4.2 #08 reskin (Sprint 8).
 *
 * Visual ref: prototypes/screens/08-journal.js
 * - Editorial header with `[Journal]` bracket + Fraunces "12 entries" h1
 * - April · 23-day streak subline (peach flame)
 * - Mood-from-writing trend HeroCard (LineChart, sage→aurora)
 * - Recent entries — 3 fixture rows with mood accent bar
 * - "View all →" link
 * - Floating peach FAB (pen-line) bottom-right
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
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  BracketLabel,
  GlassCard,
  HeroCard,
  LineChart,
} from "@/shared/components/primitives";
import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type JournalMoodHue = "sage" | "lavender" | "peach" | "aurora";

export interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  moodHue: JournalMoodHue;
  title: string;
  preview: string;
}

export interface JournalDashboardScreenProps {
  entries?: JournalEntry[];
  entryCount?: number;
  streakDays?: number;
  monthLabel?: string;
  onSearch: () => void;
  onCompose: () => void;
  onViewAll: () => void;
  onEntryPress: (id: string) => void;
  testID?: string;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_ENTRIES: JournalEntry[] = [
  {
    id: "today",
    date: "Today",
    mood: "Content",
    moodHue: "sage",
    title: "A quiet morning",
    preview:
      "Started the day with coffee and that book I keep meaning to finish. Still anxious about the meeting but…",
  },
  {
    id: "yesterday",
    date: "Yesterday",
    mood: "Reflective",
    moodHue: "lavender",
    title: "Letting go",
    preview:
      "Talked to mom for an hour. It helped more than I expected. Sometimes just being heard…",
  },
  {
    id: "apr-4",
    date: "Apr 4",
    mood: "Stressed",
    moodHue: "peach",
    title: "Deadline week",
    preview:
      "Three projects due this week. Trying to take it one task at a time…",
  },
];

const TREND_POINTS = [
  { x: 0, y: 0.28 },
  { x: 0.18, y: 0.35 },
  { x: 0.38, y: 0.55 },
  { x: 0.55, y: 0.45 },
  { x: 0.72, y: 0.7 },
  { x: 0.86, y: 0.68 },
  { x: 1, y: 0.86 },
];

const TREND_DATE_LABELS = ["Apr 1", "Apr 8", "Apr 15", "Apr 22", "Apr 29"];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TrendChartCard(): React.ReactElement {
  const { palette } = useTheme();
  return (
    <HeroCard radius={24} style={styles.trendHero} testID="trend-hero">
      <GlassCard radius={24} style={styles.trendCard}>
        <View style={styles.trendHeader}>
          <View style={styles.trendHeaderText}>
            <Text style={[styles.trendTitle, { color: palette.warm[50] }]}>
              Mood from your writing
            </Text>
            <Text style={[styles.trendSubtitle, { color: palette.warm[500] }]}>
              Trending up over the last week
            </Text>
          </View>
          <View
            testID="ai-chip"
            style={{
              ...styles.aiChip,
              backgroundColor: palette.midnight[700],
              borderColor: palette.midnight[600],
            }}
            accessibilityRole="text"
            accessibilityLabel="AI insight"
          >
            <AppIcon name="sparkles" size={10} color={palette.aurora[300]} />
            <Text style={[styles.aiChipLabel, { color: palette.warm[200] }]}>
              AI
            </Text>
          </View>
        </View>

        <View style={styles.chartWrap}>
          <LineChart
            testID="mood-trend-chart"
            data={TREND_POINTS}
            width={260}
            height={96}
            variant="sage-aurora"
            accessibilityLabel="Mood from writing over the past month, trending upward"
          />
        </View>

        <View
          style={styles.trendDateRow}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {TREND_DATE_LABELS.map((d) => (
            <Text
              key={d}
              style={[styles.trendDateLabel, { color: palette.warm[500] }]}
            >
              {d}
            </Text>
          ))}
        </View>
      </GlassCard>
    </HeroCard>
  );
}

interface EntryRowProps {
  entry: JournalEntry;
  accentColor: string;
  onPress: (id: string) => void;
}

function EntryRow({
  entry,
  accentColor,
  onPress,
}: EntryRowProps): React.ReactElement {
  const { palette } = useTheme();
  return (
    <TouchableOpacity
      testID={`entry-${entry.id}`}
      onPress={() => onPress(entry.id)}
      accessibilityRole="button"
      accessibilityLabel={`${entry.title}, ${entry.mood}, ${entry.date}`}
      activeOpacity={0.85}
      style={styles.entryButton}
    >
      <GlassCard radius={20} style={styles.entryCard}>
        <View
          style={{ ...styles.entryAccent, backgroundColor: accentColor }}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <View style={styles.entryBody}>
          <View style={styles.entryMetaRow}>
            <BracketLabel variant="muted">{entry.date}</BracketLabel>
            <View
              style={{
                ...styles.dotSeparator,
                backgroundColor: palette.warm[500],
              }}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />
            <Text style={[styles.entryMood, { color: accentColor }]}>
              {entry.mood}
            </Text>
          </View>
          <Text
            style={[styles.entryTitle, { color: palette.warm[50] }]}
            numberOfLines={1}
          >
            {entry.title}
          </Text>
          <Text
            style={[styles.entryPreview, { color: palette.warm[400] }]}
            numberOfLines={2}
          >
            {entry.preview}
          </Text>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function JournalDashboardScreen({
  entries = DEFAULT_ENTRIES,
  entryCount,
  streakDays = 23,
  monthLabel = "April",
  onSearch,
  onCompose,
  onViewAll,
  onEntryPress,
  testID = "journal-dashboard-screen",
}: JournalDashboardScreenProps): React.ReactElement {
  const { palette } = useTheme();
  useReducedMotion();

  const totalEntries = entryCount ?? entries.length;

  const moodAccent = useMemo(
    () => ({
      sage: palette.sage[300],
      lavender: palette.lavender[300],
      peach: palette.peach[300],
      aurora: palette.aurora[300],
    }),
    [palette],
  );

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <BracketLabel variant="muted">Journal</BracketLabel>
            <Text
              testID="entry-count-heading"
              accessibilityRole="header"
              style={[styles.heading, { color: palette.warm[50] }]}
            >
              {`${totalEntries} entries`}
            </Text>
          </View>

          <TouchableOpacity
            testID="search-button"
            onPress={onSearch}
            accessibilityRole="button"
            accessibilityLabel="Search journal"
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            style={{
              ...styles.iconButton,
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            }}
          >
            <AppIcon name="search" size={18} color={palette.warm[100]} />
          </TouchableOpacity>
        </View>

        {/* Streak subline */}
        <View
          testID="streak-subline"
          style={styles.subline}
          accessibilityRole="text"
          accessibilityLabel={`${monthLabel}, ${streakDays} day streak`}
        >
          <Text style={[styles.sublineText, { color: palette.warm[400] }]}>
            {monthLabel}
          </Text>
          <View
            style={{
              ...styles.dotSeparator,
              backgroundColor: palette.warm[500],
            }}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
          <AppIcon name="flame" size={12} color={palette.peach[300]} />
          <Text style={[styles.sublineText, { color: palette.warm[400] }]}>
            {`${streakDays}-day streak`}
          </Text>
        </View>

        {/* Mood trend hero chart */}
        <TrendChartCard />

        {/* Recent entries */}
        <View style={styles.recentHeader}>
          <Text
            testID="recent-heading"
            accessibilityRole="header"
            style={[styles.recentTitle, { color: palette.warm[50] }]}
          >
            Recent
          </Text>
          <TouchableOpacity
            testID="view-all-link"
            onPress={onViewAll}
            accessibilityRole="link"
            accessibilityLabel="View all entries"
            hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}
            style={styles.viewAllButton}
          >
            <Text style={[styles.viewAllText, { color: palette.aurora[300] }]}>
              View all →
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.entryList} testID="entry-list">
          {entries.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              accentColor={moodAccent[entry.moodHue]}
              onPress={onEntryPress}
            />
          ))}
        </View>
      </ScrollView>

      {/* FAB — compose new entry */}
      <TouchableOpacity
        testID="compose-fab"
        onPress={onCompose}
        accessibilityRole="button"
        accessibilityLabel="Write a new entry"
        style={{
          ...styles.fab,
          backgroundColor: palette.peach[300],
          shadowColor: palette.midnight[950],
        }}
      >
        <AppIcon name="pen-line" size={22} color={palette.midnight[950]} />
      </TouchableOpacity>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles (alphabetically sorted)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  aiChip: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  aiChipLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 9,
  },
  chartWrap: {
    alignItems: "center",
    marginTop: 12,
  },
  container: {
    flex: 1,
  },
  dotSeparator: {
    borderRadius: 2,
    height: 3,
    opacity: 0.6,
    width: 3,
  },
  entryAccent: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 999,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 999,
    bottom: 8,
    left: 0,
    opacity: 0.7,
    position: "absolute",
    top: 8,
    width: 4,
  },
  entryBody: {
    paddingLeft: 14,
  },
  entryButton: {
    minHeight: 44,
  },
  entryCard: {
    padding: 16,
  },
  entryList: {
    gap: 12,
    marginTop: 16,
  },
  entryMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  entryMood: {
    fontFamily: "Inter_500Medium",
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  entryPreview: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  entryTitle: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 6,
  },
  fab: {
    alignItems: "center",
    borderRadius: 28,
    bottom: 32,
    elevation: 8,
    height: 56,
    justifyContent: "center",
    position: "absolute",
    right: 24,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    width: 56,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
    gap: 6,
  },
  heading: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 32,
    lineHeight: 36,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  recentHeader: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },
  recentTitle: {
    fontFamily: "Fraunces_400Regular",
    fontSize: 18,
    lineHeight: 22,
  },
  scroll: {
    paddingBottom: 120,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  subline: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  sublineText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  trendCard: {
    overflow: "hidden",
    padding: 20,
  },
  trendDateLabel: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 9,
  },
  trendDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  trendHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trendHeaderText: {
    flex: 1,
  },
  trendHero: {
    marginTop: 20,
  },
  trendSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    marginTop: 2,
  },
  trendTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  viewAllButton: {
    minHeight: 44,
    paddingVertical: 8,
  },
  viewAllText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
});

export default JournalDashboardScreen;
