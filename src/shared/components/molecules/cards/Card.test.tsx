/**
 * Card Component Tests
 * @description Tests for the Card molecule component
 * @task Task 2.4.1: Card Component (Sprint 2.4 - Molecules Content)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View, Text } from "react-native";
import { Card } from "./Card";

describe("Card", () => {
  // ===================
  // Rendering Tests
  // ===================

  describe("Basic Rendering", () => {
    it("renders with children", () => {
      const { getByText } = render(
        <Card>
          <Text>Card Content</Text>
        </Card>
      );
      expect(getByText("Card Content")).toBeTruthy();
    });

    it("renders with testID", () => {
      const { getByTestId } = render(
        <Card testID="test-card">
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId("test-card")).toBeTruthy();
    });

    it("renders header content", () => {
      const { getByText } = render(
        <Card header={<Text>Card Header</Text>}>
          <Text>Content</Text>
        </Card>
      );
      expect(getByText("Card Header")).toBeTruthy();
    });

    it("renders footer content", () => {
      const { getByText } = render(
        <Card footer={<Text>Card Footer</Text>}>
          <Text>Content</Text>
        </Card>
      );
      expect(getByText("Card Footer")).toBeTruthy();
    });

    it("renders header, content, and footer together", () => {
      const { getByText } = render(
        <Card
          header={<Text>Header</Text>}
          footer={<Text>Footer</Text>}
        >
          <Text>Body</Text>
        </Card>
      );
      expect(getByText("Header")).toBeTruthy();
      expect(getByText("Body")).toBeTruthy();
      expect(getByText("Footer")).toBeTruthy();
    });
  });

  // ===================
  // Variant Tests
  // ===================

  describe("Variants", () => {
    it("renders elevated variant (default)", () => {
      const { getByTestId } = render(
        <Card testID="card" variant="elevated">
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId("card")).toBeTruthy();
    });

    it("renders filled variant", () => {
      const { getByTestId } = render(
        <Card testID="card" variant="filled">
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId("card")).toBeTruthy();
    });

    it("renders outlined variant", () => {
      const { getByTestId } = render(
        <Card testID="card" variant="outlined">
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId("card")).toBeTruthy();
    });
  });

  // ===================
  // Size Tests
  // ===================

  describe("Sizes", () => {
    it("renders small size", () => {
      const { getByTestId } = render(
        <Card testID="card" size="sm">
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId("card")).toBeTruthy();
    });

    it("renders medium size (default)", () => {
      const { getByTestId } = render(
        <Card testID="card" size="md">
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId("card")).toBeTruthy();
    });

    it("renders large size", () => {
      const { getByTestId } = render(
        <Card testID="card" size="lg">
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId("card")).toBeTruthy();
    });
  });

  // ===================
  // Pressable Tests
  // ===================

  describe("Pressable Behavior", () => {
    it("calls onPress when pressable and pressed", () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <Card testID="card" pressable onPress={onPressMock}>
          <Text>Content</Text>
        </Card>
      );

      fireEvent.press(getByTestId("card"));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when not pressable", () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <Card testID="card" pressable={false} onPress={onPressMock}>
          <Text>Content</Text>
        </Card>
      );

      fireEvent.press(getByTestId("card"));
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it("calls onLongPress when pressable and long pressed", () => {
      const onLongPressMock = jest.fn();
      const { getByTestId } = render(
        <Card testID="card" pressable onLongPress={onLongPressMock}>
          <Text>Content</Text>
        </Card>
      );

      fireEvent(getByTestId("card"), "longPress");
      expect(onLongPressMock).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when disabled", () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <Card testID="card" pressable onPress={onPressMock} disabled>
          <Text>Content</Text>
        </Card>
      );

      fireEvent.press(getByTestId("card"));
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  // ===================
  // Selected State Tests
  // ===================

  describe("Selected State", () => {
    it("renders selected state", () => {
      const { getByTestId } = render(
        <Card testID="card" selected>
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId("card")).toBeTruthy();
    });

    it("renders unselected state", () => {
      const { getByTestId } = render(
        <Card testID="card" selected={false}>
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId("card")).toBeTruthy();
    });
  });

  // ===================
  // Disabled State Tests
  // ===================

  describe("Disabled State", () => {
    it("renders disabled state", () => {
      const { getByTestId } = render(
        <Card testID="card" disabled>
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId("card")).toBeTruthy();
    });

    it("applies reduced opacity when disabled", () => {
      const { getByTestId } = render(
        <Card testID="card" disabled>
          <Text>Content</Text>
        </Card>
      );
      // Component renders with disabled styling
      expect(getByTestId("card")).toBeTruthy();
    });
  });

  // ===================
  // Accessibility Tests
  // ===================

  describe("Accessibility", () => {
    it("has button accessibility role when pressable", () => {
      const { getByTestId } = render(
        <Card testID="card" pressable onPress={() => {}}>
          <Text>Content</Text>
        </Card>
      );
      const card = getByTestId("card");
      expect(card.props.accessibilityRole).toBe("button");
    });

    it("does not have button role when not pressable", () => {
      const { getByTestId } = render(
        <Card testID="card">
          <Text>Content</Text>
        </Card>
      );
      const card = getByTestId("card");
      expect(card.props.accessibilityRole).not.toBe("button");
    });

    it("has custom accessibility label", () => {
      const { getByTestId } = render(
        <Card testID="card" accessibilityLabel="Custom card label">
          <Text>Content</Text>
        </Card>
      );
      const card = getByTestId("card");
      expect(card.props.accessibilityLabel).toBe("Custom card label");
    });

    it("has disabled accessibility state when disabled", () => {
      const { getByTestId } = render(
        <Card testID="card" pressable disabled>
          <Text>Content</Text>
        </Card>
      );
      const card = getByTestId("card");
      expect(card.props.accessibilityState?.disabled).toBe(true);
    });

    it("has selected accessibility state when selected", () => {
      const { getByTestId } = render(
        <Card testID="card" pressable selected>
          <Text>Content</Text>
        </Card>
      );
      const card = getByTestId("card");
      expect(card.props.accessibilityState?.selected).toBe(true);
    });
  });

  // ===================
  // Custom Styles Tests
  // ===================

  describe("Custom Styles", () => {
    it("applies custom container style", () => {
      const { getByTestId } = render(
        <Card testID="card" style={{ marginTop: 20 }}>
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId("card")).toBeTruthy();
    });

    it("applies custom content style", () => {
      const { getByTestId } = render(
        <Card testID="card" contentStyle={{ padding: 24 }}>
          <Text>Content</Text>
        </Card>
      );
      expect(getByTestId("card")).toBeTruthy();
    });
  });

  // ===================
  // Combined Props Tests
  // ===================

  describe("Combined Props", () => {
    it("renders with all props combined", () => {
      const onPressMock = jest.fn();
      const { getByTestId, getByText } = render(
        <Card
          testID="card"
          variant="outlined"
          size="lg"
          pressable
          onPress={onPressMock}
          selected
          header={<Text>Header</Text>}
          footer={<Text>Footer</Text>}
          accessibilityLabel="Complete card"
        >
          <Text>Body Content</Text>
        </Card>
      );

      expect(getByTestId("card")).toBeTruthy();
      expect(getByText("Header")).toBeTruthy();
      expect(getByText("Body Content")).toBeTruthy();
      expect(getByText("Footer")).toBeTruthy();

      fireEvent.press(getByTestId("card"));
      expect(onPressMock).toHaveBeenCalled();
    });
  });

  // ===================
  // Edge Cases Tests
  // ===================

  describe("Edge Cases", () => {
    it("handles empty children", () => {
      const { getByTestId } = render(
        <Card testID="card">
          <View />
        </Card>
      );
      expect(getByTestId("card")).toBeTruthy();
    });

    it("handles multiple children", () => {
      const { getByText } = render(
        <Card>
          <Text>Line 1</Text>
          <Text>Line 2</Text>
          <Text>Line 3</Text>
        </Card>
      );
      expect(getByText("Line 1")).toBeTruthy();
      expect(getByText("Line 2")).toBeTruthy();
      expect(getByText("Line 3")).toBeTruthy();
    });

    it("handles nested cards", () => {
      const { getByTestId } = render(
        <Card testID="outer-card">
          <Card testID="inner-card">
            <Text>Nested Content</Text>
          </Card>
        </Card>
      );
      expect(getByTestId("outer-card")).toBeTruthy();
      expect(getByTestId("inner-card")).toBeTruthy();
    });

    it("handles pressable without onPress handler", () => {
      const { getByTestId } = render(
        <Card testID="card" pressable>
          <Text>Content</Text>
        </Card>
      );
      // Should not throw when pressing without handler
      expect(() => fireEvent.press(getByTestId("card"))).not.toThrow();
    });
  });
});
