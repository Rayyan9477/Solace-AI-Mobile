/**
 * SleepInsightsScreen Tests
 * @description Tests for the sleep insights analytics screen with time range tabs,
 *   timeline chart, legend, and AI suggestion cards
 * @task Task 3.10.7: Sleep Insights Screen (Screen 95)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SleepInsightsScreen } from "./SleepInsightsScreen";

describe("SleepInsightsScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnRangeChange = jest.fn();
  const mockOnSuggestionPress = jest.fn();
  const mockOnSeeAllPress = jest.fn();

  const defaultProps = {
    selectedRange: "1 Week",
    suggestions: [
      {
        id: "1",
        icon: "\uD83C\uDF19",
        iconColor: "#7B68B5",
        title: "Loud Snoring",
        description: "Control your snoring!",
      },
      {
        id: "2",
        icon: "\uD83D\uDC3E",
        iconColor: "#C4A535",
        title: "Pillow Improvement",
        description: "Change your pillows",
      },
      {
        id: "3",
        icon: "\uD83C\uDF21\uFE0F",
        iconColor: "#4A9E8C",
        title: "Temperature Adjustment",
        description: "Increase your room temp",
      },
      {
        id: "4",
        icon: "\u23F0",
        iconColor: "#C4A535",
        title: "Sleep Irregularity",
        description: "Your sleep is irregular",
      },
      {
        id: "5",
        icon: "\u2764\uFE0F",
        iconColor: "#7B68B5",
        title: "Heartbeat Irregularity",
        description: "We detected heartbeat deviation",
      },
    ],
    onBack: mockOnBack,
    onRangeChange: mockOnRangeChange,
    onSuggestionPress: mockOnSuggestionPress,
    onSeeAllPress: mockOnSeeAllPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =============================================
  // 1. Rendering
  // =============================================
  it("renders the screen container", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("sleep-insights-screen")).toBeTruthy();
  });

  it("uses dark background color #1C1410", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    const screen = getByTestId("sleep-insights-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    const screen = getByTestId("sleep-insights-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ flex: 1 })
    );
  });

  // =============================================
  // 2. Header
  // =============================================
  it("displays the back button", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("back button has accessibilityRole button", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("back-button").props.accessibilityLabel).toBe(
      "Go back"
    );
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("back-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  it("displays 'Sleep Insights' title", () => {
    const { getByText } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByText("Sleep Insights")).toBeTruthy();
  });

  // =============================================
  // 3. Time Range Selector
  // =============================================
  it("renders the time range selector", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("time-range-selector")).toBeTruthy();
  });

  it("displays all five time range tabs", () => {
    const { getByText } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByText("1 Day")).toBeTruthy();
    expect(getByText("1 Week")).toBeTruthy();
    expect(getByText("1 Month")).toBeTruthy();
    expect(getByText("1 Year")).toBeTruthy();
    expect(getByText("All Time")).toBeTruthy();
  });

  it("highlights the selected time range tab", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    const selectedTab = getByTestId("time-range-tab-1 Week");
    const flatStyle = Array.isArray(selectedTab.props.style)
      ? Object.assign({}, ...selectedTab.props.style)
      : selectedTab.props.style;
    expect(flatStyle.borderWidth).toBeGreaterThan(0);
  });

  it("calls onRangeChange when a tab is pressed", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("time-range-tab-1 Month"));
    expect(mockOnRangeChange).toHaveBeenCalledWith("1 Month");
  });

  it("time range tabs have accessibilityRole button", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(
      getByTestId("time-range-tab-1 Day").props.accessibilityRole
    ).toBe("button");
  });

  // =============================================
  // 4. Sleep Timeline Chart
  // =============================================
  it("renders the sleep timeline chart", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("sleep-timeline-chart")).toBeTruthy();
  });

  it("renders the irregularity marker", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("irregularity-marker")).toBeTruthy();
  });

  it("displays 'Sleep Irregularity' marker text", () => {
    const { getAllByText } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    const elements = getAllByText("Sleep Irregularity");
    expect(elements.length).toBeGreaterThanOrEqual(1);
  });

  // =============================================
  // 5. Chart Legend
  // =============================================
  it("renders the chart legend", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("chart-legend")).toBeTruthy();
  });

  it("displays Core legend item", () => {
    const { getByText } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByText("Core")).toBeTruthy();
  });

  it("displays REM legend item", () => {
    const { getByText } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByText("REM")).toBeTruthy();
  });

  it("displays Post-REM legend item", () => {
    const { getByText } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByText("Post-REM")).toBeTruthy();
  });

  // =============================================
  // 6. AI Suggestions Section
  // =============================================
  it("displays 'AI Suggestions' section header", () => {
    const { getByText } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByText("AI Suggestions")).toBeTruthy();
  });

  it("renders the See All button", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByTestId("see-all-button")).toBeTruthy();
  });

  it("displays 'See All' text", () => {
    const { getByText } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByText("See All")).toBeTruthy();
  });

  it("calls onSeeAllPress when See All is pressed", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("see-all-button"));
    expect(mockOnSeeAllPress).toHaveBeenCalledTimes(1);
  });

  // =============================================
  // 7. Suggestion Cards
  // =============================================
  it("renders all suggestion cards", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    defaultProps.suggestions.forEach((suggestion) => {
      expect(getByTestId(`suggestion-card-${suggestion.id}`)).toBeTruthy();
    });
  });

  it("displays suggestion titles", () => {
    const { getByText, getAllByText } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByText("Loud Snoring")).toBeTruthy();
    expect(getByText("Pillow Improvement")).toBeTruthy();
    expect(getByText("Temperature Adjustment")).toBeTruthy();
    // "Sleep Irregularity" appears in both the marker and suggestion card
    expect(getAllByText("Sleep Irregularity").length).toBeGreaterThanOrEqual(2);
    expect(getByText("Heartbeat Irregularity")).toBeTruthy();
  });

  it("displays suggestion descriptions", () => {
    const { getByText } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(getByText("Control your snoring!")).toBeTruthy();
    expect(getByText("Change your pillows")).toBeTruthy();
    expect(getByText("Increase your room temp")).toBeTruthy();
    expect(getByText("Your sleep is irregular")).toBeTruthy();
    expect(getByText("We detected heartbeat deviation")).toBeTruthy();
  });

  it("renders suggestion icon badges", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    defaultProps.suggestions.forEach((suggestion) => {
      expect(
        getByTestId(`suggestion-icon-${suggestion.id}`)
      ).toBeTruthy();
    });
  });

  it("calls onSuggestionPress with correct id when card is pressed", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("suggestion-card-1"));
    expect(mockOnSuggestionPress).toHaveBeenCalledWith("1");
  });

  it("calls onSuggestionPress with different id for different card", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("suggestion-card-3"));
    expect(mockOnSuggestionPress).toHaveBeenCalledWith("3");
  });

  it("suggestion cards have accessibilityRole button", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(
      getByTestId("suggestion-card-1").props.accessibilityRole
    ).toBe("button");
  });

  it("renders chevron indicator on each suggestion card", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    defaultProps.suggestions.forEach((suggestion) => {
      expect(
        getByTestId(`suggestion-chevron-${suggestion.id}`)
      ).toBeTruthy();
    });
  });

  // =============================================
  // 8. Dynamic Data
  // =============================================
  it("highlights different range when selectedRange changes", () => {
    const { getByTestId } = render(
      <SleepInsightsScreen {...defaultProps} selectedRange="1 Month" />
    );
    const selectedTab = getByTestId("time-range-tab-1 Month");
    const flatStyle = Array.isArray(selectedTab.props.style)
      ? Object.assign({}, ...selectedTab.props.style)
      : selectedTab.props.style;
    expect(flatStyle.borderWidth).toBeGreaterThan(0);
  });

  it("renders with empty suggestions list", () => {
    const { getByTestId, queryByTestId } = render(
      <SleepInsightsScreen {...defaultProps} suggestions={[]} />
    );
    expect(getByTestId("sleep-insights-screen")).toBeTruthy();
    expect(queryByTestId("suggestion-card-1")).toBeNull();
  });

  // =============================================
  // 9. Branding
  // =============================================
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(
      <SleepInsightsScreen {...defaultProps} />
    );
    expect(queryByText(/freud/i)).toBeNull();
  });
});
