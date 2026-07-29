/**
 * Profile Stack Navigator
 * @description Navigation stack for profile and settings screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to ProfileDashboard + AccountSettings
 * + ProfileNotificationSettings. The 11 deep-settings screens
 * (PersonalInformation, SecuritySettings, LinkedDevices, Languages,
 * HelpCenter, etc.) were deleted; S9 builds the prototype-aligned account
 * settings surface with inline rows instead of sub-pages.
 *
 * Sprint 11: dashboard wired to repository aggregates
 * (`mood.list().length`, `journal.list().length`). Notification settings
 * read/write via the SettingsRepository key-value store.
 *
 * Phase 1.6: a rejected notification-toggle write now rolls the switch back
 * and tells the user. It previously logged to `console.warn` under `__DEV__`
 * only and left the switch in its new position, so a release build showed
 * "sound off" while the database still said on — until the next launch
 * flipped it back with no explanation.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../../shared/types/navigation";

import { ProfileDashboardScreen } from "../../../features/profile/screens/ProfileDashboardScreen";
import { AccountSettingsScreen } from "../../../features/profile/screens/AccountSettingsScreen";
import { NotificationSettingsScreen } from "../../../features/profile/screens/NotificationSettingsScreen";
import { ScreenSkeleton } from "../../../shared/components/primitives/ScreenSkeleton";
import { useWriteFailureToast } from "../../../shared/utils/useWriteFailureToast";
import { useRepositories } from "../../providers/RepositoryProvider";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const NOTIFICATION_KEYS = {
  dailyCheckin: "notif.dailyCheckin",
  sessionReminders: "notif.sessionReminders",
  sound: "notif.sound",
  vibration: "notif.vibration",
  resources: "notif.resources",
} as const;

interface ProfileAggregates {
  readonly streakDays: number;
  readonly sessionCount: number;
  readonly mindfulHours: number;
}

/** Settings keys holding the account profile, once onboarding persists it. */
const PROFILE_KEYS = {
  name: "profile.name",
  email: "profile.email",
} as const;

/** The account identity, as far as the app actually knows it. */
interface AccountProfile {
  readonly name?: string;
  readonly email?: string;
}

/**
 * Read the stored account profile.
 *
 * Truthfulness contract (Phase 1): these keys are empty today — nothing
 * captures a name or email yet (onboarding holds both in local state, which
 * Phase 2 persists). Reading them anyway means both surfaces show their
 * "add your name" prompt now and the real value the moment one exists, instead
 * of the hardcoded "Rayyan Ahmed" they used to show forever.
 *
 * Shared by the dashboard and settings routes so the two cannot disagree about
 * who the user is.
 *
 * @returns the profile, or null while the read is still in flight
 */
function useAccountProfile(): AccountProfile | null {
  const { settings, isReady } = useRepositories();
  const [profile, setProfile] = React.useState<AccountProfile | null>(null);

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const [name, email] = await Promise.all([
        settings.getValue(PROFILE_KEYS.name),
        settings.getValue(PROFILE_KEYS.email),
      ]);
      if (cancelled) return;
      setProfile({ name: name ?? undefined, email: email ?? undefined });
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, settings]);

  return profile;
}

/** Window used when summing mindful-session duration for the dashboard. */
const MINDFUL_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const MS_PER_HOUR = 3_600_000;

function ProfileDashboardRoute({
  navigation,
}: NativeStackScreenProps<
  ProfileStackParamList,
  "ProfileDashboard"
>): React.ReactElement {
  const { mood, journal, chat, mindful, isReady } = useRepositories();
  const [data, setData] = React.useState<ProfileAggregates | null>(null);
  const profile = useAccountProfile();

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const since = Date.now() - MINDFUL_WINDOW_MS;
      const [moods, journals, conversations, streak, mindfulMs] =
        await Promise.all([
          mood.list({ limit: 365 }),
          journal.list({ limit: 365 }),
          chat.listConversations(),
          mood.getStreak(),
          mindful.totalDurationMs({ since }),
        ]);
      if (cancelled) return;
      setData({
        streakDays: streak,
        sessionCount: conversations.length + journals.length + moods.length,
        mindfulHours: mindfulMs / MS_PER_HOUR,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [chat, isReady, journal, mindful, mood]);

  if (!isReady || !data || !profile) {
    return (
      <ScreenSkeleton testID="profile-dashboard-skeleton" />
    );
  }

  return (
    <ProfileDashboardScreen
      userName={profile.name}
      streakDays={data.streakDays}
      sessionCount={data.sessionCount}
      mindfulHours={data.mindfulHours}
      onChangePhoto={() => undefined}
      onPersonalInfo={() => navigation.navigate("AccountSettings")}
      onNotifications={() =>
        navigation.navigate("ProfileNotificationSettings")
      }
      onPrivacy={() => navigation.navigate("AccountSettings")}
      onLanguage={() => navigation.navigate("AccountSettings")}
      onHelp={() => undefined}
      onFeedback={() => undefined}
      onInvite={() => undefined}
    />
  );
}

function AccountSettingsRoute({ navigation }: any): React.ReactElement {
  const { settings, isReady } = useRepositories();
  const profile = useAccountProfile();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState<
    boolean | null
  >(null);

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const raw = await settings.getValue(NOTIFICATION_KEYS.dailyCheckin);
      if (cancelled) return;
      setNotificationsEnabled(parseBool(raw, true));
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, settings]);

  if (!isReady || !profile || notificationsEnabled === null) {
    return <ScreenSkeleton testID="account-settings-skeleton" />;
  }

  return (
    <AccountSettingsScreen
      userName={profile.name}
      userEmail={profile.email}
      notificationsEnabled={notificationsEnabled}
      onBack={() => navigation.goBack()}
      onNotifications={() => navigation.navigate("ProfileNotificationSettings")}
    />
  );
}

