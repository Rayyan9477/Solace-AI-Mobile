/**
 * ActiveChatScreen Tests
 * @description Tests for main AI chat conversation interface
 * @task Task 3.6.6: Active Chat Screen (Screen 52)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ActiveChatScreen } from "./ActiveChatScreen";

describe("ActiveChatScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnSendMessage = jest.fn();
  const mockOnAttachment = jest.fn();

  const mockMessages = [
    {
      id: "1",
      type: "user" as const,
      content: "I've been feeling stressed about work lately.",
      timestamp: new Date("2024-01-15T10:00:00"),
    },
    {
      id: "2",
      type: "user" as const,
      content: "It's hard to stay focused with so many deadlines.",
      timestamp: new Date("2024-01-15T10:01:00"),
    },
    {
      id: "emotion-1",
      type: "emotion" as const,
      emotions: ["Stress", "Anxiety"],
      sentiment: "negative" as const,
    },
    {
      id: "3",
      type: "ai" as const,
      content:
        "I understand work stress can be overwhelming. Let's work on some coping strategies together. Would you like to try a quick breathing exercise?",
      timestamp: new Date("2024-01-15T10:02:00"),
    },
    {
      id: "date-1",
      type: "date" as const,
      date: "Today",
    },
    {
      id: "4",
      type: "user" as const,
      content: "Thank you, that sounds helpful!",
      timestamp: new Date("2024-01-15T14:00:00"),
    },
    {
      id: "emotion-2",
      type: "emotion" as const,
      emotions: ["Hopeful"],
      sentiment: "positive" as const,
    },
    {
      id: "5",
      type: "ai" as const,
      content:
        "Great! I'm glad you're open to trying this. Remember, taking small steps is key to managing stress.",
      timestamp: new Date("2024-01-15T14:01:00"),
    },
  ];

  const defaultProps = {
    chatsRemaining: 251,
    modelName: "GPT-5",
    messages: mockMessages,
    isAITyping: false,
    inputText: "",
    onBack: mockOnBack,
    onSearch: mockOnSearch,
    onSendMessage: mockOnSendMessage,
    onAttachment: mockOnAttachment,
    onInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("active-chat-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays Solace AI title", () => {
    const { getByText } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByText("Solace AI")).toBeTruthy();
  });

  it("displays chats remaining count", () => {
    const { getByText } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByText(/251 Chats Left/)).toBeTruthy();
  });

  it("displays model name", () => {
    const { getByText } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByText(/GPT-5/)).toBeTruthy();
  });

  it("displays search button", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("search-button")).toBeTruthy();
  });

  it("calls onSearch when search button is pressed", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    fireEvent.press(getByTestId("search-button"));
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it("displays message list", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("message-list")).toBeTruthy();
  });

  it("displays user messages", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("message-1")).toBeTruthy();
  });

  it("displays AI messages", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("message-3")).toBeTruthy();
  });

  it("user messages are aligned to right", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    const message = getByTestId("message-1");
    const styles = Array.isArray(message.props.style)
      ? message.props.style.flat()
      : [message.props.style];
    const messageStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(messageStyles.alignSelf).toBe("flex-end");
  });

  it("AI messages are aligned to left", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    const message = getByTestId("message-3");
    const styles = Array.isArray(message.props.style)
      ? message.props.style.flat()
      : [message.props.style];
    const messageStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(messageStyles.alignSelf).toBe("flex-start");
  });

  it("displays user message content", () => {
    const { getByText } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByText(/feeling stressed about work/)).toBeTruthy();
  });

  it("displays AI message content", () => {
    const { getByText } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByText(/coping strategies together/)).toBeTruthy();
  });

  it("displays emotion badges", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("emotion-badge-emotion-1")).toBeTruthy();
  });

  it("displays emotion text in badge", () => {
    const { getByText } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByText(/Stress, Anxiety/)).toBeTruthy();
  });

  it("negative emotion badge has orange color", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    const badge = getByTestId("emotion-badge-emotion-1");
    const styles = Array.isArray(badge.props.style)
      ? badge.props.style.flat()
      : [badge.props.style];
    const badgeStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(badgeStyles.backgroundColor).toBe("#E8853A");
  });

  it("positive emotion badge has green color", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    const badge = getByTestId("emotion-badge-emotion-2");
    const styles = Array.isArray(badge.props.style)
      ? badge.props.style.flat()
      : [badge.props.style];
    const badgeStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(badgeStyles.backgroundColor).toBe("#9AAD5C");
  });

  it("displays date dividers", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("date-divider-date-1")).toBeTruthy();
  });

  it("displays date text in divider", () => {
    const { getByText } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByText("Today")).toBeTruthy();
  });

  it("displays AI avatar on AI messages", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("ai-avatar-3")).toBeTruthy();
  });

  it("displays user avatar on user messages", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("user-avatar-1")).toBeTruthy();
  });

  it("displays chat input area", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("chat-input-area")).toBeTruthy();
  });

  it("displays attachment button", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("attachment-button")).toBeTruthy();
  });

  it("calls onAttachment when attachment button is pressed", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    fireEvent.press(getByTestId("attachment-button"));
    expect(mockOnAttachment).toHaveBeenCalledTimes(1);
  });

  it("displays message input", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("message-input")).toBeTruthy();
  });

  it("displays send button", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(getByTestId("send-button")).toBeTruthy();
  });

  it("calls onSendMessage when send button is pressed", () => {
    const { getByTestId } = render(
      <ActiveChatScreen {...defaultProps} inputText="Hello" />
    );
    fireEvent.press(getByTestId("send-button"));
    expect(mockOnSendMessage).toHaveBeenCalledWith("Hello");
  });

  it("displays typing indicator when AI is typing", () => {
    const { getByTestId } = render(
      <ActiveChatScreen {...defaultProps} isAITyping={true} />
    );
    expect(getByTestId("typing-indicator")).toBeTruthy();
  });

  it("hides typing indicator when AI is not typing", () => {
    const { queryByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    expect(queryByTestId("typing-indicator")).toBeNull();
  });

  it("typing indicator shows Solace AI is thinking", () => {
    const { getByText } = render(
      <ActiveChatScreen {...defaultProps} isAITyping={true} />
    );
    expect(getByText(/Solace AI is thinking/)).toBeTruthy();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    const container = getByTestId("active-chat-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
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

  it("send button has minimum touch target size", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    const button = getByTestId("send-button");
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

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("send button has proper accessibility", () => {
    const { getByTestId } = render(<ActiveChatScreen {...defaultProps} />);
    const button = getByTestId("send-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Send message");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<ActiveChatScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });

  it("does not display inappropriate content", () => {
    const { queryByText } = render(<ActiveChatScreen {...defaultProps} />);
    expect(queryByText(/f\*\*\*/i)).toBeNull();
    expect(queryByText(/b\*\*\*\*/i)).toBeNull();
  });
});
