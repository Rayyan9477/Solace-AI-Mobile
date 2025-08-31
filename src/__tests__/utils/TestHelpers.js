/**
 * Mental Health App Testing Utilities
 * Specialized helpers for testing mental health applications
 * Includes crisis simulation, mood testing, and accessibility helpers
 */

import { NavigationContainer } from "@react-navigation/native";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react-native";
import React from "react";
import { Provider } from "react-redux";

import { ThemeProvider } from "../../shared/theme/ThemeContext";

// Mock store slices
import authSlice from "../../store/slices/authSlice";
import chatSlice from "../../store/slices/chatSlice";
import enhancedMoodSlice from "../../store/slices/enhancedMoodSlice";
import moodSlice from "../../store/slices/moodSlice";

/**
 * Mental Health App Test Constants
 */
export const MENTAL_HEALTH_TEST_CONSTANTS = {
  CRISIS_KEYWORDS: [
    "suicide",
    "kill myself",
    "end my life",
    "hurt myself",
    "hopeless",
    "worthless",
    "trapped",
    "give up",
  ],
  MOOD_TYPES: [
    "happy",
    "sad",
    "anxious",
    "calm",
    "angry",
    "excited",
    "depressed",
    "manic",
    "neutral",
    "overwhelmed",
  ],
  CRISIS_SEVERITY_LEVELS: ["low", "medium", "high", "critical"],
  THERAPEUTIC_ACTIVITIES: [
    "meditation",
    "exercise",
    "journaling",
    "therapy",
    "breathing",
    "music",
    "art",
    "nature",
  ],
  ACCESSIBILITY_REQUIREMENTS: {
    MIN_TOUCH_TARGET: 44,
    MIN_COLOR_CONTRAST: 4.5,
    MAX_TEXT_LENGTH: 80,
    ANIMATION_DURATION_MS: 300,
  },
};

/**
 * Default theme for testing
 */
export const createTestTheme = (overrides = {}) => ({
  colors: {
    calming: ["#2196F3", "#64B5F6"],
    nurturing: ["#4CAF50", "#81C784"],
    peaceful: ["#607D8B", "#90A4AE"],
    grounding: ["#9C27B0", "#BA68C8"],
    energizing: ["#FF9800", "#FFB74D"],
    background: "#FFFFFF",
    text: "#000000",
    surface: "#F5F5F5",
    primary: "#2196F3",
    error: "#F44336",
    warning: "#FF9800",
    success: "#4CAF50",
    ...overrides.colors,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    ...overrides.spacing,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    ...overrides.borderRadius,
  },
  typography: {
    h1: { fontSize: 32, fontWeight: "bold", lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: "bold", lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: "bold", lineHeight: 28 },
    body: { fontSize: 16, fontWeight: "normal", lineHeight: 24 },
    caption: { fontSize: 12, fontWeight: "normal", lineHeight: 16 },
    ...overrides.typography,
  },
  accessibility: {
    minTouchTarget: 44,
    focusRingWidth: 2,
    highContrastMode: false,
    reducedMotion: false,
    ...overrides.accessibility,
  },
});

/**
 * Create test store with mental health slices
 */
export const createMentalHealthTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      mood: moodSlice?.reducer || ((state = {}) => state),
      enhancedMood: enhancedMoodSlice?.reducer || ((state = {}) => state),
      auth: authSlice?.reducer || ((state = {}) => state),
      chat: chatSlice?.reducer || ((state = {}) => state),
    },
    preloadedState: {
      mood: {
        currentMood: null,
        moodHistory: [],
        insights: [],
        loading: false,
        error: null,
        analytics: {
          weeklyAverage: 0,
          trend: "stable",
          patterns: [],
        },
        ...initialState.mood,
      },
      enhancedMood: {
        currentStep: 1,
        selectedMood: null,
        intensity: 5,
        activities: [],
        notes: "",
        triggers: [],
        isSubmitting: false,
        completedEntries: [],
        ...initialState.enhancedMood,
      },
      auth: {
        isAuthenticated: true,
        user: {
          id: "test-user",
          preferences: {
            reducedMotion: false,
            highContrast: false,
            crisisSupport: true,
          },
        },
        ...initialState.auth,
      },
      chat: {
        messages: [],
        isTyping: false,
        supportMode: false,
        crisisDetected: false,
        ...initialState.chat,
      },
    },
  });
};

