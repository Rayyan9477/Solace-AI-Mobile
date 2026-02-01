/**
 * LiveChatSupportScreen Tests
 * @description Tests for live chat conversation interface
 * @task Task 3.17.12: Live Chat Support Screen (Screen 151)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { LiveChatSupportScreen } from "./LiveChatSupportScreen";

const defaultProps = {
  messages: [
    {
      id: "1",
      type: "user" as const,
      content: "Hi, I need some help with the app.",
    },
    {
      id: "2",
      type: "agent" as const,
      content: "Hello! I'd be happy to help. Could you describe the issue?",
    },
    {
      id: "3",
      type: "user" as const,
      content: "That sounds straightforward, thank you.",
    },
  ],
  inputText: "",
  onBack: jest.fn(),
  onInputChange: jest.fn(),
  onSend: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<LiveChatSupportScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("LiveChatSupportScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("live-chat-support-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders 'Live Chat Support' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Live Chat Support")).toBeTruthy();
  });

  it("renders user messages", () => {
    const { getByText } = renderScreen();
    expect(getByText(/need some help/)).toBeTruthy();
    expect(getByText(/sounds straightforward/)).toBeTruthy();
  });

  it("renders agent messages", () => {
    const { getByText } = renderScreen();
    expect(getByText(/happy to help/)).toBeTruthy();
  });

  it("renders message bubbles", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("message-1")).toBeTruthy();
    expect(getByTestId("message-2")).toBeTruthy();
    expect(getByTestId("message-3")).toBeTruthy();
  });

  it("renders the chat input", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("chat-input")).toBeTruthy();
  });

  it("renders the send button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("send-button")).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onInputChange when input text changes", () => {
    const onInputChange = jest.fn();
    const { getByTestId } = renderScreen({ onInputChange });
    fireEvent.changeText(getByTestId("chat-input"), "Hello");
    expect(onInputChange).toHaveBeenCalledWith("Hello");
  });

  it("calls onSend when send button is pressed", () => {
    const onSend = jest.fn();
    const { getByTestId } = renderScreen({ onSend });
    fireEvent.press(getByTestId("send-button"));
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("send button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("send-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("live-chat-support-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
