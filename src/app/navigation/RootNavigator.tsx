/**
 * Root Navigator
 * @description Top-level navigator that orchestrates all app flows
 * @module Navigation
 *
 * Navigation Flow:
 * 1. AuthFlow - User not authenticated (Splash → Welcome → SignIn/SignUp)
 * 2. OnboardingFlow - First-time user setup (Profile → Assessment)
 * 3. MainFlow - Main app with bottom tabs
 *
 * The navigator switches between flows based on:
 * - isAuthenticated: User has valid session
 * - hasCompletedOnboarding: User has finished profile setup and assessment
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../shared/types/navigation";

// Flow Navigators
import { AuthStack } from "./AuthStack";
import { OnboardingStack } from "./OnboardingStack";
import { MainTabNavigator } from "./MainTabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root Navigator Props
 */
interface RootNavigatorProps {
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether the user has completed onboarding */
  hasCompletedOnboarding: boolean;
}

/**
 * RootNavigator Component
 * @description Root navigator that manages auth state and flow transitions
 * @param {RootNavigatorProps} props - Navigator props
 * @returns {React.ReactElement} Root navigator
 */
export function RootNavigator({
  isAuthenticated,
  hasCompletedOnboarding,
}: RootNavigatorProps): React.ReactElement {
  /**
   * Determine initial route based on auth state
   * - Not authenticated → AuthFlow
   * - Authenticated but not onboarded → OnboardingFlow
   * - Authenticated and onboarded → MainFlow
   */
  const getInitialRouteName = (): keyof RootStackParamList => {
    if (!isAuthenticated) {
      return "AuthFlow";
    }
    if (!hasCompletedOnboarding) {
      return "OnboardingFlow";
    }
    return "MainFlow";
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName()}
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: {
          backgroundColor: "#1C1410", // Dark brown background
        },
      }}
    >
      {/* Authentication Flow */}
      {!isAuthenticated && (
        <Stack.Screen
          name="AuthFlow"
          component={AuthStack}
          options={{
            animation: "none", // No animation for initial auth flow
          }}
        />
      )}

      {/* Onboarding Flow */}
      {isAuthenticated && !hasCompletedOnboarding && (
        <Stack.Screen
          name="OnboardingFlow"
          component={OnboardingStack}
          options={{
            animation: "slide_from_right",
            gestureEnabled: false, // Prevent going back to auth
          }}
        />
      )}

      {/* Main App Flow */}
      {isAuthenticated && hasCompletedOnboarding && (
        <Stack.Screen
          name="MainFlow"
          component={MainTabNavigator}
          options={{
            animation: "fade",
            gestureEnabled: false, // Prevent going back to onboarding
          }}
        />
      )}

      {/* Modal Screens (Available from any flow) */}
      {/* TODO: Add modal screens in Phase 3B-3D */}
      {/*
      <Stack.Screen
        name="SearchModal"
        component={SearchStack}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="NotificationsModal"
        component={NotificationsStack}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      */}
    </Stack.Navigator>
  );
}

/**
 * Default export with mock auth state
 * TODO: Connect to actual auth state management (Redux/Context)
 */
export default function RootNavigatorContainer(): React.ReactElement {
  // TODO: Replace with actual auth state from Redux/Context
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(false);

  return (
    <RootNavigator
      isAuthenticated={isAuthenticated}
      hasCompletedOnboarding={hasCompletedOnboarding}
    />
  );
}
