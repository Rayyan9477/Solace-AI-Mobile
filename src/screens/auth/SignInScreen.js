import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { FreudLogo, ThemedFreudIcon } from "../../components/icons/FreudIcons";
import FreudButton from "../../components/ui/FreudButton";
import { useTheme } from "../../shared/theme/ThemeContext";

const { width } = Dimensions.get("window");

const SignInScreen = ({ navigation, onSignIn = () => {} }) => {
  const { theme, isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setIsLoading(true);

    // Simulate sign in process
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to main app or handle auth success
      navigation.navigate("Home");
    }, 2000);
  };

  const handleSocialSignIn = (provider) => {
    Alert.alert(
      "Social Sign In",
      `Sign in with ${provider} integration would be implemented here.`,
    );
  };

  const backgroundColors = [
    freudTheme.colors.green[60], // Serenity Green from design reference
    freudTheme.colors.green[50],
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <LinearGradient
          colors={backgroundColors}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Header Curve with Freud Logo */}
          <View style={styles.headerCurve}>
            <FreudLogo size={64} primaryColor="#FFFFFF" />
          </View>

          {/* Content Container */}
          <Animated.View
            style={[
              styles.contentContainer,
              {
                backgroundColor: theme.colors.background.primary,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.formContainer}>
              <Text
                style={[styles.title, { color: theme.colors.text.primary }]}
              >
                Sign In To freud.ai
              </Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Email Address
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      borderColor: emailError
                        ? theme.colors.error[500]
                        : theme.colors.border.primary,
                    },
                  ]}
                >
                  <ThemedFreudIcon
                    name="heart"
                    size={20}
                    color={freudTheme.colors.text.tertiary}
                  />
                  <TextInput
                    style={[
                      styles.textInput,
                      { color: theme.colors.text.primary },
                    ]}
                    placeholder="Enter your email..."
                    placeholderTextColor={theme.colors.text.quaternary}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) setEmailError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                {emailError ? (
                  <View style={styles.errorContainer}>
                    <MentalHealthIcon
                      name="Heart"
                      size={16}
                      color={theme.colors.error[500]}
                      variant="filled"
                    />
                    <Text
                      style={[
                        styles.errorText,
                        { color: theme.colors.error[500] },
                      ]}
                    >
                      Invalid Email Address!!
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Password
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: theme.colors.background.secondary,
                      borderColor: theme.colors.border.primary,
                    },
                  ]}
                >
                  <ThemedFreudIcon
                    name="brain"
                    size={20}
                    color={freudTheme.colors.text.tertiary}
                  />
                  <TextInput
                    style={[
                      styles.textInput,
                      { color: theme.colors.text.primary },
                    ]}
                    placeholder="Enter your password..."
                    placeholderTextColor={theme.colors.text.quaternary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <ThemedFreudIcon
                      name="mindfulness"
                      size={20}
                      color={freudTheme.colors.text.tertiary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign In Button */}
              <FreudButton
                title={isLoading ? "Signing In..." : "Sign In"}
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
                disabled={!email.trim() || !password.trim() || emailError}
                onPress={handleSignIn}
                icon={
                  !isLoading && (
                    <ThemedFreudIcon
                      name="chevron-right"
                      size={20}
                      color={freudTheme.colors.text.inverse}
                    />
                  )
                }
                iconPosition="right"
                style={{
                  marginTop: freudTheme.spacing.xl,
                  marginBottom: freudTheme.spacing["2xl"],
                }}
              />

              {/* Social Sign In */}
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    { backgroundColor: theme.colors.background.secondary },
                  ]}
                  onPress={() => handleSocialSignIn("Facebook")}
                >
                  <Text style={styles.socialButtonText}>f</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    { backgroundColor: theme.colors.background.secondary },
                  ]}
                  onPress={() => handleSocialSignIn("Google")}
                >
                  <Text style={styles.socialButtonText}>G</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    { backgroundColor: theme.colors.background.secondary },
                  ]}
                  onPress={() => handleSocialSignIn("Instagram")}
                >
                  <Text style={styles.socialButtonText}>📷</Text>
                </TouchableOpacity>
              </View>

              {/* Footer Links */}
              <View style={styles.footerLinks}>
                <View style={styles.footerRow}>
                  <Text
                    style={[
                      styles.footerText,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    Don't have an account?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("SignUp")}
                  >
                    <Text style={[styles.linkText, { color: "#FF7043" }]}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.forgotPasswordContainer}
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={[styles.linkText, { color: "#FF7043" }]}>
                    Forgot Password
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  headerCurve: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: freudTheme.typography.fontSize.headingXl,
    fontWeight: freudTheme.typography.fontWeight.bold,
    fontFamily: freudTheme.typography.fontFamily.primary,
    textAlign: "center",
    marginBottom: freudTheme.spacing["4xl"],
    color: freudTheme.colors.text.primary,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: freudTheme.typography.fontSize.textMd,
    fontWeight: freudTheme.typography.fontWeight.medium,
    fontFamily: freudTheme.typography.fontFamily.primary,
    marginBottom: freudTheme.spacing.sm,
    color: freudTheme.colors.text.primary,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    height: 24,
  },
  eyeButton: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "500",
  },
  signInButton: {
    borderRadius: 25,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  signInContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 40,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  socialButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#424242",
  },
  footerLinks: {
    alignItems: "center",
    gap: 16,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  forgotPasswordContainer: {
    paddingVertical: 8,
  },
});

export default SignInScreen;
