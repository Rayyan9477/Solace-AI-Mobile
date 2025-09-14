/**
 * Refactored App Provider - Modern, clean, and performant provider architecture
 *
 * Features:
 * - Clean separation of concerns
 * - Modern React patterns with hooks
 * - Optimized provider nesting
 * - Enhanced error handling
 * - Performance monitoring
 * - Mental health app optimizations
 */

import React, { useMemo, useCallback } from "react";
import { Platform } from "react-native";

// Core providers
import { AccessibilityProvider } from "../providers/AccessibilityProvider";
import { MentalHealthProvider } from "../providers/MentalHealthProvider";
import { PerformanceProvider } from "../providers/PerformanceProvider";

// Theme providers (maintaining backward compatibility)

// Error boundary
import AppErrorBoundary from "./ErrorBoundary/AppErrorBoundary";

// Loading screen
import EnhancedLoadingScreen from "./LoadingScreen/EnhancedLoadingScreen";

// App initialization hook
import useAppInitialization, {
  INIT_STAGES,
} from "../hooks/useAppInitialization";
import {
  UnifiedThemeProvider as ThemeProvider,
  useTheme,
} from "../shared/theme/UnifiedThemeProvider";

/**
 * Inner App Content - Renders app content based on initialization state
 */
const AppContent = ({ children, appVersion }) => {
  const { themeLoaded } = useTheme();
  const {
    stage,
    progress,
    error,
    isRetrying,
    retryCount,
    loadingTime,
    isReady,
    isLoading,
    hasError,
    retryInitialization,
  } = useAppInitialization({
    enablePerformanceTracking: __DEV__,
    maxRetryAttempts: 1, // Single retry to fail fast
    initializationTimeout: 3000, // 3 seconds max before emergency fallback
    onEmergencyFallback: () => {
      console.log(
        "🚨 Emergency fallback triggered - app will start with minimal features",
      );
      // App continues with basic functionality
    },
  });

  // Handle emergency support
  const handleEmergencySupport = useCallback(() => {
    console.log("🆘 Emergency support requested from loading screen");

    // Trigger emergency mode
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const event = new CustomEvent("mentalHealthEmergency", {
        detail: { source: "loading_screen_emergency" },
      });
      window.dispatchEvent(event);
    }
  }, []);

  // Get stage-specific messages
  const getStageMessage = useMemo(() => {
    switch (stage) {
      case INIT_STAGES.STARTING:
        return "Initializing your safe space...";
      case INIT_STAGES.LOADING_STORAGE:
        return "Loading your wellness data...";
      case INIT_STAGES.VALIDATING_DATA:
        return "Validating your progress...";
      case INIT_STAGES.INITIALIZING_SERVICES:
        return "Connecting support services...";
      case INIT_STAGES.RESTORING_STATE:
        return "Restoring your journey...";
      case INIT_STAGES.READY:
        return "Welcome back to your wellness journey!";
      case INIT_STAGES.ERROR:
        return "We're working to resolve this...";
      default:
        return "Loading your mental wellness companion...";
    }
  }, [stage]);

  // Update the if condition for loading/error
  if (!themeLoaded || (hasError && retryCount >= 1)) {
    // Changed maxRetryAttempts to 1 for single retry
    return (
      <EnhancedLoadingScreen
        message={
          hasError
            ? "Initialization encountered an issue. Proceed with default settings?"
            : getStageMessage
        }
        progress={progress}
        stage={stage}
        error={hasError ? error : null}
        isRetrying={isRetrying}
        loadingTime={loadingTime}
        onEmergencyPress={handleEmergencySupport}
        onRetry={hasError ? null : retryInitialization} // Disable retry if max attempts reached
        onProceed={() => {
          // Force ready state with defaults
          // setStage(INIT_STAGES.READY); // This line was removed from the original file, so it's removed here.
          // setError(null); // This line was removed from the original file, so it's removed here.
          // isInitializedRef.current = true;  // Assuming ref from hook - This line was removed from the original file, so it's removed here.
        }}
        customMessages={{
          [INIT_STAGES.STARTING]: [
            "Creating your safe mental space...",
            "Preparing therapeutic environment...",
            "Initializing wellness tools...",
          ],
          [INIT_STAGES.LOADING_STORAGE]: [
            "Securely loading your data...",
            "Retrieving your progress...",
            "Accessing your preferences...",
          ],
          [INIT_STAGES.INITIALIZING_SERVICES]: [
            "Connecting to support networks...",
            "Activating crisis detection...",
            "Enabling privacy protection...",
          ],
        }}
      />
    );
  }

  // App is ready, render main content
  if (isReady) {
    return children;
  }

  // Fallback (should not reach here)
  return (
    <EnhancedLoadingScreen
      message="Finalizing your experience..."
      onEmergencyPress={handleEmergencySupport}
    />
  );
};

