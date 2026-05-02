/**
 * Journal Stack Navigator
 * @description Navigation stack for mental health journal feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to JournalList, CreateJournalEntry,
 * EditJournalEntry, JournalEntryDetail, TextJournalComposer.
 * VoiceJournalRecording, JournalCalendar, and JournalInsights were deleted.
 */

import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { JournalStackParamList } from "../../../shared/types/navigation";
import type { MoodLevel } from "../../../shared/components/primitives";

import { JournalDashboardScreen } from "../../../features/journal/screens/JournalDashboardScreen";
import { JournalEntryDetailScreen } from "../../../features/journal/screens/JournalEntryDetailScreen";
import { TextJournalComposerScreen } from "../../../features/journal/screens/TextJournalComposerScreen";

const Stack = createNativeStackNavigator<JournalStackParamList>();

/** Thin navigation adapter — owns the local state for the composer. */
function TextJournalComposerScreenAdapter({
  navigation,
}: NativeStackScreenProps<
  JournalStackParamList,
  "TextJournalComposer" | "CreateJournalEntry" | "EditJournalEntry"
>): React.ReactElement {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [moodLevel, setMoodLevel] = useState<MoodLevel | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);

  return (
    <TextJournalComposerScreen
      title={title}
      onTitleChange={setTitle}
      body={body}
      onBodyChange={setBody}
      moodLevel={moodLevel}
      onMoodLevelChange={setMoodLevel}
      hashtags={hashtags}
      onHashtagsChange={setHashtags}
      onClose={() => navigation.goBack()}
      onSave={() => navigation.goBack()}
    />
  );
}

/** Adapter — wires JournalDashboard navigation to in-stack routes. */
function JournalDashboardScreenAdapter({
  navigation,
}: NativeStackScreenProps<
  JournalStackParamList,
  "JournalList"
>): React.ReactElement {
  return (
    <JournalDashboardScreen
      onSearch={() => undefined}
      onCompose={() => navigation.navigate("CreateJournalEntry")}
      onViewAll={() => undefined}
      onEntryPress={(id) => navigation.navigate("JournalEntryDetail", { entryId: id })}
    />
  );
}

/** Adapter — wires JournalEntryDetail back/edit affordances to navigation. */
function JournalEntryDetailScreenAdapter({
  navigation,
  route,
}: NativeStackScreenProps<
  JournalStackParamList,
  "JournalEntryDetail"
>): React.ReactElement {
  const entryId = route.params?.entryId ?? "default-quiet-morning";
  return (
    <JournalEntryDetailScreen
      onBack={() => navigation.goBack()}
      onEdit={() => navigation.navigate("EditJournalEntry", { entryId })}
    />
  );
}

export function JournalStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="JournalList"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="JournalList" component={JournalDashboardScreenAdapter} />
      <Stack.Screen name="CreateJournalEntry" component={TextJournalComposerScreenAdapter} />
      <Stack.Screen name="EditJournalEntry" component={TextJournalComposerScreenAdapter} />
      <Stack.Screen name="JournalEntryDetail" component={JournalEntryDetailScreenAdapter} />
      <Stack.Screen name="TextJournalComposer" component={TextJournalComposerScreenAdapter} />
    </Stack.Navigator>
  );
}
