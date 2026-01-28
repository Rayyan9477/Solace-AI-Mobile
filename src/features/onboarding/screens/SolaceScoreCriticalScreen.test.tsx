/**
 * SolaceScoreCriticalScreen Tests
 * @description Tests for critical Solace score result screen with crisis resources
 * @task Task 3.3.11: Solace Score Critical Screen (Screen 25)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SolaceScoreCriticalScreen } from "./SolaceScoreCriticalScreen";

describe("SolaceScoreCriticalScreen", () => {
  const mockOnCallHotline = jest.fn();
  const mockOnContinue = jest.fn();

  const defaultProps = {
    score: 16,
    onCallHotline: mockOnCallHotline,
    onContinue: mockOnContinue,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    expect(getByTestId("solace-score-critical-screen")).toBeTruthy();
  });

  it("displays the page title", () => {
    const { getByText } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    expect(getByText("Your Solace Score")).toBeTruthy();
  });

  it("displays the circular score container", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    expect(getByTestId("score-circle")).toBeTruthy();
  });

  it("displays the score number", () => {
    const { getByText } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    expect(getByText("16")).toBeTruthy();
  });

  it("displays custom score value", () => {
    const { getByText } = render(
      <SolaceScoreCriticalScreen {...defaultProps} score={22} />
    );
    expect(getByText("22")).toBeTruthy();
  });

  it("displays the primary crisis message", () => {
    const { getByText } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    expect(getByText("You need immediate support")).toBeTruthy();
  });

  it("displays the secondary crisis message", () => {
    const { getByText } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    expect(getByText("Please call hotline or loved ones")).toBeTruthy();
  });

  it("displays the Call Hotline button", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    expect(getByTestId("call-hotline-button")).toBeTruthy();
  });

  it("displays the Call Hotline button text", () => {
    const { getByText } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    expect(getByText("Call Hotline")).toBeTruthy();
  });

  it("calls onCallHotline when hotline button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("call-hotline-button"));
    expect(mockOnCallHotline).toHaveBeenCalledTimes(1);
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("displays the Continue button text", () => {
    const { getByText } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    expect(getByText("Continue")).toBeTruthy();
  });

  it("calls onContinue when Continue button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("has purple background", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    const container = getByTestId("solace-score-critical-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasPurpleBackground = styles.some(
      (s) => s?.backgroundColor === "#7B68B5"
    );
    expect(hasPurpleBackground).toBe(true);
  });

  it("score circle has white/light background", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    const circle = getByTestId("score-circle");
    const styles = Array.isArray(circle.props.style)
      ? circle.props.style.flat()
      : [circle.props.style];
    const circleStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(circleStyles.backgroundColor).toMatch(/rgba\(255,\s*255,\s*255|#[fF]{3,6}/);
  });

  it("Call Hotline button has proper accessibility", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    const button = getByTestId("call-hotline-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has proper accessibility", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("Call Hotline button has minimum touch target size", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    const button = getByTestId("call-hotline-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("score text is large and bold", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    const scoreText = getByTestId("score-text");
    const styles = Array.isArray(scoreText.props.style)
      ? scoreText.props.style.flat()
      : [scoreText.props.style];
    const textStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(textStyles.fontSize).toBeGreaterThanOrEqual(48);
    expect(textStyles.fontWeight).toBe("700");
  });

  it("screen has proper accessibility label for crisis", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    const screen = getByTestId("solace-score-critical-screen");
    expect(screen.props.accessibilityLabel).toContain("support");
  });

  it("Call Hotline button is primary/urgent style", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    const button = getByTestId("call-hotline-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.backgroundColor).toBe("#FFFFFF");
  });

  it("displays phone icon in Call Hotline button", () => {
    const { getByTestId } = render(
      <SolaceScoreCriticalScreen {...defaultProps} />
    );
    expect(getByTestId("phone-icon")).toBeTruthy();
  });
});
