/**
 * Account Settings Screen - Personal Account Management
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
  Switch,
} from "react-native";

const AccountSettingsScreenComponent = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

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
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: {
      width: 40,
      height: 40,
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
    },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      textTransform: "uppercase",
      marginBottom: 12,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    settingIconText: {
      fontSize: 18,
    },
    settingInfo: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    settingArrow: {
      fontSize: 16,
      color: theme.colors.text.tertiary,
    },
    dangerZone: {
      backgroundColor: theme.colors.red["10"],
      marginHorizontal: 20,
      marginVertical: 24,
      borderRadius: 16,
      padding: 20,
    },
    dangerTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.red["100"],
      marginBottom: 12,
    },
    dangerButton: {
      backgroundColor: theme.colors.red["60"],
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: "center",
    },
    dangerButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    saveButton: {
      backgroundColor: theme.colors.brown["60"],
      borderRadius: 16,
      paddingVertical: 16,
      marginHorizontal: 20,
      marginBottom: 20,
      alignItems: "center",
    },
    saveButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Settings</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingIconText}>🔔</Text>
              </View>
              <Text style={styles.settingTitle}>Notifications</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingIconText}>👤</Text>
              </View>
              <Text style={styles.settingTitle}>Personal Information</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingIconText}>🌐</Text>
              </View>
              <Text style={styles.settingTitle}>Language</Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text
                style={{ fontSize: 14, color: theme.colors.text.secondary }}
              >
                English (US)
              </Text>
              <Text style={styles.settingArrow}>→</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingIconText}>🌙</Text>
              </View>
              <Text style={styles.settingTitle}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: theme.colors.gray["40"],
                true: theme.colors.green["60"],
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingIconText}>🎵</Text>
              </View>
              <Text style={styles.settingTitle}>Sound Effects</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Security & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingIconText}>🔒</Text>
              </View>
              <Text style={styles.settingTitle}>Security</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingIconText}>🛡️</Text>
              </View>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>🗑️ Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Settings ✓</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};


export const AccountSettingsScreen = (props: any) => (
  <ScreenErrorBoundary screenName="Account Settings">
    <AccountSettingsScreenComponent {...props} />
  </ScreenErrorBoundary>
);

export default AccountSettingsScreen;
