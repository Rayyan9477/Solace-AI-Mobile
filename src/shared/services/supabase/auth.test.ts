/**
 * Tests for the Supabase Auth API stub.
 */

import { buildStubClient, NOT_CONFIGURED_ERROR } from "./client";
import { createSupabaseAuthApi } from "./auth";

describe("Supabase auth stub", () => {
  it("signInWithMagicLink rejects an empty email locally", async () => {
    const api = createSupabaseAuthApi(() => null);
    const result = await api.signInWithMagicLink("");
    expect(result.error).toMatch(/Invalid email/);
  });

  it("signInWithMagicLink rejects malformed email locally", async () => {
    const api = createSupabaseAuthApi(() => null);
    const result = await api.signInWithMagicLink("notanemail");
    expect(result.error).toMatch(/Invalid email/);
  });

  it("signInWithMagicLink returns NOT_CONFIGURED when the client is null", async () => {
    const api = createSupabaseAuthApi(() => null);
    const result = await api.signInWithMagicLink("user@example.com");
    expect(result.error).toBe(NOT_CONFIGURED_ERROR);
  });

  it("signInWithMagicLink delegates to the client when configured", async () => {
    const stub = buildStubClient(true);
    const api = createSupabaseAuthApi(() => stub);
    const result = await api.signInWithMagicLink("user@example.com");
    expect(result.error).toBe(NOT_CONFIGURED_ERROR);
  });

  it("signOut returns NOT_CONFIGURED when the client is null", async () => {
    const api = createSupabaseAuthApi(() => null);
    expect(await api.signOut()).toEqual({ error: NOT_CONFIGURED_ERROR });
  });

  it("signOut delegates to the configured client", async () => {
    const stub = buildStubClient(true);
    const api = createSupabaseAuthApi(() => stub);
    expect(await api.signOut()).toEqual({ error: NOT_CONFIGURED_ERROR });
  });

  it("getCurrentSession returns null when the client is null", async () => {
    const api = createSupabaseAuthApi(() => null);
    expect(await api.getCurrentSession()).toBeNull();
  });

  it("getCurrentSession returns null when no session is present", async () => {
    const stub = buildStubClient(true);
    const api = createSupabaseAuthApi(() => stub);
    expect(await api.getCurrentSession()).toBeNull();
  });

  it("getCurrentSession projects userId when the stub returns a session", async () => {
    const stub = buildStubClient(true);
    // Override getSession to return a faux session.
    const overridden = {
      ...stub,
      auth: {
        ...stub.auth,
        getSession: async () => ({
          data: { userId: "user-123" },
          error: null,
        }),
      },
    } as typeof stub;
    const api = createSupabaseAuthApi(() => overridden);
    const session = await api.getCurrentSession();
    expect(session).toEqual({ userId: "user-123" });
  });

  it("never throws on misuse — always returns the { error } shape", async () => {
    const api = createSupabaseAuthApi(() => null);
    await expect(
      api.signInWithMagicLink("badly@formatted.com"),
    ).resolves.toEqual({ error: NOT_CONFIGURED_ERROR });
  });
});
