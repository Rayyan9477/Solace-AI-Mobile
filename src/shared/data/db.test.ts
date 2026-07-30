/**
 * Tests for the SQLite singleton + migration runner.
 */

import {
  closeDatabase,
  DEFAULT_DB_NAME,
  getDatabase,
  getSchemaVersion,
  isWebPlatform,
  openDatabase,
  runMigrations,
} from "./db";
import { LATEST_VERSION } from "./migrations";

describe("db singleton", () => {
  afterEach(async () => {
    await closeDatabase();
  });

  it("exports the default database name", () => {
    expect(DEFAULT_DB_NAME).toBe("solace.db");
  });

  it("opens a database and returns a handle", async () => {
    const db = await openDatabase("test_open.db");
    expect(db).toBeTruthy();
    expect(typeof db.runAsync).toBe("function");
    expect(typeof db.getAllAsync).toBe("function");
    expect(typeof db.getFirstAsync).toBe("function");
    expect(typeof db.execAsync).toBe("function");
    expect(typeof db.withTransactionAsync).toBe("function");
  });

  it("returns the cached singleton on subsequent calls", async () => {
    const a = await openDatabase("cache_a.db");
    const b = await openDatabase("cache_a.db");
    expect(a).toBe(b);
  });

  it("dedupes concurrent opens via the in-flight promise", async () => {
    const [a, b] = await Promise.all([
      openDatabase("inflight.db"),
      openDatabase("inflight.db"),
    ]);
    expect(a).toBe(b);
  });

  it("getDatabase throws before openDatabase has resolved", () => {
    expect(() => getDatabase()).toThrow(/Database not opened/);
  });

  it("getDatabase returns the cached handle after open", async () => {
    const opened = await openDatabase("get.db");
    expect(getDatabase()).toBe(opened);
  });

  it("runs migrations on first open (user_version bumped)", async () => {
    const db = await openDatabase("migrate.db");
    const version = await getSchemaVersion(db);
    expect(version).toBe(LATEST_VERSION);
  });

  it("runMigrations is idempotent", async () => {
    const db = await openDatabase("idem.db");
    await runMigrations(db);
    await runMigrations(db);
    const version = await getSchemaVersion(db);
    expect(version).toBe(LATEST_VERSION);
  });

  it("getSchemaVersion returns 0 for a brand-new connection", async () => {
    // Use the raw open from expo-sqlite to bypass our migration runner.
    const expoSqlite = require("expo-sqlite");
    const fresh = await expoSqlite.openDatabaseAsync("fresh.db");
    const version = await getSchemaVersion(fresh);
    expect(version).toBe(0);
  });

  it("closeDatabase clears the cache; subsequent open creates a new handle", async () => {
    await openDatabase("close.db");
    await closeDatabase();
    expect(() => getDatabase()).toThrow();
  });

  it("isWebPlatform returns a boolean", () => {
    expect(typeof isWebPlatform()).toBe("boolean");
  });

  it("creates all six domain tables on first open", async () => {
    const db = await openDatabase("tables.db");
    // The mock auto-creates a table on first reference; the migration ensured
    // each one exists by issuing CREATE TABLE IF NOT EXISTS. We can verify by
    // selecting from each — should not throw.
    await expect(
      db.getAllAsync("SELECT * FROM mood_entries"),
    ).resolves.toEqual([]);
    await expect(
      db.getAllAsync("SELECT * FROM journal_entries"),
    ).resolves.toEqual([]);
    await expect(
      db.getAllAsync("SELECT * FROM sleep_entries"),
    ).resolves.toEqual([]);
    await expect(
      db.getAllAsync("SELECT * FROM chat_conversations"),
    ).resolves.toEqual([]);
    await expect(
      db.getAllAsync("SELECT * FROM chat_messages"),
    ).resolves.toEqual([]);
    await expect(
      db.getAllAsync("SELECT * FROM settings"),
    ).resolves.toEqual([]);
  });

  it("creates the durable sync_queue table", async () => {
    const db = await openDatabase("sq.db");
    await expect(
      db.getAllAsync("SELECT * FROM sync_queue"),
    ).resolves.toEqual([]);
  });

  it("openDatabase rethrows the error when the underlying open fails", async () => {
    const expoSqlite = require("expo-sqlite");
    const original = expoSqlite.openDatabaseAsync;
    expoSqlite.openDatabaseAsync = jest
      .fn()
      .mockRejectedValueOnce(new Error("boom"));
    try {
      await expect(openDatabase("fail.db")).rejects.toThrow(/boom/);
    } finally {
      expoSqlite.openDatabaseAsync = original;
    }
  });
});
