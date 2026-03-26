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

import React, { Suspense } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import type { MainTabParamList } from "../../shared/types/navigation";
import { colors, palette } from "../../shared/theme";

// Lazy Load Stack Navigators for Performance
const DashboardStack = React.lazy(() =>
  import("./stacks/DashboardStack").then((module) => ({
    default: module.DashboardStack,
  })),
);
const MoodStack = React.lazy(() =>
  import("./stacks/MoodStack").then((module) => ({ default: module.MoodStack })),
);
const ChatStack = React.lazy(() =>
  import("./stacks/ChatStack").then((module) => ({ default: module.ChatStack })),
);
const JournalStack = React.lazy(() =>
  import("./stacks/JournalStack").then((module) => ({
    default: module.JournalStack,
  })),
);
const ProfileStack = React.lazy(() =>
  import("./stacks/ProfileStack").then((module) => ({
    default: module.ProfileStack,
  })),
);

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Routes that should display full-screen without the tab bar.
 * These are detail/composer/immersive screens nested inside each tab stack.
 */
const FULLSCREEN_ROUTES = new Set([
  // Chat stack detail screens
  "ActiveChat",
  "NewConversation",
  "VoiceInput",
  "ExpressionAnalysis",
  "ExpressionAnalysisResults",
  "CrisisSupportAlert",
  // Journal stack detail screens
  "CreateJournalEntry",
  "EditJournalEntry",
  "VoiceJournalRecording",
  "JournalEntryDetail",
  "JournalCalendar",
  "JournalInsights",
  "TextJournalComposer",
  // Mood stack detail screens
  "MoodSelector",
  "MoodHistory",
  "MoodCalendar",
  "MoodAnalytics",
  "MoodAISuggestions",
  // Dashboard stack detail screens
  "SolaceScoreDetail",
  "SolaceScoreInsights",
  "AISuggestions",
  "MindfulnessActivities",
  "SolaceScoreIncrease",
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

/**
 * Loading Fallback Component
 * @description Displays while lazy-loaded stacks are loading
 */
function StackLoadingFallback(): React.ReactElement {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={palette.tan[500]} />
    </View>
  );
}

// Stable tab wrapper components (outside MainTabNavigator to avoid re-mounting)
const DashboardTab = () => (
  <Suspense fallback={<StackLoadingFallback />}>
    <DashboardStack />
  </Suspense>
);

const MoodTab = () => (
  <Suspense fallback={<StackLoadingFallback />}>
    <MoodStack />
  </Suspense>
);

const ChatTab = () => (
  <Suspense fallback={<StackLoadingFallback />}>
    <ChatStack />
  </Suspense>
);

const JournalTab = () => (
  <Suspense fallback={<StackLoadingFallback />}>
    <JournalStack />
  </Suspense>
);

const ProfileTab = () => (
  <Suspense fallback={<StackLoadingFallback />}>
    <ProfileStack />
  </Suspense>
);

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
          borderTopColor: palette.tan[500],
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
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
            borderTopColor: palette.tan[500],
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
            borderTopColor: palette.tan[500],
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
            borderTopColor: palette.tan[500],
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
            borderTopColor: palette.tan[500],
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
            borderTopColor: palette.tan[500],
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.primary,
  },
});
