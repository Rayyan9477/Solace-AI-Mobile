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
import { useTheme } from "../../shared/theme/ThemeContext";

const { width } = Dimensions.get("window");

const MoodStatsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Mock data based on the design
  const moodStatsData = {
    weeklyAverage: 3.8,
    todayMood: "Happy",
    moodHistory: [
      { day: "Mon", mood: "😊", score: 4 },
      { day: "Tue", mood: "😐", score: 3 },
      { day: "Wed", mood: "😢", score: 2 },
      { day: "Thu", mood: "😊", score: 4 },
      { day: "Fri", mood: "😌", score: 3 },
      { day: "Sat", mood: "😊", score: 4 },
      { day: "Sun", mood: "😐", score: 3 },
    ],
    moodDistribution: [
      { mood: "Very Happy", emoji: "😄", percentage: 25, color: "#4CAF50" },
      { mood: "Happy", emoji: "😊", percentage: 35, color: "#8BC34A" },
      { mood: "Neutral", emoji: "😐", percentage: 20, color: "#FFC107" },
      { mood: "Sad", emoji: "😢", percentage: 15, color: "#FF9800" },
      { mood: "Very Sad", emoji: "😞", percentage: 5, color: "#F44336" },
    ],
    insights: [
      "You've been consistently happy this week!",
      "Anxiety levels have decreased by 15%",
      "Best day: Friday with 4.2 average mood",
      "Most productive mood: Happy (87% productivity)",
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
            Mood Stats
          </Text>

          <TouchableOpacity style={styles.headerButton}>
            <NavigationIcon
              name="Home"
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
            {/* Today's Mood */}
            <View
              style={[
                styles.todayCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[styles.cardTitle, { color: theme.colors.text.primary }]}
              >
                See your mood through the day
              </Text>

              <View style={styles.todayMoodContainer}>
                <LinearGradient
                  colors={
                    isDarkMode ? ["#4CAF50", "#66BB6A"] : ["#E8F5E8", "#C8E6C9"]
                  }
                  style={styles.todayMoodCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.todayMoodEmoji}>😊</Text>
                </LinearGradient>

                <View style={styles.todayMoodInfo}>
                  <Text
                    style={[
                      styles.todayMoodTitle,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {moodStatsData.todayMood}
                  </Text>
                  <Text
                    style={[
                      styles.todayMoodSubtitle,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    Overall mood through the day
                  </Text>

                  <View style={styles.moodActions}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: theme.colors.primary[500] },
                      ]}
                      onPress={() => navigation.navigate("EnhancedMoodTracker")}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          { color: theme.colors.text.inverse },
                        ]}
                      >
                        Set Mood ✓
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: theme.colors.background.secondary },
                      ]}
                      onPress={() => navigation.navigate("MoodHistory")}
                    >
                      <Text
                        style={[
                          styles.actionButtonText,
                          { color: theme.colors.text.primary },
                        ]}
                      >
                        Statistics
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Weekly Mood Chart */}
            <View
              style={[
                styles.chartCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[styles.cardTitle, { color: theme.colors.text.primary }]}
              >
                Mood History
              </Text>

              <View style={styles.moodChart}>
                {moodStatsData.moodHistory.map((item, index) => (
                  <MoodChartItem
                    key={index}
                    item={item}
                    theme={theme}
                    isDarkMode={isDarkMode}
                    delay={index * 100}
                  />
                ))}
              </View>

              <View style={styles.chartLabels}>
                <Text
                  style={[
                    styles.chartLabel,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  This Week
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MoodHistory")}
                >
                  <Text
                    style={[
                      styles.seeAllText,
                      { color: theme.colors.primary[500] },
                    ]}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Mood Distribution */}
            <View
              style={[
                styles.distributionCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[styles.cardTitle, { color: theme.colors.text.primary }]}
              >
                Mood Distribution
              </Text>

              <View style={styles.distributionChart}>
                {moodStatsData.moodDistribution.map((mood, index) => (
                  <MoodDistributionBar
                    key={index}
                    mood={mood}
                    theme={theme}
                    delay={index * 150}
                  />
                ))}
              </View>
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
                    styles.cardTitle,
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

              {moodStatsData.insights.map((insight, index) => (
                <InsightItem
                  key={index}
                  insight={insight}
                  theme={theme}
                  delay={index * 200}
                />
              ))}
            </View>

            {/* Quick Actions */}
            <View
              style={[
                styles.actionsCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[styles.cardTitle, { color: theme.colors.text.primary }]}
              >
                Improve Your Mood
              </Text>

              <View style={styles.actionsGrid}>
                <ActionCard
                  title="Mindfulness"
                  subtitle="5 min session"
                  icon="🧘‍♀️"
                  gradient={["#4ECDC4", "#7FDBDA"]}
                  onPress={() => navigation.navigate("MindfulHours")}
                  theme={theme}
                />

                <ActionCard
                  title="Journal"
                  subtitle="Write thoughts"
                  icon="📝"
                  gradient={["#FFB347", "#FFCC70"]}
                  onPress={() => navigation.navigate("Journal")}
                  theme={theme}
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const MoodChartItem = ({ item, theme, isDarkMode, delay }) => {
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
        styles.chartItem,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={[styles.chartBar, { height: item.score * 15 }]} />
      <Text style={styles.chartEmoji}>{item.mood}</Text>
      <Text style={[styles.chartDay, { color: theme.colors.text.quaternary }]}>
        {item.day}
      </Text>
    </Animated.View>
  );
};

const MoodDistributionBar = ({ mood, theme, delay }) => {
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
    <Animated.View style={[styles.distributionItem, { opacity: fadeAnim }]}>
      <View style={styles.distributionLabel}>
        <Text style={styles.distributionEmoji}>{mood.emoji}</Text>
        <Text
          style={[
            styles.distributionMood,
            { color: theme.colors.text.primary },
          ]}
        >
          {mood.mood}
        </Text>
      </View>

      <View style={styles.distributionBarContainer}>
        <Animated.View
          style={[
            styles.distributionBar,
            {
              backgroundColor: mood.color,
              width: widthAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.distributionPercentage,
          { color: theme.colors.text.secondary },
        ]}
      >
        {mood.percentage}%
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

const ActionCard = ({ title, subtitle, icon, gradient, onPress, theme }) => {
  return (
    <TouchableOpacity
      style={styles.actionCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradient}
        style={styles.actionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.actionIcon}>{icon}</Text>
        <Text
          style={[styles.actionTitle, { color: theme.colors.text.inverse }]}
        >
          {title}
        </Text>
        <Text
          style={[styles.actionSubtitle, { color: theme.colors.text.inverse }]}
        >
          {subtitle}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
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
  todayCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  todayMoodContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  todayMoodCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  todayMoodEmoji: {
    fontSize: 32,
  },
  todayMoodInfo: {
    flex: 1,
  },
  todayMoodTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  todayMoodSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  moodActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodChart: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 100,
    marginBottom: 16,
  },
  chartItem: {
    alignItems: "center",
    gap: 4,
  },
  chartBar: {
    width: 8,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    minHeight: 20,
  },
  chartEmoji: {
    fontSize: 16,
  },
  chartDay: {
    fontSize: 10,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartLabel: {
    fontSize: 14,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  distributionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  distributionChart: {
    gap: 12,
  },
  distributionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  distributionLabel: {
    flexDirection: "row",
    alignItems: "center",
    width: 120,
    gap: 8,
  },
  distributionEmoji: {
    fontSize: 16,
  },
  distributionMood: {
    fontSize: 14,
    fontWeight: "500",
  },
  distributionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  distributionBar: {
    height: "100%",
    borderRadius: 4,
  },
  distributionPercentage: {
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
  actionsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  actionGradient: {
    padding: 16,
    alignItems: "center",
    minHeight: 100,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
  },
});

export default MoodStatsScreen;
