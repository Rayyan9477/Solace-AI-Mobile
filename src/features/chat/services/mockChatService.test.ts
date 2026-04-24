import {
  __CRISIS_RESPONSE_FOR_TESTING__,
  sendMessage,
  type ChatMode,
} from "./mockChatService";

describe("mockChatService", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  async function sendAndResolve(
    input: string,
    mode?: ChatMode,
  ): Promise<{ text: string; crisis: unknown; delayMs: number }> {
    const p = sendMessage({ input, mode });
    // Flush the simulated typing delay immediately
    jest.runAllTimers();
    return p;
  }

  describe("happy path", () => {
    it.each<ChatMode>(["general", "cbt", "mindfulness", "sleep"])(
      "returns a non-empty scripted response for mode=%s",
      async (mode) => {
        const result = await sendAndResolve("I've been anxious", mode);
        expect(typeof result.text).toBe("string");
        expect(result.text.length).toBeGreaterThan(10);
        expect(result.crisis).toBeNull();
        expect(result.delayMs).toBeGreaterThanOrEqual(600);
        expect(result.delayMs).toBeLessThanOrEqual(1400);
      },
    );

    it("defaults to general mode when mode is omitted", async () => {
      const result = await sendAndResolve("hello");
      expect(result.text.length).toBeGreaterThan(0);
    });

    it("treats empty input gracefully without crashing", async () => {
      const result = await sendAndResolve("");
      expect(result.text).toBe("I'm here. What's on your mind?");
      expect(result.crisis).toBeNull();
    });
  });

  describe("crisis handling", () => {
    it("returns the crisis template when user message trips the classifier", async () => {
      const result = await sendAndResolve("I want to kill myself", "cbt");
      expect(result.text).toBe(__CRISIS_RESPONSE_FOR_TESTING__);
      expect(result.crisis).not.toBeNull();
      expect(result.crisis).toMatchObject({ matched: true });
    });

    it("references 988 in the crisis template", () => {
      expect(__CRISIS_RESPONSE_FOR_TESTING__).toContain("988");
    });

    it("never routes a normal message to the crisis template", async () => {
      const result = await sendAndResolve(
        "I had a rough day but I'm managing",
        "cbt",
      );
      expect(result.text).not.toBe(__CRISIS_RESPONSE_FOR_TESTING__);
      expect(result.crisis).toBeNull();
    });

    it("crisis takes priority over mode — even sleep mode returns crisis script", async () => {
      const result = await sendAndResolve(
        "I've been thinking about hanging myself when I can't sleep",
        "sleep",
      );
      expect(result.text).toBe(__CRISIS_RESPONSE_FOR_TESTING__);
      expect(result.crisis).toMatchObject({ matched: true });
    });
  });

  describe("mode variation", () => {
    it("cbt mode surfaces CBT-style prompts", async () => {
      // Run many times to sample the pool; at least one response should
      // reference CBT concepts (thought, reframe, distortion, evidence)
      const texts: string[] = [];
      for (let i = 0; i < 20; i += 1) {
        const p = sendMessage({ input: `message ${i}`, mode: "cbt" });
        jest.runAllTimers();
        const r = await p;
        texts.push(r.text);
      }
      const joined = texts.join(" ").toLowerCase();
      expect(
        joined.match(/thought|reframe|distortion|evidence|balance/),
      ).toBeTruthy();
    });

    it("mindfulness mode surfaces breathing / body-awareness prompts", async () => {
      const texts: string[] = [];
      for (let i = 0; i < 20; i += 1) {
        const p = sendMessage({
          input: `message ${i}`,
          mode: "mindfulness",
        });
        jest.runAllTimers();
        const r = await p;
        texts.push(r.text);
      }
      const joined = texts.join(" ").toLowerCase();
      expect(joined.match(/breath|body|notice|inhale|exhale/)).toBeTruthy();
    });
  });
});
