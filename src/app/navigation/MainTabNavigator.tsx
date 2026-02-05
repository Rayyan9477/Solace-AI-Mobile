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
      {/* Dashboard Tab - Lazy Loaded */}
      <Tab.Screen
        name="DashboardTab"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Home dashboard",
        }}
      >
        {() => (
          <Suspense fallback={<StackLoadingFallback />}>
            <DashboardStack />
          </Suspense>
        )}
      </Tab.Screen>

      {/* Mood Tab - Lazy Loaded */}
      <Tab.Screen
        name="MoodTab"
        options={{
          tabBarLabel: "Mood",
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Mood tracking",
        }}
      >
        {() => (
          <Suspense fallback={<StackLoadingFallback />}>
            <MoodStack />
          </Suspense>
        )}
      </Tab.Screen>

      {/* Chat Tab - Lazy Loaded */}
      <Tab.Screen
        name="ChatTab"
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Icon name="chatbubbles" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "AI therapy chat",
          tabBarBadge: undefined, // TODO: Add unread message count
        }}
      >
        {() => (
          <Suspense fallback={<StackLoadingFallback />}>
            <ChatStack />
          </Suspense>
        )}
      </Tab.Screen>

      {/* Journal Tab - Lazy Loaded */}
      <Tab.Screen
        name="JournalTab"
        options={{
          tabBarLabel: "Journal",
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Mental health journal",
        }}
      >
        {() => (
          <Suspense fallback={<StackLoadingFallback />}>
            <JournalStack />
          </Suspense>
        )}
      </Tab.Screen>

      {/* Profile Tab - Lazy Loaded */}
      <Tab.Screen
        name="ProfileTab"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "User profile and settings",
        }}
      >
        {() => (
          <Suspense fallback={<StackLoadingFallback />}>
            <ProfileStack />
          </Suspense>
        )}
      </Tab.Screen>
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
