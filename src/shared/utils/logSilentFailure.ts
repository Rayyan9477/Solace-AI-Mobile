/**
 * Silent-failure logging shim.
 *
 * @description Phase 1 item 1.6. Ten repository writes across the navigation
 *   adapters were wrapped in bare `catch {}` blocks. A failed save produced no
 *   console output, no telemetry, and — worse — no UI: the composer closed,
 *   the switch stayed flipped, the mood face stayed lit. This module is the
 *   non-visual half of the fix.
 *
 *   It deliberately does two small things and nothing else:
 *
 *   1. In `__DEV__`, warn with the operation name so a swallowed write is
 *      visible while developing. `babel.config.js` preserves `console.warn` in
 *      production builds, so this is `__DEV__`-gated rather than relying on
 *      the transform — a production user's console should stay clean.
 *   2. Forward the report to an optional reporter. Phase 8's crash-reporting
 *      work registers Sentry here once and every existing call site starts
 *      producing breadcrumbs without being touched again.
 *
 *   Until then, in production, it is a no-op — which is the point: adopting it
 *   now costs nothing and removes the need to hunt down the ten call sites a
 *   second time.
 *
 * @module shared/utils
 */

/** Structured payload handed to a {@link SilentFailureReporter}. */
export interface SilentFailureReport {
  /**
   * Dotted identifier of what failed, in `repository.method` form — e.g.
   * `"mood.create"`, `"settings.set"`. Kept stable and greppable so a
   * dashboard can group by it.
   */
  readonly operation: string;
  /** Whatever the rejected promise threw. Not assumed to be an `Error`. */
  readonly error: unknown;
  /** Extra breadcrumbs. Must never contain journal or chat body text. */
  readonly context?: Readonly<Record<string, unknown>>;
}

/** Sink for silent failures. Registered once, at app start, by Phase 8. */
export type SilentFailureReporter = (report: SilentFailureReport) => void;

let reporter: SilentFailureReporter | null = null;

/**
 * Register (or clear, with `null`) the process-wide silent-failure reporter.
 *
 * @param next - the sink to forward reports to, or `null` to detach
 */
export function setSilentFailureReporter(
  next: SilentFailureReporter | null,
): void {
  reporter = next;
}

/**
 * Record an error that was caught and deliberately not rethrown.
 *
 * Call this from every `catch` that swallows a failure the user cannot
 * otherwise learn about. It is safe to call from anywhere: it never throws and
 * never returns a rejected promise.
 *
 * @param operation - dotted identifier, e.g. `"journal.create"`
 * @param error - the caught value
 * @param context - optional non-sensitive breadcrumbs
 *
 * @example
 * ```ts
 * try {
 *   await journal.create(draft);
 * } catch (error) {
 *   logSilentFailure("journal.create", error, { editing: false });
 * }
 * ```
 */
export function logSilentFailure(
  operation: string,
  error: unknown,
  context?: Readonly<Record<string, unknown>>,
): void {
  if (__DEV__) {
    if (context) {
      // eslint-disable-next-line no-console
      console.warn(`[silent-failure] ${operation}`, error, context);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`[silent-failure] ${operation}`, error);
    }
  }

  if (!reporter) return;

  try {
    reporter(
      context === undefined
        ? { operation, error }
        : { operation, error, context },
    );
  } catch (reporterError) {
    // The caller is already inside a catch block that has lost its data. A
    // crash in the crash reporter must not escalate that into a redbox.
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn("[silent-failure] reporter threw", reporterError);
    }
  }
}
