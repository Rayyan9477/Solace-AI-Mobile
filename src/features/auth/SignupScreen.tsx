/**
 * Signup Screen - User Registration
 * Responsive design with Freud UI therapeutic theme
 */

import { MentalHealthIcon } from "@components/icons";
import { FreudLogo } from "@components/icons/FreudIcons";
import { useResponsive } from "@shared/hooks/useResponsive";
import rateLimiter from "@shared/utils/rateLimiter";
import { useTheme } from "@theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import mockAuthService from "@shared/services/mockAuthService";
import { GreenCurvedHeader } from "./components/GreenCurvedHeader";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { showAlert } from "@shared/utils/alert";

interface SignupScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const SignupScreenComponent = ({ navigation }: SignupScreenProps) => {
  const { theme, isDark } = useTheme();
  const { isWeb, getMaxContentWidth } = useResponsive();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Responsive values
  const maxWidth = getMaxContentWidth();
  const contentMaxWidth = isWeb ? Math.min(maxWidth, 480) : "100%";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? theme.colors.brown[90] : theme.colors.brown[60],
    },
    gradient: {
      flex: 1,
    },
    scrollContainer: {
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
    logoContainer: {
      marginBottom: 24,
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
      paddingBottom: isWeb ? 32 : 0,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: isWeb ? 0 : 32,
    },
    title: {
      fontSize: isWeb ? 28 : 32,
      fontWeight: "700",
      color: theme.colors.brown[10],
      marginBottom: isWeb ? 32 : 40,
      textAlign: "center",
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.brown[20],
      marginBottom: 8,
      letterSpacing: 0.3,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: theme.colors.brown[60],
      borderRadius: 24,
      backgroundColor: isDark
        ? `rgba(${parseInt(theme.colors.brown[100].slice(1, 3), 16)}, ${parseInt(theme.colors.brown[100].slice(3, 5), 16)}, ${parseInt(theme.colors.brown[100].slice(5, 7), 16)}, 0.5)`
        : `rgba(45, 27, 14, 0.5)`,
      paddingHorizontal: 20,
      paddingVertical: 14,
    },
    inputWrapperError: {
      borderColor: theme.colors.orange[40],
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.brown[10],
      paddingVertical: 0,
    },
    eyeButton: {
      padding: 4,
      marginLeft: 8,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.orange[40],
      marginTop: 4,
      marginLeft: 20,
    },
    errorBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${theme.colors.orange[40]}33`,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginTop: 8,
    },
    errorBadgeText: {
      fontSize: 12,
      color: theme.colors.orange[40],
      marginLeft: 6,
    },
    signupButton: {
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
    signupButtonText: {
      color: theme.colors.brown[10],
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
      color: theme.colors.brown[30],
    },
    loginText: {
      fontSize: 14,
      color: theme.colors.orange[40],
      fontWeight: "600",
    },
  });

  const backgroundColors = isDark
    ? [theme.colors.brown[60], theme.colors.brown[70]]
    : [theme.colors.brown[50], theme.colors.brown[60]];

  const validateEmail = (email: string) => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid Email Address!!!");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = useCallback((pwd: string): string[] => {
    const errors: string[] = [];

    if (pwd.length < 12) {
      errors.push("at least 12 characters");
    }
    if (pwd.length > 128) {
      errors.push("less than 128 characters");
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push("one lowercase letter");
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push("one uppercase letter");
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push("one number");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
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
      commonPasswords.some((common) => pwd.toLowerCase().includes(common))
    ) {
      errors.push("cannot contain common words");
    }

    return errors;
  }, []);

  // Validate password on blur
  const handlePasswordBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, password: true }));
    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordError(`Must include: ${errors[0]}`);
    } else {
      setPasswordError("");
    }
  }, [password, validatePassword]);

  // Validate confirm password on blur
  const handleConfirmPasswordBlur = useCallback(() => {
    setTouched(prev => ({ ...prev, confirmPassword: true }));
    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please confirm your password");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);

  const validateForm = () => {
    if (!email.trim()) {
      showAlert("Error", "Please enter your email address", [{ text: "OK" }]);
      return false;
    }
    if (!validateEmail(email)) {
      return false;
    }
    if (!password.trim()) {
      showAlert("Error", "Please enter a password", [{ text: "OK" }]);
      return false;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      showAlert(
        "Password Too Weak",
        `Your password must include:\n• ${passwordErrors.join("\n• ")}`,
        [{ text: "OK" }],
      );
      return false;
    }

    if (password !== confirmPassword) {
      showAlert("Error", "Passwords do not match", [{ text: "OK" }]);
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
      showAlert(
        "Too Many Attempts",
        `You have exceeded the maximum signup attempts. Please try again in ${rateLimit.waitTime} seconds.`,
        [{ text: "OK" }],
      );
      return;
    }

    setIsLoading(true);
    try {
      // Use mock auth service to register user
      const response = await mockAuthService.register(email, password, email.split('@')[0]);
      
      rateLimiter.reset(`signup:${email.toLowerCase()}`);
      
      showAlert("Success", `Account created successfully! Welcome ${response.user.name}!`, [
        {
          text: "OK",
          onPress: () => navigation?.navigate?.("Login"),
        },
      ]);
    } catch (error: any) {
      showAlert(
        "Signup Failed",
        error.message || "Failed to create account. Please try again.",
        [{ text: "OK" }]
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
    !emailError &&
    !passwordError &&
    !confirmPasswordError;

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
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.innerContainer}>
              <View style={styles.contentWrapper}>
                <GreenCurvedHeader height={isWeb ? 180 : 200} />
                <View style={styles.header}>
                  <View style={styles.logoContainer}>
                    <FreudLogo
                      size={isWeb ? 56 : 64}
                      primaryColor={theme.colors.brown[10]}
                    />
                  </View>
                </View>

                <View style={styles.content}>
                  <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
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
                          color={theme.colors.brown[30]}
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
                          placeholderTextColor={theme.colors.brown[60]}
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
                            color={theme.colors.orange[40]}
                          />
                          <Text style={styles.errorBadgeText}>
                            {emailError}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <View style={[
                        styles.inputWrapper,
                        touched.password && passwordError && styles.inputWrapperError,
                      ]}>
                        <MentalHealthIcon
                          name="Lock"
                          size={20}
                          color={theme.colors.brown[30]}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={styles.input}
                          value={password}
                          onChangeText={(text) => {
                            setPassword(text);
                            if (touched.password && text.trim()) {
                              const errors = validatePassword(text);
                              setPasswordError(errors.length > 0 ? `Must include: ${errors[0]}` : "");
                            }
                          }}
                          onBlur={handlePasswordBlur}
                          placeholder="Enter your password..."
                          placeholderTextColor={theme.colors.brown[60]}
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
                            color={theme.colors.brown[30]}
                          />
                        </TouchableOpacity>
                      </View>
                      {touched.password && passwordError ? (
                        <View style={styles.errorBadge}>
                          <MentalHealthIcon
                            name="AlertCircle"
                            size={14}
                            color={theme.colors.orange[40]}
                          />
                          <Text style={styles.errorBadgeText}>
                            {passwordError}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>
                        Password Confirmation
                      </Text>
                      <View style={[
                        styles.inputWrapper,
                        touched.confirmPassword && confirmPasswordError && styles.inputWrapperError,
                      ]}>
                        <MentalHealthIcon
                          name="Lock"
                          size={20}
                          color={theme.colors.brown[30]}
                          style={styles.inputIcon}
                        />
                        <TextInput
                          style={styles.input}
                          value={confirmPassword}
                          onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (touched.confirmPassword && text.trim()) {
                              setConfirmPasswordError(
                                password !== text ? "Passwords do not match" : ""
                              );
                            }
                          }}
                          onBlur={handleConfirmPasswordBlur}
                          placeholder="Confirm your password..."
                          placeholderTextColor={theme.colors.brown[60]}
                          secureTextEntry={!showConfirmPassword}
                          autoComplete="new-password"
                        />
                        <TouchableOpacity
                          style={styles.eyeButton}
                          onPress={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
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
                            color={theme.colors.brown[30]}
                          />
                        </TouchableOpacity>
                      </View>
                      {touched.confirmPassword && confirmPasswordError ? (
                        <View style={styles.errorBadge}>
                          <MentalHealthIcon
                            name="AlertCircle"
                            size={14}
                            color={theme.colors.orange[40]}
                          />
                          <Text style={styles.errorBadgeText}>
                            {confirmPasswordError}
                          </Text>
                        </View>
                      ) : null}
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
                      accessibilityState={{
                        disabled: !canSignup,
                        busy: isLoading,
                      }}
                      accessibilityHint="Create a new account"
                    >
                      <Text style={styles.signupButtonText}>
                        {isLoading ? "Creating Account..." : "Sign Up"}
                      </Text>
                      <Text
                        style={{ color: theme.colors.brown[10], fontSize: 18 }}
                      >
                        →
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                      <Text style={styles.footerText}>
                        Already have an account?{" "}
                        <Text
                          style={styles.loginText}
                          onPress={() => navigation.navigate("Login")}
                        >
                          Sign In
                        </Text>
                      </Text>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


export const SignupScreen = (props: SignupScreenProps) => (
  <ScreenErrorBoundary screenName="Signup">
    <SignupScreenComponent {...props} />
  </ScreenErrorBoundary>
);

export default SignupScreen;