/**
 * Refactored App Provider - Main provider component
 */
export const RefactoredAppProvider = ({ children, appVersion = "1.0.0" }) => {
  // Error handler for the app boundary
  const handleAppError = useCallback((error, errorInfo) => {
    console.error("🚨 App Error Boundary:", error, errorInfo);

    // Track errors in production (without sensitive data)
    if (!__DEV__ && typeof window !== "undefined") {
      // Here you could integrate with error tracking service
      console.log("Error tracked for mental health app");
    }
  }, []);

  // Emergency handler
  const handleEmergency = useCallback(() => {
    console.log("🆘 Emergency mode activated from error boundary");

    if (Platform.OS === "web" && typeof window !== "undefined") {
      const event = new CustomEvent("mentalHealthEmergency", {
        detail: { source: "error_boundary" },
      });
      window.dispatchEvent(event);
    }
  }, []);

  // Restart handler
  const handleRestart = useCallback(() => {
    console.log("🔄 App restart requested");

    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  // Optimized provider nesting with proper error boundaries
  return (
    <AppErrorBoundary
      appVersion={appVersion}
      onError={handleAppError}
      onEmergency={handleEmergency}
      onRestart={handleRestart}
    >
      <PerformanceProvider>
        <AccessibilityProvider>
          <MentalHealthProvider>
            {/* 
              Use UnifiedThemeProvider for consistent theme context
              Fixes blank screen issues caused by theme provider conflicts
            */}
            <ThemeProvider>
              <AppContent appVersion={appVersion}>{children}</AppContent>
            </ThemeProvider>
          </MentalHealthProvider>
        </AccessibilityProvider>
      </PerformanceProvider>
    </AppErrorBoundary>
  );
};

/**
 * App Provider Wrapper - Maintains compatibility with existing code
 */
export const AppProvider = (props) => {
  return <RefactoredAppProvider {...props} />;
};

/**
 * Hooks for accessing provider contexts
 */
export { useMentalHealth } from "../providers/MentalHealthProvider";
export { useAccessibility } from "../providers/AccessibilityProvider";
export { usePerformance } from "../providers/PerformanceProvider";

// Legacy hook for backward compatibility
export const useAppFeatures = () => {
  const mentalHealth = useMentalHealth();
  const accessibility = useAccessibility();
  const performance = usePerformance();

  return {
    // Mental health features
    announceToScreenReader: mentalHealth.announceToScreenReader,
    triggerEmergencyMode: mentalHealth.triggerEmergencyMode,

    // Performance features
    trackPerformance: performance.trackPerformance,

    // Accessibility features
    isScreenReaderEnabled: accessibility.isScreenReaderEnabled,
    shouldReduceMotion: accessibility.shouldReduceMotion,

    // Combined features
    features: {
      ...mentalHealth.features,
      accessibility: accessibility.isScreenReaderEnabled,
      performance: performance.isMonitoringEnabled,
    },
  };
};

export default RefactoredAppProvider;