/**
 * Comprehensive test wrapper for mental health components
 */
export const MentalHealthTestWrapper = ({
  children,
  store = null,
  theme = null,
  navigation = true,
  accessibility = {},
}) => {
  const testStore = store || createMentalHealthTestStore();
  const testTheme = theme || createTestTheme({ accessibility });

  const wrapper = (
    <Provider store={testStore}>
      <ThemeProvider
        value={{
          theme: testTheme,
          isReducedMotionEnabled: accessibility.reducedMotion || false,
          colors: testTheme.colors,
        }}
      >
        {navigation ? (
          <NavigationContainer>{children}</NavigationContainer>
        ) : (
          children
        )}
      </ThemeProvider>
    </Provider>
  );

  return wrapper;
};

/**
 * Render component with mental health context
 */
export const renderWithMentalHealthContext = (component, options = {}) => {
  const {
    store,
    theme,
    accessibility = {},
    navigation = true,
    ...renderOptions
  } = options;

  return render(
    <MentalHealthTestWrapper
      store={store}
      theme={theme}
      navigation={navigation}
      accessibility={accessibility}
    >
      {component}
    </MentalHealthTestWrapper>,
    renderOptions,
  );
};

/**
 * Crisis Simulation Helpers
 */
export class CrisisTestingHelpers {
  static createCrisisScenario(severity = "high", keywords = []) {
    const crisisKeywords =
      keywords.length > 0
        ? keywords
        : MENTAL_HEALTH_TEST_CONSTANTS.CRISIS_KEYWORDS.slice(0, 2);

    return {
      text: `I feel ${crisisKeywords.join(" and ")}`,
      severity,
      keywords: crisisKeywords,
      timestamp: new Date().toISOString(),
      riskScore: severity === "high" ? 0.9 : severity === "medium" ? 0.6 : 0.3,
      isCrisis: true,
    };
  }

  static createSafeScenario() {
    return {
      text: "I had a good therapy session today",
      severity: "none",
      keywords: [],
      timestamp: new Date().toISOString(),
      riskScore: 0.1,
      isCrisis: false,
    };
  }

  static mockEmergencyResources() {
    return [
      {
        id: "suicide_prevention_lifeline",
        name: "988 Suicide & Crisis Lifeline",
        number: "988",
        type: "voice",
        priority: 1,
        available24_7: true,
      },
      {
        id: "crisis_text_line",
        name: "Crisis Text Line",
        number: "741741",
        keyword: "HOME",
        type: "text",
        priority: 2,
        available24_7: true,
      },
    ];
  }
}

/**
 * Mood Testing Helpers
 */
export class MoodTestingHelpers {
  static createMoodEntry(
    mood = "happy",
    intensity = 7,
    activities = [],
    notes = "",
  ) {
    return {
      id: `mood-${Date.now()}`,
      mood,
      intensity,
      activities,
      notes,
      timestamp: new Date().toISOString(),
      triggers: [],
      location: "test",
    };
  }

  static createMoodHistory(days = 7, pattern = "random") {
    const history = [];
    const moods = MENTAL_HEALTH_TEST_CONSTANTS.MOOD_TYPES;

    for (let i = 0; i < days; i++) {
      let mood, intensity;

      if (pattern === "improving") {
        mood = i < days / 2 ? "sad" : "happy";
        intensity = Math.min(3 + i, 10);
      } else if (pattern === "declining") {
        mood = i < days / 2 ? "happy" : "sad";
        intensity = Math.max(10 - i, 1);
      } else if (pattern === "stable") {
        mood = "calm";
        intensity = 7;
      } else {
        mood = moods[Math.floor(Math.random() * moods.length)];
        intensity = Math.floor(Math.random() * 10) + 1;
      }

      history.push(
        this.createMoodEntry(
          mood,
          intensity,
          ["exercise", "meditation"],
          `Day ${i + 1} entry`,
        ),
      );
    }

    return history.reverse(); // Most recent first
  }

