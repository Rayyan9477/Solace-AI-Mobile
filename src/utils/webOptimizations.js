/**
 * Web Performance Optimizations
 * Provides web-specific optimizations for bundle size, loading performance, and UX
 * Ensures optimal experience for web deployment of the mental health app
 */

import { Platform } from 'react-native';

// Bundle optimization utilities
export const BundleOptimizations = {
  // Lazy load components for better initial loading
  createLazyComponent: (importFunction, fallback = null) => {
    if (Platform.OS !== 'web') {
      // Return the component directly for native platforms
      return importFunction();
    }

    const React = require('react');
    const { Suspense, lazy } = React;
    
    const LazyComponent = lazy(importFunction);
    
    return (props) => (
      <Suspense fallback={fallback || <div>Loading...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    );
  },

  // Code splitting for route-based loading
  createRouteComponent: (routeImport, loadingComponent = null) => {
    if (Platform.OS !== 'web') {
      return routeImport();
    }

    return BundleOptimizations.createLazyComponent(routeImport, loadingComponent);
  },

  // Preload critical routes
  preloadCriticalRoutes: () => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    // Preload critical app routes
    const criticalRoutes = [
      () => import('../screens/MainAppScreen'),
      () => import('../screens/mood/EnhancedMoodTrackerScreen'),
      () => import('../components/ui/MentalHealthCard'),
      () => import('../components/ui/TherapeuticButton'),
    ];

    // Preload after initial render
    setTimeout(() => {
      criticalRoutes.forEach(routeImport => {
        try {
          routeImport();
        } catch (error) {
          console.warn('Failed to preload route:', error);
        }
      });
    }, 1000);
  },
};

