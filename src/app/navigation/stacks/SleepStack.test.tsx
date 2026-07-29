/**
 * SleepStack adapter tests.
 *
 * Sleep is the sharpest case of the Phase 1 truthfulness problem: the screen
 * fabricated a full night AND the adapter fabricated a week of history — for a
 * repository with **zero write call sites** anywhere in the app. Every user saw
 * the same invented sleep data.
 *
 * (`sleep.create()` gains its first caller in Phase 2.1, when SleepLogEntry is
 * routed. Until then the honest rendering is the empty state.)
 */

import React from "react";
import { waitFor } from "@testing-library/react-native";

import { SleepStack } from "./SleepStack";
import { closeDatabase } from "@/shared/data/db";
import { renderWithRepos } from "@/test/renderWithRepos";

describe("SleepStack — truthfulness with an empty repository", () => {
  afterEach(async () => {
    await closeDatabase();
  });

  it("renders the sleep empty state rather than a fabricated night", async () => {
    const { getByTestId, queryByTestId } = await renderWithRepos(
      <SleepStack />,
      { databaseName: "sleepstack_empty_hero.db" },
    );

    await waitFor(() => {
      expect(getByTestId("sleep-empty-state")).toBeTruthy();
    });
    expect(queryByTestId("duration-display")).toBeNull();
  });

  it("does not render a hypnogram for sleep that was never measured", async () => {
    const { getByTestId, queryByTestId } = await renderWithRepos(
      <SleepStack />,
      { databaseName: "sleepstack_empty_stages.db" },
    );

    await waitFor(() => {
      expect(getByTestId("sleep-empty-state")).toBeTruthy();
    });
    expect(queryByTestId("sleep-stages-card")).toBeNull();
  });

  it("does not manufacture a week of zero-hour history", async () => {
    const { getByTestId, queryByTestId } = await renderWithRepos(
      <SleepStack />,
      { databaseName: "sleepstack_empty_history.db" },
    );

    await waitFor(() => {
      expect(getByTestId("sleep-empty-state")).toBeTruthy();
    });
    expect(queryByTestId("weekly-history-card")).toBeNull();
  });

  it("shows the real night once one is logged", async () => {
    const seed = await renderWithRepos(<SleepStack />, {
      databaseName: "sleepstack_with_entry.db",
    });
    const bedtime = new Date("2026-07-26T23:00:00Z").getTime();
    await seed.repos.sleep.create({
      bedtime,
      wokeUp: bedtime + 7 * 60 * 60 * 1000,
      quality: 4,
      date: "2026-07-27",
    });
    seed.unmount();

    const { getByTestId } = await renderWithRepos(<SleepStack />, {
      databaseName: "sleepstack_with_entry.db",
    });

    await waitFor(() => {
      expect(getByTestId("duration-display")).toBeTruthy();
    });
    expect(getByTestId("duration-display").props.accessibilityLabel).toBe(
      "7 hours 0 minutes",
    );
  });
});
