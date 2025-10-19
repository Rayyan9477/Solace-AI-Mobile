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
  Modal,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "@shared/components/icons";
import { useTheme } from "@theme/ThemeProvider";

const { width, height } = Dimensions.get("window");

const MoodTrackerScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [selectedMood, setSelectedMood] = useState(null);
  const [showMoodSelection, setShowMoodSelection] = useState(false);
  const [currentView, setCurrentView] = useState("overview"); // overview, stats, history
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Mock data - in real app this would come from API/state
  const moodData = {
    today: {
      mood: "Happy",
      intensity: 4,
      timestamp: new Date(),
      emoji: "😊",
      color: "#FFE066",
    },
    weeklyAverage: 3.8,
    streak: 7,
    totalEntries: 156,
    recentMoods: [
      { date: "2024-01-20", mood: "Happy", intensity: 4, emoji: "😊" },
      { date: "2024-01-19", mood: "Calm", intensity: 3, emoji: "😌" },
      { date: "2024-01-18", mood: "Anxious", intensity: 2, emoji: "😰" },
      { date: "2024-01-17", mood: "Happy", intensity: 5, emoji: "😄" },
      { date: "2024-01-16", mood: "Neutral", intensity: 3, emoji: "😐" },
      { date: "2024-01-15", mood: "Sad", intensity: 2, emoji: "😢" },
      { date: "2024-01-14", mood: "Excited", intensity: 4, emoji: "🤩" },
    ],
    moodStats: {
      mostCommon: "Happy",
      leastCommon: "Angry",
      averageIntensity: 3.5,
      bestDay: "Monday",
      toughestDay: "Wednesday",
    },
  };

  const moods = [
    {
      id: "depressed",
      name: "Depressed",
      emoji: "😞",
      color: "#9B59B6",
      gradient: ["#9B59B6", "#8E44AD"],
      description: "I'm feeling Depressed",
    },
    {
      id: "sad",
      name: "Sad",
      emoji: "😢",
      color: "#E74C3C",
      gradient: ["#E74C3C", "#C0392B"],
      description: "I'm feeling Sad",
    },
    {
      id: "neutral",
      name: "Neutral",
      emoji: "😐",
      color: "#95A5A6",
      gradient: ["#95A5A6", "#7F8C8D"],
      description: "I'm feeling Neutral",
    },
    {
      id: "happy",
      name: "Happy",
      emoji: "😊",
      color: "#F1C40F",
      gradient: ["#F1C40F", "#E67E22"],
      description: "I'm feeling Happy",
    },
    {
      id: "overjoyed",
      name: "Overjoyed",
      emoji: "😄",
      color: "#2ECC71",
      gradient: ["#2ECC71", "#27AE60"],
      description: "I'm feeling Overjoyed",
    },
  ];

  const quickActions = [
    {
      id: "mood-history",
      title: "Mood History",
      subtitle: "View past entries",
      icon: "Journal",
      color: theme.colors.therapeutic.calming[500],
      onPress: () => setCurrentView("history"),
    },
    {
      id: "mood-stats",
      title: "Mood Statistics",
      subtitle: "Analyze patterns",
      icon: "Brain",
      color: theme.colors.therapeutic.nurturing[500],
      onPress: () => setCurrentView("stats"),
    },
    {
      id: "ai-insights",
      title: "AI Insights",
      subtitle: "Get recommendations",
      icon: "Therapy",
      color: theme.colors.therapeutic.grounding[500],
      onPress: () => navigation.navigate("AITherapyChat"),
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

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowMoodSelection(true);
  };

  const saveMoodEntry = () => {
    // Save mood entry logic here
    setShowMoodSelection(false);
    // Show success feedback
  };

  const renderMoodOverview = () => (
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
        {/* Today's Mood Card */}
        <View
          style={[
            styles.todayMoodCard,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <Text
            style={[styles.cardTitle, { color: theme.colors.text.primary }]}
          >
            How are you feeling today?
          </Text>

          {moodData.today.mood ? (
            <View style={styles.currentMoodContainer}>
              <Text style={styles.currentMoodEmoji}>
                {moodData.today.emoji}
              </Text>
              <Text
                style={[
                  styles.currentMoodName,
                  { color: theme.colors.text.primary },
                ]}
              >
                {moodData.today.mood}
              </Text>
              <Text
                style={[
                  styles.currentMoodTime,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Logged at{" "}
                {moodData.today.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <TouchableOpacity
                style={[
                  styles.updateMoodButton,
                  { backgroundColor: theme.colors.primary[500] },
                ]}
                onPress={() => setShowMoodSelection(true)}
              >
                <Text
                  style={[
                    styles.updateMoodText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  Update Mood
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.selectMoodButton,
                { backgroundColor: theme.colors.primary[500] },
              ]}
              onPress={() => setShowMoodSelection(true)}
            >
              <MentalHealthIcon
                name="Heart"
                size={24}
                color={theme.colors.text.inverse}
                variant="filled"
              />
              <Text
                style={[
                  styles.selectMoodText,
                  { color: theme.colors.text.inverse },
                ]}
              >
                Log Your Mood
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Mood Statistics */}
        <View
          style={[
            styles.statsCard,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <View style={styles.statsHeader}>
            <Text
              style={[styles.cardTitle, { color: theme.colors.text.primary }]}
            >
              Mood Statistics
            </Text>
            <TouchableOpacity onPress={() => setCurrentView("stats")}>
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

          <View style={styles.statsGrid}>
            <StatCard
              title="Weekly Average"
              value={moodData.weeklyAverage.toFixed(1)}
              icon="Heart"
              color={theme.colors.therapeutic.nurturing[500]}
              theme={theme}
            />
            <StatCard
              title="Current Streak"
              value={`${moodData.streak} days`}
              icon="Therapy"
              color={theme.colors.therapeutic.calming[500]}
              theme={theme}
            />
            <StatCard
              title="Total Entries"
              value={moodData.totalEntries}
              icon="Journal"
              color={theme.colors.therapeutic.grounding[500]}
              theme={theme}
            />
            <StatCard
              title="Most Common"
              value={moodData.moodStats.mostCommon}
              icon="Brain"
              color={theme.colors.therapeutic.peaceful[500]}
              theme={theme}
            />
          </View>
        </View>

        {/* Recent Moods */}
        <View
          style={[
            styles.recentMoodsCard,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <View style={styles.recentMoodsHeader}>
            <Text
              style={[styles.cardTitle, { color: theme.colors.text.primary }]}
            >
              Recent Moods
            </Text>
            <TouchableOpacity onPress={() => setCurrentView("history")}>
              <Text
                style={[
                  styles.seeAllText,
                  { color: theme.colors.primary[500] },
                ]}
              >
                View History
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recentMoodsScroll}
          >
            {moodData.recentMoods.slice(0, 7).map((mood, index) => (
              <RecentMoodItem
                key={index}
                mood={mood}
                theme={theme}
                delay={index * 100}
              />
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View
          style={[
            styles.quickActionsCard,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <Text
            style={[styles.cardTitle, { color: theme.colors.text.primary }]}
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
      </Animated.View>
    </ScrollView>
  );

  const renderMoodStats = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.statsContainer}>
        <Text style={[styles.pageTitle, { color: theme.colors.text.primary }]}>
          Mood Statistics
        </Text>

        {/* Detailed stats implementation would go here */}
        <View
          style={[
            styles.chartCard,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <Text
            style={[styles.chartTitle, { color: theme.colors.text.primary }]}
          >
            Weekly Mood Trends
          </Text>
          {/* Chart component would go here */}
          <View style={styles.chartPlaceholder}>
            <Text
              style={[
                styles.chartPlaceholderText,
                { color: theme.colors.text.secondary },
              ]}
            >
              Chart visualization coming soon
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderMoodHistory = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.historyContainer}>
        <Text style={[styles.pageTitle, { color: theme.colors.text.primary }]}>
          Mood History
        </Text>

        {moodData.recentMoods.map((mood, index) => (
          <HistoryItem
            key={index}
            mood={mood}
            theme={theme}
            delay={index * 50}
          />
        ))}
      </View>
    </ScrollView>
  );

  const renderMoodSelectionModal = () => (
    <Modal
      visible={showMoodSelection}
      transparent
      animationType="slide"
      onRequestClose={() => setShowMoodSelection(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[styles.modalTitle, { color: theme.colors.text.primary }]}
            >
              How are you feeling?
            </Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowMoodSelection(false)}
            >
              <NavigationIcon
                name="Home"
                size={24}
                color={theme.colors.text.primary}
                variant="outline"
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.moodSelectionScroll}>
            {moods.map((mood, index) => (
              <MoodSelectionCard
                key={mood.id}
                mood={mood}
                theme={theme}
                onSelect={handleMoodSelect}
                delay={index * 100}
              />
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: theme.colors.primary[500] },
            ]}
            onPress={saveMoodEntry}
          >
            <Text
              style={[
                styles.saveButtonText,
                { color: theme.colors.text.inverse },
              ]}
            >
              Save Mood Entry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
            onPress={() => {
              if (currentView !== "overview") {
                setCurrentView("overview");
              } else {
                navigation.goBack();
              }
            }}
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
            {currentView === "overview"
              ? "Mood Tracker"
              : currentView === "stats"
                ? "Mood Statistics"
                : "Mood History"}
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowMoodSelection(true)}
          >
            <MentalHealthIcon
              name="Heart"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {currentView === "overview" && renderMoodOverview()}
        {currentView === "stats" && renderMoodStats()}
        {currentView === "history" && renderMoodHistory()}

        {/* Mood Selection Modal */}
        {renderMoodSelectionModal()}
      </LinearGradient>
    </SafeAreaView>
  );
};

const StatCard = ({ title, value, icon, color, theme }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: color }]}>
        <MentalHealthIcon
          name={icon}
          size={20}
          color={theme.colors.text.inverse}
          variant="filled"
        />
      </View>
      <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
        {value}
      </Text>
      <Text style={[styles.statTitle, { color: theme.colors.text.secondary }]}>
        {title}
      </Text>
    </Animated.View>
  );
};

const RecentMoodItem = ({ mood, theme, delay }) => {
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
        styles.recentMoodItem,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: fadeAnim,
        },
      ]}
    >
      <Text style={styles.recentMoodEmoji}>{mood.emoji}</Text>
      <Text
        style={[styles.recentMoodName, { color: theme.colors.text.primary }]}
      >
        {mood.mood}
      </Text>
      <Text
        style={[styles.recentMoodDate, { color: theme.colors.text.tertiary }]}
      >
        {new Date(mood.date).toLocaleDateString([], {
          month: "short",
          day: "numeric",
        })}
      </Text>
    </Animated.View>
  );
};

const QuickActionCard = ({ action, theme, onPress, delay }) => {
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
        styles.quickActionCard,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.quickActionButton,
          { backgroundColor: theme.colors.background.secondary },
        ]}
        onPress={onPress}
      >
        <View
          style={[styles.quickActionIcon, { backgroundColor: action.color }]}
        >
          <MentalHealthIcon
            name={action.icon}
            size={20}
            color={theme.colors.text.inverse}
            variant="filled"
          />
        </View>
        <Text
          style={[
            styles.quickActionTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          {action.title}
        </Text>
        <Text
          style={[
            styles.quickActionSubtitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          {action.subtitle}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const MoodSelectionCard = ({ mood, theme, onSelect, delay }) => {
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
        styles.moodSelectionCard,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.moodSelectionButton}
        onPress={() => onSelect(mood)}
      >
        <LinearGradient
          colors={mood.gradient}
          style={styles.moodSelectionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.moodSelectionEmoji}>{mood.emoji}</Text>
          <Text
            style={[
              styles.moodSelectionName,
              { color: theme.colors.text.inverse },
            ]}
          >
            {mood.description}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const HistoryItem = ({ mood, theme, delay }) => {
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
        styles.historyItem,
        {
          backgroundColor: theme.colors.background.secondary,
          opacity: fadeAnim,
        },
      ]}
    >
      <Text style={styles.historyEmoji}>{mood.emoji}</Text>
      <View style={styles.historyContent}>
        <Text
          style={[styles.historyMood, { color: theme.colors.text.primary }]}
        >
          {mood.mood}
        </Text>
        <Text
          style={[styles.historyDate, { color: theme.colors.text.secondary }]}
        >
          {new Date(mood.date).toLocaleDateString([], {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>
      <View style={styles.historyIntensity}>
        <Text
          style={[styles.intensityText, { color: theme.colors.text.tertiary }]}
        >
          {mood.intensity}/5
        </Text>
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
  todayMoodCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
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
  currentMoodContainer: {
    alignItems: "center",
  },
  currentMoodEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  currentMoodName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  currentMoodTime: {
    fontSize: 12,
    marginBottom: 16,
  },
  updateMoodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  updateMoodText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectMoodButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 24,
    gap: 8,
  },
  selectMoodText: {
    fontSize: 16,
    fontWeight: "600",
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: (width - 64) / 2,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: "center",
  },
  recentMoodsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentMoodsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recentMoodsScroll: {
    marginHorizontal: -8,
  },
  recentMoodItem: {
    width: 80,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
    alignItems: "center",
  },
  recentMoodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  recentMoodName: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
    textAlign: "center",
  },
  recentMoodDate: {
    fontSize: 10,
  },
  quickActionsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    marginBottom: 8,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    flex: 1,
  },
  quickActionSubtitle: {
    fontSize: 12,
    flex: 1,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    paddingVertical: 20,
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E0E0E0",
    borderRadius: 8,
  },
  chartPlaceholderText: {
    fontSize: 14,
  },
  historyContainer: {
    paddingVertical: 20,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  historyEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyMood: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
  },
  historyIntensity: {
    alignItems: "center",
  },
  intensityText: {
    fontSize: 12,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalCloseButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  moodSelectionScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  moodSelectionCard: {
    marginVertical: 8,
  },
  moodSelectionButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  moodSelectionGradient: {
    padding: 20,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  moodSelectionEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  moodSelectionName: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MoodTrackerScreen;
