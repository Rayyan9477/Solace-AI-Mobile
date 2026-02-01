/**
 * MindfulHoursDashboardScreen Component
 * @description Main mindful hours dashboard with total hours display, FAB button,
 *   session history list with progress bars and soundscape badges
 * @task Task 3.12.1: Mindful Hours Dashboard Screen (Screen 104)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface MindfulSession {
  id: string;
  title: string;
  soundscape: string;
  soundscapeColor: string;
  elapsedTime: string;
  totalTime: string;
  progress: number;
}

interface MindfulHoursDashboardScreenProps {
  totalHours: string;
  sessions: MindfulSession[];
  onBack: () => void;
  onAddSession: () => void;
  onMoreOptions: () => void;
  onSessionPress: (id: string) => void;
}

const colors = {
  background: "#1C1410",
  heroBg: "#3D3530",
  white: "#FFFFFF",
  cardBg: "#2A1F18",
  textSecondary: "rgba(255,255,255,0.6)",
  fabBg: "#5C4A2A",
  progressBg: "#3D2E23",
  progressFill: "#9AAD5C",
  playBg: "#5C4A2A",
} as const;

export function MindfulHoursDashboardScreen({
  totalHours,
  sessions,
  onBack,
  onAddSession,
  onMoreOptions,
  onSessionPress,
}: MindfulHoursDashboardScreenProps): React.ReactElement {
  return (
    <View testID="mindful-hours-dashboard-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>{"\u263E"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Mindful Hours</Text>
      </View>

      {/* Hero Section */}
      <View testID="hero-section" style={styles.heroSection}>
        {/* Decorative shapes */}
        <View style={styles.decoShape1} />
        <View style={styles.decoShape2} />
        <View style={styles.decoShape3} />

        <Text testID="total-hours-display" style={styles.totalHours}>
          {totalHours}
        </Text>
        <Text testID="hours-label" style={styles.hoursLabel}>
          Mindful Hours
        </Text>
      </View>

      {/* FAB Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          testID="add-session-button"
          style={styles.fabButton}
          onPress={onAddSession}
          accessibilityRole="button"
          accessibilityLabel="Add new session"
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* History Section */}
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Mindful Hour History</Text>
        <TouchableOpacity
          testID="more-options-button"
          style={styles.moreButton}
          onPress={onMoreOptions}
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <Text style={styles.moreIcon}>{"\u2026"}</Text>
        </TouchableOpacity>
      </View>

      {/* Session List */}
      <ScrollView
        style={styles.sessionList}
        contentContainerStyle={styles.sessionListContent}
        showsVerticalScrollIndicator={false}
      >
        {sessions.map((session) => (
          <TouchableOpacity
            key={session.id}
            testID={`session-card-${session.id}`}
            style={styles.sessionCard}
            onPress={() => onSessionPress(session.id)}
            accessibilityRole="button"
            accessibilityLabel={`${session.title} - ${session.soundscape}`}
          >
            <View style={styles.sessionTop}>
              <TouchableOpacity
                testID={`play-button-${session.id}`}
                style={styles.playButton}
                accessibilityRole="button"
                accessibilityLabel={`Play ${session.title}`}
              >
                <Text style={styles.playIcon}>{"\u25B6"}</Text>
              </TouchableOpacity>
              <Text style={styles.sessionTitle}>{session.title}</Text>
              <View
                style={[
                  styles.soundBadge,
                  { backgroundColor: session.soundscapeColor },
                ]}
              >
                <Text style={styles.soundBadgeText}>{session.soundscape}</Text>
              </View>
            </View>
            <View
              testID={`progress-bar-${session.id}`}
              style={styles.progressBar}
            >
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(session.progress * 100, 100)}%` },
                ]}
              />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{session.elapsedTime}</Text>
              <Text style={styles.timeText}>{session.totalTime}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  backIcon: {
    color: colors.white,
    fontSize: 24,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  decoShape1: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    height: 80,
    left: "5%",
    position: "absolute",
    top: "15%",
    transform: [{ rotate: "15deg" }],
    width: 60,
  },
  decoShape2: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 40,
    height: 80,
    position: "absolute",
    right: "15%",
    top: "10%",
    width: 80,
  },
  decoShape3: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    height: 40,
    left: "40%",
    position: "absolute",
    top: "60%",
    width: 40,
  },
  fabButton: {
    alignItems: "center",
    backgroundColor: colors.fabBg,
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 56,
  },
  fabContainer: {
    alignItems: "center",
    marginTop: -28,
    zIndex: 10,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "300",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  heroSection: {
    alignItems: "center",
    backgroundColor: colors.heroBg,
    justifyContent: "center",
    marginHorizontal: 0,
    marginTop: 16,
    overflow: "hidden",
    paddingVertical: 40,
  },
  historyHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  historyTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  hoursLabel: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
  },
  moreButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
  },
  moreIcon: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: "700",
  },
  playButton: {
    alignItems: "center",
    backgroundColor: colors.playBg,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  playIcon: {
    color: colors.white,
    fontSize: 12,
    marginLeft: 2,
  },
  progressBar: {
    backgroundColor: colors.progressBg,
    borderRadius: 4,
    height: 6,
    marginTop: 12,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    backgroundColor: colors.progressFill,
    borderRadius: 4,
    height: "100%",
  },
  sessionCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
  },
  sessionList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sessionListContent: {
    paddingBottom: 48,
    paddingTop: 12,
  },
  sessionTitle: {
    color: colors.white,
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 12,
  },
  sessionTop: {
    alignItems: "center",
    flexDirection: "row",
  },
  soundBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  soundBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "600",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  totalHours: {
    color: colors.white,
    fontSize: 64,
    fontWeight: "800",
  },
});

export default MindfulHoursDashboardScreen;
