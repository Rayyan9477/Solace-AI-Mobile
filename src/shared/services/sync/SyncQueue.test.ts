/**
 * Tests for the durable sync queue.
 */

import { closeDatabase, openDatabase } from "../../data/db";
import {
  createNoopSyncQueue,
  createSyncQueue,
  toRecord,
  type SyncQueue,
} from "./SyncQueue";

describe("SyncQueue", () => {
  let queue: SyncQueue;

  beforeEach(async () => {
    const db = await openDatabase("sync_queue.db");
    queue = createSyncQueue({ db });
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it("enqueues an insert task", () => {
    const id = queue.enqueue("mood_entries", "row-1", "insert");
    expect(typeof id).toBe("string");
    expect(queue.pendingCount()).toBe(1);
  });

  it("enqueue rejects an empty table name", () => {
    expect(() => queue.enqueue("", "row-1", "insert")).toThrow(/table/);
  });

  it("enqueue rejects an empty row id", () => {
    expect(() => queue.enqueue("mood_entries", "", "insert")).toThrow(/rowId/);
  });

  it("list returns a snapshot copy of the queue", () => {
    queue.enqueue("mood_entries", "row-1", "insert");
    const snapshot = queue.list();
    expect(snapshot).toHaveLength(1);
    queue.enqueue("mood_entries", "row-2", "insert");
    expect(snapshot).toHaveLength(1); // snapshot is a copy
  });

  it("pendingCount tracks enqueues", () => {
    expect(queue.pendingCount()).toBe(0);
    queue.enqueue("mood_entries", "a", "insert");
    queue.enqueue("mood_entries", "b", "update");
    queue.enqueue("mood_entries", "c", "delete");
    expect(queue.pendingCount()).toBe(3);
  });

  it("processQueue is a no-op (skipped: true)", async () => {
    queue.enqueue("mood_entries", "row-1", "insert");
    const result = await queue.processQueue();
    expect(result.skipped).toBe(true);
    expect(result.attempted).toBe(1);
    expect(result.synced).toBe(0);
    expect(result.failed).toBe(0);
  });

  it("processQueue does not drain the queue (Sprint 11 will wire transport)", async () => {
    queue.enqueue("mood_entries", "row-1", "insert");
    await queue.processQueue();
    expect(queue.pendingCount()).toBe(1);
  });

  it("onNetworkChange updates isOnline", () => {
    expect(queue.isOnline()).toBe(true);
    queue.onNetworkChange(false);
    expect(queue.isOnline()).toBe(false);
    queue.onNetworkChange(true);
    expect(queue.isOnline()).toBe(true);
  });

  it("hydrate populates the in-memory queue from sync_queue rows", async () => {
    const db = await openDatabase("sync_queue.db");
    await db.runAsync(
      `INSERT INTO sync_queue (id, table_name, row_id, op, enqueued_at)
       VALUES (?, ?, ?, ?, ?)`,
      ["task-1", "mood_entries", "row-1", "insert", 100],
    );
    const fresh = createSyncQueue({ db });
    await fresh.hydrate();
    expect(fresh.pendingCount()).toBe(1);
    expect(fresh.list()[0]).toMatchObject({
      tableName: "mood_entries",
      rowId: "row-1",
      op: "insert",
    });
  });

  it("hydrate sorts by enqueued_at ascending", async () => {
    const db = await openDatabase("sync_queue.db");
    await db.runAsync(
      `INSERT INTO sync_queue (id, table_name, row_id, op, enqueued_at)
       VALUES (?, ?, ?, ?, ?)`,
      ["a", "t", "1", "insert", 200],
    );
    await db.runAsync(
      `INSERT INTO sync_queue (id, table_name, row_id, op, enqueued_at)
       VALUES (?, ?, ?, ?, ?)`,
      ["b", "t", "2", "insert", 100],
    );
    const fresh = createSyncQueue({ db });
    await fresh.hydrate();
    const list = fresh.list();
    expect(list.map((t) => t.id)).toEqual(["b", "a"]);
  });

  it("toRecord projects a SyncTask to a durable record", () => {
    queue.enqueue("mood_entries", "row-1", "insert");
    const [task] = queue.list();
    if (!task) throw new Error("expected task");
    const record = toRecord(task);
    expect(record.tableName).toBe("mood_entries");
    expect(record.rowId).toBe("row-1");
    expect(record.op).toBe("insert");
  });

  it("createNoopSyncQueue returns a queue that always reports 0", async () => {
    const noop = createNoopSyncQueue();
    expect(noop.pendingCount()).toBe(0);
    expect(noop.list()).toEqual([]);
    const result = await noop.processQueue();
    expect(result.skipped).toBe(true);
    expect(noop.isOnline()).toBe(true);
    expect(noop.enqueue("t", "r", "insert")).toBe("noop");
    noop.onNetworkChange(false); // should not throw
    await expect(noop.hydrate()).resolves.toBeUndefined();
  });
});
