/**
 * JournalEntryCard Component Tests
 * @task Task 2.9.1: JournalEntryCard Component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { JournalEntryCard } from "./JournalEntryCard";
import { formatEntryTime, truncatePreview } from "./JournalEntryCard.types";

describe("JournalEntryCard", () => {
  const mockOnPress = jest.fn();
  const mockTimestamp = new Date("2024-11-26T10:00:00");

  const defaultProps = {
    id: "entry-1",
    title: "Feeling Positive Today!",
    mood: "overjoyed" as const,
    contentPreview: "Im grateful for the supportive phone call I had with my best friend.",
    timestamp: mockTimestamp,
    aiSuggestionsCount: 7,
    heartRate: 96,
    onPress: mockOnPress,
    testID: "journal-entry-card",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the component", () => {
      const { getByTestId } = render(<JournalEntryCard {...defaultProps} />);

      expect(getByTestId("journal-entry-card")).toBeTruthy();
    });

    it("displays the title", () => {
      const { getByText } = render(<JournalEntryCard {...defaultProps} />);

      expect(getByText("Feeling Positive Today!")).toBeTruthy();
    });

    it("displays the content preview", () => {
      const { getByText } = render(<JournalEntryCard {...defaultProps} />);

      expect(getByText(/Im grateful for the supportive/)).toBeTruthy();
    });

    it("displays the timestamp", () => {
      const { getByText } = render(<JournalEntryCard {...defaultProps} />);

      expect(getByText("10:00")).toBeTruthy();
    });

    it("displays AI suggestions count", () => {
      const { getByText } = render(<JournalEntryCard {...defaultProps} />);

      expect(getByText(/7 AI Suggestions/)).toBeTruthy();
    });

    it("displays heart rate when provided", () => {
      const { getByText } = render(<JournalEntryCard {...defaultProps} />);

      expect(getByText(/96/)).toBeTruthy();
    });

    it("does not display heart rate when not provided", () => {
      const { queryByText } = render(
        <JournalEntryCard {...defaultProps} heartRate={undefined} />,
      );

      expect(queryByText(/♡/)).toBeNull();
    });

    it("displays mood badge", () => {
      const { getByText } = render(<JournalEntryCard {...defaultProps} />);

      expect(getByText("Overjoyed")).toBeTruthy();
    });
  });

  describe("Mood Variations", () => {
    it("displays depressed mood correctly", () => {
      const { getByText } = render(
        <JournalEntryCard {...defaultProps} mood="depressed" />,
      );

      expect(getByText("Depressed")).toBeTruthy();
    });

    it("displays sad mood correctly", () => {
      const { getByText } = render(
        <JournalEntryCard {...defaultProps} mood="sad" />,
      );

      expect(getByText("Sad")).toBeTruthy();
    });

    it("displays neutral mood correctly", () => {
      const { getByText } = render(
        <JournalEntryCard {...defaultProps} mood="neutral" />,
      );

      expect(getByText("Neutral")).toBeTruthy();
    });

    it("displays happy mood correctly", () => {
      const { getByText } = render(
        <JournalEntryCard {...defaultProps} mood="happy" />,
      );

      expect(getByText("Happy")).toBeTruthy();
    });
  });

  describe("Interaction", () => {
    it("calls onPress when card is pressed", () => {
      const { getByTestId } = render(<JournalEntryCard {...defaultProps} />);

      fireEvent.press(getByTestId("journal-entry-card"));
      expect(mockOnPress).toHaveBeenCalledWith("entry-1");
    });

    it("does not call onPress when not provided", () => {
      const { getByTestId } = render(
        <JournalEntryCard {...defaultProps} onPress={undefined} />,
      );

      fireEvent.press(getByTestId("journal-entry-card"));
      // Should not throw error
    });
  });

  describe("Accessibility", () => {
    it("has correct accessibility role", () => {
      const { getByTestId } = render(<JournalEntryCard {...defaultProps} />);

      const card = getByTestId("journal-entry-card");
      expect(card.props.accessibilityRole).toBe("button");
    });

    it("uses default accessibility label", () => {
      const { getByTestId } = render(<JournalEntryCard {...defaultProps} />);

      const card = getByTestId("journal-entry-card");
      expect(card.props.accessibilityLabel).toContain("Feeling Positive Today!");
      expect(card.props.accessibilityLabel).toContain("Overjoyed");
    });

    it("uses custom accessibility label when provided", () => {
      const { getByTestId } = render(
        <JournalEntryCard
          {...defaultProps}
          accessibilityLabel="Custom label"
        />,
      );

      const card = getByTestId("journal-entry-card");
      expect(card.props.accessibilityLabel).toBe("Custom label");
    });
  });

  describe("Styling", () => {
    it("applies custom styles", () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <JournalEntryCard {...defaultProps} style={customStyle} />,
      );

      const card = getByTestId("journal-entry-card");
      expect(card.props.style).toEqual(expect.objectContaining(customStyle));
    });
  });

  describe("Edge Cases", () => {
    it("handles long titles gracefully", () => {
      const longTitle =
        "This is a very long title that should be displayed properly without breaking the layout";
      const { getByText } = render(
        <JournalEntryCard {...defaultProps} title={longTitle} />,
      );

      expect(getByText(longTitle)).toBeTruthy();
    });

    it("handles long content preview", () => {
      const longPreview =
        "This is a very long content preview that should be truncated to maximum two lines";
      const { getByText } = render(
        <JournalEntryCard {...defaultProps} contentPreview={longPreview} />,
      );

      expect(getByText(longPreview)).toBeTruthy();
    });

    it("handles zero AI suggestions", () => {
      const { getByText } = render(
        <JournalEntryCard {...defaultProps} aiSuggestionsCount={0} />,
      );

      expect(getByText(/0 AI Suggestions/)).toBeTruthy();
    });

    it("handles high AI suggestions count", () => {
      const { getByText } = render(
        <JournalEntryCard {...defaultProps} aiSuggestionsCount={99} />,
      );

      expect(getByText(/99 AI Suggestions/)).toBeTruthy();
    });
  });
});

// Helper function tests
describe("JournalEntryCard Helper Functions", () => {
  describe("formatEntryTime", () => {
    it("formats morning time correctly", () => {
      const date = new Date("2024-11-26T10:00:00");
      expect(formatEntryTime(date)).toBe("10:00");
    });

    it("formats afternoon time correctly", () => {
      const date = new Date("2024-11-26T14:30:00");
      expect(formatEntryTime(date)).toBe("14:30");
    });

    it("formats evening time correctly", () => {
      const date = new Date("2024-11-26T21:45:00");
      expect(formatEntryTime(date)).toBe("21:45");
    });

    it("pads single-digit hours", () => {
      const date = new Date("2024-11-26T09:00:00");
      expect(formatEntryTime(date)).toBe("09:00");
    });

    it("pads single-digit minutes", () => {
      const date = new Date("2024-11-26T10:05:00");
      expect(formatEntryTime(date)).toBe("10:05");
    });
  });

  describe("truncatePreview", () => {
    it("does not truncate short text", () => {
      const shortText = "This is short";
      expect(truncatePreview(shortText, 60)).toBe(shortText);
    });

    it("truncates long text at max length", () => {
      const longText =
        "This is a very long text that should be truncated to the maximum length";
      const result = truncatePreview(longText, 60);

      expect(result.length).toBeLessThanOrEqual(64); // 60 + "..."
      expect(result).toContain("...");
    });

    it("uses default max length of 60", () => {
      const longText = "a".repeat(100);
      const result = truncatePreview(longText);

      expect(result.length).toBeLessThanOrEqual(64);
    });

    it("trims whitespace before adding ellipsis", () => {
      const text = "This is a long text that will be cut                    ";
      const result = truncatePreview(text, 30);

      expect(result).not.toMatch(/\s+\.\.\./);
    });
  });
});
