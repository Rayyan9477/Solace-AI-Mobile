/**
 * Tests for the initial migration.
 */

import { closeDatabase, getSchemaVersion, openDatabase } from "../db";
import { INIT_SQL, LATEST_VERSION, MIGRATIONS } from "./index";

describe("migration 001 init", () => {
  afterEach(async () => {
    await closeDatabase();
  });

  it("registers migration 001 as the first entry in the registry", () => {
    expect(MIGRATIONS.length).toBeGreaterThanOrEqual(1);
    expect(MIGRATIONS[0]?.version).toBe(1);
    expect(MIGRATIONS[0]?.up).toBe(INIT_SQL);
  });

  it("LATEST_VERSION matches the highest migration version", () => {
    const expected = MIGRATIONS.reduce(
      (max, m) => (m.version > max ? m.version : max),
      0,
    );
    expect(LATEST_VERSION).toBe(expected);
  });

  it("INIT_SQL declares all six core tables", () => {
    expect(INIT_SQL).toMatch(/CREATE TABLE IF NOT EXISTS mood_entries/);
    expect(INIT_SQL).toMatch(/CREATE TABLE IF NOT EXISTS journal_entries/);
    expect(INIT_SQL).toMatch(/CREATE TABLE IF NOT EXISTS sleep_entries/);
    expect(INIT_SQL).toMatch(/CREATE TABLE IF NOT EXISTS chat_conversations/);
    expect(INIT_SQL).toMatch(/CREATE TABLE IF NOT EXISTS chat_messages/);
    expect(INIT_SQL).toMatch(/CREATE TABLE IF NOT EXISTS settings/);
  });

  it("INIT_SQL declares the durable sync_queue table", () => {
    expect(INIT_SQL).toMatch(/CREATE TABLE IF NOT EXISTS sync_queue/);
  });

  it("includes sync_status / remote_id / updated_at on every domain table", () => {
    const tables = [
      "mood_entries",
      "journal_entries",
      "sleep_entries",
      "chat_conversations",
      "chat_messages",
    ];
    for (const tbl of tables) {
      const block = extractCreateBlock(INIT_SQL, tbl);
      expect(block).toMatch(/sync_status TEXT NOT NULL DEFAULT 'pending'/);
      expect(block).toMatch(/remote_id TEXT/);
      expect(block).toMatch(/updated_at INTEGER NOT NULL/);
    }
  });

  it("declares useful indexes", () => {
    expect(INIT_SQL).toMatch(/idx_mood_entries_created_at/);
    expect(INIT_SQL).toMatch(/idx_mood_entries_sync_status/);
    expect(INIT_SQL).toMatch(/idx_journal_entries_created_at/);
    expect(INIT_SQL).toMatch(/idx_sleep_entries_date/);
    expect(INIT_SQL).toMatch(/idx_chat_messages_conversation/);
  });

  it("steps a fresh DB from version 0 to LATEST_VERSION", async () => {
    const db = await openDatabase("init_step.db");
    const version = await getSchemaVersion(db);
    expect(version).toBe(LATEST_VERSION);
  });

  it("migration up scripts are non-empty strings", () => {
    for (const m of MIGRATIONS) {
      expect(typeof m.up).toBe("string");
      expect(m.up.length).toBeGreaterThan(0);
    }
  });

  it("migrations are sorted strictly ascending by version", () => {
    let last = 0;
    for (const m of MIGRATIONS) {
      expect(m.version).toBeGreaterThan(last);
      last = m.version;
    }
  });
});

function extractCreateBlock(sql: string, table: string): string {
  const re = new RegExp(`CREATE TABLE IF NOT EXISTS ${table} \\(([^;]+)\\);`, "i");
  const match = sql.match(re);
  return match ? match[1] : "";
}
