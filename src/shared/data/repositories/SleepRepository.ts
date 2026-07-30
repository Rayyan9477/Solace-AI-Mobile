/**
 * Sleep Repository.
 *
 * @description CRUD over the `sleep_entries` table. Each entry records the
 *   bedtime + wake time as ms-epoch values plus a `YYYY-MM-DD` anchor day so
 *   the dashboard can group by morning regardless of timezone math.
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
  NewSleepEntry,
  SleepEntry,
  SleepQuality,
  SleepStages,
  SyncStatus,
} from "../types";

/** Filter for {@link SleepRepository.list}. */
export interface SleepListFilter {
  /** Lower-bound (inclusive) on `date` (YYYY-MM-DD). */
  readonly fromDate?: string;
  /** Upper-bound (inclusive) on `date` (YYYY-MM-DD). */
  readonly toDate?: string;
  /** Maximum rows returned. */
  readonly limit?: number;
}

/** Public surface of the sleep repository. */
export interface SleepRepository {
  list(filter?: SleepListFilter): Promise<SleepEntry[]>;
  byId(id: string): Promise<SleepEntry | null>;
  byDate(date: string): Promise<SleepEntry | null>;
  create(input: NewSleepEntry): Promise<SleepEntry>;
  update(id: string, patch: Partial<NewSleepEntry>): Promise<SleepEntry>;
  delete(id: string): Promise<void>;
  /** Mean sleep duration in ms across all entries, or null if none. */
  averageDurationMs(): Promise<number | null>;
}

interface SleepRow {
  id: string;
  bedtime: number;
  woke_up: number;
  quality: number | null;
  feelings: string | null;
  date: string;
  /**
   * JSON-encoded {@link SleepStages} payload introduced in migration 002.
   * Rows written before that migration store `NULL`, which decodes to
   * `undefined` at the entity boundary so the dashboard can fall back to
   * the legacy even-split heuristic.
   */
  stages: string | null;
  sync_status: string;
  remote_id: string | null;
  updated_at: number;
}

