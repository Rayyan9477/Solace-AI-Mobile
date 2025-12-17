import React from "react";
import {
  TouchableOpacity,
  Pressable,
  StyleSheet,
  View,
  Text,
  Platform,
} from "react-native";

// HIGH-021 FIX: Use correct import paths with aliases
import { PLATFORM_CONFIG } from "@shared/config/environment";
import { useTheme } from "@theme/ThemeContext";
import { haptic } from "@shared/services/hapticService";
import { MentalHealthAccessibility } from "@shared/utils/accessibility";

// HIGH-021 FIX: Create compatibility layer for missing utilities
const hapticUtils = {
  impact: (style: 'light' | 'medium' | 'heavy' = 'medium') => haptic.impact(style),
  notification: (type: 'success' | 'warning' | 'error' = 'success') => haptic.notification(type),
  selection: () => haptic.selection(),
};

const accessibilityUtils = {
  createMentalHealthAccessibility: (context: string, label: string) => {
    // Map context to appropriate accessibility creator
    switch (context) {
      case 'mood':
      case 'mood-selector':
        return MentalHealthAccessibility.moodTracker.moodSelection(label, false);
      case 'crisis':
      case 'crisis-button':
        return MentalHealthAccessibility.buttons.therapeutic(label, 'Double tap for immediate support');
      case 'assessment':
      case 'assessment-question':
        return MentalHealthAccessibility.assessment.answerOption(label, false);
      case 'chat':
      case 'chat-message':
        return MentalHealthAccessibility.chat.message(false, label);
      default:
        return MentalHealthAccessibility.buttons.primary(label, undefined);
    }
  },
};

// Enhanced touchable component with mental health accessibility considerations
const AccessibleTouchable = ({
  children,
  onPress,
  onLongPress,
  disabled = false,
  hapticFeedback = true,
  hapticType = "impact",
  hapticStyle = "medium",

  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "button",
  accessibilityState,
  accessibilityContext = "general", // 'general', 'mood', 'crisis', 'assessment', 'chat'

  // Mental health specific props
  crisisLevel = "normal", // 'normal', 'elevated', 'high', 'crisis'
  supportiveMode = false, // Use gentler feedback and interactions

  // Touch target props
  minTouchTarget = true,
  customTouchSize,

  // Visual props
  style,
  pressedStyle,
  disabledStyle,

  // Advanced interaction props
  delayLongPress = 500,
  pressRetentionOffset = { top: 10, left: 10, right: 10, bottom: 10 },

  ...otherProps
}) => {
  const { theme } = useTheme();

  // Create accessibility props based on context
  const getContextualAccessibility = () => {
    const baseProps = {
      accessible: true,
      accessibilityRole,
      accessibilityLabel,
      accessibilityHint,
      accessibilityState: {
        disabled,
        ...accessibilityState,
      },
    };

    return accessibilityUtils.createMentalHealthAccessibility(
      accessibilityContext,
      accessibilityLabel || "Interactive element",
    );
  };

  // Handle press with appropriate feedback
  const handlePress = () => {
    if (disabled) return;

    // Provide haptic feedback based on crisis level
    if (hapticFeedback && PLATFORM_CONFIG.features.hapticFeedback) {
      if (crisisLevel === "crisis") {
        hapticUtils.notification("warning");
      } else if (supportiveMode) {
        hapticUtils.impact("light"); // Gentler feedback
      } else {
        hapticUtils[hapticType](hapticStyle);
      }
    }

    onPress?.();
  };

  const handleLongPress = () => {
    if (disabled || !onLongPress) return;

    if (hapticFeedback && PLATFORM_CONFIG.features.hapticFeedback) {
      if (supportiveMode) {
        hapticUtils.impact("medium");
      } else {
        hapticUtils.notification("success");
      }
    }

    onLongPress();
  };

  // Calculate touch target size
  const getTouchTargetStyle = () => {
    if (!minTouchTarget && !customTouchSize) return {};

    const defaultSize = supportiveMode ? 48 : 44; // Larger for mental health contexts
    const size = customTouchSize || defaultSize;

    return {
      minWidth: size,
      minHeight: size,
    };
  };

  // Get style based on crisis level
  const getCrisisLevelStyle = () => {
    switch (crisisLevel) {
      case "elevated":
        return {
          backgroundColor: theme.colors.therapeutic.calming[50],
          borderColor: theme.colors.therapeutic.calming[200],
          borderWidth: 1,
        };
      case "high":
        return {
          backgroundColor: theme.colors.therapeutic.grounding[50],
          borderColor: theme.colors.therapeutic.grounding[300],
          borderWidth: 2,
        };
      case "crisis":
        return {
          backgroundColor: theme.colors.error["50"],
          borderColor: theme.colors.error["300"],
          borderWidth: 2,
          shadowColor: theme.colors.error["500"],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        };
      default:
        return {};
    }
  };

  // Get pressed state style
  const getPressedStateStyle = () => {
    if (pressedStyle) return pressedStyle;

    return supportiveMode
      ? { opacity: 0.8, transform: [{ scale: 0.98 }] }
      : { opacity: 0.7, transform: [{ scale: 0.95 }] };
  };

  // Get disabled state style
  const getDisabledStateStyle = () => {
    if (disabledStyle) return disabledStyle;

    return {
      opacity: supportiveMode ? 0.5 : 0.4,
      transform: supportiveMode ? [] : [{ scale: 0.98 }],
    };
  };

  // Combine all styles
  const combinedStyle = [
    styles.touchable,
    getTouchTargetStyle(),
    getCrisisLevelStyle(),
    style,
    disabled && getDisabledStateStyle(),
  ];

  // Choose appropriate touchable component
  const TouchableComponent = Platform.select({
    web: Pressable,
    default: TouchableOpacity,
  });

  if (Platform.OS === "web") {
    // Web-specific implementation with Pressable
    return (
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={disabled}
        style={({ pressed }) => [
          combinedStyle,
          pressed && getPressedStateStyle(),
        ]}
        delayLongPress={delayLongPress}
        pressRetentionOffset={pressRetentionOffset}
        {...getContextualAccessibility()}
        {...otherProps}
      >
        {children}
      </Pressable>
    );
  }

  // Native implementation with TouchableOpacity
  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={disabled}
      style={combinedStyle}
      activeOpacity={supportiveMode ? 0.8 : 0.7}
      delayLongPress={delayLongPress}
      pressRetentionOffset={pressRetentionOffset}
      {...getContextualAccessibility()}
      {...otherProps}
    >
      {children}
    </TouchableOpacity>
  );
};

