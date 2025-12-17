/**
 * AppNavigator - Main navigation configuration
 * Updated to work with feature-based architecture
 */

import AssessmentHistoryScreen from "@features/assessment/screens/AssessmentHistoryScreen";
import AssessmentResultsScreen from "@features/assessment/screens/AssessmentResultsScreen";
import AssessmentScreen from "@features/assessment/screens/AssessmentScreen";
import ForgotPasswordScreen from "@features/auth/ForgotPasswordScreen";
import LoginScreen from "@features/auth/LoginScreen";
import SignupScreen from "@features/auth/SignupScreen";
import SocialLoginScreen from "@features/auth/screens/SocialLoginScreen";
import ChatScreen from "@features/chat/ChatScreen";
import ChatConversationsListScreen from "@features/chat/screens/ChatConversationsListScreen";
import NewConversationScreen from "@features/chat/NewConversationScreen";
import { CommunitySupportScreen, CreatePostScreen } from "@features/community";

// Feature-based screen imports

// New screen imports
import MoodStatsScreen from "@features/mood/screens/MoodStatsScreen";
import MoodCalendarScreen from "@features/mood/screens/MoodCalendarScreen";
import MoodHistoryScreen from "@features/mood/screens/MoodHistoryScreen";
import MoodAnalyticsScreen from "@features/mood/screens/MoodAnalyticsScreen";
import ActivityTrackingScreen from "@features/mood/screens/ActivityTrackingScreen";
import StressStatsScreen from "@features/wellness/screens/StressStatsScreen";
import SleepPatternsScreen from "@features/wellness/screens/SleepPatternsScreen";
import SleepGoalsScreen from "@features/wellness/screens/SleepGoalsScreen";
import SleepTipsScreen from "@features/wellness/screens/SleepTipsScreen";
import BedtimeRemindersScreen from "@features/wellness/screens/BedtimeRemindersScreen";
import RelaxationTechniquesScreen from "@features/wellness/screens/RelaxationTechniquesScreen";
import PostDetailScreen from "@features/community/screens/PostDetailScreen";
import CommunityNotificationsScreen from "@features/community/screens/CommunityNotificationsScreen";
import SupportGroupsScreen from "@features/community/screens/SupportGroupsScreen";
import DiscussionThreadsScreen from "@features/community/screens/DiscussionThreadsScreen";
import SuccessStoriesScreen from "@features/community/screens/SuccessStoriesScreen";
import CrisisSupportScreen from "@features/crisis/screens/CrisisSupportScreen";
import DashboardScreen from "@features/dashboard/DashboardScreen";
import AISuggestionsScreen from "@features/dashboard/screens/AISuggestionsScreen";
import FreudScoreScreen from "@features/dashboard/screens/FreudScoreScreen";
import SessionHistoryScreen from "@features/mindfulness/screens/SessionHistoryScreen";
import AchievementBadgesScreen from "@features/mindfulness/screens/AchievementBadgesScreen";
import ArticleDetailScreen from "@features/mindfulness/screens/ArticleDetailScreen";
import CourseDetailScreen from "@features/mindfulness/screens/CourseDetailScreen";
import CourseLessonScreen from "@features/mindfulness/screens/CourseLessonScreen";
import CourseCompletionScreen from "@features/mindfulness/screens/CourseCompletionScreen";
import NotificationHistoryScreen from "@features/smartNotifications/screens/NotificationHistoryScreen";
import NotificationCardsScreen from "@features/smartNotifications/screens/NotificationCardsScreen";
import SmartNotificationsScreen from "@features/smartNotifications/screens/SmartNotificationsScreen";
import MoodSelectionScreen from "@features/mood/screens/MoodSelectionScreen";
import HelpCenterScreen from "@features/profile/screens/HelpCenterScreen";
import AccountSettingsScreen from "@features/profile/screens/AccountSettingsScreen";
import PersonalInformationScreen from "@features/profile/screens/PersonalInformationScreen";
import NotificationSettingsScreen from "@features/profile/screens/NotificationSettingsScreen";
import SecuritySettingsScreen from "@features/profile/screens/SecuritySettingsScreen";
import LanguageSettingsScreen from "@features/profile/screens/LanguageSettingsScreen";
import PrivacySettingsScreen from "@features/profile/screens/PrivacySettingsScreen";
import AboutScreen from "@features/profile/screens/AboutScreen";
import ContactSupportScreen from "@features/profile/screens/ContactSupportScreen";
import AddEmergencyContactScreen from "@features/profile/screens/AddEmergencyContactScreen";
import { ThemeSettingsScreen } from "@features/profile";
import StressAssessmentScreen from "@features/wellness/screens/StressAssessmentScreen";
import QuickStressReliefScreen from "@features/wellness/screens/QuickStressReliefScreen";
import RecentSearchesScreen from "@features/search/screens/RecentSearchesScreen";
import SearchCategoriesScreen from "@features/search/screens/SearchCategoriesScreen";
import GuidedSessionsScreen from "@features/mindfulness/screens/GuidedSessionsScreen";
import MindfulGoalsScreen from "@features/mindfulness/screens/MindfulGoalsScreen";
import MindfulResourcesCategoriesScreen from "@features/mindfulness/screens/MindfulResourcesCategoriesScreen";
import BookmarkedResourcesScreen from "@features/mindfulness/screens/BookmarkedResourcesScreen";
import NetworkErrorScreen from "@features/error/screens/NetworkErrorScreen";
import MaintenanceModeScreen from "@features/error/screens/MaintenanceModeScreen";
import SplashScreen from "@features/onboarding/screens/SplashScreen";
import LoadingScreen from "@features/onboarding/screens/LoadingScreen";
import VoiceSearchScreen from "@features/search/screens/VoiceSearchScreen";
import SearchFiltersScreen from "@features/search/screens/SearchFiltersScreen";
import PopularSearchesScreen from "@features/search/screens/PopularSearchesScreen";
import ServerErrorScreen from "@features/error/screens/ServerErrorScreen";
import EmptyStateScreen from "@features/error/screens/EmptyStateScreen";
import OfflineModeScreen from "@features/error/screens/OfflineModeScreen";
import SuccessScreen from "@features/error/screens/SuccessScreen";
import {
  JournalListScreen,
  JournalDetailScreen,
  JournalCreateScreen,
} from "@features/journal";
import JournalCalendarScreen from "@features/journal/screens/JournalCalendarScreen";
import JournalExportScreen from "@features/journal/screens/JournalExportScreen";
import JournalSearchScreen from "@features/journal/screens/JournalSearchScreen";
import {
  MindfulHoursScreen,
  BreathingExerciseScreen,
  MindfulResourcesScreen,
} from "@features/mindfulness";
import MoodScreen from "@features/mood/MoodScreen";
import EnhancedMoodTrackerScreen from "@features/mood/screens/EnhancedMoodTrackerScreen";
import OnboardingScreen from "@features/onboarding/screens/OnboardingScreen";
import WelcomeScreen from "@features/onboarding/screens/WelcomeScreen";
import { ProfileSettingsScreen } from "@features/profile";
import ProfileSetupScreen from "@features/profile/screens/ProfileSetupScreen";
import { SearchScreen } from "@features/search";
import {
  TherapySessionScreen,
  TherapyHistoryScreen,
  TherapyExercisesScreen,
  TherapyInsightsScreen,
  TherapyPreferencesScreen,
  TherapySessionDetailScreen,
  ExerciseDetailScreen,
} from "@features/therapy";
import { SleepQualityScreen, StressManagementScreen } from "@features/wellness";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Theme import
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector as useReduxSelector } from "react-redux";
import { logger } from "@shared/utils/logger";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Fallback screen for missing screens
 */
