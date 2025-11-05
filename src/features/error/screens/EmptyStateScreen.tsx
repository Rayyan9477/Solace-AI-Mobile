/**
 * Empty State Screen - No Data Available
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
} from "react-native";

interface EmptyStateScreenProps {
  icon?: string;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyStateScreen: React.FC<EmptyStateScreenProps> = ({
  icon = "📭",
  title = "Nothing Here Yet",
  message = "Start by adding your first item to get started.",
  actionLabel = "Get Started",
  onAction,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else {
      navigation.goBack();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    icon: {
      fontSize: 80,
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 12,
      textAlign: "center",
    },
    message: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: 32,
    },
    actionButton: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 32,
      alignItems: "center",
      minWidth: 200,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    tipCard: {
      marginTop: 40,
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 12,
      padding: 16,
      width: "100%",
    },
    tipTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    tipsList: {
      gap: 6,
    },
    tipText: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleAction}
        accessible
        accessibilityLabel={actionLabel}
        accessibilityRole="button"
      >
        <Text style={styles.actionButtonText}>{actionLabel}</Text>
      </TouchableOpacity>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Quick Tips:</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipText}>
            • Create your first entry to get started
          </Text>
          <Text style={styles.tipText}>• Track your progress over time</Text>
          <Text style={styles.tipText}>• Use AI suggestions for guidance</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmptyStateScreen;
