/**
 * Mental Health Provider - Specialized provider for mental health app features
 *
 * Features:
 * - Crisis intervention keyboard shortcuts
 * - Emergency support integration
 * - Mental health specific optimizations
 * - Privacy protection features
 * - Accessibility enhancements
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Platform } from "react-native";

const MentalHealthContext = createContext(null);

export const MentalHealthProvider = ({ children }) => {
  // Crisis intervention handler
  const handleCrisisShortcut = useCallback((event) => {
    if (event.ctrlKey && event.shiftKey && event.key === "H") {
      event.preventDefault();

      // Announce emergency mode activation
      announceToScreenReader("Emergency support mode activated", "assertive");

      // Trigger emergency help
      const emergencyEvent = new CustomEvent("mentalHealthEmergency", {
        detail: { source: "keyboard_shortcut" },
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(emergencyEvent);
      }
    }
  }, []);

  // Accessibility announcer
  const announceToScreenReader = useCallback((message, priority = "polite") => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (window.announceToScreenReader) {
        window.announceToScreenReader(message, priority);
      }
    } else if (Platform.OS !== "web") {
      // Use React Native AccessibilityInfo
      try {
        const { AccessibilityInfo } = require("react-native");
        AccessibilityInfo.announceForAccessibility(message);
      } catch (error) {
        console.warn("AccessibilityInfo not available:", error);
      }
    }
  }, []);

  // Emergency mode trigger
  const triggerEmergencyMode = useCallback(() => {
    const event = new CustomEvent("mentalHealthEmergency", {
      detail: { source: "manual_trigger" },
    });

    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.dispatchEvent(event);
    } else {
      // Handle emergency mode for React Native
      console.log("🆘 Emergency mode triggered");
      announceToScreenReader("Emergency support activated", "assertive");
    }
  }, [announceToScreenReader]);

  // Performance tracking for mental health features
  const trackPerformance = useCallback((name, fn) => {
    if (
      __DEV__ &&
      Platform.OS === "web" &&
      typeof performance !== "undefined"
    ) {
      performance.mark(`${name}-start`);
      const result = fn();
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      return result;
    }
    return fn();
  }, []);

  // Initialize mental health specific features
  useEffect(() => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      // Set up crisis mode keyboard shortcut
      window.addEventListener("keydown", handleCrisisShortcut);

      // Initialize web optimizations for mental health apps
      const initWebOptimizations = async () => {
        try {
          // Prevent sensitive content from being cached
          const metaTag = document.createElement("meta");
          metaTag.httpEquiv = "Cache-Control";
          metaTag.content = "no-cache, no-store, must-revalidate";
          document.head.appendChild(metaTag);

          // Add privacy meta tag
          const privacyTag = document.createElement("meta");
          privacyTag.name = "robots";
          privacyTag.content = "noindex, nofollow, noarchive, nosnippet";
          document.head.appendChild(privacyTag);

          // Set up sensitive input protection
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                  const sensitiveInputs = node.querySelectorAll
                    ? node.querySelectorAll(
                        "input[data-sensitive], textarea[data-sensitive]",
                      )
                    : [];

                  sensitiveInputs.forEach((input) => {
                    input.setAttribute("autocomplete", "off");
                    input.setAttribute("data-lpignore", "true");
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
            if (document.head.contains(privacyTag)) {
              document.head.removeChild(privacyTag);
            }
          };
        } catch (error) {
          console.warn("Failed to initialize web optimizations:", error);
        }
      };

      initWebOptimizations();

      return () => {
        window.removeEventListener("keydown", handleCrisisShortcut);
      };
    }
  }, [handleCrisisShortcut]);

  // Context value with memoization for performance
  const contextValue = useMemo(
    () => ({
      announceToScreenReader,
      triggerEmergencyMode,
      trackPerformance,
      features: {
        crisisDetection: true,
        privacyProtection: true,
        accessibilityEnhancement: true,
      },
    }),
    [announceToScreenReader, triggerEmergencyMode, trackPerformance],
  );

  return (
    <MentalHealthContext.Provider value={contextValue}>
      {children}
    </MentalHealthContext.Provider>
  );
};

// Custom hook to use mental health features
export const useMentalHealth = () => {
  const context = useContext(MentalHealthContext);

  if (!context) {
    console.warn("useMentalHealth must be used within MentalHealthProvider");

    // Return fallback functions to prevent crashes
    return {
      announceToScreenReader: (message) => console.log("Announce:", message),
      triggerEmergencyMode: () => console.log("Emergency mode triggered"),
      trackPerformance: (name, fn) => fn(),
      features: {
        crisisDetection: false,
        privacyProtection: false,
        accessibilityEnhancement: false,
      },
    };
  }

  return context;
};

export default MentalHealthProvider;
