import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";
import { NotificationCard } from "./NotificationCard";
import { formatNotificationTime, getNotificationSection } from "./NotificationCard.types";

describe("NotificationCard", () => {
  const mockOnPress = jest.fn();

  const defaultProps = {
    id: "notif-1",
    type: "message" as const,
    icon: <Text>📧</Text>,
    iconColor: "#9AAD5C",
    title: "Message from Dr Freud AI",
    description: "Dr Freud Uncalled Messages 😊",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    onPress: mockOnPress,
    testID: "notification-card",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component", () => {
    const { getByTestId } = render(<NotificationCard {...defaultProps} />);
    expect(getByTestId("notification-card")).toBeTruthy();
  });

  it("displays the title", () => {
    const { getByText } = render(<NotificationCard {...defaultProps} />);
    expect(getByText("Message from Dr Freud AI")).toBeTruthy();
  });

  it("displays the description", () => {
    const { getByText } = render(<NotificationCard {...defaultProps} />);
    expect(getByText("Dr Freud Uncalled Messages 😊")).toBeTruthy();
  });

  it("displays the icon", () => {
    const { getByText } = render(<NotificationCard {...defaultProps} />);
    expect(getByText("📧")).toBeTruthy();
  });

  it("formats and displays timestamp", () => {
    const { getByText } = render(<NotificationCard {...defaultProps} />);
    expect(getByText("1h ago")).toBeTruthy();
  });

  it("displays optional badge", () => {
    const { getByText } = render(<NotificationCard {...defaultProps} badge="6:02" />);
    expect(getByText("6:02")).toBeTruthy();
  });

  it("shows unread indicator when isRead is false", () => {
    const { getByTestId } = render(<NotificationCard {...defaultProps} isRead={false} />);
    const unreadIndicator = getByTestId("unread-indicator");
    expect(unreadIndicator).toBeTruthy();
  });

  it("hides unread indicator when isRead is true", () => {
    const { queryByTestId } = render(<NotificationCard {...defaultProps} isRead={true} />);
    expect(queryByTestId("unread-indicator")).toBeNull();
  });

  it("calls onPress when tapped", () => {
    const { getByTestId } = render(<NotificationCard {...defaultProps} />);
    fireEvent.press(getByTestId("notification-card"));
    expect(mockOnPress).toHaveBeenCalledWith("notif-1");
  });

  it("renders as View when no onPress provided", () => {
    const { getByTestId } = render(<NotificationCard {...defaultProps} onPress={undefined} />);
    const card = getByTestId("notification-card");
    expect(card.type).not.toBe("TouchableOpacity");
  });

  it("applies custom styles", () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(<NotificationCard {...defaultProps} style={customStyle} />);
    const card = getByTestId("notification-card");
    expect(card.props.style).toEqual(expect.objectContaining(customStyle));
  });

  it("has correct accessibility role", () => {
    const { getByTestId } = render(<NotificationCard {...defaultProps} />);
    const card = getByTestId("notification-card");
    expect(card.props.accessibilityRole).toBe("button");
  });

  it("uses custom accessibilityLabel if provided", () => {
    const { getByTestId } = render(<NotificationCard {...defaultProps} accessibilityLabel="Custom label" />);
    const card = getByTestId("notification-card");
    expect(card.props.accessibilityLabel).toBe("Custom label");
  });

  it("uses default accessibilityLabel based on title", () => {
    const { getByTestId } = render(<NotificationCard {...defaultProps} />);
    const card = getByTestId("notification-card");
    expect(card.props.accessibilityLabel).toBe("Notification: Message from Dr Freud AI");
  });

  it("displays icon with correct background color", () => {
    const { getByTestId } = render(<NotificationCard {...defaultProps} />);
    const iconContainer = getByTestId("icon-container");
    const styles = Array.isArray(iconContainer.props.style) ? iconContainer.props.style : [iconContainer.props.style];
    const hasBackgroundColor = styles.some((s) => s?.backgroundColor === "#9AAD5C");
    expect(hasBackgroundColor).toBe(true);
  });

  it("handles different notification types", () => {
    const types = ["message", "journal", "exercise", "health", "mood", "stress", "recommendation"] as const;
    types.forEach((type) => {
      const { getByTestId } = render(<NotificationCard {...defaultProps} type={type} testID={`notif-${type}`} />);
      expect(getByTestId(`notif-${type}`)).toBeTruthy();
    });
  });
});

// Helper function tests
describe("NotificationCard Helper Functions", () => {
  describe("formatNotificationTime", () => {
    it("formats 'Just now' for very recent notifications", () => {
      const date = new Date();
      expect(formatNotificationTime(date)).toBe("Just now");
    });

    it("formats minutes ago", () => {
      const date = new Date(Date.now() - 5 * 60000); // 5 minutes ago
      expect(formatNotificationTime(date)).toBe("5m ago");
    });

    it("formats hours ago", () => {
      const date = new Date(Date.now() - 2 * 3600000); // 2 hours ago
      expect(formatNotificationTime(date)).toBe("2h ago");
    });

    it("formats 'Yesterday' for 1 day ago", () => {
      const date = new Date(Date.now() - 24 * 3600000); // 1 day ago
      expect(formatNotificationTime(date)).toBe("Yesterday");
    });

    it("formats days ago", () => {
      const date = new Date(Date.now() - 3 * 24 * 3600000); // 3 days ago
      expect(formatNotificationTime(date)).toBe("3d ago");
    });

    it("formats weeks ago", () => {
      const date = new Date(Date.now() - 2 * 7 * 24 * 3600000); // 2 weeks ago
      expect(formatNotificationTime(date)).toBe("2w ago");
    });
  });

  describe("getNotificationSection", () => {
    it("returns 'Earlier This Day' for recent notifications", () => {
      const date = new Date(Date.now() - 2 * 3600000); // 2 hours ago
      expect(getNotificationSection(date)).toBe("Earlier This Day");
    });

    it("returns 'Last Week' for notifications from last week", () => {
      const date = new Date(Date.now() - 3 * 24 * 3600000); // 3 days ago
      expect(getNotificationSection(date)).toBe("Last Week");
    });

    it("returns 'Earlier' for older notifications", () => {
      const date = new Date(Date.now() - 10 * 24 * 3600000); // 10 days ago
      expect(getNotificationSection(date)).toBe("Earlier");
    });
  });
});
