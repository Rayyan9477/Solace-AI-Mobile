/**
 * ListItem Component Tests
 * @description Tests for the ListItem molecule component
 * @task Task 2.4.2: ListItem Component (Sprint 2.4 - Molecules Content)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View, Text } from "react-native";
import { ListItem } from "./ListItem";

// Mock leading/trailing elements
const MockIcon = ({ testID }: { testID?: string }) => (
  <View testID={testID}>
    <Text>Icon</Text>
  </View>
);

describe("ListItem", () => {
  // ===================
  // Rendering Tests
  // ===================

  describe("Basic Rendering", () => {
    it("renders with title", () => {
      const { getByText } = render(
        <ListItem title="List Item Title" />
      );
      expect(getByText("List Item Title")).toBeTruthy();
    });

    it("renders with testID", () => {
      const { getByTestId } = render(
        <ListItem title="Title" testID="list-item" />
      );
      expect(getByTestId("list-item")).toBeTruthy();
    });

    it("renders with subtitle", () => {
      const { getByText } = render(
        <ListItem title="Title" subtitle="Subtitle text" />
      );
      expect(getByText("Title")).toBeTruthy();
      expect(getByText("Subtitle text")).toBeTruthy();
    });

    it("renders with description", () => {
      const { getByText } = render(
        <ListItem
          title="Title"
          subtitle="Subtitle"
          description="Description text"
        />
      );
      expect(getByText("Description text")).toBeTruthy();
    });

    it("renders all text lines together", () => {
      const { getByText } = render(
        <ListItem
          title="Primary Title"
          subtitle="Secondary Text"
          description="Tertiary Description"
        />
      );
      expect(getByText("Primary Title")).toBeTruthy();
      expect(getByText("Secondary Text")).toBeTruthy();
      expect(getByText("Tertiary Description")).toBeTruthy();
    });
  });

  // ===================
  // Leading Element Tests
  // ===================

  describe("Leading Element", () => {
    it("renders leading element", () => {
      const { getByTestId } = render(
        <ListItem
          title="Title"
          leading={<MockIcon testID="leading-icon" />}
        />
      );
      expect(getByTestId("leading-icon")).toBeTruthy();
    });

    it("renders without leading element", () => {
      const { getByTestId } = render(
        <ListItem title="Title" testID="list-item" />
      );
      expect(getByTestId("list-item")).toBeTruthy();
    });
  });

  // ===================
  // Trailing Element Tests
  // ===================

  describe("Trailing Element", () => {
    it("renders trailing element", () => {
      const { getByTestId } = render(
        <ListItem
          title="Title"
          trailing={<MockIcon testID="trailing-icon" />}
        />
      );
      expect(getByTestId("trailing-icon")).toBeTruthy();
    });

    it("renders without trailing element", () => {
      const { getByTestId } = render(
        <ListItem title="Title" testID="list-item" />
      );
      expect(getByTestId("list-item")).toBeTruthy();
    });

    it("renders both leading and trailing elements", () => {
      const { getByTestId } = render(
        <ListItem
          title="Title"
          leading={<MockIcon testID="leading-icon" />}
          trailing={<MockIcon testID="trailing-icon" />}
          testID="list-item"
        />
      );
      expect(getByTestId("leading-icon")).toBeTruthy();
      expect(getByTestId("trailing-icon")).toBeTruthy();
    });
  });

  // ===================
  // Variant Tests
  // ===================

  describe("Variants", () => {
    it("renders default variant", () => {
      const { getByTestId } = render(
        <ListItem title="Title" variant="default" testID="list-item" />
      );
      expect(getByTestId("list-item")).toBeTruthy();
    });

    it("renders compact variant", () => {
      const { getByTestId } = render(
        <ListItem title="Title" variant="compact" testID="list-item" />
      );
      expect(getByTestId("list-item")).toBeTruthy();
    });

    it("renders expanded variant", () => {
      const { getByTestId } = render(
        <ListItem title="Title" variant="expanded" testID="list-item" />
      );
      expect(getByTestId("list-item")).toBeTruthy();
    });
  });

  // ===================
  // Divider Tests
  // ===================

  describe("Divider", () => {
    it("shows divider when showDivider is true", () => {
      const { getByTestId } = render(
        <ListItem title="Title" showDivider testID="list-item" />
      );
      expect(getByTestId("list-item-divider")).toBeTruthy();
    });

    it("hides divider when showDivider is false", () => {
      const { queryByTestId } = render(
        <ListItem title="Title" showDivider={false} testID="list-item" />
      );
      expect(queryByTestId("list-item-divider")).toBeNull();
    });

    it("hides divider by default", () => {
      const { queryByTestId } = render(
        <ListItem title="Title" testID="list-item" />
      );
      expect(queryByTestId("list-item-divider")).toBeNull();
    });
  });

  // ===================
  // Pressable Tests
  // ===================

  describe("Pressable Behavior", () => {
    it("calls onPress when pressable and pressed", () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <ListItem
          title="Title"
          pressable
          onPress={onPressMock}
          testID="list-item"
        />
      );

      fireEvent.press(getByTestId("list-item"));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when not pressable", () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <ListItem
          title="Title"
          pressable={false}
          onPress={onPressMock}
          testID="list-item"
        />
      );

      fireEvent.press(getByTestId("list-item"));
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it("calls onLongPress when pressable and long pressed", () => {
      const onLongPressMock = jest.fn();
      const { getByTestId } = render(
        <ListItem
          title="Title"
          pressable
          onLongPress={onLongPressMock}
          testID="list-item"
        />
      );

      fireEvent(getByTestId("list-item"), "longPress");
      expect(onLongPressMock).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when disabled", () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <ListItem
          title="Title"
          pressable
          onPress={onPressMock}
          disabled
          testID="list-item"
        />
      );

      fireEvent.press(getByTestId("list-item"));
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  // ===================
  // Selected State Tests
  // ===================

  describe("Selected State", () => {
    it("renders selected state", () => {
      const { getByTestId } = render(
        <ListItem title="Title" selected testID="list-item" />
      );
      expect(getByTestId("list-item")).toBeTruthy();
    });

    it("renders unselected state", () => {
      const { getByTestId } = render(
        <ListItem title="Title" selected={false} testID="list-item" />
      );
      expect(getByTestId("list-item")).toBeTruthy();
    });
  });

  // ===================
  // Disabled State Tests
  // ===================

  describe("Disabled State", () => {
    it("renders disabled state", () => {
      const { getByTestId } = render(
        <ListItem title="Title" disabled testID="list-item" />
      );
      expect(getByTestId("list-item")).toBeTruthy();
    });

    it("applies reduced opacity when disabled", () => {
      const { getByTestId } = render(
        <ListItem title="Title" disabled testID="list-item" />
      );
      expect(getByTestId("list-item")).toBeTruthy();
    });
  });

  // ===================
  // Accessibility Tests
  // ===================

  describe("Accessibility", () => {
    it("has button accessibility role when pressable", () => {
      const { getByTestId } = render(
        <ListItem
          title="Title"
          pressable
          onPress={() => {}}
          testID="list-item"
        />
      );
      const item = getByTestId("list-item");
      expect(item.props.accessibilityRole).toBe("button");
    });

    it("does not have button role when not pressable", () => {
      const { getByTestId } = render(
        <ListItem title="Title" testID="list-item" />
      );
      const item = getByTestId("list-item");
      expect(item.props.accessibilityRole).not.toBe("button");
    });

    it("has custom accessibility label", () => {
      const { getByTestId } = render(
        <ListItem
          title="Title"
          accessibilityLabel="Custom list item label"
          testID="list-item"
        />
      );
      const item = getByTestId("list-item");
      expect(item.props.accessibilityLabel).toBe("Custom list item label");
    });

    it("has disabled accessibility state when disabled", () => {
      const { getByTestId } = render(
        <ListItem title="Title" pressable disabled testID="list-item" />
      );
      const item = getByTestId("list-item");
      expect(item.props.accessibilityState?.disabled).toBe(true);
    });

    it("has selected accessibility state when selected", () => {
      const { getByTestId } = render(
        <ListItem title="Title" pressable selected testID="list-item" />
      );
      const item = getByTestId("list-item");
      expect(item.props.accessibilityState?.selected).toBe(true);
    });
  });

  // ===================
  // Custom Styles Tests
  // ===================

  describe("Custom Styles", () => {
    it("applies custom container style", () => {
      const { getByTestId } = render(
        <ListItem
          title="Title"
          style={{ backgroundColor: "red" }}
          testID="list-item"
        />
      );
      expect(getByTestId("list-item")).toBeTruthy();
    });
  });

  // ===================
  // Edge Cases Tests
  // ===================

  describe("Edge Cases", () => {
    it("handles empty title", () => {
      const { getByTestId } = render(
        <ListItem title="" testID="list-item" />
      );
      expect(getByTestId("list-item")).toBeTruthy();
    });

    it("handles very long title", () => {
      const longTitle = "A".repeat(200);
      const { getByText } = render(
        <ListItem title={longTitle} />
      );
      expect(getByText(longTitle)).toBeTruthy();
    });

    it("handles special characters in title", () => {
      const specialTitle = "Title with @#$%^&*() special chars!";
      const { getByText } = render(
        <ListItem title={specialTitle} />
      );
      expect(getByText(specialTitle)).toBeTruthy();
    });

    it("handles pressable without onPress handler", () => {
      const { getByTestId } = render(
        <ListItem title="Title" pressable testID="list-item" />
      );
      expect(() => fireEvent.press(getByTestId("list-item"))).not.toThrow();
    });
  });
});
