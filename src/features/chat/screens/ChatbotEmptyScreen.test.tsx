/**
 * ChatbotEmptyScreen Tests
 * @description Tests for chatbot empty state screen when user has no conversations
 * @task Task 3.6.1: Chatbot Empty Screen (Screen 47)
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ChatbotEmptyScreen } from "./ChatbotEmptyScreen";

describe("ChatbotEmptyScreen", () => {
  const mockOnBack = jest.fn();
  const mockOnNewConversation = jest.fn();

  const defaultProps = {
    onBack: mockOnBack,
    onNewConversation: mockOnNewConversation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    expect(getByTestId("chatbot-empty-screen")).toBeTruthy();
  });

  it("displays the back button", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("displays the screen title", () => {
    const { getByText } = render(<ChatbotEmptyScreen {...defaultProps} />);
    expect(getByText("Mindful AI Chatbot")).toBeTruthy();
  });

  it("displays the mascot illustration", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    expect(getByTestId("mascot-illustration")).toBeTruthy();
  });

  it("displays the empty state title with Solace AI", () => {
    const { getByText, queryByText } = render(
      <ChatbotEmptyScreen {...defaultProps} />
    );
    expect(getByText("Talk to Solace AI")).toBeTruthy();
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("displays the empty state description", () => {
    const { getByText } = render(<ChatbotEmptyScreen {...defaultProps} />);
    expect(
      getByText(/You have no AI conversations/i)
    ).toBeTruthy();
  });

  it("displays description with healthy message", () => {
    const { getByText } = render(<ChatbotEmptyScreen {...defaultProps} />);
    expect(
      getByText(/Get your mind healthy by starting a new one/i)
    ).toBeTruthy();
  });

  it("displays the new conversation button", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    expect(getByTestId("new-conversation-button")).toBeTruthy();
  });

  it("displays New Conversation text on button", () => {
    const { getByText } = render(<ChatbotEmptyScreen {...defaultProps} />);
    expect(getByText("New Conversation")).toBeTruthy();
  });

  it("calls onNewConversation when button is pressed", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    fireEvent.press(getByTestId("new-conversation-button"));
    expect(mockOnNewConversation).toHaveBeenCalledTimes(1);
  });

  it("displays plus icon on new conversation button", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    expect(getByTestId("new-conversation-icon")).toBeTruthy();
  });

  it("has dark background color", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    const container = getByTestId("chatbot-empty-screen");
    const styles = Array.isArray(container.props.style)
      ? container.props.style
      : [container.props.style];
    const hasBackgroundColor = styles.some(
      (s) => s?.backgroundColor === "#1C1410"
    );
    expect(hasBackgroundColor).toBe(true);
  });

  it("back button has minimum touch target size", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
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

  it("new conversation button has minimum touch target size", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    const button = getByTestId("new-conversation-button");
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
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    const button = getByTestId("back-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Go back");
  });

  it("new conversation button has proper accessibility", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    const button = getByTestId("new-conversation-button");
    expect(button.props.accessibilityRole).toBe("button");
    expect(button.props.accessibilityLabel).toBe("Start new conversation");
  });

  it("new conversation button has orange background", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    const button = getByTestId("new-conversation-button");
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
    expect(buttonStyles.backgroundColor).toBe("#E8853A");
  });

  it("shows loading state when isCreating is true", () => {
    const { getByText } = render(
      <ChatbotEmptyScreen {...defaultProps} isCreating={true} />
    );
    expect(getByText("Creating...")).toBeTruthy();
  });

  it("disables button when isCreating is true", () => {
    const { getByTestId } = render(
      <ChatbotEmptyScreen {...defaultProps} isCreating={true} />
    );
    const button = getByTestId("new-conversation-button");
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });

  it("content area is centered", () => {
    const { getByTestId } = render(<ChatbotEmptyScreen {...defaultProps} />);
    const contentArea = getByTestId("content-area");
    const styles = Array.isArray(contentArea.props.style)
      ? contentArea.props.style.flat()
      : [contentArea.props.style];
    const contentStyles = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown>) => ({
        ...acc,
        ...s,
      }),
      {}
    );
    expect(contentStyles.justifyContent).toBe("center");
    expect(contentStyles.alignItems).toBe("center");
  });

  it("does not use Freud in any visible text", () => {
    const { queryByText } = render(<ChatbotEmptyScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
    expect(queryByText(/doctor freud/i)).toBeNull();
  });
});
