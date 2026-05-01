/**
 * SignInScreen — prototype v4.2 #02 reskin (Sprint 7).
 *
 * midnight[950] bg with SmokeBlob wash. Back button header, Fraunces
 * italic headline, two GlassInputs, forgot-password link, sage CTA,
 * OR divider, 3-up SocialButton row, and sign-up footer link.
 *
 * Maps to `prototypes/screens/02-signin.js`.
 */

import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useReducedMotion } from "@/shared/hooks/useReducedMotion";
import { useTheme } from "@/shared/theme/useTheme";
import { ScreenContainer } from "@/shared/components/atoms/layout";
import { Button } from "@/shared/components/atoms/buttons/Button";
import { AppIcon } from "@/shared/components/atoms/display/AppIcon";
import {
  BracketLabel,
  SmokeBlob,
} from "@/shared/components/primitives";
import { GlassInput } from "@/shared/components/molecules/forms/GlassInput";
import { SocialButton } from "@/shared/components/molecules/auth";

export interface SignInScreenProps {
  onBack: () => void;
  onSignIn: (email: string, password: string) => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
  loading?: boolean;
  errorMessage?: string;
  testID?: string;
}

export function SignInScreen({
  onBack,
  onSignIn,
  onForgotPassword,
  onSignUp,
  loading = false,
  errorMessage,
  testID = "sign-in-screen",
}: SignInScreenProps): React.ReactElement {
  const { palette } = useTheme();
  const _reducedMotion = useReducedMotion();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSignIn = (): void => {
    onSignIn(email, password);
  };

  return (
    <ScreenContainer
      testID={testID}
      backgroundColor={palette.midnight[950]}
      style={styles.screen}
    >
      {/* Ambient smoke wash — top-right corner */}
      <SmokeBlob
        tint="aurora"
        size={280}
        opacity={0.22}
        style={styles.smokeBlob}
      />

      {/* Header row: back button · title · spacer */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          testID="back-button"
          style={[
            styles.backButton,
            {
              backgroundColor: palette.midnight[800],
              borderColor: palette.midnight[600],
            },
          ]}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AppIcon name="arrow-left" size={18} color={palette.warm[400]} />
        </TouchableOpacity>

        <BracketLabel variant="peach" style={styles.headerLabel}>
          SIGN IN
        </BracketLabel>

        {/* Spacer mirrors back button width for optical centering */}
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Headline */}
          <Text
            accessibilityRole="header"
            style={[styles.headline, { color: palette.warm[50] }]}
          >
            Welcome back
          </Text>

          {/* Subtitle */}
          <Text
            style={[styles.subtitle, { color: palette.warm[400] }]}
            accessibilityRole="text"
          >
            Sign in to continue your journey
          </Text>

          {/* Email input — testID="email" so inner TextInput exposes "email-input" with accessibilityLabel */}
          <View style={styles.inputWrap}>
            <GlassInput
              testID="email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              iconName="mail"
              keyboardType="email-address"
              autoComplete="email"
              accessibilityLabel="Email address"
            />
          </View>

          {/* Password row: input + forgot link */}
          <View style={styles.inputWrap}>
            <GlassInput
              testID="password"
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              iconName="lock"
              secureTextEntry
              autoComplete="password"
              accessibilityLabel="Password"
            />
            <TouchableOpacity
              testID="forgot-password-link"
              style={styles.forgotLink}
              onPress={onForgotPassword}
              accessibilityRole="link"
              accessibilityLabel="Forgot password"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text
                style={[styles.forgotText, { color: palette.peach[300] }]}
              >
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error message */}
          {errorMessage ? (
            <Text
              testID="error-message"
              accessibilityRole="alert"
              style={[styles.errorMessage, { color: palette.peach[300] }]}
            >
              {errorMessage}
            </Text>
          ) : null}

          {/* Sign In CTA */}
          <Button
            testID="sign-in-button"
            label="Sign In"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={loading}
            onPress={handleSignIn}
            accessibilityLabel="Sign In"
            style={{
              ...styles.signInButton,
              backgroundColor: palette.sage[500],
            }}
            labelStyle={{ color: palette.midnight[950] }}
          />

          {/* OR divider */}
          <View
            style={styles.dividerRow}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <View
              style={[styles.dividerLine, { backgroundColor: palette.warm[500] }]}
            />
            <Text style={[styles.dividerText, { color: palette.warm[500] }]}>
              OR
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: palette.warm[500] }]}
            />
          </View>

          {/* Social buttons row */}
          <View
            style={styles.socialRow}
            accessibilityLabel="Sign in with social provider"
          >
            <SocialButton
              testID="social-google"
              provider="google"
              onPress={() => {
                /* social sign-in handled by parent */
              }}
              size={88}
            />
            <SocialButton
              testID="social-apple"
              provider="apple"
              onPress={() => {
                /* social sign-in handled by parent */
              }}
              size={88}
            />
            <SocialButton
              testID="social-github"
              provider="github"
              onPress={() => {
                /* social sign-in handled by parent */
              }}
              size={88}
            />
          </View>

          {/* Sign Up footer link */}
          <TouchableOpacity
            testID="sign-up-link"
            style={styles.signUpLink}
            onPress={onSignUp}
            accessibilityRole="link"
            accessibilityLabel="Don't have an account? Sign Up"
            hitSlop={{ top: 8, bottom: 8, left: 16, right: 16 }}
          >
            <Text style={[styles.signUpText, { color: palette.warm[400] }]}>
              {"Don't have an account? "}
              <Text style={[styles.signUpHighlight, { color: palette.aurora[300] }]}>
                Sign Up.
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  dividerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    marginTop: 4,
  },
  dividerText: {
    fontFamily: "FiraCode_400Regular",
    fontSize: 10,
    letterSpacing: 1.6,
  },
  errorMessage: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginBottom: 8,
    textAlign: "center",
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginTop: 8,
    minHeight: 44,
    paddingVertical: 10,
  },
  forgotText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  headerLabel: {
    textAlign: "center",
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  headerSpacer: {
    height: 44,
    width: 44,
  },
  headline: {
    fontFamily: "Fraunces_400Regular_Italic",
    fontSize: 32,
    fontStyle: "italic",
    lineHeight: 38,
    marginBottom: 8,
    marginTop: 8,
  },
  inputWrap: {
    marginBottom: 12,
  },
  keyboardAvoid: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 40,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  signInButton: {
    borderRadius: 28,
    marginBottom: 24,
    marginTop: 8,
  },
  signUpHighlight: {
    fontFamily: "Inter_500Medium",
    textDecorationLine: "underline",
  },
  signUpLink: {
    alignItems: "center",
    marginTop: 8,
    minHeight: 44,
    paddingVertical: 10,
  },
  signUpText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
  },
  smokeBlob: {
    position: "absolute",
    right: -60,
    top: -20,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 24,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
});

export default SignInScreen;
