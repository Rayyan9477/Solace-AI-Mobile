/**
 * Navigation Type Definitions
 * @description TypeScript types for React Navigation v6 routes and parameters
 * @module Navigation
 *
 * This file defines all navigation stacks, their screens, and route parameters.
 * Following React Navigation v6 best practices for type safety.
 *
 * @see https://reactnavigation.org/docs/typescript/
 */

import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

// ============================================================================
// SHARED TYPES
// ============================================================================

/**
 * Common mood types used across the app
 */
export type MoodType = "happy" | "sad" | "neutral" | "angry" | "anxious";

/**
 * Mental health score status levels
 */
export type SolaceStatus = "Mentally Stable" | "Needs Attention" | "Critical";

/**
 * Assessment question types
 */
export type AssessmentQuestionType =
  | "primary-concern"
  | "age"
  | "weight"
  | "mood"
  | "stress-triggers"
  | "mental-state"
  | "sadness-frequency"
  | "medications"
  | "therapist"
  | "exercise";

// ============================================================================
// AUTH STACK (Unauthenticated Flow)
// Screens 1-14: Splash → Welcome → SignIn/SignUp
// ============================================================================

/**
 * Auth Stack Parameter List
 * @description Navigation params for unauthenticated user flow
 */
export type AuthStackParamList = {
  /** Screen 1: Initial splash screen with logo */
  Splash: undefined;

  /** Screen 2: Loading progress indicator */
  LoadingProgress: undefined;

  /** Screen 3: Quote display during loading */
  QuoteSplash: undefined;

  /** Screen 4: Data fetching status */
  FetchingData: undefined;

  /** Screen 5: Welcome intro screen */
  WelcomeIntro: undefined;

  /** Screen 6: Onboarding Step 1 - AI Personalization */
  OnboardingStep1: undefined;

  /** Screen 7: Onboarding Step 2 - Mood Tracking */
  OnboardingStep2: undefined;

  /** Screen 8: Onboarding Step 3 - Journaling */
  OnboardingStep3: undefined;

  /** Screen 9: Onboarding Step 4 - Mindful Resources */
  OnboardingStep4: undefined;

  /** Screen 10: Onboarding Step 5 - Community */
  OnboardingStep5: undefined;

  /** Screen 11: Sign In */
  SignIn: undefined;

  /** Screen 12: Sign Up */
  SignUp: undefined;

  /** Screen 13: Forgot Password */
  ForgotPassword: undefined;

  /** Screen 14: Verification Email Sent */
  VerificationSent: {
    /** Email address where verification was sent */
    email: string;
  };
};

// ============================================================================
// ONBOARDING STACK (First-Time User Setup)
// Screens 15-39: Profile Setup → Assessment
// ============================================================================

/**
 * Onboarding Stack Parameter List
 * @description Navigation params for first-time user onboarding flow
 */
export type OnboardingStackParamList = {
  // Profile Setup Screens (15-25)
  /** Screen 15: Profile setup welcome */
  ProfileSetupWelcome: undefined;

  /** Screen 16: Name input */
  ProfileNameInput: undefined;

  /** Screen 17: Birth date picker */
  ProfileBirthDate: undefined;

  /** Screen 18: Gender selection */
  ProfileGender: undefined;

  /** Screen 19: Location selection */
  ProfileLocation: undefined;

  /** Screen 20: Occupation input */
  ProfileOccupation: undefined;

  /** Screen 21: Avatar selection */
  ProfileAvatar: undefined;

  /** Screen 22: Password setup */
  ProfilePasswordSetup: undefined;

  /** Screen 23: OTP verification */
  ProfileOTPVerification: {
    /** Phone number for OTP */
    phoneNumber: string;
  };

  /** Screen 24: Emergency contact */
  ProfileEmergencyContact: undefined;

  /** Screen 25: Biometric security setup */
  ProfileBiometricSetup: undefined;

  // Mental Health Assessment Screens (26-39)
  /** Screen 26: Assessment intro */
  AssessmentIntro: undefined;

  /** Screen 27: Primary concern */
  AssessmentPrimaryConcern: undefined;

  /** Screen 28: Age entry */
  AssessmentAge: undefined;

  /** Screen 29: Weight entry */
  AssessmentWeight: undefined;

  /** Screen 30: Mood selection */
  AssessmentMood: undefined;

  /** Screen 31: Stress triggers */
  AssessmentStressTriggers: undefined;

  /** Screen 32: Mental state */
  AssessmentMentalState: undefined;

  /** Screen 33: Sadness frequency */
  AssessmentSadnessFrequency: undefined;

  /** Screen 34: Medications yes/no */
  AssessmentMedicationsQuestion: undefined;

  /** Screen 35: Medication details */
  AssessmentMedicationDetails: undefined;

  /** Screen 36: Have therapist */
  AssessmentTherapist: undefined;

  /** Screen 37: Exercise frequency */
  AssessmentExercise: undefined;

  /** Screen 38: Score analysis (loading) */
  AssessmentScoreAnalysis: undefined;

  /** Screen 39: Results display */
  AssessmentResults: {
    /** Calculated Freud Score */
    freudScore: number;
    /** Assessment completion timestamp */
    completedAt: Date;
  };
};

