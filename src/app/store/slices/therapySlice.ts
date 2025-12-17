import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// TypeScript interfaces
interface TherapyMessage {
  id: string;
  timestamp: string;
  [key: string]: any;
}

interface ExerciseCompletion {
  exerciseId: string;
  completedAt: string;
  reflection?: string;
}

interface EmergencyContact {
  id: string;
  [key: string]: any;
}

interface CrisisResource {
  name: string;
  number: string;
  description: string;
  type: string;
}

interface ProgressNote {
  timestamp: string;
  [key: string]: any;
}

interface Achievement {
  unlockedAt: string;
  [key: string]: any;
}

interface SessionData {
  sessionId: string | null;
  isActive: boolean;
  startTime: string | null;
  endTime: string | null;
  duration: number;
  messages: TherapyMessage[];
  exercisesCompleted: ExerciseCompletion[];
  currentExercise: string | null;
  interactionMode: string;
  mood: string | null;
  tags: string[];
  notes: string;
  isPaused?: boolean;
}

interface SessionSummary {
  sessionId: string;
  startTime: string;
  endTime: string;
  duration: number;
  messageCount: number;
  exercisesCompleted: ExerciseCompletion[];
  mood: string | null;
  tags: string[];
}

interface TherapyPreferences {
  preferredInteractionMode: string;
  enableVoiceRecording: boolean;
  sessionReminders: boolean;
  reminderTime: string;
  emergencyContacts: EmergencyContact[];
  crisisResources: CrisisResource[];
  dataRetention: number;
  shareDataForResearch: boolean;
}

interface TherapyInsights {
  totalSessions: number;
  totalDuration: number;
  averageSessionLength: number;
  mostUsedExercises: any[];
  moodTrends: any[];
  progressNotes: ProgressNote[];
  achievements: Achievement[];
}

interface TherapyState {
  currentSession: SessionData;
  sessionHistory: SessionSummary[];
  preferences: TherapyPreferences;
  insights: TherapyInsights;
  loading: boolean;
  error: string | null;
  sessionSaving: boolean;
  preferencesLoading: boolean;
}

// MED-005 FIX: Updated return type to include trimming metadata
interface SaveSessionResult {
  sessionData: SessionData;
  sessionSummary: SessionSummary;
  historyTrimmed: boolean;
  trimmedSessionCount: number;
}

// Async thunks for therapy session management
export const saveTherapySession = createAsyncThunk<
  SaveSessionResult,
  SessionData,
  { rejectValue: string }
