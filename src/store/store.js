import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

// Import slices
import assessmentSlice from "./slices/assessmentSlice";
import authSlice from "./slices/authSlice";
import chatSlice from "./slices/chatSlice";
import moodSlice from "./slices/moodSlice";
import userSlice from "./slices/userSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "user", "mood", "assessment"], // Only persist these reducers
};

const rootReducer = combineReducers({
  auth: authSlice,
  chat: chatSlice,
  user: userSlice,
  assessment: assessmentSlice,
  mood: moodSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

// For TypeScript projects, uncomment these type exports:
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
