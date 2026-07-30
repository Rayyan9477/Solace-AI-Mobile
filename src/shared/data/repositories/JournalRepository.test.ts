/**
 * Tests for the SQLite-backed journal repository.
 */

import { closeDatabase, openDatabase } from "../db";
import {
  createSqliteJournalRepository,
  type JournalRepository,
} from "./JournalRepository";

describe("JournalRepository", () => {
  let repo: JournalRepository;

  beforeEach(async () => {
    const db = await openDatabase("journal_repo.db");
    repo = createSqliteJournalRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it("create persists a new entry with sync_status pending", async () => {
    const entry = await repo.create({ body: "First reflection" });
    expect(entry.id).toBeTruthy();
    expect(entry.body).toBe("First reflection");
    expect(entry.syncStatus).toBe("pending");
  });

  it("create rejects an empty body", async () => {
    await expect(repo.create({ body: "" })).rejects.toThrow(/non-empty string/);
  });

  it("create stores hashtags as JSON", async () => {
    const entry = await repo.create({
      body: "Tagged",
      hashtags: ["gratitude", "family"],
    });
    const fetched = await repo.byId(entry.id);
    expect(fetched?.hashtags).toEqual(["gratitude", "family"]);
  });

  it("byId returns null for a missing id", async () => {
    expect(await repo.byId("missing")).toBeNull();
  });

  it("list returns rows newest-first", async () => {
    await repo.create({ body: "old", createdAt: 100 });
    await repo.create({ body: "new", createdAt: 1000 });
    const rows = await repo.list();
    expect(rows[0]?.body).toBe("new");
    expect(rows[1]?.body).toBe("old");
  });

  it("list applies date range filters", async () => {
    await repo.create({ body: "a", createdAt: 100 });
    await repo.create({ body: "b", createdAt: 500 });
    await repo.create({ body: "c", createdAt: 900 });
    const rows = await repo.list({
      fromDate: new Date(200),
      toDate: new Date(800),
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.body).toBe("b");
  });

  it("list applies the search filter (case-insensitive on body)", async () => {
    await repo.create({ body: "Today was beautiful" });
    await repo.create({ body: "Just an ordinary day" });
    const rows = await repo.list({ search: "BEAUTIFUL" });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.body).toContain("beautiful");
  });

  it("list applies the search filter to title fallback", async () => {
    await repo.create({ title: "Gratitude", body: "thankful for everything" });
    await repo.create({ body: "ordinary stuff" });
    const rows = await repo.list({ search: "gratitude" });
    expect(rows).toHaveLength(1);
  });

  it("list applies the limit", async () => {
    for (let i = 0; i < 5; i += 1) {
      await repo.create({ body: `entry-${i}`, createdAt: i });
    }
    const rows = await repo.list({ limit: 3 });
    expect(rows).toHaveLength(3);
  });

  it("list filters by hashtag", async () => {
    await repo.create({ body: "a", hashtags: ["gratitude"] });
    await repo.create({ body: "b", hashtags: ["work"] });
    const rows = await repo.list({ hashtag: "gratitude" });
    expect(rows).toHaveLength(1);
    expect(rows[0]?.body).toBe("a");
  });

  it("update patches title without affecting other fields", async () => {
    const entry = await repo.create({ body: "body" });
    const updated = await repo.update(entry.id, { title: "Title!" });
    expect(updated.title).toBe("Title!");
    expect(updated.body).toBe("body");
  });

  it("update can clear the title by passing an undefined title (sticks)", async () => {
    const entry = await repo.create({ body: "body", title: "Initial" });
    const updated = await repo.update(entry.id, { body: "next" });
    expect(updated.title).toBe("Initial");
  });

  it("update bumps sync_status back to pending", async () => {
    const entry = await repo.create({ body: "body" });
    const updated = await repo.update(entry.id, { body: "edited" });
    expect(updated.syncStatus).toBe("pending");
  });

  it("update throws for a missing id", async () => {
    await expect(
      repo.update("missing", { body: "x" }),
    ).rejects.toThrow(/not found/);
  });

  it("delete removes the row", async () => {
    const entry = await repo.create({ body: "body" });
    await repo.delete(entry.id);
    expect(await repo.byId(entry.id)).toBeNull();
  });

  it("delete is a no-op on a missing id", async () => {
    await expect(repo.delete("nope")).resolves.toBeUndefined();
  });

  it("count reports total rows", async () => {
    expect(await repo.count()).toBe(0);
    await repo.create({ body: "a" });
    await repo.create({ body: "b" });
    expect(await repo.count()).toBe(2);
  });

  it("create generates unique ids", async () => {
    const a = await repo.create({ body: "a" });
    const b = await repo.create({ body: "b" });
    expect(a.id).not.toBe(b.id);
  });

  it("create accepts an explicit createdAt", async () => {
    const entry = await repo.create({ body: "x", createdAt: 12345 });
    expect(entry.createdAt).toBe(12345);
  });

  it("create persists a moodLevel attribute", async () => {
    const entry = await repo.create({ body: "x", moodLevel: 4 });
    const fetched = await repo.byId(entry.id);
    expect(fetched?.moodLevel).toBe(4);
  });

  it("update can change the moodLevel", async () => {
    const entry = await repo.create({ body: "x", moodLevel: 2 });
    const updated = await repo.update(entry.id, { moodLevel: 5 });
    expect(updated.moodLevel).toBe(5);
  });
});
