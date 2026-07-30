/**
 * Mindful Repository.
 *
 * @description CRUD + aggregate analytics over the `mindful_sessions` table
 *   introduced in migration 002. Every write sets `sync_status = 'pending'`
 *   and stamps `updated_at` so the sync loop can pick the row up later.
 *
 *   Drives the Profile dashboard's `mindfulHours` aggregate (sum of recent
 *   `duration_ms` divided by 3 600 000) and the future Sprint 14 mindful
 *   history surface.
 *
 * @module shared/data/repositories
 */

import type { SQLiteDatabase } from "expo-sqlite";

import { generateId } from "../ids";
import { optionalString } from "../serialize";
import type {
  MindfulSession,
  MindfulSessionType,
  NewMindfulSession,
  SyncStatus,
} from "../types";

/** Filter for {@link MindfulRepository.list} / aggregates. */
export interface MindfulListFilter {
  /**
   * Lower-bound (inclusive) on `completed_at` (ms epoch). Used by the Profile
   * dashboard to scope `mindfulHours` to the last 30 days.
   */
  readonly since?: number;
  /** Maximum rows returned. */
  readonly limit?: number;
}

/** Public surface of the mindful repository. */
export interface MindfulRepository {
  /** List sessions newest-first. Optionally bounded by `since` / `limit`. */
  list(filter?: MindfulListFilter): Promise<MindfulSession[]>;
  /** Insert a new session. Generates an id and stamps sync metadata. */
  create(input: NewMindfulSession): Promise<MindfulSession>;
  /** Look up a single session by primary key. Resolves null if missing. */
  byId(id: string): Promise<MindfulSession | null>;
  /** Sum of `duration_ms` across sessions, optionally bounded by `since`. */
  totalDurationMs(filter?: Pick<MindfulListFilter, "since">): Promise<number>;
  /** Number of sessions, optionally bounded by `since`. */
  count(filter?: Pick<MindfulListFilter, "since">): Promise<number>;
}

interface MindfulRow {
  id: string;
  type: string;
  duration_ms: number;
  completed_at: number;
  notes: string | null;
  created_at: number;
  sync_status: string;
  remote_id: string | null;
  updated_at: number;
}

/** Allowed values for `mindful_sessions.type`. */
const VALID_TYPES: ReadonlySet<MindfulSessionType> = new Set([
  "meditation",
  "breathing",
  "sound",
  "body-scan",
]);

/** Build a SQLite-backed implementation of {@link MindfulRepository}. */
export function createSqliteMindfulRepository(
  db: SQLiteDatabase,
): MindfulRepository {
  const rowToEntry = (row: MindfulRow): MindfulSession => ({
    id: row.id,
    type: parseType(row.type),
    durationMs: Math.max(0, row.duration_ms),
    completedAt: row.completed_at,
    notes: optionalString(row.notes),
    createdAt: row.created_at,
    syncStatus: parseSyncStatus(row.sync_status),
    remoteId: optionalString(row.remote_id),
    updatedAt: row.updated_at,
  });

  return {
    async list(filter) {
      const clauses: string[] = [];
      const params: (number | string)[] = [];
      if (typeof filter?.since === "number") {
        clauses.push("completed_at >= ?");
        params.push(filter.since);
      }
      const where = clauses.length > 0 ? ` WHERE ${clauses.join(" AND ")}` : "";
      const limit = typeof filter?.limit === "number"
        ? ` LIMIT ${Math.max(0, Math.floor(filter.limit))}`
        : "";
      const rows = await db.getAllAsync<MindfulRow>(
        `SELECT * FROM mindful_sessions${where} ORDER BY completed_at DESC${limit}`,
        params,
      );
      return rows.map(rowToEntry);
    },

    async byId(id) {
      const row = await db.getFirstAsync<MindfulRow>(
        "SELECT * FROM mindful_sessions WHERE id = ?",
        [id],
      );
      return row ? rowToEntry(row) : null;
    },

    async create(input) {
      if (!VALID_TYPES.has(input.type)) {
        throw new Error(`Invalid mindful session type: ${input.type}`);
      }
      if (!Number.isFinite(input.durationMs) || input.durationMs < 0) {
        throw new Error(
          `Invalid mindful session durationMs: ${input.durationMs}. Expected >= 0.`,
        );
      }
      const now = Date.now();
      const completedAt = input.completedAt ?? now;
      const id = generateId();
      await db.runAsync(
        `INSERT INTO mindful_sessions (
          id, type, duration_ms, completed_at, notes, created_at,
          sync_status, remote_id, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NULL, ?)`,
        [
          id,
          input.type,
          input.durationMs,
          completedAt,
          input.notes ?? null,
          now,
          now,
        ],
      );
      return {
        id,
        type: input.type,
        durationMs: input.durationMs,
        completedAt,
        notes: input.notes,
        createdAt: now,
        syncStatus: "pending",
        updatedAt: now,
      };
    },

    async totalDurationMs(filter) {
      // The mock SQL layer's SUM() coverage is partial — pull rows and reduce
      // in JS so the contract holds on every target (production + tests).
      const rows = await fetchDurationRows(db, filter?.since);
      return rows.reduce((acc, r) => acc + (r.duration_ms ?? 0), 0);
    },

    async count(filter) {
      const rows = await fetchDurationRows(db, filter?.since);
      return rows.length;
    },
  };
}

async function fetchDurationRows(
  db: SQLiteDatabase,
  since: number | undefined,
): Promise<readonly { duration_ms: number }[]> {
  if (typeof since === "number") {
    return db.getAllAsync<{ duration_ms: number }>(
      "SELECT duration_ms FROM mindful_sessions WHERE completed_at >= ?",
      [since],
    );
  }
  return db.getAllAsync<{ duration_ms: number }>(
    "SELECT duration_ms FROM mindful_sessions",
  );
}

function parseType(raw: string): MindfulSessionType {
  if (
    raw === "meditation" ||
    raw === "breathing" ||
    raw === "sound" ||
    raw === "body-scan"
  ) {
    return raw;
  }
  // Defensive fallback — the column is constrained by the create() guard,
  // but if a malformed row is loaded (e.g. future migration) treat it as a
  // generic meditation rather than throwing inside a UI render path.
  return "meditation";
}

function parseSyncStatus(raw: string): SyncStatus {
  if (raw === "synced" || raw === "conflict") return raw;
  return "pending";
}
