/**
 * Slider Component Tests
 * @description TDD tests for the Slider component
 * @task Task 2.2.1: Slider Component
 */

import React from "react";
import { render } from "@testing-library/react-native";
import { Slider } from "./Slider";

describe("Slider Component", () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    mockOnValueChange.mockClear();
  });

  describe("Rendering", () => {
    it("should render slider", () => {
      const { getByTestId } = render(
        <Slider
          value={50}
          onValueChange={mockOnValueChange}
          testID="slider"
        />
      );
      expect(getByTestId("slider")).toBeTruthy();
    });

    it("should render with default min/max", () => {
      const { getByTestId } = render(
        <Slider
          value={50}
          onValueChange={mockOnValueChange}
          testID="slider"
        />
      );
      const slider = getByTestId("slider");
      expect(slider.props.minimumValue).toBe(0);
      expect(slider.props.maximumValue).toBe(100);
    });
  });

  describe("Value", () => {
    it("should display current value", () => {
      const { getByTestId } = render(
        <Slider
          value={75}
          onValueChange={mockOnValueChange}
          testID="slider"
        />
      );
      const slider = getByTestId("slider");
      expect(slider.props.value).toBe(75);
    });

    it("should respect custom min/max", () => {
      const { getByTestId } = render(
        <Slider
          value={5}
          onValueChange={mockOnValueChange}
          min={0}
          max={10}
          testID="slider"
        />
      );
      const slider = getByTestId("slider");
      expect(slider.props.minimumValue).toBe(0);
      expect(slider.props.maximumValue).toBe(10);
    });

    it("should respect step value", () => {
      const { getByTestId } = render(
        <Slider
          value={50}
          onValueChange={mockOnValueChange}
          step={10}
          testID="slider"
        />
      );
      const slider = getByTestId("slider");
      expect(slider.props.step).toBe(10);
    });
  });

  describe("Labels", () => {
    it("should show labels when showLabels is true", () => {
      const { getByText } = render(
        <Slider
          value={50}
          onValueChange={mockOnValueChange}
          min={0}
          max={100}
          showLabels
        />
      );
      expect(getByText("0")).toBeTruthy();
      expect(getByText("100")).toBeTruthy();
    });

    it("should not show labels when showLabels is false", () => {
      const { queryByText } = render(
        <Slider
          value={50}
          onValueChange={mockOnValueChange}
          min={0}
          max={100}
          showLabels={false}
        />
      );
      expect(queryByText("0")).toBeNull();
      expect(queryByText("100")).toBeNull();
    });

    it("should show value label when showValue is true", () => {
      const { getByText } = render(
        <Slider
          value={50}
          onValueChange={mockOnValueChange}
          showValue
        />
      );
      expect(getByText("50")).toBeTruthy();
    });
  });

  describe("Disabled State", () => {
    it("should apply disabled state", () => {
      const { getByTestId } = render(
        <Slider
          value={50}
          onValueChange={mockOnValueChange}
          disabled
          testID="slider"
        />
      );
      const slider = getByTestId("slider");
      expect(slider.props.disabled).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("should apply accessibilityLabel", () => {
      const { getByTestId } = render(
        <Slider
          value={50}
          onValueChange={mockOnValueChange}
          accessibilityLabel="Volume control"
          testID="slider"
        />
      );
      const slider = getByTestId("slider");
      expect(slider.props.accessibilityLabel).toBe("Volume control");
    });

    it("should have adjustable accessibilityRole", () => {
      const { getByTestId } = render(
        <Slider
          value={50}
          onValueChange={mockOnValueChange}
          testID="slider"
        />
      );
      const slider = getByTestId("slider");
      expect(slider.props.accessibilityRole).toBe("adjustable");
    });
  });
});
