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
      onBack={() => navigation.goBack()}
      onLogSleep={() => {}}
      onMore={() => navigation.navigate("SleepInsights")}
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
