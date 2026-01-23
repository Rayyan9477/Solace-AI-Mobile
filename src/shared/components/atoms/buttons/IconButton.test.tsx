/**
 * IconButton Component Tests
 * @description TDD tests for the IconButton component
 * @task Task 2.1.2: IconButton Component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";
import { IconButton } from "./IconButton";
import type { IconButtonVariant, IconButtonSize } from "./IconButton.types";

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

const MockIcon = () => <View testID="mock-icon" />;

describe("IconButton Component", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe("Rendering", () => {
    it("should render with icon", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          onPress={mockOnPress}
          accessibilityLabel="Test button"
        />
      );
      expect(getByTestId("mock-icon")).toBeTruthy();
    });

    it("should apply testID prop", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          onPress={mockOnPress}
          accessibilityLabel="Test"
          testID="icon-btn"
        />
      );
      expect(getByTestId("icon-btn")).toBeTruthy();
    });

    it("should render with default variant (filled)", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          onPress={mockOnPress}
          accessibilityLabel="Test"
          testID="btn"
        />
      );
      expect(getByTestId("btn")).toBeTruthy();
    });

    it("should render with default size (md)", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          onPress={mockOnPress}
          accessibilityLabel="Test"
          testID="btn"
        />
      );
      const button = getByTestId("btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          width: 44,
          height: 44,
        })
      );
    });
  });

  describe("Variants", () => {
    const variants: IconButtonVariant[] = ["filled", "tinted", "outlined", "ghost"];

    variants.forEach((variant) => {
      it(`should render ${variant} variant`, () => {
        const { getByTestId } = render(
          <IconButton
            icon={<MockIcon />}
            variant={variant}
            onPress={mockOnPress}
            accessibilityLabel={variant}
            testID={`${variant}-btn`}
          />
        );
        expect(getByTestId(`${variant}-btn`)).toBeTruthy();
      });
    });

    it("outlined variant should have border", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          variant="outlined"
          onPress={mockOnPress}
          accessibilityLabel="Outlined"
          testID="outlined-btn"
        />
      );
      const button = getByTestId("outlined-btn");
      const style = flattenStyle(button.props.style);
      expect(style.borderWidth).toBeGreaterThan(0);
    });

    it("ghost variant should have transparent background", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          variant="ghost"
          onPress={mockOnPress}
          accessibilityLabel="Ghost"
          testID="ghost-btn"
        />
      );
      const button = getByTestId("ghost-btn");
      const style = flattenStyle(button.props.style);
      expect(style.backgroundColor).toBe("transparent");
    });
  });

  describe("Sizes", () => {
    it("sm size should be 32x32", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          size="sm"
          onPress={mockOnPress}
          accessibilityLabel="Small"
          testID="sm-btn"
        />
      );
      const button = getByTestId("sm-btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          width: 32,
          height: 32,
        })
      );
    });

    it("md size should be 44x44 (min touch target)", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          size="md"
          onPress={mockOnPress}
          accessibilityLabel="Medium"
          testID="md-btn"
        />
      );
      const button = getByTestId("md-btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          width: 44,
          height: 44,
        })
      );
    });

    it("lg size should be 56x56", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          size="lg"
          onPress={mockOnPress}
          accessibilityLabel="Large"
          testID="lg-btn"
        />
      );
      const button = getByTestId("lg-btn");
      const style = flattenStyle(button.props.style);
      expect(style).toEqual(
        expect.objectContaining({
          width: 56,
          height: 56,
        })
      );
    });
  });

  describe("Circular Shape", () => {
    it("should apply circular styling when circular prop is true", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          circular
          onPress={mockOnPress}
          accessibilityLabel="Circular"
          testID="circular-btn"
        />
      );
      const button = getByTestId("circular-btn");
      const style = flattenStyle(button.props.style);
      // Circular should have borderRadius equal to half of size (44/2 = 22)
      expect(style.borderRadius).toBe(22);
    });

    it("should have square corners when circular is false", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          circular={false}
          onPress={mockOnPress}
          accessibilityLabel="Square"
          testID="square-btn"
        />
      );
      const button = getByTestId("square-btn");
      const style = flattenStyle(button.props.style);
      // Should have smaller borderRadius
      expect(style.borderRadius).toBeLessThan(22);
    });
  });

  describe("Press Handling", () => {
    it("should call onPress when pressed", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          onPress={mockOnPress}
          accessibilityLabel="Press"
          testID="press-btn"
        />
      );
      fireEvent.press(getByTestId("press-btn"));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("should not call onPress when disabled", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          onPress={mockOnPress}
          disabled
          accessibilityLabel="Disabled"
          testID="disabled-btn"
        />
      );
      fireEvent.press(getByTestId("disabled-btn"));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    it("should apply disabled styling", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          onPress={mockOnPress}
          disabled
          accessibilityLabel="Disabled"
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

  describe("Accessibility", () => {
    it("should have accessibilityRole button", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          onPress={mockOnPress}
          accessibilityLabel="Accessible"
          testID="a11y-btn"
        />
      );
      const button = getByTestId("a11y-btn");
      expect(button.props.accessibilityRole).toBe("button");
    });

    it("should apply accessibilityLabel", () => {
      const { getByLabelText } = render(
        <IconButton
          icon={<MockIcon />}
          onPress={mockOnPress}
          accessibilityLabel="Close dialog"
        />
      );
      expect(getByLabelText("Close dialog")).toBeTruthy();
    });

    it("should have accessibilityState disabled when disabled", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          onPress={mockOnPress}
          disabled
          accessibilityLabel="Disabled"
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

    it("sm size should still meet minimum touch target", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          size="sm"
          onPress={mockOnPress}
          accessibilityLabel="Small"
          testID="sm-btn"
        />
      );
      const button = getByTestId("sm-btn");
      const style = flattenStyle(button.props.style);
      // sm is 32, but hitSlop should compensate
      expect(button.props.hitSlop).toBeDefined();
    });
  });

  describe("Style Overrides", () => {
    it("should merge custom styles", () => {
      const { getByTestId } = render(
        <IconButton
          icon={<MockIcon />}
          onPress={mockOnPress}
          style={{ marginTop: 10 }}
          accessibilityLabel="Custom"
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
  });

  describe("TypeScript Types", () => {
    it("should have IconButtonVariant type with all variants", () => {
      const variants: IconButtonVariant[] = ["filled", "tinted", "outlined", "ghost"];
      expect(variants).toHaveLength(4);
    });

    it("should have IconButtonSize type with all sizes", () => {
      const sizes: IconButtonSize[] = ["sm", "md", "lg"];
      expect(sizes).toHaveLength(3);
    });
  });
});
