/**
 * Crisis detection integration — end-to-end flow through the mock chat stack.
 *
 * This test simulates the user-visible path a crisis phrase travels:
 *
 *   user types "I want to end it all"
 *     → sendMessage({ input, mode: "cbt" })
 *       → detectCrisisSignals() matches
 *       → mockChatService returns CRISIS_RESPONSE + crisis metadata
 *     → UI renders the AI bubble with that response (via ChatBubble)
 *
 * Before Sprint 3 wires the ActiveChatScreen, this integration test proves:
 *   (1) the classifier + service are correctly composed
 *   (2) the reskinned ChatBubble renders crisis text visibly
 *   (3) the response resolves in < 2s wall time so a UI can show it fast
 *   (4) a normal phrase does NOT trip the crisis path
 */
import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import { ChatBubble } from "@/shared/components/organisms/chat/ChatBubble";
import {
  __CRISIS_RESPONSE_FOR_TESTING__,
  sendMessage,
} from "./mockChatService";

describe("Crisis detection integration — chat service + ChatBubble render", () => {
  it("end-to-end: crisis phrase → classifier match → crisis response → visible in bubble", async () => {
    const t0 = Date.now();
    const response = await sendMessage({
      input: "I want to end it all",
      mode: "cbt",
    });
    const elapsed = Date.now() - t0;

    // Service contract
    expect(response.text).toBe(__CRISIS_RESPONSE_FOR_TESTING__);
    expect(response.crisis).not.toBeNull();
    expect(response.crisis).toMatchObject({ matched: true });
    expect(response.crisis?.category).toBe("suicidal_ideation");

    // Timing — should feel responsive (<2s end-to-end including simulated delay)
    expect(elapsed).toBeLessThan(2000);

    // UI contract — the ChatBubble CAN render the response.
    const { getByText } = render(
      <ChatBubble
        testID="crisis-reply"
        message={response.text}
        sender="ai"
      />,
    );
    expect(getByText(response.text)).toBeTruthy();
    // The message must reference 988 so the user has a direct action
    expect(response.text).toContain("988");
  });

  it("routes high-acuity phrases to crisis despite mode='sleep'", async () => {
    const response = await sendMessage({
      input: "I keep thinking about hanging myself when I can't sleep",
      mode: "sleep",
    });
    expect(response.text).toBe(__CRISIS_RESPONSE_FOR_TESTING__);
    expect(response.crisis?.category).toBe("plan_or_means");
  });

  it("normal venting does NOT trigger the crisis path", async () => {
    const response = await sendMessage({
      input: "I had a rough day at work and I feel kind of drained",
      mode: "general",
    });
    expect(response.text).not.toBe(__CRISIS_RESPONSE_FOR_TESTING__);
    expect(response.crisis).toBeNull();
  });

  it("discussion context ('I volunteer at a suicide prevention hotline') does NOT trigger", async () => {
    const response = await sendMessage({
      input: "I volunteer at a suicide prevention hotline",
      mode: "general",
    });
    expect(response.text).not.toBe(__CRISIS_RESPONSE_FOR_TESTING__);
    expect(response.crisis).toBeNull();
  });

  it("returns a user-facing bubble label referencing '988' — provable via ChatBubble render", async () => {
    const response = await sendMessage({
      input: "I've been thinking about suicide",
      mode: "cbt",
    });
    const { getByLabelText } = render(
      <ChatBubble
        testID="bubble"
        message={response.text}
        sender="ai"
        senderName="Solace"
      />,
    );
    // Default accessibility label joins senderName + message
    expect(getByLabelText(/988/)).toBeTruthy();
  });
});