// ============================================================================
// DASHBOARD STACK
// Home/Dashboard feature screens
// ============================================================================

/**
 * Dashboard Stack Parameter List
 * @description Navigation params for home dashboard screens
 */
export type DashboardStackParamList = {
  /** Screen 40: Main dashboard home */
  HomeDashboard: undefined;

  /** Screen 41: Freud Score detail */
  SolaceScoreDetail: undefined;

  /** Screen 42: Score insights & analysis */
  SolaceScoreInsights: undefined;

  /** Screen 43: AI suggestions */
  AISuggestions: undefined;

  /** Screen 44: Mindfulness activities */
  MindfulnessActivities: undefined;

  /** Screen 45: Score history/trends */
  ScoreHistory: undefined;

  /** Screen 46: Celebration modal for score increase */
  SolaceScoreIncrease: {
    /** Previous score */
    previousScore: number;
    /** New score */
    newScore: number;
  };
};

// ============================================================================
// MOOD STACK
// Mood tracking feature screens
// ============================================================================

/**
 * Mood Stack Parameter List
 * @description Navigation params for mood tracking screens
 */
export type MoodStackParamList = {
  /** Screen 47: Mood dashboard/home */
  MoodDashboard: undefined;

  /** Screen 48: Mood selector */
  MoodSelector: {
    /** Whether this is editing an existing entry */
    isEditing?: boolean;
    /** Existing entry ID if editing */
    entryId?: string;
  };

  /** Screen 49: Mood history list */
  MoodHistory: undefined;

  /** Screen 50: Calendar view */
  MoodCalendar: undefined;

  /** Screen 51: Analytics charts */
  MoodAnalytics: undefined;

  /** Screen 52: AI mood suggestions */
  MoodAISuggestions: undefined;
};

// ============================================================================
// CHAT STACK
// AI Therapy Chatbot feature screens
// ============================================================================

/**
 * Chat Stack Parameter List
 * @description Navigation params for AI chatbot screens
 */
export type ChatStackParamList = {
  /** Screen 53: Chat list/empty state */
  ChatsList: undefined;

  /** Screen 54: Active chat conversation */
  ActiveChat: {
    /** Conversation ID */
    conversationId: string;
    /** Conversation title */
    title?: string;
  };

  /** Screen 55: New conversation setup */
  NewConversation: undefined;

  /** Screen 56: Chatbot limitations info */
  ChatbotLimitations: undefined;

  /** Screen 57: Voice input screen */
  VoiceInput: {
    /** Conversation ID for voice message */
    conversationId: string;
  };

  /** Screen 58: Expression analysis (camera) */
  ExpressionAnalysis: {
    /** Conversation ID */
    conversationId: string;
  };

  /** Screen 59: Expression analysis results */
  ExpressionAnalysisResults: {
    /** Analysis results data */
    results: {
      emotion: string;
      confidence: number;
      recommendations: string[];
    };
  };

  /** Screen 60: Book recommendations */
  BookRecommendations: undefined;

  /** Screen 61: Sleep quality chart */
  SleepQualityChart: {
    /** Date range start */
    startDate: Date;
    /** Date range end */
    endDate: Date;
  };

  /** Screen 62: Freud Score trend chart */
  FreudScoreChart: undefined;

  /** Screen 63: Crisis support alert */
  CrisisSupportAlert: {
    /** Source of crisis detection */
    triggerSource: "assessment" | "journal" | "chat" | "score";
  };
};

