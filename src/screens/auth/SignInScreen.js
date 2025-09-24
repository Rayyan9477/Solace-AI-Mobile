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
import { useDispatch, useSelector } from "react-redux";

import { useTheme } from "../../design-system/theme/ThemeProvider";
// import { MentalHealthIcon, NavigationIcon } from "../../components/icons"; // Temporarily disabled
import { secureLogin } from "../../store/slices/authSlice";

const { width } = Dimensions.get("window");

const SignInScreen = ({ navigation, onSignIn = () => {} }) => {
  const { theme, isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const { isLoading, error } = authState;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      const result = await dispatch(secureLogin({ email, password }));
      if (secureLogin.fulfilled.match(result)) {
        // Navigation will be handled by AppNavigator based on auth state
        console.log("✅ Login successful");
      } else {
        Alert.alert("Login Failed", result.payload || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Login Error", "An unexpected error occurred");
    }
  };

  const handleSocialSignIn = (provider) => {
    Alert.alert(
      "Social Sign In",
      `Sign in with ${provider} integration would be implemented here.`,
    );
  };

  const backgroundColors = [
    theme.palette.therapeutic.growth, // Growth green from design system
    theme.palette.secondary[400],
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
          {/* Header Curve with Logo */}
          <View style={styles.headerCurve}>
            <View style={[styles.logoContainer, { backgroundColor: theme.colors.background.primary }]}>
              <Text style={styles.logoText}>Solace AI</Text>
            </View>
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
                Sign In To Solace AI
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
                  <Text style={{ fontSize: 18 }}>📧</Text>
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
                    <Text style={{ fontSize: 16, color: theme.colors.error[500] }}>⚠️</Text>
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
                  <Text style={{ fontSize: 18 }}>🔒</Text>
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
                    <Text style={{ fontSize: 18 }}>{showPassword ? "🙈" : "👁️"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[
                  styles.signInButton,
                  { 
                    backgroundColor: theme.palette.primary[500],
                    opacity: (!email.trim() || !password.trim() || emailError) ? 0.5 : 1,
                  }
                ]}
                onPress={handleSignIn}
                disabled={!email.trim() || !password.trim() || emailError || isLoading}
              >
                <View style={styles.signInContent}>
                  <Text style={styles.signInButtonText}>
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Text>
                  {!isLoading && (
                    <Text style={{ fontSize: 20, color: "#FFFFFF" }}>→</Text>
                  )}
                </View>
              </TouchableOpacity>

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
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0ea5e9",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
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
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
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
    color: "#FFFFFF",
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
