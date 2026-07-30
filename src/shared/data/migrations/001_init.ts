/**
 * Migration 001 — initial schema.
 *
 * @description Creates the six core tables plus the durable sync_queue table.
 *   Every domain table carries the standard `sync_status` / `remote_id` /
 *   `updated_at` triplet so the future Supabase sync loop can layer on without
 *   requiring follow-up DDL.
 *
 *   The script is intentionally idempotent (CREATE TABLE IF NOT EXISTS) so it
 *   can also be run defensively against an existing DB during recovery.
 *
 * @module shared/data/migrations
 */

/**
 * Raw SQL script executed by {@link runMigrations} when stepping a fresh DB
 * (`PRAGMA user_version = 0`) up to version 1.
 */
export const INIT_SQL: string = `
CREATE TABLE IF NOT EXISTS mood_entries (
  id TEXT PRIMARY KEY NOT NULL,
  level INTEGER NOT NULL,
  note TEXT,
  influences TEXT,
  created_at INTEGER NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  remote_id TEXT,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON mood_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mood_entries_sync_status ON mood_entries(sync_status);

CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT,
  body TEXT NOT NULL,
  mood_level INTEGER,
  hashtags TEXT,
  created_at INTEGER NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  remote_id TEXT,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC);

CREATE TABLE IF NOT EXISTS sleep_entries (
  id TEXT PRIMARY KEY NOT NULL,
  bedtime INTEGER NOT NULL,
  woke_up INTEGER NOT NULL,
  quality INTEGER,
  feelings TEXT,
  date TEXT NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  remote_id TEXT,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sleep_entries_date ON sleep_entries(date DESC);

CREATE TABLE IF NOT EXISTS chat_conversations (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT,
  mode TEXT NOT NULL,
  last_message_at INTEGER,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  remote_id TEXT,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY NOT NULL,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  remote_id TEXT,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id, created_at);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY NOT NULL,
  table_name TEXT NOT NULL,
  row_id TEXT NOT NULL,
  op TEXT NOT NULL,
  enqueued_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sync_queue_enqueued_at ON sync_queue(enqueued_at);
`;
