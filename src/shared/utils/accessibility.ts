import { logger } from "@shared/utils/logger";

/**
 * Enhanced Accessibility utilities for Solace AI Mobile App
 * Provides WCAG 2.1 AA compliant accessibility patterns across components
 *
 * Features:
 * - WCAG 2.1 AA compliance utilities
 * - Screen reader optimization
 * - Touch target validation
 * - Color contrast helpers
 * - Keyboard navigation support
 */

import { Platform, AccessibilityInfo } from "react-native";

// WCAG 2.1 AA compliant accessibility roles
export const AccessibilityRoles = {
  BUTTON: "button",
  TEXT: "text",
  HEADING: "header",
  LIST: "list",
  LIST_ITEM: "listitem",
  TAB: "tab",
  TAB_LIST: "tablist",
  SLIDER: "slider",
  SWITCH: "switch",
  IMAGE: "image",
  ALERT: "alert",
  NAVIGATION: "navigation",
  SEARCH: "search",
  FORM: "form",
  MENU: "menu",
  MENU_ITEM: "menuitem",
  RADIO: "radio",
  CHECKBOX: "checkbox",
  DIALOG: "dialog",
  GRID: "grid",
  CELL: "gridcell",
  TOOLBAR: "toolbar",
  PROGRESSBAR: "progressbar",
  ARTICLE: "article",
  BANNER: "banner",
  COMPLEMENTARY: "complementary",
  CONTENTINFO: "contentinfo",
  MAIN: "main",
  REGION: "region",
  SECTION: "section",
};

// Enhanced accessibility states for better screen reader support
export const AccessibilityStates = {
  DISABLED: "disabled",
  SELECTED: "selected",
  CHECKED: "checked",
  EXPANDED: "expanded",
  BUSY: "busy",
  PRESSED: "pressed",
  INVALID: "invalid",
  REQUIRED: "required",
  READONLY: "readonly",
  HIDDEN: "hidden",
};

export const AccessibilityTraits = {
  NONE: "none",
  BUTTON: "button",
  LINK: "link",
  HEADER: "header",
  SEARCH: "search",
  IMAGE: "image",
  SELECTED: "selected",
  PLAYS_SOUND: "playsSound",
  KEYBOARD_KEY: "keyboardKey",
  STATIC_TEXT: "staticText",
  SUMMARY_ELEMENT: "summaryElement",
  NOT_ENABLED: "notEnabled",
  UPDATES_FREQUENTLY: "updatesFrequently",
  STARTS_MEDIA_SESSION: "startsMediaSession",
  ADJUSTABLE: "adjustable",
  ALLOWS_DIRECT_INTERACTION: "allowsDirectInteraction",
  CAUSES_PAGE_TURN: "causesPageTurn",
};

/**
 * Creates accessibility props for mood-related components
 */
export const createMoodAccessibility = (
  mood,
  intensity = null,
  isSelected = false,
) => {
  const baseLabel = `${mood} mood`;
  const intensityText = intensity ? ` with ${intensity} intensity` : "";
  const selectionText = isSelected ? ", selected" : "";

  return {
    accessibilityRole: AccessibilityRoles.BUTTON,
    accessibilityLabel: `${baseLabel}${intensityText}${selectionText}`,
    accessibilityHint: isSelected
      ? "Double tap to deselect this mood"
      : "Double tap to select this mood",
    accessibilityState: {
      selected: isSelected,
    },
  };
};

/**
 * Creates accessibility props for therapeutic content
 */
export const createTherapeuticAccessibility = (
  contentType,
  title,
  description = "",
) => {
  return {
    accessibilityRole: AccessibilityRoles.BUTTON,
    accessibilityLabel: `${contentType}: ${title}`,
    accessibilityHint:
      description || `Double tap to open ${contentType.toLowerCase()}`,
  };
};

/**
 * Creates accessibility props for navigation elements
 */
export const createNavigationAccessibility = (screenName, isActive = false) => {
  return {
    accessibilityRole: AccessibilityRoles.TAB,
    accessibilityLabel: `${screenName} tab`,
    accessibilityHint: isActive
      ? `Currently viewing ${screenName}`
      : `Double tap to navigate to ${screenName}`,
    accessibilityState: {
      selected: isActive,
    },
  };
};

/**
 * Creates accessibility props for form inputs
 */
