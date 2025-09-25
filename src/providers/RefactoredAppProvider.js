/**
 * RefactoredAppProvider - Centralized app provider orchestration
 *
 * This provider replaces the previous scattered provider setup and ensures
 * proper initialization order and error handling for all app contexts.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';

// Import all providers
import { ThemeProvider } from '../design-system/theme/ThemeProvider';
import { AccessibilityProvider } from './AccessibilityProvider';
import { MentalHealthProvider } from './MentalHealthProvider';
import { PerformanceProvider } from './PerformanceProvider';

// Auth initialization
import { restoreAuthState } from '../store/slices/authSlice';

/**
 * App Initialization Component
 * Handles the initialization of auth state and other critical app setup
 */
const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const [initializationComplete, setInitializationComplete] = useState(false);
  const [initializationError, setInitializationError] = useState(null);

  const initializeApp = useCallback(async () => {
    try {
      console.log('🚀 RefactoredAppProvider: Starting app initialization...');

      // Use Promise.race to add timeout protection
      await Promise.race([
        dispatch(restoreAuthState()),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth initialization timeout')), 5000)
        )
      ]);

      console.log('✅ RefactoredAppProvider: App initialization completed successfully');
      setInitializationComplete(true);
    } catch (error) {
      console.error('❌ RefactoredAppProvider: App initialization failed:', error);
      setInitializationError(error);

      // Force complete to prevent hanging - better to show login than blank screen
      console.log('🔄 RefactoredAppProvider: Forcing initialization completion to prevent blank screen');
      setInitializationComplete(true);
    }
  }, [dispatch]);

  useEffect(() => {
    // Start initialization immediately - no artificial delay
    initializeApp();
  }, [initializeApp]);

  // Show loading state during initialization
  if (!initializationComplete) {
    return null; // Let the app handle loading through other means
  }

  return children;
};

/**
 * Enhanced Error Recovery Component
 * Provides comprehensive error recovery mechanisms for provider failures
 */
class ProviderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Provider Error Boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
      hasError: true,
    });

    // Track error in development
    if (__DEV__) {
      console.log('📍 Error occurred in provider component');
      console.log('Error:', error.message);
      console.log('Component Stack:', errorInfo.componentStack);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: this.state.retryCount + 1
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
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#fff'
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center'
          }}>
            App Initialization Error
          </Text>
          <Text style={{
            fontSize: 14,
            marginBottom: 20,
            textAlign: 'center',
            color: '#666'
          }}>
            {this.state.error?.message || 'Something went wrong during app startup'}
          </Text>
          <TouchableOpacity
            onPress={this.resetError}
            style={{
              backgroundColor: '#007AFF',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8
            }}
          >
            <Text style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold'
            }}>
              Retry ({this.state.retryCount + 1})
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <React.Suspense fallback={null}>
        {this.props.children}
      </React.Suspense>
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
export const RefactoredAppProvider = ({ children }) => {
  console.log('🌟 RefactoredAppProvider: Initializing app providers...');

  return (
    <ProviderErrorBoundary>
      <ThemeProvider>
        <AccessibilityProvider>
          <MentalHealthProvider>
            <PerformanceProvider>
              <AppInitializer>
                {children}
              </AppInitializer>
            </PerformanceProvider>
          </MentalHealthProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </ProviderErrorBoundary>
  );
};

export default RefactoredAppProvider;