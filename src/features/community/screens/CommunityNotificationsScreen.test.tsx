/**
 * CommunityNotificationsScreen Tests
 * @task Task 3.14.6: Community Notifications Screen (Screen 124)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { CommunityNotificationsScreen } from "./CommunityNotificationsScreen";

const defaultNotifications = [
  { id: "n1", type: "follower", title: "You have new followers!", subtitle: "Akari M just followed you.", avatarColor: "#9AAD5C" },
  { id: "n2", type: "messages", title: "You have unread messages!", subtitle: "52 Total Unread Messages.", avatarColor: "#E8853A" },
  { id: "n3", type: "comment", title: "Someone commented!", subtitle: "Dr. Hikari commented on your post.", avatarColor: "#F4D03F" },
  { id: "n4", type: "video", title: "Someone posted new video!", subtitle: "Jordan B. just posted a video.", avatarColor: "#3498DB" },
  { id: "n5", type: "mention", title: "Someone mentioned you!", subtitle: "Maya S. just mentioned you.", avatarColor: "#7B68B5" },
];

const defaultProps = {
  selectedTab: "today" as const,
  tabs: [
    { id: "today", label: "Today" },
    { id: "last_week", label: "Last Week" },
  ],
  sections: [
    { id: "s1", title: "Earlier This Day", notifications: defaultNotifications },
  ],
  onBack: jest.fn(),
  onTabSelect: jest.fn(),
  onNotificationPress: jest.fn(),
  onOptionsPress: jest.fn(),
};

describe("CommunityNotificationsScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the screen container", () => {
    const { getByTestId } = render(<CommunityNotificationsScreen {...defaultProps} />);
    expect(getByTestId("community-notifications-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(<CommunityNotificationsScreen {...defaultProps} />);
    const flat = Object.assign({}, ...[].concat(getByTestId("community-notifications-screen").props.style));
    expect(flat.flex).toBe(1);
  });

  it("renders the back button", () => {
    const { getByTestId } = render(<CommunityNotificationsScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<CommunityNotificationsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<CommunityNotificationsScreen {...defaultProps} />);
    const flat = Object.assign({}, ...[].concat(getByTestId("back-button").props.style));
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("displays 'Community Notification' header", () => {
    const { getByText } = render(<CommunityNotificationsScreen {...defaultProps} />);
    expect(getByText("Community Notification")).toBeTruthy();
  });

  it("renders time filter tabs", () => {
    const { getByTestId } = render(<CommunityNotificationsScreen {...defaultProps} />);
    expect(getByTestId("tab-today")).toBeTruthy();
    expect(getByTestId("tab-last_week")).toBeTruthy();
  });

  it("calls onTabSelect when tab is pressed", () => {
    const { getByTestId } = render(<CommunityNotificationsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("tab-last_week"));
    expect(defaultProps.onTabSelect).toHaveBeenCalledWith("last_week");
  });

  it("displays section header", () => {
    const { getByText } = render(<CommunityNotificationsScreen {...defaultProps} />);
    expect(getByText("Earlier This Day")).toBeTruthy();
  });

  it("renders all notification rows", () => {
    const { getByTestId } = render(<CommunityNotificationsScreen {...defaultProps} />);
    defaultNotifications.forEach((n) => {
      expect(getByTestId(`notification-row-${n.id}`)).toBeTruthy();
    });
  });

  it("displays notification titles", () => {
    const { getByText } = render(<CommunityNotificationsScreen {...defaultProps} />);
    expect(getByText("You have new followers!")).toBeTruthy();
    expect(getByText("You have unread messages!")).toBeTruthy();
  });

  it("displays notification subtitles", () => {
    const { getByText } = render(<CommunityNotificationsScreen {...defaultProps} />);
    expect(getByText("Akari M just followed you.")).toBeTruthy();
  });

  it("calls onNotificationPress when row is pressed", () => {
    const { getByTestId } = render(<CommunityNotificationsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("notification-row-n1"));
    expect(defaultProps.onNotificationPress).toHaveBeenCalledWith("n1");
  });

  it("notification rows have accessibilityRole button", () => {
    const { getByTestId } = render(<CommunityNotificationsScreen {...defaultProps} />);
    expect(getByTestId("notification-row-n1").props.accessibilityRole).toBe("button");
  });

  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<CommunityNotificationsScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not contain real person names as placeholders", () => {
    const { queryByText } = render(<CommunityNotificationsScreen {...defaultProps} />);
    expect(queryByText(/joe biden/i)).toBeNull();
    expect(queryByText(/john cena/i)).toBeNull();
  });
});
