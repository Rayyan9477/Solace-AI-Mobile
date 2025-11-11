/**
 * Server Error Screen - Backend Issue Notifications
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
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import retryService from "@shared/services/retryService";

export const ServerErrorScreen = ({ route }: any) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isRetrying, setIsRetrying] = useState(false);

  // Get retry callback from route params if provided
  const retryCallback = route?.params?.onRetry;

  const handleRetry = async () => {
    setIsRetrying(true);

    try {
      if (retryCallback) {
        // Use the provided retry callback with retry logic
        await retryService.retryApiCall(retryCallback, "server request");

        Alert.alert(
          "Success",
          "The request completed successfully!",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        // Generic retry - just go back
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert(
        "Still Unable to Connect",
        "The server is still unavailable. Please try again later or contact support.",
        [{ text: "OK" }]
      );
    } finally {
      setIsRetrying(false);
    }
  };

  const handleGoHome = () => {
    navigation.navigate("Dashboard");
  };

  const handleContactSupport = () => {
    navigation.navigate("ContactSupport");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    errorIcon: {
      fontSize: 80,
      marginBottom: 24,
    },
    errorCode: {
      fontSize: 48,
      fontWeight: "800",
      color: theme.colors.red["60"],
      marginBottom: 8,
    },
    errorTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 12,
      textAlign: "center",
    },
    errorMessage: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: 32,
    },
    buttonContainer: {
      width: "100%",
      gap: 12,
      marginBottom: 32,
    },
    primaryButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    secondaryButton: {
      backgroundColor: theme.colors.brown["20"],
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    supportCard: {
      backgroundColor: theme.colors.blue["20"],
      borderRadius: 12,
      padding: 16,
      width: "100%",
    },
    supportTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    supportText: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
      marginBottom: 12,
    },
    supportButton: {
      backgroundColor: theme.colors.blue["60"],
      borderRadius: 8,
      paddingVertical: 10,
      alignItems: "center",
    },
    supportButtonText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    detailsCard: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 12,
      padding: 16,
    },
    detailsTitle: {
      fontSize: 12,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    detailsText: {
      fontSize: 11,
      lineHeight: 16,
      color: theme.colors.text.tertiary,
      fontFamily: "monospace",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorCode}>500</Text>
        <Text style={styles.errorTitle}>Server Error</Text>
        <Text style={styles.errorMessage}>
          We're experiencing technical difficulties on our end. Our team has
          been notified and is working to resolve the issue.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, isRetrying && { opacity: 0.7 }]}
            onPress={handleRetry}
            disabled={isRetrying}
            accessible
            accessibilityLabel="Retry request"
            accessibilityRole="button"
          >
            {isRetrying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Try Again</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGoHome}
            accessible
            accessibilityLabel="Go to home screen"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Need Immediate Help?</Text>
          <Text style={styles.supportText}>
            If this issue persists or you need urgent assistance, our support
            team is ready to help.
          </Text>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={handleContactSupport}
            accessible
            accessibilityLabel="Contact support"
            accessibilityRole="button"
          >
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Error Details:</Text>
        <Text style={styles.detailsText}>
          Error Code: 500{"\n"}
          Time: {new Date().toLocaleString()}
          {"\n"}
          Request ID: {Math.random().toString(36).substr(2, 9)}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ServerErrorScreen;
