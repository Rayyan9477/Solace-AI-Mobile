/**
 * Supabase service barrel.
 *
 * @module shared/services/supabase
 */

export {
  buildStubClient,
  getSupabaseClient,
  NOT_CONFIGURED_ERROR,
  type SupabaseAuthClient,
  type SupabaseClientStub,
  type SupabaseSelectResult,
  type SupabaseSingleResult,
  type SupabaseTableQueryBuilder,
} from "./client";
export {
  createSupabaseAuthApi,
  type SupabaseAuthApi,
  type SupabaseSession,
} from "./auth";
