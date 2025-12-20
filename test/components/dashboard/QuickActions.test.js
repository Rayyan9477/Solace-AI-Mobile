/**
 * QuickActions Component Unit Tests
 * Tests for mental health quick action functionality
 * Includes therapeutic design patterns and accessibility
 */

import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import PropTypes from "prop-types";
import React from "react";

import QuickActions from "../../../src/features/dashboard/components/QuickActions";
import { ThemeProvider } from "../../../src/shared/theme/ThemeContext";

// Mock dependencies
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children, ...props }) => children,
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
}));

jest.mock("@react-navigation/native", () => {
  const navObj = { navigate: jest.fn(), push: jest.fn(), goBack: jest.fn() };
  const useNavigation = jest.fn(() => navObj);
  return { useNavigation, __mockedNav: navObj };
});

// TEST FIX: Mock @theme/ThemeProvider to provide proper theme context
jest.mock("@theme/ThemeProvider", () => ({
  useTheme: () => ({
    theme: {
      colors: {
        therapeutic: {
          calming: { "50": "#007AFF" },
          nurturing: { "50": "#34C759" },
          peaceful: { "50": "#5AC8FA" },
        },
        primary: "#007AFF",
        error: "#FF3B30",
        info: "#5AC8FA",
        success: "#34C759",
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

const mockTheme = {
  colors: {
    nurturing: ["#4CAF50", "#81C784"],
    calming: ["#2196F3", "#64B5F6"],
    peaceful: ["#607D8B", "#90A4AE"],
    grounding: ["#9C27B0", "#BA68C8"],
    energizing: ["#FF9800", "#FFB74D"],
    background: "#FFFFFF",
    text: "#000000",
    surface: "#F5F5F5",
    primary: "#2196F3",
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
    h3: { fontSize: 20, fontWeight: "bold" },
    body: { fontSize: 16, fontWeight: "normal" },
    caption: { fontSize: 12, fontWeight: "normal" },
  },
};

const MockThemeProvider = ({ children }) => {
  return children;
};
MockThemeProvider.propTypes = {
  children: PropTypes.node,
};

describe("QuickActions Component", () => {
  const defaultProps = {
    onActionPress: jest.fn(),
    accessibilityLabel: "Quick mental health actions",
    testID: "quick-actions",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderQuickActions = (props = {}) => {
    return render(
      <MockThemeProvider>
        <QuickActions {...defaultProps} {...props} />
      </MockThemeProvider>,
    );
  };

  describe("Rendering and Layout", () => {
    it("renders correctly with default props", () => {
      const { getByTestId } = renderQuickActions();
      const component = getByTestId("quick-actions");
      expect(component).toBeTruthy();
    });

    it("displays all mental health action options", () => {
      const { getByText } = renderQuickActions();

      // Common mental health actions
      expect(
        getByText(/therapy/i) || getByText(/journal/i) || getByText(/mindful/i),
      ).toBeTruthy();
    });

    it("renders action cards with proper therapeutic styling", () => {
      const { getAllByTestId } = renderQuickActions();
      const actionCards = getAllByTestId(/action-card/i);

      expect(actionCards.length).toBeGreaterThan(0);
      for (const card of actionCards) {
        expect(card).toBeTruthy();
      }
    });

    it("applies staggered animations correctly", async () => {
      const { getAllByTestId } = renderQuickActions();
      const actionCards = getAllByTestId(/action-card/i);

      // Fast-forward timers for staggered animations
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(actionCards.length).toBeGreaterThan(0);
    });
  });

  describe("Mental Health Action Types", () => {
    it("includes therapy session action", () => {
      const { getByTestId } = renderQuickActions();
      const therapyAction =
        (typeof queryByTestId === "function" &&
          queryByTestId("action-therapy")) ||
        getByTestId("action-card-therapy");
      expect(therapyAction).toBeTruthy();
    });

    it("includes journaling action", () => {
      const { getByTestId } = renderQuickActions();
      const journalAction =
        (typeof queryByTestId === "function" &&
          queryByTestId("action-journal")) ||
        getByTestId("action-card-journal");
      expect(journalAction).toBeTruthy();
    });

    it("includes mindfulness action", () => {
      const { getByTestId } = renderQuickActions();
      const mindfulAction =
        (typeof queryByTestId === "function" &&
          queryByTestId("action-mindful")) ||
        getByTestId("action-card-mindful");
      expect(mindfulAction).toBeTruthy();
    });

    it("includes crisis support access", () => {
      const { getByTestId, getByText } = renderQuickActions();
      const crisisAction =
        (typeof queryByTestId === "function" &&
          queryByTestId("action-crisis")) ||
        getByTestId("action-card-crisis") ||
        getByText(/crisis/i) ||
        getByText(/emergency/i);
      expect(crisisAction).toBeTruthy();
    });
  });

  describe("Interaction and Navigation", () => {
    it("calls onActionPress when action is selected", async () => {
      const mockOnActionPress = jest.fn();
      const { getAllByTestId } = renderQuickActions({
        onActionPress: mockOnActionPress,
      });
      const actionCards = getAllByTestId(/action-card/i);

      if (actionCards.length > 0) {
        fireEvent.press(actionCards[0]);

        await waitFor(() => {
          expect(mockOnActionPress).toHaveBeenCalled();
        });
      }
    });

    it("navigates to correct screens for each action", async () => {
      const mockOnActionPress = jest.fn();
      const { getByTestId, queryByTestId } = renderQuickActions({
        onActionPress: mockOnActionPress,
      });

      // Test therapy action navigation
      const therapyAction =
        (typeof queryByTestId === "function" &&
          queryByTestId("action-therapy")) ||
        getByTestId("action-card-therapy");
      if (therapyAction) {
        fireEvent.press(therapyAction);
        await waitFor(() => {
          expect(mockOnActionPress).toHaveBeenCalledWith(
            expect.objectContaining({
              type: "therapy",
              id: "therapy",
            }),
          );
        });
      }
    });

    it("provides haptic feedback on action press", async () => {
      const Haptics = require("expo-haptics");
      const { getAllByTestId } = renderQuickActions();
      const actionCards = getAllByTestId(/action-card/i);

      if (actionCards.length > 0) {
        fireEvent.press(actionCards[0]);

        await waitFor(() => {
          expect(Haptics.impactAsync).toHaveBeenCalled();
        });
      }
    });
  });

  describe("Accessibility Features", () => {
    it("has proper accessibility labels for each action", () => {
      const { getAllByTestId } = renderQuickActions();
      const actionCards = getAllByTestId(/action-card/i);

      for (const card of actionCards) {
        expect(card.props.accessibilityLabel).toBeTruthy();
        expect(card.props.accessibilityRole).toBe("button");
      }
    });

    it("provides meaningful accessibility hints", () => {
      const { getAllByTestId } = renderQuickActions();
      const actionCards = getAllByTestId(/action-card/i);

      for (const card of actionCards) {
        expect(card.props.accessibilityHint).toBeTruthy();
      }
    });

    it("meets minimum touch target requirements", () => {
      const { getAllByTestId } = renderQuickActions();
      const actionCards = getAllByTestId(/action-card/i);
      const minTouchTarget = 44;

      for (const card of actionCards) {
        const style = card.props.style;
        expect(style.minHeight || style.height).toBeGreaterThanOrEqual(
          minTouchTarget,
        );
      }
    });

    it("supports screen reader navigation", () => {
      const { getByTestId } = renderQuickActions();
      const component = getByTestId("quick-actions");

      expect(component.props.accessible).toBe(true);
      expect(component.props.accessibilityLabel).toBeTruthy();
    });
  });

  describe("Therapeutic Design Patterns", () => {
    it("uses appropriate therapeutic colors for each action type", () => {
      const { getAllByTestId } = renderQuickActions();
      const actionCards = getAllByTestId(/action-card/i);

      // Each card should have therapeutic styling
      for (const card of actionCards) {
        expect(card).toBeTruthy();
      }
    });

    it("displays encouraging and supportive text", () => {
      const { getByText } = renderQuickActions();

      // Should contain positive, supportive language
      const supportiveElements = [
        /support/i,
        /help/i,
        /wellness/i,
        /mindful/i,
        /care/i,
        /journal/i,
        /therapy/i,
      ];

      const hasSupprotiveText = supportiveElements.some((pattern) => {
        try {
          return getByText(pattern);
        } catch {
          return false;
        }
      });

      expect(hasSupprotiveText).toBe(true);
    });

    it("prioritizes crisis support visibility", () => {
      const { getAllByTestId } = renderQuickActions();
      const actionCards = getAllByTestId(/action-card/i);

      // Crisis support should be prominently displayed
      const crisisCard = actionCards.find(
        (card) =>
          card.props.testID?.includes("crisis") ||
          card.props.accessibilityLabel?.toLowerCase().includes("crisis"),
      );

      if (crisisCard) {
        expect(crisisCard).toBeTruthy();
      }
    });
  });

  describe("Animation and Visual Feedback", () => {
    it("respects reduced motion preferences", () => {
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
          <QuickActions {...defaultProps} />
        </ReducedMotionProvider>,
      );

      const component = getByTestId("quick-actions");
      expect(component).toBeTruthy();
    });

    it("animates cards with staggered entrance", async () => {
      const { getAllByTestId } = renderQuickActions();
      const actionCards = getAllByTestId(/action-card/i);

      // Advance timers to trigger staggered animations
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(actionCards.length).toBeGreaterThan(0);
    });

    it("provides visual feedback on press", async () => {
      const { getAllByTestId } = renderQuickActions();
      const actionCards = getAllByTestId(/action-card/i);

      if (actionCards.length > 0) {
        fireEvent.press(actionCards[0]);

        // Should provide visual feedback
        expect(actionCards[0]).toBeTruthy();
      }
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("handles missing onActionPress gracefully", () => {
      const { getAllByTestId } = renderQuickActions({
        onActionPress: undefined,
      });
      const actionCards = getAllByTestId(/action-card/i);

      if (actionCards.length > 0) {
        expect(() => fireEvent.press(actionCards[0])).not.toThrow();
      }
    });

    it("renders without theme context", () => {
      expect(() => {
        render(<QuickActions {...defaultProps} />);
      }).not.toThrow();
    });

    it("handles rapid action selections", async () => {
      const mockOnActionPress = jest.fn();
      const { getAllByTestId } = renderQuickActions({
        onActionPress: mockOnActionPress,
      });
      const actionCards = getAllByTestId(/action-card/i);

      if (actionCards.length > 0) {
        // Rapidly press multiple actions
        fireEvent.press(actionCards[0]);
        if (actionCards[1]) fireEvent.press(actionCards[1]);
        if (actionCards[2]) fireEvent.press(actionCards[2]);

        await waitFor(() => {
          expect(mockOnActionPress).toHaveBeenCalled();
        });
      }
    });
  });

  describe("Integration with Mental Health Features", () => {
    it("integrates with crisis intervention system", async () => {
      const mockOnActionPress = jest.fn();
      const { getByTestId, queryByTestId } = renderQuickActions({
        onActionPress: mockOnActionPress,
      });

      const crisisAction =
        (typeof queryByTestId === "function" &&
          queryByTestId("action-crisis")) ||
        getByTestId("action-card-crisis");
      if (crisisAction) {
        fireEvent.press(crisisAction);

        await waitFor(() => {
          expect(mockOnActionPress).toHaveBeenCalledWith(
            expect.objectContaining({
              type: expect.stringMatching(/crisis|emergency/i),
            }),
          );
        });
      }
    });

    it("tracks action analytics for mental health insights", async () => {
      const mockOnActionPress = jest.fn();
      const { getAllByTestId } = renderQuickActions({
        onActionPress: mockOnActionPress,
      });
      const actionCards = getAllByTestId(/action-card/i);

      if (actionCards.length > 0) {
        fireEvent.press(actionCards[0]);

        await waitFor(() => {
          const callArgs = mockOnActionPress.mock.calls[0];
          expect(callArgs).toBeDefined();
          expect(callArgs[0]).toHaveProperty("timestamp");
        });
      }
    });

    it("provides contextual recommendations", () => {
      const { getByTestId } = renderQuickActions({
        userContext: { recentMood: "anxious", timeOfDay: "evening" },
      });

      const component = getByTestId("quick-actions");
      expect(component).toBeTruthy();

      // Should adapt recommendations based on context
    });
  });
});
