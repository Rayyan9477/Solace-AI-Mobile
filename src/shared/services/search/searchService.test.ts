/**
 * searchService tests (Phase 1, item 1.2).
 *
 * Before this module existed, `SearchResultsScreen` never received a result set
 * at all: `SearchStack` passed only a query, so the screen fell back to 24
 * invented hits and `/search/zzzzqqq` reported "24 RESULTS FOR "ZZZZQQQ"".
 *
 * These tests pin the two properties that failure violated:
 *   1. a query that matches nothing returns nothing;
 *   2. what comes back is derived from real content — the bundled catalogue and
 *      the user's own journal — and nothing else.
 */

import { searchContent } from "./searchService";
import type { JournalEntry } from "../../data/types";

const entry = (over: Partial<JournalEntry> = {}): JournalEntry => ({
  id: "j1",
  syncStatus: "pending",
  updatedAt: 1_700_000_000_000,
  body: "Nothing in particular happened today.",
  createdAt: Date.UTC(2026, 3, 3, 12, 0, 0),
  ...over,
});

describe("searchContent — honesty", () => {
  it("returns nothing for a query that matches no content", () => {
    const results = searchContent("zzzzqqq", { journal: [] });
    expect(results.practices).toHaveLength(0);
    expect(results.journal).toHaveLength(0);
    expect(results.articles).toHaveLength(0);
  });

  it("returns nothing for an empty query rather than dumping the catalogue", () => {
    const results = searchContent("", { journal: [entry()] });
    expect(results.practices).toHaveLength(0);
    expect(results.journal).toHaveLength(0);
    expect(results.articles).toHaveLength(0);
  });

  it("treats a whitespace-only query as empty", () => {
    const results = searchContent("   ", { journal: [entry()] });
    expect(results.practices).toHaveLength(0);
    expect(results.articles).toHaveLength(0);
  });

  it("does not match a journal entry whose text is unrelated to the query", () => {
    const results = searchContent("kayaking", {
      journal: [entry({ body: "Worked late and skipped lunch again." })],
    });
    expect(results.journal).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Precision.
//
// These came out of probing the first working version rather than from the
// spec. Fuzzy matching with a loose threshold degrades badly on short input:
// "a" returned all twelve practices and all three journal entries, "the"
// returned seven practices, and "rain" matched a journal entry reading "Worked
// late and skipped lunch again" — it had fuzzily matched "again". Recall was
// fine; precision was the problem, and none of the tests above could see it.
// ---------------------------------------------------------------------------

describe("searchContent — precision", () => {
  const journal = [
    entry({ id: "lunch", body: "Worked late and skipped lunch again." }),
    entry({ id: "deadline", body: "Anxious about the deadline on Friday." }),
    entry({ id: "walk", body: "Went for a walk by the river, felt calmer." }),
  ];

  it("does not match the whole catalogue for a single letter", () => {
    const results = searchContent("a", { journal });
    expect(results.practices).toHaveLength(0);
    expect(results.journal).toHaveLength(0);
  });

  it("does not match everything for a short common word", () => {
    const results = searchContent("the", { journal });
    expect(results.practices).toHaveLength(0);
  });

  it("does not match a lunch entry when searching for rain", () => {
    const results = searchContent("rain", { journal });
    expect(results.journal).toHaveLength(0);
    expect(results.practices.map((p) => p.id)).toEqual(["rain"]);
  });

  it("does not return a meditation for a sleep query it has nothing to do with", () => {
    const results = searchContent("sleep", { journal });
    expect(results.practices.map((p) => p.id)).not.toContain("loving-kindness");
    expect(results.practices.map((p) => p.id)).toContain("wind-down");
  });

  it("ranks the exact title match first", () => {
    const results = searchContent("body scan", { journal });
    expect(results.practices[0]?.id).toBe("body-scan");
  });

  it("keeps typo tolerance without dragging in unrelated practices", () => {
    const ids = searchContent("breth", { journal }).practices.map((p) => p.id);
    expect(ids).toContain("breath-478");
    expect(ids).not.toContain("bowl");
  });
});

describe("searchContent — bundled catalogue", () => {
  it("finds a bundled practice by title", () => {
    const results = searchContent("body scan", { journal: [] });
    expect(results.practices.map((p) => p.id)).toContain("body-scan");
  });

  it("matches case-insensitively", () => {
    const upper = searchContent("BODY SCAN", { journal: [] });
    const lower = searchContent("body scan", { journal: [] });
    expect(upper.practices.map((p) => p.id)).toEqual(
      lower.practices.map((p) => p.id),
    );
    expect(upper.practices.length).toBeGreaterThan(0);
  });

  it("tolerates a small typo", () => {
    const results = searchContent("breth", { journal: [] });
    expect(results.practices.length).toBeGreaterThan(0);
  });

  // The app bundles no article content. The three "articles" on the home
  // carousel are practices — the sprint plan calls that row a "3-article
  // carousel" but every item maps to a mindful session, and `onArticlePress` is
  // a no-op. Indexing them would return duplicate practices under a second
  // label and produce rows that navigate nowhere, which is the class of bug
  // this whole phase exists to remove. The bucket stays in the result type so
  // a real article library (Phase 2) drops straight in.
  it("returns no articles, because none are bundled yet", () => {
    const results = searchContent("meditation", { journal: [] });
    expect(results.articles).toHaveLength(0);
    expect(results.practices.length).toBeGreaterThan(0);
  });

  it("finds a soundscape, which is playable bundled content", () => {
    const results = searchContent("rain", { journal: [] });
    expect(results.practices.map((p) => p.id)).toContain("rain");
  });

  it("labels every practice result as a practice", () => {
    const results = searchContent("breath", { journal: [] });
    expect(results.practices.length).toBeGreaterThan(0);
    results.practices.forEach((p) => expect(p.type).toBe("practice"));
  });
});

describe("searchContent — journal", () => {
  it("finds a journal entry by its body text", () => {
    const results = searchContent("deadline", {
      journal: [entry({ body: "Anxious about the deadline on Friday." })],
    });
    expect(results.journal.map((j) => j.id)).toEqual(["j1"]);
  });

  it("finds a journal entry by its title", () => {
    const results = searchContent("commute", {
      journal: [entry({ title: "The commute", body: "Long day." })],
    });
    expect(results.journal.map((j) => j.id)).toEqual(["j1"]);
  });

  it("finds a journal entry by hashtag", () => {
    const results = searchContent("gratitude", {
      journal: [entry({ hashtags: ["gratitude"], body: "Small wins." })],
    });
    expect(results.journal.map((j) => j.id)).toEqual(["j1"]);
  });

  it("renders the entry's own mood label, not an invented one", () => {
    const results = searchContent("deadline", {
      journal: [entry({ body: "The deadline slipped.", moodLevel: 2 })],
    });
    expect(results.journal[0]?.mood).toBe("Down");
  });

  it("leaves the mood blank when the entry has none", () => {
    const results = searchContent("deadline", {
      journal: [entry({ body: "The deadline slipped." })],
    });
    expect(results.journal[0]?.mood).toBe("");
  });

  it("dates the result from the entry's own createdAt", () => {
    const results = searchContent("deadline", {
      journal: [
        entry({
          body: "The deadline slipped.",
          createdAt: Date.UTC(2026, 0, 9),
        }),
      ],
    });
    expect(results.journal[0]?.date).toMatch(/Jan 9/);
  });

  it("previews the entry body rather than a placeholder", () => {
    const results = searchContent("deadline", {
      journal: [entry({ body: "The deadline slipped and I felt it." })],
    });
    expect(results.journal[0]?.preview).toContain("The deadline slipped");
  });

  it("does not put journal matches into the practices bucket", () => {
    const results = searchContent("breathing", {
      journal: [entry({ body: "Tried some breathing before bed." })],
    });
    expect(results.journal).toHaveLength(1);
    expect(results.practices.every((p) => p.type === "practice")).toBe(true);
    expect(results.practices.map((p) => p.id)).not.toContain("j1");
  });

  it("returns every matching entry, not a truncated sample", () => {
    const many = Array.from({ length: 12 }, (_, i) =>
      entry({ id: `j${i}`, body: `Deadline notes number ${i}.` }),
    );
    const results = searchContent("deadline", { journal: many });
    expect(results.journal).toHaveLength(12);
  });
});
