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
  Switch,
  Alert,
} from "react-native";

import ThemeToggle from "../../components/common/ThemeToggle";
import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const SettingsScreen = ({ navigation }) => {
  const {
    theme,
    isDarkMode,
    toggleTheme,
    isReducedMotionEnabled,
    isHighContrastEnabled,
    fontSize,
    setFontSize,
    fontScale,
    setFontScale,
    updateAccessibilitySettings,
  } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataBackupEnabled, setDataBackupEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const settingSections = [
    {
      id: "appearance",
      title: "Appearance & Display",
      icon: "Heart",
      settings: [
        {
          id: "theme",
          title: "Theme",
          type: "custom",
          component: "theme-toggle",
        },
        {
          id: "font-size",
          title: "Font Size",
          type: "selector",
          options: [
            { value: "small", label: "Small" },
            { value: "normal", label: "Normal" },
            { value: "large", label: "Large" },
            { value: "extra-large", label: "Extra Large" },
          ],
          value: fontSize,
          onChange: setFontSize,
        },
      ],
    },
    {
      id: "accessibility",
      title: "Accessibility",
      icon: "Brain",
      settings: [
        {
          id: "high-contrast",
          title: "High Contrast Mode",
          subtitle: "Improve text and button visibility",
          type: "toggle",
          value: isHighContrastEnabled,
          onChange: (value) =>
            updateAccessibilitySettings({ isHighContrastEnabled: value }),
        },
        {
          id: "reduced-motion",
          title: "Reduce Motion",
          subtitle: "Minimize animations and transitions",
          type: "toggle",
          value: isReducedMotionEnabled,
          onChange: (value) =>
            updateAccessibilitySettings({ isReducedMotionEnabled: value }),
        },
      ],
    },
    {
      id: "notifications",
      title: "Notifications & Reminders",
      icon: "Mindfulness",
      settings: [
        {
          id: "push-notifications",
          title: "Push Notifications",
          subtitle: "Receive mental health reminders",
          type: "toggle",
          value: notificationsEnabled,
          onChange: setNotificationsEnabled,
        },
        {
          id: "daily-check-in",
          title: "Daily Check-in Reminder",
          subtitle: "Remind me to log my mood daily",
          type: "navigation",
          onPress: () => navigation.navigate("NotificationsSettings"),
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: "Therapy",
      settings: [
        {
          id: "data-backup",
          title: "Data Backup",
          subtitle: "Securely backup your journal and mood data",
          type: "toggle",
          value: dataBackupEnabled,
          onChange: setDataBackupEnabled,
        },
        {
          id: "analytics",
          title: "Usage Analytics",
          subtitle: "Help improve the app (anonymous data only)",
          type: "toggle",
          value: analyticsEnabled,
          onChange: setAnalyticsEnabled,
        },
        {
          id: "export-data",
          title: "Export My Data",
          subtitle: "Download your personal data",
          type: "navigation",
          onPress: () => handleExportData(),
        },
      ],
    },
    {
      id: "support",
      title: "Support & Resources",
      icon: "Journal",
      settings: [
        {
          id: "crisis-resources",
          title: "Crisis Resources",
          subtitle: "Emergency mental health support",
          type: "navigation",
          onPress: () => handleCrisisResources(),
          urgent: true,
        },
        {
          id: "help-center",
          title: "Help Center",
          subtitle: "Get help using the app",
          type: "navigation",
          onPress: () => navigation.navigate("HelpCenter"),
        },
        {
          id: "contact-support",
          title: "Contact Support",
          subtitle: "Reach out to our support team",
          type: "navigation",
          onPress: () => handleContactSupport(),
        },
      ],
    },
    {
      id: "about",
      title: "About",
      icon: "Heart",
      settings: [
        {
          id: "version",
          title: "App Version",
          subtitle: "1.0.0 (Build 1)",
          type: "info",
        },
        {
          id: "privacy-policy",
          title: "Privacy Policy",
          type: "navigation",
          onPress: () => handlePrivacyPolicy(),
        },
        {
          id: "terms-of-service",
          title: "Terms of Service",
          type: "navigation",
          onPress: () => handleTermsOfService(),
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

  const handleCrisisResources = () => {
    Alert.alert(
      "Crisis Resources",
      "If you are in immediate danger or having thoughts of self-harm, please contact emergency services or a crisis hotline immediately.",
      [
        {
          text: "Emergency Services",
          onPress: () => console.log("Calling emergency services"),
        },
        {
          text: "Crisis Hotline",
          onPress: () => console.log("Calling crisis hotline"),
        },
        { text: "Cancel", style: "cancel" },
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
          text: "In-App Chat",
          onPress: () => navigation.navigate("SupportChat"),
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate("WebView", {
      url: "https://solace-ai.com/privacy",
      title: "Privacy Policy",
    });
  };

  const handleTermsOfService = () => {
    navigation.navigate("WebView", {
      url: "https://solace-ai.com/terms",
      title: "Terms of Service",
    });
  };

  const renderSetting = (setting, sectionColor) => {
    switch (setting.type) {
      case "custom":
        if (setting.component === "theme-toggle") {
          return (
            <View style={styles.customSettingContainer}>
              <ThemeToggle showLabel={false} />
            </View>
          );
        }
        return null;

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
              {setting.subtitle && (
                <Text
                  style={[
                    styles.settingSubtitle,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {setting.subtitle}
                </Text>
              )}
            </View>
            <Switch
              value={setting.value}
              onValueChange={setting.onChange}
              trackColor={{
                false: theme.colors.background.tertiary,
                true: sectionColor,
              }}
              thumbColor={
                setting.value
                  ? theme.colors.background.primary
                  : theme.colors.text.quaternary
              }
            />
          </View>
        );

      case "selector":
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
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.optionsScroll}
              >
                {setting.options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor:
                          setting.value === option.value
                            ? sectionColor
                            : theme.colors.background.secondary,
                      },
                    ]}
                    onPress={() => setting.onChange(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            setting.value === option.value
                              ? theme.colors.text.inverse
                              : theme.colors.text.primary,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
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
                      : theme.colors.text.primary,
                  },
                ]}
              >
                {setting.title}
              </Text>
              {setting.subtitle && (
                <Text
                  style={[
                    styles.settingSubtitle,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {setting.subtitle}
                </Text>
              )}
            </View>
            <NavigationIcon
              name="Home"
              size={20}
              color={theme.colors.text.tertiary}
              variant="outline"
            />
          </TouchableOpacity>
        );

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
              {setting.subtitle && (
                <Text
                  style={[
                    styles.settingSubtitle,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {setting.subtitle}
                </Text>
              )}
            </View>
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
            Settings
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Content */}
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
            {settingSections.map((section, sectionIndex) => (
              <SettingSection
                key={section.id}
                section={section}
                theme={theme}
                renderSetting={renderSetting}
                delay={sectionIndex * 100}
              />
            ))}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const SettingSection = ({ section, theme, renderSetting, delay }) => {
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
  settingDivider: {
    height: 1,
    marginVertical: 8,
  },
  customSettingContainer: {
    paddingVertical: 8,
    alignItems: "center",
  },
  optionsScroll: {
    marginTop: 8,
    marginHorizontal: -4,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  optionText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default SettingsScreen;
