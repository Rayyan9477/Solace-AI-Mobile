/**
 * Sync Queue.
 *
 * @description In-memory queue of pending sync operations, mirrored to the
 *   `sync_queue` SQLite table for durability. Sprint 10 ships the queue
 *   surface but no transport — `processQueue()` is a no-op until the
 *   Supabase client lands in Sprint 11.
 *
 *   Producers call {@link SyncQueue.enqueue} on every write; the future
 *   processor will drain the queue when the network is online.
 *
 * @module shared/services/sync
 */

import type { SQLiteDatabase } from "expo-sqlite";

import { generateId } from "../../data/ids";
import type { SyncQueueOp, SyncQueueRecord } from "../../data/types";

import type { SyncProcessResult, SyncTask } from "./SyncTypes";

/** Public surface of the sync queue. */
export interface SyncQueue {
  /** Append an operation to the queue. Returns the generated task id. */
  enqueue(table: string, rowId: string, op: SyncQueueOp): string;
  /** In-memory pending count. */
  pendingCount(): number;
  /** Snapshot of the in-memory queue (read-only copy). */
  list(): readonly SyncTask[];
  /**
   * Drain the queue. Sprint 10 implementation no-ops and reports `skipped`;
   * Sprint 11 wires this up to the Supabase client.
   */
  processQueue(): Promise<SyncProcessResult>;
  /** Hydrate the in-memory queue from the durable `sync_queue` table. */
  hydrate(): Promise<void>;
  /** Notification from NetInfo that connectivity changed. */
  onNetworkChange(connected: boolean): void;
  /** Current cached connectivity status. */
  isOnline(): boolean;
}

/** Constructor dependencies for {@link createSyncQueue}. */
export interface SyncQueueDeps {
  /** Open SQLite handle used to durably persist the queue. */
  readonly db: SQLiteDatabase;
}

/**
 * Build a sync-queue instance bound to the given DB.
 *
 * The returned object is a plain singleton-shaped value; callers can hold
 * exactly one per DB (the RepositoryProvider does this).
 */
export function createSyncQueue(deps: SyncQueueDeps): SyncQueue {
  const { db } = deps;
  let memory: SyncTask[] = [];
  let online = true;

  return {
    enqueue(table, rowId, op) {
      if (typeof table !== "string" || table.length === 0) {
        throw new Error("SyncQueue.enqueue: table must be a non-empty string.");
      }
      if (typeof rowId !== "string" || rowId.length === 0) {
        throw new Error("SyncQueue.enqueue: rowId must be a non-empty string.");
      }
      const task: SyncTask = {
        id: generateId(),
        tableName: table,
        rowId,
        op,
        enqueuedAt: Date.now(),
      };
      memory.push(task);
      // Fire-and-forget durable write. Failures are non-fatal — the in-memory
      // copy is still honoured for the current session.
      void db
        .runAsync(
          `INSERT INTO sync_queue (id, table_name, row_id, op, enqueued_at)
           VALUES (?, ?, ?, ?, ?)`,
          [task.id, task.tableName, task.rowId, task.op, task.enqueuedAt],
        )
        .catch(() => {
          // Durable write failed; the in-memory queue still works for this
          // session. We deliberately swallow because a wellness app must not
          // crash for a non-critical book-keeping write.
        });
      return task.id;
    },

    pendingCount() {
      return memory.length;
    },

    list() {
      return memory.slice();
    },

    async processQueue() {
      // Supabase sync wired in Sprint 11+
      return {
        attempted: memory.length,
        synced: 0,
        failed: 0,
        skipped: true,
      };
    },

    async hydrate() {
      const rows = await db.getAllAsync<{
        id: string;
        table_name: string;
        row_id: string;
        op: string;
        enqueued_at: number;
      }>(
        "SELECT * FROM sync_queue ORDER BY enqueued_at ASC",
      );
      memory = rows.map((row) => ({
        id: row.id,
        tableName: row.table_name,
        rowId: row.row_id,
        op: parseOp(row.op),
        enqueuedAt: row.enqueued_at,
      }));
    },

    onNetworkChange(connected) {
      online = connected;
    },

    isOnline() {
      return online;
    },
  };
}

/** A no-op queue used while the RepositoryProvider is still bootstrapping. */
export function createNoopSyncQueue(): SyncQueue {
  return {
    enqueue: () => "noop",
    pendingCount: () => 0,
    list: () => [],
    processQueue: async () => ({
      attempted: 0,
      synced: 0,
      failed: 0,
      skipped: true,
    }),
    hydrate: async () => undefined,
    onNetworkChange: () => undefined,
    isOnline: () => true,
  };
}

function parseOp(raw: string): SyncQueueOp {
  if (raw === "update" || raw === "delete") return raw;
  return "insert";
}

/** Convert in-memory tasks to durable records (used in tests / debugging). */
export function toRecord(task: SyncTask): SyncQueueRecord {
  return {
    id: task.id,
    tableName: task.tableName,
    rowId: task.rowId,
    op: task.op,
    enqueuedAt: task.enqueuedAt,
  };
}
