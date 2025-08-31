import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
  Switch,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { freudDarkTheme } from "../../shared/theme/freudDarkTheme";

// Profile data
const PROFILE_DATA = {
  name: "Shameera Perera",
  email: "sam@email.com",
  phone: "+94 77 123 4567",
  avatar: "👤",
};

// Settings sections
const ACCOUNT_SETTINGS = [
  { id: "personal", title: "Personal Information", icon: "👤", hasArrow: true },
  { id: "password", title: "Change Password", icon: "🔒", hasArrow: true },
  { id: "biometric", title: "Biometric Login", icon: "👆", hasArrow: true },
  { id: "emergency", title: "Emergency Contact", icon: "🚨", hasArrow: true },
  { id: "sync", title: "Data Sync", icon: "🔄", hasArrow: true },
];

const NOTIFICATION_SETTINGS = [
  {
    id: "push",
    title: "Push Notifications",
    icon: "🔔",
    type: "toggle",
    value: true,
  },
  {
    id: "email",
    title: "Email Notifications",
    icon: "📧",
    type: "toggle",
    value: false,
  },
  {
    id: "sms",
    title: "SMS Notifications",
    icon: "💬",
    type: "toggle",
    value: true,
  },
  {
    id: "reminder",
    title: "Mood Reminders",
    icon: "⏰",
    type: "toggle",
    value: true,
  },
  {
    id: "weekly",
    title: "Weekly Reports",
    icon: "📊",
    type: "toggle",
    value: true,
  },
];

const PRIVACY_SETTINGS = [
  {
    id: "analytics",
    title: "Usage Analytics",
    icon: "📈",
    type: "toggle",
    value: false,
  },
  {
    id: "location",
    title: "Location Services",
    icon: "📍",
    type: "toggle",
    value: true,
  },
  {
    id: "camera",
    title: "Camera Access",
    icon: "📷",
    type: "toggle",
    value: true,
  },
  {
    id: "microphone",
    title: "Microphone Access",
    icon: "🎤",
    type: "toggle",
    value: false,
  },
  {
    id: "contacts",
    title: "Contacts Access",
    icon: "📱",
    type: "toggle",
    value: false,
  },
];

const HELP_CENTER_OPTIONS = [
  {
    id: "faq",
    title: "Frequently Asked Questions",
    icon: "❓",
    hasArrow: true,
  },
  { id: "contact", title: "Contact Support", icon: "📞", hasArrow: true },
  { id: "feedback", title: "Send Feedback", icon: "💬", hasArrow: true },
  { id: "tutorial", title: "App Tutorial", icon: "🎓", hasArrow: true },
  { id: "terms", title: "Terms & Conditions", icon: "📄", hasArrow: true },
  { id: "privacy", title: "Privacy Policy", icon: "🔒", hasArrow: true },
];

const LANGUAGES = [
  { id: "en", name: "English", flag: "🇺🇸" },
  { id: "es", name: "Spanish", flag: "🇪🇸" },
  { id: "fr", name: "French", flag: "🇫🇷" },
  { id: "de", name: "German", flag: "🇩🇪" },
  { id: "si", name: "Sinhala", flag: "🇱🇰" },
];