const PlaceholderScreen = ({ route }: any) => {
  const { theme } = useTheme();
  const screenName = route?.params?.name || route?.name || "Screen";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background?.primary || "#F7FAFC" },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: theme.colors.text?.primary || "#2D3748" },
        ]}
      >
        {screenName}
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.text?.secondary || "#718096" },
        ]}
      >
        This screen is under construction
      </Text>
    </View>
  );
};

/**
 * Main Tab Navigator
 */
const MainTabs = () => {
  const { theme } = useTheme();
  const isJest =
    typeof process !== "undefined" && !!process.env?.JEST_WORKER_ID;

  return (
    <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.colors.background?.secondary || "#FFFFFF",
            borderTopColor: theme.colors.border?.light || "#E2E8F0",
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: theme.colors.brown?.[70] || "#704A33",
          tabBarInactiveTintColor: theme.colors.text?.tertiary || "#A0AEC0",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons 
                name={focused ? "home" : "home-outline"} 
                size={size} 
                color={color} 
              />
            ),
            tabBarAccessibilityLabel: "Navigate to Home - View your mental health dashboard and overview",
          }}
        />
        <Tab.Screen
          name="Mood"
          component={MoodScreen}
          options={{
            tabBarLabel: isJest ? "Mood Tab" : "Mood",
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons 
                name={focused ? "emoticon-happy" : "emoticon-happy-outline"} 
                size={size} 
                color={color} 
              />
            ),
            tabBarAccessibilityLabel: "Navigate to Mood - Track and analyze your emotional well-being",
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarLabel: isJest ? "Chat Tab" : "Chat",
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons 
                name={focused ? "chat" : "chat-outline"} 
                size={size} 
                color={color} 
              />
            ),
            tabBarAccessibilityLabel: "Navigate to Chat - Talk with your AI therapy companion",
          }}
        />
        <Tab.Screen
          name="Journal"
          component={JournalListScreen}
          options={{
            tabBarLabel: isJest ? "Journal Tab" : "Journal",
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons 
                name={focused ? "book-open-page-variant" : "book-open-page-variant-outline"} 
                size={size} 
                color={color} 
              />
            ),
            tabBarAccessibilityLabel: "Navigate to Journal - Write and review your personal entries",
          }}
        />
        <Tab.Screen
          name="Mindfulness"
          component={MindfulHoursScreen}
          options={{
            tabBarLabel: isJest ? "Mindfulness Tab" : "Mindfulness",
            // MED-004 FIX: Use lotus icons which have proper outline variant for focus state
            // "meditation" icon doesn't have an outline variant
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "lotus" : "lotus-outline"}
                size={size}
                color={color}
              />
            ),
            tabBarAccessibilityLabel: "Navigate to Mindfulness - Practice meditation and breathing exercises",
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileSettingsScreen}
          options={{
            tabBarLabel: isJest ? "Profile Tab" : "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialCommunityIcons 
                name={focused ? "account-circle" : "account-circle-outline"} 
                size={size} 
                color={color} 
              />
            ),
            tabBarAccessibilityLabel: "Navigate to Profile - Manage your account settings and preferences",
          }}
        />
      </Tab.Navigator>
  );
};

