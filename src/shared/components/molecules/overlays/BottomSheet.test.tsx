/**
 * BottomSheet Component Tests
 * @description Tests for the BottomSheet molecule component
 * @task Task 2.5.2: BottomSheet Component (Sprint 2.5 - Molecules Overlay)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text, View } from "react-native";
import { BottomSheet } from "./BottomSheet";

// Mock content component
const MockContent = ({ testID }: { testID?: string }) => (
  <View testID={testID}>
    <Text>Sheet content</Text>
  </View>
);

// Mock header right component
const MockHeaderRight = ({ testID }: { testID?: string }) => (
  <View testID={testID}>
    <Text>?</Text>
  </View>
);

describe("BottomSheet", () => {
  // ===================
  // Visibility Tests
  // ===================

  describe("Visibility", () => {
    it("renders when visible is true", () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onDismiss={() => {}} testID="sheet">
          <MockContent />
        </BottomSheet>
      );
      expect(getByTestId("sheet")).toBeTruthy();
    });

    it("does not render when visible is false", () => {
      const { queryByTestId } = render(
        <BottomSheet visible={false} onDismiss={() => {}} testID="sheet">
          <MockContent />
        </BottomSheet>
      );
      expect(queryByTestId("sheet")).toBeNull();
    });
  });

  // ===================
  // Drag Handle Tests
  // ===================

  describe("Drag Handle", () => {
    it("shows drag handle by default", () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onDismiss={() => {}} testID="sheet">
          <MockContent />
        </BottomSheet>
      );
      expect(getByTestId("sheet-drag-handle")).toBeTruthy();
    });

    it("shows drag handle when showDragHandle is true", () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onDismiss={() => {}}
          showDragHandle={true}
          testID="sheet"
        >
          <MockContent />
        </BottomSheet>
      );
      expect(getByTestId("sheet-drag-handle")).toBeTruthy();
    });

    it("hides drag handle when showDragHandle is false", () => {
      const { queryByTestId } = render(
        <BottomSheet
          visible={true}
          onDismiss={() => {}}
          showDragHandle={false}
          testID="sheet"
        >
          <MockContent />
        </BottomSheet>
      );
      expect(queryByTestId("sheet-drag-handle")).toBeNull();
    });
  });

  // ===================
  // Title Tests
  // ===================

  describe("Title", () => {
    it("renders title when provided", () => {
      const { getByText } = render(
        <BottomSheet visible={true} onDismiss={() => {}} title="Filter Options">
          <MockContent />
        </BottomSheet>
      );
      expect(getByText("Filter Options")).toBeTruthy();
    });

    it("renders without title", () => {
      const { getByTestId, queryByText } = render(
        <BottomSheet visible={true} onDismiss={() => {}} testID="sheet">
          <MockContent />
        </BottomSheet>
      );
      expect(getByTestId("sheet")).toBeTruthy();
      expect(queryByText("Filter Options")).toBeNull();
    });
  });

  // ===================
  // Content Tests
  // ===================

  describe("Content", () => {
    it("renders children content", () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onDismiss={() => {}}>
          <MockContent testID="sheet-content" />
        </BottomSheet>
      );
      expect(getByTestId("sheet-content")).toBeTruthy();
    });

    it("renders text content", () => {
      const { getByText } = render(
        <BottomSheet visible={true} onDismiss={() => {}}>
          <Text>Custom sheet content</Text>
        </BottomSheet>
      );
      expect(getByText("Custom sheet content")).toBeTruthy();
    });
  });

  // ===================
  // Header Right Tests
  // ===================

  describe("Header Right", () => {
    it("renders header right element", () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onDismiss={() => {}}
          title="Options"
          headerRight={<MockHeaderRight testID="help-button" />}
          testID="sheet"
        >
          <MockContent />
        </BottomSheet>
      );
      expect(getByTestId("help-button")).toBeTruthy();
    });

    it("renders without header right", () => {
      const { getByTestId, queryByTestId } = render(
        <BottomSheet visible={true} onDismiss={() => {}} testID="sheet">
          <MockContent />
        </BottomSheet>
      );
      expect(getByTestId("sheet")).toBeTruthy();
      expect(queryByTestId("help-button")).toBeNull();
    });
  });

  // ===================
  // Backdrop Tests
  // ===================

  describe("Backdrop", () => {
    it("calls onDismiss when backdrop is pressed and dismissOnBackdropPress is true", () => {
      const onDismissMock = jest.fn();
      const { UNSAFE_getByProps } = render(
        <BottomSheet
          visible={true}
          onDismiss={onDismissMock}
          dismissOnBackdropPress={true}
          testID="sheet"
        >
          <MockContent />
        </BottomSheet>
      );

      const backdrop = UNSAFE_getByProps({ testID: "sheet-backdrop" });
      fireEvent.press(backdrop);
      expect(onDismissMock).toHaveBeenCalledTimes(1);
    });

    it("does not call onDismiss when backdrop is pressed and dismissOnBackdropPress is false", () => {
      const onDismissMock = jest.fn();
      const { UNSAFE_getByProps } = render(
        <BottomSheet
          visible={true}
          onDismiss={onDismissMock}
          dismissOnBackdropPress={false}
          testID="sheet"
        >
          <MockContent />
        </BottomSheet>
      );

      const backdrop = UNSAFE_getByProps({ testID: "sheet-backdrop" });
      fireEvent.press(backdrop);
      expect(onDismissMock).not.toHaveBeenCalled();
    });
  });

  // ===================
  // Height Tests
  // ===================

  describe("Height", () => {
    it("renders with default height", () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onDismiss={() => {}} testID="sheet">
          <MockContent />
        </BottomSheet>
      );
      expect(getByTestId("sheet")).toBeTruthy();
    });

    it("renders with custom percentage height", () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onDismiss={() => {}}
          height="75%"
          testID="sheet"
        >
          <MockContent />
        </BottomSheet>
      );
      expect(getByTestId("sheet")).toBeTruthy();
    });

    it("renders with custom pixel height", () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onDismiss={() => {}}
          height={400}
          testID="sheet"
        >
          <MockContent />
        </BottomSheet>
      );
      expect(getByTestId("sheet")).toBeTruthy();
    });
  });

  // ===================
  // Accessibility Tests
  // ===================

  describe("Accessibility", () => {
    it("has custom accessibility label", () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onDismiss={() => {}}
          accessibilityLabel="Filter bottom sheet"
          testID="sheet"
        >
          <MockContent />
        </BottomSheet>
      );
      const sheet = getByTestId("sheet-container");
      expect(sheet.props.accessibilityLabel).toBe("Filter bottom sheet");
    });

    it("uses title as accessibility label when not provided", () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onDismiss={() => {}}
          title="Filter Options"
          testID="sheet"
        >
          <MockContent />
        </BottomSheet>
      );
      const sheet = getByTestId("sheet-container");
      expect(sheet.props.accessibilityLabel).toBe("Filter Options");
    });

    it("has accessible modal semantics", () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onDismiss={() => {}} testID="sheet">
          <MockContent />
        </BottomSheet>
      );
      const sheet = getByTestId("sheet-container");
      expect(sheet.props.accessibilityViewIsModal).toBe(true);
    });
  });

  // ===================
  // Custom Styles Tests
  // ===================

  describe("Custom Styles", () => {
    it("applies custom container style", () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onDismiss={() => {}}
          style={{ backgroundColor: "red" }}
          testID="sheet"
        >
          <MockContent />
        </BottomSheet>
      );
      expect(getByTestId("sheet")).toBeTruthy();
    });

    it("applies custom content style", () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onDismiss={() => {}}
          contentStyle={{ padding: 32 }}
          testID="sheet"
        >
          <MockContent />
        </BottomSheet>
      );
      expect(getByTestId("sheet")).toBeTruthy();
    });
  });

  // ===================
  // Combined Props Tests
  // ===================

  describe("Combined Props", () => {
    it("renders with all props combined", () => {
      const onDismissMock = jest.fn();

      const { getByText, getByTestId } = render(
        <BottomSheet
          visible={true}
          onDismiss={onDismissMock}
          title="Filter Freud Score"
          showDragHandle={true}
          height="60%"
          dismissOnBackdropPress={true}
          headerRight={<MockHeaderRight testID="help-btn" />}
          accessibilityLabel="Score filter sheet"
          testID="sheet"
        >
          <Text>Filter content goes here</Text>
        </BottomSheet>
      );

      expect(getByTestId("sheet")).toBeTruthy();
      expect(getByTestId("sheet-drag-handle")).toBeTruthy();
      expect(getByText("Filter Freud Score")).toBeTruthy();
      expect(getByText("Filter content goes here")).toBeTruthy();
      expect(getByTestId("help-btn")).toBeTruthy();
    });
  });

  // ===================
  // Edge Cases Tests
  // ===================

  describe("Edge Cases", () => {
    it("handles empty title", () => {
      const { getByTestId } = render(
        <BottomSheet visible={true} onDismiss={() => {}} title="" testID="sheet">
          <MockContent />
        </BottomSheet>
      );
      expect(getByTestId("sheet")).toBeTruthy();
    });

    it("handles very long title", () => {
      const longTitle = "A".repeat(100);
      const { getByText } = render(
        <BottomSheet visible={true} onDismiss={() => {}} title={longTitle}>
          <MockContent />
        </BottomSheet>
      );
      expect(getByText(longTitle)).toBeTruthy();
    });

    it("handles no children", () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onDismiss={() => {}}
          title="Empty Sheet"
          testID="sheet"
        />
      );
      expect(getByTestId("sheet")).toBeTruthy();
    });
  });
});
