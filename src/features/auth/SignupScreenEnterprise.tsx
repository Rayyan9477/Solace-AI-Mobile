/**
 * Enterprise Signup Screen - Production-Ready User Registration
 * 
 * Features:
 * - Real backend API integration
 * - Password strength validation
 * - Terms and privacy acceptance
 * - Email verification
 * - Comprehensive error handling
 */

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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@theme/ThemeProvider";
import { useResponsive } from "@shared/hooks/useResponsive";
import { useAppDispatch } from "@app/store";

import authService, { SignupData } from "@shared/services/authService";
import { logger } from "@shared/utils/logger";
import { showAlert } from "@shared/utils/alert";

export const SignupScreenEnterprise = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const { isWeb, getMaxContentWidth } = useResponsive();
  const dispatch = useAppDispatch();

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  // Responsive values
  const maxWidth = getMaxContentWidth();
  const contentMaxWidth = isWeb ? Math.min(maxWidth, 480) : "100%";

  /**
   * Check password strength
   */
  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  /**
   * Handle password change
   */
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    checkPasswordStrength(text);
  };

  /**
   * Validate signup form
   */
  const validateForm = (): boolean => {
    if (!name.trim()) {
      showAlert("Error", "Please enter your full name", [{ text: "OK" }]);
      return false;
    }

    if (!email.trim()) {
      showAlert("Error", "Please enter your email address", [{ text: "OK" }]);
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showAlert("Error", "Please enter a valid email address", [{ text: "OK" }]);
      return false;
    }

    if (!password.trim()) {
      showAlert("Error", "Please enter a password", [{ text: "OK" }]);
      return false;
    }

    if (password !== confirmPassword) {
      showAlert("Error", "Passwords do not match", [{ text: "OK" }]);
      return false;
    }

    // Check password strength requirements
    const allRequirementsMet = Object.values(passwordStrength).every(
      (req) => req === true
    );

    if (!allRequirementsMet) {
      showAlert(
        "Weak Password",
        "Password must meet all security requirements",
        [{ text: "OK" }]
      );
      return false;
    }

    if (!acceptTerms) {
      showAlert("Error", "Please accept the Terms of Service", [{ text: "OK" }]);
      return false;
    }

    if (!acceptPrivacy) {
      showAlert("Error", "Please accept the Privacy Policy", [{ text: "OK" }]);
      return false;
    }

    return true;
  };

  /**
   * Handle user signup
   */
  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const signupData: SignupData = {
        email,
        password,
        name,
        acceptTerms,
        acceptPrivacy,
      };

      const response = await authService.signup(signupData);

      // Show success message
      showAlert(
        "Success",
        "Your account has been created successfully! Please check your email to verify your account.",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate to login
              navigation.navigate("Login", { email });
            },
          },
        ]
      );

      logger.info("Signup successful for user:", email);
    } catch (error: any) {
      logger.error("Signup failed:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.message) {
        if (error.message.includes("already exists")) {
          errorMessage = "An account with this email already exists.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Connection timeout. Please check your internet connection.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      showAlert("Signup Failed", errorMessage, [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to login screen
   */
  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const canSignup =
    name.trim() &&
    email.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    acceptTerms &&
    acceptPrivacy &&
    !isLoading;

  const backgroundColors = isDark
    ? [theme.colors.brown[60], theme.colors.brown[70]]
    : [theme.colors.brown[50], theme.colors.brown[60]];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? theme.colors.brown[90] : theme.colors.brown[60],
    },
    gradient: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    innerContainer: {
      flex: 1,
      ...(isWeb && {
        justifyContent: "center",
        alignItems: "center",
      }),
    },
    contentWrapper: {
      flex: 1,
      width: "100%",
      maxWidth: contentMaxWidth,
      ...(isWeb && {
        minHeight: 700,
      }),
    },
    header: {
      paddingTop: isWeb ? 40 : 60,
      paddingBottom: isWeb ? 32 : 40,
      alignItems: "center",
    },
    title: {
      fontSize: isWeb ? 28 : 32,
      fontWeight: "700",
      color: theme.colors.brown[10],
      marginBottom: 8,
      textAlign: "center",
    },
    subtitle: {
      fontSize: isWeb ? 14 : 16,
      color: theme.colors.brown[20],
      textAlign: "center",
    },
    content: {
      flex: 1,
      backgroundColor: isDark ? theme.colors.brown[80] : theme.colors.brown[70],
      borderTopLeftRadius: isWeb ? 24 : 32,
      borderTopRightRadius: isWeb ? 24 : 32,
      ...(isWeb && {
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        marginBottom: 40,
      }),
      paddingTop: isWeb ? 40 : 48,
      paddingHorizontal: isWeb ? 32 : 24,
      paddingBottom: isWeb ? 32 : 24,
    },
    formTitle: {
      fontSize: isWeb ? 20 : 24,
      fontWeight: "600",
      color: theme.colors.brown[10],
      marginBottom: isWeb ? 24 : 32,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.brown[20],
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDark ? theme.colors.brown[70] : theme.colors.brown[60],
      borderRadius: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: theme.colors.brown[50],
    },
    input: {
      flex: 1,
      paddingVertical: 14,
      fontSize: 16,
      color: theme.colors.brown[10],
    },
    eyeIcon: {
      padding: 8,
    },
    passwordStrength: {
      marginTop: 12,
      paddingLeft: 4,
    },
    strengthText: {
      fontSize: 12,
      marginBottom: 6,
      color: theme.colors.brown[30],
    },
    requirementRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    requirementText: {
      fontSize: 11,
      marginLeft: 6,
      color: theme.colors.brown[40],
    },
    requirementMet: {
      color: theme.colors.green[50],
    },
    checkboxContainer: {
      marginBottom: 16,
    },
    checkboxRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.colors.brown[30],
      marginRight: 8,
      marginTop: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxChecked: {
      backgroundColor: theme.colors.brown[30],
    },
    checkboxLabel: {
      flex: 1,
      fontSize: 13,
      color: theme.colors.brown[20],
      lineHeight: 18,
    },
    checkboxLink: {
      color: theme.colors.brown[30],
      fontWeight: "600",
    },
    signupButton: {
      backgroundColor: theme.colors.brown[30],
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 8,
      marginBottom: 16,
    },
    signupButtonDisabled: {
      opacity: 0.5,
    },
    signupButtonText: {
      color: theme.colors.brown[90],
      fontSize: 16,
      fontWeight: "700",
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.brown[50],
    },
    dividerText: {
      marginHorizontal: 16,
      fontSize: 14,
      color: theme.colors.brown[40],
    },
    loginRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    loginText: {
      fontSize: 14,
      color: theme.colors.brown[30],
    },
    loginLink: {
      fontSize: 14,
      color: theme.colors.brown[20],
      fontWeight: "700",
      marginLeft: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.innerContainer}>
              <View style={styles.contentWrapper}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Create Account</Text>
                  <Text style={styles.subtitle}>Join Solace AI today</Text>
                </View>

                {/* Form Content */}
                <View style={styles.content}>
                  <Text style={styles.formTitle}>Sign Up</Text>

                  {/* Name Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        placeholderTextColor={theme.colors.brown[40]}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        editable={!isLoading}
                      />
                    </View>
                  </View>

                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor={theme.colors.brown[40]}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isLoading}
                      />
                    </View>
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="Create a password"
                        placeholderTextColor={theme.colors.brown[40]}
                        value={password}
                        onChangeText={handlePasswordChange}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isLoading}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                        disabled={isLoading}
                      >
                        <Ionicons
                          name={showPassword ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color={theme.colors.brown[30]}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Password Strength Indicator */}
                    {password.length > 0 && (
                      <View style={styles.passwordStrength}>
                        <Text style={styles.strengthText}>Password requirements:</Text>
                        <View style={styles.requirementRow}>
                          <Ionicons
                            name={
                              passwordStrength.hasMinLength
                                ? "checkmark-circle"
                                : "ellipse-outline"
                            }
                            size={14}
                            color={
                              passwordStrength.hasMinLength
                                ? theme.colors.green[50]
                                : theme.colors.brown[40]
                            }
                          />
                          <Text
                            style={[
                              styles.requirementText,
                              passwordStrength.hasMinLength && styles.requirementMet,
                            ]}
                          >
                            At least 8 characters
                          </Text>
                        </View>
                        <View style={styles.requirementRow}>
                          <Ionicons
                            name={
                              passwordStrength.hasUppercase
                                ? "checkmark-circle"
                                : "ellipse-outline"
                            }
                            size={14}
                            color={
                              passwordStrength.hasUppercase
                                ? theme.colors.green[50]
                                : theme.colors.brown[40]
                            }
                          />
                          <Text
                            style={[
                              styles.requirementText,
                              passwordStrength.hasUppercase && styles.requirementMet,
                            ]}
                          >
                            One uppercase letter
                          </Text>
                        </View>
                        <View style={styles.requirementRow}>
                          <Ionicons
                            name={
                              passwordStrength.hasLowercase
                                ? "checkmark-circle"
                                : "ellipse-outline"
                            }
                            size={14}
                            color={
                              passwordStrength.hasLowercase
                                ? theme.colors.green[50]
                                : theme.colors.brown[40]
                            }
                          />
                          <Text
                            style={[
                              styles.requirementText,
                              passwordStrength.hasLowercase && styles.requirementMet,
                            ]}
                          >
                            One lowercase letter
                          </Text>
                        </View>
                        <View style={styles.requirementRow}>
                          <Ionicons
                            name={
                              passwordStrength.hasNumber
                                ? "checkmark-circle"
                                : "ellipse-outline"
                            }
                            size={14}
                            color={
                              passwordStrength.hasNumber
                                ? theme.colors.green[50]
                                : theme.colors.brown[40]
                            }
                          />
                          <Text
                            style={[
                              styles.requirementText,
                              passwordStrength.hasNumber && styles.requirementMet,
                            ]}
                          >
                            One number
                          </Text>
                        </View>
                        <View style={styles.requirementRow}>
                          <Ionicons
                            name={
                              passwordStrength.hasSpecial
                                ? "checkmark-circle"
                                : "ellipse-outline"
                            }
                            size={14}
                            color={
                              passwordStrength.hasSpecial
                                ? theme.colors.green[50]
                                : theme.colors.brown[40]
                            }
                          />
                          <Text
                            style={[
                              styles.requirementText,
                              passwordStrength.hasSpecial && styles.requirementMet,
                            ]}
                          >
                            One special character
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Confirm Password Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm your password"
                        placeholderTextColor={theme.colors.brown[40]}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isLoading}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.eyeIcon}
                        disabled={isLoading}
                      >
                        <Ionicons
                          name={
                            showConfirmPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={20}
                          color={theme.colors.brown[30]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Terms Checkbox */}
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      style={styles.checkboxRow}
                      onPress={() => setAcceptTerms(!acceptTerms)}
                      disabled={isLoading}
                    >
                      <View
                        style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
                      >
                        {acceptTerms && (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={theme.colors.brown[90]}
                          />
                        )}
                      </View>
                      <Text style={styles.checkboxLabel}>
                        I agree to the{" "}
                        <Text style={styles.checkboxLink}>Terms of Service</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Privacy Checkbox */}
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      style={styles.checkboxRow}
                      onPress={() => setAcceptPrivacy(!acceptPrivacy)}
                      disabled={isLoading}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          acceptPrivacy && styles.checkboxChecked,
                        ]}
                      >
                        {acceptPrivacy && (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={theme.colors.brown[90]}
                          />
                        )}
                      </View>
                      <Text style={styles.checkboxLabel}>
                        I agree to the{" "}
                        <Text style={styles.checkboxLink}>Privacy Policy</Text>
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Signup Button */}
                  <TouchableOpacity
                    style={[
                      styles.signupButton,
                      !canSignup && styles.signupButtonDisabled,
                    ]}
                    onPress={handleSignup}
                    disabled={!canSignup}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={theme.colors.brown[90]} />
                    ) : (
                      <Text style={styles.signupButtonText}>Create Account</Text>
                    )}
                  </TouchableOpacity>

                  {/* Divider */}
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Login Link */}
                  <View style={styles.loginRow}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <TouchableOpacity onPress={handleLoginPress} disabled={isLoading}>
                      <Text style={styles.loginLink}>Log In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreenEnterprise;
