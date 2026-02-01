/**
 * NotificationsDashboardScreen Tests
 * @description Tests for the central notifications hub with grouped notifications
 * @task Task 3.16.1: Notifications Dashboard Screen (Screen 134)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { NotificationsDashboardScreen } from "./NotificationsDashboardScreen";

const mockSections = [
  {
    id: "today",
    title: "Earlier This Day",
    notifications: [
      {
        id: "n1",
        title: "Message from Dr Solace AI!",
        subtitle: "52 Total Unread Messages",
        avatarColor: "#F4D03F",
        avatarIcon: "\uD83D\uDCAC",
      },
      {
        id: "n2",
        title: "Journal Incomplete!",
        subtitle: "It's Reflection Time!",
        avatarColor: "#E8853A",
        avatarIcon: "\uD83D\uDCD6",
        badge: "8/22",
      },
      {
        id: "n3",
        title: "Exercise Complete!",
        subtitle: "22m Breathing Done.",
        avatarColor: "#9AAD5C",
        avatarIcon: "\uD83E\uDDD8",
        isComplete: true,
      },
      {
        id: "n4",
        title: "Mental Health Data is Here.",
        subtitle: "Your Monthly Mental Analysis is here.",
        avatarColor: "#4A9E8C",
        avatarIcon: "\uD83D\uDCC8",
        attachment: "Monthly_Health_Report.pdf",
      },
      {
        id: "n5",
        title: "Mood Improved.",
        subtitle: "Neutral \u2192 Happy",
        avatarColor: "#7B68B5",
        avatarIcon: "\uD83D\uDE0A",
      },
    ],
  },
  {
    id: "lastweek",
    title: "Last Week",
    notifications: [
      {
        id: "n6",
        title: "Stress Decreased.",
        subtitle: "Stress Level is now 3.",
        avatarColor: "#E91E63",
        avatarIcon: "\u2764\uFE0F",
      },
      {
        id: "n7",
        title: "Dr Solace Recommendations.",
        subtitle: "48 Health Recommendations",
        avatarColor: "#3498DB",
        avatarIcon: "\uD83E\uDD16",
      },
    ],
  },
];

const defaultProps = {
  unreadCount: 11,
  sections: mockSections,
  onBack: jest.fn(),
  onSettings: jest.fn(),
  onNotificationPress: jest.fn(),
  onOptionsPress: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(
    <NotificationsDashboardScreen {...defaultProps} {...overrides} />,
  );
}

beforeEach(() => jest.clearAllMocks());

describe("NotificationsDashboardScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("notifications-dashboard-screen")).toBeTruthy();
  });

  it("renders the header with title 'Notifications'", () => {
    const { getByText } = renderScreen();
    expect(getByText("Notifications")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders the unread count badge", () => {
    const { getByText } = renderScreen();
    expect(getByText("+11")).toBeTruthy();
  });

  it("renders the settings button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("settings-button")).toBeTruthy();
  });

  // ── Sections ───────────────────────────────────────────
  it("renders section headers", () => {
    const { getByText } = renderScreen();
    expect(getByText("Earlier This Day")).toBeTruthy();
    expect(getByText("Last Week")).toBeTruthy();
  });

  it("renders section options buttons", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("section-options-today")).toBeTruthy();
    expect(getByTestId("section-options-lastweek")).toBeTruthy();
  });

  // ── Notification Rows ──────────────────────────────────
  it("renders all notification rows", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("notification-n1")).toBeTruthy();
    expect(getByTestId("notification-n2")).toBeTruthy();
    expect(getByTestId("notification-n3")).toBeTruthy();
    expect(getByTestId("notification-n4")).toBeTruthy();
    expect(getByTestId("notification-n5")).toBeTruthy();
    expect(getByTestId("notification-n6")).toBeTruthy();
    expect(getByTestId("notification-n7")).toBeTruthy();
  });

  it("renders notification titles", () => {
    const { getByText } = renderScreen();
    expect(getByText("Message from Dr Solace AI!")).toBeTruthy();
    expect(getByText("Journal Incomplete!")).toBeTruthy();
    expect(getByText("Exercise Complete!")).toBeTruthy();
  });

  it("renders notification subtitles", () => {
    const { getByText } = renderScreen();
    expect(getByText("52 Total Unread Messages")).toBeTruthy();
    expect(getByText(/Reflection Time/)).toBeTruthy();
  });

  it("renders colored notification avatars", () => {
    const { getByTestId } = renderScreen();
    const avatar = getByTestId("notification-avatar-n1");
    const style = Object.assign({}, ...[].concat(avatar.props.style));
    expect(style.backgroundColor).toBe("#F4D03F");
  });

  it("renders badge on notification with badge prop", () => {
    const { getByText } = renderScreen();
    expect(getByText("8/22")).toBeTruthy();
  });

  it("renders attachment on notification with attachment prop", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Monthly_Health_Report\.pdf/)).toBeTruthy();
  });

  it("renders mood transition text", () => {
    const { getByText } = renderScreen();
    expect(getByText(/Neutral/)).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onSettings when settings button is pressed", () => {
    const onSettings = jest.fn();
    const { getByTestId } = renderScreen({ onSettings });
    fireEvent.press(getByTestId("settings-button"));
    expect(onSettings).toHaveBeenCalledTimes(1);
  });

  it("calls onNotificationPress with notification when row pressed", () => {
    const onNotificationPress = jest.fn();
    const { getByTestId } = renderScreen({ onNotificationPress });
    fireEvent.press(getByTestId("notification-n1"));
    expect(onNotificationPress).toHaveBeenCalledWith(
      mockSections[0].notifications[0],
    );
  });

  it("calls onOptionsPress with section id when section options pressed", () => {
    const onOptionsPress = jest.fn();
    const { getByTestId } = renderScreen({ onOptionsPress });
    fireEvent.press(getByTestId("section-options-today"));
    expect(onOptionsPress).toHaveBeenCalledWith("today");
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button has accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("settings button has accessibilityLabel 'Settings'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("settings-button").props.accessibilityLabel).toBe(
      "Settings",
    );
  });

  it("notification rows have accessibilityRole 'button'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("notification-n1").props.accessibilityRole).toBe(
      "button",
    );
  });

  it("back button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(
        getByTestId("notifications-dashboard-screen").props.style,
      ),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
