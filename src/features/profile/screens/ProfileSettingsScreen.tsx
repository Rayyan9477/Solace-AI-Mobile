/**
 * Profile Settings Screen - Account settings and preferences
 * Based on ui-designs/Dark-mode/Profile Settings & Help Center.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

interface SettingItem {
  id: string;
  icon: string;
  label: string;
  value?: string;
  type: "navigation" | "toggle" | "info";
  enabled?: boolean;
}

const GENERAL_SETTINGS: SettingItem[] = [
  {
    id: "notifications",
    icon: "🔔",
    label: "Notifications",
    type: "navigation",
  },
  {
    id: "appearance",
    icon: "🌓",
    label: "Appearance",
    value: "Dark Mode",
    type: "navigation",
  },
  {
    id: "personal",
    icon: "👤",
    label: "Personal Information",
    type: "navigation",
  },
  {
    id: "language",
    icon: "🌐",
    label: "Language",
    value: "English (US)",
    type: "navigation",
  },
  {
    id: "dark-mode",
    icon: "🌙",
    label: "Dark Mode",
    type: "toggle",
    enabled: true,
  },
  { id: "theme-mode", icon: "🎨", label: "Theme Mode", type: "navigation" },
];

const SECURITY_SETTINGS: SettingItem[] = [
  { id: "security", icon: "🔐", label: "Security", type: "navigation" },
  { id: "privacy", icon: "🔒", label: "Privacy", type: "navigation" },
];

const DANGER_ZONE: SettingItem[] = [
  { id: "delete", icon: "🗑️", label: "Delete Account", type: "navigation" },
];

const HELP_CENTER: SettingItem[] = [
  { id: "help", icon: "❓", label: "Help Center", type: "navigation" },
  { id: "logout", icon: "🚪", label: "Log Out", type: "navigation" },
];

export const ProfileSettingsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [settings, setSettings] = useState(GENERAL_SETTINGS);

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
      paddingVertical: 16,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    profileCard: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 20,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 24,
    },
    avatar: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.colors.brown["30"],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    avatarText: {
      fontSize: 32,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    settingsList: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 16,
      overflow: "hidden",
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.brown["30"],
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["30"],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    settingIconText: {
      fontSize: 20,
    },
    settingContent: {
      flex: 1,
    },
    settingLabel: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    settingValue: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginTop: 2,
    },
    settingRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    chevron: {
      fontSize: 16,
      color: theme.colors.text.tertiary,
    },
    switch: {
      width: 48,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.brown["30"],
      justifyContent: "center",
      paddingHorizontal: 2,
    },
    switchActive: {
      backgroundColor: theme.colors.brown["70"],
    },
    switchThumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
    },
    dangerZone: {
      backgroundColor: "#D94500",
    },
    dangerItem: {
      backgroundColor: "rgba(217, 69, 0, 0.2)",
    },
    dangerText: {
      color: "#FF6B6B",
    },
    saveButton: {
      backgroundColor: theme.colors.brown["70"],
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",
      marginTop: 16,
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.background.secondary,
    },
  });

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    );
  };

  const renderSettingItem = (item: SettingItem, isLast: boolean = false) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.settingItem,
        isLast && styles.settingItemLast,
        item.id === "delete" && styles.dangerItem,
      ]}
      onPress={() => {
        if (item.type === "navigation") {
          navigation.navigate(item.id);
        } else if (item.type === "toggle") {
          toggleSetting(item.id);
        }
      }}
    >
      <View style={styles.settingIcon}>
        <Text style={styles.settingIconText}>{item.icon}</Text>
      </View>
      <View style={styles.settingContent}>
        <Text
          style={[
            styles.settingLabel,
            item.id === "delete" && styles.dangerText,
          ]}
        >
          {item.label}
        </Text>
        {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
      </View>
      <View style={styles.settingRight}>
        {item.type === "toggle" && (
          <View style={[styles.switch, item.enabled && styles.switchActive]}>
            <View
              style={[
                styles.switchThumb,
                { alignSelf: item.enabled ? "flex-end" : "flex-start" },
              ]}
            />
          </View>
        )}
        {item.type === "navigation" && <Text style={styles.chevron}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Shinomiya Kaguya</Text>
            <Text style={styles.profileEmail}>kaguya@solace.com</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Settings</Text>
          <View style={styles.settingsList}>
            {GENERAL_SETTINGS.map((item, index) =>
              renderSettingItem(item, index === GENERAL_SETTINGS.length - 1),
            )}
          </View>
        </View>

        {/* Security & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          <View style={styles.settingsList}>
            {SECURITY_SETTINGS.map((item, index) =>
              renderSettingItem(item, index === SECURITY_SETTINGS.length - 1),
            )}
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.settingsList}>
            {DANGER_ZONE.map((item, index) =>
              renderSettingItem(item, index === DANGER_ZONE.length - 1),
            )}
          </View>
        </View>

        {/* Help & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <View style={styles.settingsList}>
            {HELP_CENTER.map((item, index) =>
              renderSettingItem(item, index === HELP_CENTER.length - 1),
            )}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Settings ✓</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSettingsScreen;
