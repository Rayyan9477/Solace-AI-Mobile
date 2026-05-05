/**
 * Chat → Crisis integration test (Sprint 9 8.4 exit gate).
 *
 * Proves the chat surface is correctly wired to the rule-based crisis
 * classifier and surfaces the CrisisModal when a high-confidence positive
 * phrase is sent.
 *
 * Real integration shape:
 *   user types "I want to end it all"
 *     → ActiveChatScreen.handleSend trims input
 *       → detectCrisisSignals(trimmed) matches
 *         → onCrisisDetected callback fires
 *           → host (RootNavigator) calls navigate("CrisisModal")
 *
 * The test wires `onCrisisDetected` to a navigation-shaped jest.fn() and
 * asserts both:
 *   1. The classifier hook fired with the user's exact text.
 *   2. The navigation mock was called with the literal route name "CrisisModal".
 *
 * Negative + edge cases verify the modal is NOT opened for normal venting
 * or low-confidence keyword fragments.
 */

jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () =>
  jest.requireActual("@/shared/theme/useTheme"),
);

jest.mock("@/features/chat/services/mockChatService", () => ({
  sendMessage: jest.fn().mockResolvedValue({
    text: "I hear you.",
    crisis: null,
    delayMs: 0,
  }),
}));

jest.mock("expo-haptics", () => ({
  __esModule: true,
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Warning: "warning", Error: "error" },
}));

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";

import { ThemeProvider } from "@/shared/theme/useTheme";
import { sendMessage } from "@/features/chat/services/mockChatService";
import {
  ActiveChatScreen,
  type ActiveChatScreenProps,
} from "@/features/chat/screens/ActiveChatScreen";

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

const mockSendMessage = sendMessage as jest.MockedFunction<typeof sendMessage>;

interface HarnessOptions {
  /** jest.fn() to receive navigation calls — assert against this. */
  navigate: jest.Mock;
}

/**
 * Renders ActiveChatScreen wrapped with NavigationContainer + ThemeProvider,
 * connecting onCrisisDetected to the supplied navigate mock so any classifier
 * trip flows through to a `navigate("CrisisModal", ...)` assertion.
 */
function renderChatWithCrisisHook(
  opts: HarnessOptions,
  overrides: Partial<ActiveChatScreenProps> = {},
): ReturnType<typeof render> {
  const baseProps: ActiveChatScreenProps = {
    conversationId: "integration-conv-1",
    initialMessages: [],
    onClose: jest.fn(),
    onPhonePress: jest.fn(),
    onMorePress: jest.fn(),
    onCrisisDetected: (input: string) => {
      // Mirror the production wiring in RootNavigator: a classifier hit
      // navigates to the root-mounted CrisisModal stack.
      opts.navigate("CrisisModal", { trigger: "chat", input });
    },
    testID: "active-chat-screen",
    ...overrides,
  };

  return render(
    <NavigationContainer>
      <ThemeProvider>
        <ActiveChatScreen {...baseProps} />
      </ThemeProvider>
    </NavigationContainer>,
  );
}

