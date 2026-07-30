/**
 * Write-failure toast.
 *
 * @description Phase 1 item 1.6 — the user-visible half of the fix for the ten
 *   swallowed repository writes. {@link logSilentFailure} tells the developer;
 *   this tells the person whose entry did not save.
 *
 *   Every failed write across the navigation adapters surfaces through this one
 *   hook, so the copy, the colour, the live region and the test id are the same
 *   everywhere and cannot drift per feature.
 *
 *   **Why a hook that returns an element.** The obvious alternative — a single
 *   `ToastProvider` above `NavigationContainer` in `App.tsx` — would be the
 *   right home for a general-purpose toast queue, and Phase 3.7 should build it
 *   when it touches `App.tsx` anyway. It is not needed here: the correct
 *   response to a failed write is to *stay on the screen that owns the data*
 *   (see the adapters — a composer that closes on a failed save has thrown the
 *   draft away, which no toast can undo), so the route that reports the failure
 *   is still mounted to render it.
 *
 *   **Why it lives under `utils/`.** It is one indivisible pair with
 *   `logSilentFailure` — reporting a write failure must always do both — and
 *   splitting them across `utils/` and `components/` invites a call site that
 *   does only one. Move both into a `feedback/` module if a second consumer
 *   ever needs the toast without the log.
 *
 * @module shared/utils
 */

import React from "react";

import { Toast } from "../components/molecules/feedback/Toast";
import type { ToastAction } from "../components/molecules/feedback/Toast.types";
import { logSilentFailure } from "./logSilentFailure";

/** Shared test id, so every adapter test asserts the same node. */
export const WRITE_FAILURE_TOAST_TEST_ID = "write-failure-toast";

/**
 * Long for a toast (the default is 4s). A "your entry did not save" notice is
 * the one message the user must not miss, and it competes with the user
 * re-reading the screen to work out what happened.
 */
const WRITE_FAILURE_TOAST_DURATION_MS = 8000;

/** A write that failed, as the user and the log each need to see it. */
export interface WriteFailure {
  /** Dotted identifier for the log, e.g. `"journal.create"`. */
  readonly operation: string;
  /** The caught value. */
  readonly error: unknown;
  /**
   * What the user reads. Say what did not happen and what is still true —
   * never "Error" and never a code. Their draft is still on screen; the copy
   * should make that obvious.
   */
  readonly message: string;
  /** Non-sensitive breadcrumbs for the log. Never entry or message bodies. */
  readonly context?: Readonly<Record<string, unknown>>;
  /** Optional escape hatch, e.g. "Continue anyway" on a blocking surface. */
  readonly action?: ToastAction;
}

/** What {@link useWriteFailureToast} hands back. */
export interface WriteFailureToast {
  /** Log the failure and raise the toast. Safe to call from a `catch`. */
  readonly reportWriteFailure: (failure: WriteFailure) => void;
  /** Clear the toast — e.g. when a retry succeeds. */
  readonly dismissWriteFailure: () => void;
  /** Render this as a sibling of the screen. `null` when nothing has failed. */
  readonly failureToast: React.ReactElement | null;
}

/**
 * Report repository write failures to the user and to the log.
 *
 * @returns the reporter, a manual dismiss, and the element to render
 *
 * @example
 * ```tsx
 * const { reportWriteFailure, failureToast } = useWriteFailureToast();
 *
 * try {
 *   await mood.create(entry);
 *   navigation.goBack();
 * } catch (error) {
 *   reportWriteFailure({
 *     operation: "mood.create",
 *     error,
 *     message: "We couldn't save your check-in. Your note is still here.",
 *   });
 * }
 *
 * return (
 *   <>
 *     <MoodSelectorScreen … />
 *     {failureToast}
 *   </>
 * );
 * ```
 */
export function useWriteFailureToast(): WriteFailureToast {
  const [visible, setVisible] = React.useState<{
    readonly message: string;
    readonly action?: ToastAction;
  } | null>(null);

  const reportWriteFailure = React.useCallback((failure: WriteFailure) => {
    logSilentFailure(failure.operation, failure.error, failure.context);
    setVisible({ message: failure.message, action: failure.action });
  }, []);

  const dismissWriteFailure = React.useCallback(() => {
    setVisible(null);
  }, []);

  const failureToast =
    visible === null ? null : (
      <Toast
        visible
        testID={WRITE_FAILURE_TOAST_TEST_ID}
        variant="error"
        position="bottom"
        // DESIGN.md §9: errors interrupt, they do not queue.
        accessibilityLiveRegion="assertive"
        duration={WRITE_FAILURE_TOAST_DURATION_MS}
        message={visible.message}
        action={visible.action}
        showCloseButton
        onDismiss={dismissWriteFailure}
      />
    );

  return { reportWriteFailure, dismissWriteFailure, failureToast };
}
