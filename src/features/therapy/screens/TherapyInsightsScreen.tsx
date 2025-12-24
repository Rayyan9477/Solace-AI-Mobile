/**
 * TherapyInsightsScreen - Progress and insights dashboard
 * Displays therapy statistics, achievements, and progress
 */

import {
  loadTherapyHistory,
  selectTherapyInsights,
  selectSessionHistory,
} from "@app/store/slices/therapySlice";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

/**
 * TherapyInsightsScreen Component
 * Shows therapy progress and insights
 */
const TherapyInsightsScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const insights = useSelector(selectTherapyInsights);
  const sessionHistory = useSelector(selectSessionHistory);

  useEffect(() => {
    dispatch(loadTherapyHistory());
  }, [dispatch]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentSessions = sessionHistory.filter(
      (session: any) => new Date(session.startTime) > oneWeekAgo,
    );

    return {
      count: recentSessions.length,
      totalDuration: recentSessions.reduce(
        (sum: number, session: any) => sum + (session.duration || 0),
        0,
      ),
    };
  };

  const weeklyStats = getWeeklyStats();

  const achievements = [
    {
      id: "1",
      title: "First Session",
      description: "Started your therapy journey",
      unlocked: insights.totalSessions > 0,
      icon: "🌟",
    },
    {
      id: "2",
      title: "Consistent Week",
      description: "Completed 3+ sessions in a week",
      unlocked: weeklyStats.count >= 3,
      icon: "🔥",
    },
    {
      id: "3",
      title: "Mindful Hour",
      description: "Spent 1 hour in therapy",
      unlocked: insights.totalDuration >= 3600,
      icon: "⏰",
    },
    {
      id: "4",
      title: "Exercise Master",
      description: "Completed 5+ exercises",
      unlocked: false,
      icon: "💪",
    },
    {
      id: "5",
      title: "Marathon Session",
      description: "Had a 30+ minute session",
      unlocked: insights.averageSessionLength >= 1800,
      icon: "🏃",
    },
    {
      id: "6",
      title: "Dedicated",
      description: "Completed 10+ sessions",
      unlocked: insights.totalSessions >= 10,
      icon: "🎯",
    },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background?.primary || "#F7FAFC" },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.brown?.[70] || "#704A33" },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.backButtonText,
              { color: theme.colors.background?.primary || "#FFF" },
            ]}
          >
            ← Back
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.background?.primary || "#FFF" },
          ]}
        >
          Therapy Insights
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Stats */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.colors.background?.secondary || "#FFF",
              borderColor: theme.colors.border?.light || "#E2E8F0",
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text?.primary || "#2D3748" },
            ]}
          >
            Overall Progress
          </Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text
                style={[
                  styles.statValue,
                  { color: theme.colors.brown?.[70] || "#704A33" },
                ]}
              >
                {insights.totalSessions}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.text?.secondary || "#718096" },
                ]}
              >
                Total Sessions
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text
                style={[
                  styles.statValue,
                  { color: theme.colors.brown?.[70] || "#704A33" },
                ]}
              >
                {formatDuration(insights.totalDuration)}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.text?.secondary || "#718096" },
                ]}
              >
                Total Time
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text
                style={[
                  styles.statValue,
                  { color: theme.colors.brown?.[70] || "#704A33" },
                ]}
              >
                {formatDuration(insights.averageSessionLength)}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.text?.secondary || "#718096" },
                ]}
              >
                Avg Session
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text
                style={[
                  styles.statValue,
                  { color: theme.colors.brown?.[70] || "#704A33" },
                ]}
              >
                {weeklyStats.count}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.text?.secondary || "#718096" },
                ]}
              >
                This Week
              </Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.colors.background?.secondary || "#FFF",
              borderColor: theme.colors.border?.light || "#E2E8F0",
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text?.primary || "#2D3748" },
            ]}
          >
            Achievements
          </Text>

          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  { backgroundColor: theme.colors.brown?.[10] || "#FAF8F7" },
                  !achievement.unlocked && { opacity: 0.5 },
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text
                  style={[
                    styles.achievementTitle,
                    { color: theme.colors.text?.primary || "#2D3748" },
                  ]}
                >
                  {achievement.title}
                </Text>
                <Text
                  style={[
                    styles.achievementDescription,
                    { color: theme.colors.text?.tertiary || "#A0AEC0" },
                  ]}
                >
                  {achievement.description}
                </Text>
                {achievement.unlocked && (
                  <View
                    style={[
                      styles.unlockedBadge,
                      {
                        backgroundColor: theme.colors.green?.[50] || "#68B684",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.unlockedText,
                        { color: theme.colors.background?.primary || "#FFF" },
                      ]}
                    >
                      ✓ Unlocked
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Progress Notes */}
        {insights.progressNotes && insights.progressNotes.length > 0 && (
          <View
            style={[
              styles.section,
              {
                backgroundColor: theme.colors.background?.secondary || "#FFF",
                borderColor: theme.colors.border?.light || "#E2E8F0",
              },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.text?.primary || "#2D3748" },
              ]}
            >
              Recent Progress Notes
            </Text>

            {/* LOW-NEW-002 FIX: Use note timestamp as stable key instead of index */}
            {insights.progressNotes
              .slice(0, 5)
              .map((note: any) => (
                <View
                  key={`note-${note.timestamp}`}
                  style={[
                    styles.noteCard,
                    { borderColor: theme.colors.border?.light || "#E2E8F0" },
                  ]}
                >
                  <Text
                    style={[
                      styles.noteDate,
                      { color: theme.colors.text?.tertiary || "#A0AEC0" },
                    ]}
                  >
                    {new Date(note.timestamp).toLocaleDateString()}
                  </Text>
                  <Text
                    style={[
                      styles.noteText,
                      { color: theme.colors.text?.primary || "#2D3748" },
                    ]}
                  >
                    {note.content || "Progress note"}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={[
              styles.ctaButton,
              { backgroundColor: theme.colors.brown?.[70] || "#704A33" },
            ]}
            onPress={() => navigation.navigate("TherapySession")}
            accessible
            accessibilityLabel="Start new therapy session"
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.ctaButtonText,
                { color: theme.colors.background?.primary || "#FFF" },
              ]}
            >
              Continue Your Journey
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              { borderColor: theme.colors.brown?.[70] || "#704A33" },
            ]}
            onPress={() => navigation.navigate("TherapyHistory")}
            accessible
            accessibilityLabel="View therapy history"
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.secondaryButtonText,
                { color: theme.colors.brown?.[70] || "#704A33" },
              ]}
            >
              View Session History
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 20,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    padding: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  achievementCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  achievementIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  achievementDescription: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 8,
  },
  unlockedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  unlockedText: {
    fontSize: 11,
    fontWeight: "600",
  },
  noteCard: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
  },
  noteDate: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 6,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ctaSection: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 20,
  },
  ctaButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});

// LOW-NEW-001 FIX: Add displayName for debugging
TherapyInsightsScreen.displayName = 'TherapyInsightsScreen';

export default TherapyInsightsScreen;
