/**
 * NotificationsDashboardScreen Tests — prototype v4.2 #35 reskin (Sprint 9).
 * ≥15 behavior-style tests covering header, headline, filters, groups, and rows.
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import {
  NotificationsDashboardScreen,
  DEFAULT_NOTIFICATIONS,
} from "./NotificationsDashboardScreen";

const makeProps = (overrides = {}) => ({
  onBack: jest.fn(),
  onMarkAllRead: jest.fn(),
  onFilterChange: jest.fn(),
  onNotificationPress: jest.fn(),
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("NotificationsDashboardScreen", () => {
  // 1. Root container
  it("renders the screen container", () => {
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByTestId("notifications-dashboard-screen")).toBeTruthy();
  });

  // 2. Headline
  it("renders the Inbox headline", () => {
    const { getByText } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByText("Inbox")).toBeTruthy();
  });

  // 3. Default unread count
  it("renders the default unread count subtitle (3 new)", () => {
    const { getByText } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByText("3 new")).toBeTruthy();
    expect(getByText(/this week/)).toBeTruthy();
  });

  // 4. Unread count override
  it("respects unreadCount prop", () => {
    const { getByText } = render(
      <NotificationsDashboardScreen {...makeProps()} unreadCount={7} />,
    );
    expect(getByText("7 new")).toBeTruthy();
  });

  // 5. Back button renders
  it("renders the back button", () => {
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  // 6. Back press
  it("calls onBack when back button pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps({ onBack })} />,
    );
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  // 7. Mark all read button renders
  it("renders the Mark all read action", () => {
    const { getByText } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByText("Mark all read")).toBeTruthy();
  });

  // 8. Mark all read press
  it("calls onMarkAllRead when pressed", () => {
    const onMarkAllRead = jest.fn();
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps({ onMarkAllRead })} />,
    );
    fireEvent.press(getByTestId("mark-all-read-button"));
    expect(onMarkAllRead).toHaveBeenCalledTimes(1);
  });

  // 9. Filter pills present
  it("renders the filter pills tablist", () => {
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByTestId("filter-pills")).toBeTruthy();
  });

  // 10. Filter change fires callback
  it("calls onFilterChange when a pill is pressed", () => {
    const onFilterChange = jest.fn();
    const { getByText } = render(
      <NotificationsDashboardScreen {...makeProps({ onFilterChange })} />,
    );
    fireEvent.press(getByText(/Insights/));
    expect(onFilterChange).toHaveBeenCalledWith("insights");
  });

  // 11. All filter pill labels render
  it("renders every filter pill label", () => {
    const { getByText } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByText("All")).toBeTruthy();
    expect(getByText("Insights")).toBeTruthy();
    expect(getByText("Reminders")).toBeTruthy();
    expect(getByText("Achievements")).toBeTruthy();
  });

  // 12. Three groups render
  it("renders Today, Yesterday, and Earlier this week groups", () => {
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByTestId("notification-group-today")).toBeTruthy();
    expect(getByTestId("notification-group-yesterday")).toBeTruthy();
    expect(getByTestId("notification-group-earlier")).toBeTruthy();
  });

  // 13. Today notifications render
  it("renders Today notification rows", () => {
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByTestId("notification-row-score-up")).toBeTruthy();
    expect(getByTestId("notification-row-streak-23")).toBeTruthy();
  });

  // 14. Yesterday + earlier rows render
  it("renders all default notification rows", () => {
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByTestId("notification-row-evening-checkin")).toBeTruthy();
    expect(getByTestId("notification-row-weekly-summary")).toBeTruthy();
    expect(getByTestId("notification-row-soundscape-unlocked")).toBeTruthy();
  });

  // 15. Notification row content
  it("renders notification titles and descriptions", () => {
    const { getByText } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByText("Your Solace Score went up")).toBeTruthy();
    expect(getByText("+5 points since last week. Keep going!")).toBeTruthy();
    expect(getByText("Streak milestone: 23 days")).toBeTruthy();
  });

  // 16. Today timestamps include "ago" suffix
  it("renders today timestamps with 'ago' suffix", () => {
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByTestId("notification-time-score-up").props.children).toBe(
      "3m ago",
    );
  });

  // 17. Notification row press
  it("calls onNotificationPress with id when row pressed", () => {
    const onNotificationPress = jest.fn();
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps({ onNotificationPress })} />,
    );
    fireEvent.press(getByTestId("notification-row-score-up"));
    expect(onNotificationPress).toHaveBeenCalledWith("score-up");
  });

  // 18. Unread state shows in row a11y label
  it("marks unread rows as unread in their accessibility label", () => {
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(
      getByTestId("notification-row-score-up").props.accessibilityLabel,
    ).toMatch(/unread/);
    expect(
      getByTestId("notification-row-evening-checkin").props.accessibilityLabel,
    ).not.toMatch(/unread/);
  });

  // 19. Custom notifications array
  it("respects a custom notifications array", () => {
    const custom = [
      {
        id: "custom-group",
        label: "Just now",
        items: [
          {
            id: "custom-item",
            iconName: "bell",
            hue: "aurora" as const,
            title: "Custom title",
            description: "Custom desc",
            time: "now",
          },
        ],
      },
    ];
    const { getByTestId, queryByTestId } = render(
      <NotificationsDashboardScreen {...makeProps()} notifications={custom} />,
    );
    expect(getByTestId("notification-row-custom-item")).toBeTruthy();
    expect(queryByTestId("notification-row-score-up")).toBeNull();
  });

  // 20. Headline accessibility
  it("inbox headline is announced as a header", () => {
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(getByTestId("inbox-headline").props.accessibilityRole).toBe(
      "header",
    );
  });

  // 21. Touch target — back
  it("back button meets 44pt minimum touch target", () => {
    const { getByTestId } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    const { StyleSheet } = require("react-native");
    const flat = StyleSheet.flatten(getByTestId("back-button").props.style);
    expect(flat.height).toBeGreaterThanOrEqual(44);
    expect(flat.width).toBeGreaterThanOrEqual(44);
  });

  // 22. Default export is identical
  it("DEFAULT_NOTIFICATIONS contains 3 groups", () => {
    expect(DEFAULT_NOTIFICATIONS.length).toBe(3);
  });

  // 23. Branding — no Freud
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(
      <NotificationsDashboardScreen {...makeProps()} />,
    );
    expect(queryByText(/freud/i)).toBeNull();
  });
});
