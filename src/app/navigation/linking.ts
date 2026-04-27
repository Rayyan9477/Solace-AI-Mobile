/**
 * Deep Linking Configuration
 * @description React Navigation deep linking configuration for Solace AI Mobile.
 *
 * URL Scheme: solace://
 *
 * Sprint 4 (prototype v4.2 · 2026-04-26): trimmed to the survivor route set
 * after Demolition Pass 2. Sprints 6-9 will re-add deep links for the new
 * prototype-aligned screens (DailyCheckIn, JournalComposer, MeditationPlayer,
 * Paywall, NotificationsInbox, Search, Crisis, etc.).
 *
 * @see https://reactnavigation.org/docs/deep-linking/
 */

import * as Linking from "expo-linking";
import type { LinkingOptions } from "@react-navigation/native";
import type { RootStackParamList } from "../../shared/types/navigation";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    "solace://",
    "https://solace-ai.app",
    "https://*.solace-ai.app",
  ],

  config: {
    screens: {
      AuthFlow: {
        path: "auth",
        screens: {
          Splash: "",
          LoadingProgress: "loading",
          QuoteSplash: "quote",
          WelcomeIntro: "welcome",
          SignIn: "signin",
          ForgotPassword: "forgot-password",
        },
      },

      OnboardingFlow: {
        path: "onboarding",
        screens: {
          ProfileDetails: "profile",
          ProfileEmergencyContact: "emergency-contact",
          ProfileBiometricSetup: "biometric",
          AssessmentIntro: "assessment",
          AssessmentResults: "assessment/results",
        },
      },

      MainFlow: {
        path: "",
        screens: {
          DashboardTab: {
            path: "home",
            screens: {
              HomeDashboard: "",
            },
          },

          MoodTab: {
            path: "mood",
            screens: {
              MoodDashboard: "",
              MoodSelector: "log",
              MoodCalendar: "calendar",
              MoodAnalytics: "analytics",
            },
          },

          ChatTab: {
            path: "chat",
            screens: {
              ChatsList: "",
              ActiveChat: ":conversationId",
            },
          },

          JournalTab: {
            path: "journal",
            screens: {
              JournalList: "",
              CreateJournalEntry: "new",
              EditJournalEntry: "edit/:entryId",
              JournalEntryDetail: ":entryId",
              TextJournalComposer: "compose",
            },
          },

          ProfileTab: {
            path: "profile",
            screens: {
              ProfileDashboard: "",
              AccountSettings: "account",
              ProfileNotificationSettings: "notifications",
            },
          },
        },
      },
    },
  },

  async getInitialURL(): Promise<string | null> {
    return await Linking.getInitialURL();
  },

  subscribe(listener: (url: string) => void): () => void {
    const subscription = Linking.addEventListener("url", ({ url }) => listener(url));
    return () => subscription.remove();
  },
};

/**
 * Screen → path mapping. Used by `generateDeepLink()` for share / push
 * payloads. Trimmed in Sprint 4 to the survivor set.
 */
const screenPaths: Record<string, string> = {
  // Auth screens
  Splash: "auth",
  LoadingProgress: "auth/loading",
  QuoteSplash: "auth/quote",
  WelcomeIntro: "auth/welcome",
  SignIn: "auth/signin",
  ForgotPassword: "auth/forgot-password",

  // Onboarding screens
  ProfileDetails: "onboarding/profile",
  ProfileEmergencyContact: "onboarding/emergency-contact",
  ProfileBiometricSetup: "onboarding/biometric",
  AssessmentIntro: "onboarding/assessment",
  AssessmentResults: "onboarding/assessment/results",

  // Dashboard
  HomeDashboard: "home",

  // Mood
  MoodDashboard: "mood",
  MoodSelector: "mood/log",
  MoodCalendar: "mood/calendar",
  MoodAnalytics: "mood/analytics",

  // Chat
  ChatsList: "chat",
  ActiveChat: "chat/:conversationId",

  // Journal
  JournalList: "journal",
  CreateJournalEntry: "journal/new",
  EditJournalEntry: "journal/edit/:entryId",
  JournalEntryDetail: "journal/:entryId",
  TextJournalComposer: "journal/compose",

  // Profile
  ProfileDashboard: "profile",
  AccountSettings: "profile/account",
  ProfileNotificationSettings: "profile/notifications",

  // NOTE: Sprint 3 removed community/* and resources/*. Sprint 4 removed
  // the over-fragmented assessment/chat/journal/sleep/profile sub-pages.
  // Sprints 6-9 will re-add deep links for new prototype-aligned screens.
};

/**
 * Generate deep link URL for a screen.
 *
 * @example
 * generateDeepLink("ActiveChat", { conversationId: "123" })
 * // → "solace://chat/123"
 */
export function generateDeepLink(screen: string, params?: Record<string, string>): string {
  const baseUrl = "solace://";
  const pathTemplate = screenPaths[screen];

  if (!pathTemplate) {
    return `${baseUrl}${screen.toLowerCase()}`;
  }

  let path = pathTemplate;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, value);
    });
  }

  return `${baseUrl}${path}`;
}

/**
 * Parse deep link URL to navigation state. React Navigation handles this
 * automatically via the `config` block above.
 */
export function parseDeepLink(_url: string): unknown {
  return null;
}
