/**
 * MonthlyHealthReportScreen Component
 * @description Monthly mental health report summary screen
 * @task Task 3.7.12: Monthly Health Report Screen (Screen 64)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { palette } from "../../../shared/theme";

interface MoodTrendData {
  week: string;
  score: number;
}

interface Metrics {
  overallScore: number;
  previousScore: number;
  moodAverage: number;
  sleepQuality: number;
  activityDays: number;
  journalEntries: number;
  chatSessions: number;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type: "positive" | "neutral" | "negative";
}

interface MonthlyHealthReportScreenProps {
  month: string;
  year: number;
  metrics: Metrics;
  moodTrendData: MoodTrendData[];
  insights: Insight[];
  onBack: () => void;
  onShare: () => void;
  onDownload: () => void;
  onViewDetails: () => void;
}

export function MonthlyHealthReportScreen({
  month,
  year,
  metrics,
  moodTrendData,
  insights,
  onBack,
  onShare,
  onDownload,
  onViewDetails,
}: MonthlyHealthReportScreenProps): React.ReactElement {
  const scoreChange = metrics.overallScore - metrics.previousScore;
  const isPositiveChange = scoreChange >= 0;

  const getInsightIcon = (type: string): string => {
    switch (type) {
      case "positive":
        return "✨";
      case "negative":
        return "⚠️";
      default:
        return "💡";
    }
  };

  return (
    <View testID="monthly-health-report-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Monthly Report</Text>
        <TouchableOpacity
          testID="share-button"
          style={styles.shareButton}
          onPress={onShare}
          accessibilityRole="button"
          accessibilityLabel="Share report"
        >
          <Text style={styles.shareIcon}>📤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Title */}
        <Text style={styles.monthTitle}>
          {month} {year}
        </Text>
        <Text style={styles.reportSubtitle}>Your Solace Health Summary</Text>

        {/* Overall Score Section */}
        <View testID="overall-score-section" style={styles.scoreSection}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{metrics.overallScore}</Text>
            <Text style={styles.scoreLabel}>Overall</Text>
          </View>
          <View testID="score-change" style={styles.scoreChangeContainer}>
            <Text
              style={[
                styles.scoreChangeText,
                isPositiveChange
                  ? styles.positiveChange
                  : styles.negativeChange,
              ]}
            >
              {isPositiveChange ? "↑" : "↓"} {Math.abs(scoreChange)} points
            </Text>
            <Text style={styles.scoreChangeLabel}>vs last month</Text>
          </View>
        </View>

        {/* Mood Trend Chart */}
        <View testID="mood-trend-chart" style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Mood Trend</Text>
          <View style={styles.chartArea}>
            {moodTrendData.map((data, index) => (
              <View key={index} style={styles.chartBarContainer}>
                <View
                  style={[
                    styles.chartBar,
                    { height: `${data.score}%` },
                  ]}
                />
                <Text style={styles.chartLabel}>{data.week}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Metrics Grid */}
        <View testID="metrics-grid" style={styles.metricsGrid}>
          <View testID="metric-mood" style={styles.metricCard}>
            <Text style={styles.metricIcon}>😊</Text>
            <Text style={styles.metricValue}>{metrics.moodAverage}</Text>
            <Text style={styles.metricLabel}>Avg Mood</Text>
          </View>

          <View testID="metric-sleep" style={styles.metricCard}>
            <Text style={styles.metricIcon}>😴</Text>
            <Text style={styles.metricValue}>{metrics.sleepQuality}%</Text>
            <Text style={styles.metricLabel}>Sleep Quality</Text>
          </View>

          <View testID="metric-activity" style={styles.metricCard}>
            <Text style={styles.metricIcon}>🏃</Text>
            <Text style={styles.metricValue}>{metrics.activityDays}</Text>
            <Text style={styles.metricLabel}>Active Days</Text>
          </View>

          <View testID="metric-journal" style={styles.metricCard}>
            <Text style={styles.metricIcon}>📝</Text>
            <Text style={styles.metricValue}>{metrics.journalEntries}</Text>
            <Text style={styles.metricLabel}>Journal Entries</Text>
          </View>
        </View>

        {/* Insights Section */}
        <View testID="insights-section" style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          {insights.map((insight) => (
            <View
              key={insight.id}
              testID={`insight-card-${insight.id}`}
              style={styles.insightCard}
            >
              <View style={styles.insightIconContainer}>
                <Text style={styles.insightIcon}>
                  {getInsightIcon(insight.type)}
                </Text>
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>
                  {insight.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          testID="download-button"
          style={styles.downloadButton}
          onPress={onDownload}
          accessibilityRole="button"
          accessibilityLabel="Download report"
        >
          <Text style={styles.downloadIcon}>📥</Text>
          <Text style={styles.downloadText}>Download</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="view-details-button"
          style={styles.viewDetailsButton}
          onPress={onViewDetails}
          accessibilityRole="button"
          accessibilityLabel="View detailed report"
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    backgroundColor: palette.brown[900],
    flexDirection: "row",
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backButton: {
    alignItems: "center",
    borderColor: palette.brown[700],
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "600",
  },
  chartArea: {
    alignItems: "flex-end",
    flexDirection: "row",
    height: 120,
    justifyContent: "space-around",
    paddingTop: 16,
  },
  chartBar: {
    backgroundColor: palette.olive[500],
    borderRadius: 4,
    width: 40,
  },
  chartBarContainer: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  chartContainer: {
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
  },
  chartLabel: {
    color: palette.gray[400],
    fontSize: 10,
    marginTop: 8,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
    paddingTop: 60,
  },
  downloadButton: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    marginRight: 12,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  downloadIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  downloadText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "500",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  insightCard: {
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: 12,
    padding: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightDescription: {
    color: palette.gray[400],
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  insightIcon: {
    fontSize: 20,
  },
  insightIconContainer: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    marginRight: 12,
    width: 40,
  },
  insightTitle: {
    color: palette.white,
    fontSize: 15,
    fontWeight: "600",
  },
  insightsSection: {
    marginBottom: 16,
  },
  metricCard: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 12,
    padding: 16,
    width: "48%",
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  metricLabel: {
    color: palette.gray[400],
    fontSize: 12,
    marginTop: 4,
  },
  metricValue: {
    color: palette.white,
    fontSize: 24,
    fontWeight: "700",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
    rowGap: 12,
  },
  monthTitle: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  negativeChange: {
    color: palette.onboarding.step2,
  },
  positiveChange: {
    color: palette.olive[500],
  },
  reportSubtitle: {
    color: palette.gray[400],
    fontSize: 14,
    marginBottom: 24,
  },
  scoreChangeContainer: {
    marginLeft: 20,
  },
  scoreChangeLabel: {
    color: palette.gray[400],
    fontSize: 12,
    marginTop: 2,
  },
  scoreChangeText: {
    fontSize: 16,
    fontWeight: "600",
  },
  scoreCircle: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 50,
    height: 100,
    justifyContent: "center",
    width: 100,
  },
  scoreLabel: {
    color: palette.white,
    fontSize: 12,
    opacity: 0.8,
  },
  scoreSection: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 16,
    padding: 20,
  },
  scoreValue: {
    color: palette.white,
    fontSize: 36,
    fontWeight: "700",
  },
  scrollContent: {
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  shareButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  shareIcon: {
    fontSize: 20,
  },
  viewDetailsButton: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 12,
  },
  viewDetailsText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default MonthlyHealthReportScreen;
