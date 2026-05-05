/**
 * Dashboard Stack Navigator
 * @description Navigation stack for dashboard / home feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to HomeDashboard. The Solace-Score
 * detail / insights / suggestions sub-screens were deleted; S6 builds
 * Home v2 (prototype #20) which absorbs the score-card + insights inline.
 *
 * Sprint 11: Home wired to repository aggregates — latest mood feeds the
 * mood selector default; recent mood + journal counts feed the streak +
 * score tiles. Mood writes from this surface persist via `mood.create()`.
 */

import React, { useCallback, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { DashboardStackParamList } from "../../../shared/types/navigation";

import {
  HomeDashboardScreen,
  DEFAULT_ARTICLES,
} from "../../../features/dashboard/screens/HomeDashboardScreen";
import type { MoodLevel } from "../../../shared/components/primitives";
import { SkeletonShimmer } from "../../../shared/components/primitives/SkeletonShimmer";
import { useRepositories } from "../../providers/RepositoryProvider";

const Stack = createNativeStackNavigator<DashboardStackParamList>();

interface HomeAggregates {
  readonly latestMoodLevel: MoodLevel | null;
  readonly streakDays: number;
  readonly journalCount: number;
  readonly persistedSolaceScore: number | null;
}

function HomeDashboardScreenContainer(): React.ReactElement {
  const { mood, journal, settings, isReady } = useRepositories();
  const [data, setData] = useState<HomeAggregates | null>(null);
  const [pendingMood, setPendingMood] = useState<MoodLevel | null>(null);

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const [moods, journals, streak, scoreRaw] = await Promise.all([
        mood.list({ limit: 1 }),
        journal.list({ limit: 365 }),
        mood.getStreak(),
        settings.getValue("solaceScore"),
      ]);
      if (cancelled) return;
      const persistedSolaceScore =
        typeof scoreRaw === "number"
          ? scoreRaw
          : typeof scoreRaw === "string"
            ? Number.parseInt(scoreRaw, 10) || null
            : null;
      setData({
        latestMoodLevel: moods[0]?.level ?? null,
        streakDays: streak,
        journalCount: journals.length,
        persistedSolaceScore,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, journal, mood, settings]);

  const handleMoodChange = useCallback(
    (m: MoodLevel | null) => {
      setPendingMood(m);
      if (!isReady || m === null) return;
      // Persist the home-surface mood check-in. Failure must not block UI.
      void mood
        .create({ level: m })
        .then(() => {
          setData((prev) =>
            prev ? { ...prev, latestMoodLevel: m } : prev,
          );
        })
        .catch(() => undefined);
    },
    [isReady, mood],
  );

  const noop = useCallback(() => undefined, []);

  if (!isReady || !data) {
    return (
      <SkeletonShimmer
        testID="home-dashboard-skeleton"
        width="100%"
        height={400}
      />
    );
  }

  return (
    <HomeDashboardScreen
      userName="User"
      todayMood={pendingMood ?? data.latestMoodLevel}
      onMoodChange={handleMoodChange}
      solaceScore={
        data.persistedSolaceScore ??
        Math.min(100, data.journalCount * 5 + data.streakDays * 3)
      }
      streakDays={data.streakDays}
      articles={DEFAULT_ARTICLES}
      onArticlePress={noop}
      onAllPracticesPress={noop}
      onNotificationsPress={noop}
    />
  );
}

export function DashboardStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="HomeDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="HomeDashboard"
        component={HomeDashboardScreenContainer}
      />
    </Stack.Navigator>
  );
}
