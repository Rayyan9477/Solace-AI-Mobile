/**
 * Dashboard Stack Navigator
 * @description Navigation stack for dashboard / home feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to HomeDashboard. The Solace-Score
 * detail / insights / suggestions sub-screens were deleted; S6 builds
 * Home v2 (prototype #20) which absorbs the score-card + insights inline.
 */

import React, { useCallback, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { DashboardStackParamList } from "../../../shared/types/navigation";

import {
  HomeDashboardScreen,
  DEFAULT_ARTICLES,
} from "../../../features/dashboard/screens/HomeDashboardScreen";
import type { MoodLevel } from "../../../shared/components/primitives";

const Stack = createNativeStackNavigator<DashboardStackParamList>();

function HomeDashboardScreenContainer(): React.ReactElement {
  const [mood, setMood] = useState<MoodLevel | null>(null);

  const handleMoodChange = useCallback((m: MoodLevel | null) => {
    setMood(m);
  }, []);

  const noop = useCallback(() => {
    /* placeholder — wire to real handlers in a future sprint */
  }, []);

  return (
    <HomeDashboardScreen
      userName="User"
      todayMood={mood}
      onMoodChange={handleMoodChange}
      solaceScore={0}
      streakDays={0}
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
