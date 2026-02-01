/**
 * CourseCompletedScreen Tests
 * @task Task 3.13.7: Course Completed Screen (Screen 118)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { CourseCompletedScreen } from "./CourseCompletedScreen";

const defaultRatingOptions = [
  {
    id: "1",
    emoji: "\uD83D\uDE16",
    color: "#7B68B5",
    label: "Very Dissatisfied",
  },
  { id: "2", emoji: "\uD83D\uDE1E", color: "#E8853A", label: "Dissatisfied" },
  { id: "3", emoji: "\uD83D\uDE10", color: "#C4A574", label: "Neutral" },
  { id: "4", emoji: "\uD83D\uDE42", color: "#F4D03F", label: "Satisfied" },
  { id: "5", emoji: "\uD83D\uDE0A", color: "#9AAD5C", label: "Very Satisfied" },
];

const defaultProps = {
  prompt: "How do you feel about this course?",
  ratingOptions: defaultRatingOptions,
  selectedRatingId: "4",
  onBack: jest.fn(),
  onRatingSelect: jest.fn(),
  onRateSession: jest.fn(),
};

describe("CourseCompletedScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  // --- Container ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(getByTestId("course-completed-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    const container = getByTestId("course-completed-screen");
    const flat = Object.assign({}, ...[].concat(container.props.style));
    expect(flat.flex).toBe(1);
  });

  // --- Header ---
  it("renders the back button", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  it("back button has accessibilityRole button", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button has accessibilityLabel", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityLabel).toBeTruthy();
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  // --- Illustration ---
  it("renders the illustration area", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(getByTestId("completion-illustration")).toBeTruthy();
  });

  // --- Title & Prompt ---
  it("displays 'Course Done!' title", () => {
    const { getByText } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(getByText("Course Done!")).toBeTruthy();
  });

  it("displays the prompt text", () => {
    const { getByText } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(getByText("How do you feel about this course?")).toBeTruthy();
  });

  // --- Rating Emojis ---
  it("renders all rating options", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    defaultRatingOptions.forEach((opt) => {
      expect(getByTestId(`rating-option-${opt.id}`)).toBeTruthy();
    });
  });

  it("displays emoji for each rating option", () => {
    const { getByText } = render(<CourseCompletedScreen {...defaultProps} />);
    defaultRatingOptions.forEach((opt) => {
      expect(getByText(opt.emoji)).toBeTruthy();
    });
  });

  it("calls onRatingSelect when an emoji is pressed", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    fireEvent.press(getByTestId("rating-option-2"));
    expect(defaultProps.onRatingSelect).toHaveBeenCalledWith("2");
  });

  it("rating options have accessibilityRole button", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(getByTestId("rating-option-1").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("rating options have accessibilityLabel", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(
      getByTestId("rating-option-1").props.accessibilityLabel,
    ).toBeTruthy();
  });

  it("rating options meet minimum touch target size", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("rating-option-1").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  // --- Selection Indicator ---
  it("renders the selection indicator for the selected rating", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(getByTestId("selection-indicator")).toBeTruthy();
  });

  // --- Rate Session Button ---
  it("renders the Rate Session button", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(getByTestId("rate-session-button")).toBeTruthy();
  });

  it("displays 'Rate Session +' text", () => {
    const { getByText } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(getByText("Rate Session +")).toBeTruthy();
  });

  it("calls onRateSession when button is pressed", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    fireEvent.press(getByTestId("rate-session-button"));
    expect(defaultProps.onRateSession).toHaveBeenCalledTimes(1);
  });

  it("Rate Session button has accessibilityRole button", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(getByTestId("rate-session-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("Rate Session button meets minimum touch target size", () => {
    const { getByTestId } = render(<CourseCompletedScreen {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("rate-session-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
  });

  // --- Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<CourseCompletedScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });
});
