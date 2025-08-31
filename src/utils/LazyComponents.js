import { LinearGradient } from "expo-linear-gradient";
import React, { Suspense, lazy } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

import { useTheme } from "../shared/theme/ThemeContext";

// Enhanced loading component with therapeutic design
const LoadingFallback = ({ componentName, size = "large" }) => {
  const { theme } = useTheme();

  const sizeConfig = {
    small: { indicator: 20, text: 14, padding: 16 },
    medium: { indicator: 30, text: 16, padding: 24 },
    large: { indicator: 40, text: 18, padding: 32 },
  };

  const config = sizeConfig[size];

  return (
    <View style={[styles.loadingContainer, { padding: config.padding }]}>
      <LinearGradient
        colors={[
          theme.colors.therapeutic.calming[50],
          theme.colors.therapeutic.peaceful[50],
        ]}
        style={styles.loadingGradient}
      >
        <ActivityIndicator
          size={config.indicator}
          color={theme.colors.therapeutic.calming[500]}
        />
        <Text
          style={[
            styles.loadingText,
            {
              color: theme.colors.text.secondary,
              fontSize: config.text,
            },
          ]}
        >
          Loading {componentName}...
        </Text>
      </LinearGradient>
    </View>
  );
};

// Higher-order component for lazy loading with error boundaries
const withLazyLoading = (importFunc, fallbackProps = {}) => {
  const LazyComponent = lazy(importFunc);

  return React.forwardRef((props, ref) => (
    <Suspense fallback={<LoadingFallback {...fallbackProps} />}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

// Code-split screen components
export const LazyChatScreen = withLazyLoading(
  () => import("../screens/chat/ChatScreen"),
  { componentName: "Chat", size: "large" },
);

export const LazyAITherapyChatScreen = withLazyLoading(
  () => import("../screens/chat/AITherapyChatScreen"),
  { componentName: "AI Therapy Chat", size: "large" },
);

export const LazyTherapyScreen = withLazyLoading(
  () => import("../screens/therapy/TherapyScreen"),
  { componentName: "Therapy Session", size: "large" },
);

export const LazyAssessmentScreen = withLazyLoading(
  () => import("../screens/assessment/AssessmentScreen"),
  { componentName: "Assessment", size: "medium" },
);

export const LazyComprehensiveAssessmentScreen = withLazyLoading(
  () => import("../screens/assessment/ComprehensiveAssessmentScreen"),
  { componentName: "Comprehensive Assessment", size: "large" },
);

export const LazyJournalScreen = withLazyLoading(
  () => import("../screens/journal/JournalScreen"),
  { componentName: "Journal", size: "medium" },
);

export const LazyMentalHealthJournalScreen = withLazyLoading(
  () => import("../screens/journal/MentalHealthJournalScreen"),
  { componentName: "Mental Health Journal", size: "large" },
);

export const LazyWellnessScreens = {
  MindfulResources: withLazyLoading(
    () => import("../screens/wellness/MindfulResourcesScreen"),
    { componentName: "Mindful Resources", size: "medium" },
  ),
  StressManagement: withLazyLoading(
    () => import("../screens/wellness/StressManagementScreen"),
    { componentName: "Stress Management", size: "medium" },
  ),
  SleepQuality: withLazyLoading(
    () => import("../screens/wellness/SleepQualityScreen"),
    { componentName: "Sleep Quality", size: "medium" },
  ),
  MindfulHours: withLazyLoading(
    () => import("../screens/wellness/MindfulHoursScreen"),
    { componentName: "Mindful Hours", size: "medium" },
  ),
};

// Code-split component bundles
export const LazyDashboardComponents = {
  DailyInsights: withLazyLoading(
    () => import("../components/dashboard/DailyInsights"),
    { componentName: "Daily Insights", size: "small" },
  ),
  ProgressOverview: withLazyLoading(
    () => import("../components/dashboard/ProgressOverview"),
    { componentName: "Progress Overview", size: "small" },
  ),
  RecentActivity: withLazyLoading(
    () => import("../components/dashboard/RecentActivity"),
    { componentName: "Recent Activity", size: "small" },
  ),
};

export const LazyChatComponents = {
  VoiceRecorder: withLazyLoading(
    () => import("../components/chat/VoiceRecorder"),
    { componentName: "Voice Recorder", size: "small" },
  ),
  TherapeuticChatBubble: withLazyLoading(
    () => import("../components/chat/TherapeuticChatBubble"),
    { componentName: "Chat Bubble", size: "small" },
  ),
  EmotionIndicator: withLazyLoading(
    () => import("../components/chat/EmotionIndicator"),
    { componentName: "Emotion Indicator", size: "small" },
  ),
};

// Bundle splitting utility
export const createLazyBundle = (components, bundleName) => {
  const LazyBundle = {};

  Object.keys(components).forEach((key) => {
    LazyBundle[key] = withLazyLoading(components[key], {
      componentName: `${bundleName} - ${key}`,
      size: "small",
    });
  });

  return LazyBundle;
};

// Preload utility for critical components
export const preloadComponent = async (importFunc) => {
  try {
    await importFunc();
  } catch (error) {
    console.warn("Failed to preload component:", error);
  }
};

// Preload critical components on app initialization
export const preloadCriticalComponents = async () => {
  const criticalComponents = [
    () => import("../screens/MainAppScreen"),
    () => import("../components/dashboard/MoodCheckIn"),
    () => import("../components/dashboard/WelcomeHeader"),
    () => import("../components/dashboard/QuickActions"),
  ];

  await Promise.allSettled(criticalComponents.map(preloadComponent));
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  loadingGradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  loadingText: {
    marginTop: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default {
  withLazyLoading,
  LoadingFallback,
  preloadCriticalComponents,
  createLazyBundle,
};
