/**
 * SleepAnalysisScreen Tests
 * @description Tests for AI-generated sleep analysis interface with charts
 * @task Task 3.7.4: Sleep Analysis Screen (Screen 56)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { SleepAnalysisScreen } from "./SleepAnalysisScreen";

describe("SleepAnalysisScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnSearch = jest.fn();
  const mockOnSendMessage = jest.fn();
  const mockOnAttachment = jest.fn();
  const mockOnInputChange = jest.fn();
  const mockOnTimeRangeChange = jest.fn();
  const mockOnActionPress = jest.fn();
  const mockOnDownload = jest.fn();

  const mockSleepData = [
    { day: "Mon", quality: 60 },
    { day: "Tue", quality: 75 },
    { day: "Wed", quality: 80 },
    { day: "Thu", quality: 65 },
    { day: "Fri", quality: 90 },
    { day: "Sat", quality: 85 },
    { day: "Sun", quality: 70 },
  ];

  const mockActions = [
    { id: "suggestions", label: "Suggestions", icon: "💡" },
    { id: "meditate", label: "Meditate", icon: "🧘" },
    { id: "eat-well", label: "Eat Well", icon: "🥗" },
    { id: "exercise", label: "Exercise", icon: "🏃" },
  ];

  const mockMessages = [
    {
      id: "1",
      type: "user" as const,
      content: "I seem to have trouble sleeping lately. Have any suggestions?",
      timestamp: new Date("2024-01-15T10:00:00"),
    },
    {
      id: "2",
      type: "ai" as const,
      content: "Based on your sleep data over the last month, I would recommend 3x sessions of 25m sleep meditation before sleeping.",
      timestamp: new Date("2024-01-15T10:01:00"),
      sleepAnalysis: {
        data: mockSleepData,
        timeRange: "1year" as const,
        actions: mockActions,
      },
    },
    {
      id: "notification-1",
      type: "notification" as const,
      message: "Course Added: Sleep Meditation",
      icon: "⭐",
    },
    {
      id: "3",
      type: "user" as const,
      content: "Thank you! That's helpful!",
      timestamp: new Date("2024-01-15T10:02:00"),
    },
  ];

  const defaultProps = {
    chatsRemaining: 251,
    modelName: "GPT-5",
    messages: mockMessages,
    isAITyping: false,
    inputText: "",
    selectedTimeRange: "1year" as const,
    onBack: mockOnBack,
    onSearch: mockOnSearch,
    onSendMessage: mockOnSendMessage,
    onAttachment: mockOnAttachment,
    onInputChange: mockOnInputChange,
    onTimeRangeChange: mockOnTimeRangeChange,
    onActionPress: mockOnActionPress,
    onDownload: mockOnDownload,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("sleep-analysis-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays Solace AI title", () => {
    const { getByText } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByText("Solace AI")).toBeTruthy();
  });

  it("displays chats remaining count", () => {
    const { getByText } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByText(/251 Chats Left/)).toBeTruthy();
  });

  it("displays model name", () => {
    const { getByText } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByText(/GPT-5/)).toBeTruthy();
  });

  it("displays search button", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("search-button")).toBeTruthy();
  });

  it("displays message list", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("message-list")).toBeTruthy();
  });

  it("displays user messages", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("message-1")).toBeTruthy();
  });

  it("displays AI messages", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("message-2")).toBeTruthy();
  });

  it("displays sleep quality chart", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("sleep-chart")).toBeTruthy();
  });

  it("displays sleep quality label", () => {
    const { getByText } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByText(/Sleep Quality/)).toBeTruthy();
  });

  it("displays time range selector", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("time-range-selector")).toBeTruthy();
  });

  it("displays download button", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("download-button")).toBeTruthy();
  });

  it("calls onDownload when download button is pressed", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    fireEvent.press(getByTestId("download-button"));
    expect(mockOnDownload).toHaveBeenCalledTimes(1);
  });

  it("displays action buttons", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("action-suggestions")).toBeTruthy();
    expect(getByTestId("action-meditate")).toBeTruthy();
    expect(getByTestId("action-eat-well")).toBeTruthy();
    expect(getByTestId("action-exercise")).toBeTruthy();
  });

  it("displays action button labels", () => {
    const { getByText } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByText("Suggestions")).toBeTruthy();
    expect(getByText("Meditate")).toBeTruthy();
    expect(getByText("Eat Well")).toBeTruthy();
    expect(getByText("Exercise")).toBeTruthy();
  });

  it("calls onActionPress when action button is pressed", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    fireEvent.press(getByTestId("action-meditate"));
    expect(mockOnActionPress).toHaveBeenCalledWith("meditate");
  });

  it("displays success notification", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("notification-notification-1")).toBeTruthy();
  });

  it("displays notification message", () => {
    const { getByText } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByText(/Course Added/)).toBeTruthy();
  });

  it("displays chart bars", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("chart-bar-0")).toBeTruthy();
  });

  it("displays day labels", () => {
    const { getByText } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByText("Mon")).toBeTruthy();
    expect(getByText("Fri")).toBeTruthy();
  });

  it("user messages are aligned to right", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
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
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
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
      <SleepAnalysisScreen {...defaultProps} isAITyping={true} />
    );
    expect(getByTestId("typing-indicator")).toBeTruthy();
  });

  it("hides typing indicator when AI is not typing", () => {
    const { queryByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(queryByTestId("typing-indicator")).toBeNull();
  });

  it("displays chat input area", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("chat-input-area")).toBeTruthy();
  });

  it("displays attachment button", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("attachment-button")).toBeTruthy();
  });

  it("displays message input", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("message-input")).toBeTruthy();
  });

  it("displays send button", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("send-button")).toBeTruthy();
  });

  it("calls onSendMessage when send button is pressed", () => {
    const { getByTestId } = render(
      <SleepAnalysisScreen {...defaultProps} inputText="Hello" />
    );
    fireEvent.press(getByTestId("send-button"));
    expect(mockOnSendMessage).toHaveBeenCalledWith("Hello");
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    const container = getByTestId("sleep-analysis-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
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

  it("action button has minimum touch target size", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    const button = getByTestId("action-meditate");
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
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("action button has proper accessibility", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    const button = getByTestId("action-meditate");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Meditate");
  });

  it("download button has proper accessibility", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    const button = getByTestId("download-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Download chart");
  });

  it("displays AI avatar on AI messages", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("ai-avatar-2")).toBeTruthy();
  });

  it("displays user avatar on user messages", () => {
    const { getByTestId } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(getByTestId("user-avatar-1")).toBeTruthy();
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<SleepAnalysisScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });
});