/** SQLite-backed implementation of {@link SleepRepository}. */
export function createSqliteSleepRepository(
  db: SQLiteDatabase,
): SleepRepository {
  const rowToEntry = (row: SleepRow): SleepEntry => ({
    id: row.id,
    bedtime: row.bedtime,
    wokeUp: row.woke_up,
    quality: clampQuality(optionalNumber(row.quality)),
    feelings: decodeStringArray(row.feelings),
    date: row.date,
    stages: decodeStages(row.stages),
    syncStatus: parseSyncStatus(row.sync_status),
    remoteId: optionalString(row.remote_id),
    updatedAt: row.updated_at,
  });

  return {
    async list(filter) {
      const clauses: string[] = [];
      const params: (number | string)[] = [];
      if (filter?.fromDate) {
        clauses.push("date >= ?");
        params.push(filter.fromDate);
      }
      if (filter?.toDate) {
        clauses.push("date <= ?");
        params.push(filter.toDate);
      }
      const where = clauses.length > 0 ? ` WHERE ${clauses.join(" AND ")}` : "";
      const limit = typeof filter?.limit === "number"
        ? ` LIMIT ${Math.max(0, Math.floor(filter.limit))}`
        : "";
      const rows = await db.getAllAsync<SleepRow>(
        `SELECT * FROM sleep_entries${where} ORDER BY date DESC${limit}`,
        params,
      );
      return rows.map(rowToEntry);
    },

    async byId(id) {
      const row = await db.getFirstAsync<SleepRow>(
        "SELECT * FROM sleep_entries WHERE id = ?",
        [id],
      );
      return row ? rowToEntry(row) : null;
    },

    async byDate(date) {
      const row = await db.getFirstAsync<SleepRow>(
        "SELECT * FROM sleep_entries WHERE date = ? ORDER BY updated_at DESC LIMIT 1",
        [date],
      );
      return row ? rowToEntry(row) : null;
    },

    async create(input) {
      if (input.wokeUp < input.bedtime) {
        throw new Error("Sleep entry wokeUp must be >= bedtime.");
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
        throw new Error(`Invalid sleep date: ${input.date}. Expected YYYY-MM-DD.`);
      }
      const now = Date.now();
      const id = generateId();
      await db.runAsync(
        `INSERT INTO sleep_entries (
          id, bedtime, woke_up, quality, feelings, date, stages,
          sync_status, remote_id, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NULL, ?)`,
        [
          id,
          input.bedtime,
          input.wokeUp,
          input.quality ?? null,
          encodeStringArray(input.feelings),
          input.date,
          encodeStages(input.stages),
          now,
        ],
      );
      return {
        id,
        bedtime: input.bedtime,
        wokeUp: input.wokeUp,
        quality: input.quality,
        feelings: input.feelings,
        date: input.date,
        stages: input.stages,
        syncStatus: "pending",
        updatedAt: now,
      };
    },

    async update(id, patch) {
      const existing = await db.getFirstAsync<SleepRow>(
        "SELECT * FROM sleep_entries WHERE id = ?",
        [id],
      );
      if (!existing) {
        throw new Error(`Sleep entry not found: ${id}`);
      }
      const now = Date.now();
      const next: SleepRow = {
        ...existing,
        bedtime: patch.bedtime ?? existing.bedtime,
        woke_up: patch.wokeUp ?? existing.woke_up,
        quality: patch.quality !== undefined
          ? patch.quality ?? null
          : existing.quality,
        feelings: patch.feelings !== undefined
          ? encodeStringArray(patch.feelings)
          : existing.feelings,
        date: patch.date ?? existing.date,
        stages: patch.stages !== undefined
          ? encodeStages(patch.stages)
          : existing.stages,
        sync_status: "pending",
        updated_at: now,
      };
      await db.runAsync(
        `UPDATE sleep_entries SET
           bedtime = ?, woke_up = ?, quality = ?, feelings = ?, date = ?,
           stages = ?, sync_status = 'pending', updated_at = ?
         WHERE id = ?`,
        [
          next.bedtime,
          next.woke_up,
          next.quality,
          next.feelings,
          next.date,
          next.stages,
          next.updated_at,
          id,
        ],
      );
      return rowToEntry(next);
    },

    async delete(id) {
      await db.runAsync("DELETE FROM sleep_entries WHERE id = ?", [id]);
    },

    async averageDurationMs() {
      const rows = await db.getAllAsync<{ bedtime: number; woke_up: number }>(
        "SELECT bedtime, woke_up FROM sleep_entries",
      );
      if (rows.length === 0) return null;
      const total = rows.reduce((acc, r) => acc + (r.woke_up - r.bedtime), 0);
      return total / rows.length;
    },
  };
}

function clampQuality(value: number | undefined): SleepQuality | undefined {
  if (value === undefined) return undefined;
  const rounded = Math.round(value);
  if (rounded < 1) return 1;
  if (rounded > 5) return 5;
  return rounded as SleepQuality;
}

function parseSyncStatus(raw: string): SyncStatus {
  if (raw === "synced" || raw === "conflict") return raw;
  return "pending";
}

/**
 * Encode the optional {@link SleepStages} payload into the on-disk JSON form.
 * Returns `null` when the caller omits stages so the column stays empty rather
 * than holding a placeholder object.
 */
function encodeStages(value: SleepStages | undefined): string | null {
  if (!value) return null;
  return JSON.stringify({
    deep: clampMinutes(value.deepMinutes),
    core: clampMinutes(value.coreMinutes),
    rem: clampMinutes(value.remMinutes),
    awake: clampMinutes(value.awakeMinutes),
  });
}

/**
 * Decode the JSON-encoded stages column. Tolerates `null` / `undefined` /
 * malformed JSON / missing keys — every defect collapses to `undefined` so
 * pre-migration rows and corrupted writes both fall back to the dashboard's
 * even-split heuristic.
 */
function decodeStages(value: string | null | undefined): SleepStages | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null) return undefined;
    const obj = parsed as Record<string, unknown>;
    const stages: SleepStages = {
      deepMinutes: pickMinutes(obj["deep"]),
      coreMinutes: pickMinutes(obj["core"]),
      remMinutes: pickMinutes(obj["rem"]),
      awakeMinutes: pickMinutes(obj["awake"]),
    };
    return stages;
  } catch {
    return undefined;
  }
}

function pickMinutes(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return clampMinutes(raw);
  }
  return 0;
}

function clampMinutes(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.round(value);
}
