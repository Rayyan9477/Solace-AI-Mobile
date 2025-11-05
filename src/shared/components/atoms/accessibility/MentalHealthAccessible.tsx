/**
 * Mental Health Accessible Component
 *
 * Specialized accessibility wrapper for mental health app interactions
 * with enhanced cognitive accessibility and crisis-sensitive features
 */

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  AccessibilityInfo,
  StyleSheet,
  Animated,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import {
  WCAG_CONSTANTS,
  FocusManagement,
} from "../../shared/utils/accessibility";

const MentalHealthAccessible = ({
  children,
  type = "default", // 'crisis', 'mood', 'therapy', 'assessment', 'default'
  priority = "normal", // 'critical', 'high', 'normal', 'low'
  cognitiveSupport = true,
  enhancedTouchTarget = false,
  crisisContext = false,
  onPress,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "button",
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const componentRef = useRef(null);

  // Enhanced touch target sizing for mental health context
  const getTouchTargetSize = () => {
    const baseSize = WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE;

    if (crisisContext) return baseSize + 8; // 52x52 for crisis
    if (enhancedTouchTarget) return baseSize + 4; // 48x48 for enhanced
    return baseSize; // 44x44 standard
  };

  // Generate context-aware accessibility props
  const getAccessibilityProps = () => {
    const baseProps = {
      accessible: true,
      accessibilityRole,
      accessibilityLabel,
      accessibilityHint,
      testID: testID || `mh-accessible-${type}`,
    };

    // Crisis-specific enhancements
    if (crisisContext || type === "crisis") {
      return {
        ...baseProps,
        accessibilityLiveRegion: "assertive",
        accessibilityRole: "button",
        accessibilityHint: `${accessibilityHint} - Crisis support feature`,
        accessibilityState: {
          expanded: false,
        },
      };
    }

    // Therapy-specific context
    if (type === "therapy") {
      return {
        ...baseProps,
        accessibilityHint: `${accessibilityHint} - Therapy session feature`,
        accessibilityTraits: ["button", "startsMediaSession"],
      };
    }

    // Mood tracking context
    if (type === "mood") {
      return {
        ...baseProps,
        accessibilityHint: `${accessibilityHint} - Mood tracking feature`,
        accessibilityState: {
          selected: props.selected || false,
        },
      };
    }

    // Assessment context
    if (type === "assessment") {
      return {
        ...baseProps,
        accessibilityHint: `${accessibilityHint} - Mental health assessment feature`,
      };
    }

    return baseProps;
  };

  // Enhanced press handler with mental health context
  const handlePress = () => {
    if (!onPress) return;

    // Haptic feedback for crisis situations
    if (crisisContext) {
      // Stronger haptic feedback for crisis buttons
      if (typeof Haptics !== "undefined") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    }

    // Announce action completion
    const actionMessages = {
      crisis: "Opening crisis support resources",
      mood: "Mood selection recorded",
      therapy: "Starting therapy session",
      assessment: "Assessment question answered",
      default: "Action completed",
    };

    const message = actionMessages[type] || actionMessages.default;
    FocusManagement.announceForScreenReader(
      message,
      crisisContext ? "assertive" : "polite",
    );

    onPress();
  };

  // Enhanced focus handlers
  const handleFocus = () => {
    setIsFocused(true);

    // Announce focus with mental health context
    const focusMessages = {
      crisis: `Focused on crisis support: ${accessibilityLabel}`,
      mood: `Focused on mood option: ${accessibilityLabel}`,
      therapy: `Focused on therapy feature: ${accessibilityLabel}`,
      assessment: `Focused on assessment: ${accessibilityLabel}`,
      default: `Focused on: ${accessibilityLabel}`,
    };

    const message = focusMessages[type] || focusMessages.default;
    FocusManagement.announceForScreenReader(message, "polite");
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Cognitive support styles
  const getCognitiveStyles = () => {
    if (!cognitiveSupport) return {};

    const priorityColors = {
      critical: {
        borderColor: theme.colors.error["400"],
        backgroundColor: theme.colors.error["50"],
      },
      high: {
        borderColor: theme.colors.warning["400"],
        backgroundColor: theme.colors.warning["50"],
      },
      normal: {
        borderColor: theme.colors.primary["200"],
        backgroundColor: "transparent",
      },
    };

    return {
      borderWidth: crisisContext ? 2 : 1,
      borderRadius: theme.borderRadius?.lg || 12,
      ...priorityColors[priority],
    };
  };

  // Focus styles
  const getFocusStyles = () => {
    if (!isFocused) return {};

    return {
      borderWidth: WCAG_CONSTANTS.FOCUS_OUTLINE_WIDTH,
      borderColor: crisisContext
        ? theme.colors.error["500"]
        : theme.colors.primary["500"],
      shadowColor: crisisContext
        ? theme.colors.error["500"]
        : theme.colors.primary["500"],
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: crisisContext ? 8 : 4,
    };
  };

  const touchTargetSize = getTouchTargetSize();

  return (
    <TouchableOpacity
      ref={componentRef}
      onPress={handlePress}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={[
        styles.container,
        {
          minWidth: touchTargetSize,
          minHeight: touchTargetSize,
        },
        getCognitiveStyles(),
        getFocusStyles(),
        props.style,
      ]}
      {...getAccessibilityProps()}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
});

export default MentalHealthAccessible;

// Hook for mental health accessibility features
export const useMentalHealthAccessibility = (type = "default") => {
  const announceForMentalHealth = (message, priority = "polite") => {
    const contextualMessage =
      type === "crisis"
        ? `Crisis support: ${message}`
        : type === "therapy"
          ? `Therapy session: ${message}`
          : message;

    FocusManagement.announceForScreenReader(
      contextualMessage,
      type === "crisis" ? "assertive" : priority,
    );
  };

  const focusWithContext = (ref, message) => {
    if (ref.current) {
      ref.current.focus();
      announceForMentalHealth(message || "Focus moved");
    }
  };

  return {
    announceForMentalHealth,
    focusWithContext,
  };
};

export { MentalHealthAccessible };
