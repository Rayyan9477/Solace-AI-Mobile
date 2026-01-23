/**
 * Button Component Tests
 * @description TDD tests for the Button component
 * @task Task 2.1.1: Button Component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View, StyleSheet } from "react-native";
import { Button } from "./Button";
import type { ButtonVariant, ButtonSize } from "./Button.types";

/**
 * Helper to flatten style arrays from Pressable
 */
function flattenStyle(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => {
      if (s) {
        return { ...acc, ...flattenStyle(s) };
      }
      return acc;
    }, {});
  }
  if (style && typeof style === "object") {
    return style as Record<string, unknown>;
  }
  return {};
}

describe("Button Component", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe("Rendering", () => {
    it("should render with label", () => {
      const { getByText } = render(
        <Button label="Click me" onPress={mockOnPress} />
      );
      expect(getByText("Click me")).toBeTruthy();
    });

    it("should apply testID prop", () => {
      const { getByTestId } = render(
        <Button label="Test" onPress={mockOnPress} testID="test-button" />
      );
      expect(getByTestId("test-button")).toBeTruthy();
    });

    it("should render with default variant (primary)", () => {
      const { getByTestId } = render(
        <Button label="Primary" onPress={mockOnPress} testID="btn" />
      );
      expect(getByTestId("btn")).toBeTruthy();
    });

    it("should render with default size (md)", () => {
      const { getByTestId } = render(
        <Button label="Medium" onPress={mockOnPress} testID="btn" />
      );
      const button = getByTestId("btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          minHeight: 44,
        })
      );
    });
  });

  describe("Variants", () => {
    const variants: ButtonVariant[] = [
      "primary",
      "secondary",
      "outline",
      "ghost",
      "crisis",
      "link",
    ];

    variants.forEach((variant) => {
      it(`should render ${variant} variant`, () => {
        const { getByText } = render(
          <Button label={variant} variant={variant} onPress={mockOnPress} />
        );
        expect(getByText(variant)).toBeTruthy();
      });
    });

    it("crisis variant should have elevated shadow", () => {
      const { getByTestId } = render(
        <Button
          label="Crisis"
          variant="crisis"
          onPress={mockOnPress}
          testID="crisis-btn"
        />
      );
      const button = getByTestId("crisis-btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          elevation: expect.any(Number),
        })
      );
    });
  });

  describe("Sizes", () => {
    it("sm size should have height 36, paddingHorizontal 12", () => {
      const { getByTestId } = render(
        <Button
          label="Small"
          size="sm"
          onPress={mockOnPress}
          testID="sm-btn"
        />
      );
      const button = getByTestId("sm-btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          minHeight: 36,
          paddingHorizontal: 12,
        })
      );
    });

    it("md size should have height 44, paddingHorizontal 16", () => {
      const { getByTestId } = render(
        <Button
          label="Medium"
          size="md"
          onPress={mockOnPress}
          testID="md-btn"
        />
      );
      const button = getByTestId("md-btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          minHeight: 44,
          paddingHorizontal: 16,
        })
      );
    });

    it("lg size should have height 52, paddingHorizontal 24", () => {
      const { getByTestId } = render(
        <Button
          label="Large"
          size="lg"
          onPress={mockOnPress}
          testID="lg-btn"
        />
      );
      const button = getByTestId("lg-btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          minHeight: 52,
          paddingHorizontal: 24,
        })
      );
    });
  });

  describe("Press Handling", () => {
    it("should call onPress when pressed", () => {
      const { getByTestId } = render(
        <Button label="Press" onPress={mockOnPress} testID="press-btn" />
      );
      fireEvent.press(getByTestId("press-btn"));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("should not call onPress when disabled", () => {
      const { getByTestId } = render(
        <Button
          label="Disabled"
          onPress={mockOnPress}
          disabled
          testID="disabled-btn"
        />
      );
      fireEvent.press(getByTestId("disabled-btn"));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it("should not call onPress when loading", () => {
      const { getByTestId } = render(
        <Button
          label="Loading"
          onPress={mockOnPress}
          loading
          testID="loading-btn"
        />
      );
      fireEvent.press(getByTestId("loading-btn"));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe("Loading State", () => {
    it("should show ActivityIndicator when loading", () => {
      const { getByTestId } = render(
        <Button
          label="Loading"
          onPress={mockOnPress}
          loading
          testID="loading-btn"
        />
      );
      expect(getByTestId("loading-btn-indicator")).toBeTruthy();
    });

    it("should hide label when loading", () => {
      const { queryByText } = render(
        <Button label="Loading" onPress={mockOnPress} loading />
      );
      expect(queryByText("Loading")).toBeNull();
    });
  });

  describe("Disabled State", () => {
    it("should apply disabled styling", () => {
      const { getByTestId } = render(
        <Button
          label="Disabled"
          onPress={mockOnPress}
          disabled
          testID="disabled-btn"
        />
      );
      const button = getByTestId("disabled-btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          opacity: 0.5,
        })
      );
    });
  });

  describe("Icons", () => {
    it("should render left icon", () => {
      const { getByTestId } = render(
        <Button
          label="With Icon"
          onPress={mockOnPress}
          leftIcon={<View testID="left-icon" />}
          testID="icon-btn"
        />
      );
      expect(getByTestId("left-icon")).toBeTruthy();
    });

    it("should render right icon", () => {
      const { getByTestId } = render(
        <Button
          label="With Icon"
          onPress={mockOnPress}
          rightIcon={<View testID="right-icon" />}
          testID="icon-btn"
        />
      );
      expect(getByTestId("right-icon")).toBeTruthy();
    });

    it("should render both icons", () => {
      const { getByTestId } = render(
        <Button
          label="Both Icons"
          onPress={mockOnPress}
          leftIcon={<View testID="left-icon" />}
          rightIcon={<View testID="right-icon" />}
          testID="icon-btn"
        />
      );
      expect(getByTestId("left-icon")).toBeTruthy();
      expect(getByTestId("right-icon")).toBeTruthy();
    });
  });

  describe("Full Width", () => {
    it("should apply fullWidth styling", () => {
      const { getByTestId } = render(
        <Button
          label="Full Width"
          onPress={mockOnPress}
          fullWidth
          testID="full-btn"
        />
      );
      const button = getByTestId("full-btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          width: "100%",
        })
      );
    });
  });

  describe("Accessibility", () => {
    it("should have accessibilityRole button", () => {
      const { getByTestId } = render(
        <Button label="Accessible" onPress={mockOnPress} testID="a11y-btn" />
      );
      const button = getByTestId("a11y-btn");
      expect(button.props.accessibilityRole).toBe("button");
    });

    it("should apply accessibilityLabel", () => {
      const { getByLabelText } = render(
        <Button
          label="Submit"
          onPress={mockOnPress}
          accessibilityLabel="Submit form"
        />
      );
      expect(getByLabelText("Submit form")).toBeTruthy();
    });

    it("should have accessibilityState disabled when disabled", () => {
      const { getByTestId } = render(
        <Button
          label="Disabled"
          onPress={mockOnPress}
          disabled
          testID="disabled-btn"
        />
      );
      const button = getByTestId("disabled-btn");
      expect(button.props.accessibilityState).toEqual(
        expect.objectContaining({
          disabled: true,
        })
      );
    });

    it("should have accessibilityState busy when loading", () => {
      const { getByTestId } = render(
        <Button
          label="Loading"
          onPress={mockOnPress}
          loading
          testID="loading-btn"
        />
      );
      const button = getByTestId("loading-btn");
      expect(button.props.accessibilityState).toEqual(
        expect.objectContaining({
          busy: true,
        })
      );
    });

    it("should have minimum touch target of 44pt", () => {
      const { getByTestId } = render(
        <Button label="Touch" onPress={mockOnPress} testID="touch-btn" />
      );
      const button = getByTestId("touch-btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          minHeight: 44,
        })
      );
    });
  });

  describe("Style Overrides", () => {
    it("should merge custom styles", () => {
      const { getByTestId } = render(
        <Button
          label="Custom"
          onPress={mockOnPress}
          style={{ marginTop: 10 }}
          testID="custom-btn"
        />
      );
      const button = getByTestId("custom-btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          marginTop: 10,
        })
      );
    });

    it("should apply labelStyle to text", () => {
      const { getByText } = render(
        <Button
          label="Styled"
          onPress={mockOnPress}
          labelStyle={{ letterSpacing: 2 }}
        />
      );
      const label = getByText("Styled");
      const style = flattenStyle(label.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          letterSpacing: 2,
        })
      );
    });
  });

  describe("TypeScript Types", () => {
    it("should have ButtonVariant type with all variants", () => {
      const variants: ButtonVariant[] = [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "crisis",
        "link",
      ];
      expect(variants).toHaveLength(6);
    });

    it("should have ButtonSize type with all sizes", () => {
      const sizes: ButtonSize[] = ["sm", "md", "lg"];
      expect(sizes).toHaveLength(3);
    });
  });
});
