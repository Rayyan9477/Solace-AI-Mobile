/**
 * Main Tab Navigator
 * @description Bottom tab navigation for main app features
 * @module Navigation
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Contains 5 main tabs:
 * - Dashboard (Home)
 * - Mood (Mood Tracking)
 * - Chat (AI Therapy)
 * - Journal (Mental Health Journal)
 * - Profile (Settings)
 */

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { MainTabParamList } from "../../shared/types/navigation";
import { colors, palette } from "../../shared/theme";

// Stack Navigators
import { DashboardStack } from "./stacks/DashboardStack";
import { MoodStack } from "./stacks/MoodStack";
import { ChatStack } from "./stacks/ChatStack";
import { JournalStack } from "./stacks/JournalStack";
import { ProfileStack } from "./stacks/ProfileStack";

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * MainTabNavigator Component
 * @description Bottom tab navigator for main app flow
 * @returns {React.ReactElement} Main tab navigator
 */
export function MainTabNavigator(): React.ReactElement {
  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopColor: palette.tan[500],
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: palette.tan[500],
        tabBarInactiveTintColor: colors.text.disabled,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* Dashboard Tab */}
      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => {
            // TODO: Replace with proper icon component
            return null;
          },
          tabBarAccessibilityLabel: "Home dashboard",
        }}
      />

      {/* Mood Tab */}
      <Tab.Screen
        name="MoodTab"
        component={MoodStack}
        options={{
          tabBarLabel: "Mood",
          tabBarIcon: ({ color, size }) => {
            // TODO: Replace with proper icon component
            return null;
          },
          tabBarAccessibilityLabel: "Mood tracking",
        }}
      />

      {/* Chat Tab */}
      <Tab.Screen
        name="ChatTab"
        component={ChatStack}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => {
            // TODO: Replace with proper icon component
            return null;
          },
          tabBarAccessibilityLabel: "AI therapy chat",
          tabBarBadge: undefined, // TODO: Add unread message count
        }}
      />

      {/* Journal Tab */}
      <Tab.Screen
        name="JournalTab"
        component={JournalStack}
        options={{
          tabBarLabel: "Journal",
          tabBarIcon: ({ color, size }) => {
            // TODO: Replace with proper icon component
            return null;
          },
          tabBarAccessibilityLabel: "Mental health journal",
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => {
            // TODO: Replace with proper icon component
            return null;
          },
          tabBarAccessibilityLabel: "User profile and settings",
        }}
      />
    </Tab.Navigator>
  );
}
