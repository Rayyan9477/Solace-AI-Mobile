import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  configureStore,
  combineReducers,
  Middleware,
  UnknownAction,
} from "@reduxjs/toolkit";
import encryptionService from "@shared/utils/encryption";
import { logger } from "@shared/utils/logger";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";

import assessmentSlice from "./slices/assessmentSlice";
import authSlice from "./slices/authSlice";
import chatSlice from "./slices/chatSlice";
import moodSlice from "./slices/moodSlice";
import therapySlice from "./slices/therapySlice";
import userSlice from "./slices/userSlice";
import encryptionTransform from "./transforms/encryptionTransform";

// TypeScript type declarations
declare const __DEV__: boolean;

// CRIT-001 FIX: Thread-safe encryption initialization with proper gating
let encryptionInitialized = false;
let encryptionInitPromise: Promise<boolean> | null = null;
let encryptionInitializationFailed = false;

/**
 * Initialize encryption service with proper async handling
 * Returns a promise that resolves when encryption is ready
 * Multiple calls will return the same promise (idempotent)
 * CRIT-001 FIX: Added mutex pattern to prevent race conditions
 */
export async function initializeEncryption(): Promise<boolean> {
  // If already initialized successfully, return immediately
  if (encryptionInitialized) {
    return true;
  }

  // If initialization failed previously, don't retry automatically
  // This prevents infinite retry loops
  if (encryptionInitializationFailed) {
    logger.warn("Encryption initialization previously failed - manual retry required");
    return false;
  }

  // If initialization is in progress, wait for the existing promise
  if (encryptionInitPromise) {
    return encryptionInitPromise;
  }

  // Start initialization with mutex
  encryptionInitPromise = (async () => {
    try {
      await encryptionService.initialize();
      encryptionInitialized = true;
      encryptionInitializationFailed = false;
      logger.info("Encryption service initialized successfully");
      return true;
    } catch (error) {
      logger.error("Encryption service initialization failed:", error);
      encryptionInitialized = false;
      encryptionInitializationFailed = true;
      // CRIT-001 FIX: Throw error instead of silently continuing
      // This ensures PHI is never stored unencrypted
      throw new Error(
        "CRITICAL: Encryption service failed to initialize. " +
        "PHI data cannot be safely stored. Please restart the app."
      );
    } finally {
      // Clear the promise so retry is possible after failure
      encryptionInitPromise = null;
    }
  })();

  return encryptionInitPromise;
}

/**
 * Wait for encryption to be ready before performing sensitive operations
 * Use this before any HIPAA-sensitive data operations
 * CRIT-001 FIX: This MUST be called before any persist operations
 */
export async function ensureEncryptionReady(): Promise<boolean> {
  if (encryptionInitialized) return true;
  return initializeEncryption();
}

/**
 * CRIT-001 FIX: Force retry encryption initialization
 * Call this after fixing encryption issues
 */
export async function retryEncryptionInitialization(): Promise<boolean> {
  encryptionInitializationFailed = false;
  encryptionInitPromise = null;
  return initializeEncryption();
}

/**
 * CRIT-001 FIX: Check if encryption is ready without triggering initialization
 */
export function isEncryptionReady(): boolean {
  return encryptionInitialized;
}

// CRIT-001 FIX: Start initialization but don't block module load
// The app entry point MUST await ensureEncryptionReady() before rendering
initializeEncryption().catch((error) => {
  logger.error("Background encryption init failed:", error);
});

export { encryptionInitialized };

const SESSION_TIMEOUT = 3600 * 1000;
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

// HIGH-005 FIX: Track if we're currently handling session timeout to prevent infinite loops
let isHandlingSessionTimeout = false;

// HIGH-005 FIX: Actions that should bypass timeout checks
const BYPASS_TIMEOUT_ACTIONS = [
  'auth/secureLogout',
  'auth/logout',
  'auth/clearAuth',
  'persist/PERSIST',
  'persist/REHYDRATE',
  'persist/REGISTER',
  'persist/PURGE',
];

// HIGH-NEW-017 FIX: Proper type for middleware action
interface TypedAction {
  type: string;
  payload?: unknown;
}

