/**
 * Search service.
 *
 * @description Builds an in-memory fuzzy index over everything the app can
 *   actually show: the bundled practice catalogue and the user's own journal
 *   entries. Pure and synchronous — the caller supplies the journal rows it has
 *   already read, so this module never touches the database and stays trivially
 *   testable.
 *
 *   Two rules are load-bearing here:
 *
 *   1. **An empty query returns nothing.** Not the whole catalogue — nothing.
 *      "Type to search" is a different state from "here is everything".
 *   2. **No result is invented.** Practices come from
 *      {@link PRACTICE_CATALOG}; journal results come from rows the user wrote.
 *      Articles are always empty because the app bundles no article content.
 *
 * @module shared/services/search
 */

import Fuse, { type IFuseOptions } from "fuse.js";

import type {
  JournalResult,
  PracticeResult,
  SearchResults,
} from "../../../features/search/screens/SearchResultsScreen";
import { MOOD_LABELS } from "../../components/primitives";
import { PRACTICE_CATALOG, type CatalogPractice } from "../../content/catalog";
import type { JournalEntry } from "../../data/types";

/** The corpora a search runs against. */
export interface SearchSources {
  /** Journal rows already loaded from the repository. */
  readonly journal: readonly JournalEntry[];
}

/**
 * Fuzziness. 0 demands an exact match, 1 matches anything.
 *
 * Tuned by sweeping 0.2/0.25/0.3 against a fixed query set. Threshold turned
 * out to matter far less than {@link MIN_MATCH_LENGTH}: at 0.25 and above,
 * "rain" started matching a journal entry reading "…skipped lunch again".
 */
const THRESHOLD = 0.2;

/**
 * Shortest run of characters that counts as a match. This is the setting that
 * actually buys precision. At 2, single letters matched the entire catalogue;
 * at 4, typo tolerance died ("breth" stopped finding "4-7-8 breath"). 3 keeps
 * the typo tolerance and drops the noise.
 */
const MIN_MATCH_LENGTH = 3;

const PRACTICE_OPTIONS: IFuseOptions<CatalogPractice> = {
  threshold: THRESHOLD,
  ignoreLocation: true,
  minMatchCharLength: MIN_MATCH_LENGTH,
  keys: [
    { name: "title", weight: 3 },
    { name: "caption", weight: 1 },
    { name: "keywords", weight: 2 },
  ],
};

const JOURNAL_OPTIONS: IFuseOptions<JournalEntry> = {
  threshold: THRESHOLD,
  ignoreLocation: true,
  minMatchCharLength: MIN_MATCH_LENGTH,
  keys: [
    { name: "title", weight: 3 },
    { name: "hashtags", weight: 2 },
    { name: "body", weight: 1 },
  ],
};

/** Rebuilt per call for the journal (rows change); static for the catalogue. */
const practiceIndex = new Fuse(
  PRACTICE_CATALOG as CatalogPractice[],
  PRACTICE_OPTIONS,
);

const PREVIEW_LENGTH = 90;

/**
 * Search bundled content and the user's journal.
 *
 * @param query - Raw text from the search field.
 * @param sources - Corpora to search. See {@link SearchSources}.
 * @returns Results grouped by category, ordered by relevance within each.
 *   Every array is empty when `query` is blank or matches nothing.
 */
export function searchContent(
  query: string,
  sources: SearchSources,
): SearchResults {
  const needle = query.trim();
  if (needle.length === 0) {
    return { practices: [], journal: [], articles: [] };
  }

  const practices = practiceIndex
    .search(needle)
    .map(({ item }) => toPracticeResult(item));

  const journalIndex = new Fuse(
    sources.journal as JournalEntry[],
    JOURNAL_OPTIONS,
  );
  const journal = journalIndex
    .search(needle)
    .map(({ item }) => toJournalResult(item));

  // Articles: see the note in `shared/content/catalog` — none are bundled.
  return { practices, journal, articles: [] };
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function toPracticeResult(practice: CatalogPractice): PracticeResult {
  return {
    id: practice.id,
    type: "practice",
    iconName: practice.iconName,
    hue: practice.hue,
    title: practice.title,
    caption: practice.caption,
  };
}

function toJournalResult(entry: JournalEntry): JournalResult {
  return {
    id: entry.id,
    type: "journal",
    date: formatEntryDate(entry.createdAt),
    // Blank rather than a stand-in: an entry logged without a mood has none.
    mood: entry.moodLevel ? (MOOD_LABELS[entry.moodLevel] ?? "") : "",
    title: entry.title?.trim() || firstLine(entry.body),
    preview: preview(entry.body),
  };
}

function formatEntryDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function firstLine(body: string): string {
  const line = body.split("\n", 1)[0]?.trim() ?? "";
  return line.length > 0 ? truncate(line, 48) : "Untitled entry";
}

function preview(body: string): string {
  return truncate(body.replace(/\s+/g, " ").trim(), PREVIEW_LENGTH);
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}
