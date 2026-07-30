/**
 * Tests for the ID generator helper.
 */

import * as Crypto from "expo-crypto";

import { generateId } from "./ids";

describe("generateId", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns a non-empty string", () => {
    expect(typeof generateId()).toBe("string");
    expect(generateId().length).toBeGreaterThan(0);
  });

  it("emits unique values on repeated calls", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 50; i += 1) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(50);
  });

  it("falls back when expo-crypto.randomUUID throws", () => {
    jest
      .spyOn(Crypto, "randomUUID")
      .mockImplementation(() => {
        throw new Error("no entropy");
      });
    const id = generateId();
    expect(typeof id).toBe("string");
    expect(id).toMatch(/-/); // fallback format includes a separator
  });

  it("falls back when expo-crypto.randomUUID returns an empty string", () => {
    jest.spyOn(Crypto, "randomUUID").mockReturnValue("");
    const id = generateId();
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });
});
