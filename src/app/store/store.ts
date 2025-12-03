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

// CRIT-002 FIX: Promise-based encryption initialization to prevent race conditions
let encryptionInitialized = false;
let encryptionInitPromise: Promise<boolean> | null = null;

/**
 * Initialize encryption service with proper async handling
 * Returns a promise that resolves when encryption is ready
 * Multiple calls will return the same promise (idempotent)
 */
export async function initializeEncryption(): Promise<boolean> {
  // If already initialized, return immediately
  if (encryptionInitialized) {
    return true;
  }

  // If initialization is in progress, wait for it
  if (encryptionInitPromise) {
    return encryptionInitPromise;
  }

  // Start initialization
  encryptionInitPromise = (async () => {
    try {
      await encryptionService.initialize();
      encryptionInitialized = true;
      logger.info("Encryption service initialized successfully");
      return true;
    } catch (error) {
      logger.error("Encryption service initialization failed:", error);
      logger.warn("App will continue without encryption - HIPAA compliance at risk");
      encryptionInitialized = false;
      return false;
    }
  })();

  return encryptionInitPromise;
}

/**
 * Wait for encryption to be ready before performing sensitive operations
 * Use this before any HIPAA-sensitive data operations
 */
export async function ensureEncryptionReady(): Promise<boolean> {
  if (encryptionInitialized) return true;
  return initializeEncryption();
}

// Start initialization immediately but don't block
initializeEncryption();

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

const sessionTimeoutMiddleware: Middleware =
  (store) => (next) => (action: unknown) => {
    const actionType = (action as any)?.type || '';

    // HIGH-005 FIX: Skip timeout checks for auth/persist actions and when already handling timeout
    if (
      isHandlingSessionTimeout ||
      BYPASS_TIMEOUT_ACTIONS.some(type => actionType.startsWith(type))
    ) {
      return next(action);
    }

    // Check timeout BEFORE processing action
    const state = store.getState() as any;
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
        return; // Don't process the action
      }

      // Inactivity timeout check - trigger logout if inactive too long
      if (lastActivity && now - lastActivity > INACTIVITY_TIMEOUT) {
        isHandlingSessionTimeout = true;
        try {
          store.dispatch({ type: "auth/inactivityTimeout" });
        } finally {
          isHandlingSessionTimeout = false;
        }
        return; // Don't process the action
      }
    }

    // Process action after timeout checks pass
    const result = next(action);

    // Update last activity timestamp for relevant user actions (after action processed)
    // HIGH-005 FIX: Check isAuthenticated from fresh state after action
    const newState = store.getState() as any;
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
