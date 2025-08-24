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

const DarkForgotPasswordScreen = ({ navigation, onResetPassword = () => {} }) => {
  const { isDarkMode } = useTheme();
  const [resetMethod, setResetMethod] = useState('email'); // 'email', '2fa', 'password', 'google'
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationSent, setShowVerificationSent] = useState(false);

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

  const handleSendReset = async () => {
    if (resetMethod === 'email') {
      if (!email.trim()) {
        Alert.alert("Error", "Email is required");
        return;
      }
      
      if (!validateEmail(email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowVerificationSent(true);
    } catch (error) {
      Alert.alert("Error", "Failed to send reset code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert("Success", "Verification code resent!");
    } catch (error) {
      Alert.alert("Error", "Failed to resend code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    navigation.goBack();
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const renderResetOption = (method, icon, title, isSelected) => {
    const iconColors = {
      '2fa': '#27AE60',
      'password': '#8B9F6F',
      'google': '#27AE60',
    };

    return (
      <TouchableOpacity
        key={method}
        style={[
          styles.resetOption,
          isSelected && styles.resetOptionSelected
        ]}
        onPress={() => setResetMethod(method)}
      >
        <View style={[
          styles.resetOptionIcon,
          { backgroundColor: iconColors[method] || freudDarkTheme.colors.accent.primary }
        ]}>
          <Text style={styles.resetOptionIconText}>{icon}</Text>
        </View>
        <Text style={[
          styles.resetOptionText,
          isSelected && styles.resetOptionTextSelected
        ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  if (showVerificationSent) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        {/* Main Content */}
        <View style={styles.verificationContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <LinearGradient
              colors={['#F39C12', '#E67E22']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.illustrationGradient}
            >
              <View style={styles.safeIcon}>
                <Text style={styles.safeIconText}>🔐</Text>
              </View>
              <View style={styles.keypadContainer}>
                <View style={styles.keypadRow}>
                  <View style={styles.keypadKey}><Text style={styles.keypadText}>1</Text></View>
                  <View style={styles.keypadKey}><Text style={styles.keypadText}>2</Text></View>
                  <View style={styles.keypadKey}><Text style={styles.keypadText}>3</Text></View>
                </View>
                <View style={styles.keypadRow}>
                  <View style={styles.keypadKey}><Text style={styles.keypadText}>4</Text></View>
                  <View style={styles.keypadKey}><Text style={styles.keypadText}>5</Text></View>
                  <View style={styles.keypadKey}><Text style={styles.keypadText}>6</Text></View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Content */}
          <View style={styles.verificationTextContainer}>
            <Text style={styles.verificationTitle}>
              We've Sent Verification Code to ••••••••••••24
            </Text>
            <Text style={styles.verificationSubtitle}>
              Didn't receive the link? Then re-send the password below 🔑
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.verificationButtonContainer}>
            <TouchableOpacity
              style={[styles.resendButton, isLoading && styles.buttonDisabled]}
              onPress={handleResendCode}
              disabled={isLoading}
            >
              <Text style={styles.resendButtonText}>
                {isLoading ? "Sending..." : "Re-Send Password"} 🔄
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sendPasswordButton}
              onPress={() => Alert.alert("Info", "Check your email for reset instructions")}
            >
              <Text style={styles.sendPasswordButtonText}>
                Send Password 🚀
              </Text>
            </TouchableOpacity>
          </View>

          {/* Home Indicator */}
          <View style={styles.bottomIndicator}>
            <View style={styles.homeIndicator} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackToSignIn}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      {/* Main Content */}
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
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>
                Select contact details where you want to reset your password
              </Text>

              {/* Reset Options */}
              <View style={styles.resetOptionsContainer}>
                {renderResetOption('2fa', '🔐', 'Use 2FA', resetMethod === '2fa')}
                {renderResetOption('password', '🔓', 'Password', resetMethod === 'password')}
                {renderResetOption('google', '🔒', 'Google Authenticator', resetMethod === 'google')}
              </View>

              {/* Email Input (only for email method) */}
              {resetMethod === 'email' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIcon}>
                      <Text style={styles.inputIconText}>@</Text>
                    </View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your email address"
                      placeholderTextColor={freudDarkTheme.colors.text.placeholder}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>
              )}

              {/* Send Password Button */}
              <TouchableOpacity
                style={[styles.sendButton, isLoading && styles.buttonDisabled]}
                onPress={handleSendReset}
                disabled={isLoading}
              >
                <Text style={styles.sendButtonText}>
                  {isLoading ? "Sending..." : "Send Password"} 🔒
                </Text>
              </TouchableOpacity>
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
  
  // Navigation
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: freudDarkTheme.colors.card.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    ...freudDarkTheme.shadows.sm,
  },
  backButtonText: {
    fontSize: 20,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },

  // Main content
  mainContent: {
    flex: 1,
    paddingTop: 120,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: freudDarkTheme.spacing[6],
  },
  formContainer: {
    paddingTop: freudDarkTheme.spacing[4],
  },

  // Title
  title: {
    fontSize: freudDarkTheme.typography.sizes["3xl"],
    fontWeight: freudDarkTheme.typography.weights.bold,
    color: freudDarkTheme.colors.text.primary,
    textAlign: "center",
    marginBottom: freudDarkTheme.spacing[4],
  },
  subtitle: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: "center",
    marginBottom: freudDarkTheme.spacing[8],
    lineHeight: freudDarkTheme.typography.sizes.base * 1.4,
    paddingHorizontal: freudDarkTheme.spacing[4],
  },

  // Reset options
  resetOptionsContainer: {
    marginBottom: freudDarkTheme.spacing[8],
  },
  resetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    padding: freudDarkTheme.spacing[4],
    marginBottom: freudDarkTheme.spacing[4],
    borderWidth: 2,
    borderColor: 'transparent',
    ...freudDarkTheme.shadows.sm,
  },
  resetOptionSelected: {
    borderColor: freudDarkTheme.colors.accent.primary,
    backgroundColor: `${freudDarkTheme.colors.accent.primary}10`,
  },
  resetOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: freudDarkTheme.spacing[4],
  },
  resetOptionIconText: {
    fontSize: 24,
  },
  resetOptionText: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    fontWeight: freudDarkTheme.typography.weights.medium,
    color: freudDarkTheme.colors.text.primary,
    flex: 1,
  },
  resetOptionTextSelected: {
    color: freudDarkTheme.colors.accent.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
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

  // Button styles
  sendButton: {
    backgroundColor: freudDarkTheme.colors.button.primary.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    paddingVertical: freudDarkTheme.spacing[4],
    alignItems: 'center',
    marginTop: freudDarkTheme.spacing[4],
    ...freudDarkTheme.shadows.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    color: freudDarkTheme.colors.button.primary.text,
  },

  // Verification screen styles
  verificationContent: {
    flex: 1,
    backgroundColor: freudDarkTheme.colors.background.primary,
    paddingHorizontal: freudDarkTheme.spacing[6],
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: freudDarkTheme.colors.card.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    ...freudDarkTheme.shadows.sm,
  },
  closeButtonText: {
    fontSize: 18,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },
  
  // Illustration
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 120,
    marginBottom: freudDarkTheme.spacing[8],
  },
  illustrationGradient: {
    width: 200,
    height: 250,
    borderRadius: freudDarkTheme.borderRadius["2xl"],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  safeIcon: {
    position: 'absolute',
    top: 30,
  },
  safeIconText: {
    fontSize: 60,
  },
  keypadContainer: {
    marginTop: 80,
  },
  keypadRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  keypadKey: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  keypadText: {
    color: '#FFFFFF',
    fontWeight: freudDarkTheme.typography.weights.bold,
    fontSize: 12,
  },

  // Verification text
  verificationTextContainer: {
    alignItems: 'center',
    marginBottom: freudDarkTheme.spacing[8],
  },
  verificationTitle: {
    fontSize: freudDarkTheme.typography.sizes["2xl"],
    fontWeight: freudDarkTheme.typography.weights.bold,
    color: freudDarkTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: freudDarkTheme.spacing[4],
    paddingHorizontal: freudDarkTheme.spacing[4],
  },
  verificationSubtitle: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: freudDarkTheme.typography.sizes.base * 1.4,
    paddingHorizontal: freudDarkTheme.spacing[4],
  },

  // Verification buttons
  verificationButtonContainer: {
    marginBottom: freudDarkTheme.spacing[8],
  },
  resendButton: {
    backgroundColor: freudDarkTheme.colors.button.primary.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    paddingVertical: freudDarkTheme.spacing[4],
    alignItems: 'center',
    marginBottom: freudDarkTheme.spacing[4],
    ...freudDarkTheme.shadows.md,
  },
  resendButtonText: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    color: freudDarkTheme.colors.button.primary.text,
  },
  sendPasswordButton: {
    backgroundColor: freudDarkTheme.colors.card.background,
    borderRadius: freudDarkTheme.borderRadius.lg,
    paddingVertical: freudDarkTheme.spacing[4],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: freudDarkTheme.colors.border.primary,
  },
  sendPasswordButtonText: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    color: freudDarkTheme.colors.text.primary,
  },

  // Bottom indicator
  bottomIndicator: {
    alignItems: 'center',
    paddingBottom: freudDarkTheme.spacing[6],
    marginTop: 'auto',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: `${freudDarkTheme.colors.text.primary}40`,
    borderRadius: freudDarkTheme.borderRadius.full,
  },
});

export default DarkForgotPasswordScreen;