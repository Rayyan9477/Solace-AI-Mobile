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
  RefreshControl,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { FreudLogo, ThemedFreudIcon } from "../../components/icons/FreudIcons";
import FreudButton from "../../components/ui/FreudButton";
import { useTheme } from "../../shared/theme/ThemeContext";
import { freudTheme } from "../../shared/theme/freudTheme";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [userName] = useState("Shinomiya"); // In real app, get from user profile
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Mock data - in real app this would come from API/state
  const mentalHealthData = {
    currentScore: 80,
    status: "Mentally Stable",
    streak: 7,
    scoreHistory: [65, 70, 75, 78, 80, 85, 80], // Weekly scores
    moodHistory: ["😊", "😐", "😔", "😊", "😌", "😊", "😐"], // Daily moods
    activities: {
      mindfulHours: { current: 25, total: 30, unit: "mins" },
      sleepQuality: { current: "Excellent", score: 9.2 },
      mindfulJournal: { entries: 14, streak: 7 },
      stressLevel: { level: 3, status: "Normal" },
      moodTracker: { status: "Happy", lastUpdate: "2h ago" },
    },
    aiTherapy: {
      conversations: 2541,
      lastSession: "68 Mins Ago",
      nextSession: "Available Now",
    },
    suggestions: [
      {
        title: "AI Suggestion Completed",
        subtitle: "+5 Freud Score Added",
        description:
          "Your Freud score increased to 85 points. Keep up the great work!",
        type: "completed",
        icon: "✨",
      },
      {
        title: "Why should we be mindful?",
        subtitle: "Mindfulness helps you to focus and reduce stress levels.",
        description:
          "Mindfulness has the potential of being the most important practice in your life.",
        type: "info",
        icon: "🧘",
      },
    ],
    recentActivities: [
      {
        id: 1,
        type: "meditation",
        title: "Mindfulness Session",
        duration: "10 mins",
        time: "2h ago",
        icon: "Mindfulness",
        color: "therapeutic.calming",
      },
      {
        id: 2,
        type: "journal",
        title: "Journal Entry",
        content: "Feeling grateful today...",
        time: "4h ago",
        icon: "Journal",
        color: "therapeutic.nurturing",
      },
      {
        id: 3,
        type: "mood",
        title: "Mood Check-in",
        mood: "Happy",
        time: "6h ago",
        icon: "Heart",
        color: "therapeutic.energizing",
      },
    ],
    insights: [
      {
        title: "Weekly meditation helps you get out from the rat race!",
        category: "Mental Health",
        readTime: "5 min",
        likes: 129,
        comments: 34,
      },
      {
        title: "Why meditation helps you get out from the rat race!",
        category: "Mental Health",
        readTime: "8 min",
        likes: 256,
        comments: 67,
      },
    ],
  };

  const quickActions = [
    {
      id: "mood",
      title: "Mood Score",
      subtitle: "80",
      icon: "Heart",
      color: "therapeutic.nurturing",
      gradient: ["#FF6B9D", "#FFB5C5"],
      onPress: () => navigation.navigate("MentalHealthScore"),
    },
    {
      id: "mindful",
      title: "Mindful Hours",
      subtitle: "25 Mins",
      icon: "Mindfulness",
      color: "therapeutic.calming",
      gradient: ["#4ECDC4", "#7FDBDA"],
      onPress: () => navigation.navigate("MindfulHours"),
    },
    {
      id: "sleep",
      title: "Sleep Quality",
      subtitle: "Excellent (9.2)",
      icon: "Brain",
      color: "therapeutic.peaceful",
      gradient: ["#A8E6CF", "#C8F7C5"],
      onPress: () => navigation.navigate("SleepQuality"),
    },
    {
      id: "journal",
      title: "Mindful Journal",
      subtitle: "14 Day Entries",
      icon: "Journal",
      color: "therapeutic.grounding",
      gradient: ["#FFB347", "#FFCC70"],
      onPress: () => navigation.navigate("Journal"),
    },
    {
      id: "stress",
      title: "Stress Level",
      subtitle: "Level 3 (Normal)",
      icon: "Therapy",
      color: "warning",
      gradient: ["#FFCC5C", "#FFE135"],
      onPress: () => navigation.navigate("StressManagement"),
    },
    {
      id: "mood-tracker",
      title: "Mood Tracker",
      subtitle: "Happy - Requiring",
      icon: "Heart",
      color: "success",
      gradient: ["#98D8C8", "#B8E6B8"],
      onPress: () => navigation.navigate("MoodTracker"),
    },
  ];

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

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "☀️ Good Morning";
    if (hour < 17) return "🌤️ Good Afternoon";
    return "🌙 Good Evening";
  };

  const getColorFromPath = (colorPath) => {
    const [category, shade] = colorPath.split(".");
    return theme.colors[category]?.[shade] || theme.colors.primary[500];
  };

  const backgroundColors = [
    freudTheme.colors.green[60], // Serenity Green from design reference
    freudTheme.colors.green[50],
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
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.greetingSection}>
            <Text
              style={[styles.greeting, { color: 'rgba(255,255,255,0.8)' }]}
            >
              {getTimeBasedGreeting()}
            </Text>
            <Text
              style={[styles.username, { color: '#FFFFFF' }]}
            >
              Hi, {userName}!
            </Text>
            <Text
              style={[styles.subtitle, { color: 'rgba(255,255,255,0.7)' }]}
            >
              How are you feeling today?
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.headerButton,
                { backgroundColor: 'rgba(255,255,255,0.2)' },
              ]}
              onPress={() => navigation.navigate("Search")}
            >
              <ThemedFreudIcon
                name="search"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.emergencyButton,
                { backgroundColor: freudTheme.colors.orange[40] },
              ]}
              onPress={() => {
                /* Emergency support */
              }}
            >
              <ThemedFreudIcon
                name="settings"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary[500]}
            />
          }
        >
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Mental Health Overview */}
            <View
              style={[
                styles.overviewCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <View style={styles.overviewHeader}>
                <Text
                  style={[
                    styles.overviewTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Mental Health Metrics
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MentalHealthScore")}
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

              <View style={styles.scoreSection}>
                <LinearGradient
                  colors={
                    isDarkMode ? ["#2D5A4B", "#4A8B3A"] : ["#E8F5E8", "#F0FFF0"]
                  }
                  style={styles.scoreContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Circular Score Display */}
                  <View style={styles.circularScoreContainer}>
                    <View
                      style={[
                        styles.circularScore,
                        {
                          backgroundColor: isDarkMode ? "#4A8B3A" : "#90EE90",
                          borderColor: isDarkMode ? "#66BB6A" : "#7CB342",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.circularScoreNumber,
                          {
                            color: isDarkMode ? "#FFFFFF" : "#2E7D32",
                          },
                        ]}
                      >
                        {mentalHealthData.currentScore}
                      </Text>
                      <Text
                        style={[
                          styles.circularScoreLabel,
                          {
                            color: isDarkMode ? "#E8F5E8" : "#388E3C",
                          },
                        ]}
                      >
                        {mentalHealthData.status}
                      </Text>
                    </View>

                    {/* Score History Mini Chart */}
                    <View style={styles.miniChart}>
                      <Text
                        style={[
                          styles.chartLabel,
                          { color: theme.colors.text.secondary },
                        ]}
                      >
                        Score History
                      </Text>
                      <View style={styles.chartBars}>
                        {mentalHealthData.scoreHistory.map((score, index) => (
                          <View
                            key={index}
                            style={[
                              styles.chartBar,
                              {
                                height: (score / 100) * 30,
                                backgroundColor:
                                  score === mentalHealthData.currentScore
                                    ? isDarkMode
                                      ? "#66BB6A"
                                      : "#4CAF50"
                                    : isDarkMode
                                      ? "#81C784"
                                      : "#A5D6A7",
                              },
                            ]}
                          />
                        ))}
                      </View>
                      <View style={styles.chartDays}>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                          (day, index) => (
                            <Text
                              key={index}
                              style={[
                                styles.dayLabel,
                                { color: theme.colors.text.quaternary },
                              ]}
                            >
                              {day.substring(0, 1)}
                            </Text>
                          ),
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.scoreActions}>
                    <TouchableOpacity
                      style={[
                        styles.scoreActionButton,
                        {
                          backgroundColor: isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.05)",
                        },
                      ]}
                      onPress={() => navigation.navigate("MentalHealthScore")}
                    >
                      <Text
                        style={[
                          styles.scoreActionText,
                          { color: theme.colors.text.primary },
                        ]}
                      >
                        View Freud Score (85)
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.scoreActionButton,
                        {
                          backgroundColor: isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.05)",
                        },
                      ]}
                      onPress={() => navigation.navigate("Assessment")}
                    >
                      <Text
                        style={[
                          styles.scoreActionText,
                          { color: theme.colors.text.primary },
                        ]}
                      >
                        Suggestions
                      </Text>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/* AI Suggestions */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                AI Suggestions
              </Text>

              {mentalHealthData.suggestions.map((suggestion, index) => (
                <SuggestionCard
                  key={index}
                  suggestion={suggestion}
                  theme={theme}
                  isDarkMode={isDarkMode}
                  delay={index * 100}
                />
              ))}
            </View>

            {/* Mindfulness Activities */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Mindfulness Activities
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("MindfulResources")}
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

              <View style={styles.mindfulnessGrid}>
                <MindfulnessActivityCard
                  title="Daily Meditation"
                  subtitle="Routine"
                  duration="15 mins"
                  image="🧘‍♀️"
                  theme={theme}
                  isDarkMode={isDarkMode}
                  onPress={() => navigation.navigate("MindfulHours")}
                />

                <MindfulnessActivityCard
                  title="Gratitude Journaling"
                  subtitle="All Occasions"
                  duration="10 mins"
                  image="📝"
                  theme={theme}
                  isDarkMode={isDarkMode}
                  onPress={() => navigation.navigate("Journal")}
                />
              </View>
            </View>

            {/* Quick Actions Grid */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Quick Actions
              </Text>

              <View style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                  <QuickActionCard
                    key={action.id}
                    action={action}
                    theme={theme}
                    onPress={action.onPress}
                    delay={index * 100}
                  />
                ))}
              </View>
            </View>

            {/* AI Therapy Chat */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                AI Therapy Chatbot
              </Text>

              <View
                style={[
                  styles.therapyCard,
                  { backgroundColor: theme.colors.background.secondary },
                ]}
              >
                <View style={styles.therapyStats}>
                  <View style={styles.statItem}>
                    <Text
                      style={[
                        styles.statNumber,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      {mentalHealthData.aiTherapy.conversations.toLocaleString()}
                    </Text>
                    <Text
                      style={[
                        styles.statLabel,
                        { color: theme.colors.text.secondary },
                      ]}
                    >
                      Conversations
                    </Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text
                      style={[
                        styles.statNumber,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      {mentalHealthData.aiTherapy.lastSession}
                    </Text>
                    <Text
                      style={[
                        styles.statLabel,
                        { color: theme.colors.text.secondary },
                      ]}
                    >
                      Last Session
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.chatButton,
                    { backgroundColor: theme.colors.primary[500] },
                  ]}
                  onPress={() => navigation.navigate("AITherapyChat")}
                >
                  <MentalHealthIcon
                    name="Brain"
                    size={20}
                    color={theme.colors.text.inverse}
                    variant="filled"
                  />
                  <Text
                    style={[
                      styles.chatButtonText,
                      { color: theme.colors.text.inverse },
                    ]}
                  >
                    Start Chat Session
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Activity */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Recent Activity
                </Text>
                <TouchableOpacity>
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

              {mentalHealthData.recentActivities.map((activity, index) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  theme={theme}
                  getColorFromPath={getColorFromPath}
                  delay={index * 100}
                />
              ))}
            </View>

            {/* Mindful Articles */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Mindful Articles
                </Text>
                <TouchableOpacity>
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

              {mentalHealthData.insights.map((insight, index) => (
                <InsightCard
                  key={index}
                  insight={insight}
                  theme={theme}
                  delay={index * 150}
                />
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const QuickActionCard = ({ action, theme, onPress, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
        styles.quickActionCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.quickActionButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={action.gradient}
          style={styles.quickActionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.quickActionIcon}>
            <MentalHealthIcon
              name={action.icon}
              size={24}
              color={theme.colors.text.inverse}
              variant="filled"
            />
          </View>
          <Text
            style={[
              styles.quickActionTitle,
              { color: theme.colors.text.inverse },
            ]}
          >
            {action.title}
          </Text>
          <Text
            style={[
              styles.quickActionSubtitle,
              { color: theme.colors.text.inverse },
            ]}
          >
            {action.subtitle}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ActivityCard = ({ activity, theme, getColorFromPath, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  const activityColor = getColorFromPath(activity.color);

  return (
    <Animated.View
      style={[
        styles.activityCard,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: fadeAnim,
        },
      ]}
    >
      <View
        style={[styles.activityIcon, { backgroundColor: `${activityColor}20` }]}
      >
        <MentalHealthIcon
          name={activity.icon}
          size={20}
          color={activityColor}
          variant="filled"
        />
      </View>

      <View style={styles.activityContent}>
        <Text
          style={[styles.activityTitle, { color: theme.colors.text.primary }]}
        >
          {activity.title}
        </Text>
        {activity.content && (
          <Text
            style={[
              styles.activityDescription,
              { color: theme.colors.text.secondary },
            ]}
          >
            {activity.content}
          </Text>
        )}
        {activity.duration && (
          <Text
            style={[
              styles.activityDuration,
              { color: theme.colors.text.tertiary },
            ]}
          >
            Duration: {activity.duration}
          </Text>
        )}
        {activity.mood && (
          <Text style={[styles.activityMood, { color: activityColor }]}>
            Mood: {activity.mood}
          </Text>
        )}
      </View>

      <Text
        style={[styles.activityTime, { color: theme.colors.text.quaternary }]}
      >
        {activity.time}
      </Text>
    </Animated.View>
  );
};

const SuggestionCard = ({ suggestion, theme, isDarkMode, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  const isCompleted = suggestion.type === "completed";
  const cardColors = isCompleted
    ? isDarkMode
      ? ["#2E7D32", "#4CAF50"]
      : ["#E8F5E8", "#C8E6C9"]
    : isDarkMode
      ? ["#37474F", "#546E7A"]
      : ["#F5F5F5", "#EEEEEE"];

  return (
    <Animated.View style={[styles.suggestionCard, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={cardColors}
        style={styles.suggestionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.suggestionHeader}>
          <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
          {isCompleted && (
            <View
              style={[
                styles.completedBadge,
                { backgroundColor: isDarkMode ? "#66BB6A" : "#4CAF50" },
              ]}
            >
              <Text style={styles.completedText}>✓</Text>
            </View>
          )}
        </View>

        <Text
          style={[
            styles.suggestionTitle,
            {
              color: isDarkMode
                ? "#FFFFFF"
                : isCompleted
                  ? "#2E7D32"
                  : "#424242",
            },
          ]}
        >
          {suggestion.title}
        </Text>

        <Text
          style={[
            styles.suggestionSubtitle,
            {
              color: isDarkMode
                ? "#E0E0E0"
                : isCompleted
                  ? "#388E3C"
                  : "#666666",
            },
          ]}
        >
          {suggestion.subtitle}
        </Text>

        <Text
          style={[
            styles.suggestionDescription,
            {
              color: isDarkMode
                ? "#BDBDBD"
                : isCompleted
                  ? "#4CAF50"
                  : "#757575",
            },
          ]}
        >
          {suggestion.description}
        </Text>

        {isCompleted && (
          <TouchableOpacity style={styles.thankButton}>
            <Text
              style={[
                styles.thankButtonText,
                { color: isDarkMode ? "#FFFFFF" : "#2E7D32" },
              ]}
            >
              Great, Thanks! ✓
            </Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const MindfulnessActivityCard = ({
  title,
  subtitle,
  duration,
  image,
  theme,
  isDarkMode,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.mindfulnessCard,
        { backgroundColor: theme.colors.background.secondary },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={isDarkMode ? ["#37474F", "#546E7A"] : ["#E8F5E8", "#F1F8E9"]}
        style={styles.mindfulnessGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.mindfulnessImage}>{image}</Text>
        <Text
          style={[
            styles.mindfulnessTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.mindfulnessSubtitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          {subtitle}
        </Text>
        <Text
          style={[
            styles.mindfulnessDuration,
            { color: theme.colors.text.tertiary },
          ]}
        >
          {duration}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const InsightCard = ({ insight, theme, delay }) => {
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
        styles.insightCard,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.insightHeader}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: theme.colors.therapeutic.nurturing[100] },
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              { color: theme.colors.therapeutic.nurturing[700] },
            ]}
          >
            {insight.category}
          </Text>
        </View>
        <Text
          style={[styles.readTime, { color: theme.colors.text.quaternary }]}
        >
          {insight.readTime}
        </Text>
      </View>

      <Text style={[styles.insightTitle, { color: theme.colors.text.primary }]}>
        {insight.title}
      </Text>

      <View style={styles.insightStats}>
        <View style={styles.statGroup}>
          <MentalHealthIcon
            name="Heart"
            size={16}
            color={theme.colors.text.quaternary}
            variant="outline"
          />
          <Text
            style={[styles.statText, { color: theme.colors.text.quaternary }]}
          >
            {insight.likes}
          </Text>
        </View>
        <View style={styles.statGroup}>
          <MentalHealthIcon
            name="Brain"
            size={16}
            color={theme.colors.text.quaternary}
            variant="outline"
          />
          <Text
            style={[styles.statText, { color: theme.colors.text.quaternary }]}
          >
            {insight.comments}
          </Text>
        </View>
      </View>
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  overviewCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scoreSection: {
    marginVertical: 8,
  },
  scoreContainer: {
    borderRadius: 16,
    padding: 20,
  },
  circularScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  circularScore: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  circularScoreNumber: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  circularScoreLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  miniChart: {
    flex: 1,
    alignItems: "center",
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 30,
    gap: 2,
    marginBottom: 4,
  },
  chartBar: {
    width: 8,
    borderRadius: 2,
    minHeight: 4,
  },
  chartDays: {
    flexDirection: "row",
    gap: 2,
  },
  dayLabel: {
    fontSize: 9,
    width: 8,
    textAlign: "center",
  },
  scoreActions: {
    flexDirection: "row",
    gap: 12,
  },
  scoreActionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  scoreActionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionCard: {
    width: (width - 64) / 2,
    marginBottom: 12,
  },
  quickActionButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  quickActionGradient: {
    padding: 16,
    alignItems: "center",
    minHeight: 100,
    justifyContent: "center",
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  quickActionSubtitle: {
    fontSize: 12,
    textAlign: "center",
  },
  therapyCard: {
    borderRadius: 12,
    padding: 16,
  },
  therapyStats: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 16,
  },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    marginBottom: 2,
  },
  activityDuration: {
    fontSize: 11,
  },
  activityMood: {
    fontSize: 11,
    fontWeight: "500",
  },
  activityTime: {
    fontSize: 11,
    marginLeft: 8,
  },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "500",
  },
  readTime: {
    fontSize: 11,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    lineHeight: 20,
  },
  insightStats: {
    flexDirection: "row",
    gap: 16,
  },
  statGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
  },
  // Suggestion Card Styles
  suggestionCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  suggestionGradient: {
    padding: 16,
  },
  suggestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  suggestionIcon: {
    fontSize: 24,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  completedText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  suggestionSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  suggestionDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  thankButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  thankButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  // Mindfulness Activity Styles
  mindfulnessGrid: {
    flexDirection: "row",
    gap: 12,
  },
  mindfulnessCard: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  mindfulnessGradient: {
    padding: 16,
    alignItems: "center",
    minHeight: 120,
  },
  mindfulnessImage: {
    fontSize: 32,
    marginBottom: 8,
  },
  mindfulnessTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  mindfulnessSubtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  mindfulnessDuration: {
    fontSize: 10,
    textAlign: "center",
  },
});

export default HomeScreen;
