/**
 * Journal → Crisis integration test (Sprint 9 8.4 exit gate).
 *
 * Proves the journal composer is correctly wired to the rule-based crisis
 * classifier and surfaces the CrisisModal when the user attempts to save an
 * entry whose body contains a high-confidence positive phrase.
 *
 * Real integration shape:
 *   user types body "I want to end it all"
 *     → user taps the FAB save (or header save)
 *       → TextJournalComposerScreen.handleSave runs detectCrisisSignals(body)
 *         → onCrisisDetected callback fires
 *           → host calls navigate("CrisisModal")
 *         → onSave() still runs so persistence is not blocked
 *
 * Negative + edge cases verify the modal is NOT opened for a benign entry
 * or for prevention/discussion framing.
 */

jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () =>
  jest.requireActual("@/shared/theme/useTheme"),
);

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
import { fireEvent, render } from "@testing-library/react-native";

import { ThemeProvider } from "@/shared/theme/useTheme";
import {
  TextJournalComposerScreen,
  type TextJournalComposerScreenProps,
} from "@/features/journal/screens/TextJournalComposerScreen";

// ---------------------------------------------------------------------------
// Test harness
// ---------------------------------------------------------------------------

interface HarnessOptions {
  /** jest.fn() to receive navigation calls — assert against this. */
  navigate: jest.Mock;
  /** Initial body text (the field the classifier inspects on save). */
  body: string;
  /** Override the onSave handler (defaults to jest.fn()). */
  onSave?: jest.Mock;
}

/**
 * Renders TextJournalComposerScreen wrapped with NavigationContainer +
 * ThemeProvider, connecting onCrisisDetected to the supplied navigate mock
 * so any classifier trip flows through to a `navigate("CrisisModal", ...)`
 * assertion.
 */
function renderJournalWithCrisisHook(
  opts: HarnessOptions,
): {
  utils: ReturnType<typeof render>;
  onSave: jest.Mock;
} {
  const onSave = opts.onSave ?? jest.fn();
  const baseProps: TextJournalComposerScreenProps = {
    title: "Untitled",
    onTitleChange: jest.fn(),
    body: opts.body,
    onBodyChange: jest.fn(),
    moodLevel: null,
    onMoodLevelChange: jest.fn(),
    hashtags: [],
    onHashtagsChange: jest.fn(),
    onClose: jest.fn(),
    onSave,
    onCrisisDetected: (text: string) => {
      // Mirror production wiring: classifier hit → navigate("CrisisModal").
      opts.navigate("CrisisModal", { trigger: "journal", input: text });
    },
    testID: "text-journal-composer-screen",
  };

  const utils = render(
    <NavigationContainer>
      <ThemeProvider>
        <TextJournalComposerScreen {...baseProps} />
      </ThemeProvider>
    </NavigationContainer>,
  );

  return { utils, onSave };
}

function pressSave(utils: ReturnType<typeof render>): void {
  fireEvent.press(utils.getByTestId("save-button"));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Integration — journal → crisis classifier → CrisisModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ------------------------------ Positive cases ------------------------------

  it("opens CrisisModal when journal body contains 'I want to end it all'", () => {
    const navigate = jest.fn();
    const { utils } = renderJournalWithCrisisHook({
      navigate,
      body: "Today was hard. I want to end it all.",
    });

    pressSave(utils);

    expect(navigate).toHaveBeenCalledWith(
      "CrisisModal",
      expect.objectContaining({
        trigger: "journal",
        input: expect.stringContaining("end it all"),
      }),
    );
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("opens CrisisModal when journal body contains 'I'm thinking about suicide'", () => {
    const navigate = jest.fn();
    const { utils } = renderJournalWithCrisisHook({
      navigate,
      body: "I'm thinking about suicide more often lately.",
    });

    pressSave(utils);

    expect(navigate).toHaveBeenCalledWith(
      "CrisisModal",
      expect.objectContaining({ trigger: "journal" }),
    );
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("opens CrisisModal when journal body contains 'I want to kill myself'", () => {
    const navigate = jest.fn();
    const { utils } = renderJournalWithCrisisHook({
      navigate,
      body: "Some days I just want to kill myself and I don't know why.",
    });

    pressSave(utils);

    expect(navigate).toHaveBeenCalledWith(
      "CrisisModal",
      expect.objectContaining({ trigger: "journal" }),
    );
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("still calls onSave even when crisis is detected (save is not blocked)", () => {
    // Critical: detection must be ADDITIVE. Persisting the entry locally is
    // a feature, not a bug — the user may want their thoughts captured.
    const navigate = jest.fn();
    const onSave = jest.fn();
    const { utils } = renderJournalWithCrisisHook({
      navigate,
      body: "I want to end it all",
      onSave,
    });

    pressSave(utils);

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  // ------------------------------ Negative cases ------------------------------

  it("does NOT open CrisisModal for benign entry 'I had a great day today'", () => {
    const navigate = jest.fn();
    const { utils, onSave } = renderJournalWithCrisisHook({
      navigate,
      body: "I had a great day today",
    });

    pressSave(utils);

    expect(navigate).not.toHaveBeenCalled();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("does NOT open CrisisModal for benign entry 'I'm planning my vacation'", () => {
    const navigate = jest.fn();
    const { utils, onSave } = renderJournalWithCrisisHook({
      navigate,
      body: "I'm planning my vacation to the coast next month — feeling hopeful.",
    });

    pressSave(utils);

    expect(navigate).not.toHaveBeenCalled();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  // ------------------------------ Edge cases ------------------------------

  it("does NOT open CrisisModal for an empty journal body", () => {
    // Empty body should produce no classifier hit (length-zero short-circuit).
    const navigate = jest.fn();
    const { utils, onSave } = renderJournalWithCrisisHook({
      navigate,
      body: "",
    });

    pressSave(utils);

    expect(navigate).not.toHaveBeenCalled();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("does NOT open CrisisModal for prevention framing without first-person ideation", () => {
    // The classifier suppresses matches when the message is purely safe-
    // context (volunteering / prevention work). Integration must respect it.
    const navigate = jest.fn();
    const { utils, onSave } = renderJournalWithCrisisHook({
      navigate,
      body: "I volunteer at a suicide prevention hotline once a month.",
    });

    pressSave(utils);

    expect(navigate).not.toHaveBeenCalled();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("does NOT open CrisisModal when only a crisis-adjacent substring appears (low-confidence keyword)", () => {
    // "dying to see" contains 'dying' but the classifier uses word-boundary
    // patterns, NOT loose substring matching. This proves the integration
    // doesn't route low-confidence keyword fragments to the modal.
    const navigate = jest.fn();
    const { utils, onSave } = renderJournalWithCrisisHook({
      navigate,
      body: "I'm dying to see the new exhibit at the museum this weekend.",
    });

    pressSave(utils);

    expect(navigate).not.toHaveBeenCalled();
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("opens CrisisModal from the header save button as well as the FAB", () => {
    // Both save affordances must run the classifier — we don't want a
    // surprise bypass route.
    const navigate = jest.fn();
    const { utils } = renderJournalWithCrisisHook({
      navigate,
      body: "I want to end it all",
    });

    fireEvent.press(utils.getByTestId("header-save-button"));

    expect(navigate).toHaveBeenCalledWith(
      "CrisisModal",
      expect.objectContaining({ trigger: "journal" }),
    );
    expect(navigate).toHaveBeenCalledTimes(1);
  });
});
