/**
 * ExerciseCompletedModal Tests
 * @description Tests for TDD implementation of Screen 111
 * @audit-fix Replaced "Freud Score" with "Solace Score" per branding guidelines
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { ExerciseCompletedModal } from "./ExerciseCompletedModal";

const defaultProps = {
  scoreEarned: "+8",
  stressReduction: "-1",
  message: "Your mental health is improving, congratulations!!",
  onGotIt: jest.fn(),
  onClose: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<ExerciseCompletedModal {...defaultProps} {...overrides} />);
}

describe("ExerciseCompletedModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the modal container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("exercise-completed-modal")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("exercise-completed-modal");
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });

  // Modal Card
  it("renders the modal card", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("modal-card")).toBeTruthy();
  });

  // Illustration
  it("renders the illustration area", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("illustration")).toBeTruthy();
  });

  // Title
  it("displays 'Exercise Completed!' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Exercise Completed!")).toBeTruthy();
  });

  it("title is dark and bold", () => {
    const { getByTestId } = renderScreen();
    const title = getByTestId("completion-title");
    const flatStyle = Object.assign({}, ...[].concat(title.props.style));
    expect(flatStyle.fontWeight).toBe("800");
  });

  // Reward Badges
  it("renders the Solace Score badge", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("score-badge")).toBeTruthy();
  });

  it("displays score earned value", () => {
    const { getByText } = renderScreen();
    expect(getByText(/\+8 Solace Score/)).toBeTruthy();
  });

  it("renders the stress level badge", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("stress-badge")).toBeTruthy();
  });

  it("displays stress reduction value", () => {
    const { getByText } = renderScreen();
    expect(getByText(/-1 Stress Level/)).toBeTruthy();
  });

  // Congratulations Message
  it("displays the congratulations message", () => {
    const { getByText } = renderScreen();
    expect(
      getByText(/Your mental health is improving, congratulations!!/),
    ).toBeTruthy();
  });

  // Got It Button
  it("renders the got it button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("got-it-button")).toBeTruthy();
  });

  it("got it button displays correct text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Got it, thanks!/)).toBeTruthy();
  });

  it("calls onGotIt when got it button is pressed", () => {
    const onGotIt = jest.fn();
    const { getByTestId } = renderScreen({ onGotIt });
    fireEvent.press(getByTestId("got-it-button"));
    expect(onGotIt).toHaveBeenCalledTimes(1);
  });

  it("got it button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("got-it-button").props.accessibilityRole).toBe("button");
  });

  it("got it button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("got-it-button").props.accessibilityLabel).toBe(
      "Dismiss and continue",
    );
  });

  it("got it button has tan background", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("got-it-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.backgroundColor).toBe("#C4A574");
  });

  it("got it button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("got-it-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
  });

  // Close Button
  it("renders the close button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("close-button")).toBeTruthy();
  });

  it("calls onClose when close button is pressed", () => {
    const onClose = jest.fn();
    const { getByTestId } = renderScreen({ onClose });
    fireEvent.press(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("close button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("close-button").props.accessibilityRole).toBe("button");
  });

  it("close button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("close-button").props.accessibilityLabel).toBe(
      "Close modal",
    );
  });

  it("close button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("close-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  // Dynamic Props
  it("displays different score value", () => {
    const { getByText } = renderScreen({ scoreEarned: "+12" });
    expect(getByText(/\+12 Solace Score/)).toBeTruthy();
  });

  it("displays different stress reduction", () => {
    const { getByText } = renderScreen({ stressReduction: "-3" });
    expect(getByText(/-3 Stress Level/)).toBeTruthy();
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("uses Solace branding instead of Freud", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Solace Score/)).toBeTruthy();
  });
});