// ============================================================================
// JOURNAL STACK
// Mental health journal feature screens
// ============================================================================

/**
 * Journal Stack Parameter List
 * @description Navigation params for journal screens
 */
export type JournalStackParamList = {
  /** Screen 64: Journal entries list */
  JournalList: undefined;

  /** Screen 65: Create new entry */
  CreateJournalEntry: undefined;

  /** Screen 66: Edit existing entry */
  EditJournalEntry: {
    /** Entry ID to edit */
    entryId: string;
  };

  /** Screen 67: Voice journal recording */
  VoiceJournalRecording: undefined;

  /** Screen 68: Entry detail view */
  JournalEntryDetail: {
    /** Entry ID to view */
    entryId: string;
  };

  /** Screen 69: Journal calendar view */
  JournalCalendar: undefined;

  /** Screen 70: Journal insights/stats */
  JournalInsights: undefined;

  /** Screen 71: Text journal composer */
  TextJournalComposer: undefined;

  /** Screen 72: Delete confirmation */
  DeleteJournalConfirmation: {
    /** Entry ID to delete */
    entryId: string;
  };
};

// ============================================================================
// SLEEP STACK
// Sleep quality tracking screens
// ============================================================================

/**
 * Sleep Stack Parameter List
 * @description Navigation params for sleep tracking screens
 */
export type SleepStackParamList = {
  /** Screen 73: Sleep dashboard */
  SleepDashboard: undefined;

  /** Screen 74: Sleep schedule setup */
  SleepSchedule: undefined;

  /** Screen 75: Sleep stages visualization */
  SleepStages: {
    /** Date for sleep data */
    date: Date;
  };

  /** Screen 76: Sleep calendar */
  SleepCalendar: undefined;

  /** Screen 77: Sleep insights */
  SleepInsights: undefined;

  /** Screen 78: Sleep quality increase celebration */
  SleepQualityIncrease: {
    /** Previous quality score */
    previousScore: number;
    /** New quality score */
    newScore: number;
  };

  /** Screen 79: Sleep data entry */
  LogSleepData: undefined;

  /** Screen 80: Sleep reminders setup */
  SleepReminders: undefined;

  /** Screen 81: Sleep history trends */
  SleepHistory: undefined;

  /** Screen 82: Sleep AI suggestions */
  SleepAISuggestions: undefined;
};

// ============================================================================
// STRESS STACK
// Stress management screens
// ============================================================================

/**
 * Stress Stack Parameter List
 * @description Navigation params for stress management screens
 */
export type StressStackParamList = {
  /** Screen 83: Stress dashboard */
  StressDashboard: undefined;

  /** Screen 84: Stress level assessment */
  StressAssessment: undefined;

  /** Screen 85: Stress triggers identification */
  StressTriggers: undefined;

  /** Screen 86: Coping strategies */
  CopingStrategies: undefined;

  /** Screen 87: Quick relief exercises */
  QuickRelief: undefined;

  /** Screen 88: Stress trends analysis */
  StressTrends: undefined;

  /** Screen 89: Breathing exercise */
  BreathingExercise: undefined;
};

// ============================================================================
// MINDFUL STACK
// Mindfulness/meditation screens
// ============================================================================

/**
 * Mindful Stack Parameter List
 * @description Navigation params for mindfulness screens
 */
