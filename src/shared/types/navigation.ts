/**
 * Navigation Type Definitions
 * Type-safe navigation for React Navigation v6
 */

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  NavigatorScreenParams,
  CompositeScreenProps,
} from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";

// =============================================================================
// Auth Stack Navigator
// =============================================================================

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Onboarding: {
    userType?: "user" | "professional";
  };
  ProfessionalOnboarding: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  StackScreenProps<AuthStackParamList, T>;

// =============================================================================
// Main Tab Navigator
// =============================================================================

export type MainTabParamList = {
  Dashboard: undefined;
  Mood: {
    highlightEntry?: string;
  };
  Chat: {
    sessionId?: string;
    initialMessage?: string;
  };
  Profile: {
    section?: "settings" | "history" | "preferences";
  };
  Wellness: undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// =============================================================================
// Mood Stack Navigator
// =============================================================================

export type MoodStackParamList = {
  MoodTracker: undefined;
  MoodStats: {
    period?: "week" | "month" | "year";
  };
  EnhancedMoodTracker: undefined;
  MoodDetails: {
    entryId: string;
  };
  MoodHistory: undefined;
};

export type MoodStackScreenProps<T extends keyof MoodStackParamList> =
  CompositeScreenProps<
    StackScreenProps<MoodStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// =============================================================================
// Assessment Stack Navigator
// =============================================================================

export type AssessmentStackParamList = {
  AssessmentList: undefined;
  AssessmentIntro: {
    assessmentId: "phq9" | "gad7" | string;
  };
  AssessmentQuestions: {
    assessmentId: string;
    assessmentTitle: string;
  };
  AssessmentResults: {
    resultId: string;
    assessmentId: string;
  };
  AssessmentHistory: undefined;
};

export type AssessmentStackScreenProps<
  T extends keyof AssessmentStackParamList,
> = CompositeScreenProps<
  StackScreenProps<AssessmentStackParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

// =============================================================================
// Chat Stack Navigator
// =============================================================================

export type ChatStackParamList = {
  ChatList: undefined;
  ChatSession: {
    sessionId?: string;
    sessionTitle?: string;
  };
  ChatHistory: undefined;
};

export type ChatStackScreenProps<T extends keyof ChatStackParamList> =
  CompositeScreenProps<
    StackScreenProps<ChatStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// =============================================================================
// Wellness Stack Navigator
// =============================================================================

export type WellnessStackParamList = {
  WellnessHome: undefined;
  Meditation: {
    meditationId?: string;
  };
  BreathingExercises: undefined;
  JournalEntry: {
    entryId?: string;
    date?: string;
  };
  Resources: {
    category?: "crisis" | "articles" | "videos";
  };
};

export type WellnessStackScreenProps<T extends keyof WellnessStackParamList> =
  CompositeScreenProps<
    StackScreenProps<WellnessStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// =============================================================================
// Settings Stack Navigator
// =============================================================================

export type SettingsStackParamList = {
  SettingsHome: undefined;
  Account: undefined;
  Preferences: undefined;
  Notifications: undefined;
  Privacy: undefined;
  About: undefined;
  ThemeSettings: undefined;
};

export type SettingsStackScreenProps<T extends keyof SettingsStackParamList> =
  CompositeScreenProps<
    StackScreenProps<SettingsStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// =============================================================================
// Root Stack Navigator (Top-level)
// =============================================================================

export type RootStackParamList = {
  // Auth flow
  Auth: NavigatorScreenParams<AuthStackParamList>;

  // Main app
  Main: NavigatorScreenParams<MainTabParamList>;

  // Modal screens (can be opened from anywhere)
  MoodEntry: {
    date?: string;
    entryId?: string;
  };
  Assessment: NavigatorScreenParams<AssessmentStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
  Wellness: NavigatorScreenParams<WellnessStackParamList>;

  // Crisis & Emergency
  CrisisSupport: {
    source?: string;
  };
  EmergencyContacts: undefined;

  // Standalone screens
  Onboarding: {
    userType?: "user" | "professional";
  };
  Placeholder: {
    name: string;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

// =============================================================================
// Navigation Utilities
// =============================================================================

// Type for navigation prop in any screen
export type NavigationProp = RootStackScreenProps<
  keyof RootStackParamList
>["navigation"];

// Type for route prop in any screen
export type RouteProp = RootStackScreenProps<keyof RootStackParamList>["route"];

// Screen component props helper
export type ScreenProps<
  T extends keyof RootStackParamList = keyof RootStackParamList,
> = RootStackScreenProps<T>;

// Navigation state helper
export interface NavigationState {
  index: number;
  routes: {
    key: string;
    name: string;
    params?: object;
    state?: NavigationState;
  }[];
}

// Deep link configuration
export interface DeepLinkConfig {
  screens: {
    [key: string]: string | DeepLinkConfig;
  };
}

// Tab bar configuration
export interface TabBarConfig {
  activeTintColor?: string;
  inactiveTintColor?: string;
  activeBackgroundColor?: string;
  inactiveBackgroundColor?: string;
  showLabel?: boolean;
  showIcon?: boolean;
  labelStyle?: object;
  iconStyle?: object;
}

// Screen options type
export interface ScreenOptions {
  title?: string;
  headerShown?: boolean;
  headerTitle?: string;
  headerBackTitle?: string;
  headerLeft?: () => React.ReactNode;
  headerRight?: () => React.ReactNode;
  headerStyle?: object;
  headerTintColor?: string;
  gestureEnabled?: boolean;
  animationEnabled?: boolean;
  presentation?: "card" | "modal" | "transparentModal";
}

// Navigation helpers
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
