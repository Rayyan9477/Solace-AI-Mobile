import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../contexts/ThemeContext";

const { width } = Dimensions.get("window");

const JournalStatsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Mock data matching the design
  const journalData = {
    totalJournals: 34,
    thisYear: "Journals this year",
    stats: [
      { number: 44, label: "Text Journal", color: "#4CAF50" },
      { number: 32, label: "Voice Memos", color: "#FF9800" },
      { number: 81, label: "Mood Entries", color: "#2196F3" },
    ],
    recentActivities: [
      { date: "Today", count: 3, type: "entries" },
      { date: "Yesterday", count: 2, type: "entries" },
      { date: "This Week", count: 12, type: "entries" },
      { date: "This Month", count: 34, type: "entries" },
    ],
    moodDistribution: [
      { mood: "😊", name: "Happy", count: 45, percentage: 35 },
      { mood: "😐", name: "Neutral", count: 32, percentage: 25 },
      { mood: "😢", name: "Sad", count: 20, percentage: 15 },
      { mood: "😰", name: "Anxious", count: 18, percentage: 14 },
      { mood: "😌", name: "Calm", count: 14, percentage: 11 },
    ],
    insights: [
      "You write most frequently on Sundays",
      "Evening entries show more positive sentiment",
      "Your mood has improved 23% this month",
    ],
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const backgroundColors = isDarkMode
    ? [
        theme.colors.dark.background.primary,
        theme.colors.dark.background.secondary,
      ]
    : [
        theme.colors.therapeutic.calming[50],
        theme.colors.therapeutic.peaceful[50],
      ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <LinearGradient
        colors={backgroundColors}
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
            Mental Journal
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("NewJournal")}
          >
            <MentalHealthIcon
              name="Journal"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Main Stats Card */}
            <LinearGradient
              colors={
                isDarkMode ? ["#8B4513", "#A0522D"] : ["#D2B48C", "#DEB887"]
              }
              style={styles.mainStatsCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.mainStatsContent}>
                <Text
                  style={[
                    styles.mainStatsNumber,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  {journalData.totalJournals}
                </Text>
                <Text
                  style={[
                    styles.mainStatsLabel,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  {journalData.thisYear}
                </Text>

                <View style={styles.calendarDots}>
                  {Array.from({ length: 30 }, (_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.calendarDot,
                        {
                          backgroundColor:
                            Math.random() > 0.7
                              ? "#4CAF50"
                              : Math.random() > 0.5
                                ? "#FF9800"
                                : "rgba(255,255,255,0.3)",
                        },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </LinearGradient>

            {/* Stats Grid */}
            <View
              style={[
                styles.statsGrid,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Journal Statistics
              </Text>

              <View style={styles.statsRow}>
                {journalData.stats.map((stat, index) => (
                  <StatCard
                    key={index}
                    stat={stat}
                    theme={theme}
                    delay={index * 100}
                  />
                ))}
              </View>
            </View>

            {/* Recent Activity */}
            <View
              style={[
                styles.activityCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Recent Activity
              </Text>

              {journalData.recentActivities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  activity={activity}
                  theme={theme}
                  delay={index * 100}
                />
              ))}
            </View>

            {/* Mood Distribution */}
            <View
              style={[
                styles.moodCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Mood in Journals
              </Text>

              {journalData.moodDistribution.map((mood, index) => (
                <MoodDistributionItem
                  key={index}
                  mood={mood}
                  theme={theme}
                  delay={index * 150}
                />
              ))}
            </View>

            {/* AI Insights */}
            <View
              style={[
                styles.insightsCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <View style={styles.insightsHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  AI Insights
                </Text>
                <View
                  style={[
                    styles.aiIcon,
                    { backgroundColor: theme.colors.primary[500] },
                  ]}
                >
                  <MentalHealthIcon
                    name="Brain"
                    size={16}
                    color={theme.colors.text.inverse}
                    variant="filled"
                  />
                </View>
              </View>

              {journalData.insights.map((insight, index) => (
                <InsightItem
                  key={index}
                  insight={insight}
                  theme={theme}
                  delay={index * 200}
                />
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: theme.colors.primary[500] },
                ]}
                onPress={() => navigation.navigate("NewJournal")}
              >
                <MentalHealthIcon
                  name="Journal"
                  size={20}
                  color={theme.colors.text.inverse}
                  variant="filled"
                />
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  New Journal Entry
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  { backgroundColor: theme.colors.background.secondary },
                ]}
                onPress={() => navigation.navigate("MyJournals")}
              >
                <MentalHealthIcon
                  name="Heart"
                  size={20}
                  color={theme.colors.text.primary}
                  variant="outline"
                />
                <Text
                  style={[
                    styles.secondaryButtonText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  View All Journals
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const StatCard = ({ stat, theme, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={[styles.statNumber, { color: stat.color }]}>
        {stat.number}
      </Text>
      <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
        {stat.label}
      </Text>
    </Animated.View>
  );
};

const ActivityItem = ({ activity, theme, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.activityItem,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: fadeAnim,
        },
      ]}
    >
      <View
        style={[
          styles.activityIcon,
          { backgroundColor: theme.colors.primary[500] },
        ]}
      >
        <Text style={styles.activityIconText}>📝</Text>
      </View>
      <View style={styles.activityContent}>
        <Text
          style={[styles.activityDate, { color: theme.colors.text.primary }]}
        >
          {activity.date}
        </Text>
        <Text
          style={[styles.activityCount, { color: theme.colors.text.secondary }]}
        >
          {activity.count} {activity.type}
        </Text>
      </View>
    </Animated.View>
  );
};

const MoodDistributionItem = ({ mood, theme, delay }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(widthAnim, {
        toValue: mood.percentage,
        duration: 1000,
        delay: delay + 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View style={[styles.moodItem, { opacity: fadeAnim }]}>
      <View style={styles.moodLabel}>
        <Text style={styles.moodEmoji}>{mood.mood}</Text>
        <Text style={[styles.moodName, { color: theme.colors.text.primary }]}>
          {mood.name}
        </Text>
      </View>

      <View style={styles.moodBarContainer}>
        <Animated.View
          style={[
            styles.moodBar,
            {
              backgroundColor: theme.colors.primary[500],
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      <Text style={[styles.moodCount, { color: theme.colors.text.secondary }]}>
        {mood.count}
      </Text>
    </Animated.View>
  );
};

const InsightItem = ({ insight, theme, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.insightItem,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: fadeAnim,
        },
      ]}
    >
      <View
        style={[
          styles.insightIcon,
          { backgroundColor: theme.colors.therapeutic.calming[500] },
        ]}
      >
        <Text style={styles.insightIconText}>💡</Text>
      </View>
      <Text style={[styles.insightText, { color: theme.colors.text.primary }]}>
        {insight}
      </Text>
    </Animated.View>
  );
};

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
  headerButton: {
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
  mainStatsCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainStatsContent: {
    alignItems: "center",
  },
  mainStatsNumber: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
  },
  mainStatsLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 20,
  },
  calendarDots: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    maxWidth: 200,
  },
  calendarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsGrid: {
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
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  activityCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  activityIconText: {
    fontSize: 14,
  },
  activityContent: {
    flex: 1,
  },
  activityDate: {
    fontSize: 14,
    fontWeight: "500",
  },
  activityCount: {
    fontSize: 12,
  },
  moodCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  moodLabel: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    gap: 8,
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodName: {
    fontSize: 14,
    fontWeight: "500",
  },
  moodBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  moodBar: {
    height: "100%",
    borderRadius: 4,
  },
  moodCount: {
    fontSize: 12,
    fontWeight: "500",
    width: 32,
    textAlign: "right",
  },
  insightsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  aiIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  insightIconText: {
    fontSize: 16,
  },
  insightText: {
    fontSize: 14,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default JournalStatsScreen;
