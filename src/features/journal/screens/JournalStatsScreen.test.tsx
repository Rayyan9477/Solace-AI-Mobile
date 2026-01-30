/**
 * JournalStatsScreen Tests
 * @description Tests for journal stats with bar chart showing positive/negative/skipped counts
 * @screen Screen 79: Journal Stats Bar Chart
 * @audit batch-16-mood-tracker-final-journal-start.md
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { JournalStatsScreen } from "./JournalStatsScreen";

describe("JournalStatsScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnChat = jest.fn();
  const mockOnBarPress = jest.fn();

  const mockStats = {
    skipped: { count: 81, emoji: "✕" },
    negative: { count: 32, emoji: "😞" },
    positive: { count: 44, emoji: "😊" },
  };

  const defaultProps = {
    periodLabel: "Your Journal Stats for Feb 2025",
    stats: mockStats,
    onBack: mockOnBack,
    onChat: mockOnChat,
    onBarPress: mockOnBarPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    expect(getByTestId("journal-stats-screen")).toBeTruthy();
  });

  it("uses dark background color", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    const screen = getByTestId("journal-stats-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Header ---
  it("displays 'Journal Stats' title", () => {
    const { getByText } = render(<JournalStatsScreen {...defaultProps} />);
    expect(getByText("Journal Stats")).toBeTruthy();
  });

  it("displays period label", () => {
    const { getByText } = render(<JournalStatsScreen {...defaultProps} />);
    expect(getByText("Your Journal Stats for Feb 2025")).toBeTruthy();
  });

  it("displays back button", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays chat icon button", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    expect(getByTestId("chat-button")).toBeTruthy();
  });

  it("calls onChat when chat button is pressed", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("chat-button"));
    expect(mockOnChat).toHaveBeenCalledTimes(1);
  });

  // --- Bar Chart ---
  it("displays the bar chart container", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    expect(getByTestId("stats-bar-chart")).toBeTruthy();
  });

  it("displays Skipped bar with count", () => {
    const { getByText } = render(<JournalStatsScreen {...defaultProps} />);
    expect(getByText("81")).toBeTruthy();
  });

  it("displays Negative bar with count", () => {
    const { getByText } = render(<JournalStatsScreen {...defaultProps} />);
    expect(getByText("32")).toBeTruthy();
  });

  it("displays Positive bar with count", () => {
    const { getByText } = render(<JournalStatsScreen {...defaultProps} />);
    expect(getByText("44")).toBeTruthy();
  });

  it("displays 'Skipped' label on bar", () => {
    const { getByText } = render(<JournalStatsScreen {...defaultProps} />);
    expect(getByText("Skipped")).toBeTruthy();
  });

  it("displays 'Negative' label on bar", () => {
    const { getByText } = render(<JournalStatsScreen {...defaultProps} />);
    expect(getByText("Negative")).toBeTruthy();
  });

  it("displays 'Positive' label on bar", () => {
    const { getByText } = render(<JournalStatsScreen {...defaultProps} />);
    expect(getByText("Positive")).toBeTruthy();
  });

  it("renders 3 bar elements", () => {
    const { getAllByTestId } = render(
      <JournalStatsScreen {...defaultProps} />
    );
    const bars = getAllByTestId(/^stats-bar-(skipped|negative|positive)$/);
    expect(bars.length).toBe(3);
  });

  it("calls onBarPress when a bar is tapped", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("stats-bar-positive"));
    expect(mockOnBarPress).toHaveBeenCalledWith("positive");
  });

  // --- Bar Colors (from design) ---
  it("skipped bar uses brown color", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    const bar = getByTestId("stats-bar-skipped");
    const flatStyle = Array.isArray(bar.props.style)
      ? Object.assign({}, ...bar.props.style)
      : bar.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#3D2E23" })
    );
  });

  it("negative bar uses orange color", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    const bar = getByTestId("stats-bar-negative");
    const flatStyle = Array.isArray(bar.props.style)
      ? Object.assign({}, ...bar.props.style)
      : bar.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#E8853A" })
    );
  });

  it("positive bar uses green color", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    const bar = getByTestId("stats-bar-positive");
    const flatStyle = Array.isArray(bar.props.style)
      ? Object.assign({}, ...bar.props.style)
      : bar.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#9AAD5C" })
    );
  });

  // --- Emoji Indicators ---
  it("displays emoji indicators under bars", () => {
    const { getAllByTestId } = render(
      <JournalStatsScreen {...defaultProps} />
    );
    const emojis = getAllByTestId(/bar-emoji-/);
    expect(emojis.length).toBe(3);
  });

  // --- Accessibility ---
  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets minimum touch target", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("bars have proper accessibility labels", () => {
    const { getByTestId } = render(<JournalStatsScreen {...defaultProps} />);
    const bar = getByTestId("stats-bar-positive");
    expect(bar.props.accessibilityLabel).toBe("Positive: 44 entries");
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<JournalStatsScreen {...defaultProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });
});
