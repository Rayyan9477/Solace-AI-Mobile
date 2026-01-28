/**
 * AISuggestionsScreen Tests
 * @description Tests for AI-generated mental health suggestions
 * @task Task 3.5.5: AI Suggestions Screen (Screen 44)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AISuggestionsScreen } from "./AISuggestionsScreen";

describe("AISuggestionsScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnToggleDarkMode = jest.fn();
  const mockOnSortChange = jest.fn();
  const mockOnSuggestionPress = jest.fn();

  const defaultProps = {
    totalCount: 52,
    sortBy: "newest" as const,
    suggestions: [
      {
        id: "1",
        category: "mindfulness" as const,
        title: "Mindfulness Activities",
        subtitle: "Breathing, Relax",
        duration: "25-30min",
        activityCount: 8,
        icons: [
          { icon: "meditation", color: "#9AAD5C" },
          { icon: "yoga", color: "#9AAD5C" },
        ],
      },
      {
        id: "2",
        category: "physical" as const,
        title: "Physical Activities",
        subtitle: "Jogging, Running, Swimming",
        duration: "16-50min",
        activityCount: 8,
        icons: [
          { icon: "running", color: "#E8853A" },
          { icon: "cycling", color: "#E8853A" },
        ],
      },
      {
        id: "3",
        category: "social" as const,
        title: "Social Connection",
        subtitle: "Connecting with friends",
        duration: "1-2hr",
        activityCount: 8,
        icons: [
          { icon: "social", color: "#7B68B5" },
          { icon: "people", color: "#F4D03F" },
        ],
      },
      {
        id: "4",
        category: "professional" as const,
        title: "Professional Support",
        subtitle: "Psychiatrist, Hotline",
        duration: "25-30min",
        activityCount: 8,
        icons: [
          { icon: "therapy", color: "#F4D03F" },
          { icon: "phone", color: "#F4D03F" },
        ],
      },
    ],
    onBack: mockOnBack,
    onToggleDarkMode: mockOnToggleDarkMode,
    onSortChange: mockOnSortChange,
    onSuggestionPress: mockOnSuggestionPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByTestId("ai-suggestions-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the dark mode toggle button", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByTestId("dark-mode-toggle")).toBeTruthy();
  });

  it("calls onToggleDarkMode when toggle is pressed", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("dark-mode-toggle"));
    expect(mockOnToggleDarkMode).toHaveBeenCalledTimes(1);
  });

  it("displays the screen title", () => {
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByText("AI Score Suggestions")).toBeTruthy();
  });

  it("displays the total count stat", () => {
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByText("52 Total")).toBeTruthy();
  });

  it("displays Solace AI badge (not GPT-6 or Freud)", () => {
    const { getByText, queryByText } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByText("Solace AI")).toBeTruthy();
    expect(queryByText(/gpt/i)).toBeNull();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("displays the filter bar", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByTestId("filter-bar")).toBeTruthy();
  });

  it("displays All Suggestions label", () => {
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByText("All Suggestions")).toBeTruthy();
  });

  it("displays the sort dropdown", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByTestId("sort-dropdown")).toBeTruthy();
  });

  it("displays current sort value", () => {
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByText("Newest")).toBeTruthy();
  });

  it("calls onSortChange when sort dropdown is pressed", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("sort-dropdown"));
    expect(mockOnSortChange).toHaveBeenCalled();
  });

  it("displays all suggestion cards", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByTestId("suggestion-card-1")).toBeTruthy();
    expect(getByTestId("suggestion-card-2")).toBeTruthy();
    expect(getByTestId("suggestion-card-3")).toBeTruthy();
    expect(getByTestId("suggestion-card-4")).toBeTruthy();
  });

  it("displays mindfulness category card title", () => {
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByText("Mindfulness Activities")).toBeTruthy();
  });

  it("displays physical category card title", () => {
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByText("Physical Activities")).toBeTruthy();
  });

  it("displays social category card title", () => {
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByText("Social Connection")).toBeTruthy();
  });

  it("displays professional category card title", () => {
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByText("Professional Support")).toBeTruthy();
  });

  it("displays card subtitle", () => {
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByText(/Breathing, Relax/)).toBeTruthy();
  });

  it("displays card duration", () => {
    const { getAllByText } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    // Multiple cards may have same duration, so use getAllByText
    expect(getAllByText(/25-30min/).length).toBeGreaterThan(0);
  });

  it("displays activity count badge", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByTestId("activity-count-badge-1")).toBeTruthy();
  });

  it("displays icon row in cards", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByTestId("icon-row-1")).toBeTruthy();
  });

  it("displays chevron arrow on cards", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    expect(getByTestId("chevron-1")).toBeTruthy();
  });

  it("calls onSuggestionPress when card is pressed", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("suggestion-card-1"));
    expect(mockOnSuggestionPress).toHaveBeenCalledWith("1");
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    const container = getByTestId("ai-suggestions-screen");
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
      <AISuggestionsScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("suggestion cards have proper accessibility", () => {
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    const card = getByTestId("suggestion-card-1");
    expect(card.props.accessibilityRole).toBe("button");
  });

  it("renders with oldest sort", () => {
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} sortBy="oldest" />
    );
    expect(getByText("Oldest")).toBeTruthy();
  });

  it("renders with duration sort", () => {
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} sortBy="duration" />
    );
    expect(getByText("Duration")).toBeTruthy();
  });

  it("renders with category sort", () => {
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} sortBy="category" />
    );
    expect(getByText("Category")).toBeTruthy();
  });
});
