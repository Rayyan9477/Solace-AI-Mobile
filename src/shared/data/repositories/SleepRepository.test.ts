/**
 * Tests for the SQLite-backed sleep repository.
 */

import { closeDatabase, openDatabase } from "../db";
import {
  createSqliteSleepRepository,
  type SleepRepository,
} from "./SleepRepository";

describe("SleepRepository", () => {
  let repo: SleepRepository;

  beforeEach(async () => {
    const db = await openDatabase("sleep_repo.db");
    repo = createSqliteSleepRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it("create persists an entry with sync_status pending", async () => {
    const entry = await repo.create({
      bedtime: 1000,
      wokeUp: 28800000 + 1000,
      date: "2024-05-01",
      quality: 4,
    });
    expect(entry.id).toBeTruthy();
    expect(entry.syncStatus).toBe("pending");
    expect(entry.quality).toBe(4);
  });

  it("create rejects malformed dates", async () => {
    await expect(
      repo.create({ bedtime: 0, wokeUp: 100, date: "not-a-date" }),
    ).rejects.toThrow(/Invalid sleep date/);
  });

  it("create rejects wokeUp < bedtime", async () => {
    await expect(
      repo.create({ bedtime: 500, wokeUp: 100, date: "2024-05-01" }),
    ).rejects.toThrow(/wokeUp must be >= bedtime/);
  });

  it("byId returns null for a missing id", async () => {
    expect(await repo.byId("missing")).toBeNull();
  });

  it("byDate returns the most recent entry on that date", async () => {
    const e1 = await repo.create({
      bedtime: 1,
      wokeUp: 200,
      date: "2024-05-01",
    });
    await new Promise((r) => setTimeout(r, 5));
    const e2 = await repo.create({
      bedtime: 2,
      wokeUp: 400,
      date: "2024-05-01",
    });
    const found = await repo.byDate("2024-05-01");
    expect(found?.id).toBe(e2.id);
    expect(found?.id).not.toBe(e1.id);
  });

  it("list returns entries newest-first by date", async () => {
    await repo.create({ bedtime: 1, wokeUp: 100, date: "2024-05-01" });
    await repo.create({ bedtime: 1, wokeUp: 100, date: "2024-05-03" });
    await repo.create({ bedtime: 1, wokeUp: 100, date: "2024-05-02" });
    const rows = await repo.list();
    expect(rows.map((r) => r.date)).toEqual([
      "2024-05-03",
      "2024-05-02",
      "2024-05-01",
    ]);
  });

  it("list filters by date range", async () => {
    await repo.create({ bedtime: 1, wokeUp: 100, date: "2024-05-01" });
    await repo.create({ bedtime: 1, wokeUp: 100, date: "2024-05-15" });
    await repo.create({ bedtime: 1, wokeUp: 100, date: "2024-05-30" });
    const rows = await repo.list({
      fromDate: "2024-05-10",
      toDate: "2024-05-20",
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.date).toBe("2024-05-15");
  });

  it("list applies a limit", async () => {
    for (let i = 1; i <= 5; i += 1) {
      const day = i.toString().padStart(2, "0");
      await repo.create({
        bedtime: 1,
        wokeUp: 100,
        date: `2024-05-${day}`,
      });
    }
    const rows = await repo.list({ limit: 2 });
    expect(rows).toHaveLength(2);
  });

  it("update patches bedtime + wokeUp", async () => {
    const entry = await repo.create({
      bedtime: 100,
      wokeUp: 200,
      date: "2024-05-01",
    });
    const updated = await repo.update(entry.id, {
      bedtime: 50,
      wokeUp: 500,
    });
    expect(updated.bedtime).toBe(50);
    expect(updated.wokeUp).toBe(500);
  });

  it("update preserves untouched fields", async () => {
    const entry = await repo.create({
      bedtime: 100,
      wokeUp: 200,
      date: "2024-05-01",
      quality: 3,
    });
    const updated = await repo.update(entry.id, { quality: 5 });
    expect(updated.bedtime).toBe(100);
    expect(updated.wokeUp).toBe(200);
    expect(updated.quality).toBe(5);
  });

  it("update throws for a missing id", async () => {
    await expect(
      repo.update("missing", { bedtime: 1 }),
    ).rejects.toThrow(/not found/);
  });

  it("delete removes the row", async () => {
    const entry = await repo.create({
      bedtime: 0,
      wokeUp: 1,
      date: "2024-05-01",
    });
    await repo.delete(entry.id);
    expect(await repo.byId(entry.id)).toBeNull();
  });

  it("averageDurationMs returns null for empty store", async () => {
    expect(await repo.averageDurationMs()).toBeNull();
  });

  it("averageDurationMs averages bedtime to wokeUp deltas", async () => {
    await repo.create({ bedtime: 0, wokeUp: 1000, date: "2024-05-01" });
    await repo.create({ bedtime: 0, wokeUp: 3000, date: "2024-05-02" });
    expect(await repo.averageDurationMs()).toBe(2000);
  });

  it("create persists feelings as a JSON array", async () => {
    const entry = await repo.create({
      bedtime: 0,
      wokeUp: 1,
      date: "2024-05-01",
      feelings: ["rested", "energized"],
    });
    const fetched = await repo.byId(entry.id);
    expect(fetched?.feelings).toEqual(["rested", "energized"]);
  });

  it("update changes feelings", async () => {
    const entry = await repo.create({
      bedtime: 0,
      wokeUp: 1,
      date: "2024-05-01",
      feelings: ["rested"],
    });
    const updated = await repo.update(entry.id, { feelings: ["tired"] });
    expect(updated.feelings).toEqual(["tired"]);
  });

  it("create generates unique ids", async () => {
    const a = await repo.create({ bedtime: 0, wokeUp: 1, date: "2024-05-01" });
    const b = await repo.create({ bedtime: 0, wokeUp: 1, date: "2024-05-02" });
    expect(a.id).not.toBe(b.id);
  });

  it("create + byId roundtrip the optional stages payload", async () => {
    const entry = await repo.create({
      bedtime: 0,
      wokeUp: 8 * 3_600_000,
      date: "2024-05-01",
      stages: {
        deepMinutes: 90,
        coreMinutes: 240,
        remMinutes: 110,
        awakeMinutes: 40,
      },
    });
    const fetched = await repo.byId(entry.id);
    expect(fetched?.stages).toEqual({
      deepMinutes: 90,
      coreMinutes: 240,
      remMinutes: 110,
      awakeMinutes: 40,
    });
  });

  it("create + byId omit stages for entries without a breakdown", async () => {
    const entry = await repo.create({
      bedtime: 0,
      wokeUp: 8 * 3_600_000,
      date: "2024-05-02",
    });
    const fetched = await repo.byId(entry.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.stages).toBeUndefined();
  });
});
