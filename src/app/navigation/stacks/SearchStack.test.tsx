/**
 * SearchStack adapter tests (Phase 1, items 1.1d + 1.2).
 *
 * The adapter was a pass-through: it forwarded `route.params.query` and never
 * supplied results, so `SearchResultsScreen` fell back to 24 invented hits and
 * every query — including `/search/zzzzqqq` — rendered the same ones.
 *
 * These tests drive the screen the way a user does (type into the field) and
 * assert against real seeded journal rows and the real bundled catalogue.
 */

import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { SearchStack } from "./SearchStack";
import { closeDatabase } from "@/shared/data/db";
import { renderWithRepos } from "@/test/renderWithRepos";

/** Seed a journal row, then remount so the adapter reads it on mount. */
async function withJournal(
  databaseName: string,
  body: string,
  title?: string,
): Promise<Awaited<ReturnType<typeof renderWithRepos>>> {
  const seed = await renderWithRepos(<SearchStack />, { databaseName });
  await seed.repos.journal.create({ body, title });
  seed.unmount();
  return renderWithRepos(<SearchStack />, { databaseName });
}

describe("SearchStack — real search", () => {
  afterEach(async () => {
    await closeDatabase();
  });

  it("returns nothing for a query that matches nothing", async () => {
    const { getByTestId, queryByText } = await renderWithRepos(
      <SearchStack />,
      { databaseName: "searchstack_nomatch.db" },
    );

    fireEvent.changeText(getByTestId("search-input"), "zzzzqqq");

    await waitFor(() => {
      expect(getByTestId("search-empty-state")).toBeTruthy();
    });
    // BracketLabel uppercases, so match case-insensitively.
    expect(queryByText(/0 results for "zzzzqqq"/i)).toBeTruthy();
    expect(queryByText(/24 results/i)).toBeNull();
  });

  it("finds a bundled practice the user can actually open", async () => {
    const { getByTestId } = await renderWithRepos(<SearchStack />, {
      databaseName: "searchstack_practice.db",
    });

    fireEvent.changeText(getByTestId("search-input"), "body scan");

    await waitFor(() => {
      expect(getByTestId("result-row-body-scan")).toBeTruthy();
    });
  });

  it("finds the user's own journal entry", async () => {
    const { getByTestId, getByText } = await withJournal(
      "searchstack_journal.db",
      "Anxious about the deadline on Friday.",
      "Work stress",
    );

    fireEvent.changeText(getByTestId("search-input"), "deadline");

    await waitFor(() => {
      expect(getByText("Work stress")).toBeTruthy();
    });
  });

  it("does not surface a journal entry that does not match", async () => {
    const { getByTestId, queryByText } = await withJournal(
      "searchstack_journal_miss.db",
      "Went for a walk by the river.",
      "Riverside",
    );

    fireEvent.changeText(getByTestId("search-input"), "deadline");

    await waitFor(() => {
      expect(getByTestId("search-empty-state")).toBeTruthy();
    });
    expect(queryByText("Riverside")).toBeNull();
  });

  it("returns to the idle prompt when the query is cleared", async () => {
    const { getByTestId } = await renderWithRepos(<SearchStack />, {
      databaseName: "searchstack_clear.db",
    });

    fireEvent.changeText(getByTestId("search-input"), "body scan");
    await waitFor(() => {
      expect(getByTestId("result-row-body-scan")).toBeTruthy();
    });

    fireEvent.press(getByTestId("clear-button"));

    await waitFor(() => {
      expect(getByTestId("search-idle-state")).toBeTruthy();
    });
    expect(getByTestId("search-input").props.value).toBe("");
  });

  it("filters to a single category when a pill is pressed", async () => {
    const { getByTestId, queryByTestId, getAllByText } = await withJournal(
      "searchstack_filter.db",
      "Tried a body scan before bed and it helped.",
      "Bedtime",
    );

    fireEvent.changeText(getByTestId("search-input"), "body scan");
    await waitFor(() => {
      expect(getByTestId("practices-section")).toBeTruthy();
    });
    expect(getByTestId("journal-section")).toBeTruthy();

    fireEvent.press(getAllByText(/Journal/)[0]);

    await waitFor(() => {
      expect(queryByTestId("practices-section")).toBeNull();
    });
    expect(getByTestId("journal-section")).toBeTruthy();
  });
});
