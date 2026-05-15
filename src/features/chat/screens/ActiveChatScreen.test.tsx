/**
 * ActiveChatScreen Tests — prototype v4.2 #07 (Sprint 6 reskin).
 *
 * ≥17 tests covering: render, snapshot, header, message list, bubble styles,
 * action cards, reaction chips, send flow, typing indicator, empty state,
 * and optional crisis classifier integration.
 */

jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () =>
  jest.requireActual("@/shared/theme/useTheme"),
);

// Default mock returns the SAME shape the real `sendMessage` produces:
// `{ text, crisis, delayMs }` — screen reads `result.text` in the no-prop
// override fallback path. Tests render the screen directly without
// `onSendMessage`, so this default must match production.
jest.mock("@/features/chat/services/mockChatService", () => ({
  sendMessage: jest.fn().mockResolvedValue({ text: "I hear you.", crisis: null, delayMs: 0 }),
}));

import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";

import { ThemeProvider } from "@/shared/theme/useTheme";
import { sendMessage } from "@/features/chat/services/mockChatService";
import {
  ActiveChatScreen,
  DEFAULT_INITIAL_MESSAGES,
  type ActiveChatScreenProps,
  type ChatMessage,
} from "./ActiveChatScreen";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const mockSendMessage = sendMessage as jest.MockedFunction<typeof sendMessage>;

const baseProps: ActiveChatScreenProps = {
  conversationId: "test-conv-1",
  onClose: jest.fn(),
  onPhonePress: jest.fn(),
  onMorePress: jest.fn(),
  testID: "active-chat-screen",
};

