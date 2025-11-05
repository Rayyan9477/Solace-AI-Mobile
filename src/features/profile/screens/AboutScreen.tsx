/**
 * About Screen - App Version and Legal Information
 * Based on ui-designs/Dark-mode/🔒 Profile Settings & Help Center.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

export const AboutScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const appInfo = {
    version: "2.1.0",
    buildNumber: "450",
    releaseDate: "October 15, 2024",
    developer: "Solace AI Team",
  };

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
    logoSection: {
      alignItems: "center",
      paddingVertical: 40,
    },
    logo: {
      fontSize: 80,
      marginBottom: 16,
    },
    appName: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    tagline: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      textTransform: "uppercase",
      marginBottom: 16,
    },
    infoCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    infoLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    linkButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    linkText: {
      fontSize: 15,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
    linkArrow: {
      fontSize: 16,
      color: theme.colors.text.tertiary,
    },
    socialSection: {
      alignItems: "center",
      paddingVertical: 24,
    },
    socialTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      marginBottom: 16,
    },
    socialRow: {
      flexDirection: "row",
      gap: 16,
    },
    socialButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.brown["10"],
      justifyContent: "center",
      alignItems: "center",
    },
    socialIcon: {
      fontSize: 24,
    },
    copyrightText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
      textAlign: "center",
      paddingVertical: 24,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
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
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <Text style={styles.logo}>🧠</Text>
          <Text style={styles.appName}>Solace AI</Text>
          <Text style={styles.tagline}>Your Mental Wellness Companion</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>{appInfo.version}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build Number</Text>
              <Text style={styles.infoValue}>{appInfo.buildNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Release Date</Text>
              <Text style={styles.infoValue}>{appInfo.releaseDate}</Text>
            </View>
            <View style={[styles.infoRow, { marginBottom: 0 }]}>
              <Text style={styles.infoLabel}>Developer</Text>
              <Text style={styles.infoValue}>{appInfo.developer}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Terms of Service</Text>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Licenses</Text>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Open Source Credits</Text>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Connect With Us</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>🐦</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>📘</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>💼</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.copyrightText}>
          © 2024 Solace AI. All rights reserved.{"\n"}
          Made with ❤️ for better mental health
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
