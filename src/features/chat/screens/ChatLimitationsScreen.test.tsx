/**
 * ChatLimitationsScreen Tests
 * @description Tests for chatbot limitations onboarding carousel
 * @task Task 3.6.5: Chat Limitations Screen (Screen 51)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ChatLimitationsScreen } from "./ChatLimitationsScreen";

describe("ChatLimitationsScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnPageChange = jest.fn();
  const mockOnSkip = jest.fn();
  const mockOnSendMessage = jest.fn();

  const defaultProps = {
    currentPage: 0,
    totalPages: 5,
    chatsRemaining: 251,
    modelName: "GPT-5",
    pages: [
      {
        id: "1",
        category: "Limitations",
        title: "Limited Knowledge",
        description:
          "AI assistants have knowledge limitations. Solace AI is trained on data up to a certain date.",
      },
      {
        id: "2",
        category: "Limitations",
        title: "No Medical Advice",
        description:
          "Solace AI cannot provide medical diagnoses or prescriptions. Always consult healthcare professionals.",
      },
      {
        id: "3",
        category: "Limitations",
        title: "Emotional Support Only",
        description:
          "While supportive, Solace AI is not a replacement for professional therapy or counseling.",
      },
      {
        id: "4",
        category: "Limitations",
        title: "Privacy Considerations",
        description:
          "Conversations are processed to improve responses. Please avoid sharing sensitive personal information.",
      },
      {
        id: "5",
        category: "Limitations",
        title: "Crisis Resources",
        description:
          "In crisis situations, please contact emergency services or mental health hotlines immediately.",
      },
    ],
    onBack: mockOnBack,
    onPageChange: mockOnPageChange,
    onSkip: mockOnSkip,
    onSendMessage: mockOnSendMessage,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByTestId("chat-limitations-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays Solace AI title", () => {
    const { getByText } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByText("Solace AI")).toBeTruthy();
  });

  it("displays chats remaining count", () => {
    const { getByText } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByText(/251 Chats Left/)).toBeTruthy();
  });

  it("displays model name", () => {
    const { getByText } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByText(/GPT-5/)).toBeTruthy();
  });

  it("displays search button", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByTestId("search-button")).toBeTruthy();
  });

  it("displays the robot illustration", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByTestId("robot-illustration")).toBeTruthy();
  });

  it("displays the category badge", () => {
    const { getByTestId, getByText } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByTestId("category-badge")).toBeTruthy();
    expect(getByText("Limitations")).toBeTruthy();
  });

  it("displays the current page title", () => {
    const { getByText } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByText("Limited Knowledge")).toBeTruthy();
  });

  it("displays the current page description", () => {
    const { getByText } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByText(/AI assistants have knowledge limitations/)).toBeTruthy();
  });

  it("displays pagination dots", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByTestId("pagination-dots")).toBeTruthy();
  });

  it("displays correct number of pagination dots", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    for (let i = 0; i < 5; i++) {
      expect(getByTestId(`dot-${i}`)).toBeTruthy();
    }
  });

  it("highlights active pagination dot", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    const activeDot = getByTestId("dot-0");
    const styles = Array.isArray(activeDot.props.style)
      ? activeDot.props.style.flat()
      : [activeDot.props.style];
    const dotStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(dotStyles.backgroundColor).toBe("#C4A574");
  });

  it("displays different page on page change", () => {
    const { getByText, rerender } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByText("Limited Knowledge")).toBeTruthy();

    rerender(<ChatLimitationsScreen {...defaultProps} currentPage={1} />);
    expect(getByText("No Medical Advice")).toBeTruthy();
  });

  it("displays the chat input area", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByTestId("chat-input-area")).toBeTruthy();
  });

  it("displays the attachment button", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByTestId("attachment-button")).toBeTruthy();
  });

  it("displays the text input", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByTestId("message-input")).toBeTruthy();
  });

  it("displays placeholder text in input", () => {
    const { getByPlaceholderText } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByPlaceholderText(/Type to start chatting/i)).toBeTruthy();
  });

  it("displays the send button", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByTestId("send-button")).toBeTruthy();
  });

  it("calls onSendMessage when message is sent", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    fireEvent.changeText(getByTestId("message-input"), "Hello");
    fireEvent.press(getByTestId("send-button"));
    expect(mockOnSendMessage).toHaveBeenCalledWith("Hello");
  });

  it("calls onSkip when typing in input (skip carousel)", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    fireEvent.changeText(getByTestId("message-input"), "H");
    expect(mockOnSkip).toHaveBeenCalled();
  });

  it("displays swipe hint", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(getByTestId("swipe-hint")).toBeTruthy();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    const container = getByTestId("chat-limitations-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
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
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
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
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("send button has proper accessibility", () => {
    const { getByTestId } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    const button = getByTestId("send-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Send message");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(
      <ChatLimitationsScreen {...defaultProps} />
    );
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });
});
