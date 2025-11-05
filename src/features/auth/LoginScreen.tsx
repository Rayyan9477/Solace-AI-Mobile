/**
 * Login Screen - User Authentication
 * Matches Freud UI design with brown therapeutic theme
 */

import { useAppDispatch, useAppSelector } from "@app/store";
import { secureLogin } from "@app/store/slices/authSlice";
import { MentalHealthIcon } from "@components/icons";
import { FreudLogo } from "@components/icons/FreudIcons";
import rateLimiter from "@shared/utils/rateLimiter";
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
} from "react-native";

export const LoginScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => (state as any).auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.isDark ? "#2D1B0E" : "#8B7355",
    },
    gradient: {
      flex: 1,
    },
    header: {
      paddingTop: 60,
      paddingBottom: 40,
      alignItems: "center",
    },
    logoContainer: {
      marginBottom: 24,
    },
    content: {
      flex: 1,
      backgroundColor: theme.isDark ? "#3D2817" : "#4A3426",
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: 48,
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 40,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: "#E5DDD5",
      marginBottom: 8,
      letterSpacing: 0.3,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: "#6B5444",
      borderRadius: 24,
      backgroundColor: "rgba(45, 27, 14, 0.5)",
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: "#FFFFFF",
      paddingVertical: 0,
    },
    eyeButton: {
      padding: 4,
      marginLeft: 8,
    },
    loginButton: {
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
    loginButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginRight: 8,
    },
    socialContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 16,
      marginTop: 32,
    },
    socialButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      borderColor: "#6B5444",
      justifyContent: "center",
      alignItems: "center",
    },
    socialIcon: {
      fontSize: 20,
    },
    footer: {
      alignItems: "center",
      marginTop: 24,
      marginBottom: 32,
    },
    footerText: {
      fontSize: 14,
      color: "#B8A99A",
    },
    signupButton: {
      marginTop: 4,
    },
    signupText: {
      fontSize: 14,
      color: "#E8A872",
      fontWeight: "600",
    },
    forgotPassword: {
      alignSelf: "center",
      marginTop: 16,
    },
    forgotPasswordText: {
      color: "#E8A872",
      fontSize: 14,
      fontWeight: "500",
    },
  });

  const backgroundColors = theme.isDark
    ? ["#8B7355", "#6B5444"]
    : ["#A67C52", "#8B6F47"];

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const rateLimit = await rateLimiter.checkLimit(
      `login:${email.toLowerCase()}`,
      5,
      15 * 60 * 1000,
    );

    if (!rateLimit.allowed) {
      Alert.alert(
        "Too Many Attempts",
        `You have exceeded the maximum login attempts. Please try again in ${rateLimit.waitTime} seconds.`,
        [{ text: "OK" }],
      );
      return;
    }

    const result = await dispatch((secureLogin as any)({ email, password }));

    if (result.type === "auth/secureLogin/fulfilled") {
      rateLimiter.reset(`login:${email.toLowerCase()}`);
    }
  };

  const canLogin = email.trim() && password.trim() && !isLoading;

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
            <View style={styles.logoContainer}>
              <FreudLogo size={64} primaryColor="#FFFFFF" />
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Sign In To freud.ai</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <MentalHealthIcon
                  name="Mail"
                  size={20}
                  color="#B8A99A"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="princesskaguya@gmail.com"
                  placeholderTextColor="#6B5444"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <MentalHealthIcon
                  name="Lock"
                  size={20}
                  color="#B8A99A"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password..."
                  placeholderTextColor="#6B5444"
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  accessible
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                  accessibilityRole="button"
                  accessibilityHint="Toggles password visibility"
                >
                  <MentalHealthIcon
                    name={showPassword ? "EyeOff" : "Eye"}
                    size={20}
                    color="#B8A99A"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, !canLogin && styles.disabledButton]}
              onPress={handleLogin}
              disabled={!canLogin}
              accessible
              accessibilityLabel="Sign in"
              accessibilityRole="button"
              accessibilityState={{ disabled: !canLogin, busy: isLoading }}
              accessibilityHint="Sign in to your account"
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
              <Text style={{ color: "#FFFFFF", fontSize: 18 }}>→</Text>
            </TouchableOpacity>

            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                accessible
                accessibilityLabel="Sign in with Facebook"
                accessibilityRole="button"
              >
                <Text style={styles.socialIcon}>f</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                accessible
                accessibilityLabel="Sign in with Google"
                accessibilityRole="button"
              >
                <Text style={styles.socialIcon}>G</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                accessible
                accessibilityLabel="Sign in with Instagram"
                accessibilityRole="button"
              >
                <Text style={styles.socialIcon}>📷</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don't have an account?{" "}
                <Text
                  style={styles.signupText}
                  onPress={() => navigation?.navigate?.("Signup")}
                >
                  Sign Up
                </Text>
              </Text>
              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigation?.navigate?.("ForgotPassword")}
                accessible
                accessibilityLabel="Forgot password"
                accessibilityRole="button"
                accessibilityHint="Navigate to password recovery"
              >
                <Text style={styles.forgotPasswordText}>Forgot Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
