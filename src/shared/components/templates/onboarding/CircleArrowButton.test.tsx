/**
 * CircleArrowButton Tests
 * @description Test suite for CircleArrowButton component
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CircleArrowButton } from "./CircleArrowButton";

describe("CircleArrowButton", () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render with right arrow by default", () => {
      const { getByText } = render(
        <CircleArrowButton onPress={mockOnPress} accessibilityLabel="Next" />
      );
      expect(getByText("→")).toBeTruthy();
    });

    it("should render left arrow when direction is left", () => {
      const { getByText } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          direction="left"
          accessibilityLabel="Previous"
        />
      );
      expect(getByText("←")).toBeTruthy();
    });

    it("should render with default size", () => {
      const { getByA11yRole } = render(
        <CircleArrowButton onPress={mockOnPress} accessibilityLabel="Next" />
      );
      const button = getByA11yRole("button");
      expect(button.props.style).toContainEqual({ width: 56, height: 56 });
    });

    it("should render with custom size", () => {
      const { getByA11yRole } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          size={48}
          accessibilityLabel="Next"
        />
      );
      const button = getByA11yRole("button");
      expect(button.props.style).toContainEqual({ width: 48, height: 48 });
    });

    it("should apply custom background color", () => {
      const { getByA11yRole } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          backgroundColor="#FF0000"
          accessibilityLabel="Next"
        />
      );
      const button = getByA11yRole("button");
      expect(button.props.style).toContainEqual({ backgroundColor: "#FF0000" });
    });
  });

  describe("Interaction", () => {
    it("should call onPress when pressed", () => {
      const { getByA11yRole } = render(
        <CircleArrowButton onPress={mockOnPress} accessibilityLabel="Next" />
      );

      const button = getByA11yRole("button");
      fireEvent.press(button);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it("should not call onPress when disabled", () => {
      const { getByA11yRole } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          disabled
          accessibilityLabel="Next"
        />
      );

      const button = getByA11yRole("button");
      fireEvent.press(button);

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it("should show pressed state on press", () => {
      const { getByA11yRole } = render(
        <CircleArrowButton onPress={mockOnPress} accessibilityLabel="Next" />
      );

      const button = getByA11yRole("button");
      fireEvent(button, "pressIn");

      // Pressed state should apply scale transform
      expect(button.props.style).toContainEqual({ transform: [{ scale: 0.95 }] });
    });
  });

  describe("Accessibility", () => {
    it("should have button role", () => {
      const { getByA11yRole } = render(
        <CircleArrowButton onPress={mockOnPress} accessibilityLabel="Next step" />
      );
      expect(getByA11yRole("button")).toBeTruthy();
    });

    it("should have proper accessibility label", () => {
      const { getByLabelText } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          accessibilityLabel="Complete onboarding"
        />
      );
      expect(getByLabelText("Complete onboarding")).toBeTruthy();
    });

    it("should announce disabled state", () => {
      const { getByA11yRole } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          disabled
          accessibilityLabel="Next"
        />
      );

      const button = getByA11yRole("button");
      expect(button.props.accessibilityState).toEqual({ disabled: true });
    });

    it("should have proper hit slop for buttons smaller than 44pt", () => {
      const { getByA11yRole } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          size={32}
          accessibilityLabel="Next"
        />
      );

      const button = getByA11yRole("button");
      expect(button.props.hitSlop).toEqual({
        top: 6,
        bottom: 6,
        left: 6,
        right: 6,
      });
    });

    it("should not have hit slop for buttons 44pt or larger", () => {
      const { getByA11yRole } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          size={56}
          accessibilityLabel="Next"
        />
      );

      const button = getByA11yRole("button");
      expect(button.props.hitSlop).toBeUndefined();
    });
  });

  describe("Variants", () => {
    it("should render next variant", () => {
      const { container } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          variant="next"
          accessibilityLabel="Next"
        />
      );
      expect(container).toBeTruthy();
    });

    it("should render complete variant", () => {
      const { container } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          variant="complete"
          accessibilityLabel="Complete"
        />
      );
      expect(container).toBeTruthy();
    });
  });

  describe("Disabled State", () => {
    it("should apply disabled opacity", () => {
      const { getByA11yRole } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          disabled
          accessibilityLabel="Next"
        />
      );

      const button = getByA11yRole("button");
      expect(button.props.style).toContainEqual({ opacity: 0.5 });
    });

    it("should use disabled background color", () => {
      const { getByA11yRole } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          disabled
          accessibilityLabel="Next"
        />
      );

      const button = getByA11yRole("button");
      expect(button.props.style).toContainEqual({
        backgroundColor: "rgba(196, 165, 116, 0.3)",
      });
    });
  });

  describe("TestID", () => {
    it("should render with custom testID", () => {
      const { getByTestId } = render(
        <CircleArrowButton
          onPress={mockOnPress}
          accessibilityLabel="Next"
          testID="custom-button"
        />
      );
      expect(getByTestId("custom-button")).toBeTruthy();
    });
  });
});
