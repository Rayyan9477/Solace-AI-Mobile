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

const FreudScoreScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  // Mock data matching the design exactly
  const scoreData = {
    currentScore: 80,
    status: "Mentally Stable",
    freudScore: 85,
    range: {
      start: "2024/18/16",
      end: "2024/18/16",
    },
    scoreCategories: [
      { name: "Positive", color: "#4CAF50", percentage: 35 },
      { name: "Negative", color: "#FF5252", percentage: 25 },
      { name: "Neutral", color: "#FFC107", percentage: 40 },
    ],
    moodHistory: [
      { day: "Mon", mood: "😊", intensity: 4 },
      { day: "Tue", mood: "😐", intensity: 3 },
      { day: "Wed", mood: "😢", intensity: 2 },
      { day: "Thu", mood: "😊", intensity: 4 },
      { day: "Fri", mood: "😌", intensity: 3 },
      { day: "Sat", mood: "😊", intensity: 4 },
      { day: "Sun", mood: "😐", intensity: 3 },
    ],
    suggestions: [
      {
        title: "Filter Freud Score",
        range: "1% - 25",
        date: "2024/18/16 - 2024/18/16",
        includeAll: true,
      },
    ],
  };

  const periods = ["Positive", "Negative", "Monthly"];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: scoreData.currentScore,
        duration: 2000,
        useNativeDriver: false,
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
            Freud Score
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
              },
            ]}
          >
            {/* Current Score Display */}
            <View
              style={[
                styles.scoreCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.scoreTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                See your mental score insights
              </Text>

              <View style={styles.scoreContainer}>
                <LinearGradient
                  colors={
                    isDarkMode ? ["#4CAF50", "#66BB6A"] : ["#E8F5E8", "#C8E6C9"]
                  }
                  style={styles.circularScore}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.scoreInner}>
                    <Animated.Text
                      style={[
                        styles.scoreNumber,
                        { color: isDarkMode ? "#FFFFFF" : "#2E7D32" },
                      ]}
                    >
                      {scoreData.currentScore}
                    </Animated.Text>
                    <Text
                      style={[
                        styles.scoreStatus,
                        { color: isDarkMode ? "#E8F5E8" : "#388E3C" },
                      ]}
                    >
                      {scoreData.status}
                    </Text>
                  </View>
                </LinearGradient>

                <View style={styles.scoreActions}>
                  <TouchableOpacity
                    style={[
                      styles.scoreButton,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.05)",
                      },
                    ]}
                    onPress={() => navigation.navigate("MoodStats")}
                  >
                    <Text
                      style={[
                        styles.scoreButtonText,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      View Freud Score ({scoreData.freudScore})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.scoreButton,
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
                        styles.scoreButtonText,
                        { color: theme.colors.text.primary },
                      ]}
                    >
                      Suggestions
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Mood History Chart */}
            <View
              style={[
                styles.chartCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <View style={styles.chartHeader}>
                <Text
                  style={[
                    styles.chartTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Mood History
                </Text>
                <View style={styles.periodTabs}>
                  {periods.map((period) => (
                    <TouchableOpacity
                      key={period}
                      style={[
                        styles.periodTab,
                        {
                          backgroundColor:
                            period === "Monthly"
                              ? theme.colors.primary[500]
                              : "transparent",
                        },
                      ]}
                      onPress={() => setSelectedPeriod(period.toLowerCase())}
                    >
                      <Text
                        style={[
                          styles.periodTabText,
                          {
                            color:
                              period === "Monthly"
                                ? theme.colors.text.inverse
                                : theme.colors.text.secondary,
                          },
                        ]}
                      >
                        {period}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.moodChart}>
                {scoreData.moodHistory.map((mood, index) => (
                  <MoodChartBar
                    key={index}
                    mood={mood}
                    theme={theme}
                    delay={index * 100}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.chartAction,
                  { backgroundColor: isDarkMode ? "#8B4513" : "#CD853F" },
                ]}
              >
                <Text
                  style={[
                    styles.chartActionText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  Suggest for AI suggestions
                </Text>
              </TouchableOpacity>
            </View>

            {/* Score Filter */}
            <View
              style={[
                styles.filterCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.filterTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Filter Freud Score
              </Text>

              <View style={styles.filterContent}>
                <View style={styles.filterRow}>
                  <Text
                    style={[
                      styles.filterLabel,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    Score Range
                  </Text>
                  <Text
                    style={[
                      styles.filterValue,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    1% - 25
                  </Text>
                </View>

                <View style={styles.filterRow}>
                  <Text
                    style={[
                      styles.filterLabel,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    Date Range
                  </Text>
                  <Text
                    style={[
                      styles.filterValue,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {scoreData.range.start} - {scoreData.range.end}
                  </Text>
                </View>

                <View style={styles.filterRow}>
                  <Text
                    style={[
                      styles.filterLabel,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    Include All Suggestions
                  </Text>
                  <View
                    style={[
                      styles.toggleSwitch,
                      {
                        backgroundColor: theme.colors.primary[500],
                      },
                    ]}
                  >
                    <View style={styles.toggleKnob} />
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  { backgroundColor: theme.colors.primary[500] },
                ]}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  Filter Freud Score (15) 📊
                </Text>
              </TouchableOpacity>
            </View>

            {/* Score Categories */}
            <View
              style={[
                styles.categoriesCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.categoriesTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Score Categories
              </Text>

              {scoreData.scoreCategories.map((category, index) => (
                <ScoreCategoryBar
                  key={index}
                  category={category}
                  theme={theme}
                  delay={index * 150}
                />
              ))}
            </View>

            {/* Navigation Actions */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: theme.colors.primary[500] },
                ]}
                onPress={() => navigation.navigate("Assessment")}
              >
                <MentalHealthIcon
                  name="Brain"
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
                  Take Assessment
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  { backgroundColor: theme.colors.background.secondary },
                ]}
                onPress={() => navigation.navigate("MoodTracker")}
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
                  Track Mood
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const MoodChartBar = ({ mood, theme, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue: mood.intensity * 15,
        duration: 1000,
        delay: delay + 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View style={[styles.chartItem, { opacity: fadeAnim }]}>
      <Animated.View
        style={[
          styles.chartBar,
          {
            height: heightAnim,
            backgroundColor: "#4CAF50",
          },
        ]}
      />
      <Text style={styles.chartEmoji}>{mood.mood}</Text>
      <Text style={[styles.chartDay, { color: theme.colors.text.quaternary }]}>
        {mood.day}
      </Text>
    </Animated.View>
  );
};

const ScoreCategoryBar = ({ category, theme, delay }) => {
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
        toValue: category.percentage,
        duration: 1000,
        delay: delay + 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [delay]);

  return (
    <Animated.View style={[styles.categoryItem, { opacity: fadeAnim }]}>
      <View style={styles.categoryLabel}>
        <View
          style={[styles.categoryDot, { backgroundColor: category.color }]}
        />
        <Text
          style={[styles.categoryName, { color: theme.colors.text.primary }]}
        >
          {category.name}
        </Text>
      </View>

      <View style={styles.categoryBar}>
        <Animated.View
          style={[
            styles.categoryProgress,
            {
              backgroundColor: category.color,
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
          styles.categoryPercentage,
          { color: theme.colors.text.secondary },
        ]}
      >
        {category.percentage}%
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
  scoreCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  circularScore: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  scoreInner: {
    alignItems: "center",
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  scoreStatus: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  scoreActions: {
    flex: 1,
    gap: 8,
  },
  scoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  scoreButtonText: {
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
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  periodTabs: {
    flexDirection: "row",
    gap: 4,
  },
  periodTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  periodTabText: {
    fontSize: 12,
    fontWeight: "500",
  },
  moodChart: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 80,
    marginBottom: 16,
  },
  chartItem: {
    alignItems: "center",
    gap: 4,
  },
  chartBar: {
    width: 8,
    borderRadius: 4,
    minHeight: 20,
  },
  chartEmoji: {
    fontSize: 16,
  },
  chartDay: {
    fontSize: 10,
  },
  chartAction: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  chartActionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  filterContent: {
    gap: 12,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterLabel: {
    fontSize: 14,
  },
  filterValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-end",
  },
  filterButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  categoriesCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  categoryLabel: {
    flexDirection: "row",
    alignItems: "center",
    width: 80,
    gap: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
  },
  categoryBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  categoryProgress: {
    height: "100%",
    borderRadius: 4,
  },
  categoryPercentage: {
    fontSize: 12,
    fontWeight: "500",
    width: 32,
    textAlign: "right",
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

export default FreudScoreScreen;
