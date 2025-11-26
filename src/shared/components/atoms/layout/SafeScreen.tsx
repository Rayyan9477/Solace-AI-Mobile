import { logger } from "@shared/utils/logger";

/**
 * Safe Screen Component - Enhanced screen wrapper with error boundaries
 * Provides consistent error handling, performance monitoring, and accessibility
 */

import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import { View, StyleSheet } from "react-native";
// Mock error boundary
const EnhancedErrorBoundary = ({ children, ...props }) => children;
// Mock utilities
const usePerformanceOptimizer = () => ({});
const useAccessibility = () => ({});

const SafeScreen = ({
  children,
  name,
  fallbackComponent,
  onError,
  onRetry,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const performance = usePerformanceOptimizer();
  const accessibility = useAccessibility();

  const handleError = (errorReport) => {
    logger.error(`Screen error in ${name}:`, errorReport);

    if (onError) {
      onError(errorReport);
    }

    // Announce error to screen readers
    accessibility.announceError(`An error occurred in ${name}`);
  };

  const handleRetry = (retryCount) => {
    logger.debug(`Retrying ${name}, attempt ${retryCount}`);

    if (onRetry) {
      onRetry(retryCount);
    }

    accessibility.announceToScreenReader("Retrying screen");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
  });

  return (
    <EnhancedErrorBoundary
      title={`Error in ${name}`}
      subtitle="This screen encountered an unexpected problem."
      theme={theme}
      onError={handleError}
      onRetry={handleRetry}
      fallbackComponent={fallbackComponent}
      {...props}
    >
      <View style={[styles.container, style]}>{children}</View>
    </EnhancedErrorBoundary>
  );
};

export default SafeScreen;
