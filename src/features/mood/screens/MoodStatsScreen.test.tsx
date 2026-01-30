/**
 * MoodStatsScreen Tests
 * @description Tests for detailed mood statistics with line graph and time filtering
 * @task Task 3.8.2: Mood Stats Screen (Screen 68)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MoodStatsScreen } from "./MoodStatsScreen";

describe("MoodStatsScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnTimeRangeChange = jest.fn();
  const mockOnDataPointPress = jest.fn();
  const mockOnSortChange = jest.fn();
  const mockOnAddMood = jest.fn();
  const mockOnDayPress = jest.fn();

  const mockTimeRanges = ["1 Day", "1 Week", "1 Month", "1 Year", "All Time"];

  const mockChartData = [
    { date: "Mon", value: 40, emoji: "😢" },
    { date: "Tue", value: 55, emoji: "😐" },
    { date: "Wed", value: 70, emoji: "🙂" },
    { date: "Thu", value: 85, emoji: "😄" },
    { date: "Fri", value: 60, emoji: "😐" },
    { date: "Sat", value: 75, emoji: "🙂" },
    { date: "Sun", value: 90, emoji: "😄" },
  ];

  const mockWeeklyEmojis = [
    { day: "Mon", emoji: "😢" },
    { day: "Tue", emoji: "😐" },
    { day: "Wed", emoji: "🙂" },
    { day: "Thu", emoji: "😄" },
    { day: "Fri", emoji: "😐" },
    { day: "Sat", emoji: "🙂" },
    { day: "Sun", emoji: "😄" },
  ];

  const defaultProps = {
    selectedTimeRange: "1 Week",
    timeRanges: mockTimeRanges,
    chartData: mockChartData,
    weeklyEmojis: mockWeeklyEmojis,
    sortOrder: "newest" as const,
    trendDescription: "Your mood has improved throughout the week",
    onBack: mockOnBack,
    onTimeRangeChange: mockOnTimeRangeChange,
    onDataPointPress: mockOnDataPointPress,
    onSortChange: mockOnSortChange,
    onAddMood: mockOnAddMood,
    onDayPress: mockOnDayPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    expect(getByTestId("mood-stats-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays screen title", () => {
    const { getByText } = render(<MoodStatsScreen {...defaultProps} />);
    expect(getByText("Mood Statistics")).toBeTruthy();
  });

  // --- Time Range Selector ---
  it("displays time range selector", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    expect(getByTestId("time-range-selector")).toBeTruthy();
  });

  it("renders all time range options", () => {
    const { getByText } = render(<MoodStatsScreen {...defaultProps} />);
    for (const range of mockTimeRanges) {
      expect(getByText(range)).toBeTruthy();
    }
  });

  it("highlights the selected time range", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    const selected = getByTestId("time-range-1 Week");
    const flatStyle = Array.isArray(selected.props.style)
      ? Object.assign({}, ...selected.props.style)
      : selected.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#E8853A" })
    );
  });

  it("calls onTimeRangeChange when a range is pressed", () => {
    const { getByText } = render(<MoodStatsScreen {...defaultProps} />);
    fireEvent.press(getByText("1 Month"));
    expect(mockOnTimeRangeChange).toHaveBeenCalledWith("1 Month");
  });

  // --- Line Chart ---
  it("displays mood line chart", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    expect(getByTestId("mood-line-chart")).toBeTruthy();
  });

  it("renders data points on the chart", () => {
    const { getAllByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    const dataPoints = getAllByTestId(/chart-data-point/);
    expect(dataPoints.length).toBe(mockChartData.length);
  });

  it("displays trend description text", () => {
    const { getByText } = render(<MoodStatsScreen {...defaultProps} />);
    expect(
      getByText("Your mood has improved throughout the week")
    ).toBeTruthy();
  });

  // --- Emoji Calendar Row ---
  it("displays emoji calendar row", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    expect(getByTestId("emoji-calendar-row")).toBeTruthy();
  });

  it("renders emoji entries for each day", () => {
    const { getAllByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    const entries = getAllByTestId(/emoji-day-/);
    expect(entries.length).toBe(mockWeeklyEmojis.length);
  });

  it("calls onDayPress when emoji day is tapped", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("emoji-day-Mon"));
    expect(mockOnDayPress).toHaveBeenCalledWith(mockWeeklyEmojis[0]);
  });

  // --- Sort Options ---
  it("displays sort button", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    expect(getByTestId("sort-button")).toBeTruthy();
  });

  it("calls onSortChange when sort button is pressed", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("sort-button"));
    expect(mockOnSortChange).toHaveBeenCalledTimes(1);
  });

  it("displays current sort order label", () => {
    const { getByText } = render(<MoodStatsScreen {...defaultProps} />);
    expect(getByText("Newest")).toBeTruthy();
  });

  // --- FAB ---
  it("displays add mood FAB", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    expect(getByTestId("add-mood-button")).toBeTruthy();
  });

  it("calls onAddMood when FAB is pressed", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("add-mood-button"));
    expect(mockOnAddMood).toHaveBeenCalledTimes(1);
  });

  // --- Accessibility ---
  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
  });

  it("add mood button has proper accessibility", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    const fab = getByTestId("add-mood-button");
    expect(fab.props.accessibilityRole).toBe("button");
    expect(fab.props.accessibilityLabel).toBe("Add mood entry");
  });

  // --- Dark Mode ---
  it("uses dark background color", () => {
    const { getByTestId } = render(<MoodStatsScreen {...defaultProps} />);
    const screen = getByTestId("mood-stats-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<MoodStatsScreen {...defaultProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });

  it("uses correct spelling throughout (not throught)", () => {
    const { queryByText } = render(<MoodStatsScreen {...defaultProps} />);
    expect(queryByText(/throught/)).toBeNull();
  });
});
