import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { logMood, fetchMoodHistory, generateInsights } from '../store/slices/moodSlice';

/**
 * Advanced Mood Tracking Hook
 * Handles all mood-related functionality with therapeutic enhancements
 */
export const useMoodTracking = () => {
  const dispatch = useDispatch();
  const { 
    currentMood, 
    moodHistory, 
    weeklyStats, 
    insights, 
    loading, 
    error 
  } = useSelector((state) => state.mood);

  const [localMood, setLocalMood] = useState(currentMood);
  const [localIntensity, setLocalIntensity] = useState(3);
  const [moodNote, setMoodNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState([]);

  // Mood options with therapeutic metadata
  const moodOptions = useMemo(() => [
    {
      id: 'joyful',
      label: 'Joyful',
      emoji: '😊',
      color: '#10B981',
      description: 'Feeling happy and content',
      therapeuticMessage: 'Your joy is wonderful to see',
      supportingActivities: ['social', 'creative', 'exercise'],
      oppositeState: 'sad'
    },
    {
      id: 'calm',
      label: 'Calm',
      emoji: '😌',
      color: '#60A5FA',
      description: 'Peaceful and relaxed',
      therapeuticMessage: 'Finding calm is a beautiful achievement',
      supportingActivities: ['meditation', 'nature', 'reading'],
      oppositeState: 'anxious'
    },
    {
      id: 'energetic',
      label: 'Energetic',
      emoji: '🤩',
      color: '#F59E0B',
      description: 'Full of energy and motivation',
      therapeuticMessage: 'Your energy is inspiring',
      supportingActivities: ['exercise', 'creative', 'social'],
      oppositeState: 'tired'
    },
    {
      id: 'anxious',
      label: 'Anxious',
      emoji: '😰',
      color: '#EF4444',
      description: 'Feeling worried or nervous',
      therapeuticMessage: 'It takes courage to acknowledge anxiety',
      supportingActivities: ['breathing', 'grounding', 'support'],
      oppositeState: 'calm'
    },
    {
      id: 'sad',
      label: 'Sad',
      emoji: '😢',
      color: '#8B5CF6',
      description: 'Feeling down or melancholy',
      therapeuticMessage: 'Your feelings are valid and important',
      supportingActivities: ['support', 'gentle', 'creative'],
      oppositeState: 'joyful'
    },
    {
      id: 'stressed',
      label: 'Stressed',
      emoji: '😤',
      color: '#F97316',
      description: 'Feeling overwhelmed or pressured',
      therapeuticMessage: 'Recognizing stress is the first step to managing it',
      supportingActivities: ['relaxation', 'organization', 'support'],
      oppositeState: 'calm'
    },
    {
      id: 'tired',
      label: 'Tired',
      emoji: '😴',
      color: '#6B7280',
      description: 'Feeling fatigued or drained',
      therapeuticMessage: 'Rest is essential for your wellbeing',
      supportingActivities: ['rest', 'gentle', 'nourishment'],
      oppositeState: 'energetic'
    },
    {
      id: 'neutral',
      label: 'Neutral',
      emoji: '😐',
      color: '#9CA3AF',
      description: 'Feeling balanced or in-between',
      therapeuticMessage: 'Balance is a form of stability',
      supportingActivities: ['reflection', 'routine', 'gentle'],
      oppositeState: null
    }
  ], []);

  // Activity options for mood correlation
  const activityOptions = useMemo(() => [
    { id: 'work', label: 'Work/Study', category: 'productivity' },
    { id: 'exercise', label: 'Exercise', category: 'physical' },
    { id: 'social', label: 'Social Time', category: 'social' },
    { id: 'meditation', label: 'Meditation', category: 'mindfulness' },
    { id: 'creative', label: 'Creative Activity', category: 'creative' },
    { id: 'nature', label: 'Time in Nature', category: 'environmental' },
    { id: 'reading', label: 'Reading', category: 'mental' },
    { id: 'music', label: 'Listening to Music', category: 'sensory' },
    { id: 'cooking', label: 'Cooking', category: 'creative' },
    { id: 'gaming', label: 'Gaming', category: 'entertainment' },
    { id: 'family', label: 'Family Time', category: 'social' },
    { id: 'rest', label: 'Rest/Sleep', category: 'physical' }
  ], []);

  // Common mood triggers
  const triggerOptions = useMemo(() => [
    { id: 'work_stress', label: 'Work Stress', category: 'external' },
    { id: 'relationship', label: 'Relationship Issues', category: 'social' },
    { id: 'health', label: 'Health Concerns', category: 'physical' },
    { id: 'financial', label: 'Financial Worries', category: 'external' },
    { id: 'sleep', label: 'Poor Sleep', category: 'physical' },
    { id: 'weather', label: 'Weather Changes', category: 'environmental' },
    { id: 'hormonal', label: 'Hormonal Changes', category: 'physical' },
    { id: 'social_media', label: 'Social Media', category: 'digital' },
    { id: 'news', label: 'News/Current Events', category: 'external' },
    { id: 'isolation', label: 'Feeling Isolated', category: 'social' },
    { id: 'overwhelm', label: 'Feeling Overwhelmed', category: 'mental' },
    { id: 'uncertainty', label: 'Uncertainty', category: 'mental' }
  ], []);

  // Get current mood data
  const currentMoodData = useMemo(() => {
    return moodOptions.find(mood => mood.id === (localMood || currentMood));
  }, [localMood, currentMood, moodOptions]);

  // Calculate mood trends
  const moodTrends = useMemo(() => {
    if (!moodHistory || moodHistory.length < 2) return null;

    const recent = moodHistory.slice(0, 7); // Last 7 entries
    const avgIntensity = recent.reduce((sum, entry) => sum + entry.intensity, 0) / recent.length;
    
    const moodCounts = recent.reduce((counts, entry) => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
      return counts;
    }, {});

    const dominantMood = Object.entries(moodCounts)
      .reduce((a, b) => moodCounts[a[0]] > moodCounts[b[0]] ? a : b)[0];

    return {
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      dominantMood,
      totalEntries: recent.length,
      moodVariety: Object.keys(moodCounts).length
    };
  }, [moodHistory]);

  // Handle mood selection with haptic feedback
  const handleMoodSelect = useCallback(async (moodId) => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setLocalMood(moodId);
  }, []);

  // Handle intensity selection
  const handleIntensitySelect = useCallback(async (intensity) => {
    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setLocalIntensity(intensity);
  }, []);

  // Handle activity toggle
  const handleActivityToggle = useCallback((activityId) => {
    setSelectedActivities(prev => 
      prev.includes(activityId)
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  }, []);

  // Handle trigger toggle
  const handleTriggerToggle = useCallback((triggerId) => {
    setSelectedTriggers(prev => 
      prev.includes(triggerId)
        ? prev.filter(id => id !== triggerId)
        : [...prev, triggerId]
    );
  }, []);

  // Save mood entry with comprehensive data
  const saveMoodEntry = useCallback(async (additionalData = {}) => {
    if (!localMood) return false;

    try {
      const moodEntry = {
        mood: localMood,
        intensity: localIntensity,
        note: moodNote,
        activities: selectedActivities,
        triggers: selectedTriggers,
        timestamp: new Date().toISOString(),
        ...additionalData
      };

      await dispatch(logMood(moodEntry)).unwrap();

      // Success feedback
      if (Platform.OS === 'ios') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Reset local state
      setLocalMood(null);
      setLocalIntensity(3);
      setMoodNote('');
      setSelectedActivities([]);
      setSelectedTriggers([]);

      return true;
    } catch (error) {
      console.error('Failed to save mood entry:', error);
      if (Platform.OS === 'ios') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return false;
    }
  }, [localMood, localIntensity, moodNote, selectedActivities, selectedTriggers, dispatch]);

  // Get mood-based recommendations
  const getMoodRecommendations = useCallback((mood) => {
    const moodData = moodOptions.find(m => m.id === mood);
    if (!moodData) return [];

    const recommendations = [];

    // Activity-based recommendations
    moodData.supportingActivities?.forEach(activity => {
      switch (activity) {
        case 'breathing':
          recommendations.push({
            type: 'exercise',
            title: 'Try Deep Breathing',
            description: '4-7-8 breathing technique to calm anxiety',
            action: 'breathing_exercise'
          });
          break;
        case 'grounding':
          recommendations.push({
            type: 'exercise',
            title: '5-4-3-2-1 Grounding',
            description: 'Connect with your senses to feel present',
            action: 'grounding_exercise'
          });
          break;
        case 'support':
          recommendations.push({
            type: 'social',
            title: 'Reach Out',
            description: 'Connect with a friend or therapist',
            action: 'social_support'
          });
          break;
        case 'creative':
          recommendations.push({
            type: 'activity',
            title: 'Creative Expression',
            description: 'Draw, write, or create something',
            action: 'creative_activity'
          });
          break;
        case 'rest':
          recommendations.push({
            type: 'selfcare',
            title: 'Rest & Recharge',
            description: 'Take time to rest and restore energy',
            action: 'rest_activity'
          });
          break;
      }
    });

    return recommendations;
  }, [moodOptions]);

  // Get crisis intervention suggestions
  const getCrisisSupport = useCallback((mood, intensity) => {
    const criticalMoods = ['anxious', 'sad', 'stressed'];
    const highIntensity = intensity >= 4;

    if (criticalMoods.includes(mood) && highIntensity) {
      return {
        urgent: true,
        suggestions: [
          {
            title: 'Crisis Text Line',
            description: 'Text HOME to 741741',
            action: 'crisis_text'
          },
          {
            title: 'National Suicide Prevention Lifeline',
            description: 'Call or text 988',
            action: 'crisis_call'
          },
          {
            title: 'Emergency Services',
            description: 'Call 911 if in immediate danger',
            action: 'emergency_call'
          }
        ]
      };
    }

    return null;
  }, []);

  // Refresh mood data
  const refreshMoodData = useCallback(async () => {
    try {
      await dispatch(fetchMoodHistory()).unwrap();
      dispatch(generateInsights());
    } catch (error) {
      console.error('Failed to refresh mood data:', error);
    }
  }, [dispatch]);

  // Auto-refresh mood data on mount
  useEffect(() => {
    refreshMoodData();
  }, [refreshMoodData]);

  return {
    // State
    currentMood: localMood || currentMood,
    currentMoodData,
    intensity: localIntensity,
    note: moodNote,
    selectedActivities,
    selectedTriggers,
    moodHistory,
    weeklyStats,
    insights,
    moodTrends,
    loading,
    error,

    // Options
    moodOptions,
    activityOptions,
    triggerOptions,

    // Actions
    handleMoodSelect,
    handleIntensitySelect,
    handleActivityToggle,
    handleTriggerToggle,
    setMoodNote,
    saveMoodEntry,
    refreshMoodData,

    // Utilities
    getMoodRecommendations,
    getCrisisSupport
  };
};