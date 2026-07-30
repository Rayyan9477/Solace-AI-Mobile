/**
 * Migration registry.
 *
 * @description Append-only list of versioned schema migrations. The DB layer
 *   reads `PRAGMA user_version`, applies any migrations whose `version` is
 *   greater than the current value, and bumps the pragma inside a transaction.
 *
 *   Migrations are immutable once shipped — never edit a published version.
 *   Add a new entry instead.
 *
 *   Two execution shapes are supported on each entry:
 *   - `up` (required) — raw SQL applied via `execAsync(up)`. Suitable for any
 *     migration whose statements are fully idempotent on their own
 *     (`CREATE TABLE IF NOT EXISTS`, etc.).
 *   - `apply` (optional) — async function called with the open DB handle.
 *     Used when a migration contains a non-idempotent statement (e.g.
 *     `ALTER TABLE ADD COLUMN` which SQLite re-applies blindly) and needs
 *     an explicit existence check. When present the runner prefers `apply`
 *     over `up`.
 *
 * @module shared/data/migrations
 */
import type { SQLiteDatabase } from "expo-sqlite";

import { INIT_SQL } from "./001_init";
import {
  MIGRATION_002_SQL,
  runMigration002,
} from "./002_mindful_and_stages";

/** A single schema migration step. */
export interface Migration {
  /** Monotonic integer; strictly greater than every previous migration. */
  readonly version: number;
  /** SQL script executed inside a transaction when stepping up to `version`. */
  readonly up: string;
  /**
   * Optional imperative applier — used when the migration contains
   * non-idempotent statements that need an existence check. When provided,
   * the runner calls this instead of `execAsync(up)`.
   */
  readonly apply?: (db: SQLiteDatabase) => Promise<void>;
}

/**
 * Ordered list of all migrations the app knows about. Sorted ascending by
 * `version`; never mutate at runtime.
 */
export const MIGRATIONS: readonly Migration[] = [
  { version: 1, up: INIT_SQL },
  {
    version: 2,
    up: MIGRATION_002_SQL,
    apply: runMigration002,
  },
];

/** Highest version present in {@link MIGRATIONS}. */
export const LATEST_VERSION: number = MIGRATIONS.reduce(
  (max, m) => (m.version > max ? m.version : max),
  0,
);

export { INIT_SQL };
export {
  MIGRATION_002_SQL,
  MINDFUL_SESSIONS_SQL,
  SLEEP_STAGES_ALTER_SQL,
  runMigration002,
  hasColumn,
} from "./002_mindful_and_stages";
