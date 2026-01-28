/**
 * SolaceScoreHealthyScreen Tests
 * @description Tests for healthy Solace score result screen
 * @task Task 3.3.9: Solace Score Healthy Screen (Screen 23)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SolaceScoreHealthyScreen } from "./SolaceScoreHealthyScreen";

describe("SolaceScoreHealthyScreen", () => {
  const mockOnScheduleAppointment = jest.fn();
  const mockOnContinue = jest.fn();

  const defaultProps = {
    score: 87,
    onScheduleAppointment: mockOnScheduleAppointment,
    onContinue: mockOnContinue,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    expect(getByTestId("solace-score-healthy-screen")).toBeTruthy();
  });

  it("displays the page title", () => {
    const { getByText } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    expect(getByText("Your Solace Score")).toBeTruthy();
  });

  it("displays the circular score container", () => {
    const { getByTestId } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    expect(getByTestId("score-circle")).toBeTruthy();
  });

  it("displays the score number", () => {
    const { getByText } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    expect(getByText("87")).toBeTruthy();
  });

  it("displays custom score value", () => {
    const { getByText } = render(
      <SolaceScoreHealthyScreen {...defaultProps} score={92} />
    );
    expect(getByText("92")).toBeTruthy();
  });

  it("displays the primary message", () => {
    const { getByText } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    expect(getByText("You're mentally healthy")).toBeTruthy();
  });

  it("displays the secondary message", () => {
    const { getByText } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    expect(getByText("Are you ready?")).toBeTruthy();
  });

  it("displays the Schedule appointment button", () => {
    const { getByTestId } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    expect(getByTestId("schedule-button")).toBeTruthy();
  });

  it("displays the Schedule appointment button text", () => {
    const { getByText } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    expect(getByText("Schedule appointment")).toBeTruthy();
  });

  it("calls onScheduleAppointment when schedule button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("schedule-button"));
    expect(mockOnScheduleAppointment).toHaveBeenCalledTimes(1);
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("displays the Continue button text", () => {
    const { getByText } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    expect(getByText("Continue")).toBeTruthy();
  });

  it("calls onContinue when Continue button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledTimes(1);
  });

  it("has green/teal gradient background", () => {
    const { getByTestId } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    const container = getByTestId("solace-score-healthy-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasGreenBackground = styles.some(
      (s) => s?.backgroundColor === "#4A9E8C"
    );
    expect(hasGreenBackground).toBe(true);
  });

  it("score circle has white/light background", () => {
    const { getByTestId } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
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
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    const button = getByTestId("schedule-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has proper accessibility", () => {
    const { getByTestId } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    expect(button.props.accessibilityRole).toBe("button");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(
      <SolaceScoreHealthyScreen {...defaultProps} />
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
      <SolaceScoreHealthyScreen {...defaultProps} />
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
      <SolaceScoreHealthyScreen {...defaultProps} />
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
      <SolaceScoreHealthyScreen {...defaultProps} />
    );
    const screen = getByTestId("solace-score-healthy-screen");
    expect(screen.props.accessibilityLabel).toContain("healthy");
  });
});
