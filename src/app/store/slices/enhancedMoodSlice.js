import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Enhanced mood tracking with offline support and advanced analytics

// Async thunk for logging mood with offline queue
export const logMoodOptimistic = createAsyncThunk(
  "enhancedMood/logMoodOptimistic",
  async (moodData, { dispatch, rejectWithValue, getState }) => {
    try {
      // Generate unique ID
      const moodEntry = {
        id: Date.now().toString(),
        ...moodData,
        timestamp: new Date().toISOString(),
        synced: false, // Mark as not synced initially
      };

      // Optimistic update - add immediately to store
      dispatch(addMoodEntryOptimistic(moodEntry));

      try {
        // Attempt to sync with server
        const response = await syncMoodToServer(moodEntry);

        // Mark as synced if successful
        dispatch(markMoodSynced({ id: moodEntry.id, serverData: response }));

        return { ...moodEntry, synced: true };
      } catch (syncError) {
        // If sync fails, add to offline queue
        dispatch(addToOfflineQueue(moodEntry));
        console.warn("Mood sync failed, added to offline queue:", syncError);

        return moodEntry; // Return unsynced entry
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Mock API functions (replace with actual API calls)
const syncMoodToServer = async (moodEntry) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate occasional failures for testing
  if (Math.random() < 0.1) {
    throw new Error("Network error");
  }

  return {
    ...moodEntry,
    serverId: `server_${Date.now()}`,
    synced: true,
  };
};

const initialState = {
  // Core mood data
  currentMood: null,
  moodHistory: [],
  offlineQueue: [],

  // UI flow state expected by integration tests
  currentStep: 1, // 1-indexed in tests
  selectedMood: null,
  intensity: 5,
  activities: [],
  notes: "",
  triggers: [],
  isSubmitting: false,

  // Analytics and insights
  weeklyStats: {
    averageIntensity: 0,
    mostCommonMood: null,
    totalEntries: 0,
    moodVariety: 0,
  },
  monthlyStats: {
    averageIntensity: 0,
    moodDistribution: {},
    improvementTrend: 0,
  },
  insights: [],
  patterns: [],
  recommendations: [],

  // Personalization
  preferences: {
    reminderFrequency: "daily",
    preferredMoods: [],
    triggerKeywords: [],
    goalMood: "calm",
  },

  // State management
  loading: false,
  error: null,
  syncStatus: "idle", // idle, syncing, success, failed
  lastSyncTime: null,
  cacheValid: false,
};

const enhancedMoodSlice = createSlice({
  name: "enhancedMood",
  initialState,
  reducers: {
    // Simple UI state setters used by tests
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setSelectedMood: (state, action) => {
      state.selectedMood = action.payload;
      state.currentMood = action.payload;
    },
    setIntensity: (state, action) => {
      state.intensity = action.payload;
    },
    toggleActivity: (state, action) => {
      const id = action.payload;
      if (state.activities.includes(id)) {
        state.activities = state.activities.filter((a) => a !== id);
      } else {
        state.activities.push(id);
      }
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    toggleTrigger: (state, action) => {
      const id = action.payload;
      if (state.triggers.includes(id)) {
        state.triggers = state.triggers.filter((t) => t !== id);
      } else {
        state.triggers.push(id);
      }
    },
    // Optimistic updates
    addMoodEntryOptimistic: (state, action) => {
      state.moodHistory.unshift(action.payload);
      state.currentMood = action.payload.mood;
    },

    // Sync management
    markMoodSynced: (state, action) => {
      const { id, serverData } = action.payload;
      const entryIndex = state.moodHistory.findIndex(
        (entry) => entry.id === id,
      );

      if (entryIndex !== -1) {
        state.moodHistory[entryIndex] = {
          ...state.moodHistory[entryIndex],
          ...serverData,
        };
      }
    },

    addToOfflineQueue: (state, action) => {
      if (!state.offlineQueue.find((entry) => entry.id === action.payload.id)) {
        state.offlineQueue.push(action.payload);
      }
    },

    removeFromOfflineQueue: (state, action) => {
      const idsToRemove = action.payload;
      state.offlineQueue = state.offlineQueue.filter(
        (entry) => !idsToRemove.includes(entry.id),
      );
    },

    // Clear error state
    clearMoodError: (state) => {
      state.error = null;
    },

    // Update sync status
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload;
      if (action.payload === "success") {
        state.lastSyncTime = new Date().toISOString();
      }
    },

    // Update preferences
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
  },

  extraReducers: (builder) => {
    builder
      // Enhanced mood logging
      .addCase(logMoodOptimistic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logMoodOptimistic.fulfilled, (state, action) => {
        state.loading = false;
        // Entry already added optimistically
      })
      .addCase(logMoodOptimistic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Rollback optimistic update if needed
      });
  },
});

export const {
  setCurrentStep,
  setSelectedMood,
  setIntensity,
  toggleActivity,
  setNotes,
  toggleTrigger,
  addMoodEntryOptimistic,
  markMoodSynced,
  addToOfflineQueue,
  removeFromOfflineQueue,
  clearMoodError,
  setSyncStatus,
  updatePreferences,
} = enhancedMoodSlice.actions;

export default enhancedMoodSlice.reducer;

// Export the slice object for bridge imports
export { enhancedMoodSlice };
