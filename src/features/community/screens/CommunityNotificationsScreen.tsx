/**
 * Community Notifications Screen - Community Activity Notifications
 * Based on ui-designs/Dark-mode/Community Support.png
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
  SectionList,
} from "react-native";

interface Notification {
  id: string;
  type: "follow" | "comment" | "like" | "mention" | "post";
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  postId?: string;
}

interface NotificationSection {
  title: string;
  data: Notification[];
}

export const CommunityNotificationsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const notificationSections: NotificationSection[] = [
    {
      title: "Earlier This Day",
      data: [
        {
          id: "1",
          type: "follow",
          user: "Anonymous User",
          avatar: "👤",
          message: "You have new follower!",
          timestamp: "About 8h hours or so",
          isRead: false,
        },
        {
          id: "2",
          type: "comment",
          user: "Anonymous User",
          avatar: "👤",
          message: "You have unread message",
          timestamp: "12 hours forward message",
          isRead: false,
        },
        {
          id: "3",
          type: "like",
          user: "Anonymous User",
          avatar: "👤",
          message: "Someone like your post",
          timestamp: "In Demi commented on your post",
          isRead: false,
        },
      ],
    },
    {
      title: "Last Week",
      data: [
        {
          id: "4",
          type: "mention",
          user: "Anonymous User",
          avatar: "👤",
          message: "Someone mentioned you",
          timestamp: "Lil Demi mentioned on post about you",
          isRead: true,
        },
        {
          id: "5",
          type: "post",
          user: "Anonymous User",
          avatar: "👤",
          message: "Someone posted new value",
          timestamp: "Lil Demi commented on your post value",
          isRead: true,
        },
        {
          id: "6",
          type: "comment",
          user: "Anonymous User",
          avatar: "👤",
          message: "Someone mentioned you",
          timestamp: "Awa lil demi commented on a post value",
          isRead: true,
        },
      ],
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "follow":
        return {
          icon: "👤",
          color: theme.colors.green["60"],
          bg: theme.colors.green["20"],
        };
      case "comment":
        return {
          icon: "💬",
          color: theme.colors.orange["60"],
          bg: theme.colors.orange["20"],
        };
      case "like":
        return {
          icon: "❤️",
          color: theme.colors.yellow["60"],
          bg: theme.colors.yellow["20"],
        };
      case "mention":
        return {
          icon: "@",
          color: theme.colors.purple["60"],
          bg: theme.colors.purple["20"],
        };
      case "post":
        return {
          icon: "📝",
          color: theme.colors.brown["60"],
          bg: theme.colors.brown["20"],
        };
      default:
        return {
          icon: "🔔",
          color: theme.colors.gray["60"],
          bg: theme.colors.gray["20"],
        };
    }
  };

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
    markAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    markAllText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.brown["60"],
    },
    filterRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
      backgroundColor: theme.colors.brown["10"],
    },
    filterButtonActive: {
      backgroundColor: theme.colors.brown["60"],
    },
    filterText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    filterTextActive: {
      color: "#FFFFFF",
    },
    content: {
      flex: 1,
    },
    sectionHeader: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: theme.colors.background.secondary,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.secondary,
      textTransform: "uppercase",
    },
    notificationCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.gray["20"],
    },
    notificationCardUnread: {
      backgroundColor: theme.colors.brown["5"],
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    iconText: {
      fontSize: 20,
    },
    notificationContent: {
      flex: 1,
    },
    notificationUser: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    notificationTimestamp: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.orange["60"],
      marginTop: 8,
      marginLeft: 8,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
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
    emptyMessage: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      textAlign: "center",
    },
  });

  const renderNotification = ({ item }: { item: Notification }) => {
    const iconData = getNotificationIcon(item.type);

    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.isRead && styles.notificationCardUnread,
        ]}
        onPress={() => {
          if (item.postId) {
            navigation.navigate("PostDetail", { postId: item.postId });
          }
        }}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconData.bg }]}>
          <Text style={styles.iconText}>{iconData.icon}</Text>
        </View>

        <View style={styles.notificationContent}>
          <Text style={styles.notificationUser}>{item.user}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTimestamp}>{item.timestamp}</Text>
        </View>

        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: NotificationSection;
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  const filteredSections =
    filter === "unread"
      ? notificationSections
          .map((section) => ({
            ...section,
            data: section.data.filter((n) => !n.isRead),
          }))
          .filter((section) => section.data.length > 0)
      : notificationSections;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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
        <Text style={styles.headerTitle}>Community Notification</Text>
        <TouchableOpacity style={styles.markAllButton}>
          <Text style={styles.markAllText}>Mark All as Read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Row */}
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

      {/* Notifications List */}
      {filteredSections.length > 0 ? (
        <SectionList
          style={styles.content}
          sections={filteredSections}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          renderSectionHeader={renderSectionHeader}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyMessage}>
            You're all caught up!{"\n"}Check back later for new updates.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CommunityNotificationsScreen;
