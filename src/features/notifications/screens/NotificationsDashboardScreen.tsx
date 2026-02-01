/**
 * NotificationsDashboardScreen Component
 * @description Central notifications hub with time-grouped notifications
 * @task Task 3.16.1: Notifications Dashboard Screen (Screen 134)
 * @audit-fix "Dr Freud AI" → "Dr Solace AI"
 * @audit-fix "Shinomiya Data.pdf" → "Monthly_Health_Report.pdf"
 * @audit-fix "Dr Freud Recommendations" → "Dr Solace Recommendations"
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  avatarColor: string;
  avatarIcon: string;
  badge?: string;
  isComplete?: boolean;
  attachment?: string;
}

interface NotificationSection {
  id: string;
  title: string;
  notifications: NotificationItem[];
}

interface NotificationsDashboardScreenProps {
  unreadCount: number;
  sections: NotificationSection[];
  onBack: () => void;
  onSettings: () => void;
  onNotificationPress: (notification: NotificationItem) => void;
  onOptionsPress: (sectionId: string) => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  badgeBg: "#E8853A",
  cardBg: "#2A1F18",
} as const;

export function NotificationsDashboardScreen({
  unreadCount,
  sections,
  onBack,
  onSettings,
  onNotificationPress,
  onOptionsPress,
}: NotificationsDashboardScreenProps): React.ReactElement {
  return (
    <View testID="notifications-dashboard-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u2190"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>+{unreadCount}</Text>
        </View>
        <View style={styles.headerSpacer} />
        <TouchableOpacity
          testID="settings-button"
          style={styles.settingsButton}
          onPress={onSettings}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Text style={styles.settingsIcon}>{"\u2699\uFE0F"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map((section) => (
          <View key={section.id}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <TouchableOpacity
                testID={`section-options-${section.id}`}
                style={styles.optionsButton}
                onPress={() => onOptionsPress(section.id)}
                accessibilityRole="button"
                accessibilityLabel={`Options for ${section.title}`}
              >
                <Text style={styles.optionsIcon}>{"\u22EF"}</Text>
              </TouchableOpacity>
            </View>

            {/* Notification Rows */}
            {section.notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                testID={`notification-${notification.id}`}
                style={styles.notificationRow}
                onPress={() => onNotificationPress(notification)}
                accessibilityRole="button"
                accessibilityLabel={notification.title}
              >
                <View
                  testID={`notification-avatar-${notification.id}`}
                  style={[
                    styles.avatar,
                    { backgroundColor: notification.avatarColor },
                  ]}
                >
                  <Text style={styles.avatarIcon}>
                    {notification.avatarIcon}
                  </Text>
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationSubtitle}>
                    {notification.subtitle}
                  </Text>
                  {notification.attachment && (
                    <Text style={styles.attachment}>
                      {"\u2B07"} {notification.attachment}
                    </Text>
                  )}
                </View>
                {notification.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notification.badge}</Text>
                  </View>
                )}
                {notification.isComplete && (
                  <Text style={styles.checkmark}>{"\u2713"}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  attachment: {
    color: "#3498DB",
    fontSize: 12,
    marginTop: 4,
  },
  avatar: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  avatarIcon: { fontSize: 18 },
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  badge: {
    backgroundColor: colors.cardBg,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { color: colors.textSecondary, fontSize: 11, fontWeight: "600" },
  checkmark: { color: "#9AAD5C", fontSize: 18 },
  container: { backgroundColor: colors.background, flex: 1 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerSpacer: { flex: 1 },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 8,
  },
  notificationContent: { flex: 1, marginLeft: 12 },
  notificationRow: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 56,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  notificationSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  notificationTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  optionsButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  optionsIcon: { color: colors.textSecondary, fontSize: 18 },
  scrollContent: { paddingBottom: 48 },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  settingsButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  settingsIcon: { fontSize: 20 },
  unreadBadge: {
    backgroundColor: colors.badgeBg,
    borderRadius: 10,
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
});

export default NotificationsDashboardScreen;
