/**
 * Accessibility Provider - Comprehensive accessibility features
 *
 * Features:
 * - Screen reader announcements
 * - Focus management
 * - Keyboard navigation
 * - High contrast mode support
 * - Motion reduction preferences
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import { Platform, AccessibilityInfo } from "react-native";

const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [isHighContrastEnabled, setIsHighContrastEnabled] = useState(false);

  // Initialize accessibility announcer for web
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      // Create global accessibility announcer
      const announcer = document.createElement("div");
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");
      announcer.setAttribute("id", "accessibility-announcer");
      announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(announcer);

      // Global announcement function
      window.announceToScreenReader = (message, priority = "polite") => {
        announcer.setAttribute("aria-live", priority);
        announcer.textContent = message;

        // Clear after announcement
        setTimeout(() => {
          announcer.textContent = "";
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

  // Check accessibility settings on native platforms
  useEffect(() => {
    if (Platform.OS !== "web") {
      // Check if screen reader is enabled
      AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);

      // Check if reduce motion is enabled
      AccessibilityInfo.isReduceMotionEnabled().then(setIsReduceMotionEnabled);

      // Listen for changes
      const screenReaderListener = AccessibilityInfo.addEventListener(
        "screenReaderChanged",
        setIsScreenReaderEnabled,
      );

      const reduceMotionListener = AccessibilityInfo.addEventListener(
        "reduceMotionChanged",
        setIsReduceMotionEnabled,
      );

      return () => {
        screenReaderListener?.remove();
        reduceMotionListener?.remove();
      };
    } else if (typeof window !== "undefined") {
      // Check web accessibility preferences
      const checkWebAccessibility = () => {
        // Check for prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        );
        setIsReduceMotionEnabled(prefersReducedMotion.matches);

        // Check for prefers-contrast
        const prefersHighContrast = window.matchMedia(
          "(prefers-contrast: high)",
        );
        setIsHighContrastEnabled(prefersHighContrast.matches);

        // Check for screen reader (basic detection)
        setIsScreenReaderEnabled(
          navigator.userAgent.includes("JAWS") ||
            navigator.userAgent.includes("NVDA") ||
            navigator.userAgent.includes("VoiceOver"),
        );
      };

      checkWebAccessibility();

      // Listen for media query changes
      const reduceMotionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      const highContrastQuery = window.matchMedia("(prefers-contrast: high)");

      const handleReduceMotionChange = (e) =>
        setIsReduceMotionEnabled(e.matches);
      const handleHighContrastChange = (e) =>
        setIsHighContrastEnabled(e.matches);

      if (reduceMotionQuery.addEventListener) {
        reduceMotionQuery.addEventListener("change", handleReduceMotionChange);
        highContrastQuery.addEventListener("change", handleHighContrastChange);
      } else {
        // Fallback for older browsers
        reduceMotionQuery.addListener(handleReduceMotionChange);
        highContrastQuery.addListener(handleHighContrastChange);
      }

      return () => {
        if (reduceMotionQuery.removeEventListener) {
          reduceMotionQuery.removeEventListener(
            "change",
            handleReduceMotionChange,
          );
          highContrastQuery.removeEventListener(
            "change",
            handleHighContrastChange,
          );
        } else {
          reduceMotionQuery.removeListener(handleReduceMotionChange);
          highContrastQuery.removeListener(handleHighContrastChange);
        }
      };
    }
  }, []);

  // Announce message to screen reader
  const announce = useCallback((message, priority = "polite") => {
    if (Platform.OS === "web" && window.announceToScreenReader) {
      window.announceToScreenReader(message, priority);
    } else if (Platform.OS !== "web") {
      try {
        AccessibilityInfo.announceForAccessibility(message);
      } catch (error) {
        console.warn("Failed to announce to screen reader:", error);
      }
    }
  }, []);

  // Set focus to element
  const setFocus = useCallback((elementRef) => {
    if (Platform.OS === "web" && elementRef?.current) {
      try {
        elementRef.current.focus();
      } catch (error) {
        console.warn("Failed to set focus:", error);
      }
    } else if (Platform.OS !== "web" && elementRef?.current) {
      try {
        AccessibilityInfo.setAccessibilityFocus(elementRef.current);
      } catch (error) {
        console.warn("Failed to set accessibility focus:", error);
      }
    }
  }, []);

  // Check if element should have reduced motion
  const shouldReduceMotion = useCallback(() => {
    return isReduceMotionEnabled;
  }, [isReduceMotionEnabled]);

  // Get appropriate animation duration based on preferences
  const getAnimationDuration = useCallback(
    (defaultDuration) => {
      return shouldReduceMotion() ? 0 : defaultDuration;
    },
    [shouldReduceMotion],
  );

  // Get appropriate animation config for accessibility
  const getAccessibleAnimationConfig = useCallback(
    (config) => {
      if (shouldReduceMotion()) {
        return {
          ...config,
          duration: 0,
          useNativeDriver: true,
        };
      }
      return config;
    },
    [shouldReduceMotion],
  );

  // Check if high contrast mode is enabled
  const isHighContrast = useCallback(() => {
    return isHighContrastEnabled;
  }, [isHighContrastEnabled]);

  // Get accessible colors based on contrast preferences
  const getAccessibleColors = useCallback(
    (colors) => {
      if (isHighContrast()) {
        return {
          ...colors,
          // High contrast color overrides
          primary: "#000000",
          secondary: "#ffffff",
          text: "#000000",
          background: "#ffffff",
          border: "#000000",
        };
      }
      return colors;
    },
    [isHighContrast],
  );

  // Context value
  const contextValue = useMemo(
    () => ({
      // State
      isScreenReaderEnabled,
      isReduceMotionEnabled,
      isHighContrastEnabled,

      // Functions
      announce,
      setFocus,
      shouldReduceMotion,
      getAnimationDuration,
      getAccessibleAnimationConfig,
      isHighContrast,
      getAccessibleColors,

      // Utilities
      createAccessibleTouchable: (props) => ({
        ...props,
        accessible: true,
        accessibilityRole: props.accessibilityRole || "button",
        accessibilityLabel: props.accessibilityLabel || props.children,
        accessibilityHint: props.accessibilityHint,
      }),

      createAccessibleText: (props) => ({
        ...props,
        accessible: true,
        accessibilityRole: "text",
      }),
    }),
    [
      isScreenReaderEnabled,
      isReduceMotionEnabled,
      isHighContrastEnabled,
      announce,
      setFocus,
      shouldReduceMotion,
      getAnimationDuration,
      getAccessibleAnimationConfig,
      isHighContrast,
      getAccessibleColors,
    ],
  );

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook to use accessibility features
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);

  if (!context) {
    console.warn("useAccessibility must be used within AccessibilityProvider");

    // Return fallback functions to prevent crashes
    return {
      isScreenReaderEnabled: false,
      isReduceMotionEnabled: false,
      isHighContrastEnabled: false,
      announce: (message) => console.log("Announce:", message),
      setFocus: () => {},
      shouldReduceMotion: () => false,
      getAnimationDuration: (duration) => duration,
      getAccessibleAnimationConfig: (config) => config,
      isHighContrast: () => false,
      getAccessibleColors: (colors) => colors,
      createAccessibleTouchable: (props) => props,
      createAccessibleText: (props) => props,
    };
  }

  return context;
};

export default AccessibilityProvider;
