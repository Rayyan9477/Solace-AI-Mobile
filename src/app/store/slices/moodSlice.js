import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import apiService from "@/services/api";

// Async thunk for logging mood
export const logMood = createAsyncThunk(
  "mood/logMood",
  async ({ mood, notes, intensity, activities }, { rejectWithValue }) => {
    try {
      // Real API call using the mood service
      const moodEntry = await apiService.mood.logMood({
        mood,
        notes,
        intensity,
        activities,
        timestamp: new Date().toISOString(),
      });

      return moodEntry;
    } catch (error) {
      console.error("Mood logging error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to log mood. Please try again.",
      );
    }
  },
);

// Async thunk for fetching mood history
export const fetchMoodHistory = createAsyncThunk(
  "mood/fetchMoodHistory",
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      // Real API call using the mood service
      const moodHistory = await apiService.mood.getMoodHistory(
        startDate,
        endDate,
      );
      return moodHistory;
    } catch (error) {
      console.error("Mood history fetch error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch mood history. Please try again.",
      );
    }
  },
);

const initialState = {
  currentMood: null,
  moodHistory: [],
  weeklyStats: {
    averageIntensity: 0,
    mostCommonMood: null,
    totalEntries: 0,
  },
  insights: [],
  loading: false,
  error: null,
};

const moodSlice = createSlice({
  name: "mood",
  initialState,
  reducers: {
    setCurrentMood: (state, action) => {
      state.currentMood = action.payload;
    },
    clearMoodError: (state) => {
      state.error = null;
    },
    updateWeeklyStats: (state) => {
      const recentEntries = state.moodHistory.slice(-7);

      if (recentEntries.length > 0) {
        const avgIntensity =
          recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) /
          recentEntries.length;
        const moodCounts = recentEntries.reduce((counts, entry) => {
          counts[entry.mood] = (counts[entry.mood] || 0) + 1;
          return counts;
        }, {});

        const mostCommon = Object.entries(moodCounts).reduce((a, b) =>
          moodCounts[a[0]] > moodCounts[b[0]] ? a : b,
        )[0];

        state.weeklyStats = {
          averageIntensity: Math.round(avgIntensity * 10) / 10,
          mostCommonMood: mostCommon,
          totalEntries: recentEntries.length,
        };
      }
    },
    generateInsights: (state) => {
      const insights = [];

      // Generate insights based on mood patterns
      if (state.weeklyStats.averageIntensity > 4) {
        insights.push({
          id: "positive-trend",
          type: "positive",
          title: "Great Progress!",
          message: "Your mood has been consistently positive this week.",
          icon: "🌟",
        });
      } else if (state.weeklyStats.averageIntensity < 2) {
        insights.push({
          id: "low-mood",
          type: "suggestion",
          title: "Self-Care Reminder",
          message:
            "Consider trying some relaxation techniques or speaking with a professional.",
          icon: "🧘",
        });
      }

      if (state.weeklyStats.mostCommonMood === "anxious") {
        insights.push({
          id: "anxiety-pattern",
          type: "suggestion",
          title: "Anxiety Management",
          message:
            "Try deep breathing exercises or progressive muscle relaxation.",
          icon: "🫁",
        });
      }

      state.insights = insights;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logMood.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logMood.fulfilled, (state, action) => {
        state.loading = false;
        state.moodHistory.unshift(action.payload);
        state.currentMood = action.payload.mood;
        moodSlice.caseReducers.updateWeeklyStats(state);
        moodSlice.caseReducers.generateInsights(state);
      })
      .addCase(logMood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMoodHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.moodHistory = action.payload;
        moodSlice.caseReducers.updateWeeklyStats(state);
        moodSlice.caseReducers.generateInsights(state);
      })
      .addCase(fetchMoodHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentMood,
  clearMoodError,
  updateWeeklyStats,
  generateInsights,
} = moodSlice.actions;

export default moodSlice.reducer;
