/**
 * Success Screen - Positive Feedback Messages
 * Based on ui-designs/Dark-mode/🔒 Error & Other Utilities.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
} from "react-native";

interface SuccessScreenProps {
  icon?: string;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  autoRedirect?: boolean;
  redirectDelay?: number;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({
  icon = "✅",
  title = "Success!",
  message = "Your action has been completed successfully.",
  actionLabel = "Continue",
  onAction,
  autoRedirect = false,
  redirectDelay = 3000,
}) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const scaleAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    if (autoRedirect) {
      const timer = setTimeout(() => {
        if (onAction) {
          onAction();
        } else {
          navigation.goBack();
        }
      }, redirectDelay);

      return () => clearTimeout(timer);
    }
  }, []);

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
    iconContainer: {
      marginBottom: 32,
    },
    icon: {
      fontSize: 100,
    },
    title: {
      fontSize: 28,
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
      marginBottom: 40,
    },
    actionButton: {
      backgroundColor: theme.colors.green["60"],
      borderRadius: 16,
      paddingVertical: 16,
      paddingHorizontal: 40,
      alignItems: "center",
      minWidth: 200,
    },
    actionButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    autoRedirectText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
      marginTop: 20,
      textAlign: "center",
    },
    celebrationContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      pointerEvents: "none",
    },
    confetti: {
      fontSize: 40,
      position: "absolute",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.icon}>{icon}</Text>
      </Animated.View>

      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>

        {!autoRedirect && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAction}
            accessible
            accessibilityLabel={actionLabel}
            accessibilityRole="button"
          >
            <Text style={styles.actionButtonText}>{actionLabel}</Text>
          </TouchableOpacity>
        )}

        {autoRedirect && (
          <Text style={styles.autoRedirectText}>
            Redirecting automatically...
          </Text>
        )}
      </Animated.View>

      <View style={styles.celebrationContainer}>
        <Text style={[styles.confetti, { top: 100, left: 50 }]}>🎉</Text>
        <Text style={[styles.confetti, { top: 120, right: 60 }]}>✨</Text>
        <Text style={[styles.confetti, { bottom: 200, left: 80 }]}>🌟</Text>
        <Text style={[styles.confetti, { bottom: 180, right: 70 }]}>🎊</Text>
      </View>
    </SafeAreaView>
  );
};

export default SuccessScreen;