async function typeAndSend(
  utils: ReturnType<typeof render>,
  text: string,
): Promise<void> {
  const input = utils.getByTestId("message-input-field");
  fireEvent.changeText(input, text);
  const sendBtn = utils.getByTestId("message-input-send-button");
  await act(async () => {
    fireEvent.press(sendBtn);
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Integration — chat → crisis classifier → CrisisModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSendMessage.mockResolvedValue({
      text: "I hear you.",
      crisis: null,
      delayMs: 0,
    });
  });

  // ------------------------------ Positive cases ------------------------------

  it("opens CrisisModal when user sends 'I want to end it all'", async () => {
    const navigate = jest.fn();
    const utils = renderChatWithCrisisHook({ navigate });

    await typeAndSend(utils, "I want to end it all");

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        "CrisisModal",
        expect.objectContaining({
          trigger: "chat",
          input: "I want to end it all",
        }),
      );
    });
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("opens CrisisModal when user sends 'I'm thinking about suicide'", async () => {
    const navigate = jest.fn();
    const utils = renderChatWithCrisisHook({ navigate });

    await typeAndSend(utils, "I'm thinking about suicide");

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        "CrisisModal",
        expect.objectContaining({ trigger: "chat" }),
      );
    });
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("opens CrisisModal when user sends 'I want to kill myself'", async () => {
    const navigate = jest.fn();
    const utils = renderChatWithCrisisHook({ navigate });

    await typeAndSend(utils, "I want to kill myself");

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        "CrisisModal",
        expect.objectContaining({
          trigger: "chat",
          input: "I want to kill myself",
        }),
      );
    });
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  // ------------------------------ Negative cases ------------------------------

  it("does NOT open CrisisModal for benign message 'I had a great day today'", async () => {
    const navigate = jest.fn();
    const utils = renderChatWithCrisisHook({ navigate });

    await typeAndSend(utils, "I had a great day today");

    // Give async paths a tick to land — there should still be no crisis call.
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalled();
    });
    expect(navigate).not.toHaveBeenCalled();
  });

  it("does NOT open CrisisModal for benign message 'I'm planning my vacation'", async () => {
    const navigate = jest.fn();
    const utils = renderChatWithCrisisHook({ navigate });

    await typeAndSend(utils, "I'm planning my vacation");

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalled();
    });
    expect(navigate).not.toHaveBeenCalled();
  });

  // ------------------------------ Edge cases ------------------------------

  it("does NOT trigger on the substring 'die' inside a benign idiom ('dying to see this movie')", async () => {
    // Word-boundary regex must not catch idioms that contain crisis-adjacent
    // substrings. This is the canonical false-positive test that the
    // classifier guards against — proves the integration honors it too.
    const navigate = jest.fn();
    const utils = renderChatWithCrisisHook({ navigate });

    await typeAndSend(utils, "I'm dying to see this movie tonight");

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalled();
    });
    expect(navigate).not.toHaveBeenCalled();
  });

  it("does NOT trigger when user discusses prevention work without first-person ideation", async () => {
    // "I volunteer at a suicide prevention hotline" matches the suicide
    // pattern but is suppressed by the safe-context rule. The integration
    // must respect that suppression — never fire the modal.
    const navigate = jest.fn();
    const utils = renderChatWithCrisisHook({ navigate });

    await typeAndSend(utils, "I volunteer at a suicide prevention hotline");

    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalled();
    });
    expect(navigate).not.toHaveBeenCalled();
  });

  it("fires the classifier exactly once per send (idempotency)", async () => {
    // If the user spams the send button while the AI is still typing, only
    // ONE classifier hit / one modal trigger should fire — the screen
    // immediately clears the input on send so subsequent presses no-op.
    const navigate = jest.fn();
    const utils = renderChatWithCrisisHook({ navigate });

    await typeAndSend(utils, "I want to end it all");
    // Press send again with empty input — should be a no-op (classifier
    // should not see an empty string).
    await act(async () => {
      fireEvent.press(utils.getByTestId("message-input-send-button"));
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledTimes(1);
    });
  });

  it("still calls onCrisisDetected when onSendMessage override is provided", async () => {
    // Even with a host-supplied custom send (e.g. backend LLM later), the
    // classifier tripwire MUST run — it cannot be bypassed by replacing
    // the chat backend.
    const navigate = jest.fn();
    const customSend = jest
      .fn()
      .mockResolvedValue({ reply: "Custom reply." });
    const utils = renderChatWithCrisisHook(
      { navigate },
      { onSendMessage: customSend },
    );

    await typeAndSend(utils, "I want to kill myself");

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        "CrisisModal",
        expect.objectContaining({ trigger: "chat" }),
      );
    });
    expect(customSend).toHaveBeenCalledWith("I want to kill myself");
  });
});
