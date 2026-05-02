/**
 * Auth Stack Navigator
 * @description Navigation stack for unauthenticated user flow.
 *
 * Sprint 4 (prototype v4.2): slimmed to the survivors:
 * Splash → LoadingProgress → QuoteSplash → WelcomeIntro → SignIn → ForgotPassword.
 * Onboarding-step screens, SignUp, FetchingData, and VerificationSent were
 * deleted; Supabase magic-link replaces them in S10.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { AuthScreenProps, AuthStackParamList } from "../../shared/types/navigation";
import { colors } from "../../shared/theme";
import { useAuth } from "../AuthContext";

import { SplashScreen } from "../../features/auth/screens/SplashScreen";
import { LoadingProgressScreen } from "../../features/auth/screens/LoadingProgressScreen";
import { QuoteSplashScreen } from "../../features/auth/screens/QuoteSplashScreen";
import { WelcomeScreen } from "../../features/auth/screens/WelcomeScreen";
import { SignInScreen } from "../../features/auth/screens/SignInScreen";
import { ForgotPasswordScreen } from "../../features/auth/screens/ForgotPasswordScreen";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const DEFAULT_QUOTE = {
  author: "Maya Angelou",
  quote: "Every storm runs out of rain.",
};

const DEFAULT_SPLASH_DELAY = 2000;

function SplashRoute({ navigation }: AuthScreenProps<"Splash">): React.ReactElement {
  return (
    <SplashScreen
      delay={DEFAULT_SPLASH_DELAY}
      onComplete={() => navigation.replace("LoadingProgress")}
    />
  );
}

function LoadingProgressRoute({
  navigation,
}: AuthScreenProps<"LoadingProgress">): React.ReactElement {
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
      onComplete={() => navigation.replace("WelcomeIntro")}
    />
  );
}

function WelcomeIntroRoute({ navigation }: AuthScreenProps<"WelcomeIntro">): React.ReactElement {
  return (
    <WelcomeScreen
      onGetStarted={() => navigation.navigate("SignIn")}
      onSignIn={() => navigation.navigate("SignIn")}
    />
  );
}

function ForgotPasswordRoute({
  navigation,
}: AuthScreenProps<"ForgotPassword">): React.ReactElement {
  return (
    <ForgotPasswordScreen
      onBack={() => navigation.goBack()}
      onSendPassword={() => navigation.navigate("SignIn")}
    />
  );
}

function SignInRoute({
  navigation,
}: AuthScreenProps<"SignIn">): React.ReactElement {
  const { signIn } = useAuth();
  return (
    <SignInScreen
      onBack={() => navigation.goBack()}
      onSignIn={() => {
        // Sprint 10 wires real Supabase magic-link auth.
        // For S7, we mock the sign-in by flipping the auth state.
        signIn();
      }}
      onForgotPassword={() => navigation.navigate("ForgotPassword")}
      onSignUp={() => navigation.navigate("ForgotPassword")}
    />
  );
}

/**
 * AuthStack Navigator Component
 */
export function AuthStack(): React.ReactElement {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: "fade",
        gestureEnabled: false,
        contentStyle: {
          backgroundColor: colors.background.primary,
        },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashRoute}
        options={{ animation: "none" }}
      />
      <Stack.Screen
        name="LoadingProgress"
        component={LoadingProgressRoute}
        options={{ animation: "fade" }}
      />
      <Stack.Screen
        name="QuoteSplash"
        component={QuoteSplashRoute}
        options={{ animation: "fade" }}
      />
      <Stack.Screen
        name="WelcomeIntro"
        component={WelcomeIntroRoute}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInRoute}
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordRoute}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}
