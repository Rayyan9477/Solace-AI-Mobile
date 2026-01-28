/**
 * SolaceScoreInsightsScreen Tests
 * @description Tests for Solace score analytics and insights view
 * @task Task 3.5.3: Solace Score Insights Screen (Screen 42)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SolaceScoreInsightsScreen } from "./SolaceScoreInsightsScreen";

describe("SolaceScoreInsightsScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnToggleDarkMode = jest.fn();
  const mockOnHelpPress = jest.fn();
  const mockOnPeriodChange = jest.fn();
  const mockOnDateRangeChange = jest.fn();
  const mockOnMoodHistoryOptions = jest.fn();
  const mockOnSwipeForSuggestions = jest.fn();

  const defaultProps = {
    chartData: [
      { date: new Date("2025-01-09"), positive: 70, negative: 30 },
      { date: new Date("2025-01-16"), positive: 65, negative: 35 },
      { date: new Date("2025-01-23"), positive: 80, negative: 20 },
      { date: new Date("2025-01-30"), positive: 75, negative: 25 },
      { date: new Date("2025-02-06"), positive: 85, negative: 15 },
    ],
    selectedPeriod: "Monthly" as const,
    dateRange: {
      start: new Date("2025-01-09"),
      end: new Date("2025-02-09"),
    },
    weeklyMoods: [
      { day: "Mon", mood: "neutral" as const },
      { day: "Tue", mood: "happy" as const },
      { day: "Wed", mood: "angry" as const },
      { day: "Thu", mood: "neutral" as const },
      { day: "Fri", mood: "sad" as const },
      { day: "Sat", mood: "meh" as const },
      { day: "Sun", mood: "neutral" as const },
    ],
    onBack: mockOnBack,
    onToggleDarkMode: mockOnToggleDarkMode,
    onHelpPress: mockOnHelpPress,
    onPeriodChange: mockOnPeriodChange,
    onDateRangeChange: mockOnDateRangeChange,
    onMoodHistoryOptions: mockOnMoodHistoryOptions,
    onSwipeForSuggestions: mockOnSwipeForSuggestions,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("solace-score-insights-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the dark mode toggle button", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("dark-mode-toggle")).toBeTruthy();
  });

  it("calls onToggleDarkMode when toggle is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("dark-mode-toggle"));
    expect(mockOnToggleDarkMode).toHaveBeenCalledTimes(1);
  });

  it("displays the screen title as Solace Score (not Freud)", () => {
    const { getByText, queryByText } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByText("Solace Score")).toBeTruthy();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("displays the subtitle", () => {
    const { getByText } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByText("See your mental score insights")).toBeTruthy();
  });

  it("displays the help button", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("help-button")).toBeTruthy();
  });

  it("calls onHelpPress when help button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("help-button"));
    expect(mockOnHelpPress).toHaveBeenCalledTimes(1);
  });

  it("displays the chart legend section", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("chart-legend")).toBeTruthy();
  });

  it("displays Positive legend item with green indicator", () => {
    const { getByTestId, getByText } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("legend-positive")).toBeTruthy();
    expect(getByText("Positive")).toBeTruthy();
  });

  it("displays Negative legend item with orange indicator", () => {
    const { getByTestId, getByText } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("legend-negative")).toBeTruthy();
    expect(getByText("Negative")).toBeTruthy();
  });

  it("displays the period dropdown", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("period-dropdown")).toBeTruthy();
  });

  it("displays the current period value", () => {
    const { getByText } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByText("Monthly")).toBeTruthy();
  });

  it("calls onPeriodChange when period is changed", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("period-dropdown"));
    expect(mockOnPeriodChange).toHaveBeenCalled();
  });

  it("displays the chart section", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("chart-section")).toBeTruthy();
  });

  it("displays the stacked bar chart", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("stacked-bar-chart")).toBeTruthy();
  });

  it("displays the timeline scrubber", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("timeline-scrubber")).toBeTruthy();
  });

  it("displays start date label", () => {
    const { getByText } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByText("09 Jan")).toBeTruthy();
  });

  it("displays end date label", () => {
    const { getByText } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByText("09 Feb")).toBeTruthy();
  });

  it("displays the Mood History section", () => {
    const { getByText } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByText("Mood History")).toBeTruthy();
  });

  it("displays mood history options button", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("mood-history-options")).toBeTruthy();
  });

  it("calls onMoodHistoryOptions when options button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("mood-history-options"));
    expect(mockOnMoodHistoryOptions).toHaveBeenCalledTimes(1);
  });

  it("displays weekly mood row", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("weekly-mood-row")).toBeTruthy();
  });

  it("displays all 7 days of the week", () => {
    const { getByText } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByText("Mon")).toBeTruthy();
    expect(getByText("Tue")).toBeTruthy();
    expect(getByText("Wed")).toBeTruthy();
    expect(getByText("Thu")).toBeTruthy();
    expect(getByText("Fri")).toBeTruthy();
    expect(getByText("Sat")).toBeTruthy();
    expect(getByText("Sun")).toBeTruthy();
  });

  it("displays the AI suggestions swipe button", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("ai-suggestions-button")).toBeTruthy();
  });

  it("displays swipe button text", () => {
    const { getByText } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    expect(getByText("Swipe for AI suggestions")).toBeTruthy();
  });

  it("calls onSwipeForSuggestions when button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("ai-suggestions-button"));
    expect(mockOnSwipeForSuggestions).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    const container = getByTestId("solace-score-insights-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("help button has proper accessibility", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    const helpButton = getByTestId("help-button");
    expect(helpButton.props.accessibilityRole).toBe("button");
  });

  it("AI suggestions button has minimum touch target size", () => {
    const { getByTestId } = render(
      <SolaceScoreInsightsScreen {...defaultProps} />
    );
    const button = getByTestId("ai-suggestions-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("renders with Weekly period", () => {
    const { getByText } = render(
      <SolaceScoreInsightsScreen
        {...defaultProps}
        selectedPeriod="Weekly"
      />
    );
    expect(getByText("Weekly")).toBeTruthy();
  });

  it("renders with Yearly period", () => {
    const { getByText } = render(
      <SolaceScoreInsightsScreen
        {...defaultProps}
        selectedPeriod="Yearly"
      />
    );
    expect(getByText("Yearly")).toBeTruthy();
  });
});