export type MindfulStackParamList = {
  /** Screen 90: Mindful hours dashboard */
  MindfulDashboard: undefined;

  /** Screen 91: Session setup wizard */
  SessionSetup: undefined;

  /** Screen 92: Active meditation session */
  ActiveSession: {
    /** Session duration in minutes */
    duration: number;
    /** Selected soundscape */
    soundscape?: string;
    /** Session goal */
    goal: string;
  };

  /** Screen 93: Session complete */
  SessionComplete: {
    /** Session duration completed */
    duration: number;
    /** Freud score change */
    scoreChange: number;
  };

  /** Screen 94: Mindful hours analytics */
  MindfulAnalytics: undefined;

  /** Screen 95: Soundscape library */
  SoundscapeLibrary: undefined;

  /** Screen 96: Meditation timer */
  MeditationTimer: undefined;

  /** Screen 97: Breathing exercises */
  BreathingExercises: undefined;

  /** Screen 98: Session history */
  SessionHistory: undefined;
};

// ============================================================================
// RESOURCES STACK
// Educational resources and courses
// ============================================================================

/**
 * Resources Stack Parameter List
 * @description Navigation params for educational resources
 */
export type ResourcesStackParamList = {
  /** Screen 99: Resources home */
  ResourcesHome: undefined;

  /** Screen 100: Articles list */
  ArticlesList: {
    /** Filter by category */
    category?: string;
  };

  /** Screen 101: Article detail */
  ArticleDetail: {
    /** Article ID */
    articleId: string;
  };

  /** Screen 102: Courses list */
  CoursesList: undefined;

  /** Screen 103: Course detail */
  CourseDetail: {
    /** Course ID */
    courseId: string;
  };

  /** Screen 104: Video player */
  VideoPlayer: {
    /** Video ID */
    videoId: string;
    /** Video title */
    title: string;
  };

  /** Screen 105: Bookmarks/saved */
  Bookmarks: undefined;

  /** Screen 106: Resource search */
  ResourceSearch: undefined;
};

// ============================================================================
// COMMUNITY STACK
// Community support and social features
// ============================================================================

/**
 * Community Stack Parameter List
 * @description Navigation params for community screens
 */
export type CommunityStackParamList = {
  /** Screen 107: Community welcome */
  CommunityWelcome: undefined;

  /** Screen 108: Community feed */
  CommunityFeed: {
    /** Filter by category */
    filter?: string;
  };

  /** Screen 109: Post detail */
  PostDetail: {
    /** Post ID */
    postId: string;
  };

  /** Screen 110: Create new post */
  CreatePost: undefined;

  /** Screen 111: User profile */
  UserProfile: {
    /** User ID */
    userId: string;
  };

  /** Screen 112: Success stories */
  SuccessStories: undefined;

  /** Screen 113: Support groups */
  SupportGroups: undefined;

  /** Screen 114: Community chatbot */
  CommunityChatbot: undefined;

  /** Screen 115: Post categories */
  PostCategories: undefined;

  /** Screen 116: Community notifications */
  CommunityNotifications: undefined;
};

// ============================================================================
// SEARCH STACK
// Global search functionality
// ============================================================================

/**
 * Search Stack Parameter List
 * @description Navigation params for search screens
 */
export type SearchStackParamList = {
  /** Screen 117: Search loading state */
  SearchLoading: {
    /** Search query */
    query: string;
  };

  /** Screen 118: No results */
  SearchNoResults: {
    /** Search query */
    query: string;
  };

  /** Screen 119: Search results */
  SearchResults: {
    /** Search query */
    query: string;
    /** Result type filter */
    filter?: "all" | "articles" | "posts" | "courses";
  };
};

// ============================================================================
// NOTIFICATIONS STACK
// Smart notifications and alerts
// ============================================================================

/**
 * Notifications Stack Parameter List
 * @description Navigation params for notification screens
 */
