/**
 * BookRecommendationsScreen Tests
 * @description Tests for AI-generated book recommendations interface
 * @task Task 3.7.3: Book Recommendations Screen (Screen 55)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { BookRecommendationsScreen } from "./BookRecommendationsScreen";

describe("BookRecommendationsScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnSendMessage = jest.fn();
  const mockOnAttachment = jest.fn();
  const mockOnInputChange = jest.fn();
  const mockOnBookPress = jest.fn();

  const mockBooks = [
    {
      id: "book-1",
      title: "The Noonday Demon",
      author: "Andrew Solomon",
      pageCount: 96,
      colorTheme: "tan" as const,
    },
    {
      id: "book-2",
      title: "Lost Connections",
      author: "Johann Hari",
      pageCount: 82,
      colorTheme: "orange" as const,
    },
    {
      id: "book-3",
      title: "Stop Overthinking",
      author: "Chase Hill",
      pageCount: 78,
      colorTheme: "teal" as const,
    },
  ];

  const mockMessages = [
    {
      id: "1",
      type: "user" as const,
      content: "Can you suggest some mental health books that are short and easy to read?",
      timestamp: new Date("2024-01-15T10:00:00"),
    },
    {
      id: "2",
      type: "user" as const,
      content: "Needs to be under 100 pages and can be read within 30 minutes!",
      timestamp: new Date("2024-01-15T10:01:00"),
    },
    {
      id: "3",
      type: "ai" as const,
      content: "Here are a few mental health books for you with less than 100 pages!",
      timestamp: new Date("2024-01-15T10:02:00"),
      books: mockBooks,
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
    onBookPress: mockOnBookPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("book-recommendations-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays Solace AI title", () => {
    const { getByText } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByText("Solace AI")).toBeTruthy();
  });

  it("displays chats remaining count", () => {
    const { getByText } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByText(/251 Chats Left/)).toBeTruthy();
  });

  it("displays model name", () => {
    const { getByText } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByText(/GPT-5/)).toBeTruthy();
  });

  it("displays search button", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("search-button")).toBeTruthy();
  });

  it("calls onSearch when search button is pressed", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("search-button"));
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  it("displays message list", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("message-list")).toBeTruthy();
  });

  it("displays user messages", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("message-1")).toBeTruthy();
  });

  it("displays AI messages", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("message-3")).toBeTruthy();
  });

  it("displays user message content", () => {
    const { getByText } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByText(/short and easy to read/)).toBeTruthy();
  });

  it("displays AI message content", () => {
    const { getByText } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByText(/mental health books for you/)).toBeTruthy();
  });

  it("displays book recommendation cards", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("book-card-book-1")).toBeTruthy();
    expect(getByTestId("book-card-book-2")).toBeTruthy();
    expect(getByTestId("book-card-book-3")).toBeTruthy();
  });

  it("displays book titles", () => {
    const { getByText } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByText("The Noonday Demon")).toBeTruthy();
    expect(getByText("Lost Connections")).toBeTruthy();
    expect(getByText("Stop Overthinking")).toBeTruthy();
  });

  it("displays book authors", () => {
    const { getByText } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByText(/Andrew Solomon/)).toBeTruthy();
    expect(getByText(/Johann Hari/)).toBeTruthy();
    expect(getByText(/Chase Hill/)).toBeTruthy();
  });

  it("displays book page counts", () => {
    const { getByText } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByText(/96p/)).toBeTruthy();
    expect(getByText(/82p/)).toBeTruthy();
    expect(getByText(/78p/)).toBeTruthy();
  });

  it("displays book icons", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("book-icon-book-1")).toBeTruthy();
    expect(getByTestId("book-icon-book-2")).toBeTruthy();
    expect(getByTestId("book-icon-book-3")).toBeTruthy();
  });

  it("displays progress bars for books", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("book-progress-book-1")).toBeTruthy();
  });

  it("calls onBookPress when book card is pressed", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("book-card-book-1"));
    expect(mockOnBookPress).toHaveBeenCalledWith("book-1");
  });

  it("user messages are aligned to right", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
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
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
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

  it("displays typing indicator when AI is typing", () => {
    const { getByTestId } = render(
      <BookRecommendationsScreen {...defaultProps} isAITyping={true} />
    );
    expect(getByTestId("typing-indicator")).toBeTruthy();
  });

  it("hides typing indicator when AI is not typing", () => {
    const { queryByTestId } = render(
      <BookRecommendationsScreen {...defaultProps} />
    );
    expect(queryByTestId("typing-indicator")).toBeNull();
  });

  it("typing indicator shows Solace AI is thinking", () => {
    const { getByText } = render(
      <BookRecommendationsScreen {...defaultProps} isAITyping={true} />
    );
    expect(getByText(/Solace AI is thinking/)).toBeTruthy();
  });

  it("displays chat input area", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("chat-input-area")).toBeTruthy();
  });

  it("displays attachment button", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("attachment-button")).toBeTruthy();
  });

  it("calls onAttachment when attachment button is pressed", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    fireEvent.press(getByTestId("attachment-button"));
    expect(mockOnAttachment).toHaveBeenCalledTimes(1);
  });

  it("displays message input", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("message-input")).toBeTruthy();
  });

  it("displays send button", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("send-button")).toBeTruthy();
  });

  it("calls onSendMessage when send button is pressed", () => {
    const { getByTestId } = render(
      <BookRecommendationsScreen {...defaultProps} inputText="Hello" />
    );
    fireEvent.press(getByTestId("send-button"));
    expect(mockOnSendMessage).toHaveBeenCalledWith("Hello");
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    const container = getByTestId("book-recommendations-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
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

  it("book card has minimum touch target size", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    const card = getByTestId("book-card-book-1");
    const styles = Array.isArray(card.props.style)
      ? card.props.style.flat()
      : [card.props.style];
    const cardStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(cardStyles.minHeight).toBeGreaterThanOrEqual(44);
  });

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("book card has proper accessibility", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    const card = getByTestId("book-card-book-1");
    expect(card.props.accessibilityRole).toBe("button");
    expect(card.props.accessibilityLabel).toBe("View The Noonday Demon");
  });

  it("displays AI avatar on AI messages", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("ai-avatar-3")).toBeTruthy();
  });

  it("displays user avatar on user messages", () => {
    const { getByTestId } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(getByTestId("user-avatar-1")).toBeTruthy();
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });

  it("does not display inappropriate content", () => {
    const { queryByText } = render(<BookRecommendationsScreen {...defaultProps} />);
    expect(queryByText(/f\*\*\*/i)).toBeNull();
    expect(queryByText(/b\*\*\*\*/i)).toBeNull();
  });
});
