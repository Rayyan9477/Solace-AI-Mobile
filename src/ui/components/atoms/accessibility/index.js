/**
 * Accessibility Components Index
 * Centralized exports for mental health accessibility components
 */

export {
  default as MentalHealthAccessible,
  useMentalHealthAccessibility,
} from "./MentalHealthAccessible";

// Re-export common accessibility utilities for convenience
export {
  WCAG_CONSTANTS,
  AccessibilityValidators,
  FocusManagement,
  TouchTargetHelpers,
  KeyboardNavigation,
  MentalHealthAccessibility,
  createMoodAccessibility,
  createTherapeuticAccessibility,
  createCrisisAccessibility,
  createModalAccessibility,
  createFormInputAccessibility,
} from "../../utils/accessibility";

// Enhanced accessibility hook for mental health contexts
export const useEnhancedAccessibility = (type = "default", options = {}) => {
  const { useMentalHealthAccessibility } = require("./MentalHealthAccessible");
  const mentalHealthA11y = useMentalHealthAccessibility(type);

  const announceWithContext = (message, priority = "polite") => {
    const { crisisContext = false, urgentContext = false } = options;

    if (crisisContext || urgentContext) {
      priority = "assertive";
    }

    mentalHealthA11y.announceForMentalHealth(message, priority);
  };

  const createContextualLabel = (baseLabel, context = {}) => {
    const { moodState, sessionType, urgency } = context;

    let enhancedLabel = baseLabel;

    if (moodState) {
      enhancedLabel = `${enhancedLabel} - Current mood: ${moodState}`;
    }

    if (sessionType) {
      enhancedLabel = `${enhancedLabel} - ${sessionType} session`;
    }

    if (urgency === "crisis") {
      enhancedLabel = `URGENT: ${enhancedLabel}`;
    }

    return enhancedLabel;
  };

  return {
    ...mentalHealthA11y,
    announceWithContext,
    createContextualLabel,
  };
};

// Quick access to mental health specific accessibility props
export const MentalHealthA11yProps = {
  crisis: (label, hint) => ({
    accessibilityRole: "button",
    accessibilityLabel: `URGENT: ${label}`,
    accessibilityHint: hint || "Double tap for immediate crisis support",
    accessibilityLiveRegion: "assertive",
  }),

  mood: (moodType, isSelected = false) => ({
    accessibilityRole: "button",
    accessibilityLabel: `${moodType} mood`,
    accessibilityHint: isSelected
      ? "Currently selected mood"
      : `Select ${moodType} as your mood`,
    accessibilityState: { selected: isSelected },
  }),

  therapy: (sessionType, label) => ({
    accessibilityRole: "button",
    accessibilityLabel: `${sessionType} therapy: ${label}`,
    accessibilityHint: "Double tap to start therapy session",
    accessibilityTraits: ["button", "startsMediaSession"],
  }),

  assessment: (questionNumber, totalQuestions, questionText) => ({
    accessibilityRole: "text",
    accessibilityLabel: `Question ${questionNumber} of ${totalQuestions}: ${questionText}`,
    accessibilityHint: "Mental health assessment question",
  }),
};

export default {
  MentalHealthAccessible,
  useMentalHealthAccessibility,
  useEnhancedAccessibility,
  MentalHealthA11yProps,
};
