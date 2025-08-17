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
  Alert,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const { width } = Dimensions.get("window");

const SleepQualityScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("log");
  const [sleepData, setSleepData] = useState({
    bedtime: null,
    wakeTime: null,
    quality: null,
    mood: null,
  });
  const [sleepHistory, setSleepHistory] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const sleepQualityOptions = [
    {
      value: 1,
      label: "Very Poor",
      emoji: "😴",
      color: theme.colors.error[400],
    },
    { value: 2, label: "Poor", emoji: "😪", color: theme.colors.error[300] },
    { value: 3, label: "Fair", emoji: "😐", color: theme.colors.warning[400] },
    {
      value: 4,
      label: "Good",
      emoji: "🙂",
      color: theme.colors.therapeutic.calming[400],
    },
    {
      value: 5,
      label: "Excellent",
      emoji: "😊",
      color: theme.colors.therapeutic.nurturing[400],
    },
  ];

  const morningMoodOptions = [
    {
      value: "energized",
      label: "Energized",
      emoji: "⚡",
      color: theme.colors.therapeutic.energizing[400],
    },
    {
      value: "refreshed",
      label: "Refreshed",
      emoji: "🌅",
      color: theme.colors.therapeutic.nurturing[400],
    },
    {
      value: "neutral",
      label: "Neutral",
      emoji: "😐",
      color: theme.colors.gray[400],
    },
    {
      value: "tired",
      label: "Tired",
      emoji: "😴",
      color: theme.colors.warning[400],
    },
    {
      value: "groggy",
      label: "Groggy",
      emoji: "🥱",
      color: theme.colors.error[400],
    },
  ];

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? "AM" : "PM";
    return {
      value: hour,
      label: `${displayHour}:00 ${period}`,
    };
  });

  const sleepTips = [
    {
      title: "Consistent Schedule",
      description:
        "Go to bed and wake up at the same time every day, even on weekends.",
      icon: "Brain",
      color: theme.colors.therapeutic.calming[500],
    },
    {
      title: "Wind Down Routine",
      description:
        "Create a relaxing pre-sleep routine 30-60 minutes before bed.",
      icon: "Mindfulness",
      color: theme.colors.therapeutic.peaceful[500],
    },
    {
      title: "Optimize Environment",
      description:
        "Keep your bedroom cool, dark, and quiet for better sleep quality.",
      icon: "Heart",
      color: theme.colors.therapeutic.nurturing[500],
    },
    {
      title: "Limit Screen Time",
      description:
        "Avoid screens 1 hour before bed to improve melatonin production.",
      icon: "Therapy",
      color: theme.colors.therapeutic.grounding[500],
    },
  ];

  const mockSleepHistory = [
    {
      date: new Date(Date.now() - 86400000),
      bedtime: 23,
      wakeTime: 7,
      quality: 4,
      mood: "refreshed",
      duration: 8,
    },
    {
      date: new Date(Date.now() - 172800000),
      bedtime: 24,
      wakeTime: 6,
      quality: 3,
      mood: "tired",
      duration: 6,
    },
    {
      date: new Date(Date.now() - 259200000),
      bedtime: 22,
      wakeTime: 7,
      quality: 5,
      mood: "energized",
      duration: 9,
    },
  ];

  useEffect(() => {
    setSleepHistory(mockSleepHistory);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
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

  const handleSaveSleepData = () => {
    if (
      !sleepData.bedtime ||
      !sleepData.wakeTime ||
      !sleepData.quality ||
      !sleepData.mood
    ) {
      Alert.alert(
        "Incomplete Data",
        "Please fill in all sleep information before saving.",
      );
      return;
    }

    const duration = calculateSleepDuration(
      sleepData.bedtime,
      sleepData.wakeTime,
    );

    const newEntry = {
      date: new Date(),
      bedtime: sleepData.bedtime,
      wakeTime: sleepData.wakeTime,
      quality: sleepData.quality,
      mood: sleepData.mood,
      duration,
    };

    setSleepHistory((prev) => [newEntry, ...prev]);
    setSleepData({
      bedtime: null,
      wakeTime: null,
      quality: null,
      mood: null,
    });

    Alert.alert(
      "Sleep Data Saved!",
      "Your sleep information has been recorded successfully.",
      [{ text: "OK" }],
    );
  };

  const calculateSleepDuration = (bedtime, wakeTime) => {
    let duration = wakeTime - bedtime;
    if (duration <= 0) {
      duration += 24; // Handle overnight sleep
    }
    return duration;
  };

  const getAverageSleepQuality = () => {
    if (sleepHistory.length === 0) return 0;
    const total = sleepHistory.reduce((sum, entry) => sum + entry.quality, 0);
    return (total / sleepHistory.length).toFixed(1);
  };

  const getAverageSleepDuration = () => {
    if (sleepHistory.length === 0) return 0;
    const total = sleepHistory.reduce((sum, entry) => sum + entry.duration, 0);
    return (total / sleepHistory.length).toFixed(1);
  };

  const formatTime = (hour) => {
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const period = hour < 12 ? "AM" : "PM";
    return `${displayHour}:00 ${period}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const renderLogTab = () => (
    <ScrollView
      style={styles.logContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Bedtime Selection */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          What time did you go to bed?
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeSelector}
        >
          {timeSlots
            .filter((slot) => slot.value >= 20 || slot.value <= 2)
            .map((slot) => (
              <TouchableOpacity
                key={`bedtime-${slot.value}`}
                style={[
                  styles.timeSlot,
                  {
                    backgroundColor:
                      sleepData.bedtime === slot.value
                        ? theme.colors.therapeutic.peaceful[500]
                        : theme.colors.background.secondary,
                  },
                ]}
                onPress={() =>
                  setSleepData((prev) => ({ ...prev, bedtime: slot.value }))
                }
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    {
                      color:
                        sleepData.bedtime === slot.value
                          ? theme.colors.text.inverse
                          : theme.colors.text.primary,
                    },
                  ]}
                >
                  {slot.label}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {/* Wake Time Selection */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          What time did you wake up?
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeSelector}
        >
          {timeSlots
            .filter((slot) => slot.value >= 5 && slot.value <= 11)
            .map((slot) => (
              <TouchableOpacity
                key={`wake-${slot.value}`}
                style={[
                  styles.timeSlot,
                  {
                    backgroundColor:
                      sleepData.wakeTime === slot.value
                        ? theme.colors.therapeutic.energizing[500]
                        : theme.colors.background.secondary,
                  },
                ]}
                onPress={() =>
                  setSleepData((prev) => ({ ...prev, wakeTime: slot.value }))
                }
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    {
                      color:
                        sleepData.wakeTime === slot.value
                          ? theme.colors.text.inverse
                          : theme.colors.text.primary,
                    },
                  ]}
                >
                  {slot.label}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {/* Sleep Quality */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          How was your sleep quality?
        </Text>
        <View style={styles.qualityOptions}>
          {sleepQualityOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.qualityOption,
                {
                  backgroundColor:
                    sleepData.quality === option.value
                      ? option.color
                      : theme.colors.background.secondary,
                },
              ]}
              onPress={() =>
                setSleepData((prev) => ({ ...prev, quality: option.value }))
              }
            >
              <Text style={styles.qualityEmoji}>{option.emoji}</Text>
              <Text
                style={[
                  styles.qualityLabel,
                  {
                    color:
                      sleepData.quality === option.value
                        ? theme.colors.text.inverse
                        : theme.colors.text.primary,
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Morning Mood */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          How do you feel this morning?
        </Text>
        <View style={styles.moodOptions}>
          {morningMoodOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.moodOption,
                {
                  backgroundColor:
                    sleepData.mood === option.value
                      ? option.color
                      : theme.colors.background.secondary,
                },
              ]}
              onPress={() =>
                setSleepData((prev) => ({ ...prev, mood: option.value }))
              }
            >
              <Text style={styles.moodEmoji}>{option.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  {
                    color:
                      sleepData.mood === option.value
                        ? theme.colors.text.inverse
                        : theme.colors.text.primary,
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: Object.values(sleepData).every(
              (val) => val !== null,
            )
              ? theme.colors.therapeutic.calming[500]
              : theme.colors.gray[300],
          },
        ]}
        onPress={handleSaveSleepData}
        disabled={!Object.values(sleepData).every((val) => val !== null)}
      >
        <MentalHealthIcon
          name="Brain"
          size={20}
          color={theme.colors.text.inverse}
          variant="filled"
        />
        <Text
          style={[styles.saveButtonText, { color: theme.colors.text.inverse }]}
        >
          Save Sleep Data
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderHistoryTab = () => (
    <ScrollView
      style={styles.historyContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Sleep Stats */}
      <View
        style={[
          styles.statsContainer,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Sleep Statistics
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text
              style={[
                styles.statValue,
                { color: theme.colors.therapeutic.calming[500] },
              ]}
            >
              {getAverageSleepQuality()}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Avg Quality
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text
              style={[
                styles.statValue,
                { color: theme.colors.therapeutic.nurturing[500] },
              ]}
            >
              {getAverageSleepDuration()}h
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Avg Duration
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text
              style={[
                styles.statValue,
                { color: theme.colors.therapeutic.peaceful[500] },
              ]}
            >
              {sleepHistory.length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Entries
            </Text>
          </View>
        </View>
      </View>

      {/* Sleep History */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Recent Sleep History
        </Text>

        {sleepHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <MentalHealthIcon
              name="Brain"
              size={48}
              color={theme.colors.gray[400]}
              variant="outline"
            />
            <Text
              style={[
                styles.emptyStateText,
                { color: theme.colors.text.secondary },
              ]}
            >
              No sleep data yet. Start logging your sleep to see patterns!
            </Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {sleepHistory.map((entry, index) => (
              <SleepHistoryCard key={index} entry={entry} theme={theme} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderTipsTab = () => (
    <ScrollView
      style={styles.tipsContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.tipsIntro, { color: theme.colors.text.primary }]}>
        Better sleep leads to better mental health. Here are some tips to
        improve your sleep quality:
      </Text>

      {sleepTips.map((tip, index) => (
        <TipCard key={index} tip={tip} theme={theme} delay={index * 100} />
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          theme.colors.therapeutic.peaceful[50],
          theme.colors.therapeutic.calming[50],
          theme.colors.therapeutic.nurturing[50],
        ]}
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
            Sleep Quality
          </Text>

          <View style={styles.placeholder} />
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          {[
            { id: "log", label: "Log Sleep" },
            { id: "history", label: "History" },
            { id: "tips", label: "Tips" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                {
                  backgroundColor:
                    selectedTab === tab.id
                      ? theme.colors.therapeutic.peaceful[500]
                      : theme.colors.background.secondary,
                },
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color:
                      selectedTab === tab.id
                        ? theme.colors.text.inverse
                        : theme.colors.text.primary,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {selectedTab === "log" && renderLogTab()}
          {selectedTab === "history" && renderHistoryTab()}
          {selectedTab === "tips" && renderTipsTab()}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const SleepHistoryCard = ({ entry, theme }) => (
  <View
    style={[
      styles.historyCard,
      { backgroundColor: theme.colors.background.secondary },
    ]}
  >
    <View style={styles.historyCardHeader}>
      <Text style={[styles.historyDate, { color: theme.colors.text.primary }]}>
        {formatDate(entry.date)}
      </Text>
      <View style={styles.historyMood}>
        <Text style={styles.historyMoodEmoji}>
          {morningMoodOptions.find((m) => m.value === entry.mood)?.emoji ||
            "😐"}
        </Text>
      </View>
    </View>

    <View style={styles.historyDetails}>
      <View style={styles.historyDetail}>
        <Text
          style={[
            styles.historyDetailLabel,
            { color: theme.colors.text.secondary },
          ]}
        >
          Bedtime
        </Text>
        <Text
          style={[
            styles.historyDetailValue,
            { color: theme.colors.text.primary },
          ]}
        >
          {formatTime(entry.bedtime)}
        </Text>
      </View>

      <View style={styles.historyDetail}>
        <Text
          style={[
            styles.historyDetailLabel,
            { color: theme.colors.text.secondary },
          ]}
        >
          Wake Time
        </Text>
        <Text
          style={[
            styles.historyDetailValue,
            { color: theme.colors.text.primary },
          ]}
        >
          {formatTime(entry.wakeTime)}
        </Text>
      </View>

      <View style={styles.historyDetail}>
        <Text
          style={[
            styles.historyDetailLabel,
            { color: theme.colors.text.secondary },
          ]}
        >
          Duration
        </Text>
        <Text
          style={[
            styles.historyDetailValue,
            { color: theme.colors.text.primary },
          ]}
        >
          {entry.duration}h
        </Text>
      </View>

      <View style={styles.historyDetail}>
        <Text
          style={[
            styles.historyDetailLabel,
            { color: theme.colors.text.secondary },
          ]}
        >
          Quality
        </Text>
        <Text
          style={[
            styles.historyDetailValue,
            { color: theme.colors.text.primary },
          ]}
        >
          {sleepQualityOptions.find((q) => q.value === entry.quality)?.emoji ||
            "😐"}{" "}
          {entry.quality}/5
        </Text>
      </View>
    </View>
  </View>
);

const TipCard = ({ tip, theme, delay }) => {
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
        styles.tipCard,
        {
          backgroundColor: theme.colors.background.primary,
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={[styles.tipIcon, { backgroundColor: tip.color }]}>
        <MentalHealthIcon
          name={tip.icon}
          size={24}
          color={theme.colors.text.inverse}
          variant="filled"
        />
      </View>

      <View style={styles.tipContent}>
        <Text style={[styles.tipTitle, { color: theme.colors.text.primary }]}>
          {tip.title}
        </Text>
        <Text
          style={[
            styles.tipDescription,
            { color: theme.colors.text.secondary },
          ]}
        >
          {tip.description}
        </Text>
      </View>
    </Animated.View>
  );
};

const formatTime = (hour) => {
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const period = hour < 12 ? "AM" : "PM";
  return `${displayHour}:00 ${period}`;
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const sleepQualityOptions = [
  { value: 1, label: "Very Poor", emoji: "😴" },
  { value: 2, label: "Poor", emoji: "😪" },
  { value: 3, label: "Fair", emoji: "😐" },
  { value: 4, label: "Good", emoji: "🙂" },
  { value: 5, label: "Excellent", emoji: "😊" },
];

const morningMoodOptions = [
  { value: "energized", label: "Energized", emoji: "⚡" },
  { value: "refreshed", label: "Refreshed", emoji: "🌅" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "tired", label: "Tired", emoji: "😴" },
  { value: "groggy", label: "Groggy", emoji: "🥱" },
];

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
  placeholder: {
    width: 44,
  },
  tabSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  logContainer: {
    flex: 1,
    paddingHorizontal: 20,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  timeSelector: {
    marginBottom: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    minWidth: 80,
    alignItems: "center",
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "500",
  },
  qualityOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  qualityOption: {
    width: (width - 80) / 3,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  qualityEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  qualityLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  moodOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  moodOption: {
    flex: 1,
    minWidth: (width - 80) / 3,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    borderRadius: 12,
    padding: 16,
  },
  historyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: "600",
  },
  historyMood: {
    padding: 4,
  },
  historyMoodEmoji: {
    fontSize: 20,
  },
  historyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyDetail: {
    alignItems: "center",
  },
  historyDetailLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 2,
  },
  historyDetailValue: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  tipsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tipsIntro: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  tipCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SleepQualityScreen;
