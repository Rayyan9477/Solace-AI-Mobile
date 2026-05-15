/**
 * Journal Stack Navigator
 * @description Navigation stack for mental health journal feature screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to JournalList, CreateJournalEntry,
 * EditJournalEntry, JournalEntryDetail, TextJournalComposer.
 * VoiceJournalRecording, JournalCalendar, and JournalInsights were deleted.
 *
 * Sprint 11: dashboard + detail + composer routes wired to the SQLite-backed
 * journal repository. Reads use `useEffect` hydration with a SkeletonShimmer
 * fallback while `isReady === false`; the composer persists each new entry
 * via `journal.create()` (or `journal.update()` when editing) before
 * navigating back.
 */

import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import type {
  JournalStackParamList,
  RootStackParamList,
} from "../../../shared/types/navigation";
import type { MoodLevel } from "../../../shared/components/primitives";

import { JournalDashboardScreen } from "../../../features/journal/screens/JournalDashboardScreen";
import { JournalEntryDetailScreen } from "../../../features/journal/screens/JournalEntryDetailScreen";
import { TextJournalComposerScreen } from "../../../features/journal/screens/TextJournalComposerScreen";
import type {
  JournalEntry as ScreenJournalEntry,
  JournalMoodHue,
} from "../../../features/journal/screens/JournalDashboardScreen";
import type { JournalEntry as DetailJournalEntry } from "../../../features/journal/screens/JournalEntryDetailScreen";
import { ScreenSkeleton } from "../../../shared/components/primitives/ScreenSkeleton";
import { useRepositories } from "../../providers/RepositoryProvider";
import type { JournalEntry } from "../../../shared/data/types";

const Stack = createNativeStackNavigator<JournalStackParamList>();

const MOOD_LABELS: Record<number, string> = {
  1: "Struggling",
  2: "Down",
  3: "Neutral",
  4: "Content",
  5: "Overjoyed",
};

/**
 * Composer adapter — owns local draft state and persists via the repo on
 * save. Edit mode hydrates the draft from the repository when given a route
 * param `entryId`.
 */
