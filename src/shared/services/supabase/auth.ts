/**
 * Supabase Auth API stub.
 *
 * @description Sprint 10 ships a typed stub so the existing `AuthContext`
 *   can keep using AsyncStorage today and Sprint 11 can swap to magic-link
 *   sign-in without changing the app surface.
 *
 *   Every method returns a `{ error }` shape (or null) — never throws — so
 *   call-sites can render a friendly "not yet wired" message rather than
 *   crashing.
 *
 * @module shared/services/supabase
 */

import {
  getSupabaseClient,
  NOT_CONFIGURED_ERROR,
  type SupabaseClientStub,
} from "./client";

/** Lightweight session shape. Mirrors what the real Supabase client returns. */
export interface SupabaseSession {
  /** Authenticated user id. */
  readonly userId: string;
}

/** Public surface used by AuthContext / SignInScreen. */
export interface SupabaseAuthApi {
  /** Send a magic-link email. Returns `{ error: null }` on success. */
  signInWithMagicLink(email: string): Promise<{ error: string | null }>;
  /** Clear the active session. */
  signOut(): Promise<{ error: string | null }>;
  /** Return the active session, or null when signed-out / not configured. */
  getCurrentSession(): Promise<SupabaseSession | null>;
}

/** Build the auth API. Resolves the client lazily so tests can swap env vars. */
export function createSupabaseAuthApi(
  resolveClient: () => SupabaseClientStub | null = getSupabaseClient,
): SupabaseAuthApi {
  return {
    async signInWithMagicLink(email) {
      if (!isLikelyEmail(email)) {
        return { error: "Invalid email address" };
      }
      const client = resolveClient();
      if (!client) {
        return { error: NOT_CONFIGURED_ERROR };
      }
      const { error } = await client.auth.signInWithOtp({ email });
      return { error };
    },

    async signOut() {
      const client = resolveClient();
      if (!client) {
        return { error: NOT_CONFIGURED_ERROR };
      }
      const { error } = await client.auth.signOut();
      return { error };
    },

    async getCurrentSession() {
      const client = resolveClient();
      if (!client) {
        return null;
      }
      const { data } = await client.auth.getSession();
      return data ? { userId: data.userId } : null;
    },
  };
}

/** Minimal, deliberately permissive email-shape check. */
function isLikelyEmail(value: string): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length < 3) return false;
  const at = trimmed.indexOf("@");
  return at > 0 && at < trimmed.length - 1;
}