>(
  "therapy/saveSession",
  async (sessionData: SessionData, { rejectWithValue }) => {
    try {
      const sessionKey = `therapy_session_${sessionData.sessionId}`;
      await AsyncStorage.setItem(sessionKey, JSON.stringify(sessionData));

      // Also update session history
      const historyKey = "therapy_session_history";
      const existingHistory = await AsyncStorage.getItem(historyKey);
      const history: SessionSummary[] = existingHistory
        ? JSON.parse(existingHistory)
        : [];

      const sessionSummary: SessionSummary = {
        sessionId: sessionData.sessionId || "",
        startTime: sessionData.startTime || "",
        endTime: sessionData.endTime || "",
        duration: sessionData.duration,
        messageCount: sessionData.messages?.length || 0,
        exercisesCompleted: sessionData.exercisesCompleted || [],
        mood: sessionData.mood,
        tags: sessionData.tags || [],
      };

      history.unshift(sessionSummary);

      // MED-005 FIX: Log warning when trimming history and track trimmed count
      const MAX_HISTORY_SIZE = 50;
      let trimmedCount = 0;

      if (history.length > MAX_HISTORY_SIZE) {
        trimmedCount = history.length - MAX_HISTORY_SIZE;
        logger.warn(
          `[TherapySlice] Trimming therapy history from ${history.length} to ${MAX_HISTORY_SIZE} sessions. ` +
          `${trimmedCount} oldest session(s) will be removed from history (session data files are preserved).`
        );
      }

      const trimmedHistory = history.slice(0, MAX_HISTORY_SIZE);
      await AsyncStorage.setItem(historyKey, JSON.stringify(trimmedHistory));

      // MED-005 FIX: Return metadata about trimming for UI awareness
      return {
        sessionData,
        sessionSummary,
        historyTrimmed: trimmedCount > 0,
        trimmedSessionCount: trimmedCount,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save session";
      return rejectWithValue(errorMessage);
    }
  },
);

export const loadTherapySession = createAsyncThunk<
  SessionData | null,
  string,
  { rejectValue: string }
>("therapy/loadSession", async (sessionId: string, { rejectWithValue }) => {
  try {
    const sessionKey = `therapy_session_${sessionId}`;
    const sessionData = await AsyncStorage.getItem(sessionKey);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load session";
    return rejectWithValue(errorMessage);
  }
});

export const loadTherapyHistory = createAsyncThunk<
  SessionSummary[],
  void,
  { rejectValue: string }
>("therapy/loadHistory", async (_, { rejectWithValue }) => {
  try {
    const historyKey = "therapy_session_history";
    const historyData = await AsyncStorage.getItem(historyKey);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load history";
    return rejectWithValue(errorMessage);
  }
});

export const saveTherapyPreferences = createAsyncThunk<
  TherapyPreferences,
  Partial<TherapyPreferences>,
  { rejectValue: string }
>(
  "therapy/savePreferences",
  async (preferences: Partial<TherapyPreferences>, { rejectWithValue }) => {
    try {
      const preferencesKey = "therapy_preferences";
      await AsyncStorage.setItem(preferencesKey, JSON.stringify(preferences));
      return preferences as TherapyPreferences;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save preferences";
      return rejectWithValue(errorMessage);
    }
  },
);

export const loadTherapyPreferences = createAsyncThunk<
  Partial<TherapyPreferences> | null,
  void,
  { rejectValue: string }
>("therapy/loadPreferences", async (_, { rejectWithValue }) => {
  try {
    const preferencesKey = "therapy_preferences";
    const preferencesData = await AsyncStorage.getItem(preferencesKey);
    return preferencesData ? JSON.parse(preferencesData) : null;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load preferences";
    return rejectWithValue(errorMessage);
  }
});

// Initial state
const initialState: TherapyState = {
  // Current session state
  currentSession: {
    sessionId: null,
    isActive: false,
    startTime: null,
    endTime: null,
    duration: 0,
    messages: [],
    exercisesCompleted: [],
    currentExercise: null,
    interactionMode: "text", // 'text', 'voice', 'guided'
    mood: null,
    tags: [],
    notes: "",
    isPaused: false,
  },

  // Session history
  sessionHistory: [],

  // User preferences
  preferences: {
    preferredInteractionMode: "text",
    enableVoiceRecording: true,
    sessionReminders: true,
    reminderTime: "19:00", // 7 PM default
    emergencyContacts: [],
    crisisResources: [
      {
        name: "988 Suicide & Crisis Lifeline",
        number: "988",
        description: "24/7 suicide prevention and crisis support",
        type: "crisis",
      },
      {
        name: "Crisis Text Line",
        number: "741741",
        description: "Text HOME to 741741 for crisis support",
        type: "text",
      },
    ],
    dataRetention: 90, // days
    shareDataForResearch: false,
  },

  // Therapy insights and progress
  insights: {
    totalSessions: 0,
    totalDuration: 0, // in minutes
    averageSessionLength: 0,
    mostUsedExercises: [],
    moodTrends: [],
    progressNotes: [],
    achievements: [],
  },

  // App state
  loading: false,
  error: null,
  sessionSaving: false,
  preferencesLoading: false,
};

// Therapy slice
const therapySlice = createSlice({
  name: "therapy",
  initialState,
  reducers: {
    // Session management
    startSession: (
      state,
      action: PayloadAction<{ sessionId: string; startTime: string }>,
    ) => {
      const { sessionId, startTime } = action.payload;
      state.currentSession = {
        ...initialState.currentSession,
        sessionId,
        isActive: true,
        startTime,
        messages: [],
        exercisesCompleted: [],
      };
      state.error = null;
    },

    endSession: (
      state,
      action: PayloadAction<{
        endTime?: string;
        mood?: string;
        notes?: string;
      }>,
    ) => {
      const { endTime, mood, notes } = action.payload || {};
      if (state.currentSession.isActive) {
        state.currentSession.isActive = false;
        state.currentSession.endTime = endTime || new Date().toISOString();

        // HIGH-005 FIX: Validate dates before calculating duration to prevent NaN
        // new Date("") creates Invalid Date, and getTime() returns NaN
        const endTimeDate = new Date(state.currentSession.endTime);
        const startTimeStr = state.currentSession.startTime;

        // Only calculate duration if we have a valid startTime
        if (startTimeStr && startTimeStr.length > 0) {
          const startTimeDate = new Date(startTimeStr);

          // Verify both dates are valid before calculating
          if (!isNaN(endTimeDate.getTime()) && !isNaN(startTimeDate.getTime())) {
            state.currentSession.duration = Math.floor(
              (endTimeDate.getTime() - startTimeDate.getTime()) / 1000,
            );
          } else {
            // HIGH-005 FIX: Default to 0 instead of NaN if dates are invalid
            state.currentSession.duration = 0;
          }
        } else {
          // No startTime available - default to 0
          state.currentSession.duration = 0;
        }

        if (mood) state.currentSession.mood = mood;
        if (notes) state.currentSession.notes = notes;
      }
    },

    pauseSession: (state) => {
      // For future implementation
      if (state.currentSession.isPaused !== undefined) {
        state.currentSession.isPaused = true;
      }
    },

    resumeSession: (state) => {
      // For future implementation
      if (state.currentSession.isPaused !== undefined) {
        state.currentSession.isPaused = false;
      }
    },

    // Message management
    addMessage: (state, action: PayloadAction<Partial<TherapyMessage>>) => {
      const message = action.payload;
      const newMessage: TherapyMessage = {
        id: message.id || Date.now().toString(),
        timestamp: message.timestamp || new Date().toISOString(),
        ...message,
      };
      state.currentSession.messages.push(newMessage);
    },

    updateMessage: (
      state,
      action: PayloadAction<{
        messageId: string;
        updates: Partial<TherapyMessage>;
      }>,
    ) => {
      const { messageId, updates } = action.payload;
      const messageIndex = state.currentSession.messages.findIndex(
        (m) => m.id === messageId,
      );
      if (messageIndex !== -1) {
        state.currentSession.messages[messageIndex] = {
          ...state.currentSession.messages[messageIndex],
          ...updates,
        };
      }
    },

    // Exercise management
    startExercise: (state, action: PayloadAction<string>) => {
      const exerciseId = action.payload;
      state.currentSession.currentExercise = exerciseId;
    },

    completeExercise: (
      state,
      action: PayloadAction<{
        exerciseId: string;
        completedAt?: string;
        reflection?: string;
      }>,
    ) => {
      const { exerciseId, completedAt, reflection } = action.payload;
      state.currentSession.exercisesCompleted.push({
        exerciseId,
        completedAt: completedAt || new Date().toISOString(),
        reflection,
      });
      state.currentSession.currentExercise = null;
    },

    // Interaction mode
    setInteractionMode: (state, action: PayloadAction<string>) => {
      state.currentSession.interactionMode = action.payload;
    },

    // Session metadata
    addSessionTag: (state, action: PayloadAction<string>) => {
      const tag = action.payload;
      if (!state.currentSession.tags.includes(tag)) {
        state.currentSession.tags.push(tag);
      }
    },

    removeSessionTag: (state, action: PayloadAction<string>) => {
      const tag = action.payload;
      state.currentSession.tags = state.currentSession.tags.filter(
        (t) => t !== tag,
      );
    },

    setSessionMood: (state, action: PayloadAction<string>) => {
      state.currentSession.mood = action.payload;
    },

    updateSessionNotes: (state, action: PayloadAction<string>) => {
      state.currentSession.notes = action.payload;
    },

    // Preferences
    updatePreferences: (
      state,
      action: PayloadAction<Partial<TherapyPreferences>>,
    ) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },

    addEmergencyContact: (state, action: PayloadAction<EmergencyContact>) => {
      state.preferences.emergencyContacts.push(action.payload);
    },

    removeEmergencyContact: (state, action: PayloadAction<string>) => {
      const contactId = action.payload;
      state.preferences.emergencyContacts =
        state.preferences.emergencyContacts.filter(
          (contact) => contact.id !== contactId,
        );
    },

    // Insights and progress
    updateInsights: (
      state,
      action: PayloadAction<Partial<TherapyInsights>>,
    ) => {
      state.insights = {
        ...state.insights,
        ...action.payload,
      };
    },

    addProgressNote: (state, action: PayloadAction<Partial<ProgressNote>>) => {
      const newNote: ProgressNote = {
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.insights.progressNotes.push(newNote);
    },

    addAchievement: (state, action: PayloadAction<Partial<Achievement>>) => {
      const newAchievement: Achievement = {
        unlockedAt: new Date().toISOString(),
        ...action.payload,
      };
      state.insights.achievements.push(newAchievement);
    },

    // Error handling
    clearError: (state) => {
      state.error = null;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Save session
      .addCase(saveTherapySession.pending, (state) => {
        state.sessionSaving = true;
        state.error = null;
      })
      .addCase(saveTherapySession.fulfilled, (state, action) => {
        state.sessionSaving = false;
        const { sessionSummary } = action.payload;
        // Add to history if not already there
        const existingIndex = state.sessionHistory.findIndex(
          (s) => s.sessionId === sessionSummary.sessionId,
        );
        if (existingIndex === -1) {
          state.sessionHistory.unshift(sessionSummary);
        } else {
          state.sessionHistory[existingIndex] = sessionSummary;
        }
        // Update insights
        state.insights.totalSessions = state.sessionHistory.length;
        state.insights.totalDuration = state.sessionHistory.reduce(
          (total, session) => total + (session.duration || 0),
          0,
        );
        state.insights.averageSessionLength =
          state.insights.totalDuration / state.insights.totalSessions;
      })
      .addCase(saveTherapySession.rejected, (state, action) => {
        state.sessionSaving = false;
        state.error = action.payload || null;
      })

      // Load session
      .addCase(loadTherapySession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTherapySession.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.currentSession = action.payload;
        }
      })
      .addCase(loadTherapySession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // Load history
      .addCase(loadTherapyHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadTherapyHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionHistory = action.payload;
        // Update insights
        state.insights.totalSessions = state.sessionHistory.length;
        state.insights.totalDuration = state.sessionHistory.reduce(
          (total, session) => total + (session.duration || 0),
          0,
        );
        if (state.insights.totalSessions > 0) {
          state.insights.averageSessionLength =
            state.insights.totalDuration / state.insights.totalSessions;
        }
      })
      .addCase(loadTherapyHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })

      // Preferences
      .addCase(saveTherapyPreferences.pending, (state) => {
        state.preferencesLoading = true;
        state.error = null;
      })
      .addCase(saveTherapyPreferences.fulfilled, (state, action) => {
        state.preferencesLoading = false;
        state.preferences = action.payload;
      })
      .addCase(saveTherapyPreferences.rejected, (state, action) => {
        state.preferencesLoading = false;
        state.error = action.payload || null;
      })

      .addCase(loadTherapyPreferences.pending, (state) => {
        state.preferencesLoading = true;
        state.error = null;
      })
      .addCase(loadTherapyPreferences.fulfilled, (state, action) => {
        state.preferencesLoading = false;
        if (action.payload) {
          state.preferences = {
            ...state.preferences,
            ...action.payload,
          };
        }
      })
      .addCase(loadTherapyPreferences.rejected, (state, action) => {
        state.preferencesLoading = false;
        state.error = action.payload || null;
      });
  },
});

