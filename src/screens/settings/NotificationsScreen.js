import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Animated,
  SafeAreaView,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const NotificationsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState({
    dailyCheckIn: { enabled: true, time: "09:00" },
    moodReminder: { enabled: true, time: "18:00" },
    sleepReminder: { enabled: true, time: "22:00" },
    medicationReminder: { enabled: false, time: "08:00" },
    therapyReminder: { enabled: true, time: "14:00" },
    crisisSupport: { enabled: true },
    weeklyInsights: { enabled: true },
    communityUpdates: { enabled: false },
    challengeReminders: { enabled: true },
  });

  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const notificationTypes = [
    {
      id: "dailyCheckIn",
      title: "Daily Check-in",
      description: "Gentle reminders to log your mood and feelings",
      icon: "Heart",
      category: "wellness",
      hasTime: true,
    },
    {
      id: "moodReminder",
      title: "Mood Tracking",
      description: "Evening reminders to track your mood",
      icon: "Brain",
      category: "wellness",
      hasTime: true,
    },
    {
      id: "sleepReminder",
      title: "Sleep Schedule",
      description: "Bedtime reminders for better sleep hygiene",
      icon: "Mindfulness",
      category: "wellness",
      hasTime: true,
    },
    {
      id: "medicationReminder",
      title: "Medication",
      description: "Reminders for medications or supplements",
      icon: "Therapy",
      category: "health",
      hasTime: true,
    },
    {
      id: "therapyReminder",
      title: "Therapy Sessions",
      description: "Reminders for scheduled therapy appointments",
      icon: "Journal",
      category: "health",
      hasTime: true,
    },
    {
      id: "crisisSupport",
      title: "Crisis Support",
      description: "Important alerts for crisis resources",
      icon: "Heart",
      category: "safety",
      hasTime: false,
    },
    {
      id: "weeklyInsights",
      title: "Weekly Insights",
      description: "Summary of your mental health progress",
      icon: "Brain",
      category: "insights",
      hasTime: false,
    },
    {
      id: "communityUpdates",
      title: "Community Activity",
      description: "Updates from support groups you follow",
      icon: "Therapy",
      category: "social",
      hasTime: false,
    },
    {
      id: "challengeReminders",
      title: "Wellness Challenges",
      description: "Reminders for mindfulness and wellness activities",
      icon: "Mindfulness",
      category: "motivation",
      hasTime: false,
    },
  ];

  const smartNotificationSuggestions = [
    {
      type: "mood_pattern",
      title: "Evening Mood Dip Detected",
      description:
        "You tend to feel low around 6 PM. Would you like a mindfulness reminder at 5:30 PM?",
      action: "Add Reminder",
      data: { time: "17:30", type: "mindfulness" },
    },
    {
      type: "sleep_pattern",
      title: "Inconsistent Sleep Schedule",
      description:
        "Your sleep times vary by 2+ hours. A consistent bedtime reminder might help.",
      action: "Set Sleep Reminder",
      data: { time: "22:00", type: "sleep" },
    },
    {
      type: "stress_spike",
      title: "High Stress Periods",
      description:
        "You report high stress on Monday mornings. Would you like a prep reminder on Sunday evenings?",
      action: "Add Stress Prep",
      data: { time: "Sunday 20:00", type: "stress_prep" },
    },
  ];

  useEffect(() => {
    setSmartSuggestions(smartNotificationSuggestions);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleNotification = (notificationId) => {
    setNotifications((prev) => ({
      ...prev,
      [notificationId]: {
        ...prev[notificationId],
        enabled: !prev[notificationId].enabled,
      },
    }));
  };

  const updateNotificationTime = (notificationId, time) => {
    setNotifications((prev) => ({
      ...prev,
      [notificationId]: {
        ...prev[notificationId],
        time,
      },
    }));
  };

  const acceptSuggestion = (suggestion) => {
    Alert.alert(
      "Suggestion Accepted",
      `Smart notification has been configured based on your patterns.`,
      [{ text: "OK" }],
    );

    setSmartSuggestions((prev) => prev.filter((s) => s !== suggestion));
  };

  const dismissSuggestion = (suggestion) => {
    setSmartSuggestions((prev) => prev.filter((s) => s !== suggestion));
  };

  const getCategoryColor = (category) => {
    const colors = {
      wellness: theme.colors.therapeutic.nurturing[500],
      health: theme.colors.therapeutic.calming[500],
      safety: theme.colors.error[400],
      insights: theme.colors.therapeutic.peaceful[500],
      social: theme.colors.therapeutic.grounding[500],
      motivation: theme.colors.therapeutic.energizing[500],
    };
    return colors[category] || theme.colors.gray[500];
  };

  const groupedNotifications = notificationTypes.reduce(
    (groups, notification) => {
      const category = notification.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(notification);
      return groups;
    },
    {},
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          theme.colors.therapeutic.calming[50],
          theme.colors.therapeutic.peaceful[50],
          theme.colors.therapeutic.nurturing[50],
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>

          <Text
            style={[styles.headerTitle, { color: theme.colors.text.primary }]}
          >
            Smart Notifications
          </Text>

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => Alert.alert("Test", "Test notification sent!")}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[styles.animatedContainer, { opacity: fadeAnim }]}
          >
            {/* Smart Suggestions */}
            {smartSuggestions.length > 0 && (
              <View
                style={[
                  styles.section,
                  { backgroundColor: theme.colors.background.primary },
                ]}
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Smart Suggestions
                </Text>
                <Text
                  style={[
                    styles.sectionDescription,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Based on your patterns, we recommend these notification
                  adjustments:
                </Text>

                {smartSuggestions.map((suggestion, index) => (
                  <SuggestionCard
                    key={index}
                    suggestion={suggestion}
                    theme={theme}
                    onAccept={() => acceptSuggestion(suggestion)}
                    onDismiss={() => dismissSuggestion(suggestion)}
                  />
                ))}
              </View>
            )}

            {/* Notification Categories */}
            {Object.entries(groupedNotifications).map(
              ([category, categoryNotifications]) => (
                <View
                  key={category}
                  style={[
                    styles.section,
                    { backgroundColor: theme.colors.background.primary },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                    Notifications
                  </Text>

                  {categoryNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      isEnabled={
                        notifications[notification.id]?.enabled || false
                      }
                      time={notifications[notification.id]?.time}
                      onToggle={() => toggleNotification(notification.id)}
                      onTimeChange={(time) =>
                        updateNotificationTime(notification.id, time)
                      }
                      categoryColor={getCategoryColor(category)}
                      theme={theme}
                    />
                  ))}
                </View>
              ),
            )}

            {/* Notification Settings */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Advanced Settings
              </Text>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Do Not Disturb Mode
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    Pause non-urgent notifications during specified hours
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.settingButton,
                    { backgroundColor: theme.colors.therapeutic.calming[500] },
                  ]}
                  onPress={() => navigation.navigate("DoNotDisturbSettings")}
                >
                  <Text
                    style={[
                      styles.settingButtonText,
                      { color: theme.colors.text.inverse },
                    ]}
                  >
                    Configure
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Notification History
                  </Text>
                  <Text
                    style={[
                      styles.settingDescription,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    View and manage your notification history
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.settingButton,
                    { backgroundColor: theme.colors.therapeutic.peaceful[500] },
                  ]}
                  onPress={() => navigation.navigate("NotificationHistory")}
                >
                  <Text
                    style={[
                      styles.settingButtonText,
                      { color: theme.colors.text.inverse },
                    ]}
                  >
                    View
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tips */}
            <View
              style={[
                styles.tipsSection,
                { backgroundColor: theme.colors.therapeutic.calming[50] },
              ]}
            >
              <Text
                style={[
                  styles.tipsTitle,
                  { color: theme.colors.therapeutic.calming[700] },
                ]}
              >
                Notification Tips
              </Text>
              <Text
                style={[
                  styles.tipsText,
                  { color: theme.colors.therapeutic.calming[600] },
                ]}
              >
                • Enable notifications that support your mental health goals
                {"\n"}• Set reminders at times when you're most likely to follow
                through{"\n"}• Use crisis support notifications for safety{"\n"}
                • Adjust frequency to avoid notification fatigue{"\n"}• Review
                and update settings regularly
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const SuggestionCard = ({ suggestion, theme, onAccept, onDismiss }) => (
  <View
    style={[
      styles.suggestionCard,
      { backgroundColor: theme.colors.therapeutic.calming[50] },
    ]}
  >
    <View style={styles.suggestionHeader}>
      <MentalHealthIcon
        name="Brain"
        size={20}
        color={theme.colors.therapeutic.calming[600]}
        variant="filled"
      />
      <Text
        style={[
          styles.suggestionTitle,
          { color: theme.colors.therapeutic.calming[700] },
        ]}
      >
        {suggestion.title}
      </Text>
    </View>

    <Text
      style={[
        styles.suggestionDescription,
        { color: theme.colors.therapeutic.calming[600] },
      ]}
    >
      {suggestion.description}
    </Text>

    <View style={styles.suggestionActions}>
      <TouchableOpacity
        style={[
          styles.suggestionActionButton,
          { backgroundColor: theme.colors.therapeutic.calming[500] },
        ]}
        onPress={onAccept}
      >
        <Text
          style={[
            styles.suggestionActionText,
            { color: theme.colors.text.inverse },
          ]}
        >
          {suggestion.action}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.suggestionActionButton,
          {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: theme.colors.gray[300],
          },
        ]}
        onPress={onDismiss}
      >
        <Text
          style={[
            styles.suggestionActionText,
            { color: theme.colors.text.secondary },
          ]}
        >
          Dismiss
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const NotificationItem = ({
  notification,
  isEnabled,
  time,
  onToggle,
  onTimeChange,
  categoryColor,
  theme,
}) => (
  <View style={styles.notificationItem}>
    <View style={styles.notificationHeader}>
      <View style={styles.notificationIcon}>
        <MentalHealthIcon
          name={notification.icon}
          size={20}
          color={categoryColor}
          variant={isEnabled ? "filled" : "outline"}
        />
      </View>

      <View style={styles.notificationInfo}>
        <Text
          style={[
            styles.notificationTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          {notification.title}
        </Text>
        <Text
          style={[
            styles.notificationDescription,
            { color: theme.colors.text.secondary },
          ]}
        >
          {notification.description}
        </Text>
      </View>

      <Switch
        value={isEnabled}
        onValueChange={onToggle}
        trackColor={{
          false: theme.colors.gray[300],
          true: categoryColor,
        }}
        thumbColor={theme.colors.background.primary}
      />
    </View>

    {isEnabled && notification.hasTime && (
      <View style={styles.timeSelector}>
        <Text
          style={[styles.timeLabel, { color: theme.colors.text.secondary }]}
        >
          Reminder time:
        </Text>
        <TouchableOpacity
          style={[
            styles.timeButton,
            { backgroundColor: theme.colors.background.secondary },
          ]}
          onPress={() => {
            // In a real app, this would open a time picker
            Alert.alert("Time Picker", "Time picker would open here");
          }}
        >
          <Text
            style={[
              styles.timeButtonText,
              { color: theme.colors.text.primary },
            ]}
          >
            {time || "09:00"}
          </Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  testButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animatedContainer: {
    paddingBottom: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  suggestionCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  suggestionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  suggestionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  suggestionActions: {
    flexDirection: "row",
    gap: 8,
  },
  suggestionActionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  suggestionActionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  notificationItem: {
    marginBottom: 16,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginLeft: 52,
  },
  timeLabel: {
    fontSize: 14,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  settingButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  settingButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tipsSection: {
    borderRadius: 16,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default NotificationsScreen;
