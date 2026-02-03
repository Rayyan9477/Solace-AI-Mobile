/**
 * Deep Linking Configuration
 * @description React Navigation deep linking configuration for Solace AI Mobile
 * @module Navigation
 *
 * URL Scheme: solace://
 *
 * Example URLs:
 * - solace://auth/signin
 * - solace://mood/log
 * - solace://chat/conversation-123
 * - solace://journal/entry-456
 * - solace://profile/settings
 *
 * @see https://reactnavigation.org/docs/deep-linking/
 */

import type { LinkingOptions } from "@react-navigation/native";
import type { RootStackParamList } from "../../shared/types/navigation";

/**
 * Linking Configuration
 * Maps URL patterns to navigation routes
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    "solace://", // Custom URL scheme
    "https://solace-ai.app", // Universal links (production)
    "https://*.solace-ai.app", // Wildcard for subdomains
  ],

  config: {
    screens: {
      // Auth Flow
      AuthFlow: {
        path: "auth",
        screens: {
          Splash: "",
          LoadingProgress: "loading",
          QuoteSplash: "quote",
          FetchingData: "fetching",
          WelcomeIntro: "welcome",
          OnboardingStep1: "onboarding/step-1",
          OnboardingStep2: "onboarding/step-2",
          OnboardingStep3: "onboarding/step-3",
          OnboardingStep4: "onboarding/step-4",
          OnboardingStep5: "onboarding/step-5",
          SignIn: "signin",
          SignUp: "signup",
          ForgotPassword: "forgot-password",
          VerificationSent: "verification-sent",
        },
      },

      // Onboarding Flow
      OnboardingFlow: {
        path: "onboarding",
        screens: {
          ProfileSetupWelcome: "welcome",
          ProfileNameInput: "name",
          ProfileBirthDate: "birth-date",
          ProfileGender: "gender",
          ProfileLocation: "location",
          ProfileOccupation: "occupation",
          ProfileAvatar: "avatar",
          ProfilePasswordSetup: "password",
          ProfileOTPVerification: "otp-verification",
          ProfileEmergencyContact: "emergency-contact",
          ProfileBiometricSetup: "biometric",
          AssessmentIntro: "assessment",
          AssessmentPrimaryConcern: "assessment/concern",
          AssessmentAge: "assessment/age",
          AssessmentWeight: "assessment/weight",
          AssessmentMood: "assessment/mood",
          AssessmentStressTriggers: "assessment/stress",
          AssessmentMentalState: "assessment/mental-state",
          AssessmentSadnessFrequency: "assessment/sadness",
          AssessmentMedicationsQuestion: "assessment/medications",
          AssessmentMedicationDetails: "assessment/medications/details",
          AssessmentTherapist: "assessment/therapist",
          AssessmentExercise: "assessment/exercise",
          AssessmentScoreAnalysis: "assessment/analyzing",
          AssessmentResults: "assessment/results",
        },
      },

      // Main App Flow
      MainFlow: {
        path: "",
        screens: {
          // Dashboard Tab
          DashboardTab: {
            path: "home",
            screens: {
              HomeDashboard: "",
              SolaceScoreDetail: "score",
              SolaceScoreInsights: "score/insights",
              AISuggestions: "suggestions",
              MindfulnessActivities: "mindfulness",
              ScoreHistory: "score/history",
              SolaceScoreIncrease: "score/increase",
            },
          },

          // Mood Tab
          MoodTab: {
            path: "mood",
            screens: {
              MoodDashboard: "",
              MoodSelector: "log",
              MoodHistory: "history",
              MoodCalendar: "calendar",
              MoodAnalytics: "analytics",
              MoodAISuggestions: "suggestions",
            },
          },

          // Chat Tab
          ChatTab: {
            path: "chat",
            screens: {
              ChatsList: "",
              ActiveChat: ":conversationId",
              NewConversation: "new",
              ChatbotLimitations: "limitations",
              VoiceInput: "voice/:conversationId",
              ExpressionAnalysis: "expression/:conversationId",
              ExpressionAnalysisResults: "expression/results",
              BookRecommendations: "books",
              SleepQualityChart: "sleep-chart",
              FreudScoreChart: "score-chart",
              CrisisSupportAlert: "crisis",
            },
          },

          // Journal Tab
          JournalTab: {
            path: "journal",
            screens: {
              JournalList: "",
              CreateJournalEntry: "new",
              EditJournalEntry: "edit/:entryId",
              VoiceJournalRecording: "voice",
              JournalEntryDetail: ":entryId",
              JournalCalendar: "calendar",
              JournalInsights: "insights",
              TextJournalComposer: "compose",
              DeleteJournalConfirmation: "delete/:entryId",
            },
          },

          // Profile Tab
          ProfileTab: {
            path: "profile",
            screens: {
              ProfileDashboard: "",
              AccountSettings: "account",
              PersonalInformation: "personal-info",
              ProfileNotificationSettings: "notifications",
              SecuritySettings: "security",
              LinkedDevices: "devices",
              Languages: "languages",
              HelpCenter: "help",
              HelpCenterLiveChat: "help/chat",
              SendFeedback: "feedback",
              InviteFriends: "invite",
              AboutCompany: "about",
              LiveChatSupport: "support",
            },
          },
        },
      },

      // Modal Screens (Top-level modals)
      SearchModal: {
        path: "search",
        screens: {
          SearchLoading: "loading",
          SearchNoResults: "no-results",
          SearchResults: "results",
        },
      },

      NotificationsModal: {
        path: "notifications",
        screens: {
          NotificationsInbox: "",
          NotificationSettings: "settings",
          NotificationDetail: ":notificationId",
          MoodTransitionAlert: "mood-transition",
          FreudScoreIncreaseNotification: "score-increase",
          CriticalScoreWarning: "critical-score",
          SleepQualityIncreaseNotification: "sleep-increase",
        },
      },

      CommunityModal: {
        path: "community",
        screens: {
          CommunityWelcome: "",
          CommunityFeed: "feed",
          PostDetail: "post/:postId",
          CreatePost: "new",
          UserProfile: "user/:userId",
          SuccessStories: "stories",
          SupportGroups: "groups",
          CommunityChatbot: "chatbot",
          PostCategories: "categories",
          CommunityNotifications: "notifications",
        },
      },

      ResourcesModal: {
        path: "resources",
        screens: {
          ResourcesHome: "",
          ArticlesList: "articles",
          ArticleDetail: "article/:articleId",
          CoursesList: "courses",
          CourseDetail: "course/:courseId",
          VideoPlayer: "video/:videoId",
          Bookmarks: "bookmarks",
          ResourceSearch: "search",
        },
      },

      SleepModal: {
        path: "sleep",
        screens: {
          SleepDashboard: "",
          SleepSchedule: "schedule",
          SleepStages: "stages",
          SleepCalendar: "calendar",
          SleepInsights: "insights",
          SleepQualityIncrease: "increase",
          LogSleepData: "log",
          SleepReminders: "reminders",
          SleepHistory: "history",
          SleepAISuggestions: "suggestions",
        },
      },

      StressModal: {
        path: "stress",
        screens: {
          StressDashboard: "",
          StressAssessment: "assessment",
          StressTriggers: "triggers",
          CopingStrategies: "coping",
          QuickRelief: "relief",
          StressTrends: "trends",
          BreathingExercise: "breathing",
        },
      },

      MindfulModal: {
        path: "mindful",
        screens: {
          MindfulDashboard: "",
          SessionSetup: "setup",
          ActiveSession: "session",
          SessionComplete: "complete",
          MindfulAnalytics: "analytics",
          SoundscapeLibrary: "soundscapes",
          MeditationTimer: "timer",
          BreathingExercises: "breathing",
          SessionHistory: "history",
        },
      },

      ErrorModal: {
        path: "error",
        screens: {
          Error404: "404",
          Error500: "500",
          NoConnection: "offline",
          Maintenance: "maintenance",
          Forbidden: "403",
        },
      },
    },
  },

  /**
   * Handle deep link when app is not running
   * Called when app is opened from a deep link
   */
  async getInitialURL(): Promise<string | null> {
    // Check for deep link URL that opened the app
    // This will be implemented by React Navigation automatically
    return null;
  },

  /**
   * Subscribe to deep link events
   * Called when app is already running and receives a deep link
   */
  subscribe(listener: (url: string) => void): () => void {
    // This will be implemented by React Navigation automatically
    // For custom URL handling, implement here

    // Return unsubscribe function
    return () => {
      // Cleanup
    };
  },
};

/**
 * Generate deep link URL for a screen
 * @param screen - Screen name
 * @param params - URL parameters
 * @returns Deep link URL
 *
 * @example
 * ```typescript
 * const url = generateDeepLink("ActiveChat", { conversationId: "123" });
 * // Returns: "solace://chat/123"
 * ```
 */
export function generateDeepLink(screen: string, params?: Record<string, string>): string {
  const baseUrl = "solace://";

  // TODO: Implement path generation based on linking config
  // For now, return base URL + screen
  return `${baseUrl}${screen.toLowerCase()}`;
}

/**
 * Parse deep link URL to navigation state
 * @param url - Deep link URL
 * @returns Navigation state object
 *
 * @example
 * ```typescript
 * const state = parseDeepLink("solace://chat/123");
 * // Returns: { routes: [{ name: "ActiveChat", params: { conversationId: "123" } }] }
 * ```
 */
export function parseDeepLink(url: string): any {
  // TODO: Implement URL parsing logic
  // React Navigation handles this automatically via linking config
  return null;
}
