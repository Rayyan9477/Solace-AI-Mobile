/**
 * Smart Notifications Screen - Notification management and history
 * Based on ui-designs/Dark-mode/Smart Notifications.png
 */

import { MentalHealthIcon } from "@components/icons";
import { useTheme } from "@theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
} from "react-native";

interface Notification {
  id: string;
  type:
    | "message"
    | "journal"
    | "exercise"
    | "health"
    | "mood"
    | "stress"
    | "recommendation";
  title: string;
  message: string;
  time: string;
  isNew: boolean;
  icon: string;
  color: string[];
  action?: {
    label: string;
    route: string;
  };
}

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "message",
    title: "Message From Dr Freud AI!",
    message: "It's Total Inhaled Messages",
    time: "10m",
    isNew: true,
    icon: "🤖",
    color: ["#8FBC8F", "#6B9B6B"],
  },
  {
    id: "2",
    type: "journal",
    title: "Journal Incomplete!",
    message: "It's Reflection Time 🔥",
    time: "NEW",
    isNew: true,
    icon: "📔",
    color: ["#9B7DCF", "#7B5DAF"],
  },
  {
    id: "3",
    type: "exercise",
    title: "Exercise Complete!",
    message: "25m Breathing Done 🔥",
    time: "1h",
    isNew: false,
    icon: "💪",
    color: ["#8FBC8F", "#6B9B6B"],
  },
  {
    id: "4",
    type: "health",
    title: "Mental Health Data Is Here",
    message: "Your Monthly Mental Analysis Is Here",
    time: "2h",
    isNew: false,
    icon: "📊",
    color: ["#E8A872", "#C88652"],
  },
  {
    id: "5",
    type: "mood",
    title: "Mood Improved",
    message: "Yesterday: 😊 Happy",
    time: "5h",
    isNew: false,
    icon: "😊",
    color: ["#8FBC8F", "#6B9B6B"],
  },
];

const NOTIFICATION_CARDS = [
  {
    id: "score",
    title: "Freud Score Increased",
    subtitle: "You're 26% happier compared to\nlast month progress 🙌",
    action: "See Score",
    scoreValue: "+8",
    scoreLabel: "Score Now",
    illustration: "🎯",
    colors: ["#8FBC8F", "#6B9B6B"],
  },
  {
    id: "journal",
    title: "Journal Completed",
    subtitle:
      "You still need to complete 4 daily\njournal this month. Keep it up! 🎉",
    action: "See Journal",
    scoreValue: "21/30",
    illustration: "📖",
    colors: ["#B8976B", "#9B7B4B"],
  },
  {
    id: "therapy",
    title: "Therapy with Dr. Freud AI",
    subtitle: "Your next therapy session with Dr\nFreud AI in 8h 25m from now.",
    action: "See Schedule",
    scoreValue: "05:25AM",
    illustration: "🕐",
    colors: ["#E8A872", "#C88652"],
  },
  {
    id: "stress",
    title: "Neutral",
    subtitle: "Stress Decreased!\n\nYou are now Neutral. Congrats!",
    action: "See Stress Level",
    illustration: "🧘",
    colors: ["#9B7DCF", "#7B5DAF"],
  },
  {
    id: "meditation",
    title: "It's Time!",
    subtitle:
      "Time for meditation session.\n\nOr Freud AI said you need to do is\ntoday, just finish 30-25m session.",
    action: "Let's Meditate",
    illustration: "⏰",
    colors: ["#6B7280", "#4B5260"],
  },
  {
    id: "sleep",
    title: "Sleep Quality Increased!",
    subtitle: "Your sleep quality is 55% better\ncompared to last month!",
    action: "See Sleep Quality",
    scoreValue: "7h 50m",
    illustration: "😴",
    colors: ["#8B6B4B", "#6B4B2B"],
  },
];

export const SmartNotificationsScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.background.secondary,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    badge: {
      backgroundColor: theme.colors.orange["40"],
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginLeft: 8,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    profileButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["20"],
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      paddingHorizontal: 20,
      marginBottom: 12,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    notificationCard: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    notificationIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    notificationIcon: {
      fontSize: 24,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 12,
      color: theme.colors.text.secondary,
    },
    notificationTime: {
      fontSize: 11,
      color: theme.colors.text.tertiary,
    },
    newBadge: {
      backgroundColor: theme.colors.green["40"],
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
    },
    newBadgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    cardWrapper: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    fullCard: {
      borderRadius: 24,
      padding: 32,
      minHeight: 400,
      justifyContent: "space-between",
      overflow: "hidden",
    },
    cardIllustration: {
      fontSize: 120,
      textAlign: "center",
      marginBottom: 20,
    },
    cardTitle: {
      fontSize: 32,
      fontWeight: "800",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 16,
    },
    cardSubtitle: {
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.9)",
      textAlign: "center",
      lineHeight: 20,
      marginBottom: 24,
    },
    cardScore: {
      fontSize: 48,
      fontWeight: "800",
      color: "#FFFFFF",
      textAlign: "center",
      marginBottom: 8,
    },
    cardScoreLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "center",
      marginBottom: 32,
    },
    cardAction: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      paddingVertical: 16,
      borderRadius: 24,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    cardActionText: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
    },
    settingsToggle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.primary,
    },
    settingsLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text.primary,
    },
  });

  const renderNotificationList = () => (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Earlier This Day</Text>
        {NOTIFICATIONS.filter((n) => n.time !== "NEW").map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={styles.notificationCard}
            onPress={() => {
              if (notification.action) {
                navigation.navigate(notification.action.route);
              }
            }}
          >
            <LinearGradient
              colors={notification.color}
              style={styles.notificationIconContainer}
            >
              <Text style={styles.notificationIcon}>{notification.icon}</Text>
            </LinearGradient>

            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>
                {notification.message}
              </Text>
            </View>

            <Text style={styles.notificationTime}>{notification.time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Last Week</Text>
        {NOTIFICATIONS.slice(4, 6).map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={styles.notificationCard}
          >
            <LinearGradient
              colors={notification.color}
              style={styles.notificationIconContainer}
            >
              <Text style={styles.notificationIcon}>{notification.icon}</Text>
            </LinearGradient>

            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>
                {notification.message}
              </Text>
            </View>

            <Text style={styles.notificationTime}>5d</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderNotificationCards = () => (
    <>
      {NOTIFICATION_CARDS.map((card) => (
        <View key={card.id} style={styles.cardWrapper}>
          <LinearGradient
            colors={card.colors}
            style={styles.fullCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {card.illustration && (
              <Text style={styles.cardIllustration}>{card.illustration}</Text>
            )}

            <View>
              {card.scoreValue && (
                <>
                  <Text style={styles.cardScore}>{card.scoreValue}</Text>
                  {card.scoreLabel && (
                    <Text style={styles.cardScoreLabel}>{card.scoreLabel}</Text>
                  )}
                </>
              )}

              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </View>

            <TouchableOpacity
              style={styles.cardAction}
              onPress={() => navigation.navigate("Dashboard")}
            >
              <Text style={styles.cardActionText}>{card.action}</Text>
              <MentalHealthIcon name="ArrowRight" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      ))}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MentalHealthIcon
            name="ChevronLeft"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>36</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.profileButton}>
          <Text style={{ fontSize: 20 }}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Toggle */}
      <View style={styles.settingsToggle}>
        <Text style={styles.settingsLabel}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          trackColor={{
            false: theme.colors.border.primary,
            true: theme.colors.green["40"],
          }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {viewMode === "list"
          ? renderNotificationList()
          : renderNotificationCards()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SmartNotificationsScreen;
