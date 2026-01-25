/**
 * TabBar Component Tests
 * @description Tests for the TabBar (SegmentedControl) molecule component
 * @task Task 2.3.3: TabBar Component (Sprint 2.3 - Molecules Navigation)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { TabBar } from "./TabBar";
import type { Tab } from "./TabBar.types";

// Default test tabs
const defaultTabs: Tab[] = [
  { key: "recent", label: "Recent", accessibilityLabel: "Recent tab" },
  { key: "trash", label: "Trash", accessibilityLabel: "Trash tab" },
];

const threeTabs: Tab[] = [
  { key: "all", label: "All", accessibilityLabel: "All tab" },
  { key: "active", label: "Active", accessibilityLabel: "Active tab" },
  { key: "completed", label: "Completed", accessibilityLabel: "Completed tab" },
];

describe("TabBar", () => {
  // ===================
  // Rendering Tests
  // ===================

  describe("Basic Rendering", () => {
    it("renders with tabs", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tab-bar"
        />
      );
      expect(getByTestId("tab-bar")).toBeTruthy();
    });

    it("renders all tab labels", () => {
      const { getByText } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
        />
      );

      expect(getByText("Recent")).toBeTruthy();
      expect(getByText("Trash")).toBeTruthy();
    });

    it("renders three tabs correctly", () => {
      const { getByText } = render(
        <TabBar
          tabs={threeTabs}
          activeTab="all"
          onTabChange={() => {}}
        />
      );

      expect(getByText("All")).toBeTruthy();
      expect(getByText("Active")).toBeTruthy();
      expect(getByText("Completed")).toBeTruthy();
    });

    it("renders with testID", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="segmented-control"
        />
      );
      expect(getByTestId("segmented-control")).toBeTruthy();
    });
  });

  // ===================
  // Active Tab Tests
  // ===================

  describe("Active Tab", () => {
    it("highlights active tab", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tabs"
        />
      );

      expect(getByTestId("tabs-tab-recent")).toBeTruthy();
    });

    it("changes active tab styling when different tab is active", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="trash"
          onTabChange={() => {}}
          testID="tabs"
        />
      );

      expect(getByTestId("tabs-tab-trash")).toBeTruthy();
    });
  });

  // ===================
  // Interaction Tests
  // ===================

  describe("Tab Press", () => {
    it("calls onTabChange when tab is pressed", () => {
      const onTabChangeMock = jest.fn();
      const { getByText } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={onTabChangeMock}
        />
      );

      fireEvent.press(getByText("Trash"));
      expect(onTabChangeMock).toHaveBeenCalledWith("trash");
    });

    it("calls onTabChange with correct key for each tab", () => {
      const onTabChangeMock = jest.fn();
      const { getByText } = render(
        <TabBar
          tabs={threeTabs}
          activeTab="all"
          onTabChange={onTabChangeMock}
        />
      );

      fireEvent.press(getByText("Active"));
      expect(onTabChangeMock).toHaveBeenCalledWith("active");

      fireEvent.press(getByText("Completed"));
      expect(onTabChangeMock).toHaveBeenCalledWith("completed");
    });

    it("does not call onTabChange when disabled tab is pressed", () => {
      const onTabChangeMock = jest.fn();
      const tabsWithDisabled: Tab[] = [
        { key: "recent", label: "Recent" },
        { key: "trash", label: "Trash", disabled: true },
      ];

      const { getByText } = render(
        <TabBar
          tabs={tabsWithDisabled}
          activeTab="recent"
          onTabChange={onTabChangeMock}
        />
      );

      fireEvent.press(getByText("Trash"));
      expect(onTabChangeMock).not.toHaveBeenCalled();
    });

    it("still calls onTabChange when pressing already active tab", () => {
      const onTabChangeMock = jest.fn();
      const { getByText } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={onTabChangeMock}
        />
      );

      fireEvent.press(getByText("Recent"));
      expect(onTabChangeMock).toHaveBeenCalledWith("recent");
    });
  });

  // ===================
  // Badge Tests
  // ===================

  describe("Badges", () => {
    it("renders badge when badge count is provided", () => {
      const tabsWithBadge: Tab[] = [
        { key: "recent", label: "Recent", badge: 4 },
        { key: "trash", label: "Trash", badge: 16 },
      ];

      const { getByText } = render(
        <TabBar
          tabs={tabsWithBadge}
          activeTab="recent"
          onTabChange={() => {}}
        />
      );

      expect(getByText("4")).toBeTruthy();
      expect(getByText("16")).toBeTruthy();
    });

    it("renders 99+ for badge count over 99", () => {
      const tabsWithBadge: Tab[] = [
        { key: "recent", label: "Recent", badge: 150 },
        { key: "trash", label: "Trash" },
      ];

      const { getByText } = render(
        <TabBar
          tabs={tabsWithBadge}
          activeTab="recent"
          onTabChange={() => {}}
        />
      );

      expect(getByText("99+")).toBeTruthy();
    });

    it("does not render badge when count is 0", () => {
      const tabsWithBadge: Tab[] = [
        { key: "recent", label: "Recent", badge: 0 },
        { key: "trash", label: "Trash" },
      ];

      const { queryByTestId } = render(
        <TabBar
          tabs={tabsWithBadge}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tabs"
        />
      );

      expect(queryByTestId("tabs-tab-recent-badge")).toBeNull();
    });
  });

  // ===================
  // Variant Tests
  // ===================

  describe("Variants", () => {
    it("renders pill variant (default)", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tabs"
          variant="pill"
        />
      );
      expect(getByTestId("tabs")).toBeTruthy();
    });

    it("renders underline variant", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tabs"
          variant="underline"
        />
      );
      expect(getByTestId("tabs")).toBeTruthy();
    });

    it("renders filled variant", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tabs"
          variant="filled"
        />
      );
      expect(getByTestId("tabs")).toBeTruthy();
    });
  });

  // ===================
  // Size Tests
  // ===================

  describe("Sizes", () => {
    it("renders small size", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tabs"
          size="sm"
        />
      );
      expect(getByTestId("tabs")).toBeTruthy();
    });

    it("renders medium size (default)", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tabs"
          size="md"
        />
      );
      expect(getByTestId("tabs")).toBeTruthy();
    });

    it("renders large size", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tabs"
          size="lg"
        />
      );
      expect(getByTestId("tabs")).toBeTruthy();
    });
  });

  // ===================
  // Layout Tests
  // ===================

  describe("Layout Options", () => {
    it("renders with equal width tabs", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tabs"
          equalWidth
        />
      );
      expect(getByTestId("tabs")).toBeTruthy();
    });

    it("renders full width", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tabs"
          fullWidth
        />
      );
      expect(getByTestId("tabs")).toBeTruthy();
    });
  });

  // ===================
  // Accessibility Tests
  // ===================

  describe("Accessibility", () => {
    it("has accessible container with tablist role", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tabs"
        />
      );

      const tabBar = getByTestId("tabs");
      expect(tabBar.props.accessibilityRole).toBe("tablist");
    });

    it("applies accessibility label to container", () => {
      const { getByLabelText } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          accessibilityLabel="Content filter"
        />
      );

      expect(getByLabelText("Content filter")).toBeTruthy();
    });

    it("tabs have tab accessibility role", () => {
      const { getByLabelText } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
        />
      );

      const recentTab = getByLabelText("Recent tab");
      expect(recentTab.props.accessibilityRole).toBe("tab");
    });

    it("active tab has selected state", () => {
      const { getByLabelText } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
        />
      );

      const recentTab = getByLabelText("Recent tab");
      expect(recentTab.props.accessibilityState.selected).toBe(true);
    });

    it("inactive tab has unselected state", () => {
      const { getByLabelText } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
        />
      );

      const trashTab = getByLabelText("Trash tab");
      expect(trashTab.props.accessibilityState.selected).toBe(false);
    });

    it("disabled tab has disabled state", () => {
      const tabsWithDisabled: Tab[] = [
        { key: "recent", label: "Recent", accessibilityLabel: "Recent tab" },
        { key: "trash", label: "Trash", disabled: true, accessibilityLabel: "Trash tab" },
      ];

      const { getByLabelText } = render(
        <TabBar
          tabs={tabsWithDisabled}
          activeTab="recent"
          onTabChange={() => {}}
        />
      );

      const trashTab = getByLabelText("Trash tab");
      expect(trashTab.props.accessibilityState.disabled).toBe(true);
    });
  });

  // ===================
  // Custom Styles Tests
  // ===================

  describe("Custom Styles", () => {
    it("applies custom container style", () => {
      const { getByTestId } = render(
        <TabBar
          tabs={defaultTabs}
          activeTab="recent"
          onTabChange={() => {}}
          testID="tabs"
          style={{ marginTop: 20 }}
        />
      );

      expect(getByTestId("tabs")).toBeTruthy();
    });
  });

  // ===================
  // Edge Cases
  // ===================

  describe("Edge Cases", () => {
    it("handles single tab", () => {
      const singleTab: Tab[] = [{ key: "only", label: "Only Tab" }];

      const { getByText } = render(
        <TabBar
          tabs={singleTab}
          activeTab="only"
          onTabChange={() => {}}
        />
      );

      expect(getByText("Only Tab")).toBeTruthy();
    });

    it("handles many tabs (5)", () => {
      const manyTabs: Tab[] = [
        { key: "1", label: "One" },
        { key: "2", label: "Two" },
        { key: "3", label: "Three" },
        { key: "4", label: "Four" },
        { key: "5", label: "Five" },
      ];

      const { getByText } = render(
        <TabBar
          tabs={manyTabs}
          activeTab="1"
          onTabChange={() => {}}
        />
      );

      expect(getByText("One")).toBeTruthy();
      expect(getByText("Five")).toBeTruthy();
    });

    it("handles long label text", () => {
      const longLabelTabs: Tab[] = [
        { key: "long", label: "Very Long Tab Label Text" },
        { key: "short", label: "Short" },
      ];

      const { getByText } = render(
        <TabBar
          tabs={longLabelTabs}
          activeTab="long"
          onTabChange={() => {}}
        />
      );

      expect(getByText("Very Long Tab Label Text")).toBeTruthy();
    });
  });
});
