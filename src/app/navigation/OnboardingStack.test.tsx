/**
 * OnboardingStack assessment tests (Phase 1, item 1.3).
 *
 * `AssessmentQuestionScreen` has always emitted the chosen option through
 * `onContinue(answerId)`, but the adapter dropped the argument and both call
 * sites invoked `calculateSolaceScore({})`. The five-question assessment was
 * therefore decorative: every user, whatever they answered, scored exactly 50
 * and was told they were "unstable".
 *
 * These tests drive the real flow — tapping an option, tapping Continue, five
 * times — and assert the score responds to what was actually said.
 */

import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { OnboardingStack } from "./OnboardingStack";
import { closeDatabase } from "@/shared/data/db";
import { renderWithRepos } from "@/test/renderWithRepos";

/** Option ids to pick, in question order, for a "doing well" respondent. */
const HEALTHY_ANSWERS = ["focus", "good", "steady", "rare", "daily"];

/** Option ids for someone struggling on every axis. */
const STRUGGLING_ANSWERS = ["low-mood", "low", "low", "daily", "never"];

/**
 * Walk the assessment from the intro to the results screen, choosing
 * `answers[i]` at question i.
 *
 * @returns the rendered result, parked on AssessmentResults
 */
async function completeAssessment(
  answers: readonly string[],
  databaseName: string,
) {
  const view = await renderWithRepos(<OnboardingStack />, {
    databaseName,
    // Mount straight onto the assessment intro: the profile-details step this
    // stack opens on has nothing to do with scoring.
    navigationState: { index: 0, routes: [{ name: "AssessmentIntro" }] },
  });

  await waitFor(() => expect(view.getByTestId("begin-button")).toBeTruthy());
  fireEvent.press(view.getByTestId("begin-button"));

  for (const answer of answers) {
    await waitFor(() =>
      expect(view.getByTestId(`option-${answer}`)).toBeTruthy(),
    );
    fireEvent.press(view.getByTestId(`option-${answer}`));
    fireEvent.press(view.getByTestId("continue-button"));
  }

  await waitFor(() => expect(view.getByTestId("score-value")).toBeTruthy());
  return view;
}

/** Read the numeric score off the results ring. */
function scoreOf(view: { getByTestId: (id: string) => any }): number {
  return Number(view.getByTestId("score-value").props.children);
}

describe("OnboardingStack — the assessment score reflects the answers", () => {
  afterEach(async () => {
    await closeDatabase();
  });

  it("scores a struggling respondent below a healthy one", async () => {
    const healthy = await completeAssessment(
      HEALTHY_ANSWERS,
      "onboarding_healthy.db",
    );
    const healthyScore = scoreOf(healthy);
    healthy.unmount();
    await closeDatabase();

    const struggling = await completeAssessment(
      STRUGGLING_ANSWERS,
      "onboarding_struggling.db",
    );
    expect(scoreOf(struggling)).toBeLessThan(healthyScore);
  });

  it("does not return the base score of 50 regardless of input", async () => {
    const view = await completeAssessment(
      HEALTHY_ANSWERS,
      "onboarding_not50.db",
    );
    expect(scoreOf(view)).not.toBe(50);
  });

  it("returns 50 for a genuinely neutral respondent", async () => {
    // Worth pinning explicitly: 50 is the neutral midpoint of the model, so a
    // 50 here is right for the right reason. The old bug returned the same 50
    // for every input, which no single-profile test could tell apart from
    // this one.
    const view = await completeAssessment(
      ["anxiety", "neutral", "mixed", "sometimes", "weekly"],
      "onboarding_neutral.db",
    );
    expect(scoreOf(view)).toBe(50);
  });

  it("spans the scale across answer profiles", async () => {
    const high = await completeAssessment(HEALTHY_ANSWERS, "onboarding_hi.db");
    const highScore = scoreOf(high);
    high.unmount();
    await closeDatabase();

    const low = await completeAssessment(
      STRUGGLING_ANSWERS,
      "onboarding_lo.db",
    );
    expect(highScore).toBe(80);
    expect(scoreOf(low)).toBe(0);
  });

  it("describes a healthy respondent as healthy", async () => {
    const view = await completeAssessment(
      HEALTHY_ANSWERS,
      "onboarding_category.db",
    );
    expect(scoreOf(view)).toBeGreaterThanOrEqual(70);
    // The base-50 result always recommended the "unstable" copy.
    expect(view.queryByText(/reaching out to a mental health professional/i))
      .toBeNull();
  });

  it("persists the score that was actually calculated", async () => {
    const view = await completeAssessment(
      HEALTHY_ANSWERS,
      "onboarding_persist.db",
    );
    const shown = scoreOf(view);
    await waitFor(async () => {
      expect(await view.repos.settings.getValue("solaceScore")).toBe(
        String(shown),
      );
    });
  });

  it("keeps an answer selected when the user navigates back to it", async () => {
    const view = await renderWithRepos(<OnboardingStack />, {
      databaseName: "onboarding_back.db",
      navigationState: { index: 0, routes: [{ name: "AssessmentIntro" }] },
    });

    await waitFor(() => expect(view.getByTestId("begin-button")).toBeTruthy());
    fireEvent.press(view.getByTestId("begin-button"));

    await waitFor(() => expect(view.getByTestId("option-anxiety")).toBeTruthy());
    fireEvent.press(view.getByTestId("option-anxiety"));
    fireEvent.press(view.getByTestId("continue-button"));

    await waitFor(() => expect(view.getByTestId("option-good")).toBeTruthy());
    fireEvent.press(view.getByTestId("back-button"));

    await waitFor(() => expect(view.getByTestId("option-anxiety")).toBeTruthy());
    // Assessment options are radios: the chosen answer is announced through
    // `accessibilityState.checked`, not the tab-only `selected` state.
    expect(
      view.getByTestId("option-anxiety").props.accessibilityState.checked,
    ).toBe(true);
  });
});

