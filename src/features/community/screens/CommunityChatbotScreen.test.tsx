/**
 * CommunityChatbotScreen Tests
 * @task Task 3.14.10: Community Chatbot Screen (Screen 128)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { CommunityChatbotScreen } from "./CommunityChatbotScreen";

const defaultMessages = [
  {
    id: "m1",
    role: "user" as const,
    content: "Today has been tough. I can't shake off this feeling of sadness.",
  },
  {
    id: "m2",
    role: "assistant" as const,
    content:
      "Deep breathing exercises or even taking a short walk outside can sometimes help clear the mind.",
  },
  {
    id: "m3",
    role: "assistant" as const,
    content:
      "It's okay not to be okay, and reaching out like you did is a step in the right direction.",
  },
];

const defaultProps = {
  botName: "Doctor Solace.AI",
  chatsRemaining: "251 Chats Left",
  modelLabel: "Solace AI",
  messages: defaultMessages,
  inputText: "",
  onBack: jest.fn(),
  onSearch: jest.fn(),
  onInputChange: jest.fn(),
  onSend: jest.fn(),
  onMicPress: jest.fn(),
};

describe("CommunityChatbotScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the screen container", () => {
    const { getByTestId } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    expect(getByTestId("community-chatbot-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("community-chatbot-screen").props.style),
    );
    expect(flat.flex).toBe(1);
  });

  it("renders the back button", () => {
    const { getByTestId } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    fireEvent.press(getByTestId("back-button"));
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("displays the bot name", () => {
    const { getByText } = render(<CommunityChatbotScreen {...defaultProps} />);
    expect(getByText("Doctor Solace.AI")).toBeTruthy();
  });

  it("displays chats remaining", () => {
    const { getByText } = render(<CommunityChatbotScreen {...defaultProps} />);
    expect(getByText(/251 Chats Left/)).toBeTruthy();
  });

  it("displays model label", () => {
    const { getByText } = render(<CommunityChatbotScreen {...defaultProps} />);
    expect(getByText(/Solace AI/)).toBeTruthy();
  });

  it("renders all messages", () => {
    const { getByTestId } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    defaultMessages.forEach((msg) => {
      expect(getByTestId(`message-${msg.id}`)).toBeTruthy();
    });
  });

  it("displays message content", () => {
    const { getByText } = render(<CommunityChatbotScreen {...defaultProps} />);
    expect(getByText(/Today has been tough/)).toBeTruthy();
    expect(getByText(/Deep breathing exercises/)).toBeTruthy();
  });

  it("renders the text input", () => {
    const { getByTestId } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    expect(getByTestId("chat-input")).toBeTruthy();
  });

  it("renders the send button", () => {
    const { getByTestId } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    expect(getByTestId("send-button")).toBeTruthy();
  });

  it("calls onSend when send button is pressed", () => {
    const { getByTestId } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    fireEvent.press(getByTestId("send-button"));
    expect(defaultProps.onSend).toHaveBeenCalledTimes(1);
  });

  it("send button has accessibilityRole button", () => {
    const { getByTestId } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    expect(getByTestId("send-button").props.accessibilityRole).toBe("button");
  });

  it("renders the mic button", () => {
    const { getByTestId } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    expect(getByTestId("mic-button")).toBeTruthy();
  });

  it("calls onMicPress when mic button is pressed", () => {
    const { getByTestId } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    fireEvent.press(getByTestId("mic-button"));
    expect(defaultProps.onMicPress).toHaveBeenCalledTimes(1);
  });

  it("does not contain any Freud branding", () => {
    const { queryByText } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not reference GPT-6", () => {
    const { queryByText } = render(
      <CommunityChatbotScreen {...defaultProps} />,
    );
    expect(queryByText(/GPT-6/i)).toBeNull();
  });
});
