/**
 * Accessibility utilities for Solace AI Mobile App
 * Provides consistent accessibility patterns across components
 */

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
};

export const AccessibilityStates = {
  DISABLED: "disabled",
  SELECTED: "selected",
  CHECKED: "checked",
  EXPANDED: "expanded",
  BUSY: "busy",
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
  console.log(`[Accessibility Announcement]: ${message}`);
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
};

export default {
  AccessibilityRoles,
  AccessibilityStates,
  AccessibilityTraits,
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
