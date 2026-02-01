/**
 * SleepSummaryScreen Component
 * @description Post-sleep summary with total hours, multi-ring chart, stage breakdown,
 *   and Got It confirmation button
 * @task Task 3.10.4: Sleep Summary Screen (Screen 94)
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SleepStage {
  type: "rem" | "core" | "post";
  label: string;
  duration: string;
  color: string;
  icon: string;
}

interface SleepSummaryScreenProps {
  totalSleepHours: string;
  stages: SleepStage[];
  onGotIt: () => void;
}

const colors = {
  background: "#1C1410",
  white: "#FFFFFF",
  gotItBg: "#C4A574",
  ringTrackBg: "#2A1F18",
  textSecondary: "rgba(255,255,255,0.6)",
} as const;

const RING_SIZES = [280, 210, 140];

export function SleepSummaryScreen({
  totalSleepHours,
  stages,
  onGotIt,
}: SleepSummaryScreenProps): React.ReactElement {
  return (
    <View testID="sleep-summary-screen" style={styles.container}>
      {/* Title */}
      <View style={styles.titleSection}>
        <Text testID="sleep-summary-title" style={styles.title}>
          You Slept for
        </Text>
        <Text testID="total-sleep-hours" style={styles.totalHours}>
          {totalSleepHours}
        </Text>
      </View>

      {/* Multi-Ring Chart */}
      <View style={styles.chartSection}>
        <View testID="multi-ring-chart" style={styles.chartContainer}>
          {stages.map((stage, index) => {
            const size = RING_SIZES[index] || 100;
            const trackSize = size + 10;
            return (
              <React.Fragment key={stage.type}>
                <View
                  testID={`ring-track-${stage.type}`}
                  style={[
                    styles.ringTrack,
                    {
                      width: trackSize,
                      height: trackSize,
                      borderRadius: trackSize / 2,
                    },
                  ]}
                />
                <View
                  testID={`ring-${stage.type}`}
                  style={[
                    styles.ring,
                    {
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      borderColor: stage.color,
                    },
                  ]}
                >
                  <Text
                    testID={`ring-icon-${stage.type}`}
                    style={[styles.ringIcon, { color: stage.color }]}
                  >
                    {stage.icon}
                  </Text>
                </View>
              </React.Fragment>
            );
          })}
        </View>
      </View>

      {/* Stage Breakdown */}
      <View testID="stage-breakdown" style={styles.stageBreakdown}>
        {stages.map((stage) => (
          <View
            key={stage.type}
            testID={`stage-card-${stage.type}`}
            style={styles.stageCard}
          >
            <Text style={styles.stageLabel}>{stage.label}</Text>
            <Text style={styles.stageDuration}>{stage.duration}</Text>
            <View
              testID={`stage-icon-${stage.type}`}
              style={[styles.stageIconBadge, { backgroundColor: stage.color }]}
            >
              <Text style={styles.stageIconText}>{stage.icon}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Got It Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="got-it-button"
          style={styles.gotItButton}
          onPress={onGotIt}
          accessibilityRole="button"
          accessibilityLabel="Got it, thanks"
          activeOpacity={0.8}
        >
          <Text style={styles.gotItText}>Got It, Thanks! {"\u2192"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    height: 300,
    justifyContent: "center",
    position: "relative",
    width: 300,
  },
  chartSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  footer: {
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  gotItButton: {
    alignItems: "center",
    backgroundColor: colors.gotItBg,
    borderRadius: 28,
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 16,
    width: "100%",
  },
  gotItText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: "700",
  },
  ring: {
    alignItems: "center",
    borderWidth: 6,
    justifyContent: "center",
    position: "absolute",
  },
  ringIcon: {
    fontSize: 16,
    fontWeight: "700",
  },
  ringTrack: {
    backgroundColor: colors.ringTrackBg,
    position: "absolute",
  },
  stageBreakdown: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  stageCard: {
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  stageDuration: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  stageIconBadge: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  stageIconText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  stageLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  titleSection: {
    alignItems: "center",
    paddingTop: 48,
  },
  totalHours: {
    color: colors.white,
    fontSize: 56,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
});

export default SleepSummaryScreen;
