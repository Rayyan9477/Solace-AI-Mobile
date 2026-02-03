/**
 * Auth Stack Navigator
 * @description Navigation stack for unauthenticated user flow
 * @module Navigation
 *
 * Handles screens 1-14 in the user journey:
 * Splash → Loading → Quote → Fetching → Welcome → Onboarding (5 steps) → SignIn/SignUp
 *
 * This stack is shown when the user is not authenticated.
 * After successful authentication, the app transitions to OnboardingStack or MainFlow.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../shared/types/navigation";

// Auth Screens Import
import { SplashScreen } from "../../features/auth/screens/SplashScreen";
import { LoadingProgressScreen } from "../../features/auth/screens/LoadingProgressScreen";
import { QuoteSplashScreen } from "../../features/auth/screens/QuoteSplashScreen";
import { FetchingDataScreen } from "../../features/auth/screens/FetchingDataScreen";
import { WelcomeScreen } from "../../features/auth/screens/WelcomeScreen";
// Onboarding carousel screens (will be created in Phase 3B)
// import { OnboardingStep1Screen } from "../../features/auth/screens/OnboardingStep1Screen";
// import { OnboardingStep2Screen } from "../../features/auth/screens/OnboardingStep2Screen";
// import { OnboardingStep3Screen } from "../../features/auth/screens/OnboardingStep3Screen";
// import { OnboardingStep4Screen } from "../../features/auth/screens/OnboardingStep4Screen";
// import { OnboardingStep5Screen } from "../../features/auth/screens/OnboardingStep5Screen";
import { SignInScreen } from "../../features/auth/screens/SignInScreen";
import { SignUpScreen } from "../../features/auth/screens/SignUpScreen";
import { ForgotPasswordScreen } from "../../features/auth/screens/ForgotPasswordScreen";
import { VerificationCodeSentScreen } from "../../features/auth/screens/VerificationCodeSentScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

/**
 * AuthStack Navigator Component
 * @description Stack navigator for authentication flow
 * @returns {React.ReactElement} Auth stack navigator
 */
export function AuthStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false, // All auth screens have custom headers
        animation: "fade", // Smooth fade transitions between screens
        gestureEnabled: false, // Disable swipe back during auth flow
        contentStyle: {
          backgroundColor: "#1C1410", // Dark brown background (theme primary)
        },
      }}
    >
      {/* Screen 1: Splash Screen */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          animation: "none", // No animation for initial screen
        }}
      />

      {/* Screen 2: Loading Progress */}
      <Stack.Screen
        name="LoadingProgress"
        component={LoadingProgressScreen}
        options={{
          animation: "fade",
        }}
      />

      {/* Screen 3: Quote Display */}
      <Stack.Screen
        name="QuoteSplash"
        component={QuoteSplashScreen}
        options={{
          animation: "fade",
        }}
      />

      {/* Screen 4: Fetching Data */}
      <Stack.Screen
        name="FetchingData"
        component={FetchingDataScreen}
        options={{
          animation: "fade",
        }}
      />

      {/* Screen 5: Welcome Intro */}
      <Stack.Screen
        name="WelcomeIntro"
        component={WelcomeScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screens 6-10: Onboarding Carousel Steps */}
      {/* TODO: Uncomment when carousel screens are created in Phase 3B */}
      {/* <Stack.Screen
        name="OnboardingStep1"
        component={OnboardingStep1Screen}
        options={{
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen
        name="OnboardingStep2"
        component={OnboardingStep2Screen}
        options={{
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen
        name="OnboardingStep3"
        component={OnboardingStep3Screen}
        options={{
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen
        name="OnboardingStep4"
        component={OnboardingStep4Screen}
        options={{
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen
        name="OnboardingStep5"
        component={OnboardingStep5Screen}
        options={{
          animation: "slide_from_right",
        }}
      /> */}

      {/* Screen 11: Sign In */}
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          animation: "slide_from_bottom",
        }}
      />

      {/* Screen 12: Sign Up */}
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          animation: "slide_from_bottom",
        }}
      />

      {/* Screen 13: Forgot Password */}
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 14: Verification Email Sent */}
      <Stack.Screen
        name="VerificationSent"
        component={VerificationCodeSentScreen}
        options={{
          animation: "fade",
          gestureEnabled: false, // Prevent going back after verification sent
        }}
      />
    </Stack.Navigator>
  );
}
