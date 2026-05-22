/**
 * Navigation Type Definitions
 * @description TypeScript types for React Navigation v6 routes and parameters
 * @module Navigation
 *
 * Sprint 4 (prototype v4.2 migration · 2026-04-26): Slimmed every ParamList
 * down to the routes that survive Demolition Pass 2. New routes for Sprint
 * 6/7/8/9 prototype-aligned screens are added as build deliverables — not in
 * Sprint 4. MindfulStackParamList removed entirely (no live consumer; S6
 * rebuilds Mindful as part of Tab routes).
 *
 * @see https://reactnavigation.org/docs/typescript/
 */

import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

// ============================================================================
// SHARED TYPES
// ============================================================================

/** Common mood types used across the app */
export type MoodType = "happy" | "sad" | "neutral" | "angry" | "anxious";

/** Mental health score status levels */
export type SolaceStatus = "Mentally Stable" | "Needs Attention" | "Critical";

/** Assessment question types (kept for downstream consumers in features/) */
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
// AUTH STACK
// Splash → LoadingProgress → QuoteSplash → WelcomeIntro → SignIn → ForgotPassword
// ============================================================================

export type AuthStackParamList = {
  /** Initial splash screen with logo */
  Splash: undefined;

  /** Loading progress indicator */
  LoadingProgress: undefined;

  /** Quote display during loading */
  QuoteSplash: undefined;

  /** Welcome intro screen */
  WelcomeIntro: undefined;

  /** Sign in (Supabase magic-link in S10; mock in S7) */
  SignIn: undefined;

  /** Forgot password */
  ForgotPassword: undefined;
};

// ============================================================================
// ONBOARDING STACK
// ProfileDetails → EmergencyContact → BiometricSetup → AssessmentIntro → AssessmentResults
// (Assessment question pager is built in S6 with internal pagination — no
// per-question routes anymore.)
// ============================================================================

export type OnboardingStackParamList = {
  /** Profile setup details (consolidates name + birthdate + gender + location) */
  ProfileDetails: undefined;

  /** Emergency contact (deferred S9 move to crisis feature — kept as orphan route) */
  ProfileEmergencyContact: undefined;

  /** Assessment intro */
  AssessmentIntro: undefined;

  /** Single-question route used by the assessment pager (S7) */
  AssessmentQuestion: {
    /** Current step number, 1-based */
    currentStep: number;
    /** Total steps for the assessment */
    totalSteps: number;
  };

  /** Assessment results */
  AssessmentResults: {
    freudScore?: number;
    completedAt?: number;
  };

  /** Goals picker — multi-select 2x4 grid (S7) */
  GoalsPicker: undefined;

  /** Theme picker — 5 cosmic-mood cards (S7) */
  ThemePicker: undefined;

  /** Notification primer — sage CTA + Not now (S7) */
  NotificationPrimer: undefined;

  /** Face ID primer — kept route name `ProfileBiometricSetup` for backward compat */
  ProfileBiometricSetup: undefined;

  /** 4-step OnboardingCarousel (S7) */
  OnboardingCarousel: undefined;
};

// ============================================================================
// DASHBOARD STACK
// HomeDashboard only — Sprint 6 reskins HomeDashboardScreen as Home v2.
// ============================================================================

export type DashboardStackParamList = {
  /** Main dashboard home (Home v2 in S6) */
  HomeDashboard: undefined;
};

// ============================================================================
// MOOD STACK
// MoodDashboard → MoodSelector → MoodCalendar → MoodInsights
// ============================================================================

export type MoodStackParamList = {
  /** Mood dashboard / home */
  MoodDashboard: undefined;

  /** Mood selector (S6 reskin → DailyCheckIn) */
  MoodSelector: {
    /** Whether this is editing an existing entry */
    isEditing?: boolean;
    /** Existing entry ID if editing */
    entryId?: string;
  };

  /** Calendar view */
  MoodCalendar: undefined;

  /** Mood insights (S8 reskin — replaces MoodAnalytics) */
  MoodInsights: undefined;
};

// ============================================================================
// CHAT STACK
// ChatsList → ActiveChat → VoiceSession / SessionSummary / CbtThoughtRecord
// ============================================================================

export type ChatStackParamList = {
  /** Chat list / empty state */
  ChatsList: undefined;

  /** Active chat conversation */
  ActiveChat: {
    /** Conversation ID */
    conversationId: string;
    /** Conversation title */
    title?: string;
  };

  /** Immersive voice session (S8 #25) */
  VoiceSession: undefined;

  /** Post-session recap (S8 #26) */
  SessionSummary: {
    /** Optional session id to load summary for */
    sessionId?: string;
  };

  /** CBT 5-step thought record (S8 #27) */
  CbtThoughtRecord: {
    /** Optional in-progress record id to resume */
    recordId?: string;
  };
};

// ============================================================================
// JOURNAL STACK
// JournalList → JournalEntryDetail (with edit/composer entry points)
// ============================================================================

export type JournalStackParamList = {
  /** Journal entries list */
  JournalList: undefined;

  /** Create new entry (uses TextJournalComposer) */
  CreateJournalEntry: undefined;

  /** Edit existing entry (uses TextJournalComposer) */
  EditJournalEntry: {
    /** Entry ID to edit */
    entryId: string;
  };

  /** Entry detail view */
  JournalEntryDetail: {
    /** Entry ID to view */
    entryId: string;
  };

  /** Text journal composer (canonical route) */
  TextJournalComposer: undefined;
};

// ============================================================================
// SLEEP STACK
// SleepDashboard → SleepInsights
// ============================================================================

