/**
 * Persistence Type Definitions
 *
 * @description Shared TypeScript types for all SQLite-backed entities. Every
 *   persisted entity extends {@link BaseEntity} so the future sync loop has a
 *   uniform set of fields (`syncStatus`, `remoteId`, `updatedAt`) to inspect.
 *
 *   These types are camelCase at the boundary; the SQLite schema uses
 *   snake_case columns. Repository implementations are responsible for the
 *   row <-> entity mapping.
 *
 * @module shared/data
 */

/** Sync state of a row relative to the remote (Supabase) backend. */
export type SyncStatus = "pending" | "synced" | "conflict";

/**
 * Common columns every persisted entity carries.
 *
 * - `id` — primary key (UUID, locally generated on insert).
 * - `syncStatus` — see {@link SyncStatus}. Defaults to "pending" on every write.
 * - `remoteId` — Supabase row UUID. Populated after first successful push;
 *   undefined / null until then.
 * - `updatedAt` — ms-epoch Lamport-ish clock; bumped to `Date.now()` on every
 *   write. Used by the sync layer to detect drift.
 */
export interface BaseEntity {
  readonly id: string;
  readonly syncStatus: SyncStatus;
  readonly remoteId?: string;
  readonly updatedAt: number;
}

// ---------------------------------------------------------------------------
// Mood
// ---------------------------------------------------------------------------

/** Mood level on the 1..5 scale used by the v4.2 mood selector. */
export type MoodLevel = 1 | 2 | 3 | 4 | 5;

/**
 * A single mood entry. Persisted in the `mood_entries` SQLite table.
 *
 * @property level - 1..5 mood scale.
 * @property note - Optional free-text reflection.
 * @property influences - Optional tag ids (work, sleep, exercise, etc.).
 * @property createdAt - ms-epoch when the user logged the mood.
 */
export interface MoodEntry extends BaseEntity {
  readonly level: MoodLevel;
  readonly note?: string;
  readonly influences?: readonly string[];
  readonly createdAt: number;
}

/** Insert payload for a new mood entry. The repo fills in id / sync metadata. */
export interface NewMoodEntry {
  readonly level: MoodLevel;
  readonly note?: string;
  readonly influences?: readonly string[];
  readonly createdAt?: number;
}

/**
 * One cell in the mood-calendar grid. Returned from
 * {@link MoodRepository.getCalendar}.
 */
export interface MoodCalendarCell {
  /** Day of month, 1..31. */
  readonly day: number;
  /** ISO calendar date (`YYYY-MM-DD`). */
  readonly date: string;
  /** Mean mood level for the day, or null if no entries. */
  readonly averageLevel: number | null;
  /** Number of entries logged that day. */
  readonly entryCount: number;
}

// ---------------------------------------------------------------------------
// Journal
// ---------------------------------------------------------------------------

/** A persisted journal entry. */
export interface JournalEntry extends BaseEntity {
  readonly title?: string;
  readonly body: string;
  readonly moodLevel?: MoodLevel;
  readonly hashtags?: readonly string[];
  readonly createdAt: number;
}

/** Insert payload for a new journal entry. */
export interface NewJournalEntry {
  readonly title?: string;
  readonly body: string;
  readonly moodLevel?: MoodLevel;
  readonly hashtags?: readonly string[];
  readonly createdAt?: number;
}

// ---------------------------------------------------------------------------
// Sleep
// ---------------------------------------------------------------------------

/** Sleep quality on a 1..5 scale. */
export type SleepQuality = 1 | 2 | 3 | 4 | 5;

/**
 * Per-stage sleep breakdown in minutes. Optional on {@link SleepEntry} because
 * rows written before migration 002 lack the column and decode to `undefined`.
 *
 * @property deepMinutes - Deep / slow-wave sleep duration in minutes.
 * @property coreMinutes - Core (light / N2) sleep duration in minutes.
 * @property remMinutes  - REM sleep duration in minutes.
 * @property awakeMinutes - Awake-in-bed duration in minutes.
 */
