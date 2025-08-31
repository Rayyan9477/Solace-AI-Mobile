import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import { freudDarkTheme } from "../../shared/theme/freudDarkTheme";

const { width, height } = Dimensions.get("window");

const DarkMentalHealthScoreScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Mental Health Data
  const [currentScore] = useState(80);
  const [scoreRange] = useState({ min: 0, max: 100 });
  const [dateRange] = useState({ start: "2024/06/14", end: "2024/06/16" });

  // Score history data for chart
  const [scoreHistory] = useState([
    { day: "Mon", score: 75, color: "#E67E22" },
    { day: "Tue", score: 68, color: "#F39C12" },
    { day: "Wed", score: 82, color: "#27AE60" },
    { day: "Thu", score: 78, color: "#2ECC71" },
    { day: "Fri", score: 85, color: "#27AE60" },
    { day: "Sat", score: 80, color: "#27AE60" },
    { day: "Sun", score: 80, color: "#27AE60" },
  ]);

  // Mood history
  const [moodHistory] = useState([
    { emoji: "😊", label: "Happy" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😊", label: "Happy" },
    { emoji: "😁", label: "Very Happy" },
    { emoji: "😊", label: "Happy" },
  ]);

  // AI Suggestions
  const [aiSuggestions] = useState([
    {
      id: 1,
      title: "AI Suggestions",
      subtitle: "Breathing Rehab - 25-30min",
      category: "Mindfulness Activities",
      icon: "🧘",
      color: freudDarkTheme.colors.header.primary,
    },
    {
      id: 2,
      title: "Meditation",
      subtitle: "Physical Activities - 15-20min",
      category: "Physical Activities",
      icon: "🏃",
      color: freudDarkTheme.colors.accent.primary,
    },
    {
      id: 3,
      title: "Social Connection",
      subtitle: "Video calling - 1-2hr",
      category: "Social Connection",
      icon: "👥",
      color: "#8E44AD",
    },
    {
      id: 4,
      title: "Professional Support",
      subtitle: "Professional therapy - 45-60min",
      category: "Professional Support",
      icon: "👩‍⚕️",
      color: freudDarkTheme.colors.status.info,
    },
  ]);

  // Mindfulness Activities
  const [mindfulnessActivities] = useState([
    {
      id: 1,
      title: "Daily Meditation Routine",
      description: "Gratitude journaling",
      time: "5-10 min",
      icon: "🧘",
      completed: false,
    },
    {
      id: 2,
      title: "Why should we be mindful?",
      description:
        "Mindfulness can be powerful tools that not only help you become increasingly important in fast-paced world, as just a handful things that help us enhancing mental well being.",
      benefits: ["✓ Reduce Stress", "✓ Improve Health"],
      isExpanded: true,
      icon: "🌿",
      image: "mindfulness-nature", // Placeholder for nature scene
    },
  ]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Freud Score</Text>

      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuButtonText}>⋯</Text>
      </TouchableOpacity>
    </View>
  );

  const renderScoreDisplay = () => (
    <View style={styles.scoreSection}>
      <Text style={styles.scoreSubtitle}>See your mental score insights</Text>

      <View style={styles.scoreCircle}>
        <View style={styles.scoreInnerCircle}>
          <Text style={styles.scoreValue}>{currentScore}</Text>
        </View>

        {/* Score indicators around circle */}
        <View style={styles.scoreIndicators}>
          {[...Array(8)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.scoreIndicator,
                {
                  transform: [{ rotate: `${index * 45}deg` }],
                  backgroundColor:
                    index < 6
                      ? freudDarkTheme.colors.status.success
                      : freudDarkTheme.colors.border.primary,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.scoreMeta}>
        <View style={styles.scoreRange}>
          <Text style={styles.scoreRangeText}>{scoreRange.min}</Text>
          <Text style={styles.scoreRangeText}>{scoreRange.max}</Text>
        </View>
        <Text style={styles.scorePeriod}>
          {dateRange.start} - {dateRange.end}
        </Text>
      </View>

      <View style={styles.scoreActions}>
        <TouchableOpacity style={styles.includeButton}>
          <Text style={styles.includeButtonText}>Include All Suggestions</Text>
          <Text style={styles.toggleIcon}>⚪</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filter Freud Score (13)</Text>
          <Text style={styles.filterIcon}>📊</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMoodHistory = () => (
    <View style={styles.moodSection}>
      <Text style={styles.sectionTitle}>Mood History</Text>
      <View style={styles.moodGrid}>
        {moodHistory.map((mood, index) => (
          <View key={index} style={styles.moodItem}>
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={styles.moodLabel}>{mood.label}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.suggestionButton}>
        <Text style={styles.suggestionButtonText}>
          Suggest for AI suggestions
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAISuggestions = () => (
    <View style={styles.suggestionsSection}>
      <View style={styles.suggestionsHeader}>
        <Text style={styles.sectionTitle}>AI Suggestions</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.suggestionsRow}>
          {aiSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion.id}
              style={[
                styles.suggestionCard,
                { borderLeftColor: suggestion.color },
              ]}
            >
              <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
              <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
              <Text style={styles.suggestionSubtitle}>
                {suggestion.subtitle}
              </Text>
              <Text style={styles.suggestionCategory}>
                {suggestion.category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderMindfulnessActivities = () => (
    <View style={styles.activitiesSection}>
      <View style={styles.activitiesHeader}>
        <Text style={styles.sectionTitle}>Mindfulness Activities</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {mindfulnessActivities.map((activity) => (
        <View key={activity.id} style={styles.activityCard}>
          {activity.isExpanded ? (
            <LinearGradient
              colors={[
                freudDarkTheme.colors.header.primary,
                freudDarkTheme.colors.header.secondary,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.expandedActivityCard}
            >
              <View style={styles.expandedContent}>
                <Text style={styles.expandedActivityIcon}>{activity.icon}</Text>
                <View style={styles.expandedTextContent}>
                  <Text style={styles.expandedActivityTitle}>
                    {activity.title}
                  </Text>
                  <Text style={styles.expandedActivityDescription}>
                    {activity.description}
                  </Text>
                  {activity.benefits && (
                    <View style={styles.benefitsList}>
                      {activity.benefits.map((benefit, index) => (
                        <Text key={index} style={styles.benefitItem}>
                          {benefit}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <TouchableOpacity style={styles.completeButton}>
                <Text style={styles.completeButtonText}>
                  Work As Completed ✓
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <View style={styles.compactActivityCard}>
              <Text style={styles.activityIcon}>{activity.icon}</Text>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <TouchableOpacity style={styles.activityToggle}>
                <Text style={styles.toggleIcon}>⚪</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          {renderHeader()}

          {/* Score Display */}
          {renderScoreDisplay()}

          {/* Mood History */}
          {renderMoodHistory()}

          {/* AI Suggestions */}
          {renderAISuggestions()}

          {/* Mindfulness Activities */}
          {renderMindfulnessActivities()}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: freudDarkTheme.colors.background.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: freudDarkTheme.spacing[6],
    paddingTop: 60,
    paddingBottom: freudDarkTheme.spacing[4],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: freudDarkTheme.colors.card.background,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },
  headerTitle: {
    fontSize: freudDarkTheme.typography.sizes.xl,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButtonText: {
    fontSize: 20,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },

  // Score Section
  scoreSection: {
    paddingHorizontal: freudDarkTheme.spacing[6],
    alignItems: "center",
    marginBottom: freudDarkTheme.spacing[8],
  },
  scoreSubtitle: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.tertiary,
    marginBottom: freudDarkTheme.spacing[6],
  },
  scoreCircle: {
    width: 150,
    height: 150,
    position: "relative",
    marginBottom: freudDarkTheme.spacing[6],
  },
  scoreInnerCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
    backgroundColor: freudDarkTheme.colors.card.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    borderColor: freudDarkTheme.colors.status.success,
  },
  scoreValue: {
    fontSize: freudDarkTheme.typography.sizes["5xl"],
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.bold,
  },
  scoreIndicators: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  scoreIndicator: {
    position: "absolute",
    width: 4,
    height: 20,
    top: -10,
    left: "50%",
    marginLeft: -2,
    borderRadius: 2,
  },
  scoreMeta: {
    alignItems: "center",
    marginBottom: freudDarkTheme.spacing[6],
  },
  scoreRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 100,
    marginBottom: freudDarkTheme.spacing[2],
  },
  scoreRangeText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.tertiary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },
  scorePeriod: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: freudDarkTheme.colors.text.quaternary,
  },
  scoreActions: {
    width: "100%",
    gap: freudDarkTheme.spacing[3],
  },
  includeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: freudDarkTheme.colors.card.background,
    padding: freudDarkTheme.spacing[4],
    borderRadius: freudDarkTheme.borderRadius.lg,
  },
  includeButtonText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },
  toggleIcon: {
    fontSize: 18,
  },
  filterButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: freudDarkTheme.colors.card.background,
    padding: freudDarkTheme.spacing[4],
    borderRadius: freudDarkTheme.borderRadius.lg,
  },
  filterButtonText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },
  filterIcon: {
    fontSize: 18,
  },

  // Mood Section
  moodSection: {
    paddingHorizontal: freudDarkTheme.spacing[6],
    marginBottom: freudDarkTheme.spacing[8],
  },
  sectionTitle: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    marginBottom: freudDarkTheme.spacing[4],
  },
  moodGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: freudDarkTheme.spacing[4],
  },
  moodItem: {
    alignItems: "center",
    flex: 1,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: freudDarkTheme.spacing[2],
  },
  moodLabel: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: freudDarkTheme.colors.text.tertiary,
    textAlign: "center",
  },
  suggestionButton: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    padding: freudDarkTheme.spacing[4],
    borderRadius: freudDarkTheme.borderRadius.lg,
    alignItems: "center",
  },
  suggestionButtonText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: "#FFFFFF",
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },

  // Suggestions Section
  suggestionsSection: {
    marginBottom: freudDarkTheme.spacing[8],
  },
  suggestionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: freudDarkTheme.spacing[6],
    marginBottom: freudDarkTheme.spacing[4],
  },
  seeAllText: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.accent.primary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },
  suggestionsRow: {
    flexDirection: "row",
    paddingHorizontal: freudDarkTheme.spacing[6],
    gap: freudDarkTheme.spacing[4],
  },
  suggestionCard: {
    backgroundColor: freudDarkTheme.colors.card.background,
    padding: freudDarkTheme.spacing[4],
    borderRadius: freudDarkTheme.borderRadius.lg,
    borderLeftWidth: 4,
    width: 200,
    ...freudDarkTheme.shadows.sm,
  },
  suggestionIcon: {
    fontSize: 24,
    marginBottom: freudDarkTheme.spacing[2],
  },
  suggestionTitle: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    marginBottom: freudDarkTheme.spacing[1],
  },
  suggestionSubtitle: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.secondary,
    marginBottom: freudDarkTheme.spacing[2],
  },
  suggestionCategory: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: freudDarkTheme.colors.text.tertiary,
    fontWeight: freudDarkTheme.typography.weights.medium,
  },

  // Activities Section
  activitiesSection: {
    paddingHorizontal: freudDarkTheme.spacing[6],
    marginBottom: freudDarkTheme.spacing[8],
  },
  activitiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: freudDarkTheme.spacing[4],
  },
  activityCard: {
    marginBottom: freudDarkTheme.spacing[4],
  },
  expandedActivityCard: {
    borderRadius: freudDarkTheme.borderRadius.lg,
    padding: freudDarkTheme.spacing[6],
    ...freudDarkTheme.shadows.lg,
  },
  expandedContent: {
    flexDirection: "row",
    marginBottom: freudDarkTheme.spacing[6],
  },
  expandedActivityIcon: {
    fontSize: 48,
    marginRight: freudDarkTheme.spacing[4],
  },
  expandedTextContent: {
    flex: 1,
  },
  expandedActivityTitle: {
    fontSize: freudDarkTheme.typography.sizes.lg,
    color: "#FFFFFF",
    fontWeight: freudDarkTheme.typography.weights.bold,
    marginBottom: freudDarkTheme.spacing[2],
  },
  expandedActivityDescription: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: "#FFFFFF",
    opacity: 0.9,
    lineHeight: freudDarkTheme.typography.sizes.sm * 1.5,
    marginBottom: freudDarkTheme.spacing[4],
  },
  benefitsList: {
    gap: freudDarkTheme.spacing[1],
  },
  benefitItem: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: "#FFFFFF",
    fontWeight: freudDarkTheme.typography.weights.medium,
  },
  completeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: freudDarkTheme.spacing[3],
    borderRadius: freudDarkTheme.borderRadius.md,
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: "#FFFFFF",
    fontWeight: freudDarkTheme.typography.weights.semibold,
  },
  compactActivityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: freudDarkTheme.colors.card.background,
    padding: freudDarkTheme.spacing[4],
    borderRadius: freudDarkTheme.borderRadius.lg,
    ...freudDarkTheme.shadows.sm,
  },
  activityIcon: {
    fontSize: 32,
    marginRight: freudDarkTheme.spacing[4],
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: freudDarkTheme.typography.sizes.base,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: freudDarkTheme.typography.weights.semibold,
    marginBottom: freudDarkTheme.spacing[1],
  },
  activityDescription: {
    fontSize: freudDarkTheme.typography.sizes.sm,
    color: freudDarkTheme.colors.text.secondary,
    marginBottom: freudDarkTheme.spacing[1],
  },
  activityTime: {
    fontSize: freudDarkTheme.typography.sizes.xs,
    color: freudDarkTheme.colors.text.tertiary,
  },
  activityToggle: {
    padding: freudDarkTheme.spacing[2],
  },
});

export default DarkMentalHealthScoreScreen;
