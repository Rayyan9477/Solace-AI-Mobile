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
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../../shared/types/navigation";

import { ProfileDashboardScreen } from "../../../features/profile/screens/ProfileDashboardScreen";
import { AccountSettingsScreen } from "../../../features/profile/screens/AccountSettingsScreen";
import { NotificationSettingsScreen } from "../../../features/profile/screens/NotificationSettingsScreen";
import { SkeletonShimmer } from "../../../shared/components/primitives/SkeletonShimmer";
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

function ProfileDashboardRoute({
  navigation,
}: NativeStackScreenProps<
  ProfileStackParamList,
  "ProfileDashboard"
>): React.ReactElement {
  const { mood, journal, chat, isReady } = useRepositories();
  const [data, setData] = React.useState<ProfileAggregates | null>(null);

  React.useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    void (async () => {
      const [moods, journals, conversations, streak] = await Promise.all([
        mood.list({ limit: 365 }),
        journal.list({ limit: 365 }),
        chat.listConversations(),
        mood.getStreak(),
      ]);
      if (cancelled) return;
      setData({
        streakDays: streak,
        sessionCount: conversations.length + journals.length + moods.length,
        // No mindful repo today; surface 0 until the schema lands.
        mindfulHours: 0,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [chat, isReady, journal, mood]);

  if (!isReady || !data) {
    return (
      <SkeletonShimmer
        testID="profile-dashboard-skeleton"
        width="100%"
        height={400}
      />
    );
  }

  return (
    <ProfileDashboardScreen
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
  return (
    <AccountSettingsScreen
      sections={[]}
      onBack={() => navigation.goBack()}
      onItemPress={() => undefined}
      onToggle={() => undefined}
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
      // Optimistically flip the local state.
      setToggles((prev) =>
        prev ? { ...prev, [keyToField(key)]: value } : prev,
      );
      // Persist. If the persistence layer isn't ready yet (theoretical race
      // — the skeleton fallback above gates against it, but defend anyway),
      // roll the optimistic flip back rather than dropping the write
      // silently. Surface the rollback in dev so the regression is visible.
      if (!isReady) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn(
            `[ProfileNotificationSettings] settings not ready — toggle "${id}" rolled back`,
          );
        }
        setToggles((prev) =>
          prev ? { ...prev, [keyToField(key)]: !value } : prev,
        );
        return;
      }
      void settings
        .set({ key, value: value ? "true" : "false" })
        .catch((err: unknown) => {
          if (__DEV__) {
            // eslint-disable-next-line no-console
            console.warn(
              `[ProfileNotificationSettings] failed to persist "${id}":`,
              err,
            );
          }
        });
    },
    [isReady, settings],
  );

  if (!isReady || !toggles) {
    return (
      <SkeletonShimmer
        testID="notification-settings-skeleton"
        width="100%"
        height={400}
      />
    );
  }

  return (
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
