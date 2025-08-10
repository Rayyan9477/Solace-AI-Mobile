import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enhanced mood tracking with offline support and advanced analytics

// Async thunk for logging mood with offline queue
export const logMoodOptimistic = createAsyncThunk(
  'mood/logMoodOptimistic',
  async (moodData, { dispatch, rejectWithValue, getState }) => {
    try {
      // Generate unique ID
      const moodEntry = {
        id: Date.now().toString(),
        ...moodData,
        timestamp: new Date().toISOString(),
        synced: false // Mark as not synced initially
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
        console.warn('Mood sync failed, added to offline queue:', syncError);
        
        return moodEntry; // Return unsynced entry
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching mood history with caching
export const fetchMoodHistoryEnhanced = createAsyncThunk(
  'mood/fetchMoodHistoryEnhanced',
  async ({ forceRefresh = false } = {}, { rejectWithValue }) => {
    try {
      // Check cache first
      if (!forceRefresh) {
        const cachedData = await AsyncStorage.getItem('moodHistory');
        const cacheTimestamp = await AsyncStorage.getItem('moodHistoryCacheTime');
        
        if (cachedData && cacheTimestamp) {
          const cacheAge = Date.now() - parseInt(cacheTimestamp);
          const maxCacheAge = 5 * 60 * 1000; // 5 minutes
          
          if (cacheAge < maxCacheAge) {
            return JSON.parse(cachedData);
          }
        }
      }

      // Fetch from server
      const response = await fetchMoodHistoryFromServer();
      
      // Cache the response
      await AsyncStorage.setItem('moodHistory', JSON.stringify(response));
      await AsyncStorage.setItem('moodHistoryCacheTime', Date.now().toString());
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for syncing offline queue
export const syncOfflineQueue = createAsyncThunk(
  'mood/syncOfflineQueue',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const { offlineQueue } = state.mood;
    
    const syncResults = {
      successful: [],
      failed: []
    };

    for (const entry of offlineQueue) {
      try {
        const response = await syncMoodToServer(entry);
        dispatch(markMoodSynced({ id: entry.id, serverData: response }));
        syncResults.successful.push(entry.id);
      } catch (error) {
        console.warn(`Failed to sync mood entry ${entry.id}:`, error);
        syncResults.failed.push({ id: entry.id, error: error.message });
      }
    }

    // Remove successfully synced items from queue
    if (syncResults.successful.length > 0) {
      dispatch(removeFromOfflineQueue(syncResults.successful));
    }

    return syncResults;
  }
);

// Mock API functions (replace with actual API calls)
const syncMoodToServer = async (moodEntry) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate occasional failures for testing
  if (Math.random() < 0.1) {
    throw new Error('Network error');
  }
  
  return {
    ...moodEntry,
    serverId: `server_${Date.now()}`,
    synced: true
  };
};

const fetchMoodHistoryFromServer = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      mood: 'happy',
      intensity: 4,
      activities: ['exercise', 'social'],
      triggers: [],
      notes: 'Had a great workout and coffee with friends',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      synced: true
    },
    {
      id: '2',
      mood: 'calm',
      intensity: 3,
      activities: ['meditation', 'reading'],
      triggers: [],
      notes: 'Peaceful evening with mindfulness practice',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      synced: true
    },
    {
      id: '3',
      mood: 'anxious',
      intensity: 3,
      activities: ['work'],
      triggers: ['work_stress'],
      notes: 'Presentation anxiety, but managed it well',
      timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
      synced: true
    }
  ];
};

const initialState = {
  // Core mood data
  currentMood: null,
  moodHistory: [],
  offlineQueue: [],
  
  // Analytics and insights
  weeklyStats: {
    averageIntensity: 0,
    mostCommonMood: null,
    totalEntries: 0,
    moodVariety: 0
  },
  monthlyStats: {
    averageIntensity: 0,
    moodDistribution: {},
    improvementTrend: 0
  },
  insights: [],
  patterns: [],
  recommendations: [],
  
  // Personalization
  preferences: {
    reminderFrequency: 'daily',
    preferredMoods: [],
    triggerKeywords: [],
    goalMood: 'calm'
  },
  
  // State management
  loading: false,
  error: null,
  syncStatus: 'idle', // idle, syncing, success, failed
  lastSyncTime: null,
  cacheValid: false
};

const enhancedMoodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    // Optimistic updates
    addMoodEntryOptimistic: (state, action) => {
      state.moodHistory.unshift(action.payload);
      state.currentMood = action.payload.mood;
      enhancedMoodSlice.caseReducers.updateStats(state);
      enhancedMoodSlice.caseReducers.generateEnhancedInsights(state);
    },

    // Sync management
    markMoodSynced: (state, action) => {
      const { id, serverData } = action.payload;
      const entryIndex = state.moodHistory.findIndex(entry => entry.id === id);
      
      if (entryIndex !== -1) {
        state.moodHistory[entryIndex] = { ...state.moodHistory[entryIndex], ...serverData };
      }
    },

    addToOfflineQueue: (state, action) => {
      if (!state.offlineQueue.find(entry => entry.id === action.payload.id)) {
        state.offlineQueue.push(action.payload);
      }
    },

    removeFromOfflineQueue: (state, action) => {
      const idsToRemove = action.payload;
      state.offlineQueue = state.offlineQueue.filter(
        entry => !idsToRemove.includes(entry.id)
      );
    },

    // Enhanced statistics calculation
    updateStats: (state) => {
      const allEntries = state.moodHistory;
      const recentEntries = allEntries.slice(0, 7); // Last 7 entries
      const monthlyEntries = allEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return entryDate > monthAgo;
      });

      // Weekly stats
      if (recentEntries.length > 0) {
        const avgIntensity = recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length;
        
        const moodCounts = recentEntries.reduce((counts, entry) => {
          counts[entry.mood] = (counts[entry.mood] || 0) + 1;
          return counts;
        }, {});

        const mostCommon = Object.entries(moodCounts).reduce((a, b) => 
          moodCounts[a[0]] > moodCounts[b[0]] ? a : b
        )[0];

        state.weeklyStats = {
          averageIntensity: Math.round(avgIntensity * 10) / 10,
          mostCommonMood: mostCommon,
          totalEntries: recentEntries.length,
          moodVariety: Object.keys(moodCounts).length
        };
      }

      // Monthly stats
      if (monthlyEntries.length > 0) {
        const monthlyAvg = monthlyEntries.reduce((sum, entry) => sum + entry.intensity, 0) / monthlyEntries.length;
        
        const moodDistribution = monthlyEntries.reduce((dist, entry) => {
          dist[entry.mood] = (dist[entry.mood] || 0) + 1;
          return dist;
        }, {});

        // Calculate improvement trend (comparing first half vs second half of month)
        const halfPoint = Math.floor(monthlyEntries.length / 2);
        const firstHalf = monthlyEntries.slice(halfPoint);
        const secondHalf = monthlyEntries.slice(0, halfPoint);
        
        const firstHalfAvg = firstHalf.length > 0 
          ? firstHalf.reduce((sum, entry) => sum + entry.intensity, 0) / firstHalf.length 
          : 0;
        const secondHalfAvg = secondHalf.length > 0 
          ? secondHalf.reduce((sum, entry) => sum + entry.intensity, 0) / secondHalf.length 
          : 0;

        state.monthlyStats = {
          averageIntensity: Math.round(monthlyAvg * 10) / 10,
          moodDistribution,
          improvementTrend: Math.round((secondHalfAvg - firstHalfAvg) * 10) / 10
        };
      }
    },

    // Advanced pattern recognition
    detectPatterns: (state) => {
      const patterns = [];
      const entries = state.moodHistory;

      if (entries.length < 5) return;

      // Time-based patterns
      const hourlyMoods = {};
      const weekdayMoods = {};
      
      entries.forEach(entry => {
        const date = new Date(entry.timestamp);
        const hour = date.getHours();
        const weekday = date.getDay();

        if (!hourlyMoods[hour]) hourlyMoods[hour] = [];
        if (!weekdayMoods[weekday]) weekdayMoods[weekday] = [];

        hourlyMoods[hour].push({ mood: entry.mood, intensity: entry.intensity });
        weekdayMoods[weekday].push({ mood: entry.mood, intensity: entry.intensity });
      });

      // Find patterns in hourly moods
      Object.entries(hourlyMoods).forEach(([hour, moods]) => {
        if (moods.length >= 3) {
          const avgIntensity = moods.reduce((sum, m) => sum + m.intensity, 0) / moods.length;
          const dominantMood = moods.reduce((acc, m) => {
            acc[m.mood] = (acc[m.mood] || 0) + 1;
            return acc;
          }, {});
          
          const topMood = Object.entries(dominantMood).reduce((a, b) => 
            dominantMood[a[0]] > dominantMood[b[0]] ? a : b
          )[0];

          if (avgIntensity < 2.5) {
            patterns.push({
              type: 'time_pattern',
              description: `You tend to feel ${topMood} around ${hour}:00`,
              confidence: moods.length / entries.length,
              actionable: true,
              suggestion: `Consider scheduling self-care activities before ${hour}:00`
            });
          }
        }
      });

      // Activity correlation patterns
      const activityMoodMap = {};
      entries.forEach(entry => {
        entry.activities?.forEach(activity => {
          if (!activityMoodMap[activity]) activityMoodMap[activity] = [];
          activityMoodMap[activity].push(entry.intensity);
        });
      });

      Object.entries(activityMoodMap).forEach(([activity, intensities]) => {
        if (intensities.length >= 3) {
          const avgIntensity = intensities.reduce((sum, i) => sum + i, 0) / intensities.length;
          
          if (avgIntensity >= 4) {
            patterns.push({
              type: 'activity_pattern',
              description: `${activity} consistently improves your mood`,
              confidence: intensities.length / entries.length,
              actionable: true,
              suggestion: `Try to incorporate more ${activity} into your routine`
            });
          } else if (avgIntensity <= 2) {
            patterns.push({
              type: 'activity_pattern',
              description: `${activity} may be associated with lower moods`,
              confidence: intensities.length / entries.length,
              actionable: true,
              suggestion: `Consider how to make ${activity} more enjoyable or limit it`
            });
          }
        }
      });

      state.patterns = patterns;
    },

    // Enhanced insights generation
    generateEnhancedInsights: (state) => {
      const insights = [];
      const { weeklyStats, monthlyStats, patterns } = state;

      // Progress insights
      if (weeklyStats.averageIntensity >= 4) {
        insights.push({
          id: 'positive_trend',
          type: 'celebration',
          priority: 'high',
          title: 'Great Progress! 🌟',
          message: `Your mood has been consistently positive this week (${weeklyStats.averageIntensity}/5). Keep up the wonderful work!`,
          icon: '🌟',
          actionable: false
        });
      }

      if (monthlyStats.improvementTrend > 0.5) {
        insights.push({
          id: 'improvement_trend',
          type: 'celebration',
          priority: 'high',
          title: 'Upward Trend! 📈',
          message: `Your mood has improved by ${monthlyStats.improvementTrend} points this month. That's fantastic progress!`,
          icon: '📈',
          actionable: false
        });
      }

      // Concern insights
      if (weeklyStats.averageIntensity <= 2) {
        insights.push({
          id: 'low_mood',
          type: 'support',
          priority: 'high',
          title: 'Extra Support 🤗',
          message: 'Your mood has been lower lately. This is normal - everyone has difficult periods. Consider reaching out for support.',
          icon: '🤗',
          actionable: true,
          actions: [
            { label: 'Talk to Therapist', action: 'start_chat' },
            { label: 'Try Breathing Exercise', action: 'breathing_exercise' },
            { label: 'Emergency Resources', action: 'crisis_resources' }
          ]
        });
      }

      // Variety insights
      if (weeklyStats.moodVariety >= 5) {
        insights.push({
          id: 'mood_variety',
          type: 'observation',
          priority: 'medium',
          title: 'Emotional Range 🎭',
          message: `You've experienced ${weeklyStats.moodVariety} different moods this week. This shows healthy emotional awareness!`,
          icon: '🎭',
          actionable: false
        });
      }

      // Pattern-based insights
      patterns.forEach(pattern => {
        if (pattern.actionable && pattern.confidence > 0.3) {
          insights.push({
            id: `pattern_${pattern.type}`,
            type: 'pattern',
            priority: 'medium',
            title: 'Pattern Detected 🔍',
            message: pattern.description,
            suggestion: pattern.suggestion,
            icon: '🔍',
            actionable: true
          });
        }
      });

      state.insights = insights.slice(0, 5); // Keep top 5 insights
    },

    // Personalized recommendations
    generateRecommendations: (state) => {
      const recommendations = [];
      const { currentMood, weeklyStats, patterns } = state;

      // Mood-specific recommendations
      if (currentMood) {
        const moodRecommendations = {
          anxious: [
            { title: '4-7-8 Breathing', description: 'Try deep breathing to calm anxiety', action: 'breathing_exercise' },
            { title: '5-4-3-2-1 Grounding', description: 'Ground yourself in the present moment', action: 'grounding_exercise' },
            { title: 'Progressive Relaxation', description: 'Release physical tension', action: 'relaxation_exercise' }
          ],
          sad: [
            { title: 'Gratitude Practice', description: 'Focus on positive aspects of your day', action: 'gratitude_exercise' },
            { title: 'Gentle Movement', description: 'Light exercise can boost mood', action: 'movement_suggestion' },
            { title: 'Connect with Support', description: 'Reach out to someone you trust', action: 'social_connection' }
          ],
          stressed: [
            { title: 'Priority Setting', description: 'Organize your tasks by importance', action: 'organization_tool' },
            { title: 'Mindful Break', description: 'Take 5 minutes for mindfulness', action: 'mindfulness_break' },
            { title: 'Boundary Setting', description: 'Practice saying no to reduce overwhelm', action: 'boundary_guidance' }
          ]
        };

        if (moodRecommendations[currentMood]) {
          recommendations.push(...moodRecommendations[currentMood].slice(0, 2));
        }
      }

      // Pattern-based recommendations
      patterns.forEach(pattern => {
        if (pattern.actionable && pattern.suggestion) {
          recommendations.push({
            title: 'Based on Your Patterns',
            description: pattern.suggestion,
            action: 'pattern_action',
            data: pattern
          });
        }
      });

      state.recommendations = recommendations.slice(0, 4);
    },

    // Clear error state
    clearMoodError: (state) => {
      state.error = null;
    },

    // Update sync status
    setSyncStatus: (state, action) => {
      state.syncStatus = action.payload;
      if (action.payload === 'success') {
        state.lastSyncTime = new Date().toISOString();
      }
    },

    // Update preferences
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    }
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
      })

      // Enhanced mood history fetching
      .addCase(fetchMoodHistoryEnhanced.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodHistoryEnhanced.fulfilled, (state, action) => {
        state.loading = false;
        state.moodHistory = action.payload;
        state.cacheValid = true;
        enhancedMoodSlice.caseReducers.updateStats(state);
        enhancedMoodSlice.caseReducers.detectPatterns(state);
        enhancedMoodSlice.caseReducers.generateEnhancedInsights(state);
        enhancedMoodSlice.caseReducers.generateRecommendations(state);
      })
      .addCase(fetchMoodHistoryEnhanced.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Offline sync
      .addCase(syncOfflineQueue.pending, (state) => {
        state.syncStatus = 'syncing';
      })
      .addCase(syncOfflineQueue.fulfilled, (state, action) => {
        state.syncStatus = 'success';
        state.lastSyncTime = new Date().toISOString();
        // Results handled by individual sync actions
      })
      .addCase(syncOfflineQueue.rejected, (state) => {
        state.syncStatus = 'failed';
      });
  }
});

export const {
  addMoodEntryOptimistic,
  markMoodSynced,
  addToOfflineQueue,
  removeFromOfflineQueue,
  updateStats,
  detectPatterns,
  generateEnhancedInsights,
  generateRecommendations,
  clearMoodError,
  setSyncStatus,
  updatePreferences
} = enhancedMoodSlice.actions;

export default enhancedMoodSlice.reducer;