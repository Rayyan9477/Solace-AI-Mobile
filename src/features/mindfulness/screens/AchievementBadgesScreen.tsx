/**
 * Achievement Badges Screen - Mindfulness Milestones
 * Based on ui-designs/Dark-mode/🔒 Mindful Hours.png
 */

import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
  requirement: string;
  category: string;
}

export const AchievementBadgesScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const badges: Badge[] = [
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first mindfulness session",
      icon: "🎯",
      earned: true,
      requirement: "1 session",
      category: "Beginner",
    },
    {
      id: "2",
      title: "Week Warrior",
      description: "Practice mindfulness for 7 consecutive days",
      icon: "🔥",
      earned: true,
      requirement: "7 days",
      category: "Streak",
    },
    {
      id: "3",
      title: "Hour Master",
      description: "Accumulate 10 hours of mindfulness practice",
      icon: "⏰",
      earned: true,
      progress: 100,
      requirement: "10 hours",
      category: "Time",
    },
    {
      id: "4",
      title: "Morning Person",
      description: "Complete 20 morning meditation sessions",
      icon: "☀️",
      earned: false,
      progress: 65,
      requirement: "20 mornings",
      category: "Time of Day",
    },
    {
      id: "5",
      title: "Zen Master",
      description: "Reach 100 hours of total mindfulness practice",
      icon: "🧘",
      earned: false,
      progress: 42,
      requirement: "100 hours",
      category: "Time",
    },
    {
      id: "6",
      title: "Consistency Champion",
      description: "Maintain a 30-day meditation streak",
      icon: "💪",
      earned: false,
      progress: 23,
      requirement: "30 days",
      category: "Streak",
    },
    {
      id: "7",
      title: "Evening Calm",
      description: "Complete 20 evening meditation sessions",
      icon: "🌙",
      earned: false,
      progress: 35,
      requirement: "20 evenings",
      category: "Time of Day",
    },
    {
      id: "8",
      title: "Legendary",
      description: "Achieve 365 consecutive days of practice",
      icon: "👑",
      earned: false,
      progress: 8,
      requirement: "365 days",
      category: "Elite",
    },
  ];

  const stats = {
    totalBadges: 8,
    earnedBadges: 3,
    nextBadge: "Morning Person",
    nextProgress: "65%",
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
    content: {
      flex: 1,
    },
    progressCard: {
      backgroundColor: theme.colors.purple["20"],
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 20,
      padding: 20,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    progressStats: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 16,
    },
    progressStat: {
      alignItems: "center",
    },
    progressValue: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    progressLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    nextBadgeCard: {
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 12,
      padding: 12,
      alignItems: "center",
    },
    nextBadgeText: {
      fontSize: 13,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    section: {
      paddingHorizontal: 20,
      marginTop: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    badgesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    badgeCard: {
      width: "48%",
      backgroundColor: theme.colors.brown["10"],
      borderRadius: 16,
      padding: 16,
      alignItems: "center",
    },
    badgeCardEarned: {
      backgroundColor: theme.colors.green["20"],
    },
    badgeIcon: {
      fontSize: 48,
      marginBottom: 12,
      opacity: 0.3,
    },
    badgeIconEarned: {
      opacity: 1,
    },
    badgeTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 4,
      textAlign: "center",
    },
    badgeDescription: {
      fontSize: 11,
      lineHeight: 16,
      color: theme.colors.text.secondary,
      textAlign: "center",
      marginBottom: 8,
    },
    badgeRequirement: {
      fontSize: 11,
      fontWeight: "700",
      color: theme.colors.text.tertiary,
      marginBottom: 8,
    },
    progressBarContainer: {
      width: "100%",
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.colors.gray["20"],
      overflow: "hidden",
      marginBottom: 4,
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: theme.colors.purple["60"],
      borderRadius: 3,
    },
    progressBarFillEarned: {
      backgroundColor: theme.colors.green["60"],
    },
    progressPercentage: {
      fontSize: 10,
      fontWeight: "700",
      color: theme.colors.text.secondary,
    },
    earnedBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: theme.colors.green["60"],
    },
    earnedBadgeText: {
      fontSize: 10,
      fontWeight: "700",
      color: "#FFFFFF",
      textTransform: "uppercase",
    },
    categoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: theme.colors.purple["60"],
      marginBottom: 8,
    },
    categoryText: {
      fontSize: 9,
      fontWeight: "700",
      color: "#FFFFFF",
      textTransform: "uppercase",
    },
  });

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
        <Text style={styles.headerTitle}>Achievement Badges</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Card */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Your Progress</Text>

          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>
                {stats.earnedBadges}/{stats.totalBadges}
              </Text>
              <Text style={styles.progressLabel}>Badges Earned</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressValue}>
                {Math.round((stats.earnedBadges / stats.totalBadges) * 100)}%
              </Text>
              <Text style={styles.progressLabel}>Complete</Text>
            </View>
          </View>

          <View style={styles.nextBadgeCard}>
            <Text style={styles.nextBadgeText}>
              Next: {stats.nextBadge} ({stats.nextProgress})
            </Text>
          </View>
        </View>

        {/* Earned Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Earned Badges</Text>
          <View style={styles.badgesGrid}>
            {badges
              .filter((badge) => badge.earned)
              .map((badge) => (
                <View
                  key={badge.id}
                  style={[styles.badgeCard, styles.badgeCardEarned]}
                >
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{badge.category}</Text>
                  </View>
                  <Text style={[styles.badgeIcon, styles.badgeIconEarned]}>
                    {badge.icon}
                  </Text>
                  <Text style={styles.badgeTitle}>{badge.title}</Text>
                  <Text style={styles.badgeDescription}>
                    {badge.description}
                  </Text>
                  <View style={styles.earnedBadge}>
                    <Text style={styles.earnedBadgeText}>✓ Earned</Text>
                  </View>
                </View>
              ))}
          </View>
        </View>

        {/* In Progress Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📈 In Progress</Text>
          <View style={styles.badgesGrid}>
            {badges
              .filter((badge) => !badge.earned)
              .map((badge) => (
                <View key={badge.id} style={styles.badgeCard}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{badge.category}</Text>
                  </View>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text style={styles.badgeTitle}>{badge.title}</Text>
                  <Text style={styles.badgeDescription}>
                    {badge.description}
                  </Text>
                  <Text style={styles.badgeRequirement}>
                    {badge.requirement}
                  </Text>
                  {badge.progress !== undefined && (
                    <>
                      <View style={styles.progressBarContainer}>
                        <View
                          style={[
                            styles.progressBarFill,
                            badge.earned && styles.progressBarFillEarned,
                            { width: `${badge.progress}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressPercentage}>
                        {badge.progress}%
                      </Text>
                    </>
                  )}
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AchievementBadgesScreen;
