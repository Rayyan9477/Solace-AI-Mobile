/**
 * AssessmentOtherSymptomsScreen Tests
 * @description Tests for symptoms input assessment screen with tag input
 * @task Task 3.4.7: Assessment Other Symptoms Screen (Screen 36)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AssessmentOtherSymptomsScreen } from "./AssessmentOtherSymptomsScreen";

describe("AssessmentOtherSymptomsScreen", () => {
  const mockOnContinue = jest.fn();
  const mockOnBack = jest.fn();

  const defaultProps = {
    currentStep: 11,
    totalSteps: 14,
    onContinue: mockOnContinue,
    onBack: mockOnBack,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByTestId("assessment-other-symptoms-screen")).toBeTruthy();
  });

  it("displays the progress indicator", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByTestId("progress-indicator")).toBeTruthy();
  });

  it("displays the header title", () => {
    const { getByText } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByText("Assessment")).toBeTruthy();
  });

  it("displays the step counter", () => {
    const { getByText } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByText("11 of 14")).toBeTruthy();
  });

  it("displays the question text", () => {
    const { getByText } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByText("Do you have other mental health symptoms?")).toBeTruthy();
  });

  it("displays the symptoms input area", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByTestId("symptoms-input-area")).toBeTruthy();
  });

  it("displays the text input", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByTestId("symptom-text-input")).toBeTruthy();
  });

  it("displays the tag counter", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByTestId("tag-counter")).toBeTruthy();
  });

  it("shows 0/10 counter initially", () => {
    const { getByText } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByText("0/10")).toBeTruthy();
  });

  it("displays suggestions section", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByTestId("suggestions-section")).toBeTruthy();
  });

  it("displays most common label", () => {
    const { getByText } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByText("Most Common:")).toBeTruthy();
  });

  it("displays suggestion chips", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByTestId("suggestion-chip-depressed")).toBeTruthy();
    expect(getByTestId("suggestion-chip-anxious")).toBeTruthy();
  });

  it("adds tag when suggestion chip is pressed", () => {
    const { getByTestId, getByText } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("suggestion-chip-depressed"));
    expect(getByTestId("symptom-tag-depressed")).toBeTruthy();
    expect(getByText("1/10")).toBeTruthy();
  });

  it("removes tag when tag remove button is pressed", () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    // Add a tag first
    fireEvent.press(getByTestId("suggestion-chip-depressed"));
    expect(getByTestId("symptom-tag-depressed")).toBeTruthy();

    // Remove the tag
    fireEvent.press(getByTestId("symptom-tag-depressed-remove"));
    expect(queryByTestId("symptom-tag-depressed")).toBeNull();
    expect(getByText("0/10")).toBeTruthy();
  });

  it("adds tag when comma is typed in input", () => {
    const { getByTestId, getByText } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    const input = getByTestId("symptom-text-input");
    fireEvent.changeText(input, "Sad");
    fireEvent(input, "submitEditing");
    expect(getByText("1/10")).toBeTruthy();
  });

  it("does not add duplicate tags", () => {
    const { getByTestId, getByText } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("suggestion-chip-depressed"));
    fireEvent.press(getByTestId("suggestion-chip-depressed"));
    expect(getByText("1/10")).toBeTruthy();
  });

  it("limits to 10 tags maximum", () => {
    const { getByTestId, getByText } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    const input = getByTestId("symptom-text-input");

    // Add 10 tags
    for (let i = 1; i <= 10; i++) {
      fireEvent.changeText(input, `Symptom${i}`);
      fireEvent(input, "submitEditing");
    }

    expect(getByText("10/10")).toBeTruthy();

    // Try to add 11th tag
    fireEvent.changeText(input, "Symptom11");
    fireEvent(input, "submitEditing");
    expect(getByText("10/10")).toBeTruthy();
  });

  it("displays the Continue button", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByTestId("continue-button")).toBeTruthy();
  });

  it("calls onContinue with symptoms when Continue is pressed", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("suggestion-chip-depressed"));
    fireEvent.press(getByTestId("suggestion-chip-anxious"));
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith(["Depressed", "Anxious"]);
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    const container = getByTestId("assessment-other-symptoms-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("symptoms input area has olive green border", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    const inputArea = getByTestId("symptoms-input-area");
    const styles = Array.isArray(inputArea.props.style)
      ? inputArea.props.style.flat()
      : [inputArea.props.style];
    const areaStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(areaStyles.borderColor).toBe("#9AAD5C");
  });

  it("suggestion chips have orange background when not selected", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    const chip = getByTestId("suggestion-chip-depressed");
    const styles = Array.isArray(chip.props.style)
      ? chip.props.style.flat()
      : [chip.props.style];
    const chipStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(chipStyles.backgroundColor).toBe("#E8853A");
  });

  it("Continue button has minimum touch target size", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    const button = getByTestId("continue-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce((acc, s) => ({ ...acc, ...s }), {});
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("clears input after adding a tag", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    const input = getByTestId("symptom-text-input");
    fireEvent.changeText(input, "TestSymptom");
    fireEvent(input, "submitEditing");
    expect(input.props.value).toBe("");
  });

  it("trims whitespace from tags", () => {
    const { getByTestId } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    const input = getByTestId("symptom-text-input");
    fireEvent.changeText(input, "  Sad  ");
    fireEvent(input, "submitEditing");
    fireEvent.press(getByTestId("continue-button"));
    expect(mockOnContinue).toHaveBeenCalledWith(["Sad"]);
  });

  it("does not add empty tags", () => {
    const { getByTestId, getByText } = render(
      <AssessmentOtherSymptomsScreen {...defaultProps} />
    );
    const input = getByTestId("symptom-text-input");
    fireEvent.changeText(input, "   ");
    fireEvent(input, "submitEditing");
    expect(getByText("0/10")).toBeTruthy();
  });
});
