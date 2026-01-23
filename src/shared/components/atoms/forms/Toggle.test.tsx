/**
 * Toggle Component Tests
 * @description TDD tests for the Toggle component
 * @task Task 2.1.4: Toggle Component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Toggle } from "./Toggle";

describe("Toggle Component", () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  describe("Rendering", () => {
    it("should render toggle", () => {
      const { getByTestId } = render(
        <Toggle
          value={false}
          onValueChange={mockOnValueChange}
          testID="toggle"
        />
      );
      expect(getByTestId("toggle")).toBeTruthy();
    });

    it("should render with label", () => {
      const { getByText } = render(
        <Toggle
          value={false}
          onValueChange={mockOnValueChange}
          label="Dark Mode"
        />
      );
      expect(getByText("Dark Mode")).toBeTruthy();
    });
  });

  describe("Value State", () => {
    it("should show on state when value is true", () => {
      const { getByTestId } = render(
        <Toggle
          value={true}
          onValueChange={mockOnValueChange}
          testID="toggle"
        />
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.value).toBe(true);
    });

    it("should show off state when value is false", () => {
      const { getByTestId } = render(
        <Toggle
          value={false}
          onValueChange={mockOnValueChange}
          testID="toggle"
        />
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.value).toBe(false);
    });
  });

  describe("Interaction", () => {
    it("should call onValueChange when toggled", () => {
      const { getByTestId } = render(
        <Toggle
          value={false}
          onValueChange={mockOnValueChange}
          testID="toggle"
        />
      );
      fireEvent(getByTestId("toggle"), "valueChange", true);
      expect(mockOnValueChange).toHaveBeenCalledWith(true);
    });

    it("should not call onValueChange when disabled", () => {
      const { getByTestId } = render(
        <Toggle
          value={false}
          onValueChange={mockOnValueChange}
          disabled
          testID="toggle"
        />
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.disabled).toBe(true);
    });
  });

  describe("Disabled State", () => {
    it("should apply disabled prop", () => {
      const { getByTestId } = render(
        <Toggle
          value={false}
          onValueChange={mockOnValueChange}
          disabled
          testID="toggle"
        />
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.disabled).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("should apply accessibilityLabel", () => {
      const { getByLabelText } = render(
        <Toggle
          value={false}
          onValueChange={mockOnValueChange}
          accessibilityLabel="Enable dark mode"
        />
      );
      expect(getByLabelText("Enable dark mode")).toBeTruthy();
    });

    it("should have switch accessibilityRole", () => {
      const { getByTestId } = render(
        <Toggle
          value={false}
          onValueChange={mockOnValueChange}
          testID="toggle"
        />
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.accessibilityRole).toBe("switch");
    });

    it("should indicate checked state for accessibility", () => {
      const { getByTestId } = render(
        <Toggle
          value={true}
          onValueChange={mockOnValueChange}
          testID="toggle"
        />
      );
      const toggle = getByTestId("toggle");
      expect(toggle.props.accessibilityState).toEqual(
        expect.objectContaining({
          checked: true,
        })
      );
    });
  });
});
