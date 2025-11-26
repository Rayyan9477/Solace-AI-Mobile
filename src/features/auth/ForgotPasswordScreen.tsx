/**
 * Forgot Password Screen
 * Matches Freud UI design with brown therapeutic theme
 */

import { MentalHealthIcon } from "@components/icons";
import { FreudLogo } from "@components/icons/FreudIcons";
import { useTheme } from "@theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { showAlert } from "@shared/utils/alert";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";

type ResetMethod = "2fa" | "password" | "google";

interface ForgotPasswordScreenProps {
  navigation: {
    goBack: () => void;
  };
}

const ForgotPasswordScreenComponent = ({ navigation }: ForgotPasswordScreenProps) => {
  const { theme, isDark } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState<ResetMethod>("2fa");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? theme.colors.brown[90] : theme.colors.brown[80],
    },
    gradient: {
      flex: 1,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 24,
      paddingBottom: 20,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: theme.colors.brown[60],
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      backgroundColor: isDark ? theme.colors.brown[80] : theme.colors.brown[70],
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: 48,
      paddingHorizontal: 24,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      color: theme.colors.brown[10],
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.brown[30],
      marginBottom: 40,
      lineHeight: 20,
    },
    methodContainer: {
      marginBottom: 16,
    },
    methodButton: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: theme.colors.brown[60],
      borderRadius: 24,
      backgroundColor: isDark
        ? `rgba(${parseInt(theme.colors.brown[80].slice(1, 3), 16)}, ${parseInt(theme.colors.brown[80].slice(3, 5), 16)}, ${parseInt(theme.colors.brown[80].slice(5, 7), 16)}, 0.5)`
        : `rgba(45, 27, 14, 0.5)`,
      paddingHorizontal: 20,
      paddingVertical: 18,
    },
    methodButtonSelected: {
      borderColor: theme.colors.green[50],
      backgroundColor: `${theme.colors.green[50]}1A`,
    },
    methodIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.green[50],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    methodIconSelected: {
      backgroundColor: theme.colors.green[60],
    },
    methodContent: {
      flex: 1,
    },
    methodTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.brown[10],
      marginBottom: 4,
    },
    checkmark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.green[50],
      justifyContent: "center",
      alignItems: "center",
    },
    sendButton: {
      backgroundColor: theme.colors.brown[50],
      borderRadius: 24,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 32,
      flexDirection: "row",
      justifyContent: "center",
    },
    disabledButton: {
      opacity: 0.5,
    },
    sendButtonText: {
      color: theme.colors.brown[10],
      fontSize: 16,
      fontWeight: "600",
      marginRight: 8,
    },
    successContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 40,
    },
    successIllustration: {
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: theme.colors.brown[40],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 32,
    },
    illustrationInner: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.green[50],
      justifyContent: "center",
      alignItems: "center",
    },
    successTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.brown[10],
      marginBottom: 12,
      textAlign: "center",
    },
    successSubtitle: {
      fontSize: 14,
      color: theme.colors.brown[30],
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 8,
    },
    maskedEmail: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.brown[10],
      marginBottom: 24,
    },
    resendText: {
      fontSize: 14,
      color: theme.colors.brown[30],
      textAlign: "center",
    },
    resendLink: {
      color: theme.colors.orange[40],
      fontWeight: "600",
    },
    closeButton: {
      position: "absolute",
      bottom: 32,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.brown[10],
      justifyContent: "center",
      alignItems: "center",
    },
    closeIcon: {
      fontSize: 24,
      color: theme.colors.brown[80],
    },
  });

  const backgroundColors = isDark
    ? [theme.colors.brown[90], theme.colors.brown[80]]
    : [theme.colors.brown[80], theme.colors.brown[70]];

  const handleSendPassword = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmailSent(true);
    } catch (error: any) {
      showAlert("Error", "Failed to send reset link. Please try again.", [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showAlert("Success", "Reset link has been resent to your email.", [{ text: "OK" }]);
    } catch (error: any) {
      showAlert("Error", "Failed to resend link. Please try again.", [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <LinearGradient
          colors={backgroundColors}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <View style={styles.content}>
            <View style={styles.successContainer}>
              <View style={styles.successIllustration}>
                <View style={styles.illustrationInner}>
                  <MentalHealthIcon name="Lock" size={48} color={theme.colors.brown[10]} style={{}} />
                </View>
              </View>

              <Text style={styles.successTitle}>
                We've Sent Verification{"\n"}Code to ****•••••***24
              </Text>
              <Text style={styles.successSubtitle}>
                Didn't receive the link? Then re-send the{"\n"}password below 🔑
              </Text>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleResend}
                disabled={isLoading}
              >
                <MentalHealthIcon
                  name="RotateCw"
                  size={20}
                  color={theme.colors.brown[10]}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sendButtonText}>
                  {isLoading ? "Resending..." : "Re-Send Password"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation?.goBack?.()}
              >
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <LinearGradient
          colors={backgroundColors}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack?.()}
            >
              <Text style={{ fontSize: 20, color: theme.colors.brown[20] }}>←</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>
                Select contact details where you want to reset{"\n"}your
                password
              </Text>

              <View style={styles.methodContainer}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    selectedMethod === "2fa" && styles.methodButtonSelected,
                  ]}
                  onPress={() => setSelectedMethod("2fa")}
                >
                  <View
                    style={[
                      styles.methodIcon,
                      selectedMethod === "2fa" && styles.methodIconSelected,
                    ]}
                  >
                    <MentalHealthIcon name="Lock" size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.methodContent}>
                    <Text style={styles.methodTitle}>Use 2FA</Text>
                  </View>
                  {selectedMethod === "2fa" && (
                    <View style={styles.checkmark}>
                      <Text style={{ color: theme.colors.brown[10], fontSize: 16 }}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.methodContainer}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    selectedMethod === "password" &&
                      styles.methodButtonSelected,
                  ]}
                  onPress={() => setSelectedMethod("password")}
                >
                  <View
                    style={[
                      styles.methodIcon,
                      selectedMethod === "password" &&
                        styles.methodIconSelected,
                    ]}
                  >
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: theme.colors.brown[10],
                      }}
                    />
                  </View>
                  <View style={styles.methodContent}>
                    <Text style={styles.methodTitle}>Password</Text>
                  </View>
                  {selectedMethod === "password" && (
                    <View style={styles.checkmark}>
                      <Text style={{ color: theme.colors.brown[10], fontSize: 16 }}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.methodContainer}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    selectedMethod === "google" && styles.methodButtonSelected,
                  ]}
                  onPress={() => setSelectedMethod("google")}
                >
                  <View
                    style={[
                      styles.methodIcon,
                      selectedMethod === "google" && styles.methodIconSelected,
                    ]}
                  >
                    <MentalHealthIcon name="Mail" size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.methodContent}>
                    <Text style={styles.methodTitle}>Google Authenticator</Text>
                  </View>
                  {selectedMethod === "google" && (
                    <View style={styles.checkmark}>
                      <Text style={{ color: theme.colors.brown[10], fontSize: 16 }}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.sendButton, isLoading && styles.disabledButton]}
                onPress={handleSendPassword}
                disabled={isLoading}
              >
                <MentalHealthIcon
                  name="Lock"
                  size={20}
                  color={theme.colors.brown[10]}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sendButtonText}>
                  {isLoading ? "Sending..." : "Send Password"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export const ForgotPasswordScreen = (props: ForgotPasswordScreenProps) => (
  <ScreenErrorBoundary screenName="Forgot Password">
    <ForgotPasswordScreenComponent {...props} />
  </ScreenErrorBoundary>
);

export default ForgotPasswordScreen;
