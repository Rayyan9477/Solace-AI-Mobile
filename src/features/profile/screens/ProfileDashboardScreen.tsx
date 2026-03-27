/**
 * ProfileDashboardScreen Component
 * @description Profile overview with avatar, stats, Solace Score card, mood card, and settings menu
 * @task Task 3.17.2: Profile Dashboard Screen (Screen 141)
 * @phase Phase 3C: Refactored to use theme tokens
 * @audit-fix "Shinomiya Kaguya" → appropriate placeholder name
 * @audit-fix Age 17y → adult age (24y)
 * @audit-fix "Freud Score" → "Solace Score"
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { palette } from "../../../shared/theme";

interface ProfileDashboardScreenProps {
  username?: string;
  membershipTier?: string;
  age?: string;
  weight?: string;
  height?: string;
  solaceScore?: number;
  scoreStatus?: string;
  currentMood?: string;
  moodData?: number[];
  onSettings?: () => void;
  onScorePress?: () => void;
  onMoodPress?: () => void;
  onNavigateAccountSettings?: () => void;
  onNavigatePersonalInfo?: () => void;
  onNavigateNotifications?: () => void;
  onNavigateSecurityPrivacy?: () => void;
  onNavigateLinkedDevices?: () => void;
  onNavigateLanguage?: () => void;
  onNavigateHelpCenter?: () => void;
  onNavigateSendFeedback?: () => void;
  onNavigateInviteFriends?: () => void;
  onNavigateAboutSolace?: () => void;
  onSignOut?: () => void;
}

const localColors = {
  background: palette.brown[900],
  white: palette.white,
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  cardBg: palette.brown[800],
  headerBg: palette.brown[700],
  badgeBg: palette.olive[500],
  badgeText: palette.brown[900],
  scoreColor: palette.tan[500],
  moodBarBg: `${palette.white}${palette.alpha[20]}`,
  moodBarActive: palette.olive[500],
  menuBg: palette.brown[800],
  menuItemBorder: `${palette.white}${palette.alpha[10]}`,
  menuIcon: palette.tan[400],
  menuChevron: palette.gray[400],
  signOutText: palette.red[500],
  signOutBg: `${palette.red[500]}${palette.alpha[10]}`,
  signOutBorder: `${palette.red[500]}${palette.alpha[30]}`,
} as const;

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  onPress?: () => void;
}

export function ProfileDashboardScreen({
  username = "User",
  membershipTier = "Free",
  age = "--",
  weight = "--",
  height = "--",
  solaceScore = 0,
  scoreStatus = "Stable",
  currentMood = "Neutral",
  moodData = [],
  onSettings,
  onScorePress,
  onMoodPress,
  onNavigateAccountSettings,
  onNavigatePersonalInfo,
  onNavigateNotifications,
  onNavigateSecurityPrivacy,
  onNavigateLinkedDevices,
  onNavigateLanguage,
  onNavigateHelpCenter,
  onNavigateSendFeedback,
  onNavigateInviteFriends,
  onNavigateAboutSolace,
  onSignOut,
}: ProfileDashboardScreenProps = {}): React.ReactElement {
  const menuItems: MenuItem[] = [
    {
      key: "account-settings",
      label: "Account Settings",
      icon: "person-outline",
      onPress: onNavigateAccountSettings,
    },
    {
      key: "personal-info",
      label: "Personal Information",
      icon: "information-circle-outline",
      onPress: onNavigatePersonalInfo,
    },
    {
      key: "notifications",
      label: "Notifications",
      icon: "notifications-outline",
      onPress: onNavigateNotifications,
    },
    {
      key: "security-privacy",
      label: "Security & Privacy",
      icon: "shield-checkmark-outline",
      onPress: onNavigateSecurityPrivacy,
    },
    {
      key: "linked-devices",
      label: "Linked Devices",
      icon: "phone-portrait-outline",
      onPress: onNavigateLinkedDevices,
    },
    {
      key: "language",
      label: "Language",
      icon: "globe-outline",
      onPress: onNavigateLanguage,
    },
    {
      key: "help-center",
      label: "Help Center",
      icon: "help-circle-outline",
      onPress: onNavigateHelpCenter,
    },
    {
      key: "send-feedback",
      label: "Send Feedback",
      icon: "chatbox-outline",
      onPress: onNavigateSendFeedback,
    },
    {
      key: "invite-friends",
      label: "Invite Friends",
      icon: "people-outline",
      onPress: onNavigateInviteFriends,
    },
    {
      key: "about-solace",
      label: "About Solace",
      icon: "information-outline",
      onPress: onNavigateAboutSolace,
    },
  ];

  return (
    <View testID="profile-dashboard-screen" style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Background */}
        <View style={styles.headerBg} />

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View testID="profile-avatar" style={styles.avatar} />
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
          <Text style={styles.username} accessibilityRole="header">{username}</Text>
          <View style={styles.membershipBadge}>
            <Text style={styles.membershipText}>{membershipTier}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Age</Text>
            <Text style={styles.statValue}>{age}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Weight</Text>
            <Text style={styles.statValue}>{weight}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Height</Text>
            <Text style={styles.statValue}>{height}</Text>
          </View>
        </View>

        {/* Metrics Cards */}
        <View style={styles.cardsRow}>
          <TouchableOpacity
            testID="solace-score-card"
            style={styles.scoreCard}
            onPress={onScorePress}
            accessibilityRole="button"
            accessibilityLabel="View Solace Score"
          >
            <Text style={styles.cardTitle}>Solace Score</Text>
            <Text style={styles.scoreValue}>{solaceScore}</Text>
            <Text style={styles.scoreStatusText}>{scoreStatus}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="mood-card"
            style={styles.moodCard}
            onPress={onMoodPress}
            accessibilityRole="button"
            accessibilityLabel="View Mood"
          >
            <Text style={styles.cardTitle}>Mood</Text>
            <Text style={styles.moodLabel}>{currentMood}</Text>
            <View testID="mood-bar-chart" style={styles.moodBarChart}>
              {moodData.map((value, index) => (
                <View
                  key={index}
                  style={[
                    styles.moodBar,
                    { height: Math.max(8, (value / 10) * 40) },
                  ]}
                />
              ))}
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings Menu Section */}
        <View testID="settings-menu" style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Settings</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.key}
                testID={`menu-item-${item.key}`}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder,
                ]}
                onPress={item.onPress}
                accessibilityRole="button"
                accessibilityLabel={item.label}
              >
                <View style={styles.menuItemIcon}>
                  <Icon
                    name={item.icon}
                    size={20}
                    color={localColors.menuIcon}
                  />
                </View>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
                <Icon
                  name="chevron-forward-outline"
                  size={18}
                  color={localColors.menuChevron}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          testID="sign-out-button"
          style={styles.signOutButton}
          onPress={onSignOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <Icon name="log-out-outline" size={20} color={localColors.signOutText} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    borderColor: localColors.white,
    borderRadius: 48,
    borderWidth: 3,
    height: 96,
    width: 96,
  },
  avatarContainer: {
    alignItems: "center",
    position: "relative",
  },
  cardTitle: {
    color: localColors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  container: { backgroundColor: localColors.background, flex: 1 },
  headerBg: {
    backgroundColor: localColors.headerBg,
    height: 140,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  membershipBadge: {
    backgroundColor: localColors.badgeBg,
    borderRadius: 12,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  membershipText: {
    color: localColors.badgeText,
    fontSize: 12,
    fontWeight: "600",
  },
  menuContainer: {
    backgroundColor: localColors.menuBg,
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItem: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomColor: localColors.menuItemBorder,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuItemIcon: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    marginRight: 12,
    width: 32,
  },
  menuItemLabel: {
    color: palette.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  menuSection: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  menuSectionTitle: {
    color: localColors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  moodBar: {
    backgroundColor: localColors.moodBarActive,
    borderRadius: 3,
    flex: 1,
  },
  moodBarChart: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 4,
    marginTop: 8,
  },
  moodCard: {
    backgroundColor: localColors.cardBg,
    borderRadius: 16,
    flex: 1,
    padding: 16,
  },
  moodLabel: {
    color: localColors.white,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 80,
  },
  scoreCard: {
    backgroundColor: localColors.cardBg,
    borderRadius: 16,
    flex: 1,
    padding: 16,
  },
  scoreStatusText: {
    color: localColors.moodBarActive,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  scoreValue: {
    color: localColors.scoreColor,
    fontSize: 36,
    fontWeight: "800",
    marginTop: 8,
  },
  scrollContent: { paddingBottom: 48 },
  settingsButton: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    position: "absolute",
    right: -16,
  },
  settingsIcon: { fontSize: 20 },
  signOutButton: {
    alignItems: "center",
    backgroundColor: localColors.signOutBg,
    borderColor: localColors.signOutBorder,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 16,
    minHeight: 56,
    paddingVertical: 16,
  },
  signOutText: {
    color: localColors.signOutText,
    fontSize: 16,
    fontWeight: "600",
  },
  statItem: { alignItems: "center" },
  statLabel: {
    color: localColors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  statValue: {
    color: localColors.white,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 24,
    paddingHorizontal: 24,
  },
  username: {
    color: localColors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 12,
  },
});

export default ProfileDashboardScreen;
