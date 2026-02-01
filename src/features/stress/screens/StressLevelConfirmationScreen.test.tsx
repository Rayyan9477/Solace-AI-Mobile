/**
 * StressLevelConfirmationScreen Tests
 * @description Tests for TDD implementation of Screen 102
 * Note: Removes "Doctor Freud AI" branding per project requirements
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { StressLevelConfirmationScreen } from "./StressLevelConfirmationScreen";

const defaultProps = {
  stressLevel: 3,
  onBack: jest.fn(),
  onGotIt: jest.fn(),
  onClose: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(
    <StressLevelConfirmationScreen {...defaultProps} {...overrides} />,
  );
}

describe("StressLevelConfirmationScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("stress-level-confirmation-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("stress-level-confirmation-screen");
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });

  it("has dark background color", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("stress-level-confirmation-screen");
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

  it("displays 'Stress Level' header label", () => {
    const { getByText } = renderScreen();
    expect(getByText("Stress Level")).toBeTruthy();
  });

  // Illustration
  it("renders the illustration placeholder", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("illustration-placeholder")).toBeTruthy();
  });

  // Success Title
  it("displays the success title with stress level", () => {
    const { getByText } = renderScreen({ stressLevel: 3 });
    expect(getByText("Stress Level Set to 3")).toBeTruthy();
  });

  it("title updates when stress level changes", () => {
    const { getByText } = renderScreen({ stressLevel: 5 });
    expect(getByText("Stress Level Set to 5")).toBeTruthy();
  });

  it("title is white", () => {
    const { getByTestId } = renderScreen();
    const title = getByTestId("success-title");
    const flatStyle = Object.assign({}, ...[].concat(title.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
  });

  // Success Message
  it("displays the success message", () => {
    const { getByText } = renderScreen();
    expect(
      getByText(/Stress condition updated to your mental health journal/),
    ).toBeTruthy();
  });

  it("message mentions data sent to AI", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Data sent to AI/)).toBeTruthy();
  });

  // Got It Button
  it("renders the got it button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("got-it-button")).toBeTruthy();
  });

  it("got it button displays correct text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Got It, Thanks!/)).toBeTruthy();
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
      "Got it, thanks",
    );
  });

  it("got it button has brown/tan background", () => {
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
    expect(getByTestId("close-button").props.accessibilityLabel).toBe("Close");
  });

  it("close button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("close-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  // Wave Decoration
  it("renders the bottom wave decoration", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("wave-decoration")).toBeTruthy();
  });

  // Branding - CRITICAL: No Freud branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not mention 'Doctor Freud' anywhere", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });
});
