/**
 * Mood Stack Navigator
 * @description Navigation stack for mood tracking feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to four survivors —
 * MoodDashboard, MoodSelector (S6 reskin → DailyCheckIn), MoodCalendar,
 * MoodAnalytics. AISuggestions and MoodHistory were deleted.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MoodStackParamList } from "../../../shared/types/navigation";

import { MoodDashboardScreen } from "../../../features/mood/screens/MoodDashboardScreen";
import { MoodSelectorScreen } from "../../../features/mood/screens/MoodSelectorScreen";
import { MoodCalendarScreen } from "../../../features/mood/screens/MoodCalendarScreen";
import { MoodAnalyticsScreen } from "../../../features/mood/screens/MoodAnalyticsScreen";

const Stack = createNativeStackNavigator<MoodStackParamList>();

const DEFAULT_MOOD_OPTIONS = [
  { index: 0, label: "Struggling", emoji: "😢", color: "#7B6CB8" },
  { index: 1, label: "Down", emoji: "😕", color: "#9B7EB0" },
  { index: 2, label: "Neutral", emoji: "😐", color: "#C4A574" },
  { index: 3, label: "Content", emoji: "🙂", color: "#9BC4B0" },
  { index: 4, label: "Overjoyed", emoji: "😄", color: "#F4A77E" },
];

function MoodSelectorRoute({ navigation }: any): React.ReactElement {
  const [selectedIndex, setSelectedIndex] = React.useState(2);
  return (
    <MoodSelectorScreen
      selectedMoodIndex={selectedIndex}
      moodOptions={DEFAULT_MOOD_OPTIONS}
      onBack={() => navigation.goBack()}
      onMoodChange={setSelectedIndex}
      onSetMood={() => navigation.goBack()}
    />
  );
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
      <Stack.Screen name="MoodDashboard" component={MoodDashboardScreen} />
      <Stack.Screen name="MoodSelector" component={MoodSelectorRoute} />
      <Stack.Screen name="MoodCalendar" component={MoodCalendarScreen} />
      <Stack.Screen name="MoodAnalytics" component={MoodAnalyticsScreen} />
    </Stack.Navigator>
  );
}
