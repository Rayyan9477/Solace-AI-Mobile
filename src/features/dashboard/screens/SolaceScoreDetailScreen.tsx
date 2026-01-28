/**
 * SolaceScoreDetailScreen Component
 * @description Detailed view of Solace mental health score with history
 * @task Task 3.5.2: Solace Score Detail Screen (Screen 41)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

type ScoreStatus = "Normal" | "Elevated" | "Critical";

interface ScoreHistoryEntry {
  id: string;
  date: Date;
  mood: string;
  score: number;
  recommendation: string;
}

interface SolaceScoreDetailScreenProps {
  currentScore: number;
  currentStatus: ScoreStatus;
  statusLabel: string;
  scoreHistory: ScoreHistoryEntry[];
  onBack: () => void;
  onChartPress: () => void;
  onSeeAllHistory: () => void;
  onHistoryEntryPress: (id: string) => void;
}

const formatDate = (date: Date): string => {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}`;
};

const getStatusColor = (status: ScoreStatus): string => {
  switch (status) {
    case "Normal":
      return "#4CAF50";
    case "Elevated":
      return "#FFC107";
    case "Critical":
      return "#F44336";
    default:
      return "#4CAF50";
  }
};

const getScoreIndicatorColor = (score: number): string => {
  if (score >= 80) return "#4CAF50";
  if (score >= 50) return "#FFC107";
  return "#F44336";
};

export function SolaceScoreDetailScreen({
  currentScore,
  currentStatus,
  statusLabel,
  scoreHistory,
  onBack,
  onChartPress,
  onSeeAllHistory,
  onHistoryEntryPress,
}: SolaceScoreDetailScreenProps): React.ReactElement {
  return (
    <View testID="solace-score-detail-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Solace Score</Text>

        <TouchableOpacity
          testID="chart-button"
          style={styles.chartButton}
          onPress={onChartPress}
          accessibilityRole="button"
          accessibilityLabel="View chart"
        >
          <Text style={styles.chartIcon}>📊</Text>
        </TouchableOpacity>
      </View>

      {/* Score Section */}
      <View style={styles.scoreSection}>
        {/* Status Badge */}
        <View
          testID="status-badge"
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(currentStatus) },
          ]}
        >
          <Text style={styles.statusBadgeText}>{currentStatus}</Text>
        </View>

        {/* Large Score Display */}
        <View testID="large-score-display" style={styles.scoreDisplay}>
          <Text style={styles.scoreNumber}>{currentScore}</Text>
        </View>

        {/* Status Label */}
        <Text style={styles.statusLabel}>{statusLabel}</Text>
      </View>

      {/* Score History Section */}
      <View style={styles.historySection}>
        <View style={styles.historySectionHeader}>
          <Text style={styles.historySectionTitle}>Score History</Text>
          <TouchableOpacity
            testID="see-all-button"
            onPress={onSeeAllHistory}
            accessibilityRole="button"
            accessibilityLabel="See all history"
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.historyList}
          showsVerticalScrollIndicator={false}
        >
          {scoreHistory.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              testID={`history-entry-${entry.id}`}
              style={styles.historyEntry}
              onPress={() => onHistoryEntryPress(entry.id)}
              accessibilityRole="button"
              accessibilityLabel={`Score history from ${formatDate(entry.date)}`}
            >
              <View style={styles.historyEntryLeft}>
                <Text style={styles.historyDate}>{formatDate(entry.date)}</Text>
                <Text style={styles.historyMood}>{entry.mood}</Text>
                <Text style={styles.historyRecommendation}>
                  {entry.recommendation}
                </Text>
              </View>
              <View
                testID={`score-indicator-${entry.id}`}
                style={[
                  styles.scoreIndicator,
                  { backgroundColor: getScoreIndicatorColor(entry.score) },
                ]}
              >
                <Text style={styles.scoreIndicatorText}>{entry.score}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  chartButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 44,
  },
  chartIcon: {
    fontSize: 24,
  },
  container: {
    backgroundColor: "#2E7D32",
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  historyDate: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  historyEntry: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 16,
  },
  historyEntryLeft: {
    flex: 1,
  },
  historyList: {
    flex: 1,
  },
  historyMood: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  historyRecommendation: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  historySection: {
    backgroundColor: "#1C1410",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flex: 1,
    marginTop: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  historySectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  historySectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  scoreDisplay: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 80,
    height: 160,
    justifyContent: "center",
    marginBottom: 16,
    width: 160,
  },
  scoreIndicator: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  scoreIndicatorText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  scoreNumber: {
    color: "#FFFFFF",
    fontSize: 64,
    fontWeight: "700",
  },
  scoreSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  seeAllText: {
    color: "#C4A574",
    fontSize: 14,
    fontWeight: "500",
  },
  statusBadge: {
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  statusLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
});

export default SolaceScoreDetailScreen;
