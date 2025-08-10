import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

import { MentalHealthIcon } from '../components/icons';
import { useTheme } from '../contexts/ThemeContext';
import { colors, typography, spacing, borderRadius, shadows } from '../styles/theme';

/**
 * Enhanced Error Boundary for Mental Health App
 * Provides therapeutic error handling with crisis-sensitive messaging
 */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      isReporting: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    this.setState({ errorInfo });
    
    // Log error to storage for debugging
    this.logErrorToStorage(error, errorInfo);
    
    // Report to crash analytics (if implemented)
    this.reportErrorToCrashlytics(error, errorInfo);

    // Provide haptic feedback for error
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  /**
   * Log error to local storage for debugging
   */
  async logErrorToStorage(error, errorInfo) {
    try {
      const errorLog = {
        id: this.state.errorId,
        timestamp: new Date().toISOString(),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        errorInfo: {
          componentStack: errorInfo.componentStack
        },
        userAgent: navigator.userAgent || 'Unknown',
        url: window.location?.href || 'React Native',
        userId: await this.getCurrentUserId(),
        sessionId: await this.getCurrentSessionId(),
        appVersion: '1.0.0', // Should come from app config
        buildNumber: '1', // Should come from app config
      };

      // Get existing error logs
      const existingLogs = await AsyncStorage.getItem('error_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      
      // Add new error log
      logs.unshift(errorLog);
      
      // Keep only last 50 errors
      const trimmedLogs = logs.slice(0, 50);
      
      await AsyncStorage.setItem('error_logs', JSON.stringify(trimmedLogs));
      
      console.error('Error logged to storage:', errorLog);
    } catch (loggingError) {
      console.error('Failed to log error to storage:', loggingError);
    }
  }

  /**
   * Report error to crash analytics service
   */
  async reportErrorToCrashlytics(error, errorInfo) {
    try {
      // This would integrate with services like Crashlytics, Sentry, etc.
      // For now, just log to console
      console.error('Error reported to analytics:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    } catch (reportingError) {
      console.error('Failed to report error to analytics:', reportingError);
    }
  }

  /**
   * Get current user ID for error context
   */
  async getCurrentUserId() {
    try {
      const userData = await AsyncStorage.getItem('user_profile');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || 'anonymous';
      }
      return 'anonymous';
    } catch (error) {
      return 'anonymous';
    }
  }

  /**
   * Get current session ID for error context
   */
  async getCurrentSessionId() {
    try {
      const sessionData = await AsyncStorage.getItem('current_therapy_session');
      if (sessionData) {
        const session = JSON.parse(sessionData);
        return session.id || null;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Retry the component that failed
   */
  handleRetry = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  /**
   * Send error report to support
   */
  handleSendReport = async () => {
    this.setState({ isReporting: true });

    try {
      const errorReport = {
        errorId: this.state.errorId,
        timestamp: new Date().toISOString(),
        error: this.state.error?.message,
        stack: this.state.error?.stack,
        componentStack: this.state.errorInfo?.componentStack,
        retryCount: this.state.retryCount,
        userFeedback: '', // Could add feedback form
        userId: await this.getCurrentUserId(),
        sessionId: await this.getCurrentSessionId()
      };

      // Send to support endpoint (mock for now)
      console.log('Error report sent:', errorReport);
      
      Alert.alert(
        'Report Sent',
        'Thank you for helping us improve the app. Our team will review this error.',
        [{ text: 'OK' }]
      );

      if (Platform.OS === 'ios') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Failed to send error report:', error);
      Alert.alert(
        'Report Failed',
        'We couldn\'t send the error report right now. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      this.setState({ isReporting: false });
    }
  };

  /**
   * Navigate to safe screen
   */
  handleGoHome = async () => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Clear error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });

    // Navigate to home screen if navigation is available
    if (this.props.navigation) {
      this.props.navigation.navigate('Home');
    } else if (this.props.onGoHome) {
      this.props.onGoHome();
    }
  };

  /**
   * Check if error might be crisis-related
   */
  isCrisisRelatedError() {
    const errorMessage = this.state.error?.message || '';
    const crisisKeywords = ['crisis', 'emergency', 'suicide', 'harm'];
    
    return crisisKeywords.some(keyword => 
      errorMessage.toLowerCase().includes(keyword)
    );
  }

  /**
   * Get therapeutic error message based on context
   */
  getTherapeuticErrorMessage() {
    const isCrisisRelated = this.isCrisisRelatedError();
    
    if (isCrisisRelated) {
      return {
        title: "We're Here for You",
        message: "Something unexpected happened, but your safety is our priority. If you need immediate support, please use the emergency resources below.",
        priority: 'high'
      };
    }

    const retryCount = this.state.retryCount;
    
    if (retryCount === 0) {
      return {
        title: "Something Went Wrong",
        message: "Don't worry - this happens sometimes. Your progress is saved, and you can continue your mental health journey.",
        priority: 'normal'
      };
    } else if (retryCount < 3) {
      return {
        title: "Still Having Trouble",
        message: "We're working to fix this. Your wellbeing matters to us, and we want to get you back to your mental health tools.",
        priority: 'normal'
      };
    } else {
      return {
        title: "Persistent Issue",
        message: "This seems to be a recurring problem. Let's get you to a safe place and report this to our team.",
        priority: 'high'
      };
    }
  }

  render() {
    if (this.state.hasError) {
      const therapeuticMessage = this.getTherapeuticErrorMessage();
      const isCrisisRelated = this.isCrisisRelatedError();

      return (
        <ErrorFallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          therapeuticMessage={therapeuticMessage}
          isCrisisRelated={isCrisisRelated}
          retryCount={this.state.retryCount}
          isReporting={this.state.isReporting}
          onRetry={this.handleRetry}
          onSendReport={this.handleSendReport}
          onGoHome={this.handleGoHome}
          customFallback={this.props.fallback}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Error Fallback Component with therapeutic design
 */
const ErrorFallbackComponent = ({
  error,
  errorInfo,
  therapeuticMessage,
  isCrisisRelated,
  retryCount,
  isReporting,
  onRetry,
  onSendReport,
  onGoHome,
  customFallback
}) => {
  // Use custom fallback if provided
  if (customFallback) {
    return customFallback({ error, retry: onRetry, goHome: onGoHome });
  }

  const theme = {
    colors: colors,
    isDark: false // Default to light theme for error screen
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={[
          isCrisisRelated ? '#FEF2F2' : '#F8FAFC', // Red tint for crisis, blue for normal
          '#FFFFFF'
        ]}
        style={styles.backgroundGradient}
      />

      <View style={styles.contentContainer}>
        {/* Error icon */}
        <View style={[
          styles.iconContainer,
          {
            backgroundColor: isCrisisRelated ? '#FEE2E2' : '#EFF6FF'
          }
        ]}>
          <MentalHealthIcon
            name="Heart"
            size="xl"
            color={isCrisisRelated ? '#DC2626' : '#3B82F6'}
            variant="filled"
          />
        </View>

        {/* Therapeutic message */}
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {therapeuticMessage.title}
        </Text>
        
        <Text style={[styles.message, { color: colors.text.secondary }]}>
          {therapeuticMessage.message}
        </Text>

        {/* Crisis resources (if crisis-related) */}
        {isCrisisRelated && (
          <View style={[styles.crisisContainer, shadows.md]}>
            <LinearGradient
              colors={['#FECACA', '#FEE2E2']}
              style={styles.crisisCard}
            >
              <Text style={[styles.crisisTitle, { color: '#991B1B' }]}>
                Emergency Support
              </Text>
              <Text style={[styles.crisisText, { color: '#7F1D1D' }]}>
                • Crisis Line: Call or text 988{'\n'}
                • Emergency: Call 911{'\n'}
                • Crisis Text: Text HOME to 741741
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Error details (collapsed by default) */}
        <View style={styles.errorDetailsContainer}>
          <Text style={[styles.errorId, { color: colors.text.tertiary }]}>
            Error ID: {error?.name || 'Unknown'} (Attempt {retryCount + 1})
          </Text>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsContainer}>
          {/* Retry button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={onRetry}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Try again"
          >
            <LinearGradient
              colors={[colors.therapeutic.calming[500], colors.therapeutic.peaceful[500]]}
              style={styles.buttonGradient}
            >
              <MentalHealthIcon
                name="Heart"
                size="sm"
                color={colors.text.inverse}
                style={styles.buttonIcon}
              />
              <Text style={styles.primaryButtonText}>
                Try Again
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Go Home button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={onGoHome}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go to home screen"
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text.primary }]}>
              Go to Home
            </Text>
          </TouchableOpacity>
        </View>

        {/* Report button (if multiple retries) */}
        {retryCount >= 2 && (
          <TouchableOpacity
            style={[styles.reportButton]}
            onPress={onSendReport}
            disabled={isReporting}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Report this error"
          >
            <Text style={[styles.reportButtonText, { color: colors.text.tertiary }]}>
              {isReporting ? 'Sending Report...' : 'Report This Error'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Encouraging message */}
        <View style={styles.encouragementContainer}>
          <Text style={[styles.encouragementText, { color: colors.text.secondary }]}>
            Your mental health journey matters. We're here to support you through any challenges.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[8],
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[6],
    ...shadows.lg,
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    marginBottom: spacing[4],
    lineHeight: typography.lineHeights['2xl'],
  },
  message: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.normal,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed,
    marginBottom: spacing[8],
    maxWidth: 300,
  },
  crisisContainer: {
    width: '100%',
    marginBottom: spacing[6],
  },
  crisisCard: {
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  crisisTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  crisisText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.relaxed,
    textAlign: 'center',
  },
  errorDetailsContainer: {
    marginBottom: spacing[8],
    alignItems: 'center',
  },
  errorId: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.normal,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  actionsContainer: {
    width: '100%',
    gap: spacing[3],
  },
  actionButton: {
    width: '100%',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  primaryButton: {
    // Gradient applied via LinearGradient component
  },
  secondaryButton: {
    backgroundColor: colors.background.surface,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  buttonGradient: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: spacing[2],
  },
  primaryButtonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
    textAlign: 'center',
  },
  secondaryButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
  },
  reportButton: {
    marginTop: spacing[4],
    paddingVertical: spacing[2],
  },
  reportButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  encouragementContainer: {
    marginTop: spacing[8],
    maxWidth: 280,
  },
  encouragementText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    textAlign: 'center',
    lineHeight: typography.lineHeights.relaxed,
    fontStyle: 'italic',
  },
});

// Higher-order component for easier usage
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;