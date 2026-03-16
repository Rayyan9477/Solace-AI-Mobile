/**
 * Auth Stack Navigator
 * @description Navigation stack for unauthenticated user flow
 * @module Navigation
 * @phase Phase 3C: Refactored to use theme tokens
 *
 * Handles screens 1-14 in the user journey:
 * Splash → Loading → Quote → Fetching → Welcome → Onboarding (5 steps) → SignIn/SignUp
 *
 * This stack is shown when the user is not authenticated.
 * After successful authentication, the app transitions to OnboardingStack or MainFlow.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AuthScreenProps, AuthStackParamList } from "../../shared/types/navigation";
import { colors } from "../../shared/theme";

// Auth Screens Import
import { SplashScreen } from "../../features/auth/screens/SplashScreen";
import { LoadingProgressScreen } from "../../features/auth/screens/LoadingProgressScreen";
import { QuoteSplashScreen } from "../../features/auth/screens/QuoteSplashScreen";
import { FetchingDataScreen } from "../../features/auth/screens/FetchingDataScreen";
import { WelcomeScreen } from "../../features/auth/screens/WelcomeScreen";
// Onboarding carousel screens (Phase 3B)
import { OnboardingStep1Screen } from "../../features/auth/screens/OnboardingStep1Screen";
import { OnboardingStep2Screen } from "../../features/auth/screens/OnboardingStep2Screen";
import { OnboardingStep3Screen } from "../../features/auth/screens/OnboardingStep3Screen";
import { OnboardingStep4Screen } from "../../features/auth/screens/OnboardingStep4Screen";
import { OnboardingStep5Screen } from "../../features/auth/screens/OnboardingStep5Screen";
import { SignInScreen } from "../../features/auth/screens/SignInScreen";
import { SignUpScreen } from "../../features/auth/screens/SignUpScreen";
import { ForgotPasswordScreen } from "../../features/auth/screens/ForgotPasswordScreen";
import { VerificationCodeSentScreen } from "../../features/auth/screens/VerificationCodeSentScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const DEFAULT_QUOTE = {
  author: "Maya Angelou",
  quote: "Every storm runs out of rain.",
};

const DEFAULT_FETCHING_DELAY = 2500;
const DEFAULT_SPLASH_DELAY = 2000;

function maskEmail(email: string): string {
  const [localPart, domain = ""] = email.split("@");
  if (!localPart || !domain) {
    return "your email";
  }

  if (localPart.length <= 2) {
    return `${localPart[0] ?? "*"}*@${domain}`;
  }

  const maskedLocal = `${localPart[0]}${"*".repeat(Math.max(1, localPart.length - 2))}${localPart[localPart.length - 1]}`;
  return `${maskedLocal}@${domain}`;
}

function SplashRoute({ navigation }: AuthScreenProps<"Splash">): React.ReactElement {
  return (
    <SplashScreen
      delay={DEFAULT_SPLASH_DELAY}
      onComplete={() => navigation.replace("LoadingProgress")}
    />
  );
}

function LoadingProgressRoute({ navigation }: AuthScreenProps<"LoadingProgress">): React.ReactElement {
  return (
    <LoadingProgressScreen
      progress={100}
      onComplete={() => navigation.replace("QuoteSplash")}
    />
  );
}

function QuoteSplashRoute({ navigation }: AuthScreenProps<"QuoteSplash">): React.ReactElement {
  return (
    <QuoteSplashScreen
      author={DEFAULT_QUOTE.author}
      quote={DEFAULT_QUOTE.quote}
      onComplete={() => navigation.replace("FetchingData")}
    />
  );
}

function FetchingDataRoute({ navigation }: AuthScreenProps<"FetchingData">): React.ReactElement {
  return (
    <FetchingDataScreen
      delay={DEFAULT_FETCHING_DELAY}
      onComplete={() => navigation.replace("WelcomeIntro")}
    />
  );
}

function WelcomeIntroRoute({ navigation }: AuthScreenProps<"WelcomeIntro">): React.ReactElement {
  return (
    <WelcomeScreen
      onGetStarted={() => navigation.navigate("OnboardingStep1")}
      onSignIn={() => navigation.navigate("SignIn")}
    />
  );
}

function ForgotPasswordRoute({ navigation }: AuthScreenProps<"ForgotPassword">): React.ReactElement {
  return (
    <ForgotPasswordScreen
      onBack={() => navigation.goBack()}
      onSendPassword={() =>
        navigation.navigate("VerificationSent", {
          email: "user@example.com",
        })
      }
    />
  );
}

function VerificationSentRoute({ route, navigation }: AuthScreenProps<"VerificationSent">): React.ReactElement {
  const email = route?.params?.email ?? "user@example.com";
  const maskedDestination = maskEmail(email);

  return (
    <VerificationCodeSentScreen
      maskedDestination={maskedDestination}
      onBack={() => navigation.goBack()}
      onDismiss={() => navigation.navigate("SignIn")}
      onResend={() => {}}
    />
  );
}

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
          backgroundColor: colors.background.primary,
        },
      }}
    >
      {/* Screen 1: Splash Screen */}
      <Stack.Screen
        name="Splash"
        component={SplashRoute}
        options={{
          animation: "none", // No animation for initial screen
        }}
      />

      {/* Screen 2: Loading Progress */}
      <Stack.Screen
        name="LoadingProgress"
        component={LoadingProgressRoute}
        options={{
          animation: "fade",
        }}
      />

      {/* Screen 3: Quote Display */}
      <Stack.Screen
        name="QuoteSplash"
        component={QuoteSplashRoute}
        options={{
          animation: "fade",
        }}
      />

      {/* Screen 4: Fetching Data */}
      <Stack.Screen
        name="FetchingData"
        component={FetchingDataRoute}
        options={{
          animation: "fade",
        }}
      />

      {/* Screen 5: Welcome Intro */}
      <Stack.Screen
        name="WelcomeIntro"
        component={WelcomeIntroRoute}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screens 6-10: Onboarding Carousel Steps */}
      <Stack.Screen
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
      />

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
        component={ForgotPasswordRoute}
        options={{
          animation: "slide_from_right",
        }}
      />

      {/* Screen 14: Verification Email Sent */}
      <Stack.Screen
        name="VerificationSent"
        component={VerificationSentRoute}
        options={{
          animation: "fade",
          gestureEnabled: false, // Prevent going back after verification sent
        }}
      />
    </Stack.Navigator>
  );
}
