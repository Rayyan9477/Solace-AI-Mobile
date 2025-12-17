import { logger } from "@shared/utils/logger";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import moodStorageService from "../../../features/mood/services/moodStorageService";

// TypeScript type declarations
declare const __DEV__: boolean;

// Interfaces
interface MoodEntry {
  id?: string;
  mood: string;
  notes?: string;
  intensity: number;
  activities?: string[];
  timestamp: string | number;
  createdAt?: string;
  // MED-006 FIX: Add timezone metadata for accurate date/time interpretation
  timezone?: string;           // IANA timezone string (e.g., "America/New_York")
  timezoneOffset?: number;     // UTC offset in minutes (e.g., -300 for EST)
}

interface WeeklyStats {
  averageIntensity: number;
  mostCommonMood: string | null;
  totalEntries: number;
}

interface Insight {
  id: string;
  type: string;
  title: string;
  message: string;
  icon: string;
}

interface MoodState {
  currentMood: string | null;
  moodHistory: MoodEntry[];
  weeklyStats: WeeklyStats;
  insights: Insight[];
  loading: boolean;
  error: string | null;
}

// Forward declarations for helper functions
const calculateWeeklyStats = (moodHistory: MoodEntry[]): WeeklyStats => {
  // Filter entries from last 7 days (not last 7 entries!)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentEntries = moodHistory.filter((entry: MoodEntry) => {
    const entryTime =
      typeof entry.timestamp === "string"
        ? new Date(entry.timestamp).getTime()
        : entry.timestamp;
    return entryTime >= sevenDaysAgo;
  });

  if (recentEntries.length === 0) {
    return {
      averageIntensity: 0,
      mostCommonMood: null,
      totalEntries: 0,
    };
  }

  const avgIntensity =
    recentEntries.reduce(
      (sum: number, entry: MoodEntry) => sum + entry.intensity,
      0,
    ) / recentEntries.length;

  const moodCounts = recentEntries.reduce(
    (counts: Record<string, number>, entry: MoodEntry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      return counts;
    },
    {} as Record<string, number>,
  );

  const moodEntries = Object.entries(moodCounts);
  const mostCommon = moodEntries.length
    ? moodEntries.reduce(
        (a, b) => (moodCounts[a[0]] > moodCounts[b[0]] ? a : b),
        moodEntries[0],
      )[0]
    : null;

  return {
    averageIntensity: Math.round(avgIntensity * 10) / 10,
    mostCommonMood: mostCommon,
    totalEntries: recentEntries.length,
  };
};

const generateInsights = (
  weeklyStats: WeeklyStats,
  moodHistory: MoodEntry[] = [],
): Insight[] => {
  const insights: Insight[] = [];

  // Generate insights based on mood patterns
  if (weeklyStats.averageIntensity > 4) {
    insights.push({
      id: "positive-trend",
      type: "positive",
      title: "Great Progress!",
      message: "Your mood has been consistently positive this week.",
      icon: "🌟",
    });
  } else if (weeklyStats.averageIntensity < 2) {
    insights.push({
      id: "low-mood",
      type: "suggestion",
      title: "Self-Care Reminder",
      message:
        "Consider trying some relaxation techniques or speaking with a professional.",
      icon: "🧘",
    });
  }

  // Check for anxiety patterns in recent entries
  const recentEntries = moodHistory.slice(-7);
  const hasAnxiety = recentEntries.some(
    (entry) => (entry.mood || "").toLowerCase() === "anxious",
  );

  if (hasAnxiety) {
    insights.push({
      id: "anxiety-pattern",
      type: "suggestion",
      title: "Anxiety Management",
      message: "Try deep breathing exercises or progressive muscle relaxation.",
      icon: "🫁",
    });
  }

  return insights;
};

// API service using local storage for mood tracking
const apiService = {
  mood: {
    async logMood(data: Partial<MoodEntry>): Promise<MoodEntry> {
      if (__DEV__) {
        logger.debug("Logging mood to local storage:", data);
      }

      // MED-006 FIX: Include timezone metadata for accurate date/time analytics
      const now = new Date();
      const moodEntry: MoodEntry = {
        id: data.id || Date.now().toString(),
        mood: data.mood || "",
        intensity: data.intensity || 3,
        timestamp: data.timestamp || now.toISOString(),
        notes: data.notes,
        activities: data.activities,
        createdAt: now.toISOString(),
        // MED-006 FIX: Store timezone info for cross-timezone accuracy
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: data.timezoneOffset ?? now.getTimezoneOffset(),
      };

      // Save to local storage
      const savedEntry = await moodStorageService.saveMoodEntry(moodEntry);

      // Also save updated stats
      const history = await moodStorageService.getMoodHistory();
      const stats = calculateWeeklyStats(history);
      await moodStorageService.saveWeeklyStats(stats);

      // Generate and save insights
      const insights = generateInsights(stats, history);
      await moodStorageService.saveInsights(insights);

      return savedEntry;
    },

    async getMoodHistory(): Promise<MoodEntry[]> {
      if (__DEV__) {
        logger.debug("Fetching mood history from local storage");
      }
      return await moodStorageService.getMoodHistory();
    },
  },
};

