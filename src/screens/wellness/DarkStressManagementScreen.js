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

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const { width, height } = Dimensions.get("window");

const DarkStressManagementScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState("stress_level");
  const [selectedStressLevel, setSelectedStressLevel] = useState(3);
  const [selectedStressors, setSelectedStressors] = useState([]);
  const [recordingExpression, setRecordingExpression] = useState(false);
  const [showingStats, setShowingStats] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const screens = [
    { id: "stress_level", title: "Stress Level", step: 1 },
    { id: "stressors", title: "Select Stressors", step: 2 },
    { id: "expression", title: "Record Expression", step: 3 },
    { id: "stats", title: "Stress Level Stats", step: 4 },
  ];

  const stressLevels = [
    {
      level: 1,
      label: "Calm",
      description: "Feeling peaceful and relaxed",
      color: "#10B981",
      emoji: "😌",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      level: 2,
      label: "Mild",
      description: "Slightly tense but manageable",
      color: "#84CC16",
      emoji: "🙂",
      bgColor: "rgba(132, 204, 22, 0.1)",
    },
    {
      level: 3,
      label: "Moderate",
      description: "Noticeable stress affecting focus",
      color: "#F59E0B",
      emoji: "😐",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      level: 4,
      label: "High",
      description: "Significant stress impacting daily activities",
      color: "#EF4444",
      emoji: "😟",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
    {
      level: 5,
      label: "Extreme",
      description: "Overwhelming stress requiring immediate attention",
      color: "#DC2626",
      emoji: "😰",
      bgColor: "rgba(220, 38, 38, 0.1)",
    },
  ];

  const stressorCategories = [
    {
      id: "work",
      label: "Work",
      color: "#EF4444",
      stressors: [
        "Deadline pressure",
        "Workload",
        "Colleagues",
        "Meetings",
        "Performance",
      ],
    },
    {
      id: "life",
      label: "Life",
      color: "#F59E0B",
      stressors: ["Relationships", "Family", "Health", "Money", "Future"],
    },
    {
      id: "relationships",
      label: "Relationship",
      color: "#8B5CF6",
      stressors: [
        "Communication",
        "Trust",
        "Intimacy",
        "Boundaries",
        "Conflict",
      ],
    },
    {
      id: "kids",
      label: "Kids",
      color: "#06B6D4",
      stressors: ["Behavior", "School", "Health", "Activities", "Development"],
    },
    {
      id: "loneliness",
      label: "Loneliness",
      color: "#10B981",
      stressors: [
        "Social isolation",
        "Connection",
        "Support",
        "Belonging",
        "Community",
      ],
    },
    {
      id: "other",
      label: "Other",
      color: "#6B7280",
      stressors: ["Technology", "News", "Weather", "Travel", "Unknown"],
    },
  ];

  const stressStats = {
    current: selectedStressLevel,
    trend: "improving", // improving, stable, worsening
    weeklyAverage: 2.8,
    monthlyData: [
      3, 2, 4, 2, 3, 1, 2, 3, 4, 2, 3, 2, 4, 3, 2, 1, 3, 2, 4, 3, 2, 3, 2, 3, 2,
      1, 3, 2, 4, 3, 2,
    ],
    insights: [
      "Your stress levels have improved by 23% this month",
      "Weekday stress is 40% higher than weekends",
      "Most common stressor: Work deadlines",
      "Best coping technique: Deep breathing",
    ],
  };

  useEffect(() => {
    // Entrance animations
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

    // Pulse animation for stress level
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();

    return () => pulseLoop.stop();
  }, []);

  const getCurrentScreen = () => {
    return screens.find((s) => s.id === currentScreen) || screens[0];
  };

  const renderStressLevelScreen = () => (
    <ScrollView
      style={styles.screenContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Main Stress Level Display */}
      <Animated.View
        style={[
          styles.stressLevelDisplay,
          {
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <LinearGradient
          colors={[
            stressLevels[selectedStressLevel - 1]?.color || "#FF8C42",
            `${stressLevels[selectedStressLevel - 1]?.color}CC` || "#F97316",
          ]}
          style={styles.stressLevelGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative Background Elements */}
          <View style={styles.backgroundElements}>
            <View
              style={[
                styles.floatingCircle,
                { top: 20, right: 30, opacity: 0.1 },
              ]}
            />
            <View
              style={[
                styles.floatingCircle,
                {
                  bottom: 40,
                  left: 25,
                  opacity: 0.08,
                  transform: [{ scale: 1.5 }],
                },
              ]}
            />
            <View
              style={[
                styles.floatingCircle,
                {
                  top: 60,
                  left: 40,
                  opacity: 0.06,
                  transform: [{ scale: 0.8 }],
                },
              ]}
            />
          </View>

          <View style={styles.stressLevelContent}>
            <Animated.View
              style={[
                styles.stressLevelNumber,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text
                style={[
                  styles.stressLevelValue,
                  { color: theme.colors.text.inverse },
                ]}
              >
                {selectedStressLevel}
              </Text>
              <View style={styles.levelIndicator}>
                {[...Array(5)].map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.levelDot,
                      {
                        backgroundColor:
                          index < selectedStressLevel
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.3)",
                      },
                    ]}
                  />
                ))}
              </View>
            </Animated.View>

            <Text
              style={[
                styles.stressLevelLabel,
                { color: theme.colors.text.inverse },
              ]}
            >
              {stressLevels[selectedStressLevel - 1]?.label} Stress Level
            </Text>

            <View style={styles.stressEmoji}>
              <Text
                style={[
                  styles.stressLevelEmoji,
                  { color: theme.colors.text.inverse },
                ]}
              >
                {stressLevels[selectedStressLevel - 1]?.emoji}
              </Text>
              <View style={styles.emojiGlow} />
            </View>

            <Text
              style={[
                styles.stressDescription,
                { color: "rgba(255,255,255,0.8)" },
              ]}
            >
              {stressLevels[selectedStressLevel - 1]?.description}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Question */}
      <View
        style={[
          styles.questionCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
      >
        <Text
          style={[styles.questionTitle, { color: theme.colors.text.primary }]}
        >
          What's your stress level today?
        </Text>
        <Text
          style={[
            styles.questionSubtitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          Our AI will decide how your stressor will impact your life in general.
        </Text>
      </View>

      {/* Stress Level Selector */}
      <View style={styles.stressLevelSelector}>
        {stressLevels.map((level, index) => {
          const isSelected = selectedStressLevel === level.level;
          return (
            <TouchableOpacity
              key={level.level}
              style={[
                styles.stressLevelOption,
                {
                  transform: [{ scale: isSelected ? 1.05 : 1 }],
                  shadowColor: isSelected ? level.color : "transparent",
                  shadowOffset: {
                    width: 0,
                    height: isSelected ? 4 : 0,
                  },
                  shadowOpacity: isSelected ? 0.3 : 0,
                  shadowRadius: isSelected ? 8 : 0,
                  elevation: isSelected ? 8 : 0,
                },
              ]}
              onPress={() => setSelectedStressLevel(level.level)}
            >
              {isSelected ? (
                <LinearGradient
                  colors={[level.color, `${level.color}DD`]}
                  style={styles.selectedLevelGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[styles.stressLevelEmoji, { marginBottom: 8 }]}>
                    {level.emoji}
                  </Text>
                  <Text
                    style={[
                      styles.stressLevelOptionNumber,
                      { color: theme.colors.text.inverse },
                    ]}
                  >
                    {level.level}
                  </Text>
                  <Text
                    style={[
                      styles.stressLevelOptionLabel,
                      { color: "rgba(255,255,255,0.9)" },
                    ]}
                  >
                    {level.label}
                  </Text>
                  <View style={styles.selectionIndicator} />
                </LinearGradient>
              ) : (
                <View
                  style={[
                    styles.unselectedLevel,
                    { backgroundColor: theme.colors.background.secondary },
                  ]}
                >
                  <Text
                    style={[
                      styles.stressLevelEmoji,
                      { marginBottom: 8, opacity: 0.7 },
                    ]}
                  >
                    {level.emoji}
                  </Text>
                  <Text
                    style={[
                      styles.stressLevelOptionNumber,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    {level.level}
                  </Text>
                  <Text
                    style={[
                      styles.stressLevelOptionLabel,
                      { color: theme.colors.text.secondary },
                    ]}
                  >
                    {level.label}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButtonContainer}
        onPress={() => setCurrentScreen("stressors")}
      >
        <LinearGradient
          colors={[
            stressLevels[selectedStressLevel - 1]?.color || "#FF8C42",
            `${stressLevels[selectedStressLevel - 1]?.color}CC` || "#F97316",
          ]}
          style={styles.continueButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MentalHealthIcon
            name="Brain"
            size={20}
            color={theme.colors.text.inverse}
            variant="filled"
          />
          <Text
            style={[
              styles.continueButtonText,
              { color: theme.colors.text.inverse },
            ]}
          >
            Continue Assessment
          </Text>
          <NavigationIcon
            name="Home"
            size={18}
            color={theme.colors.text.inverse}
            variant="outline"
            style={{ transform: [{ rotate: "180deg" }] }}
          />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderStressorsScreen = () => (
    <ScrollView
      style={styles.screenContainer}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.questionCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
      >
        <Text
          style={[styles.questionTitle, { color: theme.colors.text.primary }]}
        >
          Select Stressors
        </Text>
        <Text
          style={[
            styles.questionSubtitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          Our AI will decide how your stressor will impact your life in general.
        </Text>
      </View>

      {/* Stressor Categories */}
      <View style={styles.stressorCategories}>
        {stressorCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.stressorCategory,
              {
                backgroundColor: selectedStressors.includes(category.id)
                  ? category.color
                  : theme.colors.background.secondary,
              },
            ]}
            onPress={() => {
              if (selectedStressors.includes(category.id)) {
                setSelectedStressors((prev) =>
                  prev.filter((id) => id !== category.id),
                );
              } else {
                setSelectedStressors((prev) => [...prev, category.id]);
              }
            }}
          >
            <Text
              style={[
                styles.stressorCategoryText,
                {
                  color: selectedStressors.includes(category.id)
                    ? theme.colors.text.inverse
                    : theme.colors.text.primary,
                },
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Impact Warning */}
      <View
        style={[
          styles.warningCard,
          { backgroundColor: "rgba(239, 68, 68, 0.1)" },
        ]}
      >
        <MentalHealthIcon
          name="Brain"
          size={20}
          color="#EF4444"
          variant="filled"
        />
        <Text style={[styles.warningText, { color: "#EF4444" }]}>
          Life Impact: Very high
        </Text>
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.continueButton,
          {
            backgroundColor:
              selectedStressors.length > 0
                ? theme.colors.therapeutic.calming[600]
                : theme.colors.gray[400],
          },
        ]}
        onPress={() => setCurrentScreen("expression")}
        disabled={selectedStressors.length === 0}
      >
        <Text
          style={[
            styles.continueButtonText,
            { color: theme.colors.text.inverse },
          ]}
        >
          Continue
        </Text>
        <NavigationIcon
          name="Home"
          size={20}
          color={theme.colors.text.inverse}
          variant="outline"
        />
      </TouchableOpacity>
    </ScrollView>
  );

  const renderExpressionScreen = () => (
    <ScrollView
      style={styles.screenContainer}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.questionCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
      >
        <Text
          style={[styles.questionTitle, { color: theme.colors.text.primary }]}
        >
          Record Expression
        </Text>
        <Text
          style={[
            styles.questionSubtitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          Let's analyze face expression for better stress AI analysis. Ensure
          the following.
        </Text>
      </View>

      {/* Expression Guidelines */}
      <View style={styles.guidelinesList}>
        <View style={styles.guideline}>
          <View style={[styles.guidelineIcon, { backgroundColor: "#10B981" }]}>
            <MentalHealthIcon
              name="Heart"
              size={16}
              color={theme.colors.text.inverse}
              variant="filled"
            />
          </View>
          <Text
            style={[styles.guidelineText, { color: theme.colors.text.primary }]}
          >
            Brightly Lit Room
          </Text>
        </View>

        <View style={styles.guideline}>
          <View style={[styles.guidelineIcon, { backgroundColor: "#10B981" }]}>
            <MentalHealthIcon
              name="Brain"
              size={16}
              color={theme.colors.text.inverse}
              variant="filled"
            />
          </View>
          <Text
            style={[styles.guidelineText, { color: theme.colors.text.primary }]}
          >
            Clear Face Expression
          </Text>
        </View>

        <View style={styles.guideline}>
          <View style={[styles.guidelineIcon, { backgroundColor: "#10B981" }]}>
            <MentalHealthIcon
              name="Mindfulness"
              size={16}
              color={theme.colors.text.inverse}
              variant="filled"
            />
          </View>
          <Text
            style={[styles.guidelineText, { color: theme.colors.text.primary }]}
          >
            Stay Still
          </Text>
        </View>

        <View style={styles.guideline}>
          <View style={[styles.guidelineIcon, { backgroundColor: "#10B981" }]}>
            <MentalHealthIcon
              name="Therapy"
              size={16}
              color={theme.colors.text.inverse}
              variant="filled"
            />
          </View>
          <Text
            style={[styles.guidelineText, { color: theme.colors.text.primary }]}
          >
            32Ft Camera
          </Text>
        </View>
      </View>

      {/* Camera Preview Placeholder */}
      <View
        style={[
          styles.cameraPreview,
          { backgroundColor: theme.colors.background.secondary },
        ]}
      >
        <View style={styles.faceOutline}>
          <View style={styles.faceGuide} />
        </View>
        <Text
          style={[
            styles.cameraInstructions,
            { color: theme.colors.text.secondary },
          ]}
        >
          Position your face within the guide
        </Text>
      </View>

      {/* Skip/Record Buttons */}
      <View style={styles.expressionButtons}>
        <TouchableOpacity
          style={[
            styles.skipButton,
            {
              backgroundColor: "transparent",
              borderColor: theme.colors.gray[400],
              borderWidth: 2,
            },
          ]}
          onPress={() => setCurrentScreen("stats")}
        >
          <NavigationIcon
            name="Home"
            size={20}
            color={theme.colors.text.secondary}
            variant="outline"
          />
          <Text
            style={[
              styles.skipButtonText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Skip This Step
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.recordButton, { backgroundColor: "#EF4444" }]}
          onPress={() => setCurrentScreen("stats")}
        >
          <MentalHealthIcon
            name="Heart"
            size={20}
            color={theme.colors.text.inverse}
            variant="filled"
          />
          <Text
            style={[
              styles.recordButtonText,
              { color: theme.colors.text.inverse },
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderStatsScreen = () => (
    <ScrollView
      style={styles.screenContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Stress Level Summary */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
      >
        <Text
          style={[styles.summaryTitle, { color: theme.colors.text.primary }]}
        >
          Stress Level Set to {selectedStressLevel}
        </Text>
        <Text
          style={[
            styles.summarySubtitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          Stress condition updated to your mental health journal. Data sent to
          Doctor Freud AI.
        </Text>
        <TouchableOpacity
          style={[styles.summaryButton, { backgroundColor: "#10B981" }]}
        >
          <Text
            style={[
              styles.summaryButtonText,
              { color: theme.colors.text.inverse },
            ]}
          >
            Got it. Thanks!
          </Text>
          <MentalHealthIcon
            name="Heart"
            size={16}
            color={theme.colors.text.inverse}
            variant="filled"
          />
        </TouchableOpacity>
      </View>

      {/* Stress Level Statistics */}
      <View style={styles.statsGrid}>
        {/* Current Level */}
        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.colors.background.secondary },
          ]}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={styles.statGradient}
          >
            <Text
              style={[styles.statNumber, { color: theme.colors.text.inverse }]}
            >
              {selectedStressLevel}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.inverse }]}
            >
              Current
            </Text>
          </LinearGradient>
        </View>

        {/* Weekly Average */}
        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.colors.background.secondary },
          ]}
        >
          <LinearGradient
            colors={["#F59E0B", "#D97706"]}
            style={styles.statGradient}
          >
            <Text
              style={[styles.statNumber, { color: theme.colors.text.inverse }]}
            >
              {stressStats.weeklyAverage}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.inverse }]}
            >
              Weekly Avg
            </Text>
          </LinearGradient>
        </View>

        {/* Trend */}
        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.colors.background.secondary },
          ]}
        >
          <LinearGradient
            colors={["#8B5CF6", "#7C3AED"]}
            style={styles.statGradient}
          >
            <MentalHealthIcon
              name="Brain"
              size={24}
              color={theme.colors.text.inverse}
              variant="filled"
            />
            <Text
              style={[styles.statLabel, { color: theme.colors.text.inverse }]}
            >
              Improving
            </Text>
          </LinearGradient>
        </View>

        {/* Monthly */}
        <View
          style={[
            styles.statCard,
            { backgroundColor: theme.colors.background.secondary },
          ]}
        >
          <LinearGradient
            colors={["#EF4444", "#DC2626"]}
            style={styles.statGradient}
          >
            <Text
              style={[styles.statNumber, { color: theme.colors.text.inverse }]}
            >
              91
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.inverse }]}
            >
              Monthly
            </Text>
          </LinearGradient>
        </View>
      </View>

      {/* Monthly Chart */}
      <View
        style={[
          styles.chartCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
      >
        <Text style={[styles.chartTitle, { color: theme.colors.text.primary }]}>
          Stress Level Chart
        </Text>
        <View style={styles.chartContainer}>
          <View style={styles.chartBars}>
            {stressStats.monthlyData.slice(-7).map((value, index) => (
              <View key={index} style={styles.chartBar}>
                <View
                  style={[
                    styles.chartBarFill,
                    {
                      height: `${(value / 5) * 100}%`,
                      backgroundColor:
                        value <= 2
                          ? "#10B981"
                          : value <= 3
                            ? "#F59E0B"
                            : "#EF4444",
                    },
                  ]}
                />
              </View>
            ))}
          </View>
          <View style={styles.chartLabels}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, index) => (
                <Text
                  key={index}
                  style={[
                    styles.chartLabel,
                    { color: theme.colors.text.tertiary },
                  ]}
                >
                  {day}
                </Text>
              ),
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderProgressSteps = () => (
    <View style={styles.progressSteps}>
      {screens.map((screen, index) => (
        <View key={screen.id} style={styles.progressStep}>
          <View
            style={[
              styles.progressStepCircle,
              {
                backgroundColor:
                  currentScreen === screen.id
                    ? theme.colors.therapeutic.calming[600]
                    : screens.findIndex((s) => s.id === currentScreen) > index
                      ? "#10B981"
                      : theme.colors.gray[300],
              },
            ]}
          >
            <Text
              style={[
                styles.progressStepNumber,
                {
                  color:
                    currentScreen === screen.id ||
                    screens.findIndex((s) => s.id === currentScreen) > index
                      ? theme.colors.text.inverse
                      : theme.colors.text.secondary,
                },
              ]}
            >
              {screen.step}
            </Text>
          </View>
          {index < screens.length - 1 && (
            <View
              style={[
                styles.progressStepLine,
                {
                  backgroundColor:
                    screens.findIndex((s) => s.id === currentScreen) > index
                      ? "#10B981"
                      : theme.colors.gray[300],
                },
              ]}
            />
          )}
        </View>
      ))}
    </View>
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
          onPress={() => {
            if (currentScreen === "stress_level") {
              navigation.goBack();
            } else {
              const currentIndex = screens.findIndex(
                (s) => s.id === currentScreen,
              );
              if (currentIndex > 0) {
                setCurrentScreen(screens[currentIndex - 1].id);
              }
            }
          }}
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
          {getCurrentScreen().title}
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

      {/* Progress Steps */}
      {renderProgressSteps()}

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {currentScreen === "stress_level" && renderStressLevelScreen()}
        {currentScreen === "stressors" && renderStressorsScreen()}
        {currentScreen === "expression" && renderExpressionScreen()}
        {currentScreen === "stats" && renderStatsScreen()}
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
  progressSteps: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressStep: {
    alignItems: "center",
  },
  progressStepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  progressStepNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressStepLine: {
    width: 60,
    height: 2,
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  screenContainer: {
    flex: 1,
  },
  stressLevelDisplay: {
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  stressLevelGradient: {
    padding: 32,
    alignItems: "center",
    position: "relative",
  },
  backgroundElements: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingCircle: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
  stressLevelContent: {
    alignItems: "center",
    zIndex: 2,
  },
  stressLevelNumber: {
    alignItems: "center",
    marginBottom: 16,
  },
  stressLevelValue: {
    fontSize: 56,
    fontWeight: "bold",
    marginBottom: 8,
  },
  levelIndicator: {
    flexDirection: "row",
    gap: 4,
  },
  levelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stressLevelLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  stressEmoji: {
    position: "relative",
    marginBottom: 12,
  },
  stressLevelEmoji: {
    fontSize: 40,
  },
  emojiGlow: {
    position: "absolute",
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    zIndex: -1,
  },
  stressDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  questionCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  questionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  questionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  stressLevelSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 6,
  },
  stressLevelOption: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  selectedLevelGradient: {
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 8,
    position: "relative",
  },
  unselectedLevel: {
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  selectionIndicator: {
    position: "absolute",
    bottom: 4,
    width: 20,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 2,
  },
  stressLevelOptionNumber: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  stressLevelOptionLabel: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  continueButtonContainer: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  stressorCategories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  stressorCategory: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  stressorCategoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  warningCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  warningText: {
    fontSize: 14,
    fontWeight: "600",
  },
  guidelinesList: {
    gap: 16,
    marginBottom: 24,
  },
  guideline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  guidelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  guidelineText: {
    fontSize: 16,
    fontWeight: "500",
  },
  cameraPreview: {
    height: 200,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  faceOutline: {
    width: 120,
    height: 150,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#10B981",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  faceGuide: {
    width: 80,
    height: 100,
    borderRadius: 40,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  cameraInstructions: {
    position: "absolute",
    bottom: 20,
    fontSize: 14,
  },
  expressionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  skipButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  recordButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  summarySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 16,
  },
  summaryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  summaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    overflow: "hidden",
  },
  statGradient: {
    padding: 20,
    alignItems: "center",
    minHeight: 100,
    justifyContent: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  chartCard: {
    padding: 20,
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  chartContainer: {
    height: 150,
  },
  chartBars: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    flex: 1,
    paddingHorizontal: 10,
  },
  chartBar: {
    width: 20,
    height: "100%",
    justifyContent: "flex-end",
    backgroundColor: "rgba(107, 114, 128, 0.2)",
    borderRadius: 10,
  },
  chartBarFill: {
    width: "100%",
    borderRadius: 10,
    minHeight: 4,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    paddingHorizontal: 10,
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default DarkStressManagementScreen;