export type NotificationsStackParamList = {
  /** Screen 120: Notifications inbox */
  NotificationsInbox: undefined;

  /** Screen 121: Notification settings */
  NotificationSettings: undefined;

  /** Screen 122: Notification detail */
  NotificationDetail: {
    /** Notification ID */
    notificationId: string;
  };

  /** Screen 123: Mood transition alert */
  MoodTransitionAlert: {
    /** Previous mood */
    previousMood: MoodType;
    /** New mood */
    newMood: MoodType;
  };

  /** Screen 124: Freud Score increase */
  FreudScoreIncreaseNotification: {
    /** Previous score */
    previousScore: number;
    /** New score */
    newScore: number;
  };

  /** Screen 125: Critical score warning */
  CriticalScoreWarning: {
    /** Current score */
    score: number;
  };

  /** Screen 126: Sleep quality increase */
  SleepQualityIncreaseNotification: {
    /** Previous quality */
    previousQuality: number;
    /** New quality */
    newQuality: number;
  };
};

// ============================================================================
// PROFILE STACK
// User profile and settings
// ============================================================================

/**
 * Profile Stack Parameter List
 * @description Navigation params for profile and settings screens
 */
export type ProfileStackParamList = {
  /** Screen 127: Profile dashboard */
  ProfileDashboard: undefined;

  /** Screen 128: Account settings */
  AccountSettings: undefined;

  /** Screen 129: Personal information */
  PersonalInformation: undefined;

  /** Screen 130: Notification settings */
  ProfileNotificationSettings: undefined;

  /** Screen 131: Security settings */
  SecuritySettings: undefined;

  /** Screen 132: Linked devices */
  LinkedDevices: undefined;

  /** Screen 133: Language settings */
  Languages: undefined;

  /** Screen 134: Help center */
  HelpCenter: undefined;

  /** Screen 135: Help center live chat */
  HelpCenterLiveChat: undefined;

  /** Screen 136: Send feedback */
  SendFeedback: undefined;

  /** Screen 137: Invite friends */
  InviteFriends: undefined;

  /** Screen 138: About company */
  AboutCompany: undefined;

  /** Screen 139: Live chat support */
  LiveChatSupport: undefined;
};

// ============================================================================
// ERROR STACK
// Error and utility screens
// ============================================================================

/**
 * Error Stack Parameter List
 * @description Navigation params for error and utility screens
 */
export type ErrorStackParamList = {
  /** Screen 140: 404 Not Found */
  Error404: undefined;

  /** Screen 141: 500 Server Error */
  Error500: undefined;

  /** Screen 142: No Connection */
  NoConnection: undefined;

  /** Screen 143: Maintenance Mode */
  Maintenance: {
    /** Estimated time until service restored */
    estimatedTime?: string;
  };

  /** Screen 144: 403 Forbidden */
  Forbidden: undefined;
};

// ============================================================================
// MAIN TAB NAVIGATOR
// Bottom navigation tabs
// ============================================================================

/**
 * Main Tab Parameter List
 * @description Bottom tab navigation params
 */
