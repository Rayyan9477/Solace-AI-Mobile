import React, { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";

import { FreudLogo } from "../../components/icons/FreudIcons";
import { useTheme } from "../../shared/theme/ThemeContext";
import { freudDarkTheme } from "../../shared/theme/freudDarkTheme";

const DarkSignUpScreen = ({ navigation, onSignUp = () => {} }) => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
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

  const handleEmailChange = (text) => {
    setEmail(text);
    if (emailError && validateEmail(text)) {
      setEmailError("");
    }
  };

  const handleSignUp = async () => {
    // Validate inputs
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError("Invalid Email Address!!!");
      return;
    }
    
    if (!password.trim()) {
      Alert.alert("Error", "Password is required");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSignUp({ email, password });
    } catch (error) {
      Alert.alert("Error", "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    navigation.navigate('DarkSignIn');
  };

  const handleSocialSignUp = (provider) => {
    Alert.alert("Social Sign Up", `${provider} sign up not implemented yet`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header Gradient - Green like design */}
      <LinearGradient
        colors={freudDarkTheme.colors.header.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.logoContainer}>
          <FreudLogo size={48} primaryColor="#FFFFFF" />
        </View>
      </LinearGradient>

      {/* Main Content - Dark Brown Background */}
      <View style={styles.mainContent}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
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
              <Text style={styles.title}>Sign Up For Free</Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={[
                  styles.inputWrapper,
                  emailError ? styles.inputError : null
                ]}>
                  <View style={styles.inputIcon}>
                    <Text style={styles.inputIconText}>@</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email..."
                    placeholderTextColor={freudDarkTheme.colors.text.placeholder}
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {emailError && (
                  <View style={styles.errorContainer}>
                    <View style={styles.errorIcon}>
                      <Text style={styles.errorIconText}>⚠️</Text>
                    </View>
                    <Text style={styles.errorText}>{emailError}</Text>
                  </View>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Text style={styles.inputIconText}>🔒</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your password..."
                    placeholderTextColor={freudDarkTheme.colors.text.placeholder}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeIconText}>
                      {showPassword ? "👁️" : "🙈"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password Confirmation Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password Confirmation</Text>
                <View style={styles.inputWrapper}>
                  <View style={styles.inputIcon}>
                    <Text style={styles.inputIconText}>🔒</Text>
                  </View>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your password..."
                    placeholderTextColor={freudDarkTheme.colors.text.placeholder}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Text style={styles.eyeIconText}>
                      {showConfirmPassword ? "👁️" : "🙈"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={isLoading}
              >
                <Text style={styles.signUpButtonText}>
                  {isLoading ? "Creating Account..." : "Sign Up"} →
                </Text>
              </TouchableOpacity>

              {/* Footer Links */}
              <View style={styles.footerContainer}>
                <TouchableOpacity onPress={handleSignIn}>
                  <Text style={styles.footerText}>
                    Already have an account?{" "}
                    <Text style={styles.linkText}>Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Home Indicator */}
        <View style={styles.bottomIndicator}>
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: freudDarkTheme.colors.background.primary,
  },
  
  // Header
  headerGradient: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    marginTop: 40,
  },

  // Main content
  mainContent: {
    flex: 1,
    backgroundColor: freudDarkTheme.colors.background.primary,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: freudDarkTheme.spacing[6],
  },
  formContainer: {
    paddingTop: freudDarkTheme.spacing[10],
  },

  // Title
  title: {
    fontSize: freudDarkTheme.typography.sizes["3xl"],
    fontWeight: freudDarkTheme.typography.weights.bold,
    color: freudDarkTheme.colors.text.primary,
    textAlign: "center",
    marginBottom: freudDarkTheme.spacing[8],
  },

  // Input styles
  inputContainer: {
    marginBottom: freudDarkTheme.spacing[6],
  },
  inputLabel: {
    fontSize: freudDarkTheme.typography.sizes.base,
    fontWeight: freudDarkTheme.typography.weights.medium,
    color: freudDarkTheme.colors.text.primary,
    marginBottom: freudDarkTheme.spacing[2],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: freudDarkTheme.colors.input.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: freudDarkTheme.colors.input.border,
    paddingHorizontal: freudDarkTheme.spacing[4],
    height: 56,
  },
  inputError: {
    borderColor: freudDarkTheme.colors.status.error,
  },
  inputIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: freudDarkTheme.spacing[3],
  },
  inputIconText: {
    fontSize: 16,
    color: freudDarkTheme.colors.text.tertiary,
  },
  textInput: {
    flex: 1,
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.input.text,
    fontWeight: freudDarkTheme.typography.weights.normal,
  },
  eyeIcon: {
    width: 24,
    alignItems: 'center',
  },
  eyeIconText: {
    fontSize: 16,
  },

  // Error styles
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: freudDarkTheme.spacing[2],
    backgroundColor: '#E74C3C20',
    paddingHorizontal: freudDarkTheme.spacing[4],
    paddingVertical: freudDarkTheme.spacing[2],
    borderRadius: freudDarkTheme.borderRadius.md,
  },
  errorIcon: {
    marginRight: freudDarkTheme.spacing[2],
  },
  errorIconText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.status.error,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },

  // Button styles
  signUpButton: {
    backgroundColor: freudDarkTheme.colors.button.primary.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    paddingVertical: freudDarkTheme.spacing[4],
    alignItems: 'center',
    marginTop: freudDarkTheme.spacing[4],
    marginBottom: freudDarkTheme.spacing[8],
    ...freudDarkTheme.shadows.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    color: freudDarkTheme.colors.button.primary.text,
  },

  // Footer
  footerContainer: {
    alignItems: 'center',
    paddingBottom: freudDarkTheme.spacing[8],
  },
  footerText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.secondary,
    marginBottom: freudDarkTheme.spacing[4],
  },
  linkText: {
    color: freudDarkTheme.colors.accent.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },

  // Bottom indicator
  bottomIndicator: {
    alignItems: 'center',
    paddingBottom: freudDarkTheme.spacing[6],
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: `${freudDarkTheme.colors.text.primary}40`,
    borderRadius: freudDarkTheme.borderRadius.full,
  },
});

export default DarkSignUpScreen;