export const createFormInputAccessibility = (
  label,
  value = "",
  error = "",
  required = false,
) => {
  const requiredText = required ? ", required" : "";
  const errorText = error ? `, error: ${error}` : "";

  return {
    accessibilityLabel: `${label}${requiredText}`,
    accessibilityValue: value ? { text: value } : undefined,
    accessibilityHint: error
      ? `Please correct the error: ${error}`
      : `Enter your ${label.toLowerCase()}`,
    accessibilityInvalid: !!error,
  };
};

/**
 * Creates accessibility props for progress indicators
 */
export const createProgressAccessibility = (
  current,
  total,
  label = "Progress",
) => {
  const percentage = Math.round((current / total) * 100);

  return {
    accessibilityRole: "progressbar",
    accessibilityLabel: label,
    accessibilityValue: {
      min: 0,
      max: total,
      now: current,
      text: `${percentage}% complete`,
    },
  };
};

/**
 * Creates accessibility props for slider components
 */
export const createSliderAccessibility = (label, value, min, max, step = 1) => {
  return {
    accessibilityRole: AccessibilityRoles.SLIDER,
    accessibilityLabel: label,
    accessibilityValue: {
      min,
      max,
      now: value,
    },
    accessibilityHint: "Swipe up or down to adjust value",
    accessible: true,
  };
};

/**
 * Creates accessibility props for modal/dialog components
 */
export const createModalAccessibility = (title, description = "") => {
  return {
    accessibilityRole: AccessibilityRoles.DIALOG,
    accessibilityLabel: title,
    accessibilityHint: description,
    accessibilityViewIsModal: true,
  };
};

/**
 * Creates accessibility props for alert messages
 */
export const createAlertAccessibility = (message, type = "info") => {
  const typeLabels = {
    error: "Error",
    warning: "Warning",
    success: "Success",
    info: "Information",
  };

  return {
    accessibilityRole: AccessibilityRoles.ALERT,
    accessibilityLabel: `${typeLabels[type] || "Alert"}: ${message}`,
    accessibilityLiveRegion: "assertive",
  };
};

/**
 * Creates accessibility props for card components
 */
export const createCardAccessibility = (
  title,
  description = "",
  actionHint = "",
) => {
  return {
    accessibilityRole: AccessibilityRoles.BUTTON,
    accessibilityLabel: title,
    accessibilityHint:
      actionHint || description || "Double tap to view details",
    accessible: true,
  };
};

/**
 * Creates accessibility props for list items
 */
export const createListItemAccessibility = (
  title,
  position,
  total,
  actionHint = "",
) => {
  return {
    accessibilityRole: AccessibilityRoles.LIST_ITEM,
    accessibilityLabel: `${title}, item ${position} of ${total}`,
    accessibilityHint: actionHint || "Double tap to select",
  };
};

/**
 * Utility to announce important changes to screen readers
 */
export const announceForAccessibility = (message) => {
  // This would typically use AccessibilityInfo.announceForAccessibility
  // but we'll create a mock for now since we're in development
  logger.debug(`[Accessibility Announcement]: ${message}`);
};

/**
 * Mental health specific accessibility helpers
 */
