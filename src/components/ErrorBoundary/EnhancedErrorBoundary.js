/**
 * Enhanced Error Boundary - Modern error handling for React components
 * Provides graceful error recovery with detailed logging and user feedback
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

class EnhancedErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36),
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Enhanced error logging
    const errorReport = {
      message: error.message,
      stack: error.stack?.substring(0, 1000), // Limit stack trace length
      componentStack: errorInfo.componentStack?.substring(0, 500),
      timestamp: new Date().toISOString(),
      platform: Platform.OS,
      retryCount: this.state.retryCount,
      props: this.sanitizeProps(this.props),
    };

    console.error('🚨 Enhanced Error Boundary caught error:', errorReport);

    // Report to external service in production
    if (!__DEV__ && this.props.onError) {
      this.props.onError(errorReport);
    }

    // Announce to screen readers
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const announcement = 'An error occurred. Recovery options are available.';
      this.announceToScreenReader(announcement);
    }
  }

  sanitizeProps = (props) => {
    // Remove sensitive data and functions from props logging
    const sanitized = {};
    Object.keys(props).forEach(key => {
      const value = props[key];
      if (typeof value === 'function') {
        sanitized[key] = '[Function]';
      } else if (key.toLowerCase().includes('password') || key.toLowerCase().includes('token')) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = '[Object]';
      } else if (typeof value === 'string' && value.length > 100) {
        sanitized[key] = value.substring(0, 100) + '...';
      } else {
        sanitized[key] = value;
      }
    });
    return sanitized;
  };

  announceToScreenReader = (message) => {
    if (Platform.OS === 'web') {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'assertive');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.textContent = message;
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
  };

  handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;
    
    // Limit retry attempts
    if (newRetryCount > 3) {
      console.warn('Maximum retry attempts reached');
      return;
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: newRetryCount,
    });

    if (this.props.onRetry) {
      this.props.onRetry(newRetryCount);
    }
  };

  handleReportError = () => {
    if (this.props.onReportError) {
      this.props.onReportError({
        error: this.state.error,
        errorInfo: this.state.errorInfo,
        errorId: this.state.errorId,
      });
    }
  };

  getTheme = () => {
    return this.props.theme || {
      colors: {
        background: { primary: '#FFFFFF', secondary: '#F8FAFC' },
        text: { primary: '#0F172A', secondary: '#64748B' },
        error: { 500: '#EF4444' },
        primary: { 500: '#3B82F6' },
        success: { 500: '#10B981' },
      },
      getShadow: () => ({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }),
    };
  };

  render() {
    if (this.state.hasError) {
      const theme = this.getTheme();
      const canRetry = this.state.retryCount < 3;

      const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background.primary,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        },
        scrollContainer: {
          flexGrow: 1,
          justifyContent: 'center',
          maxWidth: 400,
        },
        errorIcon: {
          fontSize: 48,
          textAlign: 'center',
          marginBottom: 16,
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          color: theme.colors.text.primary,
          textAlign: 'center',
          marginBottom: 8,
        },
        subtitle: {
          fontSize: 16,
          color: theme.colors.text.secondary,
          textAlign: 'center',
          marginBottom: 24,
          lineHeight: 24,
        },
        errorId: {
          fontSize: 12,
          color: theme.colors.text.secondary,
          textAlign: 'center',
          marginBottom: 24,
          fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        },
        buttonContainer: {
          gap: 12,
          width: '100%',
        },
        button: {
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 12,
          alignItems: 'center',
          ...theme.getShadow(),
        },
        primaryButton: {
          backgroundColor: theme.colors.primary[500],
        },
        secondaryButton: {
          backgroundColor: theme.colors.background.secondary,
          borderWidth: 1,
          borderColor: theme.colors.text.secondary,
        },
        dangerButton: {
          backgroundColor: theme.colors.error[500],
        },
        disabledButton: {
          opacity: 0.5,
        },
        buttonText: {
          fontSize: 16,
          fontWeight: '600',
        },
        primaryButtonText: {
          color: '#FFFFFF',
        },
        secondaryButtonText: {
          color: theme.colors.text.primary,
        },
        errorDetails: {
          marginTop: 24,
          padding: 16,
          backgroundColor: theme.colors.background.secondary,
          borderRadius: 8,
          maxHeight: 200,
        },
        errorDetailsTitle: {
          fontSize: 14,
          fontWeight: '600',
          color: theme.colors.text.primary,
          marginBottom: 8,
        },
        errorDetailsText: {
          fontSize: 12,
          color: theme.colors.text.secondary,
          fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
          lineHeight: 16,
        },
      });

      return (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.errorIcon}>⚠️</Text>
            
            <Text style={styles.title}>
              {this.props.title || 'Something went wrong'}
            </Text>
            
            <Text style={styles.subtitle}>
              {this.props.subtitle || 
               'We encountered an unexpected error. You can try again or report this issue to help us improve.'}
            </Text>

            <Text style={styles.errorId}>
              Error ID: {this.state.errorId}
            </Text>

            <View style={styles.buttonContainer}>
              {canRetry && (
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={this.handleRetry}
                  accessibilityLabel="Retry the operation"
                  accessibilityRole="button"
                >
                  <Text style={[styles.buttonText, styles.primaryButtonText]}>
                    Try Again ({3 - this.state.retryCount} attempts left)
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={this.handleReportError}
                accessibilityLabel="Report this error"
                accessibilityRole="button"
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Report Issue
                </Text>
              </TouchableOpacity>

              {this.props.fallbackComponent && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => this.props.onFallback?.()}
                  accessibilityLabel="Use fallback interface"
                  accessibilityRole="button"
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    Use Safe Mode
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorDetailsTitle}>
                  Development Details:
                </Text>
                <ScrollView style={{ maxHeight: 150 }}>
                  <Text style={styles.errorDetailsText}>
                    {this.state.error.message}
                    {'\n\n'}
                    {this.state.error.stack?.substring(0, 500)}
                  </Text>
                </ScrollView>
              </View>
            )}
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

export default EnhancedErrorBoundary;
