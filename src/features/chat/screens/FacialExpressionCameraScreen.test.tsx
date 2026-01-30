/**
 * FacialExpressionCameraScreen Tests
 * @description Tests for camera interface for facial expression capture
 * @task Task 3.7.6: Facial Expression Camera Screen (Screen 58)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { FacialExpressionCameraScreen } from "./FacialExpressionCameraScreen";

describe("FacialExpressionCameraScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnCapture = jest.fn();
  const mockOnGallery = jest.fn();
  const mockOnFlipCamera = jest.fn();
  const mockOnAnalyticsMode = jest.fn();

  const defaultProps = {
    cameraReady: true,
    cameraFacing: "front" as const,
    faceDetected: true,
    heartRate: 68,
    bloodPressureSys: 120,
    bloodPressureDia: 80,
    instructionText: "Stay still for better AI Analysis",
    onBack: mockOnBack,
    onCapture: mockOnCapture,
    onGallery: mockOnGallery,
    onFlipCamera: mockOnFlipCamera,
    onAnalyticsMode: mockOnAnalyticsMode,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByTestId("facial-expression-camera-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays camera preview area", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByTestId("camera-preview")).toBeTruthy();
  });

  it("displays face detection overlay", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByTestId("face-detection-overlay")).toBeTruthy();
  });

  it("displays heart rate indicator", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByTestId("heart-rate-indicator")).toBeTruthy();
  });

  it("displays heart rate value", () => {
    const { getByText } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByText(/68/)).toBeTruthy();
  });

  it("displays heart rate unit", () => {
    const { getByText } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByText(/bpm/)).toBeTruthy();
  });

  it("displays blood pressure indicator", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByTestId("blood-pressure-indicator")).toBeTruthy();
  });

  it("displays blood pressure values", () => {
    const { getByText } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByText(/120/)).toBeTruthy();
  });

  it("displays instruction banner", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByTestId("instruction-banner")).toBeTruthy();
  });

  it("displays instruction text", () => {
    const { getByText } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByText(/Stay still for better AI Analysis/)).toBeTruthy();
  });

  it("displays capture button", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByTestId("capture-button")).toBeTruthy();
  });

  it("calls onCapture when capture button is pressed", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    fireEvent.press(getByTestId("capture-button"));
    expect(mockOnCapture).toHaveBeenCalledTimes(1);
  });

  it("displays gallery button", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByTestId("gallery-button")).toBeTruthy();
  });

  it("calls onGallery when gallery button is pressed", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    fireEvent.press(getByTestId("gallery-button"));
    expect(mockOnGallery).toHaveBeenCalledTimes(1);
  });

  it("displays flip camera button", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByTestId("flip-camera-button")).toBeTruthy();
  });

  it("calls onFlipCamera when flip button is pressed", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    fireEvent.press(getByTestId("flip-camera-button"));
    expect(mockOnFlipCamera).toHaveBeenCalledTimes(1);
  });

  it("displays camera mode button", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByTestId("camera-mode-button")).toBeTruthy();
  });

  it("displays analytics mode button", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(getByTestId("analytics-mode-button")).toBeTruthy();
  });

  it("calls onAnalyticsMode when analytics button is pressed", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    fireEvent.press(getByTestId("analytics-mode-button"));
    expect(mockOnAnalyticsMode).toHaveBeenCalledTimes(1);
  });

  it("shows face detected state when face is detected", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    const overlay = getByTestId("face-detection-overlay");
    const styles = Array.isArray(overlay.props.style)
      ? overlay.props.style.flat()
      : [overlay.props.style];
    const overlayStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(overlayStyles.borderColor).toBe("#9AAD5C");
  });

  it("shows face not detected state when face is not detected", () => {
    const { getByTestId } = render(
      <FacialExpressionCameraScreen {...defaultProps} faceDetected={false} />
    );
    const overlay = getByTestId("face-detection-overlay");
    const styles = Array.isArray(overlay.props.style)
      ? overlay.props.style.flat()
      : [overlay.props.style];
    const overlayStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(overlayStyles.borderColor).toBe("#E8853A");
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    const container = getByTestId("facial-expression-camera-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("capture button has minimum touch target size", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    const button = getByTestId("capture-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("gallery button has minimum touch target size", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    const button = getByTestId("gallery-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("capture button has proper accessibility", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    const button = getByTestId("capture-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Capture photo");
  });

  it("gallery button has proper accessibility", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    const button = getByTestId("gallery-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Open gallery");
  });

  it("flip camera button has proper accessibility", () => {
    const { getByTestId } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    const button = getByTestId("flip-camera-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Flip camera");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<FacialExpressionCameraScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });
});
