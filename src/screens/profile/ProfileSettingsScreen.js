import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Image,
  Switch,
  Alert,
} from "react-native";

import ThemeToggle from "../../components/common/ThemeToggle";
import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const ProfileSettingsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [userProfile, setUserProfile] = useState({
    name: "Shinomiya Kaguya",
    email: "kaguya@example.com",
    avatar: "👩‍💼",
    fraudScore: 87,
    fraudStatus: "You're mentally healthy. Are you ready?",
    fraudColor: "#4CAF50",
  });

  const [settings, setSettings] = useState({
    notifications: true,
    dataBackup: true,
    analytics: false,
    biometrics: true,
    autoSync: true,
    locationServices: false,
    crashReports: true,
    usageStatistics: false,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const settingsSections = [
    {
      id: "account",
      title: "Account Settings",
      icon: "Brain",
      settings: [
        {
          id: "personal-info",
          title: "Personal Information",
          subtitle: "Update your name, email, and profile details",
          type: "navigation",
          onPress: () => navigation.navigate("PersonalInfo"),
        },
        {
          id: "emergency-contact",
          title: "Emergency Contact",
          subtitle: "Add trusted contacts for crisis situations",
          type: "navigation",
          onPress: () => navigation.navigate("EmergencyContact"),
        },
        {
          id: "linked-devices",
          title: "Linked Devices",
          subtitle: "Manage devices connected to your account",
          type: "navigation",
          count: 3,
          onPress: () => navigation.navigate("LinkedDevices"),
        },
      ],
    },
    {
      id: "notifications",
      title: "Notification Settings",
      icon: "Mindfulness",
      settings: [
        {
          id: "push-notifications",
          title: "Push Notifications",
          subtitle: "Receive mental health reminders and updates",
          type: "toggle",
          key: "notifications",
        },
        {
          id: "daily-reminders",
          title: "Daily Check-in Reminders",
          subtitle: "Get reminded to log your mood and wellness",
          type: "navigation",
          onPress: () => navigation.navigate("ReminderSettings"),
        },
        {
          id: "crisis-alerts",
          title: "Crisis Support Alerts",
          subtitle: "Emergency notifications for immediate help",
          type: "navigation",
          urgent: true,
          onPress: () => navigation.navigate("CrisisSettings"),
        },
      ],
    },
    {
      id: "security",
      title: "Security Settings",
      icon: "Therapy",
      settings: [
        {
          id: "biometric-lock",
          title: "Biometric Lock",
          subtitle: "Use fingerprint or face recognition for app access",
          type: "toggle",
          key: "biometrics",
        },
        {
          id: "app-lock",
          title: "App Lock Settings",
          subtitle: "Configure when the app should lock automatically",
          type: "navigation",
          onPress: () => navigation.navigate("AppLockSettings"),
        },
        {
          id: "data-encryption",
          title: "Data Encryption",
          subtitle: "All your data is encrypted and secure",
          type: "info",
          status: "enabled",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy & Data",
      icon: "Heart",
      settings: [
        {
          id: "data-backup",
          title: "Data Backup",
          subtitle: "Automatically backup your journal and mood data",
          type: "toggle",
          key: "dataBackup",
        },
        {
          id: "usage-analytics",
          title: "Usage Analytics",
          subtitle: "Help improve the app with anonymous usage data",
          type: "toggle",
          key: "analytics",
        },
        {
          id: "export-data",
          title: "Export My Data",
          subtitle: "Download a copy of all your personal data",
          type: "navigation",
          onPress: () => handleExportData(),
        },
        {
          id: "delete-account",
          title: "Delete Account",
          subtitle: "Permanently delete your account and all data",
          type: "navigation",
          destructive: true,
          onPress: () => handleDeleteAccount(),
        },
      ],
    },
    {
      id: "appearance",
      title: "Appearance & Display",
      icon: "Journal",
      settings: [
        {
          id: "theme",
          title: "App Theme",
          subtitle: "Switch between light and dark mode",
          type: "custom",
          component: "theme-toggle",
        },
        {
          id: "language",
          title: "Language",
          subtitle: "English (US)",
          type: "navigation",
          onPress: () => navigation.navigate("LanguageSettings"),
        },
        {
          id: "font-size",
          title: "Font Size",
          subtitle: "Adjust text size for better readability",
          type: "navigation",
          onPress: () => navigation.navigate("FontSettings"),
        },
      ],
    },
    {
      id: "support",
      title: "Support & Resources",
      icon: "Brain",
      settings: [
        {
          id: "help-center",
          title: "Help Center",
          subtitle: "Find answers to common questions",
          type: "navigation",
          onPress: () => navigation.navigate("HelpCenter"),
        },
        {
          id: "contact-support",
          title: "Contact Support",
          subtitle: "Get help from our support team",
          type: "navigation",
          onPress: () => handleContactSupport(),
        },
        {
          id: "crisis-resources",
          title: "Crisis Resources",
          subtitle: "Emergency mental health support contacts",
          type: "navigation",
          urgent: true,
          onPress: () => handleCrisisResources(),
        },
        {
          id: "feedback",
          title: "Send Feedback",
          subtitle: "Help us improve the app",
          type: "navigation",
          onPress: () => handleSendFeedback(),
        },
      ],
    },
    {
      id: "about",
      title: "About Solace AI",
      icon: "Heart",
      settings: [
        {
          id: "app-version",
          title: "App Version",
          subtitle: "1.0.0 (Build 2024.1)",
          type: "info",
        },
        {
          id: "privacy-policy",
          title: "Privacy Policy",
          type: "navigation",
          onPress: () => navigation.navigate("PrivacyPolicy"),
        },
        {
          id: "terms-service",
          title: "Terms of Service",
          type: "navigation",
          onPress: () => navigation.navigate("TermsOfService"),
        },
        {
          id: "licenses",
          title: "Open Source Licenses",
          type: "navigation",
          onPress: () => navigation.navigate("Licenses"),
        },
      ],
    },
  ];

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

  const handleSettingToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Your personal data will be prepared for download. This may take a few minutes.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Export", onPress: () => console.log("Exporting data...") },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data, including journal entries and mood tracking history, will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Deleting account..."),
        },
      ],
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "How would you like to contact our support team?",
      [
        { text: "Email", onPress: () => console.log("Opening email") },
        {
          text: "Live Chat",
          onPress: () => navigation.navigate("SupportChat"),
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const handleCrisisResources = () => {
    navigation.navigate("CrisisResources");
  };

  const handleSendFeedback = () => {
    navigation.navigate("Feedback");
  };

  const renderSetting = (setting, sectionColor) => {
    switch (setting.type) {
      case "toggle":
        return (
          <View style={styles.settingContent}>
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                {setting.title}
              </Text>
              <Text
                style={[
                  styles.settingSubtitle,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {setting.subtitle}
              </Text>
            </View>
            <Switch
              value={settings[setting.key]}
              onValueChange={() => handleSettingToggle(setting.key)}
              trackColor={{
                false: theme.colors.background.tertiary,
                true: sectionColor,
              }}
              thumbColor={
                settings[setting.key]
                  ? theme.colors.background.primary
                  : theme.colors.text.quaternary
              }
            />
          </View>
        );

      case "navigation":
        return (
          <TouchableOpacity
            style={styles.settingContent}
            onPress={setting.onPress}
          >
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingTitle,
                  {
                    color: setting.urgent
                      ? theme.colors.error[600]
                      : setting.destructive
                        ? theme.colors.error[500]
                        : theme.colors.text.primary,
                  },
                ]}
              >
                {setting.title}
              </Text>
              <Text
                style={[
                  styles.settingSubtitle,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {setting.subtitle}
              </Text>
            </View>
            <View style={styles.settingAction}>
              {setting.count && (
                <View
                  style={[styles.countBadge, { backgroundColor: sectionColor }]}
                >
                  <Text
                    style={[
                      styles.countText,
                      { color: theme.colors.text.inverse },
                    ]}
                  >
                    {setting.count}
                  </Text>
                </View>
              )}
              <NavigationIcon
                name="Home"
                size={20}
                color={theme.colors.text.tertiary}
                variant="outline"
              />
            </View>
          </TouchableOpacity>
        );

      case "custom":
        if (setting.component === "theme-toggle") {
          return (
            <View style={styles.settingContent}>
              <View style={styles.settingInfo}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {setting.title}
                </Text>
                <Text
                  style={[
                    styles.settingSubtitle,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {setting.subtitle}
                </Text>
              </View>
              <ThemeToggle showLabel={false} />
            </View>
          );
        }
        return null;

      case "info":
        return (
          <View style={styles.settingContent}>
            <View style={styles.settingInfo}>
              <Text
                style={[
                  styles.settingTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                {setting.title}
              </Text>
              <Text
                style={[
                  styles.settingSubtitle,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {setting.subtitle}
              </Text>
            </View>
            {setting.status && (
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: theme.colors.success[100] },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: theme.colors.success[700] },
                  ]}
                >
                  {setting.status}
                </Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  const backgroundColors = isDarkMode
    ? [
        theme.colors.dark.background.primary,
        theme.colors.dark.background.secondary,
      ]
    : [
        theme.colors.therapeutic.calming[50],
        theme.colors.therapeutic.peaceful[50],
      ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <LinearGradient
        colors={backgroundColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>

          <Text
            style={[styles.headerTitle, { color: theme.colors.text.primary }]}
          >
            Profile Settings
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Profile Card */}
            <View
              style={[
                styles.profileCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <View style={styles.profileHeader}>
                <Text style={styles.profileAvatar}>{userProfile.avatar}</Text>
                <View style={styles.profileInfo}>
                  <Text
                    style={[
                      styles.profileName,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {userProfile.name}
                  </Text>
                  <Text
                    style={[
                      styles.profileEmail,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {userProfile.email}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    { backgroundColor: theme.colors.background.secondary },
                  ]}
                  onPress={() => navigation.navigate("EditProfile")}
                >
                  <NavigationIcon
                    name="Home"
                    size={16}
                    color={theme.colors.text.primary}
                    variant="outline"
                  />
                </TouchableOpacity>
              </View>

              {/* Fraud Score */}
              <View style={styles.fraudScoreSection}>
                <Text
                  style={[
                    styles.fraudScoreTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Your Fraud Score
                </Text>
                <View style={styles.fraudScoreContainer}>
                  <LinearGradient
                    colors={[
                      userProfile.fraudColor,
                      userProfile.fraudColor + "80",
                    ]}
                    style={styles.fraudScoreCircle}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text
                      style={[
                        styles.fraudScoreNumber,
                        { color: theme.colors.text.inverse },
                      ]}
                    >
                      {userProfile.fraudScore}
                    </Text>
                  </LinearGradient>
                  <View style={styles.fraudScoreInfo}>
                    <Text
                      style={[
                        styles.fraudScoreStatus,
                        { color: userProfile.fraudColor },
                      ]}
                    >
                      {userProfile.fraudStatus}
                    </Text>
                    <TouchableOpacity>
                      <Text
                        style={[
                          styles.fraudScoreLink,
                          { color: theme.colors.primary[500] },
                        ]}
                      >
                        View Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Settings Sections */}
            {settingsSections.map((section, sectionIndex) => (
              <SettingsSection
                key={section.id}
                section={section}
                theme={theme}
                renderSetting={renderSetting}
                delay={sectionIndex * 100}
              />
            ))}

            {/* Sign Out Button */}
            <TouchableOpacity
              style={[
                styles.signOutButton,
                { backgroundColor: theme.colors.error[50] },
              ]}
              onPress={() => {
                Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: () => navigation.replace("Auth"),
                  },
                ]);
              }}
            >
              <MentalHealthIcon
                name="Heart"
                size={20}
                color={theme.colors.error[600]}
                variant="outline"
              />
              <Text
                style={[styles.signOutText, { color: theme.colors.error[600] }]}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const SettingsSection = ({ section, theme, renderSetting, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const sectionColor = theme.colors.therapeutic.calming[500];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.section,
        {
          backgroundColor: theme.colors.background.primary,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: sectionColor }]}>
          <MentalHealthIcon
            name={section.icon}
            size={20}
            color={theme.colors.text.inverse}
            variant="filled"
          />
        </View>
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          {section.title}
        </Text>
      </View>

      <View style={styles.sectionContent}>
        {section.settings.map((setting, index) => (
          <View key={setting.id} style={styles.settingItem}>
            {renderSetting(setting, sectionColor)}
            {index < section.settings.length - 1 && (
              <View
                style={[
                  styles.settingDivider,
                  { backgroundColor: theme.colors.border.secondary },
                ]}
              />
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animatedContainer: {
    paddingBottom: 20,
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileAvatar: {
    fontSize: 48,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  fraudScoreSection: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 20,
  },
  fraudScoreTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  fraudScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  fraudScoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  fraudScoreNumber: {
    fontSize: 28,
    fontWeight: "bold",
  },
  fraudScoreInfo: {
    flex: 1,
  },
  fraudScoreStatus: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  fraudScoreLink: {
    fontSize: 12,
    fontWeight: "500",
  },
  section: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 16,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  sectionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  settingItem: {
    marginBottom: 4,
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  settingAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  settingDivider: {
    height: 1,
    marginVertical: 8,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileSettingsScreen;
