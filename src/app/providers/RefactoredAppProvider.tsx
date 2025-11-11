/**
 * RefactoredAppProvider - Centralized app provider orchestration
 *
 * This provider replaces the previous scattered provider setup and ensures
 * proper initialization order and error handling for all app contexts.
 */

import { restoreAuthState } from "@app/store/slices/authSlice";
import { initializeMoodData } from "@app/store/slices/moodSlice";
import { logger } from "@shared/utils/logger";
import { ThemeProvider } from "@theme/ThemeProvider";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

// Import existing providers
import { AppProvider } from "./AppProvider";

// Auth initialization

/**
 * App Initialization Component
 * Handles the initialization of auth state and other critical app setup
 */
const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const [initializationComplete, setInitializationComplete] = useState(false);
  const [initializationError, setInitializationError] = useState<Error | null>(
    null,
  );

  const initializeApp = useCallback(async () => {
    try {
      logger.info("Starting app initialization...");

      // Use Promise.race to add timeout protection for auth
      await Promise.race([
        dispatch(restoreAuthState() as any),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Auth initialization timeout")),
            5000,
          ),
        ),
      ]);

      // Initialize mood data from local storage
      try {
        await dispatch(initializeMoodData() as any);
        logger.info("Mood data initialized from local storage");
      } catch (moodError) {
        // Non-critical error - mood initialization failure shouldn't prevent app startup
        logger.warn("Mood data initialization failed (non-critical):", moodError);
      }

      logger.info("App initialization completed successfully");
      setInitializationComplete(true);
    } catch (error) {
      logger.error("App initialization failed:", error);
      setInitializationError(error as Error);

      // Force complete to prevent hanging - better to show login than blank screen
      logger.info("Forcing initialization completion to prevent blank screen");
      setInitializationComplete(true);
    }
  }, [dispatch]);

  useEffect(() => {
    // Start initialization immediately - no artificial delay
    initializeApp();
  }, [initializeApp]);

  // Show loading state during initialization
  if (!initializationComplete) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F7FAFC",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 16,
            color: "#2D3748",
            textAlign: "center",
          }}
        >
          Initializing Solace AI...
        </Text>
        <View
          style={{
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              textAlign: "center",
            }}
          >
            🧠
          </Text>
        </View>
        <Text
          style={{
            fontSize: 14,
            color: "#718096",
            textAlign: "center",
            maxWidth: 200,
          }}
        >
          Setting up your mental health companion
        </Text>
      </View>
    );
  }

  return children;
};

/**
 * Enhanced Error Recovery Component
 * Provides comprehensive error recovery mechanisms for provider failures
 */
interface ProviderErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ProviderErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

class ProviderErrorBoundary extends React.Component<
  ProviderErrorBoundaryProps,
  ProviderErrorBoundaryState
> {
  constructor(props: ProviderErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(
    error: Error,
  ): Partial<ProviderErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("Provider Error Boundary:", error);
    this.setState({
      error,
      errorInfo,
      hasError: true,
    });

    // Track error in development
    if (__DEV__) {
      logger.debug("Error occurred in provider component");
      logger.debug("Error:", error.message);
      logger.debug("Component Stack:", errorInfo.componentStack);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1,
    });
  };

  render() {
    if (this.state.hasError) {
      const { fallback } = this.props;

      if (fallback) {
        return fallback;
      }

      // Default error UI for React Native
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            backgroundColor: "#fff",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
              textAlign: "center",
            }}
          >
            App Initialization Error
          </Text>
          <Text
            style={{
              fontSize: 14,
              marginBottom: 20,
              textAlign: "center",
              color: "#666",
            }}
          >
            {this.state.error?.message ||
              "Something went wrong during app startup"}
          </Text>
          <TouchableOpacity
            onPress={this.resetError}
            style={{
              backgroundColor: "#007AFF",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Retry ({this.state.retryCount + 1})
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <React.Suspense fallback={null}>{this.props.children}</React.Suspense>
    );
  }
}

/**
 * RefactoredAppProvider - Main app provider orchestrator
 *
 * Provides the following context providers in the correct order:
 * 1. ThemeProvider - Must be first for theme context
 * 2. AccessibilityProvider - Accessibility features
 * 3. MentalHealthProvider - Mental health specific context
 * 4. PerformanceProvider - Performance optimization
 * 5. AppInitializer - Auth and app state initialization
 */
export const RefactoredAppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  logger.debug("Initializing app providers...");

  return (
    <ProviderErrorBoundary>
      <ThemeProvider>
        <AppProvider>
          <AppInitializer>{children}</AppInitializer>
        </AppProvider>
      </ThemeProvider>
    </ProviderErrorBoundary>
  );
};

export default RefactoredAppProvider;
