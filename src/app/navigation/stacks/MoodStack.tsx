/**
 * Mood Stack Navigator
 * @description Navigation stack for mood tracking feature screens
 * @module Navigation
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MoodStackParamList } from "../../../shared/types/navigation";

// Mood Screens
import { MoodDashboardScreen } from "../../../features/mood/screens/MoodDashboardScreen";
import { MoodSelectorScreen } from "../../../features/mood/screens/MoodSelectorScreen";
import { MoodHistoryScreen } from "../../../features/mood/screens/MoodHistoryScreen";
// TODO: Create MoodCalendarScreen and MoodAnalyticsScreen
// import { MoodCalendarScreen } from "../../../features/mood/screens/MoodCalendarScreen";
// import { MoodAnalyticsScreen } from "../../../features/mood/screens/MoodAnalyticsScreen";
import { AISuggestionsScreen } from "../../../features/mood/screens/AISuggestionsScreen";

const Stack = createNativeStackNavigator<MoodStackParamList>();

/**
 * MoodStack Navigator Component
 * @returns {React.ReactElement} Mood stack navigator
 */
export function MoodStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="MoodDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="MoodDashboard" component={MoodDashboardScreen} />
      <Stack.Screen name="MoodSelector" component={MoodSelectorScreen} />
      <Stack.Screen name="MoodHistory" component={MoodHistoryScreen} />
      {/* TODO: Uncomment when screens are created */}
      {/* <Stack.Screen name="MoodCalendar" component={MoodCalendarScreen} /> */}
      {/* <Stack.Screen name="MoodAnalytics" component={MoodAnalyticsScreen} /> */}
      <Stack.Screen name="MoodAISuggestions" component={AISuggestionsScreen} />
    </Stack.Navigator>
  );
}