export type SleepStackParamList = {
  /** Sleep dashboard */
  SleepDashboard: undefined;

  /** Sleep insights */
  SleepInsights: undefined;
};

// ============================================================================
// MINDFUL STACK (no live navigator yet — wired in S9)
// MindfulnessLibrary → MindfulPlayer → SessionComplete
// ============================================================================

export type MindfulStackParamList = {
  /** Mindfulness library / browse view */
  MindfulnessLibrary: undefined;

  /** Active session player */
  MindfulPlayer: {
    /** Session id to play */
    sessionId: string;
  };

  /** Breathing exercise active session */
  BreathingExerciseActive: {
    /** Breathing pattern id (e.g. "4-7-8") */
    patternId?: string;
  };

  /** End-of-session celebration modal */
  SessionComplete: {
    /** Minutes for the completed session */
    sessionMinutes?: number;
    /** Title displayed in the celebration */
    sessionTitle?: string;
  };

  /** Soundscape browser */
  Soundscapes: undefined;
};

// ============================================================================
// SEARCH STACK (no live navigator yet — wired in S9)
// ============================================================================

export type SearchStackParamList = {
  /** Search results (single screen with internal states) */
  SearchResults: {
    /** Search query */
    query: string;
    /** Result type filter */
    filter?: "all" | "articles" | "posts" | "courses";
  };
};

// ============================================================================
// NOTIFICATIONS STACK
// NotificationsInbox → NotificationSettings (+ NotificationDetail modal)
// ============================================================================

export type NotificationsStackParamList = {
  /** Notifications inbox */
  NotificationsInbox: undefined;

  /** Notification settings */
  NotificationSettings: undefined;

  /** Notification detail */
  NotificationDetail: {
    /** Notification ID */
    notificationId: string;
  };
};

// ============================================================================
// PROFILE STACK
// ProfileDashboard → AccountSettings → ProfileNotificationSettings
// ============================================================================

export type ProfileStackParamList = {
  /** Profile dashboard */
  ProfileDashboard: undefined;

  /** Account settings */
  AccountSettings: undefined;

  /** Notification settings (mounted under profile too) */
  ProfileNotificationSettings: undefined;
};

// ============================================================================
// ERROR STACK
// Error and utility screens — kept as-is for S9 reskin.
// ============================================================================

export type ErrorStackParamList = {
  /** 404 Not Found */
  Error404: undefined;

  /** 500 Server Error */
  Error500: undefined;

  /** No Connection / Offline state */
  NoConnection: undefined;

  /** Maintenance Mode */
  Maintenance: {
    /** Estimated time until service restored */
    estimatedTime?: string;
  };

  /** 403 Forbidden */
  Forbidden: undefined;
};

// ============================================================================
// MAIN TAB NAVIGATOR
// Bottom navigation tabs
// ============================================================================

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

export type CrisisStackParamList = {
  /** Cosmic crisis support hub (prototype #12) */
  CrisisSupport: undefined;
  /** Legacy crisis-pattern detection alert from journal AI */
  CrisisSupportAlert: undefined;
  /** Emergency contact form */
  EmergencyContact: undefined;
};

export type RootStackParamList = {
  /** Auth flow */
  AuthFlow: NavigatorScreenParams<AuthStackParamList>;

  /** Onboarding flow */
  OnboardingFlow: NavigatorScreenParams<OnboardingStackParamList>;

  /** Main app flow */
  MainFlow: NavigatorScreenParams<MainTabParamList>;

  /** Sleep feature modal flow */
  SleepModal: NavigatorScreenParams<SleepStackParamList>;

  /** Notifications modal flow */
  NotificationsModal: NavigatorScreenParams<NotificationsStackParamList>;

  /** Mindful sessions modal flow (S9) */
  MindfulModal: NavigatorScreenParams<MindfulStackParamList>;

  /** Search modal flow (S9) */
  SearchModal: NavigatorScreenParams<SearchStackParamList>;

  /** Crisis support modal — root-mounted, reachable from any screen (S9) */
  CrisisModal: NavigatorScreenParams<CrisisStackParamList>;
};

// ============================================================================
// SCREEN PROPS TYPE HELPERS
// ============================================================================

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type OnboardingScreenProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>;

export type DashboardScreenProps<T extends keyof DashboardStackParamList> =
  NativeStackScreenProps<DashboardStackParamList, T>;

export type MoodScreenProps<T extends keyof MoodStackParamList> = NativeStackScreenProps<
  MoodStackParamList,
  T
>;

export type ChatScreenProps<T extends keyof ChatStackParamList> = NativeStackScreenProps<
  ChatStackParamList,
  T
>;

export type JournalScreenProps<T extends keyof JournalStackParamList> = NativeStackScreenProps<
  JournalStackParamList,
  T
>;

export type SleepScreenProps<T extends keyof SleepStackParamList> = NativeStackScreenProps<
  SleepStackParamList,
  T
>;

export type SearchScreenProps<T extends keyof SearchStackParamList> = NativeStackScreenProps<
  SearchStackParamList,
  T
>;

export type NotificationsScreenProps<T extends keyof NotificationsStackParamList> =
  NativeStackScreenProps<NotificationsStackParamList, T>;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> = NativeStackScreenProps<
  ProfileStackParamList,
  T
>;

export type ErrorScreenProps<T extends keyof ErrorStackParamList> = NativeStackScreenProps<
  ErrorStackParamList,
  T
>;

export type TabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

// ============================================================================
// NAVIGATION PROP HELPERS
// ============================================================================

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