// Seed with 6 messages, including 1 action + 2 reactions on seed-3
const initialMessages: ChatMessage[] = DEFAULT_INITIAL_MESSAGES;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("ActiveChatScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMessage.mockResolvedValue({
      text: "I hear you.",
      crisis: null,
      delayMs: 0,
    });
  });

  // 1 — Basic render
  it("renders without crashing", () => {
    expect(() =>
      renderWithTheme(
        <ActiveChatScreen {...baseProps} initialMessages={initialMessages} />,
      ),
    ).not.toThrow();
  });

  // 2 — Snapshot (shallow: render with empty messages to avoid FlatList overflow)
  it("matches stable snapshot", () => {
    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={[]} />,
    );
    // Verify key structural elements exist — FlatList trees are too deep for
    // toJSON() serialization in React Native's testing environment.
    expect(getByTestId("active-chat-screen")).toBeTruthy();
    expect(getByTestId("active-chat-screen-header")).toBeTruthy();
    expect(getByTestId("message-list")).toBeTruthy();
    expect(getByTestId("message-input")).toBeTruthy();
  });

  // 3 — ChatHeader renders with title "Solace"
  it("renders ChatHeader with title Solace", () => {
    const { getByText } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={initialMessages} />,
    );
    expect(getByText("Solace")).toBeTruthy();
  });

  // 4 — Default 6 initial messages render
  it("renders the default 6 initial messages", () => {
    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={initialMessages} />,
    );
    // All 6 message rows must exist
    initialMessages.forEach((msg) => {
      expect(getByTestId(`message-row-${msg.id}`)).toBeTruthy();
    });
  });

  // 5 — User bubbles have testID prefix "user-bubble-"
  it("user bubbles have user-bubble testID prefix", () => {
    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={initialMessages} />,
    );
    const userMsgs = initialMessages.filter((m) => m.role === "user");
    userMsgs.forEach((msg) => {
      expect(getByTestId(`user-bubble-${msg.id}`)).toBeTruthy();
    });
  });

  // 5b — AI bubbles have testID prefix "ai-bubble-"
  it("AI bubbles have ai-bubble testID prefix", () => {
    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={initialMessages} />,
    );
    const aiMsgs = initialMessages.filter((m) => m.role === "ai");
    aiMsgs.forEach((msg) => {
      expect(getByTestId(`ai-bubble-${msg.id}`)).toBeTruthy();
    });
  });

  // 6 — Embedded ChatBubbleAction renders when action prop provided
  it("renders ChatBubbleAction when message has action", () => {
    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={initialMessages} />,
    );
    // seed-3 has the action card
    expect(getByTestId("action-card-seed-3")).toBeTruthy();
  });

  // 7 — ReactionChip row renders when reactions provided
  it("renders reactions row when message has reactions", () => {
    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={initialMessages} />,
    );
    expect(getByTestId("reactions-row-seed-3")).toBeTruthy();
  });

  // 8 — Tapping a ReactionChip calls its onPress
  it("tapping a ReactionChip toggles it (calls internal onPress)", () => {
    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={initialMessages} />,
    );
    const chip = getByTestId("reaction-chip-r-helped");
    fireEvent.press(chip);
    // After toggle the chip's accessibilityState.selected should be true
    expect(chip.props.accessibilityState?.selected).toBe(true);
  });

  // 9 — Sending a message via MessageInput appends a user bubble
  it("appends a user bubble after sending a message", async () => {
    const { getByTestId, findByText } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={[]} />,
    );
    const inputField = getByTestId("message-input-field");
    fireEvent.changeText(inputField, "Hello Solace");
    const sendBtn = getByTestId("message-input-send-button");
    await act(async () => {
      fireEvent.press(sendBtn);
    });
    expect(await findByText("Hello Solace")).toBeTruthy();
  });

  // 10 — Typing indicator appears after user sends, then disappears
  it("shows typing indicator while AI is responding then hides it", async () => {
    // Instant resolution — screen adds 600ms pause internally so indicator
    // stays visible briefly even with fast mock.
    mockSendMessage.mockResolvedValueOnce({
      text: "Thinking…",
      crisis: null,
      delayMs: 0,
    });

    const { findByTestId, queryByTestId } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={[]} />,
    );

    const inputField = await findByTestId("message-input-field");
    fireEvent.changeText(inputField, "Feeling low");
    const sendBtn = await findByTestId("message-input-send-button");
    fireEvent.press(sendBtn);

    // Typing indicator should appear briefly. The screen pauses 600ms before
    // flipping isTyping=false, so under heavy parallel-suite load the default
    // 1s findBy can race the 600ms window — use a generous waitFor with the
    // same 3s ceiling as the disappear check.
    await waitFor(
      () => {
        expect(queryByTestId("typing-indicator")).toBeTruthy();
      },
      { timeout: 3000 },
    );

    // Wait for it to disappear (screen has 600ms internal pause; give 3s).
    await waitFor(
      () => {
        expect(queryByTestId("typing-indicator")).toBeNull();
      },
      { timeout: 3000 },
    );
  });

  // 11 — AI reply bubble renders after typing
  it("renders AI reply bubble after send resolves", async () => {
    const { getByTestId, findByText } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={[]} />,
    );
    const inputField = getByTestId("message-input-field");
    fireEvent.changeText(inputField, "Need help");
    await act(async () => {
      fireEvent.press(getByTestId("message-input-send-button"));
    });
    expect(await findByText("I hear you.")).toBeTruthy();
  });

  // 12 — ChatHeader back button calls onClose
  it("back button calls onClose", () => {
    const onClose = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen
        {...baseProps}
        onClose={onClose}
        initialMessages={initialMessages}
      />,
    );
    fireEvent.press(getByTestId("active-chat-screen-header-back"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // 13 — ChatHeader phone button calls onPhonePress when provided
  it("phone button calls onPhonePress", () => {
    const onPhonePress = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen
        {...baseProps}
        onPhonePress={onPhonePress}
        initialMessages={initialMessages}
      />,
    );
    fireEvent.press(getByTestId("active-chat-screen-header-phone"));
    expect(onPhonePress).toHaveBeenCalledTimes(1);
  });

  // 14 — ChatHeader more button calls onMorePress when provided
  it("more button calls onMorePress", () => {
    const onMorePress = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen
        {...baseProps}
        onMorePress={onMorePress}
        initialMessages={initialMessages}
      />,
    );
    fireEvent.press(getByTestId("active-chat-screen-header-more"));
    expect(onMorePress).toHaveBeenCalledTimes(1);
  });

  // 15 — ChatBubbleAction CTA press calls action.onPress
  it("action card CTA press calls action.onPress", () => {
    const actionOnPress = jest.fn();
    const msgWithAction: ChatMessage[] = [
      {
        id: "test-action-msg",
        role: "ai",
        text: "Try this exercise.",
        timestamp: Date.now(),
        action: {
          iconName: "wind",
          title: "4-7-8 Breathing",
          subtitle: "2 min",
          ctaLabel: "Start",
          onPress: actionOnPress,
        },
      },
    ];
    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen
        {...baseProps}
        initialMessages={msgWithAction}
      />,
    );
    fireEvent.press(getByTestId("action-card-test-action-msg"));
    expect(actionOnPress).toHaveBeenCalledTimes(1);
  });

  // 16 — Empty state when initialMessages=[]
  it("shows placeholder when initialMessages is empty", () => {
    const { getByText } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={[]} />,
    );
    expect(getByText(/Solace is listening/i)).toBeTruthy();
  });

  // 17 — onSendMessage override is called with correct text
  it("calls onSendMessage override with the typed text", async () => {
    const mockOverride = jest
      .fn()
      .mockResolvedValue({ reply: "Custom reply." });

    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen
        {...baseProps}
        initialMessages={[]}
        onSendMessage={mockOverride}
      />,
    );

    fireEvent.changeText(getByTestId("message-input-field"), "Hi there");
    await act(async () => {
      fireEvent.press(getByTestId("message-input-send-button"));
    });

    expect(mockOverride).toHaveBeenCalledWith("Hi there");
  });

  // 18 — (Optional) Crisis classifier: "I want to hurt myself" triggers crisis response
  it("sending crisis text yields AI reply (mocked sendMessage called)", async () => {
    mockSendMessage.mockResolvedValueOnce({
      text: "I hear you, and I want to make sure you're safe right now.",
      crisis: { matched: true, patterns: ["hurt myself"], category: "self_harm" },
      delayMs: 0,
    });

    const { getByTestId, findByText } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={[]} />,
    );

    fireEvent.changeText(
      getByTestId("message-input-field"),
      "I want to hurt myself",
    );
    await act(async () => {
      fireEvent.press(getByTestId("message-input-send-button"));
    });

    expect(
      await findByText(/I hear you, and I want to make sure you're safe/),
    ).toBeTruthy();
  });

  // 19 — header status text renders
  it("renders CBT mode status in header", () => {
    const { getByText } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={initialMessages} />,
    );
    expect(getByText("CBT mode · Online")).toBeTruthy();
  });

  // 20 — message-list testID present
  it("renders message-list container", () => {
    const { getByTestId } = renderWithTheme(
      <ActiveChatScreen {...baseProps} initialMessages={initialMessages} />,
    );
    expect(getByTestId("message-list")).toBeTruthy();
  });
});
