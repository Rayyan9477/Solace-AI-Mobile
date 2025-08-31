/**
 * Simple Fallback Screen Component
 * Used as a fallback and loading screen - No complex dependencies
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

const SimpleFallbackScreen = ({
  message = "Loading...",
  error,
  onRetry,
  onGoHome,
  showSpinner = false,
  showEmergencyHelp = false,
}) => {
  console.log("📱 SimpleFallbackScreen: Rendering with message:", message);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {showSpinner && (
          <ActivityIndicator
            size="large"
            color="#3B82F6"
            style={styles.spinner}
          />
        )}

        <View style={styles.iconContainer}>
          <Text style={styles.icon}>
            {error ? "⚠️" : showEmergencyHelp ? "🆘" : "🌟"}
          </Text>
        </View>

        <Text style={styles.title}>
          {error ? "Something went wrong" : "Solace AI Mobile"}
        </Text>

        <Text style={styles.message}>{message}</Text>

        {error && (
          <Text style={styles.errorText}>
            {error.message || "An unexpected error occurred"}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          {onRetry && (
            <TouchableOpacity style={styles.button} onPress={onRetry}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          )}

          {onGoHome && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onGoHome}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Go Home
              </Text>
            </TouchableOpacity>
          )}

          {showEmergencyHelp && (
            <TouchableOpacity style={[styles.button, styles.emergencyButton]}>
              <Text style={styles.buttonText}>Emergency Support</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  spinner: {
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
    maxWidth: 300,
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 20,
    maxWidth: 300,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: 120,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  emergencyButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  secondaryButtonText: {
    color: "#3b82f6",
  },
});

export default SimpleFallbackScreen;
