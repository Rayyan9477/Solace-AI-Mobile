import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, combineReducers, Middleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

import assessmentSlice from "./slices/assessmentSlice";
import authSlice from "./slices/authSlice";
import chatSlice from "./slices/chatSlice";
import moodSlice from "./slices/moodSlice";
import therapySlice from "./slices/therapySlice";
import userSlice from "./slices/userSlice";

const SESSION_TIMEOUT = 3600 * 1000;
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

const sessionTimeoutMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);

  const state = store.getState();
  const { sessionExpiry, lastActivity, isAuthenticated } = state.auth;

  if (isAuthenticated && action.type !== 'auth/secureLogout/pending') {
    const now = Date.now();

    if (sessionExpiry && now > sessionExpiry) {
      store.dispatch({ type: 'auth/secureLogout/pending' });
      return result;
    }

    if (lastActivity && (now - lastActivity) > INACTIVITY_TIMEOUT) {
      store.dispatch({ type: 'auth/secureLogout/pending' });
      return result;
    }

    if (action.type && (
      action.type.startsWith('mood/') ||
      action.type.startsWith('chat/') ||
      action.type.startsWith('user/') ||
      action.type.startsWith('assessment/')
    )) {
      store.dispatch({
        type: 'auth/updateLastActivity',
      });
    }
  }

  return result;
};

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "user", "mood"],
  timeout: 10000,
  debug: __DEV__,
  migrate: (state) => {
    return Promise.resolve(state);
  },
};

const rootReducer = combineReducers({
  auth: authSlice,
  chat: chatSlice,
  user: userSlice,
  assessment: assessmentSlice,
  mood: moodSlice,
  therapy: therapySlice,
});

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
    console.log('✅ Redux store rehydration complete');
  }
});

// For TypeScript projects, uncomment these type exports:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
