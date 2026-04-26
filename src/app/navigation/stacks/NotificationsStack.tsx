/**
 * Notifications Stack Navigator
 * @description Navigation stack for the notifications inbox.
 *
 * Sprint 4 (prototype v4.2): slimmed to NotificationsInbox +
 * NotificationSettings + NotificationDetail. The 5 per-notification-type
 * "celebration" screens (SolaceScoreIncrease, JournalProgress,
 * TherapyReminder, StressDecreased, MeditationReminder) were deleted;
 * those become NotificationCard variants in S5.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NotificationsStackParamList } from "../../../shared/types/navigation";

import { NotificationsDashboardScreen } from "../../../features/notifications/screens/NotificationsDashboardScreen";
import { NotificationSettingsScreen } from "../../../features/profile/screens/NotificationSettingsScreen";

const Stack = createNativeStackNavigator<NotificationsStackParamList>();

const DEFAULT_CHATBOT_TOGGLES = [
  { id: "daily-checkin", label: "Daily check-ins", enabled: true },
  { id: "session-reminders", label: "Session reminders", enabled: true },
  { id: "goal-progress", label: "Goal progress updates", enabled: false },
];

const DEFAULT_MISC_ITEMS = [
  {
    id: "dnd-hours",
    label: "Do not disturb hours",
    type: "value" as const,
    value: "10:00 PM - 7:00 AM",
  },
  {
    id: "community-updates",
    label: "Community updates",
    type: "toggle" as const,
    enabled: true,
  },
];

function NotificationsInboxRoute({ navigation }: any): React.ReactElement {
  return (
    <NotificationsDashboardScreen
      unreadCount={3}
      sections={[]}
      onBack={() => navigation.goBack()}
      onSettings={() => navigation.navigate("NotificationSettings")}
      onNotificationPress={() => {}}
      onOptionsPress={() => {}}
    />
  );
}

function NotificationSettingsRoute({ navigation }: any): React.ReactElement {
  const [chatbotToggles, setChatbotToggles] = React.useState(DEFAULT_CHATBOT_TOGGLES);
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [vibrationEnabled, setVibrationEnabled] = React.useState(true);
  const [resourcesEnabled, setResourcesEnabled] = React.useState(true);
  const [miscItems, setMiscItems] = React.useState(DEFAULT_MISC_ITEMS);

  const handleToggle = (id: string, value: boolean): void => {
    if (id === "sound") {
      setSoundEnabled(value);
      return;
    }

    if (id === "vibration") {
      setVibrationEnabled(value);
      return;
    }

    if (id === "resources") {
      setResourcesEnabled(value);
      return;
    }

    setChatbotToggles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: value } : item)),
    );

    setMiscItems((prev) =>
      prev.map((item) =>
        item.id === id && item.type === "toggle" ? { ...item, enabled: value } : item,
      ),
    );
  };

  return (
    <NotificationSettingsScreen
      chatbotToggles={chatbotToggles}
      soundEnabled={soundEnabled}
      soundDescription="Play audible alerts for reminders and messages"
      vibrationEnabled={vibrationEnabled}
      vibrationDescription="Use haptic feedback for urgent notifications"
      miscItems={miscItems}
      resourcesEnabled={resourcesEnabled}
      resourcesDescription="Suggest wellbeing resources and exercises"
      onBack={() => navigation.goBack()}
      onToggle={handleToggle}
      onItemPress={() => {}}
    />
  );
}

function NotificationDetailRoute({ navigation }: any): React.ReactElement {
  // Placeholder until S9 builds a proper notification detail surface.
  return (
    <NotificationsDashboardScreen
      unreadCount={0}
      sections={[]}
      onBack={() => navigation.goBack()}
      onSettings={() => navigation.navigate("NotificationSettings")}
      onNotificationPress={() => {}}
      onOptionsPress={() => {}}
    />
  );
}

export function NotificationsStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="NotificationsInbox"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="NotificationsInbox" component={NotificationsInboxRoute} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsRoute} />
      <Stack.Screen
        name="NotificationDetail"
        component={NotificationDetailRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
    </Stack.Navigator>
  );
}
