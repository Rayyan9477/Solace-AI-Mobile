/**
 * DurationPickerScreen Tests
 * @description Tests for TDD implementation of Screen 107
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { DurationPickerScreen } from "./DurationPickerScreen";

const defaultProps = {
  duration: "25:00",
  soundName: "Chirping Birds",
  stepLabel: "2 of 3",
  onBack: jest.fn(),
  onDurationPress: jest.fn(),
  onSoundPress: jest.fn(),
  onContinue: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(
    <DurationPickerScreen {...defaultProps} {...overrides} />,
  );
}

describe("DurationPickerScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("duration-picker-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("duration-picker-screen");
    expect(container.props.style).toEqual(
      expect.objectContaining({ flex: 1 }),
    );
  });

  it("has dark background color", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("duration-picker-screen");
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
    expect(getByTestId("back-button").props.accessibilityLabel).toBe(
      "Go back",
    );
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("back-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("displays 'New Exercise' header title", () => {
    const { getByText } = renderScreen();
    expect(getByText("New Exercise")).toBeTruthy();
  });

  // Step Indicator
  it("displays the step indicator", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("step-indicator")).toBeTruthy();
  });

  it("step indicator shows correct step label", () => {
    const { getByText } = renderScreen();
    expect(getByText("2 of 3")).toBeTruthy();
  });

  // Question Title
  it("displays the question title", () => {
    const { getByText } = renderScreen();
    expect(getByText("How much time do you have for exercise?")).toBeTruthy();
  });

  it("question title is white and large", () => {
    const { getByTestId } = renderScreen();
    const title = getByTestId("question-title");
    const flatStyle = Object.assign({}, ...[].concat(title.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
    expect(flatStyle.fontSize).toBeGreaterThanOrEqual(24);
  });

  // Duration Display
  it("renders the duration display", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("duration-display")).toBeTruthy();
  });

  it("displays the duration value", () => {
    const { getByTestId } = renderScreen();
    const display = getByTestId("duration-value");
    expect(display.props.children).toBe("25:00");
  });

  it("duration display has green background", () => {
    const { getByTestId } = renderScreen();
    const display = getByTestId("duration-display");
    const flatStyle = Object.assign({}, ...[].concat(display.props.style));
    expect(flatStyle.backgroundColor).toBe("#9AAD5C");
  });

  it("duration value is large and white", () => {
    const { getByTestId } = renderScreen();
    const value = getByTestId("duration-value");
    const flatStyle = Object.assign({}, ...[].concat(value.props.style));
    expect(flatStyle.color).toBe("#FFFFFF");
    expect(flatStyle.fontSize).toBeGreaterThanOrEqual(48);
  });

  it("calls onDurationPress when duration display is pressed", () => {
    const onDurationPress = jest.fn();
    const { getByTestId } = renderScreen({ onDurationPress });
    fireEvent.press(getByTestId("duration-display"));
    expect(onDurationPress).toHaveBeenCalledTimes(1);
  });

  it("duration display has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("duration-display").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("duration display has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("duration-display").props.accessibilityLabel).toBe(
      "Select duration: 25:00 minutes",
    );
  });

  it("displays 'Minutes' label below duration", () => {
    const { getByText } = renderScreen();
    expect(getByText("Minutes")).toBeTruthy();
  });

  // Sound Preview Button
  it("renders the sound preview button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("sound-preview-button")).toBeTruthy();
  });

  it("displays the sound name", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Chirping Birds/)).toBeTruthy();
  });

  it("calls onSoundPress when sound preview is pressed", () => {
    const onSoundPress = jest.fn();
    const { getByTestId } = renderScreen({ onSoundPress });
    fireEvent.press(getByTestId("sound-preview-button"));
    expect(onSoundPress).toHaveBeenCalledTimes(1);
  });

  it("sound preview has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("sound-preview-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("sound preview meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("sound-preview-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
  });

  // Continue Button
  it("renders the continue button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("continue button displays correct text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Continue/)).toBeTruthy();
  });

  it("calls onContinue when continue button is pressed", () => {
    const onContinue = jest.fn();
    const { getByTestId } = renderScreen({ onContinue });
    fireEvent.press(getByTestId("continue-button"));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("continue button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("continue-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("continue button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("continue-button").props.accessibilityLabel).toBe(
      "Continue to next step",
    );
  });

  it("continue button has tan background", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("continue-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.backgroundColor).toBe("#C4A574");
  });

  it("continue button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("continue-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
  });

  // Dynamic Props
  it("displays different duration", () => {
    const { getByTestId } = renderScreen({ duration: "10:00" });
    expect(getByTestId("duration-value").props.children).toBe("10:00");
  });

  it("displays different sound name", () => {
    const { getByText } = renderScreen({ soundName: "Zen Garden" });
    expect(getByText(/Zen Garden/)).toBeTruthy();
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
