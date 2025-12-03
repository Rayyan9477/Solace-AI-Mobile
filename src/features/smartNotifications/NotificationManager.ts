import { logger } from "@shared/utils/logger";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  format,
  addHours,
  addDays,
  startOfDay,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";

// TypeScript type declarations
declare const __DEV__: boolean;

/**
 * TypeScript interfaces for Smart Notification Manager
 */

interface NotificationChannel {
  id: string;
  name: string;
  description: string;
  importance: "low" | "default" | "high" | "critical";
  sound: string;
}

interface NotificationChannels {
  mood_reminders: NotificationChannel;
  therapy_sessions: NotificationChannel;
  wellness_tips: NotificationChannel;
  crisis_support: NotificationChannel;
  progress_celebrations: NotificationChannel;
}

interface TherapeuticMessage {
  title: string;
  body: string;
  therapeutic: boolean;
}

interface TherapeuticMessages {
  mood_reminders: TherapeuticMessage[];
  wellness_tips: TherapeuticMessage[];
  progress_celebrations: TherapeuticMessage[];
}

interface NotificationPreferences {
  mood_reminders: {
    enabled: boolean;
    frequency: "daily" | "twice_daily" | "custom";
    time: string;
    customTimes: string[];
    quietHours: { start: string; end: string };
    adaptiveFrequency: boolean;
  };
  therapy_sessions: {
    enabled: boolean;
    reminderBefore: number[];
    followUpAfter: number;
  };
  wellness_tips: {
    enabled: boolean;
    frequency: string;
    time: string;
    categories: string[];
  };
  crisis_support: {
    enabled: boolean;
    checkInAfterCrisis: number;
    safetyPlanReminders: boolean;
  };
  progress_celebrations: {
    enabled: boolean;
    milestones: boolean;
    streaks: boolean;
    achievements: boolean;
  };
  adaptive: {
    enabled: boolean;
    learnFromUsage: boolean;
    respectMoodPatterns: boolean;
    avoidLowMoodTimes: boolean;
  };
}

interface MoodEntry {
  timestamp: string;
  mood?: string;
  score?: number;
  [key: string]: any;
}

interface SessionDetails {
  therapist?: string;
  type?: string;
  [key: string]: any;
}

interface Milestone {
  description: string;
  type?: string;
  date?: string;
  [key: string]: any;
}

interface UserAnalytics {
  moodPatterns?: {
    lowMoodTimes?: string[];
    [key: string]: any;
  };
  usagePatterns?: {
    engagement?: number;
    [key: string]: any;
  };
  riskFactors?: {
    highRiskPeriods?: string[];
    [key: string]: any;
  };
}

interface RecurringNotificationConfig {
  id: string;
  category: string;
  channelId: string;
  title: string;
  body: string;
  time: string;
  repeat: "daily" | "once";
  data: Record<string, any>;
}

interface NotificationInteraction {
  timestamp: string;
  notificationId: string;
  type: string;
  actionType: string;
  title: string;
  scheduled: string | Date;
}

interface NotificationAnalytics {
  totalSent: number;
  totalOpened: number;
  engagementRate: number;
  typeDistribution: Record<string, number>;
  timeEffectiveness: Record<number, { sent: number; opened: number }>;
  recommendations: string[];
}

interface TimeRangeCount {
  [key: number]: number;
}

interface TypeEngagement {
  [key: string]: { sent: number; opened: number };
}

interface EngagementRate {
  type: string;
  rate: number;
  count: number;
}

