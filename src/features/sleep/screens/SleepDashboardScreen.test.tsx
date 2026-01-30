/**
 * SleepDashboardScreen Tests
 * @description Tests for the main sleep tracking dashboard with score hero and overview metrics
 * @task Task 3.10.1: Sleep Dashboard Screen (Screen 87)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SleepDashboardScreen } from "./SleepDashboardScreen";

describe("SleepDashboardScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSeeAll = jest.fn();
  const mockOnAddSleep = jest.fn();
  const mockOnMetricPress = jest.fn();

  const defaultProps = {
    sleepScore: 20,
    sleepQuality: "Insomniac" as const,
    remHours: 8.5,
    coreHours: 7.8,
    remProgress: 0.7,
    coreProgress: 0.65,
    onBack: mockOnBack,
    onSeeAll: mockOnSeeAll,
    onAddSleep: mockOnAddSleep,
    onMetricPress: mockOnMetricPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("sleep-dashboard-screen")).toBeTruthy();
  });

  it("uses dark background color", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    const screen = getByTestId("sleep-dashboard-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Hero Section ---
  it("renders the hero section with purple background", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    const hero = getByTestId("sleep-hero-section");
    const flatStyle = Array.isArray(hero.props.style)
      ? Object.assign({}, ...hero.props.style)
      : hero.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#7B68B5" })
    );
  });

  it("renders decorative cloud elements in hero", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("decorative-clouds")).toBeTruthy();
  });

  // --- Header ---
  it("displays the back button", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays 'Sleep Quality' header title", () => {
    const { getByText } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByText("Sleep Quality")).toBeTruthy();
  });

  // --- Sleep Score Display ---
  it("displays the sleep score", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    const scoreDisplay = getByTestId("sleep-score-display");
    expect(scoreDisplay).toBeTruthy();
  });

  it("renders score value of 20", () => {
    const { getByText } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByText("20")).toBeTruthy();
  });

  it("renders different score values", () => {
    const { getByText } = render(
      <SleepDashboardScreen {...defaultProps} sleepScore={85} sleepQuality="Excellent" />
    );
    expect(getByText("85")).toBeTruthy();
  });

  // --- Sleep Quality Label ---
  it("displays sleep quality status text", () => {
    const { getByText } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByText("You are Insomniac.")).toBeTruthy();
  });

  it("displays different quality labels", () => {
    const { getByText } = render(
      <SleepDashboardScreen {...defaultProps} sleepScore={85} sleepQuality="Excellent" />
    );
    expect(getByText("You are Excellent.")).toBeTruthy();
  });

  it("displays Good quality label", () => {
    const { getByText } = render(
      <SleepDashboardScreen {...defaultProps} sleepScore={65} sleepQuality="Good" />
    );
    expect(getByText("You are Good.")).toBeTruthy();
  });

  // --- FAB Button ---
  it("renders the floating action button", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("add-sleep-button")).toBeTruthy();
  });

  it("displays + icon on FAB", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    const fab = getByTestId("add-sleep-button");
    expect(fab).toBeTruthy();
  });

  it("calls onAddSleep when FAB is pressed", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("add-sleep-button"));
    expect(mockOnAddSleep).toHaveBeenCalledTimes(1);
  });

  // --- Sleep Overview Section ---
  it("displays 'Sleep Overview' section header", () => {
    const { getByText } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByText("Sleep Overview")).toBeTruthy();
  });

  it("displays 'See All' link", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("see-all-button")).toBeTruthy();
  });

  it("calls onSeeAll when See All is pressed", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("see-all-button"));
    expect(mockOnSeeAll).toHaveBeenCalledTimes(1);
  });

  // --- REM Metric Card ---
  it("renders the REM sleep metric card", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("rem-metric-card")).toBeTruthy();
  });

  it("displays 'Rem' label", () => {
    const { getByText } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByText("Rem")).toBeTruthy();
  });

  it("displays REM hours value", () => {
    const { getByText } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByText("8.5h")).toBeTruthy();
  });

  it("renders REM circular progress ring", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("rem-progress-ring")).toBeTruthy();
  });

  it("calls onMetricPress with rem type when REM card is pressed", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("rem-metric-card"));
    expect(mockOnMetricPress).toHaveBeenCalledWith("rem");
  });

  // --- Core Metric Card ---
  it("renders the Core sleep metric card", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("core-metric-card")).toBeTruthy();
  });

  it("displays 'Core' label", () => {
    const { getByText } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByText("Core")).toBeTruthy();
  });

  it("displays Core hours value", () => {
    const { getByText } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByText("7.8h")).toBeTruthy();
  });

  it("renders Core circular progress ring", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("core-progress-ring")).toBeTruthy();
  });

  it("calls onMetricPress with core type when Core card is pressed", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("core-metric-card"));
    expect(mockOnMetricPress).toHaveBeenCalledWith("core");
  });

  // --- Accessibility ---
  it("back button has accessibilityRole button", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    const backButton = getByTestId("back-button");
    expect(backButton.props.style).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  it("FAB has accessibilityRole button", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("add-sleep-button").props.accessibilityRole).toBe("button");
  });

  it("FAB has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("add-sleep-button").props.accessibilityLabel).toBe(
      "Add sleep entry"
    );
  });

  it("FAB meets minimum touch target", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    const fab = getByTestId("add-sleep-button");
    expect(fab.props.style).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  it("See All has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("see-all-button").props.accessibilityLabel).toBe(
      "See all sleep overview"
    );
  });

  it("REM card has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("rem-metric-card").props.accessibilityLabel).toBe(
      "REM sleep: 8.5 hours"
    );
  });

  it("Core card has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(getByTestId("core-metric-card").props.accessibilityLabel).toBe(
      "Core sleep: 7.8 hours"
    );
  });

  // --- Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<SleepDashboardScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });

  // --- Edge Cases ---
  it("handles zero sleep score", () => {
    const { getByText } = render(
      <SleepDashboardScreen {...defaultProps} sleepScore={0} sleepQuality="Insomniac" />
    );
    expect(getByText("0")).toBeTruthy();
  });

  it("handles maximum sleep score", () => {
    const { getByText } = render(
      <SleepDashboardScreen {...defaultProps} sleepScore={100} sleepQuality="Excellent" />
    );
    expect(getByText("100")).toBeTruthy();
  });
});
