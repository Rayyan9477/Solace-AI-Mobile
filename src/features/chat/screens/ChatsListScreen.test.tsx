/**
 * ChatsListScreen Tests
 * @description Tests for AI chats list with Recent and Trash tabs
 * @task Task 3.6.3: Chats List Screen (Screen 49)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ChatsListScreen } from "./ChatsListScreen";

describe("ChatsListScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnTabChange = jest.fn();
  const mockOnChatPress = jest.fn();
  const mockOnSeeAllRecent = jest.fn();
  const mockOnSeeAllTrash = jest.fn();

  const mockRecentChats = [
    {
      id: "1",
      title: "Work stress and deadlines",
      messageCount: 478,
      mood: "Anxious",
      moodColor: "#E8853A",
    },
    {
      id: "2",
      title: "Feeling better about life",
      messageCount: 55,
      mood: "Happy",
      moodColor: "#9AAD5C",
    },
    {
      id: "3",
      title: "Morning mindfulness routine",
      messageCount: 17,
      mood: "Calm",
      moodColor: "#4A9E8C",
    },
  ];

  const mockTrashChats = [
    {
      id: "4",
      title: "Old conversation about sleep",
      messageCount: 8,
      mood: "Neutral",
      moodColor: "#9E9E9E",
    },
    {
      id: "5",
      title: "Previous journaling session",
      messageCount: 1,
      mood: "Reflective",
      moodColor: "#7B68B5",
    },
  ];

  const defaultProps = {
    recentChats: mockRecentChats,
    trashChats: mockTrashChats,
    recentCount: 4,
    trashCount: 16,
    activeTab: "recent" as const,
    onBack: mockOnBack,
    onTabChange: mockOnTabChange,
    onChatPress: mockOnChatPress,
    onSeeAllRecent: mockOnSeeAllRecent,
    onSeeAllTrash: mockOnSeeAllTrash,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("chats-list-screen")).toBeTruthy();
  });

  it("displays the header section", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("header-section")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the screen title", () => {
    const { getByText } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByText("My AI Chats")).toBeTruthy();
  });

  it("displays the segmented control", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("segmented-control")).toBeTruthy();
  });

  it("displays Recent tab", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("tab-recent")).toBeTruthy();
  });

  it("displays Trash tab", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("tab-trash")).toBeTruthy();
  });

  it("calls onTabChange with recent when Recent tab is pressed", () => {
    const { getByTestId } = render(
      <ChatsListScreen {...defaultProps} activeTab="trash" />
    );
    fireEvent.press(getByTestId("tab-recent"));
    expect(mockOnTabChange).toHaveBeenCalledWith("recent");
  });

  it("calls onTabChange with trash when Trash tab is pressed", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    fireEvent.press(getByTestId("tab-trash"));
    expect(mockOnTabChange).toHaveBeenCalledWith("trash");
  });

  it("highlights active tab", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    const recentTab = getByTestId("tab-recent");
    const styles = Array.isArray(recentTab.props.style)
      ? recentTab.props.style.flat()
      : [recentTab.props.style];
    const tabStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(tabStyles.backgroundColor).toBe("#FFFFFF");
  });

  it("displays Recent section header with count", () => {
    const { getByText } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByText(/Recent.*\(4\)/)).toBeTruthy();
  });

  it("displays See All link in Recent section", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("see-all-recent")).toBeTruthy();
  });

  it("calls onSeeAllRecent when See All is pressed", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    fireEvent.press(getByTestId("see-all-recent"));
    expect(mockOnSeeAllRecent).toHaveBeenCalledTimes(1);
  });

  it("displays recent chat items", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("chat-item-1")).toBeTruthy();
    expect(getByTestId("chat-item-2")).toBeTruthy();
    expect(getByTestId("chat-item-3")).toBeTruthy();
  });

  it("displays chat item title", () => {
    const { getByText } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByText(/Work stress and deadlines/)).toBeTruthy();
  });

  it("displays chat item message count", () => {
    const { getByText } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByText(/478 Total/)).toBeTruthy();
  });

  it("displays mood badge on chat item", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("mood-badge-1")).toBeTruthy();
  });

  it("displays mood text in badge", () => {
    const { getByText } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByText("Anxious")).toBeTruthy();
  });

  it("calls onChatPress with chat id when item is pressed", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    fireEvent.press(getByTestId("chat-item-1"));
    expect(mockOnChatPress).toHaveBeenCalledWith("1");
  });

  it("displays Trash section header with count", () => {
    const { getByText } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByText(/Trash.*\(16\)/)).toBeTruthy();
  });

  it("displays See All link in Trash section", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("see-all-trash")).toBeTruthy();
  });

  it("calls onSeeAllTrash when See All is pressed", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    fireEvent.press(getByTestId("see-all-trash"));
    expect(mockOnSeeAllTrash).toHaveBeenCalledTimes(1);
  });

  it("displays trash chat items", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("chat-item-4")).toBeTruthy();
    expect(getByTestId("chat-item-5")).toBeTruthy();
  });

  it("displays avatar for chat item", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("chat-avatar-1")).toBeTruthy();
  });

  it("displays chevron on chat items", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    expect(getByTestId("chat-chevron-1")).toBeTruthy();
  });

  it("has orange gradient header background", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    const header = getByTestId("header-section");
    const styles = Array.isArray(header.props.style)
      ? header.props.style
      : [header.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#E8853A"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("has dark background for content area", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    const content = getByTestId("content-area");
    const styles = Array.isArray(content.props.style)
      ? content.props.style
      : [content.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    const styles = Array.isArray(button.props.style)
      ? button.props.style.flat()
      : [button.props.style];
    const buttonStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("chat items have minimum touch target size", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    const item = getByTestId("chat-item-1");
    const styles = Array.isArray(item.props.style)
      ? item.props.style.flat()
      : [item.props.style];
    const itemStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(itemStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("tab buttons have proper accessibility", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    const tab = getByTestId("tab-recent");
    expect(tab.props.accessibilityRole).toBe("tab");
  });

  it("chat items have proper accessibility", () => {
    const { getByTestId } = render(<ChatsListScreen {...defaultProps} />);
    const item = getByTestId("chat-item-1");
    expect(item.props.accessibilityRole).toBe("button");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<ChatsListScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not display inappropriate content", () => {
    const { queryByText } = render(<ChatsListScreen {...defaultProps} />);
    expect(queryByText(/suicid/i)).toBeNull();
    expect(queryByText(/kill/i)).toBeNull();
    expect(queryByText(/xan/i)).toBeNull();
  });
});
