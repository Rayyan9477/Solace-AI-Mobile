/**
 * FilterMoodBottomSheet Tests
 * @description Tests for the mood filtering bottom sheet modal
 * @task Task 3.8.5: Filter Mood Bottom Sheet (Screen 75)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FilterMoodBottomSheet } from "./FilterMoodBottomSheet";

describe("FilterMoodBottomSheet", () => {
  const mockOnClose = jest.fn();
  const mockOnMoodTypeToggle = jest.fn();
  const mockOnDateChange = jest.fn();
  const mockOnSwingChange = jest.fn();
  const mockOnImprovementToggle = jest.fn();
  const mockOnApplyFilter = jest.fn();
  const mockOnHelp = jest.fn();

  const mockMoodTypes = [
    { id: "depressed", label: "Depressed", selected: false },
    { id: "sad", label: "Sad", selected: true },
    { id: "neutral", label: "Neutral", selected: false },
    { id: "happy", label: "Happy", selected: true },
    { id: "overjoyed", label: "Overjoyed", selected: false },
  ];

  const defaultProps = {
    visible: true,
    moodTypes: mockMoodTypes,
    selectedDate: "January 23, 2025",
    moodSwingValue: 5,
    showImprovement: true,
    resultCount: 25,
    onClose: mockOnClose,
    onMoodTypeToggle: mockOnMoodTypeToggle,
    onDateChange: mockOnDateChange,
    onSwingChange: mockOnSwingChange,
    onImprovementToggle: mockOnImprovementToggle,
    onApplyFilter: mockOnApplyFilter,
    onHelp: mockOnHelp,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the bottom sheet when visible", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByTestId("filter-mood-bottom-sheet")).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { queryByTestId } = render(
      <FilterMoodBottomSheet {...defaultProps} visible={false} />
    );
    expect(queryByTestId("filter-mood-bottom-sheet")).toBeNull();
  });

  // --- Header ---
  it("displays the sheet title", () => {
    const { getByText } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByText("Filter Mood")).toBeTruthy();
  });

  it("displays the drag handle", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByTestId("drag-handle")).toBeTruthy();
  });

  it("displays help button", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByTestId("help-button")).toBeTruthy();
  });

  it("calls onHelp when help button is pressed", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    fireEvent.press(getByTestId("help-button"));
    expect(mockOnHelp).toHaveBeenCalledTimes(1);
  });

  // --- Mood Type Chips ---
  it("displays mood type chips section", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByTestId("mood-type-chips")).toBeTruthy();
  });

  it("renders all 5 mood type chips", () => {
    const { getByText } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByText("Depressed")).toBeTruthy();
    expect(getByText("Sad")).toBeTruthy();
    expect(getByText("Neutral")).toBeTruthy();
    expect(getByText("Happy")).toBeTruthy();
    expect(getByText("Overjoyed")).toBeTruthy();
  });

  it("highlights selected mood chips", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    const sadChip = getByTestId("mood-chip-sad");
    const flatStyle = Array.isArray(sadChip.props.style)
      ? Object.assign({}, ...sadChip.props.style)
      : sadChip.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#E8853A" })
    );
  });

  it("calls onMoodTypeToggle when chip is pressed", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    fireEvent.press(getByTestId("mood-chip-neutral"));
    expect(mockOnMoodTypeToggle).toHaveBeenCalledWith("neutral");
  });

  // --- Date Picker ---
  it("displays date picker section", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByTestId("date-picker-row")).toBeTruthy();
  });

  it("displays selected date", () => {
    const { getByText } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByText("January 23, 2025")).toBeTruthy();
  });

  it("calls onDateChange when date row is pressed", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    fireEvent.press(getByTestId("date-picker-row"));
    expect(mockOnDateChange).toHaveBeenCalledTimes(1);
  });

  // --- Mood Swing Slider ---
  it("displays mood swing section", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByTestId("mood-swing-section")).toBeTruthy();
  });

  it("displays mood swing label", () => {
    const { getByText } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByText("Mood Swing")).toBeTruthy();
  });

  it("displays scale labels", () => {
    const { getByText } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByText("1")).toBeTruthy();
    expect(getByText("10")).toBeTruthy();
  });

  it("displays current swing value", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    const valueDisplay = getByTestId("swing-value");
    expect(valueDisplay).toBeTruthy();
  });

  // --- Show Improvement Toggle ---
  it("displays show improvement toggle", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByTestId("improvement-toggle")).toBeTruthy();
  });

  it("displays improvement toggle label", () => {
    const { getByText } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByText("Show Improvement")).toBeTruthy();
  });

  it("calls onImprovementToggle when toggle is pressed", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    fireEvent.press(getByTestId("improvement-toggle"));
    expect(mockOnImprovementToggle).toHaveBeenCalledTimes(1);
  });

  // --- Apply Filter Button ---
  it("displays filter button with result count", () => {
    const { getByText } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByText("Filter Mood (25)")).toBeTruthy();
  });

  it("calls onApplyFilter when filter button is pressed", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    fireEvent.press(getByTestId("apply-filter-button"));
    expect(mockOnApplyFilter).toHaveBeenCalledTimes(1);
  });

  // --- Backdrop ---
  it("displays backdrop overlay", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(getByTestId("backdrop")).toBeTruthy();
  });

  it("calls onClose when backdrop is pressed", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    fireEvent.press(getByTestId("backdrop"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // --- Accessibility ---
  it("apply filter button has proper accessibility", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    const btn = getByTestId("apply-filter-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Apply mood filter");
  });

  it("apply filter button meets minimum touch target", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    const btn = getByTestId("apply-filter-button");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("mood chips have proper accessibility", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    const chip = getByTestId("mood-chip-happy");
    expect(chip.props.accessibilityRole).toBe("button");
  });

  // --- Dark Mode ---
  it("uses dark theme for the sheet", () => {
    const { getByTestId } = render(<FilterMoodBottomSheet {...defaultProps} />);
    const sheet = getByTestId("sheet-content");
    expect(sheet.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<FilterMoodBottomSheet {...defaultProps} />);
    expect(queryByText(/Freud/)).toBeNull();
  });
});
