/**
 * Mental Health App Accessibility Utilities
 *
 * Provides accessibility helpers, labels, and constants specific to
 * mental health app components and interactions.
 */

import { Platform } from "react-native";

// Web-safe AccessibilityInfo import with fallback
let AccessibilityInfo;
if (Platform.OS === "web") {
  // Web fallback for AccessibilityInfo
  AccessibilityInfo = {
    announceForAccessibility: (message) => {
      console.log(`🔊 Accessibility Announcement: ${message}`);
      // Use native web accessibility APIs when available
      if (typeof window !== "undefined" && window.speechSynthesis && typeof SpeechSynthesisUtterance !== "undefined") {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.volume = 0.1; // Very quiet, just for screen reader hint
        window.speechSynthesis.speak(utterance);
      }
    },
    isReduceMotionEnabled: () => Promise.resolve(false),
    isScreenReaderEnabled: () => Promise.resolve(false),
    isInvertColorsEnabled: () => Promise.resolve(false),
    addEventListener: () => ({ remove: () => {} }),
  };
} else {
  AccessibilityInfo = require("react-native").AccessibilityInfo;
}

// Mental Health App Accessibility Configuration
export const MentalHealthAccessibility = {
  // Dashboard component accessibility
  dashboard: {
    welcomeMessage: (userName = "Friend") => ({
      accessibilityRole: "header",
      accessibilityLabel: `Welcome back, ${userName}`,
      accessibilityHint: "Main dashboard header with user greeting",
      accessibilityLiveRegion: "polite",
    }),

    moodCheckIn: {
      container: {
        accessibilityRole: "group",
        accessibilityLabel: "Mood check-in section",
        accessibilityHint: "Track your current mood and emotional state",
      },

      moodButton: (mood, isSelected = false) => ({
        accessibilityRole: "button",
        accessibilityLabel: `Select ${mood} mood${isSelected ? ", currently selected" : ""}`,
        accessibilityHint: `Double tap to record ${mood} as your current mood`,
        accessibilityState: { selected: isSelected },
      }),
    },

    quickActions: {
      container: {
        accessibilityRole: "group",
        accessibilityLabel: "Quick actions menu",
        accessibilityHint: "Access frequently used app features",
      },

      therapyButton: {
        accessibilityRole: "button",
        accessibilityLabel: "Start therapy session",
        accessibilityHint: "Double tap to begin a new AI therapy session",
      },

      journalButton: {
        accessibilityRole: "button",
        accessibilityLabel: "Open journal",
        accessibilityHint: "Double tap to write in your personal journal",
      },

      meditationButton: {
        accessibilityRole: "button",
        accessibilityLabel: "Start meditation",
        accessibilityHint: "Double tap to begin a guided meditation session",
      },
    },

    progressOverview: {
      container: {
        accessibilityRole: "group",
        accessibilityLabel: "Progress overview",
        accessibilityHint: "View your mental health progress and achievements",
      },

      streak: (days) => ({
        accessibilityRole: "text",
        accessibilityLabel: `${days} day streak`,
        accessibilityHint: "Consecutive days of app engagement",
      }),

      score: (score, maxScore = 100) => ({
        accessibilityRole: "text",
        accessibilityLabel: `Wellness score: ${score} out of ${maxScore}`,
        accessibilityHint: "Current overall wellness rating",
      }),
    },

    insights: {
      container: {
        accessibilityRole: "group",
        accessibilityLabel: "Daily insights",
        accessibilityHint: "Personalized insights based on your activity",
      },

      insight: (title, description) => ({
        accessibilityRole: "text",
        accessibilityLabel: `Insight: ${title}. ${description}`,
        accessibilityHint: "Tap to learn more about this insight",
      }),
    },
  },

  // Mood tracking accessibility
  moodTracking: {
    moodSelector: {
      container: {
        accessibilityRole: "radiogroup",
        accessibilityLabel: "Mood selection",
        accessibilityHint:
          "Choose your current mood from the available options",
      },

      moodOption: (mood, intensity = null, isSelected = false) => ({
        accessibilityRole: "radio",
        accessibilityLabel: intensity
          ? `${mood} mood, intensity ${intensity}`
          : `${mood} mood`,
        accessibilityHint: `Double tap to select ${mood} as your current mood`,
        accessibilityState: {
          selected: isSelected,
          checked: isSelected,
        },
      }),
    },

    intensityScale: {
      container: {
        accessibilityRole: "adjustable",
        accessibilityLabel: "Mood intensity scale",
        accessibilityHint: "Swipe up or down to adjust intensity level",
      },

      scale: (current, max = 5) => ({
        accessibilityRole: "adjustable",
        accessibilityLabel: `Intensity level ${current} out of ${max}`,
        accessibilityHint: "Swipe up to increase, down to decrease intensity",
        accessibilityValue: {
          min: 1,
          max,
          now: current,
        },
      }),
    },

    notesInput: {
      accessibilityRole: "text",
      accessibilityLabel: "Mood notes",
      accessibilityHint:
        "Add additional notes about your current mood and feelings",
      placeholder: "How are you feeling today? (optional)",
    },
  },

  // Chat/Therapy session accessibility
  chat: {
    container: {
      accessibilityRole: "log",
      accessibilityLabel: "Therapy chat conversation",
      accessibilityHint: "Conversation history with AI therapist",
      accessibilityLiveRegion: "polite",
    },

    userMessage: (message) => ({
      accessibilityRole: "text",
      accessibilityLabel: `You said: ${message}`,
      accessibilityHint: "Your message in the therapy conversation",
    }),

    aiMessage: (message) => ({
      accessibilityRole: "text",
      accessibilityLabel: `AI therapist replied: ${message}`,
      accessibilityHint: "AI therapist response in the conversation",
    }),

    inputField: {
      accessibilityRole: "text",
      accessibilityLabel: "Type your message",
      accessibilityHint:
        "Enter your message to continue the therapy conversation",
      placeholder: "How can I help you today?",
    },

    sendButton: {
      accessibilityRole: "button",
      accessibilityLabel: "Send message",
      accessibilityHint: "Double tap to send your message to the AI therapist",
    },
  },

  // Assessment accessibility
  assessment: {
    container: {
      accessibilityRole: "form",
      accessibilityLabel: "Mental health assessment",
      accessibilityHint: "Complete questions to assess your mental well-being",
    },

    question: (questionNumber, totalQuestions, questionText) => ({
      accessibilityRole: "text",
      accessibilityLabel: `Question ${questionNumber} of ${totalQuestions}: ${questionText}`,
      accessibilityHint: "Assessment question, select an answer below",
    }),

    answer: (answerText, value, isSelected = false) => ({
      accessibilityRole: "radio",
      accessibilityLabel: answerText,
      accessibilityHint: `Double tap to select this answer: ${answerText}`,
      accessibilityState: {
        selected: isSelected,
        checked: isSelected,
      },
      accessibilityValue: {
        text: value.toString(),
      },
    }),

    progressBar: (current, total) => ({
      accessibilityRole: "progressbar",
      accessibilityLabel: `Assessment progress: ${current} of ${total} questions completed`,
      accessibilityValue: {
        min: 0,
        max: total,
        now: current,
      },
    }),
  },

  // Navigation accessibility
  navigation: {
    tabBar: {
      accessibilityRole: "tablist",
      accessibilityLabel: "Main navigation",
      accessibilityHint: "Navigate between app sections",
    },

    tab: (tabName, isSelected = false) => ({
      accessibilityRole: "tab",
      accessibilityLabel: `${tabName} tab${isSelected ? ", selected" : ""}`,
      accessibilityHint: `Double tap to navigate to ${tabName} section`,
      accessibilityState: { selected: isSelected },
    }),

    emergencyButton: {
      accessibilityRole: "button",
      accessibilityLabel: "Emergency support",
      accessibilityHint:
        "Double tap for immediate crisis support and emergency resources",
      accessibilityTraits: ["button", "startsMedia"], // iOS specific
    },
  },

  // Profile accessibility
  profile: {
    container: {
      accessibilityRole: "main",
      accessibilityLabel: "User profile",
      accessibilityHint: "Manage your account settings and preferences",
    },

    avatar: (userName) => ({
      accessibilityRole: "image",
      accessibilityLabel: `${userName}'s profile picture`,
      accessibilityHint: "Double tap to change profile picture",
    }),

    settingsSection: (sectionName) => ({
      accessibilityRole: "group",
      accessibilityLabel: `${sectionName} settings`,
      accessibilityHint: `Manage ${sectionName.toLowerCase()} preferences`,
    }),

    switch: (settingName, isEnabled) => ({
      accessibilityRole: "switch",
      accessibilityLabel: settingName,
      accessibilityHint: `Double tap to ${isEnabled ? "disable" : "enable"} ${settingName}`,
      accessibilityState: { checked: isEnabled },
    }),
  },

  // Form accessibility helpers
  forms: {
    requiredField: (fieldName) => ({
      accessibilityLabel: `${fieldName}, required field`,
      accessibilityHint: `Enter your ${fieldName.toLowerCase()}, this field is required`,
      accessibilityRequired: true,
    }),

    optionalField: (fieldName) => ({
      accessibilityLabel: `${fieldName}, optional`,
      accessibilityHint: `Enter your ${fieldName.toLowerCase()}, this field is optional`,
      accessibilityRequired: false,
    }),

    errorField: (fieldName, errorMessage) => ({
      accessibilityLabel: `${fieldName}, invalid`,
      accessibilityHint: `Error: ${errorMessage}`,
      accessibilityInvalid: true,
      accessibilityErrorMessage: errorMessage,
    }),

    submitButton: (action = "Submit") => ({
      accessibilityRole: "button",
      accessibilityLabel: action,
      accessibilityHint: `Double tap to ${action.toLowerCase()}`,
    }),
  },

  // Emergency and crisis support accessibility
  emergency: {
    crisisButton: {
      accessibilityRole: "button",
      accessibilityLabel: "Crisis support",
      accessibilityHint:
        "Double tap for immediate crisis support and emergency contacts",
      accessibilityTraits: ["button", "startsMedia"],
      accessibilityActions: [
        { name: "call", label: "Call crisis hotline" },
        { name: "chat", label: "Start crisis chat" },
      ],
    },

    hotlineNumber: (number) => ({
      accessibilityRole: "link",
      accessibilityLabel: `Crisis hotline: ${number}`,
      accessibilityHint: "Double tap to call crisis support hotline",
      accessibilityTraits: ["link", "startsMedia"],
    }),

    emergencyContact: (name, relationship) => ({
      accessibilityRole: "button",
      accessibilityLabel: `Contact ${name}, your ${relationship}`,
      accessibilityHint: `Double tap to contact ${name}`,
    }),
  },
};

