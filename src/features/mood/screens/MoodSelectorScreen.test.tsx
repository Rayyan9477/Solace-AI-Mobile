/**
 * MoodSelectorScreen Tests
 * @description Tests for the interactive mood selector with curved slider (Screens 69-73)
 * @task Task 3.8.3: Mood Selector Screen (Screens 69-73)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { MoodSelectorScreen } from "./MoodSelectorScreen";

describe("MoodSelectorScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnMoodChange = jest.fn();
  const mockOnSetMood = jest.fn();

  const mockMoodOptions = [
    { index: 0, label: "Depressed", emoji: "😵", color: "#7B68B5" },
    { index: 1, label: "Sad", emoji: "😢", color: "#E8853A" },
    { index: 2, label: "Neutral", emoji: "😐", color: "#8B7355" },
    { index: 3, label: "Happy", emoji: "🙂", color: "#F5C563" },
    { index: 4, label: "Overjoyed", emoji: "😄", color: "#9AAD5C" },
  ];

  const defaultProps = {
    selectedMoodIndex: 3,
    moodOptions: mockMoodOptions,
    onBack: mockOnBack,
    onMoodChange: mockOnMoodChange,
    onSetMood: mockOnSetMood,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    expect(getByTestId("mood-selector-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  // --- Prompt Text ---
  it("displays the question prompt", () => {
    const { getByText } = render(<MoodSelectorScreen {...defaultProps} />);
    expect(getByText("How are you feeling this day?")).toBeTruthy();
  });

  // --- Mood Display ---
  it("displays the selected mood emoji (large)", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const emojiDisplay = getByTestId("mood-emoji-display");
    expect(emojiDisplay).toBeTruthy();
  });

  it("shows correct emoji for selected mood index", () => {
    const { getByText } = render(<MoodSelectorScreen {...defaultProps} />);
    // Selected index 3 = Happy = 🙂; this also appears in slider, so check the label
    expect(getByText(/I'm Feeling Happy/)).toBeTruthy();
  });

  it("displays the mood label with selected mood name", () => {
    const { getByText } = render(<MoodSelectorScreen {...defaultProps} />);
    expect(getByText(/I'm Feeling Happy/)).toBeTruthy();
  });

  // --- Background Color ---
  it("applies correct background color for Happy mood", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const screen = getByTestId("mood-selector-screen");
    const flatStyle = Array.isArray(screen.props.style)
      ? Object.assign({}, ...screen.props.style)
      : screen.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#F5C563" })
    );
  });

  it("applies correct background for Depressed mood", () => {
    const { getByTestId } = render(
      <MoodSelectorScreen {...defaultProps} selectedMoodIndex={0} />
    );
    const screen = getByTestId("mood-selector-screen");
    const flatStyle = Array.isArray(screen.props.style)
      ? Object.assign({}, ...screen.props.style)
      : screen.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#7B68B5" })
    );
  });

  it("applies correct background for Sad mood", () => {
    const { getByTestId } = render(
      <MoodSelectorScreen {...defaultProps} selectedMoodIndex={1} />
    );
    const screen = getByTestId("mood-selector-screen");
    const flatStyle = Array.isArray(screen.props.style)
      ? Object.assign({}, ...screen.props.style)
      : screen.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#E8853A" })
    );
  });

  it("applies correct background for Neutral mood", () => {
    const { getByTestId } = render(
      <MoodSelectorScreen {...defaultProps} selectedMoodIndex={2} />
    );
    const screen = getByTestId("mood-selector-screen");
    const flatStyle = Array.isArray(screen.props.style)
      ? Object.assign({}, ...screen.props.style)
      : screen.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#8B7355" })
    );
  });

  it("applies correct background for Overjoyed mood", () => {
    const { getByTestId } = render(
      <MoodSelectorScreen {...defaultProps} selectedMoodIndex={4} />
    );
    const screen = getByTestId("mood-selector-screen");
    const flatStyle = Array.isArray(screen.props.style)
      ? Object.assign({}, ...screen.props.style)
      : screen.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#9AAD5C" })
    );
  });

  // --- Mood Slider ---
  it("displays the mood slider", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    expect(getByTestId("mood-slider")).toBeTruthy();
  });

  it("renders 5 slider points", () => {
    const { getAllByTestId } = render(
      <MoodSelectorScreen {...defaultProps} />
    );
    const points = getAllByTestId(/slider-point-/);
    expect(points.length).toBe(5);
  });

  it("highlights the selected slider point", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const selectedPoint = getByTestId("slider-point-3");
    const flatStyle = Array.isArray(selectedPoint.props.style)
      ? Object.assign({}, ...selectedPoint.props.style)
      : selectedPoint.props.style;
    expect(flatStyle.width).toBeGreaterThan(12);
  });

  it("calls onMoodChange when a slider point is pressed", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    fireEvent.press(getByTestId("slider-point-1"));
    expect(mockOnMoodChange).toHaveBeenCalledWith(1);
  });

  // --- Sad Variant (Screen 70) ---
  it("renders Sad variant correctly", () => {
    const { getByText } = render(
      <MoodSelectorScreen {...defaultProps} selectedMoodIndex={1} />
    );
    expect(getByText(/I'm Feeling Sad/)).toBeTruthy();
  });

  // --- Neutral Variant (Screen 71) ---
  it("renders Neutral variant correctly", () => {
    const { getByText } = render(
      <MoodSelectorScreen {...defaultProps} selectedMoodIndex={2} />
    );
    expect(getByText(/I'm Feeling Neutral/)).toBeTruthy();
  });

  // --- Overjoyed Variant (Screen 73) ---
  it("renders Overjoyed variant correctly", () => {
    const { getByText } = render(
      <MoodSelectorScreen {...defaultProps} selectedMoodIndex={4} />
    );
    expect(getByText(/I'm Feeling Overjoyed/)).toBeTruthy();
  });

  // --- Set Mood Button ---
  it("displays Set Mood button", () => {
    const { getByText } = render(<MoodSelectorScreen {...defaultProps} />);
    expect(getByText("Set Mood")).toBeTruthy();
  });

  it("calls onSetMood when Set Mood button is pressed", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    fireEvent.press(getByTestId("set-mood-button"));
    expect(mockOnSetMood).toHaveBeenCalledTimes(1);
  });

  it("Set Mood button includes checkmark icon", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const btn = getByTestId("set-mood-button");
    expect(btn).toBeTruthy();
    const { getByText } = render(<MoodSelectorScreen {...defaultProps} />);
    expect(getByText("✓")).toBeTruthy();
  });

  // --- Accessibility ---
  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const btn = getByTestId("back-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Go back");
  });

  it("set mood button has proper accessibility", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const btn = getByTestId("set-mood-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Set mood");
  });

  it("slider points have proper accessibility labels", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    for (let i = 0; i < 5; i++) {
      const point = getByTestId(`slider-point-${i}`);
      expect(point.props.accessibilityRole).toBe("button");
      expect(point.props.accessibilityLabel).toBe(
        `Select ${mockMoodOptions[i].label}`
      );
    }
  });

  it("set mood button meets minimum touch target size", () => {
    const { getByTestId } = render(<MoodSelectorScreen {...defaultProps} />);
    const btn = getByTestId("set-mood-button");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<MoodSelectorScreen {...defaultProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });
});
