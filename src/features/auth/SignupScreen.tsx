/**
 * Signup Screen - User Registration
 * Matches Freud UI design with brown therapeutic theme
 */

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
  ScrollView,
  StatusBar,
} from "react-native";

export const SignupScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

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
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 32,
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
    inputWrapperError: {
      borderColor: "#E8A872",
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
    errorText: {
      fontSize: 12,
      color: "#E8A872",
      marginTop: 4,
      marginLeft: 20,
    },
    errorBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(232, 168, 114, 0.2)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginTop: 8,
    },
    errorBadgeText: {
      fontSize: 12,
      color: "#E8A872",
      marginLeft: 6,
    },
    signupButton: {
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
    signupButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginRight: 8,
    },
    footer: {
      alignItems: "center",
      marginTop: 24,
    },
    footerText: {
      fontSize: 14,
      color: "#B8A99A",
    },
    loginText: {
      fontSize: 14,
      color: "#E8A872",
      fontWeight: "600",
    },
  });

  const backgroundColors = theme.isDark
    ? ["#8B7355", "#6B5444"]
    : ["#A67C52", "#8B6F47"];

  const validateEmail = (email: string) => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid Email Address!!!");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];

    if (password.length < 12) {
      errors.push("at least 12 characters");
    }
    if (password.length > 128) {
      errors.push("less than 128 characters");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("one lowercase letter");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("one uppercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("one number");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("one special character");
    }

    const commonPasswords = [
      "password",
      "solace",
      "mental",
      "health",
      "123456789",
      "qwerty",
    ];
    if (
      commonPasswords.some((common) => password.toLowerCase().includes(common))
    ) {
      errors.push("cannot contain common words");
    }

    return errors;
  };

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return false;
    }
    if (!validateEmail(email)) {
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter a password");
      return false;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      Alert.alert(
        "Password Too Weak",
        `Your password must include:\n• ${passwordErrors.join("\n• ")}`,
        [{ text: "OK" }],
      );
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    const rateLimit = await rateLimiter.checkLimit(
      `signup:${email.toLowerCase()}`,
      3,
      60 * 60 * 1000,
    );

    if (!rateLimit.allowed) {
      Alert.alert(
        "Too Many Attempts",
        `You have exceeded the maximum signup attempts. Please try again in ${rateLimit.waitTime} seconds.`,
        [{ text: "OK" }],
      );
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      rateLimiter.reset(`signup:${email.toLowerCase()}`);
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => navigation?.navigate?.("Login"),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Signup Failed",
        error.message || "Failed to create account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const canSignup =
    email.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    !isLoading &&
    !emailError;

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
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Sign Up For Free</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    emailError && styles.inputWrapperError,
                  ]}
                >
                  <MentalHealthIcon
                    name="Mail"
                    size={20}
                    color="#B8A99A"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError && text.trim()) validateEmail(text);
                    }}
                    onBlur={() => email.trim() && validateEmail(email)}
                    placeholder="Enter your email..."
                    placeholderTextColor="#6B5444"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                {emailError ? (
                  <View style={styles.errorBadge}>
                    <MentalHealthIcon
                      name="AlertCircle"
                      size={14}
                      color="#E8A872"
                    />
                    <Text style={styles.errorBadgeText}>{emailError}</Text>
                  </View>
                ) : null}
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
                    autoComplete="new-password"
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

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password Confirmation</Text>
                <View style={styles.inputWrapper}>
                  <MentalHealthIcon
                    name="Lock"
                    size={20}
                    color="#B8A99A"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Enter your password..."
                    placeholderTextColor="#6B5444"
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    accessible
                    accessibilityLabel={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    accessibilityRole="button"
                    accessibilityHint="Toggles confirm password visibility"
                  >
                    <MentalHealthIcon
                      name={showConfirmPassword ? "EyeOff" : "Eye"}
                      size={20}
                      color="#B8A99A"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.signupButton,
                  !canSignup && styles.disabledButton,
                ]}
                onPress={handleSignup}
                disabled={!canSignup}
                accessible
                accessibilityLabel="Sign up"
                accessibilityRole="button"
                accessibilityState={{ disabled: !canSignup, busy: isLoading }}
                accessibilityHint="Create a new account"
              >
                <Text style={styles.signupButtonText}>
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Text>
                <Text style={{ color: "#FFFFFF", fontSize: 18 }}>→</Text>
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Already have an account?{" "}
                  <Text
                    style={styles.loginText}
                    onPress={() => navigation?.navigate?.("Login")}
                  >
                    Sign In
                  </Text>
                </Text>
              </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
