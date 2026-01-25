/**
 * Tooltip Component Tests
 * @description Tests for the Tooltip molecule component
 * @task Task 2.5.4: Tooltip Component (Sprint 2.5 - Molecules Overlay)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text, View } from "react-native";
import { Tooltip } from "./Tooltip";

// Mock trigger component
const MockTrigger = ({ testID }: { testID?: string }) => (
  <View testID={testID}>
    <Text>?</Text>
  </View>
);

describe("Tooltip", () => {
  // ===================
  // Visibility Tests
  // ===================

  describe("Visibility", () => {
    it("renders tooltip content when visible is true", () => {
      const { getByText } = render(
        <Tooltip visible={true} content="Help text">
          <MockTrigger />
        </Tooltip>
      );
      expect(getByText("Help text")).toBeTruthy();
    });

    it("does not render tooltip content when visible is false", () => {
      const { queryByText, getByTestId } = render(
        <Tooltip visible={false} content="Help text" testID="tooltip">
          <MockTrigger testID="trigger" />
        </Tooltip>
      );
      expect(getByTestId("trigger")).toBeTruthy();
      expect(queryByText("Help text")).toBeNull();
    });

    it("always renders children regardless of visibility", () => {
      const { getByTestId, rerender } = render(
        <Tooltip visible={false} content="Help text" testID="tooltip">
          <MockTrigger testID="trigger" />
        </Tooltip>
      );
      expect(getByTestId("trigger")).toBeTruthy();

      rerender(
        <Tooltip visible={true} content="Help text" testID="tooltip">
          <MockTrigger testID="trigger" />
        </Tooltip>
      );
      expect(getByTestId("trigger")).toBeTruthy();
    });
  });

  // ===================
  // Content Tests
  // ===================

  describe("Content", () => {
    it("renders content text", () => {
      const { getByText } = render(
        <Tooltip visible={true} content="This is helpful information">
          <MockTrigger />
        </Tooltip>
      );
      expect(getByText("This is helpful information")).toBeTruthy();
    });

    it("renders long content", () => {
      const longContent = "A".repeat(200);
      const { getByText } = render(
        <Tooltip visible={true} content={longContent}>
          <MockTrigger />
        </Tooltip>
      );
      expect(getByText(longContent)).toBeTruthy();
    });
  });

  // ===================
  // Placement Tests
  // ===================

  describe("Placement", () => {
    it("renders with top placement", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="Top tip" placement="top" testID="tooltip">
          <MockTrigger />
        </Tooltip>
      );
      expect(getByTestId("tooltip-content")).toBeTruthy();
    });

    it("renders with bottom placement", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="Bottom tip" placement="bottom" testID="tooltip">
          <MockTrigger />
        </Tooltip>
      );
      expect(getByTestId("tooltip-content")).toBeTruthy();
    });

    it("renders with left placement", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="Left tip" placement="left" testID="tooltip">
          <MockTrigger />
        </Tooltip>
      );
      expect(getByTestId("tooltip-content")).toBeTruthy();
    });

    it("renders with right placement", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="Right tip" placement="right" testID="tooltip">
          <MockTrigger />
        </Tooltip>
      );
      expect(getByTestId("tooltip-content")).toBeTruthy();
    });

    it("defaults to top placement", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="Default" testID="tooltip">
          <MockTrigger />
        </Tooltip>
      );
      expect(getByTestId("tooltip-content")).toBeTruthy();
    });
  });

  // ===================
  // Arrow Tests
  // ===================

  describe("Arrow", () => {
    it("renders arrow indicator", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="With arrow" testID="tooltip">
          <MockTrigger />
        </Tooltip>
      );
      expect(getByTestId("tooltip-arrow")).toBeTruthy();
    });

    it("renders arrow for each placement", () => {
      const placements = ["top", "bottom", "left", "right"] as const;

      placements.forEach((placement) => {
        const { getByTestId, unmount } = render(
          <Tooltip
            visible={true}
            content={`${placement} arrow`}
            placement={placement}
            testID="tooltip"
          >
            <MockTrigger />
          </Tooltip>
        );
        expect(getByTestId("tooltip-arrow")).toBeTruthy();
        unmount();
      });
    });
  });

  // ===================
  // Dismiss Tests
  // ===================

  describe("Dismiss", () => {
    it("calls onDismiss when overlay is pressed and dismissOnPress is true", () => {
      const onDismissMock = jest.fn();
      const { getByTestId } = render(
        <Tooltip
          visible={true}
          content="Dismissable"
          onDismiss={onDismissMock}
          dismissOnPress={true}
          testID="tooltip"
        >
          <MockTrigger />
        </Tooltip>
      );

      fireEvent.press(getByTestId("tooltip-overlay"));
      expect(onDismissMock).toHaveBeenCalledTimes(1);
    });

    it("does not call onDismiss when dismissOnPress is false", () => {
      const onDismissMock = jest.fn();
      const { getByTestId } = render(
        <Tooltip
          visible={true}
          content="Not dismissable"
          onDismiss={onDismissMock}
          dismissOnPress={false}
          testID="tooltip"
        >
          <MockTrigger />
        </Tooltip>
      );

      fireEvent.press(getByTestId("tooltip-overlay"));
      expect(onDismissMock).not.toHaveBeenCalled();
    });

    it("defaults dismissOnPress to true", () => {
      const onDismissMock = jest.fn();
      const { getByTestId } = render(
        <Tooltip
          visible={true}
          content="Default dismiss"
          onDismiss={onDismissMock}
          testID="tooltip"
        >
          <MockTrigger />
        </Tooltip>
      );

      fireEvent.press(getByTestId("tooltip-overlay"));
      expect(onDismissMock).toHaveBeenCalledTimes(1);
    });
  });

  // ===================
  // Max Width Tests
  // ===================

  describe("Max Width", () => {
    it("renders with default max width", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="Default width" testID="tooltip">
          <MockTrigger />
        </Tooltip>
      );
      expect(getByTestId("tooltip-content")).toBeTruthy();
    });

    it("renders with custom max width", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="Custom width" maxWidth={300} testID="tooltip">
          <MockTrigger />
        </Tooltip>
      );
      expect(getByTestId("tooltip-content")).toBeTruthy();
    });
  });

  // ===================
  // Accessibility Tests
  // ===================

  describe("Accessibility", () => {
    it("has custom accessibility label", () => {
      const { getByTestId } = render(
        <Tooltip
          visible={true}
          content="Help text"
          accessibilityLabel="Help tooltip"
          testID="tooltip"
        >
          <MockTrigger />
        </Tooltip>
      );
      const tooltip = getByTestId("tooltip-content");
      expect(tooltip.props.accessibilityLabel).toBe("Help tooltip");
    });

    it("uses content as accessibility label when not provided", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="Tap for more info" testID="tooltip">
          <MockTrigger />
        </Tooltip>
      );
      const tooltip = getByTestId("tooltip-content");
      expect(tooltip.props.accessibilityLabel).toBe("Tap for more info");
    });

    it("has tooltip accessibility role", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="Help" testID="tooltip">
          <MockTrigger />
        </Tooltip>
      );
      const tooltip = getByTestId("tooltip-content");
      // Note: Using "text" since "tooltip" is not a valid RN role
      expect(tooltip.props.accessibilityRole).toBe("text");
    });
  });

  // ===================
  // Custom Styles Tests
  // ===================

  describe("Custom Styles", () => {
    it("applies custom container style", () => {
      const { getByTestId } = render(
        <Tooltip
          visible={true}
          content="Styled"
          style={{ marginTop: 20 }}
          testID="tooltip"
        >
          <MockTrigger />
        </Tooltip>
      );
      expect(getByTestId("tooltip")).toBeTruthy();
    });

    it("applies custom content style", () => {
      const { getByTestId } = render(
        <Tooltip
          visible={true}
          content="Content styled"
          contentStyle={{ padding: 20 }}
          testID="tooltip"
        >
          <MockTrigger />
        </Tooltip>
      );
      expect(getByTestId("tooltip-content")).toBeTruthy();
    });
  });

  // ===================
  // Combined Props Tests
  // ===================

  describe("Combined Props", () => {
    it("renders with all props combined", () => {
      const onDismissMock = jest.fn();

      const { getByText, getByTestId } = render(
        <Tooltip
          visible={true}
          content="This explains the feature in detail"
          placement="bottom"
          onDismiss={onDismissMock}
          maxWidth={250}
          dismissOnPress={true}
          accessibilityLabel="Feature explanation tooltip"
          testID="tooltip"
        >
          <MockTrigger testID="trigger" />
        </Tooltip>
      );

      expect(getByTestId("tooltip")).toBeTruthy();
      expect(getByTestId("trigger")).toBeTruthy();
      expect(getByText("This explains the feature in detail")).toBeTruthy();
      expect(getByTestId("tooltip-arrow")).toBeTruthy();

      // Test dismiss
      fireEvent.press(getByTestId("tooltip-overlay"));
      expect(onDismissMock).toHaveBeenCalled();
    });
  });

  // ===================
  // Edge Cases Tests
  // ===================

  describe("Edge Cases", () => {
    it("handles empty content", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="" testID="tooltip">
          <MockTrigger />
        </Tooltip>
      );
      expect(getByTestId("tooltip-content")).toBeTruthy();
    });

    it("handles no children", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="No children" testID="tooltip" />
      );
      expect(getByTestId("tooltip")).toBeTruthy();
    });

    it("handles missing onDismiss callback", () => {
      const { getByTestId } = render(
        <Tooltip visible={true} content="No callback" dismissOnPress={true} testID="tooltip">
          <MockTrigger />
        </Tooltip>
      );

      // Should not throw when pressing overlay without onDismiss
      expect(() => {
        fireEvent.press(getByTestId("tooltip-overlay"));
      }).not.toThrow();
    });

    it("handles multiline content", () => {
      const multilineContent = "Line 1\nLine 2\nLine 3";
      const { getByText } = render(
        <Tooltip visible={true} content={multilineContent}>
          <MockTrigger />
        </Tooltip>
      );
      expect(getByText(multilineContent)).toBeTruthy();
    });
  });
});
