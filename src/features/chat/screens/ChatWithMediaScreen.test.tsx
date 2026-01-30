/**
 * ChatWithMediaScreen Tests
 * @description Tests for chat interface with embedded media content
 * @task Task 3.7.1: Chat With Media Screen (Screen 53)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ChatWithMediaScreen } from "./ChatWithMediaScreen";

describe("ChatWithMediaScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnSendMessage = jest.fn();
  const mockOnAttachment = jest.fn();
  const mockOnInputChange = jest.fn();
  const mockOnPlayVideo = jest.fn();

  const mockMessages = [
    {
      id: "1",
      type: "user" as const,
      content: "Can you suggest some mindfulness resources?",
      timestamp: new Date("2024-01-15T10:00:00"),
    },
    {
      id: "2",
      type: "ai" as const,
      content:
        "Of course! Here's a great mindfulness course I recommend for you.",
      timestamp: new Date("2024-01-15T10:01:00"),
      media: {
        id: "video-1",
        type: "video" as const,
        title: "Mindfulness Course #1",
        thumbnail: "https://example.com/thumbnail.jpg",
        duration: "8:00",
      },
    },
    {
      id: "3",
      type: "user" as const,
      content: "Thanks! That looks helpful.",
      timestamp: new Date("2024-01-15T10:02:00"),
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
    onInputChange: mockOnInputChange,
    onPlayVideo: mockOnPlayVideo,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("chat-with-media-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays Solace AI title", () => {
    const { getByText } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByText("Solace AI")).toBeTruthy();
  });

  it("displays chats remaining count", () => {
    const { getByText } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByText(/251 Chats Left/)).toBeTruthy();
  });

  it("displays model name", () => {
    const { getByText } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByText(/GPT-5/)).toBeTruthy();
  });

  it("displays search button", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("search-button")).toBeTruthy();
  });

  it("calls onSearch when search button is pressed", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    fireEvent.press(getByTestId("search-button"));
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it("displays message list", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("message-list")).toBeTruthy();
  });

  it("displays user messages", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("message-1")).toBeTruthy();
  });

  it("displays AI messages", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("message-2")).toBeTruthy();
  });

  it("displays user message content", () => {
    const { getByText } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByText(/mindfulness resources/)).toBeTruthy();
  });

  it("displays AI message content", () => {
    const { getByText } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByText(/mindfulness course I recommend/)).toBeTruthy();
  });

  it("displays embedded video card in AI message", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("video-card-video-1")).toBeTruthy();
  });

  it("displays video thumbnail", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("video-thumbnail-video-1")).toBeTruthy();
  });

  it("displays video play button", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("video-play-button-video-1")).toBeTruthy();
  });

  it("displays video title", () => {
    const { getByText } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByText("Mindfulness Course #1")).toBeTruthy();
  });

  it("displays video duration", () => {
    const { getByText } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByText("8:00")).toBeTruthy();
  });

  it("calls onPlayVideo when play button is pressed", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    fireEvent.press(getByTestId("video-play-button-video-1"));
    expect(mockOnPlayVideo).toHaveBeenCalledWith("video-1");
  });

  it("calls onPlayVideo when video card is pressed", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    fireEvent.press(getByTestId("video-card-video-1"));
    expect(mockOnPlayVideo).toHaveBeenCalledWith("video-1");
  });

  it("user messages are aligned to right", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
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
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    const message = getByTestId("message-2");
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

  it("displays typing indicator when AI is typing", () => {
    const { getByTestId } = render(
      <ChatWithMediaScreen {...defaultProps} isAITyping={true} />
    );
    expect(getByTestId("typing-indicator")).toBeTruthy();
  });

  it("hides typing indicator when AI is not typing", () => {
    const { queryByTestId } = render(
      <ChatWithMediaScreen {...defaultProps} />
    );
    expect(queryByTestId("typing-indicator")).toBeNull();
  });

  it("typing indicator shows Solace AI is thinking", () => {
    const { getByText } = render(
      <ChatWithMediaScreen {...defaultProps} isAITyping={true} />
    );
    expect(getByText(/Solace AI is thinking/)).toBeTruthy();
  });

  it("displays chat input area", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("chat-input-area")).toBeTruthy();
  });

  it("displays attachment button", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("attachment-button")).toBeTruthy();
  });

  it("calls onAttachment when attachment button is pressed", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    fireEvent.press(getByTestId("attachment-button"));
    expect(mockOnAttachment).toHaveBeenCalledTimes(1);
  });

  it("displays message input", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("message-input")).toBeTruthy();
  });

  it("displays send button", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("send-button")).toBeTruthy();
  });

  it("calls onSendMessage when send button is pressed", () => {
    const { getByTestId } = render(
      <ChatWithMediaScreen {...defaultProps} inputText="Hello" />
    );
    fireEvent.press(getByTestId("send-button"));
    expect(mockOnSendMessage).toHaveBeenCalledWith("Hello");
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    const container = getByTestId("chat-with-media-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
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
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
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

  it("video play button has minimum touch target size", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    const button = getByTestId("video-play-button-video-1");
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
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("send button has proper accessibility", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    const button = getByTestId("send-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Send message");
  });

  it("video play button has proper accessibility", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    const button = getByTestId("video-play-button-video-1");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Play video");
  });

  it("displays AI avatar on AI messages", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("ai-avatar-2")).toBeTruthy();
  });

  it("displays user avatar on user messages", () => {
    const { getByTestId } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(getByTestId("user-avatar-1")).toBeTruthy();
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });

  it("does not display inappropriate content", () => {
    const { queryByText } = render(<ChatWithMediaScreen {...defaultProps} />);
    expect(queryByText(/f\*\*\*/i)).toBeNull();
    expect(queryByText(/b\*\*\*\*/i)).toBeNull();
    expect(queryByText(/hannibal/i)).toBeNull();
  });
});
