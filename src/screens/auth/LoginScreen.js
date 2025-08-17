import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
  StyleSheet,
  Animated,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { MentalHealthIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../store/slices/authSlice";

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("princesskaguya@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Animation refs
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    // Start entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validation
    let hasErrors = false;

    if (!email) {
      setEmailError("Email is required");
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      hasErrors = true;
    }

    if (!password) {
      setPasswordError("Password is required");
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      dispatch(loginStart());

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful login
      const mockUser = {
        id: "1",
        email,
        name: "Princess Kaguya",
        avatar: null,
      };

      const mockToken = "mock_jwt_token_" + Date.now();

      dispatch(loginSuccess({ user: mockUser, token: mockToken }));

      navigation.navigate("MainApp");
    } catch (error) {
      dispatch(loginFailure("Login failed. Please try again."));
      Alert.alert(
        "Login Failed",
        "Please check your credentials and try again.",
      );
    }
  };

  const handleSocialLogin = (provider) => {
    Alert.alert("Social Login", `${provider} login will be implemented soon.`, [
      { text: "OK" },
    ]);
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleSignUp = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Header with gradient */}
      <LinearGradient
        colors={theme.isDark ? ["#4A5D4A", "#90CDB0"] : ["#90CDB0", "#7FCDCD"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          {/* freud.ai Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoGrid}>
              <View
                style={[styles.logoCircle, { backgroundColor: "#FFFFFF" }]}
              />
              <View
                style={[styles.logoCircle, { backgroundColor: "#FFFFFF" }]}
              />
              <View
                style={[styles.logoCircle, { backgroundColor: "#FFFFFF" }]}
              />
              <View
                style={[styles.logoCircle, { backgroundColor: "#FFFFFF" }]}
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View
        style={[
          styles.content,
          { backgroundColor: theme.isDark ? "#2D3748" : "#FFFFFF" },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[
                styles.formContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Title */}
              <Text
                style={[
                  styles.title,
                  { color: theme.isDark ? "#FFFFFF" : "#2D3748" },
                ]}
              >
                Sign In To freud.ai
              </Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: theme.isDark ? "#E2E8F0" : "#4A5568" },
                  ]}
                >
                  Email Address
                </Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <MentalHealthIcon name="brain" size={20} color="#90CDB0" />
                  </View>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.isDark ? "#4A5568" : "#F7FAFC",
                        color: theme.isDark ? "#FFFFFF" : "#2D3748",
                        borderColor: emailError ? "#E53E3E" : "transparent",
                      },
                    ]}
                    placeholder="Enter your email..."
                    placeholderTextColor={theme.isDark ? "#A0AEC0" : "#718096"}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: theme.isDark ? "#E2E8F0" : "#4A5568" },
                  ]}
                >
                  Password
                </Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <MentalHealthIcon name="heart" size={20} color="#90CDB0" />
                  </View>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.isDark ? "#4A5568" : "#F7FAFC",
                        color: theme.isDark ? "#FFFFFF" : "#2D3748",
                        borderColor: passwordError ? "#E53E3E" : "transparent",
                      },
                    ]}
                    placeholder="Enter your password..."
                    placeholderTextColor={theme.isDark ? "#A0AEC0" : "#718096"}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text
                      style={[styles.passwordToggleText, { color: "#90CDB0" }]}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[
                  styles.signInButton,
                  {
                    backgroundColor: theme.isDark ? "#8B4513" : "#8B4513",
                    opacity: isLoading ? 0.6 : 1,
                  },
                ]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.signInButtonText}>
                  {isLoading ? "Signing In..." : "Sign In"} →
                </Text>
              </TouchableOpacity>

              {/* Social Login */}
              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    { backgroundColor: theme.isDark ? "#4A5568" : "#F7FAFC" },
                  ]}
                  onPress={() => handleSocialLogin("Facebook")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialIcon}>f</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    { backgroundColor: theme.isDark ? "#4A5568" : "#F7FAFC" },
                  ]}
                  onPress={() => handleSocialLogin("Google")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialIcon}>G</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.socialButton,
                    { backgroundColor: theme.isDark ? "#4A5568" : "#F7FAFC" },
                  ]}
                  onPress={() => handleSocialLogin("Instagram")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialIcon}>📷</Text>
                </TouchableOpacity>
              </View>

              {/* Footer Links */}
              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleSignUp}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.linkText,
                    { color: theme.isDark ? "#FF8C00" : "#FF8C00" },
                  ]}
                >
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleForgotPassword}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.linkText,
                    { color: theme.isDark ? "#FF8C00" : "#FF8C00" },
                  ]}
                >
                  Forgot Password
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: "center",
    paddingTop: 60,
  },
  logoContainer: {
    marginBottom: 10,
  },
  logoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 44,
    height: 44,
    justifyContent: "space-between",
  },
  logoCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  content: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  textInput: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 48,
    fontSize: 16,
    borderWidth: 1,
  },
  passwordToggle: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  passwordToggleText: {
    fontSize: 16,
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    marginTop: 4,
  },
  signInButton: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: "bold",
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default LoginScreen;
