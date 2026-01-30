/**
 * MoodDashboardScreen Tests
 * @description Tests for the main mood tracking dashboard with weekly chart
 * @task Task 3.8.1: Mood Dashboard Screen (Screen 67)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MoodDashboardScreen } from "./MoodDashboardScreen";

describe("MoodDashboardScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnFilter = jest.fn();
  const mockOnStatistics = jest.fn();
  const mockOnSelectMood = jest.fn();
  const mockOnDayPress = jest.fn();
  const mockOnAddMood = jest.fn();

  const mockCurrentMood = {
    emoji: "🙂",
    label: "Happy",
    color: "#F5C563",
  };

  const mockWeeklyData = [
    { day: "Mon", emoji: "😐", value: 50, color: "#8B7355" },
    { day: "Tue", emoji: "🙂", value: 70, color: "#F5C563" },
    { day: "Wed", emoji: "😄", value: 90, color: "#9AAD5C" },
    { day: "Thu", emoji: "😢", value: 30, color: "#E8853A" },
    { day: "Fri", emoji: "🙂", value: 70, color: "#F5C563" },
    { day: "Sat", emoji: "😄", value: 90, color: "#9AAD5C" },
    { day: "Sun", emoji: "😐", value: 50, color: "#8B7355" },
  ];

  const defaultProps = {
    currentMood: mockCurrentMood,
    weeklyData: mockWeeklyData,
    onBack: mockOnBack,
    onFilter: mockOnFilter,
    onStatistics: mockOnStatistics,
    onSelectMood: mockOnSelectMood,
    onDayPress: mockOnDayPress,
    onAddMood: mockOnAddMood,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(getByTestId("mood-dashboard-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  // --- Hero Section ---
  it("displays the mood hero section", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(getByTestId("mood-hero-section")).toBeTruthy();
  });

  it("displays current mood emoji", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    const hero = getByTestId("mood-hero-section");
    expect(hero).toBeTruthy();
    // Large emoji is rendered in the mood display within the hero
    const { getByText } = render(<MoodDashboardScreen {...defaultProps} currentMood={{ emoji: "😵", label: "Depressed", color: "#7B68B5" }} weeklyData={[]} />);
    expect(getByText("😵")).toBeTruthy();
  });

  it("displays current mood label", () => {
    const { getByText } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(getByText("Happy")).toBeTruthy();
  });

  it("applies mood color to hero section background", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    const hero = getByTestId("mood-hero-section");
    const flatStyle = Array.isArray(hero.props.style)
      ? Object.assign({}, ...hero.props.style)
      : hero.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#F5C563" })
    );
  });

  it("displays decorative circles in hero section", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(getByTestId("decorative-circles")).toBeTruthy();
  });

  // --- Filter & Statistics ---
  it("displays filter button", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(getByTestId("filter-button")).toBeTruthy();
  });

  it("calls onFilter when filter button is pressed", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("filter-button"));
    expect(mockOnFilter).toHaveBeenCalledTimes(1);
  });

  it("displays statistics button", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(getByTestId("statistics-button")).toBeTruthy();
  });

  it("calls onStatistics when statistics button is pressed", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("statistics-button"));
    expect(mockOnStatistics).toHaveBeenCalledTimes(1);
  });

  // --- Weekly Mood Chart ---
  it("displays weekly mood section header", () => {
    const { getByText } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(getByText("Weekly Mood")).toBeTruthy();
  });

  it("displays weekly mood chart", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(getByTestId("weekly-mood-chart")).toBeTruthy();
  });

  it("renders all 7 day bars in the chart", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    for (const day of mockWeeklyData) {
      expect(getByTestId(`mood-bar-${day.day}`)).toBeTruthy();
    }
  });

  it("displays day labels under each bar", () => {
    const { getByText } = render(<MoodDashboardScreen {...defaultProps} />);
    for (const day of mockWeeklyData) {
      expect(getByText(day.day)).toBeTruthy();
    }
  });

  it("displays emoji indicators on bars", () => {
    const { getAllByTestId } = render(
      <MoodDashboardScreen {...defaultProps} />
    );
    const emojiIndicators = getAllByTestId(/mood-bar-emoji/);
    expect(emojiIndicators.length).toBe(7);
  });

  it("calls onDayPress when a day bar is tapped", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("mood-bar-Mon"));
    expect(mockOnDayPress).toHaveBeenCalledWith(mockWeeklyData[0]);
  });

  // --- Add Mood Button ---
  it("displays add mood FAB", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(getByTestId("add-mood-button")).toBeTruthy();
  });

  it("calls onAddMood when FAB is pressed", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    fireEvent.press(getByTestId("add-mood-button"));
    expect(mockOnAddMood).toHaveBeenCalledTimes(1);
  });

  // --- Accessibility ---
  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    const backButton = getByTestId("back-button");
    expect(backButton.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("back button has proper accessibility role", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has proper accessibility label", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityLabel).toBe(
      "Go back"
    );
  });

  it("add mood button has proper accessibility", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    const fab = getByTestId("add-mood-button");
    expect(fab.props.accessibilityRole).toBe("button");
    expect(fab.props.accessibilityLabel).toBe("Add mood entry");
  });

  it("filter button has proper accessibility", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    const btn = getByTestId("filter-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Filter moods");
  });

  it("statistics button has proper accessibility", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    const btn = getByTestId("statistics-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("View mood statistics");
  });

  // --- Dark Mode ---
  it("uses dark background for lower section", () => {
    const { getByTestId } = render(<MoodDashboardScreen {...defaultProps} />);
    const screen = getByTestId("mood-dashboard-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<MoodDashboardScreen {...defaultProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });
});