interface NotificationToggles {
  readonly dailyCheckin: boolean;
  readonly sessionReminders: boolean;
  readonly sound: boolean;
  readonly vibration: boolean;
  readonly resources: boolean;
}

const DEFAULT_TOGGLES: NotificationToggles = {
  dailyCheckin: true,
  sessionReminders: true,
  sound: true,
  vibration: true,
  resources: true,
};

function ProfileNotificationSettingsRoute({
  navigation,
}: any): React.ReactElement {
  const { settings, isReady } = useRepositories();
  const { reportWriteFailure, failureToast } = useWriteFailureToast();
  const [toggles, setToggles] = React.useState<NotificationToggles | null>(
    null,
  );

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const entries = await Promise.all([
        settings.getValue(NOTIFICATION_KEYS.dailyCheckin),
        settings.getValue(NOTIFICATION_KEYS.sessionReminders),
        settings.getValue(NOTIFICATION_KEYS.sound),
        settings.getValue(NOTIFICATION_KEYS.vibration),
        settings.getValue(NOTIFICATION_KEYS.resources),
      ]);
      if (cancelled) return;
      setToggles({
        dailyCheckin: parseBool(entries[0], DEFAULT_TOGGLES.dailyCheckin),
        sessionReminders: parseBool(
          entries[1],
          DEFAULT_TOGGLES.sessionReminders,
        ),
        sound: parseBool(entries[2], DEFAULT_TOGGLES.sound),
        vibration: parseBool(entries[3], DEFAULT_TOGGLES.vibration),
        resources: parseBool(entries[4], DEFAULT_TOGGLES.resources),
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [isReady, settings]);

  const handleToggle = React.useCallback(
    (id: string, value: boolean) => {
      const key = idToKey(id);
      if (!key) return;
      // Optimistically flip the local state — a switch that lags behind the
      // finger reads as broken.
      setToggles((prev) =>
        prev ? { ...prev, [keyToField(key)]: value } : prev,
      );
      const rollback = (): void => {
        setToggles((prev) =>
          prev ? { ...prev, [keyToField(key)]: !value } : prev,
        );
      };
      // Not-ready is a rejected write like any other: the no-op bundle's
      // `set` throws, so let it fall into the same handler instead of
      // maintaining a second, dev-only path for it.
      void settings
        .set({ key, value: value ? "true" : "false" })
        .catch((error: unknown) => {
          rollback();
          reportWriteFailure({
            operation: "settings.set",
            error,
            message: "We couldn't save that preference. Please try again.",
            context: { key },
          });
        });
    },
    [reportWriteFailure, settings],
  );

  if (!isReady || !toggles) {
    return (
      <ScreenSkeleton testID="notification-settings-skeleton" />
    );
  }

  return (
    <>
      <NotificationSettingsScreen
        chatbotToggles={[
          {
            id: "daily-checkin",
            label: "Daily check-ins",
            enabled: toggles.dailyCheckin,
          },
          {
            id: "session-reminders",
            label: "Session reminders",
            enabled: toggles.sessionReminders,
          },
        ]}
        soundEnabled={toggles.sound}
        soundDescription="Play audible alerts"
        vibrationEnabled={toggles.vibration}
        vibrationDescription="Use haptic feedback"
        miscItems={[]}
        resourcesEnabled={toggles.resources}
        resourcesDescription="Suggest wellbeing resources"
        onBack={() => navigation.goBack()}
        onToggle={handleToggle}
        onItemPress={() => undefined}
      />
      {failureToast}
    </>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseBool(raw: string | null, fallback: boolean): boolean {
  if (raw === null) return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return fallback;
}

function idToKey(id: string): string | null {
  switch (id) {
    case "daily-checkin":
      return NOTIFICATION_KEYS.dailyCheckin;
    case "session-reminders":
      return NOTIFICATION_KEYS.sessionReminders;
    case "sound":
      return NOTIFICATION_KEYS.sound;
    case "vibration":
      return NOTIFICATION_KEYS.vibration;
    case "resources":
      return NOTIFICATION_KEYS.resources;
    default:
      return null;
  }
}

function keyToField(key: string): keyof NotificationToggles {
  switch (key) {
    case NOTIFICATION_KEYS.dailyCheckin:
      return "dailyCheckin";
    case NOTIFICATION_KEYS.sessionReminders:
      return "sessionReminders";
    case NOTIFICATION_KEYS.sound:
      return "sound";
    case NOTIFICATION_KEYS.vibration:
      return "vibration";
    default:
      return "resources";
  }
}

export function ProfileStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="ProfileDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="ProfileDashboard" component={ProfileDashboardRoute} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsRoute} />
      <Stack.Screen
        name="ProfileNotificationSettings"
        component={ProfileNotificationSettingsRoute}
      />
    </Stack.Navigator>
  );
}
