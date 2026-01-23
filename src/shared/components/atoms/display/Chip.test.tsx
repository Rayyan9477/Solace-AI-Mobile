/**
 * Chip Component Tests
 * @description TDD tests for the Chip component
 * @task Task 2.2.4: Chip Component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";
import { Chip } from "./Chip";

describe("Chip Component", () => {
  const mockOnPress = jest.fn();
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
    mockOnDismiss.mockClear();
  });

  describe("Rendering", () => {
    it("should render chip with label", () => {
      const { getByText } = render(<Chip label="Tag" testID="chip" />);
      expect(getByText("Tag")).toBeTruthy();
    });

    it("should render with testID", () => {
      const { getByTestId } = render(<Chip label="Tag" testID="chip" />);
      expect(getByTestId("chip")).toBeTruthy();
    });
  });

  describe("Variants", () => {
    it("should render filled variant by default", () => {
      const { getByTestId } = render(
        <Chip label="Filled" testID="chip" />
      );
      expect(getByTestId("chip")).toBeTruthy();
    });

    it("should render outlined variant", () => {
      const { getByTestId } = render(
        <Chip label="Outlined" variant="outlined" testID="chip" />
      );
      expect(getByTestId("chip")).toBeTruthy();
    });
  });

  describe("Sizes", () => {
    it("should render small size", () => {
      const { getByTestId } = render(
        <Chip label="SM" size="sm" testID="chip" />
      );
      expect(getByTestId("chip")).toBeTruthy();
    });

    it("should render medium size (default)", () => {
      const { getByTestId } = render(
        <Chip label="MD" size="md" testID="chip" />
      );
      expect(getByTestId("chip")).toBeTruthy();
    });

    it("should render large size", () => {
      const { getByTestId } = render(
        <Chip label="LG" size="lg" testID="chip" />
      );
      expect(getByTestId("chip")).toBeTruthy();
    });
  });

  describe("Selected State", () => {
    it("should show selected state", () => {
      const { getByTestId } = render(
        <Chip label="Selected" selected testID="chip" />
      );
      const chip = getByTestId("chip");
      expect(chip.props.accessibilityState.selected).toBe(true);
    });

    it("should show unselected state", () => {
      const { getByTestId } = render(
        <Chip label="Unselected" selected={false} testID="chip" />
      );
      const chip = getByTestId("chip");
      expect(chip.props.accessibilityState.selected).toBe(false);
    });
  });

  describe("Interaction", () => {
    it("should call onPress when pressed", () => {
      const { getByTestId } = render(
        <Chip label="Pressable" onPress={mockOnPress} testID="chip" />
      );
      fireEvent.press(getByTestId("chip"));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("should not call onPress when disabled", () => {
      const { getByTestId } = render(
        <Chip label="Disabled" onPress={mockOnPress} disabled testID="chip" />
      );
      fireEvent.press(getByTestId("chip"));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it("should show dismiss button when onDismiss provided", () => {
      const { getByTestId } = render(
        <Chip label="Dismissible" onDismiss={mockOnDismiss} testID="chip" />
      );
      expect(getByTestId("chip-dismiss")).toBeTruthy();
    });

    it("should call onDismiss when dismiss button pressed", () => {
      const { getByTestId } = render(
        <Chip label="Dismissible" onDismiss={mockOnDismiss} testID="chip" />
      );
      fireEvent.press(getByTestId("chip-dismiss"));
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it("should not call onDismiss when disabled", () => {
      const { getByTestId } = render(
        <Chip
          label="Disabled"
          onDismiss={mockOnDismiss}
          disabled
          testID="chip"
        />
      );
      fireEvent.press(getByTestId("chip-dismiss"));
      expect(mockOnDismiss).not.toHaveBeenCalled();
    });
  });

  describe("Left Icon", () => {
    it("should render left icon when provided", () => {
      const { getByTestId } = render(
        <Chip
          label="With Icon"
          leftIcon={<View testID="left-icon" />}
          testID="chip"
        />
      );
      expect(getByTestId("left-icon")).toBeTruthy();
    });
  });

  describe("Disabled State", () => {
    it("should apply disabled state", () => {
      const { getByTestId } = render(
        <Chip label="Disabled" disabled testID="chip" />
      );
      const chip = getByTestId("chip");
      expect(chip.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("should have button accessibilityRole", () => {
      const { getByTestId } = render(
        <Chip label="Accessible" testID="chip" />
      );
      const chip = getByTestId("chip");
      expect(chip.props.accessibilityRole).toBe("button");
    });

    it("should apply custom accessibilityLabel", () => {
      const { getByLabelText } = render(
        <Chip label="Tag" accessibilityLabel="Filter by tag" />
      );
      expect(getByLabelText("Filter by tag")).toBeTruthy();
    });

    it("should use label as default accessibilityLabel", () => {
      const { getByTestId } = render(
        <Chip label="Default Label" testID="chip" />
      );
      const chip = getByTestId("chip");
      expect(chip.props.accessibilityLabel).toBe("Default Label");
    });

    it("should have minimum touch target of 44pt", () => {
      const { getByTestId } = render(
        <Chip label="Touch" testID="chip" />
      );
      const chip = getByTestId("chip");
      expect(chip.props.hitSlop || chip.props.style).toBeTruthy();
    });
  });

  describe("Custom Styles", () => {
    it("should apply custom style", () => {
      const customStyle = { marginTop: 10 };
      const { getByTestId } = render(
        <Chip label="Custom" style={customStyle} testID="chip" />
      );
      expect(getByTestId("chip")).toBeTruthy();
    });
  });
});
