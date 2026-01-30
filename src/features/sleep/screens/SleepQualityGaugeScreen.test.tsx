/**
 * SleepQualityGaugeScreen Tests
 * @description Tests for the sleep quality gauge/fan chart with legend and improvement stats
 * @task Task 3.10.2: Sleep Quality Gauge Screen (Screen 88)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SleepQualityGaugeScreen } from "./SleepQualityGaugeScreen";

describe("SleepQualityGaugeScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnHome = jest.fn();
  const mockOnSettings = jest.fn();
  const mockOnSegmentPress = jest.fn();
  const mockOnChartCenter = jest.fn();

  const defaultProps = {
    improvementPercent: 87,
    distribution: {
      normal: 35,
      core: 15,
      rem: 25,
      irregular: 15,
      insomniac: 10,
    },
    onBack: mockOnBack,
    onHome: mockOnHome,
    onSettings: mockOnSettings,
    onSegmentPress: mockOnSegmentPress,
    onChartCenter: mockOnChartCenter,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("sleep-quality-gauge-screen")).toBeTruthy();
  });

  it("uses dark background color", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    const screen = getByTestId("sleep-quality-gauge-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Header ---
  it("displays the back button", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  // --- Title & Stats ---
  it("displays 'Sleep Quality' title", () => {
    const { getByText } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByText("Sleep Quality")).toBeTruthy();
  });

  it("displays improvement percentage text", () => {
    const { getByText } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByText(/87% better from last month/)).toBeTruthy();
  });

  it("displays different improvement percentage", () => {
    const { getByText } = render(
      <SleepQualityGaugeScreen {...defaultProps} improvementPercent={42} />
    );
    expect(getByText(/42% better from last month/)).toBeTruthy();
  });

  // --- Legend ---
  it("displays Normal legend item", () => {
    const { getByText } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByText("Normal")).toBeTruthy();
  });

  it("displays Core legend item", () => {
    const { getByText } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByText("Core")).toBeTruthy();
  });

  it("displays REM legend item", () => {
    const { getByText } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByText("REM")).toBeTruthy();
  });

  it("displays Irregular legend item", () => {
    const { getByText } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByText("Irregular")).toBeTruthy();
  });

  it("displays Insomniac legend item", () => {
    const { getByText } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByText("Insomniac")).toBeTruthy();
  });

  it("renders all five legend dots", () => {
    const { getAllByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    const dots = getAllByTestId(/legend-dot-/);
    expect(dots.length).toBe(5);
  });

  // --- Gauge Chart ---
  it("renders the gauge chart container", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("gauge-chart")).toBeTruthy();
  });

  it("renders gauge chart segments", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("gauge-segments")).toBeTruthy();
  });

  it("renders chart center button", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("chart-center-button")).toBeTruthy();
  });

  it("calls onChartCenter when center button is pressed", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    fireEvent.press(getByTestId("chart-center-button"));
    expect(mockOnChartCenter).toHaveBeenCalledTimes(1);
  });

  // --- Bottom Navigation ---
  it("renders home button", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("home-button")).toBeTruthy();
  });

  it("calls onHome when home button is pressed", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    fireEvent.press(getByTestId("home-button"));
    expect(mockOnHome).toHaveBeenCalledTimes(1);
  });

  it("renders settings button", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("settings-button")).toBeTruthy();
  });

  it("calls onSettings when settings button is pressed", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    fireEvent.press(getByTestId("settings-button"));
    expect(mockOnSettings).toHaveBeenCalledTimes(1);
  });

  // --- Accessibility ---
  it("back button has accessibilityRole button", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets minimum touch target", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  it("home button has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("home-button").props.accessibilityLabel).toBe("Go to home");
  });

  it("settings button has accessibilityLabel", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("settings-button").props.accessibilityLabel).toBe(
      "Sleep settings"
    );
  });

  it("home button meets minimum touch target", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("home-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  it("settings button meets minimum touch target", () => {
    const { getByTestId } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(getByTestId("settings-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 })
    );
  });

  // --- Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<SleepQualityGaugeScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
