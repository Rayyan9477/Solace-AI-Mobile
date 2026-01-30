/**
 * CustomAIInstructionsScreen Tests
 * @description Tests for custom AI instructions/preferences screen
 * @task Task 3.7.13: Custom AI Instructions Screen (Screen 65)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CustomAIInstructionsScreen } from "./CustomAIInstructionsScreen";

describe("CustomAIInstructionsScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnInstructionsChange = jest.fn();
  const mockOnStyleChange = jest.fn();
  const mockOnReset = jest.fn();

  const mockCommunicationStyles = [
    { id: "supportive", label: "Supportive", selected: true },
    { id: "direct", label: "Direct", selected: false },
    { id: "gentle", label: "Gentle", selected: false },
    { id: "motivational", label: "Motivational", selected: true },
  ];

  const defaultProps = {
    customInstructions: "Please focus on my anxiety management and sleep improvement goals.",
    communicationStyles: mockCommunicationStyles,
    hasUnsavedChanges: false,
    onBack: mockOnBack,
    onSave: mockOnSave,
    onInstructionsChange: mockOnInstructionsChange,
    onStyleChange: mockOnStyleChange,
    onReset: mockOnReset,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(getByTestId("custom-ai-instructions-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays screen title", () => {
    const { getByText } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(getByText(/Custom Instructions/)).toBeTruthy();
  });

  it("displays description text", () => {
    const { getByText } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(getByText(/Customize how Solace AI interacts/)).toBeTruthy();
  });

  it("displays instructions input section", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(getByTestId("instructions-section")).toBeTruthy();
  });

  it("displays instructions text input", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(getByTestId("instructions-input")).toBeTruthy();
  });

  it("displays current instructions value", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    const input = getByTestId("instructions-input");
    expect(input.props.value).toBe(
      "Please focus on my anxiety management and sleep improvement goals."
    );
  });

  it("calls onInstructionsChange when text changes", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    fireEvent.changeText(getByTestId("instructions-input"), "New instructions");
    expect(mockOnInstructionsChange).toHaveBeenCalledWith("New instructions");
  });

  it("displays communication style section", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(getByTestId("style-section")).toBeTruthy();
  });

  it("displays all communication style options", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(getByTestId("style-option-supportive")).toBeTruthy();
    expect(getByTestId("style-option-direct")).toBeTruthy();
    expect(getByTestId("style-option-gentle")).toBeTruthy();
    expect(getByTestId("style-option-motivational")).toBeTruthy();
  });

  it("displays style labels", () => {
    const { getByText } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(getByText("Supportive")).toBeTruthy();
    expect(getByText("Direct")).toBeTruthy();
    expect(getByText("Gentle")).toBeTruthy();
    expect(getByText("Motivational")).toBeTruthy();
  });

  it("calls onStyleChange when style option is pressed", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("style-option-direct"));
    expect(mockOnStyleChange).toHaveBeenCalledWith("direct");
  });

  it("displays save button", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(getByTestId("save-button")).toBeTruthy();
  });

  it("calls onSave when save button is pressed", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("save-button"));
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it("displays reset button", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(getByTestId("reset-button")).toBeTruthy();
  });

  it("calls onReset when reset button is pressed", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("reset-button"));
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it("displays unsaved changes indicator when hasUnsavedChanges is true", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} hasUnsavedChanges={true} />
    );
    expect(getByTestId("unsaved-indicator")).toBeTruthy();
  });

  it("hides unsaved indicator when hasUnsavedChanges is false", () => {
    const { queryByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} hasUnsavedChanges={false} />
    );
    expect(queryByTestId("unsaved-indicator")).toBeNull();
  });

  it("displays character count", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(getByTestId("character-count")).toBeTruthy();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    const container = getByTestId("custom-ai-instructions-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
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

  it("save button has minimum touch target size", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    const button = getByTestId("save-button");
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
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("save button has proper accessibility", () => {
    const { getByTestId } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    const button = getByTestId("save-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Save instructions");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <CustomAIInstructionsScreen {...defaultProps} />
    );
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });
});
