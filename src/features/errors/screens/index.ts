/**
 * Error / state screens barrel — feature errors module.
 *
 * Exports all four cosmic v4.2 state screens (Sprint 9 Batch B) plus the
 * pre-existing 403/500/maintenance/etc. screens for back-compat.
 */

// Sprint 9 Batch B — cosmic v4.2 state screens
export { LoadingSkeletonScreen } from "./LoadingSkeletonScreen";
export type { LoadingSkeletonScreenProps } from "./LoadingSkeletonScreen";

export { EmptyStateScreen } from "./EmptyStateScreen";
export type {
  EmptyStateScreenProps,
  EmptyStateHeadline,
} from "./EmptyStateScreen";

export { NoInternetScreen } from "./NoInternetScreen";
export type { NoInternetScreenProps } from "./NoInternetScreen";

export { NotFound404Screen } from "./NotFound404Screen";
export type { NotFound404ScreenProps } from "./NotFound404Screen";

// Legacy error screens (Phase 3C era)
export { InternalError500Screen } from "./InternalError500Screen";
export { MaintenanceScreen } from "./MaintenanceScreen";
export { NotAllowed403Screen } from "./NotAllowed403Screen";
