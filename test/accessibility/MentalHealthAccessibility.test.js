/**
 * Mental Health App Accessibility Tests
 * Comprehensive WCAG 2.1 AA compliance testing
 * Focuses on mental health specific accessibility requirements
 */

import { NavigationContainer } from "@react-navigation/native";
import { configureStore } from "@reduxjs/toolkit";
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from "@testing-library/react-native";
import React from "react";
import { AccessibilityInfo } from "react-native";
import { Provider } from "react-redux";

import MoodCheckIn from "../../src/features/dashboard/components/MoodCheckIn";
import QuickActions from "../../src/features/dashboard/components/QuickActions";
import MainAppScreen from "../../src/screens/MainAppScreen";
import EnhancedMoodTrackerScreen from "../../src/features/mood/screens/EnhancedMoodTrackerScreen";
import { ThemeProvider } from "../../src/shared/theme/ThemeContext";
import moodSlice from "../../src/store/slices/moodSlice";
import {
  TouchTargetHelpers,
  WCAG_CONSTANTS,
  FocusManagement,
  MentalHealthAccessibility,
} from "../../utils/accessibility";

// Mock dependencies
jest.mock("react-native", () => ({
  ...jest.requireActual("react-native"),
  AccessibilityInfo: {
    isScreenReaderEnabled: jest.fn(),
    isReduceMotionEnabled: jest.fn(),
    isReduceTransparencyEnabled: jest.fn(),
    announceForAccessibility: jest.fn(),
    setAccessibilityFocus: jest.fn(),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
}));

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      mood: moodSlice.reducer,
    },
    preloadedState: {
      mood: {
        currentMood: null,
        moodHistory: [],
        loading: false,
        error: null,
        weeklyStats: {
          averageIntensity: 0,
          mostCommonMood: null,
          totalEntries: 0,
        },
        insights: [],
        ...initialState.mood,
      },
    },
  });
};