// Async thunk for logging mood
export const logMood = createAsyncThunk<
  MoodEntry,
  { mood: string; notes?: string; intensity: number; activities?: string[] },
  { rejectValue: string }
>(
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
      if (__DEV__) {
        logger.error("Mood logging error:", error);
      }
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to log mood. Please try again.";
      return rejectWithValue(errorMessage);
    }
  },
);

// Async thunk for fetching mood history
export const fetchMoodHistory = createAsyncThunk<
  MoodEntry[],
  { startDate?: string; endDate?: string } | void,
  { rejectValue: string }
>("mood/fetchMoodHistory", async (params = {}, { rejectWithValue }) => {
  try {
    // Real API call using the mood service
    const moodHistory = await apiService.mood.getMoodHistory();
    return moodHistory;
  } catch (error) {
    if (__DEV__) {
      logger.error("Mood history fetch error:", error);
    }
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to fetch mood history. Please try again.";
    return rejectWithValue(errorMessage);
  }
});

// Async thunk for initializing mood data from local storage
export const initializeMoodData = createAsyncThunk<
  {
    history: MoodEntry[];
    stats: WeeklyStats;
    insights: Insight[];
  },
  void,
  { rejectValue: string }
>("mood/initializeData", async (_, { rejectWithValue }) => {
  try {
    if (__DEV__) {
      logger.debug("Initializing mood data from local storage");
    }

    const data = await moodStorageService.getAllMoodData();

    return {
      history: data.history,
      stats: data.stats,
      insights: data.insights,
    };
  } catch (error) {
    if (__DEV__) {
      logger.error("Mood data initialization error:", error);
    }
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to initialize mood data.";
    return rejectWithValue(errorMessage);
  }
});

const initialState: MoodState = {
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
    setCurrentMood: (state, action: PayloadAction<string>) => {
      state.currentMood = action.payload;
    },
    clearMoodError: (state) => {
      state.error = null;
    },
    updateWeeklyStats: (state) => {
      state.weeklyStats = calculateWeeklyStats(state.moodHistory);
    },
    updateInsights: (state) => {
      state.insights = generateInsights(state.weeklyStats, state.moodHistory);
    },
    addMoodToHistory: (state, action: PayloadAction<Partial<MoodEntry>>) => {
      const entry: MoodEntry = {
        mood:
          action.payload.mood ||
          (typeof action.payload === "string" ? action.payload : ""),
        intensity: action.payload.intensity || 3,
        timestamp: action.payload.timestamp || Date.now(),
        notes: action.payload.notes,
        activities: action.payload.activities,
      };
      state.moodHistory.unshift(entry);
      state.currentMood = entry.mood;
      state.weeklyStats = calculateWeeklyStats(state.moodHistory);
      state.insights = generateInsights(state.weeklyStats, state.moodHistory);
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
        if (action.payload) {
          // MED-003 FIX: Improved duplicate detection
          // Check by ID first (most reliable), then by timestamp + mood combination
          const existingIndex = state.moodHistory.findIndex((entry) => {
            // If both have IDs, compare IDs (most reliable)
            if (entry.id && action.payload.id) {
              return entry.id === action.payload.id;
            }
            // If no IDs, check timestamp + mood + intensity combination
            // This prevents collision from same-millisecond entries
            return (
              entry.timestamp === action.payload.timestamp &&
              entry.mood === action.payload.mood &&
              entry.intensity === action.payload.intensity
            );
          });
          if (existingIndex === -1) {
            state.moodHistory.unshift(action.payload);
          } else {
            // MED-003 FIX: Update existing entry instead of silently ignoring
            state.moodHistory[existingIndex] = action.payload;
          }
          state.currentMood = action.payload.mood;
          state.weeklyStats = calculateWeeklyStats(state.moodHistory);
          state.insights = generateInsights(
            state.weeklyStats,
            state.moodHistory,
          );
        }
      })
      .addCase(logMood.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchMoodHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.moodHistory = action.payload;
        state.weeklyStats = calculateWeeklyStats(state.moodHistory);
        state.insights = generateInsights(state.weeklyStats, state.moodHistory);
      })
      .addCase(fetchMoodHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(initializeMoodData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeMoodData.fulfilled, (state, action) => {
        state.loading = false;
        state.moodHistory = action.payload.history;
        state.weeklyStats = action.payload.stats;
        state.insights = action.payload.insights;
        if (action.payload.history.length > 0) {
          state.currentMood = action.payload.history[0].mood;
        }
      })
      .addCase(initializeMoodData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
        // Initialize with empty data on error
        state.moodHistory = [];
        state.weeklyStats = {
          averageIntensity: 0,
          mostCommonMood: null,
          totalEntries: 0,
        };
        state.insights = [];
      });
  },
});

export const {
  setCurrentMood,
  clearMoodError,
  updateWeeklyStats,
  updateInsights,
} = moodSlice.actions;

export { apiService, calculateWeeklyStats, generateInsights };

export default moodSlice.reducer;
