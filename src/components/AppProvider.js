/**
 * App Provider Component
 * Comprehensive wrapper that provides all necessary context and optimizations
 * Integrates accessibility, performance, and mental health-specific features
 */

import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { ThemeProvider } from '../shared/theme/ThemeContext';
import { initializeWebOptimizations } from '../utils/webOptimizations';

// Web-only imports with fallbacks
let ErrorBoundary = null;
if (Platform.OS === 'web') {
  try {
    const ReactErrorBoundary = require('react-error-boundary');
    ErrorBoundary = ReactErrorBoundary.ErrorBoundary;
  } catch (error) {
    console.warn('react-error-boundary not available, using fallback');
  }
}

// Fallback Error Boundary for React Native
const FallbackErrorBoundary = ({ children, fallback }) => {
  try {
    return children;
  } catch (error) {
    console.error('App Error:', error);
    return fallback || null;
  }
};

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div 
    role="alert" 
    style={{
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      borderRadius: '8px',
      margin: '20px'
    }}
  >
    <h2 style={{ color: '#c33', marginBottom: '16px' }}>
      Something went wrong
    </h2>
    <p style={{ marginBottom: '16px', color: '#666' }}>
      We apologize for the inconvenience. Please try refreshing the page.
    </p>
    <details style={{ marginBottom: '16px', textAlign: 'left' }}>
      <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
        Error details (for developers)
      </summary>
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '8px', 
        borderRadius: '4px',
        fontSize: '12px',
        overflow: 'auto'
      }}>
        {error.message}
      </pre>
    </details>
    {resetErrorBoundary && (
      <button 
        onClick={resetErrorBoundary}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    )}
  </div>
);

// Performance monitoring component
const PerformanceMonitor = ({ children }) => {
  useEffect(() => {
    if (__DEV__ && Platform.OS === 'web' && typeof performance !== 'undefined') {
      // Monitor performance metrics
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            console.log(`Performance: ${entry.name} took ${entry.duration}ms`);
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (e) {
        // Performance API not fully supported
        console.warn('Performance monitoring not available');
      }

      return () => observer.disconnect();
    }
  }, []);

  return children;
};

// Accessibility announcer component
const AccessibilityAnnouncer = ({ children }) => {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Create global accessibility announcer
      const announcer = document.createElement('div');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(announcer);

      // Global announcement function
      window.announceToScreenReader = (message, priority = 'polite') => {
        announcer.setAttribute('aria-live', priority);
        announcer.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
          announcer.textContent = '';
        }, 1000);
      };

      return () => {
        if (document.body.contains(announcer)) {
          document.body.removeChild(announcer);
        }
        delete window.announceToScreenReader;
      };
    }
  }, []);

  return children;
};

// Mental health app specific provider
const MentalHealthProvider = ({ children }) => {
  useEffect(() => {
    // Initialize mental health specific features
    if (Platform.OS === 'web') {
      initializeWebOptimizations();
    }

    // Set up crisis mode keyboard shortcut
    const handleCrisisShortcut = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'H') {
        event.preventDefault();
        
        // Announce emergency mode activation
        if (window.announceToScreenReader) {
          window.announceToScreenReader('Emergency support mode activated', 'assertive');
        }
        
        // Trigger emergency help
        const emergencyEvent = new CustomEvent('mentalHealthEmergency', {
          detail: { source: 'keyboard_shortcut' }
        });
        window.dispatchEvent(emergencyEvent);
      }
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('keydown', handleCrisisShortcut);
      return () => window.removeEventListener('keydown', handleCrisisShortcut);
    }
  }, []);

  return children;
};

// Privacy protection component
const PrivacyProtection = ({ children }) => {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Prevent sensitive content from being cached
      const metaTag = document.createElement('meta');
      metaTag.httpEquiv = 'Cache-Control';
      metaTag.content = 'no-cache, no-store, must-revalidate';
      document.head.appendChild(metaTag);

      // Disable browser password saving for sensitive forms
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              // Find sensitive inputs
              const sensitiveInputs = node.querySelectorAll 
                ? node.querySelectorAll('input[data-sensitive], textarea[data-sensitive]')
                : [];
              
              sensitiveInputs.forEach((input) => {
                input.setAttribute('autocomplete', 'off');
                input.setAttribute('data-lpignore', 'true'); // LastPass ignore
              });
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
        if (document.head.contains(metaTag)) {
          document.head.removeChild(metaTag);
        }
      };
    }
  }, []);

  return children;
};

// Main App Provider component
export const AppProvider = ({ children }) => {
  const ErrorBoundaryComponent = ErrorBoundary || FallbackErrorBoundary;

  return (
    <ErrorBoundaryComponent
      fallback={<ErrorFallback />}
      onError={(error, errorInfo) => {
        console.error('App Error Boundary:', error, errorInfo);
        
        // Track errors in production (without sensitive data)
        if (!__DEV__ && typeof window !== 'undefined') {
          // Could integrate with error tracking service here
          console.log('Error tracked for mental health app');
        }
      }}
    >
      <ThemeProvider>
        <PerformanceMonitor>
          <AccessibilityAnnouncer>
            <MentalHealthProvider>
              <PrivacyProtection>
                {children}
              </PrivacyProtection>
            </MentalHealthProvider>
          </AccessibilityAnnouncer>
        </PerformanceMonitor>
      </ThemeProvider>
    </ErrorBoundaryComponent>
  );
};

// Hook for accessing app-wide features
export const useAppFeatures = () => {
  return {
    announceToScreenReader: (message, priority = 'polite') => {
      if (Platform.OS === 'web' && window.announceToScreenReader) {
        window.announceToScreenReader(message, priority);
      } else if (Platform.OS !== 'web') {
        // Use React Native AccessibilityInfo
        try {
          const { AccessibilityInfo } = require('react-native');
          AccessibilityInfo.announceForAccessibility(message);
        } catch (error) {
          console.warn('AccessibilityInfo not available');
        }
      }
    },
    
    triggerEmergencyMode: () => {
      const event = new CustomEvent('mentalHealthEmergency', {
        detail: { source: 'manual_trigger' }
      });
      
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.dispatchEvent(event);
      } else {
        // Handle emergency mode for React Native
        console.log('Emergency mode triggered');
      }
    },
    
    trackPerformance: (name, fn) => {
      if (__DEV__ && Platform.OS === 'web' && typeof performance !== 'undefined') {
        performance.mark(`${name}-start`);
        const result = fn();
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        return result;
      }
      return fn();
    },
  };
};

export default AppProvider;