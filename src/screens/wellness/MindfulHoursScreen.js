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
import { useTheme } from "../../contexts/ThemeContext";

const { width } = Dimensions.get("window");

const MindfulHoursScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("sessions");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [completedSessions, setCompletedSessions] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const sessionInterval = useRef(null);

  const mindfulnessSessions = [
    {
      id: "breathing",
      title: "Mindful Breathing",
      description: "Focus on your breath to center yourself",
      duration: "5-20 min",
      difficulty: "Beginner",
      icon: "Mindfulness",
      color: theme.colors.therapeutic.calming[500],
      instructions: [
        "Find a comfortable seated position",
        "Close your eyes or soften your gaze",
        "Notice your natural breathing rhythm",
        "Focus on the sensation of breath",
        "When your mind wanders, gently return to your breath",
      ],
    },
    {
      id: "body-scan",
      title: "Body Scan Meditation",
      description: "Systematic relaxation of your entire body",
      duration: "10-30 min",
      difficulty: "Intermediate",
      icon: "Therapy",
      color: theme.colors.therapeutic.nurturing[500],
      instructions: [
        "Lie down in a comfortable position",
        "Start by noticing your toes",
        "Slowly move attention up through your body",
        "Notice any tension or sensation",
        "Breathe into each part of your body",
      ],
    },
    {
      id: "loving-kindness",
      title: "Loving-Kindness Meditation",
      description: "Cultivate compassion for yourself and others",
      duration: "10-15 min",
      difficulty: "Intermediate",
      icon: "Heart",
      color: theme.colors.therapeutic.peaceful[500],
      instructions: [
        "Sit comfortably with eyes closed",
        "Start by sending love to yourself",
        "Extend loving thoughts to loved ones",
        "Include neutral people in your thoughts",
        "Finally, include difficult people",
      ],
    },
    {
      id: "walking",
      title: "Walking Meditation",
      description: "Mindful movement and awareness",
      duration: "10-20 min",
      difficulty: "Beginner",
      icon: "Brain",
      color: theme.colors.therapeutic.grounding[500],
      instructions: [
        "Find a quiet path or space",
        "Walk slowly and deliberately",
        "Focus on the sensation of your feet",
        "Notice your surroundings mindfully",
        "Return to the present when distracted",
      ],
    },
  ];

  const durationOptions = [3, 5, 10, 15, 20, 30];

  const mockCompletedSessions = [
    {
      id: "1",
      type: "Mindful Breathing",
      duration: 10,
      date: new Date(Date.now() - 86400000),
      mood: "peaceful",
    },
    {
      id: "2",
      type: "Body Scan",
      duration: 15,
      date: new Date(Date.now() - 172800000),
      mood: "relaxed",
    },
    {
      id: "3",
      type: "Loving-Kindness",
      duration: 12,
      date: new Date(Date.now() - 259200000),
      mood: "grateful",
    },
  ];

  useEffect(() => {
    setCompletedSessions(mockCompletedSessions);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Breathing animation for active sessions
    const breathingLoop = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1.2,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    if (isSessionActive) {
      breathingLoop();
    }

    return () => {
      if (sessionInterval.current) {
        clearInterval(sessionInterval.current);
      }
    };
  }, [isSessionActive]);

  const startSession = (sessionType = "Mindful Breathing") => {
    setIsSessionActive(true);
    setSessionTime(0);

    sessionInterval.current = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);

    Alert.alert(
      "Session Started",
      `Starting ${sessionType} for ${selectedDuration} minutes. Find a comfortable position and follow the guidance.`,
      [{ text: "Begin" }],
    );
  };

  const endSession = () => {
    if (sessionInterval.current) {
      clearInterval(sessionInterval.current);
    }

    setIsSessionActive(false);

    const completedSession = {
      id: Date.now().toString(),
      type: "Mindful Breathing",
      duration: Math.round(sessionTime / 60),
      date: new Date(),
      mood: "peaceful",
    };

    setCompletedSessions((prev) => [completedSession, ...prev]);
    setSessionTime(0);

    Alert.alert(
      "Session Complete",
      `Great job! You completed ${Math.round(sessionTime / 60)} minutes of mindfulness practice.`,
      [{ text: "Finish" }],
    );
  };

  const pauseSession = () => {
    if (sessionInterval.current) {
      clearInterval(sessionInterval.current);
      sessionInterval.current = null;
    }
  };

  const resumeSession = () => {
    sessionInterval.current = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getTotalMinutes = () => {
    return completedSessions.reduce(
      (total, session) => total + session.duration,
      0,
    );
  };

  const getWeeklyStreak = () => {
    // Simple streak calculation
    return Math.min(completedSessions.length, 7);
  };

  const renderSessionsTab = () => (
    <ScrollView
      style={styles.sessionsContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Active Session */}
      {isSessionActive ? (
        <View
          style={[
            styles.activeSessionCard,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <Text
            style={[
              styles.activeSessionTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            Mindful Breathing Session
          </Text>

          <Animated.View
            style={[
              styles.breathingCircle,
              {
                backgroundColor: theme.colors.therapeutic.calming[200],
                transform: [{ scale: breatheAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.breathingInner,
                { backgroundColor: theme.colors.therapeutic.calming[500] },
              ]}
            >
              <MentalHealthIcon
                name="Mindfulness"
                size={32}
                color={theme.colors.text.inverse}
                variant="filled"
              />
            </View>
          </Animated.View>

          <Text
            style={[styles.sessionTimer, { color: theme.colors.text.primary }]}
          >
            {formatTime(sessionTime)}
          </Text>

          <Text
            style={[
              styles.breathingGuide,
              { color: theme.colors.text.secondary },
            ]}
          >
            Breathe in slowly... hold... breathe out slowly
          </Text>

          <View style={styles.sessionControls}>
            <TouchableOpacity
              style={[
                styles.controlButton,
                { backgroundColor: theme.colors.warning[500] },
              ]}
              onPress={sessionInterval.current ? pauseSession : resumeSession}
            >
              <Text
                style={[
                  styles.controlButtonText,
                  { color: theme.colors.text.inverse },
                ]}
              >
                {sessionInterval.current ? "Pause" : "Resume"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.controlButton,
                { backgroundColor: theme.colors.error[500] },
              ]}
              onPress={endSession}
            >
              <Text
                style={[
                  styles.controlButtonText,
                  { color: theme.colors.text.inverse },
                ]}
              >
                End Session
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {/* Duration Selection */}
          <View
            style={[
              styles.durationCard,
              { backgroundColor: theme.colors.background.primary },
            ]}
          >
            <Text
              style={[
                styles.durationTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Choose Session Duration
            </Text>

            <View style={styles.durationOptions}>
              {durationOptions.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationButton,
                    {
                      backgroundColor:
                        selectedDuration === duration
                          ? theme.colors.therapeutic.calming[500]
                          : theme.colors.background.secondary,
                    },
                  ]}
                  onPress={() => setSelectedDuration(duration)}
                >
                  <Text
                    style={[
                      styles.durationText,
                      {
                        color:
                          selectedDuration === duration
                            ? theme.colors.text.inverse
                            : theme.colors.text.primary,
                      },
                    ]}
                  >
                    {duration}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Session Types */}
          <View
            style={[
              styles.sessionTypesCard,
              { backgroundColor: theme.colors.background.primary },
            ]}
          >
            <Text
              style={[
                styles.sessionTypesTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Mindfulness Sessions
            </Text>

            {mindfulnessSessions.map((session, index) => (
              <SessionTypeCard
                key={session.id}
                session={session}
                theme={theme}
                onPress={() => startSession(session.title)}
                delay={index * 100}
              />
            ))}
          </View>

          {/* Quick Start */}
          <TouchableOpacity
            style={[
              styles.quickStartButton,
              { backgroundColor: theme.colors.therapeutic.calming[500] },
            ]}
            onPress={() => startSession()}
          >
            <MentalHealthIcon
              name="Mindfulness"
              size={24}
              color={theme.colors.text.inverse}
              variant="filled"
            />
            <Text
              style={[
                styles.quickStartText,
                { color: theme.colors.text.inverse },
              ]}
            >
              Start {selectedDuration} Min Session
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );

  const renderHistoryTab = () => (
    <ScrollView
      style={styles.historyContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Stats */}
      <View
        style={[
          styles.statsCard,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text style={[styles.statsTitle, { color: theme.colors.text.primary }]}>
          Your Mindfulness Journey
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                { color: theme.colors.therapeutic.calming[500] },
              ]}
            >
              {getTotalMinutes()}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Total Minutes
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                { color: theme.colors.therapeutic.nurturing[500] },
              ]}
            >
              {completedSessions.length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Sessions
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                { color: theme.colors.therapeutic.peaceful[500] },
              ]}
            >
              {getWeeklyStreak()}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Day Streak
            </Text>
          </View>
        </View>
      </View>

      {/* Recent Sessions */}
      <View
        style={[
          styles.recentSessionsCard,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[
            styles.recentSessionsTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          Recent Sessions
        </Text>

        {completedSessions.length === 0 ? (
          <View style={styles.emptyState}>
            <MentalHealthIcon
              name="Mindfulness"
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
              No sessions yet. Start your mindfulness journey today!
            </Text>
          </View>
        ) : (
          <View style={styles.sessionsList}>
            {completedSessions.map((session, index) => (
              <SessionHistoryCard
                key={session.id}
                session={session}
                theme={theme}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderGuidedTab = () => (
    <ScrollView
      style={styles.guidedContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.guidedIntro, { color: theme.colors.text.primary }]}>
        Guided mindfulness sessions to help you develop a consistent practice
        and deepen your awareness.
      </Text>

      {mindfulnessSessions.map((session, index) => (
        <GuidedSessionCard
          key={session.id}
          session={session}
          theme={theme}
          onPress={() => navigation.navigate("GuidedSession", { session })}
          delay={index * 100}
        />
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
            Mindful Hours
          </Text>

          <View style={styles.placeholder} />
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          {[
            { id: "sessions", label: "Sessions" },
            { id: "history", label: "History" },
            { id: "guided", label: "Guided" },
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
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {selectedTab === "sessions" && renderSessionsTab()}
          {selectedTab === "history" && renderHistoryTab()}
          {selectedTab === "guided" && renderGuidedTab()}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const SessionTypeCard = ({ session, theme, onPress, delay }) => {
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
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[
          styles.sessionTypeCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
        onPress={onPress}
      >
        <View style={[styles.sessionIcon, { backgroundColor: session.color }]}>
          <MentalHealthIcon
            name={session.icon}
            size={24}
            color={theme.colors.text.inverse}
            variant="filled"
          />
        </View>

        <View style={styles.sessionInfo}>
          <Text
            style={[styles.sessionTitle, { color: theme.colors.text.primary }]}
          >
            {session.title}
          </Text>
          <Text
            style={[
              styles.sessionDescription,
              { color: theme.colors.text.secondary },
            ]}
          >
            {session.description}
          </Text>
          <View style={styles.sessionMeta}>
            <Text style={[styles.sessionDuration, { color: session.color }]}>
              {session.duration}
            </Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: theme.colors.gray[100] },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {session.difficulty}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const SessionHistoryCard = ({ session, theme }) => (
  <View
    style={[
      styles.historyCard,
      { backgroundColor: theme.colors.background.secondary },
    ]}
  >
    <View style={styles.historyCardHeader}>
      <Text style={[styles.historyDate, { color: theme.colors.text.primary }]}>
        {formatDate(session.date)}
      </Text>
      <Text
        style={[
          styles.historyDuration,
          { color: theme.colors.therapeutic.calming[500] },
        ]}
      >
        {session.duration} min
      </Text>
    </View>

    <Text style={[styles.historyType, { color: theme.colors.text.secondary }]}>
      {session.type}
    </Text>

    <View
      style={[
        styles.moodBadge,
        { backgroundColor: theme.colors.therapeutic.nurturing[100] },
      ]}
    >
      <Text
        style={[
          styles.moodText,
          { color: theme.colors.therapeutic.nurturing[700] },
        ]}
      >
        Felt {session.mood}
      </Text>
    </View>
  </View>
);

const GuidedSessionCard = ({ session, theme, onPress, delay }) => {
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
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[
          styles.guidedCard,
          { backgroundColor: theme.colors.background.primary },
        ]}
        onPress={onPress}
      >
        <View style={[styles.guidedIcon, { backgroundColor: session.color }]}>
          <MentalHealthIcon
            name={session.icon}
            size={28}
            color={theme.colors.text.inverse}
            variant="filled"
          />
        </View>

        <View style={styles.guidedContent}>
          <Text
            style={[styles.guidedTitle, { color: theme.colors.text.primary }]}
          >
            {session.title}
          </Text>
          <Text
            style={[
              styles.guidedDescription,
              { color: theme.colors.text.secondary },
            ]}
          >
            {session.description}
          </Text>

          <View style={styles.guidedInstructions}>
            {session.instructions.slice(0, 3).map((instruction, index) => (
              <Text
                key={index}
                style={[
                  styles.instructionText,
                  { color: theme.colors.text.tertiary },
                ]}
              >
                • {instruction}
              </Text>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
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
  sessionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  activeSessionCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeSessionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  breathingInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sessionTimer: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  breathingGuide: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    fontStyle: "italic",
  },
  sessionControls: {
    flexDirection: "row",
    gap: 12,
  },
  controlButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  durationCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  durationTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  durationOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  durationButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  durationText: {
    fontSize: 16,
    fontWeight: "600",
  },
  sessionTypesCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionTypesTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  sessionTypeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  sessionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  sessionMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sessionDuration: {
    fontSize: 12,
    fontWeight: "600",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "500",
  },
  quickStartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  quickStartText: {
    fontSize: 16,
    fontWeight: "600",
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
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
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
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
  recentSessionsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentSessionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
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
  sessionsList: {
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
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: "600",
  },
  historyDuration: {
    fontSize: 14,
    fontWeight: "600",
  },
  historyType: {
    fontSize: 12,
    marginBottom: 8,
  },
  moodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  moodText: {
    fontSize: 10,
    fontWeight: "500",
  },
  guidedContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  guidedIntro: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  guidedCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guidedIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  guidedContent: {
    flex: 1,
  },
  guidedTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  guidedDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  guidedInstructions: {
    gap: 4,
  },
  instructionText: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default MindfulHoursScreen;
