/**
 * App Error Boundary - Mental Health Focused Error Handling
 * Provides therapeutic error recovery with crisis support integration
 */

import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { View, Text, ScrollView, Animated, Platform } from "react-native";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryAttempts: 0,
      isRecovering: false,
      fadeAnim: new Animated.Value(0),
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error for debugging (excluding sensitive data)
    const sanitizedError = {
      message: error.message,
      stack: error.stack?.substring(0, 500), // Truncate stack trace
      component: errorInfo.componentStack?.substring(0, 300),
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      retryAttempts: this.state.retryAttempts,
    };

    console.error("🚨 App Error Boundary:", sanitizedError);

    // Announce error to screen readers
    if (
      Platform.OS === "web" &&
      typeof window !== "undefined" &&
      window.announceToScreenReader
    ) {
      window.announceToScreenReader(
        "The app encountered an error. Recovery options are available.",
        "assertive",
      );
    }

    // Fade in error screen
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Set up crisis support keyboard shortcut
    if (Platform.OS === "web") {
      this.setupCrisisShortcut();
    }
  }

  setupCrisisShortcut = () => {
    const handleCrisisShortcut = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === "H") {
        event.preventDefault();
        this.triggerEmergencySupport();
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("keydown", handleCrisisShortcut);
      this.crisisShortcutCleanup = () => {
        document.removeEventListener("keydown", handleCrisisShortcut);
      };
    }
  };

  componentWillUnmount() {
    if (this.crisisShortcutCleanup) {
      this.crisisShortcutCleanup();
    }
  }

  triggerEmergencySupport = () => {
    const emergencyEvent = new CustomEvent("mentalHealthEmergency", {
      detail: {
        source: "error_boundary",
        errorContext: true,
      },
    });

    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.dispatchEvent(emergencyEvent);
    }

    // Announce emergency activation
    if (
      Platform.OS === "web" &&
      typeof window !== "undefined" &&
      window.announceToScreenReader
    ) {
      window.announceToScreenReader(
        "Emergency support mode activated",
        "assertive",
      );
    }
  };

  handleRetry = () => {
    if (this.state.retryAttempts >= 3) {
      return;
    }

    this.setState({
      isRecovering: true,
      retryAttempts: this.state.retryAttempts + 1,
    });

    // Exponential backoff retry
    const delay = Math.pow(2, this.state.retryAttempts) * 1000;

    setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isRecovering: false,
        fadeAnim: new Animated.Value(0),
      });
    }, delay);
  };

  getTherapeuticGradient = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return ["#E3F2FD", "#BBDEFB"]; // Morning calm
    } else if (hour < 18) {
      return ["#F3E5F5", "#E1BEE7"]; // Afternoon serenity
    } else {
      return ["#E8F5E8", "#C8E6C9"]; // Evening peace
    }
  };

  render() {
    if (this.state.hasError) {
      const gradientColors = this.getTherapeuticGradient();
      const maxRetries = 3;
      const canRetry = this.state.retryAttempts < maxRetries;

      return (
        <Animated.View
          style={{
            flex: 1,
            opacity: this.state.fadeAnim,
            backgroundColor: gradientColors[0],
          }}
        >
          <StatusBar style="dark" />
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 24,
              minHeight: "100%",
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View
              style={{
                alignItems: "center",
                marginBottom: 32,
                maxWidth: 400,
              }}
            >
              <Text
                style={{
                  fontSize: 48,
                  marginBottom: 16,
                }}
              >
                🌱
              </Text>

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "600",
                  color: "#2E3A59",
                  textAlign: "center",
                  marginBottom: 12,
                  lineHeight: 32,
                }}
              >
                We're Here for You
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: "#64748B",
                  textAlign: "center",
                  lineHeight: 24,
                }}
              >
                Something unexpected happened, but you're not alone. Let's work
                through this together.
              </Text>
            </View>

            {/* Recovery Options */}
            <View
              style={{
                width: "100%",
                maxWidth: 400,
                marginBottom: 32,
              }}
            >
              {canRetry && !this.state.isRecovering && (
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#2E3A59",
                      marginBottom: 8,
                    }}
                  >
                    Try Again
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      color: "#64748B",
                      marginBottom: 16,
                      lineHeight: 20,
                    }}
                  >
                    Attempt {this.state.retryAttempts + 1} of {maxRetries}
                  </Text>

                  <View
                    style={{
                      backgroundColor: "#4F46E5",
                      borderRadius: 12,
                      paddingVertical: 14,
                      paddingHorizontal: 24,
                      minHeight: 44,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={this.handleRetry}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel="Retry loading the app"
                    accessibilityHint="Attempts to restart the application"
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    >
                      Restart App
                    </Text>
                  </View>
                </View>
              )}

              {this.state.isRecovering && (
                <View
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#4F46E5",
                      marginBottom: 8,
                      textAlign: "center",
                    }}
                  >
                    🔄 Restarting...
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      color: "#64748B",
                      textAlign: "center",
                    }}
                  >
                    Taking a moment to breathe and reset
                  </Text>
                </View>
              )}

              {/* Emergency Support */}
              <View
                style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "#F59E0B",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#92400E",
                    marginBottom: 8,
                  }}
                >
                  Need Immediate Support?
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: "#92400E",
                    marginBottom: 16,
                    lineHeight: 20,
                  }}
                >
                  If you're experiencing a mental health crisis, support is
                  available 24/7.
                </Text>

                <View
                  style={{
                    backgroundColor: "#F59E0B",
                    borderRadius: 12,
                    paddingVertical: 12,
                    paddingHorizontal: 20,
                    minHeight: 44,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={this.triggerEmergencySupport}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Access emergency mental health support"
                  accessibilityHint="Opens crisis intervention resources"
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    Get Help Now
                  </Text>
                </View>

                {Platform.OS === "web" && (
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#92400E",
                      textAlign: "center",
                      marginTop: 8,
                      fontStyle: "italic",
                    }}
                  >
                    Shortcut: Ctrl+Shift+H
                  </Text>
                )}
              </View>
            </View>

            {/* Developer Information (in development mode) */}
            {__DEV__ && this.state.error && (
              <View
                style={{
                  width: "100%",
                  maxWidth: 400,
                  backgroundColor: "#FFF1F2",
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: "#FECACA",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#B91C1C",
                    marginBottom: 8,
                  }}
                >
                  Development Info:
                </Text>

                <Text
                  style={{
                    fontSize: 12,
                    color: "#7F1D1D",
                    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                    lineHeight: 16,
                  }}
                >
                  {this.state.error.message}
                </Text>

                {this.state.error.stack && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#991B1B",
                      fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
                      marginTop: 8,
                      lineHeight: 14,
                    }}
                  >
                    {this.state.error.stack.substring(0, 300)}...
                  </Text>
                )}
              </View>
            )}
          </ScrollView>
        </Animated.View>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
