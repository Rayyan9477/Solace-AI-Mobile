/**
 * Web Compatibility Error Boundary
 *
 * Catches and handles web-specific compatibility errors gracefully
 */

import { logger } from "@shared/utils/logger";
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  theme?: any;
  onWebCompatibilityError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  isWebCompatibilityError: boolean;
}

class WebCompatibilityErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isWebCompatibilityError: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const isWebCompatibilityError =
      Platform.OS === "web" &&
      (error.message?.includes("SVG") ||
        error.message?.includes("AsyncStorage") ||
        error.message?.includes("AccessibilityInfo") ||
        error.message?.includes("LinearGradient") ||
        error.message?.includes("styled-components") ||
        error.stack?.includes("react-native-svg") ||
        error.stack?.includes("expo-linear-gradient"));

    return {
      hasError: true,
      error,
      isWebCompatibilityError,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    if (Platform.OS === "web") {
      logger.error("Web Compatibility Error", { error, errorInfo });

      if (this.props.onWebCompatibilityError) {
        this.props.onWebCompatibilityError(error, errorInfo);
      }
    } else {
      logger.error("Application Error", { error, errorInfo });
    }
  }

  handleReload = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.location.reload();
    } else {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isWebCompatibilityError: false,
      });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <WebCompatibilityErrorDisplay
          error={this.state.error}
          isWebCompatibilityError={this.state.isWebCompatibilityError}
          onReload={this.handleReload}
          theme={this.props.theme}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  error: Error | null;
  isWebCompatibilityError: boolean;
  onReload: () => void;
  theme?: any;
}

const WebCompatibilityErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  isWebCompatibilityError,
  onReload,
  theme,
}) => {
  const styles = {
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme?.colors?.background?.primary || "#ffffff",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme?.colors?.text?.primary || "#000000",
      textAlign: "center",
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 18,
      color: theme?.colors?.text?.secondary || "#666666",
      textAlign: "center",
      marginBottom: 24,
    },
    errorMessage: {
      fontSize: 14,
      color: theme?.colors?.error?.[500] || "#dc2626",
      textAlign: "center",
      marginBottom: 24,
      maxWidth: "80%",
    },
    suggestion: {
      fontSize: 16,
      color: theme?.colors?.text?.secondary || "#666666",
      textAlign: "center",
      marginBottom: 32,
      maxWidth: "90%",
      lineHeight: 24,
    },
    button: {
      backgroundColor: theme?.colors?.primary?.[500] || "#3b82f6",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    debugInfo: {
      fontSize: 12,
      color: theme?.colors?.text?.tertiary || "#999999",
      textAlign: "center",
      marginTop: 16,
    },
  };

  const getErrorMessage = () => {
    if (!isWebCompatibilityError) {
      return "An unexpected error occurred while loading the application.";
    }

    if (error?.message?.includes("SVG")) {
      return "SVG graphics are not loading properly in your browser.";
    }

    if (error?.message?.includes("AsyncStorage")) {
      return "Local storage is not available in your browser.";
    }

    if (error?.message?.includes("LinearGradient")) {
      return "Gradient backgrounds are not rendering properly.";
    }

    return "Web compatibility issue detected.";
  };

  const getSuggestion = () => {
    if (!isWebCompatibilityError) {
      return "Please try reloading the page. If the problem persists, contact support.";
    }

    return (
      "This appears to be a browser compatibility issue. Please try:\n\n" +
      "• Using a modern browser (Chrome, Firefox, Safari, or Edge)\n" +
      "• Enabling JavaScript and local storage\n" +
      "• Clearing your browser cache and cookies\n" +
      "• Disabling browser extensions that might interfere"
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isWebCompatibilityError
          ? "🌐 Browser Compatibility Issue"
          : "⚠️ Application Error"}
      </Text>

      <Text style={styles.subtitle}>
        {isWebCompatibilityError
          ? "Web Platform Issue"
          : "Something went wrong"}
      </Text>

      <Text style={styles.errorMessage}>{getErrorMessage()}</Text>

      <Text style={styles.suggestion}>{getSuggestion()}</Text>

      <TouchableOpacity style={styles.button} onPress={onReload}>
        <Text style={styles.buttonText}>
          {Platform.OS === "web" ? "Reload Page" : "Try Again"}
        </Text>
      </TouchableOpacity>

      {__DEV__ && (
        <Text style={styles.debugInfo}>
          Debug: {error?.message || "Unknown error"}
        </Text>
      )}
    </View>
  );
};

export const withWebCompatibility = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return (props: P) => {
    const { theme } = useTheme();

    return (
      <WebCompatibilityErrorBoundary theme={theme}>
        <Component {...props} />
      </WebCompatibilityErrorBoundary>
    );
  };
};

export default WebCompatibilityErrorBoundary;
