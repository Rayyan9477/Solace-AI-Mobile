/**
 * Tests for the row <-> entity serialization helpers.
 */

import {
  decodeStringArray,
  encodeStringArray,
  optionalNumber,
  optionalString,
} from "./serialize";

describe("encodeStringArray", () => {
  it("returns null for undefined input", () => {
    expect(encodeStringArray(undefined)).toBeNull();
  });

  it("returns null for an empty array", () => {
    expect(encodeStringArray([])).toBeNull();
  });

  it("JSON-encodes a non-empty array", () => {
    expect(encodeStringArray(["a", "b"])).toBe('["a","b"]');
  });
});

describe("decodeStringArray", () => {
  it("returns undefined for null", () => {
    expect(decodeStringArray(null)).toBeUndefined();
  });

  it("returns undefined for undefined", () => {
    expect(decodeStringArray(undefined)).toBeUndefined();
  });

  it("returns undefined for the empty string", () => {
    expect(decodeStringArray("")).toBeUndefined();
  });

  it("decodes a valid JSON array of strings", () => {
    expect(decodeStringArray('["a","b"]')).toEqual(["a", "b"]);
  });

  it("returns undefined for malformed JSON", () => {
    expect(decodeStringArray("not json")).toBeUndefined();
  });

  it("returns undefined when the JSON is not an array", () => {
    expect(decodeStringArray('"plain"')).toBeUndefined();
  });

  it("filters out non-string array entries", () => {
    expect(decodeStringArray('["a", 1, null, "b"]')).toEqual(["a", "b"]);
  });

  it("returns undefined when the resulting array is empty", () => {
    expect(decodeStringArray("[]")).toBeUndefined();
    expect(decodeStringArray("[1, 2]")).toBeUndefined();
  });
});

describe("optionalString", () => {
  it("returns undefined for null / undefined", () => {
    expect(optionalString(null)).toBeUndefined();
    expect(optionalString(undefined)).toBeUndefined();
  });

  it("passes through a regular string", () => {
    expect(optionalString("hello")).toBe("hello");
  });

  it("passes through an empty string", () => {
    expect(optionalString("")).toBe("");
  });
});

describe("optionalNumber", () => {
  it("returns undefined for null / undefined", () => {
    expect(optionalNumber(null)).toBeUndefined();
    expect(optionalNumber(undefined)).toBeUndefined();
  });

  it("passes through a finite number", () => {
    expect(optionalNumber(42)).toBe(42);
    expect(optionalNumber(0)).toBe(0);
    expect(optionalNumber(-1.5)).toBe(-1.5);
  });

  it("returns undefined for NaN / Infinity", () => {
    expect(optionalNumber(Number.NaN)).toBeUndefined();
    expect(optionalNumber(Number.POSITIVE_INFINITY)).toBeUndefined();
  });
});
