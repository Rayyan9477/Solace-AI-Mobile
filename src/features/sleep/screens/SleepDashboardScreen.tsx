/**
 * SleepDashboardScreen Component
 * @description Main sleep tracking dashboard with score hero, quality status, and overview metrics
 * @task Task 3.10.1: Sleep Dashboard Screen (Screen 87)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

type SleepQuality = "Excellent" | "Good" | "Fair" | "Poor" | "Insomniac";

interface SleepDashboardScreenProps {
  sleepScore: number;
  sleepQuality: SleepQuality;
  remHours: number;
  coreHours: number;
  remProgress: number;
  coreProgress: number;
  onBack: () => void;
  onSeeAll: () => void;
  onAddSleep: () => void;
  onMetricPress: (type: "rem" | "core") => void;
}

export function SleepDashboardScreen({
  sleepScore,
  sleepQuality,
  remHours,
  coreHours,
  remProgress,
  coreProgress,
  onBack,
  onSeeAll,
  onAddSleep,
  onMetricPress,
}: SleepDashboardScreenProps): React.ReactElement {
  return (
    <View testID="sleep-dashboard-screen" style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View testID="sleep-hero-section" style={[styles.heroSection, { backgroundColor: palette.onboarding.step5 }]}>
          {/* Decorative Clouds */}
          <View testID="decorative-clouds" style={styles.decorativeClouds}>
            <View style={[styles.cloud, styles.cloudOne]} />
            <View style={[styles.cloud, styles.cloudTwo]} />
            <View style={[styles.cloud, styles.cloudThree]} />
            <View style={[styles.cloud, styles.cloudFour]} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              testID="back-button"
              style={styles.backButton}
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backIcon}>☽</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sleep Quality</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Score Display */}
          <View testID="sleep-score-display" style={styles.scoreDisplay}>
            <Text style={styles.scoreValue}>{sleepScore}</Text>
            <Text style={styles.qualityLabel}>{`You are ${sleepQuality}.`}</Text>
          </View>
        </View>

        {/* FAB overlaps hero/content boundary */}
        <View style={styles.fabContainer}>
          <TouchableOpacity
            testID="add-sleep-button"
            style={styles.fab}
            onPress={onAddSleep}
            accessibilityRole="button"
            accessibilityLabel="Add sleep entry"
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Sleep Overview Section */}
        <View style={styles.overviewSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderText}>Sleep Overview</Text>
            <TouchableOpacity
              testID="see-all-button"
              onPress={onSeeAll}
              accessibilityRole="button"
              accessibilityLabel="See all sleep overview"
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Metric Cards */}
          <View style={styles.metricsRow}>
            {/* REM Card */}
            <TouchableOpacity
              testID="rem-metric-card"
              style={styles.metricCard}
              onPress={() => onMetricPress("rem")}
              accessibilityRole="button"
              accessibilityLabel={`REM sleep: ${remHours} hours`}
            >
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Rem</Text>
                <Text style={styles.metricIcon}>🛏️</Text>
              </View>
              <View testID="rem-progress-ring" style={styles.progressRingContainer}>
                <View style={[styles.progressRingTrack, styles.remRingSize]}>
                  <View
                    style={[
                      styles.progressRingFill,
                      styles.remRingSize,
                      {
                        borderColor: palette.olive[500],
                        borderTopColor: "transparent",
                        transform: [{ rotate: `${remProgress * 360}deg` }],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.metricValue}>{`${remHours}h`}</Text>
              </View>
            </TouchableOpacity>

            {/* Core Card */}
            <TouchableOpacity
              testID="core-metric-card"
              style={styles.metricCard}
              onPress={() => onMetricPress("core")}
              accessibilityRole="button"
              accessibilityLabel={`Core sleep: ${coreHours} hours`}
            >
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Core</Text>
                <Text style={styles.metricIcon}>💤</Text>
              </View>
              <View testID="core-progress-ring" style={styles.progressRingContainer}>
                <View style={[styles.progressRingTrack, styles.coreRingSize]}>
                  <View
                    style={[
                      styles.progressRingFill,
                      styles.coreRingSize,
                      {
                        borderColor: palette.onboarding.step2,
                        borderTopColor: "transparent",
                        transform: [{ rotate: `${coreProgress * 360}deg` }],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.metricValue}>{`${coreHours}h`}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    borderColor: `${palette.white}${palette.alpha[30]}`,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backIcon: {
    color: palette.white,
    fontSize: 20,
  },
  cloud: {
    backgroundColor: `${palette.white}${palette.alpha[10]}`,
    borderRadius: 50,
    position: "absolute",
  },
  cloudFour: {
    borderRadius: 40,
    height: 80,
    left: 20,
    top: 60,
    width: 80,
  },
  cloudOne: {
    height: 100,
    right: -20,
    top: -10,
    width: 100,
  },
  cloudThree: {
    bottom: 20,
    height: 60,
    left: -10,
    width: 60,
  },
  cloudTwo: {
    height: 120,
    right: 40,
    top: 80,
    width: 120,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
  },
  coreRingSize: {
    borderRadius: 40,
    height: 80,
    width: 80,
  },
  decorativeClouds: {
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  fab: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 28,
    elevation: 4,
    height: 56,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: 56,
  },
  fabContainer: {
    alignItems: "center",
    marginTop: -28,
    zIndex: 10,
  },
  fabIcon: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headerSpacer: {
    width: 44,
  },
  headerTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  heroSection: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    paddingBottom: 48,
  },
  metricCard: {
    backgroundColor: palette.brown[800],
    borderColor: palette.brown[700],
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
  },
  metricHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metricIcon: {
    fontSize: 18,
  },
  metricLabel: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "700",
  },
  metricValue: {
    color: palette.white,
    fontSize: 20,
    fontWeight: "700",
    position: "absolute",
  },
  metricsRow: {
    flexDirection: "row",
    marginTop: 16,
    paddingHorizontal: 18,
  },
  overviewSection: {
    paddingTop: 20,
  },
  progressRingContainer: {
    alignItems: "center",
    height: 80,
    justifyContent: "center",
  },
  progressRingFill: {
    borderWidth: 6,
    position: "absolute",
  },
  progressRingTrack: {
    borderColor: `${palette.white}${palette.alpha[15]}`,
    borderWidth: 6,
  },
  qualityLabel: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "500",
    marginTop: 8,
  },
  remRingSize: {
    borderRadius: 40,
    height: 80,
    width: 80,
  },
  scoreDisplay: {
    alignItems: "center",
    marginTop: 32,
    paddingBottom: 16,
  },
  scoreValue: {
    color: palette.white,
    fontSize: 72,
    fontWeight: "800",
  },
  sectionHeaderRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  sectionHeaderText: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "700",
  },
  seeAllText: {
    color: palette.tan[500],
    fontSize: 14,
    fontWeight: "600",
  },
});

export default SleepDashboardScreen;
