/**
 * Signup Screen - User Registration
 * Clean and accessible registration interface
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "@theme/ThemeProvider";

export const SignupScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    gradient: {
      flex: 1,
    },
    header: {
      height: 160,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.shadows.md,
    },
    logoText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.therapeutic.nurturing[600] || '#16a34a',
    },
    content: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingTop: 30,
      paddingHorizontal: 30,
    },
    scrollContent: {
      flexGrow: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text.secondary,
      textAlign: 'center',
      marginBottom: 24,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    inputContainer: {
      marginBottom: 16,
      flex: 1,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: 12,
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text.primary,
      paddingVertical: 0,
    },
    eyeButton: {
      padding: 4,
      marginLeft: 8,
    },
    eyeButtonText: {
      fontSize: 16,
      color: theme.colors.text.tertiary,
    },
    signupButton: {
      backgroundColor: theme.colors.therapeutic.nurturing[600] || '#16a34a',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 24,
      ...theme.shadows.sm,
    },
    disabledButton: {
      opacity: 0.6,
    },
    signupButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 32,
    },
    footerText: {
      fontSize: 16,
      color: theme.colors.text.secondary,
    },
    loginButton: {
      padding: 8,
      marginLeft: 4,
    },
    loginButtonText: {
      fontSize: 16,
      color: theme.colors.therapeutic.nurturing[600] || '#16a34a',
      fontWeight: '600',
    },
    termsText: {
      fontSize: 14,
      color: theme.colors.text.tertiary,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: 16,
    },
    linkText: {
      color: theme.colors.therapeutic.nurturing[600] || '#16a34a',
      fontWeight: '500',
    },
  });

  const backgroundColors = [
    theme.colors.therapeutic.energizing[500] || '#f97316',
    theme.colors.therapeutic.nurturing[600] || '#16a34a',
  ] as const;

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Here you would call your signup API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      Alert.alert(
        'Success',
        'Account created successfully! Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => navigation?.navigate?.('Login'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Signup Failed',
        error.message || 'Failed to create account. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const canSignup = Object.values(formData).every(value => value.trim()) && !isLoading;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient
          colors={backgroundColors}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>SA</Text>
            </View>
          </View>

          <View style={styles.content}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join us on your mental wellness journey
              </Text>

              <View style={styles.row}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formData.firstName}
                      onChangeText={(text) => updateFormData('firstName', text)}
                      placeholder="First name"
                      placeholderTextColor={theme.colors.text.tertiary}
                      autoComplete="given-name"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={formData.lastName}
                      onChangeText={(text) => updateFormData('lastName', text)}
                      placeholder="Last name"
                      placeholderTextColor={theme.colors.text.tertiary}
                      autoComplete="family-name"
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.inputContainer, { flex: undefined }]}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => updateFormData('email', text)}
                    placeholder="Enter your email"
                    placeholderTextColor={theme.colors.text.tertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              <View style={[styles.inputContainer, { flex: undefined }]}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={formData.password}
                    onChangeText={(text) => updateFormData('password', text)}
                    placeholder="Create a password"
                    placeholderTextColor={theme.colors.text.tertiary}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeButtonText}>
                      {showPassword ? '🙈' : '👁️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.inputContainer, { flex: undefined }]}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={formData.confirmPassword}
                    onChangeText={(text) => updateFormData('confirmPassword', text)}
                    placeholder="Confirm your password"
                    placeholderTextColor={theme.colors.text.tertiary}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Text style={styles.eyeButtonText}>
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.signupButton,
                  !canSignup && styles.disabledButton,
                ]}
                onPress={handleSignup}
                disabled={!canSignup}
              >
                <Text style={styles.signupButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Text>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation?.navigate?.('Login')}
                >
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
