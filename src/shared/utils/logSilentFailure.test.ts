/**
 * Tests for the silent-failure logging shim.
 *
 * Phase 1 item 1.6. Ten repository writes across the navigation adapters were
 * wrapped in bare `catch {}` blocks, so a failed save produced no console
 * output, no telemetry and no UI. These tests pin the two halves of the fix
 * that are NOT user-visible: a dev-time warning that names the operation, and
 * a reporter seam Phase 8's Sentry work can occupy without touching a single
 * call site.
 */

import {
  logSilentFailure,
  setSilentFailureReporter,
  type SilentFailureReport,
} from "./logSilentFailure";

describe("logSilentFailure", () => {
  let warnSpy: jest.SpyInstance;
  const originalDev = (globalThis as { __DEV__?: boolean }).__DEV__;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
    setSilentFailureReporter(null);
    (globalThis as { __DEV__?: boolean }).__DEV__ = originalDev;
  });

  it("warns in development with the operation name and the error", () => {
    (globalThis as { __DEV__?: boolean }).__DEV__ = true;
    const error = new Error("disk full");

    logSilentFailure("mood.create", error);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const [message, loggedError] = warnSpy.mock.calls[0] as [string, unknown];
    expect(message).toContain("mood.create");
    expect(loggedError).toBe(error);
  });

  it("includes the context object in the dev warning when one is given", () => {
    (globalThis as { __DEV__?: boolean }).__DEV__ = true;

    logSilentFailure("journal.update", new Error("locked"), {
      entryId: "abc-123",
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0]).toContainEqual({ entryId: "abc-123" });
  });

  it("stays silent in production so the shim costs nothing when unadopted", () => {
    (globalThis as { __DEV__?: boolean }).__DEV__ = false;

    logSilentFailure("settings.set", new Error("nope"));

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("forwards the report to a registered reporter", () => {
    (globalThis as { __DEV__?: boolean }).__DEV__ = false;
    const reports: SilentFailureReport[] = [];
    setSilentFailureReporter((report) => reports.push(report));
    const error = new Error("offline");

    logSilentFailure("chat.appendMessage", error, { conversationId: "c1" });

    expect(reports).toHaveLength(1);
    expect(reports[0]).toEqual({
      operation: "chat.appendMessage",
      error,
      context: { conversationId: "c1" },
    });
  });

  it("stops forwarding once the reporter is cleared", () => {
    const reporter = jest.fn();
    setSilentFailureReporter(reporter);
    setSilentFailureReporter(null);

    logSilentFailure("mood.create", new Error("x"));

    expect(reporter).not.toHaveBeenCalled();
  });

  it("never throws when the reporter itself throws", () => {
    (globalThis as { __DEV__?: boolean }).__DEV__ = false;
    setSilentFailureReporter(() => {
      throw new Error("sentry is down");
    });

    // A crash inside the crash reporter must not take out the caller — the
    // caller is always inside a catch block that has already lost its data.
    expect(() => logSilentFailure("mood.create", new Error("x"))).not.toThrow();
  });
});