// Accessibility announcements for mental health contexts
export const MentalHealthAnnouncements = {
  moodLogged: (mood, intensity) =>
    `Mood logged: ${mood}${intensity ? ` with intensity ${intensity}` : ""}`,

  sessionStarted: () =>
    "Therapy session started. Your conversation is private and secure.",

  sessionEnded: (duration) =>
    `Therapy session completed. Duration: ${duration} minutes.`,

  assessmentCompleted: (score) =>
    `Assessment completed. Your wellness score is ${score}.`,

  achievementUnlocked: (achievement) => `Achievement unlocked: ${achievement}`,

  reminderSet: (reminderType, time) =>
    `${reminderType} reminder set for ${time}`,

  dataBackedUp: () => "Your data has been securely backed up.",

  privacyModeEnabled: () =>
    "Privacy mode enabled. Your activity is now private.",

  emergencyModeActivated: () =>
    "Emergency mode activated. Connecting you to crisis support.",
};

// Accessibility testing helpers specific to mental health app
export const MentalHealthAccessibilityHelpers = {
  // Test if component meets mental health app accessibility standards
  testMentalHealthComponent: (component, context = "general") => {
    const issues = [];
    const props = component.props || {};

    // Check for therapeutic context in labels
    if (context === "mood" && props.accessibilityLabel) {
      if (!props.accessibilityLabel.toLowerCase().includes("mood")) {
        issues.push({
          type: "context",
          message:
            'Mood-related component should include "mood" in accessibility label',
          recommendation: "Add mood context to accessibility label",
        });
      }
    }

    // Check for crisis-related accessibility
    if (
      context === "emergency" &&
      !props.accessibilityHint?.includes("crisis")
    ) {
      issues.push({
        type: "emergency",
        message:
          "Emergency component missing crisis context in accessibility hint",
        recommendation: "Add crisis/emergency context to accessibility hint",
      });
    }

    // Check for therapy context
    if (context === "therapy" && props.accessibilityLabel) {
      if (
        !props.accessibilityLabel.toLowerCase().includes("therapy") &&
        !props.accessibilityLabel.toLowerCase().includes("therapist")
      ) {
        issues.push({
          type: "context",
          message:
            "Therapy component should include therapy context in accessibility label",
          recommendation:
            "Add therapy/therapist context to accessibility label",
        });
      }
    }

    return issues;
  },

  // Announce for accessibility with mental health context
  announceWithContext: (message, context = "general") => {
    let announcement = message;

    // Add context prefixes for mental health announcements
    switch (context) {
      case "mood":
        announcement = `Mood tracker: ${message}`;
        break;
      case "therapy":
        announcement = `Therapy session: ${message}`;
        break;
      case "emergency":
        announcement = `Emergency support: ${message}`;
        break;
      case "assessment":
        announcement = `Assessment: ${message}`;
        break;
      default:
        announcement = message;
    }

    if (Platform.OS === "ios" || Platform.OS === "android") {
      AccessibilityInfo.announceForAccessibility(announcement);
    }

    console.log(`🔊 Mental Health Accessibility: ${announcement}`);
  },

  // Get accessibility configuration for mental health specific interactions
  getMentalHealthAccessibilityConfig: (componentType, props = {}) => {
    const baseConfig = {
      accessibilityElementsHidden: false,
      importantForAccessibility: "yes",
    };

    switch (componentType) {
      case "mood-tracker":
        return {
          ...baseConfig,
          accessibilityRole: "radiogroup",
          accessibilityLabel: "Mood selection",
        };

      case "therapy-chat":
        return {
          ...baseConfig,
          accessibilityRole: "log",
          accessibilityLiveRegion: "polite",
          accessibilityLabel: "Therapy conversation",
        };

      case "emergency-button":
        return {
          ...baseConfig,
          accessibilityRole: "button",
          accessibilityTraits: ["button", "startsMedia"],
          accessibilityLabel: "Emergency support",
        };

      case "assessment-question":
        return {
          ...baseConfig,
          accessibilityRole: "radiogroup",
          accessibilityLabel: `Assessment question ${props.questionNumber || ""}`,
        };

      default:
        return baseConfig;
    }
  },
};

