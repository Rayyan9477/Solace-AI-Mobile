/**
 * Shared utilities barrel.
 *
 * @description Created in Phase 1 item 1.6. `tsconfig.json` has mapped
 *   `@utils/*` at `src/shared/utils/*` since the migration, but the directory
 *   itself never existed (roadmap G7). It does now, and it starts with the
 *   pair that stops repository writes failing silently.
 *
 * @module shared/utils
 */

export {
  logSilentFailure,
  setSilentFailureReporter,
  type SilentFailureReport,
  type SilentFailureReporter,
} from "./logSilentFailure";
export {
  useWriteFailureToast,
  WRITE_FAILURE_TOAST_TEST_ID,
  type WriteFailure,
  type WriteFailureToast,
} from "./useWriteFailureToast";
