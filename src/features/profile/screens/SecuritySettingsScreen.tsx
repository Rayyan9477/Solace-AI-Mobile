/**
 * Security Settings Screen - Account Security Management
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

const SecuritySettingsScreenComponent = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [biometricLock, setBiometricLock] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(false);

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
    warningCard: {
      backgroundColor: theme.colors.orange["20"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    warningIcon: {
      fontSize: 24,
      marginRight: 12,
    },
    warningText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.orange["100"],
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      textTransform: "uppercase",
      marginBottom: 16,
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
      flex: 1,
      paddingRight: 12,
    },
    settingTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    actionText: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    actionArrow: {
      fontSize: 16,
      color: theme.colors.text.tertiary,
    },
    saveButton: {
      backgroundColor: theme.colors.brown["60"],
      borderRadius: 16,
      paddingVertical: 16,
      marginHorizontal: 20,
      marginVertical: 24,
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
        <Text style={styles.headerTitle}>Security Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Warning */}
        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Keep your account secure by enabling two-factor authentication and
            using a strong password
          </Text>
        </View>

        {/* Authentication */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Biometric Lock</Text>
              <Text style={styles.settingDescription}>
                Use fingerprint or face ID to unlock the app
              </Text>
            </View>
            <Switch
              value={biometricLock}
              onValueChange={setBiometricLock}
              trackColor={{
                false: theme.colors.gray["40"],
                true: theme.colors.green["60"],
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
              <Text style={styles.settingDescription}>
                Add an extra layer of security to your account
              </Text>
            </View>
            <Switch
              value={twoFactorAuth}
              onValueChange={setTwoFactorAuth}
              trackColor={{
                false: theme.colors.gray["40"],
                true: theme.colors.green["60"],
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingTitle}>Auto Logout</Text>
              <Text style={styles.settingDescription}>
                Automatically log out after periods of inactivity
              </Text>
            </View>
            <Switch
              value={sessionTimeout}
              onValueChange={setSessionTimeout}
              trackColor={{
                false: theme.colors.gray["40"],
                true: theme.colors.green["60"],
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Password</Text>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Change Password</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Device Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Management</Text>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Manage Devices</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Active Sessions</Text>
            <Text style={styles.actionArrow}>→</Text>
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


export const SecuritySettingsScreen = (props: any) => (
  <ScreenErrorBoundary screenName="Security Settings">
    <SecuritySettingsScreenComponent {...props} />
  </ScreenErrorBoundary>
);

export default SecuritySettingsScreen;
