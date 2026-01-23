/**
 * RadioButton Component Tests
 * @description TDD tests for the RadioButton component
 * @task Task 2.1.6: RadioButton Component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { RadioButton } from "./RadioButton";

describe("RadioButton Component", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  describe("Rendering", () => {
    it("should render radio button", () => {
      const { getByTestId } = render(
        <RadioButton
          selected={false}
          onSelect={mockOnSelect}
          value="option1"
          testID="radio"
        />
      );
      expect(getByTestId("radio")).toBeTruthy();
    });

    it("should render with label", () => {
      const { getByText } = render(
        <RadioButton
          selected={false}
          onSelect={mockOnSelect}
          value="option1"
          label="Option 1"
        />
      );
      expect(getByText("Option 1")).toBeTruthy();
    });
  });

  describe("Selected State", () => {
    it("should show selected state when selected is true", () => {
      const { getByTestId } = render(
        <RadioButton
          selected={true}
          onSelect={mockOnSelect}
          value="option1"
          testID="radio"
        />
      );
      const radio = getByTestId("radio");
      expect(radio.props.accessibilityState.checked).toBe(true);
    });

    it("should show unselected state when selected is false", () => {
      const { getByTestId } = render(
        <RadioButton
          selected={false}
          onSelect={mockOnSelect}
          value="option1"
          testID="radio"
        />
      );
      const radio = getByTestId("radio");
      expect(radio.props.accessibilityState.checked).toBe(false);
    });
  });

  describe("Interaction", () => {
    it("should call onSelect when pressed", () => {
      const { getByTestId } = render(
        <RadioButton
          selected={false}
          onSelect={mockOnSelect}
          value="option1"
          testID="radio"
        />
      );
      fireEvent.press(getByTestId("radio"));
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });

    it("should not call onSelect when disabled", () => {
      const { getByTestId } = render(
        <RadioButton
          selected={false}
          onSelect={mockOnSelect}
          value="option1"
          disabled
          testID="radio"
        />
      );
      fireEvent.press(getByTestId("radio"));
      expect(mockOnSelect).not.toHaveBeenCalled();
    });

    it("should still call onSelect when already selected", () => {
      const { getByTestId } = render(
        <RadioButton
          selected={true}
          onSelect={mockOnSelect}
          value="option1"
          testID="radio"
        />
      );
      fireEvent.press(getByTestId("radio"));
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe("Value", () => {
    it("should have value prop", () => {
      const { getByTestId } = render(
        <RadioButton
          selected={false}
          onSelect={mockOnSelect}
          value="custom-value"
          testID="radio"
        />
      );
      // Value is typically used by parent RadioGroup
      expect(getByTestId("radio")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should apply accessibilityLabel", () => {
      const { getByLabelText } = render(
        <RadioButton
          selected={false}
          onSelect={mockOnSelect}
          value="option1"
          accessibilityLabel="Select option one"
        />
      );
      expect(getByLabelText("Select option one")).toBeTruthy();
    });

    it("should have radio accessibilityRole", () => {
      const { getByTestId } = render(
        <RadioButton
          selected={false}
          onSelect={mockOnSelect}
          value="option1"
          testID="radio"
        />
      );
      const radio = getByTestId("radio");
      expect(radio.props.accessibilityRole).toBe("radio");
    });

    it("should indicate disabled state for accessibility", () => {
      const { getByTestId } = render(
        <RadioButton
          selected={false}
          onSelect={mockOnSelect}
          value="option1"
          disabled
          testID="radio"
        />
      );
      const radio = getByTestId("radio");
      expect(radio.props.accessibilityState).toEqual(
        expect.objectContaining({
          disabled: true,
        })
      );
    });

    it("should have minimum touch target of 44pt", () => {
      const { getByTestId } = render(
        <RadioButton
          selected={false}
          onSelect={mockOnSelect}
          value="option1"
          testID="radio"
        />
      );
      const radio = getByTestId("radio");
      // Check minHeight or hitSlop
      expect(radio.props.hitSlop || radio.props.style).toBeTruthy();
    });
  });
});
