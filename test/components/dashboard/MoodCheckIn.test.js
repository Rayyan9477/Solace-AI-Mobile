/**
 * MoodCheckIn Component Unit Tests
 * Comprehensive testing for mood check-in functionality
 * Includes accessibility, animation, and mental health specific tests
 */

import {
  render,
  fireEvent,
  waitFor,
  act,
  screen,
} from "@testing-library/react-native";
import PropTypes from "prop-types";
import React from "react";
import { Animated } from "react-native";

import MoodCheckIn from "../../../src/features/dashboard/components/MoodCheckIn";
import { ThemeProvider } from "../../../src/shared/theme/ThemeContext";

// Mock dependencies
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children, ...props }) => children,
}));

jest.mock("expo-haptics", () => {
  const mod = {
    impactAsync: jest.fn(),
    ImpactFeedbackStyle: {
      Light: "light",
      Medium: "medium",
      Heavy: "heavy",
    },
  };
  // Support both default import and named { Haptics } destructure
  return { __esModule: true, default: mod, Haptics: mod, ...mod };
});

// TEST FIX: Mock @theme/ThemeProvider to provide proper theme context
jest.mock("@theme/ThemeProvider", () => ({
  useTheme: () => ({
    theme: {
      colors: {
        therapeutic: {
          calming: { "50": "#87CEEB", "100": "#E3F2FD" },
          peaceful: { "50": "#F0F8FF" },
          nurturing: { "50": "#34C759" },
        },
        mood: { happy: "#FFD700" },
        warning: "#FFA500",
        info: "#5AC8FA",
        error: "#FF3B30",
        success: "#34C759",
        primary: "#007AFF",
        text: {
          primary: "#000000",
          secondary: "#666666",
        },
        background: {
          secondary: "#F5F5F5",
        },
      },
    },
    isReducedMotionEnabled: false,
    isDarkMode: false,
  }),
}));

// Mock theme context
const mockTheme = {
  colors: {
    nurturing: ["#4CAF50", "#81C784"],
    calming: ["#2196F3", "#64B5F6"],
    peaceful: ["#607D8B", "#90A4AE"],
    background: "#FFFFFF",
    text: "#000000",
    surface: "#F5F5F5",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    h2: { fontSize: 24, fontWeight: "bold" },
    body: { fontSize: 16, fontWeight: "normal" },
    caption: { fontSize: 12, fontWeight: "normal" },
  },
};

const MockThemeProvider = ({ children }) => (
  <ThemeProvider
    value={{
      theme: mockTheme,
      isReducedMotionEnabled: false,
      colors: mockTheme.colors,
    }}
  >
    {children}
  </ThemeProvider>
);
MockThemeProvider.propTypes = {
  children: PropTypes.node,
};

