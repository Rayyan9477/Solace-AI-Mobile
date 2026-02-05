/**
 * Journal Stack Navigator
 * @description Navigation stack for mental health journal feature screens
 * @module Navigation
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { JournalStackParamList } from "../../../shared/types/navigation";

// Journal Screens
import { JournalDashboardScreen } from "../../../features/journal/screens/JournalDashboardScreen";
// TODO: Create missing screens or map to existing alternatives
// import { JournalEntryDetailScreen } from "../../../features/journal/screens/JournalEntryDetailScreen";
// import { JournalCalendarScreen } from "../../../features/journal/screens/JournalCalendarScreen";
// import { JournalInsightsScreen } from "../../../features/journal/screens/JournalInsightsScreen";
import { TextJournalComposerScreen } from "../../../features/journal/screens/TextJournalComposerScreen";
import { VoiceJournalRecordingScreen } from "../../../features/journal/screens/VoiceJournalRecordingScreen";

const Stack = createNativeStackNavigator<JournalStackParamList>();

/**
 * JournalStack Navigator Component
 * @returns {React.ReactElement} Journal stack navigator
 */
export function JournalStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="JournalList"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="JournalList" component={JournalDashboardScreen} />
      <Stack.Screen name="CreateJournalEntry" component={TextJournalComposerScreen} />
      <Stack.Screen name="EditJournalEntry" component={TextJournalComposerScreen} />
      <Stack.Screen
        name="VoiceJournalRecording"
        component={VoiceJournalRecordingScreen}
        options={{ presentation: "modal" }}
      />
      {/* TODO: Uncomment when screens are created */}
      {/* <Stack.Screen name="JournalEntryDetail" component={JournalEntryDetailScreen} /> */}
      {/* <Stack.Screen name="JournalCalendar" component={JournalCalendarScreen} /> */}
      {/* <Stack.Screen name="JournalInsights" component={JournalInsightsScreen} /> */}
      <Stack.Screen name="TextJournalComposer" component={TextJournalComposerScreen} />
    </Stack.Navigator>
  );
}
