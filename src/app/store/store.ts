import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, combineReducers, Middleware, UnknownAction } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import encryptionTransform from "./transforms/encryptionTransform";
import encryptionService from "@shared/utils/encryption";

import assessmentSlice from "./slices/assessmentSlice";
import authSlice from "./slices/authSlice";
import chatSlice from "./slices/chatSlice";
import moodSlice from "./slices/moodSlice";
import therapySlice from "./slices/therapySlice";
import userSlice from "./slices/userSlice";

// TypeScript type declarations
declare const __DEV__: boolean;

// Initialize encryption service on app startup
(async () => {
  try {
    await encryptionService.initialize();
    console.log('✅ Encryption service initialized - HIPAA compliant');
  } catch (error) {
    console.error('❌ Encryption service initialization failed:', error);
  }
})();

const SESSION_TIMEOUT = 3600 * 1000;
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

const sessionTimeoutMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const result = next(action);

  const state = store.getState() as any;
  const { sessionExpiry, lastActivity, isAuthenticated } = state.auth;

  if (isAuthenticated && (action as any).type !== 'auth/secureLogout/pending') {
    const now = Date.now();

    if (sessionExpiry && now > sessionExpiry) {
      store.dispatch({ type: 'auth/secureLogout/pending' });
      return result;
    }

    if (lastActivity && (now - lastActivity) > INACTIVITY_TIMEOUT) {
      store.dispatch({ type: 'auth/secureLogout/pending' });
      return result;
    }

    if ((action as any).type && (
      (action as any).type.startsWith('mood/') ||
      (action as any).type.startsWith('chat/') ||
      (action as any).type.startsWith('user/') ||
      (action as any).type.startsWith('assessment/')
    )) {
      store.dispatch({
        type: 'auth/updateLastActivity',
      });
    }
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
      console.log('🔄 Migrating persisted state with encryption');
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
    console.log('✅ Redux store rehydration complete with encryption');
  }
});

// Export encryption service for manual encryption needs
export { encryptionService };

// TypeScript type exports (RootState already defined above)
export type { RootState };
export type AppDispatch = typeof store.dispatch;