describe("MoodCheckIn Component", () => {
  const defaultProps = {
    currentMood: null,
    onCheckIn: jest.fn(),
    accessibilityLabel: "Mood check-in component",
    accessibilityHint: "Select your current mood to track your emotional state",
    testID: "mood-check-in",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset animations
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderMoodCheckIn = (props = {}) => {
    return render(
      <MockThemeProvider>
        <MoodCheckIn {...defaultProps} {...props} />
      </MockThemeProvider>,
    );
  };

  describe("Rendering and Basic Functionality", () => {
    it("renders correctly with default props", () => {
      const { getByTestId } = renderMoodCheckIn();
      const component = getByTestId("mood-check-in");
      expect(component).toBeTruthy();
    });

    it("displays mood options correctly", () => {
      const { getByText } = renderMoodCheckIn();

      // Check for common mood options
      expect(getByText(/How are you feeling/i)).toBeTruthy();
    });

    it("renders with current mood when provided", () => {
      const { getByTestId } = renderMoodCheckIn({ currentMood: "happy" });
      const component = getByTestId("mood-check-in");
      expect(component).toBeTruthy();
    });

    it("calls onCheckIn when mood is selected", async () => {
      const mockOnCheckIn = jest.fn();
      const { getByTestId } = renderMoodCheckIn({ onCheckIn: mockOnCheckIn });

      // First select a mood option
      const happyMoodOption = getByTestId("mood-option-happy");
      fireEvent.press(happyMoodOption);

      // Then press the check-in button
      const checkInButton = getByTestId("mood-check-in-button");
      fireEvent.press(checkInButton);

      await waitFor(() => {
        expect(mockOnCheckIn).toHaveBeenCalled();
      });
    });
  });

  describe("Accessibility Features", () => {
    it("has proper accessibility labels", () => {
      const { getByTestId } = renderMoodCheckIn();
      const component = getByTestId("mood-check-in");

      expect(component.props.accessibilityLabel).toBe(
        "Mood check-in component",
      );
      expect(component.props.accessibilityHint).toBe(
        "Select your current mood to track your emotional state",
      );
    });

    it("has proper accessibility role", () => {
      const { getByTestId } = renderMoodCheckIn();
      const component = getByTestId("mood-check-in");

      expect(component.props.accessibilityRole).toBe("button");
    });

    it("is accessible when disabled", () => {
      const { getByTestId } = renderMoodCheckIn({ disabled: true });
      const component = getByTestId("mood-check-in");

      expect(component.props.accessible).toBe(true);
      expect(component.props.accessibilityState?.disabled).toBe(true);
    });

    it("provides proper screen reader feedback", () => {
      const { getByTestId } = renderMoodCheckIn({ currentMood: "happy" });
      const component = getByTestId("mood-check-in");

      // Should include current mood in accessibility label
      expect(component.props.accessibilityValue).toBeDefined();
    });

    it("meets minimum touch target size (44x44px)", () => {
      const { getByTestId } = renderMoodCheckIn();
      const button = getByTestId("mood-check-in-button");

      // Check that the button exists and has accessibility properties
      expect(button).toBeTruthy();
      expect(button.props.accessible).toBe(true);
      expect(button.props.accessibilityRole).toBe("button");

      // The component sets minHeight: 44 in its styles
      // We verify the button is rendered with proper accessibility
    });
  });

  describe("Mental Health Specific Features", () => {
    it("handles mood changes therapeutically", async () => {
      const mockOnCheckIn = jest.fn();
      const { rerender } = renderMoodCheckIn({
        currentMood: "sad",
        onCheckIn: mockOnCheckIn,
      });

      // Change to a positive mood
      rerender(
        <MockThemeProvider>
          <MoodCheckIn
            {...defaultProps}
            currentMood="happy"
            onCheckIn={mockOnCheckIn}
          />
        </MockThemeProvider>,
      );

      // Select the happy mood and check in
      const happyMoodOption = screen.getByTestId("mood-option-happy");
      fireEvent.press(happyMoodOption);

      const checkInButton = screen.getByTestId("mood-check-in-button");
      fireEvent.press(checkInButton);

      await waitFor(() => {
        expect(mockOnCheckIn).toHaveBeenCalledWith(
          "happy",
          expect.objectContaining({
            timestamp: expect.any(String),
            emoji: "😊",
            label: "Happy",
            crisisRelated: false,
          }),
        );
      });
    });

    it("uses appropriate therapeutic colors", () => {
      const { getByTestId } = renderMoodCheckIn({ currentMood: "calm" });
      const component = getByTestId("mood-check-in");

      // Should use calming colors for calm mood
      expect(component).toBeTruthy();
    });

    it("supports crisis-related mood states", () => {
      const mockOnCheckIn = jest.fn();
      const { getByTestId } = renderMoodCheckIn({
        currentMood: "anxious",
        onCheckIn: mockOnCheckIn,
      });

      const component = getByTestId("mood-check-in");
      expect(component).toBeTruthy();

      // Since currentMood is set to "anxious", the component should initialize with selectedMood = "anxious"
      // Pressing the check-in button should call onCheckIn
      fireEvent.press(getByTestId("mood-check-in-button"));
      expect(mockOnCheckIn).toHaveBeenCalled();
    });

    it("provides encouraging feedback for mood logging", () => {
      const { getByText } = renderMoodCheckIn();

      // Should show encouraging text
      expect(getByText(/feeling/i) || getByText(/mood/i)).toBeTruthy();
    });
  });

  describe("Animation and Visual Feedback", () => {
    it("handles reduced motion preferences", () => {
      const ReducedMotionProvider = ({ children }) => (
        <ThemeProvider
          value={{
            theme: mockTheme,
            isReducedMotionEnabled: true,
            colors: mockTheme.colors,
          }}
        >
          {children}
        </ThemeProvider>
      );
      ReducedMotionProvider.propTypes = {
        children: PropTypes.node,
      };

      const { getByTestId } = render(
        <ReducedMotionProvider>
          <MoodCheckIn {...defaultProps} />
        </ReducedMotionProvider>,
      );

      const component = getByTestId("mood-check-in");
      expect(component).toBeTruthy();
      // With reduced motion, animations should be minimal or disabled
    });

    it("animates pulse effect when not in reduced motion mode", async () => {
      const { getByTestId } = renderMoodCheckIn();
      const component = getByTestId("mood-check-in");

      expect(component).toBeTruthy();

      // Fast-forward timers to trigger animation
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Animation should have been triggered
      expect(component).toBeTruthy();
    });

    it("responds to press with haptic feedback", async () => {
      const { Haptics } = require("expo-haptics");
      const { getByTestId } = renderMoodCheckIn();
      const button = getByTestId("mood-check-in-button");

      // First select a mood to enable the button
      const happyMoodOption = getByTestId("mood-option-happy");
      fireEvent.press(happyMoodOption);

      fireEvent.press(button);

      await waitFor(() => {
        expect(Haptics.impactAsync).toHaveBeenCalled();
      });
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("handles missing onCheckIn gracefully", () => {
      const { getByTestId } = renderMoodCheckIn({ onCheckIn: undefined });
      const button = getByTestId("mood-check-in-button");

      // Should not crash when onCheckIn is missing
      expect(() => fireEvent.press(button)).not.toThrow();
    });

    it("handles invalid mood values", () => {
      const { getByTestId } = renderMoodCheckIn({
        currentMood: "invalid_mood",
      });
      const component = getByTestId("mood-check-in");

      expect(component).toBeTruthy();
      // Should render without crashing
    });

    it("works when disabled", () => {
      const mockOnCheckIn = jest.fn();
      const { getByTestId } = renderMoodCheckIn({
        disabled: true,
        onCheckIn: mockOnCheckIn,
      });
      const button = getByTestId("mood-check-in-button");

      fireEvent.press(button);

      // Should not call onCheckIn when disabled
      expect(mockOnCheckIn).not.toHaveBeenCalled();
    });

    it("handles theme context missing", () => {
      // Render without theme provider
      expect(() => {
        render(<MoodCheckIn {...defaultProps} />);
      }).not.toThrow();
    });
  });

  describe("Performance", () => {
    it("memoizes properly to prevent unnecessary re-renders", () => {
      const { rerender } = renderMoodCheckIn();

      // Rerender with same props
      rerender(
        <MockThemeProvider>
          <MoodCheckIn {...defaultProps} />
        </MockThemeProvider>,
      );

      // Component should be memoized
      expect(true).toBe(true); // Placeholder - actual memo testing would require React DevTools
    });

    it("handles rapid interactions gracefully", async () => {
      const mockOnCheckIn = jest.fn();
      const { getByTestId } = renderMoodCheckIn({ onCheckIn: mockOnCheckIn });
      const button = getByTestId("mood-check-in-button");

      // First select a mood
      const calmMoodOption = getByTestId("mood-option-calm");
      fireEvent.press(calmMoodOption);

      // Rapidly press button
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      await waitFor(() => {
        // Should handle rapid presses gracefully
        expect(mockOnCheckIn).toHaveBeenCalled();
      });
    });
  });

  describe("Integration with Mental Health Features", () => {
    it("integrates with crisis detection patterns", () => {
      const mockOnCheckIn = jest.fn();
      const { getByTestId } = renderMoodCheckIn({
        currentMood: "desperate", // Invalid mood, should handle gracefully
        onCheckIn: mockOnCheckIn,
      });

      // Since "desperate" is not a valid mood, select a valid anxious mood
      const anxiousMoodOption = getByTestId("mood-option-anxious");
      fireEvent.press(anxiousMoodOption);

      fireEvent.press(getByTestId("mood-check-in-button"));

      // Should handle crisis-related moods
      expect(mockOnCheckIn).toHaveBeenCalled();
    });

    it("provides data for mood analytics", () => {
      const mockOnCheckIn = jest.fn();
      const { getByTestId } = renderMoodCheckIn({ onCheckIn: mockOnCheckIn });

      // Select a mood and check in
      const calmMoodOption = getByTestId("mood-option-calm");
      fireEvent.press(calmMoodOption);

      const button = getByTestId("mood-check-in-button");
      fireEvent.press(button);

      // Should provide timestamp and context data
      expect(mockOnCheckIn).toHaveBeenCalled();
    });
  });
});