export type MainTabParamList = {
  /** Dashboard tab */
  DashboardTab: NavigatorScreenParams<DashboardStackParamList>;

  /** Mood tab */
  MoodTab: NavigatorScreenParams<MoodStackParamList>;

  /** Chat tab */
  ChatTab: NavigatorScreenParams<ChatStackParamList>;

  /** Journal tab */
  JournalTab: NavigatorScreenParams<JournalStackParamList>;

  /** Profile tab */
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// ============================================================================
// ROOT NAVIGATOR
// Top-level navigation
// ============================================================================

/**
 * Root Stack Parameter List
 * @description Top-level navigation params including all flows
 */
export type RootStackParamList = {
  /** Auth flow */
  AuthFlow: NavigatorScreenParams<AuthStackParamList>;

  /** Onboarding flow */
  OnboardingFlow: NavigatorScreenParams<OnboardingStackParamList>;

  /** Main app flow */
  MainFlow: NavigatorScreenParams<MainTabParamList>;

  /** Modal Screens (not part of nested navigators) */
  SearchModal: NavigatorScreenParams<SearchStackParamList>;
  NotificationsModal: NavigatorScreenParams<NotificationsStackParamList>;
  CommunityModal: NavigatorScreenParams<CommunityStackParamList>;
  ResourcesModal: NavigatorScreenParams<ResourcesStackParamList>;
  SleepModal: NavigatorScreenParams<SleepStackParamList>;
  StressModal: NavigatorScreenParams<StressStackParamList>;
  MindfulModal: NavigatorScreenParams<MindfulStackParamList>;
  ErrorModal: NavigatorScreenParams<ErrorStackParamList>;
};

// ============================================================================
// SCREEN PROPS TYPE HELPERS
// Convenient type helpers for screen components
// ============================================================================

/**
 * Auth Screen Props Helper
 * @description Type helper for auth stack screens
 * @example
 * ```typescript
 * type Props = AuthScreenProps<'SignIn'>;
 * ```
 */
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

/**
 * Onboarding Screen Props Helper
 * @description Type helper for onboarding stack screens
 */
export type OnboardingScreenProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>;

/**
 * Dashboard Screen Props Helper
 * @description Type helper for dashboard stack screens
 */
export type DashboardScreenProps<T extends keyof DashboardStackParamList> =
  NativeStackScreenProps<DashboardStackParamList, T>;

/**
 * Mood Screen Props Helper
 * @description Type helper for mood stack screens
 */
export type MoodScreenProps<T extends keyof MoodStackParamList> = NativeStackScreenProps<
  MoodStackParamList,
  T
>;

/**
 * Chat Screen Props Helper
 * @description Type helper for chat stack screens
 */
export type ChatScreenProps<T extends keyof ChatStackParamList> = NativeStackScreenProps<
  ChatStackParamList,
  T
>;

/**
 * Journal Screen Props Helper
 * @description Type helper for journal stack screens
 */
export type JournalScreenProps<T extends keyof JournalStackParamList> = NativeStackScreenProps<
  JournalStackParamList,
  T
>;

/**
 * Sleep Screen Props Helper
 * @description Type helper for sleep stack screens
 */
export type SleepScreenProps<T extends keyof SleepStackParamList> = NativeStackScreenProps<
  SleepStackParamList,
  T
>;

/**
 * Stress Screen Props Helper
 * @description Type helper for stress stack screens
 */
export type StressScreenProps<T extends keyof StressStackParamList> = NativeStackScreenProps<
  StressStackParamList,
  T
>;

/**
 * Mindful Screen Props Helper
 * @description Type helper for mindful stack screens
 */
export type MindfulScreenProps<T extends keyof MindfulStackParamList> = NativeStackScreenProps<
  MindfulStackParamList,
  T
>;

/**
 * Resources Screen Props Helper
 * @description Type helper for resources stack screens
 */
export type ResourcesScreenProps<T extends keyof ResourcesStackParamList> =
  NativeStackScreenProps<ResourcesStackParamList, T>;

/**
 * Community Screen Props Helper
 * @description Type helper for community stack screens
 */
export type CommunityScreenProps<T extends keyof CommunityStackParamList> =
  NativeStackScreenProps<CommunityStackParamList, T>;

/**
 * Search Screen Props Helper
 * @description Type helper for search stack screens
 */
export type SearchScreenProps<T extends keyof SearchStackParamList> = NativeStackScreenProps<
  SearchStackParamList,
  T
>;

/**
 * Notifications Screen Props Helper
 * @description Type helper for notifications stack screens
 */
export type NotificationsScreenProps<T extends keyof NotificationsStackParamList> =
  NativeStackScreenProps<NotificationsStackParamList, T>;

/**
 * Profile Screen Props Helper
 * @description Type helper for profile stack screens
 */
export type ProfileScreenProps<T extends keyof ProfileStackParamList> = NativeStackScreenProps<
  ProfileStackParamList,
  T
>;

/**
 * Error Screen Props Helper
 * @description Type helper for error stack screens
 */
export type ErrorScreenProps<T extends keyof ErrorStackParamList> = NativeStackScreenProps<
  ErrorStackParamList,
  T
>;

/**
 * Tab Screen Props Helper
 * @description Type helper for bottom tab screens
 */
export type TabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

/**
 * Root Screen Props Helper
 * @description Type helper for root navigator screens
 */
export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

// ============================================================================
// NAVIGATION PROP HELPERS
// Direct access to navigation prop types
// ============================================================================

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
