import { logger } from "@shared/utils/logger";

/**
 * Offline Mode Screen - App Functionality Without Internet
 * Based on ui-designs/Dark-mode/🔒 Error & Other Utilities.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";

interface OfflineFeature {
  id: string;
  title: string;
  icon: string;
  available: boolean;
}

export const OfflineModeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const offlineFeatures: OfflineFeature[] = [
    {
      id: "journal",
      title: "Journal Entries",
      icon: "📝",
      available: true,
    },
    {
      id: "mood",
      title: "Mood Tracking",
      icon: "😊",
      available: true,
    },
    {
      id: "breathing",
      title: "Breathing Exercises",
      icon: "🫁",
      available: true,
    },
    {
      id: "meditation",
      title: "Downloaded Meditations",
      icon: "🧘",
      available: true,
    },
    {
      id: "crisis",
      title: "Crisis Resources",
      icon: "🆘",
      available: true,
    },
    {
      id: "chat",
      title: "AI Chat",
      icon: "💬",
      available: false,
    },
    {
      id: "community",
      title: "Community Support",
      icon: "👥",
      available: false,
    },
    {
      id: "resources",
      title: "Online Resources",
      icon: "📚",
      available: false,
    },
  ];

  const handleCheckConnection = async () => {
    if (__DEV__) {
      logger.debug("Checking connection...");
    }

    try {
      const state = await NetInfo.fetch();
      if (state.isConnected && state.isInternetReachable) {
        Alert.alert(
          "Connection Restored",
          "You're back online! Your data will now sync.",
          [{ text: "Continue", onPress: () => navigation.navigate("Dashboard" as never) }]
        );
      } else {
        Alert.alert(
          "Still Offline",
          "No internet connection detected. Please check your network settings.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      logger.error("Connection check failed:", error);
      Alert.alert("Error", "Failed to check connection status.");
    }
  };

  const handleContinueOffline = () => {
    navigation.navigate("Dashboard");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    content: {
      flex: 1,
    },
    heroSection: {
      paddingHorizontal: 40,
      paddingVertical: 40,
      alignItems: "center",
      backgroundColor: theme.colors.orange["20"],
    },
    heroIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 8,
      textAlign: "center",
    },
    heroMessage: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: 24,
    },
    checkButton: {
      backgroundColor: theme.colors.orange["60"],
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 32,
    },
    checkButtonText: {
      fontSize: 15,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    section: {
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    sectionSubtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.secondary,
      marginBottom: 20,
    },
    featuresGrid: {
      gap: 12,
    },
    featureCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 12,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    featureCardDisabled: {
      opacity: 0.5,
    },
    featureLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    featureIcon: {
      fontSize: 32,
      marginRight: 12,
    },
    featureTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusBadgeAvailable: {
      backgroundColor: theme.colors.green["20"],
    },
    statusBadgeUnavailable: {
      backgroundColor: theme.colors.red["20"],
    },
    statusText: {
      fontSize: 11,
      fontWeight: "700",
      textTransform: "uppercase",
    },
    statusTextAvailable: {
      color: theme.colors.green["60"],
    },
    statusTextUnavailable: {
      color: theme.colors.red["60"],
    },
    bottomBar: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray["20"],
      backgroundColor: theme.colors.background.primary,
    },
    continueButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
    },
    continueButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    tipCard: {
      backgroundColor: theme.colors.blue["20"],
      borderRadius: 12,
      padding: 16,
      marginHorizontal: 20,
      marginBottom: 20,
    },
    tipTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    tipsList: {
      gap: 4,
    },
    tipText: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
    },
  });

  const availableFeatures = offlineFeatures.filter((f) => f.available);
  const unavailableFeatures = offlineFeatures.filter((f) => !f.available);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroIcon}>📡</Text>
          <Text style={styles.heroTitle}>You're Offline</Text>
          <Text style={styles.heroMessage}>
            No internet connection detected. Some features are limited, but you
            can still use Solace AI offline.
          </Text>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={handleCheckConnection}
            accessible
            accessibilityLabel="Check connection"
            accessibilityRole="button"
          >
            <Text style={styles.checkButtonText}>Check Connection</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Offline</Text>
          <Text style={styles.sectionSubtitle}>
            These features work without an internet connection
          </Text>
          <View style={styles.featuresGrid}>
            {availableFeatures.map((feature) => (
              <View key={feature.id} style={styles.featureCard}>
                <View style={styles.featureLeft}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                </View>
                <View style={[styles.statusBadge, styles.statusBadgeAvailable]}>
                  <Text style={[styles.statusText, styles.statusTextAvailable]}>
                    Available
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requires Internet</Text>
          <Text style={styles.sectionSubtitle}>
            These features need an active internet connection
          </Text>
          <View style={styles.featuresGrid}>
            {unavailableFeatures.map((feature) => (
              <View
                key={feature.id}
                style={[styles.featureCard, styles.featureCardDisabled]}
              >
                <View style={styles.featureLeft}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                </View>
                <View
                  style={[styles.statusBadge, styles.statusBadgeUnavailable]}
                >
                  <Text
                    style={[styles.statusText, styles.statusTextUnavailable]}
                  >
                    Unavailable
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Offline Tips:</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tipText}>
              • Your data will sync automatically when you reconnect
            </Text>
            <Text style={styles.tipText}>
              • Crisis resources are always available offline
            </Text>
            <Text style={styles.tipText}>
              • Downloaded content can be accessed without internet
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueOffline}
          accessible
          accessibilityLabel="Continue offline"
          accessibilityRole="button"
        >
          <Text style={styles.continueButtonText}>Continue Offline</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OfflineModeScreen;
