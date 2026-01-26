/**
 * SessionCard Component Tests
 * @task Task 2.9.2: SessionCard Component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SessionCard } from "./SessionCard";
import { formatSessionTime, calculateProgress } from "./SessionCard.types";

describe("SessionCard", () => {
  const mockOnPress = jest.fn();
  const mockOnPlayPress = jest.fn();

  const defaultProps = {
    id: "session-1",
    title: "Deep Meditation",
    soundscape: { name: "Nature", color: "#9AAD5C" },
    duration: 25,
    progress: 5.034,
    onPress: mockOnPress,
    onPlayPress: mockOnPlayPress,
    testID: "session-card",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the component", () => {
      const { getByTestId } = render(<SessionCard {...defaultProps} />);
      expect(getByTestId("session-card")).toBeTruthy();
    });

    it("displays the title", () => {
      const { getByText } = render(<SessionCard {...defaultProps} />);
      expect(getByText("Deep Meditation")).toBeTruthy();
    });

    it("displays soundscape badge", () => {
      const { getByText } = render(<SessionCard {...defaultProps} />);
      expect(getByText("Nature")).toBeTruthy();
    });

    it("displays progress time", () => {
      const { getByText } = render(<SessionCard {...defaultProps} />);
      expect(getByText("05:02")).toBeTruthy();
    });

    it("displays total time", () => {
      const { getByText } = render(<SessionCard {...defaultProps} />);
      expect(getByText("25:00")).toBeTruthy();
    });

    it("displays play button", () => {
      const { getByTestId } = render(<SessionCard {...defaultProps} />);
      expect(getByTestId("session-card-play-button")).toBeTruthy();
    });
  });

  describe("Progress Bar", () => {
    it("shows progress bar", () => {
      const { getByTestId } = render(<SessionCard {...defaultProps} />);
      expect(getByTestId("session-card-progress")).toBeTruthy();
    });

    it("calculates correct progress percentage", () => {
      const progress = calculateProgress(5.03, 25);
      expect(progress).toBeCloseTo(20.12, 1);
    });
  });

  describe("Interaction", () => {
    it("calls onPress when card is pressed", () => {
      const { getByTestId } = render(<SessionCard {...defaultProps} />);
      fireEvent.press(getByTestId("session-card"));
      expect(mockOnPress).toHaveBeenCalledWith("session-1");
    });

    it("calls onPlayPress when play button is pressed", () => {
      const { getByTestId } = render(<SessionCard {...defaultProps} />);
      fireEvent.press(getByTestId("session-card-play-button"));
      expect(mockOnPlayPress).toHaveBeenCalledWith("session-1");
    });

    it("does not call onPress when not provided", () => {
      const { getByTestId } = render(
        <SessionCard {...defaultProps} onPress={undefined} />,
      );
      fireEvent.press(getByTestId("session-card"));
      // Should not throw
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility role for card", () => {
      const { getByTestId } = render(<SessionCard {...defaultProps} />);
      const card = getByTestId("session-card");
      expect(card.props.accessibilityRole).toBe("button");
    });

    it("uses default accessibility label", () => {
      const { getByTestId } = render(<SessionCard {...defaultProps} />);
      const card = getByTestId("session-card");
      expect(card.props.accessibilityLabel).toContain("Deep Meditation");
    });
  });
});

// Helper function tests
describe("SessionCard Helper Functions", () => {
  describe("formatSessionTime", () => {
    it("formats whole minutes", () => {
      expect(formatSessionTime(25)).toBe("25:00");
    });

    it("formats minutes with seconds", () => {
      expect(formatSessionTime(5.034)).toBe("05:02");
    });

    it("pads single digits", () => {
      expect(formatSessionTime(9.083)).toBe("09:04");
    });
  });

  describe("calculateProgress", () => {
    it("calculates percentage correctly", () => {
      expect(calculateProgress(5, 25)).toBe(20);
    });

    it("handles zero duration", () => {
      expect(calculateProgress(5, 0)).toBe(0);
    });

    it("caps at 100%", () => {
      expect(calculateProgress(30, 25)).toBe(100);
    });
  });
});
