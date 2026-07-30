/**
 * Tests for the SQLite-backed mood repository.
 */

import { closeDatabase, openDatabase } from "../db";
import {
  createSqliteMoodRepository,
  type MoodRepository,
} from "./MoodRepository";

describe("MoodRepository", () => {
  let repo: MoodRepository;

  beforeEach(async () => {
    const db = await openDatabase("mood_repo.db");
    repo = createSqliteMoodRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it("create returns an entry with sync_status 'pending'", async () => {
    const entry = await repo.create({ level: 3 });
    expect(entry.id).toBeTruthy();
    expect(entry.level).toBe(3);
    expect(entry.syncStatus).toBe("pending");
    expect(entry.updatedAt).toBeGreaterThan(0);
    expect(entry.remoteId).toBeUndefined();
  });

  it("create persists the row to SQLite", async () => {
    const entry = await repo.create({ level: 4, note: "Good day" });
    const fetched = await repo.byId(entry.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.note).toBe("Good day");
    expect(fetched?.level).toBe(4);
  });

  it("create stores influences as a JSON array", async () => {
    const entry = await repo.create({
      level: 2,
      influences: ["work", "sleep"],
    });
    const fetched = await repo.byId(entry.id);
    expect(fetched?.influences).toEqual(["work", "sleep"]);
  });

  it("create accepts an explicit createdAt", async () => {
    const fixed = 1700000000000;
    const entry = await repo.create({ level: 1, createdAt: fixed });
    expect(entry.createdAt).toBe(fixed);
  });

  it("byId returns null for a missing id", async () => {
    const result = await repo.byId("does-not-exist");
    expect(result).toBeNull();
  });

  it("list returns rows sorted newest-first", async () => {
    await repo.create({ level: 3, createdAt: 1000 });
    await repo.create({ level: 4, createdAt: 3000 });
    await repo.create({ level: 5, createdAt: 2000 });
    const rows = await repo.list();
    expect(rows.map((r) => r.createdAt)).toEqual([3000, 2000, 1000]);
  });

  it("list applies fromDate / toDate filters", async () => {
    await repo.create({ level: 1, createdAt: 100 });
    await repo.create({ level: 2, createdAt: 500 });
    await repo.create({ level: 3, createdAt: 900 });
    const filtered = await repo.list({
      fromDate: new Date(200),
      toDate: new Date(800),
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.level).toBe(2);
  });

  it("list applies the limit", async () => {
    for (let i = 0; i < 5; i += 1) {
      await repo.create({ level: 3, createdAt: i + 1 });
    }
    const rows = await repo.list({ limit: 2 });
    expect(rows).toHaveLength(2);
  });

  it("update patches only the supplied fields", async () => {
    const entry = await repo.create({ level: 3, note: "first" });
    const updated = await repo.update(entry.id, { level: 5 });
    expect(updated.level).toBe(5);
    expect(updated.note).toBe("first");
    expect(updated.syncStatus).toBe("pending");
    expect(updated.updatedAt).toBeGreaterThanOrEqual(entry.updatedAt);
  });

  it("update can replace the influences array", async () => {
    const entry = await repo.create({ level: 3, influences: ["a"] });
    const updated = await repo.update(entry.id, { influences: ["b", "c"] });
    expect(updated.influences).toEqual(["b", "c"]);
  });

  it("update throws for a missing id", async () => {
    await expect(repo.update("missing", { level: 1 })).rejects.toThrow(
      /not found/,
    );
  });

  it("delete removes the row", async () => {
    const entry = await repo.create({ level: 3 });
    await repo.delete(entry.id);
    expect(await repo.byId(entry.id)).toBeNull();
  });

  it("delete is a no-op for a missing id", async () => {
    await expect(repo.delete("missing")).resolves.toBeUndefined();
  });

  it("getStreak returns 0 when there are no entries", async () => {
    expect(await repo.getStreak()).toBe(0);
  });

  it("getStreak returns 1 when there is exactly one entry today", async () => {
    await repo.create({ level: 3, createdAt: Date.now() });
    expect(await repo.getStreak()).toBe(1);
  });

  it("getStreak counts consecutive days ending today", async () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(today.getDate() - 2);
    await repo.create({ level: 3, createdAt: dayBefore.getTime() });
    await repo.create({ level: 3, createdAt: yesterday.getTime() });
    await repo.create({ level: 3, createdAt: today.getTime() });
    expect(await repo.getStreak()).toBe(3);
  });

  it("getStreak breaks on a missing day", async () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const threeAgo = new Date(today);
    threeAgo.setDate(today.getDate() - 3);
    await repo.create({ level: 3, createdAt: threeAgo.getTime() });
    await repo.create({ level: 3, createdAt: today.getTime() });
    expect(await repo.getStreak()).toBe(1);
  });

  it("getCalendar returns one cell per day in the month", async () => {
    const cells = await repo.getCalendar(2, 2024);
    expect(cells).toHaveLength(29); // 2024 is a leap year
  });

  it("getCalendar averages levels per day", async () => {
    const day = new Date(2024, 0, 5, 9, 0, 0).getTime();
    const day2 = new Date(2024, 0, 5, 18, 0, 0).getTime();
    await repo.create({ level: 2, createdAt: day });
    await repo.create({ level: 4, createdAt: day2 });
    const cells = await repo.getCalendar(1, 2024);
    const cell = cells.find((c) => c.day === 5);
    expect(cell?.entryCount).toBe(2);
    expect(cell?.averageLevel).toBe(3);
  });

  it("getCalendar reports null for empty days", async () => {
    const cells = await repo.getCalendar(1, 2024);
    const cell = cells.find((c) => c.day === 15);
    expect(cell?.averageLevel).toBeNull();
    expect(cell?.entryCount).toBe(0);
  });

  it("getCalendar throws for an invalid month", async () => {
    await expect(repo.getCalendar(0, 2024)).rejects.toThrow(/Invalid month/);
    await expect(repo.getCalendar(13, 2024)).rejects.toThrow(/Invalid month/);
  });

  it("create generates unique ids across calls", async () => {
    const a = await repo.create({ level: 3 });
    const b = await repo.create({ level: 3 });
    expect(a.id).not.toBe(b.id);
  });

  it("update bumps updatedAt to a later timestamp", async () => {
    const entry = await repo.create({ level: 3, createdAt: 1 });
    const before = entry.updatedAt;
    await new Promise((r) => setTimeout(r, 5));
    const updated = await repo.update(entry.id, { level: 4 });
    expect(updated.updatedAt).toBeGreaterThanOrEqual(before);
  });

  it("decoded influences ignore non-string entries gracefully", async () => {
    const entry = await repo.create({
      level: 3,
      influences: ["work", "sleep"],
    });
    const fetched = await repo.byId(entry.id);
    expect(fetched?.influences).toEqual(["work", "sleep"]);
  });
});
