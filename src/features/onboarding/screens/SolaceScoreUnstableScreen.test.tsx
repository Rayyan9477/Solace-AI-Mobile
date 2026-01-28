/**
 * SolaceScoreUnstableScreen Tests
 * @description Tests for unstable Solace score result screen
 * @task Task 3.3.10: Solace Score Unstable Screen (Screen 24)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SolaceScoreUnstableScreen } from "./SolaceScoreUnstableScreen";

describe("SolaceScoreUnstableScreen", () => {
  const mockOnScheduleAppointment = jest.fn();
  const mockOnContinue = jest.fn();

  const defaultProps = {
    score: 41,
    onScheduleAppointment: mockOnScheduleAppointment,
    onContinue: mockOnContinue,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    expect(getByTestId("solace-score-unstable-screen")).toBeTruthy();
  });

  it("displays the page title", () => {
    const { getByText } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    expect(getByText("Your Solace Score")).toBeTruthy();
  });

  it("displays the circular score container", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    expect(getByTestId("score-circle")).toBeTruthy();
  });

  it("displays the score number", () => {
    const { getByText } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    expect(getByText("41")).toBeTruthy();
  });

  it("displays custom score value", () => {
    const { getByText } = render(
      <SolaceScoreUnstableScreen {...defaultProps} score={55} />
    );
    expect(getByText("55")).toBeTruthy();
  });

  it("displays the primary message", () => {
    const { getByText } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    expect(getByText("You're mentally unstable")).toBeTruthy();
  });

  it("displays the secondary message", () => {
    const { getByText } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    expect(getByText("Consult psychologist")).toBeTruthy();
  });

  it("displays the Schedule appointment button", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    expect(getByTestId("schedule-button")).toBeTruthy();
  });

  it("displays the Schedule appointment button text", () => {
    const { getByText } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    expect(getByText("Schedule appointment")).toBeTruthy();
  });

  it("calls onScheduleAppointment when schedule button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("schedule-button"));
    expect(mockOnScheduleAppointment).toHaveBeenCalledTimes(1);
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("displays the Continue button text", () => {
    const { getByText } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    expect(getByText("Continue")).toBeTruthy();
  });

  it("calls onContinue when Continue button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("has orange/amber background", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    const container = getByTestId("solace-score-unstable-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasOrangeBackground = styles.some(
      (s) => s?.backgroundColor === "#E8853A"
    );
    expect(hasOrangeBackground).toBe(true);
  });

  it("score circle has white/light background", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    const circle = getByTestId("score-circle");
    const styles = Array.isArray(circle.props.style)
      ? circle.props.style.flat()
      : [circle.props.style];
    const circleStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(circleStyles.backgroundColor).toMatch(/rgba\(255,\s*255,\s*255|#[fF]{3,6}/);
  });

  it("Schedule button has proper accessibility", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    const button = getByTestId("schedule-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has proper accessibility", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("Schedule button has minimum touch target size", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    const button = getByTestId("schedule-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("score text is large and bold", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    const scoreText = getByTestId("score-text");
    const styles = Array.isArray(scoreText.props.style)
      ? scoreText.props.style.flat()
      : [scoreText.props.style];
    const textStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(textStyles.fontSize).toBeGreaterThanOrEqual(48);
    expect(textStyles.fontWeight).toBe("700");
  });

  it("screen has proper accessibility label", () => {
    const { getByTestId } = render(
      <SolaceScoreUnstableScreen {...defaultProps} />
    );
    const screen = getByTestId("solace-score-unstable-screen");
    expect(screen.props.accessibilityLabel).toContain("unstable");
  });
});
