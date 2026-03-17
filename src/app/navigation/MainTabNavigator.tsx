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
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Home dashboard",
        }}
      />

      {/* Mood Tab - Lazy Loaded */}
      <Tab.Screen
        name="MoodTab"
        component={MoodTab}
        options={{
          tabBarLabel: "Mood",
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Mood tracking",
        }}
      />

      {/* Chat Tab - Lazy Loaded */}
      <Tab.Screen
        name="ChatTab"
        component={ChatTab}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Icon name="chatbubbles" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "AI therapy chat",
          tabBarBadge: undefined, // TODO: Add unread message count
        }}
      />

      {/* Journal Tab - Lazy Loaded */}
      <Tab.Screen
        name="JournalTab"
        component={JournalTab}
        options={{
          tabBarLabel: "Journal",
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "Mental health journal",
        }}
      />

      {/* Profile Tab - Lazy Loaded */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "User profile and settings",
        }}
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
