/**
 * Sleep Stack Navigator
 * @description Navigation stack for sleep tracking feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to SleepDashboard + SleepInsights.
 * The 8 over-fragmented sleep screens (SleepingScreen, WakeUpScreen,
 * SleepQualityGauge, SleepSummary, NewSleepSchedule, etc.) were deleted;
 * S6 builds SleepLogEntryScreen as the single sleep-log surface.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { SleepStackParamList } from "../../../shared/types/navigation";

import { SleepDashboardScreen } from "../../../features/sleep/screens/SleepDashboardScreen";
import { SleepInsightsScreen } from "../../../features/sleep/screens/SleepInsightsScreen";

const Stack = createNativeStackNavigator<SleepStackParamList>();

function SleepDashboardRoute({ navigation }: any): React.ReactElement {
  return (
    <SleepDashboardScreen
      sleepScore={72}
      sleepQuality="Good"
      remHours={1.5}
      coreHours={5.5}
      remProgress={0.6}
      coreProgress={0.8}
      onBack={() => navigation.goBack()}
      onSeeAll={() => navigation.navigate("SleepInsights")}
      onAddSleep={() => {}}
      onMetricPress={() => {}}
    />
  );
}

function SleepInsightsRoute({ navigation }: any): React.ReactElement {
  return (
    <SleepInsightsScreen
      selectedRange="1 Week"
      suggestions={[]}
      onBack={() => navigation.goBack()}
      onRangeChange={() => {}}
      onSuggestionPress={() => {}}
      onSeeAllPress={() => {}}
    />
  );
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
