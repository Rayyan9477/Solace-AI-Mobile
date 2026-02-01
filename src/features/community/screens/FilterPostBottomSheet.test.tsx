/**
 * FilterPostBottomSheet Tests
 * @task Task 3.14.7: Filter Post Bottom Sheet (Screen 125)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { FilterPostBottomSheet } from "./FilterPostBottomSheet";

const defaultPostTypes = [
  { id: "story", label: "Story", icon: "\uD83D\uDCC4" },
  { id: "video", label: "Video", icon: "\u25B6" },
  { id: "audio", label: "Audio", icon: "\uD83D\uDD0A" },
];

const defaultProps = {
  postTypes: defaultPostTypes,
  selectedPostTypeId: "video",
  selectedDate: "25 January, 2025",
  minDuration: 3,
  maxDuration: 5,
  resultCount: 21,
  onPostTypeSelect: jest.fn(),
  onDatePress: jest.fn(),
  onDurationChange: jest.fn(),
  onApply: jest.fn(),
  onClose: jest.fn(),
};

describe("FilterPostBottomSheet", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the bottom sheet container", () => {
    const { getByTestId } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(getByTestId("filter-post-bottom-sheet")).toBeTruthy();
  });

  it("displays 'Filter Post' title", () => {
    const { getByText } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(getByText("Filter Post")).toBeTruthy();
  });

  it("displays 'Post Type' section label", () => {
    const { getByText } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(getByText("Post Type")).toBeTruthy();
  });

  it("renders all post type pills", () => {
    const { getByTestId } = render(<FilterPostBottomSheet {...defaultProps} />);
    defaultPostTypes.forEach((t) => {
      expect(getByTestId(`type-pill-${t.id}`)).toBeTruthy();
    });
  });

  it("calls onPostTypeSelect when pill is pressed", () => {
    const { getByTestId } = render(<FilterPostBottomSheet {...defaultProps} />);
    fireEvent.press(getByTestId("type-pill-story"));
    expect(defaultProps.onPostTypeSelect).toHaveBeenCalledWith("story");
  });

  it("displays 'Post Date' section label", () => {
    const { getByText } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(getByText("Post Date")).toBeTruthy();
  });

  it("renders the date picker field", () => {
    const { getByTestId } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(getByTestId("date-picker-field")).toBeTruthy();
  });

  it("displays the selected date", () => {
    const { getByText } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(getByText("25 January, 2025")).toBeTruthy();
  });

  it("calls onDatePress when date field is pressed", () => {
    const { getByTestId } = render(<FilterPostBottomSheet {...defaultProps} />);
    fireEvent.press(getByTestId("date-picker-field"));
    expect(defaultProps.onDatePress).toHaveBeenCalledTimes(1);
  });

  it("displays 'Video Duration' section label", () => {
    const { getByText } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(getByText("Video Duration")).toBeTruthy();
  });

  it("renders the range slider", () => {
    const { getByTestId } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(getByTestId("duration-slider")).toBeTruthy();
  });

  it("displays duration range labels", () => {
    const { getByText } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(getByText("3m")).toBeTruthy();
    expect(getByText("5m")).toBeTruthy();
  });

  it("renders the apply button", () => {
    const { getByTestId } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(getByTestId("apply-filter-button")).toBeTruthy();
  });

  it("displays result count in apply button", () => {
    const { getByText } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(getByText(/Filter Posts \(21\)/)).toBeTruthy();
  });

  it("calls onApply when apply button is pressed", () => {
    const { getByTestId } = render(<FilterPostBottomSheet {...defaultProps} />);
    fireEvent.press(getByTestId("apply-filter-button"));
    expect(defaultProps.onApply).toHaveBeenCalledTimes(1);
  });

  it("apply button has accessibilityRole button", () => {
    const { getByTestId } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(getByTestId("apply-filter-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("apply button meets minimum touch target size", () => {
    const { getByTestId } = render(<FilterPostBottomSheet {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("apply-filter-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<FilterPostBottomSheet {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
