/**
 * Toast Component Tests
 * @description Tests for the Toast molecule component
 * @task Task 2.5.3: Toast Component (Sprint 2.5 - Molecules Overlay)
 */

import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import { Text } from "react-native";
import { Toast } from "./Toast";

// Mock icon component
const MockIcon = ({ testID }: { testID?: string }) => (
  <Text testID={testID}>icon</Text>
);

describe("Toast", () => {
  // Use fake timers for auto-dismiss tests
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ===================
  // Visibility Tests
  // ===================

  describe("Visibility", () => {
    it("renders when visible is true", () => {
      const { getByTestId } = render(
        <Toast visible={true} message="Test message" testID="toast" />
      );
      expect(getByTestId("toast")).toBeTruthy();
    });

    it("does not render when visible is false", () => {
      const { queryByTestId } = render(
        <Toast visible={false} message="Test message" testID="toast" />
      );
      expect(queryByTestId("toast")).toBeNull();
    });
  });

  // ===================
  // Message Tests
  // ===================

  describe("Message", () => {
    it("renders message text", () => {
      const { getByText } = render(
        <Toast visible={true} message="Operation successful" />
      );
      expect(getByText("Operation successful")).toBeTruthy();
    });

    it("renders long message", () => {
      const longMessage = "A".repeat(200);
      const { getByText } = render(
        <Toast visible={true} message={longMessage} />
      );
      expect(getByText(longMessage)).toBeTruthy();
    });
  });

  // ===================
  // Variant Tests
  // ===================

  describe("Variants", () => {
    it("renders info variant", () => {
      const { getByTestId } = render(
        <Toast visible={true} message="Info" variant="info" testID="toast" />
      );
      expect(getByTestId("toast")).toBeTruthy();
    });

    it("renders success variant", () => {
      const { getByTestId } = render(
        <Toast visible={true} message="Success" variant="success" testID="toast" />
      );
      expect(getByTestId("toast")).toBeTruthy();
    });

    it("renders warning variant", () => {
      const { getByTestId } = render(
        <Toast visible={true} message="Warning" variant="warning" testID="toast" />
      );
      expect(getByTestId("toast")).toBeTruthy();
    });

    it("renders error variant", () => {
      const { getByTestId } = render(
        <Toast visible={true} message="Error" variant="error" testID="toast" />
      );
      expect(getByTestId("toast")).toBeTruthy();
    });

    it("renders with default variant (info)", () => {
      const { getByTestId } = render(
        <Toast visible={true} message="Default" testID="toast" />
      );
      expect(getByTestId("toast")).toBeTruthy();
    });
  });

  // ===================
  // Position Tests
  // ===================

  describe("Position", () => {
    it("renders at top position", () => {
      const { getByTestId } = render(
        <Toast visible={true} message="Top" position="top" testID="toast" />
      );
      expect(getByTestId("toast")).toBeTruthy();
    });

    it("renders at bottom position", () => {
      const { getByTestId } = render(
        <Toast visible={true} message="Bottom" position="bottom" testID="toast" />
      );
      expect(getByTestId("toast")).toBeTruthy();
    });

    it("defaults to bottom position", () => {
      const { getByTestId } = render(
        <Toast visible={true} message="Default" testID="toast" />
      );
      expect(getByTestId("toast")).toBeTruthy();
    });
  });

  // ===================
  // Auto-Dismiss Tests
  // ===================

  describe("Auto-Dismiss", () => {
    it("calls onDismiss after duration", () => {
      const onDismissMock = jest.fn();
      render(
        <Toast
          visible={true}
          message="Auto dismiss"
          duration={3000}
          onDismiss={onDismissMock}
        />
      );

      expect(onDismissMock).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(onDismissMock).toHaveBeenCalledTimes(1);
    });

    it("does not auto-dismiss when duration is 0", () => {
      const onDismissMock = jest.fn();
      render(
        <Toast
          visible={true}
          message="No auto dismiss"
          duration={0}
          onDismiss={onDismissMock}
        />
      );

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      expect(onDismissMock).not.toHaveBeenCalled();
    });

    it("clears timer when toast becomes invisible", () => {
      const onDismissMock = jest.fn();
      const { rerender } = render(
        <Toast
          visible={true}
          message="Test"
          duration={3000}
          onDismiss={onDismissMock}
        />
      );

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      rerender(
        <Toast
          visible={false}
          message="Test"
          duration={3000}
          onDismiss={onDismissMock}
        />
      );

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(onDismissMock).not.toHaveBeenCalled();
    });
  });

  // ===================
  // Action Tests
  // ===================

  describe("Action", () => {
    it("renders action button when provided", () => {
      const { getByText } = render(
        <Toast
          visible={true}
          message="Message"
          action={{ label: "Undo", onPress: () => {} }}
        />
      );
      expect(getByText("Undo")).toBeTruthy();
    });

    it("calls action onPress when button is pressed", () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Toast
          visible={true}
          message="Message"
          action={{ label: "Retry", onPress: onPressMock }}
        />
      );

      fireEvent.press(getByText("Retry"));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("renders without action button", () => {
      const { getByTestId, queryByText } = render(
        <Toast visible={true} message="No action" testID="toast" />
      );
      expect(getByTestId("toast")).toBeTruthy();
      expect(queryByText("Undo")).toBeNull();
    });
  });

  // ===================
  // Close Button Tests
  // ===================

  describe("Close Button", () => {
    it("shows close button when showCloseButton is true", () => {
      const { getByTestId } = render(
        <Toast
          visible={true}
          message="Message"
          showCloseButton={true}
          testID="toast"
        />
      );
      expect(getByTestId("toast-close-button")).toBeTruthy();
    });

    it("hides close button when showCloseButton is false", () => {
      const { queryByTestId } = render(
        <Toast
          visible={true}
          message="Message"
          showCloseButton={false}
          testID="toast"
        />
      );
      expect(queryByTestId("toast-close-button")).toBeNull();
    });

    it("calls onDismiss when close button is pressed", () => {
      const onDismissMock = jest.fn();
      const { getByTestId } = render(
        <Toast
          visible={true}
          message="Message"
          showCloseButton={true}
          onDismiss={onDismissMock}
          testID="toast"
        />
      );

      fireEvent.press(getByTestId("toast-close-button"));
      expect(onDismissMock).toHaveBeenCalledTimes(1);
    });
  });

  // ===================
  // Icon Tests
  // ===================

  describe("Icon", () => {
    it("renders custom icon when provided", () => {
      const { getByTestId } = render(
        <Toast
          visible={true}
          message="Message"
          icon={<MockIcon testID="custom-icon" />}
        />
      );
      expect(getByTestId("custom-icon")).toBeTruthy();
    });

    it("renders default icon based on variant", () => {
      const { getByTestId } = render(
        <Toast
          visible={true}
          message="Success"
          variant="success"
          testID="toast"
        />
      );
      expect(getByTestId("toast-icon")).toBeTruthy();
    });
  });

  // ===================
  // Accessibility Tests
  // ===================

  describe("Accessibility", () => {
    it("has custom accessibility label", () => {
      const { getByTestId } = render(
        <Toast
          visible={true}
          message="Message"
          accessibilityLabel="Success notification"
          testID="toast"
        />
      );
      const toast = getByTestId("toast");
      expect(toast.props.accessibilityLabel).toBe("Success notification");
    });

    it("uses message as accessibility label when not provided", () => {
      const { getByTestId } = render(
        <Toast visible={true} message="File saved" testID="toast" />
      );
      const toast = getByTestId("toast");
      expect(toast.props.accessibilityLabel).toBe("File saved");
    });

    it("has alert accessibility role", () => {
      const { getByTestId } = render(
        <Toast visible={true} message="Alert" testID="toast" />
      );
      const toast = getByTestId("toast");
      expect(toast.props.accessibilityRole).toBe("alert");
    });

    it("action button has button accessibility role", () => {
      const { getByTestId } = render(
        <Toast
          visible={true}
          message="Message"
          action={{ label: "Undo", onPress: () => {} }}
          testID="toast"
        />
      );
      const button = getByTestId("toast-action");
      expect(button.props.accessibilityRole).toBe("button");
    });
  });

  // ===================
  // Custom Styles Tests
  // ===================

  describe("Custom Styles", () => {
    it("applies custom container style", () => {
      const { getByTestId } = render(
        <Toast
          visible={true}
          message="Styled"
          style={{ marginHorizontal: 32 }}
          testID="toast"
        />
      );
      expect(getByTestId("toast")).toBeTruthy();
    });
  });

  // ===================
  // Combined Props Tests
  // ===================

  describe("Combined Props", () => {
    it("renders with all props combined", () => {
      const onDismissMock = jest.fn();
      const actionMock = jest.fn();

      const { getByText, getByTestId } = render(
        <Toast
          visible={true}
          message="Changes saved successfully"
          variant="success"
          position="bottom"
          duration={5000}
          onDismiss={onDismissMock}
          action={{ label: "View", onPress: actionMock }}
          showCloseButton={true}
          accessibilityLabel="Save notification"
          testID="toast"
        />
      );

      expect(getByTestId("toast")).toBeTruthy();
      expect(getByText("Changes saved successfully")).toBeTruthy();
      expect(getByText("View")).toBeTruthy();
      expect(getByTestId("toast-close-button")).toBeTruthy();

      // Test action
      fireEvent.press(getByText("View"));
      expect(actionMock).toHaveBeenCalled();

      // Test close
      fireEvent.press(getByTestId("toast-close-button"));
      expect(onDismissMock).toHaveBeenCalled();
    });
  });

  // ===================
  // Edge Cases Tests
  // ===================

  describe("Edge Cases", () => {
    it("handles empty message", () => {
      const { getByTestId } = render(
        <Toast visible={true} message="" testID="toast" />
      );
      expect(getByTestId("toast")).toBeTruthy();
    });

    it("handles rapid visibility changes", () => {
      const onDismissMock = jest.fn();
      const { rerender } = render(
        <Toast
          visible={true}
          message="Test"
          duration={3000}
          onDismiss={onDismissMock}
        />
      );

      // Toggle visibility multiple times
      rerender(
        <Toast
          visible={false}
          message="Test"
          duration={3000}
          onDismiss={onDismissMock}
        />
      );
      rerender(
        <Toast
          visible={true}
          message="Test"
          duration={3000}
          onDismiss={onDismissMock}
        />
      );

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Should still dismiss after final visible=true
      expect(onDismissMock).toHaveBeenCalledTimes(1);
    });

    it("handles missing onDismiss callback", () => {
      const { getByTestId } = render(
        <Toast
          visible={true}
          message="No callback"
          showCloseButton={true}
          testID="toast"
        />
      );

      // Should not throw when pressing close without onDismiss
      expect(() => {
        fireEvent.press(getByTestId("toast-close-button"));
      }).not.toThrow();
    });
  });
});
