/**
 * Forgot Password Screen
 * Matches Freud UI design with brown therapeutic theme
 */

import { MentalHealthIcon } from "@components/icons";
import { FreudLogo } from "@components/icons/FreudIcons";
import { useTheme } from "@theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
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
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";

type ResetMethod = "2fa" | "password" | "google";

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState<ResetMethod>("2fa");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.isDark ? "#2D1B0E" : "#1A1108",
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
      borderColor: "#6B5444",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      backgroundColor: theme.isDark ? "#3D2817" : "#2D1B0E",
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
      color: "#FFFFFF",
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 14,
      color: "#B8A99A",
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
      borderColor: "#6B5444",
      borderRadius: 24,
      backgroundColor: "rgba(45, 27, 14, 0.5)",
      paddingHorizontal: 20,
      paddingVertical: 18,
    },
    methodButtonSelected: {
      borderColor: "#8FBC8F",
      backgroundColor: "rgba(143, 188, 143, 0.1)",
    },
    methodIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "#8FBC8F",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    methodIconSelected: {
      backgroundColor: "#6B9B6B",
    },
    methodContent: {
      flex: 1,
    },
    methodTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    checkmark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#8FBC8F",
      justifyContent: "center",
      alignItems: "center",
    },
    sendButton: {
      backgroundColor: "#A67C52",
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
      color: "#FFFFFF",
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
      backgroundColor: "#B8976B",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 32,
    },
    illustrationInner: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "#8FBC8F",
      justifyContent: "center",
      alignItems: "center",
    },
    successTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 12,
      textAlign: "center",
    },
    successSubtitle: {
      fontSize: 14,
      color: "#B8A99A",
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 8,
    },
    maskedEmail: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
      marginBottom: 24,
    },
    resendText: {
      fontSize: 14,
      color: "#B8A99A",
      textAlign: "center",
    },
    resendLink: {
      color: "#E8A872",
      fontWeight: "600",
    },
    closeButton: {
      position: "absolute",
      bottom: 32,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#FFFFFF",
      justifyContent: "center",
      alignItems: "center",
    },
    closeIcon: {
      fontSize: 24,
      color: "#3D2817",
    },
  });

  const backgroundColors = ["#1A1108", "#2D1B0E"];

  const handleSendPassword = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmailSent(true);
    } catch (error: any) {
      Alert.alert("Error", "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      Alert.alert("Success", "Reset link has been resent to your email.");
    } catch (error: any) {
      Alert.alert("Error", "Failed to resend link. Please try again.");
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
                  <MentalHealthIcon name="Lock" size={48} color="#FFFFFF" />
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
                  color="#FFFFFF"
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
              <Text style={{ fontSize: 20, color: "#E5DDD5" }}>←</Text>
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
                      <Text style={{ color: "#FFFFFF", fontSize: 16 }}>✓</Text>
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
                        backgroundColor: "#FFFFFF",
                      }}
                    />
                  </View>
                  <View style={styles.methodContent}>
                    <Text style={styles.methodTitle}>Password</Text>
                  </View>
                  {selectedMethod === "password" && (
                    <View style={styles.checkmark}>
                      <Text style={{ color: "#FFFFFF", fontSize: 16 }}>✓</Text>
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
                      <Text style={{ color: "#FFFFFF", fontSize: 16 }}>✓</Text>
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
                  color="#FFFFFF"
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

export default ForgotPasswordScreen;
