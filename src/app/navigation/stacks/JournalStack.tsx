/**
 * Journal Stack Navigator
 * @description Navigation stack for mental health journal feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to JournalList, CreateJournalEntry,
 * EditJournalEntry, JournalEntryDetail, TextJournalComposer.
 * VoiceJournalRecording, JournalCalendar, and JournalInsights were deleted.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { JournalStackParamList } from "../../../shared/types/navigation";

import { JournalDashboardScreen } from "../../../features/journal/screens/JournalDashboardScreen";
import { JournalEntryDetailScreen } from "../../../features/journal/screens/JournalEntryDetailScreen";
import { TextJournalComposerScreen } from "../../../features/journal/screens/TextJournalComposerScreen";

const Stack = createNativeStackNavigator<JournalStackParamList>();

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
      <Stack.Screen name="JournalEntryDetail" component={JournalEntryDetailScreen} />
      <Stack.Screen name="TextJournalComposer" component={TextJournalComposerScreen} />
    </Stack.Navigator>
  );
}