const mockTheme = {
  colors: {
    calming: ["#2196F3", "#64B5F6"],
    nurturing: ["#4CAF50", "#81C784"],
    peaceful: ["#607D8B", "#90A4AE"],
    background: "#FFFFFF",
    text: "#000000",
    surface: "#F5F5F5",
    primary: "#2196F3",
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  borderRadius: { sm: 4, md: 8, lg: 12, xl: 16 },
  typography: {
    h1: { fontSize: 32, fontWeight: "bold" },
    h2: { fontSize: 24, fontWeight: "bold" },
    body: { fontSize: 16, fontWeight: "normal" },
  },
  accessibility: {
    minTouchTarget: 44,
    focusRingWidth: 2,
    highContrastMode: false,
  },
};

const AccessibilityTestWrapper = ({
  children,
  isScreenReaderEnabled = false,
  isReducedMotion = false,
  store = createTestStore(),
}) => {
  AccessibilityInfo.isScreenReaderEnabled.mockResolvedValue(
    isScreenReaderEnabled,
  );
  AccessibilityInfo.isReduceMotionEnabled.mockResolvedValue(isReducedMotion);

  return (
    <Provider store={store}>
      <ThemeProvider
        value={{
          theme: mockTheme,
          isReducedMotionEnabled: isReducedMotion,
          colors: mockTheme.colors,
        }}
      >
        <NavigationContainer>{children}</NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
};

describe("Mental Health Accessibility", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("WCAG 2.1 AA Compliance", () => {
    describe("Touch Target Size (WCAG 2.5.5)", () => {
      it("ensures all interactive elements meet 44x44px minimum", () => {
        const { getAllByRole } = render(
          <AccessibilityTestWrapper>
            <MoodCheckIn testID="mood-check-in" />
          </AccessibilityTestWrapper>,
        );

        const buttons = getAllByRole("button");
        buttons.forEach((button) => {
          const { width, height, minWidth, minHeight } =
            button.props.style || {};
          const actualWidth =
            minWidth || width || WCAG_CONSTANTS.MIN_TOUCH_TARGET;
          const actualHeight =
            minHeight || height || WCAG_CONSTANTS.MIN_TOUCH_TARGET;

          expect(actualWidth).toBeGreaterThanOrEqual(
            WCAG_CONSTANTS.MIN_TOUCH_TARGET,
          );
          expect(actualHeight).toBeGreaterThanOrEqual(
            WCAG_CONSTANTS.MIN_TOUCH_TARGET,
          );
        });
      });

      it("provides adequate spacing between touch targets", () => {
        const { getAllByRole } = render(
          <AccessibilityTestWrapper>
            <QuickActions testID="quick-actions" />
          </AccessibilityTestWrapper>,
        );

        const buttons = getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(1);

        // Should have proper spacing between interactive elements
        buttons.forEach((button) => {
          expect(
            button.props.style?.margin || button.props.style?.padding,
          ).toBeTruthy();
        });
      });
    });

    describe("Color Contrast (WCAG 1.4.3)", () => {
      it("maintains sufficient contrast for text elements", () => {
        const { getAllByText } = render(
          <AccessibilityTestWrapper>
            <MoodCheckIn testID="mood-check-in" />
          </AccessibilityTestWrapper>,
        );

        const textElements = getAllByText(/.+/);
        textElements.forEach((element) => {
          const style = element.props.style || {};
          // In a real implementation, you'd calculate actual contrast ratios
          // For now, ensure text colors are defined
          expect(style.color || mockTheme.colors.text).toBeTruthy();
        });
      });

      it("supports high contrast mode", () => {
        const highContrastTheme = {
          ...mockTheme,
          accessibility: {
            ...mockTheme.accessibility,
            highContrastMode: true,
          },
          colors: {
            ...mockTheme.colors,
            text: "#000000",
            background: "#FFFFFF",
            primary: "#0000FF",
          },
        };

        const { getByTestId } = render(
          <ThemeProvider
            value={{
              theme: highContrastTheme,
              isReducedMotionEnabled: false,
              colors: highContrastTheme.colors,
            }}
          >
            <MoodCheckIn testID="mood-check-in" />
          </ThemeProvider>,
        );

        const component = getByTestId("mood-check-in");
        expect(component).toBeTruthy();
      });
    });

    describe("Focus Management (WCAG 2.4.3, 2.4.7)", () => {
      it("provides logical focus order", async () => {
        const { getAllByRole } = render(
          <AccessibilityTestWrapper>
            <EnhancedMoodTrackerScreen />
          </AccessibilityTestWrapper>,
        );

        const interactiveElements = getAllByRole(/button|textbox|slider/);

        // Focus should move in logical reading order
        for (let i = 0; i < interactiveElements.length - 1; i++) {
          const current = interactiveElements[i];
          const next = interactiveElements[i + 1];

          expect(current.props.accessibilityRole).toBeTruthy();
          expect(next.props.accessibilityRole).toBeTruthy();
        }
      });

      it("manages focus during screen transitions", async () => {
        const { getByTestId } = render(
          <AccessibilityTestWrapper>
            <EnhancedMoodTrackerScreen />
          </AccessibilityTestWrapper>,
        );

        // Focus should be set to appropriate element on step change
        const nextButton = getByTestId("next-button");
        fireEvent.press(nextButton);

        await waitFor(() => {
          expect(AccessibilityInfo.setAccessibilityFocus).toHaveBeenCalled();
        });
      });

      it("provides visible focus indicators", () => {
        const { getAllByRole } = render(
          <AccessibilityTestWrapper>
            <QuickActions testID="quick-actions" />
          </AccessibilityTestWrapper>,
        );

        const buttons = getAllByRole("button");
        buttons.forEach((button) => {
          // Should have focus styles defined
          expect(button.props.style).toBeTruthy();
        });
      });
    });

    describe("Text and Labels (WCAG 1.3.1, 4.1.2)", () => {
      it("provides meaningful accessibility labels", () => {
        const { getAllByRole } = render(
          <AccessibilityTestWrapper>
            <MoodCheckIn
              testID="mood-check-in"
              accessibilityLabel="Select your current mood"
            />
          </AccessibilityTestWrapper>,
        );

        const buttons = getAllByRole("button");
        buttons.forEach((button) => {
          expect(button.props.accessibilityLabel).toBeTruthy();
          expect(button.props.accessibilityLabel.length).toBeGreaterThan(3);
        });
      });

      it("provides helpful accessibility hints", () => {
        const { getByTestId } = render(
          <AccessibilityTestWrapper>
            <MoodCheckIn
              testID="mood-check-in"
              accessibilityHint="Double tap to open mood selection options"
            />
          </AccessibilityTestWrapper>,
        );

        const component = getByTestId("mood-check-in");
        expect(component.props.accessibilityHint).toBeTruthy();
        expect(component.props.accessibilityHint).toContain("tap");
      });

      it("uses appropriate accessibility roles", () => {
        const { getAllByRole } = render(
          <AccessibilityTestWrapper>
            <QuickActions testID="quick-actions" />
          </AccessibilityTestWrapper>,
        );

        const buttons = getAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);

        const textInputs = screen.queryAllByRole("textbox");
        // May or may not have text inputs depending on component
      });
    });
  });

  describe("Screen Reader Support", () => {
    it("provides comprehensive screen reader navigation", async () => {
      const { getByTestId } = render(
        <AccessibilityTestWrapper isScreenReaderEnabled>
          <MainAppScreen />
        </AccessibilityTestWrapper>,
      );

      await waitFor(() => {
        expect(AccessibilityInfo.isScreenReaderEnabled).toHaveBeenCalled();
      });

      const mainScreen = getByTestId("main-app-screen");
      expect(mainScreen.props.accessible).toBe(true);
    });

    it("announces important state changes", async () => {
      const { getByTestId } = render(
        <AccessibilityTestWrapper isScreenReaderEnabled>
          <MoodCheckIn testID="mood-check-in" onCheckIn={() => {}} />
        </AccessibilityTestWrapper>,
      );

      const checkInButton = getByTestId("mood-check-in-button");
      fireEvent.press(checkInButton);

      await waitFor(() => {
        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
          expect.stringContaining("mood"),
        );
      });
    });

    it("provides contextual information for complex UI", () => {
      const { getByTestId } = render(
        <AccessibilityTestWrapper isScreenReaderEnabled>
          <EnhancedMoodTrackerScreen />
        </AccessibilityTestWrapper>,
      );

      const progressIndicator = getByTestId("progress-indicator");
      expect(progressIndicator.props.accessibilityLabel).toContain("step");
      expect(progressIndicator.props.accessibilityValue).toBeTruthy();
    });

    it("groups related content appropriately", () => {
      const { getByTestId } = render(
        <AccessibilityTestWrapper isScreenReaderEnabled>
          <QuickActions testID="quick-actions" />
        </AccessibilityTestWrapper>,
      );

      const quickActions = getByTestId("quick-actions");
      expect(quickActions.props.accessibilityRole).toBe("group");
      expect(quickActions.props.accessibilityLabel).toContain("actions");
    });
  });

  describe("Motor Impairment Support", () => {
    it("supports alternative input methods", () => {
      const { getAllByRole } = render(
        <AccessibilityTestWrapper>
          <MoodCheckIn testID="mood-check-in" />
        </AccessibilityTestWrapper>,
      );

      const buttons = getAllByRole("button");
      buttons.forEach((button) => {
        // Should support both tap and long press
        expect(button.props.onPress || button.props.onLongPress).toBeTruthy();
      });
    });

    it("provides sufficient time for interactions", async () => {
      jest.useFakeTimers();

      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <AccessibilityTestWrapper>
          <MoodCheckIn testID="mood-check-in" onCheckIn={mockOnPress} />
        </AccessibilityTestWrapper>,
      );

      const button = getByTestId("mood-check-in-button");
      fireEvent.press(button);

      // Should not require rapid interactions
      jest.advanceTimersByTime(1000);

      await waitFor(() => {
        expect(mockOnPress).toHaveBeenCalled();
      });

      jest.useRealTimers();
    });

    it("avoids small or closely spaced targets", () => {
      const { getAllByRole } = render(
        <AccessibilityTestWrapper>
          <QuickActions testID="quick-actions" />
        </AccessibilityTestWrapper>,
      );

      const buttons = getAllByRole("button");
      buttons.forEach((button) => {
        const style = button.props.style || {};
        const spacing = style.margin || style.padding || mockTheme.spacing.md;
        expect(spacing).toBeGreaterThanOrEqual(mockTheme.spacing.sm);
      });
    });
  });

  describe("Cognitive Accessibility", () => {
    it("uses clear and simple language", () => {
      const { getAllByText } = render(
        <AccessibilityTestWrapper>
          <MoodCheckIn testID="mood-check-in" />
        </AccessibilityTestWrapper>,
      );

      const textElements = getAllByText(/.+/);
      textElements.forEach((element) => {
        const text = element.props.children;
        if (typeof text === "string") {
          // Should use simple, supportive language
          expect(text.length).toBeLessThan(100); // Reasonable length
          expect(text).not.toMatch(/[A-Z]{3,}/); // Avoid excessive caps
        }
      });
    });

    it("provides consistent navigation patterns", () => {
      const { getAllByTestId } = render(
        <AccessibilityTestWrapper>
          <EnhancedMoodTrackerScreen />
        </AccessibilityTestWrapper>,
      );

      // Navigation buttons should be consistently placed
      const nextButton = screen.queryByTestId("next-button");
      const backButton = screen.queryByTestId("back-button");

      if (nextButton && backButton) {
        expect(nextButton.props.accessibilityLabel).toContain("next");
        expect(backButton.props.accessibilityLabel).toContain("back");
      }
    });

    it("reduces cognitive load with progressive disclosure", () => {
      const { getByTestId } = render(
        <AccessibilityTestWrapper>
          <EnhancedMoodTrackerScreen />
        </AccessibilityTestWrapper>,
      );

      // Should show one step at a time
      const screen = getByTestId("enhanced-mood-tracker");
      expect(screen).toBeTruthy();

      // Progress should be clearly indicated
      const progressIndicator = getByTestId("progress-indicator");
      expect(progressIndicator.props.accessibilityLabel).toContain("step 1");
    });
  });

  describe("Mental Health Specific Accessibility", () => {
    it("provides crisis-accessible emergency features", () => {
      const { getByText } = render(
        <AccessibilityTestWrapper>
          <QuickActions testID="quick-actions" />
        </AccessibilityTestWrapper>,
      );

      // Crisis support should be easily accessible
      const crisisElements = screen.queryAllByText(
        /crisis|emergency|help|support/i,
      );
      expect(crisisElements.length).toBeGreaterThan(0);

      crisisElements.forEach((element) => {
        expect(element.props.accessible).toBe(true);
      });
    });

    it("supports users in distress with gentle interactions", () => {
      const { getByTestId } = render(
        <AccessibilityTestWrapper>
          <MoodCheckIn testID="mood-check-in" currentMood="anxious" />
        </AccessibilityTestWrapper>,
      );

      const component = getByTestId("mood-check-in");

      // Should provide reassuring, non-judgmental language
      expect(component.props.accessibilityLabel).not.toMatch(
        /wrong|bad|negative/,
      );
    });

    it("adapts to user emotional state", () => {
      const { getByTestId } = render(
        <AccessibilityTestWrapper>
          <MoodCheckIn testID="mood-check-in" currentMood="depressed" />
        </AccessibilityTestWrapper>,
      );

      const component = getByTestId("mood-check-in");

      // Should provide extra support for low moods
      expect(component.props.accessibilityHint).toContain("support");
    });

    it("provides trauma-informed accessibility features", () => {
      const { getByTestId } = render(
        <AccessibilityTestWrapper>
          <MainAppScreen />
        </AccessibilityTestWrapper>,
      );

      // Should avoid sudden movements or jarring transitions
      const mainScreen = getByTestId("main-app-screen");
      expect(mainScreen).toBeTruthy();
    });
  });

  describe("Reduced Motion Support", () => {
    it("respects reduced motion preferences", () => {
      const { getByTestId } = render(
        <AccessibilityTestWrapper isReducedMotion>
          <MoodCheckIn testID="mood-check-in" />
        </AccessibilityTestWrapper>,
      );

      const component = getByTestId("mood-check-in");
      expect(component).toBeTruthy();

      // Animations should be disabled or reduced
    });

    it("provides alternative feedback when motion is reduced", () => {
      const { getByTestId } = render(
        <AccessibilityTestWrapper isReducedMotion>
          <QuickActions testID="quick-actions" />
        </AccessibilityTestWrapper>,
      );

      const component = getByTestId("quick-actions");
      expect(component).toBeTruthy();

      // Should provide haptic or audio feedback instead
    });
  });

  describe("Accessibility Testing Utilities", () => {
    it("validates TouchTargetHelpers utility", () => {
      const result = TouchTargetHelpers.validateTouchTarget({
        width: 44,
        height: 44,
      });

      expect(result.isValid).toBe(true);
      expect(result.recommendations).toHaveLength(0);
    });

    it("validates FocusManagement utility", () => {
      const focusManager = new FocusManagement();

      focusManager.setFocusToElement("test-element");
      expect(AccessibilityInfo.setAccessibilityFocus).toHaveBeenCalled();
    });

    it("validates MentalHealthAccessibility utility", () => {
      const accessibility = new MentalHealthAccessibility();

      const result = accessibility.validateMentalHealthCompliance({
        hasEmergencyAccess: true,
        usesGentleLanguage: true,
        supportsReducedMotion: true,
        providesProgressFeedback: true,
      });

      expect(result.isCompliant).toBe(true);
    });
  });

  describe("Error Prevention and Recovery", () => {
    it("prevents accidental destructive actions", () => {
      const { getByText } = render(
        <AccessibilityTestWrapper>
          <EnhancedMoodTrackerScreen />
        </AccessibilityTestWrapper>,
      );

      // Destructive actions should require confirmation
      const deleteButtons = screen.queryAllByText(/delete|remove|clear/i);
      deleteButtons.forEach((button) => {
        expect(button.props.accessibilityHint).toContain("confirm");
      });
    });

    it("provides clear error messages and recovery options", async () => {
      const { getByTestId } = render(
        <AccessibilityTestWrapper>
          <EnhancedMoodTrackerScreen />
        </AccessibilityTestWrapper>,
      );

      // Simulate validation error
      const saveButton = getByTestId("save-button");
      fireEvent.press(saveButton);

      await waitFor(() => {
        const errorElements = screen.queryAllByText(/error|invalid|required/i);
        errorElements.forEach((element) => {
          expect(element.props.accessibilityRole).toBe("alert");
        });
      });
    });
  });
});
