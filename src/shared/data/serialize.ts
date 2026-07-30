/**
 * Row <-> entity serialization helpers.
 *
 * @description Several columns store JSON-encoded string arrays
 *   (`influences`, `hashtags`, `feelings`). These helpers centralise the
 *   encode / decode logic so repositories are free of `JSON.parse` noise.
 *
 * @module shared/data
 */

/**
 * Encode an optional readonly string array into the on-disk JSON form.
 * Empty / undefined arrays serialise to `null` so the column stays empty
 * rather than holding `"[]"`.
 */
export function encodeStringArray(
  value: readonly string[] | undefined,
): string | null {
  if (!value || value.length === 0) return null;
  return JSON.stringify(value);
}

/**
 * Decode the JSON-encoded form back into a string array. Tolerates `null`,
 * `undefined`, malformed JSON, and non-array payloads — all collapse to
 * `undefined` so consumers can use a simple optional chain.
 */
export function decodeStringArray(
  value: string | null | undefined,
): readonly string[] | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return undefined;
    const out: string[] = [];
    for (const item of parsed) {
      if (typeof item === "string") {
        out.push(item);
      }
    }
    return out.length === 0 ? undefined : out;
  } catch {
    return undefined;
  }
}

/** Coerce a `string | null | undefined` column into an optional string. */
export function optionalString(
  value: string | null | undefined,
): string | undefined {
  if (value === null || value === undefined) return undefined;
  return value;
}

/** Coerce a `number | null | undefined` column into an optional number. */
export function optionalNumber(
  value: number | null | undefined,
): number | undefined {
  if (value === null || value === undefined) return undefined;
  if (!Number.isFinite(value)) return undefined;
  return value;
}