function TextJournalComposerScreenAdapter({
  navigation,
  route,
}: NativeStackScreenProps<
  JournalStackParamList,
  "TextJournalComposer" | "CreateJournalEntry" | "EditJournalEntry"
>): React.ReactElement {
  const { journal, isReady } = useRepositories();
  const editingId = (route.params as any)?.entryId as string | undefined;
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [moodLevel, setMoodLevel] = useState<MoodLevel | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(!editingId);

  React.useEffect(() => {
    if (!isReady || !editingId) return;
    let cancelled = false;
    void (async () => {
      const existing = await journal.byId(editingId);
      if (cancelled) return;
      if (existing) {
        setTitle(existing.title ?? "");
        setBody(existing.body);
        setMoodLevel((existing.moodLevel as MoodLevel | undefined) ?? null);
        setHashtags(existing.hashtags ? Array.from(existing.hashtags) : []);
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [editingId, isReady, journal]);

  const handleSave = React.useCallback(() => {
    const persist = async (): Promise<void> => {
      if (!isReady || body.trim().length === 0) return;
      try {
        if (editingId) {
          await journal.update(editingId, {
            title: title.trim().length > 0 ? title.trim() : undefined,
            body: body.trim(),
            moodLevel: moodLevel ?? undefined,
            hashtags: hashtags.length > 0 ? hashtags : undefined,
          });
        } else {
          await journal.create({
            title: title.trim().length > 0 ? title.trim() : undefined,
            body: body.trim(),
            moodLevel: moodLevel ?? undefined,
            hashtags: hashtags.length > 0 ? hashtags : undefined,
          });
        }
      } catch {
        // Persistence failure must not block navigation.
      }
    };
    void persist().finally(() => navigation.goBack());
  }, [body, editingId, hashtags, isReady, journal, moodLevel, navigation, title]);

  if (!hydrated) {
    return (
      <ScreenSkeleton testID="journal-composer-skeleton" />
    );
  }

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
      onSave={handleSave}
      onCrisisDetected={() => {
        // Classifier tripwire — open the root-mounted crisis modal.
        // Save is not blocked; modal is additive overlay.
        navigation
          .getParent<NavigationProp<RootStackParamList>>()
          ?.navigate("CrisisModal", { screen: "CrisisSupport" });
      }}
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
  const { journal, isReady } = useRepositories();
  const [entries, setEntries] = React.useState<readonly JournalEntry[] | null>(
    null,
  );

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const list = await journal.list({ limit: 30 });
      if (cancelled) return;
      setEntries(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, journal]);

  if (!isReady || !entries) {
    return (
      <ScreenSkeleton testID="journal-dashboard-skeleton" />
    );
  }

  const screenEntries: ScreenJournalEntry[] = entries.slice(0, 10).map(
    toScreenEntry,
  );

  return (
    <JournalDashboardScreen
      entries={screenEntries}
      entryCount={entries.length}
      onSearch={() => undefined}
      onCompose={() => navigation.navigate("CreateJournalEntry")}
      onViewAll={() => undefined}
      onEntryPress={(id) =>
        navigation.navigate("JournalEntryDetail", { entryId: id })
      }
    />
  );
}

/** Adapter — hydrates a journal entry by id and renders its detail view. */
function JournalEntryDetailScreenAdapter({
  navigation,
  route,
}: NativeStackScreenProps<
  JournalStackParamList,
  "JournalEntryDetail"
>): React.ReactElement {
  const { journal, isReady } = useRepositories();
  const entryId = route.params?.entryId;
  const [entry, setEntry] = React.useState<JournalEntry | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    if (!isReady || !entryId) {
      setLoaded(true);
      return;
    }
    let cancelled = false;
    // Reset loaded on every entryId change so the skeleton replays cleanly
    // for fast remount-during-fetch (deep-link churn).
    setLoaded(false);
    setEntry(null);
    void (async () => {
      try {
        const found = await journal.byId(entryId);
        if (cancelled) return;
        setEntry(found);
      } catch {
        // Repo failure must not strand the user on a skeleton — we still
        // flip loaded so the screen renders the empty state.
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [entryId, isReady, journal]);

  if (!loaded) {
    return (
      <ScreenSkeleton testID="journal-detail-skeleton" />
    );
  }

  return (
    <JournalEntryDetailScreen
      entry={entry ? toDetailEntry(entry) : undefined}
      onBack={() => navigation.goBack()}
      onEdit={() =>
        navigation.navigate("EditJournalEntry", {
          entryId: entry?.id ?? entryId ?? "",
        })
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

const HUE_BY_LEVEL: Record<number, JournalMoodHue> = {
  1: "lavender",
  2: "lavender",
  3: "peach",
  4: "sage",
  5: "aurora",
};

function toScreenEntry(entry: JournalEntry): ScreenJournalEntry {
  const date = new Date(entry.createdAt);
  const moodLevel = entry.moodLevel ?? 3;
  return {
    id: entry.id,
    date: formatRelativeDate(date),
    mood: MOOD_LABELS[moodLevel] ?? "Reflective",
    moodHue: HUE_BY_LEVEL[moodLevel] ?? "peach",
    title: entry.title ?? "Untitled",
    preview: entry.body.slice(0, 120),
  };
}

function toDetailEntry(entry: JournalEntry): DetailJournalEntry {
  const date = new Date(entry.createdAt);
  const level = (entry.moodLevel ?? 3) as MoodLevel;
  return {
    id: entry.id,
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    moodLevel: level,
    moodLabel: MOOD_LABELS[level] ?? "",
    title: entry.title ?? "Untitled",
    paragraphs: entry.body.split(/\n\n+/),
    gratitudeItems: [],
    insight: "",
    tags: entry.hashtags ? Array.from(entry.hashtags) : [],
    wordCount: entry.body.trim().split(/\s+/).filter(Boolean).length,
    heartRate: 0,
    weather: "",
    readMinutes: Math.max(1, Math.round(entry.body.length / 600)),
  };
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const ms = date.getTime();
  if (ms >= startOfToday) return "Today";
  if (ms >= startOfToday - 86_400_000) return "Yesterday";
  return date.toLocaleDateString();
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