// Web-specific performance optimizations
export const WebPerformanceOptimizations = {
  // Service Worker setup for caching
  setupServiceWorker: () => {
    if (Platform.OS !== 'web' || typeof navigator === 'undefined') {
      return;
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  },

  // Optimize images for web
  optimizeImageLoading: () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    // Add loading="lazy" to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  },

  // Resource preloading for better performance
  preloadCriticalResources: () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    const criticalResources = [
      // Fonts
      { href: '/fonts/Inter-Regular.woff2', as: 'font', type: 'font/woff2' },
      { href: '/fonts/Inter-Medium.woff2', as: 'font', type: 'font/woff2' },
      { href: '/fonts/Inter-SemiBold.woff2', as: 'font', type: 'font/woff2' },
      
      // Critical CSS
      { href: '/css/critical.css', as: 'style' },
      
      // Critical images
      { href: '/images/app-icon.png', as: 'image' },
      { href: '/images/mental-health-hero.webp', as: 'image' },
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) {
        link.type = resource.type;
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  },

  // Optimize font loading
  optimizeFontLoading: () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    // Use font-display: swap for better loading performance
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        src: url('/fonts/Inter-Variable.woff2') format('woff2');
        font-display: swap;
        font-weight: 100 900;
      }
    `;
    document.head.appendChild(style);
  },
};

// Progressive Web App optimizations
export const PWAOptimizations = {
  // Install PWA prompt handling
  setupPWAInstall: () => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      
      // Show custom install button if desired
      const installButton = document.getElementById('install-app');
      if (installButton) {
        installButton.style.display = 'block';
        
        installButton.addEventListener('click', () => {
          // Show the prompt
          deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted the A2HS prompt');
            } else {
              console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
          });
        });
      }
    });
  },

  // Offline support setup
  setupOfflineSupport: () => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    // Handle online/offline events
    window.addEventListener('online', () => {
      console.log('App is online');
      // Sync data when back online
      PWAOptimizations.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      console.log('App is offline');
      // Show offline indicator
      PWAOptimizations.showOfflineIndicator();
    });
  },

  // Sync offline data when back online
  syncOfflineData: () => {
    // Implementation would sync mood data, journal entries, etc.
    console.log('Syncing offline data...');
  },

  // Show offline indicator
  showOfflineIndicator: () => {
    // Show a subtle offline indicator in the UI
    console.log('Showing offline indicator...');
  },
};

// Web accessibility optimizations
export const WebAccessibilityOptimizations = {
  // Enhanced keyboard navigation for web
  setupKeyboardNavigation: () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
      skipLink.style.opacity = '1';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
      skipLink.style.opacity = '0';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  },

  // Enhanced focus management for modals and overlays
  setupFocusManagement: () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    // Focus trap for modals
    const createFocusTrap = (element) => {
      const focusableElements = element.querySelectorAll(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
        
        if (e.key === 'Escape') {
          // Close modal
          const closeButton = element.querySelector('[data-close-modal]');
          if (closeButton) {
            closeButton.click();
          }
        }
      };

      element.addEventListener('keydown', handleKeyDown);
      
      // Focus first element when modal opens
      if (firstElement) {
        firstElement.focus();
      }

      return () => {
        element.removeEventListener('keydown', handleKeyDown);
      };
    };

    // Apply focus trap to modals
    document.addEventListener('DOMNodeInserted', (e) => {
      if (e.target.nodeType === 1 && e.target.matches('[role="dialog"], .modal')) {
        createFocusTrap(e.target);
      }
    });
  },

  // Screen reader announcements for dynamic content
  setupScreenReaderAnnouncements: () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    // Create aria-live region for announcements
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
    window.announceToScreenReader = (message) => {
      announcer.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    };
  },
};

// Web-specific mental health app optimizations
export const MentalHealthWebOptimizations = {
  // Privacy-focused web optimizations
  setupPrivacyOptimizations: () => {
    if (Platform.OS !== 'web') {
      return;
    }

    // Disable browser autocomplete for sensitive fields
    const sensitiveFields = document.querySelectorAll(
      'input[type="password"], input[data-sensitive], textarea[data-sensitive]'
    );
    
    sensitiveFields.forEach(field => {
      field.setAttribute('autocomplete', 'off');
      field.setAttribute('data-lpignore', 'true'); // LastPass ignore
    });

    // Prevent right-click on sensitive content
    document.addEventListener('contextmenu', (e) => {
      if (e.target.closest('[data-sensitive]')) {
        e.preventDefault();
      }
    });
  },

  // Crisis mode web optimizations
  setupCrisisMode: () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') {
      return;
    }

    // Keyboard shortcuts for crisis situations
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+H for emergency help (not conflicting with common shortcuts)
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        const emergencyButton = document.querySelector('[data-emergency]');
        if (emergencyButton) {
          emergencyButton.click();
        }
      }
    });

    // Blur sensitive content when window loses focus (privacy)
    document.addEventListener('visibilitychange', () => {
      const sensitiveContent = document.querySelectorAll('[data-blur-on-hide]');
      if (document.hidden) {
        sensitiveContent.forEach(element => {
          element.style.filter = 'blur(10px)';
        });
      } else {
        sensitiveContent.forEach(element => {
          element.style.filter = 'none';
        });
      }
    });
  },

  // Therapeutic interaction optimizations
  setupTherapeuticInteractions: () => {
    if (Platform.OS !== 'web') {
      return;
    }

    // Calming cursor effects for therapeutic interactions
    const style = document.createElement('style');
    style.textContent = `
      [data-therapeutic]:hover {
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      [data-mood-selector] {
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      
      [data-mood-selector]:hover {
        transform: scale(1.05);
      }
      
      [data-crisis]:hover {
        cursor: help;
        animation: gentle-pulse 2s infinite;
      }
      
      @keyframes gentle-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
  },
};

// Initialize all web optimizations
export const initializeWebOptimizations = () => {
  if (Platform.OS !== 'web') {
    return;
  }

  console.log('Initializing web optimizations...');

  // Setup all optimizations
  BundleOptimizations.preloadCriticalRoutes();
  WebPerformanceOptimizations.setupServiceWorker();
  WebPerformanceOptimizations.preloadCriticalResources();
  WebPerformanceOptimizations.optimizeFontLoading();
  
  PWAOptimizations.setupPWAInstall();
  PWAOptimizations.setupOfflineSupport();
  
  WebAccessibilityOptimizations.setupKeyboardNavigation();
  WebAccessibilityOptimizations.setupFocusManagement();
  WebAccessibilityOptimizations.setupScreenReaderAnnouncements();
  
  MentalHealthWebOptimizations.setupPrivacyOptimizations();
  MentalHealthWebOptimizations.setupCrisisMode();
  MentalHealthWebOptimizations.setupTherapeuticInteractions();

  // Optimize images after DOM is ready
  setTimeout(() => {
    WebPerformanceOptimizations.optimizeImageLoading();
  }, 1000);

  console.log('Web optimizations initialized successfully');
};

export default {
  BundleOptimizations,
  WebPerformanceOptimizations,
  PWAOptimizations,
  WebAccessibilityOptimizations,
  MentalHealthWebOptimizations,
  initializeWebOptimizations,
};