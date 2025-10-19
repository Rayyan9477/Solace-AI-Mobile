import { createSelector } from "@reduxjs/toolkit";
import { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";

// PERFORMANCE OPTIMIZATION: Memoized selectors prevent unnecessary re-renders

// User data selector with memoization
const selectUserData = createSelector([(state) => state.user], (user) => ({
  profile: user?.profile || { name: "Friend" },
  stats: user?.stats || {},
  loading: user?.loading || false,
  isAuthenticated: user?.isAuthenticated || false,
}));

// Mood data selector with memoization
const selectMoodData = createSelector([(state) => state.mood], (mood) => ({
  currentMood: mood?.currentMood,
  insights: mood?.insights || [],
  weeklyStats: mood?.weeklyStats || {},
  moodHistory: mood?.moodHistory || [],
  loading: mood?.loading || false,
}));

// Enhanced mood data selector
const selectEnhancedMoodData = createSelector(
  [(state) => state.enhancedMood],
  (enhancedMood) => ({
    entries: enhancedMood?.entries || [],
    analytics: enhancedMood?.analytics || {},
    trends: enhancedMood?.trends || [],
    loading: enhancedMood?.loading || false,
  }),
);

// Chat data selector with memoization
const selectChatData = createSelector([(state) => state.chat], (chat) => ({
  conversations: chat?.conversations || [],
  currentSession: chat?.currentSession,
  loading: chat?.loading || false,
  isTyping: chat?.isTyping || false,
}));

// Assessment data selector
const selectAssessmentData = createSelector(
  [(state) => state.assessment],
  (assessment) => ({
    results: assessment?.results || [],
    currentAssessment: assessment?.currentAssessment,
    loading: assessment?.loading || false,
    recommendations: assessment?.recommendations || [],
  }),
);

// Therapy session data selector
const selectTherapyData = createSelector(
  [(state) => state.therapy],
  (therapy) => ({
    sessions: therapy?.sessions || [],
    currentSession: therapy?.currentSession,
    loading: therapy?.loading || false,
    progress: therapy?.progress || {},
  }),
);

// PERFORMANCE OPTIMIZATION: Custom hooks with optimized selectors

export const useOptimizedUserData = () => {
  return useSelector(selectUserData, shallowEqual);
};

export const useOptimizedMoodData = () => {
  return useSelector(selectMoodData, shallowEqual);
};

export const useOptimizedEnhancedMoodData = () => {
  return useSelector(selectEnhancedMoodData, shallowEqual);
};

export const useOptimizedChatData = () => {
  return useSelector(selectChatData, shallowEqual);
};

export const useOptimizedAssessmentData = () => {
  return useSelector(selectAssessmentData, shallowEqual);
};

export const useOptimizedTherapyData = () => {
  return useSelector(selectTherapyData, shallowEqual);
};

// PERFORMANCE OPTIMIZATION: Combined app data hook with optimized selectors
export const useOptimizedAppData = () => {
  return useSelector(
    (state) => ({
      user: selectUserData(state),
      mood: selectMoodData(state),
      enhancedMood: selectEnhancedMoodData(state),
      chat: selectChatData(state),
      assessment: selectAssessmentData(state),
      therapy: selectTherapyData(state),
    }),
    shallowEqual,
  );
};

// PERFORMANCE OPTIMIZATION: Dashboard specific data with memoized slicing
export const useOptimizedDashboardData = () => {
  const userData = useOptimizedUserData();
  const moodData = useOptimizedMoodData();
  const chatData = useOptimizedChatData();

  // Memoize expensive slicing operations
  const moodHistorySlice = useMemo(
    () => moodData.moodHistory?.slice(0, 5) || [],
    [moodData.moodHistory],
  );

  const chatHistorySlice = useMemo(
    () => chatData.conversations?.slice(0, 3) || [],
    [chatData.conversations],
  );

  const insights = useMemo(
    () => moodData.insights?.slice(0, 3) || [],
    [moodData.insights],
  );

  return useMemo(
    () => ({
      user: userData,
      mood: {
        ...moodData,
        moodHistorySlice,
        insights,
      },
      chat: {
        ...chatData,
        chatHistorySlice,
      },
      loading: userData.loading || moodData.loading || chatData.loading,
    }),
    [
      userData,
      moodData,
      chatData,
      moodHistorySlice,
      chatHistorySlice,
      insights,
    ],
  );
};

// PERFORMANCE OPTIMIZATION: Mood tracker specific data
export const useOptimizedMoodTrackerData = () => {
  const enhancedMoodData = useOptimizedEnhancedMoodData();
  const userData = useOptimizedUserData();

  return useMemo(
    () => ({
      entries: enhancedMoodData.entries,
      analytics: enhancedMoodData.analytics,
      trends: enhancedMoodData.trends,
      userPreferences: userData.profile?.moodPreferences || {},
      loading: enhancedMoodData.loading,
    }),
    [enhancedMoodData, userData.profile?.moodPreferences],
  );
};

// PERFORMANCE OPTIMIZATION: Chat specific data with message optimization
export const useOptimizedChatSessionData = () => {
  const chatData = useOptimizedChatData();
  const userData = useOptimizedUserData();

  // Memoize recent messages for better performance
  const recentMessages = useMemo(() => {
    const currentSession = chatData.currentSession;
    if (!currentSession?.messages) return [];

    // Keep only last 50 messages in memory for performance
    return currentSession.messages.slice(-50);
  }, [chatData.currentSession?.messages]);

  return useMemo(
    () => ({
      currentSession: {
        ...chatData.currentSession,
        messages: recentMessages,
      },
      isTyping: chatData.isTyping,
      loading: chatData.loading,
      userProfile: userData.profile,
    }),
    [
      chatData.currentSession,
      chatData.isTyping,
      chatData.loading,
      userData.profile,
      recentMessages,
    ],
  );
};

// PERFORMANCE OPTIMIZATION: Assessment data with progress calculation
export const useOptimizedAssessmentSessionData = () => {
  const assessmentData = useOptimizedAssessmentData();
  const userData = useOptimizedUserData();

  const progress = useMemo(() => {
    const current = assessmentData.currentAssessment;
    if (!current?.questions || !current?.answers) return 0;

    return Math.round(
      (Object.keys(current.answers).length / current.questions.length) * 100,
    );
  }, [assessmentData.currentAssessment]);

  return useMemo(
    () => ({
      currentAssessment: assessmentData.currentAssessment,
      progress,
      results: assessmentData.results,
      recommendations: assessmentData.recommendations,
      loading: assessmentData.loading,
      userProfile: userData.profile,
    }),
    [assessmentData, progress, userData.profile],
  );
};

// PERFORMANCE OPTIMIZATION: Auth state selector
export const useOptimizedAuthState = () => {
  return useSelector(
    (state) => ({
      isAuthenticated: state.auth?.isAuthenticated || false,
      onboardingCompleted: state.auth?.onboardingCompleted || false,
      isLoading: state.auth?.isLoading || false,
      user: state.auth?.user,
    }),
    shallowEqual,
  );
};

// PERFORMANCE OPTIMIZATION: Loading states across the app
export const useOptimizedLoadingStates = () => {
  return useSelector(
    (state) => ({
      authLoading: state.auth?.isLoading || false,
      userLoading: state.user?.loading || false,
      moodLoading: state.mood?.loading || false,
      chatLoading: state.chat?.loading || false,
      assessmentLoading: state.assessment?.loading || false,
      therapyLoading: state.therapy?.loading || false,
      anyLoading:
        state.auth?.isLoading ||
        state.user?.loading ||
        state.mood?.loading ||
        state.chat?.loading ||
        state.assessment?.loading ||
        state.therapy?.loading ||
        false,
    }),
    shallowEqual,
  );
};

export default {
  useOptimizedUserData,
  useOptimizedMoodData,
  useOptimizedEnhancedMoodData,
  useOptimizedChatData,
  useOptimizedAssessmentData,
  useOptimizedTherapyData,
  useOptimizedAppData,
  useOptimizedDashboardData,
  useOptimizedMoodTrackerData,
  useOptimizedChatSessionData,
  useOptimizedAssessmentSessionData,
  useOptimizedAuthState,
  useOptimizedLoadingStates,
};
