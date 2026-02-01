/**
 * FilterSleepBottomSheet Tests
 * @description Tests for the sleep filter bottom sheet with date pickers,
 *   duration slider, sleep type selector, AI toggle, and apply button
 * @task Task 3.10.8: Filter Sleep Bottom Sheet (Screen 96)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FilterSleepBottomSheet } from "./FilterSleepBottomSheet";

describe("FilterSleepBottomSheet", () => {
  const mockOnFromDatePress = jest.fn();
  const mockOnToDatePress = jest.fn();
  const mockOnTypeToggle = jest.fn();
  const mockOnAISuggestionToggle = jest.fn();
  const mockOnApplyFilter = jest.fn();
  const mockOnHelpPress = jest.fn();

  const defaultProps = {
    fromDate: "2025/01/16",
    toDate: "2025/01/20",
    minDuration: 1,
    maxDuration: 4,
    sleepTypes: [
      { id: "core", icon: "\uD83D\uDC3E", label: "Core" },
      { id: "rem", icon: "\uD83D\uDECF\uFE0F", label: "REM" },
      { id: "light", icon: "\uD83D\uDD12", label: "Light" },
      { id: "deep", icon: "\uD83D\uDC3E", label: "Deep" },
      { id: "irregular", icon: "\uD83C\uDF19", label: "Irregular" },
      { id: "settings", icon: "\u2699\uFE0F", label: "Settings" },
    ],
    selectedTypes: ["core"],
    includeAISuggestion: false,
    resultCount: 25,
    onFromDatePress: mockOnFromDatePress,
    onToDatePress: mockOnToDatePress,
    onTypeToggle: mockOnTypeToggle,
    onAISuggestionToggle: mockOnAISuggestionToggle,
    onApplyFilter: mockOnApplyFilter,
    onHelpPress: mockOnHelpPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =============================================
  // 1. Rendering
  // =============================================
  it("renders the bottom sheet container", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByTestId("filter-sleep-bottom-sheet")).toBeTruthy();
  });

  it("uses dark background color #1C1410", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    const sheet = getByTestId("filter-sleep-bottom-sheet");
    expect(sheet.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#1C1410" })
    );
  });

  // =============================================
  // 2. Drag Handle
  // =============================================
  it("renders the drag handle", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByTestId("drag-handle")).toBeTruthy();
  });

  // =============================================
  // 3. Title & Help
  // =============================================
  it("displays 'Filter Sleep' title", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByText("Filter Sleep")).toBeTruthy();
  });

  it("renders the help button", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByTestId("help-button")).toBeTruthy();
  });

  it("calls onHelpPress when help button is pressed", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    fireEvent.press(getByTestId("help-button"));
    expect(mockOnHelpPress).toHaveBeenCalledTimes(1);
  });

  // =============================================
  // 4. Date Pickers
  // =============================================
  it("displays 'From' label", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByText("From")).toBeTruthy();
  });

  it("displays 'To' label", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByText("To")).toBeTruthy();
  });

  it("renders the from date picker", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByTestId("from-date-picker")).toBeTruthy();
  });

  it("renders the to date picker", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByTestId("to-date-picker")).toBeTruthy();
  });

  it("displays the from date value", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByText("2025/01/16")).toBeTruthy();
  });

  it("displays the to date value", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByText("2025/01/20")).toBeTruthy();
  });

  it("calls onFromDatePress when from date picker is pressed", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    fireEvent.press(getByTestId("from-date-picker"));
    expect(mockOnFromDatePress).toHaveBeenCalledTimes(1);
  });

  it("calls onToDatePress when to date picker is pressed", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    fireEvent.press(getByTestId("to-date-picker"));
    expect(mockOnToDatePress).toHaveBeenCalledTimes(1);
  });

  it("displays different from date when prop changes", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} fromDate="2025/03/01" />
    );
    expect(getByText("2025/03/01")).toBeTruthy();
  });

  // =============================================
  // 5. Sleep Duration Slider
  // =============================================
  it("displays 'Sleep Duration' label", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByText("Sleep Duration")).toBeTruthy();
  });

  it("renders the duration slider", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByTestId("duration-slider")).toBeTruthy();
  });

  it("displays min duration label", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByText("1h")).toBeTruthy();
  });

  it("displays max duration label", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByText("4h")).toBeTruthy();
  });

  // =============================================
  // 6. Sleep Type Selector
  // =============================================
  it("displays 'Sleep Type' label", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByText("Sleep Type")).toBeTruthy();
  });

  it("renders all sleep type buttons", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    defaultProps.sleepTypes.forEach((type) => {
      expect(getByTestId(`sleep-type-${type.id}`)).toBeTruthy();
    });
  });

  it("calls onTypeToggle with correct id when type button is pressed", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    fireEvent.press(getByTestId("sleep-type-rem"));
    expect(mockOnTypeToggle).toHaveBeenCalledWith("rem");
  });

  it("renders selected type with highlighted background", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    const selectedType = getByTestId("sleep-type-core");
    const flatStyle = Array.isArray(selectedType.props.style)
      ? Object.assign({}, ...selectedType.props.style)
      : selectedType.props.style;
    expect(flatStyle.backgroundColor).toBe("#E8853A");
  });

  it("renders unselected type without highlighted background", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    const unselectedType = getByTestId("sleep-type-rem");
    const flatStyle = Array.isArray(unselectedType.props.style)
      ? Object.assign({}, ...unselectedType.props.style)
      : unselectedType.props.style;
    expect(flatStyle.backgroundColor).not.toBe("#E8853A");
  });

  it("sleep type buttons have accessibilityRole button", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(
      getByTestId("sleep-type-core").props.accessibilityRole
    ).toBe("button");
  });

  // =============================================
  // 7. AI Suggestion Toggle
  // =============================================
  it("displays 'Include AI Suggestion' label", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByText("Include AI Suggestion")).toBeTruthy();
  });

  it("renders the AI suggestion toggle", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByTestId("ai-suggestion-toggle")).toBeTruthy();
  });

  it("calls onAISuggestionToggle when toggle is pressed", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    fireEvent.press(getByTestId("ai-suggestion-toggle"));
    expect(mockOnAISuggestionToggle).toHaveBeenCalledTimes(1);
  });

  it("renders toggle track with OFF color when false", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    const track = getByTestId("ai-suggestion-track");
    const flatStyle = Array.isArray(track.props.style)
      ? Object.assign({}, ...track.props.style)
      : track.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#3D2E23" })
    );
  });

  it("renders toggle track with ON color when true", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} includeAISuggestion={true} />
    );
    const track = getByTestId("ai-suggestion-track");
    const flatStyle = Array.isArray(track.props.style)
      ? Object.assign({}, ...track.props.style)
      : track.props.style;
    expect(flatStyle).toEqual(
      expect.objectContaining({ backgroundColor: "#9AAD5C" })
    );
  });

  // =============================================
  // 8. Apply Filter Button
  // =============================================
  it("displays the apply filter button", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByTestId("apply-filter-button")).toBeTruthy();
  });

  it("displays correct button text with result count", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByText(/Filter Sleep \(25\)/)).toBeTruthy();
  });

  it("calls onApplyFilter when button is pressed", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    fireEvent.press(getByTestId("apply-filter-button"));
    expect(mockOnApplyFilter).toHaveBeenCalledTimes(1);
  });

  it("apply button has brown background", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    const button = getByTestId("apply-filter-button");
    expect(button.props.style).toEqual(
      expect.objectContaining({ backgroundColor: "#5C4A2A" })
    );
  });

  it("displays different result count", () => {
    const { getByText } = render(
      <FilterSleepBottomSheet {...defaultProps} resultCount={10} />
    );
    expect(getByText(/Filter Sleep \(10\)/)).toBeTruthy();
  });

  // =============================================
  // 9. Accessibility
  // =============================================
  it("apply button has accessibilityRole button", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(
      getByTestId("apply-filter-button").props.accessibilityRole
    ).toBe("button");
  });

  it("apply button has accessibilityLabel", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(
      getByTestId("apply-filter-button").props.accessibilityLabel
    ).toBe("Apply sleep filter");
  });

  it("apply button meets minimum touch target size", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByTestId("apply-filter-button").props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("from date picker has accessibilityRole button", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(
      getByTestId("from-date-picker").props.accessibilityRole
    ).toBe("button");
  });

  it("to date picker has accessibilityRole button", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(
      getByTestId("to-date-picker").props.accessibilityRole
    ).toBe("button");
  });

  it("help button has accessibilityRole button", () => {
    const { getByTestId } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(getByTestId("help-button").props.accessibilityRole).toBe(
      "button"
    );
  });

  // =============================================
  // 10. Branding
  // =============================================
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not use 'Filter Mood' label (corrected to 'Filter Sleep')", () => {
    const { queryByText } = render(
      <FilterSleepBottomSheet {...defaultProps} />
    );
    expect(queryByText(/Filter Mood/)).toBeNull();
  });
});
