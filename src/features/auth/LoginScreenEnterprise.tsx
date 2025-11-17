/**
 * Enterprise Login Screen - Production-Ready Authentication
 * 
 * Features:
 * - Real backend API integration
 * - Biometric authentication
 * - Rate limiting & security
 * - MFA support
 * - Session management
 * - Comprehensive error handling
 */

import React, { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "@app/store";
import { secureLogin } from "@app/store/slices/authSlice";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@theme/ThemeProvider";
import { useResponsive } from "@shared/hooks/useResponsive";

import authService from "@shared/services/authService";
import { logger } from "@shared/utils/logger";
import { showAlert } from "@shared/utils/alert";

export const LoginScreenEnterprise = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const { isWeb, getMaxContentWidth } = useResponsive();
  const dispatch = useAppDispatch();
  const { isLoading: reduxLoading } = useAppSelector((state) => (state as any).auth);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Biometric state
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string[]>([]);

  // Responsive values
  const maxWidth = getMaxContentWidth();
  const contentMaxWidth = isWeb ? Math.min(maxWidth, 480) : "100%";

  /**
   * Check biometric availability and load last email
   */
  useEffect(() => {
    const initializeScreen = async () => {
      try {
        // Check biometric availability
        const available = await authService.isBiometricAvailable();
        const enabled = await authService.isBiometricEnabled();
        const types = await authService.getSupportedBiometricTypes();

        setBiometricAvailable(available);
        setBiometricEnabled(enabled);
        setBiometricType(types);

        // Load last email for convenience
        const lastEmail = await authService.getLastEmail();
        if (lastEmail) {
          setEmail(lastEmail);
        }
      } catch (error) {
        logger.error("Screen initialization failed:", error);
      }
    };

    initializeScreen();
  }, []);

  /**
   * Validate login form
   */
  const validateForm = (): boolean => {
    if (!email.trim()) {
      showAlert("Error", "Please enter your email address", [{ text: "OK" }]);
      return false;
    }

    if (!password.trim()) {
      showAlert("Error", "Please enter your password", [{ text: "OK" }]);
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      showAlert("Error", "Please enter a valid email address", [{ text: "OK" }]);
      return false;
    }

    return true;
  };

  /**
   * Handle login with credentials
   */
  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.login({
        email,
        password,
        rememberMe,
      });

      // Save email for convenience
      if (rememberMe) {
        await authService.saveLastEmail(email);
      }

      // Handle MFA if required
      if (response.requiresMfa) {
        showAlert(
          "MFA Required",
          "A verification code has been sent to your device. Please enter it to continue.",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("MFAVerification", {
                  mfaToken: response.mfaToken,
                  email,
                });
              },
            },
          ]
        );
        return;
      }

      // Update Redux state
      await dispatch(
        secureLogin({
          email,
          password,
          rememberMe,
        })
      );

      logger.info("Login successful for user:", email);
      showAlert("Success", "Welcome back!", [{ text: "OK" }]);
    } catch (error: any) {
      logger.error("Login failed:", error);
      
      let errorMessage = "Invalid credentials. Please try again.";
      
      if (error.message) {
        if (error.message.includes("Too many")) {
          errorMessage = error.message;
        } else if (error.message.includes("timeout")) {
          errorMessage = "Connection timeout. Please check your internet connection.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }

      showAlert("Login Failed", errorMessage, [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle biometric authentication
   */
  const handleBiometricLogin = async () => {
    try {
      setIsLoading(true);
      const success = await authService.authenticateWithBiometric();

      if (success) {
        // Biometric authentication successful - restore session
        const user = await authService.getCurrentUser();
        
        if (user) {
          await dispatch(
            secureLogin({
              email: user.email,
              password: "", // Not needed for biometric
              rememberMe: true,
            })
          );

          logger.info("Biometric login successful for user:", user.email);
          showAlert("Success", "Welcome back!", [{ text: "OK" }]);
        } else {
          showAlert(
            "Authentication Failed",
            "No saved session found. Please log in with your credentials.",
            [{ text: "OK" }]
          );
        }
      } else {
        showAlert(
          "Authentication Failed",
          "Biometric authentication was not successful. Please try again or use your password.",
          [{ text: "OK" }]
        );
      }
    } catch (error: any) {
      logger.error("Biometric login failed:", error);
      showAlert(
        "Authentication Failed",
        error.message || "Biometric authentication failed. Please use your password.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to signup screen
   */
  const handleSignupPress = () => {
    navigation.navigate("Signup");
  };

  /**
   * Navigate to forgot password screen
   */
  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const canLogin = email.trim() && password.trim() && !isLoading && !reduxLoading;

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
        minHeight: 600,
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
    inputWrapperFocused: {
      borderColor: theme.colors.brown[30],
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
    optionsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: theme.colors.brown[30],
      marginRight: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxChecked: {
      backgroundColor: theme.colors.brown[30],
    },
    checkboxLabel: {
      fontSize: 14,
      color: theme.colors.brown[20],
    },
    forgotPassword: {
      fontSize: 14,
      color: theme.colors.brown[30],
      fontWeight: "600",
    },
    loginButton: {
      backgroundColor: theme.colors.brown[30],
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginBottom: 16,
    },
    loginButtonDisabled: {
      opacity: 0.5,
    },
    loginButtonText: {
      color: theme.colors.brown[90],
      fontSize: 16,
      fontWeight: "700",
    },
    biometricButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isDark ? theme.colors.brown[70] : theme.colors.brown[60],
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.brown[50],
      marginBottom: 24,
    },
    biometricButtonText: {
      color: theme.colors.brown[20],
      fontSize: 14,
      fontWeight: "600",
      marginLeft: 8,
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
    signupRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    signupText: {
      fontSize: 14,
      color: theme.colors.brown[30],
    },
    signupLink: {
      fontSize: 14,
      color: theme.colors.brown[20],
      fontWeight: "700",
      marginLeft: 4,
    },
    securityNote: {
      marginTop: 24,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: theme.colors.brown[50],
      alignItems: "center",
    },
    securityText: {
      fontSize: 12,
      color: theme.colors.brown[40],
      textAlign: "center",
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
                  <Text style={styles.title}>Welcome Back</Text>
                  <Text style={styles.subtitle}>Sign in to continue to Solace AI</Text>
                </View>

                {/* Form Content */}
                <View style={styles.content}>
                  <Text style={styles.formTitle}>Login</Text>

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
                        editable={!isLoading && !reduxLoading}
                      />
                    </View>
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor={theme.colors.brown[40]}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!isLoading && !reduxLoading}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                        disabled={isLoading || reduxLoading}
                      >
                        <Ionicons
                          name={showPassword ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color={theme.colors.brown[30]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Options Row */}
                  <View style={styles.optionsRow}>
                    <TouchableOpacity
                      style={styles.checkboxRow}
                      onPress={() => setRememberMe(!rememberMe)}
                      disabled={isLoading || reduxLoading}
                    >
                      <View
                        style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                      >
                        {rememberMe && (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={theme.colors.brown[90]}
                          />
                        )}
                      </View>
                      <Text style={styles.checkboxLabel}>Remember me</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleForgotPassword}
                      disabled={isLoading || reduxLoading}
                    >
                      <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity
                    style={[
                      styles.loginButton,
                      !canLogin && styles.loginButtonDisabled,
                    ]}
                    onPress={handleLogin}
                    disabled={!canLogin}
                  >
                    {isLoading || reduxLoading ? (
                      <ActivityIndicator color={theme.colors.brown[90]} />
                    ) : (
                      <Text style={styles.loginButtonText}>Login</Text>
                    )}
                  </TouchableOpacity>

                  {/* Biometric Login */}
                  {biometricAvailable && biometricEnabled && (
                    <TouchableOpacity
                      style={styles.biometricButton}
                      onPress={handleBiometricLogin}
                      disabled={isLoading || reduxLoading}
                    >
                      <Ionicons
                        name={biometricType.includes("face") ? "scan-outline" : "finger-print-outline"}
                        size={20}
                        color={theme.colors.brown[30]}
                      />
                      <Text style={styles.biometricButtonText}>
                        Use {biometricType.includes("face") ? "Face ID" : "Fingerprint"}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Divider */}
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  {/* Signup Link */}
                  <View style={styles.signupRow}>
                    <Text style={styles.signupText}>Don't have an account?</Text>
                    <TouchableOpacity
                      onPress={handleSignupPress}
                      disabled={isLoading || reduxLoading}
                    >
                      <Text style={styles.signupLink}>Sign Up</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Security Note */}
                  <View style={styles.securityNote}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={16}
                      color={theme.colors.brown[40]}
                    />
                    <Text style={styles.securityText}>
                      Your connection is secure and encrypted
                    </Text>
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

export default LoginScreenEnterprise;