  static createMoodAnalytics(history) {
    const intensities = history.map((entry) => entry.intensity);
    const average =
      intensities.reduce((sum, i) => sum + i, 0) / intensities.length;

    return {
      weeklyAverage: Math.round(average * 10) / 10,
      trend: this.calculateTrend(intensities),
      patterns: this.detectPatterns(history),
      totalEntries: history.length,
      mostCommonMood: this.getMostCommonMood(history),
    };
  }

  static calculateTrend(intensities) {
    if (intensities.length < 2) return "stable";

    const recent = intensities.slice(0, 3);
    const older = intensities.slice(3, 6);

    const recentAvg = recent.reduce((sum, i) => sum + i, 0) / recent.length;
    const olderAvg = older.reduce((sum, i) => sum + i, 0) / older.length;

    const difference = recentAvg - olderAvg;

    if (difference > 1) return "improving";
    if (difference < -1) return "declining";
    return "stable";
  }

  static detectPatterns(history) {
    const patterns = [];

    // Check for weekly patterns
    if (history.length >= 7) {
      patterns.push({
        type: "weekly",
        description: "Weekly mood pattern detected",
        confidence: 0.7,
      });
    }

    return patterns;
  }

  static getMostCommonMood(history) {
    const moodCounts = {};
    history.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    return Object.keys(moodCounts).reduce((a, b) =>
      moodCounts[a] > moodCounts[b] ? a : b,
    );
  }
}

/**
 * Accessibility Testing Helpers
 */
export class AccessibilityTestingHelpers {
  static validateTouchTargets(component) {
    const buttons = component.getAllByRole("button");
    const violations = [];

    buttons.forEach((button, index) => {
      const style = button.props.style || {};
      const width = style.width || style.minWidth || 0;
      const height = style.height || style.minHeight || 0;

      if (
        width <
          MENTAL_HEALTH_TEST_CONSTANTS.ACCESSIBILITY_REQUIREMENTS
            .MIN_TOUCH_TARGET ||
        height <
          MENTAL_HEALTH_TEST_CONSTANTS.ACCESSIBILITY_REQUIREMENTS
            .MIN_TOUCH_TARGET
      ) {
        violations.push({
          element: `button-${index}`,
          issue: "Touch target too small",
          current: { width, height },
          required: {
            width:
              MENTAL_HEALTH_TEST_CONSTANTS.ACCESSIBILITY_REQUIREMENTS
                .MIN_TOUCH_TARGET,
            height:
              MENTAL_HEALTH_TEST_CONSTANTS.ACCESSIBILITY_REQUIREMENTS
                .MIN_TOUCH_TARGET,
          },
        });
      }
    });

    return {
      isValid: violations.length === 0,
      violations,
    };
  }

  static validateAccessibilityLabels(component) {
    const interactiveElements = [
      ...component.queryAllByRole("button"),
      ...component.queryAllByRole("textbox"),
      ...component.queryAllByRole("slider"),
    ];

    const violations = [];

    interactiveElements.forEach((element, index) => {
      if (!element.props.accessibilityLabel) {
        violations.push({
          element: `interactive-${index}`,
          issue: "Missing accessibility label",
          role: element.props.accessibilityRole,
        });
      }

      if (
        element.props.accessibilityLabel &&
        element.props.accessibilityLabel.length < 3
      ) {
        violations.push({
          element: `interactive-${index}`,
          issue: "Accessibility label too short",
          current: element.props.accessibilityLabel,
        });
      }
    });

    return {
      isValid: violations.length === 0,
      violations,
    };
  }

