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
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import type { MainTabParamList } from "../../shared/types/navigation";
import { colors, palette } from "../../shared/theme";

import { DashboardStack } from "./stacks/DashboardStack";
import { MoodStack } from "./stacks/MoodStack";
import { ChatStack } from "./stacks/ChatStack";
import { JournalStack } from "./stacks/JournalStack";
import { ProfileStack } from "./stacks/ProfileStack";

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Routes that should display full-screen without the tab bar.
 * Sprint 4 (prototype v4.2): trimmed to survivors. Sprints 6-9 will re-add
 * routes for new immersive screens (DailyCheckIn, JournalComposer, etc.).
 */
const FULLSCREEN_ROUTES = new Set([
  // Chat stack
  "ActiveChat",
  // Journal stack
  "CreateJournalEntry",
  "EditJournalEntry",
  "JournalEntryDetail",
  "TextJournalComposer",
  // Mood stack
  "MoodSelector",
  "MoodCalendar",
  "MoodInsights",
]);

/**
 * Returns `{ display: 'none' }` when a fullscreen route is focused,
 * otherwise returns `undefined` to let the navigator use its default style.
 */
function getTabBarVisibility(route: Parameters<typeof getFocusedRouteNameFromRoute>[0]): { display: "none" } | undefined {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (routeName !== undefined && FULLSCREEN_ROUTES.has(routeName)) {
    return { display: "none" };
  }
  return undefined;
}

// Direct stack imports — switched from React.lazy in S8 verification because
// Metro web bundler emitted lazy chunks that weren't reachable on direct deep-
// links. Native iOS/Android keeps performance: stacks code-split at the
// bundle level via Hermes proguard rather than React.lazy.
const DashboardTab = (): React.ReactElement => <DashboardStack />;
const MoodTab = (): React.ReactElement => <MoodStack />;
const ChatTab = (): React.ReactElement => <ChatStack />;
const JournalTab = (): React.ReactElement => <JournalStack />;
const ProfileTab = (): React.ReactElement => <ProfileStack />;

/**
 * MainTabNavigator Component
 * @description Bottom tab navigator for main app flow
 * @returns {React.ReactElement} Main tab navigator
 */
export function MainTabNavigator(): React.ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopColor: palette.aurora[300],
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: palette.aurora[300],
        tabBarInactiveTintColor: colors.text.disabled,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* Dashboard Tab - Lazy Loaded */}
      <Tab.Screen
        name="DashboardTab"
        component={DashboardTab}
        options={({ route }) => ({
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Home dashboard",
          tabBarStyle: getTabBarVisibility(route) ?? {
            backgroundColor: colors.background.primary,
            borderTopColor: palette.aurora[300],
            borderTopWidth: 1,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 8,
          },
        })}
      />

      {/* Mood Tab - Lazy Loaded */}
      <Tab.Screen
        name="MoodTab"
        component={MoodTab}
        options={({ route }) => ({
          tabBarLabel: "Mood",
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Mood tracking",
          tabBarStyle: getTabBarVisibility(route) ?? {
            backgroundColor: colors.background.primary,
            borderTopColor: palette.aurora[300],
            borderTopWidth: 1,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 8,
          },
        })}
      />

      {/* Chat Tab - Lazy Loaded */}
      <Tab.Screen
        name="ChatTab"
        component={ChatTab}
        options={({ route }) => ({
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Icon name="chatbubbles" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "AI therapy chat",
          tabBarBadge: undefined, // TODO: Add unread message count
          tabBarStyle: getTabBarVisibility(route) ?? {
            backgroundColor: colors.background.primary,
            borderTopColor: palette.aurora[300],
            borderTopWidth: 1,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 8,
          },
        })}
      />

      {/* Journal Tab - Lazy Loaded */}
      <Tab.Screen
        name="JournalTab"
        component={JournalTab}
        options={({ route }) => ({
          tabBarLabel: "Journal",
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Mental health journal",
          tabBarStyle: getTabBarVisibility(route) ?? {
            backgroundColor: colors.background.primary,
            borderTopColor: palette.aurora[300],
            borderTopWidth: 1,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 8,
          },
        })}
      />

      {/* Profile Tab - Lazy Loaded */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={({ route }) => ({
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "User profile and settings",
          tabBarStyle: getTabBarVisibility(route) ?? {
            backgroundColor: colors.background.primary,
            borderTopColor: palette.aurora[300],
            borderTopWidth: 1,
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 8,
          },
        })}
      />
    </Tab.Navigator>
  );
}
