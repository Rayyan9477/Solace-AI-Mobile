/**
 * SQLite database singleton + migration runner.
 *
 * @description Thin wrapper around `expo-sqlite` v16's async API. Owns a
 *   process-wide singleton handle to `solace.db` and runs versioned migrations
 *   on first open.
 *
 *   On `web` (Expo Router web build) `expo-sqlite` ships an in-memory shim;
 *   we still use it so consumers can boot without crashes. The shim is just
 *   slower — same async API.
 *
 * @module shared/data
 */

import { Platform } from "react-native";
import {
  openDatabaseAsync,
  type SQLiteDatabase,
} from "expo-sqlite";

import { LATEST_VERSION, MIGRATIONS } from "./migrations";

/** Default database filename. Exported for tests that want to override. */
export const DEFAULT_DB_NAME = "solace.db";

/** Cached singleton. `null` until {@link openDatabase} succeeds. */
let cached: SQLiteDatabase | null = null;
let inflight: Promise<SQLiteDatabase> | null = null;

/**
 * Open (or return the cached) SQLite database handle. Idempotent: concurrent
 * callers share the same in-flight promise.
 *
 * @param name - Optional override for the database filename. Tests use this
 *   to point at a fresh DB without disturbing the production singleton.
 */
export async function openDatabase(
  name: string = DEFAULT_DB_NAME,
): Promise<SQLiteDatabase> {
  if (cached) {
    return cached;
  }
  if (inflight) {
    return inflight;
  }
  inflight = (async () => {
    const db = await openDatabaseAsync(name);
    await runMigrations(db);
    cached = db;
    return db;
  })();
  try {
    const db = await inflight;
    return db;
  } finally {
    inflight = null;
  }
}

/**
 * Return the cached database handle. Throws if {@link openDatabase} has not
 * been awaited yet — call sites should always go through the
 * RepositoryProvider, which guarantees ordering.
 */
export function getDatabase(): SQLiteDatabase {
  if (!cached) {
    throw new Error(
      "Database not opened. Call openDatabase() before getDatabase().",
    );
  }
  return cached;
}

/**
 * Close and clear the cached handle. Primarily for tests; production code
 * leaves the connection open for the lifetime of the app.
 */
export async function closeDatabase(): Promise<void> {
  const db = cached;
  cached = null;
  inflight = null;
  if (db && typeof db.closeAsync === "function") {
    try {
      await db.closeAsync();
    } catch {
      // Already closed or shutting down — fine to ignore.
    }
  }
}

/**
 * Read the current `PRAGMA user_version` value. Returns 0 for a fresh DB.
 */
export async function getSchemaVersion(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  if (!row) return 0;
  const value = row.user_version;
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/**
 * Apply any pending migrations. Steps from the current `user_version` up to
 * {@link LATEST_VERSION}, running each migration's `up` script inside a
 * transaction and bumping the pragma at the end of each step.
 *
 * Idempotent — calling it twice is a no-op once the DB is current.
 */
export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  const current = await getSchemaVersion(db);
  if (current >= LATEST_VERSION) {
    return;
  }
  const pending = MIGRATIONS.filter((m) => m.version > current).sort(
    (a, b) => a.version - b.version,
  );
  for (const migration of pending) {
    await db.withTransactionAsync(async () => {
      if (typeof migration.apply === "function") {
        // Imperative applier — used when the migration contains a
        // non-idempotent statement (e.g. ALTER TABLE ADD COLUMN) and needs
        // an existence check before executing.
        await migration.apply(db);
      } else {
        await db.execAsync(migration.up);
      }
    });
    // `PRAGMA user_version = N` is metadata, not a transactional statement.
    // SQLite silently ignores PRAGMA writes inside `BEGIN/COMMIT`, which on
    // the web `wa-sqlite` worker would leave `user_version` at 0 forever and
    // cause every subsequent boot to re-run all migrations. Bump the version
    // OUTSIDE the transaction so it persists on both native and web. PRAGMA
    // does not accept bind params; the version is a trusted integer from our
    // own registry so string interpolation is safe.
    await db.execAsync(`PRAGMA user_version = ${migration.version}`);
  }
}

/**
 * True when running on the web target — useful for callers that want to opt
 * into a different storage strategy. Currently unused (the SQLite shim works
 * on web), but exported so future callers don't have to import RN themselves.
 */
export function isWebPlatform(): boolean {
  return Platform.OS === "web";
}