export default function DarkProfileSettingsScreen() {
  const [currentView, setCurrentView] = useState("profile"); // 'profile', 'account', 'notifications', 'privacy', 'help', 'language'
  const [notifications, setNotifications] = useState(
    NOTIFICATION_SETTINGS.reduce(
      (acc, item) => ({ ...acc, [item.id]: item.value }),
      {},
    ),
  );
  const [privacy, setPrivacy] = useState(
    PRIVACY_SETTINGS.reduce(
      (acc, item) => ({ ...acc, [item.id]: item.value }),
      {},
    ),
  );
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [currentView]);

  const toggleNotification = (id) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePrivacy = (id) => {
    setPrivacy((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openLanguageModal = () => {
    setShowLanguageModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeLanguageModal = () => {
    Animated.spring(slideAnim, {
      toValue: 300,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      setShowLanguageModal(false);
    });
  };

  const selectLanguage = (langId) => {
    setSelectedLanguage(langId);
    closeLanguageModal();
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("Logout pressed"),
      },
    ]);
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <LinearGradient
        colors={[freudDarkTheme.colors.accent.primary, "#F97316"]}
        style={styles.avatarContainer}
      >
        <Text style={styles.avatarText}>{PROFILE_DATA.avatar}</Text>
      </LinearGradient>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{PROFILE_DATA.name}</Text>
        <Text style={styles.profileEmail}>{PROFILE_DATA.email}</Text>
      </View>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSettingItem = (item, onPress, customValue) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={onPress}
      disabled={item.type === "toggle"}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{item.icon}</Text>
        <Text style={styles.settingTitle}>{item.title}</Text>
      </View>
      <View style={styles.settingRight}>
        {item.type === "toggle" ? (
          <Switch
            value={customValue}
            onValueChange={onPress}
            trackColor={{
              false: "#4D2F1C",
              true: freudDarkTheme.colors.accent.primary,
            }}
            thumbColor={customValue ? "#FFFFFF" : "#8D6E63"}
          />
        ) : item.hasArrow ? (
          <Text style={styles.settingArrow}>→</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  const renderMainProfile = () => (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      showsVerticalScrollIndicator={false}
    >
      {renderProfileHeader()}

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>12%</Text>
          <Text style={styles.statLabel}>Stress</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>89%</Text>
          <Text style={styles.statLabel}>Happy</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>76%</Text>
          <Text style={styles.statLabel}>Sleep</Text>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setCurrentView("account")}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuTitle}>Account Settings</Text>
          </View>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setCurrentView("notifications")}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuTitle}>Notification Settings</Text>
          </View>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setCurrentView("privacy")}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>🔒</Text>
            <Text style={styles.menuTitle}>Privacy Settings</Text>
          </View>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={openLanguageModal}>
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>🌐</Text>
            <Text style={styles.menuTitle}>Language</Text>
          </View>
          <View style={styles.menuRight}>
            <Text style={styles.menuValue}>
              {LANGUAGES.find((l) => l.id === selectedLanguage)?.name}
            </Text>
            <Text style={styles.menuArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setCurrentView("help")}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>❓</Text>
            <Text style={styles.menuTitle}>Help Center</Text>
          </View>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LinearGradient
          colors={["#DC2626", "#EF4444"]}
          style={styles.logoutGradient}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </Animated.ScrollView>
  );

  const renderAccountSettings = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView("profile")}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
      </View>
      <ScrollView
        style={styles.settingsScroll}
        showsVerticalScrollIndicator={false}
      >
        {ACCOUNT_SETTINGS.map((item) =>
          renderSettingItem(item, () => console.log(`Navigate to ${item.id}`)),
        )}
      </ScrollView>
    </Animated.View>
  );

  const renderNotificationSettings = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView("profile")}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <ScrollView
        style={styles.settingsScroll}
        showsVerticalScrollIndicator={false}
      >
        {NOTIFICATION_SETTINGS.map((item) =>
          renderSettingItem(
            item,
            () => toggleNotification(item.id),
            notifications[item.id],
          ),
        )}
      </ScrollView>
    </Animated.View>
  );

  const renderPrivacySettings = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView("profile")}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Settings</Text>
      </View>
      <ScrollView
        style={styles.settingsScroll}
        showsVerticalScrollIndicator={false}
      >
        {PRIVACY_SETTINGS.map((item) =>
          renderSettingItem(
            item,
            () => togglePrivacy(item.id),
            privacy[item.id],
          ),
        )}
      </ScrollView>
    </Animated.View>
  );

  const renderHelpCenter = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView("profile")}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      {/* AI Chat Support */}
      <View style={styles.aiSupportContainer}>
        <LinearGradient
          colors={[freudDarkTheme.colors.status.success, "#16A34A"]}
          style={styles.aiSupportGradient}
        >
          <Text style={styles.aiSupportTitle}>🤖 AI Assistant</Text>
          <Text style={styles.aiSupportSubtitle}>Get instant help 24/7</Text>
          <TouchableOpacity style={styles.aiSupportButton}>
            <Text style={styles.aiSupportButtonText}>Start Chat</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.settingsScroll}
        showsVerticalScrollIndicator={false}
      >
        {HELP_CENTER_OPTIONS.map((item) =>
          renderSettingItem(item, () => console.log(`Open ${item.id}`)),
        )}
      </ScrollView>
    </Animated.View>
  );

  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent
      animationType="none"
      onRequestClose={closeLanguageModal}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.languageModal,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={[
              freudDarkTheme.colors.background.secondary,
              freudDarkTheme.colors.background.tertiary,
            ]}
            style={styles.languageModalGradient}
          >
            <View style={styles.languageModalHeader}>
              <Text style={styles.languageModalTitle}>Select Language</Text>
              <TouchableOpacity onPress={closeLanguageModal}>
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    selectedLanguage === item.id &&
                      styles.selectedLanguageOption,
                  ]}
                  onPress={() => selectLanguage(item.id)}
                >
                  <Text style={styles.languageFlag}>{item.flag}</Text>
                  <Text style={styles.languageName}>{item.name}</Text>
                  {selectedLanguage === item.id && (
                    <Text style={styles.languageCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={[
        freudDarkTheme.colors.background.primary,
        freudDarkTheme.colors.background.secondary,
      ]}
      style={styles.screenContainer}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={freudDarkTheme.colors.background.primary}
      />
      <SafeAreaView style={styles.safeArea}>
        {currentView === "profile" && renderMainProfile()}
        {currentView === "account" && renderAccountSettings()}
        {currentView === "notifications" && renderNotificationSettings()}
        {currentView === "privacy" && renderPrivacySettings()}
        {currentView === "help" && renderHelpCenter()}
        {renderLanguageModal()}
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  avatarText: {
    fontSize: 28,
    color: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
  },
  editButton: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  statItem: {
    flex: 1,
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 16,
    padding: 20,
    marginRight: 10,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: freudDarkTheme.colors.accent.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
  },
  menuSection: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: freudDarkTheme.colors.text.primary,
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuValue: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.secondary,
    marginRight: 10,
  },
  menuArrow: {
    fontSize: 18,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.6,
  },
  logoutButton: {
    marginBottom: 20,
  },
  logoutGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomSpacer: {
    height: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    fontSize: 16,
    fontWeight: "600",
    color: freudDarkTheme.colors.accent.primary,
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: freudDarkTheme.colors.text.primary,
    flex: 1,
  },
  settingsScroll: {
    flex: 1,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    fontSize: 18,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: freudDarkTheme.colors.text.primary,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingArrow: {
    fontSize: 18,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.6,
  },
  aiSupportContainer: {
    marginBottom: 20,
  },
  aiSupportGradient: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  aiSupportTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  aiSupportSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 15,
  },
  aiSupportButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  aiSupportButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  languageModal: {
    maxHeight: "70%",
  },
  languageModalGradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  languageModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  languageModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: freudDarkTheme.colors.text.primary,
  },
  modalCloseText: {
    fontSize: 24,
    color: freudDarkTheme.colors.text.secondary,
    fontWeight: "300",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  selectedLanguageOption: {
    backgroundColor: "rgba(230, 126, 34, 0.2)",
    borderWidth: 1,
    borderColor: freudDarkTheme.colors.accent.primary,
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 15,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: freudDarkTheme.colors.text.primary,
    flex: 1,
  },
  languageCheck: {
    fontSize: 16,
    color: freudDarkTheme.colors.accent.primary,
    fontWeight: "700",
  },
});
