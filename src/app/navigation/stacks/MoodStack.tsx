/**
 * Mood Stack Navigator
 * @description Navigation stack for mood tracking feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to four survivors —
 * MoodDashboard, MoodSelector (S6 reskin → DailyCheckIn), MoodCalendar,
 * MoodInsights (S8 reskin — replaces MoodAnalytics). AISuggestions and
 * MoodHistory were deleted.
 *
 * Sprint 11: each route is now a thin adapter that owns the bridge between
 * the SQLite-backed mood repository and the props-down screen components.
 * Reads use `useEffect`-driven async hydration with a SkeletonShimmer
 * fallback while `isReady === false`; the writer route persists each new
 * entry via `mood.create()` before navigating back.
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MoodStackParamList } from "../../../shared/types/navigation";

import { palette } from "../../../shared/theme";
import { MoodDashboardScreen } from "../../../features/mood/screens/MoodDashboardScreen";
import { MoodSelectorScreen } from "../../../features/mood/screens/MoodSelectorScreen";
import { MoodCalendarScreen } from "../../../features/mood/screens/MoodCalendarScreen";
import { MoodInsightsScreen } from "../../../features/mood/screens/MoodInsightsScreen";
import type {
  MoodCalendarEntry,
  CalendarMoodLevel,
} from "../../../features/mood/screens/MoodCalendarScreen";
import type { WeeklyMoodEntry } from "../../../features/mood/screens/MoodDashboardScreen";
import { ScreenSkeleton } from "../../../shared/components/primitives/ScreenSkeleton";
import { useRepositories } from "../../providers/RepositoryProvider";
import type {
  MoodCalendarCell,
  MoodEntry,
  MoodLevel,
} from "../../../shared/data/types";

const Stack = createNativeStackNavigator<MoodStackParamList>();

// Cosmic palette mapping: 5-level mood gradient (grief → energy)
const DEFAULT_MOOD_OPTIONS = [
  { index: 0, label: "Struggling", emoji: "😢", color: palette.lavender[500] },
  { index: 1, label: "Down", emoji: "😕", color: palette.warm[200] },
  { index: 2, label: "Neutral", emoji: "😐", color: palette.warm[200] },
  { index: 3, label: "Content", emoji: "🙂", color: palette.sage[300] },
  { index: 4, label: "Overjoyed", emoji: "😄", color: palette.peach[300] },
];

const MOOD_LABELS: Record<MoodLevel, string> = {
  1: "Struggling",
  2: "Down",
  3: "Neutral",
  4: "Content",
  5: "Overjoyed",
};

// ---------------------------------------------------------------------------
// Mood selector — write path. Persists a new mood_entry on save.
// ---------------------------------------------------------------------------

function MoodSelectorRoute({ navigation }: any): React.ReactElement {
  const { mood, isReady } = useRepositories();
  const [selectedIndex, setSelectedIndex] = React.useState(2);
  const [selectedInfluences, setSelectedInfluences] = React.useState<string[]>(
    [],
  );
  const [note, setNote] = React.useState("");

  const handleSetMood = React.useCallback(() => {
    const moodLevel = (Math.min(
      Math.max(selectedIndex + 1, 1),
      5,
    ) as MoodLevel);
    const persist = async (): Promise<void> => {
      if (!isReady) return;
      try {
        await mood.create({
          level: moodLevel,
          note: note.trim().length > 0 ? note.trim() : undefined,
          influences: selectedInfluences.length > 0
            ? selectedInfluences
            : undefined,
        });
      } catch {
        // Persistence failure must not block navigation; the user-facing
        // affordance for retry will land in a future sprint.
      }
    };
    void persist().finally(() => navigation.goBack());
  }, [isReady, mood, navigation, note, selectedIndex, selectedInfluences]);

  return (
    <MoodSelectorScreen
      selectedMoodIndex={selectedIndex}
      moodOptions={DEFAULT_MOOD_OPTIONS}
      onBack={() => navigation.goBack()}
      onMoodChange={setSelectedIndex}
      onSetMood={handleSetMood}
      selectedInfluences={selectedInfluences}
      onInfluencesChange={setSelectedInfluences}
      note={note}
      onNoteChange={setNote}
    />
  );
}

// ---------------------------------------------------------------------------
// Mood dashboard — read path: latest entry, weekly trend, streak, insights.
// ---------------------------------------------------------------------------

interface DashboardData {
  readonly latest: MoodEntry | null;
  readonly recent: readonly MoodEntry[];
  readonly streakDays: number;
}

function MoodDashboardRoute({ navigation }: any): React.ReactElement {
  const { mood, isReady } = useRepositories();
  const [data, setData] = React.useState<DashboardData | null>(null);

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const recent = await mood.list({ limit: 30 });
      const streakDays = await mood.getStreak();
      if (cancelled) return;
      setData({
        latest: recent.length > 0 ? recent[0] : null,
        recent,
        streakDays,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, mood]);

  if (!isReady || !data) {
    return (
      <ScreenSkeleton testID="mood-dashboard-skeleton" />
    );
  }

  const weekly = buildWeeklyMoodEntries(data.recent);
  const latestLevel = data.latest?.level;
  const latestLabel = latestLevel ? MOOD_LABELS[latestLevel] : undefined;
  const averageScore = computeAverageScore(data.recent);

  return (
    <MoodDashboardScreen
      currentMoodLevel={latestLevel}
      currentMoodLabel={latestLabel}
      weeklyData={weekly}
      averageScore={averageScore}
      onCalendarPress={() => navigation.navigate("MoodCalendar")}
      onLogMood={() => navigation.navigate("MoodSelector", {})}
    />
  );
}

// ---------------------------------------------------------------------------
// Mood calendar — read path: month grid sourced from getCalendar().
// ---------------------------------------------------------------------------

function MoodCalendarRoute({ navigation }: any): React.ReactElement {
  const { mood, isReady } = useRepositories();
  // `today` is state-not-memo so it can refresh when the screen regains focus
  // after midnight rollover (app backgrounded across midnight then resumed).
  const [today, setToday] = React.useState(() => new Date());
  const [cells, setCells] = React.useState<MoodCalendarCell[] | null>(null);

  // On every focus, bump `today` to the current date so calendar highlight
  // tracks midnight rollover for backgrounded sessions.
  React.useEffect(() => {
    const unsub = navigation.addListener?.("focus", () => {
      setToday(new Date());
    });
    return unsub as (() => void) | undefined;
  }, [navigation]);

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const result = await mood.getCalendar(
        today.getMonth() + 1,
        today.getFullYear(),
      );
      if (cancelled) return;
      setCells(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, mood, today]);

  if (!isReady || !cells) {
    return (
      <ScreenSkeleton testID="mood-calendar-skeleton" />
    );
  }

  const todayDay = today.getDate();
  const entries: MoodCalendarEntry[] = cells.map((cell) => ({
    day: cell.day,
    level: averageLevelToCalendarLevel(cell.averageLevel),
    isToday: cell.day === todayDay,
  }));

  return (
    <MoodCalendarScreen
      month={today.getMonth()}
      year={today.getFullYear()}
      entries={entries}
      onBack={() => navigation.goBack()}
      onChangeView={() => navigation.navigate("MoodInsights")}
    />
  );
}

// ---------------------------------------------------------------------------
// Mood insights — read path: 90-day list (used by client-side aggregation).
// ---------------------------------------------------------------------------

function MoodInsightsRoute({ navigation }: any): React.ReactElement {
  const { mood, isReady } = useRepositories();
  const [entries, setEntries] = React.useState<readonly MoodEntry[] | null>(
    null,
  );

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const list = await mood.list({ limit: 90 });
      if (cancelled) return;
      setEntries(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, mood]);

  if (!isReady || !entries) {
    return (
      <ScreenSkeleton testID="mood-insights-skeleton" />
    );
  }

  // The screen owns rich default visualisations; passing the raw entries
  // count via `scatterDayCount` lets the screen show "N days analysed" while
  // the visual design stays untouched. Anything richer (real scatter from
  // entries) requires a primitive change and is flagged for follow-up.
  return (
    <MoodInsightsScreen
      scatterDayCount={entries.length}
      onBack={() => navigation.goBack()}
    />
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const WEEKDAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

function buildWeeklyMoodEntries(
  entries: readonly MoodEntry[],
): WeeklyMoodEntry[] {
  // Aggregate the seven most recent days. Default to a flat 0.5 row when
  // there is nothing logged yet so the bars don't collapse.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buckets: { sum: number; count: number; date: Date }[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    buckets.push({ sum: 0, count: 0, date: d });
  }
  for (const entry of entries) {
    const created = new Date(entry.createdAt);
    created.setHours(0, 0, 0, 0);
    for (const bucket of buckets) {
      if (created.getTime() === bucket.date.getTime()) {
        bucket.sum += entry.level;
        bucket.count += 1;
        break;
      }
    }
  }
  return buckets.map((bucket, idx) => {
    const avg = bucket.count > 0 ? bucket.sum / bucket.count : 3;
    const value = Math.max(0, Math.min(1, (avg - 1) / 4));
    const hue: WeeklyMoodEntry["hue"] = avg >= 4
      ? "sage"
      : avg <= 2
        ? "lavender"
        : "peach";
    return {
      day: WEEKDAY_LETTERS[bucket.date.getDay()] ?? "",
      value,
      hue,
      today: idx === buckets.length - 1,
    };
  });
}

function computeAverageScore(entries: readonly MoodEntry[]): string {
  if (entries.length === 0) return "0/5";
  const total = entries.reduce((acc, e) => acc + e.level, 0);
  return `${(total / entries.length).toFixed(1)}/5`;
}

function averageLevelToCalendarLevel(
  avg: number | null,
): CalendarMoodLevel {
  if (avg === null) return null;
  // Repo levels are 1..5; calendar levels are 0..4. Clamp + offset.
  const rounded = Math.round(avg) - 1;
  if (rounded <= 0) return 0;
  if (rounded >= 4) return 4;
  return rounded as CalendarMoodLevel;
}

export function MoodStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="MoodDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="MoodDashboard" component={MoodDashboardRoute} />
      <Stack.Screen name="MoodSelector" component={MoodSelectorRoute} />
      <Stack.Screen name="MoodCalendar" component={MoodCalendarRoute} />
      <Stack.Screen name="MoodInsights" component={MoodInsightsRoute} />
    </Stack.Navigator>
  );
}

