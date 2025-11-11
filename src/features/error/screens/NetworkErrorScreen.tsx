/**
 * Network Error Screen - Connection Problem Handling
 * Based on ui-designs/Dark-mode/🔒 Error & Other Utilities.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import retryService from "@shared/services/retryService";

export const NetworkErrorScreen = ({ route }: any) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isChecking, setIsChecking] = useState(false);

  const retryCallback = route?.params?.onRetry;

  const handleRetry = async () => {
    setIsChecking(true);

    try {
      // Check network connectivity
      const netInfo = await NetInfo.fetch();

      if (!netInfo.isConnected) {
        Alert.alert(
          "Still Offline",
          "Please check your internet connection and try again.",
          [{ text: "OK" }]
        );
        setIsChecking(false);
        return;
      }

      // If we have a retry callback, execute it
      if (retryCallback) {
        await retryService.retryApiCall(retryCallback, "network request");
        Alert.alert(
          "Connected!",
          "Your connection has been restored.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        // Just go back if no callback
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert(
        "Connection Failed",
        "Unable to establish connection. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handleGoOffline = () => {
    // Navigate to offline mode screen
    navigation.navigate("OfflineMode" as never);
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
    message: {
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: 32,
      paddingHorizontal: 20,
    },
    retryButton: {
      backgroundColor: theme.colors.orange["60"],
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 48,
      marginBottom: 12,
    },
    retryButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    offlineButton: {
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 48,
    },
    offlineButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    tipCard: {
      backgroundColor: theme.colors.blue["20"],
      borderRadius: 16,
      padding: 16,
      marginTop: 32,
    },
    tipTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    tipText: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.illustration}>📡</Text>
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.message}>
        Please check your network settings and try again. Some features may be
        available offline.
      </Text>

      <TouchableOpacity
        style={[styles.retryButton, isChecking && { opacity: 0.7 }]}
        onPress={handleRetry}
        disabled={isChecking}
        accessible
        accessibilityLabel="Retry connection"
        accessibilityRole="button"
      >
        {isChecking ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.retryButtonText}>Retry Connection</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.offlineButton}
        onPress={handleGoOffline}
        accessible
        accessibilityLabel="Continue offline"
        accessibilityRole="button"
      >
        <Text style={styles.offlineButtonText}>Continue Offline</Text>
      </TouchableOpacity>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>💡 Troubleshooting Tips</Text>
        <Text style={styles.tipText}>
          • Check if Wi-Fi or mobile data is enabled{"\n"}• Try toggling
          airplane mode on/off{"\n"}• Restart your device if the issue persists
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default NetworkErrorScreen;