// Export actions
export const {
  startSession,
  endSession,
  pauseSession,
  resumeSession,
  addMessage,
  updateMessage,
  startExercise,
  completeExercise,
  setInteractionMode,
  addSessionTag,
  removeSessionTag,
  setSessionMood,
  updateSessionNotes,
  updatePreferences,
  addEmergencyContact,
  removeEmergencyContact,
  updateInsights,
  addProgressNote,
  addAchievement,
  clearError,
  setError,
} = therapySlice.actions;

// RootState type for selectors
interface RootState {
  therapy: TherapyState;
}

// Selectors
export const selectCurrentSession = (state: RootState) =>
  state.therapy.currentSession;
export const selectSessionHistory = (state: RootState) =>
  state.therapy.sessionHistory;
export const selectTherapyPreferences = (state: RootState) =>
  state.therapy.preferences;
export const selectTherapyInsights = (state: RootState) =>
  state.therapy.insights;
export const selectTherapyLoading = (state: RootState) => state.therapy.loading;
export const selectTherapyError = (state: RootState) => state.therapy.error;
export const selectSessionSaving = (state: RootState) =>
  state.therapy.sessionSaving;
export const selectPreferencesLoading = (state: RootState) =>
  state.therapy.preferencesLoading;

// Computed selectors
export const selectIsSessionActive = (state: RootState) =>
  state.therapy.currentSession.isActive;
export const selectCurrentExercise = (state: RootState) =>
  state.therapy.currentSession.currentExercise;
export const selectInteractionMode = (state: RootState) =>
  state.therapy.currentSession.interactionMode;
export const selectSessionMessages = (state: RootState) =>
  state.therapy.currentSession.messages;
export const selectSessionDuration = (state: RootState): number => {
  const session = state.therapy.currentSession;
  if (!session.isActive || !session.startTime) return 0;
  const now = new Date();
  const startTime = new Date(session.startTime);
  return Math.floor((now.getTime() - startTime.getTime()) / 1000);
};

export default therapySlice.reducer;
