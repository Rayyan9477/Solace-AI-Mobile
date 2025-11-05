/**
 * Notification History Screen - Previous Notifications
 * Based on ui-designs/Dark-mode/🔒 Smart Notifications.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
  read: boolean;
  icon: string;
}

export const NotificationHistoryScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const notifications: Notification[] = [
    {
      id: "1",
      title: "Daily Check-In",
      message: "Time for your daily mood check-in! How are you feeling?",
      type: "mood",
      timestamp: "2 hours ago",
      read: false,
      icon: "😊",
    },
    {
      id: "2",
      title: "Meditation Reminder",
      message: "Your evening meditation session is ready",
      type: "meditation",
      timestamp: "5 hours ago",
      read: true,
      icon: "🧘",
    },
    {
      id: "3",
      title: "Achievement Unlocked",
      message: "Congratulations! 7-day meditation streak!",
      type: "achievement",
      timestamp: "1 day ago",
      read: true,
      icon: "🏆",
    },
    {
      id: "4",
      title: "Journal Reminder",
      message: "Take a moment to reflect on your day",
      type: "journal",
      timestamp: "1 day ago",
      read: true,
      icon: "📝",
    },
  ];

  const filteredNotifications =
    filter === "all" ? notifications : notifications.filter((n) => !n.read);

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
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    clearButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    clearButtonText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.red["60"],
    },
    content: {
      flex: 1,
    },
    filterRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 16,
      gap: 12,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.brown["10"],
    },
    filterButtonActive: {
      backgroundColor: theme.colors.orange["60"],
    },
    filterText: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    filterTextActive: {
      color: "#FFFFFF",
    },
    notificationsList: {
      paddingHorizontal: 20,
    },
    notificationCard: {
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    notificationCardUnread: {
      backgroundColor: theme.colors.orange["10"],
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.orange["60"],
    },
    notificationIcon: {
      fontSize: 32,
      marginRight: 12,
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    notificationTimestamp: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.tertiary,
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyIcon: {
      fontSize: 64,
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    emptyDescription: {
      fontSize: 14,
      lineHeight: 20,
      color: theme.colors.text.secondary,
      textAlign: "center",
      paddingHorizontal: 40,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "unread" && styles.filterButtonActive,
          ]}
          onPress={() => setFilter("unread")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "unread" && styles.filterTextActive,
            ]}
          >
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.notificationsList}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.notificationCardUnread,
                ]}
              >
                <Text style={styles.notificationIcon}>{notification.icon}</Text>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTimestamp}>
                    {notification.timestamp}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyTitle}>No Notifications</Text>
              <Text style={styles.emptyDescription}>
                You're all caught up! Check back later for updates.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationHistoryScreen;
