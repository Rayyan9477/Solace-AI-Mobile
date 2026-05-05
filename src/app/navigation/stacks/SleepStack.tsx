/**
 * Sleep Stack Navigator
 * @description Navigation stack for sleep tracking feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to SleepDashboard + SleepInsights.
 * The 8 over-fragmented sleep screens (SleepingScreen, WakeUpScreen,
 * SleepQualityGauge, SleepSummary, NewSleepSchedule, etc.) were deleted;
 * S6 builds SleepLogEntryScreen as the single sleep-log surface.
 *
 * Sprint 11: dashboard wired to the SQLite-backed sleep repository. The
 * `SleepLogEntry` entry-point is **not yet** declared in
 * `SleepStackParamList` — see "Decision points" in the wiring report —
 * so this stack only owns the dashboard + insights routes today. The
 * dashboard's `onLogSleep` no-op will be replaced by a navigate call once
 * the route is added to the param list.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { SleepStackParamList } from "../../../shared/types/navigation";

import { SleepDashboardScreen } from "../../../features/sleep/screens/SleepDashboardScreen";
import { SleepInsightsScreen } from "../../../features/sleep/screens/SleepInsightsScreen";
import type {
  SleepEntry as DashboardSleepEntry,
} from "../../../features/sleep/screens/SleepDashboardScreen";
import type { SleepHistoryDay } from "../../../shared/components/organisms/sleep";
import { SkeletonShimmer } from "../../../shared/components/primitives/SkeletonShimmer";
import { useRepositories } from "../../providers/RepositoryProvider";
import type { SleepEntry } from "../../../shared/data/types";

const Stack = createNativeStackNavigator<SleepStackParamList>();

const WEEK_DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

function SleepDashboardRoute({ navigation }: any): React.ReactElement {
  const { sleep, isReady } = useRepositories();
  const [entries, setEntries] = React.useState<readonly SleepEntry[] | null>(
    null,
  );

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const list = await sleep.list({ limit: 30 });
      if (cancelled) return;
      setEntries(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, sleep]);

  if (!isReady || !entries) {
    return (
      <SkeletonShimmer
        testID="sleep-dashboard-skeleton"
        width="100%"
        height={400}
      />
    );
  }

  const lastNight = entries[0] ? toDashboardEntry(entries[0]) : undefined;
  const weekHistory = buildWeekHistory(entries);

  return (
    <SleepDashboardScreen
      lastNight={lastNight}
      weekHistory={weekHistory}
      onBack={() => navigation.goBack()}
      onLogSleep={() => undefined}
      onMore={() => navigation.navigate("SleepInsights")}
    />
  );
}

function SleepInsightsRoute({ navigation }: any): React.ReactElement {
  const { sleep, isReady } = useRepositories();
  const [entries, setEntries] = React.useState<readonly SleepEntry[] | null>(
    null,
  );

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const list = await sleep.list({ limit: 30 });
      if (cancelled) return;
      setEntries(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, sleep]);

  if (!isReady || !entries) {
    return (
      <SkeletonShimmer
        testID="sleep-insights-skeleton"
        width="100%"
        height={400}
      />
    );
  }

  return (
    <SleepInsightsScreen
      selectedRange="1 Week"
      suggestions={deriveSleepSuggestions(entries)}
      onBack={() => navigation.goBack()}
      onRangeChange={() => undefined}
      onSuggestionPress={() => undefined}
      onSeeAllPress={() => undefined}
    />
  );
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function toDashboardEntry(entry: SleepEntry): DashboardSleepEntry {
  const durationMs = entry.wokeUp - entry.bedtime;
  const durationMinutes = Math.max(0, Math.round(durationMs / 60_000));
  const bedDate = new Date(entry.bedtime);
  const wokeDate = new Date(entry.wokeUp);
  return {
    durationMinutes,
    qualityPercent: ((entry.quality ?? 3) / 5) * 100,
    bedtime: formatTime(bedDate),
    wakeTime: formatTime(wokeDate),
    stages: {
      // The repo doesn't yet store stage breakdown; surface evenly until a
      // schema upgrade. See decision-points in the wiring report.
      deep: Math.round(durationMinutes * 0.18),
      core: Math.round(durationMinutes * 0.55),
      rem: Math.round(durationMinutes * 0.18),
      awake: Math.max(0, durationMinutes - Math.round(durationMinutes * 0.91)),
    },
  };
}

function buildWeekHistory(entries: readonly SleepEntry[]): SleepHistoryDay[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: SleepHistoryDay[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const target = new Date(today);
    target.setDate(today.getDate() - offset);
    const iso = formatIsoDate(target);
    const match = entries.find((e) => e.date === iso);
    const hours = match
      ? Math.max(0, (match.wokeUp - match.bedtime) / 3_600_000)
      : 0;
    days.push({
      label: WEEK_DAY_LETTERS[target.getDay()] ?? "",
      hours,
      isToday: offset === 0,
    });
  }
  return days;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatIsoDate(d: Date): string {
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Derive sleep-coaching suggestions from the user's recent entries. Returns an
 * empty list when not enough data — the screen renders the suggestions block
 * conditionally on length.
 */
function deriveSleepSuggestions(
  entries: readonly SleepEntry[],
): { id: string; icon: string; iconColor: string; title: string; description: string }[] {
  if (entries.length === 0) return [];
  const suggestions: {
    id: string;
    icon: string;
    iconColor: string;
    title: string;
    description: string;
  }[] = [];
  const avgHours =
    entries.reduce((sum, e) => sum + (e.wokeUp - e.bedtime), 0) /
    entries.length /
    3_600_000;
  if (avgHours < 7) {
    suggestions.push({
      id: "more-sleep",
      icon: "moon-outline",
      iconColor: "lavender",
      title: "Aim for 7+ hours",
      description: `You averaged ${avgHours.toFixed(1)}h over the last ${entries.length} nights.`,
    });
  }
  const lowQuality = entries.filter((e) => (e.quality ?? 3) <= 2).length;
  if (lowQuality >= Math.ceil(entries.length / 3)) {
    suggestions.push({
      id: "quality",
      icon: "flash-outline",
      iconColor: "peach",
      title: "Restless nights detected",
      description: "Try a wind-down ritual 30 min before bed.",
    });
  }
  return suggestions;
}

export function SleepStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="SleepDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="SleepDashboard" component={SleepDashboardRoute} />
      <Stack.Screen name="SleepInsights" component={SleepInsightsRoute} />
    </Stack.Navigator>
  );
}
