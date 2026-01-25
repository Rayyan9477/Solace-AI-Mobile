/**
 * EmptyState Component Tests
 * @description Tests for the EmptyState molecule component
 * @task Task 2.4.4: EmptyState Component (Sprint 2.4 - Molecules Content)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View, Text } from "react-native";
import { EmptyState } from "./EmptyState";

// Mock icon component
const MockIcon = ({ testID }: { testID?: string }) => (
  <View testID={testID}>
    <Text>Icon</Text>
  </View>
);

// Mock illustration component
const MockIllustration = ({ testID }: { testID?: string }) => (
  <View testID={testID}>
    <Text>Illustration</Text>
  </View>
);

describe("EmptyState", () => {
  // ===================
  // Rendering Tests
  // ===================

  describe("Basic Rendering", () => {
    it("renders with title", () => {
      const { getByText } = render(
        <EmptyState title="No items found" />
      );
      expect(getByText("No items found")).toBeTruthy();
    });

    it("renders with testID", () => {
      const { getByTestId } = render(
        <EmptyState title="No items" testID="empty-state" />
      );
      expect(getByTestId("empty-state")).toBeTruthy();
    });

    it("renders with description", () => {
      const { getByText } = render(
        <EmptyState
          title="No items found"
          description="Try adjusting your search or filters"
        />
      );
      expect(getByText("Try adjusting your search or filters")).toBeTruthy();
    });

    it("renders title and description together", () => {
      const { getByText } = render(
        <EmptyState
          title="No results"
          description="We couldn't find anything matching your search"
        />
      );
      expect(getByText("No results")).toBeTruthy();
      expect(getByText("We couldn't find anything matching your search")).toBeTruthy();
    });
  });

  // ===================
  // Icon Tests
  // ===================

  describe("Icon", () => {
    it("renders icon element", () => {
      const { getByTestId } = render(
        <EmptyState
          title="No items"
          icon={<MockIcon testID="empty-icon" />}
        />
      );
      expect(getByTestId("empty-icon")).toBeTruthy();
    });

    it("renders without icon", () => {
      const { getByTestId } = render(
        <EmptyState title="No items" testID="empty-state" />
      );
      expect(getByTestId("empty-state")).toBeTruthy();
    });
  });

  // ===================
  // Illustration Tests
  // ===================

  describe("Illustration", () => {
    it("renders illustration element", () => {
      const { getByTestId } = render(
        <EmptyState
          title="No items"
          illustration={<MockIllustration testID="empty-illustration" />}
        />
      );
      expect(getByTestId("empty-illustration")).toBeTruthy();
    });

    it("renders illustration instead of icon when both provided", () => {
      const { getByTestId, queryByTestId } = render(
        <EmptyState
          title="No items"
          icon={<MockIcon testID="empty-icon" />}
          illustration={<MockIllustration testID="empty-illustration" />}
        />
      );
      expect(getByTestId("empty-illustration")).toBeTruthy();
      expect(queryByTestId("empty-icon")).toBeNull();
    });
  });

  // ===================
  // Action Button Tests
  // ===================

  describe("Action Button", () => {
    it("renders action button", () => {
      const { getByText } = render(
        <EmptyState
          title="No items"
          action={{
            label: "Add Item",
            onPress: () => {},
          }}
        />
      );
      expect(getByText("Add Item")).toBeTruthy();
    });

    it("calls action onPress when pressed", () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <EmptyState
          title="No items"
          action={{
            label: "Add Item",
            onPress: onPressMock,
          }}
        />
      );

      fireEvent.press(getByText("Add Item"));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("renders without action button", () => {
      const { getByTestId, queryByText } = render(
        <EmptyState title="No items" testID="empty-state" />
      );
      expect(getByTestId("empty-state")).toBeTruthy();
      expect(queryByText("Add Item")).toBeNull();
    });
  });

  // ===================
  // Secondary Action Tests
  // ===================

  describe("Secondary Action", () => {
    it("renders secondary action button", () => {
      const { getByText } = render(
        <EmptyState
          title="No items"
          action={{
            label: "Add Item",
            onPress: () => {},
          }}
          secondaryAction={{
            label: "Learn More",
            onPress: () => {},
          }}
        />
      );
      expect(getByText("Learn More")).toBeTruthy();
    });

    it("calls secondary action onPress when pressed", () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <EmptyState
          title="No items"
          secondaryAction={{
            label: "Learn More",
            onPress: onPressMock,
          }}
        />
      );

      fireEvent.press(getByText("Learn More"));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("renders both action buttons", () => {
      const { getByText } = render(
        <EmptyState
          title="No items"
          action={{
            label: "Primary",
            onPress: () => {},
          }}
          secondaryAction={{
            label: "Secondary",
            onPress: () => {},
          }}
        />
      );
      expect(getByText("Primary")).toBeTruthy();
      expect(getByText("Secondary")).toBeTruthy();
    });
  });

  // ===================
  // Variant Tests
  // ===================

  describe("Variants", () => {
    it("renders default variant", () => {
      const { getByTestId } = render(
        <EmptyState
          title="No items"
          variant="default"
          testID="empty-state"
        />
      );
      expect(getByTestId("empty-state")).toBeTruthy();
    });

    it("renders compact variant", () => {
      const { getByTestId } = render(
        <EmptyState
          title="No items"
          variant="compact"
          testID="empty-state"
        />
      );
      expect(getByTestId("empty-state")).toBeTruthy();
    });

    it("renders card variant", () => {
      const { getByTestId } = render(
        <EmptyState
          title="No items"
          variant="card"
          testID="empty-state"
        />
      );
      expect(getByTestId("empty-state")).toBeTruthy();
    });
  });

  // ===================
  // Accessibility Tests
  // ===================

  describe("Accessibility", () => {
    it("has custom accessibility label", () => {
      const { getByTestId } = render(
        <EmptyState
          title="No items"
          accessibilityLabel="Empty list state"
          testID="empty-state"
        />
      );
      const emptyState = getByTestId("empty-state");
      expect(emptyState.props.accessibilityLabel).toBe("Empty list state");
    });

    it("uses title as accessibility label when not provided", () => {
      const { getByTestId } = render(
        <EmptyState title="No items found" testID="empty-state" />
      );
      const emptyState = getByTestId("empty-state");
      expect(emptyState.props.accessibilityLabel).toBe("No items found");
    });

    it("action button has accessibility role button", () => {
      const { getByTestId } = render(
        <EmptyState
          title="No items"
          action={{
            label: "Add Item",
            onPress: () => {},
          }}
          testID="empty-state"
        />
      );
      const actionButton = getByTestId("empty-state-action");
      expect(actionButton.props.accessibilityRole).toBe("button");
    });
  });

  // ===================
  // Custom Styles Tests
  // ===================

  describe("Custom Styles", () => {
    it("applies custom container style", () => {
      const { getByTestId } = render(
        <EmptyState
          title="No items"
          style={{ padding: 32 }}
          testID="empty-state"
        />
      );
      expect(getByTestId("empty-state")).toBeTruthy();
    });
  });

  // ===================
  // Combined Props Tests
  // ===================

  describe("Combined Props", () => {
    it("renders with all props combined", () => {
      const actionMock = jest.fn();
      const secondaryMock = jest.fn();

      const { getByText, getByTestId } = render(
        <EmptyState
          title="No results found"
          description="Try adjusting your search criteria"
          icon={<MockIcon testID="empty-icon" />}
          action={{
            label: "Clear Filters",
            onPress: actionMock,
          }}
          secondaryAction={{
            label: "Help",
            onPress: secondaryMock,
          }}
          variant="default"
          testID="empty-state"
          accessibilityLabel="Search results empty"
        />
      );

      expect(getByTestId("empty-state")).toBeTruthy();
      expect(getByTestId("empty-icon")).toBeTruthy();
      expect(getByText("No results found")).toBeTruthy();
      expect(getByText("Try adjusting your search criteria")).toBeTruthy();
      expect(getByText("Clear Filters")).toBeTruthy();
      expect(getByText("Help")).toBeTruthy();

      fireEvent.press(getByText("Clear Filters"));
      expect(actionMock).toHaveBeenCalled();

      fireEvent.press(getByText("Help"));
      expect(secondaryMock).toHaveBeenCalled();
    });
  });

  // ===================
  // Edge Cases Tests
  // ===================

  describe("Edge Cases", () => {
    it("handles empty title", () => {
      const { getByTestId } = render(
        <EmptyState title="" testID="empty-state" />
      );
      expect(getByTestId("empty-state")).toBeTruthy();
    });

    it("handles very long title", () => {
      const longTitle = "A".repeat(200);
      const { getByText } = render(
        <EmptyState title={longTitle} />
      );
      expect(getByText(longTitle)).toBeTruthy();
    });

    it("handles very long description", () => {
      const longDescription = "B".repeat(300);
      const { getByText } = render(
        <EmptyState title="Title" description={longDescription} />
      );
      expect(getByText(longDescription)).toBeTruthy();
    });

    it("handles special characters in title", () => {
      const specialTitle = "No items @#$%^&*() found!";
      const { getByText } = render(
        <EmptyState title={specialTitle} />
      );
      expect(getByText(specialTitle)).toBeTruthy();
    });
  });
});
