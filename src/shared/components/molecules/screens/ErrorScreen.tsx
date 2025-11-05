/**
 * Error Screens - Handles various error states
 * Not Found (404), No Internet, Internal Error (500), Maintenance, Not Allowed
 */

import { MentalHealthIcon } from "@components/icons";
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

type ErrorType = "404" | "no-internet" | "500" | "maintenance" | "forbidden";

interface ErrorScreenProps {
  type: ErrorType;
  onRetry?: () => void;
  onGoHome?: () => void;
}

const ERROR_CONFIG = {
  "404": {
    illustration: "🔍",
    title: "Not Found",
    message: "Whoops! Dr. F can't find this page :(",
    statusCode: "Status Code: 404",
    action: "Refresh or Try Again",
  },
  "no-internet": {
    illustration: "📡",
    title: "No Internet!",
    message: "It seems you don't have active internet",
    statusCode: null,
    action: "Refresh or Try Again",
  },
  "500": {
    illustration: "⚠️",
    title: "Internal Error",
    message: "Whoops! Our server seems to error :(",
    statusCode: "Status Code: 500",
    action: "Refresh or Try Again",
  },
  maintenance: {
    illustration: "🔧",
    title: "Maintenance",
    message: "We're undergoing maintenance",
    statusCode: "Come back in 9h 12m",
    action: null,
  },
  forbidden: {
    illustration: "🛑",
    title: "Not Allowed",
    message: "Hey, you don't have permission",
    statusCode: null,
    action: "Contact Admin",
  },
};

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  type,
  onRetry,
  onGoHome,
}) => {
  const { theme } = useTheme();
  const config = ERROR_CONFIG[type];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    illustrationContainer: {
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: theme.colors.brown["20"],
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 40,
    },
    illustration: {
      fontSize: 100,
    },
    title: {
      fontSize: 32,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 12,
      textAlign: "center",
    },
    message: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 20,
    },
    statusCodeBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.orange["10"],
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginBottom: 40,
      gap: 8,
    },
    statusCodeText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.orange["60"],
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 32,
      gap: 12,
    },
    primaryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.orange["40"],
      paddingVertical: 16,
      borderRadius: 24,
      gap: 8,
    },
    primaryButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    secondaryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background.secondary,
      borderWidth: 1.5,
      borderColor: theme.colors.border.primary,
      paddingVertical: 16,
      borderRadius: 24,
      gap: 8,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoHome}>
          <MentalHealthIcon
            name="ChevronLeft"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustration}>{config.illustration}</Text>
        </View>

        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.message}>{config.message}</Text>

        {config.statusCode && (
          <View style={styles.statusCodeBadge}>
            <MentalHealthIcon
              name="AlertCircle"
              size={16}
              color={theme.colors.orange["60"]}
            />
            <Text style={styles.statusCodeText}>{config.statusCode}</Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {config.action && (
          <TouchableOpacity style={styles.primaryButton} onPress={onRetry}>
            <MentalHealthIcon
              name={type === "forbidden" ? "Mail" : "RotateCw"}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.primaryButtonText}>{config.action}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.secondaryButton} onPress={onGoHome}>
          <MentalHealthIcon
            name="Home"
            size={20}
            color={theme.colors.text.primary}
          />
          <Text style={styles.secondaryButtonText}>Take Me Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ErrorScreen;
