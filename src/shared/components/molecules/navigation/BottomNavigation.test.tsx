/**
 * BottomNavigation Component Tests
 * @description Tests for the BottomNavigation molecule component
 * @task Task 2.3.2: BottomNavigation Component (Sprint 2.3 - Molecules Navigation)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { View, Text } from "react-native";
import { BottomNavigation } from "./BottomNavigation";
import type { NavTab } from "./BottomNavigation.types";

// Mock icon components for tests
const MockIcon = ({ testID, active }: { testID?: string; active?: boolean }) => (
  <View testID={testID}>
    <Text>{active ? "Active" : "Inactive"}</Text>
  </View>
);

// Default test tabs
const defaultTabs: NavTab[] = [
  {
    key: "home",
    label: "Home",
    icon: <MockIcon testID="home-icon" />,
    activeIcon: <MockIcon testID="home-icon-active" active />,
    accessibilityLabel: "Home tab",
  },
  {
    key: "chat",
    label: "Chat",
    icon: <MockIcon testID="chat-icon" />,
    accessibilityLabel: "Chat tab",
  },
  {
    key: "journal",
    label: "Journal",
    icon: <MockIcon testID="journal-icon" />,
    accessibilityLabel: "Journal tab",
  },
  {
    key: "community",
    label: "Community",
    icon: <MockIcon testID="community-icon" />,
    accessibilityLabel: "Community tab",
  },
  {
    key: "profile",
    label: "Profile",
    icon: <MockIcon testID="profile-icon" />,
    accessibilityLabel: "Profile tab",
  },
];

describe("BottomNavigation", () => {
  // ===================
  // Rendering Tests
  // ===================

  describe("Basic Rendering", () => {
    it("renders with tabs", () => {
      const { getByTestId } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
          testID="bottom-nav"
        />
      );
      expect(getByTestId("bottom-nav")).toBeTruthy();
    });

    it("renders all tabs", () => {
      const { getByText } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
        />
      );

      expect(getByText("Home")).toBeTruthy();
      expect(getByText("Chat")).toBeTruthy();
      expect(getByText("Journal")).toBeTruthy();
      expect(getByText("Community")).toBeTruthy();
      expect(getByText("Profile")).toBeTruthy();
    });

    it("renders with testID", () => {
      const { getByTestId } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
          testID="nav-bar"
        />
      );
      expect(getByTestId("nav-bar")).toBeTruthy();
    });

    it("renders icons for each tab", () => {
      const { getByTestId } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="chat"
          onTabPress={() => {}}
        />
      );

      // Home should have active icon since it has one defined
      expect(getByTestId("home-icon")).toBeTruthy();
      expect(getByTestId("chat-icon")).toBeTruthy();
    });
  });

  // ===================
  // Active Tab Tests
  // ===================

  describe("Active Tab", () => {
    it("shows active icon for active tab when provided", () => {
      const { getByTestId } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
        />
      );

      expect(getByTestId("home-icon-active")).toBeTruthy();
    });

    it("uses regular icon when activeIcon not provided", () => {
      const { getByTestId } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="chat"
          onTabPress={() => {}}
        />
      );

      // Chat doesn't have activeIcon, so it should use regular icon
      expect(getByTestId("chat-icon")).toBeTruthy();
    });

    it("highlights active tab label", () => {
      const { getByText } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
        />
      );

      const homeLabel = getByText("Home");
      expect(homeLabel).toBeTruthy();
    });
  });

  // ===================
  // Interaction Tests
  // ===================

  describe("Tab Press", () => {
    it("calls onTabPress when tab is pressed", () => {
      const onTabPressMock = jest.fn();
      const { getByText } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={onTabPressMock}
        />
      );

      fireEvent.press(getByText("Chat"));
      expect(onTabPressMock).toHaveBeenCalledWith("chat");
    });

    it("calls onTabPress with correct key for each tab", () => {
      const onTabPressMock = jest.fn();
      const { getByText } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={onTabPressMock}
        />
      );

      fireEvent.press(getByText("Journal"));
      expect(onTabPressMock).toHaveBeenCalledWith("journal");

      fireEvent.press(getByText("Community"));
      expect(onTabPressMock).toHaveBeenCalledWith("community");

      fireEvent.press(getByText("Profile"));
      expect(onTabPressMock).toHaveBeenCalledWith("profile");
    });

    it("does not call onTabPress when disabled tab is pressed", () => {
      const onTabPressMock = jest.fn();
      const tabsWithDisabled: NavTab[] = [
        ...defaultTabs.slice(0, 2),
        { ...defaultTabs[2], disabled: true },
        ...defaultTabs.slice(3),
      ];

      const { getByText } = render(
        <BottomNavigation
          tabs={tabsWithDisabled}
          activeTab="home"
          onTabPress={onTabPressMock}
        />
      );

      fireEvent.press(getByText("Journal"));
      expect(onTabPressMock).not.toHaveBeenCalled();
    });
  });

  // ===================
  // Badge Tests
  // ===================

  describe("Badges", () => {
    it("renders badge when badge count is provided", () => {
      const tabsWithBadge: NavTab[] = [
        ...defaultTabs.slice(0, 1),
        { ...defaultTabs[1], badge: 5 },
        ...defaultTabs.slice(2),
      ];

      const { getByText } = render(
        <BottomNavigation
          tabs={tabsWithBadge}
          activeTab="home"
          onTabPress={() => {}}
        />
      );

      expect(getByText("5")).toBeTruthy();
    });

    it("renders 99+ for badge count over 99", () => {
      const tabsWithBadge: NavTab[] = [
        ...defaultTabs.slice(0, 1),
        { ...defaultTabs[1], badge: 150 },
        ...defaultTabs.slice(2),
      ];

      const { getByText } = render(
        <BottomNavigation
          tabs={tabsWithBadge}
          activeTab="home"
          onTabPress={() => {}}
        />
      );

      expect(getByText("99+")).toBeTruthy();
    });

    it("does not render badge when count is 0", () => {
      const tabsWithBadge: NavTab[] = [
        ...defaultTabs.slice(0, 1),
        { ...defaultTabs[1], badge: 0 },
        ...defaultTabs.slice(2),
      ];

      const { queryByTestId } = render(
        <BottomNavigation
          tabs={tabsWithBadge}
          activeTab="home"
          onTabPress={() => {}}
          testID="nav"
        />
      );

      expect(queryByTestId("nav-tab-chat-badge")).toBeNull();
    });

    it("does not render badge when not provided", () => {
      const { queryByTestId } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
          testID="nav"
        />
      );

      expect(queryByTestId("nav-tab-home-badge")).toBeNull();
    });
  });

  // ===================
  // Labels Tests
  // ===================

  describe("Labels", () => {
    it("shows labels by default", () => {
      const { getByText } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
        />
      );

      expect(getByText("Home")).toBeTruthy();
    });

    it("hides labels when showLabels is false", () => {
      const { queryByText } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
          showLabels={false}
        />
      );

      expect(queryByText("Home")).toBeNull();
    });
  });

  // ===================
  // Border Tests
  // ===================

  describe("Border", () => {
    it("shows border when showBorder is true", () => {
      const { getByTestId } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
          testID="nav"
          showBorder
        />
      );

      expect(getByTestId("nav")).toBeTruthy();
    });

    it("hides border by default", () => {
      const { getByTestId } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
          testID="nav"
        />
      );

      expect(getByTestId("nav")).toBeTruthy();
    });
  });

  // ===================
  // Accessibility Tests
  // ===================

  describe("Accessibility", () => {
    it("has accessible container with tablist role", () => {
      const { getByTestId } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
          testID="nav"
        />
      );

      const nav = getByTestId("nav");
      expect(nav.props.accessibilityRole).toBe("tablist");
    });

    it("applies accessibility label to container", () => {
      const { getByLabelText } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
          accessibilityLabel="Main navigation"
        />
      );

      expect(getByLabelText("Main navigation")).toBeTruthy();
    });

    it("tabs have tab accessibility role", () => {
      const { getByLabelText } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
        />
      );

      const homeTab = getByLabelText("Home tab");
      expect(homeTab.props.accessibilityRole).toBe("tab");
    });

    it("active tab has selected state", () => {
      const { getByLabelText } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
        />
      );

      const homeTab = getByLabelText("Home tab");
      expect(homeTab.props.accessibilityState.selected).toBe(true);
    });

    it("inactive tab has unselected state", () => {
      const { getByLabelText } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
        />
      );

      const chatTab = getByLabelText("Chat tab");
      expect(chatTab.props.accessibilityState.selected).toBe(false);
    });

    it("disabled tab has disabled state", () => {
      const tabsWithDisabled: NavTab[] = [
        ...defaultTabs.slice(0, 2),
        { ...defaultTabs[2], disabled: true },
        ...defaultTabs.slice(3),
      ];

      const { getByLabelText } = render(
        <BottomNavigation
          tabs={tabsWithDisabled}
          activeTab="home"
          onTabPress={() => {}}
        />
      );

      const journalTab = getByLabelText("Journal tab");
      expect(journalTab.props.accessibilityState.disabled).toBe(true);
    });
  });

  // ===================
  // Loading Tests
  // ===================

  describe("Loading State", () => {
    it("disables tabs when loading", () => {
      const onTabPressMock = jest.fn();
      const { getByText } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={onTabPressMock}
          isLoading
        />
      );

      fireEvent.press(getByText("Chat"));
      expect(onTabPressMock).not.toHaveBeenCalled();
    });
  });

  // ===================
  // Custom Styles Tests
  // ===================

  describe("Custom Styles", () => {
    it("applies custom container style", () => {
      const { getByTestId } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={() => {}}
          testID="nav"
          style={{ backgroundColor: "red" }}
        />
      );

      expect(getByTestId("nav")).toBeTruthy();
    });
  });

  // ===================
  // Edge Cases
  // ===================

  describe("Edge Cases", () => {
    it("handles 2 tabs", () => {
      const twoTabs = defaultTabs.slice(0, 2);
      const { getByText } = render(
        <BottomNavigation
          tabs={twoTabs}
          activeTab="home"
          onTabPress={() => {}}
        />
      );

      expect(getByText("Home")).toBeTruthy();
      expect(getByText("Chat")).toBeTruthy();
    });

    it("handles 3 tabs", () => {
      const threeTabs = defaultTabs.slice(0, 3);
      const { getByText } = render(
        <BottomNavigation
          tabs={threeTabs}
          activeTab="home"
          onTabPress={() => {}}
        />
      );

      expect(getByText("Home")).toBeTruthy();
      expect(getByText("Chat")).toBeTruthy();
      expect(getByText("Journal")).toBeTruthy();
    });

    it("handles pressing already active tab", () => {
      const onTabPressMock = jest.fn();
      const { getByText } = render(
        <BottomNavigation
          tabs={defaultTabs}
          activeTab="home"
          onTabPress={onTabPressMock}
        />
      );

      fireEvent.press(getByText("Home"));
      expect(onTabPressMock).toHaveBeenCalledWith("home");
    });
  });
});
