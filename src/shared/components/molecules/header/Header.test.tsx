/**
 * Header Component Tests
 * @description Tests for the Header molecule component
 * @task Task 2.3.1: Header Component (Sprint 2.3 - Molecules Navigation)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View, Text } from "react-native";
import { Header } from "./Header";
import type { HeaderAction } from "./Header.types";

// Mock icon component for tests
const MockIcon = ({ testID }: { testID?: string }) => (
  <View testID={testID}>
    <Text>Icon</Text>
  </View>
);

describe("Header", () => {
  // ===================
  // Rendering Tests
  // ===================

  describe("Basic Rendering", () => {
    it("renders with title", () => {
      const { getByText } = render(<Header title="Test Title" />);
      expect(getByText("Test Title")).toBeTruthy();
    });

    it("renders with title and subtitle", () => {
      const { getByText } = render(
        <Header title="Main Title" subtitle="Subtitle text" />
      );
      expect(getByText("Main Title")).toBeTruthy();
      expect(getByText("Subtitle text")).toBeTruthy();
    });

    it("renders with testID", () => {
      const { getByTestId } = render(
        <Header title="Test" testID="header-test" />
      );
      expect(getByTestId("header-test")).toBeTruthy();
    });

    it("renders without title when not provided", () => {
      const { queryByTestId } = render(<Header testID="header-no-title" />);
      expect(queryByTestId("header-no-title")).toBeTruthy();
    });
  });

  // ===================
  // Back Button Tests
  // ===================

  describe("Back Button", () => {
    it("renders back button when show is true", () => {
      const { getByTestId } = render(
        <Header
          title="Test"
          testID="header"
          backButton={{ show: true }}
        />
      );
      expect(getByTestId("header-back-button")).toBeTruthy();
    });

    it("does not render back button when show is false", () => {
      const { queryByTestId } = render(
        <Header
          title="Test"
          testID="header"
          backButton={{ show: false }}
        />
      );
      expect(queryByTestId("header-back-button")).toBeNull();
    });

    it("calls onPress when back button is pressed", () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <Header
          title="Test"
          testID="header"
          backButton={{ show: true, onPress: onPressMock }}
        />
      );

      fireEvent.press(getByTestId("header-back-button"));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("applies custom accessibility label to back button", () => {
      const { getByLabelText } = render(
        <Header
          title="Test"
          testID="header"
          backButton={{
            show: true,
            accessibilityLabel: "Go back to home",
          }}
        />
      );
      expect(getByLabelText("Go back to home")).toBeTruthy();
    });
  });

  // ===================
  // Right Actions Tests
  // ===================

  describe("Right Actions", () => {
    it("renders single right action", () => {
      const actions: HeaderAction[] = [
        {
          key: "settings",
          icon: <MockIcon testID="settings-icon" />,
          onPress: jest.fn(),
          accessibilityLabel: "Settings",
        },
      ];

      const { getByTestId } = render(
        <Header title="Test" testID="header" rightActions={actions} />
      );

      expect(getByTestId("settings-icon")).toBeTruthy();
    });

    it("renders multiple right actions", () => {
      const actions: HeaderAction[] = [
        {
          key: "search",
          icon: <MockIcon testID="search-icon" />,
          onPress: jest.fn(),
          accessibilityLabel: "Search",
        },
        {
          key: "notifications",
          icon: <MockIcon testID="notifications-icon" />,
          onPress: jest.fn(),
          accessibilityLabel: "Notifications",
        },
      ];

      const { getByTestId } = render(
        <Header title="Test" testID="header" rightActions={actions} />
      );

      expect(getByTestId("search-icon")).toBeTruthy();
      expect(getByTestId("notifications-icon")).toBeTruthy();
    });

    it("calls onPress when action is pressed", () => {
      const onPressMock = jest.fn();
      const actions: HeaderAction[] = [
        {
          key: "action",
          icon: <MockIcon />,
          onPress: onPressMock,
          accessibilityLabel: "Action",
        },
      ];

      const { getByLabelText } = render(
        <Header title="Test" rightActions={actions} />
      );

      fireEvent.press(getByLabelText("Action"));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("renders action with badge", () => {
      const actions: HeaderAction[] = [
        {
          key: "notifications",
          icon: <MockIcon />,
          onPress: jest.fn(),
          accessibilityLabel: "Notifications",
          badge: 5,
        },
      ];

      const { getByText } = render(
        <Header title="Test" testID="header" rightActions={actions} />
      );

      expect(getByText("5")).toBeTruthy();
    });

    it("renders 99+ for badge count over 99", () => {
      const actions: HeaderAction[] = [
        {
          key: "notifications",
          icon: <MockIcon />,
          onPress: jest.fn(),
          accessibilityLabel: "Notifications",
          badge: 150,
        },
      ];

      const { getByText } = render(
        <Header title="Test" rightActions={actions} />
      );

      expect(getByText("99+")).toBeTruthy();
    });

    it("does not render badge when count is 0", () => {
      const actions: HeaderAction[] = [
        {
          key: "notifications",
          icon: <MockIcon />,
          onPress: jest.fn(),
          accessibilityLabel: "Notifications",
          badge: 0,
        },
      ];

      const { queryByTestId } = render(
        <Header title="Test" testID="header" rightActions={actions} />
      );

      expect(queryByTestId("header-action-notifications-badge")).toBeNull();
    });

    it("disables action when disabled is true", () => {
      const onPressMock = jest.fn();
      const actions: HeaderAction[] = [
        {
          key: "action",
          icon: <MockIcon />,
          onPress: onPressMock,
          accessibilityLabel: "Disabled action",
          disabled: true,
        },
      ];

      const { getByLabelText } = render(
        <Header title="Test" rightActions={actions} />
      );

      fireEvent.press(getByLabelText("Disabled action"));
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  // ===================
  // Variants Tests
  // ===================

  describe("Variants", () => {
    it("renders default variant", () => {
      const { getByTestId } = render(
        <Header title="Test" testID="header" variant="default" />
      );
      expect(getByTestId("header")).toBeTruthy();
    });

    it("renders transparent variant", () => {
      const { getByTestId } = render(
        <Header title="Test" testID="header" variant="transparent" />
      );
      expect(getByTestId("header")).toBeTruthy();
    });

    it("renders gradient variant", () => {
      const { getByTestId } = render(
        <Header title="Test" testID="header" variant="gradient" />
      );
      expect(getByTestId("header")).toBeTruthy();
    });
  });

  // ===================
  // Sizes Tests
  // ===================

  describe("Sizes", () => {
    it("renders small size", () => {
      const { getByTestId } = render(
        <Header title="Test" testID="header" size="sm" />
      );
      expect(getByTestId("header")).toBeTruthy();
    });

    it("renders medium size (default)", () => {
      const { getByTestId } = render(
        <Header title="Test" testID="header" size="md" />
      );
      expect(getByTestId("header")).toBeTruthy();
    });

    it("renders large size", () => {
      const { getByTestId } = render(
        <Header title="Test" testID="header" size="lg" />
      );
      expect(getByTestId("header")).toBeTruthy();
    });
  });

  // ===================
  // Custom Elements Tests
  // ===================

  describe("Custom Elements", () => {
    it("renders custom left element instead of back button", () => {
      const { getByTestId, queryByTestId } = render(
        <Header
          title="Test"
          testID="header"
          backButton={{ show: true }}
          leftElement={<View testID="custom-left" />}
        />
      );

      expect(getByTestId("custom-left")).toBeTruthy();
      expect(queryByTestId("header-back-button")).toBeNull();
    });

    it("renders custom center element instead of title", () => {
      const { getByTestId, queryByText } = render(
        <Header
          title="Test Title"
          testID="header"
          centerElement={<View testID="custom-center" />}
        />
      );

      expect(getByTestId("custom-center")).toBeTruthy();
      expect(queryByText("Test Title")).toBeNull();
    });

    it("renders custom right element instead of actions", () => {
      const actions: HeaderAction[] = [
        {
          key: "action",
          icon: <MockIcon testID="action-icon" />,
          onPress: jest.fn(),
          accessibilityLabel: "Action",
        },
      ];

      const { getByTestId, queryByTestId } = render(
        <Header
          title="Test"
          testID="header"
          rightActions={actions}
          rightElement={<View testID="custom-right" />}
        />
      );

      expect(getByTestId("custom-right")).toBeTruthy();
      expect(queryByTestId("action-icon")).toBeNull();
    });
  });

  // ===================
  // Border Tests
  // ===================

  describe("Border", () => {
    it("shows border when showBorder is true", () => {
      const { getByTestId } = render(
        <Header title="Test" testID="header" showBorder />
      );
      expect(getByTestId("header")).toBeTruthy();
    });

    it("hides border by default", () => {
      const { getByTestId } = render(
        <Header title="Test" testID="header" />
      );
      expect(getByTestId("header")).toBeTruthy();
    });
  });

  // ===================
  // Accessibility Tests
  // ===================

  describe("Accessibility", () => {
    it("has accessible container", () => {
      const { getByTestId } = render(
        <Header
          title="Test"
          testID="header"
          accessibilityLabel="Page header"
        />
      );
      const header = getByTestId("header");
      expect(header.props.accessibilityRole).toBe("header");
    });

    it("applies accessibility label to container", () => {
      const { getByLabelText } = render(
        <Header title="Test" accessibilityLabel="Main navigation header" />
      );
      expect(getByLabelText("Main navigation header")).toBeTruthy();
    });

    it("back button has correct accessibility role", () => {
      const { getByTestId } = render(
        <Header
          title="Test"
          testID="header"
          backButton={{ show: true }}
        />
      );
      const backButton = getByTestId("header-back-button");
      expect(backButton.props.accessibilityRole).toBe("button");
    });

    it("action buttons have correct accessibility role", () => {
      const actions: HeaderAction[] = [
        {
          key: "action",
          icon: <MockIcon />,
          onPress: jest.fn(),
          accessibilityLabel: "Settings",
        },
      ];

      const { getByLabelText } = render(
        <Header title="Test" testID="header" rightActions={actions} />
      );

      const actionButton = getByLabelText("Settings");
      expect(actionButton.props.accessibilityRole).toBe("button");
    });
  });

  // ===================
  // Style Tests
  // ===================

  describe("Custom Styles", () => {
    it("applies custom container style", () => {
      const { getByTestId } = render(
        <Header
          title="Test"
          testID="header"
          style={{ marginTop: 20 }}
        />
      );
      expect(getByTestId("header")).toBeTruthy();
    });

    it("applies custom title style", () => {
      const { getByText } = render(
        <Header
          title="Test"
          titleStyle={{ letterSpacing: 2 }}
        />
      );
      expect(getByText("Test")).toBeTruthy();
    });
  });
});