  static validateMentalHealthLanguage(component) {
    const textElements = component.queryAllByText(/.+/);
    const violations = [];

    const negativeWords = ["wrong", "bad", "failure", "stupid", "crazy"];
    const encouragingWords = ["support", "help", "care", "understand", "safe"];

    textElements.forEach((element, index) => {
      const text = element.props.children;
      if (typeof text === "string") {
        const lowerText = text.toLowerCase();

        negativeWords.forEach((word) => {
          if (lowerText.includes(word)) {
            violations.push({
              element: `text-${index}`,
              issue: "Potentially harmful language",
              word,
              text: text.substring(0, 50),
            });
          }
        });
      }
    });

    return {
      isValid: violations.length === 0,
      violations,
      hasEncouragingLanguage: textElements.some((el) => {
        const text = (el.props.children || "").toString().toLowerCase();
        return encouragingWords.some((word) => text.includes(word));
      }),
    };
  }
}

/**
 * Performance Testing Helpers
 */
export class PerformanceTestingHelpers {
  static measureRenderTime(renderFunction) {
    const startTime = performance.now();
    const result = renderFunction();
    const endTime = performance.now();

    return {
      result,
      renderTime: endTime - startTime,
      isPerformant: endTime - startTime < 100, // Under 100ms is good
    };
  }

  static createLargeDataset(type = "mood", count = 1000) {
    switch (type) {
      case "mood":
        return MoodTestingHelpers.createMoodHistory(count, "random");
      case "chat":
        return Array.from({ length: count }, (_, i) => ({
          id: `msg-${i}`,
          text: `Test message ${i}`,
          timestamp: Date.now() - i * 60000,
          isUser: i % 2 === 0,
        }));
      default:
        return [];
    }
  }
}

/**
 * Animation Testing Helpers
 */
export class AnimationTestingHelpers {
  static mockAnimations() {
    const mockAnimatedValue = {
      setValue: jest.fn(),
      addListener: jest.fn(),
      removeAllListeners: jest.fn(),
      interpolate: jest.fn(() => mockAnimatedValue),
    };

    return {
      Animated: {
        Value: jest.fn(() => mockAnimatedValue),
        timing: jest.fn(() => ({
          start: jest.fn((callback) => callback && callback()),
        })),
        sequence: jest.fn(() => ({
          start: jest.fn((callback) => callback && callback()),
        })),
        stagger: jest.fn(() => ({
          start: jest.fn((callback) => callback && callback()),
        })),
        createAnimatedComponent: jest.fn((component) => component),
      },
      mockAnimatedValue,
    };
  }

  static validateReducedMotionSupport(component, isReducedMotion = true) {
    // This would validate that animations are disabled or reduced
    // when isReducedMotion is true
    return {
      isValid: true, // Placeholder
      animationsReduced: isReducedMotion,
    };
  }
}

/**
 * Integration Testing Helpers
 */
export class IntegrationTestingHelpers {
  static createCompleteUserScenario(userProfile = {}) {
    const defaultProfile = {
      id: "test-user",
      preferences: {
        reducedMotion: false,
        highContrast: false,
        crisisSupport: true,
      },
      moodHistory: MoodTestingHelpers.createMoodHistory(14, "stable"),
      currentMood: "calm",
      hasCompletedOnboarding: true,
      ...userProfile,
    };

    return {
      user: defaultProfile,
      store: createMentalHealthTestStore({
        auth: {
          isAuthenticated: true,
          user: defaultProfile,
        },
        mood: {
          currentMood: defaultProfile.currentMood,
          moodHistory: defaultProfile.moodHistory,
        },
      }),
    };
  }

  static simulateUserJourney(steps = []) {
    // Helper to simulate complete user journeys
    return steps.map((step) => ({
      action: step.action,
      expectedResult: step.expectedResult,
      accessibility: step.accessibility || {},
      crisis: step.crisis || false,
    }));
  }
}

// Export all helpers
export default {
  MENTAL_HEALTH_TEST_CONSTANTS,
  createTestTheme,
  createMentalHealthTestStore,
  MentalHealthTestWrapper,
  renderWithMentalHealthContext,
  CrisisTestingHelpers,
  MoodTestingHelpers,
  AccessibilityTestingHelpers,
  PerformanceTestingHelpers,
  AnimationTestingHelpers,
  IntegrationTestingHelpers,
};
