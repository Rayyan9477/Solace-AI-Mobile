/**
 * Modal Component Tests
 * @description Tests for the Modal molecule component
 * @task Task 2.5.1: Modal Component (Sprint 2.5 - Molecules Overlay)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text, View } from "react-native";
import { Modal } from "./Modal";

// Mock content component
const MockContent = ({ testID }: { testID?: string }) => (
  <View testID={testID}>
    <Text>Modal content</Text>
  </View>
);

describe("Modal", () => {
  // ===================
  // Visibility Tests
  // ===================

  describe("Visibility", () => {
    it("renders when visible is true", () => {
      const { getByTestId } = render(
        <Modal visible={true} onDismiss={() => {}} testID="modal">
          <MockContent />
        </Modal>
      );
      expect(getByTestId("modal")).toBeTruthy();
    });

    it("does not render when visible is false", () => {
      const { queryByTestId } = render(
        <Modal visible={false} onDismiss={() => {}} testID="modal">
          <MockContent />
        </Modal>
      );
      expect(queryByTestId("modal")).toBeNull();
    });
  });

  // ===================
  // Title Tests
  // ===================

  describe("Title", () => {
    it("renders title when provided", () => {
      const { getByText } = render(
        <Modal visible={true} onDismiss={() => {}} title="Test Modal">
          <MockContent />
        </Modal>
      );
      expect(getByText("Test Modal")).toBeTruthy();
    });

    it("renders without title", () => {
      const { getByTestId, queryByText } = render(
        <Modal visible={true} onDismiss={() => {}} testID="modal">
          <MockContent />
        </Modal>
      );
      expect(getByTestId("modal")).toBeTruthy();
      expect(queryByText("Test Modal")).toBeNull();
    });
  });

  // ===================
  // Content Tests
  // ===================

  describe("Content", () => {
    it("renders children content", () => {
      const { getByTestId } = render(
        <Modal visible={true} onDismiss={() => {}}>
          <MockContent testID="modal-content" />
        </Modal>
      );
      expect(getByTestId("modal-content")).toBeTruthy();
    });

    it("renders text content", () => {
      const { getByText } = render(
        <Modal visible={true} onDismiss={() => {}}>
          <Text>Custom text content</Text>
        </Modal>
      );
      expect(getByText("Custom text content")).toBeTruthy();
    });
  });

  // ===================
  // Close Button Tests
  // ===================

  describe("Close Button", () => {
    it("shows close button when showCloseButton is true", () => {
      const { getByTestId } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          showCloseButton={true}
          testID="modal"
        >
          <MockContent />
        </Modal>
      );
      expect(getByTestId("modal-close-button")).toBeTruthy();
    });

    it("hides close button when showCloseButton is false", () => {
      const { queryByTestId } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          showCloseButton={false}
          testID="modal"
        >
          <MockContent />
        </Modal>
      );
      expect(queryByTestId("modal-close-button")).toBeNull();
    });

    it("calls onDismiss when close button is pressed", () => {
      const onDismissMock = jest.fn();
      const { getByTestId } = render(
        <Modal
          visible={true}
          onDismiss={onDismissMock}
          showCloseButton={true}
          testID="modal"
        >
          <MockContent />
        </Modal>
      );

      fireEvent.press(getByTestId("modal-close-button"));
      expect(onDismissMock).toHaveBeenCalledTimes(1);
    });
  });

  // ===================
  // Backdrop Tests
  // ===================

  describe("Backdrop", () => {
    it("calls onDismiss when backdrop is pressed and dismissOnBackdropPress is true", () => {
      const onDismissMock = jest.fn();
      const { UNSAFE_getByProps } = render(
        <Modal
          visible={true}
          onDismiss={onDismissMock}
          dismissOnBackdropPress={true}
          testID="modal"
        >
          <MockContent />
        </Modal>
      );

      // Find backdrop by its testID prop
      const backdrop = UNSAFE_getByProps({ testID: "modal-backdrop" });
      fireEvent.press(backdrop);
      expect(onDismissMock).toHaveBeenCalledTimes(1);
    });

    it("does not call onDismiss when backdrop is pressed and dismissOnBackdropPress is false", () => {
      const onDismissMock = jest.fn();
      const { UNSAFE_getByProps } = render(
        <Modal
          visible={true}
          onDismiss={onDismissMock}
          dismissOnBackdropPress={false}
          testID="modal"
        >
          <MockContent />
        </Modal>
      );

      // Find backdrop by its testID prop
      const backdrop = UNSAFE_getByProps({ testID: "modal-backdrop" });
      fireEvent.press(backdrop);
      expect(onDismissMock).not.toHaveBeenCalled();
    });
  });

  // ===================
  // Actions Tests
  // ===================

  describe("Actions", () => {
    it("renders primary action button", () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          actions={[{ label: "Confirm", onPress: onPressMock, variant: "primary" }]}
        >
          <MockContent />
        </Modal>
      );
      expect(getByText("Confirm")).toBeTruthy();
    });

    it("renders secondary action button", () => {
      const { getByText } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          actions={[{ label: "Cancel", onPress: () => {}, variant: "secondary" }]}
        >
          <MockContent />
        </Modal>
      );
      expect(getByText("Cancel")).toBeTruthy();
    });

    it("renders multiple action buttons", () => {
      const { getByText } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          actions={[
            { label: "Cancel", onPress: () => {}, variant: "secondary" },
            { label: "Confirm", onPress: () => {}, variant: "primary" },
          ]}
        >
          <MockContent />
        </Modal>
      );
      expect(getByText("Cancel")).toBeTruthy();
      expect(getByText("Confirm")).toBeTruthy();
    });

    it("calls action onPress when button is pressed", () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          actions={[{ label: "Confirm", onPress: onPressMock }]}
        >
          <MockContent />
        </Modal>
      );

      fireEvent.press(getByText("Confirm"));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("disables action button when disabled is true", () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          actions={[{ label: "Confirm", onPress: onPressMock, disabled: true }]}
          testID="modal"
        >
          <MockContent />
        </Modal>
      );

      const button = getByTestId("modal-action-0");
      expect(button.props.accessibilityState?.disabled).toBe(true);
    });
  });

  // ===================
  // Size Tests
  // ===================

  describe("Sizes", () => {
    it("renders small size variant", () => {
      const { getByTestId } = render(
        <Modal visible={true} onDismiss={() => {}} size="sm" testID="modal">
          <MockContent />
        </Modal>
      );
      expect(getByTestId("modal")).toBeTruthy();
    });

    it("renders medium size variant", () => {
      const { getByTestId } = render(
        <Modal visible={true} onDismiss={() => {}} size="md" testID="modal">
          <MockContent />
        </Modal>
      );
      expect(getByTestId("modal")).toBeTruthy();
    });

    it("renders large size variant", () => {
      const { getByTestId } = render(
        <Modal visible={true} onDismiss={() => {}} size="lg" testID="modal">
          <MockContent />
        </Modal>
      );
      expect(getByTestId("modal")).toBeTruthy();
    });
  });

  // ===================
  // Accessibility Tests
  // ===================

  describe("Accessibility", () => {
    it("has accessible modal semantics by default", () => {
      const { getByTestId } = render(
        <Modal visible={true} onDismiss={() => {}} testID="modal">
          <MockContent />
        </Modal>
      );
      const modal = getByTestId("modal-container");
      expect(modal.props.accessibilityViewIsModal).toBe(true);
    });

    it("supports isAlert prop for important modals", () => {
      const { getByTestId } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          isAlert={true}
          testID="modal"
        >
          <MockContent />
        </Modal>
      );
      const modal = getByTestId("modal-container");
      expect(modal.props.accessibilityViewIsModal).toBe(true);
    });

    it("has custom accessibility label", () => {
      const { getByTestId } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          accessibilityLabel="Confirmation dialog"
          testID="modal"
        >
          <MockContent />
        </Modal>
      );
      const modal = getByTestId("modal-container");
      expect(modal.props.accessibilityLabel).toBe("Confirmation dialog");
    });

    it("uses title as accessibility label when not provided", () => {
      const { getByTestId } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          title="Delete Item"
          testID="modal"
        >
          <MockContent />
        </Modal>
      );
      const modal = getByTestId("modal-container");
      expect(modal.props.accessibilityLabel).toBe("Delete Item");
    });

    it("close button has accessibility role button", () => {
      const { getByTestId } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          showCloseButton={true}
          testID="modal"
        >
          <MockContent />
        </Modal>
      );
      const closeButton = getByTestId("modal-close-button");
      expect(closeButton.props.accessibilityRole).toBe("button");
    });

    it("action buttons have accessibility role button", () => {
      const { getByTestId } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          actions={[{ label: "Confirm", onPress: () => {} }]}
          testID="modal"
        >
          <MockContent />
        </Modal>
      );
      const button = getByTestId("modal-action-0");
      expect(button.props.accessibilityRole).toBe("button");
    });
  });

  // ===================
  // Custom Styles Tests
  // ===================

  describe("Custom Styles", () => {
    it("applies custom container style", () => {
      const { getByTestId } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          style={{ backgroundColor: "red" }}
          testID="modal"
        >
          <MockContent />
        </Modal>
      );
      expect(getByTestId("modal")).toBeTruthy();
    });

    it("applies custom content style", () => {
      const { getByTestId } = render(
        <Modal
          visible={true}
          onDismiss={() => {}}
          contentStyle={{ padding: 32 }}
          testID="modal"
        >
          <MockContent />
        </Modal>
      );
      expect(getByTestId("modal")).toBeTruthy();
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
        <Modal
          visible={true}
          onDismiss={onDismissMock}
          title="Confirm Action"
          showCloseButton={true}
          size="md"
          dismissOnBackdropPress={true}
          actions={[
            { label: "Cancel", onPress: () => {}, variant: "secondary" },
            { label: "Confirm", onPress: actionMock, variant: "primary" },
          ]}
          accessibilityLabel="Confirmation modal"
          testID="modal"
        >
          <Text>Are you sure you want to proceed?</Text>
        </Modal>
      );

      expect(getByTestId("modal")).toBeTruthy();
      expect(getByText("Confirm Action")).toBeTruthy();
      expect(getByText("Are you sure you want to proceed?")).toBeTruthy();
      expect(getByText("Cancel")).toBeTruthy();
      expect(getByText("Confirm")).toBeTruthy();
      expect(getByTestId("modal-close-button")).toBeTruthy();

      // Test interactions
      fireEvent.press(getByText("Confirm"));
      expect(actionMock).toHaveBeenCalled();

      fireEvent.press(getByTestId("modal-close-button"));
      expect(onDismissMock).toHaveBeenCalled();
    });
  });

  // ===================
  // Edge Cases Tests
  // ===================

  describe("Edge Cases", () => {
    it("handles empty title", () => {
      const { getByTestId } = render(
        <Modal visible={true} onDismiss={() => {}} title="" testID="modal">
          <MockContent />
        </Modal>
      );
      expect(getByTestId("modal")).toBeTruthy();
    });

    it("handles empty actions array", () => {
      const { getByTestId, queryByTestId } = render(
        <Modal visible={true} onDismiss={() => {}} actions={[]} testID="modal">
          <MockContent />
        </Modal>
      );
      expect(getByTestId("modal")).toBeTruthy();
      expect(queryByTestId("modal-actions")).toBeNull();
    });

    it("handles very long title", () => {
      const longTitle = "A".repeat(100);
      const { getByText } = render(
        <Modal visible={true} onDismiss={() => {}} title={longTitle}>
          <MockContent />
        </Modal>
      );
      expect(getByText(longTitle)).toBeTruthy();
    });

    it("handles no children", () => {
      const { getByTestId } = render(
        <Modal visible={true} onDismiss={() => {}} title="Empty Modal" testID="modal" />
      );
      expect(getByTestId("modal")).toBeTruthy();
    });
  });
});
