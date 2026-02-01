/**
 * MindfulHoursStatsScreen Tests
 * @description Tests for TDD implementation of Screen 105
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { MindfulHoursStatsScreen } from "./MindfulHoursStatsScreen";

const defaultCategories = [
  { category: "Breathing", hours: "2.5h", percentage: "20%", color: "#9AAD5C" },
  { category: "Mindfulness", hours: "1.7h", percentage: "17%", color: "#E8853A" },
  { category: "Relax", hours: "8h", percentage: "40%", color: "#C4A535" },
  { category: "Sleep", hours: "8h", percentage: "80%", color: "#E8853A" },
];

const defaultProps = {
  totalHours: "8.21h",
  categories: defaultCategories,
  onBack: jest.fn(),
  onSettingsPress: jest.fn(),
  onDownloadPress: jest.fn(),
  onAddPress: jest.fn(),
  onCategoryPress: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<MindfulHoursStatsScreen {...defaultProps} {...overrides} />);
}

describe("MindfulHoursStatsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("mindful-hours-stats-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("mindful-hours-stats-screen");
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });

  it("has dark background color", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("mindful-hours-stats-screen");
    expect(container.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" }),
    );
  });

  // Header
  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("back button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("back-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("displays screen title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Mindful Hours Stats")).toBeTruthy();
  });

  // Donut Chart
  it("renders the donut chart", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("donut-chart")).toBeTruthy();
  });

  it("displays total hours in chart center", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("chart-total-hours").props.children).toBe("8.21h");
  });

  it("displays 'Total' label in chart center", () => {
    const { getByText } = renderScreen();
    expect(getByText("Total")).toBeTruthy();
  });

  it("renders chart segments for each category", () => {
    const { getByTestId } = renderScreen();
    defaultCategories.forEach((c) => {
      expect(getByTestId(`chart-segment-${c.category}`)).toBeTruthy();
    });
  });

  // Action Buttons
  it("renders the settings button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("settings-button")).toBeTruthy();
  });

  it("calls onSettingsPress when settings is pressed", () => {
    const onSettingsPress = jest.fn();
    const { getByTestId } = renderScreen({ onSettingsPress });
    fireEvent.press(getByTestId("settings-button"));
    expect(onSettingsPress).toHaveBeenCalledTimes(1);
  });

  it("settings button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("settings-button").props.accessibilityRole).toBe("button");
  });

  it("renders the download button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("download-button")).toBeTruthy();
  });

  it("calls onDownloadPress when download is pressed", () => {
    const onDownloadPress = jest.fn();
    const { getByTestId } = renderScreen({ onDownloadPress });
    fireEvent.press(getByTestId("download-button"));
    expect(onDownloadPress).toHaveBeenCalledTimes(1);
  });

  // Category Rows
  it("renders a row for each category", () => {
    const { getByTestId } = renderScreen();
    defaultCategories.forEach((c) => {
      expect(getByTestId(`category-row-${c.category}`)).toBeTruthy();
    });
  });

  it("displays category names", () => {
    const { getByText } = renderScreen();
    expect(getByText("Breathing")).toBeTruthy();
    expect(getByText("Mindfulness")).toBeTruthy();
    expect(getByText("Relax")).toBeTruthy();
    expect(getByText("Sleep")).toBeTruthy();
  });

  it("displays category hours", () => {
    const { getByText } = renderScreen();
    expect(getByText("2.5h")).toBeTruthy();
    expect(getByText("1.7h")).toBeTruthy();
  });

  it("displays category percentages", () => {
    const { getByText } = renderScreen();
    expect(getByText("20%")).toBeTruthy();
    expect(getByText("17%")).toBeTruthy();
    expect(getByText("40%")).toBeTruthy();
    expect(getByText("80%")).toBeTruthy();
  });

  it("renders colored dots for each category", () => {
    const { getByTestId } = renderScreen();
    const dot = getByTestId("category-dot-Breathing");
    const flatStyle = Object.assign({}, ...[].concat(dot.props.style));
    expect(flatStyle.backgroundColor).toBe("#9AAD5C");
  });

  it("calls onCategoryPress when a row is pressed", () => {
    const onCategoryPress = jest.fn();
    const { getByTestId } = renderScreen({ onCategoryPress });
    fireEvent.press(getByTestId("category-row-Breathing"));
    expect(onCategoryPress).toHaveBeenCalledWith("Breathing");
  });

  // FAB
  it("renders the add button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("add-button")).toBeTruthy();
  });

  it("calls onAddPress when add button is pressed", () => {
    const onAddPress = jest.fn();
    const { getByTestId } = renderScreen({ onAddPress });
    fireEvent.press(getByTestId("add-button"));
    expect(onAddPress).toHaveBeenCalledTimes(1);
  });

  it("add button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("add-button").props.accessibilityRole).toBe("button");
  });

  it("add button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("add-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
