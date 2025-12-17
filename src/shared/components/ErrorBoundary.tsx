/**
 * Enhanced Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 * Critical for mental health app - ensures crisis features remain accessible
 * Integrates with comprehensive error handling service
 */

import { logger } from "@shared/utils/logger";
import React, { Component, ReactNode } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
// LOW-015 FIX: Import MaterialCommunityIcons for accessible icons
import { MaterialCommunityIcons } from "@shared/expo/vector-icons";
import { errorHandler, ErrorReport } from "@shared/services/errorHandlingService";
import { hapticService, HapticFeedbackType } from "@shared/services/hapticService";
import { i18n } from "@shared/services/i18nService";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
  level?: 'screen' | 'feature' | 'component';
  enableRecovery?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  errorReport: ErrorReport | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private previousResetKeys: Array<string | number> = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorReport: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Handle error through comprehensive error service
    this.handleErrorReport(error, errorInfo);

    // Haptic feedback
    hapticService.trigger(HapticFeedbackType.ERROR);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props): void {
    const { resetKeys } = this.props;

    // Check if reset keys have changed
    if (resetKeys && this.previousResetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) =>
        key !== this.previousResetKeys[index]
      );

      if (hasResetKeyChanged) {
        this.handleReset();
        this.previousResetKeys = [...resetKeys];
      }
    }
  }

  private async handleErrorReport(error: Error, errorInfo: React.ErrorInfo): Promise<void> {
    try {
      const report = await errorHandler.handleError(
        error,
        {
          screen: this.props.level || 'component',
          metadata: {
            componentStack: errorInfo.componentStack,
            retryCount: this.state.retryCount,
          },
        },
        {
          silent: true, // Don't show default alert
        }
      );

      this.setState({
        errorInfo,
        errorReport: report
      });
    } catch (reportError) {
      logger.error('Failed to report error from boundary', reportError);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorReport: null,
    });
  };

  handleRetry = () => {
    this.setState(prevState => ({
      retryCount: prevState.retryCount + 1,
    }));

    hapticService.trigger(HapticFeedbackType.SELECTION);
    this.handleReset();
  };

  render() {
    if (this.state.hasError) {
      const { error, errorReport, retryCount } = this.state;
      const { fallback, showDetails, enableRecovery, level } = this.props;

      // Custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default fallback UI with enhanced features
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            {/* LOW-015 FIX: Use MaterialCommunityIcons instead of emojis for accessibility */}
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={errorReport?.requiresSupport ? "lifebuoy" : "emoticon-sad-outline"}
                size={64}
                color={errorReport?.requiresSupport ? "#DC2626" : "#6B7280"}
                accessibilityElementsHidden={true}
              />
            </View>
            <Text style={styles.title}>
              {errorReport?.requiresSupport
                ? i18n.t('therapeutic.youAreNotAlone')
                : i18n.t('errors.general')}
            </Text>
            <Text style={styles.message}>
              {errorReport?.userMessage || error?.message ||
                'We apologize for the inconvenience. The app encountered an unexpected error.'}
            </Text>

            {/* Recovery Suggestions */}
            {errorReport?.recoverySuggestions && errorReport.recoverySuggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>What you can do:</Text>
                {errorReport.recoverySuggestions.map((suggestion, index) => (
                  <View key={index} style={styles.suggestionItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Error Details (Development Only) */}
            {showDetails && __DEV__ && this.state.error && (
              <ScrollView style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Error Details (Dev):</Text>
                <Text style={styles.detailsText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.detailsText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {enableRecovery !== false && errorReport?.isRecoverable && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={this.handleRetry}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={i18n.t('common.retry')}
                >
                  <Text style={styles.buttonText}>{i18n.t('common.retry')}</Text>
                </TouchableOpacity>
              )}

              {level === 'screen' && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={this.handleReset}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Go to Home"
                >
                  <Text style={styles.secondaryButtonText}>Go to Home</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Retry Count */}
            {retryCount > 0 && (
              <Text style={styles.retryCount}>
                Retry attempts: {retryCount}
              </Text>
            )}

            <Text style={styles.helpText}>
              {errorReport?.requiresSupport
                ? i18n.t('mentalHealth.needHelp')
                : 'If this problem persists, please contact support.'}
            </Text>
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
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    maxWidth: 400,
  },
  // LOW-015 FIX: Replaced emoji style with iconContainer
  iconContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  suggestionsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#6C757D',
    marginRight: 8,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
  },
  detailsContainer: {
    width: "100%",
    maxHeight: 200,
    backgroundColor: "#FFF3CD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 12,
    color: "#856404",
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
  },
  secondaryButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '500',
  },
  retryCount: {
    marginBottom: 10,
    fontSize: 12,
    color: '#6C757D',
  },
  helpText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
  },
});

// ============ HELPER FUNCTIONS ============

/**
 * HOC to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

/**
 * Hook for error handling
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  return { resetError, captureError };
}

export default ErrorBoundary;
