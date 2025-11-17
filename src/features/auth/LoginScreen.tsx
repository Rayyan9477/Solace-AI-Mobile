/**
 * Login Screen - User Authentication
 * Responsive design with Freud UI therapeutic theme
 */

import { useAppDispatch, useAppSelector } from "@app/store";
import { secureLogin } from "@app/store/slices/authSlice";
import { MentalHealthIcon } from "@components/icons";
import { FreudLogo } from "@components/icons/FreudIcons";
import { useResponsive } from "@shared/hooks/useResponsive";
import rateLimiter from "@shared/utils/rateLimiter";
import { useTheme } from "@theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import mockAuthService from "@shared/services/mockAuthService";
import tokenService from "@app/services/tokenService";
import secureStorage from "@app/services/secureStorage";
import { GreenCurvedHeader } from "./components/GreenCurvedHeader";
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
import { showAlert } from "@shared/utils/alert";

export const LoginScreen = ({ navigation }: any) => {
  const { theme, isDark } = useTheme();
  const { isWeb, isMobile, getMaxContentWidth } = useResponsive();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => (state as any).auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    loginButton: {
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
    loginButtonText: {
      color: theme.colors.brown[10],
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
      backgroundColor: `rgba(255, 255, 255, 0.1)`,
      borderWidth: 1,
      borderColor: theme.colors.brown[60],
      justifyContent: "center",
      alignItems: "center",
    },
    socialIcon: {
      fontSize: 20,
    },
    footer: {
      alignItems: "center",
      marginTop: 24,
      marginBottom: isWeb ? 0 : 32,
    },
    footerText: {
      fontSize: 14,
      color: theme.colors.brown[30],
    },
    signupButton: {
      marginTop: 4,
    },
    signupText: {
      fontSize: 14,
      color: theme.colors.orange[40],
      fontWeight: "600",
    },
    forgotPassword: {
      alignSelf: "center",
      marginTop: 16,
    },
    forgotPasswordText: {
      color: theme.colors.orange[40],
      fontSize: 14,
      fontWeight: "500",
    },
  });

  const backgroundColors = isDark
    ? [theme.colors.brown[60], theme.colors.brown[70]]
    : [theme.colors.brown[50], theme.colors.brown[60]];

  const validateForm = () => {
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

  const handleLogin = async () => {
    if (!validateForm()) return;

    const rateLimit = await rateLimiter.checkLimit(
      `login:${email.toLowerCase()}`,
      5,
      15 * 60 * 1000,
    );

    if (!rateLimit.allowed) {
      showAlert(
        "Too Many Attempts",
        `You have exceeded the maximum login attempts. Please try again in ${rateLimit.waitTime} seconds.`,
        [{ text: "OK" }],
      );
      return;
    }

    setIsLoading(true);
    try {
      // Use mock auth service to login user
      const response = await mockAuthService.login(email, password);
      
      // Store tokens using token service
      await tokenService.storeTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_in: response.expires_in,
      });
      
      // Store user profile securely
      await secureStorage.storeSecureData("user_profile", response.user, {
        requiresAuthentication: true,
      });
      
      // Manually dispatch auth state (since we're bypassing Redux thunk)
      dispatch({
        type: 'auth/secureLogin/fulfilled',
        payload: {
          user: response.user,
          token: response.access_token,
        },
      });
      
      rateLimiter.reset(`login:${email.toLowerCase()}`);
      showAlert("Success", `Welcome back, ${response.user.name}!`, [{ text: "OK" }]);
    } catch (error: any) {
      showAlert(
        "Login Failed",
        error.message || "Invalid email or password. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsLoading(false);
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
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
                  <Text style={styles.title}>Sign In To freud.ai</Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <View style={styles.inputWrapper}>
                      <MentalHealthIcon
                        name="Mail"
                        size={20}
                        color={theme.colors.brown[30]}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="princesskaguya@gmail.com"
                        placeholderTextColor={theme.colors.brown[60]}
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
                        color={theme.colors.brown[30]}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password..."
                        placeholderTextColor={theme.colors.brown[60]}
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
                          color={theme.colors.brown[30]}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.loginButton,
                      !canLogin && styles.disabledButton,
                    ]}
                    onPress={handleLogin}
                    disabled={!canLogin}
                    accessible
                    accessibilityLabel="Sign in"
                    accessibilityRole="button"
                    accessibilityState={{
                      disabled: !canLogin,
                      busy: isLoading,
                    }}
                    accessibilityHint="Sign in to your account"
                  >
                    <Text style={styles.loginButtonText}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Text>
                    <Text
                      style={{ color: theme.colors.brown[10], fontSize: 18 }}
                    >
                      →
                    </Text>
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
                        onPress={() => navigation.navigate("Signup")}
                      >
                        Sign Up
                      </Text>
                    </Text>
                    <TouchableOpacity
                      style={styles.forgotPassword}
                      onPress={() => navigation.navigate("ForgotPassword")}
                      accessible
                      accessibilityLabel="Forgot password"
                      accessibilityRole="button"
                      accessibilityHint="Navigate to password recovery"
                    >
                      <Text style={styles.forgotPasswordText}>
                        Forgot Password
                      </Text>
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

export default LoginScreen;
