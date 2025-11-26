import { logger } from "@shared/utils/logger";

/**
 * Social Login Screen - Third-Party Authentication Options
 * Based on ui-designs/Dark-mode/Sign In & Sign Up.png
 * REAL OAuth Implementation - NO PLACEHOLDERS
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { FontAwesome } from "@expo/vector-icons";
import { useGoogleAuth, useFacebookAuth, useAppleAuth, useMicrosoftAuth } from "@shared/hooks/useSocialAuth";
import { showAlert } from "@shared/utils/alert";
import { useAppDispatch } from "@app/store";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";

interface SocialProvider {
  id: string;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
}

const SocialLoginScreenComponent = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [authenticating, setAuthenticating] = useState<string | null>(null);

  // Initialize OAuth hooks
  const googleAuth = useGoogleAuth();
  const facebookAuth = useFacebookAuth();
  const appleAuth = useAppleAuth();
  const microsoftAuth = useMicrosoftAuth();

  const socialProviders: SocialProvider[] = [
    {
      id: "google",
      name: "Continue with Google",
      iconName: "google",
      color: "#FFFFFF",
      bgColor: "#4285F4",
    },
    {
      id: "apple",
      name: "Continue with Apple",
      iconName: "apple",
      color: "#FFFFFF",
      bgColor: "#000000",
    },
    {
      id: "facebook",
      name: "Continue with Facebook",
      iconName: "facebook",
      color: "#FFFFFF",
      bgColor: "#1877F2",
    },
    {
      id: "microsoft",
      name: "Continue with Microsoft",
      iconName: "windows",
      color: "#FFFFFF",
      bgColor: "#00A4EF",
    },
  ];

  /**
   * Handle social login with REAL OAuth implementation
   * NO PLACEHOLDERS - Each provider uses actual OAuth flow
   */
  const handleSocialLogin = async (providerId: string) => {
    setAuthenticating(providerId);

    try {
      let result;

      switch (providerId) {
        case "google":
          result = await googleAuth.signIn();
          break;
        case "facebook":
          result = await facebookAuth.signIn();
          break;
        case "apple":
          if (Platform.OS !== 'ios') {
            showAlert("Not Available", "Apple Sign-In is only available on iOS devices", [{ text: "OK" }]);
            setAuthenticating(null);
            return;
          }
          result = await appleAuth.signIn();
          break;
        case "microsoft":
          result = await microsoftAuth.signIn();
          break;
        default:
          showAlert("Error", `Provider ${providerId} not implemented`, [{ text: "OK" }]);
          setAuthenticating(null);
          return;
      }

      if (result?.success && result.user) {
        // Dispatch authentication success to Redux
        dispatch({
          type: 'auth/secureLogin/fulfilled',
          payload: {
            user: {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              picture: result.user.picture,
            },
            token: result.accessToken || '',
          },
        });

        showAlert(
          "Success",
          `Welcome, ${result.user.name || result.user.email}!`,
          [
            {
              text: "OK",
              onPress: () => navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' as never }],
              }),
            },
          ]
        );
      } else {
        const errorMsg = result?.error || 'Authentication failed';
        if (errorMsg !== 'User cancelled') {
          showAlert("Authentication Failed", errorMsg, [{ text: "OK" }]);
        }
      }
    } catch (error: any) {
      logger.error(`${providerId} OAuth error:`, error);
      showAlert(
        "Authentication Error",
        error.message || `Failed to authenticate with ${providerId}`,
        [{ text: "OK" }]
      );
    } finally {
      setAuthenticating(null);
    }
  };

  const handleEmailLogin = () => {
    navigation.navigate("Login");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    content: {
      flex: 1,
    },
    heroSection: {
      paddingHorizontal: 40,
      paddingVertical: 40,
      alignItems: "center",
    },
    heroIcon: {
      fontSize: 64,
      marginBottom: 20,
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 12,
      textAlign: "center",
    },
    heroSubtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    providersList: {
      gap: 12,
    },
    providerButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      position: "relative",
    },
    providerButtonLoading: {
      opacity: 0.7,
    },
    providerIcon: {
      position: "absolute",
      left: 20,
    },
    providerText: {
      fontSize: 16,
      fontWeight: "700",
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.gray["20"],
    },
    dividerText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
      marginHorizontal: 16,
    },
    emailButton: {
      backgroundColor: theme.colors.purple["60"],
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: 12,
      marginHorizontal: 20,
    },
    emailButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    infoCard: {
      backgroundColor: theme.colors.blue["20"],
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 20,
      marginTop: 24,
    },
    infoTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    infoList: {
      gap: 4,
    },
    infoText: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
    },
    footer: {
      paddingHorizontal: 40,
      paddingVertical: 24,
      alignItems: "center",
    },
    footerText: {
      fontSize: 12,
      lineHeight: 18,
      color: theme.colors.text.tertiary,
      textAlign: "center",
    },
    linkText: {
      color: theme.colors.purple["60"],
      fontWeight: "700",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign In</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroIcon}>🔐</Text>
          <Text style={styles.heroTitle}>Welcome Back</Text>
          <Text style={styles.heroSubtitle}>
            Choose your preferred method to continue
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Sign In</Text>
          <View style={styles.providersList}>
            {socialProviders.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerButton,
                  { backgroundColor: provider.bgColor },
                  authenticating === provider.id && styles.providerButtonLoading,
                ]}
                onPress={() => handleSocialLogin(provider.id)}
                disabled={authenticating !== null}
                accessible
                accessibilityLabel={provider.name}
                accessibilityRole="button"
              >
                {authenticating === provider.id ? (
                  <ActivityIndicator size="small" color={provider.color} style={styles.providerIcon} />
                ) : (
                  <FontAwesome
                    name={provider.iconName as any}
                    size={20}
                    color={provider.color}
                    style={styles.providerIcon}
                  />
                )}
                <Text style={[styles.providerText, { color: provider.color }]}>
                  {authenticating === provider.id ? "Authenticating..." : provider.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.emailButton}
          onPress={handleEmailLogin}
          accessible
          accessibilityLabel="Continue with email"
          accessibilityRole="button"
        >
          <Text style={styles.emailButtonText}>Continue with Email</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why use social login?</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoText}>• Faster sign-in process</Text>
            <Text style={styles.infoText}>• No need to remember passwords</Text>
            <Text style={styles.infoText}>• Secure authentication</Text>
            <Text style={styles.infoText}>• Easy account recovery</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{" "}
            <Text style={styles.linkText}>Terms of Service</Text> and{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export const SocialLoginScreen = (props: any) => (
  <ScreenErrorBoundary screenName="Social Login">
    <SocialLoginScreenComponent {...props} />
  </ScreenErrorBoundary>
);

export default SocialLoginScreen;
