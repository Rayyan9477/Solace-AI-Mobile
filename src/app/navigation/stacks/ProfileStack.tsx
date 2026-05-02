/**
 * Profile Stack Navigator
 * @description Navigation stack for profile and settings screens.
 *
 * Sprint 4 (prototype v4.2): slimmed to ProfileDashboard + AccountSettings
 * + ProfileNotificationSettings. The 11 deep-settings screens
 * (PersonalInformation, SecuritySettings, LinkedDevices, Languages,
 * HelpCenter, etc.) were deleted; S9 builds the prototype-aligned account
 * settings surface with inline rows instead of sub-pages.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../../shared/types/navigation";

import { ProfileDashboardScreen } from "../../../features/profile/screens/ProfileDashboardScreen";
import { AccountSettingsScreen } from "../../../features/profile/screens/AccountSettingsScreen";
import { NotificationSettingsScreen } from "../../../features/profile/screens/NotificationSettingsScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const DEFAULT_NOTIFICATION_TOGGLES = [
  { id: "daily-checkin", label: "Daily check-ins", enabled: true },
  { id: "session-reminders", label: "Session reminders", enabled: true },
];

function ProfileDashboardRoute({
  navigation,
}: NativeStackScreenProps<
  ProfileStackParamList,
  "ProfileDashboard"
>): React.ReactElement {
  return (
    <ProfileDashboardScreen
      onChangePhoto={() => undefined}
      onPersonalInfo={() => navigation.navigate("AccountSettings")}
      onNotifications={() => navigation.navigate("ProfileNotificationSettings")}
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
      onItemPress={() => {}}
      onToggle={() => {}}
    />
  );
}

function ProfileNotificationSettingsRoute({ navigation }: any): React.ReactElement {
  return (
    <NotificationSettingsScreen
      chatbotToggles={DEFAULT_NOTIFICATION_TOGGLES}
      soundEnabled={true}
      soundDescription="Play audible alerts"
      vibrationEnabled={true}
      vibrationDescription="Use haptic feedback"
      miscItems={[]}
      resourcesEnabled={true}
      resourcesDescription="Suggest wellbeing resources"
      onBack={() => navigation.goBack()}
      onToggle={() => {}}
      onItemPress={() => {}}
    />
  );
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
