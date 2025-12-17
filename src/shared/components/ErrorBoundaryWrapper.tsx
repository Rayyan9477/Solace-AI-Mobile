/**
 * Enhanced Error Boundary Wrapper
 * Provides comprehensive error catching and recovery for React components
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { logger } from '@shared/utils/logger';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
  fallbackComponent?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundaryWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { componentName, onError } = this.props;

    // Log error
    logger.error(
      `[ErrorBoundary${componentName ? ` - ${componentName}` : ''}] Caught error:`,
      error,
      errorInfo
    );

    // Store error info
    this.setState({ errorInfo });

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    // Error tracking integration point - sends to logging service
    // In production, this would integrate with Sentry, Bugsnag, etc.
    logger.error(`[ErrorBoundary:${componentName}] Error tracked:`, {
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset error state if resetKeys change
    if (
      hasError &&
      resetKeys &&
      prevProps.resetKeys &&
      resetKeys.some((key, index) => key !== prevProps.resetKeys![index])
    ) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallbackComponent, componentName } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallbackComponent) {
        return fallbackComponent(error, this.reset);
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback
          error={error}
          errorInfo={errorInfo}
          componentName={componentName}
          onReset={this.reset}
        />
      );
    }

    return children;
  }
}

// ==================== DEFAULT FALLBACK UI ====================

interface FallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  componentName?: string;
  onReset: () => void;
}

function DefaultErrorFallback({ error, errorInfo, componentName, onReset }: FallbackProps) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="alert-circle" size={64} color="#EF4444" />
      </View>

      <Text style={styles.title}>Oops! Something went wrong</Text>

      <Text style={styles.message}>
        We encountered an unexpected error{componentName ? ` in ${componentName}` : ''}.
        {'\n'}Don't worry, your data is safe.
      </Text>

      {/* LOW-001 FIX: Add accessibility props for screen reader support */}
      <TouchableOpacity
        style={styles.button}
        onPress={onReset}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Try again"
        accessibilityHint="Attempts to reload the component that crashed"
      >
        <MaterialCommunityIcons name="refresh" size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>

      {__DEV__ && (
        <>
          {/* LOW-001 FIX: Add accessibility props for screen reader support */}
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => setShowDetails(!showDetails)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`${showDetails ? 'Hide' : 'Show'} technical details`}
            accessibilityHint="Toggles visibility of error stack trace"
            accessibilityState={{ expanded: showDetails }}
          >
            <Text style={styles.detailsButtonText}>
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </Text>
            <MaterialCommunityIcons
              name={showDetails ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>

          {showDetails && (
            <View style={styles.errorDetails}>
              <Text style={styles.errorTitle}>Error Message:</Text>
              <Text style={styles.errorText}>{error.message}</Text>

              {error.stack && (
                <>
                  <Text style={[styles.errorTitle, { marginTop: 16 }]}>Stack Trace:</Text>
                  <ScrollView horizontal style={styles.stackTrace}>
                    <Text style={styles.errorText}>{error.stack}</Text>
                  </ScrollView>
                </>
              )}

              {errorInfo?.componentStack && (
                <>
                  <Text style={[styles.errorTitle, { marginTop: 16 }]}>Component Stack:</Text>
                  <ScrollView horizontal style={styles.stackTrace}>
                    <Text style={styles.errorText}>{errorInfo.componentStack}</Text>
                  </ScrollView>
                </>
              )}
            </View>
          )}
        </>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          If this problem persists, please contact support.
        </Text>
      </View>
    </ScrollView>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  detailsButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  errorDetails: {
    width: '100%',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#EF4444',
    lineHeight: 18,
  },
  stackTrace: {
    maxHeight: 200,
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

// ==================== CONVENIENCE WRAPPERS ====================

/**
 * Wrap a screen component with error boundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string,
  fallbackComponent?: (error: Error, reset: () => void) => ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundaryWrapper
        componentName={componentName || WrappedComponent.displayName || WrappedComponent.name}
        fallbackComponent={fallbackComponent}
      >
        <WrappedComponent {...props} />
      </ErrorBoundaryWrapper>
    );
  };
}

/**
 * Screen-level error boundary with custom styling
 */
export function ScreenErrorBoundary({
  children,
  screenName,
}: {
  children: ReactNode;
  screenName: string;
}) {
  return (
    <ErrorBoundaryWrapper
      componentName={screenName}
      fallbackComponent={(error, reset) => (
        <View style={styles.container}>
          <View style={styles.content}>
            <MaterialCommunityIcons name="emoticon-sad-outline" size={80} color="#9CA3AF" />
            <Text style={[styles.title, { marginTop: 24 }]}>
              We're having trouble loading {screenName}
            </Text>
            <Text style={styles.message}>
              Something unexpected happened. Please try refreshing.
            </Text>
            {/* LOW-001 FIX: Add accessibility props for screen reader support */}
            <TouchableOpacity
              style={styles.button}
              onPress={reset}
              accessibilityRole="button"
              accessibilityLabel="Refresh"
              accessibilityHint={`Attempts to reload ${screenName}`}
            >
              <MaterialCommunityIcons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    >
      {children}
    </ErrorBoundaryWrapper>
  );
}

export default ErrorBoundaryWrapper;