export interface SleepStages {
  readonly deepMinutes: number;
  readonly coreMinutes: number;
  readonly remMinutes: number;
  readonly awakeMinutes: number;
}

/** A persisted sleep log. */
export interface SleepEntry extends BaseEntity {
  readonly bedtime: number;
  readonly wokeUp: number;
  readonly quality?: SleepQuality;
  readonly feelings?: readonly string[];
  /** YYYY-MM-DD anchor day (the morning the user woke up). */
  readonly date: string;
  /**
   * Optional per-stage breakdown. Stored as JSON in the `stages` column added
   * by migration 002. Older entries (pre-migration) decode to `undefined`.
   */
  readonly stages?: SleepStages;
}

/** Insert payload for a new sleep entry. */
export interface NewSleepEntry {
  readonly bedtime: number;
  readonly wokeUp: number;
  readonly quality?: SleepQuality;
  readonly feelings?: readonly string[];
  readonly date: string;
  readonly stages?: SleepStages;
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------

/** Chat coaching mode the conversation is anchored to. */
export type ChatMode = "general" | "cbt" | "mindfulness" | "sleep";

/** Chat message role. */
export type ChatRole = "user" | "assistant" | "system";

/** A chat conversation header. */
export interface ChatConversation extends BaseEntity {
  readonly title?: string;
  readonly mode: ChatMode;
  readonly lastMessageAt?: number;
}

/** Insert payload for a new chat conversation. */
export interface NewChatConversation {
  readonly title?: string;
  readonly mode: ChatMode;
}

/** A single message inside a {@link ChatConversation}. */
export interface ChatMessage extends BaseEntity {
  readonly conversationId: string;
  readonly role: ChatRole;
  readonly content: string;
  readonly createdAt: number;
}

/** Insert payload for a new chat message. */
export interface NewChatMessage {
  readonly conversationId: string;
  readonly role: ChatRole;
  readonly content: string;
  readonly createdAt?: number;
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

/** A single key/value setting row. */
export interface SettingsRecord {
  readonly key: string;
  readonly value: string;
  readonly updatedAt: number;
}

/** Insert payload for a new / upserted setting row. */
export interface NewSettingsRecord {
  readonly key: string;
  readonly value: string;
}

// ---------------------------------------------------------------------------
// Mindful sessions
// ---------------------------------------------------------------------------

/** Category of mindful session the user completed. */
export type MindfulSessionType =
  | "meditation"
  | "breathing"
  | "sound"
  | "body-scan";

/**
 * A persisted mindful-session record. Backs the Profile dashboard's
 * `mindfulHours` aggregate and the (future) Sprint 14 mindful-history surface.
 */
export interface MindfulSession extends BaseEntity {
  readonly type: MindfulSessionType;
  /** Duration of the session in milliseconds. */
  readonly durationMs: number;
  /** ms-epoch when the session was completed. */
  readonly completedAt: number;
  /** Optional free-text reflection captured after the session. */
  readonly notes?: string;
  /** ms-epoch when the row was first created locally. */
  readonly createdAt: number;
}

/** Insert payload for a new mindful session. The repo fills sync metadata. */
export interface NewMindfulSession {
  readonly type: MindfulSessionType;
  readonly durationMs: number;
  /** Defaults to `Date.now()` when omitted. */
  readonly completedAt?: number;
  readonly notes?: string;
}

// ---------------------------------------------------------------------------
// Sync queue (durable representation in SQLite)
// ---------------------------------------------------------------------------

/** Operation type recorded in the sync queue. */
export type SyncQueueOp = "insert" | "update" | "delete";

/** A single durable sync-queue row. */
export interface SyncQueueRecord {
  readonly id: string;
  readonly tableName: string;
  readonly rowId: string;
  readonly op: SyncQueueOp;
  readonly enqueuedAt: number;
}
