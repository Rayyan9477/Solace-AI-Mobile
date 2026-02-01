/**
 * StressDashboardScreen Tests
 * @description Tests for the stress dashboard with hero section, score display,
 *   settings button, and stats cards
 * @task Task 3.11.1: Stress Dashboard Screen (Screen 97)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { StressDashboardScreen } from "./StressDashboardScreen";

describe("StressDashboardScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSettingsPress = jest.fn();
  const mockOnSeeAllPress = jest.fn();
  const mockOnStressorCardPress = jest.fn();
  const mockOnImpactCardPress = jest.fn();

  const defaultProps = {
    stressScore: 3,
    stressLabel: "Elevated Stress",
    primaryStressor: "Loneliness",
    impactLevel: "Very High",
    onBack: mockOnBack,
    onSettingsPress: mockOnSettingsPress,
    onSeeAllPress: mockOnSeeAllPress,
    onStressorCardPress: mockOnStressorCardPress,
    onImpactCardPress: mockOnImpactCardPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =============================================
  // 1. Rendering
  // =============================================
  it("renders the screen container", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("stress-dashboard-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("stress-dashboard-screen").props.style).toEqual(
      expect.objectContaining({ flex: 1 }),
    );
  });

  // =============================================
  // 2. Hero Section
  // =============================================
  it("renders the hero section", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("hero-section")).toBeTruthy();
  });

  it("hero section has orange background", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("hero-section").props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#E8853A" }),
    );
  });

  // =============================================
  // 3. Header
  // =============================================
  it("renders the back button", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("back button has accessibilityRole button", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44, minWidth: 44 }),
    );
  });

  it("displays 'Stress Level' label", () => {
    const { getByText } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByText("Stress Level")).toBeTruthy();
  });

  // =============================================
  // 4. Stress Score Display
  // =============================================
  it("displays the stress score number", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("stress-score")).toBeTruthy();
  });

  it("displays score value 3", () => {
    const { getByText } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByText("3")).toBeTruthy();
  });

  it("displays the stress label", () => {
    const { getByText } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByText("Elevated Stress")).toBeTruthy();
  });

  it("displays different score when prop changes", () => {
    const { getByText } = render(
      <StressDashboardScreen
        {...defaultProps}
        stressScore={5}
        stressLabel="High Stress"
      />,
    );
    expect(getByText("5")).toBeTruthy();
    expect(getByText("High Stress")).toBeTruthy();
  });

  // =============================================
  // 5. Settings Button
  // =============================================
  it("renders the settings button", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("settings-button")).toBeTruthy();
  });

  it("calls onSettingsPress when settings button is pressed", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("settings-button"));
    expect(mockOnSettingsPress).toHaveBeenCalledTimes(1);
  });

  it("settings button has accessibilityRole button", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("settings-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  // =============================================
  // 6. Stats Section
  // =============================================
  it("displays 'Stress Stats' section header", () => {
    const { getByText } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByText("Stress Stats")).toBeTruthy();
  });

  it("renders the See All button", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("see-all-button")).toBeTruthy();
  });

  it("displays 'See All' text", () => {
    const { getByText } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByText("See All")).toBeTruthy();
  });

  it("calls onSeeAllPress when See All is pressed", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("see-all-button"));
    expect(mockOnSeeAllPress).toHaveBeenCalledTimes(1);
  });

  // =============================================
  // 7. Stressor Card
  // =============================================
  it("renders the stressor card", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("stressor-card")).toBeTruthy();
  });

  it("displays 'Stressor' label", () => {
    const { getByText } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByText("Stressor")).toBeTruthy();
  });

  it("displays primary stressor value", () => {
    const { getByText } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByText("Loneliness")).toBeTruthy();
  });

  it("calls onStressorCardPress when stressor card is pressed", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("stressor-card"));
    expect(mockOnStressorCardPress).toHaveBeenCalledTimes(1);
  });

  it("renders the stressor warning icon", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("stressor-icon")).toBeTruthy();
  });

  it("renders the stressor chart placeholder", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("stressor-chart")).toBeTruthy();
  });

  // =============================================
  // 8. Impact Card
  // =============================================
  it("renders the impact card", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("impact-card")).toBeTruthy();
  });

  it("displays 'Impact' label", () => {
    const { getByText } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByText("Impact")).toBeTruthy();
  });

  it("displays impact level value", () => {
    const { getByText } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByText("Very High")).toBeTruthy();
  });

  it("calls onImpactCardPress when impact card is pressed", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("impact-card"));
    expect(mockOnImpactCardPress).toHaveBeenCalledTimes(1);
  });

  it("renders the impact flag icon", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("impact-icon")).toBeTruthy();
  });

  it("renders the impact chart placeholder", () => {
    const { getByTestId } = render(<StressDashboardScreen {...defaultProps} />);
    expect(getByTestId("impact-chart")).toBeTruthy();
  });

  // =============================================
  // 9. Dynamic Props
  // =============================================
  it("displays different stressor when prop changes", () => {
    const { getByText } = render(
      <StressDashboardScreen {...defaultProps} primaryStressor="Work" />,
    );
    expect(getByText("Work")).toBeTruthy();
  });

  it("displays different impact level when prop changes", () => {
    const { getByText } = render(
      <StressDashboardScreen {...defaultProps} impactLevel="Moderate" />,
    );
    expect(getByText("Moderate")).toBeTruthy();
  });

  // =============================================
  // 10. Branding
  // =============================================
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<StressDashboardScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
