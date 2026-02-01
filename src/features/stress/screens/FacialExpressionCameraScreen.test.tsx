/**
 * FacialExpressionCameraScreen Tests
 * @description Tests for TDD implementation of Screen 101
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { FacialExpressionCameraScreen } from "./FacialExpressionCameraScreen";

const defaultProps = {
  heartRate: 68,
  bloodPressureSys: 134,
  instructionText: "Stay still for better AI Analysis",
  onSettingsPress: jest.fn(),
  onCapture: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(
    <FacialExpressionCameraScreen {...defaultProps} {...overrides} />,
  );
}

describe("FacialExpressionCameraScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Rendering
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("facial-expression-camera-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = renderScreen();
    const container = getByTestId("facial-expression-camera-screen");
    expect(container.props.style).toEqual(expect.objectContaining({ flex: 1 }));
  });

  // Camera Placeholder
  it("renders the camera preview placeholder", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("camera-preview")).toBeTruthy();
  });

  // Biometric Badges
  it("renders the heart rate badge", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("heart-rate-badge")).toBeTruthy();
  });

  it("displays the heart rate value", () => {
    const { getByText } = renderScreen();
    expect(getByText(/68/)).toBeTruthy();
  });

  it("displays 'bpm' unit", () => {
    const { getByText } = renderScreen();
    expect(getByText(/bpm/)).toBeTruthy();
  });

  it("renders heart icon in badge", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("heart-icon")).toBeTruthy();
  });

  it("heart rate badge has green background", () => {
    const { getByTestId } = renderScreen();
    const badge = getByTestId("heart-rate-badge");
    const flatStyle = Object.assign({}, ...[].concat(badge.props.style));
    expect(flatStyle.backgroundColor).toBe("#4A9E8C");
  });

  it("renders the blood pressure badge", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("blood-pressure-badge")).toBeTruthy();
  });

  it("displays the blood pressure value", () => {
    const { getByText } = renderScreen();
    expect(getByText(/134/)).toBeTruthy();
  });

  it("displays 'sys' unit", () => {
    const { getByText } = renderScreen();
    expect(getByText(/sys/)).toBeTruthy();
  });

  it("renders droplet icon in BP badge", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("droplet-icon")).toBeTruthy();
  });

  it("blood pressure badge has blue background", () => {
    const { getByTestId } = renderScreen();
    const badge = getByTestId("blood-pressure-badge");
    const flatStyle = Object.assign({}, ...[].concat(badge.props.style));
    expect(flatStyle.backgroundColor).toBe("#5B7BB5");
  });

  it("updates heart rate when prop changes", () => {
    const { getByText } = renderScreen({ heartRate: 75 });
    expect(getByText(/75/)).toBeTruthy();
  });

  it("updates blood pressure when prop changes", () => {
    const { getByText } = renderScreen({ bloodPressureSys: 120 });
    expect(getByText(/120/)).toBeTruthy();
  });

  // Face Detection Overlay
  it("renders the face detection frame", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("face-frame")).toBeTruthy();
  });

  it("renders the grid overlay", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("grid-overlay")).toBeTruthy();
  });

  // Instruction Banner
  it("renders the instruction banner", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("instruction-banner")).toBeTruthy();
  });

  it("displays the instruction text", () => {
    const { getByText } = renderScreen();
    expect(getByText("Stay still for better AI Analysis")).toBeTruthy();
  });

  it("renders the lightning icon in banner", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("banner-icon")).toBeTruthy();
  });

  it("instruction banner has gold/yellow background", () => {
    const { getByTestId } = renderScreen();
    const banner = getByTestId("instruction-banner");
    const flatStyle = Object.assign({}, ...[].concat(banner.props.style));
    expect(flatStyle.backgroundColor).toBe("#C4A535");
  });

  // Camera Controls
  it("renders the camera controls bar", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("camera-controls")).toBeTruthy();
  });

  it("renders the settings button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("settings-button")).toBeTruthy();
  });

  it("calls onSettingsPress when settings button is pressed", () => {
    const onSettingsPress = jest.fn();
    const { getByTestId } = renderScreen({ onSettingsPress });
    fireEvent.press(getByTestId("settings-button"));
    expect(onSettingsPress).toHaveBeenCalledTimes(1);
  });

  it("settings button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("settings-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("settings button has accessibilityLabel", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("settings-button").props.accessibilityLabel).toBe(
      "Camera settings",
    );
  });

  it("settings button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("settings-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("renders the capture button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("capture-button")).toBeTruthy();
  });

  it("calls onCapture when capture button is pressed", () => {
    const onCapture = jest.fn();
    const { getByTestId } = renderScreen({ onCapture });
    fireEvent.press(getByTestId("capture-button"));
    expect(onCapture).toHaveBeenCalledTimes(1);
  });

  it("capture button has accessibilityRole button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("capture-button").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("capture button meets minimum touch target size", () => {
    const { getByTestId } = renderScreen();
    const btn = getByTestId("capture-button");
    const flatStyle = Object.assign({}, ...[].concat(btn.props.style));
    expect(flatStyle.minHeight).toBeGreaterThanOrEqual(44);
    expect(flatStyle.minWidth).toBeGreaterThanOrEqual(44);
  });

  // Branding
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