// HIGH-NEW-017 FIX: Minimal state type for middleware (avoids circular dependency with RootState)
interface MiddlewareStateShape {
  auth?: {
    sessionExpiry?: number;
    lastActivity?: number;
    isAuthenticated?: boolean;
  };
}

const sessionTimeoutMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    const actionType = (action as TypedAction)?.type || '';

    // HIGH-005 FIX: Skip timeout checks for auth/persist actions and when already handling timeout
    if (
      isHandlingSessionTimeout ||
      BYPASS_TIMEOUT_ACTIONS.some(type => actionType.startsWith(type))
    ) {
      return next(action);
    }

    // Check timeout BEFORE processing action
    // HIGH-NEW-017 FIX: Use proper type instead of any
    const state = store.getState() as MiddlewareStateShape;
    const { sessionExpiry, lastActivity, isAuthenticated } = state.auth || {};

    if (isAuthenticated) {
      const now = Date.now();

      // Session expiry check - trigger logout if expired
      if (sessionExpiry && now > sessionExpiry) {
        isHandlingSessionTimeout = true;
        try {
          store.dispatch({ type: "auth/sessionExpired" });
        } finally {
          isHandlingSessionTimeout = false;
        }
        // CRIT-003 FIX: Still process the action after dispatching session expired
        // This prevents user data loss - the action will be processed and the
        // sessionExpired handler will handle the logout flow
        return next(action);
      }

      // Inactivity timeout check - trigger logout if inactive too long
      if (lastActivity && now - lastActivity > INACTIVITY_TIMEOUT) {
        isHandlingSessionTimeout = true;
        try {
          store.dispatch({ type: "auth/inactivityTimeout" });
        } finally {
          isHandlingSessionTimeout = false;
        }
        // CRIT-003 FIX: Still process the action after dispatching inactivity timeout
        // This prevents user data loss - the action will be processed and the
        // inactivityTimeout handler will handle the logout flow
        return next(action);
      }
    }

    // Process action after timeout checks pass
    const result = next(action);

    // Update last activity timestamp for relevant user actions (after action processed)
    // HIGH-005 FIX: Check isAuthenticated from fresh state after action
    // HIGH-NEW-017 FIX: Use proper type instead of any
    const newState = store.getState() as MiddlewareStateShape;
    if (
      newState.auth?.isAuthenticated &&
      actionType &&
      (actionType.startsWith("mood/") ||
        actionType.startsWith("chat/") ||
        actionType.startsWith("user/") ||
        actionType.startsWith("assessment/"))
    ) {
      store.dispatch({
        type: "auth/updateLastActivity",
      });
    }

    return result;
  };

const rootReducer = combineReducers({
  auth: authSlice,
  chat: chatSlice,
  user: userSlice,
  assessment: assessmentSlice,
  mood: moodSlice,
  therapy: therapySlice,
});

// Define RootState type before using in persistConfig
type RootState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "user", "mood", "chat", "assessment"], // PHI data slices
  timeout: 10000,
  debug: __DEV__,
  // HIGH-NEW-017 NOTE: `as any` is acceptable here - redux-persist Transform generics
  // have known type compatibility issues with PersistConfig. The transform itself is
  // type-safe internally. See: https://github.com/rt2zz/redux-persist/issues/1140
  transforms: [encryptionTransform as any], // AES-256 encryption for HIPAA compliance
  migrate: (state: any) => {
    if (state) {
      logger.info("🔄 Migrating persisted state with encryption");
    }
    return Promise.resolve(state);
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PURGE",
        ],
        ignoredPaths: ["auth.lastActivity", "auth.sessionExpiry"],
      },
      immutableCheck: { warnAfter: 128 },
    }).concat(sessionTimeoutMiddleware),
});

export const persistor = persistStore(store, null, () => {
  if (__DEV__) {
    logger.info("Redux store rehydration complete with encryption");
  }
});

// Export encryption service for manual encryption needs
export { encryptionService };

// TypeScript type exports (RootState already defined above)
export type { RootState };
export type AppDispatch = typeof store.dispatch;
