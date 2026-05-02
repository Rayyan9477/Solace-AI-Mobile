/**
 * Mood Stack Navigator
 * @description Navigation stack for mood tracking feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to four survivors —
 * MoodDashboard, MoodSelector (S6 reskin → DailyCheckIn), MoodCalendar,
 * MoodInsights (S8 reskin — replaces MoodAnalytics). AISuggestions and
 * MoodHistory were deleted.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { MoodStackParamList } from "../../../shared/types/navigation";

import { palette } from "../../../shared/theme";
import { MoodDashboardScreen } from "../../../features/mood/screens/MoodDashboardScreen";
import { MoodSelectorScreen } from "../../../features/mood/screens/MoodSelectorScreen";
import { MoodCalendarScreen } from "../../../features/mood/screens/MoodCalendarScreen";
import { MoodInsightsScreen } from "../../../features/mood/screens/MoodInsightsScreen";

const Stack = createNativeStackNavigator<MoodStackParamList>();

// Cosmic palette mapping: 5-level mood gradient (grief → energy)
const DEFAULT_MOOD_OPTIONS = [
  { index: 0, label: "Struggling", emoji: "😢", color: palette.lavender[500] },
  { index: 1, label: "Down", emoji: "😕", color: palette.lavender[300] },
  { index: 2, label: "Neutral", emoji: "😐", color: palette.warm[200] },
  { index: 3, label: "Content", emoji: "🙂", color: palette.sage[300] },
  { index: 4, label: "Overjoyed", emoji: "😄", color: palette.peach[300] },
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

function MoodDashboardRoute({ navigation }: any): React.ReactElement {
  return (
    <MoodDashboardScreen
      onCalendarPress={() => navigation.navigate("MoodCalendar")}
      onLogMood={() => navigation.navigate("MoodSelector", {})}
    />
  );
}

function MoodCalendarRoute({ navigation }: any): React.ReactElement {
  return (
    <MoodCalendarScreen
      onBack={() => navigation.goBack()}
      onChangeView={() => navigation.navigate("MoodInsights")}
    />
  );
}

function MoodInsightsRoute({ navigation }: any): React.ReactElement {
  return <MoodInsightsScreen onBack={() => navigation.goBack()} />;
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
