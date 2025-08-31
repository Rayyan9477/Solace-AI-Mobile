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
  FlatList,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const { width, height } = Dimensions.get("window");

const DarkSleepQualityScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedScreen, setSelectedScreen] = useState("overview");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sleepGoal, setSleepGoal] = useState(8.25);
  const [currentStreak, setCurrentStreak] = useState(20);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const screens = [
    { id: "overview", title: "Overview", icon: "Brain" },
    { id: "calendar", title: "Calendar", icon: "Heart" },
    { id: "schedule", title: "Schedule", icon: "Mindfulness" },
    { id: "insights", title: "Insights", icon: "Therapy" },
  ];

  const sleepData = {
    lastNight: {
      bedTime: "22:15",
      wakeTime: "06:15",
      duration: 8.0,
      quality: 85,
      stages: {
        deep: 2.1,
        light: 4.2,
        rem: 1.7,
      },
    },
    weeklyAverage: 7.8,
    streak: 20,
    goal: 8.25,
  };

  const monthlyData = [
    { date: 1, quality: 85, duration: 8.2 },
    { date: 2, quality: 72, duration: 7.1 },
    { date: 3, quality: 91, duration: 8.5 },
    { date: 4, quality: 78, duration: 7.8 },
    { date: 5, quality: 88, duration: 8.1 },
    { date: 6, quality: 65, duration: 6.5 },
    { date: 7, quality: 82, duration: 8.0 },
    { date: 8, quality: 90, duration: 8.4 },
    { date: 9, quality: 76, duration: 7.6 },
    { date: 10, quality: 84, duration: 8.2 },
    { date: 11, quality: 79, duration: 7.9 },
    { date: 12, quality: 86, duration: 8.3 },
    { date: 13, quality: 73, duration: 7.2 },
    { date: 14, quality: 89, duration: 8.5 },
    { date: 15, quality: 81, duration: 8.0 },
    { date: 16, quality: 77, duration: 7.7 },
    { date: 17, quality: 92, duration: 8.6 },
    { date: 18, quality: 75, duration: 7.5 },
    { date: 19, quality: 87, duration: 8.2 },
    { date: 20, quality: 83, duration: 8.1 },
    // Current date
    { date: 21, quality: 85, duration: 8.0, isToday: true },
  ];

  const sleepInsights = [
    {
      id: 1,
      title: "Sleep Goal Achievement",
      value: "91%",
      change: "+5%",
      color: "#10B981",
      icon: "Brain",
    },
    {
      id: 2,
      title: "Average Sleep Quality",
      value: "8.2",
      change: "+0.3",
      color: "#F59E0B",
      icon: "Heart",
    },
    {
      id: 3,
      title: "Sleep Consistency",
      value: "94%",
      change: "+2%",
      color: "#8B5CF6",
      icon: "Mindfulness",
    },
    {
      id: 4,
      title: "Pillow Environment",
      value: "Good",
      change: "Stable",
      color: "#6366F1",
      icon: "Therapy",
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderOverviewScreen = () => (
    <ScrollView
      style={styles.screenContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Sleep Streak Card */}
      <Animated.View
        style={[
          styles.streakCard,
          {
            backgroundColor: theme.colors.background.secondary,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={["#8B5CF6", "#6366F1"]}
          style={styles.streakGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.streakHeader}>
            <Text
              style={[
                styles.streakNumber,
                { color: theme.colors.text.inverse },
              ]}
            >
              {currentStreak}
            </Text>
            <Text
              style={[styles.streakLabel, { color: theme.colors.text.inverse }]}
            >
              You are improving.
            </Text>
          </View>
          <View style={styles.streakProgress}>
            <View style={styles.streakProgressBar}>
              <View style={[styles.streakProgressFill, { width: "75%" }]} />
            </View>
            <Text
              style={[styles.streakDays, { color: theme.colors.text.inverse }]}
            >
              7 in
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Sleep Quality Chart */}
      <Animated.View
        style={[
          styles.chartCard,
          {
            backgroundColor: theme.colors.background.secondary,
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.chartHeader}>
          <View style={styles.chartTitleContainer}>
            <MentalHealthIcon
              name="Brain"
              size={20}
              color={theme.colors.therapeutic.calming[500]}
              variant="filled"
            />
            <Text
              style={[styles.chartTitle, { color: theme.colors.text.primary }]}
            >
              Sleep Quality
            </Text>
          </View>
          <TouchableOpacity style={styles.chartPeriod}>
            <Text
              style={[
                styles.chartPeriodText,
                { color: theme.colors.text.secondary },
              ]}
            >
              January 2025
            </Text>
            <NavigationIcon
              name="Home"
              size={16}
              color={theme.colors.text.secondary}
              variant="outline"
              style={{ transform: [{ rotate: "90deg" }] }}
            />
          </TouchableOpacity>
        </View>

        {/* Sleep Quality Visualization */}
        <View style={styles.qualityVisualization}>
          <View style={styles.qualityCircleContainer}>
            <LinearGradient
              colors={["rgba(16, 185, 129, 0.15)", "rgba(16, 185, 129, 0.05)"]}
              style={styles.qualityCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.qualityInnerCircle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text
                  style={[
                    styles.qualityPercentage,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  85%
                </Text>
                <Text
                  style={[
                    styles.qualityLabel,
                    { color: "rgba(255,255,255,0.8)" },
                  ]}
                >
                  Excellent
                </Text>
              </LinearGradient>
            </LinearGradient>
          </View>

          <View style={styles.qualityDetails}>
            <TouchableOpacity style={styles.qualityDetailItem}>
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.qualityDot}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.qualityDetailText}>
                <Text
                  style={[
                    styles.qualityDetailLabel,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Deep Sleep
                </Text>
                <Text
                  style={[
                    styles.qualityDetailValue,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  2.1h • 26%
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.qualityDetailItem}>
              <LinearGradient
                colors={["#F59E0B", "#D97706"]}
                style={styles.qualityDot}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.qualityDetailText}>
                <Text
                  style={[
                    styles.qualityDetailLabel,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Light Sleep
                </Text>
                <Text
                  style={[
                    styles.qualityDetailValue,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  4.2h • 53%
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.qualityDetailItem}>
              <LinearGradient
                colors={["#8B5CF6", "#7C3AED"]}
                style={styles.qualityDot}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.qualityDetailText}>
                <Text
                  style={[
                    styles.qualityDetailLabel,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  REM Sleep
                </Text>
                <Text
                  style={[
                    styles.qualityDetailValue,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  1.7h • 21%
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Monthly Progress */}
        <View style={styles.monthlyProgress}>
          <View style={styles.progressHeader}>
            <Text
              style={[
                styles.progressTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              This Month Progress
            </Text>
            <View style={styles.progressLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#10B981" }]}
                />
                <Text
                  style={[
                    styles.legendText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Good Sleep
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#FF8C42" }]}
                />
                <Text
                  style={[
                    styles.legendText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  Today
                </Text>
              </View>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.progressScrollContent}
          >
            {monthlyData.map((day) => (
              <TouchableOpacity key={day.date} style={styles.dayProgress}>
                <Text
                  style={[
                    styles.dayDate,
                    {
                      color: day.isToday
                        ? "#FF8C42"
                        : theme.colors.text.tertiary,
                      fontWeight: day.isToday ? "600" : "500",
                    },
                  ]}
                >
                  {day.date}
                </Text>

                <View style={styles.dayBarContainer}>
                  <LinearGradient
                    colors={
                      day.isToday
                        ? ["#FF8C42", "#F97316"]
                        : ["#10B981", "#059669"]
                    }
                    style={[
                      styles.dayBarFill,
                      { height: `${Math.max(day.quality, 10)}%` },
                    ]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                  />
                  <View style={styles.dayBar} />
                </View>

                <Text
                  style={[
                    styles.dayQuality,
                    { color: theme.colors.text.tertiary },
                  ]}
                >
                  {day.quality}%
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View
        style={[
          styles.quickActions,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity
          style={styles.actionButtonContainer}
          onPress={() => setSelectedScreen("schedule")}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={styles.actionButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MentalHealthIcon
              name="Mindfulness"
              size={24}
              color={theme.colors.text.inverse}
              variant="filled"
            />
            <Text
              style={[
                styles.actionButtonText,
                { color: theme.colors.text.inverse },
              ]}
            >
              New Sleep Schedule
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButtonContainer}
          onPress={() => setSelectedScreen("insights")}
        >
          <LinearGradient
            colors={["#8B5CF6", "#7C3AED"]}
            style={styles.actionButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MentalHealthIcon
              name="Therapy"
              size={24}
              color={theme.colors.text.inverse}
              variant="filled"
            />
            <Text
              style={[
                styles.actionButtonText,
                { color: theme.colors.text.inverse },
              ]}
            >
              Sleep Insights
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );

  const renderScheduleScreen = () => (
    <ScrollView
      style={styles.screenContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Sleep Schedule Header */}
      <View
        style={[
          styles.scheduleHeader,
          { backgroundColor: theme.colors.background.secondary },
        ]}
      >
        <View style={styles.scheduleTime}>
          <Text
            style={[
              styles.scheduleTimeLabel,
              { color: theme.colors.text.secondary },
            ]}
          >
            Good Night, Sleepytopia!
          </Text>
          <Text
            style={[
              styles.scheduleTimeValue,
              { color: theme.colors.text.primary },
            ]}
          >
            22:15
          </Text>
        </View>
        <View style={styles.scheduleTime}>
          <Text
            style={[
              styles.scheduleTimeLabel,
              { color: theme.colors.text.secondary },
            ]}
          >
            Wake Up, Sleepytopia!
          </Text>
          <Text
            style={[
              styles.scheduleTimeValue,
              { color: theme.colors.text.primary },
            ]}
          >
            06:15
          </Text>
        </View>
      </View>

      {/* Sleep Goal */}
      <View
        style={[
          styles.goalCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
      >
        <Text style={[styles.goalTitle, { color: theme.colors.text.primary }]}>
          You Slept for
        </Text>
        <Text style={[styles.goalValue, { color: "#10B981" }]}>8.25h</Text>
        <Text
          style={[styles.goalSubtitle, { color: theme.colors.text.secondary }]}
        >
          Goal: 8h 15m everyday
        </Text>
        <View style={styles.goalProgress}>
          <View
            style={[
              styles.goalProgressBar,
              { backgroundColor: theme.colors.background.primary },
            ]}
          >
            <View
              style={[
                styles.goalProgressFill,
                { width: "85%", backgroundColor: "#10B981" },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Start Sleeping Button */}
      <TouchableOpacity
        style={[styles.startSleepButton, { backgroundColor: "#FF8C42" }]}
      >
        <MentalHealthIcon
          name="Mindfulness"
          size={24}
          color={theme.colors.text.inverse}
          variant="filled"
        />
        <Text
          style={[styles.startSleepText, { color: theme.colors.text.inverse }]}
        >
          Start Sleeping
        </Text>
      </TouchableOpacity>

      {/* Sleep Tips */}
      <View style={styles.sleepTips}>
        <Text style={[styles.tipsTitle, { color: theme.colors.text.primary }]}>
          Sleep Better Tonight
        </Text>
        <View style={styles.tipsList}>
          <View
            style={[
              styles.tipItem,
              { backgroundColor: theme.colors.background.secondary },
            ]}
          >
            <View style={[styles.tipIcon, { backgroundColor: "#10B981" }]}>
              <MentalHealthIcon
                name="Brain"
                size={20}
                color={theme.colors.text.inverse}
                variant="filled"
              />
            </View>
            <Text
              style={[styles.tipText, { color: theme.colors.text.primary }]}
            >
              Keep your room cool (60-67°F)
            </Text>
          </View>

          <View
            style={[
              styles.tipItem,
              { backgroundColor: theme.colors.background.secondary },
            ]}
          >
            <View style={[styles.tipIcon, { backgroundColor: "#8B5CF6" }]}>
              <MentalHealthIcon
                name="Mindfulness"
                size={20}
                color={theme.colors.text.inverse}
                variant="filled"
              />
            </View>
            <Text
              style={[styles.tipText, { color: theme.colors.text.primary }]}
            >
              Practice deep breathing exercises
            </Text>
          </View>

          <View
            style={[
              styles.tipItem,
              { backgroundColor: theme.colors.background.secondary },
            ]}
          >
            <View style={[styles.tipIcon, { backgroundColor: "#F59E0B" }]}>
              <MentalHealthIcon
                name="Heart"
                size={20}
                color={theme.colors.text.inverse}
                variant="filled"
              />
            </View>
            <Text
              style={[styles.tipText, { color: theme.colors.text.primary }]}
            >
              Limit screen time before bed
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderInsightsScreen = () => (
    <ScrollView
      style={styles.screenContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Sleep Insights Grid */}
      <View style={styles.insightsGrid}>
        {sleepInsights.map((insight, index) => (
          <Animated.View
            key={insight.id}
            style={[
              styles.insightCard,
              {
                backgroundColor: theme.colors.background.secondary,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View
              style={[styles.insightIcon, { backgroundColor: insight.color }]}
            >
              <MentalHealthIcon
                name={insight.icon}
                size={24}
                color={theme.colors.text.inverse}
                variant="filled"
              />
            </View>
            <View style={styles.insightContent}>
              <Text
                style={[
                  styles.insightTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                {insight.title}
              </Text>
              <View style={styles.insightValues}>
                <Text style={[styles.insightValue, { color: insight.color }]}>
                  {insight.value}
                </Text>
                <Text style={[styles.insightChange, { color: "#10B981" }]}>
                  {insight.change}
                </Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Sleep Pattern Analysis */}
      <View
        style={[
          styles.patternCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
      >
        <Text
          style={[styles.patternTitle, { color: theme.colors.text.primary }]}
        >
          Sleep Pattern Analysis
        </Text>
        <View style={styles.patternChart}>
          <View style={styles.patternDays}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, index) => (
                <View key={day} style={styles.patternDay}>
                  <Text
                    style={[
                      styles.patternDayText,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {day}
                  </Text>
                  <View style={styles.patternBar}>
                    <View
                      style={[
                        styles.patternBarFill,
                        {
                          height: `${60 + index * 5}%`,
                          backgroundColor: index === 6 ? "#FF8C42" : "#10B981",
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.patternHours,
                      { color: theme.colors.text.tertiary },
                    ]}
                  >
                    {7.5 + index * 0.2}h
                  </Text>
                </View>
              ),
            )}
          </View>
        </View>
      </View>

      {/* Recommendations */}
      <View
        style={[
          styles.recommendationsCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
      >
        <Text
          style={[
            styles.recommendationsTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          Personalized Recommendations
        </Text>
        <View style={styles.recommendationsList}>
          <View style={styles.recommendationItem}>
            <View
              style={[
                styles.recommendationIcon,
                { backgroundColor: "#10B981" },
              ]}
            >
              <Text style={styles.recommendationEmoji}>💤</Text>
            </View>
            <View style={styles.recommendationContent}>
              <Text
                style={[
                  styles.recommendationText,
                  { color: theme.colors.text.primary },
                ]}
              >
                Your sleep quality improved by 12% this week
              </Text>
              <Text
                style={[
                  styles.recommendationSubtext,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Keep maintaining your bedtime routine
              </Text>
            </View>
          </View>

          <View style={styles.recommendationItem}>
            <View
              style={[
                styles.recommendationIcon,
                { backgroundColor: "#F59E0B" },
              ]}
            >
              <Text style={styles.recommendationEmoji}>⏰</Text>
            </View>
            <View style={styles.recommendationContent}>
              <Text
                style={[
                  styles.recommendationText,
                  { color: theme.colors.text.primary },
                ]}
              >
                Try going to bed 15 minutes earlier
              </Text>
              <Text
                style={[
                  styles.recommendationSubtext,
                  { color: theme.colors.text.secondary },
                ]}
              >
                This could help you reach your 8.25h goal
              </Text>
            </View>
          </View>

          <View style={styles.recommendationItem}>
            <View
              style={[
                styles.recommendationIcon,
                { backgroundColor: "#8B5CF6" },
              ]}
            >
              <Text style={styles.recommendationEmoji}>🧘</Text>
            </View>
            <View style={styles.recommendationContent}>
              <Text
                style={[
                  styles.recommendationText,
                  { color: theme.colors.text.primary },
                ]}
              >
                Consider meditation before sleep
              </Text>
              <Text
                style={[
                  styles.recommendationSubtext,
                  { color: theme.colors.text.secondary },
                ]}
              >
                Users report 23% better sleep quality
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
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
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </TouchableOpacity>

        <Text
          style={[styles.headerTitle, { color: theme.colors.text.primary }]}
        >
          Sleep Quality
        </Text>

        <TouchableOpacity style={styles.menuButton}>
          <MentalHealthIcon
            name="Brain"
            size={24}
            color={theme.colors.text.primary}
            variant="outline"
          />
        </TouchableOpacity>
      </View>

      {/* Screen Navigation */}
      <View style={styles.screenNavigation}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navScroll}
        >
          {screens.map((screen) => (
            <TouchableOpacity
              key={screen.id}
              style={[
                styles.navItem,
                {
                  backgroundColor:
                    selectedScreen === screen.id
                      ? theme.colors.therapeutic.calming[600]
                      : theme.colors.background.secondary,
                },
              ]}
              onPress={() => setSelectedScreen(screen.id)}
            >
              <MentalHealthIcon
                name={screen.icon}
                size={20}
                color={
                  selectedScreen === screen.id
                    ? theme.colors.text.inverse
                    : theme.colors.text.primary
                }
                variant={selectedScreen === screen.id ? "filled" : "outline"}
              />
              <Text
                style={[
                  styles.navItemText,
                  {
                    color:
                      selectedScreen === screen.id
                        ? theme.colors.text.inverse
                        : theme.colors.text.primary,
                  },
                ]}
              >
                {screen.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Screen Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {selectedScreen === "overview" && renderOverviewScreen()}
        {selectedScreen === "calendar" && renderOverviewScreen()}{" "}
        {/* Using overview for now */}
        {selectedScreen === "schedule" && renderScheduleScreen()}
        {selectedScreen === "insights" && renderInsightsScreen()}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
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
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  screenNavigation: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  navScroll: {
    flexGrow: 0,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  navItemText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  streakCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  streakGradient: {
    padding: 20,
  },
  streakHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 16,
    opacity: 0.9,
  },
  streakProgress: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  streakProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
  },
  streakProgressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  streakDays: {
    fontSize: 14,
    fontWeight: "500",
  },
  chartCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  chartTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  chartPeriod: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  chartPeriodText: {
    fontSize: 14,
  },
  qualityVisualization: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  qualityCircleContainer: {
    marginRight: 20,
  },
  qualityCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  qualityInnerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  qualityPercentage: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2,
  },
  qualityLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  qualityDetails: {
    flex: 1,
    gap: 12,
  },
  qualityDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  qualityDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  qualityDetailText: {
    flex: 1,
  },
  qualityDetailLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  qualityDetailValue: {
    fontSize: 12,
  },
  monthlyProgress: {
    marginTop: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  progressLegend: {
    flexDirection: "row",
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "500",
  },
  progressScrollContent: {
    paddingHorizontal: 4,
  },
  dayProgress: {
    alignItems: "center",
    marginRight: 12,
    padding: 4,
  },
  dayDate: {
    fontSize: 12,
    marginBottom: 6,
  },
  dayBarContainer: {
    position: "relative",
    marginBottom: 6,
  },
  dayBar: {
    width: 24,
    height: 70,
    backgroundColor: "rgba(107, 114, 128, 0.15)",
    borderRadius: 12,
    position: "absolute",
    bottom: 0,
  },
  dayBarFill: {
    position: "absolute",
    bottom: 0,
    width: 24,
    borderRadius: 12,
    minHeight: 6,
    zIndex: 1,
  },
  dayQuality: {
    fontSize: 10,
    fontWeight: "500",
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  actionButtonContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  scheduleTime: {
    alignItems: "center",
  },
  scheduleTimeLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  scheduleTimeValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  goalCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  goalTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  goalValue: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 8,
  },
  goalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  goalProgress: {
    width: "100%",
  },
  goalProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  goalProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  startSleepButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  startSleepText: {
    fontSize: 18,
    fontWeight: "600",
  },
  sleepTips: {
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  insightsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  insightCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 12,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  insightContent: {
    gap: 8,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  insightValues: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  insightValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  insightChange: {
    fontSize: 12,
    fontWeight: "500",
  },
  patternCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  patternTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  patternChart: {
    height: 150,
  },
  patternDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: "100%",
  },
  patternDay: {
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  },
  patternDayText: {
    fontSize: 12,
    fontWeight: "500",
  },
  patternBar: {
    width: 20,
    flex: 1,
    backgroundColor: "rgba(107, 114, 128, 0.2)",
    borderRadius: 10,
    justifyContent: "flex-end",
    marginVertical: 8,
  },
  patternBarFill: {
    width: "100%",
    borderRadius: 10,
    minHeight: 4,
  },
  patternHours: {
    fontSize: 10,
  },
  recommendationsCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  recommendationsList: {
    gap: 16,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  recommendationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  recommendationEmoji: {
    fontSize: 20,
  },
  recommendationContent: {
    flex: 1,
    gap: 4,
  },
  recommendationText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  recommendationSubtext: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default DarkSleepQualityScreen;
