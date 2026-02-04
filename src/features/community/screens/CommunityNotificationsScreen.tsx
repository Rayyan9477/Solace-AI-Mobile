/**
 * CommunityNotificationsScreen Component
 * @description Notification center with time-filtered sections, color-coded
 *   notification types, and navigation to relevant content
 * @task Task 3.14.6: Community Notifications Screen (Screen 124)
 * @audit-fix Replaced "Joe Biden"/"John Cena" with appropriate placeholder names
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { palette } from "../../../shared/theme";

interface TabItem {
  id: string;
  label: string;
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  avatarColor: string;
}

interface NotificationSection {
  id: string;
  title: string;
  notifications: NotificationItem[];
}

interface CommunityNotificationsScreenProps {
  selectedTab: string;
  tabs: TabItem[];
  sections: NotificationSection[];
  onBack: () => void;
  onTabSelect: (id: string) => void;
  onNotificationPress: (id: string) => void;
  onOptionsPress: (sectionId: string) => void;
}

const colors = {
  background: palette.background.primary,
  white: palette.text.primary,
  cardBg: palette.background.secondary,
  textSecondary: palette.text.secondary,
  tabBg: palette.background.secondary,
  tabSelected: palette.primary.gold,
  tabSelectedText: palette.background.primary,
} as const;

export function CommunityNotificationsScreen({
  selectedTab,
  tabs,
  sections,
  onBack,
  onTabSelect,
  onNotificationPress,
  onOptionsPress,
}: CommunityNotificationsScreenProps): React.ReactElement {
  return (
    <View testID="community-notifications-screen" style={styles.container}>
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
        <Text style={styles.headerTitle}>Community Notification</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            testID={`tab-${tab.id}`}
            style={[styles.tab, selectedTab === tab.id && styles.tabSelected]}
            onPress={() => onTabSelect(tab.id)}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.id && styles.tabTextSelected,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notification Sections */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map((section) => (
          <View key={section.id}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <TouchableOpacity
                testID={`options-${section.id}`}
                onPress={() => onOptionsPress(section.id)}
                accessibilityRole="button"
                accessibilityLabel="Options"
              >
                <Text style={styles.optionsIcon}>{"\u22EF"}</Text>
              </TouchableOpacity>
            </View>
            {section.notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                testID={`notification-row-${notification.id}`}
                style={styles.notificationRow}
                onPress={() => onNotificationPress(notification.id)}
                accessibilityRole="button"
                accessibilityLabel={notification.title}
              >
                <View
                  style={[
                    styles.notificationAvatar,
                    { backgroundColor: notification.avatarColor },
                  ]}
                />
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationSubtitle}>
                    {notification.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: { color: colors.white, fontSize: 24 },
  container: { backgroundColor: colors.background, flex: 1 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  notificationAvatar: {
    borderRadius: 22,
    height: 44,
    width: 44,
  },
  notificationContent: { flex: 1, marginLeft: 12 },
  notificationRow: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  notificationSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  notificationTitle: { color: colors.white, fontSize: 14, fontWeight: "600" },
  optionsIcon: { color: colors.textSecondary, fontSize: 20 },
  scrollContent: { paddingBottom: 48 },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  sectionTitle: { color: colors.white, fontSize: 14, fontWeight: "700" },
  tab: {
    alignItems: "center",
    backgroundColor: colors.tabBg,
    borderRadius: 20,
    flex: 1,
    paddingVertical: 10,
  },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 24,
  },
  tabSelected: { backgroundColor: colors.tabSelected },
  tabText: { color: colors.white, fontSize: 14, fontWeight: "600" },
  tabTextSelected: { color: colors.tabSelectedText },
});

export default CommunityNotificationsScreen;
