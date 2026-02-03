/**
 * Profile Stack Navigator
 * @description Navigation stack for profile and settings screens
 * @module Navigation
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { ProfileStackParamList } from "../../../shared/types/navigation";

// Profile Screens
import { ProfileDashboardScreen } from "../../../features/profile/screens/ProfileDashboardScreen";
import { AccountSettingsScreen } from "../../../features/profile/screens/AccountSettingsScreen";
import { PersonalInformationScreen } from "../../../features/profile/screens/PersonalInformationScreen";
import { NotificationSettingsScreen } from "../../../features/profile/screens/NotificationSettingsScreen";
import { SecuritySettingsScreen } from "../../../features/profile/screens/SecuritySettingsScreen";
import { LinkedDevicesScreen } from "../../../features/profile/screens/LinkedDevicesScreen";
import { LanguagesScreen } from "../../../features/profile/screens/LanguagesScreen";
import { HelpCenterScreen } from "../../../features/profile/screens/HelpCenterScreen";
import { HelpCenterLiveChatScreen } from "../../../features/profile/screens/HelpCenterLiveChatScreen";
import { SendFeedbackScreen } from "../../../features/profile/screens/SendFeedbackScreen";
import { InviteFriendsScreen } from "../../../features/profile/screens/InviteFriendsScreen";
import { AboutCompanyScreen } from "../../../features/profile/screens/AboutCompanyScreen";
import { LiveChatSupportScreen } from "../../../features/profile/screens/LiveChatSupportScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

/**
 * ProfileStack Navigator Component
 * @returns {React.ReactElement} Profile stack navigator
 */
export function ProfileStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="ProfileDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="ProfileDashboard" component={ProfileDashboardScreen} />
      <Stack.Screen name="AccountSettings" component={AccountSettingsScreen} />
      <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
      <Stack.Screen name="ProfileNotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
      <Stack.Screen name="LinkedDevices" component={LinkedDevicesScreen} />
      <Stack.Screen name="Languages" component={LanguagesScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="HelpCenterLiveChat" component={HelpCenterLiveChatScreen} />
      <Stack.Screen name="SendFeedback" component={SendFeedbackScreen} />
      <Stack.Screen name="InviteFriends" component={InviteFriendsScreen} />
      <Stack.Screen name="AboutCompany" component={AboutCompanyScreen} />
      <Stack.Screen name="LiveChatSupport" component={LiveChatSupportScreen} />
    </Stack.Navigator>
  );
}
