/**
 * Profile Setup Screen - Multi-step onboarding flow
 * Screens: Avatar, Profile Info, Password, RGPT, OTP, Fingerprint, Notifications
 */

import { MentalHealthIcon } from "@components/icons";
import { useTheme } from "@theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Image,
  Switch,
} from "react-native";

type SetupStep =
  | "avatar"
  | "profile"
  | "password"
  | "rgpt"
  | "otp"
  | "fingerprint"
  | "notifications"
  | "result";

interface ProfileData {
  avatar?: string;
  fullName: string;
  email: string;
  password: string;
  height: number;
  weight: number;
  gender: string;
  location: string;
  theme: string;
  otp: string;
  notifications: {
    critical: boolean;
    journal: boolean;
    moodTracker: boolean;
  };
}

const AVATARS = [
  "👨",
  "👩",
  "🧑",
  "👴",
  "👵",
  "🧔",
  "👨‍🦰",
  "👩‍🦰",
  "👨‍🦱",
  "👩‍🦱",
  "👨‍🦳",
  "👩‍🦳",
];

export const ProfileSetupScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState<SetupStep>("avatar");
  const [profileData, setProfileData] = useState<ProfileData>({
    avatar: "👤",
    fullName: "",
    email: "",
    password: "",
    height: 170,
    weight: 70,
    gender: "",
    location: "",
    theme: "Brown",
    otp: "",
    notifications: {
      critical: true,
      journal: false,
      moodTracker: false,
    },
  });

  const steps: SetupStep[] = [
    "avatar",
    "profile",
    "password",
    "rgpt",
    "otp",
    "fingerprint",
    "notifications",
    "result",
  ];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    skipButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "flex-end",
    },
    skipText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.orange["40"],
    },
    progressContainer: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.colors.border.primary,
      borderRadius: 2,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.green["40"],
      borderRadius: 2,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    scrollContent: {
      paddingBottom: 120,
    },
    stepTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    stepSubtitle: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      marginBottom: 32,
    },
    avatarContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
    avatarCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.green["20"],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
    },
    avatarEmoji: {
      fontSize: 64,
    },
    avatarLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    avatarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 16,
      justifyContent: "center",
      marginBottom: 32,
    },
    avatarOption: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 2,
      borderColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
    },
    avatarOptionSelected: {
      borderColor: theme.colors.green["40"],
      backgroundColor: theme.colors.green["10"],
    },
    avatarOptionEmoji: {
      fontSize: 32,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    inputWrapper: {
      marginBottom: 20,
    },
    input: {
      borderWidth: 1.5,
      borderColor: theme.colors.border.primary,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.secondary,
    },
    sliderContainer: {
      marginBottom: 24,
    },
    sliderLabel: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    sliderValue: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.green["40"],
    },
    slider: {
      height: 40,
    },
    dropdownButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1.5,
      borderColor: theme.colors.border.primary,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: theme.colors.background.secondary,
    },
    dropdownText: {
      fontSize: 16,
      color: theme.colors.text.primary,
    },
    otpContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 12,
      marginVertical: 40,
    },
    otpBox: {
      width: 56,
      height: 64,
      borderWidth: 1.5,
      borderColor: theme.colors.border.primary,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background.secondary,
    },
    otpBoxFilled: {
      borderColor: theme.colors.green["40"],
      backgroundColor: theme.colors.green["10"],
    },
    otpText: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    resendText: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
    resendLink: {
      color: theme.colors.orange["40"],
      fontWeight: "600",
    },
    fingerprintContainer: {
      alignItems: "center",
      marginVertical: 60,
    },
    fingerprintCircle: {
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: theme.colors.green["10"],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 24,
    },
    fingerprintIcon: {
      fontSize: 80,
    },
    fingerprintText: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
    notificationItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    notificationInfo: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    notificationDescription: {
      fontSize: 13,
      color: theme.colors.text.secondary,
    },
    resultContainer: {
      alignItems: "center",
      paddingVertical: 40,
    },
    scoreCircle: {
      width: 200,
      height: 200,
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 32,
    },
    scoreValue: {
      fontSize: 72,
      fontWeight: "800",
      color: "#FFFFFF",
    },
    resultTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
      textAlign: "center",
    },
    resultDescription: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: 32,
    },
    continueButton: {
      position: "absolute",
      bottom: 24,
      left: 20,
      right: 20,
      backgroundColor: theme.colors.orange["40"],
      borderRadius: 24,
      paddingVertical: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      ...theme.getShadow("lg"),
    },
    continueButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
      marginRight: 8,
    },
  });

  const handleContinue = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    } else {
      navigation.navigate("Dashboard");
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    } else {
      navigation.goBack();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "avatar":
        return (
          <View>
            <Text style={styles.stepTitle}>Select your Avatar</Text>
            <Text style={styles.stepSubtitle}>
              This helps users visualize your profile and personalize your bot
              for better interactions
            </Text>

            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>{profileData.avatar}</Text>
              </View>
              <Text style={styles.avatarLabel}>Or upload your profile</Text>
            </View>

            <View style={styles.avatarGrid}>
              {/* LOW-NEW-002 FIX: Use avatar emoji as stable key instead of index */}
              {AVATARS.map((avatar) => (
                <TouchableOpacity
                  key={`avatar-${avatar}`}
                  style={[
                    styles.avatarOption,
                    profileData.avatar === avatar &&
                      styles.avatarOptionSelected,
                  ]}
                  onPress={() => setProfileData({ ...profileData, avatar })}
                >
                  <Text style={styles.avatarOptionEmoji}>{avatar}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "profile":
        return (
          <View>
            <Text style={styles.stepTitle}>Profile Setup</Text>
            <Text style={styles.stepSubtitle}>
              Completely your profile and get ready to explore the world
            </Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={profileData.fullName}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, fullName: text })
                }
                placeholder="Shinomiya Kaguya"
                placeholderTextColor={theme.colors.text.tertiary}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={profileData.email}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, email: text })
                }
                placeholder="shinomiyaguya@gmail.com"
                placeholderTextColor={theme.colors.text.tertiary}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Insert Your Password</Text>
              <TextInput
                style={styles.input}
                value={profileData.password}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, password: text })
                }
                placeholder="••••••••••"
                placeholderTextColor={theme.colors.text.tertiary}
                secureTextEntry
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Height</Text>
              <Text style={styles.sliderValue}>{profileData.height} cm</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Weight</Text>
              <Text style={styles.sliderValue}>{profileData.weight} kg</Text>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Location</Text>
              <TouchableOpacity style={styles.dropdownButton}>
                <Text style={styles.dropdownText}>Tokyo, Japan</Text>
                <MentalHealthIcon
                  name="ChevronDown"
                  size={20}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Theme Mode</Text>
              <TouchableOpacity style={styles.dropdownButton}>
                <Text style={styles.dropdownText}>Brown</Text>
                <MentalHealthIcon
                  name="ChevronDown"
                  size={20}
                  color={theme.colors.text.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        );

      case "otp":
        return (
          <View>
            <Text style={styles.stepTitle}>Enter 4 digit OTP Code</Text>
            <Text style={styles.stepSubtitle}>
              Verification code has been sent to your Email Address or Phone
              Number
            </Text>

            <View style={styles.otpContainer}>
              {/* LOW-NEW-002 FIX: Use descriptive key instead of index */}
              {[0, 1, 2, 3].map((index) => (
                <View
                  key={`otp-box-${index}`}
                  style={[
                    styles.otpBox,
                    profileData.otp[index] && styles.otpBoxFilled,
                  ]}
                >
                  <Text style={styles.otpText}>
                    {profileData.otp[index] || ""}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.resendText}>
              Didn't receive the OTP? Then{" "}
              <Text style={styles.resendLink}>resend OTP by again</Text>
            </Text>
          </View>
        );

      case "fingerprint":
        return (
          <View>
            <Text style={styles.stepTitle}>Fingerprint Setup</Text>
            <Text style={styles.stepSubtitle}>
              Use your fingerprint to secure your account from access by others
            </Text>

            <View style={styles.fingerprintContainer}>
              <View style={styles.fingerprintCircle}>
                <Text style={styles.fingerprintIcon}>🔒</Text>
              </View>
              <Text style={styles.fingerprintText}>
                Touch your fingerprint sensor to verify
              </Text>
            </View>
          </View>
        );

      case "notifications":
        return (
          <View>
            <Text style={styles.stepTitle}>Notification Setup</Text>
            <Text style={styles.stepSubtitle}>
              Get notified about the important changes and updates
            </Text>

            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationTitle}>
                  AI Critical Notification
                </Text>
              </View>
              <Switch
                value={profileData.notifications.critical}
                onValueChange={(value) =>
                  setProfileData({
                    ...profileData,
                    notifications: {
                      ...profileData.notifications,
                      critical: value,
                    },
                  })
                }
                trackColor={{
                  false: theme.colors.border.primary,
                  true: theme.colors.green["40"],
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationTitle}>
                  Mental Journal Notification
                </Text>
              </View>
              <Switch
                value={profileData.notifications.journal}
                onValueChange={(value) =>
                  setProfileData({
                    ...profileData,
                    notifications: {
                      ...profileData.notifications,
                      journal: value,
                    },
                  })
                }
                trackColor={{
                  false: theme.colors.border.primary,
                  true: theme.colors.green["40"],
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationTitle}>
                  Mood Tracker Notification
                </Text>
              </View>
              <Switch
                value={profileData.notifications.moodTracker}
                onValueChange={(value) =>
                  setProfileData({
                    ...profileData,
                    notifications: {
                      ...profileData.notifications,
                      moodTracker: value,
                    },
                  })
                }
                trackColor={{
                  false: theme.colors.border.primary,
                  true: theme.colors.green["40"],
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        );

      case "result":
        const score = 87;
        const getScoreColor = (s: number) => {
          if (s >= 80) return ["#A8D08D", "#6FA93F"];
          if (s >= 50) return ["#F4B084", "#E87722"];
          return ["#B4A7D6", "#7030A0"];
        };
        const scoreColors = getScoreColor(score);

        return (
          <View style={styles.resultContainer}>
            <LinearGradient
              colors={scoreColors}
              style={styles.scoreCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.scoreValue}>{score}</Text>
            </LinearGradient>

            <Text style={styles.resultTitle}>
              You're mentally healthy.{"\n"}Are you ready?
            </Text>
            <Text style={styles.resultDescription}>
              You're all set! Start exploring and enjoy the journey.
            </Text>

            <TouchableOpacity
              style={[
                styles.continueButton,
                { position: "relative", marginTop: 20 },
              ]}
              onPress={() => navigation.navigate("Dashboard")}
            >
              <Text style={styles.continueButtonText}>I'm Ready!</Text>
              <MentalHealthIcon name="Check" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <MentalHealthIcon
            name="ChevronLeft"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {currentStep === "avatar" && "Profile Setup"}
          {currentStep === "profile" && "My Profile Setup"}
          {currentStep === "password" && "Password Setup"}
          {currentStep === "rgpt" && "RGPT Setup"}
          {currentStep === "otp" && "OTP Verification"}
          {currentStep === "fingerprint" && "Fingerprint Setup"}
          {currentStep === "notifications" && "Notification Setup"}
          {currentStep === "result" && "Your Freud Score"}
        </Text>

        <TouchableOpacity style={styles.skipButton} onPress={handleContinue}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      {currentStep !== "result" && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      )}

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStepContent()}
      </ScrollView>

      {/* Continue Button */}
      {currentStep !== "result" && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <MentalHealthIcon name="ArrowRight" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
ProfileSetupScreen.displayName = 'ProfileSetupScreen';

export default ProfileSetupScreen;