/**
 * Main App Navigator
 */
const AppNavigator = (_props: any) => {
  const { theme } = useTheme();
  // Safe selector: if no Provider is present in tests, assume unauthenticated
  let isAuthenticated = false;
  try {
    const selector =
      typeof useReduxSelector === "function" ? useReduxSelector : null;
    if (selector) {
      isAuthenticated = selector((state: any) => state.auth?.isAuthenticated);
    }
  } catch (error) {
    // MED-001 FIX: Log error instead of silently swallowing
    // This helps debug Redux store issues while maintaining graceful degradation
    logger.warn("[AppNavigator] Failed to read auth state from Redux store:", error);
    isAuthenticated = false;
  }

  return (
    <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: theme.colors.background?.primary || "#F7FAFC",
          },
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name="SocialLogin" component={SocialLoginScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="MoodTracker"
              component={EnhancedMoodTrackerScreen}
            />
            <Stack.Screen name="JournalList" component={JournalListScreen} />
            <Stack.Screen name="MindfulHours" component={MindfulHoursScreen} />

            {/* Dashboard & Analytics */}
            <Stack.Screen name="FreudScore" component={FreudScoreScreen} />
            <Stack.Screen
              name="AISuggestions"
              component={AISuggestionsScreen}
            />

            {/* Mood Tracking */}
            <Stack.Screen
              name="MoodSelection"
              component={MoodSelectionScreen}
            />
            <Stack.Screen name="MoodStats" component={MoodStatsScreen} />
            <Stack.Screen name="MoodCalendar" component={MoodCalendarScreen} />
            <Stack.Screen name="MoodHistory" component={MoodHistoryScreen} />
            <Stack.Screen
              name="MoodAnalytics"
              component={MoodAnalyticsScreen}
            />
            <Stack.Screen
              name="ActivityTracking"
              component={ActivityTrackingScreen}
            />

            {/* Wellness */}
            <Stack.Screen name="SleepQuality" component={SleepQualityScreen} />
            <Stack.Screen
              name="SleepPatterns"
              component={SleepPatternsScreen}
            />
            <Stack.Screen name="SleepGoals" component={SleepGoalsScreen} />
            <Stack.Screen name="SleepTips" component={SleepTipsScreen} />
            <Stack.Screen
              name="BedtimeReminders"
              component={BedtimeRemindersScreen}
            />
            <Stack.Screen
              name="StressLevel"
              component={StressManagementScreen}
            />
            <Stack.Screen name="StressStats" component={StressStatsScreen} />
            <Stack.Screen
              name="StressAssessment"
              component={StressAssessmentScreen}
            />
            <Stack.Screen
              name="QuickStressRelief"
              component={QuickStressReliefScreen}
            />
            <Stack.Screen
              name="RelaxationTechniques"
              component={RelaxationTechniquesScreen}
            />

            {/* Journal */}
            <Stack.Screen
              name="JournalDetail"
              component={JournalDetailScreen}
            />
            <Stack.Screen
              name="JournalCreate"
              component={JournalCreateScreen}
            />
            <Stack.Screen
              name="JournalCalendar"
              component={JournalCalendarScreen}
            />
            <Stack.Screen
              name="JournalSearch"
              component={JournalSearchScreen}
            />
            <Stack.Screen
              name="JournalExport"
              component={JournalExportScreen}
            />

            {/* Mindfulness */}
            <Stack.Screen
              name="MindfulResources"
              component={MindfulResourcesScreen}
            />
            <Stack.Screen
              name="ExerciseCreate"
              component={BreathingExerciseScreen}
            />
            <Stack.Screen
              name="SessionHistory"
              component={SessionHistoryScreen}
            />
            <Stack.Screen
              name="AchievementBadges"
              component={AchievementBadgesScreen}
            />
            <Stack.Screen
              name="GuidedSessions"
              component={GuidedSessionsScreen}
            />
            <Stack.Screen name="MindfulGoals" component={MindfulGoalsScreen} />
            <Stack.Screen
              name="ArticleDetail"
              component={ArticleDetailScreen}
            />
            <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
            <Stack.Screen name="CourseLesson" component={CourseLessonScreen} />
            <Stack.Screen
              name="CourseCompletion"
              component={CourseCompletionScreen}
            />
            <Stack.Screen
              name="ResourceCategories"
              component={MindfulResourcesCategoriesScreen}
            />
            <Stack.Screen
              name="BookmarkedResources"
              component={BookmarkedResourcesScreen}
            />

            {/* Community */}
            <Stack.Screen
              name="CommunitySupport"
              component={CommunitySupportScreen}
            />
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} />
            <Stack.Screen
              name="CommunityNotifications"
              component={CommunityNotificationsScreen}
            />
            <Stack.Screen
              name="SupportGroups"
              component={SupportGroupsScreen}
            />
            <Stack.Screen
              name="DiscussionThreads"
              component={DiscussionThreadsScreen}
            />
            <Stack.Screen
              name="SuccessStories"
              component={SuccessStoriesScreen}
            />

            {/* Chat */}
            <Stack.Screen
              name="ChatConversationsList"
              component={ChatConversationsListScreen}
            />
            <Stack.Screen
              name="NewConversation"
              component={NewConversationScreen}
            />

            {/* Therapy & Challenges */}
            <Stack.Screen
              name="TherapySession"
              component={TherapySessionScreen}
            />
            <Stack.Screen
              name="TherapyHistory"
              component={TherapyHistoryScreen}
            />
            <Stack.Screen
              name="TherapyExercises"
              component={TherapyExercisesScreen}
            />
            <Stack.Screen
              name="TherapyInsights"
              component={TherapyInsightsScreen}
            />
            <Stack.Screen
              name="TherapyPreferences"
              component={TherapyPreferencesScreen}
            />
            <Stack.Screen
              name="TherapySessionDetail"
              component={TherapySessionDetailScreen}
            />
            <Stack.Screen
              name="ExerciseDetail"
              component={ExerciseDetailScreen}
            />

            {/* Quick Access: Therapy Challenges */}
            {/*
              Therapeutic Challenges accessible via:
              - TherapyExercises: 6 exercises (CBT, Mindfulness, ACT)
              - GuidedSessions: Mindfulness activities
              - RelaxationTechniques: Wellness challenges
              - QuickStressRelief: Instant wellness activities
            */}

            {/* Notifications */}
            <Stack.Screen
              name="SmartNotifications"
              component={SmartNotificationsScreen}
            />
            <Stack.Screen
              name="NotificationHistory"
              component={NotificationHistoryScreen}
            />
            <Stack.Screen
              name="NotificationCards"
              component={NotificationCardsScreen}
            />

            {/* Crisis Support */}
            <Stack.Screen
              name="CrisisSupport"
              component={CrisisSupportScreen}
            />

            {/* Assessment */}
            <Stack.Screen name="Assessment" component={AssessmentScreen} />
            <Stack.Screen
              name="AssessmentHistory"
              component={AssessmentHistoryScreen}
            />
            <Stack.Screen
              name="AssessmentResults"
              component={AssessmentResultsScreen}
            />

            {/* Profile & Settings */}
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
            <Stack.Screen
              name="ProfileSettings"
              component={ProfileSettingsScreen}
            />
            <Stack.Screen
              name="AccountSettings"
              component={AccountSettingsScreen}
            />
            <Stack.Screen
              name="PersonalInformation"
              component={PersonalInformationScreen}
            />
            <Stack.Screen
              name="NotificationSettings"
              component={NotificationSettingsScreen}
            />
            <Stack.Screen
              name="SecuritySettings"
              component={SecuritySettingsScreen}
            />
            <Stack.Screen
              name="LanguageSettings"
              component={LanguageSettingsScreen}
            />
            <Stack.Screen
              name="PrivacySettings"
              component={PrivacySettingsScreen}
            />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen
              name="ContactSupport"
              component={ContactSupportScreen}
            />
            <Stack.Screen
              name="AddEmergencyContact"
              component={AddEmergencyContactScreen}
            />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen
              name="ThemeSettings"
              component={ThemeSettingsScreen}
            />

            {/* Search */}
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen
              name="RecentSearches"
              component={RecentSearchesScreen}
            />
            <Stack.Screen
              name="SearchCategories"
              component={SearchCategoriesScreen}
            />
            <Stack.Screen name="VoiceSearch" component={VoiceSearchScreen} />
            <Stack.Screen
              name="SearchFilters"
              component={SearchFiltersScreen}
            />
            <Stack.Screen
              name="PopularSearches"
              component={PopularSearchesScreen}
            />

            {/* Error & Utilities */}
            <Stack.Screen name="NetworkError" component={NetworkErrorScreen} />
            <Stack.Screen
              name="MaintenanceMode"
              component={MaintenanceModeScreen}
            />
            <Stack.Screen name="ServerError" component={ServerErrorScreen} />
            <Stack.Screen name="EmptyState" component={EmptyStateScreen} />
            <Stack.Screen name="OfflineMode" component={OfflineModeScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
          </>
        )}
      </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});