export const MentalHealthAccessibility = {
  moodTracker: {
    moodSelection: (mood, isSelected) =>
      createMoodAccessibility(mood, null, isSelected),
    intensitySlider: (value) =>
      createSliderAccessibility("Mood intensity", value, 1, 10, 1),
    saveButton: () => ({
      accessibilityRole: AccessibilityRoles.BUTTON,
      accessibilityLabel: "Save mood entry",
      accessibilityHint: "Double tap to save your current mood and intensity",
    }),
  },

  chat: {
    message: (isUser, content) => ({
      accessibilityRole: AccessibilityRoles.TEXT,
      accessibilityLabel: isUser ? "Your message" : "AI therapist message",
      accessibilityValue: { text: content },
    }),
    sendButton: () => ({
      accessibilityRole: AccessibilityRoles.BUTTON,
      accessibilityLabel: "Send message",
      accessibilityHint: "Double tap to send your message to the AI therapist",
    }),
  },

  assessment: {
    question: (questionText, questionNumber, totalQuestions) => ({
      accessibilityRole: AccessibilityRoles.HEADING,
      accessibilityLabel: `Question ${questionNumber} of ${totalQuestions}: ${questionText}`,
    }),
    answerOption: (answer, isSelected) => ({
      accessibilityRole: AccessibilityRoles.RADIO,
      accessibilityLabel: answer,
      accessibilityState: { checked: isSelected },
      accessibilityHint: "Double tap to select this answer",
    }),
  },

  dashboard: {
    welcomeMessage: (userName) => ({
      accessibilityRole: AccessibilityRoles.HEADING,
      accessibilityLabel: `Welcome back, ${userName}`,
    }),
    quickAction: (actionName, description) => ({
      accessibilityRole: AccessibilityRoles.BUTTON,
      accessibilityLabel: actionName,
      accessibilityHint:
        description || `Double tap to ${actionName.toLowerCase()}`,
    }),
    progressCard: (title, progressValue, maxValue) => ({
      ...createProgressAccessibility(progressValue, maxValue, title),
      accessibilityHint: "View detailed progress information",
    }),
  },
  buttons: {
    primary: (label, hint) => ({
      accessibilityRole: AccessibilityRoles.BUTTON,
      accessibilityLabel: label,
      accessibilityHint: hint || `Double tap to ${label.toLowerCase()}`,
      accessibilityTraits: [AccessibilityTraits.BUTTON],
    }),
    secondary: (label, hint) => ({
      accessibilityRole: AccessibilityRoles.BUTTON,
      accessibilityLabel: label,
      accessibilityHint: hint || `Double tap to ${label.toLowerCase()}`,
      accessibilityTraits: [AccessibilityTraits.BUTTON],
    }),
    floating: (label, hint) => ({
      accessibilityRole: AccessibilityRoles.BUTTON,
      accessibilityLabel: label,
      accessibilityHint: hint || `Double tap to ${label.toLowerCase()}`,
      accessibilityTraits: [AccessibilityTraits.BUTTON],
    }),
    therapeutic: (label, hint) => ({
      accessibilityRole: AccessibilityRoles.BUTTON,
      accessibilityLabel: label,
      accessibilityHint: hint || `Double tap to ${label.toLowerCase()}`,
      accessibilityTraits: [AccessibilityTraits.BUTTON],
    }),
  },
};

// WCAG 2.1 AA Constants
export const WCAG_CONSTANTS = {
  TOUCH_TARGET_MIN_SIZE: 44, // 2.5.5 Target Size (AAA)
  COLOR_CONTRAST_AA_NORMAL: 4.5, // 1.4.3 Contrast (Minimum)
  COLOR_CONTRAST_AA_LARGE: 3.0, // 1.4.3 Contrast (Minimum) for large text
  COLOR_CONTRAST_AAA_NORMAL: 7.0, // 1.4.6 Contrast (Enhanced)
  COLOR_CONTRAST_AAA_LARGE: 4.5, // 1.4.6 Contrast (Enhanced) for large text
  LARGE_TEXT_MIN_SIZE: 18, // pt size for large text
  LARGE_TEXT_MIN_SIZE_BOLD: 14, // pt size for large bold text
  MAX_ANIMATION_DURATION: 5000, // 2.2.2 Pause, Stop, Hide
  FOCUS_OUTLINE_WIDTH: 2, // Visible focus indicator
  MIN_TAP_TARGET_SPACING: 8, // Space between adjacent targets
};

// Enhanced accessibility validation helpers
export const AccessibilityValidators = {
  // Validate touch target size according to WCAG 2.5.5
  validateTouchTarget: (
    width,
    height,
    minSize = WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE,
  ) => ({
    isValid: width >= minSize && height >= minSize,
    width,
    height,
    minSize,
    wcagRule: "2.5.5 Target Size",
    level: "AAA",
  }),

  // Validate color contrast according to WCAG 1.4.3
  validateColorContrast: (
    foreground,
    background,
    fontSize = 16,
    isBold = false,
    level = "AA",
  ) => {
    const isLargeText =
      fontSize >= WCAG_CONSTANTS.LARGE_TEXT_MIN_SIZE ||
      (fontSize >= WCAG_CONSTANTS.LARGE_TEXT_MIN_SIZE_BOLD && isBold);

    const requiredRatio =
      level === "AAA"
        ? isLargeText
          ? WCAG_CONSTANTS.COLOR_CONTRAST_AAA_LARGE
          : WCAG_CONSTANTS.COLOR_CONTRAST_AAA_NORMAL
        : isLargeText
          ? WCAG_CONSTANTS.COLOR_CONTRAST_AA_LARGE
          : WCAG_CONSTANTS.COLOR_CONTRAST_AA_NORMAL;

    return {
      requiredRatio,
      isLargeText,
      wcagRule:
        level === "AAA"
          ? "1.4.6 Contrast (Enhanced)"
          : "1.4.3 Contrast (Minimum)",
      level,
    };
  },

  // Validate animation duration according to WCAG 2.2.2
  validateAnimationDuration: (duration) => ({
    isValid: duration <= WCAG_CONSTANTS.MAX_ANIMATION_DURATION,
    duration,
    maxDuration: WCAG_CONSTANTS.MAX_ANIMATION_DURATION,
    wcagRule: "2.2.2 Pause, Stop, Hide",
    level: "A",
  }),

  // Validate accessibility label quality
  validateAccessibilityLabel: (label) => ({
    hasLabel: !!label,
    isDescriptive: label && label.length >= 3,
    isEmpty: !label || label.trim().length === 0,
    isTooShort: label && label.length < 3,
    wcagRule: "4.1.2 Name, Role, Value",
    level: "A",
  }),
};