// Constants for mental health accessibility
export const MENTAL_HEALTH_ACCESSIBILITY_CONSTANTS = {
  TOUCH_TARGET_SIZE: 44,
  CRISIS_BUTTON_MIN_SIZE: 56, // Larger for emergency situations
  MOOD_BUTTON_MIN_SIZE: 48,

  // Announcement delays (in ms)
  MOOD_ANNOUNCEMENT_DELAY: 500,
  SESSION_ANNOUNCEMENT_DELAY: 1000,
  EMERGENCY_ANNOUNCEMENT_DELAY: 200, // Immediate for emergencies

  // Color contrast ratios for mental health app
  HIGH_CONTRAST_RATIO: 7.0, // Higher than standard for better readability
  STANDARD_CONTRAST_RATIO: 4.5,
  LARGE_TEXT_CONTRAST_RATIO: 3.0,

  // Focus management
  FOCUS_RING_COLOR: "#0066CC",
  FOCUS_RING_WIDTH: 2,
  EMERGENCY_FOCUS_COLOR: "#CC0000",

  // Screen reader priorities
  LIVE_REGION_POLITE: "polite",
  LIVE_REGION_ASSERTIVE: "assertive", // For emergency announcements

  // Semantic roles
  ROLES: {
    MOOD_SELECTOR: "radiogroup",
    THERAPY_CHAT: "log",
    EMERGENCY_BUTTON: "button",
    ASSESSMENT: "form",
    PROGRESS_BAR: "progressbar",
    MAIN_CONTENT: "main",
    NAVIGATION: "tablist",
    CRISIS_ALERT: "alert",
  },
};

export default MentalHealthAccessibility;
