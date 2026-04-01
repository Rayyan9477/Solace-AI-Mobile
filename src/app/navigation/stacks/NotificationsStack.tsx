/**
 * Notifications Stack Navigator
 * @description Navigation stack for smart notifications and alert screens
 * @module Navigation
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NotificationsStackParamList } from "../../../shared/types/navigation";

// Notifications Screens
import { NotificationsDashboardScreen } from "../../../features/notifications/screens/NotificationsDashboardScreen";
import { SolaceScoreIncreaseScreen } from "../../../features/notifications/screens/SolaceScoreIncreaseScreen";
import { JournalProgressScreen } from "../../../features/notifications/screens/JournalProgressScreen";
import { TherapyReminderScreen } from "../../../features/notifications/screens/TherapyReminderScreen";
import { StressDecreasedScreen } from "../../../features/notifications/screens/StressDecreasedScreen";
import { MeditationReminderScreen } from "../../../features/notifications/screens/MeditationReminderScreen";
import { NotificationSettingsScreen } from "../../../features/profile/screens/NotificationSettingsScreen";

const Stack = createNativeStackNavigator<NotificationsStackParamList>();

const DEFAULT_CHATBOT_TOGGLES = [
  { id: "daily-checkin", label: "Daily check-ins", enabled: true },
  { id: "session-reminders", label: "Session reminders", enabled: true },
  { id: "goal-progress", label: "Goal progress updates", enabled: false },
];

const DEFAULT_MISC_ITEMS = [
  { id: "dnd-hours", label: "Do not disturb hours", type: "value" as const, value: "10:00 PM - 7:00 AM" },
  { id: "community-updates", label: "Community updates", type: "toggle" as const, enabled: true },
];

// ---------------------------------------------------------------------------
// Route wrappers
// ---------------------------------------------------------------------------

function NotificationsDashboardRoute({ navigation }: any): React.ReactElement {
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

    setChatbotToggles((prev) => prev.map((item) => (
      item.id === id ? { ...item, enabled: value } : item
    )));

    setMiscItems((prev) => prev.map((item) => (
      item.id === id && item.type === "toggle" ? { ...item, enabled: value } : item
    )));
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

function SolaceScoreIncreaseRoute({ navigation }: any): React.ReactElement {
  return (
    <SolaceScoreIncreaseScreen
      scoreChange={5}
      percentageChange={12}
      currentScore={78}
      comparisonPeriod="last week"
      onBack={() => navigation.goBack()}
      onSeeScore={() => navigation.navigate("NotificationsInbox")}
    />
  );
}

function JournalProgressRoute({ navigation }: any): React.ReactElement {
  return (
    <JournalProgressScreen
      completedCount={6}
      targetCount={10}
      remainingCount={4}
      onBack={() => navigation.goBack()}
      onSeeJournal={() => navigation.navigate("NotificationsInbox")}
    />
  );
}

function TherapyReminderRoute({ navigation }: any): React.ReactElement {
  return (
    <TherapyReminderScreen
      sessionTime="3:00 PM"
      sessionTitle="Therapy Session"
      countdownHours={2}
      countdownMinutes={30}
      onBack={() => navigation.goBack()}
      onSeeSchedule={() => navigation.navigate("NotificationsInbox")}
    />
  );
}

function StressDecreasedRoute({ navigation }: any): React.ReactElement {
  return (
    <StressDecreasedScreen
      currentLevel="Low"
      emojis={[
        { id: "relaxed", emoji: "😌", label: "Relaxed" },
        { id: "calm", emoji: "😊", label: "Calm" },
        { id: "happy", emoji: "😁", label: "Happy" },
        { id: "content", emoji: "🙂", label: "Content" },
        { id: "peaceful", emoji: "😇", label: "Peaceful" },
      ]}
      highlightedEmojiId="calm"
      onBack={() => navigation.goBack()}
      onSeeStressLevel={() => navigation.navigate("NotificationsInbox")}
    />
  );
}

function MeditationReminderRoute({ navigation }: any): React.ReactElement {
  return (
    <MeditationReminderScreen
      recommendedDuration={15}
      onBack={() => navigation.goBack()}
      onStartMeditation={() => navigation.navigate("NotificationsInbox")}
    />
  );
}

// ---------------------------------------------------------------------------
// Stack Navigator
// ---------------------------------------------------------------------------

/**
 * NotificationsStack Navigator Component
 * @returns {React.ReactElement} Notifications stack navigator
 */
export function NotificationsStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="NotificationsInbox"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="NotificationsInbox" component={NotificationsDashboardRoute} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsRoute} />
      <Stack.Screen
        name="FreudScoreIncreaseNotification"
        component={SolaceScoreIncreaseRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
      <Stack.Screen
        name="MoodTransitionAlert"
        component={JournalProgressRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
      <Stack.Screen
        name="NotificationDetail"
        component={TherapyReminderRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
      <Stack.Screen
        name="CriticalScoreWarning"
        component={StressDecreasedRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
      <Stack.Screen
        name="SleepQualityIncreaseNotification"
        component={MeditationReminderRoute}
        options={{ presentation: "modal", animation: "fade" }}
      />
    </Stack.Navigator>
  );
}
