import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { MentalHealthIcon } from '../../components/icons';

const ForgotPasswordScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [currentStep, setCurrentStep] = useState(1); // 1: select method, 2: verify code, 3: success
  const [selectedMethod, setSelectedMethod] = useState('password'); // 'password', '2fa', 'google'
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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
  }, [currentStep]);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleSendCode = async () => {
    if (selectedMethod === 'password' && !email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (selectedMethod === 'password') {
        setCurrentStep(2);
      } else {
        Alert.alert(
          'Feature Coming Soon',
          'This reset method will be available soon.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit verification code');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentStep(3);
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    Alert.alert(
      'Code Sent',
      'A new verification code has been sent to your email.',
      [{ text: 'OK' }]
    );
  };

  const renderMethodSelection = () => (
    <Animated.View 
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <Text style={[styles.title, { color: theme.isDark ? '#FFFFFF' : '#2D3748' }]}>
        Forgot Password
      </Text>
      <Text style={[styles.subtitle, { color: theme.isDark ? '#B2BEB5' : '#636E72' }]}>
        Select contact details where you want to reset your password.
      </Text>

      {/* Password Reset Option */}
      <TouchableOpacity
        style={[
          styles.methodOption,
          {
            backgroundColor: theme.isDark ? '#4A5568' : '#F7FAFC',
            borderColor: selectedMethod === 'password' ? '#90CDB0' : 'transparent',
          }
        ]}
        onPress={() => handleMethodSelect('password')}
        activeOpacity={0.8}
      >
        <View style={[styles.methodIcon, { backgroundColor: '#90CDB0' }]}>
          <MentalHealthIcon name="heart" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.methodContent}>
          <Text style={[styles.methodTitle, { color: theme.isDark ? '#FFFFFF' : '#2D3748' }]}>
            Password
          </Text>
          <Text style={[styles.methodDescription, { color: theme.isDark ? '#B2BEB5' : '#636E72' }]}>
            Reset via email
          </Text>
        </View>
        <View style={[
          styles.methodRadio,
          {
            backgroundColor: selectedMethod === 'password' ? '#90CDB0' : 'transparent',
            borderColor: selectedMethod === 'password' ? '#90CDB0' : '#CBD5E0',
          }
        ]}>
          {selectedMethod === 'password' && (
            <View style={styles.methodRadioInner} />
          )}
        </View>
      </TouchableOpacity>

      {/* 2FA Option */}
      <TouchableOpacity
        style={[
          styles.methodOption,
          {
            backgroundColor: theme.isDark ? '#4A5568' : '#F7FAFC',
            borderColor: selectedMethod === '2fa' ? '#90CDB0' : 'transparent',
          }
        ]}
        onPress={() => handleMethodSelect('2fa')}
        activeOpacity={0.8}
      >
        <View style={[styles.methodIcon, { backgroundColor: '#90CDB0' }]}>
          <Text style={styles.methodIconText}>🔒</Text>
        </View>
        <View style={styles.methodContent}>
          <Text style={[styles.methodTitle, { color: theme.isDark ? '#FFFFFF' : '#2D3748' }]}>
            Use 2FA
          </Text>
          <Text style={[styles.methodDescription, { color: theme.isDark ? '#B2BEB5' : '#636E72' }]}>
            Two-factor authentication
          </Text>
        </View>
        <View style={[
          styles.methodRadio,
          {
            backgroundColor: selectedMethod === '2fa' ? '#90CDB0' : 'transparent',
            borderColor: selectedMethod === '2fa' ? '#90CDB0' : '#CBD5E0',
          }
        ]}>
          {selectedMethod === '2fa' && (
            <View style={styles.methodRadioInner} />
          )}
        </View>
      </TouchableOpacity>

      {/* Google Authenticator Option */}
      <TouchableOpacity
        style={[
          styles.methodOption,
          {
            backgroundColor: theme.isDark ? '#4A5568' : '#F7FAFC',
            borderColor: selectedMethod === 'google' ? '#90CDB0' : 'transparent',
          }
        ]}
        onPress={() => handleMethodSelect('google')}
        activeOpacity={0.8}
      >
        <View style={[styles.methodIcon, { backgroundColor: '#90CDB0' }]}>
          <Text style={styles.methodIconText}>🔐</Text>
        </View>
        <View style={styles.methodContent}>
          <Text style={[styles.methodTitle, { color: theme.isDark ? '#FFFFFF' : '#2D3748' }]}>
            Google Authenticator
          </Text>
          <Text style={[styles.methodDescription, { color: theme.isDark ? '#B2BEB5' : '#636E72' }]}>
            Use authenticator app
          </Text>
        </View>
        <View style={[
          styles.methodRadio,
          {
            backgroundColor: selectedMethod === 'google' ? '#90CDB0' : 'transparent',
            borderColor: selectedMethod === 'google' ? '#90CDB0' : '#CBD5E0',
          }
        ]}>
          {selectedMethod === 'google' && (
            <View style={styles.methodRadioInner} />
          )}
        </View>
      </TouchableOpacity>

      {/* Email Input for Password Reset */}
      {selectedMethod === 'password' && (
        <View style={styles.emailInputContainer}>
          <Text style={[styles.inputLabel, { color: theme.isDark ? '#E2E8F0' : '#4A5568' }]}>
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
                  backgroundColor: theme.isDark ? '#4A5568' : '#F7FAFC',
                  color: theme.isDark ? '#FFFFFF' : '#2D3748',
                }
              ]}
              placeholder="Enter your email..."
              placeholderTextColor={theme.isDark ? '#A0AEC0' : '#718096'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.sendButton,
          { 
            backgroundColor: theme.isDark ? '#8B4513' : '#8B4513',
            opacity: isLoading ? 0.6 : 1 
          }
        ]}
        onPress={handleSendCode}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.sendButtonText}>
          {isLoading ? 'Sending...' : 'Send Password'} 🔐
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderVerificationStep = () => (
    <Animated.View 
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <View style={styles.verificationHeader}>
        <View style={[styles.verificationIcon, { backgroundColor: '#FFA500' }]}>
          <Text style={styles.verificationIconText}>🔐</Text>
        </View>
        <Text style={[styles.title, { color: theme.isDark ? '#FFFFFF' : '#2D3748' }]}>
          We've Sent Verification Code to ****-****-***24
        </Text>
        <Text style={[styles.subtitle, { color: theme.isDark ? '#B2BEB5' : '#636E72' }]}>
          Didn't receive the link? Then re-send the password below 🔥
        </Text>
      </View>

      <View style={styles.codeInputContainer}>
        <Text style={[styles.inputLabel, { color: theme.isDark ? '#E2E8F0' : '#4A5568' }]}>
          Verification Code
        </Text>
        <TextInput
          style={[
            styles.codeInput,
            {
              backgroundColor: theme.isDark ? '#4A5568' : '#F7FAFC',
              color: theme.isDark ? '#FFFFFF' : '#2D3748',
            }
          ]}
          placeholder="Enter 6-digit code"
          placeholderTextColor={theme.isDark ? '#A0AEC0' : '#718096'}
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          maxLength={6}
          textAlign="center"
        />
      </View>

      <TouchableOpacity
        style={[
          styles.verifyButton,
          { 
            backgroundColor: theme.isDark ? '#8B4513' : '#8B4513',
            opacity: isLoading ? 0.6 : 1 
          }
        ]}
        onPress={handleVerifyCode}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.verifyButtonText}>
          {isLoading ? 'Verifying...' : 'Re-Send Password'} 🔐
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resendButton}
        onPress={handleResendCode}
        activeOpacity={0.8}
      >
        <Text style={[styles.resendButtonText, { color: theme.isDark ? '#FF8C00' : '#FF8C00' }]}>
          Send Password
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderSuccessStep = () => (
    <Animated.View 
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <View style={styles.successHeader}>
        <View style={[styles.successIcon, { backgroundColor: '#4CAF50' }]}>
          <Text style={styles.successIconText}>✓</Text>
        </View>
        <Text style={[styles.title, { color: theme.isDark ? '#FFFFFF' : '#2D3748' }]}>
          Password Reset Successful!
        </Text>
        <Text style={[styles.subtitle, { color: theme.isDark ? '#B2BEB5' : '#636E72' }]}>
          Your password has been reset successfully. You can now sign in with your new password.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.successButton, { backgroundColor: theme.isDark ? '#8B4513' : '#8B4513' }]}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.8}
      >
        <Text style={styles.successButtonText}>
          Back to Sign In
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={theme.isDark ? ['#4A4A4A', '#8B4513'] : ['#F7FAFC', '#E2E8F0']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={[styles.backIcon, { color: theme.isDark ? '#FFFFFF' : '#2D3748' }]}>←</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View style={[styles.content, { backgroundColor: theme.isDark ? '#2D3748' : '#FFFFFF' }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {currentStep === 1 && renderMethodSelection()}
            {currentStep === 2 && renderVerificationStep()}
            {currentStep === 3 && renderSuccessStep()}
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
    height: 120,
    justifyContent: 'center',
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
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
  stepContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodIconText: {
    fontSize: 20,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
  },
  methodRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  emailInputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  textInput: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 48,
    fontSize: 16,
  },
  sendButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  verificationHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  verificationIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  verificationIconText: {
    fontSize: 32,
  },
  codeInputContainer: {
    marginBottom: 24,
  },
  codeInput: {
    height: 56,
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  verifyButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  successButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;