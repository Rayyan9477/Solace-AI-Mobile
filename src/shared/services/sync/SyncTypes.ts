/**
 * Sync layer shared types.
 *
 * @description Types shared by {@link SyncQueue} and the future Supabase-
 *   backed processor. Kept separate so the queue interface stays free of
 *   transport details.
 *
 * @module shared/services/sync
 */

import type { SyncQueueOp, SyncQueueRecord } from "../../data/types";

export type { SyncQueueOp, SyncQueueRecord };

/** Snapshot of a queued sync task as held in memory. */
export interface SyncTask {
  readonly id: string;
  readonly tableName: string;
  readonly rowId: string;
  readonly op: SyncQueueOp;
  readonly enqueuedAt: number;
}

/** Result of a single `processQueue()` invocation. */
export interface SyncProcessResult {
  /** Tasks pulled from the queue this run. */
  readonly attempted: number;
  /** Tasks the worker successfully synced (and removed). */
  readonly synced: number;
  /** Tasks that failed and were left on the queue for retry. */
  readonly failed: number;
  /** True if the worker short-circuited because no client is configured. */
  readonly skipped: boolean;
}
