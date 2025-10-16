/**
 * Login Screen - User Authentication
 * Clean and accessible login interface
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
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@app/store';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "@theme/ThemeProvider";
import { secureLogin } from '@app/store/slices/authSlice';

export const LoginScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => (state as any).auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    gradient: {
      flex: 1,
    },
    header: {
      height: 200,
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
      paddingTop: 40,
      paddingHorizontal: 30,
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
      marginBottom: 32,
    },
    inputContainer: {
      marginBottom: 20,
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
    loginButton: {
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
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '600',
    },
    forgotPassword: {
      alignSelf: 'center',
      marginTop: 16,
      padding: 8,
    },
    forgotPasswordText: {
      color: theme.colors.therapeutic.nurturing[600] || '#16a34a',
      fontSize: 16,
      fontWeight: '500',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 32,
    },
    footerText: {
      fontSize: 16,
      color: theme.colors.text.secondary,
    },
    signupButton: {
      padding: 8,
      marginLeft: 4,
    },
    signupButtonText: {
      fontSize: 16,
      color: theme.colors.therapeutic.nurturing[600] || '#16a34a',
      fontWeight: '600',
    },
  });

  const backgroundColors = [
    theme.colors.therapeutic.nurturing[600] || '#16a34a',
    theme.colors.therapeutic.calming[500] || '#0ea5e9',
  ] as const;

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    dispatch((secureLogin as any)({ email, password }));
    // Navigation will be handled by auth state change
    // Loading and error states are managed by the auth slice
  };

  const canLogin = email.trim() && password.trim() && !isLoading;

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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your mental wellness journey
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.text.tertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.text.tertiary}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
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

            <TouchableOpacity
              style={[
                styles.loginButton,
                !canLogin && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={!canLogin}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation?.navigate?.('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => navigation?.navigate?.('Signup')}
              >
                <Text style={styles.signupButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
