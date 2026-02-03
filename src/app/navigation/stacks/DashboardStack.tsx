/**
 * Dashboard Stack Navigator
 * @description Navigation stack for dashboard/home feature screens
 * @module Navigation
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { DashboardStackParamList } from "../../../shared/types/navigation";

// Dashboard Screens
import { HomeDashboardScreen } from "../../../features/dashboard/screens/HomeDashboardScreen";
import { SolaceScoreDetailScreen } from "../../../features/dashboard/screens/SolaceScoreDetailScreen";
import { SolaceScoreInsightsScreen } from "../../../features/dashboard/screens/SolaceScoreInsightsScreen";
import { AISuggestionsScreen } from "../../../features/dashboard/screens/AISuggestionsScreen";
import { MindfulnessActivitiesScreen } from "../../../features/dashboard/screens/MindfulnessActivitiesScreen";
import { SleepQualityIncreaseScreen } from "../../../features/profile/screens/SleepQualityIncreaseScreen";

const Stack = createNativeStackNavigator<DashboardStackParamList>();

/**
 * DashboardStack Navigator Component
 * @returns {React.ReactElement} Dashboard stack navigator
 */
export function DashboardStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="HomeDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="HomeDashboard" component={HomeDashboardScreen} />
      <Stack.Screen name="SolaceScoreDetail" component={SolaceScoreDetailScreen} />
      <Stack.Screen name="SolaceScoreInsights" component={SolaceScoreInsightsScreen} />
      <Stack.Screen name="AISuggestions" component={AISuggestionsScreen} />
      <Stack.Screen name="MindfulnessActivities" component={MindfulnessActivitiesScreen} />
      <Stack.Screen
        name="SolaceScoreIncrease"
        component={SleepQualityIncreaseScreen}
        options={{ presentation: "modal", animation: "fade" }}
      />
    </Stack.Navigator>
  );
}
