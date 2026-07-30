/**
 * Journal Repository.
 *
 * @description CRUD over the `journal_entries` table. Like other repos, every
 *   write flips `sync_status` to `pending` and stamps `updated_at`.
 *
 * @module shared/data/repositories
 */

import type { SQLiteDatabase } from "expo-sqlite";

import { generateId } from "../ids";
import {
  decodeStringArray,
  encodeStringArray,
  optionalNumber,
  optionalString,
} from "../serialize";
import type {
  JournalEntry,
  MoodLevel,
  NewJournalEntry,
  SyncStatus,
} from "../types";

/** Filter for {@link JournalRepository.list}. */
export interface JournalListFilter {
  /** Lower-bound (inclusive) on `createdAt`. */
  readonly fromDate?: Date;
  /** Upper-bound (exclusive) on `createdAt`. */
  readonly toDate?: Date;
  /** Plain-text search applied to `body` / `title` (case-insensitive). */
  readonly search?: string;
  /** Restrict to entries tagged with the given hashtag. */
  readonly hashtag?: string;
  /** Maximum rows returned. */
  readonly limit?: number;
}

/** Public surface of the journal repository. */
export interface JournalRepository {
  list(filter?: JournalListFilter): Promise<JournalEntry[]>;
  byId(id: string): Promise<JournalEntry | null>;
  create(input: NewJournalEntry): Promise<JournalEntry>;
  update(id: string, patch: Partial<NewJournalEntry>): Promise<JournalEntry>;
  delete(id: string): Promise<void>;
  /** Total number of entries on disk. */
  count(): Promise<number>;
}

interface JournalRow {
  id: string;
  title: string | null;
  body: string;
  mood_level: number | null;
  hashtags: string | null;
  created_at: number;
  sync_status: string;
  remote_id: string | null;
  updated_at: number;
}

/** SQLite-backed implementation of {@link JournalRepository}. */
export function createSqliteJournalRepository(
  db: SQLiteDatabase,
): JournalRepository {
  const rowToEntry = (row: JournalRow): JournalEntry => ({
    id: row.id,
    title: optionalString(row.title),
    body: row.body,
    moodLevel: clampMoodLevel(optionalNumber(row.mood_level)),
    hashtags: decodeStringArray(row.hashtags),
    createdAt: row.created_at,
    syncStatus: parseSyncStatus(row.sync_status),
    remoteId: optionalString(row.remote_id),
    updatedAt: row.updated_at,
  });

  return {
    async list(filter) {
      const clauses: string[] = [];
      const params: (number | string)[] = [];
      if (filter?.fromDate) {
        clauses.push("created_at >= ?");
        params.push(filter.fromDate.getTime());
      }
      if (filter?.toDate) {
        clauses.push("created_at < ?");
        params.push(filter.toDate.getTime());
      }
      if (filter?.search && filter.search.trim().length > 0) {
        clauses.push("(LOWER(body) LIKE ? OR LOWER(IFNULL(title, '')) LIKE ?)");
        const needle = `%${filter.search.toLowerCase()}%`;
        params.push(needle, needle);
      }
      if (filter?.hashtag) {
        clauses.push("hashtags LIKE ?");
        params.push(`%${JSON.stringify(filter.hashtag).slice(1, -1)}%`);
      }
      const where = clauses.length > 0 ? ` WHERE ${clauses.join(" AND ")}` : "";
      const limit = typeof filter?.limit === "number"
        ? ` LIMIT ${Math.max(0, Math.floor(filter.limit))}`
        : "";
      const rows = await db.getAllAsync<JournalRow>(
        `SELECT * FROM journal_entries${where} ORDER BY created_at DESC${limit}`,
        params,
      );
      return rows.map(rowToEntry);
    },

    async byId(id) {
      const row = await db.getFirstAsync<JournalRow>(
        "SELECT * FROM journal_entries WHERE id = ?",
        [id],
      );
      return row ? rowToEntry(row) : null;
    },

    async create(input) {
      if (typeof input.body !== "string" || input.body.length === 0) {
        throw new Error("Journal entry body must be a non-empty string.");
      }
      const now = Date.now();
      const createdAt = input.createdAt ?? now;
      const id = generateId();
      await db.runAsync(
        `INSERT INTO journal_entries (
          id, title, body, mood_level, hashtags, created_at,
          sync_status, remote_id, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NULL, ?)`,
        [
          id,
          input.title ?? null,
          input.body,
          input.moodLevel ?? null,
          encodeStringArray(input.hashtags),
          createdAt,
          now,
        ],
      );
      return {
        id,
        title: input.title,
        body: input.body,
        moodLevel: input.moodLevel,
        hashtags: input.hashtags,
        createdAt,
        syncStatus: "pending",
        updatedAt: now,
      };
    },

    async update(id, patch) {
      const existing = await db.getFirstAsync<JournalRow>(
        "SELECT * FROM journal_entries WHERE id = ?",
        [id],
      );
      if (!existing) {
        throw new Error(`Journal entry not found: ${id}`);
      }
      const now = Date.now();
      const next: JournalRow = {
        ...existing,
        title: patch.title !== undefined ? patch.title ?? null : existing.title,
        body: patch.body ?? existing.body,
        mood_level: patch.moodLevel !== undefined
          ? patch.moodLevel ?? null
          : existing.mood_level,
        hashtags: patch.hashtags !== undefined
          ? encodeStringArray(patch.hashtags)
          : existing.hashtags,
        created_at: patch.createdAt ?? existing.created_at,
        sync_status: "pending",
        updated_at: now,
      };
      await db.runAsync(
        `UPDATE journal_entries SET
           title = ?, body = ?, mood_level = ?, hashtags = ?, created_at = ?,
           sync_status = 'pending', updated_at = ?
         WHERE id = ?`,
        [
          next.title,
          next.body,
          next.mood_level,
          next.hashtags,
          next.created_at,
          next.updated_at,
          id,
        ],
      );
      return rowToEntry(next);
    },

    async delete(id) {
      await db.runAsync("DELETE FROM journal_entries WHERE id = ?", [id]);
    },

    async count() {
      const row = await db.getFirstAsync<{ n: number }>(
        "SELECT COUNT(*) AS n FROM journal_entries",
      );
      return row?.n ?? 0;
    },
  };
}

function clampMoodLevel(value: number | undefined): MoodLevel | undefined {
  if (value === undefined) return undefined;
  const rounded = Math.round(value);
  if (rounded < 1) return 1;
  if (rounded > 5) return 5;
  return rounded as MoodLevel;
}

function parseSyncStatus(raw: string): SyncStatus {
  if (raw === "synced" || raw === "conflict") return raw;
  return "pending";
}
