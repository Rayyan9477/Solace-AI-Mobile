/**
 * Migration 002 — mindful sessions table + sleep stage breakdown column.
 *
 * @description Two production gaps surfaced in Sprint 11/12 reviews are
 *   addressed in a single forward step:
 *
 *   1. **Mindful sessions** — the Profile dashboard reports `mindfulHours = 0`
 *      because no table existed. This migration creates `mindful_sessions`
 *      with the standard sync triplet (`sync_status`/`remote_id`/`updated_at`)
 *      plus completion-time and sync-status indexes.
 *
 *   2. **Sleep stage breakdown** — `SleepRepository` had no place to store the
 *      deep / core / REM / awake breakdown, so the dashboard fabricated an
 *      even split. This migration adds a nullable `stages` JSON column to
 *      `sleep_entries`. Existing rows keep their NULL value and decode to
 *      `undefined` at the entity layer — the dashboard then falls back to the
 *      legacy even split for those rows.
 *
 *   The script is idempotent: `CREATE TABLE IF NOT EXISTS` plus a guarded
 *   `ALTER TABLE` (see {@link MIGRATION_002_PRELUDE_SQL} / `runMigration002`)
 *   means a re-run is a no-op once the schema has been applied.
 *
 * @module shared/data/migrations
 */

import type { SQLiteDatabase } from "expo-sqlite";

/**
 * SQL fragment that creates the `mindful_sessions` table and its indexes.
 * Exported separately so the registry can ship it as the `up` script when the
 * column-existence check (handled by {@link runMigration002}) is unnecessary —
 * `CREATE TABLE IF NOT EXISTS` is already idempotent on its own.
 */
export const MINDFUL_SESSIONS_SQL: string = `
CREATE TABLE IF NOT EXISTS mindful_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  type TEXT NOT NULL,
  duration_ms INTEGER NOT NULL,
  completed_at INTEGER NOT NULL,
  notes TEXT,
  created_at INTEGER NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  remote_id TEXT,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mindful_sessions_completed_at
  ON mindful_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_mindful_sessions_sync_status
  ON mindful_sessions(sync_status);
`;

/** SQL added to `sleep_entries` for the optional per-stage JSON column. */
export const SLEEP_STAGES_ALTER_SQL: string =
  "ALTER TABLE sleep_entries ADD COLUMN stages TEXT";

/**
 * Combined `up` script. The runner uses {@link runMigration002} (which guards
 * the ALTER against re-runs by inspecting `PRAGMA table_info`); the raw string
 * is exported so the migration is still discoverable as a regular SQL blob for
 * the registry, tooling, and assertions in tests.
 */
export const MIGRATION_002_SQL: string = `${MINDFUL_SESSIONS_SQL}
${SLEEP_STAGES_ALTER_SQL};
`;

/**
 * Apply migration 002 to an open database. Exported so the runner in
 * `db.ts` can swap the raw `execAsync(up)` path for this guarded one for any
 * migration whose `up` contains a non-idempotent `ALTER TABLE`.
 *
 * Idempotency:
 *   - `CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS` handle the
 *     mindful side automatically.
 *   - The `stages` column on `sleep_entries` is added only when
 *     `PRAGMA table_info(sleep_entries)` reports it missing, so a second pass
 *     is a no-op.
 *
 * @param db - Open SQLite handle (production or in-memory mock).
 */
export async function runMigration002(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(MINDFUL_SESSIONS_SQL);
  const hasStages = await hasColumn(db, "sleep_entries", "stages");
  if (!hasStages) {
    await db.execAsync(`${SLEEP_STAGES_ALTER_SQL};`);
  }
}

/**
 * Return true when the given column already exists on `table`. The check is
 * done via `PRAGMA table_info(<table>)` — a read-only call that returns one
 * row per column. Used to guard `ALTER TABLE ADD COLUMN` for idempotency.
 */
export async function hasColumn(
  db: SQLiteDatabase,
  table: string,
  column: string,
): Promise<boolean> {
  // `PRAGMA table_info(...)` does not accept bind params; the table name is a
  // trusted literal from our own migration code so direct interpolation is
  // safe (no SQL injection vector). We still validate against an identifier
  // shape to keep future callers honest.
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(table)) {
    throw new Error(`Invalid table identifier: ${table}`);
  }
  const rows = await db.getAllAsync<{ name?: string }>(
    `PRAGMA table_info(${table})`,
  );
  return rows.some((row) => row?.name === column);
}
