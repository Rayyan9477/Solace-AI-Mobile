import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

// Import slices
import assessmentSlice from "./slices/assessmentSlice";
import authSlice from "./slices/authSlice";
import chatSlice from "./slices/chatSlice";
import moodSlice from "./slices/moodSlice";
import therapySlice from "./slices/therapySlice";
import userSlice from "./slices/userSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "user"], // Persist only essential state
  timeout: 10000, // 10 seconds - increased from 3s for slower devices
  debug: __DEV__, // Enable debug in development
  // Handle migration errors gracefully
  migrate: (state: any) => {
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
        // Ignore these paths in state for serialization checks
        ignoredPaths: ["auth.lastActivity"],
      },
      // Increase immutability check threshold for better performance
      immutableCheck: { warnAfter: 128 },
    }),
});

export const persistor = persistStore(store, null, () => {
  if (__DEV__) {
    console.log('✅ Redux store rehydration complete');
  }
});

// For TypeScript projects, uncomment these type exports:
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
