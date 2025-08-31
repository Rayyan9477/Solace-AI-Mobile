import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { freudDarkTheme } from "../../shared/theme/freudDarkTheme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Mood data with colors matching the design
const MOODS = [
  {
    id: "depressed",
    name: "Depressed",
    emoji: "😔",
    description: "I'm feeling Depressed",
    color: "#8B7CF6", // Purple
    bgColor: ["#8B7CF6", "#A78BFA"],
  },
  {
    id: "sad",
    name: "Sad",
    emoji: "😢",
    description: "I'm feeling Sad",
    color: "#F97316", // Orange
    bgColor: ["#F97316", "#FB923C"],
  },
  {
    id: "neutral",
    name: "Neutral",
    emoji: "😐",
    description: "I'm feeling Neutral",
    color: "#F59E0B", // Amber
    bgColor: ["#F59E0B", "#FCD34D"],
  },
  {
    id: "happy",
    name: "Happy",
    emoji: "😊",
    description: "I'm feeling Happy",
    color: "#EAB308", // Yellow
    bgColor: ["#EAB308", "#FACC15"],
  },
  {
    id: "overjoyed",
    name: "Overjoyed",
    emoji: "😁",
    description: "I'm feeling Overjoyed",
    color: "#22C55E", // Green
    bgColor: ["#22C55E", "#4ADE80"],
  },
];

const MOOD_STATS = [
  { mood: "Happy", count: 8, color: "#EAB308" },
  { mood: "Sad", count: 5, color: "#F97316" },
  { mood: "Neutral", count: 12, color: "#F59E0B" },
  { mood: "Depressed", count: 3, color: "#8B7CF6" },
  { mood: "Overjoyed", count: 7, color: "#22C55E" },
];

const AI_SUGGESTIONS = [
  {
    id: 1,
    title: "Mood Suggestion Weekend Activities",
    description:
      "Based on your mood patterns, here are some weekend activities that might help boost your spirits.",
    image: "🏞️",
    category: "Activities",
  },
  {
    id: 2,
    title: "Mindfulness Exercise",
    description:
      "Try this 5-minute breathing exercise to help center yourself during challenging moments.",
    image: "🧘‍♀️",
    category: "Mindfulness",
  },
  {
    id: 3,
    title: "Gratitude Practice",
    description:
      "Research shows that writing 3 things you're grateful for can improve mood within 2 weeks.",
    image: "🙏",
    category: "Wellbeing",
  },
];

const RECENT_MOODS = [
  {
    date: "Today",
    time: "2:30 PM",
    mood: "Happy",
    color: "#EAB308",
    emoji: "😊",
  },
  {
    date: "Yesterday",
    time: "6:45 PM",
    mood: "Neutral",
    color: "#F59E0B",
    emoji: "😐",
  },
  {
    date: "2 days ago",
    time: "10:15 AM",
    mood: "Sad",
    color: "#F97316",
    emoji: "😢",
  },
  {
    date: "3 days ago",
    time: "4:20 PM",
    mood: "Happy",
    color: "#EAB308",
    emoji: "😊",
  },
  {
    date: "4 days ago",
    time: "11:30 AM",
    mood: "Overjoyed",
    color: "#22C55E",
    emoji: "😁",
  },
];

