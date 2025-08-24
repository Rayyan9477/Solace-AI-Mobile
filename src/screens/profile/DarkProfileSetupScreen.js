import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { freudDarkTheme } from '../../shared/theme/freudDarkTheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Setup steps and data
const SETUP_STEPS = [
  { id: 'avatar', title: 'Avatar Selection', icon: '👤' },
  { id: 'profile', title: 'Profile Setup', icon: '📝' },
  { id: 'password', title: 'Password Setup', icon: '🔒' },
  { id: 'otp', title: 'OTP Verification', icon: '📱' },
  { id: 'fingerprint', title: 'Fingerprint Setup', icon: '👆' },
  { id: 'notification', title: 'Notification Setup', icon: '🔔' },
  { id: 'compiling', title: 'Compiling Data', icon: '⚙️' },
  { id: 'score', title: 'Freud Score', icon: '🎯' },
];

const AVATAR_OPTIONS = [
  '👤', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍⚕️', '👩‍⚕️', '👨‍🎨', '👩‍🎨',
  '🧑‍💻', '👨‍🔬', '👩‍🔬', '👨‍🎤', '👩‍🎤', '👨‍🏫', '👩‍🏫', '🧑‍🎭', '👨‍🚀'
];

const OTP_LENGTH = 6;

export default function DarkProfileSetupScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({
    avatar: '👤',
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      emergencyContact: '',
      relationship: '',
    },
    password: {
      current: '',
      new: '',
      confirm: '',
    },
    otp: ['', '', '', '', '', ''],
    fingerprint: false,
    notifications: {
      push: true,
      email: false,
      sms: true,
    },
    score: 87,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const otpInputs = useRef([]);

  useEffect(() => {
    setProgress((currentStep / (SETUP_STEPS.length - 1)) * 100);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: currentStep / (SETUP_STEPS.length - 1),
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < SETUP_STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else if (onComplete) {
        onComplete(stepData);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const validateCurrentStep = () => {
    const step = SETUP_STEPS[currentStep];
    
    switch (step.id) {
      case 'profile':
        const { firstName, lastName, email } = stepData.profile;
        if (!firstName.trim() || !lastName.trim() || !email.trim()) {
          Alert.alert('Error', 'Please fill in all required fields');
          return false;
        }
        break;
      case 'password':
        const { new: newPass, confirm } = stepData.password;
        if (!newPass || newPass !== confirm) {
          Alert.alert('Error', 'Passwords must match and cannot be empty');
          return false;
        }
        if (newPass.length < 6) {
          Alert.alert('Error', 'Password must be at least 6 characters');
          return false;
        }
        break;
      case 'otp':
        const otpComplete = stepData.otp.every(digit => digit !== '');
        if (!otpComplete) {
          Alert.alert('Error', 'Please enter the complete OTP code');
          return false;
        }
        break;
    }
    return true;
  };

  const updateStepData = (key, value) => {
    setStepData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateProfileData = (key, value) => {
    setStepData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value
      }
    }));
  };

  const updatePasswordData = (key, value) => {
    setStepData(prev => ({
      ...prev,
      password: {
        ...prev.password,
        [key]: value
      }
    }));
  };

  const updateOtpData = (index, value) => {
    const newOtp = [...stepData.otp];
    newOtp[index] = value;
    setStepData(prev => ({
      ...prev,
      otp: newOtp
    }));

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const updateNotificationData = (key, value) => {
    setStepData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              })
            }
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {Math.round(progress)}% Complete • Step {currentStep + 1} of {SETUP_STEPS.length}
      </Text>
    </View>
  );

  const renderAvatarSelection = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Select your Avatar</Text>
      <Text style={styles.stepSubtitle}>Choose an avatar that represents you</Text>

      {/* Selected Avatar Display */}
      <View style={styles.selectedAvatarContainer}>
        <LinearGradient
          colors={[freudDarkTheme.colors.accent.primary, '#F97316']}
          style={styles.selectedAvatarGradient}
        >
          <Text style={styles.selectedAvatar}>{stepData.avatar}</Text>
        </LinearGradient>
      </View>

      {/* Avatar Grid */}
      <View style={styles.avatarGrid}>
        {AVATAR_OPTIONS.map((avatar, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.avatarOption,
              stepData.avatar === avatar && styles.selectedAvatarOption
            ]}
            onPress={() => updateStepData('avatar', avatar)}
          >
            <Text style={styles.avatarEmoji}>{avatar}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderProfileSetup = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Profile Setup</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <View style={styles.formRow}>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>First Name *</Text>
            <TextInput
              style={styles.textInput}
              value={stepData.profile.firstName}
              onChangeText={(text) => updateProfileData('firstName', text)}
              placeholder="Enter first name"
              placeholderTextColor={freudDarkTheme.colors.text.secondary}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>Last Name *</Text>
            <TextInput
              style={styles.textInput}
              value={stepData.profile.lastName}
              onChangeText={(text) => updateProfileData('lastName', text)}
              placeholder="Enter last name"
              placeholderTextColor={freudDarkTheme.colors.text.secondary}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address *</Text>
          <TextInput
            style={styles.textInput}
            value={stepData.profile.email}
            onChangeText={(text) => updateProfileData('email', text)}
            placeholder="Enter email address"
            placeholderTextColor={freudDarkTheme.colors.text.secondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.textInput}
            value={stepData.profile.phone}
            onChangeText={(text) => updateProfileData('phone', text)}
            placeholder="Enter phone number"
            placeholderTextColor={freudDarkTheme.colors.text.secondary}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Date of Birth</Text>
          <TextInput
            style={styles.textInput}
            value={stepData.profile.dateOfBirth}
            onChangeText={(text) => updateProfileData('dateOfBirth', text)}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={freudDarkTheme.colors.text.secondary}
          />
        </View>

        <View style={styles.formRow}>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>Emergency Contact</Text>
            <TextInput
              style={styles.textInput}
              value={stepData.profile.emergencyContact}
              onChangeText={(text) => updateProfileData('emergencyContact', text)}
              placeholder="Contact name"
              placeholderTextColor={freudDarkTheme.colors.text.secondary}
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.inputLabel}>Relationship</Text>
            <TextInput
              style={styles.textInput}
              value={stepData.profile.relationship}
              onChangeText={(text) => updateProfileData('relationship', text)}
              placeholder="e.g., Mother"
              placeholderTextColor={freudDarkTheme.colors.text.secondary}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Animated.View>
  );

  const renderPasswordSetup = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Password Setup</Text>
      <Text style={styles.stepSubtitle}>Create a secure password for your account</Text>

      <View style={styles.passwordContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Current Password</Text>
          <TextInput
            style={styles.textInput}
            value={stepData.password.current}
            onChangeText={(text) => updatePasswordData('current', text)}
            placeholder="Enter current password"
            placeholderTextColor={freudDarkTheme.colors.text.secondary}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>New Password</Text>
          <TextInput
            style={styles.textInput}
            value={stepData.password.new}
            onChangeText={(text) => updatePasswordData('new', text)}
            placeholder="Enter new password"
            placeholderTextColor={freudDarkTheme.colors.text.secondary}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm New Password</Text>
          <TextInput
            style={styles.textInput}
            value={stepData.password.confirm}
            onChangeText={(text) => updatePasswordData('confirm', text)}
            placeholder="Confirm new password"
            placeholderTextColor={freudDarkTheme.colors.text.secondary}
            secureTextEntry
          />
        </View>

        <View style={styles.passwordStrength}>
          <Text style={styles.passwordStrengthLabel}>Password Strength:</Text>
          <View style={styles.strengthIndicator}>
            <View style={[styles.strengthBar, { backgroundColor: freudDarkTheme.colors.status.success }]} />
            <View style={[styles.strengthBar, { backgroundColor: freudDarkTheme.colors.status.success }]} />
            <View style={[styles.strengthBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
          </View>
          <Text style={styles.strengthText}>Good</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderOtpVerification = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>OTP Verification</Text>
      <Text style={styles.stepSubtitle}>
        Enter the 6-digit OTP code sent to your email/phone
      </Text>

      <View style={styles.otpContainer}>
        {stepData.otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => otpInputs.current[index] = ref}
            style={[
              styles.otpInput,
              digit && styles.filledOtpInput
            ]}
            value={digit}
            onChangeText={(text) => updateOtpData(index, text)}
            maxLength={1}
            keyboardType="numeric"
            textAlign="center"
          />
        ))}
      </View>

      <TouchableOpacity style={styles.resendButton}>
        <Text style={styles.resendButtonText}>Didn't receive code? Resend OTP</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFingerprintSetup = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Fingerprint Setup</Text>
      <Text style={styles.stepSubtitle}>
        Enable fingerprint authentication for secure and quick access
      </Text>

      <View style={styles.fingerprintContainer}>
        <Animated.View 
          style={[
            styles.fingerprintIcon,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <LinearGradient
            colors={[freudDarkTheme.colors.accent.primary, '#F97316']}
            style={styles.fingerprintGradient}
          >
            <Text style={styles.fingerprintEmoji}>👆</Text>
          </LinearGradient>
        </Animated.View>

        <Text style={styles.fingerprintText}>
          Place your finger on the sensor when ready
        </Text>

        <TouchableOpacity 
          style={styles.enableFingerprintButton}
          onPress={() => {
            updateStepData('fingerprint', true);
            // Start pulse animation
            Animated.loop(
              Animated.sequence([
                Animated.timing(pulseAnim, {
                  toValue: 1.2,
                  duration: 1000,
                  useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                  toValue: 1,
                  duration: 1000,
                  useNativeDriver: true,
                }),
              ])
            ).start();
          }}
        >
          <LinearGradient
            colors={[freudDarkTheme.colors.status.success, '#16A34A']}
            style={styles.enableFingerprintGradient}
          >
            <Text style={styles.enableFingerprintText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.skipFingerprintButton}
          onPress={() => updateStepData('fingerprint', false)}
        >
          <Text style={styles.skipFingerprintText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderNotificationSetup = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.stepTitle}>Notification Setup</Text>
      <Text style={styles.stepSubtitle}>
        Choose how you'd like to receive updates and reminders
      </Text>

      <View style={styles.notificationContainer}>
        <View style={styles.notificationItem}>
          <View style={styles.notificationLeft}>
            <Text style={styles.notificationIcon}>🔔</Text>
            <View>
              <Text style={styles.notificationTitle}>Push Notifications</Text>
              <Text style={styles.notificationDesc}>Receive app notifications</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.notificationToggle,
              stepData.notifications.push && styles.activeNotificationToggle
            ]}
            onPress={() => updateNotificationData('push', !stepData.notifications.push)}
          >
            <View style={[
              styles.notificationToggleCircle,
              stepData.notifications.push && styles.activeNotificationToggleCircle
            ]} />
          </TouchableOpacity>
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationLeft}>
            <Text style={styles.notificationIcon}>📧</Text>
            <View>
              <Text style={styles.notificationTitle}>Email Notifications</Text>
              <Text style={styles.notificationDesc}>Weekly progress updates</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.notificationToggle,
              stepData.notifications.email && styles.activeNotificationToggle
            ]}
            onPress={() => updateNotificationData('email', !stepData.notifications.email)}
          >
            <View style={[
              styles.notificationToggleCircle,
              stepData.notifications.email && styles.activeNotificationToggleCircle
            ]} />
          </TouchableOpacity>
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationLeft}>
            <Text style={styles.notificationIcon}>💬</Text>
            <View>
              <Text style={styles.notificationTitle}>SMS Notifications</Text>
              <Text style={styles.notificationDesc}>Important alerts only</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.notificationToggle,
              stepData.notifications.sms && styles.activeNotificationToggle
            ]}
            onPress={() => updateNotificationData('sms', !stepData.notifications.sms)}
          >
            <View style={[
              styles.notificationToggleCircle,
              stepData.notifications.sms && styles.activeNotificationToggleCircle
            ]} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderCompiling = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.compilingContainer}>
        <Animated.View style={[styles.compilingIcon, { transform: [{ scale: pulseAnim }] }]}>
          <LinearGradient
            colors={[freudDarkTheme.colors.background.secondary, freudDarkTheme.colors.background.tertiary]}
            style={styles.compilingGradient}
          >
            <Text style={styles.compilingEmoji}>⚙️</Text>
          </LinearGradient>
        </Animated.View>
        
        <Text style={styles.compilingTitle}>Compiling Data...</Text>
        <Text style={styles.compilingSubtitle}>
          We're setting up your personalized experience. This won't take long.
        </Text>

        <View style={styles.compilingProgress}>
          <View style={styles.compilingProgressBar}>
            <Animated.View style={[
              styles.compilingProgressFill,
              { 
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]} />
          </View>
          <Text style={styles.compilingProgressText}>Setting up your profile...</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderScore = () => {
    const scoreColor = stepData.score >= 80 ? '#22C55E' : 
                     stepData.score >= 60 ? '#F97316' : 
                     stepData.score >= 40 ? '#EAB308' : '#8B5CF6';
    
    return (
      <Animated.View style={[styles.stepContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreTitle}>Your Freud Score</Text>
          
          <View style={styles.scoreCircle}>
            <LinearGradient
              colors={[scoreColor, scoreColor + '80']}
              style={styles.scoreGradient}
            >
              <Text style={styles.scoreNumber}>{stepData.score}</Text>
            </LinearGradient>
          </View>

          <Text style={styles.scoreStatus}>
            {stepData.score >= 80 ? "You're mentally healthy. Are you ready?" :
             stepData.score >= 60 ? "You're mentally unstable. Consult psychiatrist!" :
             stepData.score >= 40 ? "You're doing okay. Keep working on it!" :
             "You're suicidal. Please call our emergency contact!"}
          </Text>

          <TouchableOpacity style={styles.scoreButton}>
            <LinearGradient
              colors={[scoreColor, scoreColor + '80']}
              style={styles.scoreButtonGradient}
            >
              <Text style={styles.scoreButtonText}>
                {stepData.score >= 80 ? "I'm Ready" :
                 stepData.score >= 60 ? "Schedule Appointment" :
                 stepData.score >= 40 ? "Continue Journey" :
                 "Get Emergency Support"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderCurrentStep = () => {
    const step = SETUP_STEPS[currentStep];
    
    switch (step.id) {
      case 'avatar': return renderAvatarSelection();
      case 'profile': return renderProfileSetup();
      case 'password': return renderPasswordSetup();
      case 'otp': return renderOtpVerification();
      case 'fingerprint': return renderFingerprintSetup();
      case 'notification': return renderNotificationSetup();
      case 'compiling': return renderCompiling();
      case 'score': return renderScore();
      default: return renderAvatarSelection();
    }
  };

  return (
    <LinearGradient
      colors={[freudDarkTheme.colors.background.primary, freudDarkTheme.colors.background.secondary]}
      style={styles.screenContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor={freudDarkTheme.colors.background.primary} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {currentStep > 0 && SETUP_STEPS[currentStep].id !== 'compiling' && (
            <TouchableOpacity onPress={prevStep}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Profile Setup</Text>
        </View>

        {/* Progress Bar */}
        {SETUP_STEPS[currentStep].id !== 'score' && renderProgressBar()}

        {/* Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderCurrentStep()}
        </ScrollView>

        {/* Navigation Buttons */}
        {SETUP_STEPS[currentStep].id !== 'compiling' && SETUP_STEPS[currentStep].id !== 'score' && (
          <View style={styles.navigationButtons}>
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={nextStep}
            >
              <LinearGradient
                colors={[freudDarkTheme.colors.accent.primary, '#F97316']}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>
                  {currentStep === SETUP_STEPS.length - 1 ? 'Complete Setup' : 'Continue'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
    color: freudDarkTheme.colors.accent.primary,
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: 6,
    backgroundColor: freudDarkTheme.colors.accent.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  stepSubtitle: {
    fontSize: 16,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  
  // Avatar selection styles
  selectedAvatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  selectedAvatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedAvatar: {
    fontSize: 60,
    color: '#FFFFFF',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarOption: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarOption: {
    borderColor: freudDarkTheme.colors.accent.primary,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  
  // Profile setup styles
  formContainer: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: freudDarkTheme.colors.text.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Password setup styles
  passwordContainer: {
    flex: 1,
  },
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  passwordStrengthLabel: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.secondary,
    marginRight: 10,
  },
  strengthIndicator: {
    flexDirection: 'row',
    marginRight: 10,
  },
  strengthBar: {
    width: 20,
    height: 4,
    borderRadius: 2,
    marginRight: 4,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '600',
    color: freudDarkTheme.colors.status.success,
  },
  
  // OTP styles
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filledOtpInput: {
    borderColor: freudDarkTheme.colors.accent.primary,
  },
  resendButton: {
    alignItems: 'center',
  },
  resendButtonText: {
    fontSize: 14,
    color: freudDarkTheme.colors.accent.primary,
    textDecorationLine: 'underline',
  },
  
  // Fingerprint styles
  fingerprintContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  fingerprintIcon: {
    marginBottom: 30,
  },
  fingerprintGradient: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprintEmoji: {
    fontSize: 80,
    color: '#FFFFFF',
  },
  fingerprintText: {
    fontSize: 16,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  enableFingerprintButton: {
    width: '100%',
    marginBottom: 15,
  },
  enableFingerprintGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  enableFingerprintText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  skipFingerprintButton: {
    paddingVertical: 12,
  },
  skipFingerprintText: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: 'center',
  },
  
  // Notification styles
  notificationContainer: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 4,
  },
  notificationDesc: {
    fontSize: 12,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
  },
  notificationToggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 2,
    justifyContent: 'center',
  },
  activeNotificationToggle: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
  },
  notificationToggleCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  activeNotificationToggleCircle: {
    alignSelf: 'flex-end',
  },
  
  // Compiling styles
  compilingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  compilingIcon: {
    marginBottom: 30,
  },
  compilingGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compilingEmoji: {
    fontSize: 60,
  },
  compilingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 15,
  },
  compilingSubtitle: {
    fontSize: 16,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  compilingProgress: {
    width: '100%',
  },
  compilingProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  compilingProgressFill: {
    height: 6,
    backgroundColor: freudDarkTheme.colors.accent.primary,
    borderRadius: 3,
  },
  compilingProgressText: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.secondary,
    textAlign: 'center',
  },
  
  // Score styles
  scoreContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  scoreTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 40,
  },
  scoreCircle: {
    marginBottom: 40,
  },
  scoreGradient: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 80,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scoreStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  scoreButton: {
    width: '100%',
  },
  scoreButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  scoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Navigation styles
  navigationButtons: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  continueButton: {
    width: '100%',
  },
  continueButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});