import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import apiService from "@/services/api";

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      // Real API call using the user service
      const updatedProfile = await apiService.user.updateProfile(profileData);
      return updatedProfile;
    } catch (error) {
      console.error("Profile update error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile. Please try again.",
      );
    }
  },
);

// Async thunk for fetching user stats
export const fetchUserStats = createAsyncThunk(
  "user/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      // Real API call using the user service
      const userStats = await apiService.user.getStats();
      return userStats;
    } catch (error) {
      console.error("User stats fetch error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch user statistics. Please try again.",
      );
    }
  },
);

const initialState = {
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
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setTheme: (state, action) => {
      state.preferences.theme = action.payload;
    },
    addGoal: (state, action) => {
      state.goals.push({
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        completed: false,
      });
    },
    updateGoal: (state, action) => {
      const { id, ...updates } = action.payload;
      const goalIndex = state.goals.findIndex((goal) => goal.id === id);
      if (goalIndex !== -1) {
        state.goals[goalIndex] = { ...state.goals[goalIndex], ...updates };
      }
    },
    deleteGoal: (state, action) => {
      state.goals = state.goals.filter((goal) => goal.id !== action.payload);
    },
    addAchievement: (state, action) => {
      state.achievements.push({
        id: Date.now().toString(),
        ...action.payload,
        earnedAt: new Date().toISOString(),
      });
    },
    clearUserError: (state) => {
      state.error = null;
    },
    resetUserState: (state) => {
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
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
