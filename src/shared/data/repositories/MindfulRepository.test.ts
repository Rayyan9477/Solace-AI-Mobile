/**
 * Tests for the SQLite-backed mindful-session repository (migration 002).
 */

import { closeDatabase, openDatabase } from "../db";
import {
  createSqliteMindfulRepository,
  type MindfulRepository,
} from "./MindfulRepository";

describe("MindfulRepository", () => {
  let repo: MindfulRepository;

  beforeEach(async () => {
    const db = await openDatabase("mindful_repo.db");
    repo = createSqliteMindfulRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it("create returns a session with sync_status 'pending'", async () => {
    const session = await repo.create({
      type: "meditation",
      durationMs: 5 * 60_000,
    });
    expect(session.id).toBeTruthy();
    expect(session.type).toBe("meditation");
    expect(session.durationMs).toBe(5 * 60_000);
    expect(session.syncStatus).toBe("pending");
    expect(session.remoteId).toBeUndefined();
    expect(session.updatedAt).toBeGreaterThan(0);
  });

  it("create persists the row so byId can fetch it", async () => {
    const session = await repo.create({
      type: "breathing",
      durationMs: 3 * 60_000,
      notes: "box-breath, 4-4-4-4",
    });
    const fetched = await repo.byId(session.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.type).toBe("breathing");
    expect(fetched?.notes).toBe("box-breath, 4-4-4-4");
    expect(fetched?.durationMs).toBe(3 * 60_000);
  });

  it("create accepts an explicit completedAt", async () => {
    const fixed = 1700000000000;
    const session = await repo.create({
      type: "sound",
      durationMs: 60_000,
      completedAt: fixed,
    });
    expect(session.completedAt).toBe(fixed);
  });

  it("create defaults completedAt to now when omitted", async () => {
    const before = Date.now();
    const session = await repo.create({
      type: "body-scan",
      durationMs: 10 * 60_000,
    });
    expect(session.completedAt).toBeGreaterThanOrEqual(before);
  });

  it("create rejects invalid types", async () => {
    await expect(
      // @ts-expect-error — testing runtime guard
      repo.create({ type: "yoga", durationMs: 1 }),
    ).rejects.toThrow(/Invalid mindful session type/);
  });

  it("create rejects negative durations", async () => {
    await expect(
      repo.create({ type: "meditation", durationMs: -1 }),
    ).rejects.toThrow(/Invalid mindful session durationMs/);
  });

  it("byId returns null for a missing id", async () => {
    expect(await repo.byId("does-not-exist")).toBeNull();
  });

  it("list returns sessions newest-first by completedAt", async () => {
    await repo.create({
      type: "meditation",
      durationMs: 1,
      completedAt: 1000,
    });
    await repo.create({
      type: "meditation",
      durationMs: 1,
      completedAt: 3000,
    });
    await repo.create({
      type: "meditation",
      durationMs: 1,
      completedAt: 2000,
    });
    const rows = await repo.list();
    expect(rows.map((r) => r.completedAt)).toEqual([3000, 2000, 1000]);
  });

  it("list applies a since filter", async () => {
    await repo.create({
      type: "meditation",
      durationMs: 1,
      completedAt: 100,
    });
    await repo.create({
      type: "meditation",
      durationMs: 1,
      completedAt: 500,
    });
    await repo.create({
      type: "meditation",
      durationMs: 1,
      completedAt: 900,
    });
    const rows = await repo.list({ since: 400 });
    expect(rows).toHaveLength(2);
    expect(rows.every((r) => r.completedAt >= 400)).toBe(true);
  });

  it("list applies a limit", async () => {
    for (let i = 0; i < 5; i += 1) {
      await repo.create({
        type: "meditation",
        durationMs: 1,
        completedAt: i + 1,
      });
    }
    const rows = await repo.list({ limit: 2 });
    expect(rows).toHaveLength(2);
  });

  it("totalDurationMs sums every session when no filter is given", async () => {
    await repo.create({ type: "meditation", durationMs: 60_000 });
    await repo.create({ type: "breathing", durationMs: 120_000 });
    await repo.create({ type: "sound", durationMs: 30_000 });
    expect(await repo.totalDurationMs()).toBe(60_000 + 120_000 + 30_000);
  });

  it("totalDurationMs respects the since filter", async () => {
    await repo.create({
      type: "meditation",
      durationMs: 60_000,
      completedAt: 100,
    });
    await repo.create({
      type: "meditation",
      durationMs: 90_000,
      completedAt: 500,
    });
    await repo.create({
      type: "meditation",
      durationMs: 120_000,
      completedAt: 900,
    });
    expect(await repo.totalDurationMs({ since: 400 })).toBe(90_000 + 120_000);
  });

  it("totalDurationMs returns 0 for an empty store", async () => {
    expect(await repo.totalDurationMs()).toBe(0);
    expect(await repo.totalDurationMs({ since: Date.now() })).toBe(0);
  });

  it("count returns 0 for an empty store", async () => {
    expect(await repo.count()).toBe(0);
  });

  it("count totals every session when no filter is given", async () => {
    await repo.create({ type: "meditation", durationMs: 1 });
    await repo.create({ type: "breathing", durationMs: 1 });
    expect(await repo.count()).toBe(2);
  });

  it("count respects the since filter", async () => {
    await repo.create({
      type: "meditation",
      durationMs: 1,
      completedAt: 100,
    });
    await repo.create({
      type: "meditation",
      durationMs: 1,
      completedAt: 500,
    });
    await repo.create({
      type: "meditation",
      durationMs: 1,
      completedAt: 900,
    });
    expect(await repo.count({ since: 400 })).toBe(2);
  });

  it("create generates unique ids across calls", async () => {
    const a = await repo.create({ type: "meditation", durationMs: 1 });
    const b = await repo.create({ type: "meditation", durationMs: 1 });
    expect(a.id).not.toBe(b.id);
  });

  it("stamps createdAt and updatedAt to the same instant on insert", async () => {
    const session = await repo.create({ type: "meditation", durationMs: 1 });
    expect(session.createdAt).toBe(session.updatedAt);
  });

  it("returns notes as undefined when not supplied", async () => {
    const session = await repo.create({ type: "meditation", durationMs: 1 });
    const fetched = await repo.byId(session.id);
    expect(fetched?.notes).toBeUndefined();
  });

  it("accepts all four valid types", async () => {
    const types = ["meditation", "breathing", "sound", "body-scan"] as const;
    for (const t of types) {
      const session = await repo.create({ type: t, durationMs: 1 });
      expect(session.type).toBe(t);
    }
  });
});
