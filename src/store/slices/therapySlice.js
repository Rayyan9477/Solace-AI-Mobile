import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunks for therapy session management
export const saveTherapySession = createAsyncThunk(
  'therapy/saveSession',
  async (sessionData, { rejectWithValue }) => {
    try {
      const sessionKey = `therapy_session_${sessionData.sessionId}`;
      await AsyncStorage.setItem(sessionKey, JSON.stringify(sessionData));
      
      // Also update session history
      const historyKey = 'therapy_session_history';
      const existingHistory = await AsyncStorage.getItem(historyKey);
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      const sessionSummary = {
        sessionId: sessionData.sessionId,
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
        duration: sessionData.duration,
        messageCount: sessionData.messages?.length || 0,
        exercisesCompleted: sessionData.exercisesCompleted || [],
        mood: sessionData.mood,
        tags: sessionData.tags || [],
      };
      
      history.unshift(sessionSummary);
      // Keep only last 50 sessions
      const trimmedHistory = history.slice(0, 50);
      await AsyncStorage.setItem(historyKey, JSON.stringify(trimmedHistory));
      
      return { sessionData, sessionSummary };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadTherapySession = createAsyncThunk(
  'therapy/loadSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const sessionKey = `therapy_session_${sessionId}`;
      const sessionData = await AsyncStorage.getItem(sessionKey);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadTherapyHistory = createAsyncThunk(
  'therapy/loadHistory',
  async (_, { rejectWithValue }) => {
    try {
      const historyKey = 'therapy_session_history';
      const historyData = await AsyncStorage.getItem(historyKey);
      return historyData ? JSON.parse(historyData) : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveTherapyPreferences = createAsyncThunk(
  'therapy/savePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const preferencesKey = 'therapy_preferences';
      await AsyncStorage.setItem(preferencesKey, JSON.stringify(preferences));
      return preferences;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadTherapyPreferences = createAsyncThunk(
  'therapy/loadPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const preferencesKey = 'therapy_preferences';
      const preferencesData = await AsyncStorage.getItem(preferencesKey);
      return preferencesData ? JSON.parse(preferencesData) : null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
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
    interactionMode: 'text', // 'text', 'voice', 'guided'
    mood: null,
    tags: [],
    notes: '',
  },
  
  // Session history
  sessionHistory: [],
  
  // User preferences
  preferences: {
    preferredInteractionMode: 'text',
    enableVoiceRecording: true,
    sessionReminders: true,
    reminderTime: '19:00', // 7 PM default
    emergencyContacts: [],
    crisisResources: [
      {
        name: '988 Suicide & Crisis Lifeline',
        number: '988',
        description: '24/7 suicide prevention and crisis support',
        type: 'crisis'
      },
      {
        name: 'Crisis Text Line',
        number: '741741',
        description: 'Text HOME to 741741 for crisis support',
        type: 'text'
      }
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
  name: 'therapy',
  initialState,
  reducers: {
    // Session management
    startSession: (state, action) => {
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
    
    endSession: (state, action) => {
      const { endTime, mood, notes } = action.payload || {};
      if (state.currentSession.isActive) {
        state.currentSession.isActive = false;
        state.currentSession.endTime = endTime || new Date().toISOString();
        state.currentSession.duration = Math.floor(
          (new Date(state.currentSession.endTime) - new Date(state.currentSession.startTime)) / 1000
        );
        if (mood) state.currentSession.mood = mood;
        if (notes) state.currentSession.notes = notes;
      }
    },
    
    pauseSession: (state) => {
      // For future implementation
      state.currentSession.isPaused = true;
    },
    
    resumeSession: (state) => {
      // For future implementation
      state.currentSession.isPaused = false;
    },
    
    // Message management
    addMessage: (state, action) => {
      const message = action.payload;
      state.currentSession.messages.push({
        ...message,
        timestamp: message.timestamp || new Date().toISOString(),
      });
    },
    
    updateMessage: (state, action) => {
      const { messageId, updates } = action.payload;
      const messageIndex = state.currentSession.messages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        state.currentSession.messages[messageIndex] = {
          ...state.currentSession.messages[messageIndex],
          ...updates,
        };
      }
    },
    
    // Exercise management
    startExercise: (state, action) => {
      const exerciseId = action.payload;
      state.currentSession.currentExercise = exerciseId;
    },
    
    completeExercise: (state, action) => {
      const { exerciseId, completedAt, reflection } = action.payload;
      state.currentSession.exercisesCompleted.push({
        exerciseId,
        completedAt: completedAt || new Date().toISOString(),
        reflection,
      });
      state.currentSession.currentExercise = null;
    },
    
    // Interaction mode
    setInteractionMode: (state, action) => {
      state.currentSession.interactionMode = action.payload;
    },
    
    // Session metadata
    addSessionTag: (state, action) => {
      const tag = action.payload;
      if (!state.currentSession.tags.includes(tag)) {
        state.currentSession.tags.push(tag);
      }
    },
    
    removeSessionTag: (state, action) => {
      const tag = action.payload;
      state.currentSession.tags = state.currentSession.tags.filter(t => t !== tag);
    },
    
    setSessionMood: (state, action) => {
      state.currentSession.mood = action.payload;
    },
    
    updateSessionNotes: (state, action) => {
      state.currentSession.notes = action.payload;
    },
    
    // Preferences
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
    },
    
    addEmergencyContact: (state, action) => {
      state.preferences.emergencyContacts.push(action.payload);
    },
    
    removeEmergencyContact: (state, action) => {
      const contactId = action.payload;
      state.preferences.emergencyContacts = state.preferences.emergencyContacts.filter(
        contact => contact.id !== contactId
      );
    },
    
    // Insights and progress
    updateInsights: (state, action) => {
      state.insights = {
        ...state.insights,
        ...action.payload,
      };
    },
    
    addProgressNote: (state, action) => {
      state.insights.progressNotes.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    
    addAchievement: (state, action) => {
      state.insights.achievements.push({
        ...action.payload,
        unlockedAt: new Date().toISOString(),
      });
    },
    
    // Error handling
    clearError: (state) => {
      state.error = null;
    },
    
    setError: (state, action) => {
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
        const existingIndex = state.sessionHistory.findIndex(s => s.sessionId === sessionSummary.sessionId);
        if (existingIndex === -1) {
          state.sessionHistory.unshift(sessionSummary);
        } else {
          state.sessionHistory[existingIndex] = sessionSummary;
        }
        // Update insights
        state.insights.totalSessions = state.sessionHistory.length;
        state.insights.totalDuration = state.sessionHistory.reduce((total, session) => total + (session.duration || 0), 0);
        state.insights.averageSessionLength = state.insights.totalDuration / state.insights.totalSessions;
      })
      .addCase(saveTherapySession.rejected, (state, action) => {
        state.sessionSaving = false;
        state.error = action.payload;
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
        state.error = action.payload;
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
        state.insights.totalDuration = state.sessionHistory.reduce((total, session) => total + (session.duration || 0), 0);
        if (state.insights.totalSessions > 0) {
          state.insights.averageSessionLength = state.insights.totalDuration / state.insights.totalSessions;
        }
      })
      .addCase(loadTherapyHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
        state.error = action.payload;
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
        state.error = action.payload;
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

// Selectors
export const selectCurrentSession = (state) => state.therapy.currentSession;
export const selectSessionHistory = (state) => state.therapy.sessionHistory;
export const selectTherapyPreferences = (state) => state.therapy.preferences;
export const selectTherapyInsights = (state) => state.therapy.insights;
export const selectTherapyLoading = (state) => state.therapy.loading;
export const selectTherapyError = (state) => state.therapy.error;
export const selectSessionSaving = (state) => state.therapy.sessionSaving;
export const selectPreferencesLoading = (state) => state.therapy.preferencesLoading;

// Computed selectors
export const selectIsSessionActive = (state) => state.therapy.currentSession.isActive;
export const selectCurrentExercise = (state) => state.therapy.currentSession.currentExercise;
export const selectInteractionMode = (state) => state.therapy.currentSession.interactionMode;
export const selectSessionMessages = (state) => state.therapy.currentSession.messages;
export const selectSessionDuration = (state) => {
  const session = state.therapy.currentSession;
  if (!session.isActive || !session.startTime) return 0;
  return Math.floor((new Date() - new Date(session.startTime)) / 1000);
};

export default therapySlice.reducer;