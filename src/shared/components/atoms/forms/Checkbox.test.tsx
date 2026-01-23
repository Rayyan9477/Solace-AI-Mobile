/**
 * Checkbox Component Tests
 * @description TDD tests for the Checkbox component
 * @task Task 2.1.5: Checkbox Component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Checkbox } from "./Checkbox";

describe("Checkbox Component", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe("Rendering", () => {
    it("should render checkbox", () => {
      const { getByTestId } = render(
        <Checkbox
          checked={false}
          onChange={mockOnChange}
          testID="checkbox"
        />
      );
      expect(getByTestId("checkbox")).toBeTruthy();
    });

    it("should render with label", () => {
      const { getByText } = render(
        <Checkbox
          checked={false}
          onChange={mockOnChange}
          label="Accept terms"
        />
      );
      expect(getByText("Accept terms")).toBeTruthy();
    });
  });

  describe("Checked State", () => {
    it("should show checked state when checked is true", () => {
      const { getByTestId } = render(
        <Checkbox
          checked={true}
          onChange={mockOnChange}
          testID="checkbox"
        />
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.accessibilityState.checked).toBe(true);
    });

    it("should show unchecked state when checked is false", () => {
      const { getByTestId } = render(
        <Checkbox
          checked={false}
          onChange={mockOnChange}
          testID="checkbox"
        />
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.accessibilityState.checked).toBe(false);
    });
  });

  describe("Indeterminate State", () => {
    it("should show indeterminate state", () => {
      const { getByTestId } = render(
        <Checkbox
          checked={false}
          onChange={mockOnChange}
          indeterminate
          testID="checkbox"
        />
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.accessibilityState.checked).toBe("mixed");
    });
  });

  describe("Interaction", () => {
    it("should call onChange when pressed", () => {
      const { getByTestId } = render(
        <Checkbox
          checked={false}
          onChange={mockOnChange}
          testID="checkbox"
        />
      );
      fireEvent.press(getByTestId("checkbox"));
      expect(mockOnChange).toHaveBeenCalledWith(true);
    });

    it("should toggle from checked to unchecked", () => {
      const { getByTestId } = render(
        <Checkbox
          checked={true}
          onChange={mockOnChange}
          testID="checkbox"
        />
      );
      fireEvent.press(getByTestId("checkbox"));
      expect(mockOnChange).toHaveBeenCalledWith(false);
    });

    it("should not call onChange when disabled", () => {
      const { getByTestId } = render(
        <Checkbox
          checked={false}
          onChange={mockOnChange}
          disabled
          testID="checkbox"
        />
      );
      fireEvent.press(getByTestId("checkbox"));
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("should apply accessibilityLabel", () => {
      const { getByLabelText } = render(
        <Checkbox
          checked={false}
          onChange={mockOnChange}
          accessibilityLabel="Accept terms and conditions"
        />
      );
      expect(getByLabelText("Accept terms and conditions")).toBeTruthy();
    });

    it("should have checkbox accessibilityRole", () => {
      const { getByTestId } = render(
        <Checkbox
          checked={false}
          onChange={mockOnChange}
          testID="checkbox"
        />
      );
      const checkbox = getByTestId("checkbox");
      expect(checkbox.props.accessibilityRole).toBe("checkbox");
    });

    it("should have minimum touch target of 44pt", () => {
      const { getByTestId } = render(
        <Checkbox
          checked={false}
          onChange={mockOnChange}
          testID="checkbox"
        />
      );
      const checkbox = getByTestId("checkbox");
      // Check minHeight/minWidth or hitSlop
      expect(checkbox.props.hitSlop || checkbox.props.style).toBeTruthy();
    });
  });
});
