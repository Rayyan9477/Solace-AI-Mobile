/**
 * MoodCalendarScreen — prototype v4.2 #22 Mood calendar reskin (Sprint 8).
 *
 * Cosmic editorial month grid: miniHeader (back + title + calendar-view icon),
 * Fraunces "Your month" subtitle, HeatmapGrid month view inside a HeroCard,
 * legend with 5 mood swatches, and a sage-trending summary card.
 * Maps to `prototypes/screens/22-mood-calendar.js`.
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

import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import {
  BracketLabel,
  GlassCard,
  HeatmapGrid,
  type HeatmapCell,
  HeroCard,
  IconTile,
} from "@/shared/components/primitives";
import { useTheme } from "@/shared/theme/useTheme";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Heatmap mood level — 0-4 (Struggling..Overjoyed) or null = no entry. */
export type CalendarMoodLevel = 0 | 1 | 2 | 3 | 4 | null;

export interface MoodCalendarEntry {
  /** 1-based day of month. */
  day: number;
  level: CalendarMoodLevel;
  isToday?: boolean;
}

export interface MoodCalendarScreenProps {
  /** 0-based month index (0 = January). Defaults to 3 (April). */
  month?: number;
  /** Full year. Defaults to 2026. */
  year?: number;
  /** Per-day entries (variable length up to days-in-month). */
  entries?: MoodCalendarEntry[];
  /** Title summary, e.g. "Your month". */
  summaryTitle?: string;
  /** Sub-summary, e.g. "23 days logged · mostly calm". */
  summarySubtitle?: string;
  /** Callout headline, e.g. "18% better than March". */
  highlightTitle?: string;
  /** Callout subtitle, e.g. "Your streak and sleep are both improving." */
  highlightSubtitle?: string;
  onBack: () => void;
  /** Tap handler for the calendar-view toggle in the header. */
  onChangeView?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;

interface LegendItem {
  level: 0 | 1 | 2 | 3 | 4;
  label: string;
  hue: "lavender" | "warm" | "sage" | "peach";
  shade: 100 | 200 | 300 | 500;
}

const LEGEND_ITEMS: readonly LegendItem[] = [
  { level: 0, label: "Struggling", hue: "lavender", shade: 500 },
  { level: 1, label: "Down", hue: "lavender", shade: 300 },
  { level: 2, label: "Neutral", hue: "warm", shade: 200 },
  { level: 3, label: "Content", hue: "sage", shade: 300 },
  { level: 4, label: "Great", hue: "peach", shade: 300 },
] as const;

// ---------------------------------------------------------------------------
// Default fixture (April 2026 — 24 logged days)
// ---------------------------------------------------------------------------

export const DEFAULT_CALENDAR_ENTRIES: MoodCalendarEntry[] = [
  { day: 1, level: 3 }, { day: 2, level: 2 }, { day: 3, level: 3 },
  { day: 4, level: 4 }, { day: 5, level: 2 }, { day: 6, level: 3 },
  { day: 7, level: 3 }, { day: 8, level: 1 }, { day: 9, level: 2, isToday: true },
  { day: 10, level: 3 }, { day: 11, level: 4 }, { day: 12, level: 4 },
  { day: 13, level: 3 }, { day: 14, level: 2 }, { day: 15, level: 2 },
  { day: 16, level: 3 }, { day: 17, level: 1 }, { day: 18, level: 2 },
  { day: 19, level: 3 }, { day: 20, level: 4 }, { day: 21, level: 3 },
  { day: 22, level: 3 }, { day: 23, level: 2 }, { day: 24, level: 3 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function buildCells(
  year: number,
  month: number,
  entries: MoodCalendarEntry[],
): { cells: HeatmapCell[]; weeks: number } {
  const total = daysInMonth(year, month);
  const byDay = new Map<number, MoodCalendarEntry>();
  entries.forEach((e) => byDay.set(e.day, e));

  const cells: HeatmapCell[] = [];
  for (let d = 1; d <= total; d++) {
    const entry = byDay.get(d);
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({
      date: iso,
      moodLevel: entry?.level ?? null,
      isToday: entry?.isToday === true,
    });
  }
  const weeks = Math.ceil(cells.length / 7);
  while (cells.length < weeks * 7) {
    cells.push({
      date: `${year}-${String(month + 1).padStart(2, "0")}-pad-${cells.length}`,
      moodLevel: null,
    });
  }
  return { cells, weeks };
}

function legendColor(
  palette: ReturnType<typeof useTheme>["palette"],
  item: LegendItem,
): string {
  switch (item.hue) {
    case "lavender":
      return item.shade === 500 ? palette.lavender[500] : palette.lavender[300];
    case "warm":
      return palette.warm[200];
    case "sage":
      return palette.sage[300];
    case "peach":
      return palette.peach[300];
    default:
      return palette.warm[200];
  }
}

// ---------------------------------------------------------------------------
// Private subcomponents
// ---------------------------------------------------------------------------

interface MiniHeaderProps {
  monthLabel: string;
  onBack: () => void;
  onChangeView?: () => void;
}

function MiniHeader({ monthLabel, onBack, onChangeView }: MiniHeaderProps): React.ReactElement {
  const { palette, typography } = useTheme();
  return (
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
        testID="month-title"
        accessibilityRole="header"
        style={[
          styles.miniTitle,
          { color: palette.warm[50], fontFamily: typography.fontFamily.sansSemibold },
        ]}
      >
        {monthLabel}
      </Text>

      {onChangeView ? (
        <TouchableOpacity
          testID="change-view-button"
          onPress={onChangeView}
          accessibilityRole="button"
          accessibilityLabel="Change view"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[
            styles.iconButton,
            { backgroundColor: palette.midnight[800], borderColor: palette.midnight[600] },
          ]}
        >
          <AppIcon name="calendar-days" size={18} color={palette.warm[400]} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButtonSpacer} />
      )}
    </View>
  );
}

function Legend(): React.ReactElement {
  const { palette, typography } = useTheme();
  return (
    <GlassCard
      testID="legend-card"
      radius={16}
      style={styles.legendCard}
      accessibilityRole="text"
      accessibilityLabel="Mood legend"
    >
      <BracketLabel variant="muted">Legend</BracketLabel>
      <View style={styles.legendRow}>
        {LEGEND_ITEMS.map((item) => (
          <View
            key={`legend-${item.level}`}
            testID={`legend-item-${item.level}`}
            style={styles.legendItem}
          >
            <View
              style={[styles.legendSwatch, { backgroundColor: legendColor(palette, item) }]}
              pointerEvents="none"
            />
            <Text
              style={[
                styles.legendLabel,
                { color: palette.warm[400], fontFamily: typography.fontFamily.sans },
              ]}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function MoodCalendarScreen({
  month = 3,
  year = 2026,
  entries = DEFAULT_CALENDAR_ENTRIES,
  summaryTitle = "Your month",
  summarySubtitle = "23 days logged · mostly calm",
  highlightTitle = "18% better than March",
  highlightSubtitle = "Your streak and sleep are both improving.",
  onBack,
  onChangeView,
  testID = "mood-calendar-screen",
  style,
}: MoodCalendarScreenProps): React.ReactElement {
  const { palette, typography } = useTheme();

  const { cells, weeks } = useMemo(
    () => buildCells(year, month, entries),
    [year, month, entries],
  );

  const monthLabel = `${MONTH_NAMES[month]} ${year}`;

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={style}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <MiniHeader monthLabel={monthLabel} onBack={onBack} onChangeView={onChangeView} />

        <Text
          testID="month-summary-title"
          accessibilityRole="header"
          style={[
            styles.summaryTitle,
            { color: palette.warm[50], fontFamily: typography.fontFamily.displayRegular },
          ]}
        >
          {summaryTitle}
        </Text>
        <Text
          testID="month-summary-subtitle"
          style={[
            styles.summarySubtitle,
            { color: palette.warm[400], fontFamily: typography.fontFamily.sans },
          ]}
        >
          {summarySubtitle}
        </Text>

        {/* Month grid */}
        <HeroCard radius={24} style={styles.gridCard}>
          <GlassCard variant="strong" radius={23} style={styles.gridInner}>
            <View pointerEvents="none" style={styles.weekdayRow}>
              {WEEKDAY_LABELS.map((label, idx) => (
                <Text
                  key={`weekday-${idx}`}
                  style={[
                    styles.weekdayText,
                    { color: palette.warm[500], fontFamily: typography.fontFamily.monoMedium },
                  ]}
                >
                  {label}
                </Text>
              ))}
            </View>

            <HeatmapGrid
              testID="month-heatmap"
              cells={cells}
              weeks={weeks}
              cellSize={36}
              accessibilityLabel={`${monthLabel} mood heatmap`}
            />
          </GlassCard>
        </HeroCard>

        <Legend />

        {/* Summary callout */}
        <GlassCard testID="summary-card" radius={16} style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <IconTile iconName="trending-up" hue="sage" size={40} iconSize={20} />
            <View style={styles.summaryTextCol}>
              <Text
                testID="summary-title-text"
                style={[
                  styles.highlightTitle,
                  { color: palette.warm[50], fontFamily: typography.fontFamily.sansMedium },
                ]}
              >
                {highlightTitle}
              </Text>
              <Text
                style={[
                  styles.highlightSubtitle,
                  { color: palette.warm[500], fontFamily: typography.fontFamily.sans },
                ]}
              >
                {highlightSubtitle}
              </Text>
            </View>
          </View>
        </GlassCard>
      </ScrollView>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Styles (alphabetical within each rule)
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  gridCard: { marginBottom: 16 },
  gridInner: { padding: 16 },
  highlightSubtitle: { fontSize: 11, lineHeight: 16, marginTop: 2 },
  highlightTitle: { fontSize: 13, lineHeight: 18 },
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  iconButtonSpacer: { height: 44, width: 44 },
  legendCard: { gap: 12, marginBottom: 16, padding: 14 },
  legendItem: { alignItems: "center", gap: 6 },
  legendLabel: { fontSize: 10 },
  legendRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  legendSwatch: { borderRadius: 6, height: 22, width: 22 },
  miniHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  miniTitle: { fontSize: 14 },
  scroll: { paddingBottom: 32, paddingHorizontal: 24, paddingTop: 12 },
  summaryCard: { marginBottom: 16, padding: 14 },
  summaryRow: { alignItems: "center", flexDirection: "row", gap: 12 },
  summarySubtitle: { fontSize: 13, lineHeight: 18, marginBottom: 20, marginTop: 4 },
  summaryTextCol: { flex: 1 },
  summaryTitle: { fontSize: 30, lineHeight: 34 },
  weekdayRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  weekdayText: {
    fontSize: 9,
    letterSpacing: 1.5,
    textAlign: "center",
    textTransform: "uppercase",
    width: 36,
  },
});

export default MoodCalendarScreen;