export default function DarkMoodTrackerScreen() {
  const [currentView, setCurrentView] = useState("tracker"); // 'tracker', 'stats', 'suggestions'
  const [selectedMood, setSelectedMood] = useState(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [moodHistory, setMoodHistory] = useState(RECENT_MOODS);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const openMoodModal = () => {
    setShowMoodModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeMoodModal = () => {
    Animated.spring(slideAnim, {
      toValue: screenHeight,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      setShowMoodModal(false);
      setSelectedMood(null);
    });
  };

  const selectMood = (mood) => {
    setSelectedMood(mood);
  };

  const saveMood = () => {
    if (selectedMood) {
      const newMoodEntry = {
        date: "Today",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        mood: selectedMood.name,
        color: selectedMood.color,
        emoji: selectedMood.emoji,
      };
      setMoodHistory((prev) => [newMoodEntry, ...prev.slice(0, 4)]);
      closeMoodModal();
    }
  };

  const renderMoodTracker = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>How are you feeling this day?</Text>
        <Text style={styles.subtitle}>Track your daily mood</Text>
      </View>

      {/* Quick Mood Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.moodScroll}
      >
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={styles.quickMoodCard}
            onPress={() => selectMood(mood)}
          >
            <LinearGradient
              colors={mood.bgColor}
              style={styles.quickMoodGradient}
            >
              <Text style={styles.quickMoodEmoji}>{mood.emoji}</Text>
              <Text style={styles.quickMoodText}>{mood.name}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Mood Button */}
      <TouchableOpacity style={styles.addMoodButton} onPress={openMoodModal}>
        <LinearGradient
          colors={[freudDarkTheme.colors.accent.primary, "#F97316"]}
          style={styles.addMoodGradient}
        >
          <Text style={styles.addMoodText}>Set Mood</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Recent Moods */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Moods</Text>
        <ScrollView
          style={styles.recentScroll}
          showsVerticalScrollIndicator={false}
        >
          {moodHistory.map((entry, index) => (
            <View key={index} style={styles.recentMoodCard}>
              <View style={styles.recentMoodLeft}>
                <View
                  style={[
                    styles.moodIndicator,
                    { backgroundColor: entry.color },
                  ]}
                />
                <View>
                  <Text style={styles.recentMoodText}>
                    {entry.mood} {entry.emoji}
                  </Text>
                  <Text style={styles.recentMoodTime}>
                    {entry.date} • {entry.time}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.navItem,
            currentView === "tracker" && styles.activeNavItem,
          ]}
          onPress={() => setCurrentView("tracker")}
        >
          <Text
            style={[
              styles.navText,
              currentView === "tracker" && styles.activeNavText,
            ]}
          >
            Tracker
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navItem,
            currentView === "stats" && styles.activeNavItem,
          ]}
          onPress={() => setCurrentView("stats")}
        >
          <Text
            style={[
              styles.navText,
              currentView === "stats" && styles.activeNavText,
            ]}
          >
            Stats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navItem,
            currentView === "suggestions" && styles.activeNavItem,
          ]}
          onPress={() => setCurrentView("suggestions")}
        >
          <Text
            style={[
              styles.navText,
              currentView === "suggestions" && styles.activeNavText,
            ]}
          >
            AI Suggestions
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderMoodStats = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mood Stats</Text>
        <Text style={styles.subtitle}>Your mood patterns this month</Text>
      </View>

      <View style={styles.statsContainer}>
        {MOOD_STATS.map((stat, index) => (
          <View key={stat.mood} style={styles.statCard}>
            <View style={styles.statLeft}>
              <View
                style={[styles.statIndicator, { backgroundColor: stat.color }]}
              />
              <Text style={styles.statMoodText}>{stat.mood}</Text>
            </View>
            <View style={styles.statRight}>
              <Text style={styles.statCount}>{stat.count}</Text>
              <Text style={styles.statLabel}>days</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.navItem,
            currentView === "tracker" && styles.activeNavItem,
          ]}
          onPress={() => setCurrentView("tracker")}
        >
          <Text
            style={[
              styles.navText,
              currentView === "tracker" && styles.activeNavText,
            ]}
          >
            Tracker
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navItem,
            currentView === "stats" && styles.activeNavItem,
          ]}
          onPress={() => setCurrentView("stats")}
        >
          <Text
            style={[
              styles.navText,
              currentView === "stats" && styles.activeNavText,
            ]}
          >
            Stats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navItem,
            currentView === "suggestions" && styles.activeNavItem,
          ]}
          onPress={() => setCurrentView("suggestions")}
        >
          <Text
            style={[
              styles.navText,
              currentView === "suggestions" && styles.activeNavText,
            ]}
          >
            AI Suggestions
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderAISuggestions = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Suggestions</Text>
        <Text style={styles.subtitle}>
          Personalized recommendations for you
        </Text>
      </View>

      <ScrollView
        style={styles.suggestionsScroll}
        showsVerticalScrollIndicator={false}
      >
        {AI_SUGGESTIONS.map((suggestion) => (
          <View key={suggestion.id} style={styles.suggestionCard}>
            <LinearGradient
              colors={[
                freudDarkTheme.colors.background.secondary,
                freudDarkTheme.colors.background.tertiary,
              ]}
              style={styles.suggestionGradient}
            >
              <View style={styles.suggestionTop}>
                <Text style={styles.suggestionImage}>{suggestion.image}</Text>
                <View style={styles.suggestionCategory}>
                  <Text style={styles.suggestionCategoryText}>
                    {suggestion.category}
                  </Text>
                </View>
              </View>
              <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
              <Text style={styles.suggestionDescription}>
                {suggestion.description}
              </Text>
              <TouchableOpacity style={styles.suggestionButton}>
                <Text style={styles.suggestionButtonText}>Learn More</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.navItem,
            currentView === "tracker" && styles.activeNavItem,
          ]}
          onPress={() => setCurrentView("tracker")}
        >
          <Text
            style={[
              styles.navText,
              currentView === "tracker" && styles.activeNavText,
            ]}
          >
            Tracker
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navItem,
            currentView === "stats" && styles.activeNavItem,
          ]}
          onPress={() => setCurrentView("stats")}
        >
          <Text
            style={[
              styles.navText,
              currentView === "stats" && styles.activeNavText,
            ]}
          >
            Stats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navItem,
            currentView === "suggestions" && styles.activeNavItem,
          ]}
          onPress={() => setCurrentView("suggestions")}
        >
          <Text
            style={[
              styles.navText,
              currentView === "suggestions" && styles.activeNavText,
            ]}
          >
            AI Suggestions
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderMoodModal = () => (
    <Modal
      visible={showMoodModal}
      transparent
      animationType="none"
      onRequestClose={closeMoodModal}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={
              selectedMood
                ? selectedMood.bgColor
                : [
                    freudDarkTheme.colors.background.secondary,
                    freudDarkTheme.colors.background.tertiary,
                  ]
            }
            style={styles.modalGradient}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalClose}
              onPress={closeMoodModal}
            >
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>

            {/* Question */}
            <Text style={styles.modalQuestion}>
              How are you feeling this day?
            </Text>

            {/* Selected Mood Display */}
            {selectedMood && (
              <View style={styles.selectedMoodDisplay}>
                <Text style={styles.selectedMoodEmoji}>
                  {selectedMood.emoji}
                </Text>
                <Text style={styles.selectedMoodText}>
                  {selectedMood.description}
                </Text>
              </View>
            )}

            {/* Mood Selection */}
            <View style={styles.moodSelection}>
              {MOODS.map((mood) => (
                <TouchableOpacity
                  key={mood.id}
                  style={[
                    styles.moodOption,
                    selectedMood?.id === mood.id && styles.selectedMoodOption,
                  ]}
                  onPress={() => selectMood(mood)}
                >
                  <Text style={styles.moodOptionEmoji}>{mood.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={saveMood}>
                <Text style={styles.modalButtonText}>Set Mood</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={[
        freudDarkTheme.colors.background.primary,
        freudDarkTheme.colors.background.secondary,
      ]}
      style={styles.screenContainer}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={freudDarkTheme.colors.background.primary}
      />
      <SafeAreaView style={styles.safeArea}>
        {currentView === "tracker" && renderMoodTracker()}
        {currentView === "stats" && renderMoodStats()}
        {currentView === "suggestions" && renderAISuggestions()}
        {renderMoodModal()}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
  },
  moodScroll: {
    marginBottom: 30,
  },
  quickMoodCard: {
    marginRight: 15,
    width: 120,
    height: 140,
  },
  quickMoodGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  quickMoodEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  quickMoodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  addMoodButton: {
    marginBottom: 30,
  },
  addMoodGradient: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 16,
    alignItems: "center",
  },
  addMoodText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  recentSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 20,
  },
  recentScroll: {
    flex: 1,
  },
  recentMoodCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  recentMoodLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  moodIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  recentMoodText: {
    fontSize: 16,
    fontWeight: "600",
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 4,
  },
  recentMoodTime: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.7,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 25,
    padding: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  navItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  activeNavItem: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
  },
  navText: {
    fontSize: 14,
    fontWeight: "600",
    color: freudDarkTheme.colors.text.secondary,
  },
  activeNavText: {
    color: "#FFFFFF",
  },
  statsContainer: {
    flex: 1,
    paddingTop: 20,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  statLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 15,
  },
  statMoodText: {
    fontSize: 18,
    fontWeight: "600",
    color: freudDarkTheme.colors.text.primary,
  },
  statRight: {
    alignItems: "flex-end",
  },
  statCount: {
    fontSize: 24,
    fontWeight: "700",
    color: freudDarkTheme.colors.text.primary,
  },
  statLabel: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.7,
  },
  suggestionsScroll: {
    flex: 1,
  },
  suggestionCard: {
    marginBottom: 20,
  },
  suggestionGradient: {
    borderRadius: 20,
    padding: 20,
  },
  suggestionTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  suggestionImage: {
    fontSize: 40,
  },
  suggestionCategory: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  suggestionCategoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  suggestionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 8,
  },
  suggestionDescription: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  suggestionButton: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  suggestionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: screenHeight * 0.8,
  },
  modalGradient: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    paddingTop: 20,
  },
  modalClose: {
    alignSelf: "flex-end",
    padding: 10,
  },
  modalCloseText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "300",
  },
  modalQuestion: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
  },
  selectedMoodDisplay: {
    alignItems: "center",
    marginBottom: 40,
  },
  selectedMoodEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  selectedMoodText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  moodSelection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 50,
  },
  moodOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedMoodOption: {
    borderColor: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  moodOptionEmoji: {
    fontSize: 30,
  },
  modalActions: {
    alignItems: "center",
  },
  modalButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
