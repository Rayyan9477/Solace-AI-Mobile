/**
 * Crisis Error Boundary
 * Special error boundary for crisis-related features
 * Ensures crisis resources remain accessible even if other parts of app fail
 */

import { logger } from "@shared/utils/logger";
import React, { Component, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class CrisisErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("CrisisErrorBoundary caught error:", {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    });
  }

  // HIGH-NEW-001 FIX: Verify phone capability before attempting call
  handleEmergencyCall = async () => {
    const phoneUrl = "tel:988";
    const canCall = await Linking.canOpenURL(phoneUrl);

    if (!canCall) {
      // Device cannot make phone calls (simulator, tablet, etc.)
      Alert.alert(
        "Phone Call Not Available",
        "This device cannot make phone calls. Please use another device to dial 988 (Suicide & Crisis Lifeline) for crisis support.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    Alert.alert(
      "Emergency Services",
      "Calling 988 - Suicide & Crisis Lifeline",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call Now",
          onPress: () => Linking.openURL(phoneUrl).catch((err) => {
            logger.error("Failed to open phone dialer:", err);
            Alert.alert("Error", "Please dial 988 manually for crisis support.");
          }),
        },
      ],
    );
  };

  handleCrisisText = () => {
    Linking.openURL("sms:741741").catch(() => {
      Alert.alert(
        "Error",
        "Unable to open messaging app. Please text 741741 manually.",
      );
    });
  };

  // HIGH-NEW-001 FIX: Verify phone capability before attempting 911 call
  handleEmergency911 = async () => {
    const phoneUrl = "tel:911";
    const canCall = await Linking.canOpenURL(phoneUrl);

    if (!canCall) {
      Alert.alert(
        "Phone Call Not Available",
        "This device cannot make phone calls. Please use another device to dial 911 for emergency services.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    Linking.openURL(phoneUrl).catch((err) => {
      logger.error("Failed to open 911 dialer:", err);
      Alert.alert("Error", "Please dial 911 manually for emergency services.");
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.alertBox}>
              <Text style={styles.alertEmoji}>🆘</Text>
              <Text style={styles.alertTitle}>Crisis Support Available</Text>
            </View>

            <Text style={styles.message}>
              We're sorry - the app encountered an error. However, crisis
              support is still available through these emergency resources:
            </Text>

            <View style={styles.resourcesContainer}>
              <TouchableOpacity
                style={[styles.button, styles.emergencyButton]}
                onPress={this.handleEmergencyCall}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Call 988 Suicide & Crisis Lifeline"
              >
                <Text style={styles.emergencyButtonText}>📞 Call 988</Text>
                <Text style={styles.buttonSubtext}>
                  Suicide & Crisis Lifeline
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.textButton]}
                onPress={this.handleCrisisText}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Text HOME to 741741"
              >
                <Text style={styles.textButtonText}>💬 Text 741741</Text>
                <Text style={styles.buttonSubtext}>Crisis Text Line</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={this.handleEmergency911}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Call 911 for immediate emergency"
              >
                <Text style={styles.secondaryButtonText}>🚨 Call 911</Text>
                <Text style={styles.buttonSubtext}>Immediate Emergency</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.safetyMessage}>
              <Text style={styles.safetyText}>
                You are not alone. Help is available 24/7. These services are
                free, confidential, and staffed by trained crisis counselors.
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F0",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
  },
  alertBox: {
    backgroundColor: "#FFE5E5",
    borderLeftWidth: 4,
    borderLeftColor: "#FF4444",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: "center",
  },
  alertEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#CC0000",
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  resourcesContainer: {
    width: "100%",
    marginBottom: 24,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  emergencyButton: {
    backgroundColor: "#FF4444",
  },
  emergencyButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  textButton: {
    backgroundColor: "#4CAF50",
  },
  textButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  secondaryButton: {
    backgroundColor: "#FF9800",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  buttonSubtext: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
  },
  safetyMessage: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  safetyText: {
    fontSize: 14,
    color: "#2E7D32",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default CrisisErrorBoundary;