// Enhanced focus management utilities
export const FocusManagement = {
  // Create focus trap for modals/dialogs
  createFocusTrap: (containerRef) => ({
    accessibilityViewIsModal: true,
    onAccessibilityEscape: () => {
      // Handle escape key for modal dismissal
      logger.debug("Modal dismissed via accessibility escape");
    },
  }),

  // Focus management for complex components
  createFocusProps: (onFocus, onBlur, isFocused = false) => ({
    onFocus: (event) => {
      if (onFocus) onFocus(event);
      // Additional focus handling
    },
    onBlur: (event) => {
      if (onBlur) onBlur(event);
      // Additional blur handling
    },
    style: isFocused
      ? {
          outline: `${WCAG_CONSTANTS.FOCUS_OUTLINE_WIDTH}px solid #0066cc`,
          outlineOffset: "2px",
        }
      : {},
  }),

  // Screen reader announcement helper
  announceForScreenReader: (message, priority = "polite") => {
    // Enhanced announcement with priority levels
    if (typeof AccessibilityInfo !== "undefined") {
      AccessibilityInfo.announceForAccessibility(message);
    }
    logger.debug(`[Screen Reader ${priority.toUpperCase()}]: ${message}`);
  },
};

// Touch target optimization utilities
export const TouchTargetHelpers = {
  // Ensure minimum touch target size with hitSlop
  ensureMinimumTouchTarget: (style = {}) => {
    const currentWidth = style.width || style.minWidth || 0;
    const currentHeight = style.height || style.minHeight || 0;
    const minSize = WCAG_CONSTANTS.TOUCH_TARGET_MIN_SIZE;

    const hitSlopHorizontal = Math.max(0, (minSize - currentWidth) / 2);
    const hitSlopVertical = Math.max(0, (minSize - currentHeight) / 2);

    return {
      style: {
        ...style,
        minWidth: Math.max(currentWidth, minSize),
        minHeight: Math.max(currentHeight, minSize),
      },
      hitSlop:
        hitSlopHorizontal > 0 || hitSlopVertical > 0
          ? {
              top: hitSlopVertical,
              bottom: hitSlopVertical,
              left: hitSlopHorizontal,
              right: hitSlopHorizontal,
            }
          : undefined,
    };
  },

  // Calculate spacing between touch targets
  calculateTargetSpacing: (targets) => {
    const minSpacing = WCAG_CONSTANTS.MIN_TAP_TARGET_SPACING;
    return {
      marginHorizontal: minSpacing / 2,
      marginVertical: minSpacing / 2,
    };
  },
};

// Enhanced keyboard navigation utilities
export const KeyboardNavigation = {
  // Create comprehensive keyboard navigation props
  createKeyboardProps: (onPress, role = AccessibilityRoles.BUTTON) => ({
    accessible: true,
    accessibilityRole: role,
    onPress,
    // Additional keyboard-specific handlers can be added here
    onAccessibilityTap: onPress, // For better screen reader support
  }),

  // Tab index management for complex components
  createTabIndexProps: (tabIndex = 0, isDisabled = false) => ({
    focusable: !isDisabled,
    accessible: !isDisabled,
    accessibilityState: {
      disabled: isDisabled,
    },
    // Note: React Native doesn't support tabIndex directly
    // This is a placeholder for future enhancement
  }),
};

export default {
  AccessibilityRoles,
  AccessibilityStates,
  AccessibilityTraits,
  WCAG_CONSTANTS,
  AccessibilityValidators,
  FocusManagement,
  TouchTargetHelpers,
  KeyboardNavigation,
  createMoodAccessibility,
  createTherapeuticAccessibility,
  createNavigationAccessibility,
  createFormInputAccessibility,
  createProgressAccessibility,
  createSliderAccessibility,
  createModalAccessibility,
  createAlertAccessibility,
  createCardAccessibility,
  createListItemAccessibility,
  announceForAccessibility,
  MentalHealthAccessibility,
};
