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
import { FreudLogo, ThemedFreudIcon } from "../../components/icons/FreudIcons";
import FreudButton from "../../components/ui/FreudButton";
import { useTheme } from "../../shared/theme/ThemeContext";
import { freudTheme } from "../../shared/theme/freudTheme";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../store/slices/authSlice";

const RegisterScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);

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

  useEffect(() => {
    // Real-time email validation
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setIsEmailValid(emailRegex.test(email));
      if (!emailRegex.test(email)) {
        setEmailError("Invalid Email Address!!!");
      } else {
        setEmailError("");
      }
    } else {
      setIsEmailValid(false);
      setEmailError("");
    }
  }, [email]);

  const validateForm = () => {
    let hasErrors = false;

    // Email validation
    if (!email) {
      setEmailError("Email is required");
      hasErrors = true;
    } else if (!isEmailValid) {
      setEmailError("Invalid Email Address!!!");
      hasErrors = true;
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasErrors = true;
    }

    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasErrors = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      hasErrors = true;
    }

    return !hasErrors;
  };

  const handleRegister = async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!validateForm()) return;

    try {
      dispatch(registerStart());

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful registration
      const mockUser = {
        id: "1",
        email,
        name: email.split("@")[0],
        avatar: null,
      };

      const mockToken = "mock_jwt_token_" + Date.now();

      dispatch(registerSuccess({ user: mockUser, token: mockToken }));

      Alert.alert("Success!", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("MainApp"),
        },
      ]);
    } catch (error) {
      dispatch(registerFailure("Registration failed. Please try again."));
      Alert.alert("Registration Failed", "Please try again.");
    }
  };

  const handleSocialRegister = (provider) => {
    Alert.alert(
      "Social Registration",
      `${provider} registration will be implemented soon.`,
      [{ text: "OK" }],
    );
  };

  const handleSignIn = () => {
    navigation.navigate("Login");
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
        colors={[freudTheme.colors.green[60], freudTheme.colors.green[50]]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          {/* freud.ai Logo */}
          <FreudLogo size={64} primaryColor="#FFFFFF" />
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
                Sign Up For Free
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
                    <ThemedFreudIcon name="heart" size={20} color={freudTheme.colors.green[60]} />
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
                  <View style={styles.errorContainer}>
                    <View style={styles.errorIcon}>
                      <Text style={styles.errorIconText}>⚠️</Text>
                    </View>
                    <Text style={styles.errorText}>{emailError}</Text>
                  </View>
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
                    <ThemedFreudIcon name="brain" size={20} color={freudTheme.colors.green[60]} />
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
                  <View style={styles.errorContainer}>
                    <View style={styles.errorIcon}>
                      <Text style={styles.errorIconText}>⚠️</Text>
                    </View>
                    <Text style={styles.errorText}>{passwordError}</Text>
                  </View>
                ) : null}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text
                  style={[
                    styles.inputLabel,
                    { color: theme.isDark ? "#E2E8F0" : "#4A5568" },
                  ]}
                >
                  Password Confirmation
                </Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <ThemedFreudIcon name="mindfulness" size={20} color={freudTheme.colors.green[60]} />
                  </View>
                  <TextInput
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: theme.isDark ? "#4A5568" : "#F7FAFC",
                        color: theme.isDark ? "#FFFFFF" : "#2D3748",
                        borderColor: confirmPasswordError
                          ? "#E53E3E"
                          : "transparent",
                      },
                    ]}
                    placeholder="Confirm your password..."
                    placeholderTextColor={theme.isDark ? "#A0AEC0" : "#718096"}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.passwordToggle}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Text
                      style={[styles.passwordToggleText, { color: "#90CDB0" }]}
                    >
                      {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <View style={styles.errorContainer}>
                    <View style={styles.errorIcon}>
                      <Text style={styles.errorIconText}>⚠️</Text>
                    </View>
                    <Text style={styles.errorText}>{confirmPasswordError}</Text>
                  </View>
                ) : null}
              </View>

              {/* Sign Up Button */}
              <FreudButton
                title={isLoading ? "Creating Account..." : "Sign Up"}
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                onPress={handleRegister}
                icon={!isLoading && <ThemedFreudIcon name="chevron-right" size={20} color={freudTheme.colors.text.inverse} />}
                iconPosition="right"
                style={{ marginTop: freudTheme.spacing.sm, marginBottom: freudTheme.spacing.xl }}
              />

              {/* Footer Links */}
              <FreudButton
                title="Already have an account? Sign In"
                variant="outline"
                size="medium"
                fullWidth
                onPress={handleSignIn}
                style={{ borderColor: freudTheme.colors.brown[80] }}
                textStyle={{ color: freudTheme.colors.brown[80] }}
              />
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
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FED7D7",
    borderRadius: 8,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorIconText: {
    fontSize: 16,
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    flex: 1,
  },
  signUpButton: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
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

export default RegisterScreen;
