/**
 * HomeDashboardScreen Component
 * @description Main home dashboard screen with mental health metrics
 * @task Task 3.5.1: Home Dashboard Screen (Screen 40)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

type MoodType = "happy" | "sad" | "neutral" | "angry" | "anxious";
type SolaceStatus = "Mentally Stable" | "Needs Attention" | "Critical";

interface Article {
  id: string;
  title: string;
  thumbnail: string;
}

interface HomeDashboardScreenProps {
  userName: string;
  userAvatar?: string;
  currentDate: Date;
  solaceScore: number;
  solaceStatus: SolaceStatus;
  currentMood: MoodType;
  mindfulHours: number;
  sleepQuality: number;
  journalPages: number;
  stressLevel: number;
  weeklyMoods: readonly MoodType[];
  conversationCount: number;
  articles: Article[];
  notificationCount: number;
  onSolaceScorePress?: () => void;
  onMoodPress?: () => void;
  onMindfulHoursPress?: () => void;
  onSleepQualityPress?: () => void;
  onJournalPress?: () => void;
  onStressLevelPress?: () => void;
  onChatbotPress?: () => void;
  onArticlePress?: (articleId: string) => void;
  onSearchPress?: () => void;
  onNotificationPress?: () => void;
}

const MOOD_EMOJI: Record<MoodType, string> = {
  happy: "😊",
  sad: "😢",
  neutral: "😐",
  angry: "😠",
  anxious: "😰",
};

const formatDate = (date: Date): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
};

const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export function HomeDashboardScreen({
  userName,
  userAvatar,
  currentDate,
  solaceScore,
  solaceStatus,
  currentMood,
  mindfulHours,
  sleepQuality,
  journalPages,
  stressLevel,
  weeklyMoods,
  conversationCount,
  articles,
  notificationCount,
  onSolaceScorePress,
  onMoodPress,
  onMindfulHoursPress,
  onSleepQualityPress,
  onJournalPress,
  onStressLevelPress,
  onChatbotPress,
  onArticlePress,
  onSearchPress,
  onNotificationPress,
}: HomeDashboardScreenProps): React.ReactElement {
  return (
    <View testID="home-dashboard-screen" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.dateLabel}>{formatDate(currentDate)}</Text>
          <View style={styles.greetingRow}>
            <View testID="user-avatar" style={styles.avatarContainer}>
              {userAvatar ? (
                <Image source={{ uri: userAvatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{userName.charAt(0)}</Text>
                </View>
              )}
            </View>
            <Text style={styles.greetingText}>Hi, {userName}!</Text>
            <TouchableOpacity
              testID="notification-bell"
              style={styles.notificationButton}
              onPress={onNotificationPress}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <Text style={styles.bellIcon}>🔔</Text>
              {notificationCount > 0 && (
                <View testID="notification-badge" style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{notificationCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          testID="search-bar"
          style={styles.searchBar}
          onPress={onSearchPress}
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search anything</Text>
        </TouchableOpacity>

        {/* Mental Health Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mental Health Metrics</Text>

          {/* Solace Score Card - Large */}
          <TouchableOpacity
            testID="solace-score-card"
            style={styles.solaceScoreCard}
            onPress={onSolaceScorePress}
            accessibilityRole="button"
            accessibilityLabel={`Solace Score ${solaceScore}, ${solaceStatus}`}
          >
            <View style={styles.scoreGaugeContainer}>
              <View style={styles.scoreGauge}>
                <Text style={styles.scoreValue}>{solaceScore}</Text>
              </View>
            </View>
            <Text style={styles.scoreLabel}>Solace Score</Text>
            <Text style={styles.scoreStatus}>{solaceStatus}</Text>
          </TouchableOpacity>

          {/* Metrics Grid */}
          <View style={styles.metricsGrid}>
            {/* Mood Card */}
            <TouchableOpacity
              testID="mood-card"
              style={styles.metricCard}
              onPress={onMoodPress}
              accessibilityRole="button"
              accessibilityLabel={`Mood: ${currentMood}`}
            >
              <Text style={styles.metricLabel}>Mood</Text>
              <Text style={styles.moodEmoji}>{MOOD_EMOJI[currentMood]}</Text>
            </TouchableOpacity>

            {/* Mindful Hours Card */}
            <TouchableOpacity
              testID="mindful-hours-card"
              style={styles.metricCard}
              onPress={onMindfulHoursPress}
              accessibilityRole="button"
              accessibilityLabel={`Mindful Hours: ${mindfulHours} hours`}
            >
              <Text style={styles.metricLabel}>Mindful Hours</Text>
              <Text style={styles.metricValue}>{mindfulHours} Hrs</Text>
            </TouchableOpacity>

            {/* Sleep Quality Card */}
            <TouchableOpacity
              testID="sleep-quality-card"
              style={styles.metricCard}
              onPress={onSleepQualityPress}
              accessibilityRole="button"
              accessibilityLabel={`Sleep Quality: ${sleepQuality}%`}
            >
              <Text style={styles.metricLabel}>Sleep Quality</Text>
              <View style={styles.sleepBar}>
                <View
                  style={[styles.sleepBarFill, { width: `${sleepQuality}%` }]}
                />
              </View>
            </TouchableOpacity>

            {/* Journal Card */}
            <TouchableOpacity
              testID="journal-card"
              style={styles.metricCard}
              onPress={onJournalPress}
              accessibilityRole="button"
              accessibilityLabel={`Mental Journal: ${journalPages} pages`}
            >
              <Text style={styles.metricLabel}>Mental Journal</Text>
              <Text style={styles.metricValue}>{journalPages} Pages</Text>
            </TouchableOpacity>
          </View>

          {/* Secondary Metrics Row */}
          <View style={styles.secondaryMetrics}>
            {/* Stress Level */}
            <TouchableOpacity
              testID="stress-level-card"
              style={styles.secondaryCard}
              onPress={onStressLevelPress}
              accessibilityRole="button"
              accessibilityLabel={`Stress Level: ${stressLevel} out of 5`}
            >
              <Text style={styles.metricLabel}>Stress Level</Text>
              <Text style={styles.metricValue}>{stressLevel}/5</Text>
            </TouchableOpacity>

            {/* Mood Tracker */}
            <TouchableOpacity
              testID="mood-tracker-card"
              style={styles.secondaryCard}
              onPress={onMoodPress}
              accessibilityRole="button"
              accessibilityLabel="Weekly Mood Tracker"
            >
              <Text style={styles.metricLabel}>Mood Tracker</Text>
              <View style={styles.weeklyMoods}>
                {weeklyMoods.map((mood, index) => (
                  <Text key={index} style={styles.weeklyMoodEmoji}>
                    {MOOD_EMOJI[mood]}
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Therapy Chatbot Section */}
        <TouchableOpacity
          testID="chatbot-section"
          style={styles.chatbotSection}
          onPress={onChatbotPress}
          accessibilityRole="button"
          accessibilityLabel="AI Therapy Chatbot"
        >
          <Text style={styles.sectionTitle}>AI Therapy Chatbot</Text>
          <Text style={styles.conversationCount}>
            {formatNumber(conversationCount)}
          </Text>
          <Text style={styles.conversationLabel}>Conversations</Text>
          <View style={styles.recommendationButton}>
            <Text style={styles.recommendationText}>
              Get recommendation for the day's needs
            </Text>
          </View>
        </TouchableOpacity>

        {/* Mindful Articles Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mindful Articles</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.articlesScroll}
          >
            {articles.map((article) => (
              <TouchableOpacity
                key={article.id}
                testID={`article-card-${article.id}`}
                style={styles.articleCard}
                onPress={() => onArticlePress?.(article.id)}
                accessibilityRole="button"
                accessibilityLabel={article.title}
              >
                <Image
                  source={{ uri: article.thumbnail }}
                  style={styles.articleThumbnail}
                />
                <Text style={styles.articleTitle} numberOfLines={2}>
                  {article.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  articleCard: {
    marginRight: 16,
    width: 160,
  },
  articleThumbnail: {
    backgroundColor: "#2A1F19",
    borderRadius: 12,
    height: 100,
    marginBottom: 8,
    width: 160,
  },
  articleTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  articlesScroll: {
    marginTop: 12,
  },
  avatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  avatarPlaceholder: {
    alignItems: "center",
    backgroundColor: "#C4A574",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  bellIcon: {
    fontSize: 20,
  },
  chatbotSection: {
    backgroundColor: "#2A1F19",
    borderRadius: 16,
    marginHorizontal: 24,
    marginVertical: 16,
    padding: 20,
  },
  container: {
    backgroundColor: "#1C1410",
    flex: 1,
    paddingTop: 60,
  },
  conversationCount: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "700",
    marginTop: 8,
  },
  conversationLabel: {
    color: "#94A3B8",
    fontSize: 14,
    marginBottom: 16,
  },
  dateLabel: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 8,
  },
  greetingRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  greetingText: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
  },
  header: {
    paddingHorizontal: 24,
  },
  metricCard: {
    backgroundColor: "#2A1F19",
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    minHeight: 80,
    padding: 12,
  },
  metricLabel: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 8,
  },
  metricValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginTop: 12,
  },
  moodEmoji: {
    fontSize: 28,
  },
  notificationBadge: {
    alignItems: "center",
    backgroundColor: "#E8853A",
    borderRadius: 8,
    height: 16,
    justifyContent: "center",
    minWidth: 16,
    position: "absolute",
    right: -4,
    top: -4,
  },
  notificationButton: {
    minHeight: 44,
    minWidth: 44,
    padding: 8,
  },
  recommendationButton: {
    backgroundColor: "#3D2E23",
    borderRadius: 8,
    padding: 12,
  },
  recommendationText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
  },
  scoreGauge: {
    alignItems: "center",
    backgroundColor: "#1C1410",
    borderRadius: 40,
    height: 80,
    justifyContent: "center",
    width: 80,
  },
  scoreGaugeContainer: {
    alignItems: "center",
    backgroundColor: "#9AAD5C",
    borderRadius: 50,
    height: 100,
    justifyContent: "center",
    marginBottom: 12,
    width: 100,
  },
  scoreLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  scoreStatus: {
    color: "#9AAD5C",
    fontSize: 12,
    marginTop: 4,
  },
  scoreValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  searchBar: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 12,
    flexDirection: "row",
    marginHorizontal: 24,
    marginVertical: 16,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchPlaceholder: {
    color: "#64748B",
    fontSize: 14,
  },
  secondaryCard: {
    backgroundColor: "#2A1F19",
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
  },
  secondaryMetrics: {
    flexDirection: "row",
    marginHorizontal: -4,
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  sleepBar: {
    backgroundColor: "#3D2E23",
    borderRadius: 4,
    height: 8,
    marginTop: 8,
    overflow: "hidden",
  },
  sleepBarFill: {
    backgroundColor: "#9AAD5C",
    height: "100%",
  },
  solaceScoreCard: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 16,
    marginTop: 12,
    padding: 20,
  },
  weeklyMoodEmoji: {
    fontSize: 16,
  },
  weeklyMoods: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
});

export default HomeDashboardScreen;
