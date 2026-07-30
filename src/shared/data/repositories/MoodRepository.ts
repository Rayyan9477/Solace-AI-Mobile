/**
 * Mood Repository.
 *
 * @description CRUD + analytics over the `mood_entries` table.
 *   All writes set `sync_status = 'pending'` and stamp `updated_at` so the
 *   sync loop can pick the row up later.
 *
 * @module shared/data/repositories
 */

import type { SQLiteDatabase } from "expo-sqlite";

import { generateId } from "../ids";
import {
  decodeStringArray,
  encodeStringArray,
  optionalString,
} from "../serialize";
import type {
  MoodCalendarCell,
  MoodEntry,
  MoodLevel,
  NewMoodEntry,
  SyncStatus,
} from "../types";

/** Filter for {@link MoodRepository.list}. */
export interface MoodListFilter {
  /** Lower-bound (inclusive) on `createdAt`. */
  readonly fromDate?: Date;
  /** Upper-bound (exclusive) on `createdAt`. */
  readonly toDate?: Date;
  /** Maximum rows returned. */
  readonly limit?: number;
}

/** Public surface of the mood repository. */
export interface MoodRepository {
  /** List entries newest-first. Optionally filtered by date / limit. */
  list(filter?: MoodListFilter): Promise<MoodEntry[]>;
  /** Look up a single entry by primary key. Resolves null if missing. */
  byId(id: string): Promise<MoodEntry | null>;
  /** Insert a new entry. Generates an id and stamps sync metadata. */
  create(input: NewMoodEntry): Promise<MoodEntry>;
  /** Patch an existing entry. Only the fields supplied are updated. */
  update(id: string, patch: Partial<NewMoodEntry>): Promise<MoodEntry>;
  /** Hard-delete an entry. No-op if the id does not exist. */
  delete(id: string): Promise<void>;
  /** Number of consecutive days (ending today) with at least one entry. */
  getStreak(): Promise<number>;
  /** Calendar cells for a given month. `month` is 1..12. */
  getCalendar(month: number, year: number): Promise<MoodCalendarCell[]>;
}

interface MoodRow {
  id: string;
  level: number;
  note: string | null;
  influences: string | null;
  created_at: number;
  sync_status: string;
  remote_id: string | null;
  updated_at: number;
}

/**
 * Build a SQLite-backed implementation of {@link MoodRepository}.
 *
 * @param db - Open database handle returned by `openDatabase()`.
 */
export function createSqliteMoodRepository(
  db: SQLiteDatabase,
): MoodRepository {
  const rowToEntry = (row: MoodRow): MoodEntry => ({
    id: row.id,
    level: clampLevel(row.level),
    note: optionalString(row.note),
    influences: decodeStringArray(row.influences),
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
      const where = clauses.length > 0 ? ` WHERE ${clauses.join(" AND ")}` : "";
      const limit = typeof filter?.limit === "number"
        ? ` LIMIT ${Math.max(0, Math.floor(filter.limit))}`
        : "";
      const rows = await db.getAllAsync<MoodRow>(
        `SELECT * FROM mood_entries${where} ORDER BY created_at DESC${limit}`,
        params,
      );
      return rows.map(rowToEntry);
    },

    async byId(id) {
      const row = await db.getFirstAsync<MoodRow>(
        "SELECT * FROM mood_entries WHERE id = ?",
        [id],
      );
      return row ? rowToEntry(row) : null;
    },

    async create(input) {
      const now = Date.now();
      const createdAt = input.createdAt ?? now;
      const id = generateId();
      await db.runAsync(
        `INSERT INTO mood_entries (
          id, level, note, influences, created_at,
          sync_status, remote_id, updated_at
        ) VALUES (?, ?, ?, ?, ?, 'pending', NULL, ?)`,
        [
          id,
          input.level,
          input.note ?? null,
          encodeStringArray(input.influences),
          createdAt,
          now,
        ],
      );
      return {
        id,
        level: input.level,
        note: input.note,
        influences: input.influences,
        createdAt,
        syncStatus: "pending",
        updatedAt: now,
      };
    },

    async update(id, patch) {
      const existing = await db.getFirstAsync<MoodRow>(
        "SELECT * FROM mood_entries WHERE id = ?",
        [id],
      );
      if (!existing) {
        throw new Error(`Mood entry not found: ${id}`);
      }
      const now = Date.now();
      const next: MoodRow = {
        ...existing,
        level: patch.level ?? existing.level,
        note: patch.note !== undefined ? patch.note : existing.note,
        influences: patch.influences !== undefined
          ? encodeStringArray(patch.influences)
          : existing.influences,
        created_at: patch.createdAt ?? existing.created_at,
        sync_status: "pending",
        updated_at: now,
      };
      await db.runAsync(
        `UPDATE mood_entries SET
           level = ?, note = ?, influences = ?, created_at = ?,
           sync_status = 'pending', updated_at = ?
         WHERE id = ?`,
        [
          next.level,
          next.note,
          next.influences,
          next.created_at,
          next.updated_at,
          id,
        ],
      );
      return rowToEntry(next);
    },

    async delete(id) {
      await db.runAsync("DELETE FROM mood_entries WHERE id = ?", [id]);
    },

    async getStreak() {
      const rows = await db.getAllAsync<{ created_at: number }>(
        "SELECT created_at FROM mood_entries ORDER BY created_at DESC",
      );
      if (rows.length === 0) return 0;
      const days = new Set<string>();
      for (const r of rows) {
        days.add(toLocalDateKey(r.created_at));
      }
      let streak = 0;
      const cursor = new Date();
      cursor.setHours(0, 0, 0, 0);
      while (days.has(toLocalDateKey(cursor.getTime()))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
      return streak;
    },

    async getCalendar(month, year) {
      if (month < 1 || month > 12) {
        throw new Error(`Invalid month: ${month}. Expected 1..12.`);
      }
      const start = new Date(year, month - 1, 1).getTime();
      const end = new Date(year, month, 1).getTime();
      const rows = await db.getAllAsync<{
        created_at: number;
        level: number;
      }>(
        `SELECT created_at, level FROM mood_entries
         WHERE created_at >= ? AND created_at < ?`,
        [start, end],
      );
      const buckets = new Map<number, { sum: number; count: number }>();
      for (const r of rows) {
        const day = new Date(r.created_at).getDate();
        const bucket = buckets.get(day) ?? { sum: 0, count: 0 };
        bucket.sum += r.level;
        bucket.count += 1;
        buckets.set(day, bucket);
      }
      const lastDay = new Date(year, month, 0).getDate();
      const cells: MoodCalendarCell[] = [];
      for (let day = 1; day <= lastDay; day += 1) {
        const bucket = buckets.get(day);
        cells.push({
          day,
          date: formatIsoDate(year, month, day),
          averageLevel: bucket ? bucket.sum / bucket.count : null,
          entryCount: bucket ? bucket.count : 0,
        });
      }
      return cells;
    },
  };
}

function clampLevel(value: number): MoodLevel {
  const rounded = Math.round(value);
  if (rounded <= 1) return 1;
  if (rounded >= 5) return 5;
  return rounded as MoodLevel;
}

function parseSyncStatus(raw: string): SyncStatus {
  if (raw === "synced" || raw === "conflict") return raw;
  return "pending";
}

function toLocalDateKey(ms: number): string {
  const d = new Date(ms);
  return formatIsoDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function formatIsoDate(year: number, month: number, day: number): string {
  const m = month.toString().padStart(2, "0");
  const d = day.toString().padStart(2, "0");
  return `${year}-${m}-${d}`;
}
