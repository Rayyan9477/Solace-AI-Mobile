import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class MentalHealthNotificationService {
  static async requestPermissions() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Push notification permissions not granted');
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('mental-health', {
          name: 'Mental Health Reminders',
          description: 'Gentle reminders for mental health check-ins and self-care',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#64748B',
        });
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  static async scheduleMoodReminder(time = { hour: 19, minute: 0 }) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      // Cancel existing mood reminder
      await this.cancelNotification('mood-reminder');

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🌟 How are you feeling today?',
          body: 'Take a moment to check in with yourself. Your mental health matters.',
          sound: 'default',
          priority: Notifications.AndroidImportance.DEFAULT,
          color: '#64748B',
        },
        trigger: {
          hour: time.hour,
          minute: time.minute,
          repeats: true,
        },
        identifier: 'mood-reminder',
      });

      await AsyncStorage.setItem('mood-reminder-time', JSON.stringify(time));
      console.log('Mood reminder scheduled:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error scheduling mood reminder:', error);
      return null;
    }
  }

  static async scheduleWellnessReminders() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return [];

      const reminders = [
        {
          id: 'hydration-reminder',
          title: '💧 Stay Hydrated',
          body: 'Remember to drink water! Staying hydrated helps your mind and body.',
          hour: 10,
          minute: 0,
        },
        {
          id: 'breathing-reminder',
          title: '🌬️ Breathe Deep',
          body: 'Take 3 deep breaths. Focus on this moment.',
          hour: 14,
          minute: 0,
        },
        {
          id: 'gratitude-reminder',
          title: '🙏 Gratitude Moment',
          body: 'What are you grateful for today? Take a moment to appreciate.',
          hour: 20,
          minute: 0,
        },
        {
          id: 'sleep-reminder',
          title: '😴 Wind Down Time',
          body: 'Consider starting your bedtime routine for better rest.',
          hour: 21,
          minute: 30,
        },
      ];

      const identifiers = [];
      for (const reminder of reminders) {
        await this.cancelNotification(reminder.id);
        
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: reminder.title,
            body: reminder.body,
            sound: 'default',
            priority: Notifications.AndroidImportance.LOW,
            color: '#64748B',
          },
          trigger: {
            hour: reminder.hour,
            minute: reminder.minute,
            repeats: true,
          },
          identifier: reminder.id,
        });
        
        identifiers.push(identifier);
      }

      console.log('Wellness reminders scheduled:', identifiers);
      return identifiers;
    } catch (error) {
      console.error('Error scheduling wellness reminders:', error);
      return [];
    }
  }

  static async scheduleAssessmentReminder(frequency = 'weekly') {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      await this.cancelNotification('assessment-reminder');

      const frequencies = {
        daily: { days: 1 },
        weekly: { weekday: 1, hour: 9, minute: 0 }, // Monday at 9 AM
        biweekly: { days: 14, hour: 9, minute: 0 },
        monthly: { day: 1, hour: 9, minute: 0 }, // 1st of month
      };

      const config = frequencies[frequency] || frequencies.weekly;
      
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📊 Mental Health Check-in',
          body: 'Time for your regular mental health assessment. Track your progress!',
          sound: 'default',
          priority: Notifications.AndroidImportance.DEFAULT,
          color: '#64748B',
        },
        trigger: {
          ...config,
          repeats: true,
        },
        identifier: 'assessment-reminder',
      });

      await AsyncStorage.setItem('assessment-reminder-frequency', frequency);
      console.log('Assessment reminder scheduled:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error scheduling assessment reminder:', error);
      return null;
    }
  }

  static async scheduleCrisisFollowUp(delayHours = 24) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🤝 We\'re Here for You',
          body: 'Checking in after yesterday. How are you feeling today? You\'re not alone.',
          sound: 'default',
          priority: Notifications.AndroidImportance.HIGH,
          color: '#EF4444',
        },
        trigger: {
          seconds: delayHours * 3600, // Convert hours to seconds
        },
        identifier: `crisis-followup-${Date.now()}`,
      });

      console.log('Crisis follow-up scheduled:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error scheduling crisis follow-up:', error);
      return null;
    }
  }

  static async scheduleTherapyReminder(appointmentTime, therapistName = 'your therapist') {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      // Schedule 24 hours before
      const dayBeforeIdentifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📅 Therapy Tomorrow',
          body: `Your appointment with ${therapistName} is tomorrow. Prepare any topics you'd like to discuss.`,
          sound: 'default',
          priority: Notifications.AndroidImportance.DEFAULT,
          color: '#22C55E',
        },
        trigger: {
          date: new Date(appointmentTime.getTime() - 24 * 60 * 60 * 1000),
        },
        identifier: `therapy-reminder-day-${appointmentTime.getTime()}`,
      });

      // Schedule 1 hour before
      const hourBeforeIdentifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🕐 Therapy in 1 Hour',
          body: `Your appointment with ${therapistName} is in 1 hour. Time to prepare!`,
          sound: 'default',
          priority: Notifications.AndroidImportance.HIGH,
          color: '#22C55E',
        },
        trigger: {
          date: new Date(appointmentTime.getTime() - 60 * 60 * 1000),
        },
        identifier: `therapy-reminder-hour-${appointmentTime.getTime()}`,
      });

      console.log('Therapy reminders scheduled:', { dayBeforeIdentifier, hourBeforeIdentifier });
      return { dayBeforeIdentifier, hourBeforeIdentifier };
    } catch (error) {
      console.error('Error scheduling therapy reminder:', error);
      return null;
    }
  }

  static async sendEncouragementNotification(message, delayMinutes = 0) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const encouragements = [
        '🌟 You are stronger than you think.',
        '🌱 Every small step forward matters.',
        '💙 Your feelings are valid and you matter.',
        '🌈 This difficult time will pass.',
        '🤗 You are worthy of love and support.',
        '✨ You have overcome challenges before.',
        '🕊️ Be gentle with yourself today.',
        '🌸 You are doing the best you can.',
      ];

      const finalMessage = message || encouragements[Math.floor(Math.random() * encouragements.length)];

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'A gentle reminder',
          body: finalMessage,
          sound: 'default',
          priority: Notifications.AndroidImportance.LOW,
          color: '#64748B',
        },
        trigger: delayMinutes > 0 ? {
          seconds: delayMinutes * 60,
        } : null,
        identifier: `encouragement-${Date.now()}`,
      });

      console.log('Encouragement notification scheduled:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error sending encouragement notification:', error);
      return null;
    }
  }

  static async cancelNotification(identifier) {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log('Notification cancelled:', identifier);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  static async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  static async getScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('Scheduled notifications:', notifications);
      return notifications;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  static async setupNotificationSettings(settings) {
    try {
      const {
        moodReminders = true,
        moodReminderTime = { hour: 19, minute: 0 },
        wellnessReminders = true,
        assessmentReminders = true,
        assessmentFrequency = 'weekly',
      } = settings;

      // Cancel all existing
      await this.cancelAllNotifications();

      const scheduledNotifications = [];

      if (moodReminders) {
        const moodId = await this.scheduleMoodReminder(moodReminderTime);
        if (moodId) scheduledNotifications.push({ type: 'mood', id: moodId });
      }

      if (wellnessReminders) {
        const wellnessIds = await this.scheduleWellnessReminders();
        scheduledNotifications.push(...wellnessIds.map(id => ({ type: 'wellness', id })));
      }

      if (assessmentReminders) {
        const assessmentId = await this.scheduleAssessmentReminder(assessmentFrequency);
        if (assessmentId) scheduledNotifications.push({ type: 'assessment', id: assessmentId });
      }

      // Store settings
      await AsyncStorage.setItem('notification-settings', JSON.stringify(settings));
      console.log('Notification settings configured:', scheduledNotifications);
      
      return scheduledNotifications;
    } catch (error) {
      console.error('Error setting up notification settings:', error);
      return [];
    }
  }

  static async getNotificationSettings() {
    try {
      const settings = await AsyncStorage.getItem('notification-settings');
      return settings ? JSON.parse(settings) : {
        moodReminders: true,
        moodReminderTime: { hour: 19, minute: 0 },
        wellnessReminders: true,
        assessmentReminders: true,
        assessmentFrequency: 'weekly',
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return null;
    }
  }

  // Emergency notification for crisis situations
  static async sendCrisisAlert() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🆘 Crisis Support Available',
          body: 'If you\'re in crisis, help is available 24/7. Call 988 or text HOME to 741741.',
          sound: 'default',
          priority: Notifications.AndroidImportance.MAX,
          color: '#EF4444',
        },
        trigger: null, // Immediate
        identifier: `crisis-alert-${Date.now()}`,
      });

      // Schedule follow-up
      await this.scheduleCrisisFollowUp(24);

      console.log('Crisis alert sent:', identifier);
      return identifier;
    } catch (error) {
      console.error('Error sending crisis alert:', error);
      return null;
    }
  }
}

export default MentalHealthNotificationService;