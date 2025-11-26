import { logger } from "@shared/utils/logger";

/**
 * Maintenance Mode Screen - App Maintenance Notifications
 * Based on ui-designs/Dark-mode/🔒 Error & Other Utilities.png
 */

import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { API_CONFIG } from "@shared/config/environment";

export const MaintenanceModeScreen = () => {
  const { theme } = useTheme();
  const [isChecking, setIsChecking] = useState(false);

  const maintenanceInfo = {
    estimatedTime: "2 hours",
    reason: "System upgrade and performance improvements",
    startTime: "10:00 PM EST",
    endTime: "12:00 AM EST",
  };

  const handleCheckStatus = async () => {
    if (__DEV__) {
      logger.debug("Checking maintenance status...");
    }

    setIsChecking(true);
    try {
      // Check health endpoint to see if maintenance is over
      const response = await fetch(`${API_CONFIG.baseUrl}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        Alert.alert(
          "Service Restored",
          "The app is back online! Please restart to continue.",
          [{ text: "OK" }]
        );
      } else if (response.status === 503) {
        Alert.alert(
          "Still Under Maintenance",
          "We're still working on improvements. Please try again later.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Status Check", "Unable to determine maintenance status.");
      }
    } catch (error) {
      logger.error("Maintenance status check failed:", error);
      Alert.alert(
        "Check Failed",
        "Unable to check server status. Please ensure you have an internet connection.",
        [{ text: "OK" }]
      );
    } finally {
      setIsChecking(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    illustration: {
      fontSize: 120,
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 12,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: 32,
      paddingHorizontal: 20,
    },
    infoCard: {
      backgroundColor: theme.colors.purple["20"],
      borderRadius: 16,
      padding: 20,
      width: "100%",
      marginBottom: 24,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    infoIcon: {
      fontSize: 20,
      marginRight: 12,
    },
    infoLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      marginRight: 8,
    },
    infoValue: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.primary,
      flex: 1,
    },
    checkButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 48,
      marginBottom: 16,
    },
    checkButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    noteCard: {
      backgroundColor: theme.colors.blue["20"],
      borderRadius: 12,
      padding: 16,
      marginTop: 16,
    },
    noteText: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.primary,
      textAlign: "center",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.illustration}>🔧</Text>
      <Text style={styles.title}>Under Maintenance</Text>
      <Text style={styles.subtitle}>
        We're currently performing scheduled maintenance to improve your
        experience.
      </Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>⏰</Text>
          <Text style={styles.infoLabel}>Duration:</Text>
          <Text style={styles.infoValue}>{maintenanceInfo.estimatedTime}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🕐</Text>
          <Text style={styles.infoLabel}>Start:</Text>
          <Text style={styles.infoValue}>{maintenanceInfo.startTime}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🕛</Text>
          <Text style={styles.infoLabel}>End:</Text>
          <Text style={styles.infoValue}>{maintenanceInfo.endTime}</Text>
        </View>

        <View style={[styles.infoRow, { marginBottom: 0 }]}>
          <Text style={styles.infoIcon}>📝</Text>
          <Text style={styles.infoLabel}>Reason:</Text>
          <Text style={styles.infoValue}>{maintenanceInfo.reason}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.checkButton}
        onPress={handleCheckStatus}
        accessible
        accessibilityLabel="Check status"
        accessibilityRole="button"
      >
        <Text style={styles.checkButtonText}>Check Status</Text>
      </TouchableOpacity>

      <View style={styles.noteCard}>
        <Text style={styles.noteText}>
          Thank you for your patience! We'll be back shortly with improved
          performance.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default MaintenanceModeScreen;
