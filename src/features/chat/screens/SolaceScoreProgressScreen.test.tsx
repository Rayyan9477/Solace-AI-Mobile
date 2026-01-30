/**
 * SolaceScoreProgressScreen Tests
 * @description Tests for mental health score progression interface
 * @task Task 3.7.5: Solace Score Progress Screen (Screen 57)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SolaceScoreProgressScreen } from "./SolaceScoreProgressScreen";

describe("SolaceScoreProgressScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnSendMessage = jest.fn();
  const mockOnAttachment = jest.fn();
  const mockOnInputChange = jest.fn();
  const mockOnTimeRangeChange = jest.fn();

  const mockScoreData = [
    { date: "Week 1", score: 45 },
    { date: "Week 2", score: 52 },
    { date: "Week 3", score: 65 },
    { date: "Week 4", score: 88.5 },
  ];

  const mockMessages = [
    {
      id: "1",
      type: "user" as const,
      content: "What's my progress? Is my mental health improving?",
      timestamp: new Date("2024-01-15T10:00:00"),
    },
    {
      id: "2",
      type: "ai" as const,
      content: "Your Solace Score has increased to 88 last month. That's almost +285% increase from 6 months ago! Congratulations! You're getting better!",
      timestamp: new Date("2024-01-15T10:01:00"),
      scoreProgress: {
        data: mockScoreData,
        currentScore: 88.5,
        previousScore: 45,
        changePercent: 285,
        timeRange: "1month" as const,
      },
    },
    {
      id: "3",
      type: "user" as const,
      content: "That's amazing! Thanks for the encouragement!",
      timestamp: new Date("2024-01-15T10:02:00"),
    },
  ];

  const defaultProps = {
    chatsRemaining: 251,
    modelName: "GPT-5",
    messages: mockMessages,
    isAITyping: false,
    inputText: "",
    selectedTimeRange: "1month" as const,
    onBack: mockOnBack,
    onSearch: mockOnSearch,
    onSendMessage: mockOnSendMessage,
    onAttachment: mockOnAttachment,
    onInputChange: mockOnInputChange,
    onTimeRangeChange: mockOnTimeRangeChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("solace-score-progress-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays Solace AI title", () => {
    const { getByText } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByText("Solace AI")).toBeTruthy();
  });

  it("displays chats remaining count", () => {
    const { getByText } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByText(/251 Chats Left/)).toBeTruthy();
  });

  it("displays model name", () => {
    const { getByText } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByText(/GPT-5/)).toBeTruthy();
  });

  it("displays search button", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("search-button")).toBeTruthy();
  });

  it("displays message list", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("message-list")).toBeTruthy();
  });

  it("displays user messages", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("message-1")).toBeTruthy();
  });

  it("displays AI messages", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("message-2")).toBeTruthy();
  });

  it("displays AI message content", () => {
    const { getByText } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByText(/Solace Score has increased/)).toBeTruthy();
  });

  it("displays congratulatory message", () => {
    const { getByText } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByText(/Congratulations/)).toBeTruthy();
  });

  it("displays score chart", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("score-chart")).toBeTruthy();
  });

  it("displays Solace Score label", () => {
    const { getAllByText } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    const elements = getAllByText(/Solace Score/);
    expect(elements.length).toBeGreaterThan(0);
  });

  it("displays time range selector", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("time-range-selector")).toBeTruthy();
  });

  it("displays current score value", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("current-score")).toBeTruthy();
  });

  it("displays score value 88.5", () => {
    const { getByText } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByText("88.5")).toBeTruthy();
  });

  it("displays chart line", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("chart-line")).toBeTruthy();
  });

  it("user messages are aligned to right", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
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
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
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
      <SolaceScoreProgressScreen {...defaultProps} isAITyping={true} />
    );
    expect(getByTestId("typing-indicator")).toBeTruthy();
  });

  it("hides typing indicator when AI is not typing", () => {
    const { queryByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(queryByTestId("typing-indicator")).toBeNull();
  });

  it("displays chat input area", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("chat-input-area")).toBeTruthy();
  });

  it("displays attachment button", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("attachment-button")).toBeTruthy();
  });

  it("displays message input", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("message-input")).toBeTruthy();
  });

  it("displays send button", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("send-button")).toBeTruthy();
  });

  it("calls onSendMessage when send button is pressed", () => {
    const { getByTestId } = render(
      <SolaceScoreProgressScreen {...defaultProps} inputText="Hello" />
    );
    fireEvent.press(getByTestId("send-button"));
    expect(mockOnSendMessage).toHaveBeenCalledWith("Hello");
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    const container = getByTestId("solace-score-progress-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
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

  it("back button has proper accessibility", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("displays AI avatar on AI messages", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("ai-avatar-2")).toBeTruthy();
  });

  it("displays user avatar on user messages", () => {
    const { getByTestId } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(getByTestId("user-avatar-1")).toBeTruthy();
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });

  it("uses Solace Score instead of Freud Score", () => {
    const { getAllByText } = render(<SolaceScoreProgressScreen {...defaultProps} />);
    const elements = getAllByText(/Solace Score/);
    expect(elements.length).toBeGreaterThan(0);
  });
});
