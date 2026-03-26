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

const Stack = createNativeStackNavigator<NotificationsStackParamList>();

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
