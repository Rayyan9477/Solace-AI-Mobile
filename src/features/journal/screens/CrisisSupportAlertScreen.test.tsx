/**
 * CrisisSupportAlertScreen Tests
 * @screen Screen 86: Crisis Support Alert
 * @audit batch-18-journal-final-sleep-start.md
 * @fixes CRITICAL #86-1: Replace "Suicidal Mental Pattern" with safe, empathetic language
 * @fixes #86-2: "multiple account" → "multiple instances"
 *
 * Visual ref: Mental_Health_Journal_Screen_09.png
 * - Full-screen modal with illustration
 * - Empathetic crisis alert title (SAFE language)
 * - Description with crisis support status
 * - "Crisis Support Now Active" primary action
 * - "Call For Help!" secondary action
 * - Dismiss and close buttons
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CrisisSupportAlertScreen } from "./CrisisSupportAlertScreen";

describe("CrisisSupportAlertScreen", () => {
  const mockOnCrisisSupport = jest.fn();
  const mockOnCallForHelp = jest.fn();
  const mockOnDismiss = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    visible: true,
    onCrisisSupport: mockOnCrisisSupport,
    onCallForHelp: mockOnCallForHelp,
    onDismiss: mockOnDismiss,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering ---
  it("renders the modal when visible", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByTestId("crisis-support-alert-screen")).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { queryByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} visible={false} />
    );
    expect(queryByTestId("crisis-support-alert-screen")).toBeNull();
  });

  // --- Modal Overlay ---
  it("displays backdrop overlay", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByTestId("modal-backdrop")).toBeTruthy();
  });

  // --- Illustration ---
  it("displays the crisis illustration area", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByTestId("crisis-illustration")).toBeTruthy();
  });

  // --- SAFE Title (CRITICAL Audit Fix) ---
  it("displays safe, empathetic crisis title", () => {
    const { getByText } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByText(/Crisis Pattern Detected/)).toBeTruthy();
  });

  it("does NOT use 'Suicidal' in the title (audit fix #86-1)", () => {
    const { queryByText } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(queryByText(/Suicidal/i)).toBeNull();
  });

  it("does NOT use 'suicide' anywhere in visible text (audit fix #86-1)", () => {
    const { queryByText } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(queryByText(/suicide/i)).toBeNull();
  });

  // --- Description ---
  it("displays supportive description text", () => {
    const { getByText } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(
      getByText(/patterns in your journal that suggest you may be going through a difficult time/)
    ).toBeTruthy();
  });

  it("uses corrected grammar: 'multiple instances' not 'multiple account' (audit fix #86-2)", () => {
    const { queryByText } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(queryByText(/multiple account\b/)).toBeNull();
  });

  it("mentions crisis support is active", () => {
    const { getByText } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByText(/[Cc]risis support is now active/)).toBeTruthy();
  });

  // --- Crisis Support Button ---
  it("displays crisis support button", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByTestId("crisis-support-button")).toBeTruthy();
  });

  it("displays crisis support button text", () => {
    const { getByText } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByText(/Crisis Support Now Active/)).toBeTruthy();
  });

  it("calls onCrisisSupport when button is pressed", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("crisis-support-button"));
    expect(mockOnCrisisSupport).toHaveBeenCalledTimes(1);
  });

  // --- Call For Help Button ---
  it("displays call for help button", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByTestId("call-for-help-button")).toBeTruthy();
  });

  it("displays call for help button text", () => {
    const { getByText } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByText(/Call For Help!/)).toBeTruthy();
  });

  it("calls onCallForHelp when button is pressed", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("call-for-help-button"));
    expect(mockOnCallForHelp).toHaveBeenCalledTimes(1);
  });

  // --- Dismiss Button ---
  it("displays dismiss button", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByTestId("dismiss-button")).toBeTruthy();
  });

  it("calls onDismiss when dismiss is pressed", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("dismiss-button"));
    expect(mockOnDismiss).toHaveBeenCalledTimes(1);
  });

  // --- Close Button ---
  it("displays close button", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByTestId("close-button")).toBeTruthy();
  });

  it("calls onClose when close is pressed", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("close-button"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  // --- Warning Icon ---
  it("displays warning icon on crisis support button", () => {
    const { getByText } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByText("⚠️")).toBeTruthy();
  });

  // --- Phone Icon ---
  it("displays phone icon on call button", () => {
    const { getByText } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(getByText("📞")).toBeTruthy();
  });

  // --- Accessibility ---
  it("crisis support button has proper accessibility", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    const btn = getByTestId("crisis-support-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Access crisis support");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("call for help button has proper accessibility", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    const btn = getByTestId("call-for-help-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Call for help");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("close button has proper accessibility", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    const btn = getByTestId("close-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Close alert");
    expect(btn.props.style).toEqual(
      expect.objectContaining({ minHeight: 44 })
    );
  });

  it("dismiss button has proper accessibility", () => {
    const { getByTestId } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    const btn = getByTestId("dismiss-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Dismiss alert");
  });

  // --- Branding ---
  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <CrisisSupportAlertScreen {...defaultProps} />
    );
    expect(queryByText(/Freud/)).toBeNull();
  });
});
