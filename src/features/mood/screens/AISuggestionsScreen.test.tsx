/**
 * AISuggestionsScreen Tests
 * @description Tests for AI mood improvement suggestions with expandable step cards
 * @task Task 3.8.6: AI Suggestions Screen (Screen 76)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AISuggestionsScreen } from "./AISuggestionsScreen";

describe("AISuggestionsScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnTabChange = jest.fn();
  const mockOnStepToggle = jest.fn();
  const mockOnActivitySelect = jest.fn();
  const mockOnMarkResolved = jest.fn();

  const mockSteps = [
    {
      id: "1",
      stepNumber: 1,
      title: "Acknowledge Feeling",
      description:
        "Take a moment to recognize and accept how you are feeling right now. This is the first step toward positive change.",
      expanded: true,
      activities: [],
    },
    {
      id: "2",
      stepNumber: 2,
      title: "Do Positive Activity",
      description:
        "Engage in a physical or creative activity to shift your mood. Even a short walk can make a difference.",
      expanded: false,
      activities: [
        { id: "walking", label: "Walking", selected: false },
        { id: "jogging", label: "Jogging", selected: true },
        { id: "reading", label: "Reading", selected: false },
        { id: "meditation", label: "Meditation", selected: false },
      ],
    },
    {
      id: "3",
      stepNumber: 3,
      title: "Seek Support",
      description:
        "Reach out to a trusted friend, family member, or counselor. You do not have to face difficult feelings alone.",
      expanded: false,
      activities: [],
    },
  ];

  const defaultProps = {
    activeTab: "suggestions" as const,
    steps: mockSteps,
    onBack: mockOnBack,
    onTabChange: mockOnTabChange,
    onStepToggle: mockOnStepToggle,
    onActivitySelect: mockOnActivitySelect,
    onMarkResolved: mockOnMarkResolved,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    expect(getByTestId("ai-suggestions-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays screen title", () => {
    const { getByText } = render(<AISuggestionsScreen {...defaultProps} />);
    expect(getByText("Mood History")).toBeTruthy();
  });

  // --- Segmented Control ---
  it("displays segmented control", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    expect(getByTestId("segmented-control")).toBeTruthy();
  });

  it("displays History tab", () => {
    const { getByText } = render(<AISuggestionsScreen {...defaultProps} />);
    expect(getByText("History")).toBeTruthy();
  });

  it("displays AI Suggestions tab", () => {
    const { getByText } = render(<AISuggestionsScreen {...defaultProps} />);
    expect(getByText("AI Suggestions")).toBeTruthy();
  });

  it("highlights the AI Suggestions tab", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    const tab = getByTestId("tab-suggestions");
    const flatStyle = Array.isArray(tab.props.style)
      ? Object.assign({}, ...tab.props.style)
      : tab.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#E8853A" })
    );
  });

  it("calls onTabChange when History tab is pressed", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("tab-history"));
    expect(mockOnTabChange).toHaveBeenCalledWith("history");
  });

  // --- Step Cards ---
  it("renders all 3 suggestion step cards", () => {
    const { getAllByTestId } = render(
      <AISuggestionsScreen {...defaultProps} />
    );
    const cards = getAllByTestId(/step-card-/);
    expect(cards.length).toBe(3);
  });

  it("displays step badges with numbers", () => {
    const { getByText } = render(<AISuggestionsScreen {...defaultProps} />);
    expect(getByText("Step 1")).toBeTruthy();
    expect(getByText("Step 2")).toBeTruthy();
    expect(getByText("Step 3")).toBeTruthy();
  });

  it("displays step titles", () => {
    const { getByText } = render(<AISuggestionsScreen {...defaultProps} />);
    expect(getByText("Acknowledge Feeling")).toBeTruthy();
    expect(getByText("Do Positive Activity")).toBeTruthy();
    expect(getByText("Seek Support")).toBeTruthy();
  });

  it("shows description for expanded step", () => {
    const { getByText } = render(<AISuggestionsScreen {...defaultProps} />);
    expect(
      getByText(/Take a moment to recognize and accept/)
    ).toBeTruthy();
  });

  it("calls onStepToggle when step card header is pressed", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("step-header-2"));
    expect(mockOnStepToggle).toHaveBeenCalledWith("2");
  });

  // --- Activity Chips ---
  it("displays activity chips for step with activities", () => {
    const expandedSteps = mockSteps.map((s) =>
      s.id === "2" ? { ...s, expanded: true } : s
    );
    const { getByText } = render(
      <AISuggestionsScreen {...defaultProps} steps={expandedSteps} />
    );
    expect(getByText("Walking")).toBeTruthy();
    expect(getByText("Jogging")).toBeTruthy();
    expect(getByText("Reading")).toBeTruthy();
    expect(getByText("Meditation")).toBeTruthy();
  });

  it("highlights selected activity chip", () => {
    const expandedSteps = mockSteps.map((s) =>
      s.id === "2" ? { ...s, expanded: true } : s
    );
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} steps={expandedSteps} />
    );
    const joggingChip = getByTestId("activity-chip-jogging");
    const flatStyle = Array.isArray(joggingChip.props.style)
      ? Object.assign({}, ...joggingChip.props.style)
      : joggingChip.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#9AAD5C" })
    );
  });

  it("calls onActivitySelect when activity chip is pressed", () => {
    const expandedSteps = mockSteps.map((s) =>
      s.id === "2" ? { ...s, expanded: true } : s
    );
    const { getByTestId } = render(
      <AISuggestionsScreen {...defaultProps} steps={expandedSteps} />
    );
    fireEvent.press(getByTestId("activity-chip-walking"));
    expect(mockOnActivitySelect).toHaveBeenCalledWith("2", "walking");
  });

  // --- Mark as Resolved ---
  it("displays Mark As Resolved button", () => {
    const { getByText } = render(<AISuggestionsScreen {...defaultProps} />);
    expect(getByText("Mark As Resolved")).toBeTruthy();
  });

  it("calls onMarkResolved when button is pressed", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("mark-resolved-button"));
    expect(mockOnMarkResolved).toHaveBeenCalledTimes(1);
  });

  // --- Accessibility ---
  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
  });

  it("mark resolved button has proper accessibility", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    const btn = getByTestId("mark-resolved-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Mark suggestion as resolved");
  });

  it("mark resolved button meets minimum touch target", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    const btn = getByTestId("mark-resolved-button");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  // --- Dark Mode ---
  it("uses dark background color", () => {
    const { getByTestId } = render(<AISuggestionsScreen {...defaultProps} />);
    const screen = getByTestId("ai-suggestions-screen");
    expect(screen.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<AISuggestionsScreen {...defaultProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });
});
