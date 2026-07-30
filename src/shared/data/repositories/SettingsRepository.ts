/**
 * Settings Repository.
 *
 * @description Key-value store on top of the `settings` table. Used by the
 *   profile / preferences screens for things like the active theme id,
 *   notifications-enabled flag, biometric flag, etc.
 *
 *   Settings rows are intentionally NOT marked sync_status — they live in a
 *   single-row-per-user `settings` cloud table whose merge strategy is
 *   "last writer wins" per key.
 *
 * @module shared/data/repositories
 */

import type { SQLiteDatabase } from "expo-sqlite";

import type { NewSettingsRecord, SettingsRecord } from "../types";

/** Public surface of the settings repository. */
export interface SettingsRepository {
  /** Read a single value. Resolves null when the key is absent. */
  get(key: string): Promise<SettingsRecord | null>;
  /** Convenience: read just the string value (or null). */
  getValue(key: string): Promise<string | null>;
  /** Upsert a value. Stamps `updated_at` to `Date.now()`. */
  set(record: NewSettingsRecord): Promise<SettingsRecord>;
  /** Delete a value. No-op if absent. */
  delete(key: string): Promise<void>;
  /** Read every row (sorted by key ascending). */
  getAll(): Promise<SettingsRecord[]>;
}

interface SettingsRow {
  key: string;
  value: string;
  updated_at: number;
}

/** SQLite-backed implementation of {@link SettingsRepository}. */
export function createSqliteSettingsRepository(
  db: SQLiteDatabase,
): SettingsRepository {
  const rowToRecord = (row: SettingsRow): SettingsRecord => ({
    key: row.key,
    value: row.value,
    updatedAt: row.updated_at,
  });

  return {
    async get(key) {
      const row = await db.getFirstAsync<SettingsRow>(
        "SELECT * FROM settings WHERE key = ?",
        [key],
      );
      return row ? rowToRecord(row) : null;
    },

    async getValue(key) {
      const row = await db.getFirstAsync<{ value: string }>(
        "SELECT value FROM settings WHERE key = ?",
        [key],
      );
      return row ? row.value : null;
    },

    async set(record) {
      if (typeof record.key !== "string" || record.key.length === 0) {
        throw new Error("Settings key must be a non-empty string.");
      }
      if (typeof record.value !== "string") {
        throw new Error("Settings value must be a string.");
      }
      const now = Date.now();
      await db.runAsync(
        `INSERT INTO settings (key, value, updated_at)
         VALUES (?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
        [record.key, record.value, now],
      );
      return { key: record.key, value: record.value, updatedAt: now };
    },

    async delete(key) {
      await db.runAsync("DELETE FROM settings WHERE key = ?", [key]);
    },

    async getAll() {
      const rows = await db.getAllAsync<SettingsRow>(
        "SELECT * FROM settings ORDER BY key ASC",
      );
      return rows.map(rowToRecord);
    },
  };
}
