/**
 * Tests for the SQLite-backed settings repository.
 */

import { closeDatabase, openDatabase } from "../db";
import {
  createSqliteSettingsRepository,
  type SettingsRepository,
} from "./SettingsRepository";

describe("SettingsRepository", () => {
  let repo: SettingsRepository;

  beforeEach(async () => {
    const db = await openDatabase("settings_repo.db");
    repo = createSqliteSettingsRepository(db);
  });

  afterEach(async () => {
    await closeDatabase();
  });

  it("get returns null for an unknown key", async () => {
    expect(await repo.get("unknown")).toBeNull();
  });

  it("getValue returns null for an unknown key", async () => {
    expect(await repo.getValue("unknown")).toBeNull();
  });

  it("set inserts a new row", async () => {
    const record = await repo.set({ key: "theme_id", value: "cosmic" });
    expect(record.key).toBe("theme_id");
    expect(record.value).toBe("cosmic");
    expect(record.updatedAt).toBeGreaterThan(0);
  });

  it("set overwrites an existing row", async () => {
    await repo.set({ key: "theme_id", value: "cosmic" });
    await repo.set({ key: "theme_id", value: "warmEarth" });
    const record = await repo.get("theme_id");
    expect(record?.value).toBe("warmEarth");
  });

  it("get returns the stored record after set", async () => {
    await repo.set({ key: "biometric_enabled", value: "true" });
    const record = await repo.get("biometric_enabled");
    expect(record?.value).toBe("true");
  });

  it("getValue returns just the string value", async () => {
    await repo.set({ key: "k", value: "v" });
    expect(await repo.getValue("k")).toBe("v");
  });

  it("set rejects empty keys", async () => {
    await expect(
      repo.set({ key: "", value: "x" }),
    ).rejects.toThrow(/non-empty/);
  });

  it("set rejects non-string values", async () => {
    await expect(
      // @ts-expect-error — deliberately bad input
      repo.set({ key: "k", value: 42 }),
    ).rejects.toThrow(/must be a string/);
  });

  it("delete removes the row", async () => {
    await repo.set({ key: "k", value: "v" });
    await repo.delete("k");
    expect(await repo.get("k")).toBeNull();
  });

  it("delete is a no-op on a missing key", async () => {
    await expect(repo.delete("missing")).resolves.toBeUndefined();
  });

  it("getAll returns rows sorted by key ascending", async () => {
    await repo.set({ key: "zebra", value: "z" });
    await repo.set({ key: "alpha", value: "a" });
    await repo.set({ key: "mango", value: "m" });
    const rows = await repo.getAll();
    expect(rows.map((r) => r.key)).toEqual(["alpha", "mango", "zebra"]);
  });

  it("getAll returns an empty array when nothing is stored", async () => {
    expect(await repo.getAll()).toEqual([]);
  });

  it("set bumps updatedAt on overwrite", async () => {
    const first = await repo.set({ key: "k", value: "v1" });
    await new Promise((r) => setTimeout(r, 5));
    const second = await repo.set({ key: "k", value: "v2" });
    expect(second.updatedAt).toBeGreaterThanOrEqual(first.updatedAt);
  });

  it("supports an empty-string value", async () => {
    await repo.set({ key: "k", value: "" });
    expect(await repo.getValue("k")).toBe("");
  });
});
