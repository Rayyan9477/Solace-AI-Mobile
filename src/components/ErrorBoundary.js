import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";

import { useTheme } from "../shared/theme/ThemeContext";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // For example: Sentry.captureException(error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Use the ErrorFallback component with retry functionality
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onRestart={this.props.onRestart}
        />
      );
    }

    return this.props.children;
  }
}

// Error fallback component with proper theming
const ErrorFallback = ({ error, errorInfo, onRetry, onRestart }) => {
  // We can't use useTheme hook in class component, so we need a wrapper
  return (
    <ErrorFallbackWithTheme
      error={error}
      errorInfo={errorInfo}
      onRetry={onRetry}
      onRestart={onRestart}
    />
  );
};

const ErrorFallbackWithTheme = ({ error, errorInfo, onRetry, onRestart }) => {
  const { theme } = useTheme();

  const isDev = __DEV__;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          Something went wrong
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          We're sorry for the inconvenience. The app encountered an unexpected
          error.
        </Text>

        {isDev && error && (
          <View
            style={[
              styles.errorDetails,
              {
                backgroundColor: theme.colors.background.secondary,
                borderColor: theme.colors.error[200],
              },
            ]}
          >
            <Text
              style={[styles.errorTitle, { color: theme.colors.error[600] }]}
            >
              Error Details (Development Only):
            </Text>
            <Text
              style={[styles.errorText, { color: theme.colors.text.primary }]}
            >
              {error.toString()}
            </Text>
            {errorInfo && (
              <Text
                style={[
                  styles.stackTrace,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {errorInfo.componentStack}
              </Text>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: theme.colors.primary[500] },
            ]}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Retry the last action"
          >
            <Text
              style={[styles.buttonText, { color: theme.colors.text.inverse }]}
            >
              Try Again
            </Text>
          </TouchableOpacity>

          {onRestart && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                {
                  backgroundColor: theme.colors.background.secondary,
                  borderColor: theme.colors.primary[300],
                },
              ]}
              onPress={onRestart}
              accessibilityRole="button"
              accessibilityLabel="Restart the application"
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.colors.primary[500] },
                ]}
              >
                Restart App
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text
          style={[styles.supportText, { color: theme.colors.text.tertiary }]}
        >
          If this problem persists, please contact our support team.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  errorIcon: {
    fontSize: 64,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 300,
  },
  errorDetails: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 32,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "monospace",
    marginBottom: 8,
  },
  stackTrace: {
    fontSize: 10,
    fontFamily: "monospace",
    opacity: 0.8,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  primaryButton: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  supportText: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.7,
  },
});

export default ErrorBoundary;