// Specialized touchable components for different mental health contexts
const MoodSelectorTouchable = ({
  mood,
  selected,
  onPress,
  children,
  ...props
}) => (
  <AccessibleTouchable
    onPress={onPress}
    accessibilityContext="mood-selector"
    accessibilityLabel={`${mood} mood`}
    accessibilityHint={`Double tap to select ${mood} as your current mood`}
    accessibilityState={{ selected }}
    supportiveMode
    hapticType="selection"
    style={[styles.moodSelector, selected && styles.moodSelectorSelected]}
    {...props}
  >
    {children}
  </AccessibleTouchable>
);

const CrisisButtonTouchable = ({
  onPress,
  children,
  level = "high",
  ...props
}) => (
  <AccessibleTouchable
    onPress={onPress}
    accessibilityContext="crisis-button"
    accessibilityLabel="Emergency support"
    accessibilityHint="Double tap for immediate crisis support resources"
    crisisLevel={level}
    hapticType="notification"
    hapticStyle="warning"
    minTouchTarget
    customTouchSize={56} // Larger for crisis situations
    style={styles.crisisButton}
    {...props}
  >
    {children}
  </AccessibleTouchable>
);

const AssessmentOptionTouchable = ({
  option,
  selected,
  onPress,
  children,
  ...props
}) => (
  <AccessibleTouchable
    onPress={onPress}
    accessibilityContext="assessment-question"
    accessibilityLabel={option}
    accessibilityHint="Double tap to select this response option"
    accessibilityState={{ selected }}
    supportiveMode
    hapticType="impact"
    hapticStyle="light"
    style={[
      styles.assessmentOption,
      selected && styles.assessmentOptionSelected,
    ]}
    {...props}
  >
    {children}
  </AccessibleTouchable>
);

const ChatMessageTouchable = ({
  message,
  isUser,
  onPress,
  onLongPress,
  children,
  ...props
}) => (
  <AccessibleTouchable
    onPress={onPress}
    onLongPress={onLongPress}
    accessibilityContext="chat-message"
    accessibilityRole="text"
    accessibilityLabel={`${isUser ? "Your" : "AI therapist"} message: ${message}`}
    accessibilityHint="Double tap to hear message, long press for options"
    supportiveMode
    hapticType="impact"
    hapticStyle="light"
    delayLongPress={800} // Longer delay for accidental long presses
    style={styles.chatMessage}
    {...props}
  >
    {children}
  </AccessibleTouchable>
);

// Wrapper component for form elements with enhanced accessibility
const FormFieldTouchable = ({
  label,
  required = false,
  error,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <AccessibleTouchable
      accessibilityLabel={`${label}${required ? ", required" : ""}${error ? `, error: ${error}` : ""}`}
      accessibilityHint="Double tap to interact with this form field"
      supportiveMode
      hapticType="impact"
      hapticStyle="light"
      style={[
        styles.formField,
        error && { borderColor: theme.colors.therapeutic.nurturing[300] },
      ]}
      {...props}
    >
      {children}
    </AccessibleTouchable>
  );
};

const styles = StyleSheet.create({
  touchable: {
    alignItems: "center",
    justifyContent: "center",
  },
  moodSelector: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: 48,
    minHeight: 48,
  },
  moodSelectorSelected: {
    transform: [{ scale: 1.05 }],
  },
  crisisButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 56,
    minHeight: 56,
  },
  assessmentOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    minWidth: 48,
    minHeight: 48,
  },
  assessmentOptionSelected: {
    transform: [{ scale: 1.02 }],
  },
  chatMessage: {
    padding: 8,
    borderRadius: 8,
    minWidth: 48,
    minHeight: 48,
  },
  formField: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
    minWidth: 48,
    minHeight: 48,
  },
});

// LOW-014 FIX: Add displayName for all components for debugging and React DevTools
AccessibleTouchable.displayName = "AccessibleTouchable";
MoodSelectorTouchable.displayName = "MoodSelectorTouchable";
CrisisButtonTouchable.displayName = "CrisisButtonTouchable";
AssessmentOptionTouchable.displayName = "AssessmentOptionTouchable";
ChatMessageTouchable.displayName = "ChatMessageTouchable";
FormFieldTouchable.displayName = "FormFieldTouchable";

export default AccessibleTouchable;
export {
  MoodSelectorTouchable,
  CrisisButtonTouchable,
  AssessmentOptionTouchable,
  ChatMessageTouchable,
  FormFieldTouchable,
};
