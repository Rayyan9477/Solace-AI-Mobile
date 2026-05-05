/**
 * Crisis-stack-wiring contract lock.
 *
 * Sprint 11 review found that ChatStack and JournalStack initially shipped
 * WITHOUT passing `onCrisisDetected` through to their screens, leaving the
 * safety tripwire as dead code in the running app. The screen-layer
 * integration tests (chatCrisis / journalCrisis) supply the callback from
 * inside the test harness — they prove the screen fires the callback when
 * the classifier hits, but they do NOT prove the production stack adapter
 * passes the prop through.
 *
 * This file locks the production wiring via a static-source assertion: if
 * a future change removes the `onCrisisDetected={...}` JSX attribute from
 * either stack file, this test fails immediately. No nav-runtime / mock
 * complexity required.
 *
 * Companion runtime coverage:
 *   - src/__tests__/integration/chatCrisis.integration.test.tsx (8 tests)
 *   - src/__tests__/integration/journalCrisis.integration.test.tsx (11 tests)
 */

import * as fs from "fs";
import * as path from "path";

const repoRoot = path.resolve(__dirname, "../../..");
const chatStackPath = path.join(
  repoRoot,
  "src/app/navigation/stacks/ChatStack.tsx",
);
const journalStackPath = path.join(
  repoRoot,
  "src/app/navigation/stacks/JournalStack.tsx",
);

describe("crisis tripwire — production stack wiring (contract lock)", () => {
  it("ChatStack renders <ActiveChatScreen> with onCrisisDetected wired", () => {
    const src = fs.readFileSync(chatStackPath, "utf-8");
    // The screen is rendered with onCrisisDetected={...} somewhere within
    // its JSX block. Match the literal opening tag through to the prop
    // binding to prove the production wiring is in place.
    expect(src).toMatch(/<ActiveChatScreen[\s\S]*?onCrisisDetected\s*=/);
  });

  it("ChatStack onCrisisDetected handler navigates to CrisisModal", () => {
    const src = fs.readFileSync(chatStackPath, "utf-8");
    // The handler must reach the parent navigator and target CrisisModal.
    expect(src).toMatch(/getParent[\s\S]*?CrisisModal/);
  });

  it("JournalStack renders <TextJournalComposerScreen> with onCrisisDetected wired", () => {
    const src = fs.readFileSync(journalStackPath, "utf-8");
    expect(src).toMatch(
      /<TextJournalComposerScreen[\s\S]*?onCrisisDetected\s*=/,
    );
  });

  it("JournalStack onCrisisDetected handler navigates to CrisisModal", () => {
    const src = fs.readFileSync(journalStackPath, "utf-8");
    expect(src).toMatch(/getParent[\s\S]*?CrisisModal/);
  });
});