/**
 * Phase 1.6 — the two onboarding settings writes.
 *
 * Both used `.catch(() => undefined)`. The theme write is the one with teeth:
 * onboarding now advances only once the write lands, so the failure path has
 * to both say what happened and leave a way forward. A settings table that
 * cannot be written must not be able to trap someone inside onboarding over a
 * colour preference.
 */
describe("OnboardingStack — settings writes that fail", () => {
  afterEach(async () => {
    jest.restoreAllMocks();
    await closeDatabase();
  });

  it("advances to the notification primer once the theme write lands", async () => {
    const view = await renderWithRepos(<OnboardingStack />, {
      databaseName: "onboarding_theme_ok.db",
      navigationState: { index: 0, routes: [{ name: "ThemePicker" }] },
    });

    await waitFor(() => expect(view.getByTestId("continue-button")).toBeTruthy());
    fireEvent.press(view.getByTestId("continue-button"));

    await waitFor(() =>
      expect(view.getByTestId("notification-primer-screen")).toBeTruthy(),
    );
    expect(view.queryByTestId("write-failure-toast")).toBeNull();
  });

  it("surfaces a failure and stays put when the theme write rejects", async () => {
    const view = await renderWithRepos(<OnboardingStack />, {
      databaseName: "onboarding_theme_fail.db",
      navigationState: { index: 0, routes: [{ name: "ThemePicker" }] },
    });

    await waitFor(() => expect(view.getByTestId("continue-button")).toBeTruthy());
    jest
      .spyOn(view.repos.settings, "set")
      .mockRejectedValue(new Error("database is locked"));

    fireEvent.press(view.getByTestId("continue-button"));

    await waitFor(() =>
      expect(view.getByTestId("write-failure-toast")).toBeTruthy(),
    );
    expect(view.queryByTestId("notification-primer-screen")).toBeNull();
  });

  it("offers a way out of onboarding rather than trapping the user", async () => {
    const view = await renderWithRepos(<OnboardingStack />, {
      databaseName: "onboarding_theme_escape.db",
      navigationState: { index: 0, routes: [{ name: "ThemePicker" }] },
    });

    await waitFor(() => expect(view.getByTestId("continue-button")).toBeTruthy());
    jest
      .spyOn(view.repos.settings, "set")
      .mockRejectedValue(new Error("database is locked"));

    fireEvent.press(view.getByTestId("continue-button"));

    await waitFor(() =>
      expect(view.getByTestId("write-failure-toast-action")).toBeTruthy(),
    );
    fireEvent.press(view.getByTestId("write-failure-toast-action"));

    await waitFor(() =>
      expect(view.getByTestId("notification-primer-screen")).toBeTruthy(),
    );
  });

  it("surfaces a failure when the assessment score cannot be saved", async () => {
    const view = await renderWithRepos(<OnboardingStack />, {
      databaseName: "onboarding_score_fail.db",
      navigationState: { index: 0, routes: [{ name: "AssessmentIntro" }] },
    });

    await waitFor(() => expect(view.getByTestId("begin-button")).toBeTruthy());
    jest
      .spyOn(view.repos.settings, "set")
      .mockRejectedValue(new Error("database is locked"));
    fireEvent.press(view.getByTestId("begin-button"));

    for (const answer of HEALTHY_ANSWERS) {
      await waitFor(() =>
        expect(view.getByTestId(`option-${answer}`)).toBeTruthy(),
      );
      fireEvent.press(view.getByTestId(`option-${answer}`));
      fireEvent.press(view.getByTestId("continue-button"));
    }

    await waitFor(() =>
      expect(view.getByTestId("write-failure-toast")).toBeTruthy(),
    );
  });
});