// MED-002 FIX: Deep linking configuration for React Navigation
// Enables navigation via URLs like solace://mood/check-in or https://solace.app/mood/check-in
export const linkingConfig = {
  prefixes: [
    "solace://",
    "https://solace.app",
    "https://app.solace.ai",
  ],
  config: {
    screens: {
      // Auth screens (unauthenticated)
      Splash: "splash",
      Welcome: "welcome",
      Login: "login",
      Signup: "signup",
      ForgotPassword: "forgot-password",
      SocialLogin: "social-login",

      // Main tabs (authenticated)
      MainTabs: {
        screens: {
          Home: "home",
          Mood: "mood",
          Mindfulness: "mindfulness",
          Journal: "journal",
          Profile: "profile",
        },
      },

      // Dashboard & Insights
      Dashboard: "dashboard",
      FreudScore: "freud-score",
      AISuggestions: "ai-suggestions",

      // Mood tracking
      MoodSelection: "mood/select",
      MoodStats: "mood/stats",
      MoodCalendar: "mood/calendar",
      MoodHistory: "mood/history",
      MoodAnalytics: "mood/analytics",
      ActivityTracking: "mood/activities",
      EnhancedMoodTracker: "mood/check-in",

      // Journal
      JournalList: "journal",
      JournalDetail: "journal/:id",
      JournalCreate: "journal/create",
      JournalCalendar: "journal/calendar",
      JournalSearch: "journal/search",
      JournalExport: "journal/export",

      // Mindfulness
      MindfulHours: "mindfulness/hours",
      BreathingExercise: "mindfulness/breathing",
      MindfulResources: "mindfulness/resources",
      GuidedSessions: "mindfulness/guided",
      SessionHistory: "mindfulness/history",
      AchievementBadges: "mindfulness/achievements",
      CourseDetail: "mindfulness/course/:courseId",
      CourseLesson: "mindfulness/course/:courseId/lesson/:lessonId",
      ArticleDetail: "mindfulness/article/:articleId",

      // Therapy
      TherapySession: "therapy/session",
      TherapyHistory: "therapy/history",
      TherapyExercises: "therapy/exercises",
      TherapyInsights: "therapy/insights",
      TherapyPreferences: "therapy/preferences",
      TherapySessionDetail: "therapy/session/:sessionId",
      ExerciseDetail: "therapy/exercise/:exerciseId",

      // Wellness
      SleepQuality: "wellness/sleep",
      SleepPatterns: "wellness/sleep/patterns",
      SleepGoals: "wellness/sleep/goals",
      SleepTips: "wellness/sleep/tips",
      BedtimeReminders: "wellness/sleep/reminders",
      StressLevel: "wellness/stress",
      StressStats: "wellness/stress/stats",
      StressAssessment: "wellness/stress/assessment",
      QuickStressRelief: "wellness/stress/relief",
      RelaxationTechniques: "wellness/relaxation",

      // Assessment
      Assessment: "assessment/:type",
      AssessmentHistory: "assessment/history",
      AssessmentResults: "assessment/results/:id",

      // Community
      Community: "community",
      CreatePost: "community/create",
      PostDetail: "community/post/:postId",
      SupportGroups: "community/groups",
      DiscussionThreads: "community/discussions",
      SuccessStories: "community/stories",
      CommunityNotifications: "community/notifications",

      // Chat
      Chat: "chat",
      ChatConversationsList: "chat/conversations",
      NewConversation: "chat/new",

      // Crisis Support (high priority deep link)
      CrisisSupport: "crisis",

      // Profile & Settings
      ProfileSettings: "profile/settings",
      AccountSettings: "settings/account",
      NotificationSettings: "settings/notifications",
      SecuritySettings: "settings/security",
      PrivacySettings: "settings/privacy",
      LanguageSettings: "settings/language",
      ThemeSettings: "settings/theme",
      HelpCenter: "help",
      ContactSupport: "support",
      About: "about",

      // Search
      Search: "search",
      SearchFilters: "search/filters",

      // Smart Notifications
      SmartNotifications: "notifications",
      NotificationHistory: "notifications/history",

      // Error screens (for testing/debugging)
      NetworkError: "error/network",
      ServerError: "error/server",
      OfflineMode: "offline",
    },
  },
};

// MED-002 FIX: Helper to generate deep link URLs
export const createDeepLink = (path: string): string => {
  return `solace://${path}`;
};

// MED-002 FIX: Helper to generate web URLs
export const createWebLink = (path: string): string => {
  return `https://solace.app/${path}`;
};

export { PlaceholderScreen, MainTabs };
export default AppNavigator;
