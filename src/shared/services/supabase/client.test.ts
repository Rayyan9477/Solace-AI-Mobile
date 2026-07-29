/**
 * Tests for the Supabase client stub.
 */

import {
  buildStubClient,
  getSupabaseClient,
  NOT_CONFIGURED_ERROR,
} from "./client";

describe("Supabase client stub", () => {
  const originalUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  afterEach(() => {
    if (originalUrl === undefined) {
      delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    } else {
      process.env.EXPO_PUBLIC_SUPABASE_URL = originalUrl;
    }
    if (originalKey === undefined) {
      delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    } else {
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    }
  });

  it("returns null when EXPO_PUBLIC_SUPABASE_URL is missing", () => {
    delete process.env.EXPO_PUBLIC_SUPABASE_URL;
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = "key";
    expect(getSupabaseClient()).toBeNull();
  });

  it("returns null when EXPO_PUBLIC_SUPABASE_ANON_KEY is missing", () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
    expect(getSupabaseClient()).toBeNull();
  });

  it("returns null when env vars are blank strings", () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = "   ";
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = "k";
    expect(getSupabaseClient()).toBeNull();
  });

  it("returns a configured stub when both env vars are set", () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    const client = getSupabaseClient();
    expect(client).not.toBeNull();
    expect(client?.isConfigured).toBe(true);
  });

  it("from() returns a chainable table builder", () => {
    const client = buildStubClient(true);
    const table = client.from("mood_entries");
    expect(typeof table.select).toBe("function");
    expect(typeof table.insert).toBe("function");
    expect(typeof table.upsert).toBe("function");
    expect(typeof table.update).toBe("function");
    expect(typeof table.delete).toBe("function");
    expect(typeof table.eq).toBe("function");
  });

  it("table builder methods chain back to the same instance", () => {
    const client = buildStubClient(true);
    const table = client.from("mood_entries");
    expect(table.update({}).eq("id", "x").delete()).toBe(table);
  });

  it("auth methods return the not-configured sentinel", async () => {
    const client = buildStubClient(true);
    expect(await client.auth.signInWithOtp({ email: "a@b.com" })).toEqual({
      error: NOT_CONFIGURED_ERROR,
    });
    expect(await client.auth.signOut()).toEqual({
      error: NOT_CONFIGURED_ERROR,
    });
    expect(await client.auth.getSession()).toEqual({
      data: null,
      error: NOT_CONFIGURED_ERROR,
    });
  });

  it("table query methods return the not-configured sentinel", async () => {
    const client = buildStubClient(true);
    const select = await client.from("mood_entries").select();
    expect(select.data).toBeNull();
    expect(select.error).toBe(NOT_CONFIGURED_ERROR);
    const insert = await client.from("mood_entries").insert([]);
    expect(insert.error).toBe(NOT_CONFIGURED_ERROR);
    const upsert = await client.from("mood_entries").upsert([]);
    expect(upsert.error).toBe(NOT_CONFIGURED_ERROR);
  });

  it("buildStubClient honours the isConfigured flag", () => {
    expect(buildStubClient(false).isConfigured).toBe(false);
    expect(buildStubClient(true).isConfigured).toBe(true);
  });

  it("NOT_CONFIGURED_ERROR is a stable, descriptive string", () => {
    expect(NOT_CONFIGURED_ERROR).toBe("Supabase not configured");
  });
});
