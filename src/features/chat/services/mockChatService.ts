/**
 * mockChatService — scripted CBT-style responses for the chat surface.
 *
 * This service exists so the chat UI ships **fully functional** during the
 * pre-backend phase. User sends a message → service returns a scripted
 * response after a realistic typing delay (600–1400ms). Responses vary by
 * `ChatMode` so CBT feels different from Mindfulness feels different from
 * Sleep. Never flippant, never celebratory during crisis.
 *
 * Contract:
 *   - `sendMessage(input, mode)` → Promise<ChatResponse>
 *   - Guaranteed crisis-safe: if `detectCrisisSignals()` matches, the
 *     response is ALWAYS the crisis-intervention template AND the result
 *     carries `crisis: <CrisisDetection>` so the UI can open the sheet.
 *   - Responses are intentionally varied (sentence starters rotate) so a
 *     demo conversation doesn't feel robotic after 10 messages.
 *
 * Replace with a real LLM backend (Claude, GPT, Gemini) when available —
 * the interface stays identical.
 */

import {
  detectCrisisSignals,
  type CrisisDetection,
} from "./crisisClassifier";

export type ChatMode = "general" | "cbt" | "mindfulness" | "sleep";

export interface ChatRequest {
  /** User-authored text (trimmed by the service). */
  input: string;
  /** Conversational mode — shapes tone + response library. */
  mode?: ChatMode;
}

export interface ChatResponse {
  /** The scripted reply text. */
  text: string;
  /** When the crisis classifier trips, this is populated; UI must show sheet. */
  crisis: CrisisDetection | null;
  /** Simulated typing delay that was applied before this response resolved. */
  delayMs: number;
}

/** Minimum / maximum simulated typing delay (ms). Random per response. */
const MIN_DELAY = 600;
const MAX_DELAY = 1400;

/**
 * Crisis response — used for every match regardless of mode. Never jokes,
 * never suggests wellness exercises first. Directs to immediate support.
 */
const CRISIS_RESPONSE =
  "I hear you, and I want to make sure you're safe right now. What you're carrying sounds heavy — you don't have to carry it alone. Would you like to connect with a trained crisis counselor? You can call or text 988 (Suicide & Crisis Lifeline) any time.";

/**
 * Per-mode response library. Each line is written to be supportive and
 * evidence-aligned without being prescriptive. Rotated pseudo-randomly so
 * a demo doesn't repeat itself quickly.
 */
const RESPONSES: Readonly<Record<ChatMode, readonly string[]>> = {
  general: [
    "Thank you for sharing that with me. Can you tell me more about what's been weighing on you?",
    "That sounds really difficult. How long have you been feeling this way?",
    "I hear you. It takes courage to put this into words — what usually helps when you feel this way?",
    "I'm listening. What do you notice in your body as you think about this?",
    "What matters most to you right now, even in the middle of this?",
    "That's a lot to hold. If we slowed this down for a moment, where would you want to start?",
    "I'm glad you brought this here. What would feel like a small, kind next step?",
  ],
  cbt: [
    "Let's slow this down — what went through your mind right before you felt that way?",
    "That's a powerful thought. If a close friend said the same to you, how might you respond to them?",
    "I notice some 'all-or-nothing' language in there. Is there a more balanced way to look at this?",
    "Can we zoom in on that thought? What evidence supports it, and what evidence pushes back?",
    "You've named a thought — would you like to try reframing it together?",
    "Cognitive distortions are sneaky. Does 'catastrophizing' or 'mind-reading' sound like what's happening here?",
    "If 100 people were in your situation, how many do you think would have this same thought? That's useful data.",
  ],
  mindfulness: [
    "Let's take a breath together. Inhale for four… hold for four… exhale for six. How does that feel?",
    "Before we go further, can you notice three things you can hear right now?",
    "Where do you feel that emotion in your body? Not thinking about it — just noticing where it lives.",
    "Let's name it without judging it. What word comes up when you check in right now?",
    "Thoughts are clouds — we don't have to chase them. Can you notice one passing without grabbing on?",
    "Try this: feet on the floor, palms down, one slow breath. What shifts, even a little?",
  ],
  sleep: [
    "Sleep trouble can amplify everything. Walk me through your wind-down routine tonight.",
    "What time did you get into bed, and when did your mind start racing?",
    "A cool, dark, quiet room is the foundation — is anything in your environment working against you?",
    "When you can't sleep, it helps to leave the bed for 15 minutes and do something dim and boring. Want to try it tonight?",
    "What's the first thought that loops when you're lying awake?",
    "Caffeine after 2 PM is often the hidden culprit. Anything new in your afternoon lately?",
  ],
};

/**
 * Send a user message and receive a scripted response.
 *
 * Always resolves — never rejects. Non-string / empty inputs get a gentle
 * "couldn't quite hear that" response.
 */
export async function sendMessage({
  input,
  mode = "general",
}: ChatRequest): Promise<ChatResponse> {
  const text = typeof input === "string" ? input.trim() : "";
  const delayMs = randomDelay();
  await sleep(delayMs);

  // Crisis first — always, regardless of mode.
  const crisis = detectCrisisSignals(text);
  if (crisis.matched) {
    return { text: CRISIS_RESPONSE, crisis, delayMs };
  }

  if (text.length === 0) {
    return {
      text: "I'm here. What's on your mind?",
      crisis: null,
      delayMs,
    };
  }

  return {
    text: pickResponse(mode, text),
    crisis: null,
    delayMs,
  };
}

/** Deterministic-ish response picker — rotates via input length as seed. */
function pickResponse(mode: ChatMode, input: string): string {
  const pool = RESPONSES[mode] ?? RESPONSES.general;
  const seed = (input.length + Date.now()) % pool.length;
  return pool[seed];
}

function randomDelay(): number {
  return Math.floor(MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Exported for tests that want to assert on the crisis script verbatim. */
export const __CRISIS_RESPONSE_FOR_TESTING__ = CRISIS_RESPONSE;
