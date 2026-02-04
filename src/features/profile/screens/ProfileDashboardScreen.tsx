/**
 * ProfileDashboardScreen Component
 * @description Profile overview with avatar, stats, Solace Score card, and mood card
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
import { palette } from "../../../shared/theme";

interface ProfileDashboardScreenProps {
  username: string;
  membershipTier: string;
  age: string;
  weight: string;
  height: string;
  solaceScore: number;
  scoreStatus: string;
  currentMood: string;
  moodData: number[];
  onSettings: () => void;
  onScorePress: () => void;
  onMoodPress: () => void;
}

const colors = {
  background: palette.brown[900],
  white: palette.white,
  textSecondary: `${palette.white}${palette.alpha[60]}`,
  cardBg: "#2A1F18",
  headerBg: palette.brown[700],
  badgeBg: palette.olive[500],
  badgeText: palette.brown[900],
  scoreColor: palette.tan[500],
  moodBarBg: `${palette.white}${palette.alpha[20]}`,
  moodBarActive: palette.olive[500],
} as const;

export function ProfileDashboardScreen({
  username,
  membershipTier,
  age,
  weight,
  height,
  solaceScore,
  scoreStatus,
  currentMood,
  moodData,
  onSettings,
  onScorePress,
  onMoodPress,
}: ProfileDashboardScreenProps): React.ReactElement {
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
          <Text style={styles.username}>{username}</Text>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    borderColor: colors.white,
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
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  container: { backgroundColor: colors.background, flex: 1 },
  headerBg: {
    backgroundColor: colors.headerBg,
    height: 140,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  membershipBadge: {
    backgroundColor: colors.badgeBg,
    borderRadius: 12,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  membershipText: {
    color: colors.badgeText,
    fontSize: 12,
    fontWeight: "600",
  },
  moodBar: {
    backgroundColor: colors.moodBarActive,
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
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    flex: 1,
    padding: 16,
  },
  moodLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 80,
  },
  scoreCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    flex: 1,
    padding: 16,
  },
  scoreStatusText: {
    color: colors.moodBarActive,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  scoreValue: {
    color: colors.scoreColor,
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
  statItem: { alignItems: "center" },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  statValue: {
    color: colors.white,
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
    color: colors.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 12,
  },
});

export default ProfileDashboardScreen;
