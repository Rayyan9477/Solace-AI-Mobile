import { logger } from "@shared/utils/logger";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../../services/api";

// TypeScript type declarations
declare const __DEV__: boolean;

// Interfaces
interface UserProfile {
  id: string | null;
  name: string;
  email: string;
  avatar?: string | null;
  phoneNumber?: string;
  dateOfBirth?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  [key: string]: any;
}

interface UserStats {
  totalSessions: number;
  streakDays: number;
  assessmentsCompleted: number;
  moodEntriesCount: number;
  favoriteActivities: string[];
  joinDate: string | null;
}

interface Goal {
  id: string;
  createdAt: string;
  completed: boolean;
  [key: string]: any;
}

interface Achievement {
  id: string;
  earnedAt: string;
  [key: string]: any;
}

interface UserState {
  profile: UserProfile;
  preferences: {
    notifications: {
      moodReminders: boolean;
      chatMessages: boolean;
      assessmentDue: boolean;
      insights: boolean;
    };
    privacy: {
      shareData: boolean;
      analytics: boolean;
    };
    theme: string;
    language: string;
  };
  stats: UserStats;
  goals: Goal[];
  achievements: Achievement[];
  loading: boolean;
  error: string | null;
  _idCounter: number;
}

// Export apiService for testing purposes
export { apiService };

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk<
  Partial<UserProfile>,
  Partial<UserProfile>,
  { rejectValue: string }
>(
  "user/updateProfile",
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      // Real API call using the user service
      const updatedProfile = await apiService.user.updateProfile(profileData);
      return updatedProfile;
    } catch (error) {
      if (__DEV__) {
        logger.error("Profile update error:", error);
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again.";
      return rejectWithValue(errorMessage);
    }
  },
);

// Async thunk for fetching user stats
export const fetchUserStats = createAsyncThunk<
  UserStats,
  void,
  { rejectValue: string }
>("user/fetchStats", async (_, { rejectWithValue }) => {
  try {
    // Real API call using the user service
    const userStats = await apiService.user.getStats();
    return userStats;
  } catch (error) {
    if (__DEV__) {
      logger.error("User stats fetch error:", error);
    }
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch user statistics. Please try again.";
    return rejectWithValue(errorMessage);
  }
});

const initialState: UserState = {
  profile: {
    id: null,
    name: "",
    email: "",
    avatar: null,
    phoneNumber: "",
    dateOfBirth: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  },
  preferences: {
    notifications: {
      moodReminders: true,
      chatMessages: true,
      assessmentDue: true,
      insights: true,
    },
    privacy: {
      shareData: false,
      analytics: true,
    },
    theme: "light", // 'light' | 'dark' | 'system'
    language: "en",
  },
  stats: {
    totalSessions: 0,
    streakDays: 0,
    assessmentsCompleted: 0,
    moodEntriesCount: 0,
    favoriteActivities: [],
    joinDate: null,
  },
  goals: [],
  achievements: [],
  loading: false,
  error: null,
  _idCounter: 0, // For testing purposes to ensure unique IDs
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      const payload = action.payload || {};
      const { password, token, apiKey, ...safeData } = payload as any;
      state.profile = { ...state.profile, ...safeData };
    },
    updatePreferences: (
      state,
      action: PayloadAction<Partial<UserState["preferences"]>>,
    ) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.preferences.theme = action.payload;
    },
    addGoal: (state, action: PayloadAction<Partial<Goal>>) => {
      state._idCounter += 1;
      const newGoal: Goal = {
        id: `goal-${state._idCounter}`,
        createdAt: new Date().toISOString(),
        completed: false,
        ...action.payload,
      };
      state.goals.push(newGoal);
    },
    updateGoal: (
      state,
      action: PayloadAction<{ id: string; [key: string]: any }>,
    ) => {
      const { id, ...updates } = action.payload;
      const goalIndex = state.goals.findIndex((goal) => goal.id === id);
      if (goalIndex !== -1) {
        state.goals[goalIndex] = { ...state.goals[goalIndex], ...updates };
      }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((goal) => goal.id !== action.payload);
    },
    addAchievement: (state, action: PayloadAction<Partial<Achievement>>) => {
      state._idCounter += 1;
      const newAchievement: Achievement = {
        id: `achievement-${state._idCounter}`,
        earnedAt: new Date().toISOString(),
        ...action.payload,
      };
      state.achievements.push(newAchievement);
    },
    clearUserError: (state) => {
      state.error = null;
    },
    resetUserState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      });
  },
});

export const {
  setUserProfile,
  updatePreferences,
  setTheme,
  addGoal,
  updateGoal,
  deleteGoal,
  addAchievement,
  clearUserError,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