/**
 * Smart Notification Manager for Mental Health App
 * Provides intelligent, therapeutic notifications based on user patterns and needs
 */

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class SmartNotificationManager {
  private isInitialized: boolean;
  private notificationChannels: NotificationChannels;
  private therapeuticMessages: TherapeuticMessages;
  private userPreferences!: NotificationPreferences; // Will be initialized in loadNotificationPreferences or getDefaultPreferences

  constructor() {
    this.isInitialized = false;
    this.notificationChannels = {
      mood_reminders: {
        id: "mood_reminders",
        name: "Mood Check-ins",
        description: "Gentle reminders to check in with your emotions",
        importance: "default",
        sound: "gentle_bell.wav",
      },
      therapy_sessions: {
        id: "therapy_sessions",
        name: "Therapy Sessions",
        description: "Reminders for scheduled therapy sessions",
        importance: "high",
        sound: "therapy_chime.wav",
      },
      wellness_tips: {
        id: "wellness_tips",
        name: "Wellness Tips",
        description: "Daily wellness and self-care tips",
        importance: "low",
        sound: "soft_notification.wav",
      },
      crisis_support: {
        id: "crisis_support",
        name: "Crisis Support",
        description: "Crisis intervention and safety reminders",
        importance: "critical",
        sound: "urgent_gentle.wav",
      },
      progress_celebrations: {
        id: "progress_celebrations",
        name: "Progress Celebrations",
        description: "Celebrating your mental health journey milestones",
        importance: "default",
        sound: "celebration.wav",
      },
    };

    this.therapeuticMessages = {
      mood_reminders: [
        {
          title: "Gentle Check-in 💙",
          body: "How are you feeling right now? Your emotions matter and are valid.",
          therapeutic: true,
        },
        {
          title: "Mindful Moment 🌸",
          body: "Take a breath. Notice what you're feeling without judgment.",
          therapeutic: true,
        },
        {
          title: "Emotional Awareness ✨",
          body: "Checking in with yourself is an act of self-care. How's your heart today?",
          therapeutic: true,
        },
      ],
      wellness_tips: [
        {
          title: "Self-Care Reminder 🌱",
          body: "You deserve kindness, especially from yourself.",
          therapeutic: true,
        },
        {
          title: "Gentle Reminder 🤗",
          body: "It's okay to not be okay. Healing isn't linear, and that's perfectly normal.",
          therapeutic: true,
        },
        {
          title: "Mindfulness Moment 🧘",
          body: "Try the 5-4-3-2-1 technique: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
          therapeutic: true,
        },
      ],
      progress_celebrations: [
        {
          title: "You're Amazing! 🌟",
          body: "Look how far you've come on your mental health journey. Be proud of your progress!",
          therapeutic: true,
        },
        {
          title: "Strength Recognition 💪",
          body: "Every day you choose to care for your mental health is a victory worth celebrating.",
          therapeutic: true,
        },
      ],
    };
  }

  /**
   * Initialize notification system
   */
  async initialize() {
    if (this.isInitialized) return true;

    try {
      // Check if device supports notifications
      if (!Device.isDevice) {
        logger.warn("Notifications not supported on simulator");
        return false;
      }

      // Request permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Notification Permissions",
          "Notifications help us provide timely mental health support. You can enable them later in Settings.",
          [{ text: "OK" }],
        );
        return false;
      }

      // Set up notification channels for Android
      if (Platform.OS === "android") {
        await this.createNotificationChannels();
      }

      // Load user preferences
      await this.loadNotificationPreferences();

      this.isInitialized = true;
      return true;
    } catch (error) {
      logger.error("Error initializing notifications:", error);
      return false;
    }
  }

  /**
   * Create notification channels for Android
   */
  async createNotificationChannels(): Promise<void> {
    if (Platform.OS !== "android") return;

    for (const channel of Object.values(
      this.notificationChannels,
    ) as NotificationChannel[]) {
      await Notifications.setNotificationChannelAsync(channel.id, {
        name: channel.name,
        description: channel.description,
        importance: this.mapImportance(channel.importance),
        sound: channel.sound,
      });
    }
  }

  /**
   * Map importance levels to Expo constants
   */
  mapImportance(importance: string): any {
    const importanceMap: Record<string, any> = {
      low: Notifications.AndroidImportance.LOW,
      default: Notifications.AndroidImportance.DEFAULT,
      high: Notifications.AndroidImportance.HIGH,
      critical: Notifications.AndroidImportance.MAX,
    };
    return importanceMap[importance] || Notifications.AndroidImportance.DEFAULT;
  }

  /**
   * Load user notification preferences
   */
  async loadNotificationPreferences(): Promise<void> {
    try {
      const preferences = await AsyncStorage.getItem(
        "notification_preferences",
      );
      this.userPreferences = preferences
        ? JSON.parse(preferences)
        : this.getDefaultPreferences();
    } catch (error) {
      logger.error("Error loading notification preferences:", error);
      this.userPreferences = this.getDefaultPreferences();
    }
  }

  /**
   * Get default notification preferences
   */
  getDefaultPreferences(): NotificationPreferences {
    return {
      mood_reminders: {
        enabled: true,
        frequency: "daily", // daily, twice_daily, custom
        time: "19:00", // 7 PM default
        customTimes: [],
        quietHours: { start: "22:00", end: "08:00" },
        adaptiveFrequency: true, // Adjust based on user patterns
      },
      therapy_sessions: {
        enabled: true,
        reminderBefore: [60, 15], // 1 hour and 15 minutes before
        followUpAfter: 1440, // 24 hours after for reflection
      },
      wellness_tips: {
        enabled: true,
        frequency: "daily",
        time: "09:00", // 9 AM default
        categories: ["mindfulness", "self-care", "coping", "motivation"],
      },
      crisis_support: {
        enabled: true,
        checkInAfterCrisis: 24, // hours
        safetyPlanReminders: true,
      },
      progress_celebrations: {
        enabled: true,
        milestones: true,
        streaks: true,
        achievements: true,
      },
      adaptive: {
        enabled: true,
        learnFromUsage: true,
        respectMoodPatterns: true,
        avoidLowMoodTimes: true,
      },
    };
  }

  /**
   * Save user notification preferences
   */
  async saveNotificationPreferences(
    preferences: Partial<NotificationPreferences>,
  ): Promise<void> {
    try {
      this.userPreferences = { ...this.userPreferences, ...preferences };
      await AsyncStorage.setItem(
        "notification_preferences",
        JSON.stringify(this.userPreferences),
      );

      // Reschedule notifications based on new preferences
      await this.scheduleAllNotifications();
    } catch (error) {
      logger.error("Error saving notification preferences:", error);
    }
  }

  /**
   * Schedule intelligent mood reminder based on user patterns
   */
  async scheduleMoodReminder(userMoodHistory: MoodEntry[] = []): Promise<void> {
    if (!this.userPreferences.mood_reminders.enabled) return;

    // Cancel existing mood reminders
    await this.cancelNotificationsByCategory("mood_reminder");

    // Analyze user patterns to determine optimal timing
    const optimalTime = this.userPreferences.adaptive.enabled
      ? await this.calculateOptimalMoodReminderTime(userMoodHistory)
      : this.userPreferences.mood_reminders.time;

    const frequency = this.userPreferences.mood_reminders.frequency;
    const messages = this.therapeuticMessages.mood_reminders;

    switch (frequency) {
      case "daily":
        await this.scheduleRecurringNotification({
          id: "daily_mood_reminder",
          category: "mood_reminder",
          channelId: "mood_reminders",
          title: messages[0].title,
          body: messages[0].body,
          time: optimalTime,
          repeat: "daily",
          data: { type: "mood_reminder", action: "open_mood_tracker" },
        });
        break;

      case "twice_daily":
        const morningTime = "09:00";
        const eveningTime = optimalTime;

        await this.scheduleRecurringNotification({
          id: "morning_mood_reminder",
          category: "mood_reminder",
          channelId: "mood_reminders",
          title: "Morning Check-in 🌅",
          body: "Good morning! How are you starting your day?",
          time: morningTime,
          repeat: "daily",
          data: { type: "mood_reminder", action: "open_mood_tracker" },
        });

        await this.scheduleRecurringNotification({
          id: "evening_mood_reminder",
          category: "mood_reminder",
          channelId: "mood_reminders",
          title: "Evening Reflection 🌙",
          body: "How has your day been? Take a moment to check in with yourself.",
          time: eveningTime,
          repeat: "daily",
          data: { type: "mood_reminder", action: "open_mood_tracker" },
        });
        break;

      case "custom":
        for (
          let i = 0;
          i < this.userPreferences.mood_reminders.customTimes.length;
          i++
        ) {
          const customTime = this.userPreferences.mood_reminders.customTimes[i];
          const message = messages[i % messages.length];

          await this.scheduleRecurringNotification({
            id: `custom_mood_reminder_${i}`,
            category: "mood_reminder",
            channelId: "mood_reminders",
            title: message.title,
            body: message.body,
            time: customTime,
            repeat: "daily",
            data: { type: "mood_reminder", action: "open_mood_tracker" },
          });
        }
        break;
    }
  }

  /**
   * Calculate optimal time for mood reminders based on user patterns
   */
  async calculateOptimalMoodReminderTime(
    moodHistory: MoodEntry[],
  ): Promise<string> {
    if (!moodHistory || moodHistory.length < 10) {
      return this.userPreferences.mood_reminders.time; // Use default if insufficient data
    }

    // Analyze when user typically logs moods
    const logTimes = moodHistory.map((entry: MoodEntry) => {
      const date = parseISO(entry.timestamp);
      return date.getHours() + date.getMinutes() / 60;
    });

    // Find the most common time range
    const timeRanges: TimeRangeCount = {};
    logTimes.forEach((time: number) => {
      const range = Math.floor(time);
      timeRanges[range] = (timeRanges[range] || 0) + 1;
    });

    const mostCommonHour = Object.entries(timeRanges).sort(
      ([, a], [, b]) => (b as number) - (a as number),
    )[0][0];

    // Suggest a time 1 hour before the most common logging time
    const optimalHour = Math.max(8, parseInt(mostCommonHour) - 1);
    return `${optimalHour.toString().padStart(2, "0")}:00`;
  }

  /**
   * Schedule therapy session reminders
   */
  async scheduleTherapySessionReminder(
    sessionDateTime: string,
    sessionDetails: SessionDetails = {},
  ): Promise<void> {
    if (!this.userPreferences.therapy_sessions.enabled) return;

    const sessionTime = parseISO(sessionDateTime);
    const reminderTimes = this.userPreferences.therapy_sessions.reminderBefore;

    // Schedule pre-session reminders
    for (let i = 0; i < reminderTimes.length; i++) {
      const minutesBefore = reminderTimes[i];
      const reminderTime = new Date(
        sessionTime.getTime() - minutesBefore * 60 * 1000,
      );

      if (reminderTime > new Date()) {
        // Only schedule future reminders
        await Notifications.scheduleNotificationAsync({
          identifier: `therapy_reminder_${sessionTime.getTime()}_${minutesBefore}`,
          content: {
            title: "Therapy Session Reminder 🤝",
            body: `Your therapy session is in ${this.formatTimeUntil(minutesBefore)}. Take a moment to prepare.`,
            categoryIdentifier: "therapy_session",
            data: {
              type: "therapy_reminder",
              sessionDateTime,
              sessionDetails,
              action: "prepare_for_session",
            },
          },
          trigger: {
            date: reminderTime,
            channelId: "therapy_sessions",
          },
        });
      }
    }

    // Schedule post-session follow-up
    if (this.userPreferences.therapy_sessions.followUpAfter) {
      const followUpTime = addHours(
        sessionTime,
        this.userPreferences.therapy_sessions.followUpAfter / 60,
      );

      await Notifications.scheduleNotificationAsync({
        identifier: `therapy_followup_${sessionTime.getTime()}`,
        content: {
          title: "Session Reflection 🌱",
          body: "How was your therapy session? Take a moment to reflect on what you discussed.",
          categoryIdentifier: "therapy_followup",
          data: {
            type: "therapy_followup",
            sessionDateTime,
            action: "session_reflection",
          },
        },
        trigger: {
          date: followUpTime,
          channelId: "therapy_sessions",
        },
      });
    }
  }

  /**
   * Schedule daily wellness tips
   */
  async scheduleWellnessTips(): Promise<void> {
    if (!this.userPreferences.wellness_tips.enabled) return;

    await this.cancelNotificationsByCategory("wellness_tip");

    const time = this.userPreferences.wellness_tips.time;
    const messages = this.therapeuticMessages.wellness_tips;

    // Schedule rotating wellness tips
    for (let i = 0; i < 7; i++) {
      // Schedule for next 7 days
      const message = messages[i % messages.length];
      const triggerDate = addDays(startOfDay(new Date()), i);
      const [hours, minutes] = time.split(":").map(Number);
      triggerDate.setHours(hours, minutes, 0, 0);

      await Notifications.scheduleNotificationAsync({
        identifier: `wellness_tip_${i}`,
        content: {
          title: message.title,
          body: message.body,
          categoryIdentifier: "wellness_tip",
          data: {
            type: "wellness_tip",
            action: "view_tip",
            category:
              this.userPreferences.wellness_tips.categories[
                i % this.userPreferences.wellness_tips.categories.length
              ],
          },
        },
        trigger: {
          date: triggerDate,
          channelId: "wellness_tips",
        },
      });
    }
  }

  /**
   * Schedule crisis support check-in
   */
  async scheduleCrisisCheckIn(crisisDateTime: string): Promise<void> {
    if (!this.userPreferences.crisis_support.enabled) return;

    const checkInTime = addHours(
      parseISO(crisisDateTime),
      this.userPreferences.crisis_support.checkInAfterCrisis,
    );

    await Notifications.scheduleNotificationAsync({
      identifier: `crisis_checkin_${crisisDateTime}`,
      content: {
        title: "Gentle Check-in 💙",
        body: "We care about you. How are you feeling today? Remember, support is always available.",
        categoryIdentifier: "crisis_checkin",
        data: {
          type: "crisis_checkin",
          crisisDateTime,
          action: "crisis_followup",
          priority: "high",
        },
      },
      trigger: {
        date: checkInTime,
        channelId: "crisis_support",
      },
    });
  }

  /**
   * Schedule progress celebration
   */
  async scheduleProgressCelebration(milestone: Milestone): Promise<void> {
    if (!this.userPreferences.progress_celebrations.enabled) return;

    const messages = this.therapeuticMessages.progress_celebrations;
    const message = messages[Math.floor(Math.random() * messages.length)];

    await Notifications.scheduleNotificationAsync({
      identifier: `progress_celebration_${Date.now()}`,
      content: {
        title: message.title,
        body: `${message.body} ${milestone.description}`,
        categoryIdentifier: "progress_celebration",
        data: {
          type: "progress_celebration",
          milestone,
          action: "view_progress",
        },
      },
      trigger: {
        seconds: 5, // Show immediately
        channelId: "progress_celebrations",
      },
    });
  }

  /**
   * Schedule intelligent adaptive notifications based on user patterns
   */
  async scheduleAdaptiveNotifications(
    userAnalytics: UserAnalytics,
  ): Promise<void> {
    if (!this.userPreferences.adaptive.enabled) return;

    const { moodPatterns, usagePatterns, riskFactors } = userAnalytics;

    // Avoid low mood times
    if (
      this.userPreferences.adaptive.avoidLowMoodTimes &&
      moodPatterns?.lowMoodTimes
    ) {
      // Reschedule notifications to avoid identified low mood times
      await this.adjustNotificationTimingForMoodPatterns(
        moodPatterns.lowMoodTimes,
      );
    }

    // Increase support during risk periods
    if (riskFactors && riskFactors.highRiskPeriods) {
      await this.scheduleAdditionalSupportDuringRiskPeriods(
        riskFactors.highRiskPeriods,
      );
    }

    // Adjust frequency based on engagement
    if (usagePatterns && this.userPreferences.adaptive.learnFromUsage) {
      await this.adjustNotificationFrequencyByEngagement(usagePatterns);
    }
  }

  // Placeholder methods for adaptive notification features
  private async adjustNotificationTimingForMoodPatterns(
    lowMoodTimes: string[],
  ): Promise<void> {
    // Implementation placeholder
    if (__DEV__) {
      logger.debug(
        "Adjusting notification timing for mood patterns",
        lowMoodTimes,
      );
    }
  }

  private async scheduleAdditionalSupportDuringRiskPeriods(
    highRiskPeriods: string[],
  ): Promise<void> {
    // Implementation placeholder
    if (__DEV__) {
      logger.debug(
        "Scheduling additional support during risk periods",
        highRiskPeriods,
      );
    }
  }

  private async adjustNotificationFrequencyByEngagement(
    usagePatterns: any,
  ): Promise<void> {
    // Implementation placeholder
    if (__DEV__) {
      logger.debug(
        "Adjusting notification frequency by engagement",
        usagePatterns,
      );
    }
  }

  /**
   * Schedule recurring notification
   */
  async scheduleRecurringNotification(
    config: RecurringNotificationConfig,
  ): Promise<void> {
    const { id, channelId, title, body, time, repeat, data } = config;

    const [hours, minutes] = time.split(":").map(Number);
    const triggerDate = new Date();
    triggerDate.setHours(hours, minutes, 0, 0);

    // If the time has passed today, start tomorrow
    if (triggerDate <= new Date()) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    const trigger =
      repeat === "daily"
        ? { hour: hours, minute: minutes, repeats: true }
        : { date: triggerDate };

    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: {
        title,
        body,
        categoryIdentifier: config.category,
        data,
      },
      trigger: {
        ...trigger,
        channelId,
      },
    });
  }

  /**
   * Cancel notifications by category
   */
  async cancelNotificationsByCategory(category: string): Promise<void> {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    const categoryNotifications = scheduledNotifications.filter(
      (notification: any) =>
        notification.content.categoryIdentifier === category,
    );

    for (const notification of categoryNotifications) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier,
      );
    }
  }

  /**
   * Schedule all notifications based on current preferences
   */
  async scheduleAllNotifications(): Promise<void> {
    if (!this.isInitialized) return;

    // Cancel all existing scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Reschedule based on current preferences
    await this.scheduleMoodReminder();
    await this.scheduleWellnessTips();

    // Note: Therapy sessions and crisis check-ins are scheduled dynamically
    // when those events occur, not as part of the general scheduling
  }

  /**
   * Handle notification interaction
   */
  async handleNotificationInteraction(
    notification: any,
    actionType: string = "opened",
  ): Promise<any> {
    const { data } = notification.request.content;

    // Log interaction for analytics
    await this.logNotificationInteraction(notification, actionType);

    // Handle different notification types
    switch (data.type) {
      case "mood_reminder":
        return { action: "navigate", screen: "MoodTracker" };

      case "therapy_reminder":
        return {
          action: "navigate",
          screen: "TherapySession",
          params: data.sessionDetails,
        };

      case "therapy_followup":
        return {
          action: "navigate",
          screen: "SessionReflection",
          params: { sessionDateTime: data.sessionDateTime },
        };

      case "wellness_tip":
        return {
          action: "navigate",
          screen: "WellnessTips",
          params: { category: data.category },
        };

      case "crisis_checkin":
        return { action: "navigate", screen: "CrisisSupport" };

      case "progress_celebration":
        return { action: "navigate", screen: "Progress" };

      default:
        return { action: "navigate", screen: "Home" };
    }
  }

  /**
   * Log notification interaction for analytics
   */
  async logNotificationInteraction(
    notification: any,
    actionType: string,
  ): Promise<void> {
    try {
      const interaction: NotificationInteraction = {
        timestamp: new Date().toISOString(),
        notificationId: notification.request.identifier,
        type: notification.request.content.data?.type || "unknown",
        actionType, // 'opened', 'dismissed', 'action_taken'
        title: notification.request.content.title,
        scheduled: notification.date,
      };

      const existingLogs = await AsyncStorage.getItem(
        "notification_interactions",
      );
      // HIGH-009 FIX: Wrap JSON.parse in explicit try-catch with fallback
      let logs: any[] = [];
      if (existingLogs) {
        try {
          logs = JSON.parse(existingLogs);
          if (!Array.isArray(logs)) logs = [];
        } catch (parseError) {
          logger.warn("Failed to parse notification_interactions, using empty array:", parseError);
          logs = [];
        }
      }

      logs.push(interaction);

      // Keep only last 1000 interactions
      const trimmedLogs = logs.slice(-1000);

      await AsyncStorage.setItem(
        "notification_interactions",
        JSON.stringify(trimmedLogs),
      );
    } catch (error) {
      logger.error("Error logging notification interaction:", error);
    }
  }

  /**
   * Get notification analytics
   */
  async getNotificationAnalytics(): Promise<NotificationAnalytics | null> {
    try {
      const interactions = await AsyncStorage.getItem(
        "notification_interactions",
      );
      // HIGH-009 FIX: Wrap JSON.parse in explicit try-catch with fallback
      let notificationLogs: any[] = [];
      if (interactions) {
        try {
          notificationLogs = JSON.parse(interactions);
          if (!Array.isArray(notificationLogs)) notificationLogs = [];
        } catch (parseError) {
          logger.warn("Failed to parse notification_interactions for analytics:", parseError);
          notificationLogs = [];
        }
      }

      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const recentInteractions = notificationLogs.filter(
        (log: NotificationInteraction) => new Date(log.timestamp) > last30Days,
      );

      // Calculate engagement rates
      const sentCount = recentInteractions.length;
      const openedCount = recentInteractions.filter(
        (log: NotificationInteraction) => log.actionType === "opened",
      ).length;
      const engagementRate = sentCount > 0 ? openedCount / sentCount : 0;

      // Type distribution
      const typeDistribution: Record<string, number> = {};
      recentInteractions.forEach((log: NotificationInteraction) => {
        typeDistribution[log.type] = (typeDistribution[log.type] || 0) + 1;
      });

      // Most effective times
      const timeEffectiveness: Record<
        number,
        { sent: number; opened: number }
      > = {};
      recentInteractions.forEach((log: NotificationInteraction) => {
        const hour = new Date(log.timestamp).getHours();
        if (!timeEffectiveness[hour]) {
          timeEffectiveness[hour] = { sent: 0, opened: 0 };
        }
        timeEffectiveness[hour].sent++;
        if (log.actionType === "opened") {
          timeEffectiveness[hour].opened++;
        }
      });

      return {
        totalSent: sentCount,
        totalOpened: openedCount,
        engagementRate: Math.round(engagementRate * 100),
        typeDistribution,
        timeEffectiveness,
        recommendations:
          this.generateNotificationRecommendations(recentInteractions),
      };
    } catch (error) {
      logger.error("Error getting notification analytics:", error);
      return null;
    }
  }

  /**
   * Generate recommendations based on notification analytics
   */
  generateNotificationRecommendations(
    interactions: NotificationInteraction[],
  ): string[] {
    const recommendations: string[] = [];

    if (interactions.length === 0) {
      return ["Start with daily mood reminders to establish a routine."];
    }

    // Analyze engagement rates by type
    const typeEngagement: TypeEngagement = {};
    interactions.forEach((log: NotificationInteraction) => {
      if (!typeEngagement[log.type]) {
        typeEngagement[log.type] = { sent: 0, opened: 0 };
      }
      typeEngagement[log.type].sent++;
      if (log.actionType === "opened") {
        typeEngagement[log.type].opened++;
      }
    });

    // Find most and least engaging types
    const engagementRates: EngagementRate[] = Object.entries(
      typeEngagement,
    ).map(([type, stats]) => ({
      type,
      rate:
        (stats as { sent: number; opened: number }).sent > 0
          ? (stats as { sent: number; opened: number }).opened /
            (stats as { sent: number; opened: number }).sent
          : 0,
      count: (stats as { sent: number; opened: number }).sent,
    }));

    const highEngagement = engagementRates.filter(
      (item) => item.rate > 0.7 && item.count >= 5,
    );
    const lowEngagement = engagementRates.filter(
      (item) => item.rate < 0.3 && item.count >= 5,
    );

    if (highEngagement.length > 0) {
      recommendations.push(
        `Your ${highEngagement[0].type} notifications have high engagement (${Math.round(highEngagement[0].rate * 100)}%). Consider adding more of these.`,
      );
    }

    if (lowEngagement.length > 0) {
      recommendations.push(
        `Your ${lowEngagement[0].type} notifications have low engagement (${Math.round(lowEngagement[0].rate * 100)}%). Consider adjusting the timing or content.`,
      );
    }

    return recommendations.length > 0
      ? recommendations
      : [
          "Your notification engagement looks good! Keep up with your current settings.",
        ];
  }

  /**
   * Utility function to format time until
   */
  formatTimeUntil(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  /**
   * Check if current time is within quiet hours
   */
  isWithinQuietHours(): boolean {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();

    const quietHours = this.userPreferences.mood_reminders.quietHours;
    const startTime = parseInt(quietHours.start.replace(":", ""));
    const endTime = parseInt(quietHours.end.replace(":", ""));

    if (startTime > endTime) {
      // Quiet hours cross midnight
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  }

  /**
   * Get current notification permission status
   */
  async getPermissionStatus(): Promise<string> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      logger.error("Error getting permission status:", error);
      return "undetermined";
    }
  }

  /**
   * Request notification permissions with explanation
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: false,
          allowCriticalAlerts: false,
        },
      });

      if (status === "granted") {
        await this.initialize();
        return true;
      } else {
        Alert.alert(
          "Notification Setup",
          "Notifications help us provide timely mental health support and reminders. You can enable them anytime in Settings.",
          [{ text: "OK" }],
        );
        return false;
      }
    } catch (error) {
      logger.error("Error requesting permissions:", error);
      return false;
    }
  }
}

export default new SmartNotificationManager();
