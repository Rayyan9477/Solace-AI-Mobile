/**
 * Supabase client stub.
 *
 * @description Sprint 10 ships a typed stub so the rest of the app can
 *   compile against a stable surface. The real `@supabase/supabase-js`
 *   client lands in Sprint 11 once the credentials are in place. Until
 *   then, every stub method returns a clearly-marked sentinel so callers
 *   can detect the unconfigured state without throwing.
 *
 *   Environment variables consumed when wiring Supabase:
 *   - `EXPO_PUBLIC_SUPABASE_URL`
 *   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
 *
 * @module shared/services/supabase
 */

/** Stub-shaped row result. Real client returns rich pgrest types. */
export interface SupabaseSelectResult<T> {
  /** Rows on success; null when not configured or on error. */
  readonly data: readonly T[] | null;
  /** Sentinel string for unconfigured state, real error otherwise. */
  readonly error: string | null;
}

/** Stub-shaped single row result. */
export interface SupabaseSingleResult<T> {
  readonly data: T | null;
  readonly error: string | null;
}

/** Subset of the table-builder surface used by the sync layer. */
export interface SupabaseTableQueryBuilder<TRow> {
  select(columns?: string): Promise<SupabaseSelectResult<TRow>>;
  insert(rows: readonly TRow[]): Promise<SupabaseSingleResult<TRow>>;
  upsert(rows: readonly TRow[]): Promise<SupabaseSingleResult<TRow>>;
  update(patch: Partial<TRow>): SupabaseTableQueryBuilder<TRow>;
  delete(): SupabaseTableQueryBuilder<TRow>;
  /** Filter helper — chained fluent style mirroring the real client. */
  eq(column: string, value: unknown): SupabaseTableQueryBuilder<TRow>;
}

/** Subset of the auth surface used by {@link SupabaseAuthApi}. */
export interface SupabaseAuthClient {
  signInWithOtp(payload: { email: string }): Promise<{ error: string | null }>;
  signOut(): Promise<{ error: string | null }>;
  getSession(): Promise<{ data: { userId: string } | null; error: string | null }>;
}

/** Stub interface — real `@supabase/supabase-js` shape lands in Sprint 11. */
export interface SupabaseClientStub {
  /** Chainable table builder mirroring `supabase-js` `.from(table)`. */
  from<TRow>(table: string): SupabaseTableQueryBuilder<TRow>;
  /** Auth surface. */
  readonly auth: SupabaseAuthClient;
  /** True when both env vars are populated. */
  readonly isConfigured: boolean;
}

/** Sentinel error string returned when the client is not configured. */
export const NOT_CONFIGURED_ERROR = "Supabase not configured";

/** Read environment variables (centralised so tests can stub them out). */
function readEnv(): { url: string | undefined; key: string | undefined } {
  return {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    key: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  };
}

/**
 * Return the active Supabase stub.
 *
 * - When both env vars are set, returns a stub flagged `isConfigured = true`.
 *   Methods still return the sentinel error because the real network client
 *   has not been wired yet — Sprint 11 swaps the body of these methods.
 * - When either env var is missing, returns `null` so the sync layer can
 *   short-circuit gracefully (this is the normal Sprint 10 state).
 */
export function getSupabaseClient(): SupabaseClientStub | null {
  const { url, key } = readEnv();
  if (!isNonEmpty(url) || !isNonEmpty(key)) {
    return null;
  }
  return buildStubClient(true);
}

/** Build a stub client; exported for tests that want a deterministic instance. */
export function buildStubClient(isConfigured: boolean): SupabaseClientStub {
  const auth: SupabaseAuthClient = {
    async signInWithOtp() {
      return { error: NOT_CONFIGURED_ERROR };
    },
    async signOut() {
      return { error: NOT_CONFIGURED_ERROR };
    },
    async getSession() {
      return { data: null, error: NOT_CONFIGURED_ERROR };
    },
  };

  function buildTable<TRow>(): SupabaseTableQueryBuilder<TRow> {
    const self: SupabaseTableQueryBuilder<TRow> = {
      async select() {
        return { data: null, error: NOT_CONFIGURED_ERROR };
      },
      async insert() {
        return { data: null, error: NOT_CONFIGURED_ERROR };
      },
      async upsert() {
        return { data: null, error: NOT_CONFIGURED_ERROR };
      },
      update() {
        return self;
      },
      delete() {
        return self;
      },
      eq() {
        return self;
      },
    };
    return self;
  }

  return {
    from<TRow>() {
      return buildTable<TRow>();
    },
    auth,
    isConfigured,
  };
}

function isNonEmpty(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}
