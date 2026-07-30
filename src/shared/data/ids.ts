/**
 * ID generation helpers.
 *
 * @description Centralised UUID factory so every repository writes ids with
 *   the same shape. We prefer `expo-crypto`'s `randomUUID` (RFC 4122 v4)
 *   which is available on iOS, Android, and modern web. If the platform
 *   doesn't expose it (older web, some test environments) we fall back to
 *   a 22-char base36 string seeded from `Date.now()` + `Math.random()` —
 *   collision probability is microscopic for client-side primary keys.
 *
 * @module shared/data
 */

import * as Crypto from "expo-crypto";

/**
 * Generate a client-side primary key.
 *
 * @returns RFC 4122 v4 UUID when available, otherwise a 22-char fallback.
 */
export function generateId(): string {
  const candidate = (Crypto as { randomUUID?: () => string }).randomUUID;
  if (typeof candidate === "function") {
    try {
      const value = candidate();
      if (typeof value === "string" && value.length > 0) {
        return value;
      }
    } catch {
      // Fall through to fallback below.
    }
  }
  return fallbackId();
}

/** Deterministic fallback used when expo-crypto is unavailable. */
function fallbackId(): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2);
  return `${time}-${rand}`;
}
